export const validateChangePassword = (inputs) => {
  const errors = {};
  // Check if the "New password" field is empty or missing
  if (!inputs.old_password || inputs.old_password.trim() === "") {
    errors.old_password = "Password field is required";
  } else {
    const strongPass = /^[^\s]*$/;

    if (!strongPass.test(inputs.old_password)) {
      errors.old_password = "Password is not contains spaces or empty.";
    } else if (inputs.old_password.length < 6) {
      errors.old_password = "Is at least 6 characters long";
    }
  }
  // Check if the "New password" field is empty or missing
  if (!inputs.new_password || inputs.new_password.trim() === "") {
    errors.new_password = "Password field is required";
  } else {
    const strongPass = /^[^\s]*$/;

    if (!strongPass.test(inputs.new_password)) {
      errors.new_password = "Password is not contains spaces or empty.";
    } else if (inputs.new_password.length < 6) {
      errors.new_password = "Is at least 6 characters long";
    } else if (inputs.old_password === inputs.new_password) {
      errors.new_password =
        "New password must be different from the old password";
    }
  }
  //comfirm password validation
  if (!inputs.confirm_password || inputs.confirm_password.trim() === "") {
    errors.confirm_password = "Confirm password field is required";
  } else {
    if (inputs.new_password !== inputs.confirm_password) {
      errors.confirm_password = "Passwords do not match";
    }
  }

  return errors;
};
