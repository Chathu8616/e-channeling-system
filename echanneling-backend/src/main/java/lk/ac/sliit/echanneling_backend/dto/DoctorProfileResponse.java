package lk.ac.sliit.echanneling_backend.dto;

import lk.ac.sliit.echanneling_backend.model.Doctor;

import java.math.BigDecimal;

/** Like DoctorResponse, but includes contact details only the doctor themselves should see. */
public record DoctorProfileResponse(
        Long doctorId,
        String fullName,
        String email,
        String phone,
        String specialty,
        String hospitalBranch,
        BigDecimal consultationFee
) {
    public static DoctorProfileResponse from(Doctor doctor) {
        return new DoctorProfileResponse(
                doctor.getDoctorId(),
                doctor.getUser().getFullName(),
                doctor.getUser().getEmail(),
                doctor.getUser().getPhone(),
                doctor.getSpecialty(),
                doctor.getHospitalBranch(),
                doctor.getConsultationFee()
        );
    }
}
