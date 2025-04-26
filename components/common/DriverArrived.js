import PageTitle from '@/components/common/PageTitle';
import styled from '@emotion/styled';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import StarIcon from '@mui/icons-material/Star';
import { Button, Typography } from '@mui/material';
import { useState } from 'react';
import CancelModel from './model/CancelModel';
export default function DriverArrived(handleCancelModelInfo, acceptDriverDetail, rideStatus) {
  //const router = useRouter();
  const [openCancelModel, setOpenCancelModel] = useState(false);
  const handleOpenModel = () => {
    setOpenCancelModel(true);
  };
  const handleCloseModel = () => {
    setOpenCancelModel(false);
  };
  const cancelRide = () => {
    setOpenCancelModel(false);
    handleCancelModelInfo();
  };
  return (
    <>
      <PageTitle
        title={
          rideStatus === 2
            ? 'Arriving Now'
            : rideStatus === 3
            ? 'Driver Arrived'
            : rideStatus === 4
            ? 'In Route'
            : ''
        }
        subtitle="Arrived"
        images_icon={'../driver.png'}
      ></PageTitle>

      <RouteDriver>
        <DriverInfo>
          <DriverLeft>
            <Typography variant="subtitle2">{acceptDriverDetail?.driver_name}</Typography>
            <Typography variant="h2" component="h2">
              {acceptDriverDetail?.vehicle_number}
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{
                mt: 0,
              }}
            >
              {acceptDriverDetail?.vehicle_color} {acceptDriverDetail?.vehicle_make}{' '}
              {acceptDriverDetail?.vehicle_model} {acceptDriverDetail?.vehicle_type}
            </Typography>
            <RatingStar>
              <StarIcon /> {acceptDriverDetail?.rating}
            </RatingStar>
          </DriverLeft>
          {
            <DriverRight>
              <img src={`${acceptDriverDetail?.vehicle_image}`} />
              <div>
                <img src={`${acceptDriverDetail?.driver_image}`} />
              </div>
            </DriverRight>
          }
        </DriverInfo>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            mt: 2,
          }}
        >
          <CallOutlinedIcon /> Call Driver
        </Button>
        <Button
          variant="outlinedSecondary"
          color="primary"
          fullWidth
          sx={{
            mt: 1,
          }}
          onClick={handleOpenModel}
        >
          <HighlightOffOutlinedIcon /> Cancel Ride
        </Button>
        <CancelModel
          open={openCancelModel}
          handleClose={handleCloseModel}
          actionCancel={cancelRide}
        />
      </RouteDriver>
    </>
  );
}
const RouteDriver = styled.div`
  ${() => `
    border: 1px solid #e9e9e9;
    border-radius: 6px;
    padding: 20px 15px;
  `}
`;
const DriverInfo = styled.div`
  ${() => `
    display: flex;
    align-items: center;
    justify-content: space-between;
  `}
`;
const DriverLeft = styled.div`
  ${() => `
    h2 {
      font-weight: 700;
    }
    font-size: 22px;
  `}
`;
const RatingStar = styled.div`
  ${({ theme }) => `
    display: flex;
    align-items: center;
    font-size: 14px;
    .MuiSvgIcon-root {
      color: ${theme.colors.palette.orange};
      font-size: 24px;
      margin-right: 5px;
    }
  `}
`;
const DriverRight = styled.div`
  ${() => `
    position: relative;
    text-align: center;
    margin-right: 10px;
    flex: 0 0 120px;
    max-width: 120px;

    > img {
      max-width: 100%;
    }

    div {
      position: absolute;
      top: 0px;
      right: -10px;
      z-index: 1;
      width: 45px;
      height: 45px;
      border-radius: 50%;

      img {
        border-radius: 100%;
        object-fit: cover;
        width: 100%;
        height: 100%;
      }
    }
  `}
`;
