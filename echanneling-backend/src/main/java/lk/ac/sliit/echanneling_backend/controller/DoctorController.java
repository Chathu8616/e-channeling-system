package lk.ac.sliit.echanneling_backend.controller;

import lk.ac.sliit.echanneling_backend.dto.DoctorResponse;
import lk.ac.sliit.echanneling_backend.dto.SessionResponse;
import lk.ac.sliit.echanneling_backend.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
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
}
