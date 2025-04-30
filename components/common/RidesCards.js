import { useState } from "react";
import { useCarContext } from "@/pages/context/CarListContext";
import styled from "@emotion/styled";
import { Link, Typography } from "@mui/material";
import RidesFareDialog from "./RidesFareDialog";

export default function RidesCards({
  carsList,
  type,
  handleCarTypeId,
  carStatus,
  setAvgTime,
  setAvailableDriver,
  distance,
  duration,
}) {
  // const { carsList } = useCarContext();
  
  // Filter cars based on type
  const filterCarList = type === "regular" 
    ? carsList?.filter((item) => item.is_corporate === "0")
    : carsList?.filter((item) => item.is_corporate !== "0");

  // Find default active car index
  const defaultActiveIndex = filterCarList?.findIndex(
    (car) => car.default_car === true
  );

  const [activeIndex, setActiveIndex] = useState();
  const [doubleClickDialogOpen, setDoubleClickDialogOpen] = useState(false);
  const [ridesFareData, setRidesFareData] = useState();

  const handleDoubleClick = (carFareData) => {
    // Add distance and duration to the car fare data
    const enhancedCarFareData = {
      ...carFareData,
      distance: distance || carFareData.distance || "6.8",
      duration: duration || carFareData.duration || "22"
    };
    
    setRidesFareData(enhancedCarFareData);
    setDoubleClickDialogOpen(true);
  };

  const handleClose = () => {
    setDoubleClickDialogOpen(false);
  };

  const handleCarClick = (index, id, avgTime, drivers) => {
    setActiveIndex(index);
    handleCarTypeId(id);
    setAvgTime(avgTime);
    setAvailableDriver(drivers);
  };

  return (
    <>
      {carStatus ? (
        <>
          {carsList && carsList.length > 0 ? (
            carsList.map((car, index) => (
              <RideCars
                key={index}
                className={
                  (activeIndex || activeIndex === 0
                    ? activeIndex
                    : defaultActiveIndex) === index
                    ? "active"
                    : ""
                }
                onClick={() =>
                  handleCarClick(index, car.id, car.avg_time, car.drivers)
                }
                onDoubleClick={() => handleDoubleClick(car)}
              >
                <Link>
                  <Cars className={"cars" + index}>
                    <img
                      src={car.list_car_image}
                      style={{ height: "60px", width: "60px" }}
                      alt="car image"
                    />
                  </Cars>
                  <CarsDescription>{car.name}</CarsDescription>
                </Link>
                <RidesFareDialog
                  handleDoubleClick={handleDoubleClick}
                  doubleClickDialogOpen={doubleClickDialogOpen}
                  handleClose={handleClose}
                  ridesFareData={ridesFareData}
                />
              </RideCars>
            ))
          ) : (
            <NoRecord>No car available</NoRecord>
          )}
        </>
      ) : null}
    </>
  );
}

const Cars = styled.div`
  width: 107px;
  margin-right: 10px;
`;

const CarsDescription = styled.div`
  ${({ theme }) => `
    width: 100%;
    font-size: 16px;
    color: ${theme.colors.palette.black};
    font-weight: 600;

    span {
      display: block;
      font-size: 14px;
      color: ${theme.colors.palette.darkGrey};
      font-weight: 400;
    }
  `}
`;

const RideCars = styled.div`
  ${({ theme }) => `
    a {
      display: flex;
      align-items: center;
      padding: 10px;
      border: 1px solid ${theme.colors.palette.white};
      margin-bottom: 15px;
      text-decoration: none;

      &:hover {
        cursor: pointer;
        border-radius: 6px;
        border: 1px solid ${theme.colors.palette.orange};
        box-shadow: 0px 0px 15px -1px rgba(0, 0, 0, 0.1);
      }

      &.active {
        cursor: pointer;
        border-radius: 6px;
        border: 1px solid ${theme.colors.palette.orange};
        box-shadow: 0px 0px 15px -1px rgba(0, 0, 0, 0.1);
      }
    }

    &.active {
      a {
        cursor: pointer;
        border-radius: 6px;
        border: 1px solid ${theme.colors.palette.orange};
        box-shadow: 0px 0px 15px -1px rgba(0, 0, 0, 0.1);
      }
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
