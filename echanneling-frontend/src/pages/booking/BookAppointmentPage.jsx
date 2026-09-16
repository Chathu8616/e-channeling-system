import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { bookAppointment } from '../../services/appointmentService';

export default function BookAppointmentPage() {
  const { sessionId } = useParams();
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async () => {
    setError('');
    setSubmitting(true);
    try {
      const res = await bookAppointment(Number(sessionId));
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not book this appointment.');
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="page-container text-center">
        <div className="form-narrow card p-4">
          <div
            className="icon-circle mx-auto"
            style={{ background: 'rgba(20,184,166,0.15)', color: 'var(--accent-dark)', fontSize: '1.5rem' }}
          >
            ✓
          </div>
          <h1 className="h3 mb-2">Appointment confirmed</h1>
          <p className="text-muted mb-1">
            Reference number: <strong className="text-body">{result.referenceNo}</strong>
          </p>
          <p className="mb-4">
            {result.appointmentDate} at {result.timeSlot} with Dr. {result.doctorName}
          </p>
          <Link to={`/pay/${result.appointmentId}`} className="btn btn-primary rounded-pill px-4">
            Pay now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container text-center">
      <div className="form-narrow card p-4">
        <h1 className="h3 mb-2">Confirm your appointment</h1>
        <p className="text-muted mb-4">Press confirm to reserve this time slot.</p>
        {error && <p className="text-danger">{error}</p>}
        <button
          type="button"
          className="btn btn-primary rounded-pill px-4"
          onClick={handleConfirm}
          disabled={submitting}
        >
          {submitting ? 'Booking...' : 'Confirm booking'}
        </button>
      </div>
    </div>
  );
}
