import styled from '@emotion/styled';
import { Edit } from '@mui/icons-material';
import { IconButton, InputAdornment, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import { GoogleMap, LoadScript, MarkerF, Polyline } from '@react-google-maps/api';
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
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${clickedLocation.lat},${clickedLocation.lng}&key=${process.env.GOOGLE_MAPS_API_KEY}`
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

    const directionsService = new window.google.maps.DirectionsService();
    let origin, destination;

    // Handle different ride statuses
    if (rideStatus === 1) {
      // Arrived Soon - Show driver to customer's current location
      if (!currentLocation || !currentLocation.lat || !currentLocation.lng) {
        console.error('Invalid current location');
        return;
      }

      const driverLoc = {
        lat: parseFloat(driverLocation.lat),
        lng: parseFloat(driverLocation.lng),
      };

      origin = new window.google.maps.LatLng(driverLoc.lat, driverLoc.lng);
      destination = new window.google.maps.LatLng(currentLocation.lat, currentLocation.lng);
    } else if (rideStatus === 2 || rideStatus === 3) {
      // Arrived or Completed - Show customer to dropoff
      if (!currentLocation || !currentLocation.lat || !currentLocation.lng) {
        console.error('Invalid current location');
        return;
      }
      if (!dropCustomerLocation || !dropCustomerLocation.lat || !dropCustomerLocation.lng) {
        console.error('Invalid drop customer location');
        return;
      }
      origin = new window.google.maps.LatLng(currentLocation.lat, currentLocation.lng);
      destination = new window.google.maps.LatLng(
        dropCustomerLocation.lat,
        dropCustomerLocation.lng
      );
    }

    console.log('Calculating directions:', {
      currentLocation,
      destination,
      driverLocation,
      dropCustomerLocation,
      origin,
      rideStatus,
    });

    directionsService.route(
      {
        destination,
        optimizeWaypoints: true,
        origin,
        provideRouteAlternatives: true,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          const shortestRoute = result.routes.reduce((shortest, current) => {
            return current.legs[0].distance.value < shortest.legs[0].distance.value
              ? current
              : shortest;
          });

          const path = shortestRoute.overview_path.map(point => ({
            lat: point.lat(),
            lng: point.lng(),
          }));

          setRoutePath(path);
          setDirections(result);
        } else {
          console.error('Directions request failed:', status);
          setDirections(null);
          setRoutePath([]);
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

  console.log({
    comfirmBooking: comfirmBooking,
    currentLocation: currentLocation,
    directions: directions,
    distance: distance,
    driverLocation: driverLocation,
    dropCustomerLocation: dropCustomerLocation,
    openValueModel: openValueModel,
    rideStatus: rideStatus,
  });

  useEffect(() => {
    const cleanup = () => {
      setDirections(null);
      setRoutePath([]);
    };

    if (rideStatus === 1 && isValidLocation(driverLocation) && isValidLocation(currentLocation)) {
      // Only calculate route from driver to customer for ride_status = 1
      calculateRoutePath(driverLocation, currentLocation);
    } else if (currentLocation && dropCustomerLocation) {
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

  console.log({
    availableDriver: availableDriver,
  });

  const getMapCenter = () => {
    // Ensure we have valid coordinates before using them
    const parseLocation = location => {
      if (!location || typeof location.lat !== 'number' || typeof location.lng !== 'number') {
        return null;
      }
      return {
        lat: parseFloat(location.lat),
        lng: parseFloat(location.lng),
      };
    };

    const driverLoc = parseLocation(driverLocation);
    const currentLoc = parseLocation(currentLocation);
    const dropLoc = parseLocation(dropCustomerLocation);

    switch (rideStatus) {
      case 1:
        return driverLoc || currentLoc || { lat: 0, lng: 0 };
      case 2:
      case 3:
        return currentLoc || { lat: 0, lng: 0 };
      case 4:
        return dropLoc || currentLoc || { lat: 0, lng: 0 };
      default:
        return parseLocation(centerMapLocation) || currentLoc || { lat: 0, lng: 0 };
    }
  };

  const isValidLocation = location => {
    return (
      location &&
      typeof location.lat === 'number' &&
      typeof location.lng === 'number' &&
      !isNaN(location.lat) &&
      !isNaN(location.lng)
    );
  };

  return (
    <LoadScript googleMapsApiKey={process.env.GOOGLE_MAPS_API_KEY} libraries={LIBRARIES}>
      <GoogleMap
        key={directionsKey}
        mapContainerStyle={mapContainerStyle}
        center={getMapCenter()}
        zoom={15}
        onClick={handleMapClick}
        options={{
          fullscreenControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          zoomControl: false,
        }}
      >
        {/* Show driver marker with car image only for ride_status = 1 */}
        {rideStatus === 1 && isValidLocation(driverLocation) && (
          <MarkerF
            position={{
              lat: parseFloat(driverLocation.lat),
              lng: parseFloat(driverLocation.lng),
            }}
            icon={{
              scaledSize: new window.google.maps.Size(40, 40),
              url: '../carImage.png',
            }}
          />
        )}

        {/* Show customer current location marker */}
        {isValidLocation(currentLocation) && (
          <MarkerF
            position={{
              lat: parseFloat(currentLocation.lat),
              lng: parseFloat(currentLocation.lng),
            }}
            icon={{
              url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png', // change to blue-dot.png, green-dot.png, etc.
            }}
          />
        )}

        {/* Show drop location marker */}
        {isValidLocation(dropCustomerLocation) && (
          <MarkerF
            position={{
              lat: parseFloat(dropCustomerLocation.lat),
              lng: parseFloat(dropCustomerLocation.lng),
            }}
          />
        )}

        {/* Show route polyline only for ride_status = 1 */}
        {routePath.length > 0 && (
          <Polyline
            path={routePath}
            options={{
              geodesic: true,
              icons: [
                {
                  icon: {
                    path: 'M 0,-1 0,1',
                    scale: 4,
                    strokeOpacity: 1,
                  },
                  offset: '0',
                  repeat: '20px',
                },
              ],
              strokeColor: '#feae01',
              strokeOpacity: 1,
              strokeWeight: 6,
            }}
          />
        )}

        {/* Show available drivers only when ride_status is not 1 */}
        {rideStatus !== 1 &&
          availableDriver &&
          availableDriver.length > 0 &&
          availableDriver.map((driver, index) => (
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
          ))}

        {(comfirmBooking || selectRide) && centerMapLocation && (
          <MarkerF position={centerMapLocation} />
        )}

        {rideStatus === 4 && isValidLocation(driverLocation) && (
          <MarkerF
            position={{
              lat: driverLocation.lat,
              lng: driverLocation.lng,
            }}
            icon={{
              scaledSize: new window.google.maps.Size(40, 40),
              url: '../carImage.png',
            }}
          />
        )}
        {driverLocation && rideStatus === 2 && isValidLocation(driverLocation) && (
          <MarkerF
            position={driverLocation}
            icon={{
              scaledSize: new window.google.maps.Size(40, 40),
              url: '../carImage.png',
            }}
          />
        )}
        {driverLocation && rideStatus === 3 && isValidLocation(driverLocation) && (
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
                InputProps={
                  (rideStatus === 4 || rideStatus === 3) && {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => {
                            setLocationType('drop');
                            handleOpenValueModel();
                          }}
                          edge="end"
                        >
                          <Edit />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }
                }
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
