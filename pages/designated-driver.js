import Layout from "@/components/common/Layout";
import LocationPickerMap from "@/components/common/LocationPickerMap";
import Review from "@/components/common/Review";
import RiderInfo from "@/components/common/RiderInfo";
import SpinnerLoader from "@/components/common/SpinnerLoader";
import LocationValueModel from "@/components/common/model/LocationValueModel";
import InnerContent from "@/components/presentation/InnerContent";
import socket from "@/components/presentation/Socket";
import ThemeProvider from "@/theme/ThemeProvider";
import { api } from "@/utils/api/register";
import styled from "@emotion/styled";
import { getSession, signOut } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useCarContext } from "./context/CarListContext";
import MessageModel from "@/components/common/model/MessageModel";
import { parse, format } from "date-fns";

export default function Dashboard({ userAuth }) {
  const router = useRouter();
  const { type, lat, lng, address } = router.query;
  let location = "";

  if (type && lat && lng && address) {
    location = {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      address: address,
    };
  }

  const [loading, setLoading] = useState(false);
  const { carsList, setCarsList } = useCarContext();
  const [currentLocation, setCurrentLocation] = useState({});
  const [dropLocation, setDropLocation] = useState(location || "");
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
  //handle all component data
  const scheduleMsg =
    "Another ride is only possible after scheduled ride complete or scheduled ride cancel";
    
  const handleCarTypeId = (carId) => {
    setCarTypeId(carId);
  };

  const handleSelectRide = async (rideType) => {
    if (scheduleRideStatus) {
      setScheduleMessage(true);
      return;
    }
    if (carStatus === false) {
      toast.error("UniRide doesn't operate in your area.");
      return;
    }

    if (availableDriver.length <= 0) {
      toast.error("no cars available.");
      return;
    }

    if (currentLocation !== "" && dropLocation !== "") {
      setLoading(true);
      const formData = new FormData();
      formData.append("car_type", carTypeId);
      formData.append("destination_Location_Name", dropLocation.address);
      formData.append("destination_point_lat", dropLocation.lat);
      formData.append("destination_point_long", dropLocation.lng);
      formData.append("picking_Location_Name", currentLocation.address);
      formData.append("picking_point_lat", currentLocation.lat);
      formData.append("picking_point_long", currentLocation.lng);
      formData.append("customer_id", userAuth.customer_id);
      formData.append("token_code", userAuth.token_code);
      formData.append("ride_type", "designated");

      const response = await api({
        url: "/customers/request_information",
        method: "POST",
        data: formData,
      });

      if (response.status === true) {
        setComfirmBooking(true);
        setSelectRide(false);
        setLoading(false);
        setComfirmBookingData(response.data);
      } else if (
        response.status === "FALSE" &&
        response.message === "Invalid token code"
      ) {
        toast.error(
          "Your account has been logged in on another device.Please login again to continue."
        );
        await signOut({ redirect: false });
        router.push("/login");
      } else if (response.status === "FALSE") {
        toast.error(response.message);
        setLoading(false);
      } else {
        setLoading(false);
        toast.error(response.message);
      }
    } else {
      dropPickLocationType("drop");
      setOpenValueModel(true);
    }
  };

  const applyCoupon = async (promoCodeValue) => {
    if (!promoCodeValue || promoCodeValue.trim() === "") {
      setErrors("Please enter promo code");
    } else {
      setLoading(true);
      const formData = new FormData();
      formData.append("promo_code", promoCodeValue);
      formData.append("customer_id", userAuth.customer_id);
      formData.append("token_code", userAuth.token_code);
      const response = await api({
        url: "/customers/promo_code_validation",
        method: "POST",
        data: formData,
      });
      if (response.status === true) {
        setLoading(false);
        setComfirmBookingData(response.data);
      } else if (
        response.status === "FALSE" &&
        (response.code === 2 || response.code === 4)
      ) {
        toast.error(response.message);
        setLoading(false);
      } else {
        setLoading(false);
      }
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
      setLoading(true);
      setGenderModelOpen(false);
      const formData = new FormData();
      if (couponActive) {
        formData.append("promo_code", couponCode);
        formData.append("promotion_id", promotionId);
      }
      formData.append("car_type", carTypeId);
      formData.append(
        "schedule_date",
        format(new Date(selectedDate), "yyyy-MM-dd")
      );
      formData.append(
        "schedule_time",
        format(new Date(selectedTime), "HH:mm:ss")
      );
      formData.append("destination_Location_Name", dropLocation.address);
      formData.append("destination_point_lat", dropLocation.lat);
      formData.append("destination_point_long", dropLocation.lng);
      formData.append("picking_Location_Name", currentLocation.address);
      formData.append("picking_point_lat", currentLocation.lat);
      formData.append("picking_point_long", currentLocation.lng);
      formData.append("ride_type", "designated");
      formData.append("gender", gender);
      formData.append("payment_type", 1);
      formData.append("customer_id", userAuth.customer_id);
      formData.append("token_code", userAuth.token_code);
      const response = await api({
        url: "/customers/new_schedule_ride_request",
        method: "POST",
        data: formData,
      });

      if (response.status === true) {
        setLoading(false);
        toast.info(response.message);
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else if (
        response.status === "FALSE" &&
        response.message === "Invalid token code"
      ) {
        toast.error(
          "Your account has been logged in on another device.Please login again to continue."
        );
        await signOut({ redirect: false });
        router.push("/login");
      } else if (response.status === "FALSE") {
        setLoading(false);
        toast.info(response.message);
      } else {
        setLoading(false);
        toast.info(response.message);
      }
    } else {
      setLoading(true);
      setGenderModelOpen(false);
      const formData = new FormData();
      if (couponActive) {
        formData.append("promo_code", couponCode);
        formData.append("promotion_id", promotionId);
      }
      formData.append("car_type", carTypeId);
      formData.append("destination_Location_Name", dropLocation.address);
      formData.append("destination_point_lat", dropLocation.lat);
      formData.append("destination_point_long", dropLocation.lng);
      formData.append("picking_Location_Name", currentLocation.address);
      formData.append("picking_point_lat", currentLocation.lat);
      formData.append("picking_point_long", currentLocation.lng);
      formData.append("ride_type", "designated");
      formData.append("gender", gender);
      formData.append("payment_type", 1);
      formData.append("customer_id", userAuth.customer_id);
      formData.append("token_code", userAuth.token_code);
      const response = await api({
        url: "/customers/request_driver",
        method: "POST",
        data: formData,
      });

      if (response.status === true && response.code === 200) {
      } else if (response.status === false && response.code === 200) {
        setLoading(false);
        setComfirmBooking(false);
        setSelectRide(true);
        toast.info(response.message);
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else if (response.status === false && response.code === 417) {
        setLoading(false);
        toast.info(response.message);
        router.push("/addPaymentInfo");
      } else {
        setLoading(false);
        toast.info(response.message);
      }
    }
  };

  const handleInRoute = () => {
    setInRRoute(true);
  };
  
  const handleRideCancelModel = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("request_id", acceptDriverDetail.request_id);
    formData.append("ride_id", acceptDriverDetail.ride_id);
    formData.append("customer_id", userAuth.customer_id);
    formData.append("token_code", userAuth.token_code);
    const response = await api({
      url: "/customers/customer_cancel",
      method: "POST",
      data: formData,
    });

    if (response.status === true) {
      setLoading(false);
      setSelectRide(true);
      setComfirmBooking(false);
      setInRRoute(false);
      toast.info(response.message);
      window.location.reload();
    } else if (response.status === "FALSE") {
      toast.info(response.message);
    } else {
      toast.info(response.message);
    }
  };

  const handleCancelRunningRide = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("request_id", acceptDriverDetail.request_id);
    formData.append("ride_id", acceptDriverDetail.ride_id);
    formData.append("driver_id", driverId);
    formData.append("ride_status", acceptDriverDetail.ride_status);
    formData.append("ride_type", acceptDriverDetail.ride_type);
    formData.append("customer_id", userAuth.customer_id);
    formData.append("token_code", userAuth.token_code);
    const response = await api({
      url: "/customers/end_journey_by_customer",
      method: "POST",
      data: formData,
    });

    if (response.status === true) {
      setLoading(false);
      setSelectRide(true);
      setComfirmBooking(false);
      setInRRoute(false);
      toast.info(response.message);
      setShowReview(true);
    } else if (response.status === "FALSE") {
      setLoading(false);
      toast.info(response.message);
    } else {
      setLoading(false);
      toast.info(response.message);
    }
  };

  const handleFavoriteModelValue = () => {
    router.push(
      {
        pathname: "/favoriteDestination",
        query: {
          type: locationType,
          page: "designated-driver",
        },
      },
      undefined, // Empty 'as' parameter
      { shallow: true } // Use the 'shallow' option to preserve the URL
    );
  };

  const handleActionScheduleRide = () => {
    router.push("/schedule-ride");
  };

  const closeScheduleMessage = () => {
    setScheduleMessage(false);
  };
  
  const getDropPickLocation = (location) => {
    if (locationType === "pickup") {
      getAllCarsList(location);
      setCurrentLocation(location);
      setCenterMapLocation(location);
      setMapLocationLabel("Pickup");
    } else if (locationType === "drop") {
      setDropLocation(location);
      setCenterMapLocation(location);
      setMapLocationLabel("Drop");
    } else {
      getAllCarsList(location);
      setCurrentLocation(location);
      setCenterMapLocation(location);
      setMapLocationLabel("Pickup");
    }
  };

  const closeValueModel = () => {
    setOpenValueModel(false);
  };

  const getAllCarsList = async (location) => {
    const session = await getSession();

    const formData = new FormData();
    formData.append("os", 1);
    formData.append("lat", location.lat);
    formData.append("lng", location.lng);
    formData.append("ride_type", "designated");
    formData.append("customer_id", session.user.customer_id);
    formData.append("check_city", true);
    formData.append("token_code", session.user.token_code);
    const response = await api({
      url: "/common/get_cars",
      method: "POST",
      data: formData,
    });

    if (response.status === true) {
      setCarStatus(true);
      setCarsList(response.data.cars);
      const defaultCars = response.data.cars?.filter(
        (car) => car.default_car === true && car.is_corporate === "0"
      );
      if (defaultCars) {
        setCarTypeId(defaultCars[0].id);
        setAvgTime(defaultCars[0].avg_time);
        setAvailableDriver(defaultCars[0].drivers);
      }
      setLoading(false);
    } else if (response.message == "Invalid token code") {
      await signOut({ redirect: false });
      router.push("/login");
    } else {
      setLoading(false);
      setCarStatus(false);
    }
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
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${userLocation.lat},${userLocation.lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
            );
            const data = await response.json();
            if (data.status === "OK" && data.results.length > 0) {
              const address = data.results[0].formatted_address;
              userLocation.address = address;
            }
          } catch (error) {
            console.error("Error fetching address:", error);
          }
          getAllCarsList(userLocation);
          setCurrentLocation(userLocation);
          setCenterMapLocation(userLocation);
          setMapLocationLabel("Pickup");
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      const defaultLocation = {
        lat: 26.8548662,
        lng: 75.8242966,
      };
      setCurrentLocation(defaultLocation);
      console.error("Geolocation is not supported by this browser.");
    }
  };
  const getCurrentRideStatus = async () => {
    setLoading(true);
    const formData = new FormData();

    formData.append("customer_id", userAuth.customer_id);
    formData.append("token_code", userAuth.token_code);
    const response = await api({
      url: "/customers/ride_completeness",
      method: "POST",
      data: formData,
    });

    if (
      response.status === true &&
      response.message === "Tip is not given for this ride"
    ) {
      setShowReview(true);
      setLoading(false);
      // /setCurrentRideResponse(response);
    } else if (
      response.status === true &&
      response.message === "Driver is not arrived"
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
    } else if (
      response.status === true &&
      response.message === "Driver arrived at the the pick up location"
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
    } else if (
      response.status === true &&
      response.message === "Journey started"
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
    } else if (response.status === true) {
      setShowReview(false);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };
  const getScheduleRideDetail = async () => {
    setLoading(true);
    const formData = new FormData();

    formData.append("customer_id", userAuth.customer_id);
    formData.append("token_code", userAuth.token_code);
    const response = await api({
      url: "/customers/schedule_ride_detail",
      method: "POST",
      data: formData,
    });
    if (response.code === 200 && response.status === true) {
      setLoading(false);
      setSaveDateTime(true);
      setSelectedDate(
        parse(response.data[0].schedule_request_date, "yyyy-MM-dd", new Date())
      );
      setSelectedTime(
        parse(response.data[0].schedule_request_time, "HH:mm:ss", new Date())
      );
      setScheduleRideStatus(true);
    } else {
      setLoading(false);
      setScheduleRideStatus(false);
    }
  };

  useEffect(() => {
    //getAllCarsList();
    getUserCurrentLoacation();
    getCurrentRideStatus();
    getScheduleRideDetail();
    const params = {
      user_id: userAuth.customer_id, // Replace with your user ID logic
      user_type: "customer", // Replace with your user type logic
      auth_token: userAuth.token_code,
      device_id: "fjsndfjdsfnsdkjfnskdfnsd",
      device_type: "ios",
    };
    //socket.emit("add_user", params);
    const handleTrackRide = (response) => {
      if (response.status === true && response.code === 2) {
        setLoading(false);
        setAcceptDriverDetail(response.data);
        setRideStatus(response.data.ride_status);
        setDriverId(response.data.driver_id);
        setDriverLocation({
          lat: parseFloat(response.data.driver_latitude),
          lng: parseFloat(response.data.driver_longitude),
        });
        setComfirmBooking(false);
        setInRRoute(true);
      } else if (response.status === "FALSE" && response.code === 3) {
        setLoading(false);
        setComfirmBooking(false);
        setSelectRide(true);
        toast.info(response.message);
        router.push("/uniride");
      } else if (response.status === true && response.code === 5) {
        setAcceptDriverDetail(response.data);
        setRideStatus(response.data.ride_status);
        toast.info(response.message);
      } else if (response.status === true && response.code === 6) {
        setRideStatus(response.data.ride_status);
        setAcceptDriverDetail(response.data);
        toast.info(response.message);
      } else if (response.status === true && response.code === 7) {
        setShowReview(true);
        setEndRideData(response.data);
        toast.info(response.message);
      } else {
        setLoading(false);
        setComfirmBooking(false);
        setSelectRide(true);
        toast.info(response.message);
        router.push("/uniride");
      }
    };
    const handleDriverLocation = (responseLocation) => {
      if (responseLocation && responseLocation.length > 0) {
        // Assuming driver_id is unique, check if the driver is not already in the array
        const newDriver = responseLocation[0];
        if (
          !availableDriver.some(
            (driver) => driver.driver_id === newDriver.driver_id
          )
        ) {
          setAvailableDriver((prevDrivers) => [...prevDrivers, newDriver]);
        }
      }
      setDriverLocation({
        lat: parseFloat(responseLocation[0].lat),
        lng: parseFloat(responseLocation[0].lng),
      });
    };
    const handleDriverOutOfRange = (responseOutOfRange) => {
      if (responseOutOfRange && responseOutOfRange.length > 0) {
        // Remove the driver with the specified driver_id from availableDriver array
        const newDriver = responseOutOfRange[0];
        setAvailableDriver((prevDrivers) =>
          prevDrivers.filter(
            (driver) => driver.driver_id !== newDriver.driver_id
          )
        );
      }
    };
    const handleUpdateDriverLocation = (responseLocation) => {};
    // socket.on("track_ride", handleTrackRide);
    // socket.on("driver_location", handleDriverLocation);
    // socket.on("update_driver_location", handleUpdateDriverLocation);
    // socket.on("driver_out_of_range", handleDriverOutOfRange);

    // return () => {
    //   socket.off("track_ride", handleTrackRide);
    //   socket.off("driver_location", handleDriverLocation);
    //   socket.on("update_driver_location", handleUpdateDriverLocation);
    //   socket.off("driver_out_of_range", handleDriverOutOfRange);
    // };
  }, []);
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
              />
              <LocationValueModel
                open={openValueModel}
                handleCloseModel={closeValueModel}
                actionFavorite={handleFavoriteModelValue}
                locationType={locationType}
                dropPickLocation={getDropPickLocation}
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
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      userAuth: session.user || null,
    },
  };
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
