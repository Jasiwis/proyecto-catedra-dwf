package sv.udb.multiworksapi.employee.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import sv.udb.multiworksapi.common.exceptions.FieldValidationException;
import sv.udb.multiworksapi.employee.dto.EmployeeDto;
import sv.udb.multiworksapi.employee.dto.EmployeeResponse;
import sv.udb.multiworksapi.entity.Employee;
import sv.udb.multiworksapi.enums.ContractType;
import sv.udb.multiworksapi.enums.Status;
import sv.udb.multiworksapi.repository.EmployeeRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository repository;

    public EmployeeResponse create(EmployeeDto dto, UUID createdBy) {
        if (repository.existsByDocument(dto.document())) {
            throw new FieldValidationException("document", "Documento ya registrado");
        }

        var now = LocalDateTime.now();

        Employee employee = Employee.builder()
                .name(dto.name())
                .document(dto.document())
                .personType(dto.personType())
                .contractType(dto.contractType())
                .phone(dto.phone())
                .email(dto.email())
                .address(dto.address())
                .status(dto.status() != null ? dto.status() : Status.Activo)
                .createdBy(createdBy)
                .createdAt(now)
                .updatedAt(now)
                .build();

        return toResponse(repository.save(employee));
    }

    public List<EmployeeResponse> getAll() {
        return repository.findAll().stream().map(this::toResponse).toList();
    }

    public EmployeeResponse getById(UUID id) {
        return repository.findById(id).map(this::toResponse)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));
    }

    public EmployeeResponse update(UUID id, EmployeeDto dto, UUID updatedBy) {
        Employee employee = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));

        if (!employee.getDocument().equals(dto.document()) && repository.existsByDocument(dto.document())) {
            throw new FieldValidationException("document", "Documento ya registrado");
        }

        employee.setName(dto.name());
        employee.setDocument(dto.document());
        employee.setPersonType(dto.personType());
        employee.setContractType(dto.contractType());
        employee.setPhone(dto.phone());
        employee.setEmail(dto.email());
        employee.setAddress(dto.address());
        employee.setStatus(dto.status() != null ? dto.status() : employee.getStatus());
        employee.setUpdatedAt(LocalDateTime.now());

        return toResponse(repository.save(employee));
    }

    public EmployeeResponse toggleStatus(UUID id) {
        Employee employee = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));

        boolean isActive = employee.getStatus() == Status.Activo;

        employee.setStatus(isActive ? Status.Inactivo : Status.Activo);
        employee.setUpdatedAt(LocalDateTime.now());

        if (isActive) {
            employee.setDeactivatedAt(LocalDateTime.now());
        } else {
            employee.setDeactivatedAt(null); // Reactivado
        }

        return toResponse(repository.save(employee));
    }

    private EmployeeResponse toResponse(Employee e) {
        return EmployeeResponse.builder()
                .id(e.getId())
                .name(e.getName())
                .document(e.getDocument())
                .personType(e.getPersonType())
                .contractType(e.getContractType())
                .phone(e.getPhone())
                .email(e.getEmail())
                .address(e.getAddress())
                .status(e.getStatus())
                .createdBy(e.getCreatedBy())
                .createdAt(e.getCreatedAt())
                .updatedAt(e.getUpdatedAt())
                .deactivatedAt(e.getDeactivatedAt())
                .build();
    }
}
