/**
 * CleanLK — Collection Schedule Form Component
 * Supports both Creating and Editing collection schedules with friendly client-side validation.
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
  }

  return (
    <form className="cs-form" onSubmit={handleSubmit} noValidate>
      <div className="cs-form-intro">
        <p className="cs-form-subtitle">
          {isEditing
            ? 'Update the details for this community collection schedule.'
            : 'Enter the area, waste category, and collection timing to add a new schedule.'}
        </p>
      </div>

      {/* Area with suggestions */}
      <FormInput
        label="Area / City"
        name="area"
        type="text"
        value={formData.area}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.area}
        placeholder="e.g. Kegalle, Colombo, Kandy"
        list="sri-lanka-areas-list"
        required
        helperText="Choose a common Sri Lankan area or type your local municipality."
      />
      <datalist id="sri-lanka-areas-list">
        {SAMPLE_AREAS.map((areaName) => (
          <option key={areaName} value={areaName} />
        ))}
      </datalist>

      {/* Waste Type Dropdown */}
      <FormInput
        label="Waste Type"
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

      {/* Collection Day & Time Row */}
      <div className="cs-form-row">
        <FormInput
          label="Collection Day"
          name="collectionDay"
          type="select"
          value={formData.collectionDay}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.collectionDay}
          placeholder="Select day..."
          options={COLLECTION_DAYS}
          required
          className="cs-form-col"
        />

        <div className="cs-form-col">
          <FormInput
            label="Collection Time"
            name="collectionTime"
            type="text"
            value={formData.collectionTime}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.collectionTime}
            placeholder="e.g. 8:00 AM or 2:30 PM"
            list="collection-times-list"
            required
            helperText="Morning or afternoon time"
          />
          <datalist id="collection-times-list">
            {TIME_SUGGESTIONS.map((t) => (
              <option key={t} value={t} />
            ))}
          </datalist>
        </div>
      </div>

      {/* Notes / Instructions */}
      <FormInput
        label="Collection Notes / Guidelines"
        name="notes"
        type="textarea"
        value={formData.notes}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.notes}
        placeholder="e.g. Place segregated bags by the curb before 7:30 AM. No glass items in household bins."
        rows={3}
        helperText="Optional special instructions for community residents (max 300 characters)."
      />

      {/* Form Action Buttons */}
      <div className="cs-form-actions">
        <Button
          variant="outline"
          onClick={onCancel}
          type="button"
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          type="submit"
          icon={isEditing ? '💾' : '➕'}
        >
          {isEditing ? 'Save Changes' : 'Add Collection Schedule'}
        </Button>
      </div>
    </form>
  )
}
