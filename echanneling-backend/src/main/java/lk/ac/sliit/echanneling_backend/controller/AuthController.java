package lk.ac.sliit.echanneling_backend.controller;

import jakarta.validation.Valid;
import lk.ac.sliit.echanneling_backend.dto.LoginRequest;
import lk.ac.sliit.echanneling_backend.dto.RegisterRequest;
import lk.ac.sliit.echanneling_backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        authService.register(req);
        return ResponseEntity.ok(Map.of("message", "Registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        String token = authService.login(req);
        return ResponseEntity.ok(Map.of("token", token));
    }
}
