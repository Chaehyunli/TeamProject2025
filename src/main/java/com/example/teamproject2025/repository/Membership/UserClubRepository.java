package com.example.teamproject2025.repository.Membership;

import com.example.teamproject2025.entity.Membership.UserClub;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserClubRepository extends JpaRepository<UserClub, Long> {
}
