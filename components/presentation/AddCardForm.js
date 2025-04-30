import Layout from "@/components/common/Layout";
import PageTitle from "@/components/common/PageTitle";
import SmallContent from "@/components/presentation/SmallContent";
import CustomFormControl from "@/theme/CustomFormControl";
import CustomSelect from "@/theme/CustomSelect";
import ThemeProvider from "@/theme/ThemeProvider";
import { cardValidation } from "@/utils/payment-card";
import styled from "@emotion/styled";
import { Button, Typography } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";
import { api } from "@/utils/api/common";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import SpinnerLoader from "../common/SpinnerLoader";

export default function AddCardForm({ userAuth }) {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const { data: session, update: sessionUpdate } = useSession();
  const [loading, setLoading] = useState(false);
  const [responseError, setResponseError] = useState("");
  const [removeErrors, setRemoveErrors] = useState(false);
  const [cardError, setCardError] = useState("");
  const [inputs, setInputs] = useState({
    card_number: "",
    card_holder: "",
    cvv: "",
    month: "",
    year: "",
    card_type: "",
  });

  const [errors, setErrors] = useState({
    card_holder: "",
  });

  const handleCardDetail = (event) => {
    var brandName = event.brand.toUpperCase();
    setInputs((inputs) => ({
      ...inputs,
      ["card_type"]: brandName,
    }));
  };
  const handleInputChange = ({ target }) => {
    setInputs((inputs) => ({
      ...inputs,
      [target.name]: target.value,
    }));

    if (removeErrors) {
      setErrors({
        ...cardValidation({
          ...inputs,
        }),
      });
    }
  };

  const handleSubmit = async (e) => {

    setResponseError("");
    e.preventDefault();

    let inputForValidation = {
      card_holder: inputs.card_holder,
    };

    const validationErrors = cardValidation(inputForValidation);
    const noErrors = Object.keys(validationErrors).length === 0;
    setRemoveErrors(true);

    if (noErrors) {
      try {
        setLoading(true);
        const cardElement = elements.getElement(CardElement);

        if (!stripe || !elements || !cardElement) {
          toast.error("Payment system is not ready. Please try again.");
          return;
        }

        // Create payment method with Stripe
        const { paymentMethod, error: paymentError } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
          billing_details: {
            name: inputs.card_holder,
          },
        });

        if (paymentError) {
          console.error("Stripe payment method error:", paymentError);
          setCardError(paymentError.message);
          toast.error(paymentError.message);
          return;
        }

        // Send payment method to server
        const requestBody = {
          payment_method_id: paymentMethod.id,
          card_holder: inputs.card_holder,
          card_number: "000000000000" + paymentMethod.card.last4,
          card_cvv: "",
          card_expire: paymentMethod.card.exp_month + "/" + paymentMethod.card.exp_year,
          card_type: paymentMethod.card.brand.toUpperCase()
          // customer_id: userAuth
        }

        const response = await api({
          url: "/customer/payments/add-card",
          method: "POST",
          data: requestBody,
        });

        if (response.status === true) {
          toast.success(response.message || "Card added successfully");
                  
          setTimeout(async () => {
            const profileResponse = await api({
              url: "/customer/get-profile-details",
              method: "GET",
            });
            
            if (profileResponse.status === true) {
              localStorage.setItem('lastAddedCard', JSON.stringify(profileResponse.data.default_payment_method));
            }
            
            router.push("/uniride");
          }, 3000);
          
        } else if (response.status === false && response.message === "Invalid token code") {
          toast.error("Your session has expired. Please login again.");
          await signOut({ redirect: false });
          router.push("/login");
        } else {
          toast.error(response.message || "Failed to add card");
        }
      } catch (error) {
        console.error("Add card error:", error);
        toast.error("An error occurred while adding your card. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <ThemeProvider>
      <Head>
        <title>Uniride</title>
        <meta name="description" content="Uniride " />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SpinnerLoader loading={loading} />
      <Layout>
        <SmallContent>
          <AddpaymentInfo>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid lg={6} md={6} sm={12} xs={12}>
                <PageTitle
                  title="Add"
                  subtitle="Payment Info"
                  images_icon={"../payment.png"}
                ></PageTitle>

                <Typography variant="h3" sx={{ mb: 1 }}>
                  Credit/Debit Card
                </Typography>

                <FormControl>
                  <InputLabel required>Card Holder Name</InputLabel>
                  <CustomFormControl
                    fullWidth
                    type="text"
                    placeholder="Enter Card Holder Name"
                    value={inputs.card_holder || ""}
                    name="card_holder"
                    onChange={handleInputChange}
                  />
                  <span className="text-danger">
                    {errors && errors.card_holder}
                  </span>
                </FormControl>

                <FormControl>
                  <InputLabel required>Card Number </InputLabel>
                  <CardElement onChange={handleCardDetail} />

                  <span className="text-danger">{cardError}</span>
                </FormControl>

                <FormControl>
                  <InputLabel required>Card Type</InputLabel>
                  <CustomFormControl
                    fullWidth
                    type="text"
                    placeholder="Card Type"
                    value={inputs.card_type || ""}
                    name="card_type"
                    onChange={handleInputChange}
                    disabled={true}
                  />
                </FormControl>

                <ButtonArea>
                  <Button variant="contained" onClick={handleSubmit}>
                    Save
                  </Button>
                </ButtonArea>
              </Grid>
              <Grid lg={6} md={6} sm={12} xs={12}>
                <AddPaymentImg>
                  <img src="../addPayment.png" />
                </AddPaymentImg>
              </Grid>
            </Grid>
          </AddpaymentInfo>
        </SmallContent>
      </Layout>
    </ThemeProvider>
  );
}

const AddpaymentInfo = styled.div`
  ${({ theme }) => `
    border-radius: 16px 0px 16px 16px;
    box-shadow: 0px 0px 15px -1px rgba(0, 0, 0, 0.1);
    background-color: ${theme.colors.palette.white};
    padding: 24px;
    margin-top: 60px;

    img {
      max-width: 100%;
    }
    .text-danger {
      font-size: 13px;
      color: ${theme.colors.palette.red};
    }
  `}
`;

const FormControl = styled.div`
  ${({ theme }) => `
    margin-bottom: 20px;
    .MuiInputBase-input {
      font-size: 16px;
      height: 35px;
      padding: 5px 10px;
      border-radius: 6px;
    }
    .MuiInputLabel-root {
      margin-top: 0px;
      display: block;
      margin-bottom: 5px;
      color: ${theme.colors.palette.darkGrey};
      span {
        color: ${theme.colors.palette.red};
      }
    }
  `}
`;
const CardImg = styled.div`
  ${({ theme }) => `
    margin-left: 10px;
  `}
`;

const Expiration = styled.div`
  ${({ theme }) => `
    .MuiTypography-root {
      font-size: 16px;
      color: ${theme.colors.palette.darkGrey};
      margin-bottom: 4px;
    }
  `}
`;

const ButtonArea = styled.div`
  ${({ theme }) => `
    width: 170px;
    flex: 0 0 170px;
    margin-bottom: 15px;
    @media (min-width: ${theme.breakpoints.values.sm}px) {
      margin-bottom: 0px;
    }
  `}
`;

const AddPaymentImg = styled.div`
  ${({ theme }) => ` 
  display:none;

  @media (min-width: ${theme.breakpoints.values.md}px) {
    display:block;
  }
  }


  `}
`;
