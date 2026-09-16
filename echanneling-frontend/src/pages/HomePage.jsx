import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="page-container text-center">
      <h1 className="mb-3">Book a doctor's appointment online</h1>
      <p className="text-muted mb-4">
        Search for a doctor, pick an available time slot, and pay securely — all in one place.
      </p>
      <Link to="/doctors" className="btn btn-primary rounded-pill px-4">
        Find a Doctor
      </Link>
    </div>
  );
}
