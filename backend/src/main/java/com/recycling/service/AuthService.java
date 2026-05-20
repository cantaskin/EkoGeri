package com.recycling.service;

import com.recycling.dto.auth.*;
import com.recycling.model.Role;
import com.recycling.model.User;
import com.recycling.repository.UserRepository;
import com.recycling.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Bu e-posta adresi zaten kullanılıyor.");
        }
        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(Role.CITIZEN)
                .points(0)
                .totalWasteKg(0.0)
                .build();
        userRepository.save(user);
        String token = jwtService.generateToken(user);
        return buildResponse(token, user);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();
        String token = jwtService.generateToken(user);
        return buildResponse(token, user);
    }

    public void forgotPassword(ForgotPasswordRequest request) {
        // MVP: sadece kullanıcının var olup olmadığını kontrol et
        // Gerçek uygulamada e-posta gönderilir
        userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Bu e-posta ile kayıtlı kullanıcı bulunamadı."));
    }

    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Kullanıcı bulunamadı."));
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    private AuthResponse buildResponse(String token, User user) {
        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .points(user.getPoints())
                .build();
    }
}
