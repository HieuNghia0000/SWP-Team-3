package com.team3.ministore.service.impl;

import com.team3.ministore.dto.CreateShiftDto;
import com.team3.ministore.dto.ShiftDto;
import com.team3.ministore.model.Shift;
import com.team3.ministore.model.ShiftTemplate;
import com.team3.ministore.model.Staff;
import com.team3.ministore.repository.ShiftTemplateRepository;
import com.team3.ministore.repository.ShiftRepository;
import com.team3.ministore.repository.StaffRepository;
import com.team3.ministore.service.ShiftService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ShiftServiceImpl implements ShiftService {

    @Autowired
    private ShiftRepository shiftRepository;

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private ShiftTemplateRepository shiftTemplateRepository;

    @Override
    public List<Shift> getAllShifts() {
        return shiftRepository.findAll();
    }

    @Override
    public List<Shift> getAllShiftsByStaffId(int staffId, LocalDate from, LocalDate to) {
        return shiftRepository.findAllByStaff_StaffIdAndDateBetween(staffId, from, to);
    }

    @Override
    public Optional<ShiftDto> createShift(CreateShiftDto dto) {
        Shift shift = new Shift();

        Optional<ShiftTemplate> sTemplate = shiftTemplateRepository.findById(dto.getShiftTemplateId());
        if (sTemplate.isEmpty()) return Optional.empty();

        Optional<Staff> staff = staffRepository.findById(dto.getStaffId());
        if (staff.isEmpty()) return Optional.empty();

        shift.setStaff(staff.get());
        shift.setShiftTemplate(sTemplate.get());
        shift.setDate(dto.getDate());
        shift.setPublished(dto.isPublished());

        return Optional.of(new ShiftDto(shiftRepository.save(shift)));
    }

    @Override
    public Optional<Shift> getShiftById(Integer id) {
        return shiftRepository.findById(id);
    }

    @Override
    public Optional<Shift> updateShift(Integer id, Shift shift) {
        Optional<Shift> existingShift = getShiftById(id);
        return existingShift.map(value -> shiftRepository.save(shift));
    }

    @Override
    public void deleteShift(Integer id) {
        shiftRepository.deleteById(id);
    }

    @Override
    public List<Shift> getAllShifts(LocalDate fromDate, LocalDate toDate) {
        return shiftRepository.findAllByDateBetween(fromDate, toDate);
    }
}
