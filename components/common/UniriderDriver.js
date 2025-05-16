import styled from '@emotion/styled';
import PageTitle from '@/components/common/PageTitle';
import { ListItem, Typography, List } from '@mui/material';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
export default function UniriderDriver() {
  return (
    <>
      <PageTitle title="UniRide" subtitle="Driver" images_icon={'/driver.png'}></PageTitle>

      <RouteDriver>
        <MessageBox>
          Sorry the customer has cancelled the ride due to Lorem ipsum dolor sit amet, consectetur.
        </MessageBox>
        <BookingDtl>
          <List>
            <ListItem>
              <BookingLabel>
                <Typography variant="h3" component="h3">
                  Prime SUV
                </Typography>
                5 People
              </BookingLabel>
              <Details>
                <Price>$114</Price>
              </Details>
            </ListItem>
            <ListItem>
              <BookingLabel>Trip Distance</BookingLabel>
              <Details>0.00 miles</Details>
            </ListItem>
            <ListItem>
              <BookingLabel>Trip Duration</BookingLabel>
              <Details>00:00:24</Details>
            </ListItem>
            <ListItem>
              <BookingLabel>Payment Type</BookingLabel>
              <Details>Card</Details>
            </ListItem>
            <ListItem>
              <BookingLabel>Ride Type</BookingLabel>
              <Details>Regular</Details>
            </ListItem>
          </List>
        </BookingDtl>
      </RouteDriver>

      <RateYourTrip>
        <Typography
          variant="h4"
          component="h4"
          sx={{
            mb: 1,
          }}
        >
          Rate your trip experience
        </Typography>
        <Stack spacing={1}>
          <RateList>
            <Rating name="size-medium" defaultValue={2} size="small" /> Behavior
          </RateList>
          <RateList>
            <Rating name="size-medium" defaultValue={2} size="small" /> Courtesy
          </RateList>
          <RateList>
            <Rating name="size-medium" defaultValue={2} size="small" /> Friendly
          </RateList>
        </Stack>
      </RateYourTrip>
    </>
  );
}
const RouteDriver = styled.div`
  ${() => `
    border:1px solid #e9e9e9;
    border-radius:6px;
    padding:20px 15px; margin-bottom:24px;
  `}
`;
const BookingDtl = styled.div`
  ${({ theme }) => `
  .MuiList-root{
    .MuiListItem-root{ display:flex; align-items:center; justify-content:space-between; padding:0px 0px 12px 0px; margin:0px 0px 12px 0px; border-bottom:1px solid ${theme.colors.palette.grey};
    &:last-child{ border-bottom:0px solid #000; padding:0px; margin-bottom:0px}

}

  }  



  `}
`;
const BookingLabel = styled.div`
  ${({ theme }) => `
    font-size:14px; color:${theme.colors.palette.darkGrey}; width:100px; flex:0 0 100px;
  `}
`;
const Details = styled.div`
  ${({ theme }) => `
    width:100%; font-weight:700;  color:${theme.colors.palette.dGray}; text-align:right;

  `}
`;
const Price = styled.div`
  ${({ theme }) => `
    font-size:24px; color:${theme.colors.palette.orange}; font-weight:700;
  `}
`;
const MessageBox = styled.div`
  ${() => `
   background-color:#fce8e6; border-radius:6px; padding:10px; margin-bottom:10px;
  `}
`;
const RateYourTrip = styled.div`
  ${() => `
    h4{ font-weight:600} 

  `}
`;
const RateList = styled.div`
  ${() => `
    display:flex; font-size:14px; margin-bottom:15px;

  `}
`;
