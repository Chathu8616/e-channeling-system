package lk.ac.sliit.echanneling_backend.service;

import lk.ac.sliit.echanneling_backend.dto.CreateDoctorRequest;
import lk.ac.sliit.echanneling_backend.dto.CreateSessionRequest;
import lk.ac.sliit.echanneling_backend.dto.DoctorProfileResponse;
import lk.ac.sliit.echanneling_backend.dto.DoctorResponse;
import lk.ac.sliit.echanneling_backend.dto.SessionResponse;
import lk.ac.sliit.echanneling_backend.dto.UpdateDoctorProfileRequest;
import lk.ac.sliit.echanneling_backend.model.Doctor;
import lk.ac.sliit.echanneling_backend.model.DoctorSession;
import lk.ac.sliit.echanneling_backend.model.Role;
import lk.ac.sliit.echanneling_backend.model.SessionStatus;
import lk.ac.sliit.echanneling_backend.model.User;
import lk.ac.sliit.echanneling_backend.repository.DoctorRepository;
import lk.ac.sliit.echanneling_backend.repository.DoctorSessionRepository;
import lk.ac.sliit.echanneling_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final DoctorSessionRepository doctorSessionRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public List<DoctorResponse> search(String specialty, String branch, String name) {
        return doctorRepository.search(blankToNull(specialty), blankToNull(branch), blankToNull(name))
                .stream()
                .map(DoctorResponse::from)
                .toList();
    }

    public DoctorResponse getById(Long doctorId) {
        return DoctorResponse.from(findDoctor(doctorId));
    }

    public DoctorResponse createDoctor(CreateDoctorRequest req) {
        if (userRepository.existsByEmail(req.email())) {
            throw new IllegalStateException("Email already registered");
        }
        User user = new User();
        user.setFullName(req.fullName());
        user.setNic(req.nic());
        user.setEmail(req.email());
        user.setPhone(req.phone());
        user.setPasswordHash(passwordEncoder.encode(req.password()));
        user.setRole(Role.DOCTOR);
        user.setVerified(true);
        userRepository.save(user);

        Doctor doctor = new Doctor();
        doctor.setUser(user);
        doctor.setSpecialty(req.specialty());
        doctor.setHospitalBranch(req.hospitalBranch());
        doctor.setConsultationFee(req.consultationFee());
        return DoctorResponse.from(doctorRepository.save(doctor));
    }

    public DoctorProfileResponse getMyProfile(Long userId) {
        return DoctorProfileResponse.from(findDoctorByUserId(userId));
    }

    public DoctorProfileResponse updateMyProfile(Long userId, UpdateDoctorProfileRequest req) {
        Doctor doctor = findDoctorByUserId(userId);

        User user = doctor.getUser();
        user.setFullName(req.fullName());
        user.setPhone(req.phone());
        userRepository.save(user);

        doctor.setSpecialty(req.specialty());
        doctor.setHospitalBranch(req.hospitalBranch());
        doctor.setConsultationFee(req.consultationFee());
        return DoctorProfileResponse.from(doctorRepository.save(doctor));
    }

    public List<SessionResponse> getOpenSessions(Long doctorId, LocalDate date) {
        Doctor doctor = findDoctor(doctorId);
        return doctorSessionRepository
                .findByDoctor_DoctorIdAndSessionDateAndStatus(doctor.getDoctorId(), date, SessionStatus.OPEN)
                .stream()
                .map(SessionResponse::from)
                .toList();
    }

    /** Unlike getOpenSessions (patient-facing), this returns every session regardless of
     * status so admins/doctors can see and manage blocked or fully-booked slots too. */
    public List<SessionResponse> getAllSessions(Long doctorId, LocalDate date) {
        Doctor doctor = findDoctor(doctorId);
        return doctorSessionRepository.findByDoctor_DoctorIdAndSessionDate(doctor.getDoctorId(), date)
                .stream()
                .map(SessionResponse::from)
                .toList();
    }

    public SessionResponse createSession(Long doctorId, CreateSessionRequest req) {
        Doctor doctor = findDoctor(doctorId);
        DoctorSession session = new DoctorSession();
        session.setDoctor(doctor);
        session.setSessionDate(req.sessionDate());
        session.setStartTime(req.startTime());
        session.setEndTime(req.endTime());
        session.setStatus(SessionStatus.OPEN);
        return SessionResponse.from(doctorSessionRepository.save(session));
    }

    public void blockSession(Long sessionId) {
        DoctorSession session = doctorSessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalStateException("Session not found"));
        session.setStatus(SessionStatus.BLOCKED);
        doctorSessionRepository.save(session);
    }

    public SessionResponse updateSession(Long sessionId, CreateSessionRequest req) {
        DoctorSession session = doctorSessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalStateException("Session not found"));
        session.setSessionDate(req.sessionDate());
        session.setStartTime(req.startTime());
        session.setEndTime(req.endTime());
        return SessionResponse.from(doctorSessionRepository.save(session));
    }

    private Doctor findDoctor(Long doctorId) {
        return doctorRepository.findById(doctorId)
                .orElseThrow(() -> new IllegalStateException("Doctor not found"));
    }

    private Doctor findDoctorByUserId(Long userId) {
        return doctorRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new IllegalStateException("Doctor profile not found"));
    }

    private String blankToNull(String value) {
        return (value == null || value.isBlank()) ? null : value;
    }
}
