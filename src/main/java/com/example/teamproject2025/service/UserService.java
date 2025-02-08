package com.example.teamproject2025.service;

import com.example.teamproject2025.dto.User.UserCreateRequestDto;
import com.example.teamproject2025.dto.User.UserDetailResponseDto;
import com.example.teamproject2025.dto.User.UserUpdateRequestDto;
import com.example.teamproject2025.repository.User.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

public interface UserService {
    UserDetailResponseDto create(UserCreateRequestDto userCreateRequestDto);
    UserDetailResponseDto update(UserUpdateRequestDto userUpdateRequestDto);
    void delete(Long id);

}
