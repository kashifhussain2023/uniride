import { useState } from "react";
import Head from "next/head";
import { signIn, getSession } from "next-auth/react";
import { setCookie } from "nookies";
import ThemeProvider from "@/theme/ThemeProvider";
import Layout from "@/components/common/Layout";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import SpinnerLoader from "@/components/common/SpinnerLoader";
import axios from "axios";

import {
  Button,
  FormControl as MuiFormControl,
  InputAdornment,IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Email, Lock } from "@mui/icons-material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { validateCustomer } from "@/utils/login";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  // Add these variables to your component to track the state
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);


  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const [responseError, setResponseError] = useState("");
  const [removeErrors, setRemoveErrors] = useState(false);
 
  const handleInputChange = ({ target }) => {
    setInputs((inputs) => ({
      ...inputs,
      [target.name]: target.value,
    }));

    if (removeErrors) {
      let data = { ...inputs, [target.name]: target.value };
      setErrors({
        ...validateCustomer({
          ...data,
        }),
      });
    }
  };

  const handleSubmit = async (e) => {
    setResponseError("");
    e.preventDefault();

    let inputForValidation = {
      email: inputs.email,
      password: inputs.password,
    };

    const validationErrors = validateCustomer(inputForValidation);
    const noErrors = Object.keys(validationErrors).length === 0;
    setRemoveErrors(true);
    //set All data to form data

    if (noErrors) {
      setLoading(true);
      const response = await signIn("credentials", {
        email: inputs.email,
        password: inputs.password,
        redirect: false,
      });

      if (response.error) {
        setLoading(false);
        toast.error(response.error);
      } else {
        setLoading(false);
        const session = await getSession();
        const userData = {
          mobile_number: '7728020202',
          name: 'customer',
          customer_id: 149,
          profile_status: 1
        };

        if (userData?.profile_status == "1") {
          setCookie(
            null,
            "newUserRegistration",
            JSON.stringify({
              name: userData.name,
              mobile_number: userData.mobile_number,
              customer_id: userData.customer_id,
            }),
            {
              //maxAge: 5 * 60,
              path: "/",
            }
          );
          router.push("/add-card");
        } else if (userData?.profile_status == "2") {
          setCookie(
            null,
            "registrationDetail",
            JSON.stringify({
              name: userData.name,
              mobile_number: userData.mobile_number,
              customer_id: userData.customer_id,
            }),
            {
              maxAge: 5 * 60,
              path: "/",
            }
          );
          router.push("/verification");
        } else {
          toast.success(userData?.message);
          router.push("/uniride");
        }
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
            <LeftSide>
              <img src="../loginimg.png" alt="login" />
              <LoginDesc>
                <Welcome>Welcome to</Welcome>
                <img src="../logo1.png" alt="logo" />
                <Typography variant="h4">
                  Our professionally trained drivers will make sure that the
                  customers enjoy a safe and reliable ride.
                </Typography>
              </LoginDesc>
              <MobilePhone>
                {" "}
                <img src="../mobile.png" alt="mobile" />
              </MobilePhone>
            </LeftSide>
            <RightSide>
              <SignInHead>
                <img src="../loginIcon.png" alt="login" />
                <Typography variant="h1" sx={{ mb: 3 }}>
                  Sign In
                </Typography>
              </SignInHead>
              <Typography variant="h6">Email</Typography>
              <FormControl variant="outlined" fullWidth sx={{ mb: 3 }}>
                <TextField
                  id="outlined-start-adornment"
                  type="email"
                  name="email"
                  value={inputs.email}
                  onChange={handleInputChange}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    ),
                  }}
                  helperText={errors && errors.email}
                />
              </FormControl>
              <Typography variant="h6">Password</Typography>
              <FormControl variant="outlined" fullWidth sx={{ mb: 2 }}>
                <TextField
                  id="outlined-start-adornment"
                  fullWidth
                  // type="password"
                  type={showPassword ? "text" : "password"} // <-- This is where the magic happens
                  name="password"
                  value={inputs.password}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                    endAdornment: (<InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>)     
                    
                  }}
                 
                  helperText={errors && errors.password}
                />
              </FormControl>
              <KeepMe>
                <Typography align="center">
                  <Button
                    type="text"
                    onClick={() => router.push("/forgot-password")}
                  >
                    <u>Forgot password</u>
                  </Button>
                </Typography>
              </KeepMe>
              <Typography>{responseError}</Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSubmit}
              >
                Sign In
              </Button>
              <Register>
                <span>Don't have an account</span>
                <Button type="text" onClick={() => router.push("/register")}>
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
  // You can access the session and user information here.
  const session = await getSession(context);

  if (
    session &&
    session.user.status === "TRUE" &&
    session.user.profile_status === "3"
  ) {
    // Handle unauthenticated access
    return {
      redirect: {
        destination: "/uniride",
        permanent: false,
      },
    };
  }
  return {
    props: {
      null: null,
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
  ${({ theme }) => `
    text-align: center;
  `}
`;
