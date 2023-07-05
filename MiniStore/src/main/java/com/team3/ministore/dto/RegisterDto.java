package com.team3.ministore.dto;

import com.team3.ministore.utils.Role;
import com.team3.ministore.utils.StaffStatus;
import com.team3.ministore.validation.annotation.ExistEmail;
import com.team3.ministore.validation.annotation.ExistUsername;
import lombok.Data;
import org.springframework.lang.Nullable;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Date;

@Data
public class RegisterDto {
    @ExistUsername
    @NotBlank(message = "Username must not be blank")
    private String username;

    @NotBlank(message = "Password must not be blank")
    private String password;

    @ExistEmail
    @Email
    @NotBlank(message = "Email must not be blank")
    private String email;

    @NotBlank(message = "Staff name must not be blank")
    private String staffName;

    @NotNull(message = "Role must not be blank")
    private Role role;

    @Nullable
    private String phoneNumber;

    @Nullable
    private StaffStatus status;

    @Nullable
    private String image;

    @Nullable
    private String workDays;

    @Nullable
    private Integer leaveBalance;

    @NotNull(message = "Hourly wage must not be null")
    private String hourlyWage;

    @NotNull(message = "EffectiveDate name must not be null")
    private Date effectiveDate;

    @NotNull(message = "TerminationDate name must not be null")
    private Date terminationDate;
}
