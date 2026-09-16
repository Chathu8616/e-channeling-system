package lk.ac.sliit.echanneling_backend.dto;

import jakarta.validation.constraints.NotNull;

public record RescheduleRequest(
        @NotNull Long newSessionId
) {}
