package lk.ac.sliit.echanneling_backend.repository;

import lk.ac.sliit.echanneling_backend.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUser_UserIdOrderBySentAtDesc(Long userId);
}
