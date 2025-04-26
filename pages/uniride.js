import Layout from '@/components/common/Layout';
import LocationPickerMap from '@/components/common/LocationPickerMap';
import Review from '@/components/common/Review';
import RiderInfo from '@/components/common/RiderInfo';
import SpinnerLoader from '@/components/common/SpinnerLoader';
import LocationValueModel from '@/components/common/model/LocationValueModel';
import InnerContent from '@/components/presentation/InnerContent';
import socket, {
  socketEvents,
  socketHelpers,
  socketService,
} from '@/components/presentation/Socket';
import ThemeProvider from '@/theme/ThemeProvider';
import { api } from '@/utils/api/register';
import styled from '@emotion/styled';
import { signOut, getSession, useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useCarContext } from './context/CarListContext';
import MessageModel from '@/components/common/model/MessageModel';
import { parse, format } from 'date-fns';
import { ConstructionOutlined } from '@mui/icons-material';
import rideManagerService from '@/components/presentation/RideManagerService';

export default function Dashboard({ userAuth }) {
  const router = useRouter();
  const { type, lat, lng, address } = router.query;
  let dLocation = '';
  let pLocation = '';
  if (type === 'drop' && lat && lng && address) {
    dLocation = {
      address: address,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
    };
  }
  if (type === 'pickup' && lat && lng && address) {
    pLocation = {
      address: address,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
    };
  }
  const [loading, setLoading] = useState(false);
  const { carsList, setCarsList } = useCarContext();
  const [currentLocation, setCurrentLocation] = useState(dLocation || '');
  const [dropLocation, setDropLocation] = useState(dLocation || '');
  const [openValueModel, setOpenValueModel] = useState(false);
  const [selectRide, setSelectRide] = useState(true);
  const [comfirmBooking, setComfirmBooking] = useState(false);
  const [inRoute, setInRRoute] = useState(false);
  const [genderModelOpen, setGenderModelOpen] = useState(false);
  const [locationType, setLocationType] = useState(null);
  const [comfirmBookingData, setComfirmBookingData] = useState(null);
  const [acceptDriverDetail, setAcceptDriverDetail] = useState();
  const [centerMapLocation, setCenterMapLocation] = useState();
  const [mapLocationLabel, setMapLocationLabel] = useState();
  const [driverLocation, setDriverLocation] = useState('');
  const [rideStatus, setRideStatus] = useState();
  const [driverId, setDriverId] = useState();
  const [showReview, setShowReview] = useState(false);
  const [endRideData, setEndRideData] = useState();
  const [carTypeId, setCarTypeId] = useState(null);
  const [saveDateTime, setSaveDateTime] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [scheduleRideStatus, setScheduleRideStatus] = useState(false);
  const [scheduleMessage, setScheduleMessage] = useState(false);
  const [carStatus, setCarStatus] = useState(true);
  const [avgTime, setAvgTime] = useState(null);
  const [availableDriver, setAvailableDriver] = useState([]);
  const [couponActive, setCouponActive] = useState(false);
  const [couponCode, setCouponCode] = useState(null);
  const [promotionId, setPromotionId] = useState(null);
  const [customerRideType, setCustomerRideType] = useState('regular');
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [isBookingInProgress, setIsBookingInProgress] = useState(false);
  const [bookingRequestId, setBookingRequestId] = useState(null);
  const scheduleMsg =
    'Another ride is only possible after scheduled ride complete or scheduled ride cancel';
  const handleCarTypeId = (carId) => {
    setCarTypeId(carId);

    // Request driver locations when car type changes
    if (currentLocation && carId) {
      const requestData = {
        car_type: carId,
        pickup_lat: currentLocation.lat,
        pickup_lng: currentLocation.lng,
      };
      socketHelpers.getDriverLocation(requestData);
    }
  };
  const handleSelectRide = async () => {
    if (scheduleRideStatus) {
      setScheduleMessage(true);
      return;
    }
    if (carStatus === false) {
      toast.error("UniRide doesn't operate in your area.");
      return;
    }
    if (availableDriver && availableDriver.length <= 0) {
      toast.error('No cars available.');
      return;
    }
    if (currentLocation !== '' && dropLocation !== '') {
      try {
        setLoading(true);
        //setAvailableDriver([]);

        const rideNow = {
          car_type_id: carTypeId,
          distance: String(distance || '6.8'),
          dropoff: String(dropLocation.address),
          dropoff_lat: String(dropLocation.lat),
          dropoff_lng: String(dropLocation.lng),
          is_scheduled: false,
          pickup: String(currentLocation.address),
          pickup_lat: String(currentLocation.lat),
          pickup_lng: String(currentLocation.lng),
          time: String(duration || '22'),
        };
        const response = await api({
          data: rideNow,
          method: 'POST',
          url: '/socket/estimation-price',
        });
        if (response.status === true) {
          setComfirmBooking(true);
          setSelectRide(false);
          setComfirmBookingData(response.data);
        } else if (
          response.status === 'FALSE' &&
          response.message === 'Invalid token code'
        ) {
          toast.error(
            'Your account has been logged in on another device. Please login again to continue.',
          );
          await signOut({
            redirect: false,
          });
          router.push('/login');
        } else {
          toast.error(response.message || 'Failed to request ride information');
        }
      } catch (error) {
        console.error('Error in handleSelectRide:', error);
        toast.error(
          'An error occurred while processing your ride request. Please try again.',
        );
      } finally {
        setLoading(false);
      }
    } else {
      dropPickLocationType('drop');
    }
  };

  const dropPickLocationType = (type) => {
    setLocationType(type);
    setOpenValueModel(true);
  };
  const handleComfirmBooking = () => {
    setGenderModelOpen(true);
  };
  const handleGenderClose = () => {
    setGenderModelOpen(close);
  };
  const proceedGenderModel = async (gender) => {
    if (selectedDate !== null && selectedTime !== null) {
      try {
        setLoading(true);
        setGenderModelOpen(false);
        const formData = new FormData();
        if (couponActive) {
          formData.append('promo_code', couponCode);
          formData.append('promotion_id', promotionId);
        }
        formData.append('car_type', carTypeId);
        formData.append(
          'schedule_date',
          format(new Date(selectedDate), 'yyyy-MM-dd'),
        );
        formData.append(
          'schedule_time',
          format(new Date(selectedTime), 'HH:mm:ss'),
        );
        formData.append('destination_Location_Name', dropLocation.address);
        formData.append('destination_point_lat', dropLocation.lat);
        formData.append('destination_point_long', dropLocation.lng);
        formData.append('picking_Location_Name', currentLocation.address);
        formData.append('picking_point_lat', currentLocation.lat);
        formData.append('picking_point_long', currentLocation.lng);
        formData.append('ride_type', 'regular');
        formData.append('gender', gender);
        formData.append('payment_type', 1);
        formData.append('customer_id', userAuth.customer_id);
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
        } else if (
          response.status === 'FALSE' &&
          response.message === 'Invalid token code'
        ) {
          toast.error(
            'Your account has been logged in on another device. Please login again to continue.',
          );
          await signOut({
            redirect: false,
          });
          router.push('/login');
        } else {
          toast.error(response.message || 'Failed to schedule ride');
        }
      } catch (error) {
        console.error('Error in proceedGenderModel:', error);
        toast.error(
          'An error occurred while scheduling your ride. Please try again.',
        );
      } finally {
        setLoading(false);
      }
    } else {
      // Check if a booking request is already in progress
      if (isBookingInProgress) {
        toast.info('A booking request is already in progress. Please wait...');
        return;
      }
      try {
        setLoading(true);
        setGenderModelOpen(false);
        setIsBookingInProgress(true);
        let paymentMethodId;

        // Try to get payment method from userAuth first
        if (userAuth?.data?.default_payment_method?.payment_id) {
          paymentMethodId = userAuth.data.default_payment_method.payment_id;
        } else {
          // If not in userAuth, try to get from localStorage
          const lastAddedCard = localStorage.getItem('lastAddedCard');
          if (lastAddedCard) {
            const cardInfo = JSON.parse(lastAddedCard);
            paymentMethodId = cardInfo.payment_id;
          }
        }
        console.log('paymentMethodId', paymentMethodId);
        if (!paymentMethodId) {
          toast.error(
            'No payment method found. Please add a payment method first.',
          );
          router.push('/cards/add');
          return;
        }
        const bookingPayload = {
          car_type: carTypeId,
          city_name: currentLocation.city,
          customer_id: userAuth.customer_id,
          distance: distance,
          dropoff_lat: String(dropLocation.lat),
          dropoff_lng: String(dropLocation.lng),
          dropoff_name: String(dropLocation.address),
          gender: gender,
          payment_method: paymentMethodId,
          pickup_lat: String(currentLocation.lat),
          pickup_lng: String(currentLocation.lng),
          pickup_name: String(currentLocation.address),
          promo_code: couponCode,
          promotion_id: promotionId,
          ride_type: customerRideType,
          time: duration,
        };
        console.log('bookingPayload', bookingPayload);

        // Set up event listeners for booking responses
        const requestSentHandler = (response) => {
          console.log('Request sent successfully:', response);
          setComfirmBooking(false);
          setSelectRide(false);
          setInRRoute(true);
          toast.success('Your ride request has been sent. Finding a driver...');

          // Store the request ID for future reference
          if (response && response.id) {
            console.log('bookingRequestId', bookingRequestId);
            setBookingRequestId(response.id);
          }
        };
        // Register all event handlers
        const unsubscribeRequestSent = socketService.on(
          socketEvents.REQUEST_SENT,
          requestSentHandler,
        );
        // const unsubscribeScheduleRequestSent = socketService.on(socketEvents.SCHEDULE_REQUEST_SENT, scheduleRequestSentHandler);
        // const unsubscribeNoDriverFound = socketService.on(socketEvents.NO_DRIVER_FOUND, noDriverFoundHandler);
        // const unsubscribeError = socketService.on(socketEvents.ERROR, errorHandler);
        // const unsubscribeDriverAccepted = socketService.on(socketEvents.DRIVER_ACCEPTED, driverAcceptedHandler);
        // const unsubscribeDriverRejected = socketService.on(socketEvents.DRIVER_REJECTED, driverRejectedHandler);

        // Set a timeout to clean up event listeners if no response is received
        const cleanupTimeout = setTimeout(() => {
          unsubscribeRequestSent();
          // unsubscribeScheduleRequestSent();
          // unsubscribeNoDriverFound();
          // unsubscribeError();
          // unsubscribeDriverAccepted();
          // unsubscribeDriverRejected();
          setIsBookingInProgress(false);
        }, 60000); // 1 minute timeout

        // Emit the booking request
        socketHelpers
          .requestSendBooking(bookingPayload)
          .then((response) => {
            console.log('Booking request sent:', response);
            clearTimeout(cleanupTimeout);
          })
          .catch((error) => {
            console.error('Error sending booking request:', error);
            clearTimeout(cleanupTimeout);
            setComfirmBooking(true);
            setSelectRide(false);
            toast.error('Failed to send booking request. Please try again.');
            setIsBookingInProgress(false);
          })
          .finally(() => {
            setLoading(false);
          });
      } catch (error) {
        console.error('Error in proceedGenderModel:', error);
        toast.error(
          'An error occurred while requesting a driver. Please try again.',
        );
        setLoading(false);
        setIsBookingInProgress(false);
      }
    }
  };
  const handleInRoute = () => {
    setInRRoute(true);
  };
  const handleRideCancelModel = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('request_id', acceptDriverDetail.request_id);
      formData.append('ride_id', acceptDriverDetail.ride_id);
      formData.append('customer_id', userAuth.customer_id);
      formData.append('token_code', userAuth.token_code);
      const response = await api({
        data: formData,
        method: 'POST',
        url: '/customers/customer_cancel',
      });
      if (response.status === true) {
        setSelectRide(true);
        setComfirmBooking(false);
        setInRRoute(false);
        toast.success(response.message);
        const params = {
          auth_token: userAuth.token_code,
          customer_id: userAuth.customer_id,
          request_id: acceptDriverDetail.request_id,
          token_code: userAuth.token_code,
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
      console.error('Error in handleRideCancelModel:', error);
      toast.error(
        'An error occurred while canceling your ride. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };
  const handleCancelRunningRide = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('request_id', acceptDriverDetail.request_id);
      formData.append('ride_id', acceptDriverDetail.ride_id);
      formData.append('driver_id', driverId);
      formData.append('ride_status', rideStatus);
      formData.append('ride_type', acceptDriverDetail.ride_type);
      formData.append('customer_id', userAuth.customer_id);
      formData.append('token_code', userAuth.token_code);
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
      } else {
        toast.error(response.message || 'Failed to end journey');
      }
    } catch (error) {
      console.error('Error in handleCancelRunningRide:', error);
      toast.error(
        'An error occurred while ending your journey. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };
  const handleFavoriteModelValue = () => {
    router.push(
      {
        pathname: '/favoriteDestination',
        query: {
          page: 'uniride',
          type: locationType,
        },
      },
      undefined,
      {
        shallow: true,
      },
    );
  };
  const handleActionScheduleRide = () => {
    router.push('/schedule-ride');
  };
  const closeScheduleMessage = () => {
    setScheduleMessage(false);
  };
  const getDropPickLocation = (location, distanceValue, durationValue) => {
    console.log({
      distanceValue: distanceValue,
      durationValue: durationValue,
      locationType: locationType,
    });
    if (locationType === 'pickup') {
      getAllCarsList(location);
      setCurrentLocation(location);
      setCenterMapLocation(location);
      setMapLocationLabel('Pickup');
    } else if (locationType === 'drop') {
      setDropLocation(location);
      setCenterMapLocation(location);
      setMapLocationLabel('Drop');
    } else {
      getAllCarsList(location);
      setCurrentLocation(location);
      setCenterMapLocation(location);
      setMapLocationLabel('Pickup');
    }

    // Update distance and duration if provided
    if (distanceValue !== undefined) {
      setDistance(distanceValue);
    }
    if (durationValue !== undefined) {
      setDuration(durationValue);
    }
  };
  const closeValueModel = () => {
    setOpenValueModel(false);
  };
  const getAllCarsList = async () => {
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

    //   const carsList = [
    //     {
    //         "is_corporate": "0",
    //         "id": "5",
    //         "name": "Sedan",
    //         "no_of_seats": "4",
    //         "map_car_image": "https://www.unirideus.com/staging/uploads/managers/images/1498112898.png",
    //         "list_car_image": "https://www.unirideus.com/staging/uploads/managers/images/1568266092.png",
    //         "base_fare": "20.00",
    //         "allow_basefare": "1",
    //         "cancelation_fee": "30.00",
    //         "per_mile_fare": "10.00",
    //         "per_minute_fare": "10.00",
    //         "minimum_fare": "35.00",
    //         "default_car": false,
    //         "avg_time": "no cars",
    //         "drivers": []
    //     },
    //     {
    //         "is_corporate": "0",
    //         "id": "6",
    //         "name": "SUV",
    //         "no_of_seats": "6",
    //         "map_car_image": "https://www.unirideus.com/staging/uploads/managers/images/1568195848.png",
    //         "list_car_image": "https://www.unirideus.com/staging/uploads/managers/images/1568266034.png",
    //         "base_fare": "25.00",
    //         "allow_basefare": "1",
    //         "cancelation_fee": "30.00",
    //         "per_mile_fare": "8.00",
    //         "per_minute_fare": "1.50",
    //         "minimum_fare": "40.00",
    //         "default_car": true,
    //         "avg_time": "no cars",
    //         "drivers": []
    //     },
    //     {
    //         "is_corporate": "0",
    //         "id": "3",
    //         "name": "Lux",
    //         "no_of_seats": "4",
    //         "map_car_image": "https://www.unirideus.com/staging/uploads/managers/images/1498112920.png",
    //         "list_car_image": "https://www.unirideus.com/staging/uploads/managers/images/1568266147.png",
    //         "base_fare": "25.00",
    //         "allow_basefare": "1",
    //         "cancelation_fee": "30.00",
    //         "per_mile_fare": "25.00",
    //         "per_minute_fare": "25.00",
    //         "minimum_fare": "50.00",
    //         "default_car": false,
    //         "avg_time": "no cars",
    //         "drivers": []
    //     },
    //     {
    //         "is_corporate": "0",
    //         "id": "2",
    //         "name": "Mini Van",
    //         "no_of_seats": "8",
    //         "map_car_image": "https://www.unirideus.com/staging/uploads/managers/images/1498112909.png",
    //         "list_car_image": "https://www.unirideus.com/staging/uploads/managers/images/1568266130.png",
    //         "base_fare": "20.00",
    //         "allow_basefare": "1",
    //         "cancelation_fee": "30.00",
    //         "per_mile_fare": "6.00",
    //         "per_minute_fare": "6.00",
    //         "minimum_fare": "10.00",
    //         "default_car": false,
    //         "avg_time": "no cars",
    //         "drivers": []
    //     }
    // ]

    // const defaultCars = carsList.filter((car) => {
    //   return (
    //     car.default_car === true &&
    //     car.is_corporate === (customerRideType === "regular" ? "0" : "1")
    //   );
    // });

    // setCarsList(carsList);
    // setCarStatus(true);
    // if (defaultCars.length > 0) {
    //   setCarTypeId(defaultCars[0].id);
    //   setAvgTime(defaultCars[0].avg_time);
    //   setAvailableDriver(defaultCars[0].drivers);
    // } else {
    //   setCarTypeId(null);
    //   setAvailableDriver([]);
    // }
    // setLoading(false);

    // const session = await getSession();

    // const formData = new FormData();
    // formData.append("os", 1);
    // formData.append("lat", location.lat);
    // formData.append("lng", location.lng);
    // formData.append("ride_type", customerRideType);
    // formData.append("customer_id", userAuth.customer_id);
    // formData.append("check_city", true);
    // setLoading(true);
    // const response = await api({
    //   url: "/common/get_cars",
    //   method: "POST",
    //   data: formData,
    // });

    // if (response.status === true) {
    //   setCarStatus(true);
    //   setCarsList(response.data.cars);

    //   // const defaultCars = response.data.cars?.filter(
    //   //   (car) => car.default_car === true && car.is_corporate === "0"
    //   // );
    //   const defaultCars = response.data.cars?.filter((car) => {
    //     return (
    //       car.default_car === true &&
    //       car.is_corporate === (customerRideType === "regular" ? "0" : "1")
    //     );
    //   });

    //   if (defaultCars.length > 0) {
    //     setCarTypeId(defaultCars[0].id);
    //     setAvgTime(defaultCars[0].avg_time);
    //     setAvailableDriver(defaultCars[0].drivers);
    //   } else {
    //     setCarTypeId(null);
    //     setAvailableDriver([]);
    //   }
    //   setLoading(false);
    // } else if (response.message == "Invalid token code") {
    //   setLoading(false);
    //   // await signOut({ redirect: false });
    // } else {
    //   setLoading(false);
    //   setCarStatus(false);
    // }
  };
  const getUserCurrentLoacation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          try {
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${userLocation.lat},${userLocation.lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
            );
            const data = await response.json();
            if (data.status === 'OK' && data.results.length > 0) {
              const address = data.results[0].formatted_address;
              userLocation.address = address;
            }
          } catch (error) {
            console.error('Error fetching address:', error);
          }
          getAllCarsList(pLocation || userLocation);
          setCurrentLocation(pLocation || userLocation);
          setCenterMapLocation(pLocation || userLocation);
          setMapLocationLabel('Pickup');
        },
        (error) => {
          console.error('Error getting user location:', error);
        },
      );
    } else {
      const defaultLocation = {
        lat: 26.8548662,
        lng: 75.8242966,
      };
      setCurrentLocation(defaultLocation);
      console.error('Geolocation is not supported by this browser.');
    }
  };
  useEffect(() => {
    // Set the ride type to "regular" for uniride.js
    rideManagerService.setCustomerRideType('regular');

    // Initialize socket connection
    rideManagerService.initializeSocket(userAuth);

    // Save socket info
    rideManagerService.saveSocketInfo();

    // Set up socket event listeners
    const cleanup = rideManagerService.setupSocketEventListeners({
      setComfirmBooking,
      setSelectRide,
      setIsBookingInProgress,
      setBookingRequestId,
      setAcceptDriverDetail,
      setDriverId,
      setRideStatus,
      setShowReview,
      setEndRideData,
    });

    // Get current ride status
    rideManagerService.getCurrentRideStatus(userAuth, {
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
    });

    // Get schedule ride detail
    rideManagerService.getScheduleRideDetail(userAuth, {
      setLoading,
      setSaveDateTime,
      setSelectedDate,
      setSelectedTime,
      setScheduleRideStatus,
    });

    // Get user current location
    rideManagerService.getUserCurrentLocation({
      setCurrentLocation,
      setCenterMapLocation,
      setMapLocationLabel,
      getAllCarsList: (location) =>
        rideManagerService.getAllCarsList(location, {
          setLoading,
          setCarsList,
          setCarStatus,
        }),
    });

    // Clean up socket event listeners on unmount
    return () => {
      cleanup();
    };
  }, [userAuth]);

  // Add a separate effect to handle location and car type changes
  useEffect(() => {
    if (currentLocation && carTypeId) {
      const requestData = {
        car_type: carTypeId,
        pickup_lat: currentLocation.lat,
        pickup_lng: currentLocation.lng,
      };
      socketHelpers.getDriverLocation(requestData);
    }
  }, [currentLocation, carTypeId]);
  useEffect(() => {
    getUserCurrentLoacation();
  }, [customerRideType]);

  // Add a function to cancel an ongoing booking request

  // Update the requestRide function
  const requestRide = async () => {
    if (isBookingInProgress) {
      toast.info('A booking request is already in progress. Please wait...');
      return;
    }

    try {
      setIsBookingInProgress(true);

      const rideData = {
        pickup_lat: currentLocation.lat,
        pickup_lng: currentLocation.lng,
        pickup_address: currentLocation.address,
        drop_lat: dropLocation.lat,
        drop_lng: dropLocation.lng,
        drop_address: dropLocation.address,
        car_type: selectedCarType,
        customer_id: userAuth.customer_id,
        token_code: userAuth.token_code,
        promo_code: promoCodeValue,
      };

      await rideManagerService.requestRide(rideData, router);
    } catch (error) {
      console.error('Error in requestRide:', error);
      toast.error(
        'An error occurred while requesting a driver. Please try again.',
      );
      setIsBookingInProgress(false);
    }
  };

  // Update the scheduleRide function
  const scheduleRide = async () => {
    try {
      const rideData = {
        pickup_lat: currentLocation.lat,
        pickup_lng: currentLocation.lng,
        pickup_address: currentLocation.address,
        drop_lat: dropLocation.lat,
        drop_lng: dropLocation.lng,
        drop_address: dropLocation.address,
        car_type: selectedCarType,
        customer_id: userAuth.customer_id,
        token_code: userAuth.token_code,
        promo_code: promoCodeValue,
        schedule_request_date: format(selectedDate, 'yyyy-MM-dd'),
        schedule_request_time: format(selectedTime, 'HH:mm:ss'),
      };

      await rideManagerService.scheduleRide(rideData, router);
    } catch (error) {
      console.error('Error in scheduleRide:', error);
      toast.error(
        'An error occurred while scheduling your ride. Please try again.',
      );
    }
  };

  // Update the cancelRide function
  const cancelRide = async () => {
    try {
      const rideData = {
        request_id: bookingRequestId,
        ride_id: acceptDriverDetail.ride_id,
        customer_id: userAuth.customer_id,
        token_code: userAuth.token_code,
      };

      await rideManagerService.cancelRide(rideData, router);
    } catch (error) {
      console.error('Error in cancelRide:', error);
      toast.error(
        'An error occurred while canceling your ride. Please try again.',
      );
    }
  };

  // Update the endRunningRide function
  const endRunningRide = async () => {
    try {
      const rideData = {
        request_id: bookingRequestId,
        ride_id: acceptDriverDetail.ride_id,
        driver_id: acceptDriverDetail.driver_id,
        ride_status: rideStatus,
        ride_type: rideManagerService.getCustomerRideType(),
        customer_id: userAuth.customer_id,
        token_code: userAuth.token_code,
      };

      await rideManagerService.endRunningRide(rideData, {
        setLoading,
        setSelectRide,
        setComfirmBooking,
        setInRRoute,
        setShowReview,
      });
    } catch (error) {
      console.error('Error in endRunningRide:', error);
      toast.error(
        'An error occurred while ending your journey. Please try again.',
      );
    }
  };

  // Update the applyCoupon function
  const applyCoupon = async () => {
    await rideManagerService.applyCoupon(promoCodeValue, userAuth);
  };

  return (
    <ThemeProvider>
      <Head>
        <title>Uniride</title>
        <meta name="description" content="Uniride " />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SpinnerLoader loading={loading} />
      <MessageModel
        open={scheduleMessage}
        close={closeScheduleMessage}
        handleAction={handleActionScheduleRide}
        message={scheduleMsg}
      />
      <Layout>
        {showReview === false ? (
          <InnerContent>
            <PannelSection>
              <RiderInfo
                carsList={carsList}
                handleSelectRide={handleSelectRide}
                setCustomerRideType={setCustomerRideType}
                handleComfirmBooking={handleComfirmBooking}
                proceedGenderModel={proceedGenderModel}
                handleGenderClose={handleGenderClose}
                handleInRoute={handleInRoute}
                selectRide={selectRide}
                comfirmBooking={comfirmBooking}
                comfirmBookingData={comfirmBookingData}
                inRoute={inRoute}
                genderModelOpen={genderModelOpen}
                handleCancelModelInfo={handleRideCancelModel}
                acceptDriverDetail={acceptDriverDetail}
                applyCoupon={applyCoupon}
                userAuth={userAuth}
                rideStatus={rideStatus}
                handleCancelRunningRide={handleCancelRunningRide}
                carTypeId={carTypeId}
                setCarTypeId={setCarTypeId}
                handleCarTypeId={handleCarTypeId}
                saveDateTime={saveDateTime}
                setSaveDateTime={setSaveDateTime}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                selectedTime={selectedTime}
                setSelectedTime={setSelectedTime}
                scheduleRideStatus={scheduleRideStatus}
                carStatus={carStatus}
                setAvgTime={setAvgTime}
                avgTime={avgTime}
                setAvailableDriver={setAvailableDriver}
                setPromotionId={setPromotionId}
                setCouponCode={setCouponCode}
                setCouponActive={setCouponActive}
                distance={distance}
                duration={duration}
                currentLocation={currentLocation}
              />
              <LocationValueModel
                open={openValueModel}
                handleCloseModel={closeValueModel}
                actionFavorite={handleFavoriteModelValue}
                locationType={locationType}
                dropPickLocation={getDropPickLocation}
                currentLocation={currentLocation}
                dropLocation={dropLocation}
              />
              <RightPannel>
                <LocationPickerMap
                  currentLocation={currentLocation}
                  dropCustomerLocation={dropLocation}
                  dropPickLocationType={dropPickLocationType}
                  centerMapLocation={centerMapLocation}
                  mapLocationLabel={mapLocationLabel}
                  driverLocation={driverLocation}
                  rideStatus={rideStatus}
                  locationType={locationType}
                  getDropPickLocation={getDropPickLocation}
                  comfirmBooking={comfirmBooking}
                  comfirmBookingData={comfirmBookingData}
                  selectRide={selectRide}
                  availableDriver={availableDriver}
                />
              </RightPannel>
            </PannelSection>
          </InnerContent>
        ) : (
          <Review
            endRideData={endRideData}
            userAuth={userAuth}
            acceptDriverDetail={acceptDriverDetail}
          />
        )}
      </Layout>
    </ThemeProvider>
  );
}
export async function getServerSideProps(context) {
  try {
    const session = await getSession(context);
    console.log('getServerSideProps session', session);
    if (!session || !session.user) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    // Check if user data exists
    if (!session.user.data) {
      console.error('No user data in session:', session.user);
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    // Check profile status - convert to string for comparison
    //const profileStatus = String(session.user.data.profile_status);

    // if (profileStatus !== "3") {
    //   // If profile status is 1, redirect to add-card
    //   if (profileStatus === "1") {
    //     return {
    //       redirect: {
    //         destination: "/add-card",
    //         permanent: false,
    //       },
    //     };
    //   }
    //   // If profile status is 2 or anything else, redirect to verification
    //   if (profileStatus === "2") {
    //     return {
    //       redirect: {
    //         destination: "/verification",
    //         permanent: false,
    //       },
    //     };
    //   }
    //   // For any other status, redirect to login
    //   return {
    //     redirect: {
    //       destination: "/login",
    //       permanent: false,
    //     },
    //   };
    // }

    // Ensure all required user data is present
    if (!session.user.data.customer_id || !session.user.data.token_code) {
      console.error('Missing required user data in session:', session.user);
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }
    return {
      props: {
        userAuth: {
          customer_id: session.user.data.customer_id,
          email: session.user.data.email || '',
          mobile_number: session.user.data.mobile_number || '',
          name: session.user.data.name || '',
          profile_status: session.user.data.profile_status || '',
          token_code: session.user.data.token_code,
        },
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
}
const PannelSection = styled.div`
  ${({ theme }) => `
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    min-height: 650px;

    @media (min-width: ${theme.breakpoints.values.md}px) {
      flex-wrap: nowrap;
    }
  `}
`;
const RightPannel = styled.div`
  ${({ theme }) => `
    position: relative;

    background-color: ${theme.colors.palette.white};
    width: 100%;
    box-shadow: 0px 0px 15px -1px rgba(0, 0, 0, 0.1);
    border-radius: 16px;
    overflow: hidden;
    padding: 2px;

    @media (min-width: ${theme.breakpoints.values.md}px) {
      border-radius: 16px 0px 16px 16px;
    }

    img {
      max-width: 100%;
      height: 100%;
      object-fit: cover;
    }
  `}
`;
