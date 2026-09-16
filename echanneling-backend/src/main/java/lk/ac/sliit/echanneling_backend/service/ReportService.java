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
import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.awt.Color;
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

    public byte[] exportAppointmentsPdf(LocalDate from, LocalDate to) {
        List<AppointmentResponse> rows = getAppointmentsReport(from, to);
        String[] columns = {"Reference No", "Doctor", "Specialty", "Date", "Time", "Status"};
        List<String[]> data = rows.stream()
                .map(a -> new String[]{
                        a.referenceNo(), a.doctorName(), a.specialty(),
                        a.appointmentDate().toString(), a.timeSlot().toString(), a.status().name()
                })
                .toList();
        return buildPdf("Appointments Report", from, to, columns, data);
    }

    public byte[] exportPaymentsPdf(LocalDate from, LocalDate to) {
        List<PaymentResponse> rows = getPaymentsReport(from, to);
        String[] columns = {"Appointment Ref", "Amount", "Status", "Paid At"};
        List<String[]> data = rows.stream()
                .map(p -> new String[]{
                        p.appointmentReferenceNo(), "Rs. " + p.amount(), p.status().name(),
                        p.paidAt() != null ? p.paidAt().toString() : "-"
                })
                .toList();
        return buildPdf("Payments Report", from, to, columns, data);
    }

    private byte[] buildPdf(String title, LocalDate from, LocalDate to, String[] columns, List<String[]> rows) {
        Document document = new Document(PageSize.A4);
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Font subFont = FontFactory.getFont(FontFactory.HELVETICA, 11, Color.GRAY);
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.WHITE);
            Font cellFont = FontFactory.getFont(FontFactory.HELVETICA, 10);

            Paragraph heading = new Paragraph(title, titleFont);
            heading.setSpacingAfter(4);
            document.add(heading);

            Paragraph range = new Paragraph("E-Channeling System — " + from + " to " + to, subFont);
            range.setSpacingAfter(16);
            document.add(range);

            PdfPTable table = new PdfPTable(columns.length);
            table.setWidthPercentage(100);

            for (String column : columns) {
                PdfPCell cell = new PdfPCell(new Paragraph(column, headerFont));
                cell.setBackgroundColor(new Color(40, 55, 121));
                cell.setPadding(6);
                cell.setHorizontalAlignment(Element.ALIGN_LEFT);
                table.addCell(cell);
            }

            for (String[] row : rows) {
                for (String value : row) {
                    PdfPCell cell = new PdfPCell(new Paragraph(value, cellFont));
                    cell.setPadding(5);
                    table.addCell(cell);
                }
            }

            if (rows.isEmpty()) {
                PdfPCell empty = new PdfPCell(new Paragraph("No records for this date range.", cellFont));
                empty.setColspan(columns.length);
                empty.setPadding(8);
                table.addCell(empty);
            }

            document.add(table);
            document.close();
            return out.toByteArray();
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        } catch (com.lowagie.text.DocumentException e) {
            throw new RuntimeException("Failed to generate PDF report", e);
        }
    }
}
