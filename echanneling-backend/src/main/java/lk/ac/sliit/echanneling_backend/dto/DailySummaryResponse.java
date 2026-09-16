package lk.ac.sliit.echanneling_backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record DailySummaryResponse(
        LocalDate date,
        long totalAppointments,
        long cancelledAppointments,
        BigDecimal totalRevenue
) {}
