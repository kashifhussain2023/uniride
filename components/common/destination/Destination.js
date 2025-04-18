import * as React from "react";
import styled from "@emotion/styled";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "@/utils/api/common";
import { toast } from "react-toastify";
import { Grid, IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { GoogleMap, MarkerF } from "@react-google-maps/api";
import MessageModel from "../model/MessageModel";
import SpinnerLoader from "../SpinnerLoader";

export default function DestinationList({
  favoritelist,
  type,
  redirectPage,
  getFavoriteList,
  userAuth,
}) {
  const router = useRouter();
  const mapContainerStyle = {
    width: "100%",
    height: "150px", // Set a specific height
  };
  const [open, setOpen] = React.useState(false);
  const [locationId, setLocationId] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const handleOpen = (id) => {
    setOpen(true);
    setLocationId(id);
  };
  const handleClose = () => setOpen(false);
  const handleDeleteAction = async () => {
    const formData = new FormData();
    formData.append("customer_id", userAuth.customer_id);
    formData.append("location_id", locationId);
    formData.append("token_code", userAuth.token_code);
    setOpen(false);
    setLoading(true);
    const response = await api({
      url: "/customers/delete_fav_location",
      method: "POST",
      data: formData,
    });
    if (response.status === 1) {
      toast.success(response.message);
      getFavoriteList();
      setLoading(false);
    } else if (
      response.status === 0 &&
      response.message === "Invalid token code"
    ) {
      setLoading(false);
      toast.error(
        "Your account has been logged in on another device.Please login again to continue."
      );
      await signOut({ redirect: false });
      router.push("/login");
    } else {
      setLoading(false);
      toast.success(response.message);
    }
  };

  const handleLocation = (fav_lat, fav_long, address) => {
    router.push({
      pathname: `/${redirectPage}`,
      query: {
        type: type,
        lat: fav_lat,
        lng: fav_long,
        address: address,
      },
    });
  };
  return (
    <>
      <SpinnerLoader loading={loading} />
      <MessageModel
        open={open}
        close={handleClose}
        handleAction={() => handleDeleteAction()}
        message="Do you want to delete this location ?"
      />
      {favoritelist != undefined && favoritelist ? (
        favoritelist.map((favorite, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Destination>
              <HistoryImage>
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={{
                    lat: parseFloat(favorite.fav_lat) || 0,
                    lng: parseFloat(favorite.fav_long) || 0,
                  }}
                  zoom={5}
                  options={{
                    zoomControl: false,
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false,
                  }}
                >
                  <MarkerF
                    position={{
                      lat: parseFloat(favorite.fav_lat) || 0,
                      lng: parseFloat(favorite.fav_long) || 0,
                    }}
                    label="Location"
                  />
                </GoogleMap>
                <MuiIconButton>
                  <DeleteIcon
                    color="error"
                    fontSize="small"
                    onClick={() => handleOpen(favorite.id)}
                  />
                </MuiIconButton>
              </HistoryImage>
              <Detail
                onClick={() =>
                  handleLocation(
                    favorite.fav_lat,
                    favorite.fav_long,
                    favorite.address
                  )
                }
              >
                <img src="../mapIcon.png" alt="map icon" />
                <Typography variant="h3">{favorite.tag}</Typography>
                <Typography variant="subtitle1">{favorite.address}</Typography>
              </Detail>
            </Destination>
          </Grid>
        ))
      ) : (
        <NoRecordGrid item xs={12} lg={12}>
          <Destination>
            <NoRecord>No records found</NoRecord>
          </Destination>
        </NoRecordGrid>
      )}
    </>
  );
}

const Destination = styled.div`
  ${({ theme }) => `
    border: 1px solid ${theme.colors.palette.grey};
    border-radius: 12px;
    padding: 20px;
    height: 100%;
  `}
`;

const HistoryImage = styled.div`
  ${({ theme }) => `
    width: 100%;
    box-shadow: 0px 0px 14px 0px rgba(0, 0, 0, 0.1);
    font-size: 0;
    position: relative;

    img {
      border-radius: 6px;
      height: 100%;
      width: 100%;
      border: 1px solid ${theme.colors.palette.white};
      object-fit: cover;
    }
  `}
`;

const Detail = styled.div`
  margin-top: 30px;
  position: relative;
  padding-left: 45px;
  cursor: pointer;

  img {
    position: absolute;
    left: 0px;
    top: 0px;
  }

  h3 {
    padding: 0px;
    margin: 0px 0px 7px 0px;
    line-height: 20px;
  }

  .MuiTypography-subtitle1 {
    line-height: 22px;
  }
`;

const NoRecord = styled(Typography)`
  ${({ theme }) => `
    padding-bottom: ${theme.spacing(3)};
    text-align: center;
    display: block;
    width: 100%;
    font-weight: 500;
  `}
`;

const NoRecordGrid = styled(Grid)`
  &.MuiGrid-item {
    flex: 0 0 100%;
    max-width: 100%;
  }
`;

const MuiIconButton = styled(IconButton)`
  &.MuiIconButton-root {
    position: absolute;
    bottom: -50px;
    right: -6px;
    z-index: 9;
  }
`;
