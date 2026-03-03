/**
 * Form validation utilities
 * Provides functions to validate email, password, username, etc.
 */

export const validators = {
  email: (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  password: (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  },

  passwordStrength: (password) => {
    if (!password) return { score: 0, label: "No password", color: "#ef4444" };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[@$!%*?&]/.test(password)) score++;

    const levels = [
      { score: 0, label: "Very Weak", color: "#ef4444" },
      { score: 1, label: "Weak", color: "#f97316" },
      { score: 2, label: "Fair", color: "#eab308" },
      { score: 3, label: "Good", color: "#84cc16" },
      { score: 4, label: "Strong", color: "#22c55e" },
      { score: 5, label: "Very Strong", color: "#16a34a" },
    ];

    return levels[score];
  },

  username: (username) => {
    // 3-20 characters, alphanumeric and underscores only
    const regex = /^[a-zA-Z0-9_]{3,20}$/;
    return regex.test(username);
  },

  phoneNumber: (phone) => {
    const regex = /^[0-9]{10}$/;
    return regex.test(phone.replace(/[-\s]/g, ""));
  },

  required: (value) => {
    return value && value.trim().length > 0;
  },

  minLength: (value, min) => {
    return value && value.length >= min;
  },

  maxLength: (value, max) => {
    return value && value.length <= max;
  },

  match: (value1, value2) => {
    return value1 === value2;
  },
};

export const validateForm = (formData, rules) => {
  const errors = {};

  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = formData[field];

    for (const rule of fieldRules) {
      if (!rule.validate(value)) {
        errors[field] = rule.message;
        break;
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Common validation rules
 */
export const rules = {
  email: [
    {
      validate: (value) => validators.required(value),
      message: "Email is required",
    },
    {
      validate: (value) => validators.email(value),
      message: "Invalid email address",
    },
  ],

  password: [
    {
      validate: (value) => validators.required(value),
      message: "Password is required",
    },
    {
      validate: (value) => validators.password(value),
      message: "Password must be at least 8 characters with uppercase, lowercase, and number",
    },
  ],

  username: [
    {
      validate: (value) => validators.required(value),
      message: "Username is required",
    },
    {
      validate: (value) => validators.username(value),
      message: "Username must be 3-20 characters (alphanumeric and underscores only)",
    },
  ],

  fullName: [
    {
      validate: (value) => validators.required(value),
      message: "Full name is required",
    },
    {
      validate: (value) => validators.minLength(value, 2),
      message: "Full name must be at least 2 characters",
    },
  ],

  phoneNumber: [
    {
      validate: (value) => !value || validators.phoneNumber(value),
      message: "Invalid phone number (10 digits required)",
    },
  ],

  confirmPassword: (passwordFieldValue) => [
    {
      validate: (value) => validators.required(value),
      message: "Please confirm your password",
    },
    {
      validate: (value) => validators.match(value, passwordFieldValue),
      message: "Passwords do not match",
    },
  ],

  trainNumber: [
    {
      validate: (value) => validators.required(value),
      message: "Train number or name is required",
    },
  ],

  station: [
    {
      validate: (value) => validators.required(value),
      message: "Station is required",
    },
  ],
};
