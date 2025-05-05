import styled from '@emotion/styled';
import { Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import {
  DirectionsRenderer,
  GoogleMap,
  LoadScript,
  MarkerF,
  Polyline,
} from '@react-google-maps/api';
import { useEffect, useState } from 'react';
const LocationPickerMap = ({
  currentLocation,
  dropPickLocationType,
  dropCustomerLocation,
  centerMapLocation,
  driverLocation,
  rideStatus,
  locationType,
  getDropPickLocation,
  comfirmBooking,
  selectRide,
  availableDriver,
  distance,
  duration,
}) => {
  const [directions, setDirections] = useState(null);
  const [directionsKey, setDirectionsKey] = useState(0);
  const [routePath, setRoutePath] = useState([]);
  const [openValueModel, setOpenValueModel] = useState(false);

  const handleOpenValueModel = () => {
    setOpenValueModel(true); // Open the LocationValueModel
  };

  const resetMap = () => {
    // Increment the key to force remounting the map
    setDirectionsKey(prevKey => prevKey + 1);
  };

  const mapContainerStyle = {
    height: '100%',
    width: '100%',
  };

  const setLocationType = type => {
    dropPickLocationType(type);
    resetMap();
  };

  const handleMapClick = async e => {
    const clickedLocation = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${clickedLocation.lat},${clickedLocation.lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      if (data.status === 'OK' && data.results.length > 0) {
        const address = data.results[0].formatted_address;
        clickedLocation.address = address;
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
    if (locationType === null || locationType === 'pickup') {
      getDropPickLocation(clickedLocation);
    } else {
      getDropPickLocation(clickedLocation);
    }
  };
  const calculateDirections = driverLocation => {
    if (!driverLocation || !driverLocation.lat || !driverLocation.lng) {
      console.error('Invalid driver location');
      return;
    }

    console.log('calculateDirections driverLocation', driverLocation);

    const directionsService = new window.google.maps.DirectionsService();
    let destination;
    const origin = new window.google.maps.LatLng(driverLocation.lat, driverLocation.lng);

    console.log('calculateDirections rideStatus', rideStatus);
    if (rideStatus === 2) {
      if (!currentLocation || !currentLocation.lat || !currentLocation.lng) {
        console.error('Invalid current location');
        return;
      }
      destination = new window.google.maps.LatLng(currentLocation.lat, currentLocation.lng);
    } else {
      if (!dropCustomerLocation || !dropCustomerLocation.lat || !dropCustomerLocation.lng) {
        console.error('Invalid drop customer location');
        return;
      }

      destination = new window.google.maps.LatLng(
        dropCustomerLocation.lat,
        dropCustomerLocation.lng
      );
    }

    console.log('destination', destination);

    directionsService.route(
      {
        destination,
        origin,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        console.log('result', result);

        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error('Directions request failed:', status);
          setDirections(null);
        }
      }
    );
  };
  const calculateDirectionsWithoutRide = dropCustomerLocation => {
    if (!currentLocation || !currentLocation.lat || !currentLocation.lng) {
      console.error('Invalid current location');
      return;
    }
    if (!dropCustomerLocation || !dropCustomerLocation.lat || !dropCustomerLocation.lng) {
      console.error('Invalid drop customer location');
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();
    const origin = new window.google.maps.LatLng(currentLocation.lat, currentLocation.lng);
    const destination = new window.google.maps.LatLng(
      dropCustomerLocation.lat,
      dropCustomerLocation.lng
    );

    directionsService.route(
      {
        destination,
        origin,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error('Directions request failed:', status);
          setDirections(null);
        }
      }
    );
  };

  const calculateRoutePath = (origin, destination) => {
    if (!origin || !destination) return;

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        destination: new window.google.maps.LatLng(destination.lat, destination.lng),
        origin: new window.google.maps.LatLng(origin.lat, origin.lng),
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          const path = result.routes[0].overview_path.map(point => ({
            lat: point.lat(),
            lng: point.lng(),
          }));
          setRoutePath(path);
        } else {
          console.error('Directions request failed:', status);
          setRoutePath([]);
        }
      }
    );
  };

  useEffect(() => {
    const cleanup = () => {
      setDirections(null);
      setRoutePath([]);
    };

    if (currentLocation && dropCustomerLocation) {
      calculateRoutePath(currentLocation, dropCustomerLocation);
    }

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
    driverLocation,
    dropCustomerLocation,
    currentLocation,
    comfirmBooking,
    rideStatus,
    distance,
    duration,
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
          fullscreenControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          zoomControl: false,
        }}
      >
        {/* Add Route Polyline */}
        {routePath.length > 0 && (
          <Polyline
            path={routePath}
            options={{
              geodesic: true,
              strokeColor: '#4285F4',
              strokeOpacity: 0.8,
              strokeWeight: 4,
            }}
          />
        )}

        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: true,
            }}
          />
        )}

        {(comfirmBooking || selectRide) && centerMapLocation && (
          <MarkerF position={centerMapLocation} />
        )}

        {currentLocation && <MarkerF position={currentLocation} />}

        {dropCustomerLocation && <MarkerF position={dropCustomerLocation} />}

        {availableDriver &&
          availableDriver.length > 0 &&
          availableDriver.map((driver, index) => {
            return (
              <MarkerF
                key={index}
                position={{
                  lat: parseFloat(driver.driver_lat),
                  lng: parseFloat(driver.driver_lng),
                }}
                icon={{
                  scaledSize: new window.google.maps.Size(40, 40),
                  url: '../carImage.png',
                }}
              />
            );
          })}

        {driverLocation && rideStatus === 4 && (
          <MarkerF
            position={driverLocation}
            icon={{
              scaledSize: new window.google.maps.Size(40, 40),
              url: '../carImage.png',
            }}
          />
        )}
        {driverLocation && rideStatus === 2 && (
          <MarkerF
            position={driverLocation}
            icon={{
              scaledSize: new window.google.maps.Size(40, 40),
              url: '../carImage.png',
            }}
          />
        )}
        {driverLocation && rideStatus === 3 && (
          <MarkerF
            position={driverLocation}
            icon={{
              scaledSize: new window.google.maps.Size(40, 40),
              url: '../carImage.png',
            }}
          />
        )}
        {/* Display distance and duration on the map */}
        {distance && duration && (
          <DistanceDurationOverlay>
            <Typography>Distance: {distance} KM</Typography>
            <Typography>Duration: {duration} Min</Typography>
          </DistanceDurationOverlay>
        )}
        {selectRide ? (
          <DropinOut>
            <DropField>
              <TextField
                placeholder="Pick up"
                value={currentLocation?.address || ''}
                name="drop_in"
                onClick={() => setLocationType('pickup')}
                onChange={() => setLocationType('pickup')}
                disabled={!selectRide}
                autoComplete="off"
              />

              <TextField
                placeholder="Drop off"
                name="drop_out"
                value={dropCustomerLocation?.address || ''}
                onClick={() => setLocationType('drop')}
                onChange={() => setLocationType('drop')}
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
                value={currentLocation?.address || ''}
                name="drop_in"
                disabled={!selectRide}
                autoComplete="off"
              />

              <TextField
                placeholder="Drop off"
                name="drop_out"
                value={dropCustomerLocation?.address || ''}
                // disabled={!selectRide}
                disabled={rideStatus === 4 || rideStatus === 3 ? false : !selectRide}
                autoComplete="off"
                onClick={() => {
                  setLocationType('drop');
                  handleOpenValueModel();
                }}
              />
            </DropField>
          </DropinOut>
        )}
      </GoogleMap>
    </LoadScript>
  );
};
const LIBRARIES = ['places'];
export default LocationPickerMap;
const DropinOut = styled.div`
  ${() => `

  position:absolute;
  max-width:1270px; margin:0 auto; left:0px; right:0px; top:15px; padding:0px 15px;
  z-index:1
  
  }

  `}
`;
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
const DropField = styled.div`
  ${() => `
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
