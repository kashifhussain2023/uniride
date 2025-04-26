import Layout from '@/components/common/Layout';
import PageTitle from '@/components/common/PageTitle';
import SmallContent from '@/components/presentation/SmallContent';
import CustomFormControl from '@/theme/CustomFormControl';
import ThemeProvider from '@/theme/ThemeProvider';
import { api } from '@/utils/api/common';
import { cardValidation } from '@/utils/payment-card';
import styled from '@emotion/styled';
import { Button, Typography } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Unstable_Grid2';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-toastify';
import SpinnerLoader from '../common/SpinnerLoader';
export default function AddPaymentInfo({ userAuth }) {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const { data: session, update: sessionUpdate } = useSession();
  const [loading, setLoading] = useState(false);
  const [removeErrors, setRemoveErrors] = useState(false);
  const [cardError, setCardError] = useState('');
  const [inputs, setInputs] = useState({
    card_holder: '',
    card_number: '',
    card_type: '',
    cvv: '',
    month: '',
    year: '',
  });
  const [errors, setErrors] = useState({
    card_holder: '',
    // card_number: "",
    // card_type: "",
    // cvv: "",
    // expiration_month: "",
    // expiration_year: "",
  });
  const handleCardDetail = event => {
    const brandName = event.brand.toUpperCase();
    setInputs(inputs => ({
      ...inputs,
      ['card_type']: brandName,
    }));
  };
  const handleInputChange = ({ target }) => {
    setInputs(inputs => ({
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
  const handleSubmit = async e => {
    e.preventDefault();
    const inputForValidation = {
      card_holder: inputs.card_holder,
    };
    const validationErrors = cardValidation(inputForValidation);
    const noErrors = Object.keys(validationErrors).length === 0;
    setRemoveErrors(true);
    if (noErrors) {
      setLoading(true);
      const cardElement = elements.getElement(CardElement); // Make sure to add an ID to your card number input field

      if (!stripe || !elements || !cardElement) {
        // Stripe.js has not yet loaded.
        // Make sure to disable form submission until Stripe.js has loaded.
        return;
      }

      // Use Stripe.js to create a token
      const { token, error } = await stripe.createToken(cardElement);
      if (error) {
        setLoading(false);
        console.error('Error creating token:', error);
        setCardError(error.message);
        return false;
      } else {
        // Send the token to your server or handle it as needed
        // Add your logic to send the token to your server and handle the payment
      }
      const formData = new FormData();
      formData.append('card_holder', inputs.card_holder);
      formData.append('card_number', '000000000000' + token.card.last4);
      formData.append('card_type', inputs.card_type);
      formData.append('cv2', inputs.type);
      formData.append('expire_date', token.card.exp_month + '/' + token.card.exp_year);
      formData.append('nonce', token.id);
      formData.append('customer_id', userAuth.customer_id);
      formData.append('token_code', userAuth.token_code);
      const response = await api({
        data: formData,
        method: 'POST',
        url: '/customers/add_card_details',
      });
      if (response.status === true) {
        // Fetch updated profile data to get the latest default_payment_method status
        const profileResponse = await api({
          method: 'GET',
          url: '/customer/get-profile-details',
        });
        if (profileResponse.status === true) {
          // Update session with new payment method status
          if (session) {
            await sessionUpdate({
              user: {
                ...session?.user,
                data: {
                  ...session?.user?.data,
                  default_payment_method: profileResponse.data.default_payment_method,
                },
              },
            });
          }
        }
        setLoading(false);
        toast.success(response.message);
        router.push('/save-cards');
      } else if (response.status === 'FALSE' && response.message === 'Invalid token code') {
        setLoading(false);
        toast.error(
          'Your account has been logged in on another device.Please login again to continue.'
        );
        await signOut({
          redirect: false,
        });
        router.push('/login');
      } else {
        setLoading(false);
        toast.success(response.message);
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
            <Grid
              container
              spacing={2}
              sx={{
                mt: 2,
              }}
            >
              <Grid lg={6} md={6} sm={12} xs={12}>
                <PageTitle
                  title="Add"
                  subtitle="Payment Info"
                  images_icon={'../payment.png'}
                ></PageTitle>

                <Typography
                  variant="h3"
                  sx={{
                    mb: 1,
                  }}
                >
                  Credit/Debit Card
                </Typography>

                <FormControl>
                  <InputLabel required>Card Holder Name</InputLabel>
                  <CustomFormControl
                    fullWidth
                    type="text"
                    placeholder="Enter Card Holder Name"
                    value={inputs.card_holder || ''}
                    name="card_holder"
                    onChange={handleInputChange}
                  />
                  <span className="text-danger">{errors && errors.card_holder}</span>
                </FormControl>

                <FormControl>
                  <InputLabel required>Card Number </InputLabel>
                  {/* <CustomFormControl
                    fullWidth
                    type="text"
                    placeholder="Enter card number  "
                    value={inputs.card_number}
                    name="card_number"
                    onChange={handleInputChange}
                   /> */}
                  <CardElement onChange={handleCardDetail} />

                  <span className="text-danger">{cardError}</span>
                </FormControl>
                <FormControl>
                  <InputLabel required>Card Type</InputLabel>
                  <CustomFormControl
                    fullWidth
                    type="text"
                    placeholder="Card Type"
                    value={inputs.card_type || ''}
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
