package com.team3.ministore.controller;

import com.team3.ministore.common.responsehandler.ResponseHandler;
import com.team3.ministore.dto.LeaveRequestDto;
import com.team3.ministore.dto.SalaryDto;
import com.team3.ministore.dto.ShiftDto;
import com.team3.ministore.dto.StaffDto;
import com.team3.ministore.model.Shift;
import com.team3.ministore.model.Staff;
import com.team3.ministore.service.LeaveRequestService;
import com.team3.ministore.service.SalaryService;
import com.team3.ministore.service.ShiftService;
import com.team3.ministore.service.StaffService;
import com.team3.ministore.utils.LeaveStatus;
import com.team3.ministore.utils.ShiftCoverStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.ArrayList;
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

        if (staffId != null) {
            // Get the staff with the given staffId with their shifts and salary in the given time range
            Optional<Staff> foundStaff = staffService.getStaffById(staffId);

            if (foundStaff.isEmpty())
                return ResponseHandler.getResponse(new Exception("Staff not found"), HttpStatus.NOT_FOUND);
        }

        // Get all staffs with their shifts and salary in the given time range if staffId is not specified
        List<ShiftDto> coveredShifts = new ArrayList<>();
        // Get all staffs in the database
        List<Staff> staffs = staffService.getAllStaffs();
        // Iterate through all staffs and get their shifts and salary
        List<StaffDto> staffDtos = staffs.parallelStream().map(staff -> {
            SalaryDto salaryDto = salaryService.getSalaryByStaffId(staff.getStaffId());
            List<LeaveRequestDto> leaveRequestDtos = leaveRequestService.getLeaveRequestsByStaffIdAndDates(
                            staff.getStaffId(), fromDate, toDate
                    ).stream().filter(leaveRequestDto -> leaveRequestDto.getStatus().equals(LeaveStatus.APPROVED))
                    .collect(Collectors.toList());
            List<Shift> shifts = shiftService.getAllShiftsByStaffId(staff.getStaffId(), fromDate, toDate);
            // Convert shifts to shiftDtos
            List<ShiftDto> shiftDtos = shifts.stream()
                    .map(s -> {
                        ShiftDto sDto = new ShiftDto(s);
                        // Add the shift to coveredShifts if it is covered
                        if (s.getShiftCoverRequest() != null && s.getShiftCoverRequest().getStatus() == ShiftCoverStatus.APPROVED) {
                            sDto.setStaffId(s.getShiftCoverRequest().getStaff().getStaffId());
                            coveredShifts.add(sDto);
                        }
                        return sDto;
                    })
                    // Filter out the shifts that are covered
                    .filter(s -> !(s.getShiftCoverRequest() != null && s.getShiftCoverRequest().getStatus() == ShiftCoverStatus.APPROVED))
                    .collect(Collectors.toList());

            // Return the staffDto
            return new StaffDto(staff, salaryDto, shiftDtos, leaveRequestDtos);
        }).collect(Collectors.toList());

        // Iterate through all staffDtos and add the covered shifts to the staffDto
        List<StaffDto> result = staffDtos.stream().peek(staffDto -> coveredShifts.forEach(shiftDto -> {
            if (shiftDto.getStaffId() == staffDto.getStaffId()) {
                staffDto.getShifts().add(shiftDto);
            }
        })).collect(Collectors.toList());

        // If staffId is specified, return the staff with the given staffId
        if (staffId != null)
            return ResponseHandler.getResponse(result.stream().filter(r -> r.getStaffId() == staffId), HttpStatus.OK);

        // Return all staffs
        return ResponseHandler.getResponse(result, HttpStatus.OK);

    }
}
