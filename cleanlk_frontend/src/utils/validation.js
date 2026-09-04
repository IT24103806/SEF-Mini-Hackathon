// Validation for the Waste Report form.
// Returns an object of { fieldName: "error message" }.
// A field with no error is simply absent from the returned object.

export function validateWasteReport(values) {
  const errors = {};

  const fullName = values.fullName?.trim() || "";
  const description = values.description?.trim() || "";

  if (!fullName) {
    errors.fullName = "Please enter your name.";
  } else if (fullName.length < 2) {
    errors.fullName = "Name must contain at least 2 characters.";
  } else if (fullName.length > 80) {
    errors.fullName = "Name must contain 80 characters or fewer.";
  }

  if (!values.area) {
    errors.area = "Please select an area.";
  }

  if (!values.issueType) {
    errors.issueType = "Please select an issue type.";
  }

  if (!description) {
    errors.description = "Please enter a description.";
  } else if (description.length < 10) {
    errors.description = "Description must contain at least 10 characters.";
  } else if (description.length > 500) {
    errors.description = "Description must contain 500 characters or fewer.";
  }

  if (!values.severity) {
    errors.severity = "Please select a severity level.";
  }

  if (values.date) {
    const today = new Date().toISOString().slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(values.date)) {
      errors.date = "Please select a valid date.";
    } else if (values.date > today) {
      errors.date = "Report date cannot be in the future.";
    }
  }

  return errors;
}
