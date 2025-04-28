import styled from '@emotion/styled';
import { Box, Button, Stack, Typography } from '@mui/material';
import { format } from 'date-fns';
import SafeImage from './SafeImage';

export default function RideDetails({ rideDetail, setRideDetailStatus, setSubTitle }) {
  const handleBackButton = () => {
    setRideDetailStatus(false);
    setSubTitle('History');
  };
  return (
    <Stack spacing={2}>
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
                {format(new Date(rideDetail?.ride_start_time), 'dd-MM-yyyy hh:mm a') || 'N/A'}
              </Typography>
            </Box>
          </Stack>
          <Stack spacing={2}>
            <Stack direction="row" spacing={2}>
              <Box>
                <Typography variant="h6">Pickup Location</Typography>
                <Typography variant="body1">{rideDetail?.pickup_location}</Typography>
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
                <Typography variant="body1">{rideDetail?.drop_location}</Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Box>
                <Typography variant="h6">Payment Mode</Typography>
                <Typography variant="body1">
                  {rideDetail?.request?.payment_mode === 1 ? 'Card' : 'Cash'}
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Box>
                <Typography variant="h6">Status</Typography>
                <Typography variant="body1">
                  {rideDetail?.status === 0 ? 'Cancelled' : 'Success'}
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
