package lk.ac.sliit.echanneling_backend.controller;

import jakarta.validation.Valid;
import lk.ac.sliit.echanneling_backend.dto.CreateSessionRequest;
import lk.ac.sliit.echanneling_backend.dto.DoctorResponse;
import lk.ac.sliit.echanneling_backend.dto.SessionResponse;
import lk.ac.sliit.echanneling_backend.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService doctorService;

    @GetMapping
    public List<DoctorResponse> search(
            @RequestParam(required = false) String specialty,
            @RequestParam(required = false) String branch,
            @RequestParam(required = false) String name) {
        return doctorService.search(specialty, branch, name);
    }

    @GetMapping("/{id}")
    public DoctorResponse getById(@PathVariable Long id) {
        return doctorService.getById(id);
    }

    @GetMapping("/{id}/sessions")
    public List<SessionResponse> getSessions(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return doctorService.getOpenSessions(id, date);
    }

    @PostMapping("/{id}/sessions")
    @PreAuthorize("hasAnyRole('DOCTOR', 'OPERATIONS_MANAGER')")
    public SessionResponse createSession(@PathVariable Long id, @Valid @RequestBody CreateSessionRequest req) {
        return doctorService.createSession(id, req);
    }

    @DeleteMapping("/sessions/{sessionId}")
    @PreAuthorize("hasAnyRole('DOCTOR', 'OPERATIONS_MANAGER')")
    public void blockSession(@PathVariable Long sessionId) {
        doctorService.blockSession(sessionId);
    }
}
