import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Spinner from '../../components/Spinner';
import { getDoctor, getDoctorSessions } from '../../services/doctorService';

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function initials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function DoctorProfilePage() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [doctorError, setDoctorError] = useState('');
  const [date, setDate] = useState(todayIso());
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setDoctorError('');
    setDoctor(null);
    getDoctor(id)
      .then((res) => setDoctor(res.data))
      .catch((err) =>
        setDoctorError(err.response?.data?.message || 'Could not load this doctor.')
      );
  }, [id]);

  useEffect(() => {
    if (!date) return;
    setLoadingSessions(true);
    getDoctorSessions(id, date)
      .then((res) => setSessions(res.data))
      .catch(() => setError('Could not load availability.'))
      .finally(() => setLoadingSessions(false));
  }, [id, date]);

  if (doctorError) {
    return (
      <div className="page-container text-center py-5">
        <h1 className="mb-3">Doctor not found</h1>
        <p className="text-danger mb-4">{doctorError}</p>
        <Link to="/doctors" className="btn btn-primary rounded-pill px-4">
          Back to doctor search
        </Link>
      </div>
    );
  }

  if (!doctor) return <div className="page-container"><Spinner label="Loading doctor profile..." /></div>;

  return (
    <div className="page-container">
      <div className="card mb-4">
        <div className="card-body d-flex align-items-center gap-4 flex-wrap">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
            style={{
              width: 88,
              height: 88,
              background: 'linear-gradient(135deg, var(--brand), var(--accent))',
              color: '#fff',
              fontWeight: 700,
              fontSize: '1.5rem',
            }}
          >
            {initials(doctor.fullName)}
          </div>
          <div>
            <h1 className="h3 mb-1">Dr. {doctor.fullName}</h1>
            <p className="text-muted mb-1">
              {doctor.specialty} &middot; {doctor.hospitalBranch}
            </p>
            <span className="fw-bold" style={{ color: 'var(--brand)' }}>
              Consultation fee: Rs. {doctor.consultationFee}
            </span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="mb-4" style={{ maxWidth: 240 }}>
            <label className="form-label">Choose a date</label>
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {error && <p className="text-danger">{error}</p>}

          <h2 className="h6 text-uppercase text-muted mb-3" style={{ letterSpacing: '0.04em' }}>
            Available time slots
          </h2>

          {loadingSessions ? (
            <Spinner label="Loading availability..." />
          ) : sessions.length === 0 ? (
            <p className="text-muted">No open sessions on this date. Try another date.</p>
          ) : (
            <div className="d-flex flex-wrap gap-2">
              {sessions.map((session) => (
                <Link
                  key={session.sessionId}
                  to={`/book/${session.sessionId}`}
                  className="btn btn-outline-primary rounded-pill"
                >
                  {session.startTime} - {session.endTime}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
