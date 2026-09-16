import { Link } from 'react-router-dom';

function initials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function DoctorCard({ doctor }) {
  return (
    <div className="col-md-6 col-lg-4 mb-4">
      <div className="card card-hover h-100">
        <div className="card-body d-flex flex-column">
          <div className="d-flex align-items-center gap-3 mb-3">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
              style={{
                width: 52,
                height: 52,
                background: 'linear-gradient(135deg, var(--brand), var(--accent))',
                color: '#fff',
                fontWeight: 700,
              }}
            >
              {initials(doctor.fullName)}
            </div>
            <div>
              <h5 className="card-title mb-0">Dr. {doctor.fullName}</h5>
              <span className="badge badge-soft-brand">{doctor.specialty}</span>
            </div>
          </div>

          <p className="text-muted mb-3 small">📍 {doctor.hospitalBranch}</p>

          <div className="d-flex align-items-center justify-content-between mt-auto pt-2 border-top">
            <span className="fw-bold" style={{ color: 'var(--brand)' }}>
              Rs. {doctor.consultationFee}
            </span>
            <Link
              to={`/doctors/${doctor.doctorId}`}
              className="btn btn-primary btn-sm rounded-pill"
            >
              View availability
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
