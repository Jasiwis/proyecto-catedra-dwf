package sv.udb.puntoeventoapi.modules.user.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sv.udb.puntoeventoapi.modules.user.entity.User;
import sv.udb.puntoeventoapi.modules.commons.enums.UserType;
import sv.udb.puntoeventoapi.modules.user.repository.UserRepository;
import sv.udb.puntoeventoapi.modules.user.dto.UserDto;
import sv.udb.puntoeventoapi.modules.user.dto.UserResponse;
import sv.udb.puntoeventoapi.modules.user.dto.UserUpdateDto;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsersList() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getUsersByType(UserType userType) {
        return userRepository.findByUserType(userType)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return mapToResponse(user);
    }

    @Transactional(readOnly = true)
    public UserResponse getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return mapToResponse(user);
    }

    public UserResponse createUser(UserDto userDto) {
        // Verificar si el email ya existe
        if (userRepository.findByEmail(userDto.getEmail()).isPresent()) {
            throw new RuntimeException("El email ya está registrado");
        }

        User user = User.builder()
                .name(userDto.getName())
                .email(userDto.getEmail())
                .password(passwordEncoder.encode(userDto.getPassword()))
                .userType(userDto.getUserType())
                .active(userDto.getActive() != null ? userDto.getActive() : true)
                .createdAt(LocalDateTime.now().format(formatter))
                .updatedAt(LocalDateTime.now().format(formatter))
                .build();

        User savedUser = userRepository.save(user);
        return mapToResponse(savedUser);
    }

    public UserResponse updateUser(UUID id, UserUpdateDto userUpdateDto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Verificar si el nuevo email ya existe (si se está cambiando)
        if (userUpdateDto.getEmail() != null && !userUpdateDto.getEmail().equals(user.getEmail())) {
            if (userRepository.findByEmail(userUpdateDto.getEmail()).isPresent()) {
                throw new RuntimeException("El email ya está registrado");
            }
            user.setEmail(userUpdateDto.getEmail());
        }

        if (userUpdateDto.getName() != null) {
            user.setName(userUpdateDto.getName());
        }

        if (userUpdateDto.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(userUpdateDto.getPassword()));
        }

        if (userUpdateDto.getUserType() != null) {
            user.setUserType(userUpdateDto.getUserType());
        }

        if (userUpdateDto.getActive() != null) {
            user.setActive(userUpdateDto.getActive());
        }

        user.setUpdatedAt(LocalDateTime.now().format(formatter));
        User savedUser = userRepository.save(user);
        return mapToResponse(savedUser);
    }

    public void deleteUser(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        userRepository.delete(user);
    }

    public void deactivateUser(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        user.setActive(false);
        user.setUpdatedAt(LocalDateTime.now().format(formatter));
        userRepository.save(user);
    }

    private UserResponse mapToResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setUserType(user.getUserType());
        response.setActive(user.getActive());
        response.setCreatedAt(user.getCreatedAt());
        response.setUpdatedAt(user.getUpdatedAt());
        return response;
    }
}
