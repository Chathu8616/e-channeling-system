import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light py-3 border-bottom bg-white">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
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
          <ul className="navbar-nav ms-auto align-items-lg-center">
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
            {user?.role === 'OPERATIONS_MANAGER' || user?.role === 'DOCTOR' ? (
              <>
                <li className="nav-item px-2">
                  <NavLink className="nav-link" to="/admin/schedule">
                    Schedule
                  </NavLink>
                </li>
                <li className="nav-item px-2">
                  <NavLink className="nav-link" to="/admin/reports">
                    Reports
                  </NavLink>
                </li>
              </>
            ) : null}
            <NotificationBell />

            {user ? (
              <li className="nav-item px-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary rounded-pill"
                  onClick={handleLogout}
                >
                  Logout ({user.email})
                </button>
              </li>
            ) : (
              <li className="nav-item px-2">
                <Link className="btn btn-sm btn-outline-primary rounded-pill" to="/login">
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
