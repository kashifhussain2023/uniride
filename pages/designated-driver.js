import Layout from '@/components/common/Layout';
import LocationPickerMap from '@/components/common/LocationPickerMap';
import Review from '@/components/common/Review';
import RiderInfo from '@/components/common/RiderInfo';
import SpinnerLoader from '@/components/common/SpinnerLoader';
import LocationValueModel from '@/components/common/model/LocationValueModel';
import MessageModel from '@/components/common/model/MessageModel';
import InnerContent from '@/components/presentation/InnerContent';
import rideManagerService from '@/components/presentation/RideManagerService';
import rideSocketHandler from '@/components/presentation/RideSocketHandler';
import {
  socketEvents,
  socketHelpers,
  socketService,
} from '@/components/presentation/SocketEvents';
import ThemeProvider from '@/theme/ThemeProvider';
import { api } from '@/utils/api/register';
import styled from '@emotion/styled';
import { format } from 'date-fns';
import { signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useCarContext } from './context/CarListContext';

export default function Dashboard() {
  const router = useRouter();
  const { type, lat, lng, address } = router.query;
  const [location, setLocation] = useState(null);
  const { data: session, status } = useSession();
  const [userAuth, setUserAuth] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      if (status === 'loading') return;

      if (status === 'unauthenticated') {
        router.push('/login');
        return;
      }

      if (session?.user) {
        setUserAuth(session.user);
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [session, status, router]);

  useEffect(() => {
    if (type && lat && lng && address) {
      setLocation({
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        address: address,
      });
    }
  }, [type, lat, lng, address]);

  const [loading, setLoading] = useState(false);
  const [_errors, setErrors] = useState('');
  const { carsList, setCarsList } = useCarContext();
  const [currentLocation, setCurrentLocation] = useState({});
  const [dropLocation, setDropLocation] = useState(location || '');
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
  const [driverLocation, setDriverLocation] = useState();
  const [rideStatus, setRideStatus] = useState();
  const [_driverId, _setDriverId] = useState();
  const [showReview, setShowReview] = useState(false);
  const [_endRideData, _setEndRideData] = useState();
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
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [isBookingInProgress, setIsBookingInProgress] = useState(false);
  const [bookingRequestId, setBookingRequestId] = useState(null);
  //handle all component data
  const scheduleMsg =
    'Another ride is only possible after scheduled ride complete or scheduled ride cancel';

  const handleCarTypeId = (carId) => {
    setCarTypeId(carId);
  };

  const handleSelectRide = async (rideType) => {
    if (!userAuth) {
      toast.error('Please log in to continue.');
      router.push('/login');
      return;
    }

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
          pickup: String(currentLocation.address),
          pickup_lat: String(currentLocation.lat),
          pickup_lng: String(currentLocation.lng),
          dropoff: String(dropLocation.address),
          dropoff_lat: String(dropLocation.lat),
          dropoff_lng: String(dropLocation.lng),
          is_scheduled: false,
          distance: String(distance || '6.8'),
          time: String(duration || '22'),
          car_type_id: carTypeId,
          token_code: userAuth?.token_code || '',
          customer_id: userAuth?.customer_id || '',
        };

        const response = await api({
          url: '/socket/estimation-price',
          method: 'POST',
          data: rideNow,
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
          await signOut({ redirect: false });
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

  const applyCoupon = async () => {
    await rideManagerService.applyCoupon(couponCode, userAuth);
  };

  const dropPickLocationType = (type) => {
    setLocationType(type);
    setOpenValueModel(true);
  };
  const handleComfirmBooking = () => {
    setGenderModelOpen(true);
  };
  const handleGenderClose = () => {
    setGenderModelOpen(false);
  };

  const proceedGenderModel = async (gender) => {
    if (!userAuth) {
      toast.error('Please log in to continue.');
      router.push('/login');
      return;
    }

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
        formData.append('token_code', userAuth.token_code);

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
          pickup_lat: String(currentLocation.lat),
          pickup_lng: String(currentLocation.lng),
          pickup_name: String(currentLocation.address),
          dropoff_lat: String(dropLocation.lat),
          dropoff_lng: String(dropLocation.lng),
          dropoff_name: String(dropLocation.address),
          ride_type: 'designated',
          customer_id: userAuth.customer_id,
          car_type: carTypeId,
          gender: gender,
          promotion_id: promotionId,
          promo_code: couponCode,
          city_name: currentLocation.city,
          payment_method: paymentMethodId,
          distance: distance,
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
            setBookingRequestId(response.id);
          }
        };

        // Register all event handlers
        const unsubscribeRequestSent = socketService.on(
          socketEvents.REQUEST_SENT,
          requestSentHandler,
        );

        // Set a timeout to clean up event listeners if no response is received
        const cleanupTimeout = setTimeout(() => {
          unsubscribeRequestSent();
          setIsBookingInProgress(false);
        }, 60000);

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
    if (!userAuth) {
      toast.error('Please log in to continue.');
      router.push('/login');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('request_id', acceptDriverDetail.request_id);
      formData.append('ride_id', acceptDriverDetail.ride_id);
      formData.append('customer_id', userAuth.customer_id);
      formData.append('token_code', userAuth.token_code);
      const response = await api({
        url: '/customers/customer_cancel',
        method: 'POST',
        data: formData,
      });
      if (response.status === true) {
        setLoading(false);
        setSelectRide(true);
        setComfirmBooking(false);
        setInRRoute(false);
        toast.info(response.message);
        window.location.reload();
      } else if (response.status === 'FALSE') {
        toast.info(response.message);
      } else {
        toast.info(response.message);
      }
    } catch (error) {
      console.error('Error in handleRideCancelModel:', error);
      toast.error(
        'An error occurred while canceling your ride. Please try again.',
      );
      setLoading(false);
    }
  };
  const handleCancelRunningRide = async () => {
    if (!userAuth) {
      toast.error('Please log in to continue.');
      router.push('/login');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('request_id', acceptDriverDetail.request_id);
      formData.append('ride_id', acceptDriverDetail.ride_id);
      formData.append('driver_id', _driverId);
      formData.append('ride_status', acceptDriverDetail.ride_status);
      formData.append('ride_type', acceptDriverDetail.ride_type);
      formData.append('customer_id', userAuth.customer_id);
      formData.append('token_code', userAuth.token_code);
      const response = await api({
        url: '/customers/end_journey_by_customer',
        method: 'POST',
        data: formData,
      });
      if (response.status === true) {
        setLoading(false);
        setSelectRide(true);
        setComfirmBooking(false);
        setInRRoute(false);
        toast.info(response.message);
        setShowReview(true);
      } else if (response.status === 'FALSE') {
        setLoading(false);
        toast.info(response.message);
      } else {
        setLoading(false);
        toast.info(response.message);
      }
    } catch (error) {
      console.error('Error in handleCancelRunningRide:', error);
      toast.error(
        'An error occurred while ending your journey. Please try again.',
      );
      setLoading(false);
    }
  };
  const handleFavoriteModelValue = () => {
    router.push(
      {
        pathname: '/favoriteDestination',
        query: {
          page: 'designated-driver',
          type: locationType,
          page: 'designated-driver',
        },
      },
      undefined,
      // Empty 'as' parameter
      {
        shallow: true,
      }, // Use the 'shallow' option to preserve the URL
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

  const getAllCarsList = async (location) => {
    setLoading(true);
    await rideManagerService.getAllCarsList(location, {
      setLoading,
      setCarsList,
      setCarStatus,
    });
  };
  const getUserCurrentLoacation = () => {
    rideManagerService.getUserCurrentLocation({
      setCurrentLocation,
      setCenterMapLocation,
      setMapLocationLabel,
      getAllCarsList,
    });
  };

  const getCurrentRideStatus = async () => {
    await rideManagerService.getCurrentRideStatus(userAuth, {
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
      _setDriverId,
    });
  };

  const getScheduleRideDetail = async () => {
    await rideManagerService.getScheduleRideDetail(userAuth, {
      setLoading,
      setSaveDateTime,
      setSelectedDate,
      setSelectedTime,
      setScheduleRideStatus,
    });
  };
  useEffect(() => {
    // Set the ride type to designated
    rideManagerService.setCustomerRideType('designated');

    // Only initialize socket and fetch data if userAuth is available
    if (userAuth) {
      // Initialize socket connection
      rideManagerService.initializeSocket(userAuth);

      // Save socket info
      rideManagerService.saveSocketInfo();

      // Get user's current location
      getUserCurrentLoacation();

      // Get current ride status
      getCurrentRideStatus();

      // Get schedule ride detail
      getScheduleRideDetail();

      // Set up socket event listeners
      const cleanup = rideManagerService.setupSocketEventListeners({
        setComfirmBooking,
        setSelectRide,
        setInRRoute,
        setIsBookingInProgress,
        setBookingRequestId,
        setAcceptDriverDetail,
        _setDriverId,
        setRideStatus,
        setShowReview,
        _setEndRideData,
      });

      // Add listener for car locations
      const carLocationsHandler = (data) => {
        console.log('Received car locations:', data);
        if (data && Array.isArray(data)) {
          setAvailableDriver(data);
        }
      };

      const unsubscribeCarLocations =
        socketHelpers.onCarLocations(carLocationsHandler);

      // Request driver locations when component mounts and when currentLocation or carTypeId changes
      if (currentLocation && carTypeId) {
        rideManagerService.requestDriverLocations(currentLocation, carTypeId);
      }

      // Clean up socket event listeners when component unmounts
      return () => {
        cleanup();
        unsubscribeCarLocations();
      };
    }
  }, [userAuth]);

  // Add a separate effect to handle location and car type changes
  useEffect(() => {
    if (userAuth && currentLocation && carTypeId) {
      rideManagerService.requestDriverLocations(currentLocation, carTypeId);
    }
  }, [currentLocation, carTypeId, userAuth]);

  return (
    <ThemeProvider>
      <Head>
        <title>Uniride</title>
        <meta name="description" content="Uniride " />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SpinnerLoader loading={loading || isLoading} />
      <MessageModel
        open={scheduleMessage}
        close={closeScheduleMessage}
        handleAction={handleActionScheduleRide}
        message={scheduleMsg}
      />

      <Layout>
        {isLoading ? (
          <div>Loading...</div>
        ) : userAuth ? (
          showReview === false ? (
            <InnerContent>
              <PannelSection>
                <RiderInfo
                  carsList={carsList}
                  handleSelectRide={handleSelectRide}
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
                  handleCarTypeId={handleCarTypeId}
                  isAddDesignated={true}
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
              endRideData={_endRideData}
              userAuth={userAuth}
              acceptDriverDetail={acceptDriverDetail}
            />
          )
        ) : (
          <div>Please log in to access this page.</div>
        )}
      </Layout>
    </ThemeProvider>
  );
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
