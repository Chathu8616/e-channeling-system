package lk.ac.sliit.echanneling_backend.repository;

import lk.ac.sliit.echanneling_backend.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    Optional<Doctor> findByUser_UserId(Long userId);

    @Query("""
        select d from Doctor d
        where (:specialty is null or lower(d.specialty) like lower(concat('%', :specialty, '%')))
          and (:branch is null or lower(d.hospitalBranch) like lower(concat('%', :branch, '%')))
          and (:name is null or lower(d.user.fullName) like lower(concat('%', :name, '%')))
        """)
    List<Doctor> search(String specialty, String branch, String name);
}
