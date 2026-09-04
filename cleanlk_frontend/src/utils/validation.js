// Validation for the Waste Report form.
// Returns an object of { fieldName: "error message" }.
// A field with no error is simply absent from the returned object.

export function validateWasteReport(values) {
  const errors = {};

  if (!values.fullName || !values.fullName.trim()) {
    errors.fullName = "Please enter your name.";
  }

  if (!values.area) {
    errors.area = "Please select an area.";
  }

  if (!values.issueType) {
    errors.issueType = "Please select an issue type.";
  }

  if (!values.description || !values.description.trim()) {
    errors.description = "Please enter a description.";
  } else if (values.description.trim().length < 10) {
    errors.description = "Description must contain at least 10 characters.";
  }

  if (!values.severity) {
    errors.severity = "Please select a severity level.";
  }

  return errors;
}
