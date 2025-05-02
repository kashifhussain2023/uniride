import io from 'socket.io-client';
import { toast } from 'react-toastify';
import { signOut } from 'next-auth/react';
import { getSession } from 'next-auth/react';
import { api } from '@/utils/api/register';

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

// Socket connection state tracking
let isSocketConnected = false;
let isSocketConnecting = false;
let socketConnectionPromise = null;
let isBookingInProgress = false;
let customerRideType = 'regular';

// Check if socket is ready
const isSocketReady = () => {
  return isSocketConnected;
};

// Socket event handlers registry
console.log('socketEvents', socketEvents);

const eventHandlers = {
  [socketEvents['REQUEST_STATUS_CHANGED']]: [],
  [socketEvents['DRIVER_ACCEPTED']]: [],
  [socketEvents['REQUEST_SENT']]: [],
  [socketEvents['CAR_LOCATIONS']]: [],
  [socketEvents['NO_DRIVER_FOUND']]: [],
  [socketEvents['REQUEST_TIMEOUT']]: [],
  [socketEvents['DRIVER_REJECTED']]: [],
  [socketEvents['ERROR']]: [],
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

    // Socket configuration
    debugLog('Connecting to socket URL', 'https://pattisonedutechstore.24livehost.com/');
    try {
      // Create query parameters with token
      const query = this.authToken
        ? {
            token: `Bearer ${this.authToken}`,
          }
        : {};

      this.socket = io('https://pattisonedutechstore.24livehost.com', {
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
        this.socket = io('https://pattisonedutechstore.24livehost.com/connect-socket', {
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
          token: `Bearer ${this.authToken}`,
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
      if (!this.socket) {
        // Store handler for later registration when socket is initialized
        if (!eventHandlers[event]) {
          eventHandlers[event] = [];
        }
        eventHandlers[event].push(handler);
        debugLog(`Handler stored for ${event}, will be registered when socket is initialized`);
        return () => {
          const index = eventHandlers[event].indexOf(handler);
          if (index > -1) {
            eventHandlers[event].splice(index, 1);
          }
        };
      }

      this.socket.on(event, handler);
      return () => this.off(event, handler);
    } catch (error) {
      errorLog(`Error registering handler for event ${event}`, error);
      return () => {};
    }
  }

  // Remove an event handler
  off(event, handler) {
    debugLog(`Removing handler for event: ${event}`);
    try {
      if (!this.socket) {
        // Remove handler from stored handlers
        if (eventHandlers[event]) {
          const index = eventHandlers[event].indexOf(handler);
          if (index > -1) {
            eventHandlers[event].splice(index, 1);
          }
        }
        return;
      }
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

  // Set up socket event listeners
  async setupSocketEventListeners(setStateFunctions) {
    debugLog('Setting up socket event listeners');

    try {
      const {
        setAcceptDriverDetail,
        setBookingRequestId,
        setComfirmBooking,
        setDriverId,
        setInRRoute,
        setIsBookingInProgress,
        setRideStatus,
        setSelectRide,
      } = setStateFunctions;

      // Set up request status changed handler
      const requestStatusHandler = data => {
        //debugLog('Request status changed:', data);

        console.log('Request status changed:', data);

        if (data) {
          setRideStatus(data.status);
          if (data.status === true) {
            // Driver accepted
            setSelectRide(false);
            setComfirmBooking(false);
            setInRRoute(true);
            setAcceptDriverDetail(data);
            // setDriverId(data.data.driver_info.driver_id);
          }
        }
      };

      // Set up driver accepted handler
      const driverAcceptedHandler = data => {
        debugLog('Driver accepted:', data);
        if (data) {
          setSelectRide(false);
          setComfirmBooking(false);
          setInRRoute(true);
          setAcceptDriverDetail(data);
          setDriverId(data.driver_id);
          setIsBookingInProgress(false);
        }
      };

      // Set up request sent handler
      const requestSentHandler = data => {
        debugLog('Request sent:', data);
        if (data) {
          setBookingRequestId(data.id);
          setIsBookingInProgress(false);
        }
      };

      // Register event handlers
      const cleanupRequestStatus = this.on(
        socketEvents.REQUEST_STATUS_CHANGED,
        requestStatusHandler
      );
      const cleanupDriverAccepted = this.on(socketEvents.DRIVER_ACCEPTED, driverAcceptedHandler);
      const cleanupRequestSent = this.on(socketEvents.REQUEST_SENT, requestSentHandler);

      // Return cleanup function
      return () => {
        cleanupRequestStatus();
        cleanupDriverAccepted();
        cleanupRequestSent();
      };
    } catch (error) {
      errorLog('Error setting up socket event listeners:', error);
      return () => {};
    }
  }

  // Request a ride
  async requestRide(bookingPayload) {
    debugLog('Requesting ride', bookingPayload);

    if (isBookingInProgress) {
      toast.info('A booking request is already in progress');
      return;
    }

    try {
      isBookingInProgress = true;
      // Set up a cleanup timeout
      const cleanupTimeout = setTimeout(() => {
        if (isBookingInProgress) {
          isBookingInProgress = false;
          toast.error('Booking request timed out. Please try again.');
        }
      }, 60000); // 1 minute timeout

      // Emit the booking request
      this.emit(socketEvents.REQUEST_BOOKING, bookingPayload)
        .then(response => {
          debugLog('Booking request sent', response);
          clearTimeout(cleanupTimeout);
        })
        .catch(error => {
          debugLog('Error sending booking request', error);
          clearTimeout(cleanupTimeout);
          toast.error('Failed to send booking request. Please try again.');
          isBookingInProgress = false;
        });
    } catch (error) {
      errorLog('Error in requestRide', error);
      toast.error('An error occurred while requesting a driver. Please try again.');
      isBookingInProgress = false;
    }
  }

  // Cancel a ride
  async cancelRide(rideData, router) {
    debugLog('Canceling ride', rideData);

    try {
      const session = await getSession();
      if (!session) {
        toast.error('Please login to continue');
        router.push('/login');
        return;
      }

      const cancelPayload = {
        auth_token: session.token_code,
        customer_id: session.customer_id,
        request_id: rideData.request_id,
        ride_id: rideData.ride_id,
        token_code: session.token_code,
        user_type: 'customer',
      };

      // Emit the cancel ride event
      this.emit(socketEvents.CANCEL_RIDE, cancelPayload)
        .then(() => {
          toast.success('Ride cancellation request sent');
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        })
        .catch(error => {
          debugLog('Error canceling ride', error);
          toast.error('Failed to cancel ride. Please try again.');
        });
    } catch (error) {
      errorLog('Error in cancelRide', error);
      toast.error('An error occurred while canceling your ride. Please try again.');
    }
  }

  // Get driver location
  getDriverLocation(data) {
    debugLog('Getting driver location', data);
    this.emit(socketEvents.GET_DRIVER_LOCATION, data);
  }

  // Set customer ride type
  setCustomerRideType(type) {
    debugLog('Setting customer ride type', type);
    customerRideType = type;
  }

  // Get customer ride type
  getCustomerRideType() {
    return customerRideType;
  }
}

// Create a singleton instance
const socketService = new SocketService();

// Socket events

// Basic socket helper functions
const socketHelpers = {
  // Apply coupon
  async applyCoupon(couponCode, userAuth) {
    try {
      const formData = new FormData();
      formData.append('promo_code', couponCode);
      formData.append('customer_id', userAuth.customer_id);
      formData.append('token_code', userAuth.token_code);

      const response = await api({
        data: formData,
        method: 'POST',
        url: '/customers/apply_coupon',
      });
      if (response.status === true) {
        toast.success(response.message);
      } else {
        toast.error(response.message || 'Failed to apply coupon');
      }
    } catch (error) {
      errorLog('Error applying coupon', error);
      toast.error('An error occurred while applying the coupon. Please try again.');
    }
  },

  // Cancel ride
  cancelRide: params => {
    debugLog('Canceling ride', params);
    socketService.emit(socketEvents.CANCEL_RIDE, params);
  },

  // Get all cars list
  async getAllCarsList(location, { setCarStatus, setCarsList, setLoading }) {
    try {
      const response = await api({
        headers: {
          'x-login-method': `jwt`,
        },
        method: 'GET',
        url: '/customer/car-types',
      });
      if (response.status === true) {
        setCarsList(response.data);
        setCarStatus(true);
      }
    } catch (error) {
      errorLog('Error getting cars list', error);
      toast.error('Failed to get available cars. Please try again.');
    } finally {
      setLoading(false);
    }
  },

  // Get current ride status
  async getCurrentRideStatus(
    userAuth,
    {
      _setDriverId,
      setAcceptDriverDetail,
      setComfirmBooking,
      setCurrentLocation,
      setDriverLocation,
      setDropLocation,
      setInRRoute,
      setLoading,
      setRideStatus,
      setSelectRide,
      setShowReview,
    }
  ) {
    try {
      const response = await api({
        headers: {
          'x-login-method': `jwt`,
        },
        method: 'GET',
        url: '/customers/current_ride_status',
      });
      if (response.status === true) {
        if (response.data) {
          setRideStatus(response.data.status);
          if (response.data.status === 2) {
            setSelectRide(false);
            setComfirmBooking(false);
            setInRRoute(true);
            setAcceptDriverDetail(response.data);
            _setDriverId(response.data.driver_id);
          }
        }
      }
    } catch (error) {
      errorLog('Error getting current ride status', error);
      toast.error('Failed to get ride status. Please try again.');
    } finally {
      setLoading(false);
    }
  },

  // Get customer ride type
  getCustomerRideType: () => customerRideType,

  // Get driver location
  getDriverLocation: data => {
    debugLog('Getting driver location', data);
    socketService.emit(socketEvents.GET_DRIVER_LOCATION, data);
  },

  // Get schedule ride detail
  async getScheduleRideDetail(
    userAuth,
    { setLoading, setSaveDateTime, setScheduleRideStatus, setSelectedDate, setSelectedTime }
  ) {
    try {
      const response = await api({
        headers: {
          'x-login-method': `jwt`,
        },
        method: 'GET',
        url: '/customers/schedule_ride_detail',
      });
      if (response.status === true) {
        if (response.data) {
          setSaveDateTime(true);
          setSelectedDate(response.data.schedule_date);
          setSelectedTime(response.data.schedule_time);
          setScheduleRideStatus(true);
        }
      }
    } catch (error) {
      errorLog('Error getting schedule ride detail', error);
      toast.error('Failed to get schedule ride details. Please try again.');
    } finally {
      setLoading(false);
    }
  },

  // Get user current location
  getUserCurrentLocation({
    getAllCarsList,
    setCenterMapLocation,
    setCurrentLocation,
    setMapLocationLabel,
  }) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async position => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          try {
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${userLocation.lat},${userLocation.lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
            );
            const data = await response.json();
            if (data.status === 'OK' && data.results.length > 0) {
              const address = data.results[0].formatted_address;
              userLocation.address = address;
            }
          } catch (error) {
            console.error('Error fetching address:', error);
          }
          getAllCarsList(userLocation);
          setCurrentLocation(userLocation);
          setCenterMapLocation(userLocation);
          setMapLocationLabel('Pickup');
        },
        error => {
          console.error('Error getting user location:', error);
        }
      );
    } else {
      const defaultLocation = {
        lat: 26.8548662,
        lng: 75.8242966,
      };
      setCurrentLocation(defaultLocation);
      console.error('Geolocation is not supported by this browser.');
    }
  },

  // Initialize socket connection
  async initializeSocket(userAuth) {
    debugLog('Initializing socket connection');

    // If socket is already connected, return immediately
    if (isSocketConnected) {
      debugLog('Socket already connected, skipping initialization');
      return;
    }

    // If socket is in the process of connecting, return the existing promise
    if (isSocketConnecting) {
      debugLog('Socket connection in progress, returning existing promise');
      return socketConnectionPromise;
    }

    try {
      isSocketConnecting = true;
      debugLog('Starting socket connection process');

      // Create a new connection promise
      socketConnectionPromise = new Promise((resolve, reject) => {
        // Validate and set auth token
        if (!userAuth) {
          const error = new Error('User authentication data is required');
          errorLog('Authentication error', error);
          reject(error);
          return;
        }

        const token = userAuth.token_code;
        if (!token) {
          const error = new Error('Authentication token is required');
          errorLog('Authentication error', error);
          reject(error);
          return;
        }

        // Set auth token
        debugLog('Setting auth token');
        socketService.setAuthToken(token);

        // Set up connection event handlers
        const onConnect = () => {
          debugLog('Socket connected successfully');
          isSocketConnected = true;
          isSocketConnecting = false;
          socketService.off('connect', onConnect);
          socketService.off('connect_error', onConnectError);

          // Register all stored handlers
          Object.entries(eventHandlers).forEach(([event, handlers]) => {
            handlers.forEach(handler => {
              socketService.on(event, handler);
            });
            // Clear stored handlers
            eventHandlers[event] = [];
          });

          resolve();
        };

        const onConnectError = error => {
          errorLog('Socket connection error', error);
          isSocketConnected = false;
          isSocketConnecting = false;
          socketService.off('connect', onConnect);
          socketService.off('connect_error', onConnectError);

          // Handle authentication errors
          if (error.message.includes('authentication') || error.message.includes('token')) {
            errorLog('Authentication failed', error);
            // You might want to trigger a re-authentication flow here
          }

          reject(error);
        };

        // Add event listeners
        socketService.on('connect', onConnect);
        socketService.on('connect_error', onConnectError);

        // Initialize the socket
        socketService.initialize().catch(error => {
          errorLog('Socket initialization error', error);
          reject(error);
        });
      });

      return await socketConnectionPromise;
    } catch (error) {
      errorLog('Error in socket initialization', error);
      isSocketConnecting = false;
      throw error;
    }
  },

  // Add socket state check
  isSocketReady,

  // On car locations
  onCarLocations(handler) {
    debugLog('Registering car locations handler');
    return socketService.on(socketEvents.CAR_LOCATIONS, handler);
  },

  // On no driver found
  onNoDriverFound(handler) {
    debugLog('Registering no driver found handler');
    return socketService.on(socketEvents.NO_DRIVER_FOUND, handler);
  },

  // On request sent
  onRequestSent(handler) {
    debugLog('Registering request sent handler');
    return socketService.on(socketEvents.REQUEST_SENT, handler);
  },

  // On request status changed
  onRequestStatusChanged(handler) {
    debugLog('Registering request status changed handler');
    return socketService.on(socketEvents.REQUEST_STATUS_CHANGED, handler);
  },

  // Request booking
  requestBooking: payload => {
    debugLog('Requesting booking', payload);
    socketService.emit(socketEvents.REQUEST_BOOKING, payload);
  },

  // Request booking with status tracking
  requestBookingWithStatus(payload, { onDriverAccepted, onNoDriverFound, onRequestStatusChanged }) {
    debugLog('Requesting booking with status tracking', payload);

    // Register event handlers
    const cleanupRequestStatus = this.onRequestStatusChanged(data => {
      debugLog('Request status changed:', data);
      if (onRequestStatusChanged) {
        onRequestStatusChanged(data);
      }
    });

    const cleanupNoDriver = this.onNoDriverFound(data => {
      debugLog('No driver found:', data);
      if (onNoDriverFound) {
        onNoDriverFound(data);
      }
    });

    // Emit the booking request
    socketService.emit(socketEvents.REQUEST_BOOKING, payload);

    // Return cleanup function
    return () => {
      cleanupRequestStatus();
      cleanupNoDriver();
    };
  },

  // Request driver locations
  requestDriverLocations(location, carTypeId) {
    debugLog('Requesting driver locations', { carTypeId, location });
    const requestData = {
      car_type: carTypeId,
      pickup_lat: location.lat,
      pickup_lng: location.lng,
    };
    socketService.emit(socketEvents.GET_DRIVER_LOCATION, requestData);
  },

  // Request a ride
  requestRide: async rideData => {
    try {
      const socket = await socketService.initialize();
      if (!socket) {
        throw new Error('Socket initialization failed');
      }

      // Ensure socket is connected
      if (!socket.connected) {
        await socketService.connect();
      }

      socket.emit(socketEvents.REQUEST_BOOKING, rideData);
      debugLog('Ride request sent', rideData);
    } catch (error) {
      errorLog('Error in requestRide', error);
      throw error;
    }
  },

  // Save socket info
  saveSocketInfo() {
    debugLog('Saving socket info');
    socketService.emit(socketEvents.SAVE_SOCKET_INFO);
  },

  // Set customer ride type
  setCustomerRideType: type => {
    debugLog('Setting customer ride type', type);
    customerRideType = type;
  },

  // Set up socket event listeners
  setupSocketEventListeners: setStateFunctions => {
    return socketService.setupSocketEventListeners(setStateFunctions);
  },
};

export { socketEvents, socketHelpers, socketService };
export default socketService;
