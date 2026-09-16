package lk.ac.sliit.echanneling_backend.dto;

import lk.ac.sliit.echanneling_backend.model.Payment;
import lk.ac.sliit.echanneling_backend.model.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PaymentResponse(
        Long paymentId,
        String appointmentReferenceNo,
        BigDecimal amount,
        PaymentStatus status,
        LocalDateTime paidAt
) {
    public static PaymentResponse from(Payment payment) {
        return new PaymentResponse(
                payment.getPaymentId(),
                payment.getAppointment().getReferenceNo(),
                payment.getAmount(),
                payment.getStatus(),
                payment.getPaidAt()
        );
    }
}
