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
        <h1>Appointment confirmed</h1>
        <p>Reference number: <strong>{result.referenceNo}</strong></p>
        <p>
          {result.appointmentDate} at {result.timeSlot} with Dr. {result.doctorName}
        </p>
        <Link to="/appointments" className="btn btn-primary rounded-pill px-4">
          Go to My Appointments
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container text-center">
      <h1>Confirm your appointment</h1>
      <p className="text-muted">Press confirm to book this time slot.</p>
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
  );
}
