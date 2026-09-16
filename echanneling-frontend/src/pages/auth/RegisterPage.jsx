import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../services/authService';

const emptyForm = { fullName: '', nic: '', email: '', phone: '', password: '' };

export default function RegisterPage() {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <div className="row align-items-center g-5">
        <div className="col-lg-6 d-none d-lg-block">
          <img
            src="/theme/img/gallery/appointment.png"
            alt="Booking an appointment"
            className="img-fluid rounded-4 shadow-sm"
          />
        </div>
        <div className="col-lg-6">
      <form className="form-narrow card p-4 p-md-5" onSubmit={handleSubmit}>
        <h2 className="mb-1">Create an account</h2>
        <p className="text-muted mb-4">It only takes a minute.</p>

        <div className="mb-3">
          <label className="form-label">Full name</label>
          <input
            name="fullName"
            className="form-control"
            value={form.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">NIC</label>
          <input name="nic" className="form-control" value={form.nic} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input name="phone" className="form-control" value={form.phone} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={form.password}
            onChange={handleChange}
            minLength={8}
            required
          />
        </div>

        {error && <p className="text-danger">{error}</p>}

        <button type="submit" className="btn btn-primary w-100 rounded-pill" disabled={submitting}>
          {submitting ? 'Creating account...' : 'Register'}
        </button>

        <p className="mt-3 text-center">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
        </div>
      </div>
    </div>
  );
}
