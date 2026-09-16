import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RequireRole({ roles, children }) {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="page-container text-center py-5">
        <h1 className="mb-3">Sign in required</h1>
        <p className="text-muted mb-4">You need to log in to view this page.</p>
        <Link to="/login" className="btn btn-primary rounded-pill px-4">
          Go to Login
        </Link>
      </div>
    );
  }

  if (!roles.includes(user.role)) {
    return (
      <div className="page-container text-center py-5">
        <h1 className="mb-3">Access restricted</h1>
        <p className="text-muted mb-4">
          This area is only available to authorized staff (operations managers and doctors).
        </p>
        <Link to="/" className="btn btn-primary rounded-pill px-4">
          Back to home
        </Link>
      </div>
    );
  }

  return children;
}
