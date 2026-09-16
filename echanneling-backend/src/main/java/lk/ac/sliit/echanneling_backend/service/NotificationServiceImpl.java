package lk.ac.sliit.echanneling_backend.service;

import lk.ac.sliit.echanneling_backend.model.*;
import lk.ac.sliit.echanneling_backend.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    @Override
    public void send(User user, Appointment appointment, NotificationType type, String message) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setAppointment(appointment);
        notification.setType(type);
        notification.setChannel(NotificationChannel.EMAIL);
        notification.setMessage(message);
        notificationRepository.save(notification);
    }
}
