import { useEffect, useState } from 'react';
import Spinner from '../../components/Spinner';
import { getMyDoctorProfile, updateMyDoctorProfile } from '../../services/doctorService';

export default function MyProfilePage() {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getMyDoctorProfile()
      .then((res) => setForm(res.data))
      .catch(() => setError('Could not load your profile.'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setSubmitting(true);
    try {
      const res = await updateMyDoctorProfile({
        fullName: form.fullName,
        phone: form.phone,
        specialty: form.specialty,
        hospitalBranch: form.hospitalBranch,
        consultationFee: form.consultationFee,
      });
      setForm(res.data);
      setMessage('Profile updated.');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update profile.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <Spinner label="Loading your profile..." />
      </div>
    );
  }

  if (!form) {
    return (
      <div className="page-container">
        <p className="text-danger">{error || 'Profile not found.'}</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="mb-1">My Profile</h1>
      <p className="text-muted mb-4">Keep your details up to date so patients see accurate information.</p>

      <form className="card p-4 p-md-5 form-narrow" onSubmit={handleSubmit}>
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
          <label className="form-label">Email</label>
          <input className="form-control" value={form.email} disabled />
          <div className="form-text">Email can't be changed here.</div>
        </div>

        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input name="phone" className="form-control" value={form.phone || ''} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">Specialty</label>
          <input
            name="specialty"
            className="form-control"
            value={form.specialty}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Hospital branch</label>
          <input
            name="hospitalBranch"
            className="form-control"
            value={form.hospitalBranch}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Consultation fee (Rs.)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            name="consultationFee"
            className="form-control"
            value={form.consultationFee}
            onChange={handleChange}
            required
          />
        </div>

        {message && <p className="text-success">{message}</p>}
        {error && <p className="text-danger">{error}</p>}

        <button type="submit" className="btn btn-primary w-100 rounded-pill" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </div>
  );
}
