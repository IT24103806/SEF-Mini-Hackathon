export default function Modal({
  open,
  isOpen,
  title,
  children,
  onClose,
  size = 'md',
}) {
  const isVisible = open ?? isOpen;
  if (!isVisible) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
  }[size] || 'max-w-xl';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
      style={{ zIndex: 9999 }}
    >
      <div
        className={`w-full ${sizeClasses} max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl transition-all my-8`}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          padding: '24px',
        }}
      >
        <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', paddingBottom: '12px', marginBottom: '16px' }}>
          {title ? (
            <h3 className="text-xl font-bold text-gray-900" style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#111827' }}>
              {title}
            </h3>
          ) : <div />}
          <button
            type="button"
            onClick={onClose}
            style={{
              background: '#f3f4f6',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '16px',
              color: '#4b5563',
              fontWeight: 'bold',
            }}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
