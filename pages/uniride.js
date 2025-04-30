import Layout from "@/components/common/Layout";
import LocationPickerMap from "@/components/common/LocationPickerMap";
import Review from "@/components/common/Review";
import RiderInfo from "@/components/common/RiderInfo";
import SpinnerLoader from "@/components/common/SpinnerLoader";
import LocationValueModel from "@/components/common/model/LocationValueModel";
import InnerContent from "@/components/presentation/InnerContent";
import socket, {
  socketEvents,
  socketHelpers,
  socketService,
} from "@/components/presentation/Socket";
import ThemeProvider from "@/theme/ThemeProvider";
import { api } from "@/utils/api/register";
import styled from "@emotion/styled";
import { signOut, getSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useCarContext } from "./context/CarListContext";
import MessageModel from "@/components/common/model/MessageModel";
import { format, parse } from "date-fns";

export default function Dashboard({ userAuth }) {
  const router = useRouter();
  const { type, lat, lng, address } = router.query;

  let dLocation = "";
  let pLocation = "";

  if (type === "drop" && lat && lng && address) {
    dLocation = {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      address: address,
    };
  }
  if (type === "pickup" && lat && lng && address) {
    pLocation = {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      address: address,
    };
  }

  const [loading, setLoading] = useState(false);
  const { carsList, setCarsList } = useCarContext();
  const [currentLocation, setCurrentLocation] = useState(dLocation || "");
  const [dropLocation, setDropLocation] = useState(dLocation || "");
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
  const [driverLocation, setDriverLocation] = useState("");
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
  const [customerRideType, setCustomerRideType] = useState("regular");
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [isBookingInProgress, setIsBookingInProgress] = useState(false);
  const [bookingRequestId, setBookingRequestId] = useState(null);

  const scheduleMsg =
    "Another ride is only possible after scheduled ride complete or scheduled ride cancel";

  const handleCarTypeId = (carId) => {
    setCarTypeId(carId);

    // Request driver locations when car type changes
    if (currentLocation && carId) {
      const requestData = {
        pickup_lat: currentLocation.lat,
        pickup_lng: currentLocation.lng,
        car_type: carId,
      };

      socketHelpers.getDriverLocation(requestData);
    }
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

    if (availableDriver && availableDriver.length <= 0) {
      toast.error("No cars available.");
      return;
    }

    if (currentLocation !== "" && dropLocation !== "") {
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
          distance: String(distance || "6.8"),
          time: String(duration || "22"),
          car_type_id: carTypeId,
        };

        const response = await api({
          url: "/socket/estimation-price",
          method: "POST",
          data: rideNow,
        });

        if (response.status === true) {
          setComfirmBooking(true);
          setSelectRide(false);
          setComfirmBookingData(response.data);
        } else if (
          response.status === "FALSE" &&
          response.message === "Invalid token code"
        ) {
          toast.error(
            "Your account has been logged in on another device. Please login again to continue."
          );
          await signOut({ redirect: false });
          router.push("/login");
        } else {
          toast.error(response.message || "Failed to request ride information");
        }
      } catch (error) {
        console.error("Error in handleSelectRide:", error);
        toast.error(
          "An error occurred while processing your ride request. Please try again."
        );
      } finally {
        setLoading(false);
      }
    } else {
      dropPickLocationType("drop");
    }
  };

  const applyCoupon = async (promoCodeValue) => {
    if (!promoCodeValue || promoCodeValue.trim() === "") {
      toast.error("Please enter promo code");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("promo_code", promoCodeValue);
      formData.append("customer_id", userAuth.customer_id);

      const response = await api({
        url: "/customers/promo_code_validation",
        method: "POST",
        data: formData,
      });

      if (response.status === true) {
        toast.success(response.message);
      } else if (
        response.status === "FALSE" &&
        (response.code === 2 || response.code === 4)
      ) {
        toast.error(response.message);
      } else {
        toast.error(response.message || "Failed to validate promo code");
      }
    } catch (error) {
      console.error("Error in applyCoupon:", error);
      toast.error(
        "An error occurred while applying the promo code. Please try again."
      );
    } finally {
      setLoading(false);
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
        setIsBookingInProgress(true);

        const formattedData = {
          schedule_date: format(new Date(selectedDate), 'yyyy-MM-dd'),
          schedule_time: format(new Date(selectedTime), 'HH:mm'),
        };

        const session = await getSession();
        let paymentMethodId;

        if (session?.user?.data?.default_payment_method?.payment_id) {
          paymentMethodId = session.user.data.default_payment_method.payment_id;
        } else {
          // If not in session, try to get from localStorage
          const lastAddedCard = localStorage.getItem("lastAddedCard");
          if (lastAddedCard) {
            const cardInfo = JSON.parse(lastAddedCard);
            paymentMethodId = cardInfo.payment_id;
          }
        }

        if (!paymentMethodId) {
          toast.error(
            "No payment method found. Please add a payment method first."
          );
          router.push("/cards/add");
          return;
        }

        const bookingPayload = {
          pickup_lat: String(currentLocation.lat),
          pickup_lng: String(currentLocation.lng),
          pickup_name: String(currentLocation.address),
          dropoff_lat: String(dropLocation.lat),
          dropoff_lng: String(dropLocation.lng),
          dropoff_name: String(dropLocation.address),
          ride_type: customerRideType,
          customer_id: userAuth.customer_id,
          car_type: carTypeId,
          gender: gender,
          promotion_id: promotionId,
          promo_code: couponCode,
          city_name: currentLocation.city,
          payment_method: paymentMethodId,
          distance: distance,
          time: duration,
          schedule_date: formattedData.schedule_date,
          schedule_time: formattedData.schedule_time,
        };

        const scheduleRequestSentHandler = (response) => {
          setComfirmBooking(false);
          setSelectRide(false);
          setInRRoute(true);
          toast.success("Your ride request has been sent. Finding a driver...");

          // Store the request ID for future reference
          if (response && response.id) {
            setBookingRequestId(response.id);
          }
        };

        const unsubscribeRequestSent = socketService.on(
          socketEvents.SCHEDULE_REQUEST_SENT,
          scheduleRequestSentHandler
        );

        const cleanupTimeout = setTimeout(() => {
          unsubscribeRequestSent();
          setIsBookingInProgress(false);
        }, 60000); // 1 minute timeout

        // socketHelpers.requestScheduleRideDetails(bookingPayload)
        socketHelpers
          .requestSendBooking(bookingPayload)
          .then((response) => {
            clearTimeout(cleanupTimeout);
          })
          .catch((error) => {
            console.error("Error sending booking request:", error);
            clearTimeout(cleanupTimeout);
            setComfirmBooking(true);
            setSelectRide(false);
            toast.error("Failed to send booking request. Please try again.");
            setIsBookingInProgress(false);
          })
          .finally(() => {
            setLoading(false);
          });
      } catch (error) {
        console.error("Error in proceedGenderModel:", error);
        toast.error(
          "An error occurred while requesting a driver. Please try again."
        );
        setLoading(false);
        setIsBookingInProgress(false);
      }
    } else {
      // Check if a booking request is already in progress
      if (isBookingInProgress) {
        toast.info("A booking request is already in progress. Please wait...");
        return;
      }

      try {
        setLoading(true);
        setGenderModelOpen(false);
        setIsBookingInProgress(true);

        const session = await getSession();
        let paymentMethodId;

        // Try to get payment method from session first
        if (session?.user?.data?.default_payment_method?.payment_id) {
          paymentMethodId = session.user.data.default_payment_method.payment_id;
        } else {
          // If not in session, try to get from localStorage
          const lastAddedCard = localStorage.getItem("lastAddedCard");
          if (lastAddedCard) {
            const cardInfo = JSON.parse(lastAddedCard);
            paymentMethodId = cardInfo.payment_id;
          }
        }

        if (!paymentMethodId) {
          toast.error(
            "No payment method found. Please add a payment method first."
          );
          router.push("/cards/add");
          return;
        }

        const bookingPayload = {
          pickup_lat: String(currentLocation.lat),
          pickup_lng: String(currentLocation.lng),
          pickup_name: String(currentLocation.address),
          dropoff_lat: String(dropLocation.lat),
          dropoff_lng: String(dropLocation.lng),
          dropoff_name: String(dropLocation.address),
          ride_type: customerRideType,
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

        // Set up event listeners for booking responses
        const requestSentHandler = (response) => {
          setComfirmBooking(false);
          setSelectRide(false);
          setInRRoute(true);
          toast.success("Your ride request has been sent. Finding a driver...");

          // Store the request ID for future reference
          if (response && response.id) {
            setBookingRequestId(response.id);
          }
        };

        const scheduleRequestSentHandler = (response) => {
          setComfirmBooking(false);
          setSelectRide(false);
          toast.success("Your scheduled ride request has been sent.");
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        };

        const noDriverFoundHandler = (response) => {
          setComfirmBooking(true);
          setSelectRide(false);
          toast.error("No drivers found in your area. Please try again later.");
          setIsBookingInProgress(false);
        };

        const errorHandler = (error) => {
          console.error("Error in booking request:", error);
          setComfirmBooking(true);
          setSelectRide(false);
          toast.error(
            error.message ||
              "An error occurred while requesting a ride. Please try again."
          );
          setIsBookingInProgress(false);
        };

        const driverAcceptedHandler = (response) => {
          setAcceptDriverDetail(response);
          setDriverId(response.driver_id);
          setRideStatus(2); // Driver is on the way
          toast.success("A driver has accepted your ride request!");
          setIsBookingInProgress(false);
        };

        const driverRejectedHandler = (response) => {
          toast.info(
            "A driver declined your ride request. Finding another driver..."
          );
        };

        // Register all event handlers
        const unsubscribeRequestSent = socketService.on(
          socketEvents.REQUEST_SENT,
          requestSentHandler
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
            clearTimeout(cleanupTimeout);
          })
          .catch((error) => {
            console.error("Error sending booking request:", error);
            clearTimeout(cleanupTimeout);
            setComfirmBooking(true);
            setSelectRide(false);
            toast.error("Failed to send booking request. Please try again.");
            setIsBookingInProgress(false);
          })
          .finally(() => {
            setLoading(false);
          });
      } catch (error) {
        console.error("Error in proceedGenderModel:", error);
        toast.error(
          "An error occurred while requesting a driver. Please try again."
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
        setSelectRide(true);
        setComfirmBooking(false);
        setInRRoute(false);
        toast.success(response.message);
        const params = {
          customer_id: userAuth.customer_id,
          user_type: "customer",
          request_id: acceptDriverDetail.request_id,
          auth_token: userAuth.token_code,
          token_code: userAuth.token_code,
        };
        socketHelpers.cancel_ride(params);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast.error(response.message || "Failed to cancel ride");
      }
    } catch (error) {
      console.error("Error in handleRideCancelModel:", error);
      toast.error(
        "An error occurred while canceling your ride. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRunningRide = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("request_id", acceptDriverDetail.request_id);
      formData.append("ride_id", acceptDriverDetail.ride_id);
      formData.append("driver_id", driverId);
      formData.append("ride_status", rideStatus);
      formData.append("ride_type", acceptDriverDetail.ride_type);
      formData.append("customer_id", userAuth.customer_id);
      formData.append("token_code", userAuth.token_code);

      const response = await api({
        url: "/customers/end_journey_by_customer",
        method: "POST",
        data: formData,
      });

      if (response.status === true) {
        setSelectRide(true);
        setComfirmBooking(false);
        setInRRoute(false);
        toast.success(response.message);
        setShowReview(true);
      } else {
        toast.error(response.message || "Failed to end journey");
      }
    } catch (error) {
      console.error("Error in handleCancelRunningRide:", error);
      toast.error(
        "An error occurred while ending your journey. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteModelValue = () => {
    router.push(
      {
        pathname: "/favoriteDestination",
        query: {
          type: locationType,
          page: "uniride",
        },
      },
      undefined,
      { shallow: true }
    );
  };

  const handleActionScheduleRide = () => {
    router.push("/schedule-ride");
  };

  const closeScheduleMessage = () => {
    setScheduleMessage(false);
  };

  const getDropPickLocation = (location, distanceValue, durationValue) => {
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

    const response = await api({
      url: "/customer/car-types",
      method: "GET",
      headers: {
        "x-login-method": `jwt`,
      },
    });

    setLoading(false);

    if (response.status === true) {
      setCarsList(response.data);
      setCarStatus(true);
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
          getAllCarsList(pLocation || userLocation);
          setCurrentLocation(pLocation || userLocation);
          setCenterMapLocation(pLocation || userLocation);
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
      setDriverId(response.driver_id);
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
      setDriverId(response.driver_id);
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
      setDriverId(response.driver_id);
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
    getUserCurrentLoacation();
    // getCurrentRideStatus();
    // getScheduleRideDetail();

    // Initialize socket with auth token
    const initializeSocket = async () => {
      try {
        //const session = await getSession();

        if (userAuth && userAuth.token_code) {
          // Set the auth token in the socket service
          socketService.setAuthToken(userAuth.token_code);
        } else {
          console.warn("No access token found in session");
          // Try to use the token from userAuth as a fallback
          if (userAuth && userAuth.token_code) {
            socketService.setAuthToken(userAuth.token_code);
          }
        }
      } catch (error) {
        console.error("Error initializing socket:", error);
      }
    };

    // Save socket info when component mounts
    const saveSocketInfo = () => {
      const socketInfo = {
        user_type: "customer",
      };

      socketHelpers
        .saveSocketInfo(socketInfo)
        .then((response) => {
          // if (response.status === true) {
          // } else {
          //   console.error("Failed to save socket info:", response.message);
          // }
        })
        .catch((error) => {
          console.error("Error saving socket info:", error);
        });
    };

    // Listen for car locations
    const handleCarLocations = (response) => {
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
    };

    // Request driver locations when pickup location is set
    const requestDriverLocations = () => {
      if (currentLocation && carTypeId) {
        const requestData = {
          pickup_lat: currentLocation.lat,
          pickup_lng: currentLocation.lng,
          car_type: carTypeId,
        };

        socketHelpers.getDriverLocation(requestData);
      }
    };

    // Initialize socket and set up event listeners
    initializeSocket().then(() => {
      // Set up socket event listeners
      const unsubscribeCarLocations = socketService.on(
        socketEvents.CAR_LOCATIONS,
        handleCarLocations
      );

      // Save socket info and request driver locations
      saveSocketInfo();

      // Request driver locations when component mounts and when currentLocation or carTypeId changes
      if (currentLocation && carTypeId) {
        requestDriverLocations();
      }

      // Clean up socket event listeners when component unmounts
      return () => {
        unsubscribeCarLocations();
      };
    });
  }, []); // Empty dependency array to run only once on mount

  // Add a separate effect to handle location and car type changes
  useEffect(() => {
    if (currentLocation && carTypeId) {
      const requestData = {
        pickup_lat: currentLocation.lat,
        pickup_lng: currentLocation.lng,
        car_type: carTypeId,
      };

      socketHelpers.getDriverLocation(requestData);
    }
  }, [currentLocation, carTypeId]);

  useEffect(() => {
    getUserCurrentLoacation();
  }, [customerRideType]);

  // Add a function to cancel an ongoing booking request
  const cancelBookingRequest = () => {
    if (bookingRequestId) {
      socketHelpers.cancel_ride({
        request_id: bookingRequestId,
        customer_id: userAuth.customer_id,
        user_type: "customer",
      });
      setIsBookingInProgress(false);
      setBookingRequestId(null);
      toast.info("Booking request canceled");
    }
  };

  // Add a useEffect to clean up booking state when component unmounts
  // useEffect(() => {
  //   return () => {
  //     if (isBookingInProgress && bookingRequestId) {
  //       socketHelpers.cancel_ride({
  //         request_id: bookingRequestId,
  //         customer_id: userAuth.customer_id,
  //         user_type: "customer"
  //       });
  //     }
  //   };
  // }, [isBookingInProgress, bookingRequestId, userAuth.customer_id]);

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

    if (!session || !session.user) {
      console.error("Session is missing or invalid:", session);
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    if (!session.user.data || !session.user.data.customer_id || !session.user.data.token_code) {
      console.error("Required user data is missing:", session.user);
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    return {
      props: {
        userAuth: {
          customer_id: session.user.data.customer_id,
          token_code: session.user.data.token_code,
          name: session.user.data.name || "",
          mobile_number: session.user.data.mobile_number || "",
          email: session.user.data.email || "",
          profile_status: session.user.data.profile_status || "",
        },
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return {
      redirect: {
        destination: "/login",
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
