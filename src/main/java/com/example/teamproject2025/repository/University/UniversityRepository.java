package com.example.teamproject2025.repository.User;

import com.example.teamproject2025.entity.University.University;
import org.springframework.data.domain.Limit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UniversityRepository extends JpaRepository<University, Integer> {
    Optional<University> findByUniversityName(String universityName);
}
