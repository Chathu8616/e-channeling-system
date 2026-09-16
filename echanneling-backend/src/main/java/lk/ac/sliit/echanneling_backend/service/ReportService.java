package lk.ac.sliit.echanneling_backend.service;

import lk.ac.sliit.echanneling_backend.dto.AppointmentResponse;
import lk.ac.sliit.echanneling_backend.dto.DailySummaryResponse;
import lk.ac.sliit.echanneling_backend.dto.PaymentResponse;
import lk.ac.sliit.echanneling_backend.model.Appointment;
import lk.ac.sliit.echanneling_backend.model.AppointmentStatus;
import lk.ac.sliit.echanneling_backend.model.Payment;
import lk.ac.sliit.echanneling_backend.model.PaymentStatus;
import lk.ac.sliit.echanneling_backend.repository.AppointmentRepository;
import lk.ac.sliit.echanneling_backend.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final AppointmentRepository appointmentRepository;
    private final PaymentRepository paymentRepository;

    public List<AppointmentResponse> getAppointmentsReport(LocalDate from, LocalDate to) {
        return appointmentRepository.findByAppointmentDateBetween(from, to)
                .stream()
                .map(AppointmentResponse::from)
                .toList();
    }

    public List<PaymentResponse> getPaymentsReport(LocalDate from, LocalDate to) {
        return paymentRepository.findByPaidAtBetween(from.atStartOfDay(), to.plusDays(1).atStartOfDay())
                .stream()
                .map(PaymentResponse::from)
                .toList();
    }

    public DailySummaryResponse getDailySummary(LocalDate date) {
        List<Appointment> appointments = appointmentRepository.findByAppointmentDateBetween(date, date);
        long cancelled = appointments.stream().filter(a -> a.getStatus() == AppointmentStatus.CANCELLED).count();

        List<Payment> payments = paymentRepository.findByPaidAtBetween(date.atStartOfDay(), date.plusDays(1).atStartOfDay());
        BigDecimal revenue = payments.stream()
                .filter(p -> p.getStatus() == PaymentStatus.SUCCESS)
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new DailySummaryResponse(date, appointments.size(), cancelled, revenue);
    }

    public byte[] exportAppointmentsExcel(LocalDate from, LocalDate to) {
        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Appointments");
            Row header = sheet.createRow(0);
            String[] columns = {"Reference No", "Doctor", "Specialty", "Date", "Time", "Status"};
            for (int i = 0; i < columns.length; i++) {
                header.createCell(i).setCellValue(columns[i]);
            }

            List<AppointmentResponse> rows = getAppointmentsReport(from, to);
            for (int i = 0; i < rows.size(); i++) {
                AppointmentResponse a = rows.get(i);
                Row row = sheet.createRow(i + 1);
                row.createCell(0).setCellValue(a.referenceNo());
                row.createCell(1).setCellValue(a.doctorName());
                row.createCell(2).setCellValue(a.specialty());
                row.createCell(3).setCellValue(a.appointmentDate().toString());
                row.createCell(4).setCellValue(a.timeSlot().toString());
                row.createCell(5).setCellValue(a.status().name());
            }

            return toBytes(workbook);
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }

    public byte[] exportPaymentsExcel(LocalDate from, LocalDate to) {
        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Payments");
            Row header = sheet.createRow(0);
            String[] columns = {"Appointment Ref", "Amount", "Status", "Paid At"};
            for (int i = 0; i < columns.length; i++) {
                header.createCell(i).setCellValue(columns[i]);
            }

            List<PaymentResponse> rows = getPaymentsReport(from, to);
            for (int i = 0; i < rows.size(); i++) {
                PaymentResponse p = rows.get(i);
                Row row = sheet.createRow(i + 1);
                row.createCell(0).setCellValue(p.appointmentReferenceNo());
                row.createCell(1).setCellValue(p.amount().doubleValue());
                row.createCell(2).setCellValue(p.status().name());
                row.createCell(3).setCellValue(p.paidAt() != null ? p.paidAt().toString() : "");
            }

            return toBytes(workbook);
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }

    private byte[] toBytes(XSSFWorkbook workbook) throws IOException {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            workbook.write(out);
            return out.toByteArray();
        }
    }
}
