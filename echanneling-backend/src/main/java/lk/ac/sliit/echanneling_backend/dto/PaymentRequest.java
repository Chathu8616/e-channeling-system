package lk.ac.sliit.echanneling_backend.dto;

import jakarta.validation.constraints.NotNull;
import lk.ac.sliit.echanneling_backend.model.PaymentMethod;

public record PaymentRequest(
        @NotNull Long appointmentId,
        @NotNull PaymentMethod method
) {}
