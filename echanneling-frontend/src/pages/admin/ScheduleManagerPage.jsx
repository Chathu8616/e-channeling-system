import { useState } from 'react';
import { blockSession, createSession, getDoctorSessions } from '../../services/doctorService';

export default function ScheduleManagerPage() {
  const [doctorId, setDoctorId] = useState('');
  const [form, setForm] = useState({ sessionDate: '', startTime: '', endTime: '' });
  const [sessions, setSessions] = useState([]);
  const [blockId, setBlockId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadSessions = async () => {
    if (!doctorId || !form.sessionDate) return;
    try {
      const res = await getDoctorSessions(doctorId, form.sessionDate);
      setSessions(res.data);
    } catch {
      setError('Could not load sessions.');
    }
  };

  const handleAddSession = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await createSession(doctorId, form);
      setMessage('Session added.');
      loadSessions();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add session.');
    }
  };

  const handleBlockSession = async (id) => {
    setError('');
    setMessage('');
    try {
      await blockSession(id);
      setMessage(`Session ${id} blocked.`);
      loadSessions();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not block session.');
    }
  };

  return (
    <div className="page-container">
      <h1 className="mb-1">Manage Doctor Schedule</h1>
      <p className="text-muted mb-4">Add or block a doctor's available time slots.</p>

      <div className="card p-4 mb-4">
        <div className="mb-3" style={{ maxWidth: 240 }}>
          <label className="form-label">Doctor ID</label>
          <input
            type="number"
            className="form-control"
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
          />
        </div>

        <form className="row g-2 align-items-end" onSubmit={handleAddSession}>
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
          <div className="col-md-3">
            <button type="submit" className="btn btn-primary w-100 rounded-pill">
              Add session
            </button>
          </div>
        </form>

        <button
          type="button"
          className="btn btn-link btn-sm ps-0 mt-2"
          style={{ width: 'fit-content' }}
          onClick={loadSessions}
        >
          Refresh sessions for this date
        </button>

        {message && <p className="text-success mb-0">{message}</p>}
        {error && <p className="text-danger mb-0">{error}</p>}
      </div>

      <ul className="list-group mb-4">
        {sessions.map((s) => (
          <li key={s.sessionId} className="list-group-item d-flex justify-content-between align-items-center">
            {s.sessionDate} {s.startTime} - {s.endTime}
            <button
              type="button"
              className="btn btn-sm btn-outline-danger rounded-pill"
              onClick={() => handleBlockSession(s.sessionId)}
            >
              Block
            </button>
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
