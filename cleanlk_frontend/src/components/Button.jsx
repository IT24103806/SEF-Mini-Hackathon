/**
 * CleanLK — Reusable Button Component
 */

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  onClick,
  disabled = false,
  className = '',
  icon = null,
  ...props
}) {
  const baseClass = 'clk-btn'
  const variantClass = `clk-btn--${variant}`
  const sizeClass = `clk-btn--${size}`
  const combinedClass = [baseClass, variantClass, sizeClass, className]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type={type}
      className={combinedClass}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="clk-btn-icon">{icon}</span>}
      <span>{children}</span>
    </button>
  )
}
