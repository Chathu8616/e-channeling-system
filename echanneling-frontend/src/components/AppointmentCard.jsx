const STATUS_STYLES = {
  BOOKED: 'text-bg-success',
  RESCHEDULED: 'text-bg-warning',
  CANCELLED: 'text-bg-secondary',
  COMPLETED: 'text-bg-primary',
};

export default function AppointmentCard({ appointment, onCancel }) {
  return (
    <div className="card card-hover mb-3">
      <div className="card-body d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <h5 className="card-title mb-0">Dr. {appointment.doctorName}</h5>
            <span className={`badge ${STATUS_STYLES[appointment.status] || 'text-bg-secondary'}`}>
              {appointment.status}
            </span>
          </div>
          <p className="text-muted mb-1">{appointment.specialty}</p>
          <p className="mb-1 fw-semibold">
            {appointment.appointmentDate} at {appointment.timeSlot}
          </p>
          <span className="text-muted small">Ref: {appointment.referenceNo}</span>
        </div>
        {appointment.status === 'BOOKED' || appointment.status === 'RESCHEDULED' ? (
          <button
            type="button"
            className="btn btn-outline-danger btn-sm rounded-pill"
            onClick={() => onCancel(appointment.appointmentId)}
          >
            Cancel
          </button>
        ) : null}
      </div>
    </div>
  );
}
