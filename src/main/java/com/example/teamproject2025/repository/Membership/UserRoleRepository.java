package com.example.teamproject2025.repository.Membership;

import com.example.teamproject2025.entity.Membership.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, Long> {
}
