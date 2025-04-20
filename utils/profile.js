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

/**
 * Fetches the user's profile details from the API
 * @param {string} token - The user's JWT token
 * @returns {Promise<Object>} The profile data
 */
export async function fetchProfileDetails(token) {
  const response = await fetch('https://uniridedev.24livehost.com/api/v2/customer/get-profile-details', {
    headers: {
      'x-login-method': 'jwt',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch profile details');
  }

  return response.json();
}

/**
 * Checks if the user's profile meets all requirements for the Uniride page
 * @param {Object} profileData - The user's profile data
 * @returns {Object} Object containing validation status and redirect URL if needed
 */
export function validateProfileRequirements(profileData) {
  if (!profileData.data.default_payment_method) {
    return {
      isValid: false,
      redirectUrl: '/add-card',
      reason: 'No default payment method'
    };
  }

  if (!profileData.data.corporate_profile_verified) {
    return {
      isValid: false,
      redirectUrl: '/corporate-verification',
      reason: 'Corporate profile not verified'
    };
  }

  return {
    isValid: true,
    redirectUrl: null,
    reason: null
  };
}

/**
 * Gets profile data from request headers
 * @param {Request} req - The Next.js request object
 * @returns {Object|null} The profile data or null if not found
 */
export function getProfileFromHeaders(req) {
  try {
    const profileData = req.headers.get('x-profile-data');
    return profileData ? JSON.parse(profileData) : null;
  } catch (error) {
    console.error('Error parsing profile data from headers:', error);
    return null;
  }
}
