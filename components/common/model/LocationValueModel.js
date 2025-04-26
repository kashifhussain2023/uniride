import CustomFormControl from '@/theme/CustomFormControl';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/material/styles';
import { StandaloneSearchBox } from '@react-google-maps/api';
import React, { useState } from 'react';
export default function LocationValueModel({
  open,
  handleCloseModel,
  actionFavorite,
  locationType,
  dropPickLocation,
  currentLocation,
  dropLocation,
}) {
  const [searchBox, setSearchBox] = useState(null);
  // const [distance, setDistance] = useState(null);
  // const [duration, setDuration] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Reset distance and duration when dialog opens
  // useEffect(() => {
  //   if (open) {
  //     setDistance(null);
  //     setDuration(null);
  //     setIsCalculating(false);
  //   }
  // }, [open]);
  const handleSearchBoxLoad = ref => {
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
            // setDistance(distanceValue);
            // setDuration(durationValue);
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
    const places = searchBox.getPlaces();
    if (places.length > 0) {
      const place = places[0];
      const newLocation = {
        address: place.formatted_address,
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setIsCalculating(true);

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

      // Pass the location to parent component with the calculated values

      //console.log({"distanceValue":distanceValue,"durationValue":durationValue})

      dropPickLocation(newLocation, distanceValue, durationValue);
      handleCloseModel();
    }
  };
  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleCloseModel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title"></DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <StandaloneSearchBox onLoad={handleSearchBoxLoad} onPlacesChanged={handleLocation}>
              <CustomFormControl fullWidth type="text" placeholder="Search..." autoFocus />
            </StandaloneSearchBox>
            {isCalculating && (
              <div
                style={{
                  marginTop: '10px',
                  textAlign: 'center',
                }}
              >
                Calculating distance and duration...
              </div>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <ButtonBox>
            <Button onClick={handleCloseModel} autoFocus variant="secondary">
              Cancel
            </Button>
            <Button onClick={actionFavorite} variant="contained">
              Favorite Location
            </Button>
          </ButtonBox>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
const ButtonBox = styled('div')`
  ${({ theme }) => `
    display: flex;
    border-top: 1px solid ${theme.colors.palette.grey};
    justify-content: space-between;
     padding: ${theme.spacing(2, 3)};
     gap: 15px;
  `}
`;
