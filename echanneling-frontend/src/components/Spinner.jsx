export default function Spinner({ label = 'Loading...' }) {
  return (
    <div className="d-flex align-items-center gap-2 text-muted py-3">
      <span className="spinner-border spinner-border-sm spinner-brand" role="status" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
