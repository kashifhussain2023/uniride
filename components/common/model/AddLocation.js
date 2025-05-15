import PageTitle from '@/components/common/PageTitle';
import CustomFormControl from '@/theme/CustomFormControl';
import { validateAddLocation } from '@/utils/add-location';
import { api } from '@/utils/api/common';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import { styled } from '@mui/material/styles';
import { LoadScript, StandaloneSearchBox } from '@react-google-maps/api';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-toastify';
import SpinnerLoader from '../SpinnerLoader';
import Image from 'next/image';

const AddLocation = ({ open, handleClose, userAuth, getFavoriteList }) => {
  const router = useRouter();
  const [searchPickupBox, setSearchPickupBox] = useState(null);
  const [loactionAddress, setLoacationAddress] = useState(null);
  const [location, setLocation] = useState(null);
  const [removeErrors, setRemoveErrors] = useState(false);
  const [errors, setErrors] = useState({
    address: '',
    tag: '',
  });
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState({
    address: '',
    tag: '',
  });
  const handleInputChange = ({ target }) => {
    if (target.name === 'address') {
      setLoacationAddress('');
    }
    setInputs(inputs => ({
      ...inputs,
      [target.name]: target.value,
    }));
    if (removeErrors) {
      const data = {
        ...inputs,
        [target.name]: target.value,
      };
      setErrors({
        ...validateAddLocation({
          ...data,
        }),
      });
    }
  };
  const handleLocation = () => {
    const places = searchPickupBox.getPlaces();
    if (places.length > 0) {
      const place = places[0];
      setLoacationAddress(place.formatted_address);
      setInputs(inputs => ({
        ...inputs,
        ['address']: place.formatted_address,
      }));
      errors.address = '';
      setLocation({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    }
  };
  const handlePickupSearchBoxLoad = ref => {
    setSearchPickupBox(ref);
  };
  const handleSubmit = async e => {
    e.preventDefault();
    const inputForValidation = {
      address: loactionAddress,
      tag: inputs.tag,
    };
    const validationErrors = validateAddLocation(inputForValidation);
    const noErrors = Object.keys(validationErrors).length === 0;
    setRemoveErrors(true);
    if (noErrors) {
      setLoading(true);
      const formData = new FormData();
      formData.append('address', loactionAddress);
      formData.append('lat', location.lat);
      formData.append('long', location.lng);
      formData.append('tag', inputs.tag);
      formData.append('customer_id', userAuth.customer_id);
      formData.append('token_code', userAuth.token_code);
      const requestBody = {
        address: loactionAddress,
        lat: location.lat,
        lng: location.lng,
        name: inputs.tag,
      };
      const response = await api({
        data: requestBody,
        method: 'POST',
        url: '/customer/address/add-adddress',
      });
      if (response.status === true) {
        toast.success(response.message);
        setLoading(false);
        handleClose();
        setInputs({});
        getFavoriteList();
      } else if (response.status === false) {
        setLoading(false);
        toast.error(response.message);
        await signOut({
          redirect: false,
        });
        router.push('/login');
      } else {
        setLoading(false);
        toast.error('Internal Server Error');
      }
    } else {
      setErrors(validationErrors);
    }
  };
  return (
    <LoadScript googleMapsApiKey={process.env.GOOGLE_MAPS_API_KEY} libraries={LIBRARIES}>
      <SpinnerLoader loading={loading} />
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        fullWidth
        maxWidth="md"
      >
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            color: theme => theme.palette.grey[500],
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <LeftSection>
            <Image
              src={`${process.env.NEXTAUTH_URL}/locationImage.png`}
              alt="Location"
              width={30}
              height={30}
              className="mr-2"
            />
          </LeftSection>
          <RightSection>
            <PageTitle
              title="My"
              subtitle="Location"
              images_icon={'../AddLocationIcon.png'}
            ></PageTitle>

            <FormControl>
              <InputLabel>Address Label</InputLabel>
              <CustomFormControl
                fullWidth
                type="text"
                placeholder="Enter address label"
                value={inputs.tag || ''}
                name="tag"
                onChange={handleInputChange}
              />
              <span
                style={{
                  color: 'red',
                }}
              >
                {errors && errors.tag}
              </span>
            </FormControl>

            <FormControl>
              <InputLabel>Search Address</InputLabel>
              <StandaloneSearchBox
                onLoad={handlePickupSearchBoxLoad}
                onPlacesChanged={handleLocation}
              >
                <CustomFormControl
                  fullWidth
                  type="text"
                  placeholder="Enter address"
                  name="address"
                  onChange={handleInputChange}
                />
              </StandaloneSearchBox>
              <span
                style={{
                  color: 'red',
                }}
              >
                {errors && errors.address}
              </span>
            </FormControl>
            <Button variant="contained" fullWidth onClick={handleSubmit}>
              Save Location
            </Button>
          </RightSection>
        </DialogContent>
      </BootstrapDialog>
    </LoadScript>
  );
};
const LIBRARIES = ['places'];
export default AddLocation;
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  '& .MuiDialogContent-root': {
    alignItems: 'center',
    background: theme.colors.palette.lightGrey,
    borderRadius: 24,
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(2),
  },
  '& .MuiIconButton-root': {
    color: theme.colors.palette.black,
    fontSize: 30,
    right: 24,
    top: 25,
  },
  '& .MuiPaper-root': {
    borderRadius: 24,
    maxWidth: 750,
    padding: theme.spacing(1),
  },
  '&.MuiModal-root': {
    zIndex: 10,
  },
}));
const LeftSection = styled('div')`
  ${({ theme }) => `
    width: 50%;
    display: none;
    @media (min-width: ${theme.breakpoints.values.md}px) {
      display: block;
    }
  `}
`;
const RightSection = styled('div')`
  ${({ theme }) => `
    width: 100%;
    background-color: #fff;
    border-radius: 12px;
    padding: 20px;
    @media (min-width: ${theme.breakpoints.values.md}px) {
      width: 50%;
    }
  `}
`;
const FormControl = styled('div')`
  ${({ theme }) => `
    margin-bottom: 10px;
    .MuiInputBase-input {
      font-size: 16px;
      height: 30px;
      padding: 5px 10px;
      border-radius: 6px;
    }
    .MuiInputLabel-root {
      margin-top: 0px;
      display: block;
      margin-bottom: 5px;
      color: ${theme.colors.palette.darkGrey};
      span {
        color: ${theme.colors.palette.red};
      }
    }
  `}
`;
