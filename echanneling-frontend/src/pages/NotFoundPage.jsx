import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="page-container text-center py-5">
      <div className="eyebrow">404</div>
      <h1 className="mb-3">Page not found</h1>
      <p className="text-muted mb-4">The page you're looking for doesn't exist or has moved.</p>
      <Link to="/" className="btn btn-primary rounded-pill px-4">
        Back to home
      </Link>
    </div>
  );
}
