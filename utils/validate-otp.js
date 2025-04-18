export const validateOtp = inputs => {
    const errors = {};
  
    // Check if the "email" field is empty or missing
    if (!inputs.opt1 || inputs.opt1.trim() === "") {
      errors.email = "Email is required";
    } 
    if (!inputs.otp2 || inputs.otp2.trim() === "") {
        errors.email = "Email is required";
      } 
      if (!inputs.otp2 || inputs.email.trim() === "") {
        errors.email = "Email is required";
      } 
      if (!inputs.email || inputs.email.trim() === "") {
        errors.email = "Email is required";
      } 
  
    return errors;
  };