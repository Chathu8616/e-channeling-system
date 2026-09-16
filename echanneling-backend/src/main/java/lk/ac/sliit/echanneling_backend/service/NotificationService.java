package lk.ac.sliit.echanneling_backend.service;

import lk.ac.sliit.echanneling_backend.model.Appointment;
import lk.ac.sliit.echanneling_backend.model.NotificationType;
import lk.ac.sliit.echanneling_backend.model.User;

public interface NotificationService {

    /**
     * Records and sends a notification to a user. Implemented fully in the
     * notifications module; other modules only depend on this interface.
     */
    void send(User user, Appointment appointment, NotificationType type, String message);
}
