import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession, signOut } from "next-auth/react";
import ThemeProvider from "@/theme/ThemeProvider";
import Layout from "@/components/common/Layout";
import SmallContent from "@/components/presentation/SmallContent";
import styled from "@emotion/styled";
import PageTitle from "@/components/common/PageTitle";
import { Button, Typography } from "@mui/material";
import CustomFormControl from "@/theme/CustomFormControl";
import Grid from "@mui/material/Unstable_Grid2";
import { api } from "@/utils/api/common";
import { validateCorporateProfile } from "@/utils/corporate-profile";
import { toast } from "react-toastify";
import SpinnerLoader from "@/components/common/SpinnerLoader";

export default function CorporateProfile({ userAuth }) {

  const [loading, setLoading] = useState(true);
  const [corporateProfile, setCorporateProfile] = useState(null);
  const [corporateList, setCorporateList] = useState([]);
  const [responseError, setResponseError] = useState("");
  const [removeErrors, setRemoveErrors] = useState(false);
  const [inputs, setInputs] = useState({
    corporate_email: "",
    corporate_emp_id: "",
    corporate_id: "",
  });
  const [corporateStatus, setCorporateStatus] = useState(true);
  const router = useRouter();
  const [errors, setErrors] = useState({
    corporate_email: "",
    corporate_emp_id: "",
    corporate_id: "",
  });
  
  // Safely find the selected corporate with null checks
  const selectedCorporate = corporateList && inputs && inputs.corporate_id 
    ? corporateList.find(item => item && item.id == inputs.corporate_id) 
    : null;
  
  const corporateName = selectedCorporate?.corporate_name || "";

  useEffect(() => {
    if (corporateProfile) {
      setInputs({
        corporate_email: corporateProfile.corporate_email || "",
        corporate_emp_id: corporateProfile.corporate_emp_id || "",
        corporate_id: corporateProfile.corporate_id || "",
      });
    }
  }, [corporateProfile]);  

  const getCorporateProfile = async () => {
    try {
      if (!userAuth?.data?.customer_id || !userAuth?.data?.token_code) {
        console.error("Missing user authentication data");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("user_id", userAuth.data.customer_id);
      formData.append("token_code", userAuth.data.token_code);
      
      const response = await api({
        url: "/customer/get-corporate-profile",
        method: "GET",
        data: formData,
      });

      if (response && response.status === true && response.data) {
        setCorporateProfile(response.data);
        setInputs({
          corporate_email: response.data.corporate_email || "",
          corporate_emp_id: response.data.corporate_emp_id || "",
          corporate_id: response.data.corporate_id || "",
        });
      } else {
        console.error("Invalid response from get-corporate-profile:", response);
      }
    } catch (error) {
      console.error("Error fetching corporate profile:", error);
      toast.error("Failed to load corporate profile data");
    }
  };

  const getCorporateList = async () => {
    try {
      if (!userAuth?.data?.customer_id || !userAuth?.data?.token_code) {
        console.error("Missing user authentication data");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("customer_id", userAuth.data.customer_id);
      formData.append("token_code", userAuth.data.token_code);

      const response = await api({
        url: "/customer/get-corporate-list",
        method: "GET",
        data: formData,
      });

      if (response && response.status === true && Array.isArray(response.data)) {
        setCorporateList(response.data);
      } else if (response && response.message === "Invalid token code") {
        await signOut({ redirect: false });
        router.push("/login");
      } else {
        console.error("Invalid response from get-corporate-list:", response);
        setCorporateStatus(false);
      }
    } catch (error) {
      console.error("Error fetching corporate list:", error);
      toast.error("Failed to load corporate list");
      setCorporateStatus(false);
    }
  };

  // Combined data fetching in a single useEffect
  useEffect(() => {
    const fetchData = async () => {
      if (!userAuth?.data?.customer_id || !userAuth?.data?.token_code) {
        console.error("Missing user authentication data");
        setLoading(false);
        toast.error("Authentication data is missing");
        return;
      }

      setLoading(true);
      try {
        // Fetch both profile and list data in parallel
        await Promise.all([
          getCorporateProfile(),
          getCorporateList()
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = ({ target }) => {
    if (!target || !target.name) return;
    
    setInputs((prevInputs) => ({
      ...prevInputs,
      [target.name]: target.value || "",
    }));

    if (removeErrors) {
      const updatedInputs = { ...inputs, [target.name]: target.value || "" };
      setErrors({
        ...validateCorporateProfile(updatedInputs),
      });
    }
  };

  const updateCorporateProfile = async (e) => {
    if (e) e.preventDefault();
    
    setResponseError("");
    
    // Validate required fields
    if (!inputs.corporate_email || !inputs.corporate_emp_id || !inputs.corporate_id) {
      toast.error("Please fill in all required fields");
      return;
    }

    let inputForValidation = {
      corporate_email: inputs.corporate_email || "",
      corporate_emp_id: inputs.corporate_emp_id || "",
      corporate_id: inputs.corporate_id || "",
    };

    const validationErrors = validateCorporateProfile(inputForValidation);
    const noErrors = Object.keys(validationErrors).length === 0;
    setRemoveErrors(true);

    if (noErrors) {
      if (corporateStatus === false) {
        toast.error("Please select corporate");
        return;
      }
      
      try {
        setLoading(true);
        
        const requestBody = {
          email: inputs.corporate_email || "",
          eomployee_id: inputs.corporate_emp_id || "",
          corporate_id: inputs.corporate_id || "",
          corporate_name: corporateName || ""
        };

        const response = await api({
          url: "/customer/save-corporate-profile",
          method: "POST",
          data: requestBody,
        });

        if (response && response.status === true) {
          toast.success(response.message || "Corporate profile updated successfully");
          router.push("/corporate-profile");
        } else if (
          response.status === false &&
          response.message === "Invalid token code"
        ) {
          setLoading(false);
          toast.error(
            "Your account has been logged in on another device.Please login again to continue."
          );
          await signOut({ redirect: false });
          router.push("/login");
        } else if (response.status === false && response.errors != "") {
          setLoading(false);
          const valuesArray = Object.values(response.errors);
          const firstValue = valuesArray[0] || "Unknown error occurred";
          toast.error(firstValue);
        } else {
          toast.error(response?.message || "Internal Server Error");
        }
      } catch (error) {
        console.error("Error updating corporate profile:", error);
        toast.error("Failed to update corporate profile");
      } finally {
        setLoading(false);
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
        {corporateProfile && corporateList && corporateList.length > 0 ? (
          <>
            <SmallContent>
              <ProfileBox>
                <ProfileHead>
                  <PageTitle
                    title="Corporate"
                    subtitle="Profile"
                    images_icon={"../user-profile.png"}
                  ></PageTitle>
                </ProfileHead>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid lg={12} md={12} sm={12} xs={12}>
                    <FormControl>
                      <span>Corporate Email</span>
                      <CustomFormControl
                        fullWidth
                        type="text"
                        value={inputs?.corporate_email || ""}
                        name="corporate_email"
                        onChange={handleInputChange}
                      />
                    </FormControl>
                    <span className="text-danger">
                      {errors && errors.corporate_email}
                    </span>
                  </Grid>
                  <Grid lg={12} md={12} sm={12} xs={12}>
                    <FormControl>
                      <span>Employee Id</span>
                      <CustomFormControl
                        fullWidth
                        type="text"
                        value={inputs?.corporate_emp_id || ""}
                        name="corporate_emp_id"
                        onChange={handleInputChange}
                      />
                      <span className="text-danger">
                        {errors && errors.corporate_emp_id}
                      </span>
                    </FormControl>
                  </Grid>
                  <Grid lg={12} md={12} sm={12} xs={12}>
                    <FormControl>
                      <span>Corporate</span>
                      <CustomFormControl
                        as="select"
                        fullWidth
                        name="corporate_id"
                        value={inputs?.corporate_id || ""}
                        onChange={handleInputChange}
                      >
                        <option value="" disabled>
                          Select
                        </option>
                        {corporateList && corporateList.map((list) => {
                          if (!list || !list.id) return null;
                          return (
                            <option
                              key={list.id}
                              value={list.id}
                            >
                              {list.corporate_name || "Unnamed Corporate"}
                            </option>
                          );
                        })}
                      </CustomFormControl>
                      <span className="text-danger">
                        {errors && errors.corporate_id}
                      </span>
                    </FormControl>
                  </Grid>
                </Grid>
              </ProfileBox>

              <UpdateCorporate>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 4 }}
                  onClick={updateCorporateProfile}
                >
                  Update
                </Button>
              </UpdateCorporate>
            </SmallContent>
          </>
        ) : (
          <SmallContent>
            <ProfileBox>
              <ProfileHead>
                <PageTitle
                  title="Corporate"
                  subtitle="Profile"
                  images_icon={"../user-profile.png"}
                ></PageTitle>
              </ProfileHead>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <NoRecord>No records found</NoRecord>
              </Grid>
            </ProfileBox>
          </SmallContent>
        )}
      </Layout>
    </ThemeProvider>
  );
}

export async function getServerSideProps(context) {
  try {
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

    return {
      props: {
        userAuth: session?.user || null,
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
}

const ProfileBox = styled.div`
  ${({ theme }) => `
    border-radius: 16px 0px 16px 16px;
    box-shadow: 0px 0px 15px -1px rgba(0, 0, 0, 0.1);
    background-color: ${theme.colors.palette.white};
    padding: 24px;
    margin-top: 15px;

    @media (min-width: ${theme.breakpoints.values.md}px) {
      flex-wrap: nowrap;
      margin-top: 60px;
    }

    .Mui-checked {
      color: ${theme.colors.palette.orange}!important;
    }
    .text-danger {
      font-size: 13px;
      color: ${theme.colors.palette.red};
    }
  `}
`;

const ProfileHead = styled.div`
  ${({ theme }) => `
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-bottom: 15px;

    @media (min-width: ${theme.breakpoints.values.sm}px) {
      flex-wrap: nowrap;
      margin-bottom: 0px;
    }
  `}
`;

const FormControl = styled.div`
  ${({ theme }) => `
//  margin-bottom:6px;
//   .MuiInputBase-input{   font-size:16px; height:35px; padding:5px 10px; border-radius:6px; }
//   span{ margin-top:0px; display:block; margin-bottom:4px; color:${theme.colors.palette.darkGrey}}


  
 
    
  `}
`;

const UpdateCorporate = styled.div`
  ${({ theme }) => `
    margin-left: auto;
    @media (min-width: ${theme.breakpoints.values.sm}px) {
      min-width: 165px;
      text-align: right;
    }
  `}
`;
const NoRecord = styled(Typography)`
  ${({ theme }) => `
    padding-bottom: ${theme.spacing(3)};
    text-align: center;
    display: block;
    width: 100%;
    font-weight: 500;
  `}
`;
