package com.example.teamproject2025.controller.User;

import com.example.teamproject2025.dto.Common.CommonResponseDto;
import com.example.teamproject2025.dto.User.*;
import com.example.teamproject2025.service.User.BanUserService;
import com.example.teamproject2025.service.User.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "User", description = "User-related APIs")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users") // API 엔드포인트
public class UserController {

    private final UserService userService;
    private final BanUserService banUserService;

    // 사용자 등록
    @PostMapping("/register")
    public ResponseEntity<CommonResponseDto<UserResponseDto>> register(@RequestBody @Valid UserCreateRequestDto userCreateRequestDto) {
        UserResponseDto userResponse = userService.register(userCreateRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(CommonResponseDto.success(HttpStatus.CREATED.value(), "User registered successfully", userResponse));
    }

    @Operation(
            summary = "회원 탈퇴",
            description = "현재 로그인 된 계정 회원 탈퇴"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "User successfully deleted",
                    content = @Content(mediaType = "application/json", schema = @Schema(example = """
        {
          "message": "User successfully deleted",
          "status": 200,
          "data": null
        }
        """))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized",
                    content = @Content(mediaType = "application/json", schema = @Schema(example = """
        {
          "message": "Unauthorized: Authentication is required.",
          "status": 401,
          "data": null
        }
        """))
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Forbidden",
                    content = @Content(mediaType = "application/json", schema = @Schema(example = """
        {
          "message": "Forbidden: Access to the resource is denied.",
          "status": 403,
          "data": null
        }
        """))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Not Found",
                    content = @Content(mediaType = "application/json", schema = @Schema(example = """
        {
          "message": "Not Found: The requested resource could not be found.",
          "status": 404,
          "data": null
        }
        """))
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Internal server error.",
                    content = @Content(mediaType = "application/json", schema = @Schema(example = """
        {
          "message": "Internal Server Error: An unexpected error occurred.",
          "status": 500,
          "data": null
        }
        """))
            )
    })
    @DeleteMapping()
    public ResponseEntity<CommonResponseDto<Void>> deleteUser(HttpSession session) {
        session.setAttribute("deleted_mail_verified",true);
        userService.deleteUser(session);
        return ResponseEntity.status(HttpStatus.OK)
                .body(CommonResponseDto.success(HttpStatus.OK.value(), "User deleted successfully"));
    }

    @GetMapping("/list")
    public ResponseEntity<?> userList(){
        List<UserListResDto> dtos = userService.findAll();
        return ResponseEntity.status(HttpStatus.OK)
                .body(CommonResponseDto.success(HttpStatus.OK.value(), "User List", dtos));
    }

    // 현재 로그인된 사용자 정보 조회 API
    @GetMapping("/profile")
    public ResponseEntity<CommonResponseDto<UserResponseDto>> getUserProfile(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(CommonResponseDto.error(HttpStatus.UNAUTHORIZED.value(), "로그인이 필요합니다."));
        }

        UserResponseDto userResponse = userService.getUserProfile(userId);

        return ResponseEntity.ok(
                CommonResponseDto.success(HttpStatus.OK.value(), "사용자 정보 조회 성공", userResponse)
        );
    }

    @PatchMapping("/profile")
    public ResponseEntity<UserResponseDto> updateUserProfile(
            HttpSession session, @RequestBody UserUpdateRequestDto dto) {

        Long userId = (Long) session.getAttribute("userId"); // 세션에서 유저 ID 가져오기
        if (userId == null) {
            return ResponseEntity.status(401).build(); // 로그인되지 않은 경우
        }
        System.out.println("Session User ID: " + userId);

        UserResponseDto updatedUser = userService.updateUserProfile(userId, dto);
        return ResponseEntity.ok(updatedUser);
    }

    @Operation(
            summary = "특정 사용자 프로필 조회",
            description = "특정 사용자 프로필 조회"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Successfully retrieved user profile.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = UserResponseDto.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized",
                    content = @Content(mediaType = "application/json", schema = @Schema(example = """
        {
          "message": "Unauthorized: Authentication is required.",
          "status": 401,
          "data": null
        }
        """))
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Forbidden",
                    content = @Content(mediaType = "application/json", schema = @Schema(example = """
        {
          "message": "Forbidden: Access to the resource is denied.",
          "status": 403,
          "data": null
        }
        """))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Not Found",
                    content = @Content(mediaType = "application/json", schema = @Schema(example = """
        {
          "message": "Not Found: The requested resource could not be found.",
          "status": 404,
          "data": null
        }
        """))
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Internal server error.",
                    content = @Content(mediaType = "application/json", schema = @Schema(example = """
        {
          "message": "Internal Server Error: An unexpected error occurred.",
          "status": 500,
          "data": null
        }
        """))
            )
    })
    @GetMapping("/{userId}/profile")
    public ResponseEntity<CommonResponseDto<UserResponseDto>> getUserProfile(@PathVariable Long userId) {
        UserResponseDto userProfile = userService.getUserProfile(userId);
        return ResponseEntity.ok(
                CommonResponseDto.success(200, "User profile retrieved successfully", userProfile)
        );
    }

    // 사용자 프로필 이미지를 기본 이미지로 설정
    @PatchMapping("/profile/image/reset")
    public ResponseEntity<CommonResponseDto<Void>> resetUserProfileImage(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(CommonResponseDto.error(HttpStatus.UNAUTHORIZED.value(), "로그인이 필요합니다."));
        }

        userService.resetUserProfileImage(userId);
        return ResponseEntity.ok(CommonResponseDto.success(200, "기본 프로필 이미지로 변경 완료"));
    }

    @PutMapping("/ban-user/{userId}")
    public ResponseEntity<CommonResponseDto<BanUserResponseDto>> updateBanUserInfo(@PathVariable Long userId){
        System.out.println("\n\nTEST is Well?\n\n");
        BanUserResponseDto banUserDto = banUserService.updateBanUserInfo(userId);
        return ResponseEntity.status(HttpStatus.OK)
                .body(CommonResponseDto.success(HttpStatus.OK.value(), "Complete Ban User Info", banUserDto));
    }
}
