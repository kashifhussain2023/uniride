import { useState, useRef } from 'react';
import { useSession, signIn } from 'next-auth/react';
import Head from 'next/head';
import ThemeProvider from '@/theme/ThemeProvider';
import Layout from '@/components/common/Layout';
import styled from '@emotion/styled';
import CustomFormControl from '@/theme/CustomFormControl';
import { useRouter } from 'next/router';
import SpinnerLoader from '@/components/common/SpinnerLoader';
import { Button, Typography } from '@mui/material';
import { api } from '@/utils/api/common';
import { toast } from 'react-toastify';
import { parseCookies } from 'nookies';
import { setCookie } from 'nookies';
import Image from 'next/image';

export default function Verification({ userAuth }) {
  const router = useRouter();
  const { data: session, update: sessionUpdate } = useSession();
  const [loading, setLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpBoxReference = useRef([]);
  const handleChange = (e, index) => {
    const value = e.target.value;

    // Allow only numeric input and limit the length to 1
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to the next input field if a digit is entered
      if (value.length === 1 && index < otp.length - 1) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      } else if (value.length === 0 && index > 0) {
        // Move to the previous input field if Backspace is pressed and the current field is empty
        document.getElementById(`otp-input-${index - 1}`).focus();
      }
    }
  };
  const handlePaste = e => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').split('');
    const newOtp = [];

    pastedData.forEach((digit, index) => {
      if (/^\d*$/.test(digit) && index < otp.length) {
        newOtp[index] = digit;
      }
    });
    setOtp(newOtp);

    const firstEmptyIndex = newOtp.findIndex(digit => digit === '');
    if (firstEmptyIndex !== -1) {
      otpBoxReference.current[firstEmptyIndex].focus();
    }
  };
  const handleSubmit = async e => {
    e.preventDefault();
    setOtpError('');
    const isOtpValid = otp.every(digit => digit !== '');
    if (!isOtpValid) {
      setOtpError('Please enter the complete OTP');
      return;
    }
    try {
      setLoading(true);
      const enteredOtp = otp.join('');
      const requestBody = {
        customer_id: userAuth.customer_id,
        otp: enteredOtp,
      };
      const response = await api({
        data: requestBody,
        method: 'POST',
        url: '/customer/verify-otp',
      });
      if (response.status === true) {
        // Get profile details to check payment method status
        const profileResponse = await api({
          headers: {
            Authorization: `Bearer ${response.data.token_code}`,
          },
          method: 'GET',
          url: '/customer/get-profile-details',
        });
        if (profileResponse.status === true) {
          // Sign in the user using NextAuth

          setTimeout(async () => {
            const signInResult = await signIn('credentials', {
              password: userAuth.password,
              phone: userAuth.mobile_number,
              phone_code: userAuth.phone_code,
              redirect: false,
            });
            if (signInResult?.error) {
              throw new Error(signInResult.error);
            }

            // Update session with new token and profile status
            if (session) {
              await sessionUpdate({
                user: {
                  ...session?.user,
                  data: {
                    ...session?.user?.data,
                    profile_status: '3',
                    token_code: response.data.token_code,
                  },
                  profile_status: '3',
                  token_code: response.data.token_code,
                },
              });
            }

            // Check if user needs to add payment method
            if (!profileResponse.data.default_payment_method) {
              // Store registration data in cookie for add-card page
              setCookie(
                null,
                'newUserRegistration',
                JSON.stringify({
                  customer_id: userAuth.customer_id,
                  mobile_number: userAuth.mobile_number,
                  name: userAuth.name,
                  token_code: response.data.token_code,
                }),
                {
                  maxAge: 30 * 60,
                  path: '/',
                  // 30 minutes
                  secure: true,
                }
              );
              toast.success('Please add your payment details to continue.');
              router.push('/cards/add');
            } else {
              // User has payment method, redirect to main app
              toast.success('Verification successful');
              router.push('/uniride');
            }
          }, 2000);
        } else {
          throw new Error(profileResponse.message || 'Failed to get profile details');
        }
      } else {
        toast.error(response.message || 'Invalid OTP');
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast.error(error.message || 'An error occurred during verification. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const handleResendOtp = async () => {
    try {
      setLoading(true);
      const requestBody = {
        customer_id: userAuth.customer_id,
      };
      const response = await api({
        data: requestBody,
        method: 'POST',
        url: '/customer/resend-otp',
      });
      if (response.status === true) {
        toast.success(response.message || 'OTP resent successfully');
      } else {
        toast.error(response.message || 'Failed to resend OTP');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      toast.error('An error occurred while resending OTP. Please try again.');
    } finally {
      setLoading(false);
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
        <LoginContainer>
          <Box>
            <LeftSide>
              <Image
                src="/loginimg.png"
                alt="Login illustration"
                width={500}
                height={300}
                priority
                className="w-full h-auto"
              />
              <LoginDesc>
                <Welcome>Welcome to</Welcome>
                <Image
                  src="/logo1.png"
                  alt="Uniride logo"
                  width={196}
                  height={75}
                  priority
                  className="my-4"
                />
                <Typography variant="h4">
                  Our professionally trained drivers will make sure that the customers enjoy a safe
                  and reliable ride.
                </Typography>
              </LoginDesc>
              <MobilePhone>
                <Image
                  src="/mobile.png"
                  alt="Mobile illustration"
                  width={300}
                  height={400}
                  priority
                  className="w-full h-auto"
                />
              </MobilePhone>
            </LeftSide>
            <RightSide>
              <SignInHead>
                <Image
                  src="/loginIcon.png"
                  alt="Login icon"
                  width={40}
                  height={40}
                  priority
                  className="mb-4"
                />
                <Typography
                  variant="h1"
                  sx={{
                    mb: 3,
                  }}
                >
                  Verification
                </Typography>
              </SignInHead>

              <Typography
                variant="h3"
                sx={{
                  mb: 1,
                }}
              >
                Hello, {userAuth.name || ''}
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  mb: 3,
                }}
              >
                We have sent a text with your verification code to {userAuth.mobile_number || ''},
                please enter it to complete your registration
              </Typography>
              <OtpArea>
                <div>
                  {otp.map((digit, index) => {
                    return (
                      <CustomFormControl
                        key={index}
                        maxLength={1}
                        id={`otp-input-${index}`}
                        type="text"
                        placeholder=""
                        value={digit}
                        onChange={e => handleChange(e, index)}
                        onPaste={handlePaste}
                        ref={reference => (otpBoxReference.current[index] = reference)}
                      />
                    );
                  })}
                </div>
              </OtpArea>
              <Typography component="span" className="text-danger">
                {otpError}
              </Typography>
              <ResendText
                variant="subtitle1"
                sx={{
                  mb: 3,
                }}
              >
                I haven&apos;t received the code, please{' '}
                <ResendButton onClick={handleResendOtp} color="primary" variant="text">
                  <strong>re-send</strong>
                </ResendButton>{' '}
                it
              </ResendText>
              <div align="center">
                <Button
                  variant="contained"
                  sx={{
                    mb: 5,
                  }}
                  onClick={handleSubmit}
                >
                  Next
                </Button>
              </div>
            </RightSide>
          </Box>
        </LoginContainer>
      </Layout>
    </ThemeProvider>
  );
}
export async function getServerSideProps(context) {
  const cookies = parseCookies(context);
  const registrationCookie = cookies?.registrationDetail || false;
  const registrationCookieParsed = JSON.parse(registrationCookie);
  if (!registrationCookieParsed && Object.keys(registrationCookieParsed).length === 0) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  return {
    props: {
      userAuth: registrationCookieParsed || null,
    },
  };
}
const LoginContainer = styled.div`
  ${({ theme }) => `
    max-width: 1200px;
    margin: 40px auto 0px auto;
    padding: 0px 20px;
    @media (min-width: ${theme.breakpoints.values.md}px) {
      margin: 40px auto 0px auto;
    }
  `}
`;
const Box = styled.div`
  ${({ theme }) => `
    background-color: ${theme.colors.palette.white};
    border-radius: 16px 0px 16px 16px;
    box-shadow: 0px 0px 15px -1px rgba(0, 0, 0, 0.1);
    overflow: hidden;

    @media (min-width: ${theme.breakpoints.values.md}px) {
      display: flex;
      flex-wrap: nowrap;
    }

    @media (min-width: ${theme.breakpoints.values.lg}px) {
      overflow: inherit;
    }
  `}
`;
const LeftSide = styled.div`
  ${({ theme }) => `
width:50%;
flex:0 0 50%; position:relative;
display:none;

@media (min-width: ${theme.breakpoints.values.md}px) {
  display:block;
  width:550px;
flex:0 0 550px; 

}

@media (min-width: ${theme.breakpoints.values.xl}px) {
    display:block;
    width:704px;
flex:0 0 704px; 

}


img{ width:100%; height:100%; }




}

    
  `}
`;
const MobilePhone = styled.div`
  ${({ theme }) => `
position:absolute; right:-120px; top:50px; display:none;
@media (min-width: ${theme.breakpoints.values.lg}px) {
  display:block;

}


img{ width:100%; height:100%;
  @media (min-width: ${theme.breakpoints.values.md}px) {
    width:300px; height:auto;
  
  }
  @media (min-width: ${theme.breakpoints.values.xl}px) {
    width:100%; height:100%;
  
  }

}


  `}
`;
const LoginDesc = styled.div`
  ${({ theme }) => `
position:absolute;
z-index:111; top:70px; max-width:255px; margin:0px auto; left:154px;
  img{width:196px; height:75px; 


    @media (min-width: ${theme.breakpoints.values.lg}px) {
      width:196px; height:75px;
    
    }
    

}  
h4{ font-weight:300}


  `}
`;
const Welcome = styled.div`
  ${({ theme }) => `
font-size:24px; font-weight:300; color:${theme.colors.palette.black}; margin-bottom:10px;
  `}
`;
const RightSide = styled.div`
  ${({ theme }) => `
    width: 100%;
    padding-left: 30px;
    padding-right: 30px;
    padding-top: 74px;

    .text-danger {
      color: ${theme.colors.palette.red};
      text-align: center;
      font-size: 14px;
      display: block;
    }

    @media (min-width: ${theme.breakpoints.values.lg}px) {
      padding-left: 102px;
      padding-right: 30px;
    }

    @media (min-width: ${theme.breakpoints.values.xl}px) {
      padding-left: 102px;
      padding-right: 30px;
    }

    &:focus-visibale {
      box-shadow: none !important;
      border: 0px !important;
      outline: none;
    }

    h1 {
      font-size: 24px;

      @media (min-width: ${theme.breakpoints.values.md}px) {
        font-size: 36px;
      }

      @media (min-width: ${theme.breakpoints.values.lg}px) {
        font-size: 48px;
      }
    }
  `}
`;
const SignInHead = styled.div`
  text-align: center;
`;
const OtpArea = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;

  input {
    width: 60px;
    height: 60px;
    border-radius: 100%;
    margin: 0px 5px;
    text-align: center;
    font-size: 24px;
  }
`;
const ResendText = styled(Typography)`
  display: flex;
  flex-wrap: wrap;
`;
const ResendButton = styled(Button)`
  &.MuiButton-text {
    min-width: inherit;
    padding: 0 4px;
    line-height: 11px;
  }
`;
