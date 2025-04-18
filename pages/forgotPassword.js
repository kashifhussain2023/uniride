import { useState } from "react";
import Head from "next/head";
import ThemeProvider from "@/theme/ThemeProvider";
import Layout from "@/components/common/Layout";
import Paper from "@mui/material/Paper";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import {
    Button,
    Checkbox,
    FormControl as MuiFormControl,
    FormControlLabel,
    FormGroup,
    InputAdornment,
    TextField,
    Typography,
  } from "@mui/material";
  import {
    CheckBoxOutlineBlank,
    CheckBoxOutlined,
    Email,
    Lock,
  } from "@mui/icons-material";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function ForgotPassword() {

    const router = useRouter(); 

    const [errors, setErrors] = useState({
      email: "",
      password: ""
    });
  
    const [inputs, setInputs] = useState({
      email: "",
      password: ""
    });  
    const [responseError, setResponseError] = useState("");
    const [removeErrors, setRemoveErrors] = useState(false);
   
    const handleInputChange = ({ target }) => {
      setInputs(inputs => ({
        ...inputs,
        [target.name]: target.value
      }));
  
      if (removeErrors) {
        setErrors({
          ...validateCustomer({
            ...inputs
          })
        });
      }
    };
    
    const handleSubmit = async e => {
      setResponseError("");
      e.preventDefault();    
  
      const session  = await getSession();
    
  
      let inputForValidation = {
        email: inputs.email,
        password: inputs.password
      };
  
      const validationErrors = validateCustomer(inputForValidation);
      const noErrors = Object.keys(validationErrors).length === 0;
      setRemoveErrors(true);
  
      if (noErrors) {
        const response =  await signIn('credentials', {
          email: inputs.email,
          password: inputs.password,
          redirect: false
        }) 
        .then((response) => {
          if (response.error) {
            setResponseError(response.error);
          } else {
            router.push("/account/dashboard");
          }
        })
        .catch((error) => {
        });
      }else {
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
      <Layout>
       <LoginContainer>
        <Box>
          <LeftSide><img src="../loginimg.png" />
            <LoginDesc>
            <Welcome>Welcome to</Welcome>
            <img src="../logo1.png" />
            <Typography variant="h4">Our professionally trained drivers will make sure that the customers enjoy a safe and reliable ride.</Typography>


            </LoginDesc>

            <MobilePhone> <img src="../mobile.png" /></MobilePhone>
          </LeftSide>  
          <RightSide>
          <SignInHead>
          <img src="../loginIcon.png" />
          <Typography variant="h1" sx={{ mb: 3 }}>Forgot Password</Typography>
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
       
        <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
          Submit
        </Button>
       <Register>
       <span>Don't have an account?</span>
       <Button type="text" onClick={() => router.push("/forgot-password")} >
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


const LoginContainer = styled.div`
  ${({ theme }) => `

 max-width:1200px; margin:40px auto 0px auto; padding:0px 20px;
 @media (min-width: ${theme.breakpoints.values.md}px) {
    margin:86px auto 0px auto;

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
      display:flex; flex-wrap:nowrap}
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
z-index:111; top:70px; max-width:300px; margin:0px auto; left:154px;
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
width:100%;
padding-left:30px;
padding-right:30px;
padding-top:74px; 

@media (min-width: ${theme.breakpoints.values.lg}px) {
    padding-left:102px;
padding-right:30px;

}
@media (min-width: ${theme.breakpoints.values.xl}px) {
  padding-left:102px;
padding-right:30px;

}

&:focus-visibale{box-shadow:none!important; border:0px!important; outline:none }
   
h1{ font-size:24px;
    @media (min-width: ${theme.breakpoints.values.md}px) {
        font-size:28px;
    
    }
    @media (min-width: ${theme.breakpoints.values.lg}px) {
        font-size:32px;
    
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

      &:after, &:before {
        display: none
      }
    }
  `}
`;




const KeepMe = styled.div`
  ${({ theme }) => `
  margin-bottom:47px; margin-top:10px;
display:flex; justify-content:space-between; flex-wrap:wrap; 
@media (min-width: ${theme.breakpoints.values.md}px) {
    flex-wrap:nowrap; 

}


button{ margin:0px!important; padding:0px};
.MuiFormControlLabel-root{ margin:0px;}
.MuiCheckbox-root{ padding:0px; }
.MuiButtonBase-root{ color: ${theme.colors.palette.orange};}
.MuiTypography-h6{font-size:16px}

  `}
`;

const Register = styled.div`
  ${({ theme }) => `
  display:flex; align-items:center; flex-wrap:wrap; padding-bottom:15px;
  @media (min-width: ${theme.breakpoints.values.md}px) {
    flex-wrap:nowrap; 

}
  justify-content:center; margin-top:30px;
  .MuiButtonBase-root{ color: ${theme.colors.palette.orange};}
.MuiTypography-h6{font-size:16px}
button{ margin:0px 0px 0px 5px!important; padding:0px; min-width:inherit};

  `}
`;
const SignInHead = styled.div`
  ${({ theme }) => `
  text-align:center;

  `}
`;
