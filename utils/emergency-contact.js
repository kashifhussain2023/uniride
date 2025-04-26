export const validateEmergencyContact = inputs => {
  const errors = {};

  // Check if the "first name" field is empty or missing
  if (!inputs.name || inputs.name.trim() === '') {
    errors.name = 'Name field is required';
  } else if (inputs.name.length < 3) {
    errors.name = 'Name must be at least 3 characters';
  } else if (inputs.name.length > 20) {
    errors.name = 'Name must be at most 20 characters';
  } else {
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(inputs.name)) {
      errors.name = 'Name should only contain letters';
    }
  }
  // Check if the "email" field is empty or missing
  if (!inputs.email || inputs.email.trim() === '') {
    errors.email = 'Email field is required';
  } else {
    // Validate the format of the email using a regular expression
    // const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;
    if (!emailRegex.test(inputs.email)) {
      errors.email = 'Invalid email format';
    }
  }

  // Check if the "password" field is empty or missing
  if (!inputs.phone || inputs.phone.trim() === '') {
    errors.phone = 'phone number field is required';
  } else if (!(inputs.phone.length >= 10 && inputs.phone.length <= 15)) {
    errors.phone = 'Please provide valid phone number.';
  } else {
    const phoneRegex = /^\d+$/;
    if (!phoneRegex.test(inputs.phone)) {
      errors.phone = 'phone number should contain only digits';
    }
  }
  return errors;
};
