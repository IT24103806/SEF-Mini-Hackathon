/**
 * WasteReportModalForm.jsx
 * CleanLK — Waste Report Form Modal Component
 * 2-column responsive layout, live validation, and accessible controls.
 */

import { useState } from 'react';
import FormInput from '../../components/FormInput.jsx';
import Button from '../../components/Button.jsx';
import { AREAS, ISSUE_TYPES, SEVERITIES } from './constants.js';
import { validateWasteReport } from '../../utils/validation.js';

const emptyFormState = {
  fullName: '',
  area: 'Colombo',
  issueType: 'Uncollected Garbage',
  severity: 'Medium',
  description: '',
};

export default function WasteReportModalForm({
  initialData = null,
  onSubmit,
  onCancel,
  showTitle = false,
}) {
  const isEditing = Boolean(initialData && initialData.id);

  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return {
        fullName: initialData.fullName || initialData.name || '',
        area: initialData.area || 'Colombo',
        issueType: initialData.issueType || 'Uncollected Garbage',
        severity: initialData.severity || 'Medium',
        description: initialData.description || '',
      };
    }
    return emptyFormState;
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);

    if (touched[name]) {
      const validation = validateWasteReport(updated);
      setErrors((prev) => ({
        ...prev,
        [name]: validation.errors[name] || '',
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const validation = validateWasteReport(formData);
    setErrors((prev) => ({
      ...prev,
      [name]: validation.errors[name] || '',
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setTouched({
      fullName: true,
      area: true,
      issueType: true,
      severity: true,
      description: true,
    });

    const validation = validateWasteReport(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    onSubmit({
      ...(isEditing ? { id: initialData.id } : {}),
      fullName: formData.fullName.trim(),
      area: formData.area.trim(),
      issueType: formData.issueType.trim(),
      severity: formData.severity.trim(),
      description: formData.description.trim(),
    });

    if (!isEditing) {
      setFormData(emptyFormState);
      setErrors({});
      setTouched({});
    }
  };

  return (
    <form className="wr-form" onSubmit={handleSubmit} noValidate>
      {showTitle && (
        <div style={{ marginBottom: '16px', borderBottom: '1px solid #e5e7eb', paddingBottom: '10px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', margin: 0 }}>
            {isEditing ? '✏️ Update Waste Incident Report' : '➕ Report a Waste Issue'}
          </h3>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: '4px 0 0 0' }}>
            {isEditing
              ? 'Modify the incident details below.'
              : 'Submit a new waste incident report to notify municipal cleanup teams.'}
          </p>
        </div>
      )}

      {/* Row 1: Full Name & Area */}
      <div className="wr-form-row">
        <div>
          <FormInput
            label="Full Name *"
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.fullName}
            placeholder="e.g. Nimal Perera"
            required
          />
        </div>

        <div>
          <FormInput
            label="Municipal Area *"
            name="area"
            type="select"
            value={formData.area}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.area}
            options={AREAS}
            required
          />
        </div>
      </div>

      {/* Row 2: Issue Type & Severity */}
      <div className="wr-form-row">
        <div>
          <FormInput
            label="Issue Type *"
            name="issueType"
            type="select"
            value={formData.issueType}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.issueType}
            options={ISSUE_TYPES}
            required
          />
        </div>

        <div>
          <FormInput
            label="Severity Level *"
            name="severity"
            type="select"
            value={formData.severity}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.severity}
            options={SEVERITIES}
            required
          />
        </div>
      </div>

      {/* Row 3: Description */}
      <div>
        <FormInput
          label="Incident Description *"
          name="description"
          type="textarea"
          value={formData.description}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.description}
          placeholder="Describe the waste issue, exact street or landmark location, and severity details..."
          rows={4}
          required
        />
      </div>

      {/* Action Buttons */}
      <div className="wr-form-actions">
        {onCancel && (
          <Button
            variant="outline"
            onClick={onCancel}
            type="button"
          >
            Cancel
          </Button>
        )}
        <button
          type="submit"
          className="wr-submit-btn"
        >
          {isEditing ? 'Save Changes' : 'Submit Report'}
        </button>
      </div>
    </form>
  );
}
