package lk.ac.sliit.echanneling_backend.repository;

import lk.ac.sliit.echanneling_backend.model.DoctorSession;
import lk.ac.sliit.echanneling_backend.model.SessionStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface DoctorSessionRepository extends JpaRepository<DoctorSession, Long> {
    List<DoctorSession> findByDoctor_DoctorIdAndSessionDateAndStatus(
            Long doctorId, LocalDate sessionDate, SessionStatus status);

    List<DoctorSession> findByDoctor_DoctorId(Long doctorId);
}
