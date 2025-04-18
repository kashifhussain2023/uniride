import Head from "next/head";
import ThemeProvider from "@/theme/ThemeProvider";
import Layout from "@/components/common/Layout";
import SmallContent from "@/components/presentation/SmallContent";
import Paper from "@mui/material/Paper";
import styled from "@emotion/styled";
import PageTitle from "@/components/common/PageTitle";
import { Button, Typography, TextField } from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import CustomFormControl from "@/theme/CustomFormControl";
import { useState,useEffect } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth/next"
import { authOptions } from './api/auth/[...nextauth]'
import { api } from "@/utils/api/common";
import { validateProfileCustomer } from "@/utils/profile";
import { toast } from 'react-toastify';
import SpinnerLoader from "@/components/common/SpinnerLoader";
import CountrySelect from "@/components/common/CountrySelect";
import { useRouter } from "next/router";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function Profile({userAuth}) {
  
  const router = useRouter();
  const [ profileData, setProfileData ] = useState({});
  const [disabled,setDisabled] = useState(true);
  const [responseError, setResponseError] = useState("");
  const [removeErrors, setRemoveErrors] = useState(false);
  const [inputs,setInputs] =useState({});
  const [errors, setErrors] = useState({
    first_name: "",
    last_name: "",
    email:"",
    mobile_number:"",
    gender:"",
    image:""
  });
  
  const getUserProfile = async () => {
    
    const formData = new FormData();
    formData.append('customer_id',userAuth.customer_id);
    formData.append('token_code',userAuth.token_code);
    const response = await api({
      url: '/customers/get_profile_details',
      method: 'POST',
      data: formData,
    });
    
    if (response.status === "TRUE") {

      setProfileData(response);
      setInputs(response);
      
    } 
  }; 
  const handleInputChange = ({ target }) => {
    if (target.type === "file") {
      // Handle file upload
      const file = target.files[0];
      const imageUrl = URL.createObjectURL(file);
      document.getElementById('preview').src = imageUrl;
      setInputs(inputs => ({
        ...inputs,
        [target.name]: file,
      }));
    } else {
      // Handle other input types
      setInputs(inputs => ({
        ...inputs,
        [target.name]: target.value,
      }));
    }
    

    if (removeErrors) {
      setErrors({
        ...validateProfileCustomer({
          ...inputs
        })
      });
    }
  };
  const updateProfile = async e => {
    
    setResponseError("");
    e.preventDefault();    
    
    //return false;
    
    let inputForValidation = {
      first_name: inputs.first_name,
      last_name: inputs.last_name,
      email:inputs.email,
      mobile_number:inputs.mobile_number,
      gender:inputs.gender,
      profile_image:inputs.profile_image
    };
    

    const validationErrors = validateProfileCustomer(inputForValidation);
    const noErrors = Object.keys(validationErrors).length === 0;
    setRemoveErrors(true);
     //set All data to form data
     //return false;
    
    if (noErrors) {
      //setLoading(true);
      const formData = new FormData();
      formData.append('first_name',inputs.first_name);
      formData.append('last_name',inputs.last_name);
      formData.append('gender',inputs.gender);
      formData.append('email',inputs.email);
      formData.append('countrycode',inputs.countrycode);
      formData.append('mobile_number',inputs.mobile_number);
      formData.append('customer_id',userAuth.customer_id);
      formData.append('token_code',userAuth.token_code);
      const response = await api({
        url: '/customers/update_profile',
        method: 'POST',
        data: formData,
      })
      
    
      if (response.status === 'TRUE') {
        toast.success(response.message);
        router.push("/uniride");

      } else if(response.status === 'FALSE'){
        toast.error(response.message);
      }else{
        toast.error('Internal Server Error');
      }
    }else {
      setErrors(validationErrors);
    } 
  };
  const handleCountryCode = (value) =>{
    
    setInputs(inputs => ({
      ...inputs,
      ['countrycode']: '+'+value,
    }));
  }
  useEffect(() => {
    getUserProfile();
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
          <ProfileBox>
            
            <ProfileHead>
              <PageTitle
                title="My"
                subtitle="Profile"
                images_icon={"../iconInRoute.png"}
              ></PageTitle>

             <ProfileBtn>
             <Button variant="contained" color="primary" onClick = {()=>{setDisabled(false)}}>
                Edit Profile
                
              </Button>
             </ProfileBtn>
            </ProfileHead>
            <ProfileImg>
              <img src="../ProfileImg.png" id="preview"/>
              <span>
                {/* <img src="../edit.png" /> */}
                <input
                          type="file"
                          name="profile_image"
                          onChange={handleInputChange}
                          disabled ={disabled}
                        />
              </span>
            </ProfileImg>
            <span className='text-danger'>{errors && errors.profile_image}</span>
            <UniqID>
              Unique ID: <span> UN227</span>
            </UniqID>

            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid lg={6} md={6} sm={12} xs={12}>
                <FormControl>
                  <span>First Name</span>
                  <CustomFormControl
                    fullWidth
                    type="text"
                    placeholder="First Name  name"
                    value={inputs.first_name || '' }
                    disabled ={disabled}
                    name="first_name"
                    onChange={handleInputChange}
                  />
                </FormControl>
                <span className='text-danger'>{errors && errors.first_name}</span>
              </Grid>
              <Grid lg={6} md={6} sm={12} xs={12}>
                <FormControl>
                  <span>Last Name</span>
                  <CustomFormControl
                    fullWidth
                    type="text"
                    placeholder="Last Name"
                    value={inputs.last_name || '' }
                    disabled ={disabled}
                    name="last_name"
                    onChange={handleInputChange}
                  />
                  <span className='text-danger'>{errors && errors.last_name}</span>
                </FormControl>
              </Grid>
              <Grid lg={6} md={6} sm={12} xs={12}>
                <FormControl>
                  <span>Email</span>
                  <CustomFormControl
                    fullWidth
                    type="text"
                    placeholder="Email"
                    value={inputs.email || '' }
                    disabled ={disabled}
                    name="email"
                    onChange={handleInputChange}
                  />
                  <span className='text-danger'>{errors && errors.email}</span>
                </FormControl>
              </Grid>
              <Grid lg={6} md={6} sm={12} xs={12}>
                <FormControl>
                  <span>Phone No.</span>
                  <CountrySelect onCountryCode={handleCountryCode}/>
                  <CustomFormControl
                    fullWidth
                    type="text"
                    placeholder="Phone No."
                    value={inputs.mobile_number || '' }
                    disabled ={disabled}
                    name="mobile_number"
                    onChange={handleInputChange}
                  />
                  <span className='text-danger'>{errors && errors.mobile_number}</span>
                </FormControl>
              </Grid>
              <Grid lg={6} md={6} sm={12} xs={12}>
                <Gender>
                  <FormControl>
                    <FormLabel id="demo-row-radio-buttons-group-label">
                      Gender
                    </FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      //name="row-radio-buttons-group"
                      value={inputs.gender || ''}
                      disabled ={disabled}
                      name ="gender"
                      onChange={handleInputChange}
                    >
                     
                      <FormControlLabel
                        value="0"
                        control={<Radio />}
                        label="Male"
                      />
                       <FormControlLabel
                        value="1"
                        control={<Radio />}
                        label="Female"
                      />
                     
                    </RadioGroup>
                    <span className='text-danger'>{errors && errors.gender}</span>
                  </FormControl>
                </Gender>
              </Grid>
            </Grid>
          </ProfileBox>

          <ChangePassword>
          <Button variant="" color="primary" sx={{ mt: 4 }} style={{ display: disabled ? 'block' : 'none' }}>
          Change Password
              </Button>
              <Button variant="contained" color="primary" sx={{ mt: 4 }} style={{ display: disabled ? 'none' : 'block' }}
          onClick={updateProfile}
          >
           Update
         </Button>
         <Button variant="" color="primary" sx={{ mt: 4 }}  style={{ display: disabled ? 'none' : 'block' }}
          onClick = {()=>{setDisabled(true)}}
          >
          Back
              </Button>
              
          </ChangePassword>
        
        </SmallContent>
      </Layout>
    </ThemeProvider>
  );
}

const ProfileBox = styled.div`
  ${({ theme }) => `
  border-radius: 16px 0px 16px 16px; box-shadow: 0px 0px 15px -1px rgba(0,0,0,0.10); background-color:${theme.colors.palette.white}; padding:24px;  margin-top:60px;

    @media (min-width: ${theme.breakpoints.values.md}px) {           
      flex-wrap:nowrap;
    }

    .Mui-checked{ color:${theme.colors.palette.orange}!important;}

    
  `}
`;

const ProfileHead = styled.div`
  ${({ theme }) => `
display:flex;
align-items:center;
justify-content:space-between; flex-wrap:wrap; margin-bottom:15px; 

@media (min-width: ${theme.breakpoints.values.sm}px) {           
  flex-wrap:nowrap;
  margin-bottom:0px; 
}


    
  `}
`;

const ProfileImg = styled.div`
  ${({ theme }) => `
width:130px; height:130px; position:relative; margin-bottom:20px;

img{ border-radius:100%;}

span{ position:absolute; right:7px; bottom:0px}
    
  `}
`;

const UniqID = styled.div`
  ${({ theme }) => `
  color:${theme.colors.palette.darkGrey};
span{ font-weight:700}
    
  `}
`;

const Label = styled.div`
  ${({ theme }) => `
  font-size:16px
    
  `}
`;

const FormControl = styled.div`
  ${({ theme }) => `
//  margin-bottom:6px;
//   .MuiInputBase-input{   font-size:16px; height:35px; padding:5px 10px; border-radius:6px; }
//   span{ margin-top:0px; display:block; margin-bottom:4px; color:${theme.colors.palette.darkGrey}}


  
 
    
  `}
`;

const Gender = styled.div`
  ${({ theme }) => `
.MuiButtonBase-root{
    &:hover{ background:none}
}

span{ margin-bottom:0px; display:inherit}


  
 
    
  `}
`;




const ProfileBtn = styled.div`
  ${({ theme }) => `
width:120px;
  
 
    
  `}
`;

const ChangePassword = styled.div`
  ${({ theme }) => `
  margin-left:auto; display:flex; justify-content:center; flex-wrap:wrap;

  @media (min-width: ${theme.breakpoints.values.sm}px) {           
    flex-wrap:nowrap; justify-content:end; 
     
  }

  button{ margin-left:0px; width:100%; margin-top:15px; padding:0px 18px;
  
    @media (min-width: ${theme.breakpoints.values.sm}px) {           
      margin-left:10px; margin-top:32px; width:inherit;
       
    }
  }



 
    
  `}
`;
export async function getServerSideProps(context) {
  // You can access the session and user information here.
  const session = await getSession(context);
  
  
  if (!session) {
    // Handle unauthenticated access
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {
      userAuth: session.user || null,
    },
  };
}




const Loader = styled.div`
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



// const Loader = styled.div`
//   ${({ theme }) => `
//   position: relative; width: 100px; height: 100px; margin:0px auto; position:fixed; left:0px; right:0px; top:50vh; z-index:999; background-color:#fff; background-image: url(../logo.jpg); background-repeat: no-repeat; border-radius:100%;
//   background-position: center;  background-size: 68%;

//   &::before{
//     content: '';
//   border-radius: 50%;
//   position: absolute;
//   inset: 0;
//   box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.3) inset;
//   }

//   &::after{
//     content: '';
//   border-radius: 50%;
//   position: absolute;
//   inset: 0;
//   box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.3) inset;
//   box-shadow: 0 2px 0 #FF3D00 inset;
//   animation: rotate 2s linear infinite; 
//   }
//   @keyframes rotate {
//     0% {  transform: rotate(0)}
//     100% { transform: rotate(360deg)}
//   }
    
  `}
`;



