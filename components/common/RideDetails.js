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
        <Image
          src={rideDetail?.request?.path_image || "/map.png"}
          alt="Map Image Uniride"
          layout="fill"
          objectFit="cover"
        />
      </HistoryImage>
      <RiderName variant="h3" style={{ textAlign: "center" }}>
        {rideDetail?.request?.unique_request_id}
      </RiderName>
      <InfoList disablePadding style={{ marginBottom: 30 }}>
        <ListItem>
          <Typography color="error">PICKUP LOCATION</Typography>
          <Right>
            <Typography>DESTINATION LOCATION</Typography>
          </Right>
        </ListItem>
        <ListItem>
          <Typography>{rideDetail?.request?.start_location_name}</Typography>
          <Right>
            <Typography>{rideDetail?.request?.end_location_name}</Typography>
          </Right>
        </ListItem>
      </InfoList>
      <InfoList disablePadding>
        <ListItem>
          <Typography>Ride Type</Typography>
          <Right>
            <Typography>{rideDetail?.request?.ride_type}</Typography>
          </Right>
        </ListItem>
        <ListItem>
          <Typography>Trip Time</Typography>
          <Right>
            <Typography>
              {rideDetail?.ride_start_time
                ? format(
                    new Date(rideDetail?.ride_start_time),
                    "dd-MM-yyyy hh:mm a"
                  )
                : "N/A"}
            </Typography>
          </Right>
        </ListItem>
        <ListItem>
          <Typography>Rated</Typography>
          <Right>
            <Rating
              name="read-only"
              value={parseFloat(rideDetail?.customer_rating) || 0}
              readOnly
            />
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
                    {parseFloat(rideDetail?.tip || 0) +
                      parseFloat(rideDetail?.promotion_discount || 0)}
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
            <Typography>${rideDetail?.tip || "0.00"}</Typography>
          </Right>
        </ListItem>

        <ListItem>
          <Typography>Trip Distance</Typography>
          <Right>
            <Typography>{rideDetail?.distance_travelled} mi</Typography>
          </Right>
        </ListItem>

        <ListItem>
          <Typography>Trip Duration</Typography>
          <Right>
            <Typography>{rideDetail?.ride_duration}</Typography>
          </Right>
        </ListItem>

        <ListItem>
          <Typography>Payment done by</Typography>
          <Right>
            <Typography>
              {rideDetail?.request?.payment_mode === 1 ? "Card" : "Cash"}
            </Typography>
          </Right>
        </ListItem>

        <ListItem>
          <Typography>Status</Typography>
          <Right>
            <Typography variant="success">
              {rideDetail?.customer_cancel_ride ||
              rideDetail?.driver_cancel_ride
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
