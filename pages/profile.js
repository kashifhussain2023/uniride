import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { setCookie } from 'nookies';
import { toast } from 'react-toastify';
import Image from 'next/image';

import styled from '@emotion/styled';

import { Button, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import CountrySelect from '@/components/common/CountrySelect';
import Layout from '@/components/common/Layout';
import PageTitle from '@/components/common/PageTitle';
import SpinnerLoader from '@/components/common/SpinnerLoader';
import SmallContent from '@/components/presentation/SmallContent';

import CustomFormControl from '@/theme/CustomFormControl';
import ThemeProvider from '@/theme/ThemeProvider';

import { api } from '@/utils/api/common';
import { validateProfileCustomer } from '@/utils/profile';

const Profile = () => {
  const router = useRouter();
  const { data: session, update: sessionUpdate } = useSession();

  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState();
  const [disabled, setDisabled] = useState(true);
  const [removeErrors, setRemoveErrors] = useState(false);
  const [inputs, setInputs] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [errors, setErrors] = useState({
    first_name: '',
    gender: '',
    image: '',
    last_name: '',
  });

  useEffect(() => {
    getUserProfile();
  }, []);

  useEffect(() => {
    if (profileData?.data) {
      setInputs({
        countrycode: profileData.data.country_code,
        email: profileData.data.email,
        first_name: profileData.data.first_name,
        gender: profileData.data.gender,
        last_name: profileData.data.last_name,
        mobile_number: profileData.data.phone,
        profile_picture: profileData.data.profile_image,
      });
    }
  }, [profileData]);

  const handleBackButton = () => {
    setDisabled(true);
    setErrors({
      first_name: '',
      gender: '',
      image: '',
      last_name: '',
    });
    getUserProfile();
  };

  const getUserProfile = async () => {
    try {
      setLoading(true);
      const response = await api({
        method: 'GET',
        url: '/customer/get-profile-details',
      });

      if (response.status === true) {
        sessionUpdate({
          user: {
            ...session?.user,
            customer_image: response.profile_picture,
            name: response.name,
          },
        });

        const data = {
          countrycode: response.data.country_code,
          email: response.data.email,
          first_name: response.data.first_name,
          gender: response.data.gender,
          last_name: response.data.last_name,
          mobile_number: response.data.phone,
          profile_picture: response.data.profile_image,
        };

        setInputs(data);
        setProfileData(response);
      } else if (response.message === 'Invalid token code') {
        toast.error('Your session has expired. Please login again.');
        await signOut({ redirect: false });
        router.push('/login');
      } else {
        toast.error(response.message || 'Failed to fetch profile details');
      }
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      toast.error('An error occurred while fetching your profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = ({ target }) => {
    if (target.type === 'file') {
      const file = target.files[0];
      if (target.files.length > 0) {
        const imageUrl = URL.createObjectURL(file);
        setProfileImage(file);
        document.getElementById('preview').src = imageUrl;
      } else {
        document.getElementById('preview').src = inputs.profile_picture || '/avatar-photo.png';
        setProfileImage(null);
      }
    } else {
      setInputs(inputs => ({
        ...inputs,
        [target.name]: target.value,
      }));
    }

    if (removeErrors) {
      let data;
      if (target.type === 'file') {
        data = {
          ...inputs,
          [target.name]: target.files[0],
        };
      } else {
        const { profile_picture, ...rest } = inputs;
        data = {
          ...rest,
          [target.name]: target.value,
        };
      }
      setErrors(validateProfileCustomer(data));
    }
  };

  const handleChangePassword = () => {
    router.push('/changePassword');
  };

  const updateProfile = async e => {
    e.preventDefault();

    const inputForValidation = {
      email: inputs.email,
      first_name: inputs.first_name,
      gender: inputs.gender,
      last_name: inputs.last_name,
      mobile_number: inputs.mobile_number,
      profile_picture: profileImage,
    };

    const validationErrors = validateProfileCustomer(inputForValidation);
    const noErrors = Object.keys(validationErrors).length === 0;

    setRemoveErrors(true);

    if (noErrors) {
      try {
        setLoading(true);
        const formData = new FormData();

        formData.append('first_name', inputs.first_name);
        formData.append('last_name', inputs.last_name);
        formData.append('name', inputs.first_name + inputs.last_name);
        formData.append('gender', inputs.gender);
        formData.append('email', inputs.email);
        formData.append('countrycode', inputs.countrycode);
        formData.append('mobile_number', inputs.mobile_number);
        formData.append('profile_image', profileImage);
        formData.append('customer_id', session?.user?.data?.customer_id);

        const response = await api({
          data: formData,
          method: 'PUT',
          url: '/customer/update-profile',
        });

        if (response.status === true && response.update_status === '1') {
          toast.success(response.message + ' Please verify your mobile number.');

          setCookie(
            null,
            'profileOtp',
            JSON.stringify({
              customer_id: session?.user?.data?.customer_id,
              mobile_number: inputs.countrycode + inputs.mobile_number,
              name: profileData.first_name + ' ' + profileData.last_name,
            }),
            {
              maxAge: 5 * 60,
              path: '/',
            }
          );

          setTimeout(() => {
            router.push('/profile-otp');
          }, 2000);
        } else if (response.status === true) {
          toast.success(response.message);
          setDisabled(true);
          getUserProfile();
        } else if (response.status === false && response.message === 'Invalid token code') {
          toast.error('Your session has expired. Please login again.');
          await signOut({ redirect: false });
          router.push('/login');
        } else {
          toast.error(response.message || 'Internal Server Error');
        }
      } catch (error) {
        console.error('Error in updateProfile:', error);
        toast.error('An error occurred while updating your profile. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const handleCountryCode = value => {
    setInputs(inputs => ({
      ...inputs,
      countrycode: '+' + value,
    }));
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
        {profileData ? (
          <SmallContent>
            <ProfileBox>
              <ProfileHead>
<<<<<<< HEAD
                <PageTitle title="My" subtitle="Profile" images_icon={'/user-profile.png'} />
=======
                <PageTitle
                  title="My"
                  subtitle="Profile"
                  images_icon={`${process.env.NEXTAUTH_URL}/user-profile.png`}
                />
>>>>>>> fa07906f6d095badebec0bb7ca38c8b84423c1be

                <ProfileBtn>
                  {disabled && (
                    <Button variant="contained" color="primary" onClick={() => setDisabled(false)}>
                      Edit Profile
                    </Button>
                  )}
                </ProfileBtn>
              </ProfileHead>

              <ProfileImg>
                <Image
                  src={
                    profileImage
                      ? URL.createObjectURL(profileImage)
                      : inputs.profile_picture || '/avatar-photo.png'
                  }
                  alt="Profile Picture"
                  width={130}
                  height={130}
                  className="rounded-full"
                  id="preview"
                  quality={90}
                  priority
                />
                <span>
                  {!disabled && (
                    <BrowseButn>
                      <Button>
                        <Image
                          src={`${process.env.NEXTAUTH_URL}/edit.png`}
                          alt="Edit profile"
                          width={22}
                          height={22}
                          priority
                        />
                      </Button>
                      <input
                        type="file"
                        name="profile_picture"
                        onChange={handleInputChange}
                        disabled={disabled}
                        accept="image/*"
                      />
                    </BrowseButn>
                  )}
                </span>
              </ProfileImg>
              <span className="text-danger">{errors?.profile_picture}</span>

              <UniqID>
                Unique ID: <span>UN227</span>
              </UniqID>

              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid lg={6} md={6} sm={12} xs={12}>
                  <FormControl>
                    <span>First Name</span>
                    <CustomFormControl
                      fullWidth
                      type="text"
                      value={inputs.first_name || ''}
                      disabled={disabled}
                      name="first_name"
                      onChange={handleInputChange}
                    />
                    <span className="text-danger">{errors?.first_name}</span>
                  </FormControl>
                </Grid>
                <Grid lg={6} md={6} sm={12} xs={12}>
                  <FormControl>
                    <span>Last Name</span>
                    <CustomFormControl
                      fullWidth
                      type="text"
                      value={inputs.last_name || ''}
                      disabled={disabled}
                      name="last_name"
                      onChange={handleInputChange}
                    />
                    <span className="text-danger">{errors?.last_name}</span>
                  </FormControl>
                </Grid>
                <Grid lg={6} md={6} sm={12} xs={12}>
                  <FormControl>
                    <span>Email</span>
                    <CustomFormControl
                      fullWidth
                      type="text"
                      value={inputs.email || ''}
                      disabled
                      name="email"
                    />
                  </FormControl>
                </Grid>
                <Grid lg={6} md={6} sm={12} xs={12}>
                  <span>Phone No.</span>
                  <CountryMobile>
                    <CountrySelect
                      onCountryCode={handleCountryCode}
                      countrycode={inputs.countrycode || ''}
                      disabled
                    />
                    <CustomFormControl
                      fullWidth
                      type="text"
                      value={inputs.mobile_number || ''}
                      disabled
                      name="mobile_number"
                      onChange={handleInputChange}
                    />
                  </CountryMobile>
                </Grid>
                <Grid lg={6} md={6} sm={12} xs={12}>
                  <Gender>
                    <FormControl>
                      <FormLabel>Gender</FormLabel>
                      <RadioGroup
                        row
                        value={inputs.gender || ''}
                        name="gender"
                        onChange={handleInputChange}
                      >
                        <FormControlLabel
                          value="0"
                          control={<Radio />}
                          label="Male"
                          disabled={disabled}
                        />
                        <FormControlLabel
                          value="1"
                          control={<Radio />}
                          label="Female"
                          disabled={disabled}
                        />
                      </RadioGroup>
                      <span className="text-danger">{errors?.gender}</span>
                    </FormControl>
                  </Gender>
                </Grid>
              </Grid>
            </ProfileBox>

            <ChangePassword>
              {disabled && (
                <Button color="primary" sx={{ mt: 4 }} onClick={handleChangePassword}>
                  Change Password
                </Button>
              )}
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 4 }}
                style={{ display: disabled ? 'none' : 'block' }}
                onClick={updateProfile}
              >
                Update
              </Button>
              <Button
                color="primary"
                sx={{ mt: 4 }}
                style={{ display: disabled ? 'none' : 'block' }}
                onClick={handleBackButton}
              >
                Back
              </Button>
            </ChangePassword>
          </SmallContent>
        ) : (
          <SpinnerLoader loading={loading} />
        )}
      </Layout>
    </ThemeProvider>
  );
};

export default Profile;
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
const ProfileImg = styled.div`
  ${() => `
    width: 130px;
    height: 130px;
    position: relative;
    margin-bottom: 20px;

    img {
      border-radius: 100%;
      width: 130px;
      height: 130px;
      object-fit: cover;
    }

    span {
      position: absolute;
      right: 7px;
      bottom: 0px;
      img {
        width: inherit;
        height: inherit;
      }
      .MuiButtonBase-root {
        padding: 0px;
        margin: 0px;
        min-width: inherit;
        position: absolute;
        top: -33px;
        right: 0px;
        &:hover {
          background-color: transparent;
        }
      }
    }
  `}
`;
const UniqID = styled.div`
  ${({ theme }) => `
    color: ${theme.colors.palette.darkGrey};
    span {
      font-weight: 700;
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
const Gender = styled.div`
  ${() => `
    .MuiButtonBase-root {
      &:hover {
        background: none;
      }
    }

    span {
      margin-bottom: 0px;
      display: inherit;
    }
  `}
`;
const ProfileBtn = styled.div`
  ${() => `
    width: 120px;
  `}
`;
const ChangePassword = styled.div`
  ${({ theme }) => `
    margin-left: auto;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;

    @media (min-width: ${theme.breakpoints.values.sm}px) {
      flex-wrap: nowrap;
      justify-content: end;
    }

    button {
      margin-left: 0px;
      width: 100%;
      margin-top: 15px;
      padding: 0px 18px;

      @media (min-width: ${theme.breakpoints.values.sm}px) {
        margin-left: 10px;
        margin-top: 32px;
        width: inherit;
      }
    }
  `}
`;
const CountryMobile = styled.div`
  ${({ theme }) => `
    display: flex;
    border-radius: 4px;
    border: 1px solid ${theme.colors.palette.grey};
    background-color: #fafafa;

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
    .MuiOutlinedInput-notchedOutline {
      border-width: 0px;
      background-color: transparent;
    }

    .MuiAutocomplete-popupIndicator {
      margin-right: -8px;
    }
  `}
`;
const BrowseButn = styled.div`
  ${() => `
    input[type=file]{ opacity: 0; position:absolute; top:-31px; width: 22px; left: -22px; }}
  `}
`;
