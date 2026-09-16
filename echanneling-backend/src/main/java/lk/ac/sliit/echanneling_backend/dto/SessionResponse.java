package lk.ac.sliit.echanneling_backend.dto;

import lk.ac.sliit.echanneling_backend.model.DoctorSession;
import lk.ac.sliit.echanneling_backend.model.SessionStatus;

import java.time.LocalDate;
import java.time.LocalTime;

public record SessionResponse(
        Long sessionId,
        LocalDate sessionDate,
        LocalTime startTime,
        LocalTime endTime,
        SessionStatus status
) {
    public static SessionResponse from(DoctorSession session) {
        return new SessionResponse(
                session.getSessionId(),
                session.getSessionDate(),
                session.getStartTime(),
                session.getEndTime(),
                session.getStatus()
        );
    }
}
