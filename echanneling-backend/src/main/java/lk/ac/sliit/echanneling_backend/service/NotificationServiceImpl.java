package lk.ac.sliit.echanneling_backend.service;

import lk.ac.sliit.echanneling_backend.model.*;
import lk.ac.sliit.echanneling_backend.repository.NotificationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class NotificationServiceImpl implements NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationServiceImpl.class);

    private final NotificationRepository notificationRepository;
    private final ObjectProvider<JavaMailSender> mailSenderProvider;
    private final boolean emailEnabled;

    public NotificationServiceImpl(NotificationRepository notificationRepository,
                                    ObjectProvider<JavaMailSender> mailSenderProvider,
                                    @Value("${app.notifications.email-enabled:false}") boolean emailEnabled) {
        this.notificationRepository = notificationRepository;
        this.mailSenderProvider = mailSenderProvider;
        this.emailEnabled = emailEnabled;
    }

    @Override
    public void send(User user, Appointment appointment, NotificationType type, String message) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setAppointment(appointment);
        notification.setType(type);
        notification.setChannel(NotificationChannel.EMAIL);
        notification.setMessage(message);
        notificationRepository.save(notification);

        sendEmail(user, message);
    }

    private void sendEmail(User user, String message) {
        if (!emailEnabled) {
            log.info("Notification for {}: {}", user.getEmail(), message);
            return;
        }
        JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
        if (mailSender == null) {
            log.warn("Email notifications are enabled but no mail server is configured");
            return;
        }
        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setTo(user.getEmail());
            mail.setSubject("E-Channeling notification");
            mail.setText(message);
            mailSender.send(mail);
        } catch (Exception e) {
            log.warn("Failed to send email notification to {}: {}", user.getEmail(), e.getMessage());
        }
    }
}
