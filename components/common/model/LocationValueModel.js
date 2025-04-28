import CustomFormControl from '@/theme/CustomFormControl';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/material/styles';
import { LoadScript, StandaloneSearchBox } from '@react-google-maps/api';
import React, { useState, useEffect } from 'react';

const LIBRARIES = ['places'];

export default function LocationValueModel({
  open,
  handleCloseModel,
  actionFavorite,
  locationType,
  dropPickLocation,
  currentLocation,
  dropLocation,
  userAuth,
}) {
  const [searchBox, setSearchBox] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [error, setError] = useState('');

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setSearchInput('');
      setIsCalculating(false);
      setError('');
    }
  }, [open]);

  const handleSearchBoxLoad = ref => {
    console.log('ref', ref);
    setSearchBox(ref);
  };

  const calculateDistanceAndDuration = (origin, destination) => {
    return new Promise(resolve => {
      if (!origin || !destination) {
        resolve({
          distance: null,
          duration: null,
        });
        return;
      }
      const service = new window.google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          destinations: [new window.google.maps.LatLng(destination.lat, destination.lng)],
          origins: [new window.google.maps.LatLng(origin.lat, origin.lng)],
          travelMode: window.google.maps.TravelMode.DRIVING,
          unitSystem: window.google.maps.UnitSystem.METRIC,
        },
        (response, status) => {
          if (status === 'OK' && response.rows[0].elements[0].status === 'OK') {
            const distance = response.rows[0].elements[0].distance.text;
            const duration = response.rows[0].elements[0].duration.text;

            // Extract numeric values
            const distanceValue = parseFloat(distance.replace(' km', ''));
            const durationValue = parseInt(duration.replace(' mins', ''));
            resolve({
              distance: distanceValue,
              duration: durationValue,
            });
          } else {
            resolve({
              distance: null,
              duration: null,
            });
          }
        }
      );
    });
  };

  const handleLocation = async () => {
    if (!searchBox) {
      setError('Search box not initialized');
      return;
    }

    try {
      const places = searchBox.getPlaces();

      if (!places || places.length === 0) {
        setError('No places found');
        return;
      }

      const place = places[0];
      const newLocation = {
        address: place.formatted_address,
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setIsCalculating(true);
      setError('');

      // Calculate distance and duration if we have both locations
      let distanceValue = null;
      let durationValue = null;
      if (locationType === 'drop' && currentLocation) {
        const result = await calculateDistanceAndDuration(currentLocation, newLocation);
        distanceValue = result.distance;
        durationValue = result.duration;
      } else if (locationType === 'pickup' && dropLocation) {
        const result = await calculateDistanceAndDuration(newLocation, dropLocation);
        distanceValue = result.distance;
        durationValue = result.duration;
      }
      setIsCalculating(false);

      dropPickLocation(newLocation, distanceValue, durationValue);
      handleCloseModel();
    } catch (error) {
      console.error('Error getting places:', error);
      setError('Error processing location. Please try again.');
      setIsCalculating(false);
    }
  };

  const handleInputChange = e => {
    setSearchInput(e.target.value);
    setError('');
  };

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
      libraries={LIBRARIES}
    >
      <Dialog
        open={open}
        onClose={handleCloseModel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          '& .MuiDialog-paper': {
            zIndex: 9999,
          },
        }}
      >
        <DialogTitle id="alert-dialog-title">Select Location</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <SearchBoxContainer>
              <StandaloneSearchBox
                onLoad={handleSearchBoxLoad}
                onPlacesChanged={handleLocation}
                options={{
                  componentRestrictions: { country: 'us' },
                  types: ['address'],
                }}
              >
                <CustomFormControl
                  fullWidth
                  type="text"
                  placeholder="Search for a location..."
                  autoFocus
                  value={searchInput}
                  onChange={handleInputChange}
                  sx={{
                    '& .MuiInputBase-root': {
                      backgroundColor: 'white',
                    },
                  }}
                />
              </StandaloneSearchBox>
            </SearchBoxContainer>
            {error && <div style={{ color: 'red', marginTop: '8px' }}>{error}</div>}
            {isCalculating && (
              <div style={{ marginTop: '8px', textAlign: 'center' }}>
                Calculating distance and duration...
              </div>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <ButtonBox>
            <Button onClick={handleCloseModel} variant="secondary">
              Cancel
            </Button>
            <Button onClick={actionFavorite} variant="contained">
              Favorite Location
            </Button>
          </ButtonBox>
        </DialogActions>
      </Dialog>
    </LoadScript>
  );
}

const SearchBoxContainer = styled('div')`
  position: relative;
  z-index: 10000;

  // Style the Google Places Autocomplete dropdown
  .pac-container {
    z-index: 10000 !important;
    background-color: white;
    border-radius: 4px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  }
`;

const ButtonBox = styled('div')`
  ${({ theme }) => `
    display: flex;
    border-top: 1px solid ${theme.colors.palette.grey};
    justify-content: space-between;
    padding: ${theme.spacing(2, 3)};
    gap: 15px;
  `}
`;
