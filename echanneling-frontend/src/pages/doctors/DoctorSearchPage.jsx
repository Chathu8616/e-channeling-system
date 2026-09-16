import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import DoctorCard from '../../components/DoctorCard';
import Spinner from '../../components/Spinner';
import { searchDoctors } from '../../services/doctorService';

export default function DoctorSearchPage() {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    specialty: searchParams.get('specialty') || '',
    branch: '',
    name: '',
  });
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
    runSearch(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    runSearch(filters);
  };

  return (
    <div className="page-container">
      <div className="row align-items-center g-4 mb-4">
        <div className="col-lg-7">
          <h1 className="mb-1">Find a Doctor</h1>
          <p className="text-muted mb-0">Search by specialty, hospital branch, or doctor name.</p>
        </div>
        <div className="col-lg-5 text-center text-lg-end">
          <img
            src="/theme/img/gallery/treatment.png"
            alt="Stethoscope"
            className="img-fluid rounded-4 shadow-sm"
            style={{ maxHeight: 160, objectFit: 'cover' }}
          />
        </div>
      </div>

      <form className="card p-3 g-2 row mb-4" onSubmit={handleSubmit}>
        <div className="col-md-3">
          <input
            name="specialty"
            className="form-control"
            placeholder="Specialty"
            value={filters.specialty}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-3">
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
        <div className="col-md-3">
          <button type="submit" className="btn btn-primary w-100 rounded-pill text-nowrap">
            Search
          </button>
        </div>
      </form>

      {loading && <Spinner label="Searching doctors..." />}
      {error && <p className="text-danger">{error}</p>}
      {!loading && !error && doctors.length === 0 && (
        <p className="text-muted">No doctors found. Try a different search.</p>
      )}

      <div className="row">
        {doctors.map((doctor) => (
          <DoctorCard key={doctor.doctorId} doctor={doctor} />
        ))}
      </div>
    </div>
  );
}
