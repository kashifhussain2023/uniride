export const validateCustomer = inputs => {
    const errors = {};
  
    // Check if the "email" field is empty or missing
    if (!inputs.email || inputs.email.trim() === "") {
      errors.email = "Email field is required";
    } else {
      // Validate the format of the email using a regular expression
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;
      
      if (!emailRegex.test(inputs.email)) {
        errors.email = "Invalid email format";
      }
    }

    // Check if the "password" field is empty or missing
    if (!inputs.password || inputs.password.trim() === "") {
      errors.password = "Password field is required";
    }
    // } else {
    //   const strongPass = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

    //   if (!strongPass.test(inputs.password)) {
    //     errors.password = "Strong password criteria: ex. Rab123@a";
    //   } else if (inputs.password.length < 8) {
    //     errors.password = "Is at least 8 characters long";
    //    }   
    // }
  
    // Check other fields for emptiness
    // Object.keys(inputs).forEach(input => {
    //   if (inputs[input] === "") {
    //     errors[input] = "This field is required";
    //   }
    // });
  
    return errors;
  };