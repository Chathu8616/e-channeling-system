package lk.ac.sliit.echanneling_backend.controller;

import jakarta.validation.Valid;
import lk.ac.sliit.echanneling_backend.dto.AppointmentResponse;
import lk.ac.sliit.echanneling_backend.dto.BookAppointmentRequest;
import lk.ac.sliit.echanneling_backend.dto.CancelRequest;
import lk.ac.sliit.echanneling_backend.dto.RescheduleRequest;
import lk.ac.sliit.echanneling_backend.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping
    public AppointmentResponse book(@Valid @RequestBody BookAppointmentRequest req) {
        return appointmentService.book(req);
    }

    @GetMapping("/mine")
    public List<AppointmentResponse> getMine() {
        return appointmentService.getMine();
    }

    @PutMapping("/{id}/cancel")
    public AppointmentResponse cancel(@PathVariable Long id, @RequestBody(required = false) CancelRequest req) {
        return appointmentService.cancel(id, req != null ? req : new CancelRequest(null));
    }

    @PutMapping("/{id}/reschedule")
    public AppointmentResponse reschedule(@PathVariable Long id, @Valid @RequestBody RescheduleRequest req) {
        return appointmentService.reschedule(id, req);
    }
}
