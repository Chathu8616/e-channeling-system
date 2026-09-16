package lk.ac.sliit.echanneling_backend.controller;

import jakarta.validation.Valid;
import lk.ac.sliit.echanneling_backend.dto.PaymentRequest;
import lk.ac.sliit.echanneling_backend.dto.PaymentResponse;
import lk.ac.sliit.echanneling_backend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public PaymentResponse create(@Valid @RequestBody PaymentRequest req) {
        return paymentService.create(req);
    }

    @GetMapping("/{appointmentId}")
    public PaymentResponse getByAppointment(@PathVariable Long appointmentId) {
        return paymentService.getByAppointment(appointmentId);
    }

    @PostMapping("/{id}/retry")
    public PaymentResponse retry(@PathVariable Long id) {
        return paymentService.retry(id);
    }
}
