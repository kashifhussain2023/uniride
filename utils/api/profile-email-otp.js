export const validateProfileEmail = inputs => {
  const errors = {};

  // Check if the "email" field is empty or missing
  if (!inputs.email || inputs.email.trim() === '') {
    errors.email = 'Email field is required';
  } else {
    // Validate the format of the email using a regular expression
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;
    if (!emailRegex.test(inputs.email)) {
      errors.email = 'Invalid email format';
    }
  }
  return errors;
};
