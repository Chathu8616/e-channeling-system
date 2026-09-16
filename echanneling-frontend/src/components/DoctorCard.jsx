import { Link } from 'react-router-dom';

export default function DoctorCard({ doctor }) {
  return (
    <div className="col-md-6 col-lg-4 mb-4">
      <div className="card h-100 shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-1">Dr. {doctor.fullName}</h5>
          <p className="text-muted mb-2">{doctor.specialty}</p>
          <p className="mb-1">{doctor.hospitalBranch}</p>
          <p className="fw-semibold mb-3">Rs. {doctor.consultationFee}</p>
          <Link to={`/doctors/${doctor.doctorId}`} className="btn btn-outline-primary btn-sm rounded-pill">
            View availability
          </Link>
        </div>
      </div>
    </div>
  );
}
