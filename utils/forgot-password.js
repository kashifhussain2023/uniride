export const validateForgotFields = inputs => {
  const errors = {};
  if (!inputs.mobile || inputs.mobile.trim() === '') {
    errors.mobile = 'Mobile number is required';
  } else {
    const mobileRegex = /^[0-9]{7,15}$/;
    if (!mobileRegex.test(inputs.mobile)) {
      errors.mobile = 'Invalid mobile number format';
    }
  }
  return errors;
};
