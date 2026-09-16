package lk.ac.sliit.echanneling_backend.service;

import lk.ac.sliit.echanneling_backend.dto.PaymentRequest;
import lk.ac.sliit.echanneling_backend.dto.PaymentResponse;
import lk.ac.sliit.echanneling_backend.model.Appointment;
import lk.ac.sliit.echanneling_backend.model.NotificationType;
import lk.ac.sliit.echanneling_backend.model.Payment;
import lk.ac.sliit.echanneling_backend.model.PaymentStatus;
import lk.ac.sliit.echanneling_backend.repository.AppointmentRepository;
import lk.ac.sliit.echanneling_backend.repository.PaymentRepository;
import lk.ac.sliit.echanneling_backend.security.CurrentUserProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.concurrent.ThreadLocalRandom;

/**
 * No real payment gateway is integrated for this student project — the "gateway" below
 * simulates one, succeeding 9 times out of 10, matching the project spec's own suggestion.
 */
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final AppointmentRepository appointmentRepository;
    private final CurrentUserProvider currentUserProvider;
    private final NotificationService notificationService;

    public PaymentResponse create(PaymentRequest req) {
        Appointment appointment = findOwnedAppointment(req.appointmentId());

        Payment payment = new Payment();
        payment.setAppointment(appointment);
        payment.setAmount(appointment.getDoctor().getConsultationFee());
        payment.setMethod(req.method());
        applyGatewayResult(payment);

        paymentRepository.save(payment);
        return PaymentResponse.from(payment);
    }

    public PaymentResponse getByAppointment(Long appointmentId) {
        Payment payment = paymentRepository.findByAppointment_AppointmentId(appointmentId)
                .orElseThrow(() -> new IllegalStateException("No payment found for this appointment"));
        return PaymentResponse.from(payment);
    }

    public PaymentResponse retry(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new IllegalStateException("Payment not found"));
        if (payment.getStatus() != PaymentStatus.FAILED) {
            throw new IllegalStateException("Only a failed payment can be retried");
        }
        applyGatewayResult(payment);
        paymentRepository.save(payment);
        return PaymentResponse.from(payment);
    }

    private void applyGatewayResult(Payment payment) {
        boolean succeeded = ThreadLocalRandom.current().nextInt(10) != 0;
        if (succeeded) {
            payment.setStatus(PaymentStatus.SUCCESS);
            payment.setPaidAt(LocalDateTime.now());
            notificationService.send(payment.getAppointment().getPatient(), payment.getAppointment(),
                    NotificationType.PAYMENT,
                    "Payment of Rs. " + payment.getAmount() + " for " + payment.getAppointment().getReferenceNo()
                            + " was successful.");
        } else {
            payment.setStatus(PaymentStatus.FAILED);
        }
    }

    private Appointment findOwnedAppointment(Long appointmentId) {
        var patient = currentUserProvider.getCurrentUser();
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new IllegalStateException("Appointment not found"));
        if (!appointment.getPatient().getUserId().equals(patient.getUserId())) {
            throw new IllegalStateException("You cannot pay for this appointment");
        }
        return appointment;
    }
}
