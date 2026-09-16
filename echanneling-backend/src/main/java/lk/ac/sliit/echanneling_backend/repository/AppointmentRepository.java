package lk.ac.sliit.echanneling_backend.repository;

import lk.ac.sliit.echanneling_backend.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatient_UserIdOrderByAppointmentDateDesc(Long patientId);
    Optional<Appointment> findByReferenceNo(String referenceNo);
    List<Appointment> findByAppointmentDateBetween(LocalDate from, LocalDate to);
    List<Appointment> findByCreatedAtBetween(LocalDateTime from, LocalDateTime to);
}
