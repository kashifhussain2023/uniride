import CustomFormControl from "@/theme/CustomFormControl";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { StandaloneSearchBox } from "@react-google-maps/api";
import React, { useState } from "react";
import { styled } from "@mui/material/styles";

export default function LocationValueModel({
  open,
  handleCloseModel,
  actionFavorite,
  locationType,
  dropPickLocation,
}) {
  const [searchBox, setSearchBox] = useState(null);
  // const actionSearch = () =>{
  //   setDisableSearch(false);
  // }
  const handleSearchBoxLoad = (ref) => {
    setSearchBox(ref);
  };
  const handleLocation = () => {
    const places = searchBox.getPlaces();

    if (places.length > 0) {
      const place = places[0];

      const newLocation = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      newLocation.address = place.formatted_address;

      dropPickLocation(newLocation);
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
            <StandaloneSearchBox
              onLoad={handleSearchBoxLoad}
              onPlacesChanged={handleLocation}
            >
              <CustomFormControl
                fullWidth
                type="text"
                placeholder="Search..."
                autoFocus
              />
            </StandaloneSearchBox>
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
const ButtonBox = styled("div")`
  ${({ theme }) => `
    display: flex;
    border-top: 1px solid ${theme.colors.palette.grey};
    justify-content: space-between;
     padding: ${theme.spacing(2, 3)};
     gap: 15px;
  `}
`;
