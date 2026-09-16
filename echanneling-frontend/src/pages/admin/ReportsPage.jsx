import { useState } from 'react';
import {
  exportAppointmentsExcel,
  exportPaymentsExcel,
  getAppointmentsReport,
  getDailySummary,
  getPaymentsReport,
} from '../../services/reportService';

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export default function ReportsPage() {
  const [from, setFrom] = useState(todayIso());
  const [to, setTo] = useState(todayIso());
  const [appointments, setAppointments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');

  const loadReports = async () => {
    setError('');
    try {
      const [appointmentsRes, paymentsRes, summaryRes] = await Promise.all([
        getAppointmentsReport(from, to),
        getPaymentsReport(from, to),
        getDailySummary(to),
      ]);
      setAppointments(appointmentsRes.data);
      setPayments(paymentsRes.data);
      setSummary(summaryRes.data);
    } catch {
      setError('Could not load reports. Are you signed in as an admin or doctor?');
    }
  };

  return (
    <div className="page-container">
      <h1 className="mb-1">Reports</h1>
      <p className="text-muted mb-4">Appointment and revenue reporting for admins and doctors.</p>

      <div className="card p-4 mb-4">
        <div className="row g-2 align-items-end">
          <div className="col-md-3">
            <label className="form-label">From</label>
            <input type="date" className="form-control" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div className="col-md-3">
            <label className="form-label">To</label>
            <input type="date" className="form-control" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <div className="col-md-3">
            <button type="button" className="btn btn-primary w-100 rounded-pill" onClick={loadReports}>
              Run report
            </button>
          </div>
        </div>
        {error && <p className="text-danger mb-0 mt-3">{error}</p>}
      </div>

      {summary && (
        <div className="row mb-4 text-center g-3">
          <div className="col-md-4">
            <div className="card card-hover p-4">
              <div className="fs-3 fw-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--brand)' }}>
                {summary.totalAppointments}
              </div>
              <div className="text-muted small">Appointments on {summary.date}</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card card-hover p-4">
              <div className="fs-3 fw-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--brand)' }}>
                {summary.cancelledAppointments}
              </div>
              <div className="text-muted small">Cancelled</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card card-hover p-4">
              <div className="fs-3 fw-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent-dark)' }}>
                Rs. {summary.totalRevenue}
              </div>
              <div className="text-muted small">Revenue</div>
            </div>
          </div>
        </div>
      )}

      <div className="card p-4 mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h5 mb-0">Appointments ({appointments.length})</h2>
        <button
          type="button"
          className="btn btn-sm btn-outline-primary rounded-pill"
          onClick={() => exportAppointmentsExcel(from, to)}
        >
          Export to Excel
        </button>
      </div>
      <div className="table-responsive">
        <table className="table table-sm">
          <thead>
            <tr>
              <th>Reference</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a.appointmentId}>
                <td>{a.referenceNo}</td>
                <td>{a.doctorName}</td>
                <td>{a.appointmentDate}</td>
                <td>{a.timeSlot}</td>
                <td>{a.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>

      <div className="card p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h5 mb-0">Payments ({payments.length})</h2>
        <button
          type="button"
          className="btn btn-sm btn-outline-primary rounded-pill"
          onClick={() => exportPaymentsExcel(from, to)}
        >
          Export to Excel
        </button>
      </div>
      <div className="table-responsive">
        <table className="table table-sm">
          <thead>
            <tr>
              <th>Appointment Ref</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Paid At</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.paymentId}>
                <td>{p.appointmentReferenceNo}</td>
                <td>Rs. {p.amount}</td>
                <td>{p.status}</td>
                <td>{p.paidAt || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
}
