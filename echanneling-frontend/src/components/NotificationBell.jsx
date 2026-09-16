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
        className="btn btn-sm btn-light position-relative"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        Notifications
        {notifications.length > 0 && (
          <span className="badge bg-danger rounded-pill ms-1">{notifications.length}</span>
        )}
      </button>
      <ul className="dropdown-menu dropdown-menu-end" style={{ minWidth: 300 }}>
        {notifications.length === 0 && <li className="dropdown-item-text text-muted">No notifications yet</li>}
        {notifications.slice(0, 8).map((n) => (
          <li key={n.notificationId} className="dropdown-item-text small border-bottom py-2">
            {n.message}
          </li>
        ))}
      </ul>
    </li>
  );
}
