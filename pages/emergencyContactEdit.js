import React,{useState,useEffect} from "react";
import Head from "next/head";
import ThemeProvider from "@/theme/ThemeProvider";
import Layout from "@/components/common/Layout";
import SmallContent from "@/components/presentation/SmallContent";
import Paper from "@mui/material/Paper";
import styled from "@emotion/styled";
import PageTitle from "@/components/common/PageTitle";
import { Typography, Button } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import CustomFormControl from "@/theme/CustomFormControl";
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth/next"
import { authOptions } from './api/auth/[...nextauth]'
import CountrySelect from "@/components/common/CountrySelect";
import { api } from "@/utils/api/common";
import { validateEmergencyContact } from "@/utils/emergency-contact";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function EmergencyContactEdit({userAuth}) {
  const router = useRouter();
  const [countrycode,setCountryCode] = useState("+1");
  const [inputs, setInputs] = useState({
    name: "",
    email:"",
    phone: "",
    country_code: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email:"",
    phone: "",
    country_code: "",
  });
  const [removeErrors, setRemoveErrors] = useState(false);

  const handleInputChange = ({ target }) => {
      setInputs((inputs) => ({
        ...inputs,
        [target.name]: target.value,
      }));
    

    if (removeErrors) {
      setErrors({
        ...validateEmergencyContact({
          ...inputs,
        }),
      });
    }
  };

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    console.log('submit',inputs);
    
    let inputForValidation = {
      email: inputs.email,
      name: inputs.name,
      phone: inputs.phone,
    };

    const validationErrors = validateEmergencyContact(inputForValidation);
    const noErrors = Object.keys(validationErrors).length === 0;
    setRemoveErrors(true);
    
    //set All data to form data
    const formData = new FormData();
    formData.append('name',inputs.name);
    formData.append('email',inputs.email);
    formData.append('phone',inputs.phone);
    formData.append('country_code',countrycode);
    formData.append('token_code',userAuth?.token_code);
    
    const requestBody = {
      // id: inputs.
      name: inputs.name,
      email: inputs.email,
      phone: inputs.phone,
      phone_code: countrycode
    }
    
    if (noErrors) {
      const response = await api({
        url: '/customer/emergency/update',
        method: 'PUT',
        data: formData,
      });
      if (response.status === true) {
        toast.success(response.message);
        router.push('emergencyContact');
      }else{
        toast.error(response.message);
      } 
    } else {
      setErrors(validationErrors);
    }
  };

  const handleCountryCode = (value) =>{
    setCountryCode('+'+value,);
  }

  const getEmergencyContactDetail = async () => {
    const formData = new FormData();
    
    //formData.append('customer_id',userAuth.customer_id);
    formData.append('token_code',userAuth?.token_code);
    const response = await api({
      url: '/customer/emergency/update',
      method: 'POST',
      data: formData,
    });
    
    if (response.status === true) {
      console.log('contactdata',response.data);
      if(response.data.length>0){
        setInputs(response.data[0]);
        console.log(response.data);
      }else{
        router.push('/emergencyContactAdd');
      }
    } 
  }; 

  useEffect(() => {
    getEmergencyContactDetail();
  }, []);

  return (
    <ThemeProvider>
      <Head>
        <title>Uniride</title>
        <meta name="description" content="Uniride " />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <SmallContent>
          <EmergencyContact>
            <LeftSection>
              <PageTitle
                sx={{ mb: 0 }}
                title="Emergency"
                subtitle="Contact"
                images_icon={"../emergencyContact.png"}
              />
              <Typography variant="h3" sx={{ mb: 1 }}>
                Please update your contact info
              </Typography>
              <FormControl>
                <InputLabel>Name</InputLabel>
                <CustomFormControl
                  fullWidth
                  type="text"
                  placeholder="Enter name"
                  name="name"
                  value={inputs.name || ''}
                  onChange={handleInputChange}
                />
                <span className="text-danger">
                      {errors && errors.name}
                    </span>
              </FormControl>
              <FormControl>
                <InputLabel>Email</InputLabel>
                <CustomFormControl
                  fullWidth
                  type="text"
                  placeholder="Enter email"
                  name="email"
                  value={inputs.email || ''}
                  onChange={handleInputChange}
                />
                 <span className="text-danger">
                      {errors && errors.email}
                    </span>
              </FormControl>
              <FormControl>
                <InputLabel>Phone Number</InputLabel>
                <CountryMobile>
                <CountrySelect onCountryCode={handleCountryCode} countrycode = {countrycode}/>
                <CustomFormControl
                  fullWidth
                  type="text"
                  placeholder="Enter mobile"
                  name="phone"
                  value={inputs.phone || ''}
                  onChange={handleInputChange}
                />
                
                </CountryMobile>
                    <span className="text-danger">
                      {errors && errors.phone}
                    </span>
              </FormControl>
              <Button variant="contained" onClick={handleSubmit}>Update Contact</Button>
            </LeftSection>
            <RightSection>
              <img src="../contract.png" />
            </RightSection>
          </EmergencyContact>
        </SmallContent>
      </Layout>
    </ThemeProvider>
  );
}

export async function getServerSideProps(context) {
  // You can access the session and user information here.
  const session = await getSession(context);
  console.log("first session", session)
  
  // if (!session) {
  //   return {
  //     redirect: {
  //       destination: '/login',
  //       permanent: false,
  //     },
  //   };
  // }

  return {
    props: {
      userAuth: session?.user || null,
    },
  };
}

const EmergencyContact = styled.div`
  ${({ theme }) => `
  border-radius: 16px 0px 16px 16px; box-shadow: 0px 0px 15px -1px rgba(0,0,0,0.10); background-color:${theme.colors.palette.white}; padding:24px;  margin-top:60px; display:flex; justify-content:space-between; flex-wrap:wrap;
  @media (min-width: ${theme.breakpoints.values.sm}px) {  
    flex-wrap:nowrap;
  }
 img{ max-width:100%; height:auto}

 .text-danger{ font-size: 13px; color:${theme.colors.palette.red};}
  `}
`;

const LeftSection = styled.div`
  ${({ theme }) => `
width:100%;
margin-right:20px;

    
  `}
`;

const RightSection = styled.div`
  ${({ theme }) => `
width:100%; flex:0 0 50%; display:none;
@media (min-width: ${theme.breakpoints.values.md}px) {           
  display:block
}
    
  `}
`;

const FormControl = styled.div`
  ${({ theme }) => `
 margin-bottom:16px;
  .MuiInputBase-input{   font-size:16px; height:35px; padding:5px 10px; border-radius:6px; }
  .MuiInputLabel-root{ margin-top:0px; display:block; margin-bottom:5px; color:${theme.colors.palette.darkGrey};
span{ color:${theme.colors.palette.red}}
} 
  `}
`;

const CountryMobile = styled.div`
  ${({ theme }) => `
  display:flex; border-radius: 4px;
  border: 1px solid ${theme.colors.palette.grey}; 

  .MuiOutlinedInput-root {
    padding: 5px!important; border:0px solid #000; border-radius:0px;background-color: transparent; 
    &:hover{ border:0px!important; outline:none!important}
    &:focus{ border:0px!important; outline:none!important}
}

.MuiAutocomplete-endAdornment {
  right: 3px;
}

.MuiAutocomplete-clearIndicator{ display:none}
.css-1aoewgd{ border:0px solid #000; border-radius:0px;
&:focus{ border:0px; outline:none}
}
  `}
`;