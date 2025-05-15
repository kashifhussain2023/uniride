import styled from '@emotion/styled';
import { Typography } from '@mui/material';
import { DirectionsRenderer, GoogleMap, LoadScript } from '@react-google-maps/api';
import { useEffect, useState } from 'react';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

// Utility functions to format distance and duration
const formatDistance = distanceText => {
  const distance = parseFloat(distanceText);
  if (distance < 1) {
    return `${(distance * 1000).toFixed(0)} meters`;
  }
  return `${distance.toFixed(1)} km`;
};

const formatDuration = durationText => {
  const parts = durationText.split(' ');
  const value = parseInt(parts[0]);
  const unit = parts[1];

  if (unit.includes('hour')) {
    const hours = value;
    const minutes = parts.length > 2 ? parseInt(parts[2]) : 0;
    return `${hours}h ${minutes}m`;
  } else if (unit.includes('min')) {
    return `${value} minutes`;
  } else if (unit.includes('sec')) {
    return `${value} seconds`;
  }
  return durationText;
};

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
            setDistance(formatDistance(leg.distance.text));
            setDuration(formatDuration(leg.duration.text));
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
    <LoadScript googleMapsApiKey={process.env.GOOGLE_MAPS_API_KEY} libraries={LIBRARIES}>
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
            <InfoRow>
              <DirectionsCarIcon sx={{ color: '#1976d2', fontSize: 20 }} />
              <InfoText>{distance}</InfoText>
            </InfoRow>
            <InfoRow>
              <AccessTimeIcon sx={{ color: '#1976d2', fontSize: 20 }} />
              <InfoText>{duration}</InfoText>
            </InfoRow>
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
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 200px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InfoText = styled(Typography)`
  font-size: 14px;
  color: #333;
  font-weight: 500;
`;
