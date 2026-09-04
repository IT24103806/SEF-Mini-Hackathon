/**
 * CommunityRequestForm.jsx
 * CleanLK — Community Request Form Modal Component
 * 2-column responsive layout, live validation, and accessible controls.
 */

import { useState, useMemo } from 'react';
import FormInput from '../../components/FormInput.jsx';
import Button from '../../components/Button.jsx';
import {
  REQUEST_TYPES,
  PRIORITIES,
  SAMPLE_AREAS,
} from '../../data/communityRequests.js';
import { validateCommunityRequest } from '../../utils/validation.js';

const emptyFormState = {
  name: '',
  area: 'Colombo',
  requestType: 'New Waste Bin',
  priority: 'Medium',
  description: '',
};

export default function CommunityRequestForm({
  initialData = null,
  onSubmit,
  onCancel,
  showTitle = false,
}) {
  const isEditing = Boolean(initialData && initialData.id);

  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return {
        name: initialData.name || '',
        area: initialData.area || 'Colombo',
        requestType: initialData.requestType || 'New Waste Bin',
        priority: initialData.priority || 'Medium',
        description: initialData.description || '',
      };
    }
    return emptyFormState;
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Smart AI Urgency Analyzer based on description keywords
  const smartAnalysis = useMemo(() => {
    const text = (formData.description || '').toLowerCase();

    if (
      text.includes('hospital') ||
      text.includes('school') ||
      text.includes('drain') ||
      text.includes('severe') ||
      text.includes('disease') ||
      text.includes('overflowing') ||
      text.includes('smell') ||
      text.includes('danger')
    ) {
      return {
        suggestedPriority: 'High',
        badgeColor: '#fee2e2',
        textColor: '#991b1b',
        borderColor: '#f87171',
        reason: '🚨 Critical health hazard or sensitive public location (school/hospital) detected.',
        sla: 'Immediate Municipal Action Required (24 Hours)',
      };
    }

    if (
      text.includes('bin') ||
      text.includes('market') ||
      text.includes('weekly') ||
      text.includes('extra') ||
      text.includes('collection')
    ) {
      return {
        suggestedPriority: 'Medium',
        badgeColor: '#fef3c7',
        textColor: '#92400e',
        borderColor: '#f6ad55',
        reason: '⚠️ Standard community service or bin collection requirement.',
        sla: 'Scheduled Pickup within 48–72 Hours',
      };
    }

    return {
      suggestedPriority: 'Low',
      badgeColor: '#e0e7ff',
      textColor: '#3730a3',
      borderColor: '#818cf8',
      reason: 'ℹ️ General community cleanup drive or non-urgent inquiry.',
      sla: 'Routine Municipal Scheduling',
    };
  }, [formData.description]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);

    if (touched[name]) {
      const validation = validateCommunityRequest(updated);
      setErrors((prev) => ({
        ...prev,
        [name]: validation.errors[name] || '',
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const validation = validateCommunityRequest(formData);
    setErrors((prev) => ({
      ...prev,
      [name]: validation.errors[name] || '',
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setTouched({
      name: true,
      area: true,
      requestType: true,
      priority: true,
      description: true,
    });

    const validation = validateCommunityRequest(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    onSubmit({
      ...(isEditing ? { id: initialData.id } : {}),
      name: formData.name.trim(),
      area: formData.area.trim(),
      requestType: formData.requestType.trim(),
      priority: formData.priority.trim(),
      description: formData.description.trim(),
    });

    if (!isEditing) {
      setFormData(emptyFormState);
      setErrors({});
      setTouched({});
    }
  };

  return (
    <form className="cr-form" onSubmit={handleSubmit} noValidate>
      {showTitle && (
        <div style={{ marginBottom: '16px', borderBottom: '1px solid #e5e7eb', paddingBottom: '10px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', margin: 0 }}>
            {isEditing ? '✏️ Edit Community Request' : '➕ Submit New Community Request'}
          </h3>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: '4px 0 0 0' }}>
            {isEditing
              ? 'Update the request details below.'
              : 'Submit a new waste bin, pickup request, or cleanup event for your community.'}
          </p>
        </div>
      )}

      {/* Row 1: Full Name & Area */}
      <div className="cr-form-row">
        <div>
          <FormInput
            label="Full Name *"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.name}
            placeholder="e.g. Dinelka Perera"
            required
          />
        </div>

        <div>
          <FormInput
            label="Area / Municipal Region *"
            name="area"
            type="select"
            value={formData.area}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.area}
            options={SAMPLE_AREAS}
            required
          />
        </div>
      </div>

      {/* Row 2: Request Type & Priority */}
      <div className="cr-form-row">
        <div>
          <FormInput
            label="Request Type *"
            name="requestType"
            type="select"
            value={formData.requestType}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.requestType}
            options={REQUEST_TYPES}
            required
          />
        </div>

        <div>
          <FormInput
            label="Priority Level *"
            name="priority"
            type="select"
            value={formData.priority}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.priority}
            options={PRIORITIES}
            required
          />
        </div>
      </div>

      {/* Row 3: Description */}
      <div>
        <FormInput
          label="Request Description *"
          name="description"
          type="textarea"
          value={formData.description}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.description}
          placeholder="Detail your request (e.g. Severe odor and overflowing bins near school premises)..."
          rows={3}
          required
        />
      </div>

      {/* Smart AI Urgency Analyzer Output */}
      {formData.description.trim().length >= 5 && (
        <div
          style={{
            background: '#f8fafc',
            border: `1px dashed ${smartAnalysis.borderColor}`,
            borderRadius: '8px',
            padding: '12px 14px',
            fontSize: '13px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontWeight: '600', color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>🤖</span> Smart AI Urgency Analyzer:
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  background: smartAnalysis.badgeColor,
                  color: smartAnalysis.textColor,
                  padding: '3px 10px',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  fontSize: '12px',
                }}
              >
                {smartAnalysis.suggestedPriority} Urgency Detected
              </span>
              {formData.priority !== smartAnalysis.suggestedPriority && (
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, priority: smartAnalysis.suggestedPriority }))}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #d1d5db',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    color: '#059669',
                  }}
                  title="Apply AI Suggested Priority"
                >
                  Apply {smartAnalysis.suggestedPriority}
                </button>
              )}
            </div>
          </div>
          <p style={{ margin: '6px 0 3px 0', color: '#475569', fontSize: '12px', lineHeight: '1.4' }}>
            {smartAnalysis.reason}
          </p>
          <p style={{ margin: 0, color: '#059669', fontSize: '11px', fontWeight: '600' }}>
            ⏱️ Expected SLA: {smartAnalysis.sla}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="cr-form-actions">
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
          className="cr-submit-btn"
        >
          {isEditing ? 'Update Request' : 'Submit Request'}
        </button>
      </div>
    </form>
  );
}

