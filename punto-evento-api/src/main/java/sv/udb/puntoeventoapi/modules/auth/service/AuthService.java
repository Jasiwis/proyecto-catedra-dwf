package sv.udb.puntoeventoapi.modules.auth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import sv.udb.puntoeventoapi.modules.auth.dto.*;
import sv.udb.puntoeventoapi.modules.commons.common.exceptions.FieldValidationException;
import sv.udb.puntoeventoapi.modules.commons.enums.UserType;
import sv.udb.puntoeventoapi.config.jwt.JwtUtil;
import sv.udb.puntoeventoapi.config.security.UserDetailsServiceImpl;
import sv.udb.puntoeventoapi.modules.user.entity.User;
import sv.udb.puntoeventoapi.modules.user.repository.UserRepository;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;


@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserDetailsServiceImpl userDetailsService;
    private final PasswordEncoder passwordEncoder;
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public UserResponse register(RegisterDto dto) {
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new FieldValidationException("email", "El correo ya está registrado");
        }

        User user = User.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .userType(UserType.CLIENT) // Solo se pueden registrar CLIENTs desde el endpoint público
                .active(true)
                .createdAt(LocalDateTime.now().format(formatter))
                .updatedAt(LocalDateTime.now().format(formatter))
                .build();

        userRepository.save(user);
        return toResponse(user);
    }

    public AuthResponse login(LoginDto dto) {
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Credenciales inválidas"));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new RuntimeException("Credenciales inválidas");
        }

        String token = jwtUtil.generateToken(user.getId().toString());

        return AuthResponse.builder()
                .token(token)
                .user(toResponse(user))
                .build();
    }

    public UserResponse getMe(User dto) {
        User user = userRepository.findById(UUID.fromString(dto.getId().toString()))
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return toResponse(user);
    }

    private UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId().toString())
                .name(user.getName())
                .email(user.getEmail())
                .userType(user.getUserType())
                .active(user.getActive())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
