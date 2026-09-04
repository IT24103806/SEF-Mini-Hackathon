const ALLOWED_AREAS = ['Colombo', 'Kandy', 'Kegalle', 'Gampaha', 'Galle', 'Kurunegala'];
const ALLOWED_ISSUE_TYPES = ['Uncollected Garbage', 'Overflowing Bin', 'Illegal Dumping', 'Other'];
const ALLOWED_SEVERITIES = ['Low', 'Medium', 'High'];

export const validateReport = (req, res, next) => {
  const { fullName, area, issueType, description, severity } = req.body;
  const errors = [];

  if (!fullName || typeof fullName !== 'string' || !fullName.trim()) {
    errors.push('Please enter your full name.');
  }

  if (!area || !ALLOWED_AREAS.includes(area)) {
    errors.push(`Please select a valid area (${ALLOWED_AREAS.join(', ')}).`);
  }

  if (!issueType || !ALLOWED_ISSUE_TYPES.includes(issueType)) {
    errors.push(`Please select a valid issue type (${ALLOWED_ISSUE_TYPES.join(', ')}).`);
  }

  if (!description || typeof description !== 'string' || description.trim().length < 10) {
    errors.push('Please provide at least 10 characters describing the issue.');
  }

  if (!severity || !ALLOWED_SEVERITIES.includes(severity)) {
    errors.push(`Please select a valid severity (${ALLOWED_SEVERITIES.join(', ')}).`);
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors[0],
      errors,
    });
  }

  next();
};
