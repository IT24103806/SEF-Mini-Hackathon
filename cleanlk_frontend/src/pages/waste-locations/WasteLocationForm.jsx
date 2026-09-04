/**
 * WasteLocationForm.jsx
 * CleanLK — Waste Location Form Component
 */

import { useState } from 'react';
import FormInput from '../../components/FormInput.jsx';
import Button from '../../components/Button.jsx';
import { LOCATION_CATEGORIES } from '../../data/wasteLocations.js';
import { SAMPLE_AREAS, WASTE_TYPES } from '../../data/collectionSchedules.js';
import { validateWasteLocation } from '../../utils/validation.js';

const emptyFormState = {
  name: '',
  area: 'Colombo',
  category: 'Recycling Center',
  address: '',
  contact: '',
  openHours: '',
  acceptedWaste: ['Recyclable Waste'],
  coordinates: '',
  notes: '',
};

export default function WasteLocationForm({
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
        category: initialData.category || 'Recycling Center',
        address: initialData.address || '',
        contact: initialData.contact || '',
        openHours: initialData.openHours || '',
        acceptedWaste: initialData.acceptedWaste || ['Recyclable Waste'],
        coordinates: initialData.coordinates || '',
        notes: initialData.notes || '',
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
      const validation = validateWasteLocation(updated);
      setErrors((prev) => ({
        ...prev,
        [name]: validation.errors[name] || '',
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const validation = validateWasteLocation(formData);
    setErrors((prev) => ({
      ...prev,
      [name]: validation.errors[name] || '',
    }));
  };

  const handleWasteTypeToggle = (type) => {
    setFormData((prev) => {
      const exists = prev.acceptedWaste.includes(type);
      const updated = exists
        ? prev.acceptedWaste.filter((t) => t !== type)
        : [...prev.acceptedWaste, type];
      return { ...prev, acceptedWaste: updated };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setTouched({
      name: true,
      area: true,
      category: true,
      address: true,
      openHours: true,
    });

    const validation = validateWasteLocation(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    onSubmit({
      ...(isEditing ? { id: initialData.id } : {}),
      name: formData.name.trim(),
      area: formData.area.trim(),
      category: formData.category.trim(),
      address: formData.address.trim(),
      contact: formData.contact.trim(),
      openHours: formData.openHours.trim(),
      acceptedWaste: formData.acceptedWaste,
      coordinates: formData.coordinates.trim(),
      notes: formData.notes.trim(),
    });

    if (!isEditing) {
      setFormData(emptyFormState);
      setErrors({});
      setTouched({});
    }
  };

  return (
    <form className="wl-form" onSubmit={handleSubmit} noValidate>
      {showTitle && (
        <div className="cs-form-header">
          <h3 className="cs-form-title">
            <span className="cs-form-title-plus">➕</span> Submit New Disposal Location
          </h3>
        </div>
      )}

      {/* Facility Name & Category */}
      <div className="wl-form-row">
        <FormInput
          label="Facility / Drop-off Name *"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.name}
          placeholder="e.g. Kandy Eco Recycling Center"
          required
        />

        <FormInput
          label="Category *"
          name="category"
          type="select"
          value={formData.category}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.category}
          options={LOCATION_CATEGORIES}
          required
        />
      </div>

      {/* Area & Hours */}
      <div className="wl-form-row">
        <FormInput
          label="Area / Municipality *"
          name="area"
          type="select"
          value={formData.area}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.area}
          options={SAMPLE_AREAS}
          required
        />

        <FormInput
          label="Operational Hours *"
          name="openHours"
          type="text"
          value={formData.openHours}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.openHours}
          placeholder="e.g. Mon - Sat: 8:00 AM – 5:00 PM or Open 24/7"
          required
        />
      </div>

      {/* Address & Contact */}
      <div className="wl-form-row">
        <FormInput
          label="Street Address / Landmark *"
          name="address"
          type="text"
          value={formData.address}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.address}
          placeholder="e.g. No. 45, Baseline Road, Colombo 09"
          required
        />

        <FormInput
          label="Contact Phone / Hotline"
          name="contact"
          type="text"
          value={formData.contact}
          onChange={handleChange}
          placeholder="e.g. +94 11 268 4455"
        />
      </div>

      {/* Accepted Waste Checkbox Group */}
      <div>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
          Accepted Waste Categories
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {WASTE_TYPES.map((type) => {
            const isChecked = formData.acceptedWaste.includes(type);
            return (
              <button
                key={type}
                type="button"
                onClick={() => handleWasteTypeToggle(type)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  border: isChecked ? '1px solid #059669' : '1px solid #d1d5db',
                  background: isChecked ? '#ecfdf5' : '#ffffff',
                  color: isChecked ? '#065f46' : '#4b5563',
                  cursor: 'pointer',
                }}
              >
                {isChecked ? '✓ ' : '+ '}
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* Instructions / Notes */}
      <div>
        <FormInput
          label="Guidelines / Resident Notes"
          name="notes"
          type="textarea"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Details on drop-off requirements, sorting rules, or vehicle limits..."
          rows={3}
        />
      </div>

      <div className="wl-form-actions">
        {onCancel && (
          <Button variant="outline" onClick={onCancel} type="button">
            Cancel
          </Button>
        )}
        <button type="submit" className="wl-submit-btn">
          {isEditing ? 'Save Changes' : 'Submit Location'}
        </button>
      </div>
    </form>
  );
}
