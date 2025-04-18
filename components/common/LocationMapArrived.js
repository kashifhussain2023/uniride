import styled from "@emotion/styled";
import { Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import {
  DirectionsRenderer,
  GoogleMap,
  LoadScript,
  MarkerF,
  StandaloneSearchBox,
} from "@react-google-maps/api";
import { useEffect, useState } from "react";

const LocationMapArrived = ({
  currentLocation,
  dropPickLocationType,
  dropCustomerLocation,
  centerMapLocation,
  mapLocationLabel,
  driverLocation,
}) => {
  const [directions, setDirections] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);

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
  };

  const handleMapClick = (e) => {
    const clickedLocation = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };

    if (!currentLocation) {
      //setcurrentLocation(clickedLocation);
    } else {
      // setdropCustomerLocation(clickedLocation);
      calculateDirections(clickedLocation);
    }
  };
  const calculateDirections = (driverLocation) => {
    const directionsService = new window.google.maps.DirectionsService();
    const origin = new window.google.maps.LatLng(
      currentLocation.lat,
      currentLocation.lng
    );
    const destination = new window.google.maps.LatLng(
      driverLocation.lat,
      driverLocation.lng
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
    calculateDirections(driverLocation);
  }, [driverLocation]);
  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
      libraries={LIBRARIES}
    >
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={centerMapLocation}
        zoom={15}
        onClick={handleMapClick}
        options={{
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {/* {driverLocation && <MarkerF position={driverLocation} label="driver" />} */}

        {directions && <DirectionsRenderer directions={directions} />}
        {/* Display distance and duration on the map  */}
        {distance && duration && (
          <DistanceDurationOverlay>
            <Typography>Distance: {distance}</Typography>
            <Typography>Duration: {duration}</Typography>
          </DistanceDurationOverlay>
        )}
      </GoogleMap>
    </LoadScript>
  );
};
const LIBRARIES = ["places"];
export default LocationMapArrived;
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
