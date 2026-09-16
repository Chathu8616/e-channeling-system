import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyNotifications } from '../services/notificationService';

export default function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) return;
    getMyNotifications()
      .then((res) => setNotifications(res.data))
      .catch(() => setNotifications([]));
  }, [user]);

  if (!user) return null;

  return (
    <li className="nav-item dropdown px-2">
      <button
        type="button"
        className="btn btn-sm btn-light rounded-pill position-relative"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        🔔
        {notifications.length > 0 && (
          <span
            className="badge bg-danger rounded-pill position-absolute top-0 start-100 translate-middle"
            style={{ fontSize: '0.65rem' }}
          >
            {notifications.length}
          </span>
        )}
      </button>
      <ul className="dropdown-menu dropdown-menu-end shadow-md border-0" style={{ minWidth: 320 }}>
        <li className="dropdown-item-text small fw-semibold text-uppercase text-muted" style={{ letterSpacing: '0.04em' }}>
          Notifications
        </li>
        {notifications.length === 0 && (
          <li className="dropdown-item-text text-muted small py-3">No notifications yet</li>
        )}
        {notifications.slice(0, 8).map((n) => (
          <li key={n.notificationId} className="dropdown-item-text small border-top py-2">
            {n.message}
          </li>
        ))}
      </ul>
    </li>
  );
}
