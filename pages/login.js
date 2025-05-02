import { useState } from 'react';
import Head from 'next/head';
import { signIn, getSession } from 'next-auth/react';
import { setCookie } from 'nookies';
import ThemeProvider from '@/theme/ThemeProvider';
import Layout from '@/components/common/Layout';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import SpinnerLoader from '@/components/common/SpinnerLoader';
import {
  Button,
  FormControl as MuiFormControl,
  InputAdornment,
  IconButton,
  TextField,
  Typography,
  Grid,
} from '@mui/material';
import { Lock } from '@mui/icons-material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { validateCustomer } from '@/utils/login';
import CountrySelect from '@/components/common/CountrySelect';
import CustomFormControl from '@/theme/CustomFormControl';
export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [countrycode, setCountryCode] = useState('+1');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    mobile: '',
    password: '',
  });
  const [inputs, setInputs] = useState({
    mobile: '',
    password: '',
  });
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);
  const handleInputChange = ({ target }) => {
    setInputs(prev => ({
      ...prev,
      [target.name]: target.value,
    }));
    const data = {
      ...inputs,
      [target.name]: target.value,
    };
    setErrors(validateCustomer(data));
  };
  const handleCountryCode = value => {
    setCountryCode('+' + value);
  };
  const validateInputs = () => {
    if (!inputs.mobile) {
      toast.error('Mobile number is required');
      return false;
    }
    if (!inputs.password) {
      toast.error('Password is required');
      return false;
    }
    return true;
  };
  const handleLoginSuccess = async session => {
    try {
      if (!session?.user?.data) {
        throw new Error('Invalid session data');
      }
      const userData = session.user.data;

      const userProfile = {
        customer_id: userData.customer_id,
        email: userData.email,
        mobile_number: userData.mobile_number,
        name: userData.name,
      };

      // First check OTP verification status
      if (userData.otp_verified === 0) {
        setCookie(null, 'registrationDetail', JSON.stringify(userProfile), {
          maxAge: 5 * 60,
          // 5 minutes
          path: '/',
          secure: true,
        });
        toast.info('Please verify your OTP to continue.');
        router.push('/verification');
        return;
      }

      // For OTP verified users, check profile status
      if (userData.profile_status === 1) {
        // User needs to complete profile by adding card
        setCookie(null, "newUserRegistration", JSON.stringify({
          ...userProfile,
          token_code: userData.token_code
        }), {
          path: "/",
          secure: true,
        });
       

        if(userData.default_payment_method===null){
          toast.success("Please add your card details to complete registration.");
          router.push("/cards");
        }else{
          router.push("/uniride");
        }
      } else if (userData.profile_status === 3) {
        // User profile is complete, proceed to main app
        toast.success(session.user.message || 'Login successful');
        router.push('/uniride');
      } else {
        throw new Error('Invalid profile status');
      }
    } catch (error) {
      console.error('Login success handler error:', error);
      toast.error('Error processing login response');
    }
  };
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (!validateInputs()) {
        return;
      }
      setLoading(true);
      const response = await signIn('credentials', {
        password: inputs.password,
        phone: inputs.mobile,
        phone_code: countrycode,
        redirect: false,
      });
      if (response?.error) {
        throw new Error(response.error);
      }
      const session = await getSession();
      if (!session?.user?.data) {
        throw new Error('Invalid session data received');
      }
      await handleLoginSuccess(session);
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed. Please try again.');
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
              <img src="../loginimg.png" alt="login" />
              <LoginDesc>
                <Welcome>Welcome to</Welcome>
                <img src="../logo1.png" alt="logo" />
                <Typography variant="h4">
                  Our professionally trained drivers will make sure that the customers enjoy a safe
                  and reliable ride.
                </Typography>
              </LoginDesc>
              <MobilePhone>
                {' '}
                <img src="../mobile.png" alt="mobile" />
              </MobilePhone>
            </LeftSide>
            <RightSide>
              <SignInHead>
                <img src="../loginIcon.png" alt="login" />
                <Typography
                  variant="h1"
                  sx={{
                    mb: 3,
                  }}
                >
                  Sign In
                </Typography>
              </SignInHead>
              <Grid item md={6} sm={12} xs={12}>
                <label>Mobile Number</label>
                <CountryMobile>
                  <CountrySelect onCountryCode={handleCountryCode} countrycode={countrycode} />
                  <CustomFormControl
                    fullWidth
                    type="text"
                    placeholder="9999999999"
                    name="mobile"
                    value={inputs.mobile || ''}
                    onChange={handleInputChange}
                    autoComplete="off"
                  />
                </CountryMobile>
                {errors && errors.mobile && (
                  <div
                    style={{
                      color: '#e92020',
                      fontSize: '12px',
                      marginLeft: '14px',
                      marginTop: '4px',
                    }}
                  >
                    {errors.mobile}
                  </div>
                )}
              </Grid>
              <Typography variant="h6">Password</Typography>
              <FormControl
                variant="outlined"
                fullWidth
                sx={{
                  mb: 2,
                }}
              >
                <TextField
                  id="outlined-start-adornment"
                  fullWidth
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={inputs.password}
                  onChange={handleInputChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                  }}
                  helperText={errors && errors.password}
                />
              </FormControl>
              <KeepMe>
                <Typography align="center">
                  <Button type="text" onClick={() => router.push('/forgot-password')}>
                    <u>Forgot password</u>
                  </Button>
                </Typography>
              </KeepMe>
              <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
                Sign In
              </Button>
              <Register>
                <span>Don&apos;t have an account</span>
                <Button type="text" onClick={() => router.push('/register')}>
                  <u>Sign Up</u>
                </Button>
              </Register>
            </RightSide>
          </Box>
        </LoginContainer>
      </Layout>
    </ThemeProvider>
  );
}
export async function getServerSideProps(context) {
  try {
    const session = await getSession(context);

    // If user is already logged in
    if (session?.user?.data) {
      const userData = session.user.data;

      // Redirect based on profile status
      switch (userData.profile_status) {
        case 1:
          return {
            redirect: {
              destination: '/cards/add',
              permanent: false,
            },
          };
        case 2:
          return {
            redirect: {
              destination: '/verification',
              permanent: false,
            },
          };
        case 3:
          return {
            redirect: {
              destination: '/uniride',
              permanent: false,
            },
          };
        default:
          // If profile_status is not recognized, clear the session
          context.res.setHeader('Set-Cookie', [
            'next-auth.session-token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT',
            'next-auth.csrf-token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT',
          ]);
          return {
            props: {
              error: 'Invalid profile status',
            },
          };
      }
    }

    // No session, allow access to login page
    return {
      props: {
        null: null,
      },
    };
  } catch (error) {
    console.error('Session check error:', error);
    return {
      props: {
        error: 'Session check failed',
      },
    };
  }
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
    position: absolute;
    right: -120px;
    top: 50px;
    display: none;
    @media (min-width: ${theme.breakpoints.values.lg}px) {
      display: block;
    }

    img {
      width: 100%;
      height: 100%;
      @media (min-width: ${theme.breakpoints.values.md}px) {
        width: 300px;
        height: auto;
      }
      @media (min-width: ${theme.breakpoints.values.xl}px) {
        width: 100%;
        height: 100%;
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
const FormControl = styled(MuiFormControl)`
  ${({ theme }) => `
    font-size: 14px;

    .MuiFormLabel-root {
      transform: translate(60px, 10px) scale(0.75);
      color: ${theme.colors.palette.mediumGrey};
    }

    .MuiFormHelperText-root {
      color: ${theme.colors.palette.darkRed};
    }

    .MuiInputBase-root {
      .MuiSvgIcon-root {
        color: ${theme.colors.palette.darkGrey};
      }

      .MuiInputBase-input {
        padding-top: 12px;
        padding-bottom: 12px;
        padding-left: calc(${theme.spacing(1)} + 2px);
      }

      legend {
        width: 0;
      }

      &:after,
      &:before {
        display: none;
      }
    }
  `}
`;
const KeepMe = styled.div`
  ${({ theme }) => `
    margin-bottom: 47px;
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    @media (min-width: ${theme.breakpoints.values.md}px) {
      flex-wrap: nowrap;
    }

    button {
      margin: 0px !important;
      padding: 0px;
    }
    .MuiFormControlLabel-root {
      margin: 0px;
    }
    .MuiCheckbox-root {
      padding: 0px;
    }
    .MuiButtonBase-root {
      color: ${theme.colors.palette.orange};
    }
    .MuiTypography-h6 {
      font-size: 16px;
    }
  `}
`;
const Register = styled.div`
  ${({ theme }) => `
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding-bottom: 15px;
    @media (min-width: ${theme.breakpoints.values.md}px) {
      flex-wrap: nowrap;
    }
    justify-content: center;
    margin-top: 30px;
    .MuiButtonBase-root {
      color: ${theme.colors.palette.orange};
    }
    .MuiTypography-h6 {
      font-size: 16px;
    }
    button {
      margin: 0px 0px 0px 5px !important;
      padding: 0px;
      min-width: inherit;
    }
  `}
`;
const SignInHead = styled.div`
  ${() => `
    text-align: center;
  `}
`;
const CountryMobile = styled.div`
  ${({ theme }) => `
    display: flex;
    border-radius: 4px;
    border: 1px solid ${theme.colors.palette.grey};

    .MuiOutlinedInput-root {
      padding: 5px !important;
      border: 0px solid #000;
      border-radius: 0px;
      background-color: transparent;
      &:hover {
        border: 0px !important;
        outline: none !important;
      }
      &:focus {
        border: 0px !important;
        outline: none !important;
      }
    }

    .MuiAutocomplete-endAdornment {
      right: 3px;
    }

    .MuiAutocomplete-clearIndicator {
      display: none;
    }
    .css-1aoewgd {
      border: 0px solid #000;
      border-radius: 0px;
      &:focus {
        border: 0px;
        outline: none;
      }
    }
  `}
`;
