package lk.ac.sliit.echanneling_backend.service;

import lk.ac.sliit.echanneling_backend.dto.DoctorResponse;
import lk.ac.sliit.echanneling_backend.dto.SessionResponse;
import lk.ac.sliit.echanneling_backend.model.Doctor;
import lk.ac.sliit.echanneling_backend.model.SessionStatus;
import lk.ac.sliit.echanneling_backend.repository.DoctorRepository;
import lk.ac.sliit.echanneling_backend.repository.DoctorSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final DoctorSessionRepository doctorSessionRepository;

    public List<DoctorResponse> search(String specialty, String branch, String name) {
        return doctorRepository.search(blankToNull(specialty), blankToNull(branch), blankToNull(name))
                .stream()
                .map(DoctorResponse::from)
                .toList();
    }

    public DoctorResponse getById(Long doctorId) {
        return DoctorResponse.from(findDoctor(doctorId));
    }

    public List<SessionResponse> getOpenSessions(Long doctorId, LocalDate date) {
        Doctor doctor = findDoctor(doctorId);
        return doctorSessionRepository
                .findByDoctor_DoctorIdAndSessionDateAndStatus(doctor.getDoctorId(), date, SessionStatus.OPEN)
                .stream()
                .map(SessionResponse::from)
                .toList();
    }

    private Doctor findDoctor(Long doctorId) {
        return doctorRepository.findById(doctorId)
                .orElseThrow(() -> new IllegalStateException("Doctor not found"));
    }

    private String blankToNull(String value) {
        return (value == null || value.isBlank()) ? null : value;
    }
}
