package com.team3.ministore.controller;

import com.team3.ministore.common.responsehandler.ResponseHandler;
import com.team3.ministore.dto.LoginDto;
import com.team3.ministore.jwt.JwtUtils;
import com.team3.ministore.service.StaffService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(Jwts.class);
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final StaffService staffService;

    public AuthController(AuthenticationManager authManager, JwtUtils jwtUtils, StaffService staffService) {
        authenticationManager = authManager;
        this.jwtUtils = jwtUtils;
        this.staffService = staffService;
    }

    @PostMapping("/login")
    public Object login(@Valid @RequestBody LoginDto dto, BindingResult errors) {
        if (errors.hasErrors())
            return ResponseHandler.getResponse(errors, HttpStatus.BAD_REQUEST);

        Authentication auth = null;

        try {
            auth = authenticationManager.authenticate
                    (new UsernamePasswordAuthenticationToken(dto.getUsername(), dto.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(auth);
            String token = jwtUtils.generateJwtToken(auth);
            return ResponseHandler.getResponse(token, HttpStatus.OK);
        } catch (Exception e) {
            logger.debug("{} has been logged in with wrong password: {}", dto.getUsername(), e.getMessage());
        }
        return ResponseHandler.getResponse(new Exception("Username or Password is invalid."), HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/current-staff")
    public Object getCurrentUser(HttpServletRequest request) {
        String token = jwtUtils.getJwtTokenFromRequest(request);
        if (token == null)
            return ResponseHandler.getResponse("Please sign in first.", HttpStatus.BAD_REQUEST);
        try {
            String username = jwtUtils.getUsernameFromToken(token);
            return ResponseHandler.getResponse(staffService.getCurrentStaffByUsername(username), HttpStatus.OK);
        } catch (SignatureException e) {
            e.printStackTrace();
            return ResponseHandler.getResponse(e, HttpStatus.FORBIDDEN);
        } catch (MalformedJwtException e) {
            e.printStackTrace();
            return ResponseHandler.getResponse("Forbidden request.", HttpStatus.FORBIDDEN);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseHandler.getResponse(e, HttpStatus.BAD_REQUEST);
        }
    }
}
