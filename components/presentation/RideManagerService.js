import { socketEvents, socketHelpers, socketService } from './SocketEvents';
import { toast } from 'react-toastify';
import { signOut } from 'next-auth/react';
import { getSession } from 'next-auth/react';
import { api } from '@/utils/api/register';
import rideSocketHandler from './RideSocketHandler';

// Debug flag - set to true to enable detailed logging
const DEBUG = true;

// Debug logging function
const debugLog = (message, data = null) => {
  if (DEBUG) {
    if (data) {
      console.log(`[RideManagerService Debug] ${message}:`, data);
    } else {
      console.log(`[RideManagerService Debug] ${message}`);
    }
  }
};

// Error logging function
const errorLog = (message, error = null) => {
  if (error) {
    console.error(`[RideManagerService Error] ${message}:`, error);
    if (error.stack) {
      console.error(`[RideManagerService Error] Stack trace:`, error.stack);
    }
  } else {
    console.error(`[RideManagerService Error] ${message}`);
  }
};

// RideManagerService singleton class
class RideManagerService {
  constructor() {
    if (RideManagerService.instance) {
      return RideManagerService.instance;
    }

    this.eventHandlers = {};
    this.bookingRequestId = null;
    this.isBookingInProgress = false;
    this.customerRideType = 'regular'; // Default ride type

    debugLog('RideManagerService instance created');

    RideManagerService.instance = this;
  }

  // Set the customer ride type
  setCustomerRideType(type) {
    debugLog('Setting customer ride type', type);
    this.customerRideType = type;
  }

  // Get the customer ride type
  getCustomerRideType() {
    return this.customerRideType;
  }

  // Handle car locations
  handleCarLocations(response, setAvailableDriver) {
    debugLog('Handling car locations', response);

    if (response && response.length > 0) {
      // Update available drivers with the new locations
      setAvailableDriver(prevDrivers => {
        // Create a map of existing drivers for quick lookup
        const driverMap = new Map();
        if (prevDrivers && prevDrivers.length > 0) {
          prevDrivers.forEach(driver => {
            driverMap.set(driver.driver_id, driver);
          });
        }

        // Update or add new driver locations
        response.forEach(location => {
          if (driverMap.has(location.driver_id)) {
            // Update existing driver
            const updatedDriver = {
              ...driverMap.get(location.driver_id),
              lat: location.lat,
              lng: location.lng,
            };
            driverMap.set(location.driver_id, updatedDriver);
          } else {
            // Add new driver
            driverMap.set(location.driver_id, location);
          }
        });

        // Convert map back to array
        return Array.from(driverMap.values());
      });
    }
  }

  // Request driver locations
  requestDriverLocations(currentLocation, carTypeId) {
    debugLog('Requesting driver locations', { carTypeId, currentLocation });

    if (currentLocation && carTypeId) {
      const requestData = {
        car_type: carTypeId,
        pickup_lat: currentLocation.lat,
        pickup_lng: currentLocation.lng,
      };

      socketHelpers.getDriverLocation(requestData);
    }
  }

  // Set up socket event listeners
  setupSocketEventListeners(setStateFunctions) {
    debugLog('Setting up socket event listeners');

    // Initialize the ride socket handler with state setters
    rideSocketHandler.initialize(setStateFunctions);

    // Return cleanup function
    return () => {
      rideSocketHandler.cleanup();
    };
  }

  // Request a ride
  async requestRide(rideData, router) {
    debugLog('Requesting ride', rideData);

    if (this.isBookingInProgress) {
      toast.info('A booking request is already in progress');
      return;
    }

    try {
      this.isBookingInProgress = true;

      const session = await getSession();
      if (!session) {
        toast.error('Please login to continue');
        router.push('/login');
        return;
      }

      const formData = new FormData();

      // Add ride type to the form data
      formData.append('ride_type', this.customerRideType);

      // Add other ride data to the form
      Object.keys(rideData).forEach(key => {
        formData.append(key, rideData[key]);
      });

      const response = await api({
        data: formData,
        method: 'POST',
        url: '/customers/new_ride_request',
      });

      if (response.status === true) {
        const bookingPayload = {
          auth_token: response.token_code,
          car_type: rideData.car_type,
          customer_id: response.customer_id,
          drop_address: rideData.drop_address,
          drop_lat: rideData.drop_lat,
          drop_lng: rideData.drop_lng,
          pickup_address: rideData.pickup_address,
          pickup_lat: rideData.pickup_lat,
          pickup_lng: rideData.pickup_lng,
          ride_type: this.customerRideType,
          token_code: response.token_code,
          user_type: 'customer',
        };

        // Set up a cleanup timeout
        const cleanupTimeout = setTimeout(() => {
          if (this.isBookingInProgress) {
            this.isBookingInProgress = false;
            toast.error('Booking request timed out. Please try again.');
          }
        }, 60000); // 1 minute timeout

        // Emit the booking request
        socketHelpers
          .requestSendBooking(bookingPayload)
          .then(response => {
            debugLog('Booking request sent', response);
            clearTimeout(cleanupTimeout);
          })
          .catch(error => {
            debugLog('Error sending booking request', error);
            clearTimeout(cleanupTimeout);
            toast.error('Failed to send booking request. Please try again.');
            this.isBookingInProgress = false;
          });
      } else if (response.status === 'FALSE' && response.message === 'Invalid token code') {
        toast.error(
          'Your account has been logged in on another device. Please login again to continue.'
        );
        await signOut({ redirect: false });
        router.push('/login');
      } else {
        toast.error(response.message || 'Failed to request ride');
        this.isBookingInProgress = false;
      }
    } catch (error) {
      errorLog('Error in requestRide', error);
      toast.error('An error occurred while requesting a driver. Please try again.');
      this.isBookingInProgress = false;
    }
  }

  // Schedule a ride
  async scheduleRide(rideData, router) {
    debugLog('Scheduling ride', rideData);

    try {
      const formData = new FormData();

      // Add ride type to the form data
      formData.append('ride_type', this.customerRideType);

      // Add other ride data to the form
      Object.keys(rideData).forEach(key => {
        formData.append(key, rideData[key]);
      });

      const response = await api({
        data: formData,
        method: 'POST',
        url: '/customers/new_schedule_ride_request',
      });

      if (response.status === true) {
        toast.success(response.message);
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else if (response.status === 'FALSE' && response.message === 'Invalid token code') {
        toast.error(
          'Your account has been logged in on another device. Please login again to continue.'
        );
        await signOut({ redirect: false });
        router.push('/login');
      } else {
        toast.error(response.message || 'Failed to schedule ride');
      }
    } catch (error) {
      errorLog('Error in scheduleRide', error);
      toast.error('An error occurred while scheduling your ride. Please try again.');
    }
  }

  // Cancel a booking request
  cancelBookingRequest(userAuth) {
    debugLog('Canceling booking request', this.bookingRequestId);

    if (this.bookingRequestId) {
      socketHelpers.cancel_ride({
        customer_id: userAuth.customer_id,
        request_id: this.bookingRequestId,
        user_type: 'customer',
      });
      this.isBookingInProgress = false;
      this.bookingRequestId = null;
      toast.info('Booking request canceled');
    }
  }

  // Get current ride status
  async getCurrentRideStatus(userAuth, setStateFunctions) {
    debugLog('Getting current ride status');

    const {
      setLoading,
      setShowReview,
      setSelectRide,
      setComfirmBooking,
      setInRRoute,
      setCurrentLocation,
      setDriverLocation,
      setDropLocation,
      setAcceptDriverDetail,
      setRideStatus,
      setDriverId,
    } = setStateFunctions;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('customer_id', userAuth.customer_id);
      formData.append('token_code', userAuth.token_code);

      const response = await api({
        data: formData,
        method: 'POST',
        url: '/customers/ride_completeness',
      });

      if (response.status === true && response.message === 'Tip is not given for this ride') {
        setShowReview(true);
        setLoading(false);
      } else if (response.status === true && response.message === 'Driver is not arrived') {
        setSelectRide(false);
        setComfirmBooking(false);
        setInRRoute(true);
        setCurrentLocation({
          address: response.customer_destination_point_name,
          lat: parseFloat(response.customer_destination_point_lat),
          lng: parseFloat(response.customer_destination_point_long),
        });
        setDriverLocation({
          lat: parseFloat(response.driver_latitude),
          lng: parseFloat(response.driver_longitude),
        });
        setDropLocation({
          address: response.destination_name,
          lat: parseFloat(response.destination_latitude),
          lng: parseFloat(response.destination_longitude),
        });
        setAcceptDriverDetail(response);
        setRideStatus(2);
        setDriverId(response.driver_id);
        setLoading(false);
      } else if (
        response.status === true &&
        response.message === 'Driver arrived at the the pick up location'
      ) {
        setSelectRide(false);
        setComfirmBooking(false);
        setInRRoute(true);
        setCurrentLocation({
          address: response.customer_destination_point_name,
          lat: parseFloat(response.customer_destination_point_lat),
          lng: parseFloat(response.customer_destination_point_long),
        });
        setDriverLocation({
          lat: parseFloat(response.driver_latitude),
          lng: parseFloat(response.driver_longitude),
        });
        setDropLocation({
          address: response.destination_name,
          lat: parseFloat(response.destination_latitude),
          lng: parseFloat(response.destination_longitude),
        });
        setAcceptDriverDetail(response);
        setRideStatus(3);
        setDriverId(response.driver_id);
        setLoading(false);
      } else if (response.status === true && response.message === 'Journey started') {
        setSelectRide(false);
        setComfirmBooking(false);
        setInRRoute(true);
        setCurrentLocation({
          address: response.customer_destination_point_name,
          lat: parseFloat(response.customer_destination_point_lat),
          lng: parseFloat(response.customer_destination_point_long),
        });
        setDriverLocation({
          lat: parseFloat(response.driver_latitude),
          lng: parseFloat(response.driver_longitude),
        });
        setDropLocation({
          address: response.destination_name,
          lat: parseFloat(response.destination_latitude),
          lng: parseFloat(response.destination_longitude),
        });
        setAcceptDriverDetail(response);
        setRideStatus(4);
        setDriverId(response.driver_id);
        setLoading(false);
      } else if (response.status === true) {
        setShowReview(false);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      errorLog('Error in getCurrentRideStatus', error);
      setLoading(false);
    }
  }

  // Cancel a ride
  async cancelRide(rideData, router) {
    debugLog('Canceling ride', rideData);

    try {
      const formData = new FormData();
      formData.append('request_id', rideData.request_id);
      formData.append('ride_id', rideData.ride_id);
      formData.append('customer_id', rideData.customer_id);
      formData.append('token_code', rideData.token_code);

      const response = await api({
        data: formData,
        method: 'POST',
        url: '/customers/customer_cancel',
      });

      if (response.status === true) {
        toast.success(response.message);
        const params = {
          auth_token: rideData.token_code,
          customer_id: rideData.customer_id,
          request_id: rideData.request_id,
          token_code: rideData.token_code,
          user_type: 'customer',
        };
        socketHelpers.cancel_ride(params);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast.error(response.message || 'Failed to cancel ride');
      }
    } catch (error) {
      errorLog('Error in cancelRide', error);
      toast.error('An error occurred while canceling your ride. Please try again.');
    }
  }

  // End a running ride
  async endRunningRide(rideData, setStateFunctions) {
    debugLog('Ending running ride', rideData);

    const { setLoading, setSelectRide, setComfirmBooking, setInRRoute, setShowReview } =
      setStateFunctions;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('request_id', rideData.request_id);
      formData.append('ride_id', rideData.ride_id);
      formData.append('driver_id', rideData.driver_id);
      formData.append('ride_status', rideData.ride_status);
      formData.append('ride_type', rideData.ride_type);
      formData.append('customer_id', rideData.customer_id);
      formData.append('token_code', rideData.token_code);

      const response = await api({
        data: formData,
        method: 'POST',
        url: '/customers/end_journey_by_customer',
      });

      if (response.status === true) {
        setSelectRide(true);
        setComfirmBooking(false);
        setInRRoute(false);
        toast.success(response.message);
        setShowReview(true);
        setLoading(false);
      } else {
        toast.error(response.message || 'Failed to end journey');
        setLoading(false);
      }
    } catch (error) {
      errorLog('Error in endRunningRide', error);
      toast.error('An error occurred while ending your journey. Please try again.');
      setLoading(false);
    }
  }

  // Get all cars list
  async getAllCarsList(location, setStateFunctions) {
    debugLog('Getting all cars list', location);

    const { setLoading, setCarsList, setCarStatus } = setStateFunctions;

    try {
      setLoading(true);

      const response = await api({
        headers: {
          'x-login-method': `jwt`,
        },
        method: 'GET',
        url: '/customer/car-types',
      });

      setLoading(false);

      if (response.status === true) {
        setCarsList(response.data);
        setCarStatus(true);
      }
    } catch (error) {
      errorLog('Error in getAllCarsList', error);
      setLoading(false);
    }
  }

  // Get user current location
  getUserCurrentLocation(setStateFunctions) {
    debugLog('Getting user current location');

    const { setCurrentLocation, setCenterMapLocation, setMapLocationLabel, getAllCarsList } =
      setStateFunctions;

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
  }

  initializeSocket(userAuth) {
    if (!userAuth) {
      console.error('User authentication is required to initialize socket');
      return;
    }

    try {
      // Set the auth token from userAuth
      if (userAuth.token_code) {
        socketService.setAuthToken(userAuth.token_code);
      }

      // Initialize socket connection with user authentication
      socketService.initialize(userAuth);

      // Explicitly connect to the socket after initialization
      socketService.connect();

      console.log('Socket initialized and connected successfully');
    } catch (error) {
      console.error('Error initializing socket:', error);
      toast.error('Failed to initialize connection. Please try again.');
    }
  }

  saveSocketInfo() {
    try {
      // Save socket information for persistence
      socketHelpers.saveSocketInfo();
      console.log('Socket info saved successfully');
    } catch (error) {
      console.error('Error saving socket info:', error);
    }
  }
}

// Create a singleton instance
const rideManagerService = new RideManagerService();

export default rideManagerService;
