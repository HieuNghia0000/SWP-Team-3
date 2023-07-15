package com.team3.ministore.controller;

import com.team3.ministore.common.responsehandler.ResponseHandler;
import com.team3.ministore.dto.*;
import com.team3.ministore.model.Shift;
import com.team3.ministore.model.Staff;
import com.team3.ministore.service.*;
import com.team3.ministore.utils.LeaveStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/shift-planning")
public class ShiftPlanningController {
    @Autowired
    private ShiftService shiftService;
    @Autowired
    private StaffService staffService;
    @Autowired
    private SalaryService salaryService;
    @Autowired
    private LeaveRequestService leaveRequestService;
    @Autowired
    private ShiftCoverRequestService shiftCoverRequestService;

    @GetMapping()
    public ResponseEntity<Object> getShiftPlanning(@RequestParam(value = "from", required = false) String from,
                                                   @RequestParam(value = "to", required = false) String to,
                                                   @RequestParam(value = "staffId", required = false) Integer staffId) {
        if (from == null || to == null)
            return ResponseHandler.getResponse(new Exception("Invalid input"), HttpStatus.BAD_REQUEST);

        LocalDate fromDate = LocalDate.parse(from);
        LocalDate toDate = LocalDate.parse(to);

        if (fromDate.isAfter(toDate))
            return ResponseHandler.getResponse(new Exception("Invalid input"), HttpStatus.BAD_REQUEST);

        // Get all staffs if staffId is not specified
        if (staffId == null) {
            // Get all staffs in the database
            List<Staff> staffs = staffService.getAllStaffs();
            // Iterate through all staffs and get their shifts and salary
            List<StaffDto> staffDtos = staffs.parallelStream().map(staff -> {
                // Get the salary and leave requests of the staff
                SalaryDto salaryDto = salaryService.getSalaryByStaffId(staff.getStaffId());
                List<LeaveRequestDto> leaveRequestDtos = leaveRequestService
                        .getLeaveRequestsByStaffIdAndDates(staff.getStaffId(), fromDate, toDate)
                        .stream().filter(leaveRequestDto -> leaveRequestDto.getStatus().equals(LeaveStatus.APPROVED))
                        .collect(Collectors.toList());
                // Get the shifts of the staff
                List<Shift> shifts = shiftService.getAllShiftsByStaffId(staff.getStaffId(), fromDate, toDate);
                // Convert shifts to shiftDtos
                List<ShiftDto> shiftDtos = shifts.stream().map(ShiftDto::new).collect(Collectors.toList());

                // Return the staffDtos
                return new StaffDto(staff, salaryDto, shiftDtos, leaveRequestDtos);
            }).collect(Collectors.toList());

            // Return all staffs
            return ResponseHandler.getResponse(staffDtos, HttpStatus.OK);
        }

        // ------------------------------------------------------------
        // If staffId is specified, return the staff with the given staffId
        Optional<Staff> foundStaff = staffService.getStaffById(staffId);

        if (foundStaff.isEmpty())
            return ResponseHandler.getResponse(new Exception("Staff not found"), HttpStatus.NOT_FOUND);

        SalaryDto salaryDto = salaryService.getSalaryByStaffId(foundStaff.get().getStaffId());
        List<LeaveRequestDto> leaveRequestDtos = leaveRequestService
                .getLeaveRequestsByStaffIdAndDates(foundStaff.get().getStaffId(), fromDate, toDate)
                .stream().filter(leaveRequestDto -> leaveRequestDto.getStatus().equals(LeaveStatus.APPROVED))
                .collect(Collectors.toList());
        // Get the shifts of the staff
        List<Shift> shifts = shiftService.getAllShiftsByStaffId(foundStaff.get().getStaffId(), fromDate, toDate);


        // Convert shifts to shiftDtos
        List<ShiftDto> shiftDtos = shifts.stream().map(ShiftDto::new).collect(Collectors.toList());

        // Get the shifts which are covered by the staff
        List<ShiftCoverDto> shiftCoverDtos = shiftCoverRequestService.getShiftCoverRequestsByStaffId(foundStaff.get().getStaffId());

        // Add the shifts which are covered by the staff to the shiftDtos
        shiftCoverDtos.stream().map(ShiftCoverDto::getShift)
                .forEach(shift -> {
                    if (shiftDtos.stream().noneMatch(shift1 -> shift1.getShiftId() == shift.getShiftId())){
                        shiftDtos.add(shift);
                    }
                });

        // Return the staffDtos
        return ResponseHandler.getResponse(new StaffDto(foundStaff.get(), salaryDto, shiftDtos, leaveRequestDtos), HttpStatus.OK);
    }
}
