import PageTitle from '@/components/common/PageTitle';
import { api } from '@/utils/api/common';
import styled from '@emotion/styled';
import DiscountIcon from '@mui/icons-material/Discount';
import { Button, List, ListItem, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';
import SpinnerLoader from './SpinnerLoader';
export default function ConfirmBooking({
  currentLocation,
  handleComfirmBooking,
  comfirmBookingData,
  isAddDesignated,
  setCouponActive,
  setCouponCode,
  setPromotionId,
}) {
  const [promoCode, setPromoCode] = useState(false);
  const [promoCodeValue, setPromoCodeValue] = useState('');
  const [errors, setErrors] = useState('');
  const [codeStatus, setCodeStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [couponData, setCouponData] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  const handleChange = event => {
    setPromoCodeValue(event.target.value);
  };

  const BackRidePage = () => {
    window.location.reload();
  };

  const applyCouponCode = async () => {
    if (!promoCodeValue || promoCodeValue.trim() === '') {
      setErrors('Please enter promo code');
    } else {
      setLoading(true);
      const couponData = {
        estimate_amount: comfirmBookingData?.maximum_estimated_fare,
        pickup_lat: currentLocation.lat,
        pickup_lng: currentLocation.lng,
        promo_code: promoCodeValue,
      };
      const response = await api({
        data: couponData,
        method: 'POST',
        url: '/customer/apply-promocode',
      });
      if (response.status === true) {
        setLoading(false);
        setCodeStatus(true);
        toast.success(response.message);
        setCouponActive(true);
        setCouponCode(response.data.offer_code);
        setPromotionId(response.data.id);
        setCouponData(response.data);

        // Calculate discount amount based on discount type
        if (response.data.discount_type === 1) {
          // Fixed amount discount
          setDiscountAmount(parseFloat(response.data.discount_amount));
        } else if (response.data.discount_type === 2) {
          // Percentage discount
          const percentage = parseFloat(response.data.discount_amount);
          const originalAmount = parseFloat(comfirmBookingData?.maximum_estimated_fare);
          const calculatedDiscount = (originalAmount * percentage) / 100;
          setDiscountAmount(calculatedDiscount);
        }
      } else if (!response.status && (response.code === 2 || response.code === 4)) {
        toast.error(response.message);
        setLoading(false);
      } else {
        setLoading(false);
        toast.error(response.message);
      }
    }
  };

  const removeCouponCode = async () => {
    setCouponActive(false);
    setCouponCode(null);
    setPromotionId(null);
    setCodeStatus(false);
    setPromoCode(false);
    setPromoCodeValue('');
    setDiscountAmount(0);
    setCouponData(null);
    toast.error('Coupon code remove successfully.');
  };

  // Calculate final price after discount
  const getFinalPrice = () => {
    if (!comfirmBookingData?.maximum_estimated_fare) return 0;
    const originalAmount = parseFloat(comfirmBookingData.maximum_estimated_fare);
    return (originalAmount - discountAmount).toFixed(2);
  };

  return (
    <>
      <SpinnerLoader loading={loading} />
      <PageTitle title="Confirm Your" subtitle="Booking" images_icon={'../confirm.png'}></PageTitle>

      <RouteDriver>
        <BookingCarInfo>
          <CarImg>
            <img src="../car.png" />
          </CarImg>
          <div>
            {/* <Typography variant="subtitle3">
              {avgTime === "no cars"
                ? "No car available"
                : "Car is " + avgTime + " away from you"}{" "}
             </Typography> */}

            <Typography variant="subtitle3">
              {' '}
              <strong> {comfirmBookingData.car_name} </strong>
            </Typography>
          </div>
        </BookingCarInfo>
        <BookingDtl>
          <List>
            <ListItem>
              <BookingLabel>Ride Estimate</BookingLabel>
              <Details>
                <Price>${getFinalPrice()}</Price>
                {discountAmount > 0 && (
                  <DiscountInfo>
                    <DiscountIcon fontSize="small" color="success" />
                    <span>${discountAmount.toFixed(2)} off</span>
                  </DiscountInfo>
                )}
              </Details>
            </ListItem>
            <ListItem>
              <BookingLabel>Payment Method</BookingLabel>
              <Details>Card</Details>
              <BookingIcon>
                <img src="../cardIcon.png" />
              </BookingIcon>
            </ListItem>
            <ListItem>
              <BookingLabel>Coupon</BookingLabel>
              {!promoCode ? (
                <>
                  <PromoButton variant="text" onClick={() => setPromoCode(true)}>
                    Apply promo code
                  </PromoButton>
                  <BookingIcon>
                    <img src="../couponIcon.png" />
                  </BookingIcon>
                </>
              ) : codeStatus ? (
                <>
                  <CouponDisplay>
                    <DiscountIconWrapper>
                      <DiscountIcon
                        fontSize="small"
                        style={{
                          color: '#FFA500',
                        }}
                      />
                    </DiscountIconWrapper>
                    <CouponCode>
                      {promoCodeValue}
                      <DiscountDetails>
                        {couponData?.discount_type === 2 && (
                          <span>{couponData.discount_amount}% off</span>
                        )}
                      </DiscountDetails>
                    </CouponCode>
                    <RemoveButton variant="text" onClick={removeCouponCode}>
                      Remove
                    </RemoveButton>
                  </CouponDisplay>
                </>
              ) : (
                <>
                  <TextField
                    id="outlined-start-adornment"
                    fullWidth
                    type="text"
                    name="promCode"
                    placeholder="Enter Promo Code"
                    size="large"
                    onChange={handleChange}
                    value={promoCodeValue}
                    helperText={errors}
                  />
                  <ApplyButton variant="text" onClick={applyCouponCode}>
                    Apply
                  </ApplyButton>
                </>
              )}
            </ListItem>

            <ListItem>
              <BookingLabel>Seating Capacity</BookingLabel>

              <Details>
                {isAddDesignated
                  ? 'Request for designated driver'
                  : '1-' + (comfirmBookingData?.total_passengers || 3)}
              </Details>
              <BookingIcon>
                <img src="../passenger.png" />
              </BookingIcon>
            </ListItem>
          </List>
        </BookingDtl>
      </RouteDriver>
      <ButtonBox>
        <Button variant="secondary" color="primary" fullWidth onClick={BackRidePage}>
          Back
        </Button>
        <Button variant="contained" color="primary" fullWidth onClick={handleComfirmBooking}>
          Booking
        </Button>
      </ButtonBox>
    </>
  );
}
const RouteDriver = styled.div`
  ${() => `
    border: 1px solid #e9e9e9;
    border-radius: 6px;
    padding: 20px 15px;
    margin-bottom: 24px;
  `}
`;
const BookingCarInfo = styled.div`
  ${() => `
    display: flex;
    align-items: center;

    h2 {
      font-weight: 600;
      font-size: 18px;
    }
  `}
`;
const CarImg = styled.div`
  ${() => `
    margin-right:10px;
  `}
`;
const BookingDtl = styled.div`
  ${({ theme }) => `
    .MuiList-root {
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
const BookingLabel = styled.div`
  ${({ theme }) => `
    font-size: 14px;
    color: ${theme.colors.palette.darkGrey};
    width: 100px;
    flex: 0 0 100px;
  `}
`;
const Details = styled.div`
  ${({ theme }) => `
    width: 100%;
    font-weight: 700;
    color: ${theme.colors.palette.dGray};
  `}
`;
const BookingIcon = styled.div`
  ${() => `
    width: 100%;
    flex: 0 0 40px;
    margin-left: 10px;
  `}
`;
const Price = styled.div`
  ${({ theme }) => `
    font-size: 24px;
    color: ${theme.colors.palette.orange};
    font-weight: 700;
  `}
`;
const PromoButton = styled(Button)`
  &.MuiButton-root {
    flex: 1;
    padding: 0;
    justify-content: flex-start;
  }
  &:hover {
    text-decoration: none;
  }
`;
const ApplyButton = styled(Button)`
  &.MuiButton-root {
    min-width: 60px;
  }
  &:hover {
    text-decoration: none;
  }
`;
const ButtonBox = styled('div')`
  ${({ theme }) => `
    display: flex;
    border-top: 1px solid ${theme.colors.palette.grey};
    justify-content: space-between;
     padding: ${theme.spacing(2, 3)};
     gap: 15px;
  `}
`;
const DiscountInfo = styled.div`
  ${({ theme }) => `
    display: flex;
    align-items: center;
    font-size: 14px;
    color: ${theme.colors.palette.success};
    margin-top: 5px;
    
    span {
      margin-left: 5px;
    }
  `}
`;
const CouponDisplay = styled.div`
  ${() => `
    display: flex;
    align-items: center;
    width: 100%;
    padding: 8px 0;
    gap: 8px;
  `}
`;
const DiscountIconWrapper = styled.div`
  ${() => `
    display: flex;
    align-items: center;
  `}
`;
const CouponCode = styled.div`
  ${({ theme }) => `
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
    color: ${theme.colors.palette.black};
    
    span {
      color: ${theme.colors.palette.darkGrey};
      font-size: 14px;
    }
  `}
`;
const RemoveButton = styled(Button)`
  ${({ theme }) => `
    margin-left: auto;
    color: ${theme.colors.palette.blue};
    text-transform: none;
    padding: 0;
    min-width: auto;

    &:hover {
      background: none;
    }
  `}
`;
const DiscountDetails = styled.div`
  ${({ theme }) => `
    display: flex;
    align-items: center;
    font-size: 14px;
    color: ${theme.colors.palette.darkGrey};
    margin-left: 4px;
  `}
`;
