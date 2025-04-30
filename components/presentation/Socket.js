import io from "socket.io-client";
import { getSession } from "next-auth/react";

// Debug flag - set to true to enable detailed logging
const DEBUG = true;

// Debug logging function
const debugLog = (message, data = null) => {
  if (DEBUG) {
    if (data) {
      console.log(`[Socket Debug] ${message}:`, data);
    } else {
      console.log(`[Socket Debug] ${message}`);
    }
  }
};

// Error logging function
const errorLog = (message, error = null) => {
  if (error) {
    console.error(`[Socket Error] ${message}:`, error);
    if (error.stack) {
      console.error(`[Socket Error] Stack trace:`, error.stack);
    }
  } else {
    console.error(`[Socket Error] ${message}`);
  }
};

// Socket singleton class
class SocketService {
  constructor() {
    if (SocketService.instance) {
      return SocketService.instance;
    }

    this.socket = null;
    this.isConnected = false;
    this.connectionAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 5000;
    this.eventHandlers = {};
    this.connectionPromise = null;
    this.authToken = null;
    this.connectionErrors = [];

    debugLog("SocketService instance created");

    SocketService.instance = this;
  }

  // Set authentication token
  setAuthToken(token) {
    if (!token) {
      errorLog("Attempted to set null or undefined auth token");
      return;
    }

    debugLog("Setting auth token", token);
    this.authToken = token;

    // If socket is already connected, disconnect and reconnect with new token
    if (this.socket && this.isConnected) {
      debugLog("Token updated, reconnecting socket with new token");
      this.socket.disconnect();
      setTimeout(() => {
        this.connect();
      }, 1000);
    }
  }

  // Initialize the socket connection
  async initialize() {
    if (this.socket) {
      debugLog("Socket already initialized, returning existing instance");
      return this.socket;
    }

    debugLog("Initializing socket connection");

    // Get the session to access the token
    try {
      debugLog("Fetching session data");
      const session = await getSession();
      debugLog("Session data received", session);

      if (session && session.accessToken) {
        this.authToken = session.accessToken;
        debugLog("Initialized with token from session", this.authToken);
      } else {
        debugLog("No access token found in session");
      }
    } catch (error) {
      errorLog("Error getting session", error);
    }

    // Socket configuration
    const SOCKET_URL = `https://uniridesocket.24livehost.com/connect-socket`;
    // const SOCKET_URL = `https://uniridesocket.24livehost.com`;
    debugLog("Connecting to socket URL", SOCKET_URL);

    try {
      // Create query parameters with token
      const query = this.authToken ? { token: `Bearer ${this.authToken}` } : {};
      
      this.socket = io(SOCKET_URL, {
        withCredentials: true,
        // transports: ["websocket", "polling"],
        transports: ["polling"],
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay,
        timeout: 20000,
        // autoConnect: false,
        autoConnect: true,
        path: "/socket.io",
        // path: "/connect-socket/socket.io",
        rejectUnauthorized: false,
        query: query,
        extraHeaders: this.authToken
          ? {
              authorization: `Bearer ${this.authToken}`,
            }
          : {},
      });
      
      debugLog("Socket instance created with options", {
        transports: this.socket.io.opts.transports,
        path: this.socket.io.opts.path,
        query: this.socket.io.opts.query,
        extraHeaders: this.socket.io.opts.extraHeaders,
      });
      
      // Set up event listeners
      this.setupEventListeners();
      
      // Connect to the socket
      this.connect();
      
      return this.socket;
    } catch (error) {
      errorLog("Error creating socket instance", error);
      throw error;
    }
  }

  // Set up socket event listeners
  setupEventListeners() {
    debugLog("Setting up socket event listeners");

    this.socket.on("connect", () => {
      debugLog("Socket connected successfully", this.socket.id);
      this.isConnected = true;
      this.connectionAttempts = 0;
      this.connectionErrors = [];

      // Resolve the connection promise if it exists
      if (this.connectionPromise) {
        debugLog("Resolving connection promise");
        this.connectionPromise.resolve();
        this.connectionPromise = null;
      }
    });

    this.socket.on("disconnect", (reason) => {
      debugLog("Socket disconnected", reason);
      this.isConnected = false;

      if (reason === "io server disconnect") {
        // Server initiated disconnect, try to reconnect
        debugLog("Server initiated disconnect, attempting to reconnect");
        this.socket.connect();
      }
    });

    this.socket.on("connect_error", (error) => {
      errorLog("Socket connection error", error);
      this.isConnected = false;
      this.connectionErrors.push({
        timestamp: new Date().toISOString(),
        error: error.message || "Unknown error",
      });

      // Reject the connection promise if it exists
      if (this.connectionPromise) {
        debugLog("Rejecting connection promise due to error");
        this.connectionPromise.reject(error);
        this.connectionPromise = null;
      }

      // Attempt to reconnect
      this.retryConnection();
    });

    this.socket.on("error", (error) => {
      errorLog("Socket error", error);

      // Handle authentication errors specifically
      if (error.message && error.message.includes("No token provided")) {
        debugLog("Authentication error detected - token missing");
        // Try to refresh the token or reconnect with a valid token
        this.handleAuthError();
      }
    });


    this.socket.io.on("reconnect_attempt", (attemptNumber) => {
      debugLog(`Reconnection attempt #${attemptNumber}`);
      this.connectionAttempts = attemptNumber;

      // Update query parameters with token on reconnection attempt
      if (this.authToken) {
        debugLog("Updating query parameters for reconnection");
        this.socket.io.opts.query = { token: `Bearer ${this.authToken}` };
        this.socket.io.opts.extraHeaders = {
          authorization: `Bearer ${this.authToken}`,
        };
      }
    });

    this.socket.io.on("reconnect_failed", () => {
      errorLog("Failed to reconnect after maximum attempts");
    });

    this.socket.io.on("reconnect", (attemptNumber) => {
      debugLog(`Reconnected after ${attemptNumber} attempts`);
    });

    this.socket.io.on("reconnect_error", (error) => {
      errorLog("Reconnection error", error);
    });

    this.socket.io.on("ping", () => {
      debugLog("Ping sent to server");
    });

    this.socket.io.on("pong", (latency) => {
      debugLog(`Pong received from server, latency: ${latency}ms`);
    });
  }

  // Handle authentication errors
  async handleAuthError() {
    debugLog("Handling authentication error");

    try {
      // Try to get a fresh session
      const session = await getSession();

      if (session && session.accessToken) {
        debugLog("Retrieved fresh token from session");
        this.setAuthToken(session.accessToken);

        // If socket is connected, disconnect and reconnect to apply new token
        if (this.isConnected) {
          debugLog("Disconnecting to apply new token");
          this.socket.disconnect();
          setTimeout(() => {
            debugLog("Reconnecting with new token");
            this.socket.connect();
          }, 1000);
        }
      } else {
        errorLog("Could not retrieve fresh token from session");
      }
    } catch (error) {
      errorLog("Error handling authentication error", error);
    }
  }

  // Connect to the socket
  connect() {
    if (!this.socket) {
      debugLog("Socket not initialized, initializing now");
      this.initialize();
    }

    if (!this.isConnected) {
      debugLog("Connecting to socket server");
      try {
        this.socket.connect();
      } catch (error) {
        errorLog("Error connecting to socket", error);
      }
    } else {
      debugLog("Socket already connected");
    }

    return this.socket;
  }

  // Retry connection with exponential backoff
  retryConnection() {
    if (this.connectionAttempts >= this.maxReconnectAttempts) {
      errorLog("Maximum reconnection attempts reached");
      return;
    }

    const delay = this.reconnectDelay * Math.pow(2, this.connectionAttempts);
    debugLog(`Retrying connection in ${delay}ms...`);

    setTimeout(() => {
      this.connectionAttempts++;
      this.connect();
    }, delay);
  }

  // Get a promise that resolves when the socket is connected
  getConnectionPromise() {
    if (this.isConnected) {
      debugLog("Socket already connected, resolving promise immediately");
      return Promise.resolve(this.socket);
    }

    if (!this.connectionPromise) {
      debugLog("Creating new connection promise");
      this.connectionPromise = {};
      this.connectionPromise.promise = new Promise((resolve, reject) => {
        this.connectionPromise.resolve = resolve;
        this.connectionPromise.reject = reject;
      });
    }

    return this.connectionPromise.promise;
  }

  // Emit an event with data
  emit(event, data) {
    // Add authorization token to all events if available
    const eventData = this.authToken
      ? { ...data, token: this.authToken }
      : data;

    debugLog(`Emitting event: ${event}`, eventData);

    if (!this.isConnected) {
      debugLog(`Socket not connected. Queuing event: ${event}`);
      this.getConnectionPromise()
        .then(() => {
          debugLog(`Socket connected, sending queued event: ${event}`);
          this.socket.emit(event, eventData);
        })
        .catch((error) => {
          errorLog(`Failed to emit event ${event}`, error);
        });
    } else {
      try {
        this.socket.emit(event, eventData);
      } catch (error) {
        errorLog(`Error emitting event ${event}`, error);
      }
    }
  }

  // Register an event handler
  on(event, handler) {
    debugLog(`Registering handler for event: ${event}`);

    if (!this.eventHandlers[event]) {
      this.eventHandlers[event] = [];
    }

    this.eventHandlers[event].push(handler);

    try {
      this.socket.on(event, handler);
    } catch (error) {
      errorLog(`Error registering handler for event ${event}`, error);
    }

    return () => this.off(event, handler);
  }

  // Remove an event handler
  off(event, handler) {
    debugLog(`Removing handler for event: ${event}`);

    if (!this.eventHandlers[event]) {
      debugLog(`No handlers registered for event: ${event}`);
      return;
    }

    const index = this.eventHandlers[event].indexOf(handler);
    if (index !== -1) {
      this.eventHandlers[event].splice(index, 1);
    }

    try {
      this.socket.off(event, handler);
    } catch (error) {
      errorLog(`Error removing handler for event ${event}`, error);
    }
  }

  // Remove all event handlers
  removeAllListeners(event) {
    debugLog(`Removing all handlers for event: ${event}`);

    if (this.eventHandlers[event]) {
      this.eventHandlers[event].forEach((handler) => {
        try {
          this.socket.off(event, handler);
        } catch (error) {
          errorLog(`Error removing handler for event ${event}`, error);
        }
      });
      this.eventHandlers[event] = [];
    }
  }

  // Disconnect the socket
  disconnect() {
    debugLog("Disconnecting socket");

    if (this.socket) {
      try {
        this.socket.disconnect();
        this.isConnected = false;
      } catch (error) {
        errorLog("Error disconnecting socket", error);
      }
    }
  }

  // Get connection status
  getConnectionStatus() {
    return {
      connected: this.isConnected,
      connectionAttempts: this.connectionAttempts,
      connectionErrors: this.connectionErrors,
      socketId: this.socket ? this.socket.id : null,
      authToken: this.authToken ? "***" : null,
    };
  }
}

// Create a singleton instance
const socketService = new SocketService();

// Initialize the socket
const socket = socketService.initialize();

// Socket events
const socketEvents = {
  // Request events
  SAVE_SOCKET_INFO: "saveSocketInfo",
  GET_DRIVER_LOCATION: "getDriverLocation",
  REQUEST_RIDE_COMPLETENESS: "requestRideCompleteness",
  REQUEST_SCHEDULE_RIDE_DETAILS: "requestScheduleRideDetails",
  REQUEST_CAR_AVAILABILITY: "requestCarAvailability",
  REQUEST_BOOKING: "sendBookingRequest",
  CANCEL_RIDE: "cancel_ride",
  CHANGE_REQUEST_STATUS: "changeRequestStatus",
  DRIVER_ACCEPTED: "driverAccepted",
  DRIVER_REJECTED: "driverRejected",

  // Response events
  SOCKET_SAVED: "socketSaved",
  CAR_LOCATIONS: "carLocations",
  RIDE_COMPLETENESS_RESPONSE: "rideCompletenessResponse",
  SCHEDULE_RIDE_DETAILS_RESPONSE: "scheduleRideDetailsResponse",
  CAR_AVAILABILITY_RESPONSE: "carAvailabilityResponse",
  REQUEST_SENT: "requestSent",
  SCHEDULE_REQUEST_SENT: "scheduleRequestSent",
  NO_DRIVER_FOUND: "noDriverFound",
  ERROR: "error",
  NEW_RIDE_REQUEST: "newRideRequest",
  REQUEST_TIMEOUT: "requestTimeOut",
};

// Socket helper functions
const socketHelpers = {
  // Request ride completeness
  requestRideCompleteness: (customerId, tokenCode) => {
    debugLog("Requesting ride completeness", { customerId, tokenCode });
    
    return new Promise((resolve, reject) => {
      let resolved = false;
      const timeoutId = setTimeout(() => {
        if (!resolved) {
          debugLog("Ride completeness request timed out");
          socketService.off(socketEvents.RIDE_COMPLETENESS_RESPONSE, handler);
          reject(new Error("Request timed out"));
        }
      }, 10000);
      
      const handler = (response) => {
        debugLog("Received ride completeness response", response);
        if (!resolved) {
          resolved = true;
          clearTimeout(timeoutId);
          resolve(response);
        }
      };
      
      socketService.on(socketEvents.RIDE_COMPLETENESS_RESPONSE, handler);
      socketService.emit(socketEvents.REQUEST_RIDE_COMPLETENESS, { 
        customer_id: customerId, 
        token_code: tokenCode,
        // authorization token will be added automatically by the emit method
      });
    });
  },

  requestSendBooking: (payload) => {
    debugLog("Requesting booking", payload);
    
    return new Promise((resolve, reject) => {
      let resolved = false;
      
      // Set up handlers for different response events
      const requestSentHandler = (response) => {
        debugLog("Request sent successfully", response);
        if (!resolved) {
          resolved = true;
          resolve(response);
        }
      };
      
      const scheduleRequestSentHandler = (response) => {
        debugLog("Schedule request sent successfully", response);
        if (!resolved) {
          resolved = true;
          resolve(response);
        }
      };
      
      // const noDriverFoundHandler = (response) => {
      //   debugLog("No driver found", response);
      //   if (!resolved) {
      //     resolved = true;
      //     reject(new Error("No driver found"));
      //   }
      // };
      
      const errorHandler = (error) => {
        debugLog("Error in booking request", error);
        if (!resolved) {
          resolved = true;
          reject(error);
        }
      };
      
      // // Register all event handlers
       socketService.on(socketEvents.REQUEST_SENT, requestSentHandler);
      socketService.on(socketEvents.SCHEDULE_REQUEST_SENT, scheduleRequestSentHandler);
      // socketService.on(socketEvents.NO_DRIVER_FOUND, noDriverFoundHandler);
      socketService.on(socketEvents.ERROR, errorHandler);
      
      // // Set a timeout for the request
      const timeoutId = setTimeout(() => {
        if (!resolved) {
          debugLog("Booking request timed out");
          // Clean up event listeners
          socketService.off(socketEvents.REQUEST_SENT, requestSentHandler);
          socketService.off(socketEvents.SCHEDULE_REQUEST_SENT, scheduleRequestSentHandler);
          // socketService.off(socketEvents.NO_DRIVER_FOUND, noDriverFoundHandler);
          socketService.off(socketEvents.ERROR, errorHandler);
          reject(new Error("Request timed out"));
        }
      }, 30000); // 30 seconds timeout to match server timeout
      
      // Emit the booking request
      socketService.emit(socketEvents.REQUEST_BOOKING, payload);
      
      // Clean up function to be called when the promise is resolved or rejected
      // const cleanup = () => {
      //   clearTimeout(timeoutId);
      //   socketService.off(socketEvents.REQUEST_SENT, requestSentHandler);
      //   socketService.off(socketEvents.SCHEDULE_REQUEST_SENT, scheduleRequestSentHandler);
      //   socketService.off(socketEvents.NO_DRIVER_FOUND, noDriverFoundHandler);
      //   socketService.off(socketEvents.ERROR, errorHandler);
      // };
      
      // // Add cleanup to both resolve and reject
      // const originalResolve = resolve;
      // resolve = (value) => {
      //   cleanup();
      //   originalResolve(value);
      // };
      
      // const originalReject = reject;
      // reject = (reason) => {
      //   cleanup();
      //   originalReject(reason);
      // };
    });
  },
  
  // Request schedule ride details
  requestScheduleRideDetails: (customerId, tokenCode) => {
    debugLog("Requesting schedule ride details", { customerId, tokenCode });
    
    return new Promise((resolve, reject) => {
      let resolved = false;
      const timeoutId = setTimeout(() => {
        if (!resolved) {
          debugLog("Schedule ride details request timed out");
          socketService.off(socketEvents.SCHEDULE_RIDE_DETAILS_RESPONSE, handler);
          reject(new Error("Request timed out"));
        }
      }, 10000);
      
      const handler = (response) => {
        debugLog("Received schedule ride details response", response);
        if (!resolved) {
          resolved = true;
          clearTimeout(timeoutId);
          resolve(response);
        }
      };
      
      socketService.on(socketEvents.SCHEDULE_RIDE_DETAILS_RESPONSE, handler);
      socketService.emit(socketEvents.REQUEST_SCHEDULE_RIDE_DETAILS, { 
        customer_id: customerId, 
        token_code: tokenCode,
        // authorization token will be added automatically by the emit method
      });
    });
  },
  
  // Request car availability
  requestCarAvailability: (data) => {
    debugLog("Requesting car availability", data);
    
    return new Promise((resolve, reject) => {
      let resolved = false;
      const timeoutId = setTimeout(() => {
        if (!resolved) {
          debugLog("Car availability request timed out");
          socketService.off(socketEvents.CAR_AVAILABILITY_RESPONSE, handler);
          reject(new Error("Request timed out"));
        }
      }, 10000);
      
      const handler = (response) => {
        debugLog("Received car availability response", response);
        if (!resolved) {
          resolved = true;
          clearTimeout(timeoutId);
          resolve(response);
        }
      };
      
      socketService.on(socketEvents.CAR_AVAILABILITY_RESPONSE, handler);
      socketService.emit(socketEvents.REQUEST_CAR_AVAILABILITY, data);
      // authorization token will be added automatically by the emit method
    });
  },

  // Save socket info
  saveSocketInfo: (data) => {
    debugLog("Saving socket info", data);
    
    return new Promise((resolve, reject) => {
      let resolved = false;
      const timeoutId = setTimeout(() => {
        if (!resolved) {
          debugLog("Save socket info request timed out");
          socketService.off(socketEvents.SOCKET_SAVED, handler);
          reject(new Error("Request timed out"));
        }
      }, 10000);
      
      const handler = (response) => {
        debugLog("Received socket saved response", response);
        if (!resolved) {
          resolved = true;
          clearTimeout(timeoutId);
          resolve(response);
        }
      };
      
      socketService.on(socketEvents.SOCKET_SAVED, handler);
      socketService.emit(socketEvents.SAVE_SOCKET_INFO, data);
      // authorization token will be added automatically by the emit method
    });
  },

  // Get driver location
  getDriverLocation: (data) => {
    debugLog("Getting driver location", data);
    socketService.emit(socketEvents.GET_DRIVER_LOCATION, data);
    // authorization token will be added automatically by the emit method
  },

  // Cancel ride
  cancel_ride: (data) => {
    debugLog("Canceling ride", data);
    socketService.emit("cancel_ride", data);
    // authorization token will be added automatically by the emit method
  },

  // Get connection status
  getConnectionStatus: () => {
    return socketService.getConnectionStatus();
  },
  
  // Handle driver's response to a ride request
  changeRequestStatus: (requestId, status) => {
    debugLog("Changing request status", { requestId, status });
    socketService.emit(socketEvents.CHANGE_REQUEST_STATUS, { 
      request_id: requestId, 
      status: status 
    });
  },
  
  // Listen for new ride requests (for drivers)
  onNewRideRequest: (handler) => {
    debugLog("Registering handler for new ride requests");
    return socketService.on(socketEvents.NEW_RIDE_REQUEST, handler);
  },
  
  // Listen for request timeout (for drivers)
  onRequestTimeout: (handler) => {
    debugLog("Registering handler for request timeout");
    return socketService.on(socketEvents.REQUEST_TIMEOUT, handler);
  },
  
  // Listen for driver accepted (for customers)
  onDriverAccepted: (handler) => {
    debugLog("Registering handler for driver accepted");
    return socketService.on(socketEvents.DRIVER_ACCEPTED, handler);
  },
  
  // Listen for driver rejected (for customers)
  onDriverRejected: (handler) => {
    debugLog("Registering handler for driver rejected");
    return socketService.on(socketEvents.DRIVER_REJECTED, handler);
  },
};

export { socketService, socketEvents, socketHelpers };
export default socket;
