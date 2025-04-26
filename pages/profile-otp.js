import { useState, useRef } from 'react';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
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
export default function Verification({ userAuth }) {
  const router = useRouter();
  const { data: session, update: sessionUpdate } = useSession();
  const [loading, setLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
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

    // Allow only numeric input and limit the length to 1
    pastedData.forEach((digit, index) => {
      if (/^\d*$/.test(digit) && index < otp.length) {
        newOtp[index] = digit;
      }
    });
    setOtp(newOtp);

    // Focus on the first empty input field
    const firstEmptyIndex = newOtp.findIndex(digit => digit === '');
    if (firstEmptyIndex !== -1) {
      otpBoxReference.current[firstEmptyIndex].focus();
    }
  };
  const handleSubmit = async e => {
    e.preventDefault();
    let noErrors = true;
    const isOtpValid = otp.every(digit => digit !== '');
    if (isOtpValid === false) {
      noErrors = false;
      setOtpError('Otp field is required');
    }
    if (noErrors) {
      setLoading(true);
      const enteredOtp = otp.join('');
      const formData = new FormData();
      formData.append('customer_id', userAuth.customer_id);
      formData.append('otp', enteredOtp);
      formData.append('mobile_number', userAuth.mobile_number);
      const response = await api({
        data: formData,
        method: 'POST',
        url: '/customers/otp_verification',
      });
      if (response.status === true) {
        if (session) {
          session.user.token_code = response.token_code;
        }
        sessionUpdate({
          user: {
            ...session?.user,
            token_code: response.token_code,
          },
        });
        setLoading(false);
        toast.success(response.message);
        setTimeout(() => {
          router.push('/profile');
        }, 2000);
      } else if (response.status === 'FALSE') {
        setLoading(false);
        toast.error(response.message);
      } else {
        setLoading(false);
        toast.error('Internal Server Error');
      }
    }
  };
  const handleResendOtp = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('customer_id', userAuth.customer_id);
    formData.append('mobile_number', userAuth.mobile_number);
    const response = await api({
      data: formData,
      method: 'POST',
      url: '/customers/resend_otp',
    });
    if (response.status === true) {
      setLoading(false);
      toast.success(response.message);
    } else if (response.status === 'FALSE') {
      setLoading(false);
      toast.error(response.message);
    } else {
      setLoading(false);
      toast.error('Internal Server Error');
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
              <img src="../loginimg.png" />
              <LoginDesc>
                <Welcome>Welcome to</Welcome>
                <img src="../logo1.png" />
                <Typography variant="h4">
                  Our professionally trained drivers will make sure that the customers enjoy a safe
                  and reliable ride.
                </Typography>
              </LoginDesc>

              <MobilePhone>
                {' '}
                <img src="../mobile.png" />
              </MobilePhone>
            </LeftSide>
            <RightSide>
              <SignInHead>
                <img src="../loginIcon.png" />
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
                please enter it to complete your profile
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
              <Typography
                variant="subtitle1"
                sx={{
                  mb: 3,
                }}
                align="center"
              >
                I haven&apos;t received the code, please{' '}
                <ResenButton onClick={handleResendOtp} color="primary" variant="text">
                  re-send
                </ResenButton>{' '}
                it
              </Typography>
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
  const otpCookie = cookies?.profileOtp || false;
  const otpCookieParsed = JSON.parse(otpCookie);
  if (!otpCookieParsed && Object.keys(otpCookieParsed).length === 0) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  return {
    props: {
      userAuth: otpCookieParsed || null,
    },
  };
}
const LoginContainer = styled.div`
  ${({ theme }) => `

 max-width:1200px; margin:40px auto 0px auto; padding:0px 20px;
 @media (min-width: ${theme.breakpoints.values.md}px) {
    margin:40px auto 0px auto;

}
    
  `}
`;
const Box = styled.div`
  ${({ theme }) => `

background-color:${theme.colors.palette.white}; border-radius: 16px 0px 16px 16px;
box-shadow: 0px 0px 15px -1px rgba(0,0,0,0.10);  overflow:hidden;

@media (min-width: ${theme.breakpoints.values.md}px) {
    display:flex; flex-wrap:nowrap }

    @media (min-width: ${theme.breakpoints.values.lg}px) {
      overflow:inherit;}
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
    position: absolute;
    z-index: 111;
    top: 70px;
    max-width: 255px;
    margin: 0px auto;
    left: 154px;
    img {
      width: 196px;
      height: 75px;

      @media (min-width: ${theme.breakpoints.values.lg}px) {
        width: 196px;
        height: 75px;
      }
    }
    h4 {
      font-weight: 300;
    }
  `}
`;
const Welcome = styled.div`
  ${({ theme }) => `
    font-size: 24px;
    font-weight: 300;
    color: ${theme.colors.palette.black};
    margin-bottom: 10px;
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
  ${() => `
    text-align: center;
  `}
`;
const OtpArea = styled.div`
  ${() => `
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
  `}
`;
const ResenButton = styled(Button)`
  &.MuiButton-text {
    min-width: inherit;
    padding: 0;
    line-height: 11px;
  }
`;
