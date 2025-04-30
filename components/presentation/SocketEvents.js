import io from 'socket.io-client';
import { useSession } from 'next-auth/react';

// Debug flag - set to true to enable detailed logging
const DEBUG = true;

// Debug logging function
const debugLog = (message, data = null) => {
  if (DEBUG) {
    if (data) {
      console.log(`[SocketEvents Debug] ${message}:`, data);
    } else {
      console.log(`[SocketEvents Debug] ${message}`);
    }
  }
};

// Error logging function
const errorLog = (message, error = null) => {
  if (error) {
    console.error(`[SocketEvents Error] ${message}:`, error);
    if (error.stack) {
      console.error(`[SocketEvents Error] Stack trace:`, error.stack);
    }
  } else {
    console.error(`[SocketEvents Error] ${message}`);
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
    this.authToken = null;
    this.isInitializing = false;
    this.connectionPromise = null;
    debugLog('SocketService instance created');
    SocketService.instance = this;
  }

  // Set authentication token
  setAuthToken(token) {
    if (!token) {
      errorLog('Attempted to set null or undefined auth token');
      return;
    }
    debugLog('Setting auth token', token);
    this.authToken = token;

    // If socket is already connected, disconnect and reconnect with new token
    if (this.socket && this.isConnected) {
      debugLog('Token updated, reconnecting socket with new token');
      this.socket.disconnect();
      setTimeout(() => {
        this.connect();
      }, 1000);
    }
  }

  // Initialize the socket connection
  async initialize() {
    // If already initialized, return the existing socket
    if (this.socket) {
      debugLog('Socket already initialized, returning existing instance');
      return this.socket;
    }

    // If already initializing, wait for the initialization to complete
    if (this.isInitializing) {
      debugLog('Socket initialization already in progress, waiting for completion');
      // Wait for a short time and check again
      await new Promise(resolve => setTimeout(resolve, 100));
      return this.initialize();
    }

    this.isInitializing = true;
    debugLog('Initializing socket connection');

    // Get the session to access the token
    try {
      debugLog('Fetching session data');
      // Note: useSession is a React hook and can only be used in React components
      // For this service class, we'll need to pass the session data from the component
      // that uses this service
      if (this.authToken) {
        debugLog('Using provided auth token', this.authToken);
      } else {
        debugLog('No auth token available');
      }
    } catch (error) {
      errorLog('Error getting session', error);
      this.isInitializing = false;
      throw error;
    }

    // Socket configuration
    const SOCKET_URL = `https://uniridesocket.24livehost.com`;
    debugLog('Connecting to socket URL', SOCKET_URL);
    try {
      // Create query parameters with token
      const query = this.authToken
        ? {
            token: `Bearer ${this.authToken}`,
          }
        : {};

      // this.socket = io(SOCKET_URL, {
      //   auth: {
      //     token: `${this.authToken}`,
      //   },
      //   autoConnect: false,
      //   path: '/connect-socket/socket.io',
      //   //query: query,
      //   reconnection: true,
      //   reconnectionAttempts: this.maxReconnectAttempts,
      //   reconnectionDelay: this.reconnectDelay,
      //   timeout: 20000,
      //   transports: ['websocket', 'polling'],
      // });

      this.socket = io('https://uniridesocket.24livehost.com/connect-socket', {
        path: '/socket.io',
        query: query,
        transports: ['polling'],
      });

      // Set up event listeners
      this.setupEventListeners();

      // Don't call connect() here to avoid circular dependency
      // The caller should call connect() after initialize() if needed
      this.isInitializing = false;
      return this.socket;
    } catch (error) {
      errorLog('Error creating socket instance', error);
      this.isInitializing = false;
      throw error;
    }
  }

  // Set up socket event listeners
  setupEventListeners() {
    debugLog('Setting up socket event listeners');
    this.socket.on('connect', () => {
      debugLog('Socket connected successfully', this.socket.id);
      this.isConnected = true;
      this.connectionAttempts = 0;
    });

    this.socket.on('disconnect', reason => {
      debugLog('Socket disconnected', reason);
      this.isConnected = false;
      if (reason === 'io server disconnect') {
        // Server initiated disconnect, try to reconnect
        debugLog('Server initiated disconnect, attempting to reconnect');
        this.socket.connect();
      }
    });

    this.socket.on('connect_error', error => {
      errorLog('Socket connection error', error);
      this.isConnected = false;
      this.retryConnection();
    });

    this.socket.on('error', error => {
      errorLog('Socket error', error);
    });
  }

  // Connect to the socket
  connect() {
    // If already connected, return the existing socket
    if (this.isConnected && this.socket) {
      debugLog('Socket already connected, returning existing socket');
      return this.socket;
    }

    // If already connecting, return the promise
    if (this.connectionPromise) {
      debugLog('Socket connection already in progress, returning existing promise');
      return this.connectionPromise;
    }

    // If socket doesn't exist, create a basic connection
    if (!this.socket) {
      debugLog('Socket not initialized, creating basic connection');
      // Don't call initialize() here as it would create a circular dependency
      // Instead, create a basic socket connection
      const SOCKET_URL = `https://localhost:5103`;
      debugLog('Creating basic socket connection to', SOCKET_URL);

      const query = this.authToken
        ? {
            token: `Bearer ${this.authToken}`,
          }
        : {};

      try {
        this.socket = io('https://uniridesocket.24livehost.com/connect-socket', {
          path: '/socket.io',
          query: query,
          transports: ['polling'],
        });

        // Set up event listeners
        this.setupEventListeners();
      } catch (error) {
        errorLog('Error creating basic socket connection', error);
        return null;
      }
    }

    // Connect to the socket if not already connected
    if (!this.isConnected && this.socket) {
      debugLog('Connecting to socket server');
      try {
        // Create a promise to track the connection
        this.connectionPromise = new Promise((resolve, reject) => {
          // Set up a one-time connect handler
          const connectHandler = () => {
            this.isConnected = true;
            this.connectionAttempts = 0;
            this.socket.off('connect', connectHandler);
            this.socket.off('connect_error', errorHandler);
            this.connectionPromise = null;
            resolve(this.socket);
          };

          // Set up a one-time error handler
          const errorHandler = error => {
            this.socket.off('connect', connectHandler);
            this.socket.off('connect_error', errorHandler);
            this.connectionPromise = null;
            reject(error);
          };

          // Add the handlers
          this.socket.once('connect', connectHandler);
          this.socket.once('connect_error', errorHandler);

          // Connect the socket
          this.socket.connect();
        });

        return this.connectionPromise;
      } catch (error) {
        errorLog('Error connecting to socket', error);
        this.connectionPromise = null;
        return null;
      }
    } else {
      debugLog('Socket already connected');
      return this.socket;
    }
  }

  // Retry connection with exponential backoff
  retryConnection() {
    if (this.connectionAttempts >= this.maxReconnectAttempts) {
      errorLog('Maximum reconnection attempts reached');
      return;
    }
    const delay = this.reconnectDelay * Math.pow(2, this.connectionAttempts);
    debugLog(`Retrying connection in ${delay}ms...`);
    setTimeout(() => {
      this.connectionAttempts++;
      this.connect();
    }, delay);
  }

  // Emit an event with data
  emit(event, data) {
    // Add authorization token to all events if available
    const eventData = this.authToken
      ? {
          ...data,
          token: this.authToken,
        }
      : data;
    debugLog(`Emitting event: ${event}`, eventData);

    if (!this.isConnected) {
      debugLog(`Socket not connected. Attempting to connect before emitting: ${event}`);
      this.connect();
    }

    try {
      this.socket.emit(event, eventData);
    } catch (error) {
      errorLog(`Error emitting event ${event}`, error);
    }
  }

  // Register an event handler
  on(event, handler) {
    debugLog(`Registering handler for event: ${event}`);
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
    try {
      this.socket.off(event, handler);
    } catch (error) {
      errorLog(`Error removing handler for event ${event}`, error);
    }
  }

  // Remove all event handlers
  removeAllListeners(event) {
    debugLog(`Removing all handlers for event: ${event}`);
    try {
      this.socket.removeAllListeners(event);
    } catch (error) {
      errorLog(`Error removing all listeners for event ${event}`, error);
    }
  }

  // Disconnect the socket
  disconnect() {
    debugLog('Disconnecting socket');
    if (this.socket) {
      try {
        this.socket.disconnect();
        this.isConnected = false;
        this.connectionPromise = null;
      } catch (error) {
        errorLog('Error disconnecting socket', error);
      }
    }
  }
}

// Create a singleton instance
const socketService = new SocketService();

// Socket events
const socketEvents = {
  CANCEL_RIDE: 'cancel_ride',
  CAR_AVAILABILITY_RESPONSE: 'carAvailabilityResponse',
  CAR_LOCATIONS: 'carLocations',
  CHANGE_REQUEST_STATUS: 'changeRequestStatus',
  DRIVER_ACCEPTED: 'driverAccepted',
  DRIVER_REJECTED: 'driverRejected',
  ERROR: 'error',
  GET_DRIVER_LOCATION: 'getDriverLocation',
  NEW_RIDE_REQUEST: 'newRideRequest',
  NO_DRIVER_FOUND: 'noDriverFound',
  REQUEST_BOOKING: 'sendBookingRequest',
  REQUEST_CAR_AVAILABILITY: 'requestCarAvailability',
  REQUEST_RIDE_COMPLETENESS: 'requestRideCompleteness',
  REQUEST_SCHEDULE_RIDE_DETAILS: 'requestScheduleRideDetails',
  REQUEST_SENT: 'requestSent',
  REQUEST_STATUS_CHANGED: 'requestStatusChanged',
  REQUEST_TIMEOUT: 'requestTimeOut',
  RIDE_COMPLETENESS_RESPONSE: 'rideCompletenessResponse',
  SAVE_SOCKET_INFO: 'saveSocketInfo',
  SCHEDULE_REQUEST_SENT: 'scheduleRequestSent',
  SCHEDULE_RIDE_DETAILS_RESPONSE: 'scheduleRideDetailsResponse',
  SOCKET_SAVED: 'socketSaved',
};

// Basic socket helper functions
const socketHelpers = {
  // Cancel ride
  cancelRide: data => {
    debugLog('Canceling ride', data);
    socketService.emit(socketEvents.CANCEL_RIDE, data);
  },

  // Get driver location
  getDriverLocation: data => {
    debugLog('Getting driver location', data);
    socketService.emit(socketEvents.GET_DRIVER_LOCATION, data);
  },

  // Listen for car locations
  onCarLocations: handler => {
    debugLog('Registering handler for car locations');
    return socketService.on(socketEvents.CAR_LOCATIONS, handler);
  },

  onChangeRequestStatus: handler => {
    debugLog('Registering handler for change request status');
    return socketService.on(socketEvents.CHANGE_REQUEST_STATUS, handler);
  },

  // Listen for driver accepted
  onDriverAccepted: handler => {
    debugLog('Registering handler for driver accepted');
    return socketService.on(socketEvents.DRIVER_ACCEPTED, handler);
  },

  // Listen for driver rejected
  onDriverRejected: handler => {
    debugLog('Registering handler for driver rejected');
    return socketService.on(socketEvents.DRIVER_REJECTED, handler);
  },

  // Listen for error
  onError: handler => {
    debugLog('Registering handler for error');
    return socketService.on(socketEvents.ERROR, handler);
  },

  // Listen for no driver found
  onNoDriverFound: handler => {
    debugLog('Registering handler for no driver found');
    return socketService.on(socketEvents.NO_DRIVER_FOUND, handler);
  },

  // Listen for request sent
  onRequestSent: handler => {
    debugLog('Registering handler for request sent');
    return socketService.on(socketEvents.REQUEST_SENT, handler);
  },

  // Listen for schedule request sent
  onScheduleRequestSent: handler => {
    debugLog('Registering handler for schedule request sent');
    return socketService.on(socketEvents.SCHEDULE_REQUEST_SENT, handler);
  },

  // Listen for socket saved
  onSocketSaved: handler => {
    debugLog('Registering handler for socket saved');
    return socketService.on(socketEvents.SOCKET_SAVED, handler);
  },

  // Request booking with response handling
  requestBookingWithResponse: payload => {
    debugLog('Requesting booking with response handling', payload);
    return new Promise((resolve, reject) => {
      let resolved = false;
      const timeoutId = setTimeout(() => {
        if (!resolved) {
          debugLog('Booking request timed out');
          socketService.off(socketEvents.REQUEST_SENT, requestSentHandler);
          reject(new Error('Request timed out'));
        }
      }, 30000); // 30 seconds timeout

      const requestSentHandler = response => {
        debugLog('Request sent successfully', response);
        if (!resolved) {
          resolved = true;
          clearTimeout(timeoutId);
          resolve(response);
        }
      };

      socketService.on(socketEvents.REQUEST_SENT, requestSentHandler);
      socketService.emit(socketEvents.REQUEST_BOOKING, payload);
    });
  },

  // Request booking
  requestSendBooking: payload => {
    debugLog('Requesting booking', payload);
    socketService.emit(socketEvents.REQUEST_BOOKING, payload);
  },

  // Save socket info
  saveSocketInfo: data => {
    debugLog('Saving socket info', data);
    socketService.emit(socketEvents.SAVE_SOCKET_INFO, data);
  },
};

export { socketEvents, socketHelpers, socketService };
export default socketService;
