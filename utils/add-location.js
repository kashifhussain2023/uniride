export const validateAddLocation = (inputs) => {
  const errors = {};

  // Check if the "first label" field is empty or missing
  if (!inputs.tag || inputs.tag.trim() === "") {
    errors.tag = "Label field is required";
  } else if (inputs.tag.length < 3) {
    errors.tag = "Label must be at least 3 characters";
  } else if (inputs.tag.length > 20) {
    errors.tag = "Label must be at most 20 characters";
  }

  // Check if the "email" field is empty or missing
  if (!inputs.address || inputs.address.trim() === "") {
    errors.address = "Address field is required";
  }

  return errors;
};
