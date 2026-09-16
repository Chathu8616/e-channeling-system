import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppointmentCard from '../../components/AppointmentCard';
import Spinner from '../../components/Spinner';
import { cancelAppointment, getMyAppointments } from '../../services/appointmentService';

export default function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    getMyAppointments()
      .then((res) => setAppointments(res.data))
      .catch(() => setError('Could not load your appointments.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCancel = async (id) => {
    const reason = window.prompt('Reason for cancelling (optional):') || '';
    try {
      await cancelAppointment(id, reason);
      load();
    } catch {
      setError('Could not cancel this appointment.');
    }
  };

  return (
    <div className="page-container">
      <h1 className="mb-4">My Appointments</h1>
      {loading && <Spinner label="Loading your appointments..." />}
      {error && <p className="text-danger">{error}</p>}
      {!loading && appointments.length === 0 && (
        <div className="card text-center p-5">
          <p className="text-muted mb-3">You have no appointments yet.</p>
          <Link to="/doctors" className="btn btn-primary rounded-pill mx-auto" style={{ width: 'fit-content' }}>
            Find a Doctor
          </Link>
        </div>
      )}
      {appointments.map((appointment) => (
        <AppointmentCard
          key={appointment.appointmentId}
          appointment={appointment}
          onCancel={handleCancel}
        />
      ))}
    </div>
  );
}
