package com.team3.ministore.service;

import com.team3.ministore.model.HolidayCoef;
import com.team3.ministore.repository.HolidayCoefRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HolidayCoefServiceImpl implements HolidayCoefService {
    
    @Autowired
    private HolidayCoefRepository holidayCoefRepository;

    @Override
    public List<HolidayCoef> getAllHolidayCoef() {
        return holidayCoefRepository.findAll();
    }

    @Override
    public HolidayCoef createHolidayCoef(HolidayCoef holidayCoef) {
        return holidayCoefRepository.save(holidayCoef);
    }

    @Override
    public HolidayCoef getHolidayCoefById(Integer id) {
        return holidayCoefRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Invalid HolidayCoef ID: " + id));
    }

    @Override
    public HolidayCoef updateHolidayCoef(Integer id, HolidayCoef holidayCoef) {
        HolidayCoef existingHolidayCoef = getHolidayCoefById(id);

        existingHolidayCoef.setCoefficient(holidayCoef.getCoefficient());
        existingHolidayCoef.setName(holidayCoef.getName());
        existingHolidayCoef.setStartDate(holidayCoef.getStartDate());
        existingHolidayCoef.setEndDate(holidayCoef.getEndDate());

        return holidayCoefRepository.save(existingHolidayCoef);
    }

    @Override
    public void deleteHolidayCoef(Integer id) {
        holidayCoefRepository.deleteById(id);
    }
}
