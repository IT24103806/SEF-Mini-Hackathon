/**
 * CleanLK — Collection Schedule Form Component
 * Visually redesigned to match Member 1's CleanLK form architecture.
 * Full 2-column responsive layout, friendly validation, and accessible controls.
 */

import { useState } from 'react'
import FormInput from '../../components/FormInput.jsx'
import Button from '../../components/Button.jsx'
import {
  WASTE_TYPES,
  COLLECTION_DAYS,
  SAMPLE_AREAS,
} from '../../data/collectionSchedules.js'
import { validateCollectionSchedule } from '../../utils/validation.js'

const TIME_SUGGESTIONS = [
  '7:00 AM',
  '7:30 AM',
  '8:00 AM',
  '8:30 AM',
  '9:00 AM',
  '9:30 AM',
  '10:00 AM',
  '11:00 AM',
  '2:00 PM',
  '3:30 PM',
  '5:00 PM',
]

const emptyFormState = {
  area: '',
  wasteType: '',
  collectionDay: '',
  collectionTime: '',
  notes: '',
}

export default function CollectionScheduleForm({
  initialData = null,
  onSubmit,
  onCancel,
  showTitle = false,
}) {
  const isEditing = Boolean(initialData && initialData.id)

  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return {
        area: initialData.area || '',
        wasteType: initialData.wasteType || '',
        collectionDay: initialData.collectionDay || '',
        collectionTime: initialData.collectionTime || '',
        notes: initialData.notes || '',
      }
    }
    return emptyFormState
  })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  // Handle change for any input field
  const handleChange = (e) => {
    const { name, value } = e.target
    const updated = { ...formData, [name]: value }
    setFormData(updated)

    // Clear error for that field if touched
    if (touched[name]) {
      const validation = validateCollectionSchedule(updated)
      setErrors((prev) => ({
        ...prev,
        [name]: validation.errors[name] || '',
      }))
    }
  }

  // Handle blur for validation feedback
  const handleBlur = (e) => {
    const { name } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    const validation = validateCollectionSchedule(formData)
    setErrors((prev) => ({
      ...prev,
      [name]: validation.errors[name] || '',
    }))
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()

    // Mark all required fields as touched
    setTouched({
      area: true,
      wasteType: true,
      collectionDay: true,
      collectionTime: true,
      notes: true,
    })

    const validation = validateCollectionSchedule(formData)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    // Call submit callback with sanitized data
    onSubmit({
      ...(isEditing ? { id: initialData.id } : {}),
      area: formData.area.trim(),
      wasteType: formData.wasteType.trim(),
      collectionDay: formData.collectionDay.trim(),
      collectionTime: formData.collectionTime.trim(),
      notes: formData.notes.trim(),
    })

    // Reset form if creating
    if (!isEditing) {
      setFormData(emptyFormState)
      setErrors({})
      setTouched({})
    }
  }

  return (
    <form className="cs-form" onSubmit={handleSubmit} noValidate>
      {showTitle && (
        <div className="cs-form-header">
          <h3 className="cs-form-title">
            <span className="cs-form-title-plus">➕</span> Submit New Collection Schedule
          </h3>
        </div>
      )}

      {/* Row 1: Area (Left) | Waste Type (Right) */}
      <div className="cs-form-row">
        <div className="cs-form-col">
          <FormInput
            label="Area *"
            name="area"
            type="text"
            value={formData.area}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.area}
            placeholder="e.g. Colombo, Kegalle, Kandy"
            list="sri-lanka-areas-list"
            required
            helperText="Type city/town or pick from suggestions"
          />
          <datalist id="sri-lanka-areas-list">
            {SAMPLE_AREAS.map((areaName) => (
              <option key={areaName} value={areaName} />
            ))}
          </datalist>
        </div>

        <div className="cs-form-col">
          <FormInput
            label="Waste Type *"
            name="wasteType"
            type="select"
            value={formData.wasteType}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.wasteType}
            placeholder="Select a waste type..."
            options={WASTE_TYPES}
            required
          />
        </div>
      </div>

      {/* Row 2: Collection Day (Left) | Collection Time (Right) */}
      <div className="cs-form-row">
        <div className="cs-form-col">
          <FormInput
            label="Collection Day *"
            name="collectionDay"
            type="select"
            value={formData.collectionDay}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.collectionDay}
            placeholder="Select collection day..."
            options={COLLECTION_DAYS}
            required
          />
        </div>

        <div className="cs-form-col">
          <FormInput
            label="Collection Time *"
            name="collectionTime"
            type="text"
            value={formData.collectionTime}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.collectionTime}
            placeholder="e.g. 8:00 AM or 2:00 PM"
            list="collection-times-list"
            required
            helperText="Morning or afternoon pickup timing"
          />
          <datalist id="collection-times-list">
            {TIME_SUGGESTIONS.map((t) => (
              <option key={t} value={t} />
            ))}
          </datalist>
        </div>
      </div>

      {/* Row 3: Collection Notes / Description (Full width) */}
      <div className="cs-form-full-row">
        <FormInput
          label="Description / Notes"
          name="notes"
          type="textarea"
          value={formData.notes}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.notes}
          placeholder="Detail collection instructions, curb placement guidelines, or area notes..."
          rows={3}
          helperText="Optional guidelines for community residents (max 300 characters)."
        />
      </div>

      {/* Form Action Buttons */}
      <div className="cs-form-actions">
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
          className="cs-submit-btn"
        >
          {isEditing ? 'Save Changes' : 'Submit Schedule'}
        </button>
      </div>
    </form>
  )
}
