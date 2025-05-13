import validator from 'validator';
import dayjs from 'dayjs';

export const transformErrorMessage = (field, message) => {
  if (field === 'second_name') {
    return 'Last name is required';
  }

  if (['city_id', 'county_id', 'state_id'].includes(field)) {
    return message.replace(' id', '');
  }

  if (field === 'profile_pic') {
    return message.replace('pic', 'image');
  }

  return message;
};

export const validateField = (field, value) => {
  let error = '';

  if (field !== 'password') {
    const isEmpty =
      value === null ||
      value === undefined ||
      (typeof value === 'string' && validator.isEmpty(value.trim()));

    if (isEmpty) {
      const message = `${field.replace(/_/g, ' ')} is required`;
      return transformErrorMessage(field, message.charAt(0).toUpperCase() + message.slice(1));
    }
  }

  if (field === 'address' && value && value.length > 300) {
    error = 'Address cannot exceed 300 characters';
  }
  if (field === 'postal_code' && value && value.length > 10) {
    error = 'Postal code cannot exceed 10 digits';
  }

  if (field === 'email' && !validator.isEmail(value)) {
    return 'Invalid email address';
  }

  if (field === 'phone' && !validator.isMobilePhone(value)) {
    return 'Invalid phone number';
  }

  if (field === 'dob') {
    const today = dayjs().startOf('day');
    const selectedDate = dayjs(value);
    if (selectedDate.isAfter(today)) {
      return 'Date of birth cannot be in the future';
    }
  }

  return error;
};

export const stepFieldsMap = {
  0: [
    'first_name',
    'second_name',
    'email',
    'phone',
    'gender',
    'password',
    'confirm_password',
    'dob',
    'state_id',
    'county_id',
    'city_id',
    'postal_code',
    'address',
    'profile_pic',
  ],
  1: [
    'vehicle_make',
    'vehicle_model',
    'vehicle_color',
    'vehicle_no',
    'year_of_vehicle',
    'tag',
    'vehicle_type',
    'licence_no',
    'licence_expiry_date',
    'driver_license',
    'ssn',
    'carImage1',
    'carImage2',
    'carImage3',
    'carImage4',
  ],
  2: [
    'car_insurance_name',
    'car_insurance_info',
    'car_insurance_expiry_date',
    'car_registration_expiry_date',
    'vehicle_registration',
    'vehicle_insurance',
  ],
  3: ['status', 'security_fee_status', 'is_designated'],
};
