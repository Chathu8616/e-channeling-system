package lk.ac.sliit.echanneling_backend.service;

import lk.ac.sliit.echanneling_backend.dto.AppointmentResponse;
import lk.ac.sliit.echanneling_backend.dto.BookAppointmentRequest;
import lk.ac.sliit.echanneling_backend.dto.CancelRequest;
import lk.ac.sliit.echanneling_backend.dto.RescheduleRequest;
import lk.ac.sliit.echanneling_backend.model.*;
import lk.ac.sliit.echanneling_backend.repository.AppointmentRepository;
import lk.ac.sliit.echanneling_backend.repository.DoctorSessionRepository;
import lk.ac.sliit.echanneling_backend.security.CurrentUserProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorSessionRepository doctorSessionRepository;
    private final CurrentUserProvider currentUserProvider;
    private final NotificationService notificationService;

    @Transactional
    public AppointmentResponse book(BookAppointmentRequest req) {
        DoctorSession session = doctorSessionRepository.findById(req.sessionId())
                .orElseThrow(() -> new IllegalStateException("Session not found"));

        if (session.getStatus() != SessionStatus.OPEN) {
            throw new IllegalStateException("This time slot is no longer available");
        }

        session.setStatus(SessionStatus.FULL);
        doctorSessionRepository.save(session);

        User patient = currentUserProvider.getCurrentUser();

        Appointment appointment = new Appointment();
        appointment.setReferenceNo(generateReferenceNo());
        appointment.setPatient(patient);
        appointment.setDoctor(session.getDoctor());
        appointment.setSession(session);
        appointment.setAppointmentDate(session.getSessionDate());
        appointment.setTimeSlot(session.getStartTime());
        appointment.setStatus(AppointmentStatus.BOOKED);
        appointmentRepository.save(appointment);

        notificationService.send(patient, appointment, NotificationType.BOOKING,
                "Your appointment " + appointment.getReferenceNo() + " with Dr. "
                        + session.getDoctor().getUser().getFullName() + " is confirmed.");

        return AppointmentResponse.from(appointment);
    }

    public List<AppointmentResponse> getMine() {
        User patient = currentUserProvider.getCurrentUser();
        return appointmentRepository.findByPatient_UserIdOrderByAppointmentDateDesc(patient.getUserId())
                .stream()
                .map(AppointmentResponse::from)
                .toList();
    }

    @Transactional
    public AppointmentResponse cancel(Long appointmentId, CancelRequest req) {
        Appointment appointment = findOwnedAppointment(appointmentId);

        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointment.setCancellationReason(req.reason());
        appointmentRepository.save(appointment);

        DoctorSession session = appointment.getSession();
        session.setStatus(SessionStatus.OPEN);
        doctorSessionRepository.save(session);

        notificationService.send(appointment.getPatient(), appointment, NotificationType.CANCELLATION,
                "Your appointment " + appointment.getReferenceNo() + " has been cancelled.");

        return AppointmentResponse.from(appointment);
    }

    @Transactional
    public AppointmentResponse reschedule(Long appointmentId, RescheduleRequest req) {
        Appointment appointment = findOwnedAppointment(appointmentId);

        DoctorSession newSession = doctorSessionRepository.findById(req.newSessionId())
                .orElseThrow(() -> new IllegalStateException("Session not found"));

        if (newSession.getStatus() != SessionStatus.OPEN) {
            throw new IllegalStateException("This time slot is no longer available");
        }

        DoctorSession oldSession = appointment.getSession();
        oldSession.setStatus(SessionStatus.OPEN);
        doctorSessionRepository.save(oldSession);

        newSession.setStatus(SessionStatus.FULL);
        doctorSessionRepository.save(newSession);

        appointment.setSession(newSession);
        appointment.setAppointmentDate(newSession.getSessionDate());
        appointment.setTimeSlot(newSession.getStartTime());
        appointment.setStatus(AppointmentStatus.RESCHEDULED);
        appointmentRepository.save(appointment);

        notificationService.send(appointment.getPatient(), appointment, NotificationType.RESCHEDULE,
                "Your appointment " + appointment.getReferenceNo() + " was moved to "
                        + newSession.getSessionDate() + " " + newSession.getStartTime() + ".");

        return AppointmentResponse.from(appointment);
    }

    private Appointment findOwnedAppointment(Long appointmentId) {
        User patient = currentUserProvider.getCurrentUser();
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new IllegalStateException("Appointment not found"));
        if (!appointment.getPatient().getUserId().equals(patient.getUserId())) {
            throw new IllegalStateException("You cannot modify this appointment");
        }
        return appointment;
    }

    private String generateReferenceNo() {
        return "APT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
