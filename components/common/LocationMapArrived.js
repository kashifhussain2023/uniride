import styled from '@emotion/styled';
import { Typography } from '@mui/material';
import { DirectionsRenderer, GoogleMap, LoadScript } from '@react-google-maps/api';
import { useEffect, useState } from 'react';
const LocationMapArrived = ({ currentLocation, driverLocation, centerMapLocation }) => {
  const [directions, setDirections] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const mapContainerStyle = {
    height: '100%',
    width: '100%',
  };
  const handleMapClick = e => {
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
  const calculateDirections = driverLocation => {
    const directionsService = new window.google.maps.DirectionsService();
    const origin = new window.google.maps.LatLng(currentLocation.lat, currentLocation.lng);
    const destination = new window.google.maps.LatLng(driverLocation.lat, driverLocation.lng);
    directionsService.route(
      {
        destination,
        origin,
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
          console.error('Directions request failed:', status);
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
          fullscreenControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          zoomControl: false,
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
const LIBRARIES = ['places'];
export default LocationMapArrived;
const DistanceDurationOverlay = styled.div`
  position: absolute;
  top: 85%;
  left: 10px;
  background-color: white;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  z-index: 1;
`;
