export function validateWasteReport(values) {
  const errors = {};

  if (!values.fullName || !values.fullName.trim()) {
    errors.fullName = "Please enter your name.";
  }

  if (!values.area || !values.area.trim()) {
    errors.area = "Please select an area.";
  }

  if (!values.issueType || !values.issueType.trim()) {
    errors.issueType = "Please select an issue type.";
  }

  if (!values.description || !values.description.trim()) {
    errors.description = "Please enter a description.";
  } else if (values.description.trim().length < 10) {
    errors.description = "Description must contain at least 10 characters.";
  }

  if (!values.severity || !values.severity.trim()) {
    errors.severity = "Please select a severity level.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}


export function validateCollectionSchedule(values) {
  const errors = {};

  if (!values.area || !values.area.trim()) {
    errors.area = "Please specify an area.";
  }

  if (!values.wasteType || !values.wasteType.trim()) {
    errors.wasteType = "Please select a waste category.";
  }

  if (!values.collectionDay || !values.collectionDay.trim()) {
    errors.collectionDay = "Please select a collection day.";
  }

  if (!values.collectionTime || !values.collectionTime.trim()) {
    errors.collectionTime = "Please enter the collection time.";
  }

  if (values.notes && values.notes.length > 300) {
    errors.notes = "Notes cannot exceed 300 characters.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateWasteLocation(values) {
  const errors = {};

  if (!values.name || !values.name.trim()) {
    errors.name = "Please enter the center/facility name.";
  }

  if (!values.area || !values.area.trim()) {
    errors.area = "Please select an area.";
  }

  if (!values.category || !values.category.trim()) {
    errors.category = "Please select a facility category.";
  }

  if (!values.address || !values.address.trim()) {
    errors.address = "Please enter the street address or landmark.";
  }

  if (!values.openHours || !values.openHours.trim()) {
    errors.openHours = "Please enter operational hours.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateCommunityRequest(values) {
  const errors = {};

  if (!values.name || !values.name.trim()) {
    errors.name = "Please enter your full name.";
  }

  if (!values.area || !values.area.trim()) {
    errors.area = "Please select or enter an area.";
  }

  if (!values.requestType || !values.requestType.trim()) {
    errors.requestType = "Please select a request type.";
  }

  if (!values.priority || !values.priority.trim()) {
    errors.priority = "Please select a priority level.";
  }

  if (!values.description || !values.description.trim()) {
    errors.description = "Please enter a description for your request.";
  } else if (values.description.trim().length < 10) {
    errors.description = "Description must contain at least 10 characters.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

