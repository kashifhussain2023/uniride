/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import { styled } from '@mui/system';
import {
  Box,
  Button,
  Grid,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Select,
  InputAdornment,
  IconButton,
  TextareaAutosize,
  FormHelperText,
  Typography,
  FormControl,
  InputLabel,
  Modal,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useDropzone } from 'react-dropzone';
import { MobileDatePicker } from '@mui/x-date-pickers';
import validator from 'validator';
import {
  stepFieldsMap,
  transformErrorMessage,
  validateField,
} from '@/utils/validations/driverValidator';
import { api } from '@/utils/api/common';
import { toast } from 'react-toastify';
import axiosInstance from '@/utils/api/axiosInstance';
import Link from 'next/link';
import CountrySelect from '@/components/common/CountrySelect';
import SafeImage from '@/components/common/SafeImage';
import CopyRight from '@/components/common/CopyRight';
const steps = ['Personal Details', 'Vehicle Details', 'Insurance Details'];

const AddDriver = () => {
  //const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [countrycode, setCountryCode] = useState('+1');
  const [formValues, setFormValues] = useState({
    accept_terms: false,
    address: '',
    car_insurance_expiry_date: '',
    car_insurance_info: '',
    car_insurance_name: '',
    car_registration_expiry_date: '',
    carImage1: null,
    carImage2: null,
    carImage3: null,
    carImage4: null,
    city_id: '',
    confirm_password: '',
    county_id: '',
    dob: '',
    driver_license: null,
    email: '',
    first_name: '',
    gender: '',
    is_designated: null,
    licence_expiry_date: '',
    licence_no: null,
    middle_name: '',
    password: '',
    phone: null,
    phone_code: countrycode,
    postal_code: '',
    profile_pic: null,
    second_name: '',
    security_fee_status: null,
    ssn: '',
    state_id: '',
    status: null,
    tag: '',
    vehicle_color: '',
    vehicle_insurance: '',
    vehicle_make: '',
    vehicle_model: '',
    vehicle_no: '',
    vehicle_registration: '',
    vehicle_type: '',
    year_of_vehicle: null,
  });
  const [errors, setErrors] = useState({});
  const [states, setStates] = useState([]);
  const [counties, setCounties] = useState([]);
  const [cities, setCities] = useState([]);
  //const [fares, setFares] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCounty, setSelectedCounty] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  //const [settings, setSettings] = useState();
  //const [existingDriver, setExistingDriver] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [termsType, setTermsType] = useState('accept'); // 'accept', 'terms', 'privacy'
  const [termsContent, setTermsContent] = useState('');
  const [termsLoading, setTermsLoading] = useState(false);
  const [innerAcceptTerms, setInnerAcceptTerms] = useState(false);

  // const pageTitle = 'Driver Registration';
  // const scrumbItems = [
  //   { path: '/', title: 'Home' },
  //   { path: '/admin/drivers/active', title: 'Active' },
  //   { path: '#', title: 'Add' },
  // ];

  const handleStateChange = e => {
    const stateId = e.target.value;
    setSelectedState(stateId);
    setFormValues(prevData => ({
      ...prevData,
      state_id: stateId, // Ensure state_id is updated
    }));

    setErrors(prevErrors => ({
      ...prevErrors,
      state_id: '', // Clear the error for state_id
    }));
  };

  const handleCountryCode = value => {
    const updatedCountryCode = '+' + value;
    setCountryCode(updatedCountryCode);

    setFormValues(prev => ({
      ...prev,
      phone_code: updatedCountryCode,
    }));
  };

  const handleCountyChange = e => {
    const countyId = e.target.value;
    setSelectedCounty(countyId);
    setFormValues(prevData => ({
      ...prevData,
      county_id: countyId, // Ensure county_id is updated
    }));

    setErrors(prevErrors => ({
      ...prevErrors,
      county_id: '', // Clear the error for county_id
    }));
  };

  const handleCityChange = e => {
    setSelectedCity(e.target.value);
    setFormValues(prevData => ({
      ...prevData,
      city_id: e.target.value,
    }));

    setErrors(prevErrors => ({
      ...prevErrors,
      city_id: '',
    }));
  };

  const ImageUpload = ({ fieldKey, imagePreview, fileName }) => {
    const { getRootProps, getInputProps } = useDropzone({
      accept: {
        'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      },
      maxSize: 5 * 1024 * 1024, // 5MB
      onDrop: acceptedFiles => {
        if (acceptedFiles && acceptedFiles.length > 0) {
          const file = acceptedFiles[0];

          // Update the formValues state with the file
          setFormValues(prev => ({
            ...prev,
            [fieldKey]: file, // Store the file object directly
          }));

          // Clear any existing errors for the field
          setErrors(prev => ({ ...prev, [fieldKey]: '' }));
        }
      },
      onDropRejected: rejectedFiles => {
        const error = rejectedFiles[0].errors[0];
        if (error.code === 'file-too-large') {
          setErrors(prev => ({ ...prev, [fieldKey]: 'File size should be less than 5MB' }));
        } else if (error.code === 'file-invalid-type') {
          setErrors(prev => ({ ...prev, [fieldKey]: 'Please upload a valid image file' }));
        }
      },
    });

    return (
      <Box
        sx={{
          border: '2px dashed #ccc',
          borderRadius: 2,
          cursor: 'pointer',
          padding: 4,
          textAlign: 'center',
        }}
        {...getRootProps()}
      >
        {imagePreview ? (
          <>
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                height: '200px',
                justifyContent: 'center',
                position: 'relative',
                width: '100%',
              }}
            >
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  maxHeight: '100%',
                  maxWidth: '100%',
                  objectFit: 'contain',
                }}
              />
            </Box>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {fileName}
            </Typography>
          </>
        ) : (
          <Typography>Drag and drop or click to upload an image</Typography>
        )}
        <input {...getInputProps()} style={{ display: 'none' }} />
      </Box>
    );
  };

  const storeDateInState = (field, value) => {
    const formattedDate = value ? dayjs(value).toISOString() : null;
    setFormValues(prev => ({ ...prev, [field]: formattedDate }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const allErrors = {};
    const stepErrors = {};
    const currentStepFields = stepFieldsMap[activeStep];

    Object.entries(formValues).forEach(([field, value]) => {
      if (field !== 'password') {
        const isEmpty =
          value === null ||
          value === undefined ||
          (typeof value === 'string' && validator.isEmpty(value.trim()));

        if (isEmpty) {
          const defaultMessage = `${field.replace(/_/g, ' ')} is required`;
          allErrors[field] = transformErrorMessage(
            field,
            defaultMessage.charAt(0).toUpperCase() + defaultMessage.slice(1)
          );
        }
      }

      if (field === 'ssn' && value) {
        const ssnDigitsOnly = value.replace(/\D/g, '');
        if (!/^\d{9}$/.test(ssnDigitsOnly)) {
          allErrors.ssn = 'SSN must be a 9-digit number';
        }
      }

      if (field === 'state_id' && !value) {
        allErrors.state_id = 'State is required';
      }

      if (field === 'county_id' && !value) {
        allErrors.county_id = 'County is required';
      }

      if (field === 'email' && value && !validator.isEmail(value)) {
        allErrors.email = 'Invalid email address';
      }

      if (field === 'postal_code') {
        if (value.length > 10) {
          allErrors.postal_code = 'Postal code cannot exceed 10 digits';
        }
      }

      if (field === 'phone' && value && !validator.isMobilePhone(value)) {
        allErrors.phone = 'Invalid phone number';
      }
    });

    // Confirm password match validation
    if (formValues.password !== formValues.confirm_password) {
      allErrors.confirm_password = 'Passwords do not match';
    }

    // Only keep errors relevant to the current step
    currentStepFields.forEach(field => {
      if (allErrors[field]) {
        stepErrors[field] = allErrors[field];
      }
    });

    setErrors(stepErrors); // ⬅️ Only set errors for current step
    return { allErrors, stepErrors };
  };

  const handleSubmit = async () => {
    // Create FormData object
    const formData = new FormData();

    // Map frontend keys to backend keys
    const keyMapping = {
      driver_license: 'driver_license_image',
      profile_pic: 'profile_image',
      vehicle_insurance: 'vehicle_insurance_image',
      vehicle_registration: 'vehicle_registration_image',
    };

    // Append all fields to FormData except carImage1, carImage2, carImage3, carImage4
    Object.entries(formValues).forEach(([key, value]) => {
      if (!['carImage1', 'carImage2', 'carImage3', 'carImage4'].includes(key)) {
        const backendKey = keyMapping[key] || key; // Use mapped key if available
        if (value instanceof File) {
          // Append file fields
          formData.append(backendKey, value, value.name);
        } else if (value !== null && value !== undefined) {
          // Append other fields
          formData.append(backendKey, value.toString());
        }
      }
    });

    // Combine car images into a single field
    const carImages = ['carImage1', 'carImage2', 'carImage3', 'carImage4']
      .map(key => formValues[key])
      .filter(file => file instanceof File); // Ensure only valid files are included

    carImages.forEach(file => {
      formData.append('vehicle_type_image', file, file.name); // Append all images under the same key
    });

    try {
      // Send the API request
      const response = await axiosInstance.post('/driver/register', formData);

      if (response.data.status === true) {
        toast.success(response.data.message || 'Driver registered successfully!');
      } else {
        toast.error(response.data.message || 'Failed to register driver');
      }
    } catch (error) {
      toast.error('An error occurred while registering the driver. Please try again.');
    }
  };
  const handleNext = () => {
    const { stepErrors } = validateForm();

    if (Object.keys(stepErrors).length > 0) {
      const firstErrorField = Object.keys(stepErrors)[0];
      const el = document.querySelector(`[name="${firstErrorField}"]`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleInputChange = (field, value) => {
    setFormValues(prev => ({
      ...prev,
      [field]: value,
    }));

    const skipFields = ['middle_name', 'carImage1', 'carImage2', 'carImage3', 'carImage4'];
    if (skipFields.includes(field)) return;

    const error = validateField(field, value);
    setErrors(prevErrors => ({
      ...prevErrors,
      [field]: error,
    }));
  };

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await api({
          method: 'GET',
          url: '/driver/get-state',
        });
        if (response.status === true) {
          setStates(response.data || []);
        } else {
          console.error('Failed to fetch states:', response.message);
        }
      } catch (error) {
        console.error('Error fetching states:', error);
      }
    };

    fetchStates();
  }, []);

  useEffect(() => {
    if (!selectedState) return;

    const fetchCounties = async () => {
      try {
        const response = await api({
          method: 'GET',
          url: `/driver/get-county?state_id=${selectedState}`,
        });
        if (response.status === true) {
          setCounties(response.data || []);
        } else {
          console.error('Failed to fetch counties:', response.message);
        }
      } catch (error) {
        console.error('Error fetching counties:', error);
      }
    };

    fetchCounties();
  }, [selectedState]);

  useEffect(() => {
    if (!selectedCounty) return;

    const fetchCities = async () => {
      try {
        const response = await api({
          method: 'GET',
          url: `/driver/get-city?county_id=${selectedCounty}`,
        });

        if (response.status === true) {
          setCities(response.data || []);
        } else {
          console.error('Failed to fetch cities:', response.message);
        }
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };

    fetchCities();
  }, [selectedCounty]);

  useEffect(() => {
    const fetchVehicleTypes = async () => {
      try {
        const response = await api({
          method: 'GET',
          url: '/driver/get-car-types',
        });

        if (response.status === true) {
          setVehicleTypes(response.data || []);
        } else {
          console.error('Failed to fetch vehicle types:', response.message);
        }
      } catch (error) {
        console.error('Error fetching vehicle types:', error);
      }
    };

    fetchVehicleTypes();
  }, []);

  // useEffect(() => {
  //   const fetchSettings = async () => {
  //     const queryParams = new URLSearchParams();
  //     if (formValues.email) queryParams.append('email', formValues.email);
  //     if (formValues.phone) queryParams.append('phone', formValues.phone);
  //     const response = await fetch(`/api/v2/drivers/add?${queryParams.toString()}`);
  //     //const data = await response.json();
  //     //setExistingDriver(data.existingDriver);
  //     // const filteredSettings = data.data.filter(link => {
  //     //   return link.key === 'IOS_DRIVER_LINK' || link.key === 'ANDROID_DRIVER_LINK';
  //     // });

  //     //setSettings(filteredSettings);
  //   };

  //   fetchSettings();
  // }, []);

  useEffect(() => {
    if (termsModalOpen) {
      const fetchTerms = async () => {
        setTermsLoading(true);
        try {
          const res = await fetch(
            termsType === 'privacy'
              ? `${process.env.NEXT_PUBLIC_POLICY_API}/privacy-policy`
              : `${process.env.NEXT_PUBLIC_POLICY_API}/terms-and-conditions`
          );
          const html = await res.text();

          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          const bodyContent = doc.body.innerHTML;

          setTermsContent(bodyContent);
        } catch (err) {
          setTermsContent('<p>Failed to load content.</p>');
        }
        setTermsLoading(false);
      };

      fetchTerms();
    }
  }, [termsModalOpen, termsType]);

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(prev => !prev);
  };

  return (
    <>
      {/* <GenericHead title={pageTitle} description="Browse our selection of data." /> */}
      {/* <PageTitle title={pageTitle} items={scrumbItems} /> */}
      <SidebarTop>
        <Logo>
          <SafeImage
            src={`${process.env.NEXTAUTH_URL}/logo.jpg`}
            alt="logo"
            width={112}
            height={43}
          />
        </Logo>
      </SidebarTop>
      <LayoutBox>
        <Typography sx={{ marginBottom: '20px', textAlign: 'center' }} variant="h3">
          Driver Registration
        </Typography>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map(label => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <FormContainer>
          {activeStep === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="First Name"
                  name="first_name"
                  fullWidth
                  variant="outlined"
                  value={formValues.first_name || ''}
                  onChange={e => handleInputChange('first_name', e.target.value)}
                />
                {errors.first_name && <FormHelperText error>{errors.first_name}</FormHelperText>}
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Middle Name"
                  name="middle_name"
                  fullWidth
                  variant="outlined"
                  value={formValues.middle_name || ''}
                  onChange={e => handleInputChange('middle_name', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Last Name"
                  fullWidth
                  variant="outlined"
                  value={formValues.second_name || ''}
                  onChange={e => handleInputChange('second_name', e.target.value)}
                />
                {errors.second_name && <FormHelperText error>{errors.second_name}</FormHelperText>}
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Email"
                  type="email"
                  name="no-autofill-email"
                  autoComplete="off"
                  fullWidth
                  variant="outlined"
                  value={formValues.email || ''}
                  onChange={e => handleInputChange('email', e.target.value)}
                />
                {errors.email && <FormHelperText error>{errors.email}</FormHelperText>}
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Phone no"
                  name="phone"
                  autoComplete="off"
                  fullWidth
                  variant="outlined"
                  value={formValues.phone || ''}
                  onChange={e => handleInputChange('phone', e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CountrySelect
                          onCountryCode={handleCountryCode}
                          countrycode={countrycode}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
                {errors.phone && <FormHelperText error>{errors.phone}</FormHelperText>}
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth error={!!errors.gender}>
                  <InputLabel
                    sx={{ background: '#fff', padding: '0 12px 0 4px' }}
                    id="gender-label"
                  >
                    Gender
                  </InputLabel>
                  <Select
                    labelId="gender-label"
                    value={formValues.gender || ''}
                    onChange={e => handleInputChange('gender', e.target.value)}
                    className="customSelect"
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                  </Select>
                  {errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  name="no-autofill-password"
                  autoComplete="new-password"
                  fullWidth
                  variant="outlined"
                  value={formValues.password || ''}
                  onChange={e => handleInputChange('password', e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={togglePasswordVisibility}
                          edge="end"
                          aria-label="toggle password visibility"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {errors.password && <FormHelperText error>{errors.password}</FormHelperText>}
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirm_password"
                  autoComplete="new-password"
                  fullWidth
                  variant="outlined"
                  value={formValues.confirm_password || ''}
                  onChange={e => handleInputChange('confirm_password', e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={toggleConfirmPasswordVisibility}
                          edge="end"
                          aria-label="toggle password visibility"
                        >
                          {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {errors.confirm_password && (
                  <FormHelperText error>{errors.confirm_password}</FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} sm={4}>
                <DatePicker>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <MobileDatePicker
                      fullWidth
                      label="Date of Birth"
                      name="dob"
                      maxDate={dayjs()}
                      value={formValues.dob ? dayjs(formValues.dob) : null}
                      onChange={newValue => storeDateInState('dob', newValue)}
                      renderInput={params => (
                        <TextField {...params} fullWidth error={!!errors.dob} />
                      )}
                    />
                  </LocalizationProvider>
                  {errors.dob && <FormHelperText error>{errors.dob}</FormHelperText>}
                </DatePicker>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel sx={{ background: '#fff', padding: '0 12px 0 4px' }} id="state-label">
                    State
                  </InputLabel>
                  <Select
                    label="State"
                    labelId="state-label"
                    fullWidth
                    value={selectedState || ''}
                    onChange={handleStateChange}
                    //   onChange={e => setSelectedState(e.target.value)}
                  >
                    {states?.map(options => (
                      <MenuItem key={options?.id} value={options?.id}>
                        {options?.state}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.state_id && <FormHelperText error>{errors.state_id}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel
                    sx={{ background: '#fff', padding: '0 12px 0 4px' }}
                    id="county-label"
                  >
                    County
                  </InputLabel>
                  <Select
                    label="County"
                    fullWidth
                    labelId="county-label"
                    value={selectedCounty || ''}
                    onChange={handleCountyChange}
                    //   onChange={e => setSelectedCounty(e.target.value)}
                    disabled={!selectedState}
                  >
                    {counties?.map(options => (
                      <MenuItem key={options?.id} value={options?.id}>
                        {options?.county}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.county_id && <FormHelperText error>{errors.county_id}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel sx={{ background: '#fff', padding: '0 12px 0 4px' }} id="city-label">
                    City
                  </InputLabel>
                  <Select
                    label="City"
                    fullWidth
                    value={selectedCity || ''}
                    labelId="city-label"
                    onChange={handleCityChange}
                    disabled={!selectedCounty}
                  >
                    {cities?.map(options => (
                      <MenuItem key={options?.id} value={options?.id}>
                        {options?.city}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.city_id && <FormHelperText error>{errors.city_id}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Postal Code"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formValues.postal_code || ''}
                  onChange={e => {
                    const value = e.target.value;

                    if (/^\d*$/.test(value)) {
                      handleInputChange('postal_code', value);
                    }
                  }}
                />
                {errors.postal_code && <FormHelperText error>{errors.postal_code}</FormHelperText>}
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextareaAutosize
                  minRows={3}
                  maxLength={300}
                  placeholder="Enter your Address..."
                  value={formValues.address}
                  onChange={e => handleInputChange('address', e.target.value)}
                  style={{
                    borderColor: '#ccc',
                    borderRadius: '4px',
                    fontSize: '16px',
                    padding: '8px',
                    width: '100%',
                  }}
                />
                {errors.address && <FormHelperText error>{errors.address}</FormHelperText>}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Profile Picture</Typography>
                <ImageUpload
                  fieldKey="profile_pic"
                  imagePreview={
                    formValues.profile_pic ? URL.createObjectURL(formValues.profile_pic) : null
                  }
                  fileName={formValues.profile_pic?.name}
                />
                {errors.profile_pic && <FormHelperText error>{errors.profile_pic}</FormHelperText>}
              </Grid>
            </Grid>
          )}

          {activeStep === 1 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="SSN"
                  fullWidth
                  variant="outlined"
                  value={formValues.ssn || ''}
                  onChange={e => handleInputChange('ssn', e.target.value)}
                  inputProps={{ maxLength: 9 }}
                />
                {errors.ssn && <FormHelperText error>{errors.ssn}</FormHelperText>}
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Vehicle make"
                  fullWidth
                  variant="outlined"
                  value={formValues.vehicle_make || ''}
                  onChange={e => handleInputChange('vehicle_make', e.target.value)}
                />
                {errors.vehicle_make && (
                  <FormHelperText error>{errors.vehicle_make}</FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Vehicle model"
                  fullWidth
                  variant="outlined"
                  value={formValues.vehicle_model || ''}
                  onChange={e => handleInputChange('vehicle_model', e.target.value)}
                />
                {errors.vehicle_model && (
                  <FormHelperText error>{errors.vehicle_model}</FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Vehicle color"
                  fullWidth
                  variant="outlined"
                  value={formValues.vehicle_color || ''}
                  onChange={e => handleInputChange('vehicle_color', e.target.value)}
                />
                {errors.vehicle_color && (
                  <FormHelperText error>{errors.vehicle_color}</FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Vehicle number"
                  fullWidth
                  variant="outlined"
                  value={formValues.vehicle_no || ''}
                  onChange={e => handleInputChange('vehicle_no', e.target.value)}
                />
                {errors.vehicle_no && <FormHelperText error>{errors.vehicle_no}</FormHelperText>}
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Year of vehicle"
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={formValues.year_of_vehicle || ''}
                  onChange={e => handleInputChange('year_of_vehicle', e.target.value)}
                />
                {errors.year_of_vehicle && (
                  <FormHelperText error>{errors.year_of_vehicle}</FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Vehicle tag"
                  fullWidth
                  variant="outlined"
                  value={formValues.tag || ''}
                  onChange={e => handleInputChange('tag', e.target.value)}
                />
                {errors.tag && <FormHelperText error>{errors.tag}</FormHelperText>}
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel
                    sx={{ background: '#fff', padding: '0 12px 0 4px' }}
                    id="Vehicle-label"
                  >
                    Vehicle type
                  </InputLabel>
                  <Select
                    label="Vehicle type"
                    fullWidth
                    value={formValues.vehicle_type || ''}
                    labelId="Vehicle-label"
                    onChange={e => handleInputChange('vehicle_type', e.target.value)}
                  >
                    {vehicleTypes.map(type => (
                      <MenuItem key={type.id} value={type.id}>
                        {type.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.vehicle_type && (
                    <FormHelperText error>{errors.vehicle_type}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="License number"
                  fullWidth
                  variant="outlined"
                  value={formValues.licence_no || ''}
                  onChange={e => handleInputChange('licence_no', e.target.value)}
                />
                {errors.licence_no && <FormHelperText error>{errors.licence_no}</FormHelperText>}
              </Grid>
              <Grid item xs={12} sm={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <MobileDatePicker
                    label="License expiry date"
                    value={
                      formValues.licence_expiry_date ? dayjs(formValues.licence_expiry_date) : null
                    }
                    onChange={newValue => storeDateInState('licence_expiry_date', newValue)}
                    renderInput={params => (
                      <TextField {...params} fullWidth error={!!errors.licence_expiry_date} />
                    )}
                  />
                </LocalizationProvider>
                {errors.licence_expiry_date && (
                  <FormHelperText error>{errors.licence_expiry_date}</FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Driving license document 1</Typography>
                <ImageUpload
                  fieldKey="driver_license"
                  imagePreview={
                    formValues.driver_license
                      ? URL.createObjectURL(formValues.driver_license)
                      : null
                  }
                  fileName={formValues.driver_license?.name}
                />
                {errors.driver_license && (
                  <FormHelperText error>{errors.driver_license}</FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Car image 1</Typography>
                <ImageUpload
                  fieldKey="carImage1"
                  imagePreview={
                    formValues.carImage1 ? URL.createObjectURL(formValues.carImage1) : null
                  }
                  fileName={formValues.carImage1?.name}
                />
                {errors.carImage1 && <FormHelperText error>{errors.carImage1}</FormHelperText>}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Car image 2</Typography>
                <ImageUpload
                  fieldKey="carImage2"
                  imagePreview={
                    formValues.carImage2 ? URL.createObjectURL(formValues.carImage2) : null
                  }
                  fileName={formValues.carImage2?.name}
                />
                {errors.carImage2 && <FormHelperText error>{errors.carImage2}</FormHelperText>}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Car image 3</Typography>
                <ImageUpload
                  fieldKey="carImage3"
                  imagePreview={
                    formValues.carImage3 ? URL.createObjectURL(formValues.carImage3) : null
                  }
                  fileName={formValues.carImage3?.name}
                />
                {errors.carImage3 && <FormHelperText error>{errors.carImage3}</FormHelperText>}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Car image 4</Typography>
                <ImageUpload
                  fieldKey="carImage4"
                  imagePreview={
                    formValues.carImage4 ? URL.createObjectURL(formValues.carImage4) : null
                  }
                  fileName={formValues.carImage4?.name}
                />
                {errors.carImage4 && <FormHelperText error>{errors.carImage4}</FormHelperText>}
              </Grid>
            </Grid>
          )}

          {activeStep === 2 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Car insurance name"
                  fullWidth
                  variant="outlined"
                  value={formValues.car_insurance_name || ''}
                  onChange={e => handleInputChange('car_insurance_name', e.target.value)}
                />
                {errors.car_insurance_name && (
                  <FormHelperText error>{errors.car_insurance_name}</FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Car Insurance Policy Number"
                  fullWidth
                  variant="outlined"
                  value={formValues.car_insurance_info || ''}
                  onChange={e => handleInputChange('car_insurance_info', e.target.value)}
                />
                {errors.car_insurance_info && (
                  <FormHelperText error>{errors.car_insurance_info}</FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} sm={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <MobileDatePicker
                    label="Car insurance expiry date"
                    value={
                      formValues.car_insurance_expiry_date
                        ? dayjs(formValues.car_insurance_expiry_date)
                        : null
                    }
                    onChange={newValue => storeDateInState('car_insurance_expiry_date', newValue)}
                    renderInput={params => (
                      <TextField {...params} fullWidth error={!!errors.car_insurance_expiry_date} />
                    )}
                  />
                </LocalizationProvider>
                {errors.car_insurance_expiry_date && (
                  <FormHelperText error>{errors.car_insurance_expiry_date}</FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} sm={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <MobileDatePicker
                    label="Car registration expiry date"
                    value={
                      formValues.car_registration_expiry_date
                        ? dayjs(formValues.car_registration_expiry_date)
                        : null
                    }
                    onChange={newValue =>
                      storeDateInState('car_registration_expiry_date', newValue)
                    }
                    renderInput={params => (
                      <TextField
                        {...params}
                        fullWidth
                        error={!!errors.car_registration_expiry_date}
                      />
                    )}
                  />
                </LocalizationProvider>
                {errors.car_registration_expiry_date && (
                  <FormHelperText error>{errors.car_registration_expiry_date}</FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Car registration document</Typography>
                <ImageUpload
                  fieldKey="vehicle_registration"
                  imagePreview={
                    formValues.vehicle_registration
                      ? URL.createObjectURL(formValues.vehicle_registration)
                      : null
                  }
                  fileName={formValues.vehicle_registration?.name}
                />
                {errors.vehicle_registration && (
                  <FormHelperText error>{errors.vehicle_registration}</FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Car insurance document</Typography>
                <ImageUpload
                  fieldKey="vehicle_insurance"
                  imagePreview={
                    formValues.vehicle_insurance
                      ? URL.createObjectURL(formValues.vehicle_insurance)
                      : null
                  }
                  fileName={formValues.vehicle_insurance?.name}
                />
                {errors.vehicle_insurance && (
                  <FormHelperText error>{errors.vehicle_insurance}</FormHelperText>
                )}
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!formValues.accept_terms}
                      onChange={e => {
                        if (!e.target.checked) {
                          setFormValues(prev => ({ ...prev, accept_terms: false }));
                        } else {
                          // Don't check immediately — open modal for inner confirmation
                          setTermsType('accept');
                          setTermsModalOpen(true);
                        }
                      }}
                      name="accept_terms"
                      color="primary"
                    />
                  }
                  label={
                    <span>
                      I agree to the{' '}
                      <Link
                        href="#"
                        onClick={e => {
                          e.preventDefault();
                          e.stopPropagation();
                          setTermsType('terms');
                          setTermsModalOpen(true);
                        }}
                        style={{ color: '#1976d2', textDecoration: 'underline' }}
                      >
                        Terms & Conditions
                      </Link>{' '}
                      and{' '}
                      <Link
                        href="#"
                        onClick={e => {
                          e.preventDefault();
                          e.stopPropagation();
                          setTermsType('privacy');
                          setTermsModalOpen(true);
                        }}
                        style={{ color: '#1976d2', textDecoration: 'underline' }}
                      >
                        Privacy Policy
                      </Link>
                    </span>
                  }
                />
                {errors.accept_terms && (
                  <FormHelperText error>{errors.accept_terms}</FormHelperText>
                )}
              </Grid>
              <Modal
                open={termsModalOpen}
                onClose={() => {
                  setTermsModalOpen(false);
                  setInnerAcceptTerms(false);
                }}
              >
                <Box
                  sx={{
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    left: '50%',
                    maxHeight: '80vh',
                    overflowY: 'auto',
                    p: 4,
                    position: 'absolute',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 700,
                  }}
                >
                  <Box sx={{ mb: 2 }}>
                    {termsLoading ? (
                      <Typography>Loading...</Typography>
                    ) : (
                      <div dangerouslySetInnerHTML={{ __html: termsContent }} />
                    )}
                  </Box>

                  {/* Show this only when checkbox flow triggers the modal */}
                  {termsType === 'accept' && (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={innerAcceptTerms}
                          onChange={e => setInnerAcceptTerms(e.target.checked)}
                        />
                      }
                      label="I agree to the Terms & Conditions and Privacy Policy"
                    />
                  )}

                  <Box display="flex" justifyContent="flex-end" mt={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={termsType === 'accept' && !innerAcceptTerms}
                      onClick={() => {
                        if (termsType === 'accept' && innerAcceptTerms) {
                          setFormValues(prev => ({ ...prev, accept_terms: true }));
                        }
                        setTermsModalOpen(false);
                        setInnerAcceptTerms(false);
                      }}
                    >
                      Close
                    </Button>
                  </Box>
                </Box>
              </Modal>
            </Grid>
          )}

          <Box display="flex" justifyContent="space-between" mt={3}>
            <Button disabled={activeStep === 0} onClick={handleBack} variant="contained">
              Back
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button onClick={handleSubmit} variant="contained" color="primary">
                Finish
              </Button>
            ) : (
              <Button onClick={handleNext} variant="contained" color="primary">
                Next
              </Button>
            )}
          </Box>
        </FormContainer>
      </LayoutBox>
      <CopyRight />
    </>
  );
};

export default AddDriver;

// const DragAndDropContainer = styled('div')(({ theme }) => ({
//   border: '2px dashed #ccc',
//   color: '#777',
//   cursor: 'pointer',
//   padding: theme.spacing(3),
//   textAlign: 'center',
// }));

const FormContainer = styled(Box)(({ theme }) => ({
  '.MuiInputAdornment-root': {
    '.MuiInputBase-root': {
      '.MuiAutocomplete-clearIndicator': {
        display: 'none',
      },

      '.MuiOutlinedInput-notchedOutline': {
        borderBottom: 0,
        borderLeft: 0,
        borderTop: 0,
      },

      borderRadius: 0,
      paddingRight: '22px !important',
    },

    maxWidth: '50px !important',
  },
  backgroundColor: '#fff',
  border: 'none',
  borderRadius: theme.spacing(1),
  boxShadow: theme.shadows[2],
  margin: theme.spacing(2, 0),

  padding: theme.spacing(4),
}));

const LayoutBox = styled(Box)(({ theme }) => ({
  height: 'calc(100% - 200px)',
  overflow: 'auto',
  padding: theme.spacing(3),
}));

const DatePicker = styled(Box)`
  width: 100%;

  > div {
    width: 100%;
  }
`;

const SidebarTop = styled(Box)`
  ${({ theme }) => ` 
    padding: ${theme.spacing(1, 2)};    
    border-bottom: 1px solid #f2f2f7;
    box-shadow: 0px 2px 25px 0px rgba(0, 0, 0, 0.14);
    position: fixed;
    background: #fff;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    z-index: 2;

    + div {
      margin: 0 auto;
      margin-top: 90px;
      max-width: 1000px;
    }
  `}
`;

const Logo = styled(Box)`
  ${({ theme }) => `
    width: 112px;
    position: relative;
    top: 5px;
    margin-right: ${theme.spacing(2)};
  `}
`;

// const Footer = styled(Box)`
//   ${({ theme }) => `
//     display: flex;
//     justify-content: center;
//     padding: ${theme.spacing(2)};
//     border-bottom: 1px solid #f2f2f7;
//     box-shadow: 0px 2px 25px 0px rgba(0, 0, 0, 0.14);

//   `}
// `;
