import PageTitle from '@/components/common/PageTitle';
import { api } from '@/utils/api/common';
import styled from '@emotion/styled';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import StarIcon from '@mui/icons-material/Star';
import { Button, Typography } from '@mui/material';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import SpinnerLoader from './SpinnerLoader';
import CancelModel from './model/CancelModel';
import MessageModel from './model/MessageModel';
export default function InRoute({
  handleCancelModelInfo,
  acceptDriverDetail,
  rideStatus,
  handleCancelRunningRide,
  userAuth,
}) {
  const [openCancelModel, setOpenCancelModel] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState('');
  const [sosLoading, setSosLoading] = useState(false);
  const [openSOS, setOpenSOS] = useState(false);
  const [sosLocation, setSosLocation] = useState({});
  const router = useRouter();

  const cancelRide = () => {
    setOpenCancelModel(false);
    if (rideStatus === 2 || rideStatus === 3) {
      handleCancelModelInfo();
    } else {
      handleCancelRunningRide();
    }
  };

  const handleCallDriver = () => {
    const phoneNumber = acceptDriverDetail?.driver_twilio; //'+1470-735-7308';
    window.open(`tel:${phoneNumber}`, '_blank');
  };

  const handleOpenSOS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async position => {
          setSosLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        error => {
          console.error('Error getting user location:', error);
        }
      );
    }
    setOpenSOS(true);
  };

  const handleSOS = async () => {
    const formData = new FormData();
    formData.append('current_lat', sosLocation.lat);
    formData.append('current_long', sosLocation.lng);
    formData.append('token_code', userAuth.token_code);
    formData.append('ride_id', acceptDriverDetail.ride_id);
    setSosLoading(true);
    setOpenSOS(false);
    const response = await api({
      data: formData,
      method: 'POST',
      url: '/customer/booking/send-sos',
    });

    if (response.status === true) {
      setSosLoading(false);
      toast.info(response.message);
    } else if (response.status === false && response.message === 'Invalid token code') {
      toast.error(
        'Your account has been logged in on another device.Please login again to continue.'
      );
      await signOut({
        redirect: false,
      });
      router.push('/login');
    } else if (response.status === false) {
      setSosLoading(false);
      toast.info(response.message);
    } else {
      setSosLoading(false);
      toast.info(response.message);
    }
  };

  useEffect(() => {}, []);

  return (
    <>
      <SpinnerLoader loading={sosLoading} />
      <PageTitle
        title=""
        subtitle={acceptDriverDetail.ride_status}
        images_icon={'../iconInRoute.png'}
      ></PageTitle>
      <RouteDriver>
        <DriverInfo>
          <DriverLeft>
            <Typography variant="subtitle2">
              {acceptDriverDetail?.driver_info.driver_name}
            </Typography>
            <Typography variant="subtitle2"> Pin for this Trip:</Typography>
            <Typography sx={{ fontSize: 28 }} variant="h2" component="h2">
              {acceptDriverDetail?.request_data.request_otp}
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{
                mt: 0,
              }}
            >
              {acceptDriverDetail?.driver_info.vehicle_make}{' '}
              {acceptDriverDetail?.driver_info.vehicle_model}
              {acceptDriverDetail?.driver_info.vehicle_type}
            </Typography>
            <Typography variant="subtitle2">
              <strong>Vehicle Number:</strong> {acceptDriverDetail?.driver_info.vehicle_no || 'N/A'}
            </Typography>
            <Typography variant="subtitle2">
              <strong>Ride Type:</strong> {acceptDriverDetail?.ride_type || 'N/A'}
            </Typography>
            <RatingStar>
              <StarIcon /> {acceptDriverDetail?.driver_info.driver_rating}
            </RatingStar>
          </DriverLeft>
          {
            <DriverRight>
              <img src={`${acceptDriverDetail?.driver_info.vehicle_image}`} />
              <img
                src={acceptDriverDetail.driver_info.driver_image || '/avatar.png'}
                alt="Driver"
                style={{
                  borderRadius: '50%',
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                  objectFit: 'cover',
                  width: '50px',
                  height: '50px',
                }}
              />
            </DriverRight>
          }
        </DriverInfo>
        {rideStatus !== 3 && rideStatus !== 4 && (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              mt: 2,
            }}
            onClick={handleCallDriver}
          >
            <CallOutlinedIcon /> Call Driver
          </Button>
        )}
        <Button
          variant="outlinedSecondary"
          color="primary"
          fullWidth
          sx={{
            mt: 1,
          }}
          onClick={() => {
            setOpenCancelModel(true);
          }}
        >
          <HighlightOffOutlinedIcon /> Cancel Ride
        </Button>
        {rideStatus === 3 && (
          <Button
            variant="outlinedSecondary"
            color="primary"
            fullWidth
            sx={{
              color: 'red',
              fontSize: '40px',
              fontWeight: '500',
              mt: 1,
            }}
            onClick={handleOpenSOS}
          >
            SOS
          </Button>
        )}

        <MessageModel
          open={openSOS}
          close={() => setOpenSOS(false)}
          handleAction={handleSOS}
          message="Are you sure want to send an alert to your emergency contacts?"
        />
        <CancelModel
          open={openCancelModel}
          handleClose={() => setOpenCancelModel(false)}
          actionCancel={cancelRide}
          deleteMessage={deleteMessage}
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
    padding: 10px;
    background: #f6f7f8
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
