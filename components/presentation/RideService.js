import { api } from '@/utils/api/register';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { signOut } from 'next-auth/react';
import { getSession } from 'next-auth/react';
import { socketHelpers, socketEvents, socketService } from './Socket';

// Debug flag - set to true to enable detailed logging
const DEBUG = true;

// Debug logging function
const debugLog = (message, data = null) => {
  if (DEBUG) {
    if (data) {
      console.log(`[RideService Debug] ${message}:`, data);
    } else {
      console.log(`[RideService Debug] ${message}`);
    }
  }
};

// Error logging function
const errorLog = (message, error = null) => {
  if (error) {
    console.error(`[RideService Error] ${message}:`, error);
    if (error.stack) {
      console.error(`[RideService Error] Stack trace:`, error.stack);
    }
  } else {
    console.error(`[RideService Error] ${message}`);
  }
};

// RideService singleton class
class RideService {
  constructor() {
    if (RideService.instance) {
      return RideService.instance;
    }

    this.eventHandlers = {};
    this.bookingRequestId = null;
    this.isBookingInProgress = false;

    debugLog('RideService instance created');

    RideService.instance = this;
  }

  // Initialize socket connection
  async initializeSocket(userAuth) {
    debugLog('Initializing socket connection');

    try {
      if (userAuth && userAuth.token_code) {
        debugLog('Setting auth token', userAuth.token_code);
        socketService.setAuthToken(userAuth.token_code);
      } else {
        console.warn('No access token found in session');
        if (userAuth && userAuth.token_code) {
          debugLog('Using token_code as fallback', userAuth.token_code);
          socketService.setAuthToken(userAuth.token_code);
        }
      }
    } catch (error) {
      errorLog('Error initializing socket', error);
    }
  }

  // Save socket info
  saveSocketInfo() {
    debugLog('Saving socket info');

    const socketInfo = {
      user_type: 'customer',
    };

    return socketHelpers
      .saveSocketInfo(socketInfo)
      .then((response) => {
        debugLog('Socket info saved', response);
        return response;
      })
      .catch((error) => {
        errorLog('Error saving socket info', error);
        throw error;
      });
  }

  // Handle car locations
  handleCarLocations(response, setAvailableDriver) {
    debugLog('Handling car locations', response);

    if (response && response.length > 0) {
      // Update available drivers with the new locations
      setAvailableDriver((prevDrivers) => {
        // Create a map of existing drivers for quick lookup
        const driverMap = new Map();
        if (prevDrivers && prevDrivers.length > 0) {
          prevDrivers.forEach((driver) => {
            driverMap.set(driver.driver_id, driver);
          });
        }

        // Update or add new driver locations
        response.forEach((location) => {
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
    debugLog('Requesting driver locations', { currentLocation, carTypeId });

    if (currentLocation && carTypeId) {
      const requestData = {
        pickup_lat: currentLocation.lat,
        pickup_lng: currentLocation.lng,
        car_type: carTypeId,
      };

      socketHelpers.getDriverLocation(requestData);
    }
  }

  // Set up socket event listeners
  setupSocketEventListeners(setStateFunctions) {
    debugLog('Setting up socket event listeners');

    const {
      setComfirmBooking,
      setSelectRide,
      setInRRoute,
      setIsBookingInProgress,
      setBookingRequestId,
    } = setStateFunctions;

    // Set up event handlers
    const requestSentHandler = (response) => {
      debugLog('Request sent successfully', response);
      setComfirmBooking(false);
      setSelectRide(false);
      setInRRoute(true);
      toast.success('Your ride request has been sent. Finding a driver...');

      // Store the request ID for future reference
      if (response && response.id) {
        setBookingRequestId(response.id);
        this.bookingRequestId = response.id;
      }
    };

    const scheduleRequestSentHandler = (response) => {
      debugLog('Schedule request sent successfully', response);
      setComfirmBooking(false);
      setSelectRide(false);
      toast.success('Your scheduled ride request has been sent.');
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    };

    const noDriverFoundHandler = (response) => {
      debugLog('No driver found', response);
      setComfirmBooking(true);
      setSelectRide(false);
      toast.error('No drivers found in your area. Please try again later.');
      setIsBookingInProgress(false);
      this.isBookingInProgress = false;
    };

    const errorHandler = (error) => {
      errorLog('Error in booking request', error);
      setComfirmBooking(true);
      setSelectRide(false);
      toast.error(
        error.message ||
          'An error occurred while requesting a ride. Please try again.',
      );
      setIsBookingInProgress(false);
      this.isBookingInProgress = false;
    };

    const driverAcceptedHandler = (response) => {
      debugLog('Driver accepted', response);
      // Handle driver accepted event
    };

    const driverRejectedHandler = (response) => {
      debugLog('Driver rejected', response);
      // Handle driver rejected event
    };

    // Register event handlers
    const unsubscribeRequestSent = socketService.on(
      socketEvents.REQUEST_SENT,
      requestSentHandler,
    );
    const unsubscribeScheduleRequestSent = socketService.on(
      socketEvents.SCHEDULE_REQUEST_SENT,
      scheduleRequestSentHandler,
    );
    const unsubscribeNoDriverFound = socketService.on(
      socketEvents.NO_DRIVER_FOUND,
      noDriverFoundHandler,
    );
    const unsubscribeError = socketService.on(socketEvents.ERROR, errorHandler);
    const unsubscribeDriverAccepted = socketService.on(
      socketEvents.DRIVER_ACCEPTED,
      driverAcceptedHandler,
    );
    const unsubscribeDriverRejected = socketService.on(
      socketEvents.DRIVER_REJECTED,
      driverRejectedHandler,
    );

    // Return cleanup function
    return () => {
      unsubscribeRequestSent();
      unsubscribeScheduleRequestSent();
      unsubscribeNoDriverFound();
      unsubscribeError();
      unsubscribeDriverAccepted();
      unsubscribeDriverRejected();
    };
  }

  // Request a ride
  async requestRide(rideData, router) {
    debugLog('Requesting ride', rideData);

    // Check if a booking request is already in progress
    if (this.isBookingInProgress) {
      toast.info('A booking request is already in progress. Please wait...');
      return;
    }

    try {
      this.isBookingInProgress = true;

      const session = await getSession();
      let paymentMethodId;

      // Try to get payment method from session first
      if (session?.user?.data?.default_payment_method?.payment_id) {
        paymentMethodId = session.user.data.default_payment_method.payment_id;
      } else {
        // If not in session, try to get from localStorage
        const lastAddedCard = localStorage.getItem('lastAddedCard');
        if (lastAddedCard) {
          const cardInfo = JSON.parse(lastAddedCard);
          paymentMethodId = cardInfo.payment_id;
        }
      }

      debugLog('Payment method ID', paymentMethodId);

      if (!paymentMethodId) {
        toast.error(
          'No payment method found. Please add a payment method first.',
        );
        router.push('/cards/add');
        return;
      }

      const bookingPayload = {
        pickup_lat: String(rideData.currentLocation.lat),
        pickup_lng: String(rideData.currentLocation.lng),
        pickup_name: String(rideData.currentLocation.address),
        dropoff_lat: String(rideData.dropLocation.lat),
        dropoff_lng: String(rideData.dropLocation.lng),
        dropoff_name: String(rideData.dropLocation.address),
        ride_type: rideData.rideType,
        customer_id: rideData.userAuth.customer_id,
        car_type: rideData.carTypeId,
        gender: rideData.gender,
        promotion_id: rideData.promotionId,
        promo_code: rideData.couponCode,
        city_name: rideData.currentLocation.city,
        payment_method: paymentMethodId,
        distance: rideData.distance,
        time: rideData.duration,
      };

      debugLog('Booking payload', bookingPayload);

      // Emit the booking request
      return socketHelpers.requestSendBooking(bookingPayload);
    } catch (error) {
      errorLog('Error requesting ride', error);
      this.isBookingInProgress = false;
      throw error;
    }
  }

  // Schedule a ride
  async scheduleRide(rideData, router) {
    debugLog('Scheduling ride', rideData);

    try {
      const formData = new FormData();

      if (rideData.couponActive) {
        formData.append('promo_code', rideData.couponCode);
        formData.append('promotion_id', rideData.promotionId);
      }

      formData.append('car_type', rideData.carTypeId);
      formData.append(
        'schedule_date',
        format(new Date(rideData.selectedDate), 'yyyy-MM-dd'),
      );
      formData.append(
        'schedule_time',
        format(new Date(rideData.selectedTime), 'HH:mm:ss'),
      );
      formData.append(
        'destination_Location_Name',
        rideData.dropLocation.address,
      );
      formData.append('destination_point_lat', rideData.dropLocation.lat);
      formData.append('destination_point_long', rideData.dropLocation.lng);
      formData.append(
        'picking_Location_Name',
        rideData.currentLocation.address,
      );
      formData.append('picking_point_lat', rideData.currentLocation.lat);
      formData.append('picking_point_long', rideData.currentLocation.lng);
      formData.append('ride_type', rideData.rideType);
      formData.append('gender', rideData.gender);
      formData.append('payment_type', 1);
      formData.append('customer_id', rideData.userAuth.customer_id);

      const response = await api({
        url: '/customers/new_schedule_ride_request',
        method: 'POST',
        data: formData,
      });

      if (response.status === true) {
        toast.success(response.message);
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else if (
        response.status === 'FALSE' &&
        response.message === 'Invalid token code'
      ) {
        toast.error(
          'Your account has been logged in on another device. Please login again to continue.',
        );
        await signOut({ redirect: false });
        router.push('/login');
      } else {
        toast.error(response.message || 'Failed to schedule ride');
      }

      return response;
    } catch (error) {
      errorLog('Error scheduling ride', error);
      toast.error(
        'An error occurred while scheduling your ride. Please try again.',
      );
      throw error;
    }
  }

  // Cancel a booking request
  cancelBookingRequest(userAuth) {
    debugLog('Canceling booking request', this.bookingRequestId);

    if (this.bookingRequestId) {
      const params = {
        customer_id: userAuth.customer_id,
        user_type: 'customer',
        request_id: this.bookingRequestId,
        auth_token: userAuth.token_code,
        token_code: userAuth.token_code,
      };

      socketHelpers.cancel_ride(params);
      this.isBookingInProgress = false;
      this.bookingRequestId = null;
      toast.info('Booking request canceled');
    }
  }

  // Get current ride status
  async getCurrentRideStatus(userAuth, setStateFunctions) {
    debugLog('Getting current ride status');

    const {
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
      setLoading,
    } = setStateFunctions;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('customer_id', userAuth.customer_id);
      formData.append('token_code', userAuth.token_code);

      const response = await api({
        url: '/customers/ride_completeness',
        method: 'POST',
        data: formData,
      });

      if (
        response.status === true &&
        response.message === 'Tip is not given for this ride'
      ) {
        setShowReview(true);
        setLoading(false);
      } else if (
        response.status === true &&
        response.message === 'Driver is not arrived'
      ) {
        setSelectRide(false);
        setComfirmBooking(false);
        setInRRoute(true);
        setCurrentLocation({
          lat: parseFloat(response.customer_destination_point_lat),
          lng: parseFloat(response.customer_destination_point_long),
          address: response.customer_destination_point_name,
        });
        setDriverLocation({
          lat: parseFloat(response.driver_latitude),
          lng: parseFloat(response.driver_longitude),
        });
        setDropLocation({
          lat: parseFloat(response.destination_latitude),
          lng: parseFloat(response.destination_longitude),
          address: response.destination_name,
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
          lat: parseFloat(response.customer_destination_point_lat),
          lng: parseFloat(response.customer_destination_point_long),
          address: response.customer_destination_point_name,
        });
        setDriverLocation({
          lat: parseFloat(response.driver_latitude),
          lng: parseFloat(response.driver_longitude),
        });
        setDropLocation({
          lat: parseFloat(response.destination_latitude),
          lng: parseFloat(response.destination_longitude),
          address: response.destination_name,
        });
        setAcceptDriverDetail(response);
        setRideStatus(3);
        setDriverId(response.driver_id);
        setLoading(false);
      } else if (
        response.status === true &&
        response.message === 'Journey started'
      ) {
        setSelectRide(false);
        setComfirmBooking(false);
        setInRRoute(true);
        setCurrentLocation({
          lat: parseFloat(response.customer_destination_point_lat),
          lng: parseFloat(response.customer_destination_point_long),
          address: response.customer_destination_point_name,
        });
        setDriverLocation({
          lat: parseFloat(response.driver_latitude),
          lng: parseFloat(response.driver_longitude),
        });
        setDropLocation({
          lat: parseFloat(response.destination_latitude),
          lng: parseFloat(response.destination_longitude),
          address: response.destination_name,
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

      return response;
    } catch (error) {
      errorLog('Error getting current ride status', error);
      setLoading(false);
      throw error;
    }
  }

  // Get schedule ride details
  async getScheduleRideDetail(userAuth, setStateFunctions) {
    debugLog('Getting schedule ride details');

    const {
      setLoading,
      setSaveDateTime,
      setSelectedDate,
      setSelectedTime,
      setScheduleRideStatus,
    } = setStateFunctions;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('customer_id', userAuth.customer_id);
      formData.append('token_code', userAuth.token_code);

      const response = await api({
        url: '/customers/schedule_ride_detail',
        method: 'POST',
        data: formData,
      });

      if (response.code === 200 && response.status === true) {
        setLoading(false);
        setSaveDateTime(true);
        setSelectedDate(
          parse(
            response.data[0].schedule_request_date,
            'yyyy-MM-dd',
            new Date(),
          ),
        );
        setSelectedTime(
          parse(response.data[0].schedule_request_time, 'HH:mm:ss', new Date()),
        );
        setScheduleRideStatus(true);
      } else {
        setLoading(false);
        setScheduleRideStatus(false);
      }

      return response;
    } catch (error) {
      errorLog('Error getting schedule ride details', error);
      setLoading(false);
      throw error;
    }
  }

  // Cancel a ride
  async cancelRide(rideData, router) {
    debugLog('Canceling ride', rideData);

    try {
      const formData = new FormData();
      formData.append('request_id', rideData.acceptDriverDetail.request_id);
      formData.append('ride_id', rideData.acceptDriverDetail.ride_id);
      formData.append('customer_id', rideData.userAuth.customer_id);
      formData.append('token_code', rideData.userAuth.token_code);

      const response = await api({
        url: '/customers/customer_cancel',
        method: 'POST',
        data: formData,
      });

      if (response.status === true) {
        toast.success(response.message);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast.error(response.message || 'Failed to cancel ride');
      }

      return response;
    } catch (error) {
      errorLog('Error canceling ride', error);
      toast.error(
        'An error occurred while canceling your ride. Please try again.',
      );
      throw error;
    }
  }

  // End a running ride
  async endRunningRide(rideData, setStateFunctions) {
    debugLog('Ending running ride', rideData);

    const {
      setSelectRide,
      setComfirmBooking,
      setInRRoute,
      setShowReview,
      setLoading,
    } = setStateFunctions;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('request_id', rideData.acceptDriverDetail.request_id);
      formData.append('ride_id', rideData.acceptDriverDetail.ride_id);
      formData.append('driver_id', rideData.driverId);
      formData.append('ride_status', rideData.rideStatus);
      formData.append('ride_type', rideData.acceptDriverDetail.ride_type);
      formData.append('customer_id', rideData.userAuth.customer_id);
      formData.append('token_code', rideData.userAuth.token_code);

      const response = await api({
        url: '/customers/end_journey_by_customer',
        method: 'POST',
        data: formData,
      });

      if (response.status === true) {
        setSelectRide(true);
        setComfirmBooking(false);
        setInRRoute(false);
        toast.success(response.message);
        setShowReview(true);
      } else {
        toast.error(response.message || 'Failed to end journey');
      }

      setLoading(false);
      return response;
    } catch (error) {
      errorLog('Error ending running ride', error);
      toast.error(
        'An error occurred while ending your journey. Please try again.',
      );
      setLoading(false);
      throw error;
    }
  }

  // Apply coupon
  async applyCoupon(promoCodeValue, userAuth) {
    debugLog('Applying coupon', promoCodeValue);

    if (!promoCodeValue || promoCodeValue.trim() === '') {
      toast.error('Please enter promo code');
      return null;
    }

    try {
      const formData = new FormData();
      formData.append('promo_code', promoCodeValue);
      formData.append('customer_id', userAuth.customer_id);

      const response = await api({
        url: '/customers/promo_code_validation',
        method: 'POST',
        data: formData,
      });

      if (response.status === true) {
        toast.success(response.message);
      } else if (
        response.status === 'FALSE' &&
        (response.code === 2 || response.code === 4)
      ) {
        toast.error(response.message);
      } else {
        toast.error(response.message || 'Failed to validate promo code');
      }

      return response;
    } catch (error) {
      errorLog('Error applying coupon', error);
      toast.error(
        'An error occurred while applying the promo code. Please try again.',
      );
      throw error;
    }
  }

  // Get all cars list
  async getAllCarsList(location, setStateFunctions) {
    debugLog('Getting all cars list', location);

    const { setCarsList, setCarStatus, setLoading } = setStateFunctions;

    try {
      setLoading(true);

      const response = await api({
        url: '/customer/car-types',
        method: 'GET',
        headers: {
          'x-login-method': `jwt`,
        },
      });

      setLoading(false);

      if (response.status === true) {
        setCarsList(response.data);
        setCarStatus(true);
      }

      return response;
    } catch (error) {
      errorLog('Error getting all cars list', error);
      setLoading(false);
      throw error;
    }
  }
}

// Create a singleton instance
const rideService = new RideService();

export default rideService;
