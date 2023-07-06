package com.team3.ministore.controller;

import com.team3.ministore.common.responsehandler.ResponseHandler;
import com.team3.ministore.dto.RegisterDto;
import com.team3.ministore.dto.SalaryDto;
import com.team3.ministore.dto.StaffDto;
import com.team3.ministore.dto.UpdateStaffDto;
import com.team3.ministore.model.Salary;
import com.team3.ministore.model.Staff;
import com.team3.ministore.service.SalaryService;
import com.team3.ministore.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/staffs")
public class StaffController {

    @Autowired
    private StaffService staffService;

    @Autowired
    private SalaryService salaryService;


    //Create new staff
    @PostMapping("/add")
    public ResponseEntity<Object> register(@Valid @RequestBody RegisterDto dto, BindingResult errors) {
        if (errors.hasErrors()) return ResponseHandler.getResponse(errors, HttpStatus.BAD_REQUEST);

        Staff staff = staffService.createStaff(dto);
        SalaryDto salaryDto = new SalaryDto(
                dto.getHourlyWage(),
                dto.getEffectiveDate(),
                dto.getTerminationDate(),
                staff.getStaffId()
        );
        Salary salary = salaryService.createSalary(salaryDto, staff);
        salaryDto.setSalaryId(salary.getSalaryId());

        return ResponseHandler.getResponse(new StaffDto(staff, salaryDto), HttpStatus.CREATED);
    }

    //Read a staff by ID
    @GetMapping("/{id}")
    public ResponseEntity<Object> getStaffById(@PathVariable("id") Integer id) {
        Optional<Staff> staff = staffService.getStaffById(id);

        return staff.map(value ->
                        ResponseHandler.getResponse(new StaffDto(
                                        value,
                                        salaryService.getSalaryByStaffId(value.getStaffId())),
                                HttpStatus.OK)
                )
                .orElseGet(() -> ResponseHandler.getResponse(new Exception("Invalid staff id"),
                        HttpStatus.BAD_REQUEST));
    }

    //Update an existing staff
    @PutMapping("/{id}/edit")
    public ResponseEntity<Object> updateStaff(@PathVariable("id") Integer id,
                                              @Valid @RequestBody UpdateStaffDto staff, BindingResult errors) {
        if (errors.hasErrors()) return ResponseHandler.getResponse(errors, HttpStatus.BAD_REQUEST);

        Optional<Staff> updatedStaff = staffService.updateStaff(id, staff);

        return updatedStaff.map(value ->
                        ResponseHandler.getResponse(new StaffDto(
                                        value,
                                        salaryService.getSalaryByStaffId(value.getStaffId())),
                                HttpStatus.OK)
                )
                .orElseGet(() -> ResponseHandler.getResponse(new Exception("Invalid staff id"),
                        HttpStatus.BAD_REQUEST));
    }

    //Delete a staff
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteStaff(@PathVariable Integer id) {
        staffService.deleteStaff(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("")
    public ResponseEntity<Page<Staff>> getStaffs(@RequestParam("search") Optional<String> searchParam, @RequestParam("curPage") Optional<Integer> curPageParam, @RequestParam("perPage") Optional<Integer> perPageParam) {
        Page<Staff> staffPage;
        List<Staff> staffList = null;

        if (searchParam.isPresent()) {
            String search = searchParam.get();

            staffList = staffService.getStaffByNameLike(search);
        }
        if (curPageParam.isPresent() || perPageParam.isPresent()) {
            int curPage = curPageParam.orElse(1);
            int perPage = perPageParam.orElse(10);

            staffPage = staffService.findAllPagingStaff(curPage, perPage);
            if (staffPage.getSize() == 0) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
        } else {
            int curPage = 1;
            int perPage = 10;

            staffPage = staffService.findAllPagingStaff(curPage, perPage);
            if (staffPage.isEmpty() && (staffList == null || staffList.isEmpty())) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
        }

        if (staffList != null) {
            List<Staff> filteredStaffs = staffPage.stream().filter(staffList::contains).collect(Collectors.toList());

            staffPage = new PageImpl<>(filteredStaffs, staffPage.getPageable(), filteredStaffs.size());
        }

        return new ResponseEntity<>(staffPage, HttpStatus.OK);
    }

}
