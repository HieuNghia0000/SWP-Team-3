package com.team3.ministore.service.impl;

import com.team3.ministore.dto.CreateShiftDto;
import com.team3.ministore.model.Shift;
import com.team3.ministore.model.ShiftTemplate;
import com.team3.ministore.model.Staff;
import com.team3.ministore.repository.ShiftTemplateRepository;
import com.team3.ministore.repository.ShiftsRepository;
import com.team3.ministore.repository.StaffRepository;
import com.team3.ministore.service.ShiftService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ShiftServiceImpl implements ShiftService {

    @Autowired
    private ShiftsRepository shiftsRepository;

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private ShiftTemplateRepository shiftTemplateRepository;

    @Override
    public List<Shift> getAllShifts() {
        return shiftsRepository.findAll();
    }

    @Override
    public Optional<Shift> createShift(CreateShiftDto dto) {
        Shift shift = new Shift();

        Optional<ShiftTemplate> sTemplate = shiftTemplateRepository.findById(dto.getShiftTemplateId());
        if (sTemplate.isEmpty()) return Optional.empty();

        Optional<Staff> staff = staffRepository.findById(dto.getStaffId());
        if (staff.isEmpty()) return Optional.empty();

        shift.setStaff(staff.get());
        shift.setShiftTemplate(sTemplate.get());
        shift.setDate(dto.getDate());
        shift.setPublished(dto.isPublished());

        return Optional.of(shiftsRepository.save(shift));
    }

    @Override
    public Shift getShiftsById(Integer id) {
        return shiftsRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Invalid Shifts ID: " + id));
    }

    @Override
    public Shift updateShifts(Integer id, Shift shift) {
        Shift existingShift = getShiftsById(id);

        existingShift.setStaff(shift.getStaff());
        existingShift.setDate(shift.getDate());
        existingShift.setPublished(shift.getPublished());

        return shiftsRepository.save(existingShift);
    }

    @Override
    public void deleteShifts(Integer id) {
        shiftsRepository.deleteById(id);
    }
}
