// A reusable, controlled form field.
// Supports plain text/date inputs, a textarea, and a select dropdown,
// all sharing the same label + error-message layout.

export default function FormInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  options, // for type="select" -> [{ value, label }]
  placeholder,
  rows = 4,
}) {
  const baseClasses =
    "w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 " +
    (error ? "border-red-400 bg-red-50" : "border-gray-300 bg-white");

  return (
    <div className="mb-4 text-left">
      <label
        htmlFor={name}
        className="mb-1 block text-sm font-medium text-gray-700"
      >
        {label}
      </label>

      {type === "textarea" && (
        <textarea
          id={name}
          name={name}
          rows={rows}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={baseClasses}
        />
      )}

      {type === "select" && (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className={baseClasses}
        >
          <option value="">-- Select --</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      )}

      {type !== "textarea" && type !== "select" && (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={baseClasses}
        />
      )}

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
