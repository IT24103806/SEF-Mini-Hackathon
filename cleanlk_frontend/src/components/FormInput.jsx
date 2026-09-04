/**
 * CleanLK — Reusable FormInput Component
 * Supports text, select, textarea with clear labels and friendly inline validation feedback.
 */

export default function FormInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required = false,
  options = [],
  list,
  helperText,
  rows = 3,
  className = '',
  disabled = false,
  ...rest
}) {
  const inputId = `clk-input-${name}`
  const hasError = Boolean(error)

  return (
    <div className={`clk-form-group ${hasError ? 'has-error' : ''} ${className}`}>
      {label && (
        <label htmlFor={inputId} className="clk-form-label">
          {label}
          {required && <span className="clk-form-required" aria-hidden="true"> *</span>}
        </label>
      )}

      {type === 'select' ? (
        <select
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`clk-form-control clk-select ${hasError ? 'is-invalid' : ''}`}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${inputId}-error` : undefined}
          {...rest}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => {
            const optVal = typeof opt === 'object' ? opt.value : opt
            const optLabel = typeof opt === 'object' ? opt.label : opt
            return (
              <option key={optVal} value={optVal}>
                {optLabel}
              </option>
            )
          })}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          rows={rows}
          placeholder={placeholder}
          disabled={disabled}
          className={`clk-form-control clk-textarea ${hasError ? 'is-invalid' : ''}`}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${inputId}-error` : undefined}
          {...rest}
        />
      ) : (
        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          list={list}
          disabled={disabled}
          className={`clk-form-control clk-input ${hasError ? 'is-invalid' : ''}`}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${inputId}-error` : undefined}
          {...rest}
        />
      )}

      {error && (
        <p id={`${inputId}-error`} className="clk-form-error" role="alert">
          <span className="clk-error-icon">⚠️</span> {error}
        </p>
      )}

      {!error && helperText && (
        <p className="clk-form-helper">{helperText}</p>
      )}
    </div>
  )
}
