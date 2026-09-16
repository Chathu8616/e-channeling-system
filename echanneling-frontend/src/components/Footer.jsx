import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer pt-5 pb-4 mt-5">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-4">
            <span className="navbar-brand fw-bold text-white d-inline-flex align-items-center gap-2 mb-2">
              <span className="brand-mark">EC</span>
              E-Channeling
            </span>
            <p className="small mb-0" style={{ maxWidth: 280 }}>
              Book doctors' appointments online in minutes — search, schedule, and pay
              online, no phone calls needed.
            </p>
          </div>

          <div className="col-6 col-md-2">
            <h6>Patients</h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><Link to="/doctors">Find a Doctor</Link></li>
              <li className="mb-2"><Link to="/appointments">My Appointments</Link></li>
              <li className="mb-2"><Link to="/register">Create Account</Link></li>
            </ul>
          </div>

          <div className="col-6 col-md-2">
            <h6>Providers</h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><Link to="/admin/schedule">Manage Schedule</Link></li>
              <li className="mb-2"><Link to="/admin/reports">Reports</Link></li>
            </ul>
          </div>

          <div className="col-md-4">
            <h6>SE2030 Group Project</h6>
            <p className="small mb-0">Group ID: MLB-B1G2-02</p>
            <p className="small mb-0">Web-based E-Channeling System</p>
          </div>
        </div>

        <hr className="my-4" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />

        <div className="d-flex flex-wrap justify-content-between small">
          <span>&copy; {new Date().getFullYear()} E-Channeling System</span>
          <span>Built with React &amp; Spring Boot</span>
        </div>
      </div>
    </footer>
  );
}
