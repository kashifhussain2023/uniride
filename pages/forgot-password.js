import { useState } from "react";
import { getSession } from "next-auth/react";
import Head from "next/head";
import ThemeProvider from "@/theme/ThemeProvider";
import Layout from "@/components/common/Layout";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import {
  Button,
  FormControl as MuiFormControl,
  InputAdornment,
  TextField,
  Typography,
  Grid,
} from "@mui/material";
import { validateForgotFields } from "@/utils/forgot-password";
import { api } from "./api/auth/register";
import SpinnerLoader from "@/components/common/SpinnerLoader";
import CountrySelect from "@/components/common/CountrySelect";
import CustomFormControl from "@/theme/CustomFormControl";

export default function ForgotPassword() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    mobile: "",
  });

  const [inputs, setInputs] = useState({
    mobile: "",
  });
  const [responseError, setResponseError] = useState("");
  const [removeErrors, setRemoveErrors] = useState(false);
  const [countrycode, setCountryCode] = useState("+1");
  
  const handleCountryCode = (value) => {
    setCountryCode("+" + value);
  };


  const handleInputChange = ({ target }) => {
    setInputs((inputs) => ({
      ...inputs,
      [target.name]: target.value,
    }));

    if (removeErrors) {
      setErrors({
        ...validateForgotFields({
          ...inputs,
        }),
      });
    }
  };

  const handleSubmit = async (e) => {
    setResponseError("");
    e.preventDefault();

    let inputForValidation = {
      mobile: inputs.mobile,
      password: inputs.password,
    };

    const validationErrors = validateForgotFields(inputForValidation);
    const noErrors = Object.keys(validationErrors).length === 0;
    setRemoveErrors(true);
    //set All data to form data
    const formData = new FormData();
    formData.append("phone", inputs.mobile);
    formData.append("phone_code", countrycode)

    const requestBody = {
      phone : inputs.mobile,
      phone_code : countrycode
    }

    if (noErrors) {
      setLoading(true);
      const response = await api({
        url: "/customer/forgot-password",
        method: "POST",
        data: requestBody,
      });

      if (response.status === true) {
        setLoading(false);
        toast.success(response.message);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else if (response.status === false) {
        setLoading(false);
        toast.error(response.message);
      } else {
        setLoading(false);
        toast.error("Internal Server Error");
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
              <img src="../loginimg.png" />
              <LoginDesc>
                <Welcome>Welcome to</Welcome>
                <img src="../logo1.png" />
                <Typography variant="h4">
                  Our professionally trained drivers will make sure that the
                  customers enjoy a safe and reliable ride.
                </Typography>
              </LoginDesc>

              <MobilePhone>
                {" "}
                <img src="../mobile.png" />
              </MobilePhone>
            </LeftSide>
            <RightSide>
              <SignInHead>
                <img src="../loginIcon.png" />
                <Typography variant="h1" sx={{ mb: 3 }}>
                  Forgot Password
                </Typography>
              </SignInHead>
              <Grid item md={6} sm={12} xs={12} sx={{marginBottom: "20px"}}>
                              <label>Mobile Number</label>
                              <CountryMobile>
                                <CountrySelect
                                  onCountryCode={handleCountryCode}
                                  countrycode={countrycode}
                                />
                                <CustomFormControl
                                  fullWidth
                                  type="text"
                                  placeholder="9999999999"
                                  name="mobile"
                                  value={inputs.mobile || ""}
                                  onChange={handleInputChange}
                                  autoComplete="off"
                                />
                              </CountryMobile>
                              {errors && errors.mobile && (
                                <div
                                  style={{
                                    color: "#e92020",
                                    fontSize: "12px",
                                    marginTop: "4px",
                                    marginLeft: "14px",
                                  }}
                                >
                                  {errors.mobile}
                                </div>
                              )}
                            </Grid>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSubmit}
              >
                Submit
              </Button>
              <Register>
                <span>Don't have an account?</span>
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
      margin: 86px auto 0px auto;
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
      display: flex;
      flex-wrap: nowrap;
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
    max-width: 300px;
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
        font-size: 28px;
      }
      @media (min-width: ${theme.breakpoints.values.lg}px) {
        font-size: 32px;
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
  text-align:center;

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
