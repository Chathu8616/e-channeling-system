package lk.ac.sliit.echanneling_backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record CreateDoctorRequest(
        @NotBlank String fullName,
        @NotBlank String nic,
        @Email @NotBlank String email,
        String phone,
        @Size(min = 8, message = "Password must be at least 8 characters") String password,
        @NotBlank String specialty,
        @NotBlank String hospitalBranch,
        @NotNull @DecimalMin(value = "0", inclusive = true) BigDecimal consultationFee
) {}
