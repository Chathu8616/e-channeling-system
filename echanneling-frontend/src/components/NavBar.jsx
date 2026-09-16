import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

const DOCTORS_LINK_LABEL = {
  OPERATIONS_MANAGER: 'Manage Doctors',
  DOCTOR: 'Doctors',
  PATIENT: 'Our Doctors',
};

const ROLE_LABEL = {
  OPERATIONS_MANAGER: 'Operations Manager',
  DOCTOR: 'Doctor',
  PATIENT: 'Patient',
};

function initials(email) {
  return email.slice(0, 2).toUpperCase();
}

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isStaff = user?.role === 'OPERATIONS_MANAGER' || user?.role === 'DOCTOR';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="site-navbar navbar navbar-expand-lg navbar-light py-2 sticky-top">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <span className="brand-mark">EC</span>
          E-Channeling
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div id="navbarContent" className="collapse navbar-collapse">
          {/* Patient-facing links — visible to everyone */}
          <ul className="navbar-nav me-auto align-items-lg-center">
            <li className="nav-item px-2">
              <NavLink className="nav-link" to="/doctors">
                Find a Doctor
              </NavLink>
            </li>
            {user && (
              <li className="nav-item px-2">
                <NavLink className="nav-link" to="/appointments">
                  My Appointments
                </NavLink>
              </li>
            )}
            {user && (
              <li className="nav-item px-2">
                <NavLink className="nav-link" to="/doctor-directory">
                  {DOCTORS_LINK_LABEL[user.role] || 'Our Doctors'}
                </NavLink>
              </li>
            )}
          </ul>

          {/* Staff tools + account — grouped on the right */}
          <ul className="navbar-nav align-items-lg-center">
            {isStaff && (
              <li className="nav-item dropdown px-2">
                <a
                  href="#!"
                  role="button"
                  className="nav-link dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Admin
                </a>
                <ul className="dropdown-menu shadow-md border-0">
                  <li>
                    <NavLink className="dropdown-item" to="/admin/schedule">
                      Schedule
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="dropdown-item" to="/admin/reports">
                      Reports
                    </NavLink>
                  </li>
                </ul>
              </li>
            )}

            <NotificationBell />

            {user ? (
              <li className="nav-item dropdown px-2">
                <button
                  type="button"
                  className="btn btn-sm btn-light dropdown-toggle d-flex align-items-center gap-2 rounded-pill"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <span
                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: 26,
                      height: 26,
                      background: 'linear-gradient(135deg, var(--brand), var(--accent))',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '0.65rem',
                    }}
                  >
                    {initials(user.email)}
                  </span>
                  <span className="d-none d-md-inline small">{user.email.split('@')[0]}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-md border-0">
                  <li className="dropdown-item-text small text-muted">
                    {ROLE_LABEL[user.role] || user.role}
                  </li>
                  {user.role === 'DOCTOR' && (
                    <li>
                      <NavLink className="dropdown-item" to="/my-profile">
                        My Profile
                      </NavLink>
                    </li>
                  )}
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button type="button" className="dropdown-item" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item px-2">
                <Link className="btn btn-sm btn-primary rounded-pill" to="/login">
                  Sign In
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
