import { useEffect, useState } from 'react';
import DoctorCard from '../../components/DoctorCard';
import { searchDoctors } from '../../services/doctorService';

export default function DoctorSearchPage() {
  const [filters, setFilters] = useState({ specialty: '', branch: '', name: '' });
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const runSearch = async (params) => {
    setLoading(true);
    setError('');
    try {
      const res = await searchDoctors(params);
      setDoctors(res.data);
    } catch {
      setError('Could not load doctors. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSearch({});
  }, []);

  const handleChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    runSearch(filters);
  };

  return (
    <div className="page-container">
      <h1 className="mb-4">Find a Doctor</h1>

      <form className="row g-2 mb-4" onSubmit={handleSubmit}>
        <div className="col-md-4">
          <input
            name="specialty"
            className="form-control"
            placeholder="Specialty"
            value={filters.specialty}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <input
            name="branch"
            className="form-control"
            placeholder="Hospital branch"
            value={filters.branch}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-3">
          <input
            name="name"
            className="form-control"
            placeholder="Doctor name"
            value={filters.name}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-1">
          <button type="submit" className="btn btn-primary w-100">
            Search
          </button>
        </div>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="text-danger">{error}</p>}
      {!loading && !error && doctors.length === 0 && <p>No doctors found.</p>}

      <div className="row">
        {doctors.map((doctor) => (
          <DoctorCard key={doctor.doctorId} doctor={doctor} />
        ))}
      </div>
    </div>
  );
}
