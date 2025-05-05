import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import { Box, Button, Stack, Typography } from '@mui/material';
import { format } from 'date-fns';
import SafeImage from './SafeImage';
import StarIcon from '@mui/icons-material/Star';

export default function RideDetails({ rideDetail, setRideDetailStatus, setSubTitle }) {
  const router = useRouter();

  const handleBackButton = () => {
    setRideDetailStatus(false);
    setSubTitle('History');
    router.back();
  };

  return (
    <Stack spacing={2}>
      <StyledBox>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2}>
            <Box>
              <SafeImage src="/map.png" alt="map" width={30} height={30} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  textAlign: 'center',
                }}
              >
                {rideDetail?.ride_start_time
                  ? format(new Date(rideDetail.ride_start_time), 'dd-MM-yyyy hh:mm a')
                  : 'N/A'}
              </Typography>
            </Box>
          </Stack>
          <Stack spacing={2}>
            <Stack direction="row" spacing={2}>
              <Box>
                <Typography variant="h6">Pickup Location</Typography>
                <Typography variant="body1">{rideDetail?.request.start_location_name}</Typography>
              </Box>
            </Stack>
            {rideDetail?.promotion_discount !== '0.00' &&
              rideDetail?.promotion_discount !== '0' && (
                <Stack direction="row" spacing={2}>
                  <Box>
                    <Typography variant="h6">Promotion Discount</Typography>
                    <Typography variant="body1">{rideDetail?.promotion_discount}</Typography>
                  </Box>
                </Stack>
              )}
            <Stack direction="row" spacing={2}>
              <Box>
                <Typography variant="h6">Drop Location</Typography>
                <Typography variant="body1">{rideDetail?.request.end_location_name}</Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={2}>
              <Box>
                <Typography variant="h6">Ride Type</Typography>
                <Typography variant="body1">{rideDetail?.request.ride_type || 'N/A'}</Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={2}>
              <Box>
                <Typography variant="h6">Trip Time</Typography>
                <Typography variant="body1">
                  {format(new Date(rideDetail.ride_start_time), 'hh:mm a')}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={2}>
              <Box>
                <Typography variant="h6">Trip Date</Typography>
                <Typography variant="body1">
                  {format(new Date(rideDetail.ride_start_time), 'dd MMM yyyy')}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={2}>
              <Box>
                <Typography variant="h6">Rated</Typography>
                <RatingStar>
                  {rideDetail?.customer_rating ? (
                    <>
                      {rideDetail.customer_rating} <StarIcon />
                    </>
                  ) : (
                    'N/A'
                  )}
                </RatingStar>
              </Box>
            </Stack>

            <Stack direction="row" spacing={2}>
              <Box>
                <Typography variant="h6">Total Fare</Typography>
                <Typography variant="body1">$ {rideDetail?.total_cost || '0'}</Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={2}>
              <Box>
                <Typography variant="h6">Trip Distance</Typography>
                <Typography variant="body1">
                  {rideDetail?.distance_travelled || 'N/A'} km
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={2}>
              <Box>
                <Typography variant="h6">Trip Duration</Typography>
                <Typography variant="body1">{rideDetail?.ride_duration || 'N/A'}</Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={2}>
              <Box>
                <Typography variant="h6">Payment Done By</Typography>
                <Typography variant="body1">
                  {rideDetail?.request?.payment_mode === 1 ? 'Card' : 'Cash'}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={2}>
              <Box>
                <Typography variant="h6">Status</Typography>
                <Typography variant="body1">
                  {rideDetail?.request.status === 0 ? 'Cancelled' : 'Success'}
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Stack>
      </StyledBox>
      <Button
        variant=""
        color="primary"
        sx={{
          mt: 4,
        }}
        onClick={handleBackButton}
      >
        Back
      </Button>
    </Stack>
  );
}
const StyledBox = styled.div`
  ${({ theme }) => `
    background-color: ${theme.colors.palette.white};
    border-radius: 16px 0px 16px 16px;
    box-shadow: 0px 0px 15px -1px rgba(0, 0, 0, 0.1);
    padding: 24px;
    position: relative;
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
