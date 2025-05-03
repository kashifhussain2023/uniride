import Layout from '@/components/common/Layout';
import LocationPickerMap from '@/components/common/LocationPickerMap';
import Review from '@/components/common/Review';
import RiderInfo from '@/components/common/RiderInfo';
import SpinnerLoader from '@/components/common/SpinnerLoader';
import LocationValueModel from '@/components/common/model/LocationValueModel';
import MessageModel from '@/components/common/model/MessageModel';
import InnerContent from '@/components/presentation/InnerContent';
import { socketEvents, socketHelpers, socketService } from '@/components/presentation/SocketEvents';
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
  const [customerRideType, setCustomerRideType] = useState('designated');
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [isBookingInProgress, setIsBookingInProgress] = useState(false);
  const [bookingRequestId, setBookingRequestId] = useState(null);
  const [_driverId, _setDriverId] = useState();
  const [_endRideData, _setEndRideData] = useState();
  const scheduleMsg =
    'Another ride is only possible after scheduled ride complete or scheduled ride cancel';

  const handleCarTypeId = carId => {
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
        } else if (response.status === 'FALSE' && response.message === 'Invalid token code') {
          toast.error(
            'Your account has been logged in on another device. Please login again to continue.'
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
        toast.error('An error occurred while processing your ride request. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      dropPickLocationType('drop');
    }
  };

  const dropPickLocationType = type => {
    setLocationType(type);
    setOpenValueModel(true);
  };

  const handleComfirmBooking = () => {
    setGenderModelOpen(true);
  };

  const handleGenderClose = () => {
    setGenderModelOpen(close);
  };

  const proceedGenderModel = async gender => {
    if (!userAuth) {
      toast.error('Please log in to continue');
      router.push('/login');
      return;
    }

    const resolvePaymentMethodId = () => {
      const defaultPaymentId = userAuth?.data?.default_payment_method?.payment_id;
      if (defaultPaymentId) return defaultPaymentId;

      const lastAddedCard = localStorage.getItem('lastAddedCard');
      return lastAddedCard ? JSON.parse(lastAddedCard)?.payment_id : null;
    };

    const paymentMethodId = resolvePaymentMethodId();

    if (!paymentMethodId) {
      toast.error('No payment method found. Please add a payment method first.');
      router.push('/cards/add');
      return;
    }

    const createBookingPayload = isScheduled => ({
      car_type: carTypeId,
      city_name: currentLocation.city,
      customer_id: userAuth.customer_id,
      distance,
      dropoff_lat: String(dropLocation.lat),
      dropoff_lng: String(dropLocation.lng),
      dropoff_name: String(dropLocation.address),
      gender,
      payment_method: paymentMethodId,
      pickup_lat: String(currentLocation.lat),
      pickup_lng: String(currentLocation.lng),
      pickup_name: String(currentLocation.address),
      promo_code: couponCode,
      promotion_id: promotionId,
      ride_type: customerRideType,
      ...(isScheduled && {
        schedule_date: format(new Date(selectedDate), 'yyyy-MM-dd'),
        schedule_time: format(new Date(selectedTime), 'HH:mm:ss'),
      }),
      time: duration,
    });

    const requestSentHandler = response => {
      console.log('Request sent successfully:', response);
      setComfirmBooking(false);
      setSelectRide(false);
      //setInRRoute(true);
      toast.success('Your ride request has been sent. Finding a driver...');
      if (response?.id) {
        setBookingRequestId(response.id);
      }
    };

    const emitBookingRequest = async payload => {
      try {
        setLoading(true);
        setGenderModelOpen(false);
        socketHelpers.onRequestSent(requestSentHandler);
        await socketHelpers.requestRide(payload);
      } catch (error) {
        console.error('Error during ride request:', error);
        toast.error('An error occurred while scheduling your ride. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (selectedDate && selectedTime) {
      await emitBookingRequest(createBookingPayload(true));
    } else {
      if (isBookingInProgress) {
        toast.info('A booking request is already in progress. Please wait...');
        return;
      }

      setIsBookingInProgress(true);
      await emitBookingRequest(createBookingPayload(false));
      setIsBookingInProgress(false);
    }
  };

  const handleInRoute = () => {
    //setInRRoute(true);
  };

  const handleRideCancelModel = async () => {
    try {
      setLoading(true);
      console.log({ handleRideCancelModel: acceptDriverDetail });

      const cancelRideData = {
        cancel_by: 'customer',
        ride_id: acceptDriverDetail.ride_id,
      };
      socketHelpers.cancelRide(cancelRideData);

      toast.success('Ride cancelled successfully');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Error in handleRideCancelModel:', error);
      toast.error('An error occurred while canceling your ride. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRunningRide = async () => {
    if (!userAuth) {
      toast.error('Please log in to continue');
      router.push('/login');
      return;
    }

    try {
      setLoading(true);
      const rideData = {
        customer_id: userAuth.customer_id,
        request_id: bookingRequestId,
        ride_id: acceptDriverDetail?.ride_id,
        token_code: userAuth.token_code,
      };

      await socketHelpers.cancelRide(rideData, router);
    } catch (error) {
      console.error('Error in handleCancelRunningRide:', error);
      toast.error('An error occurred while canceling your ride. Please try again.');
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
      }
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

  const getAllCarsList = async location => {
    setLoading(true);
    await socketHelpers.getAllCarsList(location, {
      setCarStatus,
      setCarsList,
      setLoading,
    });
  };
  const getUserCurrentLoacation = async () => {
    socketHelpers.getUserCurrentLocation({
      getAllCarsList,
      setCenterMapLocation,
      setCurrentLocation,
      setMapLocationLabel,
    });
  };

  const getCurrentRideStatus = async () => {
    const response = await api({
      headers: {
        'x-login-method': `jwt`,
      },
      method: 'GET',
      url: '/customer/get-profile-details',
    });

    console.log({ getCurrentRideStatus: response });

    if (response.data && response.data.onride !== '') {
      await socketHelpers.getCurrentRideStatus({
        ride_id: response.data.onride,
        setAcceptDriverDetail,
        setComfirmBooking,
        setCurrentLocation,
        setDriverId,
        setDriverLocation,
        setDropLocation,
        setInRRoute,
        setLoading,
        setRideStatus,
        setSelectRide,
        setShowReview,
      });
    }
  };

  const getScheduleRideDetail = async () => {
    await socketHelpers.getScheduleRideDetail(userAuth, {
      setLoading,
      setSaveDateTime,
      setScheduleRideStatus,
      setSelectedDate,
      setSelectedTime,
    });
  };

  const applyCoupon = async () => {
    await socketHelpers.applyCoupon(couponCode, userAuth);
  };

  useEffect(() => {
    // Set the ride type to regular
    socketHelpers.setCustomerRideType('designated');

    // Only initialize socket and fetch data if userAuth is available
    if (userAuth) {
      // Initialize socket connection
      socketHelpers.initializeSocket(userAuth);

      // Save socket info
      socketHelpers.saveSocketInfo();

      // Get user's current location
      getUserCurrentLoacation();

      // Get current ride status
      getCurrentRideStatus();

      // Get schedule ride detail
      //getScheduleRideDetail();

      // Set up socket event listeners
      socketHelpers.setupSocketEventListeners({
        setAcceptDriverDetail,
        setBookingRequestId,
        setComfirmBooking,
        setDriverId,
        setEndRideData,
        setInRRoute,
        setIsBookingInProgress,
        setRideStatus,
        setSelectRide,
        setShowReview,
      });

      // Add listener for car locations
      const carLocationsHandler = data => {
        console.log('Received car locations:', data);
        if (data && Array.isArray(data)) {
          setAvailableDriver(data);
        }
      };

      const unsubscribeCarLocations = socketHelpers.onCarLocations(carLocationsHandler);

      // Request driver locations when component mounts and when currentLocation or carTypeId changes
      if (currentLocation && carTypeId) {
        socketHelpers.requestDriverLocations(currentLocation, carTypeId);
      }

      // Clean up socket event listeners when component unmounts
      return () => {
        unsubscribeCarLocations();
      };
    }
  }, [userAuth]);

  // Add a separate effect to handle location and car type changes
  useEffect(() => {
    if (userAuth && currentLocation && carTypeId) {
      socketHelpers.requestDriverLocations(currentLocation, carTypeId);
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
