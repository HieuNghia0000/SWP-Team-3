package com.team3.ministore.service.impl;

import com.team3.ministore.dto.LeaveRequestDto;
import com.team3.ministore.dto.ShiftDto;
import com.team3.ministore.dto.StaffDto;
import com.team3.ministore.dto.TimesheetDto;
import com.team3.ministore.model.Salary;
import com.team3.ministore.model.Shift;
import com.team3.ministore.model.Staff;
import com.team3.ministore.model.Timesheet;
import com.team3.ministore.repository.SalaryRepository;
import com.team3.ministore.repository.TimesheetRepository;
import com.team3.ministore.service.LeaveRequestService;
import com.team3.ministore.service.ShiftService;
import com.team3.ministore.service.StaffService;
import com.team3.ministore.service.TimesheetService;
import com.team3.ministore.utils.LeaveStatus;
import com.team3.ministore.utils.TimesheetStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.sql.Time;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TimesheetServiceImpl implements TimesheetService {

    @Autowired
    private TimesheetRepository timesheetRepository;

    @Autowired
    private SalaryRepository salaryRepository;

    @Autowired
    private LeaveRequestService leaveRequestService;

    @Autowired
    private StaffService staffService;

    @Autowired
    private ShiftService shiftService;

    @Override
    public List<TimesheetDto> getAllTimeSheets(int page, int pageSize, LocalDate fromDate, LocalDate toDate) {
        Pageable pageable = PageRequest.of(page - 1, pageSize);
        return timesheetRepository.findAllByShift_DateBetween(fromDate, toDate, pageable).stream().map(t -> {
                    // Get the salary and leave requests of the staff
                    List<LeaveRequestDto> leaveRequestDtos = leaveRequestService
                            .getLeaveRequestsByStaffIdAndDates(t.getStaff().getStaffId(), fromDate, toDate)
                            .stream().filter(leaveRequestDto -> leaveRequestDto.getStatus().equals(LeaveStatus.APPROVED))
                            .collect(Collectors.toList());

                    // Set the salary and leave requests to the staff
                    TimesheetDto dto = new TimesheetDto(t, true, true, true);
                    dto.getStaff().setLeaveRequests(leaveRequestDtos);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<TimesheetDto> getAllTimeSheets(String search, int page, int pageSize, LocalDate fromDate, LocalDate toDate) {
        Pageable pageable = PageRequest.of(page - 1, pageSize);

        return timesheetRepository.findByStaff_StaffNameContainingIgnoreCaseAndShift_DateBetweenOrderByTimesheetIdDesc(search, fromDate, toDate, pageable)
                .stream().map(t -> {
                    List<LeaveRequestDto> leaveRequestDtos = leaveRequestService
                            .getLeaveRequestsByStaffIdAndDates(t.getStaff().getStaffId(), fromDate, toDate)
                            .stream().filter(leaveRequestDto -> leaveRequestDto.getStatus().equals(LeaveStatus.APPROVED))
                            .collect(Collectors.toList());

                    // Set the salary and leave requests to the staff
                    TimesheetDto dto = new TimesheetDto(t, true, true, true);
                    dto.getStaff().setLeaveRequests(leaveRequestDtos);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public Timesheet createTimesheet(TimesheetDto dto, Shift shift, Staff staff) {
        Timesheet timesheet = new Timesheet();
        // Get the salary of the staff at the time of the attendance record
        Salary salary = salaryRepository.findSalaryInformationByStaffId(staff.getStaffId()).orElse(null);

        return saveTimesheet(
                timesheet,
                shift,
                staff,
                salary,
                dto.getCheckInTime(),
                dto.getCheckOutTime(),
                dto.getStatus(),
                dto.getNoteTitle(),
                dto.getNoteContent()
        );
    }

    @Override
    public Optional<Timesheet> getTimesheetById(Integer id) {
        return timesheetRepository.findById(id);
    }

    @Override
    public Optional<Timesheet> updateTimesheet(Integer id, TimesheetDto timesheet, Shift shift, Staff staff) {
        Optional<Timesheet> existingTimesheet = getTimesheetById(id);

        return existingTimesheet.map(value -> saveTimesheet(
                value,
                shift,
                staff,
                value.getSalary(),
                timesheet.getCheckInTime(),
                timesheet.getCheckOutTime(),
                timesheet.getStatus(),
                timesheet.getNoteTitle(),
                timesheet.getNoteContent()
        ));
    }

    @Override
    public void deleteTimesheet(Integer id) {
        timesheetRepository.deleteById(id);
    }

    @Override
    public List<StaffDto> getPayroll(String s, LocalDate fromDate, LocalDate toDate) {
        List<Staff> staffs = staffService.getAllStaffs(s);

        // Iterate through all staffs and get their shifts and salary
        return staffs.parallelStream().map(staff -> {
            // Get the salary and leave requests of the staff
            List<LeaveRequestDto> leaveRequestDtos = leaveRequestService
                    .getLeaveRequestsByStaffIdAndDates(staff.getStaffId(), fromDate, toDate)
                    .stream().filter(leaveRequestDto -> leaveRequestDto.getStatus().equals(LeaveStatus.APPROVED))
                    .collect(Collectors.toList());
            // Get the shifts of the staff
            List<Shift> shifts = shiftService.getAllShiftsByStaffId(staff.getStaffId(), fromDate, toDate);
            // Convert shifts to shiftDtos
            List<ShiftDto> shiftDtos = shifts.stream().map(ShiftDto::new).collect(Collectors.toList());

            // Return the staffDtos
            return new StaffDto(staff, shiftDtos, leaveRequestDtos);
        }).collect(Collectors.toList());
    }

    @Override
    public List<StaffDto> getPayroll(LocalDate fromDate, LocalDate toDate) {
        List<Staff> staffs = staffService.getAllStaffs();

        // Iterate through all staffs and get their shifts and salary
        return staffs.parallelStream().map(staff -> {
            // Get the salary and leave requests of the staff
            List<LeaveRequestDto> leaveRequestDtos = leaveRequestService
                    .getLeaveRequestsByStaffIdAndDates(staff.getStaffId(), fromDate, toDate)
                    .stream().filter(leaveRequestDto -> leaveRequestDto.getStatus().equals(LeaveStatus.APPROVED))
                    .collect(Collectors.toList());
            // Get the shifts of the staff
            List<Shift> shifts = shiftService.getAllShiftsByStaffId(staff.getStaffId(), fromDate, toDate);
            // Convert shifts to shiftDtos
            List<ShiftDto> shiftDtos = shifts.stream().map(ShiftDto::new).collect(Collectors.toList());

            // Return the staffDtos
            return new StaffDto(staff, shiftDtos, leaveRequestDtos);
        }).collect(Collectors.toList());
    }

    private Timesheet saveTimesheet(Timesheet timesheet, Shift shift, Staff staff, Salary salary, Time checkInTime, Time checkOutTime, TimesheetStatus status,
                                    String noteTitle, String noteContent) {
        timesheet.setShift(shift);
        timesheet.setStaff(staff);
        timesheet.setSalary(salary);
        timesheet.setCheckInTime(checkInTime);
        timesheet.setCheckOutTime(checkOutTime);
        timesheet.setStatus(status == null ? TimesheetStatus.PENDING : status);
        timesheet.setNoteTitle(noteTitle == null ? "" : noteTitle);
        timesheet.setNoteContent(noteContent == null ? "" : noteContent);

        return timesheetRepository.save(timesheet);
    }

}
