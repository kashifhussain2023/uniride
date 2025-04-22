import styled from "@emotion/styled";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Typography } from "@mui/material";
import { format, parse } from "date-fns";
import RideDetails from "../RideDetails";
import { useState } from "react";

export default function RiderHistory({ riderHistory, setSubTitle }) {
  const [rideDetailStatus, setRideDetailStatus] = useState(true);
  const [rideDetail, setRideDetail] = useState();

  const rideDetailData = (index) => {
    setRideDetailStatus(false);
    setRideDetail(riderHistory[index]);
    setSubTitle("History Detail");
  };

  return (
    <>
      {rideDetailStatus ? (
        riderHistory.length !== 0 ? (
          riderHistory.map((historyItem, index) => (
            <HistoryRow key={index}>
              <HistoryImage onClick={() => rideDetailData(index)}>
                <img
                  src={historyItem.path_image || "../mapImg.png"}
                  alt="Map Image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "../mapImg.png";
                  }}
                />
              </HistoryImage>
              <HistoryDescription>
                <Title variant="h3" onClick={() => rideDetailData(index)}>
                  Ride Type
                </Title>
                <Typography variant="subtitle1">
                  {historyItem.request.ride_type?.charAt(0).toUpperCase() +
                    historyItem.request.ride_type?.slice(1)}
                </Typography>
                <DateTime>
                  <CalendarMonthIcon />
                  {new Date(historyItem.ride_start_time).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </DateTime>
  
                <Typography variant="subtitle1">
                  {historyItem.distance_travelled} mi
                </Typography>
                <Typography variant="subtitle1" sx={{ mt: 1 }}>
                  {historyItem.request.ride_type}
                </Typography>
              </HistoryDescription>
              <HistoryAction>
                <Price>
                  $
                  {(parseFloat(historyItem.request.approximate_fare) || 0).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Price>
                <Action>
                  <Typography variant="success">
                    {historyItem.customer_cancel_ride || historyItem.driver_cancel_ride
                      ? "Cancelled"
                      : "Success"}
                  </Typography>
                </Action>
              </HistoryAction>
            </HistoryRow>
          ))
        ) : (
          <HistoryRow>
            <NoRecord>No records found</NoRecord>
          </HistoryRow>
        )
      ) : (
        <RideDetails
          rideDetail={rideDetail}
          setRideDetailStatus={setRideDetailStatus}
          setSubTitle={setSubTitle}
        />
      )}
    </>
  );
  
}

const HistoryRow = styled.div`
  ${({ theme }) => `
    border: 1px solid ${theme.colors.palette.grey};
    padding: 15px;
    border-radius: 16px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;

    @media (min-width: ${theme.breakpoints.values.xs}px) {
      display: flex;
      flex-wrap: wrap;
    }

    @media (min-width: ${theme.breakpoints.values.md}px) {
      flex-wrap: nowrap;
      padding: 30px;
    }
    @media (min-width: ${theme.breakpoints.values.lg}px) {
      flex-wrap: nowrap;
      padding: 30px 30px 0px 30px;
    }
  `}
`;

const HistoryImage = styled.div`
  ${({ theme }) => `
    width: 100%;
    flex: 0 0 345px;
    box-shadow: 0px 0px 14px 0px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    
    @media (min-width: ${theme.breakpoints.values.xs}px) {
      flex: 0 0 100%;
      margin-bottom: 30px;
    }

    @media (min-width: ${theme.breakpoints.values.md}px) {
      width: 100%;
      flex: 0 0 200px;
    }
    @media (min-width: ${theme.breakpoints.values.lg}px) {
      width: 100%;
      flex: 0 0 345px;
    }

    img {
      border-radius: 6px;
      height: 100%;
      width: 100%;
      border: 1px solid ${theme.colors.palette.white};
      object-fit: cover;
    }
  `}
`;

const HistoryDescription = styled.div`
  ${({ theme }) => `
    width: 100%;
    margin-left: 30px;

    @media (min-width: ${theme.breakpoints.values.xs}px) {
      margin-left: 0px;
    }

    @media (min-width: ${theme.breakpoints.values.md}px) {
      margin-left: 30px;
    }

    h3 {
      font-weight: 600;
      color: ${theme.colors.palette.dGray};

      @media (min-width: ${theme.breakpoints.values.sm}px) {
        font-size: 18px;
      }

      @media (min-width: ${theme.breakpoints.values.md}px) {
        font-size: 20px;
      }
    }
  `}
`;

const HistoryAction = styled.div`
  width: 100%;
  flex: 0 0 100px;
`;

const DateTime = styled.div`
  ${({ theme }) => `
    margin: 5px 0px;
    color: ${theme.colors.palette.darkGrey};
    display: flex;
    align-items: center;

    .MuiSvgIcon-root {
      color: ${theme.colors.palette.orange};
    }
  `}
`;
const Price = styled.div`
  ${({ theme }) => `
    font-size: 22px;
    color: ${theme.colors.palette.orange};
    font-weight: 700;
    margin-top: 10px;

    @media (min-width: ${theme.breakpoints.values.md}px) {
      margin-top: 0px;
    }
  `}
`;

const Action = styled.div`
  ${({ theme }) => `
    text-align: right;

    @media (min-width: ${theme.breakpoints.values.xs}px) {
      text-align: left;
    }
  `}
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

const Title = styled(Typography)`
  ${({ theme }) => `
      &.MuiTypography-root {
        &:hover {
            color: ${theme.colors.palette.orange};
            cursor: pointer;
        }
      }
  `}
`;
