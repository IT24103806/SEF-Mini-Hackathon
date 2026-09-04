export const validateCommunityRequest = (formData) => {
  const errors = {};

  if (!formData.name || !formData.name.trim()) {
    errors.name = "⚠️ Please enter your full name.";
  }

  if (!formData.description || formData.description.trim().length < 10) {
    errors.description = "⚠️ Description must be at least 10 characters long.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};