package lk.ac.sliit.echanneling_backend.controller;

import lk.ac.sliit.echanneling_backend.dto.NotificationResponse;
import lk.ac.sliit.echanneling_backend.repository.NotificationRepository;
import lk.ac.sliit.echanneling_backend.security.CurrentUserProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationRepository notificationRepository;
    private final CurrentUserProvider currentUserProvider;

    @GetMapping("/mine")
    public List<NotificationResponse> getMine() {
        Long userId = currentUserProvider.getCurrentUser().getUserId();
        return notificationRepository.findByUser_UserIdOrderBySentAtDesc(userId)
                .stream()
                .map(NotificationResponse::from)
                .toList();
    }
}
