export const validateCorporateProfile = (inputs) => {
  const errors = {};

  if (!inputs.corporate_id || String(inputs.corporate_id).trim() === "") {
    errors.corporate_id = "Corporate field is required";
  }

  if (!inputs.corporate_email || String(inputs.corporate_email).trim() === "") {
    errors.corporate_email = "Corporate Email is required";
  } else {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;
    if (!emailRegex.test(inputs.corporate_email)) {
      errors.corporate_email = "Invalid email format";
    }
  }

  if (!inputs.corporate_emp_id || String(inputs.corporate_emp_id).trim() === "") {
    errors.corporate_emp_id = "Employee Id field is required";
  }

  return errors;
};
