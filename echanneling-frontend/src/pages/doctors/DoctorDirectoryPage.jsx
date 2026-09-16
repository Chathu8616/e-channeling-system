import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { createDoctor, searchDoctors } from '../../services/doctorService';

const emptyForm = {
  fullName: '',
  nic: '',
  email: '',
  phone: '',
  password: '',
  specialty: '',
  hospitalBranch: '',
  consultationFee: '',
};

const PAGE_COPY = {
  OPERATIONS_MANAGER: {
    title: 'Manage Doctors',
    subtitle: 'Add new doctors and view the full directory, with specialty, branch and fee.',
  },
  DOCTOR: {
    title: 'Doctors',
    subtitle: 'Browse every doctor in the system, with their specialty, branch and fee.',
  },
  PATIENT: {
    title: 'Our Doctors',
    subtitle: 'Browse all doctors available for booking, with their specialty, branch and fee.',
  },
};

function initials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function DoctorDirectoryPage() {
  const { user } = useAuth();
  const canCreate = user?.role === 'OPERATIONS_MANAGER';
  const copy = PAGE_COPY[user?.role] || PAGE_COPY.PATIENT;

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadDoctors = () => {
    setLoading(true);
    searchDoctors({})
      .then((res) => setDoctors(res.data))
      .catch(() => setError('Could not load the doctor list.'))
      .finally(() => setLoading(false));
  };

  useEffect(loadDoctors, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setSubmitting(true);
    try {
      await createDoctor(form);
      setMessage(`Dr. ${form.fullName} was added.`);
      setForm(emptyForm);
      loadDoctors();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add doctor.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <h1 className="mb-1">{copy.title}</h1>
      <p className="text-muted mb-4">{copy.subtitle}</p>

      {canCreate && (
        <div className="card p-4 mb-4">
          <h2 className="h5 mb-3">Add a new doctor</h2>
          <form className="row g-2" onSubmit={handleSubmit}>
            <div className="col-md-4">
              <label className="form-label">Full name</label>
              <input
                name="fullName"
                className="form-control"
                value={form.fullName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">NIC</label>
              <input name="nic" className="form-control" value={form.nic} onChange={handleChange} required />
            </div>
            <div className="col-md-4">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Phone</label>
              <input name="phone" className="form-control" value={form.phone} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Temporary password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={form.password}
                onChange={handleChange}
                minLength={8}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Specialty</label>
              <input
                name="specialty"
                className="form-control"
                value={form.specialty}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Hospital branch</label>
              <input
                name="hospitalBranch"
                className="form-control"
                value={form.hospitalBranch}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Consultation fee (Rs.)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                name="consultationFee"
                className="form-control"
                value={form.consultationFee}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-4 d-flex align-items-end">
              <button type="submit" className="btn btn-primary w-100 rounded-pill" disabled={submitting}>
                {submitting ? 'Adding...' : 'Add doctor'}
              </button>
            </div>
          </form>
          {message && <p className="text-success mb-0 mt-3">{message}</p>}
          {error && <p className="text-danger mb-0 mt-3">{error}</p>}
        </div>
      )}

      <h2 className="h5 mb-3">All doctors ({doctors.length})</h2>
      {loading && <p className="text-muted">Loading doctors...</p>}
      {!loading && !canCreate && error && <p className="text-danger">{error}</p>}

      <div className="row">
        {doctors.map((doctor) => (
          <div className="col-md-6 col-lg-4 mb-4" key={doctor.doctorId}>
            <div className="card h-100">
              <div className="card-body d-flex flex-column">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: 48,
                      height: 48,
                      background: 'linear-gradient(135deg, var(--brand), var(--accent))',
                      color: '#fff',
                      fontWeight: 700,
                    }}
                  >
                    {initials(doctor.fullName)}
                  </div>
                  <div>
                    <h3 className="h6 mb-0">Dr. {doctor.fullName}</h3>
                    <span className="badge badge-soft-brand">{doctor.specialty}</span>
                  </div>
                </div>
                <p className="text-muted small mb-1">📍 {doctor.hospitalBranch}</p>
                <p className="fw-semibold mb-3" style={{ color: 'var(--brand)' }}>
                  Rs. {doctor.consultationFee}
                </p>
                <Link
                  to={`/doctors/${doctor.doctorId}`}
                  className="btn btn-outline-primary btn-sm rounded-pill mt-auto"
                  style={{ width: 'fit-content' }}
                >
                  View availability
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
