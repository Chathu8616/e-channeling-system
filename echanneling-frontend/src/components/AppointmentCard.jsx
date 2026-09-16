export default function AppointmentCard({ appointment, onCancel }) {
  return (
    <div className="card mb-3">
      <div className="card-body d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <h5 className="card-title mb-1">Dr. {appointment.doctorName}</h5>
          <p className="text-muted mb-1">{appointment.specialty}</p>
          <p className="mb-1">
            {appointment.appointmentDate} at {appointment.timeSlot}
          </p>
          <span className="badge bg-secondary">{appointment.status}</span>
          <span className="ms-2 text-muted">Ref: {appointment.referenceNo}</span>
        </div>
        {appointment.status === 'BOOKED' || appointment.status === 'RESCHEDULED' ? (
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={() => onCancel(appointment.appointmentId)}
          >
            Cancel
          </button>
        ) : null}
      </div>
    </div>
  );
}
