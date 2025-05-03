import PageTitle from '@/components/common/PageTitle';
import InnerContent from '@/components/presentation/InnerContent';
import { api } from '@/utils/api/common';
import styled from '@emotion/styled';
import { Button, Rating, Typography } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import SpinnerLoader from './SpinnerLoader';
import TipAmountModel from './model/TipAmountModel';

// Helper functions for formatting
const formatDuration = duration => {
  if (!duration) return 'N/A';

  // If duration is in seconds, convert to minutes
  const minutes = Math.round(parseInt(duration) / 60);

  if (minutes < 60) {
    return `${minutes} min`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}min`;
  }
};

const formatDistance = distance => {
  if (!distance) return 'N/A';

  // If distance is in meters, convert to miles
  const miles = (parseFloat(distance) * 0.000621371).toFixed(1);
  return `${miles} mi`;
};

export default function Review({ acceptDriverDetail }) {
  const rideData = acceptDriverDetail;

  // {
  //   applied_rates: {
  //     allow_basefare: '1',
  //     base_fare: 20,
  //     cancelation_fee: '25.00',
  //     car_image: 'https://unirideusadmin.24livehost.com/api/image/cars/1568266147.png',
  //     car_name: 'Lux',
  //     car_type_id: 3,
  //     city_availability: '1',
  //     expiration_time: null,
  //     fare_multiplier: '1',
  //     maximum_estimated_fare: '1099.00',
  //     minimum_estimated_fare: '1083.00',
  //     minimum_fare: '15.00',
  //     per_mile_fare: '30.00',
  //     per_minute_fare: '35.00',
  //   },
  //   cancel_charge: 10,
  //   customer_id: 199,
  //   customer_info: {
  //     customer_id: 199,
  //     customer_image:
  //       'https://uniridedev.24livehost.com/uploads-customer/1744969207853-996276091.jpg',
  //     customer_lat: '26.8009472',
  //     customer_lng: '75.8611968',
  //     customer_name: 'Chanchal   App',
  //     customer_phone: '+17728030303',
  //   },
  //   driver_id: 3003,
  //   driver_info: {
  //     driver_id: 3003,
  //     driver_image:
  //       'https://unirideusadmin.24livehost.com/uploads/managers/images/1745397797901-90238580.png',
  //     driver_lat: '26.798922940098308',
  //     driver_lng: '75.85681957568602',
  //     driver_name: 'Chanchal Driver App',
  //     driver_number: '+1 9639639639',
  //     driver_phone: '+19639639639',
  //     driver_rating: '1.8',
  //     vehicle_image: 'https://unirideusadmin.24livehost.com/api/image/cars/1568266147.png',
  //     vehicle_make: 'Land Rover',
  //     vehicle_model: 'T2',
  //     vehicle_no: '4921',
  //     vehicle_type: 'Lux',
  //   },
  //   request_data: {
  //     applied_rates:
  //       '{"car_type_id":3,"car_name":"Lux","car_image":"https://unirideusadmin.24livehost.com/api/image/cars/1568266147.png","expiration_time":null,"minimum_fare":"15.00","base_fare":20,"cancelation_fee":"25.00","per_mile_fare":"30.00","per_minute_fare":"35.00","allow_basefare":"1","city_availability":"1","fare_multiplier":"1","minimum_estimated_fare":"1083.00","maximum_estimated_fare":"1099.00"}',
  //     approximate_fare: '1099.00',
  //     car_type: 3,
  //     card_verification_id: '347',
  //     change_droplocation_status: 0,
  //     city_id: 153,
  //     corporate_id: null,
  //     created: '2025-05-03T05:46:59.000Z',
  //     customer: {
  //       apple_id: null,
  //       card_no: null,
  //       card_type: null,
  //       city_id: 153,
  //       corporate_email: null,
  //       corporate_emp_id: null,
  //       corporate_id: null,
  //       corporate_status: 0,
  //       country_code: '+1',
  //       created: '2025-04-18T09:39:27.000Z',
  //       current_location: 'uk',
  //       deleted_at: 0,
  //       device_id: 'tokenfcmrererer',
  //       email: 'Tere.ds1@yopmail.com',
  //       facebook_id: null,
  //       first_name: 'Chanchal ',
  //       gender: 'male',
  //       google_id: null,
  //       id: 199,
  //       image: '1744969207853-996276091.jpg',
  //       is_online: 1,
  //       last_name: 'App',
  //       lat: '26.8009472',
  //       location_permission: 0,
  //       long: '75.8611968',
  //       middle_name: 'Rider ',
  //       name: 'Chanchal   App',
  //       os: 'android',
  //       otp: null,
  //       otp_email: null,
  //       otp_status: 1,
  //       password: '$2a$10$CFHbv93VPVS/1PE/T2v49eTShUhzn3aZKG3H7p/OhtDd14kMUM7DG',
  //       payment_token: null,
  //       phone: '7728030303',
  //       pin_lat: '26.8009472',
  //       pin_long: '75.8611968',
  //       profile_status: 1,
  //       referral_code: '',
  //       reset_token: null,
  //       status: 1,
  //       stripe_custmer_id: 'cus_S9Un2LHxTQRIZz',
  //       token:
  //         'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IlRlcmUuZHMxQHlvcG1haWwuY29tIiwiaWQiOjE5OSwiaWF0IjoxNzQ2MTkzNDQ5LCJleHAiOjE3Nzc3Mjk0NDl9.aAg8l-Q6dYGgrYn4FGL_sB-qrlKVNcHj7rGe21IGxlE',
  //       update_otp_email: null,
  //       updated: null,
  //     },
  //     distance: '10.1',
  //     driver: {
  //       account_name: null,
  //       address: 'Vel est nihil do mai',
  //       agreement_doc: 'da_15.pdf',
  //       available_status: 2,
  //       bank_account_no: null,
  //       candidate_id: null,
  //       car_insurance_expiry_date: '2025-02-02T00:00:00.000Z',
  //       car_insurance_info: '800',
  //       car_insurance_name: 'Allegra Cleveland',
  //       car_registration_expiry_date: '2025-02-02T00:00:00.000Z',
  //       checkr_candidate_id: null,
  //       checkr_candidate_status: null,
  //       city_id: 280,
  //       convicted: null,
  //       convicted_status: null,
  //       country_code: '+1',
  //       county_id: 40,
  //       created: '2025-02-11T13:14:40.000Z',
  //       current_location: null,
  //       deleted_at: 0,
  //       device_id:
  //         'cpoiHiQ4PEGuoWx-iZc2Oq:APA91bGnnwsEo7M-7f6zKNWXMYXbL3cukTPdipq3vE_s_F5ll9HaED5XevhRK2oTIltjaRlmlgnofxLoY0dgoim-BZF7_Z7twJiDJgqieyxmTAYTkMlFT6w',
  //       direction: '0',
  //       dob: '2025-02-18T00:00:00.000Z',
  //       drive_in_city: null,
  //       driver_license: 'Screenshot (15).png',
  //       email: 'chanchal@dotsquares.com',
  //       father_name: null,
  //       first_name: 'Chanchal',
  //       gender: 'Male',
  //       id: 3003,
  //       is_designated: 1,
  //       lat: '26.798922940098308',
  //       lic: null,
  //       licence_expiry_date: '2025-02-24T00:00:00.000Z',
  //       licence_no: '384',
  //       lng: '75.85681957568602',
  //       middle_name: 'Driver',
  //       no_of_seat: null,
  //       os: 'ios',
  //       otp: null,
  //       password: '$2a$10$P5a6SvpgTgFawB.da/Rgr.eNV9mOkGZYb.5CqYWQd/5pfvKE.pUHK',
  //       password_reset_token: null,
  //       phone: '9639639639',
  //       postal_code: '12446',
  //       private_license: null,
  //       profile_pic: '1745397797901-90238580.png',
  //       profile_status: null,
  //       referral_amount_alloted: 0,
  //       referrer_id: null,
  //       region: null,
  //       reset_token: null,
  //       second_name: 'App',
  //       security_fee_status: 1,
  //       sign_data_image_svg: null,
  //       sign_svg_image: null,
  //       sort_code: null,
  //       ssn: 'Quisquam tempor id ',
  //       state_id: 22,
  //       status: 1,
  //       step: null,
  //       stripe_status: '1',
  //       tag: 'Rerum anim vero exce',
  //       token:
  //         'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNoYW5jaGFsQGRvdHNxdWFyZXMuY29tIiwiaWQiOjMwMDMsImlhdCI6MTc0NjE4ODIxNiwiZXhwIjoxNzc3NzI0MjE2fQ.dE6WsIphDiCoFVhcfHZAFPZNWRKDfDUfFxg91y1yeNo',
  //       update_otp_email: null,
  //       updated: null,
  //       vehicle_color: 'RED',
  //       vehicle_insurance: 'Screenshot (15).png',
  //       vehicle_make: 'Land Rover',
  //       vehicle_model: 'T2',
  //       vehicle_no: '4921',
  //       vehicle_registration: 'Screenshot (16).png',
  //       vehicle_type: '3',
  //       vin: null,
  //       wallet: null,
  //       year_of_vehicle: '1973',
  //     },
  //     driver_side_request: 0,
  //     end_location_lat: '26.853021',
  //     end_location_lon: '75.8046688',
  //     end_location_name:
  //       'Jawahar Lal Nehru Marg, D-Block, Malviya Nagar, Jaipur, Rajasthan 302017, India',
  //     gender: 'male',
  //     hpsr_customer_id: 199,
  //     hpsr_driver_id: 3003,
  //     id: 288,
  //     is_share: 2,
  //     payment_mode: 1,
  //     payment_switch_reason: null,
  //     promo_code: null,
  //     promotion_discount: '0',
  //     promotion_id: null,
  //     request_otp: '1229',
  //     request_otp_verified: 1,
  //     ride_type: 'regular',
  //     schedule_id: null,
  //     start_location_lat: '26.8009472',
  //     start_location_lon: '75.8611968',
  //     start_location_name:
  //       'BC17/S23, Karolan Ka Barh, Jaipur, Shri Kishanpura, Rajasthan 303905, India',
  //     status: 1,
  //     time: null,
  //     total_passengers: 4,
  //     twilio_number: null,
  //     unique_request_id: 'OD0285',
  //     updated: null,
  //   },
  //   request_id: 288,
  //   ride_id: 144,
  //   ride_status: 'Completed',
  //   ride_status_value: 4,
  //   ride_type: 'regular',
  // };

  const [rideResponse, setRideResponse] = useState({
    customer_destination_point_name: rideData.request_data.end_location_name,
    customer_pick_up_point_name: rideData.request_data.start_location_name,
    discount_applied: rideData.request_data.promotion_id !== null,
    discount_total: rideData.request_data.promotion_discount,
    payment_type: rideData.request_data.payment_mode,
    ride_id: rideData.ride_id,
    ride_type: rideData.ride_type,
    total_cost: rideData.applied_rates.maximum_estimated_fare,
    trip_distance: rideData.request_data.distance,
    trip_duration: rideData.request_data.time,
    vehicle_type: rideData.driver_info.vehicle_type,
  });

  const [reviewQuestionDetail, setReviewQuestionDetail] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [remark, setRemark] = useState('');
  const [customTipModel, setCustomTipModel] = useState(false);
  const [driverTip, setDriverTip] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(rideData.applied_rates.maximum_estimated_fare);
  const [tipStatus, setTipStatus] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleRatingChange = (index, rating) => {
    setRatings(prevRatings => {
      const newRatings = [...prevRatings];
      newRatings[index] = {
        id: reviewQuestionDetail[index]?.id,
        rating,
      };
      return newRatings;
    });
  };

  const handleTipClick = (tipPercentage, index) => {
    const tipAmount = (totalAmount * tipPercentage) / 100;
    const roundedNumber = tipAmount.toFixed(1);
    setTipStatus(true);
    setDriverTip(parseFloat(roundedNumber));
    setActiveIndex(index);
  };

  const handleGetCustomTip = tipAmount => {
    setTipStatus(true);
    setDriverTip(tipAmount);
    setActiveIndex(4);
  };

  const tipModelClose = () => setCustomTipModel(false);
  const skipTip = () => {
    setTipStatus(false);
    setDriverTip('');
    setActiveIndex(0);
  };
  const submitReview = async () => {
    const filteredRating = ratings.filter(element => element !== undefined && element !== 'empty');
    if (filteredRating.length === 0) {
      toast.error('Please give at least one rating');
      return false;
    }

    const ratingData = filteredRating.map(item => ({
      question_id: item.id,
      rating: Number(item.rating),
    }));

    const payload = {
      customer_feedback: remark,
      driver_tip: driverTip,
      rating: ratingData,
      ride_id: rideResponse.ride_id,
    };

    try {
      setReviewLoading(true);
      const response = await api({
        data: payload,
        method: 'POST',
        url: '/customer/booking/save-rating',
      });

      if (response.status === true) {
        toast.info(response.message);
        setTimeout(() => window.location.reload(), 2000);
      } else {
        toast.info(response.message);
      }
    } catch (error) {
      toast.error('An error occurred while submitting the review');
    } finally {
      setReviewLoading(false);
    }
  };

  const getReviewPageDetail = async () => {
    try {
      const response = await api({
        method: 'GET',
        url: `/customer/booking/job-receipt?request_id=${rideData.request_id}`,
      });

      if (response.status === true) {
        setReviewQuestionDetail(response.data.questions);
      }
    } catch (error) {
      toast.error('Failed to load review questions');
    }
  };

  useEffect(() => {
    getReviewPageDetail();
  }, []);

  console.log('rideResponse', rideResponse);
  return (
    <InnerContent>
      <SpinnerLoader loading={reviewLoading} />
      <PannelSection>
        <LeftPannel>
          <PageTitle title="Customer" subtitle="Review" images_icon={'../review.png'} />
          {rideResponse?.discount_total && rideResponse?.discount_applied === true && (
            <DiscountLabel>
              <img src="../couponIcon.png" alt="Discount" />
              <Typography variant="h3" component="h3">
                {rideResponse?.discount_total} discount applied
              </Typography>
            </DiscountLabel>
          )}
          <RouteDetail>
            <ReviewHead>
              <BookingLabel>
                <Typography variant="h3" component="h3">
                  {rideResponse?.vehicle_type}
                </Typography>
              </BookingLabel>
              <Details>
                <Price>${rideResponse?.total_cost}</Price>
              </Details>
            </ReviewHead>
            <ActiveLocation>
              <Typography variant="subtitle3" component="p">
                {rideResponse?.customer_pick_up_point_name}
              </Typography>
            </ActiveLocation>
            <PreviousLocation>
              <Typography variant="subtitle3" component="p">
                {rideResponse?.customer_destination_point_name}
              </Typography>
            </PreviousLocation>
          </RouteDetail>
          <TipYourDriver>
            <TitleBlock>
              <Typography variant="h4">Tip Your Driver</Typography>
              {tipStatus && (
                <Button variant="text" color="primary" onClick={skipTip}>
                  Skip Tip
                </Button>
              )}
            </TitleBlock>
            <Typography variant="subtitle3" component="p">
              Thank your driver by leaving them a Tip. 100% of the Tip will go to your driver.
            </Typography>
            <List>
              <ListItem>
                <Button
                  onClick={() => handleTipClick(10, 1)}
                  className={activeIndex === 1 ? 'active' : ''}
                >
                  10%
                </Button>
              </ListItem>
              <ListItem>
                <Button
                  onClick={() => handleTipClick(15, 2)}
                  className={activeIndex === 2 ? 'active' : ''}
                >
                  15%
                </Button>
              </ListItem>
              <ListItem>
                <Button
                  onClick={() => handleTipClick(20, 3)}
                  className={activeIndex === 3 ? 'active' : ''}
                >
                  20%
                </Button>
              </ListItem>
              <ListItem>
                <Button
                  onClick={() => setCustomTipModel(true)}
                  className={activeIndex === 4 ? 'active' : ''}
                >
                  Custom
                </Button>
              </ListItem>
            </List>
          </TipYourDriver>
          <RideInfo>
            <RouteDetail>
              <List>
                <ListItem>
                  <BookingLabel>Trip Distance</BookingLabel>
                  <Details>{rideData?.request_data?.distance} KM</Details>
                </ListItem>
                <ListItem>
                  <BookingLabel>Trip Duration</BookingLabel>
                  <Details>{rideData?.request_data?.time} </Details>
                </ListItem>
                <ListItem>
                  <BookingLabel>Payment Type</BookingLabel>
                  <Details>{rideData?.request_data?.payment_mode === 1 ? 'Card' : 'Cash'}</Details>
                </ListItem>
                <ListItem>
                  <BookingLabel>Ride Type</BookingLabel>
                  <Details>{rideData?.ride_type}</Details>
                </ListItem>
              </List>
            </RouteDetail>
          </RideInfo>
        </LeftPannel>
        <RightPannel>
          <Typography variant="h3">Rate your trip experience</Typography>
          <RatingContainer>
            <List>
              {reviewQuestionDetail?.map((question, index) => (
                <ListItem key={question.id} alignItems="flex-start">
                  <ListItemText
                    primary={question.question}
                    secondary={
                      <Rating
                        name={`rating-${question.id}`}
                        value={ratings[index]?.rating || 0}
                        onChange={(event, newValue) => handleRatingChange(index, newValue)}
                      />
                    }
                  />
                </ListItem>
              ))}
            </List>
          </RatingContainer>
          <ReviewArea>
            <ReviewComment>
              <Typography variant="h4" sx={{ mb: 2 }}>
                Comments
              </Typography>
              <TextareaAutosize
                aria-label="empty textarea"
                placeholder="(Optional)"
                style={{
                  height: '290px',
                  width: '100%',
                }}
                name="remark"
                value={remark}
                onChange={e => setRemark(e.target.value)}
              />
            </ReviewComment>
          </ReviewArea>
          <CommentFooter>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={submitReview}
              disabled={reviewLoading}
            >
              Submit
            </Button>
          </CommentFooter>
        </RightPannel>
      </PannelSection>
      <TipAmountModel
        open={customTipModel}
        handleClose={tipModelClose}
        handleGetCustomTip={handleGetCustomTip}
      />
    </InnerContent>
  );
}
const ReviewArea = styled.div`
  ${({ theme }) => `
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    @media (min-width: ${theme.breakpoints.values.md}px) {
      flex-wrap: no-wrap;
    }
  `}
`;
const RatingContainer = styled.div`
  ${() => `
    width: 100%;
  `}
`;
const ReviewComment = styled.div`
  ${({ theme }) => `
    width: 100%;

    textarea {
      padding: 20px;
      border: 1px solid ${theme.colors.palette.grey};
      border-radius: 6px;
      font-size: 16px;
      fontfamily: "'Encode Sans', sans-serif";
      width: 100%;
    }
  `}
`;
const PannelSection = styled.div`
  ${({ theme }) => `
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    @media (min-width: ${theme.breakpoints.values.md}px) {
      flex-wrap: nowrap;
    }
  `}
`;
const LeftPannel = styled.div`
  ${({ theme }) => `
    background-color: ${theme.colors.palette.white};
    width: 100%;
    flex: 0 0 100%;
    margin-bottom: 15px;

    margin-right: calc(${theme.spacing(2)} + 14px);
    border-radius: 16px;
    padding: ${theme.spacing(2)};
    box-shadow: 0px 0px 15px -1px rgba(0, 0, 0, 0.1);
    @media (min-width: ${theme.breakpoints.values.md}px) {
      width: 386px;
      flex: 0 0 386px;
      margin-bottom: 0px;
      border-radius: 16px 0px 16px 16px;
    }
    .MuiTableCell-root {
      h4 {
        font-size: 16px;
      }
    }
  `}
`;
const RightPannel = styled.div`
  ${({ theme }) => `
  position:relative;
  background-color:${theme.colors.palette.white};
  width:100%;
  box-shadow: 0px 0px 15px -1px rgba(0,0,0,0.10);
  border-radius:16px; overflow:hidden;
  padding:30px;

  @media (min-width: ${theme.breakpoints.values.md}px) { 
  border-radius:16px 0px 16px 16px;
  }
   
  img{ max-width:100%; height:100%; object-fit:cover}


  .MuiList-root{ padding:0px; margin:0px; display:flex;justify-content:center; flex-wrap:wrap;
    @media (min-width: ${theme.breakpoints.values.md}px) { 
      justify-content:inherit;
      }
  .MuiListItem-root{ width:inherit; display:inline-flex; background-color:#fcfcfc; border-radius:6px; margin-bottom:5px; width:100%;
    @media (min-width: ${theme.breakpoints.values.md}px) { 
      width:48%;
      }
      @media (min-width: ${theme.breakpoints.values.lg}px) { 
        width:inherit;
        margin-right:2%;
        }

  &:first-child{ margin-right:inherit;
    @media (min-width: ${theme.breakpoints.values.md}px) { 
      margin-right:2%;
      }
      
     }
  &:last-child{ margin-left:inherit;
    @media (min-width: ${theme.breakpoints.values.md}px) { 
      &:last-child{ margin-left:2%;
      }
      @media (min-width: ${theme.breakpoints.values.lg}px) { 
        &:last-child{ margin-left:0;
        }
  }
  
  
  }
  
  }
    
  `}
`;
const RouteDetail = styled.div`
  ${() => `
    border: 1px solid #e9e9e9;
    border-radius: 6px;
    padding: 20px 15px;
    margin-bottom: 24px;
  `}
`;
const ReviewHead = styled.div`
  ${({ theme }) => `
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid ${theme.colors.palette.grey};
    padding-bottom: 15px;
    margin-bottom: 20px;
  `}
`;
const BookingLabel = styled.div`
  ${({ theme }) => `
    font-size: 14px;
    color: ${theme.colors.palette.darkGrey};
    flex: 1;
  `}
`;
const Details = styled.div`
  ${({ theme }) => `
    font-weight: 700;
    color: ${theme.colors.palette.dGray};
    text-align: right;
  `}
`;
const Price = styled.div`
  ${({ theme }) => `
    font-size: 24px;
    color: ${theme.colors.palette.orange};
    font-weight: 700;
  `}
`;
const ActiveLocation = styled.div`
  ${({ theme }) => `
    background-color: #f0fbf5;
    border-radius: 6px;
    padding: 10px 10px 10px 30px;
    margin-bottom: 15px;
    position: relative;

    &:before {
      background-color: ${theme.colors.palette.mediumGreen};
      border-radius: 100%;
      content: "";
      width: 8px;
      height: 8px;
      left: 12px;
      top: 50%;
      position: absolute;
      transform: translateY(-50%);
    }
  `}
`;
const PreviousLocation = styled.div`
  ${({ theme }) => `
    background-color: #fcfcfc;
    border-radius: 6px;
    padding: 10px 10px 10px 30px;
    position: relative;

    &:before {
      background-color: ${theme.colors.palette.mediumRed};
      border-radius: 100%;
      content: "";
      width: 8px;
      height: 8px;
      left: 12px;
      top: 50%;
      position: absolute;
      transform: translateY(-50%);
    }
  `}
`;
const TipYourDriver = styled.div`
  ${({ theme }) => `
    .MuiList-root {
      padding: 0px;
      margin: 10px 0px 15px 0px;

      .MuiListItem-root {
        padding: 0px;
        margin: 0px;
        display: inline-block;
        width: inherit;

        button {
          padding: 4px 14px;
          margin: 0px 10px 0px 0px;
          min-width: inherit;
          width: inherit;
          border: 1px solid #ebebeb;
          border-radius: 45px;
          color: #000;
          font-weight: 600;
          font-size: 14px;
          text-decoration: none;

          &:hover, &.active {
            background-color: ${theme.colors.palette.orange};
            color: ${theme.colors.palette.black};
          }
        }
      }
    }
  `}
`;
const RideInfo = styled.div`
  ${({ theme }) => `
    .MuiList-root {
      padding-top: 0px;
      .MuiListItem-root {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0px 0px 12px 0px;
        margin: 0px 0px 12px 0px;
        border-bottom: 1px solid ${theme.colors.palette.grey};
        &:last-child {
          border-bottom: 0px solid #000;
          padding: 0px;
          margin-bottom: 0px;
        }
      }
    }
  `}
`;
const CommentFooter = styled.div`
  text-align: right;
`;
const TitleBlock = styled.div`
  ${({ theme }) => `
    display: flex;
    justify-content: space-between;
    margin-bottom: ${theme.spacing(1)};

    .MuiButton-root {
      min-width: auto;
      padding: 0;
      color: ${theme.colors.palette.orange};

      &:hover, &:focus {
        text-decoration: none;
      }
    }
  `}
`;
const DiscountLabel = styled.div`
  ${({ theme }) => `
    font-size: 14px;
    color: ${theme.colors.palette.darkGrey};
    display: flex;
    align-items: center;
    gap: 5px;
    margin-bottom: ${theme.spacing(1)};

    img {
      width: 30px;
    }
  `}
`;
