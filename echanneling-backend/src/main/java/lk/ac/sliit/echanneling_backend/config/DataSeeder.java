package lk.ac.sliit.echanneling_backend.config;

import lk.ac.sliit.echanneling_backend.model.*;
import lk.ac.sliit.echanneling_backend.repository.DoctorRepository;
import lk.ac.sliit.echanneling_backend.repository.DoctorSessionRepository;
import lk.ac.sliit.echanneling_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Ensures a few demo accounts (and one doctor with open sessions) exist, so the system can be
 * tried out immediately without manual SQL. Each account is created only if its email doesn't
 * already exist yet, so this is safe to run on every startup — it won't touch or duplicate any
 * real data you've already added, and it will still create the demo accounts even if you'd
 * registered other users before this seeder existed.
 * Demo login: patient@example.com / Patient@123 (see README for the full list).
 */
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final DoctorSessionRepository doctorSessionRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        createUserIfMissing("Demo Patient", "199912345678", "patient@example.com", "Patient@123", Role.PATIENT);
        createUserIfMissing("Operations Manager", "198512345671", "admin@example.com", "Admin@123", Role.OPERATIONS_MANAGER);

        User doctorUser = createUserIfMissing(
                "Dr. Anjali Perera", "197812345672", "doctor@example.com", "Doctor@123", Role.DOCTOR);

        Doctor doctor = doctorRepository.findByUser_UserId(doctorUser.getUserId())
                .orElseGet(() -> {
                    Doctor d = new Doctor();
                    d.setUser(doctorUser);
                    d.setSpecialty("Cardiology");
                    d.setHospitalBranch("Colombo General Hospital");
                    d.setConsultationFee(new BigDecimal("2500.00"));
                    return doctorRepository.save(d);
                });

        if (doctorSessionRepository.findByDoctor_DoctorId(doctor.getDoctorId()).isEmpty()) {
            seedSession(doctor, LocalDate.now(), LocalTime.of(9, 0), LocalTime.of(9, 30));
            seedSession(doctor, LocalDate.now(), LocalTime.of(9, 30), LocalTime.of(10, 0));
            seedSession(doctor, LocalDate.now().plusDays(1), LocalTime.of(14, 0), LocalTime.of(14, 30));
        }
    }

    private User createUserIfMissing(String fullName, String nic, String email, String rawPassword, Role role) {
        return userRepository.findByEmail(email).orElseGet(() -> {
            User user = new User();
            user.setFullName(fullName);
            user.setNic(nic);
            user.setEmail(email);
            user.setPasswordHash(passwordEncoder.encode(rawPassword));
            user.setRole(role);
            user.setVerified(true);
            return userRepository.save(user);
        });
    }

    private void seedSession(Doctor doctor, LocalDate date, LocalTime start, LocalTime end) {
        DoctorSession session = new DoctorSession();
        session.setDoctor(doctor);
        session.setSessionDate(date);
        session.setStartTime(start);
        session.setEndTime(end);
        session.setStatus(SessionStatus.OPEN);
        doctorSessionRepository.save(session);
    }
}
