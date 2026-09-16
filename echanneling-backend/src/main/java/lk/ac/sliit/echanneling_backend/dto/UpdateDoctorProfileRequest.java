package lk.ac.sliit.echanneling_backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record UpdateDoctorProfileRequest(
        @NotBlank String fullName,
        String phone,
        @NotBlank String specialty,
        @NotBlank String hospitalBranch,
        @NotNull @DecimalMin(value = "0", inclusive = true) BigDecimal consultationFee
) {}
