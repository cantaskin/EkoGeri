package com.recycling.service;

import com.recycling.dto.user.UpdateProfileRequest;
import com.recycling.dto.user.UpdateRoleRequest;
import com.recycling.dto.user.UserResponse;
import com.recycling.model.User;
import com.recycling.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserResponse getMe(User currentUser) {
        return toResponse(currentUser);
    }

    public UserResponse updateProfile(User currentUser, UpdateProfileRequest request) {
        currentUser.setFullName(request.getFullName());
        return toResponse(userRepository.save(currentUser));
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream().map(this::toResponse).toList();
    }

    public UserResponse updateRole(Long userId, UpdateRoleRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Kullanıcı bulunamadı."));
        user.setRole(request.getRole());
        return toResponse(userRepository.save(user));
    }

    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }

    public UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .points(user.getPoints())
                .totalWasteKg(user.getTotalWasteKg())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
