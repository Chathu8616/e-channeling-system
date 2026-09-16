package lk.ac.sliit.echanneling_backend.dto;

import lk.ac.sliit.echanneling_backend.model.Doctor;

import java.math.BigDecimal;

public record DoctorResponse(
        Long doctorId,
        String fullName,
        String specialty,
        String hospitalBranch,
        BigDecimal consultationFee
) {
    public static DoctorResponse from(Doctor doctor) {
        return new DoctorResponse(
                doctor.getDoctorId(),
                doctor.getUser().getFullName(),
                doctor.getSpecialty(),
                doctor.getHospitalBranch(),
                doctor.getConsultationFee()
        );
    }
}
