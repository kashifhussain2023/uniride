class ValidatorSingleton {
  constructor() {
    if (ValidatorSingleton.instance) {
      return ValidatorSingleton.instance;
    }
    ValidatorSingleton.instance = this;
  }
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  }
  validatePassword(password) {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters long';
    return '';
  }
  validateConfirmPassword(password, confirmPassword) {
    if (!confirmPassword) return 'Confirm password is required';
    if (password !== confirmPassword) return 'Passwords do not match';
    return '';
  }
  validateName(name, fieldName) {
    if (!name) return `${fieldName} is required`;
    if (name.length < 2) return `${fieldName} must be at least 2 characters long`;
    return '';
  }
  validateMobile(mobile) {
    const mobileRegex = /^\d{10}$/;
    if (!mobile) return 'Mobile number is required';
    if (!mobileRegex.test(mobile)) return 'Please enter a valid 10-digit mobile number';
    return '';
  }
  validateGender(gender) {
    if (!gender) return 'Gender is required';
    return '';
  }
  validateTermsCondition(termsAccepted) {
    if (!termsAccepted) return 'You must accept the terms and conditions';
    return '';
  }
  validateRegisterCustomer(data) {
    const errors = {};
    const emailError = this.validateEmail(data.email);
    if (emailError) errors.email = emailError;
    const passwordError = this.validatePassword(data.password);
    if (passwordError) errors.password = passwordError;
    const confirmPasswordError = this.validateConfirmPassword(data.password, data.cpassword);
    if (confirmPasswordError) errors.cpassword = confirmPasswordError;
    const firstNameError = this.validateName(data.first_name, 'First name');
    if (firstNameError) errors.first_name = firstNameError;
    const lastNameError = this.validateName(data.last_name, 'Last name');
    if (lastNameError) errors.last_name = lastNameError;
    const mobileError = this.validateMobile(data.mobile);
    if (mobileError) errors.mobile = mobileError;
    const termsError = this.validateTermsCondition(data.terms_condition);
    if (termsError) errors.terms_condition = termsError;
    return errors;
  }
}

// Create and freeze the instance
const validatorInstance = new ValidatorSingleton();
Object.freeze(validatorInstance);
export default validatorInstance;
