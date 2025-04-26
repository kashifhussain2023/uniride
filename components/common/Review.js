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
export default function Review({ userAuth }) {
  const [reviewQuestionDetail, setReviewQuestionDetail] = useState();

  const [ratings, setRatings] = useState([]);
  const [remark, setRemark] = useState('');
  const [customTipModel, setCustomTipModel] = useState(false);
  const [driverTip, setDriverTip] = useState('');
  const [rideResponse, setRideResponse] = useState('');
  const [reviewLoading, setReviewLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState();
  const [tipStatus, setTipStatus] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const handleRatingChange = (index, rating) => {
    const newRatings = [...ratings];
    newRatings[index] = {
      id: reviewQuestionDetail[index]?.id,
      rating,
    };
    setRatings(newRatings);
  };
  const handleTipClick = (tipPercentage, index) => {
    const tipAmount = (totalAmount * tipPercentage) / 100;
    const roundedNumber = tipAmount.toFixed(1);
    const result = parseFloat(roundedNumber);
    setTipStatus(true);
    setDriverTip(result);
    setActiveIndex(index);
  };
  const handleGetCustomTip = tipAmount => {
    setTipStatus(true);
    setDriverTip(tipAmount);
    setActiveIndex(4);
  };
  const tipModelClose = () => {
    setCustomTipModel(false);
  };
  const skipTip = () => {
    setTipStatus(false);
    setDriverTip('');
    setActiveIndex(0);
  };
  const submitReview = async () => {
    const filteredRating = ratings.filter(element => {
      return element !== undefined && element !== 'empty';
    });
    const ratingData = filteredRating.map(item => ({
      question_id: item.id,
      rating: item.rating.toString(),
    }));
    //return false;
    if (ratingData.length <= 0 && ratingData === '') {
      toast.error('Please give at least one rating');
      return false;
    }
    const question = JSON.stringify(ratingData, null, 2);
    const formData = new FormData();
    formData.append('customer_id', userAuth.customer_id);
    formData.append('question', question);
    formData.append('tip_the_driver', driverTip);
    formData.append('remark', remark);
    formData.append('ride_id', rideResponse.ride_id);
    formData.append('token_code', userAuth.token_code);
    formData.append('user_id', userAuth.customer_id);
    formData.append('user_type', 'rider');
    setReviewLoading(true);
    const response = await api({
      data: formData,
      method: 'POST',
      url: '/common/add_rating',
    });
    if (response.status === true) {
      setReviewLoading(false);
      toast.info(response.message);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else if (response.status === false) {
      setReviewLoading(false);
      toast.info(response.message);
    } else {
      setReviewLoading(false);
      toast.info(response.message);
    }
  };
  const getReviewPageDetail = async () => {
    const formData = new FormData();
    formData.append('user_type', 'rider');
    formData.append('ride_type', 'regular');
    formData.append('customer_id', userAuth.customer_id);
    formData.append('token_code', userAuth.token_code);
    const response = await api({
      data: formData,
      method: 'POST',
      url: '/common/get_rating_questions',
    });
    if (response.status === true) {
      setReviewQuestionDetail(response.data);
    }
  };
  const getRideDetail = async () => {
    const formData = new FormData();
    formData.append('customer_id', userAuth.customer_id);
    formData.append('token_code', userAuth.token_code);
    const response = await api({
      data: formData,
      method: 'POST',
      url: '/customers/ride_completeness',
    });
    if (response.status === true) {
      setReviewLoading(false);
      setRideResponse(response);
      setTotalAmount(response.total_cost);
    } else {
      setReviewLoading(false);
    }
  };
  useEffect(() => {
    getReviewPageDetail();
    getRideDetail();
  }, []);
  return (
    <InnerContent>
      <SpinnerLoader loading={reviewLoading} />
      <PannelSection>
        <LeftPannel>
          <PageTitle title="Customer" subtitle="Review" images_icon={'../review.png'}></PageTitle>
          {rideResponse?.discount_total && rideResponse?.discount_applied === true && (
            <DiscountLabel>
              <img src="../couponIcon.png" />

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
              {/* <Typography variant="h4">Apparel Park Industrial</Typography> */}
              <Typography variant="subtitle3" component="p">
                {rideResponse?.customer_pick_up_point_name}
              </Typography>
            </ActiveLocation>
            <PreviousLocation>
              {/* <Typography variant="h4">Apparel Park Industrial</Typography> */}
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
                  onClick={() => setCustomTipModel(true, 4)}
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
                  <Details>{rideResponse?.trip_distance} miles</Details>
                </ListItem>
                <ListItem>
                  <BookingLabel>Trip Duration</BookingLabel>
                  <Details>{rideResponse?.trip_duration}</Details>
                </ListItem>
                <ListItem>
                  <BookingLabel>Payment Type</BookingLabel>
                  <Details>{rideResponse.payment_type === 1 ? 'Card' : ''}</Details>
                </ListItem>
                <ListItem>
                  <BookingLabel>Ride Type</BookingLabel>
                  <Details>{rideResponse?.ride_type}</Details>
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
                <ListItem key={index} alignItems="flex-start">
                  <ListItemText
                    id={question.id}
                    primary={question.question}
                    secondary={
                      <Rating
                        name={`rating-${index}`}
                        value={ratings[index]?.rating || 0}
                        onChange={(event, newValue) => {
                          handleRatingChange(index, newValue);
                        }}
                      />
                    }
                  />
                </ListItem>
              ))}
            </List>
          </RatingContainer>
          <ReviewArea>
            <ReviewComment>
              <Typography
                variant="h4"
                sx={{
                  mb: 2,
                }}
              >
                Comments
              </Typography>
              <TextareaAutosize
                aria-label="empty textarea"
                placeholder="What do you think ? (Optional)"
                style={{
                  height: '290px',
                  width: '100%',
                }}
                name="remark"
                onChange={e => {
                  setRemark(e.target.value);
                }}
              />
            </ReviewComment>
          </ReviewArea>

          <CommentFooter>
            <Button
              variant="contained"
              color="primary"
              sx={{
                mt: 2,
              }}
              onClick={submitReview}
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
