import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { login } from '../../services/authService';

const DEMO_ACCOUNTS = [
  { label: 'Patient', email: 'patient@example.com', password: 'Patient@123' },
  { label: 'Doctor', email: 'doctor@example.com', password: 'Doctor@123' },
  { label: 'Operations Manager', email: 'admin@example.com', password: 'Admin@123' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await login({ email, password });
      loginWithToken(res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemoAccount = (account) => {
    setEmail(account.email);
    setPassword(account.password);
  };

  return (
    <div className="page-container">
      <div className="row align-items-center g-5">
        <div className="col-lg-6 d-none d-lg-block">
          <img
            src="/theme/img/gallery/health-care.png"
            alt="Healthcare team"
            className="img-fluid rounded-4 shadow-sm"
          />
        </div>

        <div className="col-lg-6">
          <form className="form-narrow card p-4 p-md-5" onSubmit={handleSubmit}>
            <h2 className="mb-1">Welcome back</h2>
            <p className="text-muted mb-4">Log in to manage your appointments.</p>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-danger">{error}</p>}

            <button type="submit" className="btn btn-primary w-100 rounded-pill" disabled={submitting}>
              {submitting ? 'Logging in...' : 'Login'}
            </button>

            <p className="mt-3 text-center">
              Don't have an account? <Link to="/register">Register</Link>
            </p>

            <div className="card bg-light border-0 mt-4">
              <div className="card-body">
                <p className="small fw-semibold mb-2">Try a demo account</p>
                {DEMO_ACCOUNTS.map((account) => (
                  <button
                    key={account.email}
                    type="button"
                    className="btn btn-sm btn-outline-secondary rounded-pill me-2 mb-2"
                    onClick={() => fillDemoAccount(account)}
                  >
                    {account.label}
                  </button>
                ))}
                <p className="small text-muted mb-0">
                  {DEMO_ACCOUNTS[0].email} / {DEMO_ACCOUNTS[0].password} (created automatically
                  when the backend starts)
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
