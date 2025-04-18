import styled from "@emotion/styled";
import { Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import {
  DirectionsRenderer,
  GoogleMap,
  LoadScript,
  MarkerF,
} from "@react-google-maps/api";
import { useEffect, useState } from "react";

const LocationPickerMap = ({
  currentLocation,
  dropPickLocationType,
  dropCustomerLocation,
  centerMapLocation,
  mapLocationLabel,
  driverLocation,
  rideStatus,
  locationType,
  getDropPickLocation,
  comfirmBooking,
  selectRide,
  availableDriver,
}) => {
  const [directions, setDirections] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [directionsKey, setDirectionsKey] = useState(0);

  const resetMap = () => {
    // Increment the key to force remounting the map
    setDirectionsKey((prevKey) => prevKey + 1);
  };
  const mapContainerStyle = {
    width: "100%",
    height: "100%",
  };

  const defaultCenter = {
    lat: currentLocation.lat,
    lng: currentLocation.lng,
  };

  const setLocationType = (type) => {
    dropPickLocationType(type);
    resetMap();
  };

  const handleMapClick = async (e) => {
    const clickedLocation = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${clickedLocation.lat},${clickedLocation.lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      if (data.status === "OK" && data.results.length > 0) {
        const address = data.results[0].formatted_address;
        clickedLocation.address = address;
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
    if (locationType === null || locationType === "pickup") {
      getDropPickLocation(clickedLocation);
    } else {
      getDropPickLocation(clickedLocation);
    }
  };
  const calculateDirections = (driverLocation) => {
    const directionsService = new window.google.maps.DirectionsService();
    let destination;
    const origin = new window.google.maps.LatLng(
      driverLocation.lat,
      driverLocation.lng
    );
    if (rideStatus == 2) {
      destination = new window.google.maps.LatLng(
        currentLocation.lat,
        currentLocation.lng
      );
    } else {
      destination = new window.google.maps.LatLng(
        dropCustomerLocation.lat,
        dropCustomerLocation.lng
      );
    }

    directionsService.route(
      {
        origin,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },

      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
          // Extract and set distance and duration
          const route = result.routes[0];
          if (route && route.legs && route.legs.length > 0) {
            const leg = route.legs[0];
            setDistance(leg.distance.text);
            setDuration(leg.duration.text);
          }
        } else {
          console.error("Directions request failed:", status);
        }
      }
    );
  };
  const calculateDirectionsWithoutRide = (dropCustomerLocation) => {
    const directionsService = new window.google.maps.DirectionsService();

    const origin = new window.google.maps.LatLng(
      currentLocation.lat,
      currentLocation.lng
    );

    const destination = new window.google.maps.LatLng(
      dropCustomerLocation.lat,
      dropCustomerLocation.lng
    );

    directionsService.route(
      {
        origin,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },

      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
          // Extract and set distance and duration
          const route = result.routes[0];
          if (route && route.legs && route.legs.length > 0) {
            const leg = route.legs[0];
            setDistance(leg.distance.text);
            setDuration(leg.duration.text);
          }
        } else {
          console.error("Directions request failed:", status);
        }
      }
    );
  };
  useEffect(() => {
    const cleanup = () => {
      // Reset directions, distance, and duration when the component unmounts
      setDirections(null);
      setDistance(null);
      setDuration(null);
    };
    if (rideStatus) {
      calculateDirections(driverLocation);
      resetMap();
    }

    if (dropCustomerLocation && currentLocation && comfirmBooking) {
      calculateDirectionsWithoutRide(dropCustomerLocation);
      resetMap();
    }
    return cleanup;
  }, [
    //driverLocation,
    dropCustomerLocation,
    currentLocation,
    comfirmBooking,
    rideStatus,
  ]);
  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
      libraries={LIBRARIES}
    >
      <GoogleMap
        key={directionsKey}
        mapContainerStyle={mapContainerStyle}
        center={
          selectRide
            ? centerMapLocation
            : comfirmBooking
            ? centerMapLocation
            : rideStatus === 2
            ? currentLocation
            : dropCustomerLocation
        }
        zoom={15}
        onClick={handleMapClick}
        options={{
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              // Suppress default markers (A and B)
              suppressMarkers: true,
            }}
          />
        )}

        {(comfirmBooking || selectRide) && centerMapLocation && (
          <MarkerF position={centerMapLocation} text={"Google Map"} />
        )}

        {comfirmBooking && currentLocation && (
          <MarkerF position={currentLocation} />
        )}

        {comfirmBooking && dropCustomerLocation && (
          <MarkerF position={dropCustomerLocation} />
        )}

        {availableDriver &&
          availableDriver.length > 0 &&
          availableDriver.map((driver, index) => {
            return (
              <MarkerF
                key={index}
                position={{
                  lat: parseFloat(driver.lat),
                  lng: parseFloat(driver.lng),
                }}
                icon={{
                  url: "../carImage.png",
                  scaledSize: new window.google.maps.Size(40, 40),
                }}
              />
            );
          })}

        {driverLocation && rideStatus === 4 && (
          <MarkerF
            position={driverLocation}
            icon={{
              url: "../carImage.png",
              scaledSize: new window.google.maps.Size(40, 40),
            }}
          />
        )}
        {driverLocation && rideStatus === 2 && (
          <MarkerF
            position={driverLocation}
            icon={{
              url: "../carImage.png",
              scaledSize: new window.google.maps.Size(40, 40),
            }}
          />
        )}
        {driverLocation && rideStatus === 3 && (
          <MarkerF
            position={driverLocation}
            icon={{
              url: "../carImage.png",
              scaledSize: new window.google.maps.Size(40, 40),
            }}
          />
        )}
        {/* Display distance and duration on the map  */}
        {distance && duration && (
          <DistanceDurationOverlay>
            <Typography>Distance: {distance}</Typography>
            <Typography>Duration: {duration}</Typography>
          </DistanceDurationOverlay>
        )}
        {selectRide ? (
          <DropinOut>
            <DropField>
              <TextField
                placeholder="Pick up"
                value={currentLocation?.address || ""}
                name="drop_in"
                onClick={() => setLocationType("pickup")}
                onChange={() => setLocationType("pickup")}
                disabled={!selectRide}
                autoComplete="off"
              />

              <TextField
                placeholder="Drop off"
                name="drop_out"
                value={dropCustomerLocation?.address || ""}
                onClick={() => setLocationType("drop")}
                onChange={() => setLocationType("drop")}
                disabled={!selectRide}
                autoComplete="off"
              />
            </DropField>
          </DropinOut>
        ) : (
          <DropinOut>
            <DropField>
              <TextField
                placeholder="Pick up"
                value={currentLocation?.address || ""}
                name="drop_in"
                disabled={!selectRide}
                autoComplete="off"
              />

              <TextField
                placeholder="Drop off"
                name="drop_out"
                value={dropCustomerLocation?.address || ""}
                disabled={!selectRide}
                autoComplete="off"
              />
            </DropField>
          </DropinOut>
        )}
      </GoogleMap>
    </LoadScript>
  );
};
const LIBRARIES = ["places"];
export default LocationPickerMap;
const DropinOut = styled.div`
  ${({ theme }) => `

  position:absolute;
  max-width:1270px; margin:0 auto; left:0px; right:0px; top:15px; padding:0px 15px;
  z-index:1
  
  }

  `}
`;
const DistanceDurationOverlay = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: white;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  z-index: 1;
`;
const DropField = styled.div`
  ${({ theme }) => `
    position: relative;
    &::before {
      position: absolute;
      content: "";
      background-image: url(../line.png);
      width: 9px;
      height: 68px;
      z-index: 999;
      left: 18px;
      background-repeat: none;
      top: 20px;
    }

    .MuiTextField-root {
      width: 100%;
      .MuiOutlinedInput-root {
        background-color: #fff;
        margin-bottom: 10px;
        height: 50px;
        border: 0px solid #000;
        padding-left: 25px;
      }
    }
  `}
`;
