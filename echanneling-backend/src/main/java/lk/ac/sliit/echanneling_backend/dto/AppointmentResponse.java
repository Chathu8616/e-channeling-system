package lk.ac.sliit.echanneling_backend.dto;

import lk.ac.sliit.echanneling_backend.model.Appointment;
import lk.ac.sliit.echanneling_backend.model.AppointmentStatus;

import java.time.LocalDate;
import java.time.LocalTime;

public record AppointmentResponse(
        Long appointmentId,
        String referenceNo,
        String doctorName,
        String specialty,
        LocalDate appointmentDate,
        LocalTime timeSlot,
        AppointmentStatus status
) {
    public static AppointmentResponse from(Appointment appointment) {
        return new AppointmentResponse(
                appointment.getAppointmentId(),
                appointment.getReferenceNo(),
                appointment.getDoctor().getUser().getFullName(),
                appointment.getDoctor().getSpecialty(),
                appointment.getAppointmentDate(),
                appointment.getTimeSlot(),
                appointment.getStatus()
        );
    }
}
