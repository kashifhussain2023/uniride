import CountrySelect from "@/components/common/CountrySelect";
import Layout from "@/components/common/Layout";
import PageTitle from "@/components/common/PageTitle";
import SpinnerLoader from "@/components/common/SpinnerLoader";
import SmallContent from "@/components/presentation/SmallContent";
import CustomFormControl from "@/theme/CustomFormControl";
import ThemeProvider from "@/theme/ThemeProvider";
import { api } from "@/utils/api/common";
import { validateEmergencyContact } from "@/utils/emergency-contact";
import styled from "@emotion/styled";
import { Button, Typography } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import { getSession, signOut } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function EmergencyContactEdit({ userAuth }) {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [contact, setContact] = useState();
  // const [countrycode, setCountryCode] = useState("+1");
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    phone: "",
    country_code: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
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
      var data = { ...inputs, [target.name]: target.value };
      setErrors({
        ...validateEmergencyContact({
          ...data,
        }),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let inputForValidation = {
      email: inputs.email,
      name: inputs.name,
      phone: inputs.phone,
    };

    const validationErrors = validateEmergencyContact(inputForValidation);
    const noErrors = Object.keys(validationErrors).length === 0;
    setRemoveErrors(true);

    if (noErrors) {
      setLoading(true);
      const formData = new FormData();
      formData.append("id", id);
      formData.append("name", inputs.name);
      formData.append("email", inputs.email);
      formData.append("phone", inputs.phone);
      formData.append("country_code", inputs.country_code);
      formData.append("token_code", userAuth?.token_code);

      const numericId = id ? parseInt(id, 10) : null;

     const requestBody = {
      id: numericId,
      name: inputs.name,
      email: inputs.email,
      phone: inputs.phone,
      country_code: inputs.country_code
    }

      const response = await api({
        url: "/customer/emergency/update",
        method: "PUT",
        data: requestBody,
      });

      if (response.status === true) {
        setLoading(false);
        toast.success(response.message);
        router.push("../emergency-contact");
      } else if (
        response.status === false) {
        setLoading(false);
        toast.error(
          "Your account has been logged in on another device.Please login again to continue."
        );
        // await signOut({ redirect: false });
        // router.push("/login");
      } else {
        setLoading(false);
        toast.error(response.message);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const handleCountryCode = (value) => {
    setInputs((inputs) => ({
      ...inputs,
      ["country_code"]: "+" + value,
    }));
  };

  const getEmergencyContactDetail = async (id) => {
    const parsedId = parseInt(id); 
    const formData = new FormData();

    formData.append("token_code", userAuth?.token_code);

    const requestBody = {
      id: id,
      name:inputs.name,
      email: inputs.email,
      phone_code: inputs.country_code,
      phone: inputs.phone
    }

    const response = await api({
      url: "/customer/emergency/list",
      method: "GET",
      data: requestBody,
    });

    if (response.status === true) {
      const allContacts = response.data.data;
      const matchedContact = allContacts.find(contact => contact.id === parsedId);

      if (matchedContact) {
        setContact(matchedContact);
        setInputs(matchedContact);
        setLoading(false);
      } else {
        router.push("/emergencyContactAdd");
      }
    } 
    else if (response.status === false) {
      setLoading(false);
      toast.error(
        "Your account has been logged in on another device.Please login again to continue."
      );
      await signOut({ redirect: false });
      router.push("/login");
    }
  };

  useEffect(() => {
    getEmergencyContactDetail(id);
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
        {contact ? (
          <>
            <SmallContent>
              <EmergencyContact>
                <LeftSection>
                  <PageTitle
                    sx={{ mb: 0 }}
                    title="Emergency"
                    subtitle="Contact"
                    images_icon={"../emergencyContact.png"}
                  ></PageTitle>
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
                      value={inputs?.name || ""}
                      onChange={handleInputChange}
                    />
                    <span className="text-danger">{errors && errors.name}</span>
                  </FormControl>
                  <FormControl>
                    <InputLabel>Email</InputLabel>
                    <CustomFormControl
                      fullWidth
                      type="text"
                      placeholder="Enter email"
                      name="email"
                      value={inputs?.email || ""}
                      onChange={handleInputChange}
                    />
                    <span className="text-danger">
                      {errors && errors.email}
                    </span>
                  </FormControl>
                  <FormControl>
                    <InputLabel>Phone Number</InputLabel>
                    <CountryMobile>
                      <CountrySelect
                        onCountryCode={handleCountryCode}
                        countrycode={inputs?.country_code || ""}
                      />
                      <CustomFormControl
                        fullWidth
                        type="text"
                        placeholder="Enter mobile"
                        name="phone"
                        value={inputs?.phone || ""}
                        onChange={handleInputChange}
                      />
                    </CountryMobile>
                    <span className="text-danger">
                      {errors && errors.phone}
                    </span>
                  </FormControl>
                  <Button
                    variant="contained"
                    onClick={(e) => handleSubmit(e, inputs.id)}
                  >
                    Update Contact
                  </Button>
                </LeftSection>
                <RightSection>
                  <ImageContainer>
                    <Image src="/contract.png" layout="fill" priority />
                  </ImageContainer>
                </RightSection>
              </EmergencyContact>
            </SmallContent>
          </>
        ) : (
          <SpinnerLoader loading={loading} />
        )} 
      </Layout>
    </ThemeProvider>
  );
}
export async function getServerSideProps(context) {
  // You can access the session and user information here.
  const session = await getSession(context);

  if (!session) {
    // Handle unauthenticated access
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  // if (session && session?.user.profile_status !== "3") {
  //   return {
  //     redirect: {
  //       destination: "/login",
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
const ImageContainer = styled.div`
  width: 437px;
  height: 466px;
  position: relative;
`;
