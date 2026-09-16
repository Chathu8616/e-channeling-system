import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { payForAppointment, retryPayment } from '../../services/paymentService';

export default function PaymentPage() {
  const { appointmentId } = useParams();
  const [method, setMethod] = useState('CARD');
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handlePay = async () => {
    setError('');
    setSubmitting(true);
    try {
      const res = await payForAppointment(Number(appointmentId), method);
      setPayment(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = async () => {
    if (!payment) return;
    setSubmitting(true);
    try {
      const res = await retryPayment(payment.paymentId);
      setPayment(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Retry failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (payment?.status === 'SUCCESS') {
    return (
      <div className="page-container text-center">
        <div className="form-narrow card p-4">
          <div
            className="icon-circle mx-auto"
            style={{ background: 'rgba(20,184,166,0.15)', color: 'var(--accent-dark)', fontSize: '1.5rem' }}
          >
            ✓
          </div>
          <h1 className="h3 mb-3">Payment successful</h1>
          <div className="text-start bg-light rounded-3 p-3 mb-4">
            <h2 className="h6 text-uppercase text-muted mb-2" style={{ letterSpacing: '0.04em' }}>
              Receipt
            </h2>
            <p className="mb-1 d-flex justify-content-between">
              <span className="text-muted">Appointment</span> <strong>{payment.appointmentReferenceNo}</strong>
            </p>
            <p className="mb-1 d-flex justify-content-between">
              <span className="text-muted">Amount</span> <strong>Rs. {payment.amount}</strong>
            </p>
            <p className="mb-0 d-flex justify-content-between">
              <span className="text-muted">Paid at</span> <strong>{payment.paidAt}</strong>
            </p>
          </div>
          <Link to="/appointments" className="btn btn-primary rounded-pill px-4">
            Go to My Appointments
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="form-narrow card p-4">
        <h1 className="h3 mb-4">Pay for your appointment</h1>

        <div className="mb-3">
          <label className="form-label">Payment method</label>
          <select className="form-select" value={method} onChange={(e) => setMethod(e.target.value)}>
            <option value="CARD">Card</option>
            <option value="ONLINE_BANKING">Online Banking</option>
          </select>
        </div>

        {payment?.status === 'FAILED' && (
          <p className="text-danger">Payment failed. You can retry below.</p>
        )}
        {error && <p className="text-danger">{error}</p>}

        {payment?.status === 'FAILED' ? (
          <button type="button" className="btn btn-primary w-100" onClick={handleRetry} disabled={submitting}>
            {submitting ? 'Retrying...' : 'Retry payment'}
          </button>
        ) : (
          <button type="button" className="btn btn-primary w-100" onClick={handlePay} disabled={submitting}>
            {submitting ? 'Processing...' : 'Pay now'}
          </button>
        )}
      </div>
    </div>
  );
}
