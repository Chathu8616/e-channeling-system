import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getDoctor, getDoctorSessions } from '../../services/doctorService';

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export default function DoctorProfilePage() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState(todayIso());
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getDoctor(id).then((res) => setDoctor(res.data));
  }, [id]);

  useEffect(() => {
    if (!date) return;
    getDoctorSessions(id, date)
      .then((res) => setSessions(res.data))
      .catch(() => setError('Could not load availability.'));
  }, [id, date]);

  if (!doctor) return <div className="page-container">Loading...</div>;

  return (
    <div className="page-container">
      <h1>Dr. {doctor.fullName}</h1>
      <p className="text-muted">{doctor.specialty} &middot; {doctor.hospitalBranch}</p>
      <p className="fw-semibold">Consultation fee: Rs. {doctor.consultationFee}</p>

      <div className="mb-3" style={{ maxWidth: 240 }}>
        <label className="form-label">Choose a date</label>
        <input
          type="date"
          className="form-control"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {error && <p className="text-danger">{error}</p>}

      <h2 className="h5">Available time slots</h2>
      {sessions.length === 0 ? (
        <p>No open sessions on this date.</p>
      ) : (
        <div className="d-flex flex-wrap gap-2">
          {sessions.map((session) => (
            <Link
              key={session.sessionId}
              to={`/book/${session.sessionId}`}
              className="btn btn-outline-primary"
            >
              {session.startTime} - {session.endTime}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
