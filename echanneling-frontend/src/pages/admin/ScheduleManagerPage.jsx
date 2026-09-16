import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  blockSession,
  createSession,
  getAllDoctorSessions,
  searchDoctors,
  updateSession,
} from '../../services/doctorService';

const emptyForm = { sessionDate: new Date().toISOString().slice(0, 10), startTime: '', endTime: '' };

const STATUS_BADGE = {
  OPEN: 'badge-soft-success',
  FULL: 'badge-soft-warning',
  BLOCKED: 'badge-soft-muted',
};

export default function ScheduleManagerPage() {
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [doctorId, setDoctorId] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [blockId, setBlockId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    searchDoctors({})
      .then((res) => setDoctors(res.data))
      .catch(() => setError('Could not load the doctor list.'))
      .finally(() => setLoadingDoctors(false));
  }, []);

  const loadSessions = async (id = doctorId, date = form.sessionDate) => {
    if (!id || !date) return;
    try {
      const res = await getAllDoctorSessions(id, date);
      setSessions(res.data);
    } catch {
      setError('Could not load sessions.');
    }
  };

  useEffect(() => {
    loadSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorId, form.sessionDate]);

  const handleEditClick = (session) => {
    setEditingSessionId(session.sessionId);
    setForm({
      sessionDate: session.sessionDate,
      startTime: session.startTime,
      endTime: session.endTime,
    });
    setMessage('');
    setError('');
  };

  const cancelEdit = () => {
    setEditingSessionId(null);
    setForm({ ...emptyForm, sessionDate: form.sessionDate });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!doctorId) {
      setError('Choose a doctor first.');
      return;
    }
    try {
      if (editingSessionId) {
        await updateSession(editingSessionId, form);
        setMessage('Session updated.');
        setEditingSessionId(null);
      } else {
        await createSession(doctorId, form);
        setMessage('Session added.');
      }
      loadSessions();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save session.');
    }
  };

  const handleBlockSession = async (id) => {
    setError('');
    setMessage('');
    try {
      await blockSession(id);
      setMessage(`Session ${id} blocked.`);
      if (editingSessionId === id) cancelEdit();
      loadSessions();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not block session.');
    }
  };

  const selectedDoctor = doctors.find((d) => String(d.doctorId) === String(doctorId));

  return (
    <div className="page-container">
      <h1 className="mb-1">Manage Doctor Schedule</h1>
      <p className="text-muted mb-4">Add, update, or block a doctor's available time slots.</p>

      {!loadingDoctors && doctors.length === 0 && (
        <div className="card p-4 mb-4 text-center">
          <p className="text-muted mb-3">No doctors in the system yet.</p>
          <Link to="/doctor-directory" className="btn btn-primary rounded-pill px-4 mx-auto" style={{ width: 'fit-content' }}>
            Add a doctor
          </Link>
        </div>
      )}

      <div className="card p-4 mb-4">
        <div className="mb-3" style={{ maxWidth: 320 }}>
          <label className="form-label">Doctor</label>
          <select
            className="form-select"
            value={doctorId}
            onChange={(e) => {
              setDoctorId(e.target.value);
              cancelEdit();
            }}
          >
            <option value="">{loadingDoctors ? 'Loading doctors...' : 'Select a doctor'}</option>
            {doctors.map((d) => (
              <option key={d.doctorId} value={d.doctorId}>
                Dr. {d.fullName} — {d.specialty}
              </option>
            ))}
          </select>
          {selectedDoctor && (
            <p className="text-muted small mt-1 mb-0">
              {selectedDoctor.hospitalBranch} &middot; Rs. {selectedDoctor.consultationFee}
            </p>
          )}
        </div>

        {editingSessionId && (
          <div className="badge-soft-brand badge mb-3" style={{ width: 'fit-content' }}>
            Editing session #{editingSessionId}
          </div>
        )}

        <form className="row g-2 align-items-end" onSubmit={handleSubmit}>
          <div className="col-md-3">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-control"
              value={form.sessionDate}
              onChange={(e) => setForm({ ...form, sessionDate: e.target.value })}
              required
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Start time</label>
            <input
              type="time"
              className="form-control"
              value={form.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
              required
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">End time</label>
            <input
              type="time"
              className="form-control"
              value={form.endTime}
              onChange={(e) => setForm({ ...form, endTime: e.target.value })}
              required
            />
          </div>
          <div className="col-md-3 d-flex gap-2">
            <button type="submit" className="btn btn-primary w-100 rounded-pill" disabled={!doctorId}>
              {editingSessionId ? 'Update session' : 'Add session'}
            </button>
          </div>
          {editingSessionId && (
            <div className="col-12">
              <button type="button" className="btn btn-link btn-sm ps-0" onClick={cancelEdit}>
                Cancel edit
              </button>
            </div>
          )}
        </form>

        {message && <p className="text-success mb-0 mt-3">{message}</p>}
        {error && <p className="text-danger mb-0 mt-3">{error}</p>}
      </div>

      <h2 className="h6 text-uppercase text-muted mb-3" style={{ letterSpacing: '0.04em' }}>
        Sessions on {form.sessionDate}
      </h2>
      {doctorId && sessions.length === 0 && <p className="text-muted">No sessions for this date.</p>}
      {!doctorId && <p className="text-muted">Select a doctor to see their sessions.</p>}
      <ul className="list-group mb-4">
        {sessions.map((s) => (
          <li key={s.sessionId} className="list-group-item d-flex justify-content-between align-items-center">
            <span>
              {s.sessionDate} {s.startTime} - {s.endTime}{' '}
              <span className={`badge ${STATUS_BADGE[s.status] || 'badge-soft-muted'} ms-2`}>
                {s.status}
              </span>
            </span>
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-sm btn-outline-primary rounded-pill"
                onClick={() => handleEditClick(s)}
              >
                Edit
              </button>
              {s.status === 'OPEN' && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger rounded-pill"
                  onClick={() => handleBlockSession(s.sessionId)}
                >
                  Block
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      <div className="card p-4" style={{ maxWidth: 340 }}>
        <label className="form-label">Block a session by ID</label>
        <div className="input-group">
          <input
            type="number"
            className="form-control"
            value={blockId}
            onChange={(e) => setBlockId(e.target.value)}
          />
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={() => handleBlockSession(blockId)}
          >
            Block
          </button>
        </div>
      </div>
    </div>
  );
}
