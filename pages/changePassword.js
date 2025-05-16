import Layout from '@/components/common/Layout';
import SpinnerLoader from '@/components/common/SpinnerLoader';
import ThemeProvider from '@/theme/ThemeProvider';
import { api } from '@/utils/api/common';
import { validateChangePassword } from '@/utils/change-password';
import styled from '@emotion/styled';
import { Lock } from '@mui/icons-material';
import {
  Button,
  IconButton,
  InputAdornment,
  FormControl as MuiFormControl,
  TextField,
  Typography,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { signOut } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Image from 'next/image';

export default function ChangePassword({ userAuth }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    confirm_password: '',
    new_password: '',
    old_password: '',
  });
  const [inputs, setInputs] = useState({
    confirm_password: '',
    new_password: '',
    old_password: '',
  });
  const [removeErrors, setRemoveErrors] = useState(false);
  const [showPassword, setShowPassword] = useState({
    confirm_password: false,
    new_password: false,
    old_password: false,
  });

  const handleClickShowPassword = field => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleInputChange = ({ target }) => {
    setInputs(inputs => ({
      ...inputs,
      [target.name]: target.value,
    }));
    if (removeErrors) {
      const data = {
        ...inputs,
        [target.name]: target.value,
      };
      setErrors({
        ...validateChangePassword({
          ...data,
        }),
      });
    }
  };
  const handleSubmit = async e => {
    e.preventDefault();
    const inputForValidation = {
      confirm_password: inputs.confirm_password,
      new_password: inputs.new_password,
      old_password: inputs.old_password,
    };
    const validationErrors = validateChangePassword(inputForValidation);
    const noErrors = Object.keys(validationErrors).length === 0;
    setRemoveErrors(true);

    if (noErrors) {
      setLoading(true);
      const formData = new FormData();
      formData.append('old_password', inputs.old_password);
      formData.append('new_password', inputs.new_password);
      formData.append('customer_id', userAuth?.customer_id);
      formData.append('token_code', userAuth?.token_code);
      const requestBody = {
        confirm_password: inputs.confirm_password,
        new_password: inputs.new_password,
        old_password: inputs.old_password,
      };
      const response = await api({
        data: requestBody,
        method: 'POST',
        url: '/customer/change-password',
      });
      if (response.status === true) {
        setLoading(false);
        toast.success(response.message);
        router.push('/profile');
      } else if (response.status === false && response.message === 'Invalid token code') {
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
        toast.error(response.message);
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
        <LoginContainer>
          <Box>
            <RightSide>
              <SignInHead>
                <Image
                  src={`${process.env.NEXTAUTH_URL}/loginIcon.png`}
                  alt="Login Icon"
                  width={30}
                  height={30}
                />
                <Typography
                  variant="h2"
                  sx={{
                    mb: 3,
                  }}
                >
                  Change Password
                </Typography>
              </SignInHead>
              <Typography variant="h6">Old Password</Typography>
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
                  type={showPassword.old_password ? 'text' : 'password'}
                  name="old_password"
                  value={inputs.old_password}
                  onChange={handleInputChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => handleClickShowPassword('old_password')}
                          edge="end"
                          aria-label="toggle password visibility"
                        >
                          {showPassword.old_password ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                  }}
                  helperText={errors && errors.old_password}
                />
              </FormControl>
              <Typography variant="h6">New Password</Typography>
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
                  type={showPassword.new_password ? 'text' : 'password'}
                  name="new_password"
                  value={inputs.new_password}
                  onChange={handleInputChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => handleClickShowPassword('new_password')}
                          edge="end"
                          aria-label="toggle password visibility"
                        >
                          {showPassword.new_password ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                  }}
                  helperText={errors && errors.new_password}
                />
              </FormControl>
              <Typography variant="h6">Confirm Password</Typography>
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
                  type={showPassword.confirm_password ? 'text' : 'password'}
                  name="confirm_password"
                  value={inputs.confirm_password}
                  onChange={handleInputChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => handleClickShowPassword('confirm_password')}
                          edge="end"
                          aria-label="toggle password visibility"
                        >
                          {showPassword.confirm_password ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                  }}
                  helperText={errors && errors.confirm_password}
                />
              </FormControl>
              <ChangeFooter>
                <Button
                  variant=""
                  color="primary"
                  onClick={() => router.push('profile')}
                  sx={{
                    mr: 1,
                  }}
                >
                  Back
                </Button>{' '}
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                  Proceed
                </Button>
              </ChangeFooter>
            </RightSide>
          </Box>
        </LoginContainer>
      </Layout>
    </ThemeProvider>
  );
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
    max-width: 600px;
    margin: 0 auto;


    @media (min-width: ${theme.breakpoints.values.md}px) {
      display: flex;
      flex-wrap: nowrap;
    }

    @media (min-width: ${theme.breakpoints.values.lg}px) {
      overflow: inherit;
    }
  `}
`;
const RightSide = styled.div`
  ${({ theme }) => `
    width: 100%;
    padding: ${theme.spacing(4)};

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

    h2 {
      font-size: 20px;
      font-weight: 700;
      @media (min-width: ${theme.breakpoints.values.md}px) {
        font-size: 28px;
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
const SignInHead = styled.div`
  ${() => `
    text-align: center;
  `}
`;
const ChangeFooter = styled.div`
  ${() => `
display:flex; justify-content:center;

  `}
`;
