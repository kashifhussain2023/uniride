import { useState } from "react";
import PageTitle from "@/components/common/PageTitle";
import styled from "@emotion/styled";
import { Button, List, ListItem, Typography, TextField } from "@mui/material";
import SpinnerLoader from "./SpinnerLoader";
import { api } from "@/utils/api/common";
import { toast } from "react-toastify";

export default function ConfirmBooking({
  handleComfirmBooking,
  comfirmBookingData,
  applyCoupon,
  isAddDesignated,
  avgTime,
  userAuth,
  setCouponActive,
  setCouponCode,
  setPromotionId,
}) {
  const [promoCode, setPromoCode] = useState(false);
  const [promoCodeValue, setPromoCodeValue] = useState("");
  const [errors, setErrors] = useState("");
  const [codeStatus, setCodeStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [couponData, setCouponData] = useState(null);

  const handlePromo = () => {
    setPromoCode(true);
  };
  const handleChange = (event) => {
    setPromoCodeValue(event.target.value);
  };

  const BackRidePage = () => {
    window.location.reload();
  };
  const applyCouponCode = async () => {
    if (!promoCodeValue || promoCodeValue.trim() === "") {
      setErrors("Please enter promo code");
    } else {
      setLoading(true);
      const formData = new FormData();
      formData.append("promo_code", promoCodeValue);
      formData.append("customer_id", userAuth.customer_id);
      formData.append("token_code", userAuth.token_code);
      const response = await api({
        url: "/customers/promo_code_validation",
        method: "POST",
        data: formData,
      });

      if (response.status === true) {
        setLoading(false);
        setCodeStatus(true);
        toast.success(response.message);
        setCouponActive(true);
        setCouponCode(response.promo_code);
        setPromotionId(response.promotion_id);
      } else if (
        response.status === "FALSE" &&
        (response.code === 2 || response.code === 4)
      ) {
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
    setPromoCodeValue("");
    toast.error("Coupon code remove successfully.");
  };

  return (
    <>
      <SpinnerLoader loading={loading} />
      <PageTitle
        title="Confirm Your"
        subtitle="Booking"
        images_icon={"../confirm.png"}
      ></PageTitle>

      <RouteDriver>
        <BookingCarInfo>
          <CarImg>
            <img src="../car.png" />
          </CarImg>
          <div>
            <Typography variant="subtitle3">
              {avgTime === "no cars"
                ? "No car available"
                : "Car is " + avgTime + " away from you"}{" "}
            </Typography>
          </div>
        </BookingCarInfo>
        <BookingDtl>
          <List>
            <ListItem>
              <BookingLabel>Ride Estimate</BookingLabel>
              <Details>
                <Price>{comfirmBookingData?.estimated_fare}</Price>
              </Details>
            </ListItem>
            <ListItem>
              <BookingLabel>Pay by</BookingLabel>
              <Details>Card</Details>
              <BookingIcon>
                <img src="../cardIcon.png" />
              </BookingIcon>
            </ListItem>
            <ListItem>
              <BookingLabel>Coupon</BookingLabel>
              {!promoCode ? (
                <>
                  <PromoButton
                    variant="text"
                    onClick={() => setPromoCode(true)}
                  >
                    Apply promo code
                  </PromoButton>
                  <BookingIcon>
                    <img src="../couponIcon.png" />
                  </BookingIcon>
                </>
              ) : codeStatus ? (
                <>
                  <BookingIcon>{promoCodeValue}</BookingIcon>
                  <ApplyButton variant="text" onClick={removeCouponCode}>
                    Remove
                  </ApplyButton>
                  <BookingIcon>
                    <img src="../couponIcon.png" />
                  </BookingIcon>
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
              <BookingLabel>Passenger</BookingLabel>

              <Details>
                {isAddDesignated
                  ? "Request for designated driver"
                  : "1-" + comfirmBookingData?.total_passengers}
              </Details>
              <BookingIcon>
                <img src="../passenger.png" />
              </BookingIcon>
            </ListItem>
          </List>
        </BookingDtl>
      </RouteDriver>
      <ButtonBox>
        <Button
          variant="secondary"
          color="primary"
          fullWidth
          onClick={BackRidePage}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleComfirmBooking}
        >
          Booking
        </Button>
      </ButtonBox>
    </>
  );
}

const RouteDriver = styled.div`
  ${({ theme }) => `
    border: 1px solid #e9e9e9;
    border-radius: 6px;
    padding: 20px 15px;
    margin-bottom: 24px;
  `}
`;
const BookingCarInfo = styled.div`
  ${({ theme }) => `
    display: flex;
    align-items: center;

    h2 {
      font-weight: 600;
      font-size: 18px;
    }
  `}
`;

const CarImg = styled.div`
  ${({ theme }) => `
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
  ${({ theme }) => `
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
const ButtonBox = styled("div")`
  ${({ theme }) => `
    display: flex;
    border-top: 1px solid ${theme.colors.palette.grey};
    justify-content: space-between;
     padding: ${theme.spacing(2, 3)};
     gap: 15px;
  `}
`;
