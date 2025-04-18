import { useState } from "react";
import Image from "next/image";
import styled from "@emotion/styled";
import { List, ListItem, Rating, Typography, Button } from "@mui/material";
import { format, parse } from "date-fns";

export default function RideDetails({
  rideDetail,
  setRideDetailStatus,
  setSubTitle,
}) {
  const handleBackButton = () => {
    setRideDetailStatus(true);
    setSubTitle("History");
  };
  // const image =  "https://unirideus.com/staging/uploads/rides/ride-1704448848-4390-2.jpg";
  const image1w = rideDetail ? rideDetail.detail_map : "/mapImg.png";
  return (
    <Box>
      <ActionTop>
        <Button
          variant=""
          color="primary"
          sx={{ mt: 4 }}
          onClick={handleBackButton}
        >
          Back
        </Button>
      </ActionTop>
      <HistoryImage onClick={() => router.push("/riderHistoryDetail")}>
        <img
          src={image1w}
          alt="Map Image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/mapImg.png";
          }}
        />
      </HistoryImage>
      <RiderName variant="h3" style={{ textAlign: "center" }}>
        {rideDetail?.name}
      </RiderName>
      <InfoList disablePadding style={{ marginBottom: 30 }}>
        <ListItem>
          <Typography color="error">PICKUP LOCATION</Typography>
          <Right>
            <Typography>DESTINATION LOCATION</Typography>
          </Right>
        </ListItem>
        <ListItem>
          <Typography>{rideDetail?.pickup_location_name}</Typography>
          <Right>
            <Typography>{rideDetail?.destination_name}</Typography>
          </Right>
        </ListItem>
      </InfoList>
      <InfoList disablePadding>
        <ListItem>
          <Typography>Ride Type</Typography>
          <Right>
            <Typography>{rideDetail?.ride_type}</Typography>
          </Right>
        </ListItem>
        <ListItem>
          <Typography>Trip Time</Typography>
          <Right>
            <Typography>
              {format(
                parse(
                  rideDetail?.ride_time,
                  "dd-MM-yyyy hh:mm:ss a",
                  new Date()
                ),
                "dd-MM-yyyy hh:mm a"
              )}
            </Typography>
          </Right>
        </ListItem>
        <ListItem>
          <Typography>Rated</Typography>
          <Right>
            <Typography>
              <Rating
                name="read-only"
                value={rideDetail?.customer_rating}
                readOnly
              />
            </Typography>
          </Right>
        </ListItem>
        {rideDetail?.promotion_discount != "0.00" &&
          rideDetail?.promotion_discount != "0" && (
            <>
              <ListItem>
                <Typography>Total</Typography>
                <Right>
                  <Typography>
                    $
                    {parseFloat(rideDetail?.total) +
                      parseFloat(rideDetail?.promotion_discount)}
                  </Typography>
                </Right>
              </ListItem>

              <ListItem>
                <Typography>Discount</Typography>
                <Right>
                  <Typography>${rideDetail?.promotion_discount}</Typography>
                </Right>
              </ListItem>
            </>
          )}

        <ListItem>
          <Typography>Total Fare</Typography>
          <Right>
            <Typography>${rideDetail?.total}</Typography>
          </Right>
        </ListItem>

        <ListItem>
          <Typography>Trip Distance</Typography>
          <Right>
            <Typography>{rideDetail?.trip_distance} mi</Typography>
          </Right>
        </ListItem>
        <ListItem>
          <Typography>Trip Duration</Typography>
          <Right>
            <Typography>{rideDetail?.trip_duration}</Typography>
          </Right>
        </ListItem>
        <ListItem>
          <Typography>Payment done by</Typography>
          <Right>
            <Typography>Card</Typography>
          </Right>
        </ListItem>
        <ListItem>
          <Typography>Status</Typography>
          <Right>
            <Typography variant="success">
              {rideDetail.customer_cancel_status === "Cancelled"
                ? "Cancelled"
                : "Success"}
            </Typography>
          </Right>
        </ListItem>
      </InfoList>
      <Button
        variant=""
        color="primary"
        sx={{ mt: 4 }}
        onClick={handleBackButton}
      >
        Back
      </Button>
    </Box>
  );
}

const Box = styled.div`
  ${({ theme }) => `
    background-color: ${theme.colors.palette.white};
    border-radius: 16px 0px 16px 16px;
    box-shadow: 0px 0px 15px -1px rgba(0, 0, 0, 0.1);
    padding: 24px;
    position: relative;
  `}
`;

const HistoryImage = styled.div`
  ${({ theme }) => `
    width: 100%;
    height: 200px;
    position: relative;

    @media (min-width: ${theme.breakpoints.values.md}px) {
      height: 300px;
    }

    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
  `}
`;

const RiderName = styled(Typography)`
  ${({ theme }) => `
    text-transform: uppercase;
    padding: ${theme.spacing(1, 0)};
  `}
`;

const InfoList = styled(List)`
  &.MuiList-root {
    .MuiListItem-root {
      padding-left: 0;
      padding-right: 0;
      justify-content: space-between;
      font-size: 14px;
    }
  }
`;

const Right = styled.div`
  flex: 0 0 50%;
  max-width: 50%;
  text-align: right;
`;

const ActionTop = styled.div`
  position: absolute;
  top: -110px;
  right: 0;
`;
