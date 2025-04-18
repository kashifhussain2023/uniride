export const validateRegisterCustomer = (inputs) => {
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

  // Check if the "email" field is empty or missing
  if (!inputs.email || inputs.email.trim() === "") {
    errors.email = "Email field is required";
  } else {
    // Validate the format of the email using a regular expression
    // const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;
    if (!emailRegex.test(inputs.email)) {
      errors.email = "Invalid email format";
    }
  }
  //Check if the "mobile" field is empty or missing

  if (!inputs.mobile || inputs.mobile.trim() === "") {
    errors.mobile = "Mobile number field is required";
  } else if (!(inputs.mobile.length >= 10 && inputs.mobile.length <= 15)) {
    errors.mobile = "Please provide valid mobile number.";
  } else {
    const mobileRegex = /^\d+$/;
    if (!mobileRegex.test(inputs.mobile)) {
      errors.mobile = "Mobile number should contain only digits";
    }
  }
  // Check if the "password" field is empty or missing
  if (!inputs.password || inputs.password.trim() === "") {
    errors.password = "Password field is required";
  } else {
    const strongPass = /^[^\s]*$/;

    if (!strongPass.test(inputs.password)) {
      errors.password = "Password is not contains spaces or empty.";
    } else if (inputs.password.length < 6) {
      errors.password = "Is at least 6 characters long";
    }
  }
  //comfirm password validation
  if (!inputs.cpassword || inputs.cpassword.trim() === "") {
    errors.cpassword = "Confirm password field is required";
  } else {
    if (inputs.password !== inputs.cpassword) {
      errors.cpassword = "Passwords do not match";
    }
  }

  if (!inputs.gender) {
    errors.gender = "Gender field is required";
  }
  //imagae validation
  if (
    inputs.profile_picture !== "" &&
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
  // Check other fields for emptiness
  // Object.keys(inputs).forEach(input => {
  //   if (inputs[input] === "") {
  //     errors[input] = "This field is required";
  //   }
  // });

  return errors;
};
