export const validateProfileCustomer = (inputs) => {
  const errors = {};
  // Check if the "first name" field is empty or missing
  if (!inputs.first_name || inputs.first_name.trim() === "") {
    errors.first_name = "First name field is required";
  } else if (inputs.first_name.length < 3) {
    errors.first_name = "First name must be at least 3 characters";
  } else if (inputs.first_name.length > 20) {
    errors.first_name = "First name must be at most 20 characters";
  } else {
    const firstNameRegex = /^[a-zA-Z ]+$/;
    if (!firstNameRegex.test(inputs.first_name)) {
      errors.first_name = "First name should only contain letters";
    }
  }
  //Check if the "last name" field is empty or missing
  if (!inputs.last_name || inputs.last_name.trim() === "") {
    errors.last_name = "Last name field is required";
  } else if (inputs.last_name.length < 3) {
    errors.last_name = "Last name must be at least 3 characters";
  } else if (inputs.last_name.length > 20) {
    errors.last_name = "Last name must be at most 20 characters";
  } else {
    const lastNameRegex = /^[a-zA-Z ]+$/;
    if (!lastNameRegex.test(inputs.last_name)) {
      errors.last_name = "Last name should only contain letters";
    }
  }

  if (!inputs.gender) {
    errors.gender = "Gender field is required";
  }

  if (
    inputs.profile_picture !== null &&
    typeof inputs.profile_picture !== "undefined"
  ) {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(inputs.profile_picture.type)) {
      errors.profile_picture =
        "Invalid file type. Please choose a valid image file (jpeg,png,gif)";
    } else {
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (inputs.profile_picture.size > maxSize) {
        errors.profile_picture =
          "File size exceeds the allowed limit. Please choose a smaller image (Max 5MB)";
      }
    }
  }

  return errors;
};
