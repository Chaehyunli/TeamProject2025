package com.example.teamproject2025.repository;

import com.example.teamproject2025.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}

