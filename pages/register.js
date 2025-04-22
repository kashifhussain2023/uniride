import React, { useState } from "react";
import { getSession } from "next-auth/react";
import Head from "next/head";
import ThemeProvider from "@/theme/ThemeProvider";
import Layout from "@/components/common/Layout";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import CustomFormControl from "@/theme/CustomFormControl";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import validatorInstance from "@/utils/ValidatorSingleton";
import { api } from "./api/auth/register";
import CountrySelect from "@/components/common/CountrySelect";
import { toast } from "react-toastify";
import SpinnerLoader from "@/components/common/SpinnerLoader";
import { setCookie } from "nookies";
export default function Login() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [countrycode, setCountryCode] = useState("+1");
  const [errors, setErrors] = useState({
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
    password: "",
    cpassword: "",
    gender: "",
    profile_picture: "",
    terms_condition: "",
  });
  const [termsCondition, setTermsCondition] = useState(true);
  const [inputs, setInputs] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    mobile: "",
    password: "",
    cpassword: "",
    gender: "",
    profile_picture: "",
  });
  const [responseError, setResponseError] = useState("");
  const [removeErrors, setRemoveErrors] = useState(false);
  const [base64Image, setBase64Image] = useState("");

  const handleInputChange = ({ target }) => {
    if (target.type === "file") {
      const file = target.files[0];
      if (target.files.length > 0) {
        const imageUrl = URL.createObjectURL(file);
        document.getElementById("preview").src = imageUrl;
        setInputs((inputs) => ({
          ...inputs,
          [target.name]: file,
        }));
        const reader = new FileReader();

        reader.onloadend = () => {
          setBase64Image(reader.result.replace("data:image/jpeg;base64", ""));
        };

        reader.readAsDataURL(file);
      } else {
        // No file selected, set imageUrl to null
        document.getElementById("preview").src = "../avatar-photo.png";
        setInputs((inputs) => ({
          ...inputs,
          [target.name]: null,
        }));
        setBase64Image("");
      }
    } else {
      // Handle other input types
      setInputs((inputs) => ({
        ...inputs,
        [target.name]: target.value,
      }));
    }

    if (removeErrors) {
      if (target.type === "file") {
        var data = { ...inputs, [target.name]: target.files[0], terms_condition: termsCondition };
      } else {
        var data = { ...inputs, [target.name]: target.value, terms_condition: termsCondition };
      }

      setErrors({
        ...validatorInstance.validateRegisterCustomer(data),
      });
    }
  };
  const handleCountryCode = (value) => {
    setCountryCode("+" + value);
  };

  const handleTermsChange = (event) => {
    setTermsCondition(event.target.checked);
    if (removeErrors) {
      const validationErrors = validatorInstance.validateRegisterCustomer({
        ...inputs,
        terms_condition: event.target.checked
      });
      setErrors(validationErrors);
    }
  };

  const handleSubmit = async (e) => {
    setResponseError("");
    e.preventDefault();
    let inputForValidation = {
      first_name: inputs.first_name,
      last_name: inputs.last_name,
      email: inputs.email,
      password: inputs.password,
      cpassword: inputs.cpassword,
      mobile: inputs.mobile,
      terms_condition: termsCondition
    };

    const validationErrors = validatorInstance.validateRegisterCustomer(inputForValidation);
    const noErrors = Object.keys(validationErrors).length === 0;
    setRemoveErrors(true);
    setErrors(validationErrors);

    //set All data to form data
    const formData = new FormData();
    formData.append("version", 1);
    formData.append(
      "device_id",
      "8091fd16cfaf9978ba777dbdbb7e92c7684da353d9d7f42b6aad6e5f17947829"
    );

    formData.append("os", 2);
    formData.append("phone_code", countrycode);
    formData.append("name", inputs.first_name + inputs.last_name);
    formData.append("phone", inputs.mobile);
    formData.append("first_name", inputs.first_name);
    formData.append("middle_name", inputs.middle_name);
    formData.append("last_name", inputs.last_name);
    formData.append("gender", inputs.gender);
    formData.append("email", inputs.email);
    formData.append("password", inputs.password);
    formData.append("confirm_password", inputs.cpassword);
    formData.append("profile_picture", base64Image);

    const requestBody = {
      version: "1",
      device_id: "8091fd16cfaf9978ba777dbdbb7e92c7684da353d9d7f42b6aad6e5f17947829",
      os: "2",
      first_name: inputs.first_name,
      middle_name: inputs.middle_name,
      last_name: inputs.last_name,
      email: inputs.email,
      phone_code: countrycode,
      phone: inputs.mobile,
      password: inputs.password,
      confirm_password: inputs.cpassword
    };

    if (noErrors) {
      setLoading(true);
      const response = await api({
        url: "/customer/register",
        method: "POST",
        data: requestBody,
      });

      console.log("response", response);

      if (response.status === true) {
        setLoading(false);

        // Check OTP verification status first
        if (response.data.otp_verified === 0) {
          // User needs to verify OTP
          setCookie(
            null,
            "registrationDetail",
            JSON.stringify({
              name: inputs.first_name + " " + inputs.last_name,
              mobile_number: inputs.mobile,
              password: inputs.password,
              phone_code:countrycode,
              customer_id: response.data.id,
              email: inputs.email
            }),
            {
              maxAge: 5 * 60, // 5 minutes
              path: "/",
            }
          );
          toast.success(
            "OTP has been sent to your registered mobile number. Please verify your account."
          );
          router.push("/verification");
        }
        // If OTP is verified, check profile status
        else if (response.data.profile_status === 1) {
          setCookie(
            null,
            "newUserRegistration",
            JSON.stringify({
              customer_id: response.data.id,
              name: inputs.first_name + " " + inputs.last_name,
              mobile_number: inputs.mobile,
              password: inputs.password,
              customer_id: response.data.customer_id,
              token_code: response.data.token_code // Store token if provided
            }),
            {
              path: "/",
            }
          );
          toast.success("Please add your card detail.");
          router.push("/add-card");
        } else {
          // If both OTP verified and profile complete, redirect to login
          toast.success("Registration successful. Please login to continue.");
          router.push("/login");
        }
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
            <SignUpLeft>
              <span>
                {" "}
                <img src="../taxiimg.png" />
              </span>
            </SignUpLeft>
            <SignUpRight>
              <span>
                {" "}
                <img src="../loginIcon.png" />
              </span>
              <Typography variant="h1" sx={{ mt: 1, mb: 1 }}>
                Sign Up
              </Typography>
              <SignupForm sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                  <Grid item md={6} sm={12} xs={12}>
                    <label>First Name</label>
                    <CustomFormControl
                      fullWidth
                      type="text"
                      placeholder="Enter first name"
                      name="first_name"
                      value={inputs.first_name}
                      onChange={handleInputChange}
                      helperText={errors && errors.first_name}
                    />
                    <span className="text-danger">
                      {errors && errors.first_name}
                    </span>
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <label>Last Name</label>
                    <CustomFormControl
                      fullWidth
                      type="text"
                      placeholder="Enter last name"
                      name="last_name"
                      value={inputs.last_name}
                      onChange={handleInputChange}
                      helperText={errors && errors.last_name}
                    />
                    <span className="text-danger">
                      {errors && errors.last_name}
                    </span>
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <label>Email</label>
                    <CustomFormControl
                      fullWidth
                      type="text"
                      placeholder="user.name@email.com"
                      name="email"
                      value={inputs.email}
                      onChange={handleInputChange}
                      helperText={errors && errors.email}
                      autoComplete="email"
                    />
                    <span className="text-danger">
                      {errors && errors.email}
                    </span>
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
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
                    <span className="text-danger">
                      {errors && errors.mobile}
                    </span>
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <label>Password</label>
                    <CustomFormControl
                      fullWidth
                      type="password"
                      placeholder="**********"
                      name="password"
                      value={inputs.password || ""}
                      onChange={handleInputChange}
                    />
                    <span className="text-danger">
                      {errors && errors.password}
                    </span>
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <label>Confirm Password</label>
                    <CustomFormControl
                      fullWidth
                      type="password"
                      placeholder="**********"
                      name="cpassword"
                      value={inputs.cpassword}
                      onChange={handleInputChange}
                    />
                    <span className="text-danger">
                      {errors && errors.cpassword}
                    </span>
                  </Grid>
                  <Grid item md={12}>
                    <ByClicking>
                      <Checkbox
                        checked={termsCondition}
                        name="terms_condition"
                        onChange={handleTermsChange}
                      />{" "}
                      By clicking register, you agree to our Terms & Conditions
                      & Privacy Policy
                      {errors.terms_condition && (
                        <span className="text-danger">
                          <br />
                          {errors.terms_condition}
                        </span>
                      )}
                    </ByClicking>
                  </Grid>
                </Grid>

                <SignUpFt>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                  >
                    Sign Up
                  </Button>
                  <Register>
                    <span>Already Registered</span>
                    <Button type="text" onClick={() => router.push("/login")}>
                      Sign In
                    </Button>
                  </Register>
                </SignUpFt>
              </SignupForm>
            </SignUpRight>

            <div>
              {/* <h1>Custom Form Control Example</h1>
      <CustomFormControl
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder="Enter first  name"
        
      /> */}
            </div>
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
    .MuiOutlinedInput-notchedOutline {
      border-color: transparent !important;
    }
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
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    @media (min-width: ${theme.breakpoints.values.md}px) {
      display: flex;
      flex-wrap: nowrap;
    }
  `}
`;

const SignUpLeft = styled.div`
  ${({ theme }) => `
    display: none;
    width: 266px;
    flex: 0 0 266px;
    background-image: url(../registerLeft.png);
    position: relative;
    min-height: 720px;
    background-repeat: none;
    background-size: cover;
    @media (min-width: ${theme.breakpoints.values.md}px) {
      display: block;
      width: 240px;
      flex: 0 0 240px;
    }
    @media (min-width: ${theme.breakpoints.values.lg}px) {
      display: block;
      width: 334px;
      flex: 0 0 334px;
    }

    img {
      position: absolute;
      top: 110px;
      right: -195px;
      @media (min-width: ${theme.breakpoints.values.md}px) {
        width: 410px;
        top: 180px;
      }
      @media (min-width: ${theme.breakpoints.values.lg}px) {
        width: inherit;
        top: 110px;
      }
    }
  `}
`;

const SignUpRight = styled.div`
  ${({ theme }) => `
    width: 100%;
    padding: 40px;

    @media (min-width: ${theme.breakpoints.values.md}px) {
      padding: 40px 30px 40px 224px;
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

    .text-danger {
      font-size: 13px;
      color: ${theme.colors.palette.red};
    }

    .upload-image {
      width: 45px;
      height: 45px;
      border-radius: 100%;
      border: 1px solid #f2f2f7;
      margin-right: 10px;
      padding: 2px;
    }

    input[type="file"]::file-selector-button {
      border-radius: 4px;
      padding: 0 16px;
      height: 40px;
      cursor: pointer;
      background-color: white;
      border: 1px solid rgba(0, 0, 0, 0.16);
      box-shadow: 0px 1px 0px rgba(0, 0, 0, 0.05);
      margin-right: 16px;
      transition: background-color 200ms;
    }

    /* file upload button hover state */
    input[type="file"]::file-selector-button:hover {
      background-color: #f3f4f6;
    }

    /* file upload button active state */
    input[type="file"]::file-selector-button:active {
      background-color: #e5e7eb;
    }
  `}
`;

const SignupForm = styled.div`
  ${({ theme }) => `
    margin-top: 15px;
    label {
      font-size: 16px;
      color: ${theme.colors.palette.darkGrey};
      margin-bottom: 5px;
      padding-bottom: 4px;
      display: block;
    }

    .Mui-checked {
      color: ${theme.colors.palette.orange}!important;
    }
  `}
`;
const UploadArea = styled.div`
  ${({ theme }) => `
    display: flex;
    align-items: center;
    width: 163px;
    .MuiButtonBase-root {
      padding: 0px;

      &:first-child {
        pointer-events: none;
        max-width: inherit;
        min-width: inherit;
        flex: 1;
      }
    }
    .MuiTouchRipple-root {
      display: none;
    }

    .upload-image {
      margin-right: 0px;
    }

    .MuiButton-root {
      input[type="file"] {
        overflow: hidden;
        width: 108px;
      }
    }
  `}
`;

const ByClicking = styled.div`
  ${({ theme }) => `
    margin-bottom: 20px;
    .MuiCheckbox-root {
      padding: 0px;
    }
    .Mui-checked {
      color: ${theme.colors.palette.orange}!important;
    }
  `}
`;
const SignUpFt = styled.div`
  ${({ theme }) => `
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    @media (min-width: ${theme.breakpoints.values.md}px) {
      flex-wrap: nowrap;
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
      flex-wrap: wrap;
    }
    @media (min-width: ${theme.breakpoints.values.lg}px) {
      flex-wrap: nowrap;
    }
    justify-content: center;
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

    .MuiTouchRipple-root {
      display: none;
    }
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
