package lk.ac.sliit.echanneling_backend.controller;

import lk.ac.sliit.echanneling_backend.dto.AppointmentResponse;
import lk.ac.sliit.echanneling_backend.dto.DailySummaryResponse;
import lk.ac.sliit.echanneling_backend.dto.PaymentResponse;
import lk.ac.sliit.echanneling_backend.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('OPERATIONS_MANAGER', 'DOCTOR')")
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/appointments")
    public List<AppointmentResponse> appointments(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return reportService.getAppointmentsReport(from, to);
    }

    @GetMapping("/appointments/export")
    public ResponseEntity<byte[]> exportAppointments(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return excelResponse(reportService.exportAppointmentsExcel(from, to), "appointments-report.xlsx");
    }

    @GetMapping("/appointments/export/pdf")
    public ResponseEntity<byte[]> exportAppointmentsPdf(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return pdfResponse(reportService.exportAppointmentsPdf(from, to), "appointments-report.pdf");
    }

    @GetMapping("/payments")
    public List<PaymentResponse> payments(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return reportService.getPaymentsReport(from, to);
    }

    @GetMapping("/payments/export")
    public ResponseEntity<byte[]> exportPayments(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return excelResponse(reportService.exportPaymentsExcel(from, to), "payments-report.xlsx");
    }

    @GetMapping("/payments/export/pdf")
    public ResponseEntity<byte[]> exportPaymentsPdf(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return pdfResponse(reportService.exportPaymentsPdf(from, to), "payments-report.pdf");
    }

    @GetMapping("/summary/daily")
    public DailySummaryResponse dailySummary(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return reportService.getDailySummary(date);
    }

    private ResponseEntity<byte[]> excelResponse(byte[] content, String filename) {
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .body(content);
    }

    private ResponseEntity<byte[]> pdfResponse(byte[] content, String filename) {
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .body(content);
    }
}
