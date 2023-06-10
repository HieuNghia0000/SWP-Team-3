package com.team3.ministore.controller;

import com.team3.ministore.common.responsehandler.ResponseHandler;
import com.team3.ministore.dto.RegisterDto;
import com.team3.ministore.model.Staff;
import com.team3.ministore.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/staffs")
public class StaffController {

    @Autowired
    private StaffService staffService;


    //Create new staff
    @PostMapping("/add")
    public Object register(@Valid @RequestBody RegisterDto dto, BindingResult errors) {
        if (errors.hasErrors())
            return ResponseHandler.getResponse(errors, HttpStatus.BAD_REQUEST);

        Staff staff = staffService.createStaff(dto);
        return ResponseHandler.getResponse(staff, HttpStatus.CREATED);
    }

    //Read a staff by ID
    @GetMapping("/search/{id}")
    public ResponseEntity<Staff> getStaffById(@PathVariable("id") Integer id) {
        Staff staff = staffService.getStaffById(id);
        return new ResponseEntity<>(staff, HttpStatus.OK);
    }

    //Update an existing staff
    @PutMapping("/update/{id}")
    public ResponseEntity<Staff> updateStaff(@PathVariable("id") Integer id, @RequestBody Staff staff) {
        Staff updatedStaff = staffService.updateStaff(id, staff);
        return new ResponseEntity<>(updatedStaff, HttpStatus.OK);
    }

    //Delete a staff
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteStaff(@PathVariable Integer id) {
        staffService.deleteStaff(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("")
    public ResponseEntity<?> getStaffs(@RequestParam("search") Optional<String> searchParam,
                                       @RequestParam("curPage") Optional<Integer> curPageParam,
                                       @RequestParam("perPage") Optional<Integer> perPageParam) {
        Page<Staff> staffPage = null;
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
        }
        else {
            int curPage = 1;
            int perPage = 10;

            staffPage = staffService.findAllPagingStaff(curPage, perPage);
            if (staffPage.getSize() == 0) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
        }

        StaffResponse response = new StaffResponse(staffList, staffPage);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    private static class StaffResponse {
        private List<Staff> staffList;
        private Page<Staff> staffPage;

        public StaffResponse(List<Staff> staffList, Page<Staff> staffPage) {
            this.staffList = staffList;
            this.staffPage = staffPage;
        }

        public List<Staff> getStaffList() {
            return staffList;
        }

        public void setStaffList(List<Staff> staffList) {
            this.staffList = staffList;
        }

        public Page<Staff> getStaffPage() {
            return staffPage;
        }

        public void setStaffPage(Page<Staff> staffPage) {
            this.staffPage = staffPage;
        }
    }
}
