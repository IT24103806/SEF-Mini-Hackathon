/**
 * Smart Waste Classification (Rule-based / keyword heuristic with AI-ready contract)
 * Analyzes description text to suggest Issue Type and Severity.
 */
export const classifyWasteText = (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Please provide text description to classify.',
    });
  }

  const lower = text.toLowerCase();

  // Issue Type Detection
  let suggestedIssueType = 'Other';
  let issueConfidence = 0.7;

  if (
    lower.includes('dump') ||
    lower.includes('dumped') ||
    lower.includes('roadside') ||
    lower.includes('canal') ||
    lower.includes('illegal') ||
    lower.includes('debris') ||
    lower.includes('land')
  ) {
    suggestedIssueType = 'Illegal Dumping';
    issueConfidence = 0.92;
  } else if (
    lower.includes('overflow') ||
    lower.includes('spill') ||
    lower.includes('bin') ||
    lower.includes('can') ||
    lower.includes('full')
  ) {
    suggestedIssueType = 'Overflowing Bin';
    issueConfidence = 0.95;
  } else if (
    lower.includes('not collected') ||
    lower.includes('missed') ||
    lower.includes('days') ||
    lower.includes('garbage') ||
    lower.includes('uncollected') ||
    lower.includes('pickup')
  ) {
    suggestedIssueType = 'Uncollected Garbage';
    issueConfidence = 0.88;
  }

  // Severity Detection
  let suggestedSeverity = 'Low';
  let severityConfidence = 0.75;

  const highSeverityKeywords = [
    'smell', 'odor', 'stink', 'rot', 'decay', 'huge', 'large', 'danger',
    'block', 'blocking', 'flood', 'drain', 'mosquito', 'dengue', 'toxic',
    'medical', 'hazard', 'severe', 'days', 'weeks'
  ];

  const mediumSeverityKeywords = [
    'moderate', 'pavement', 'street', 'plastic', 'crowded', 'corner', 'shop'
  ];

  const hasHigh = highSeverityKeywords.some((w) => lower.includes(w));
  const hasMedium = mediumSeverityKeywords.some((w) => lower.includes(w));

  if (hasHigh || suggestedIssueType === 'Illegal Dumping') {
    suggestedSeverity = 'High';
    severityConfidence = 0.9;
  } else if (hasMedium || suggestedIssueType === 'Uncollected Garbage') {
    suggestedSeverity = 'Medium';
    severityConfidence = 0.85;
  }

  res.json({
    success: true,
    data: {
      suggestedIssueType,
      suggestedSeverity,
      confidence: {
        issueType: issueConfidence,
        severity: severityConfidence,
      },
      reasoning: `Detected indicators matching ${suggestedIssueType} with ${suggestedSeverity} urgency based on environmental impact keywords.`,
    },
  });
};
