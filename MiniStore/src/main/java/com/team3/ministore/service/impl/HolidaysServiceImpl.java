package com.team3.ministore.service.impl;

import com.team3.ministore.model.Holidays;
import com.team3.ministore.repository.HolidaysRepository;
import com.team3.ministore.service.HolidaysService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HolidaysServiceImpl implements HolidaysService {
    
    @Autowired
    private HolidaysRepository holidaysRepository;

    @Override
    public List<Holidays> getAllHolidays() {
        return holidaysRepository.findAll();
    }

    @Override
    public Holidays createHolidays(Holidays holidays) {
        return holidaysRepository.save(holidays);
    }

    @Override
    public Holidays getHolidaysById(Integer id) {
        return holidaysRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Invalid Holidays ID: " + id));
    }

    @Override
    public Holidays updateHolidays(Integer id, Holidays holidays) {
        Holidays existingHolidays = getHolidaysById(id);

        existingHolidays.setName(holidays.getName());
        existingHolidays.setStartDate(holidays.getStartDate());
        existingHolidays.setEndDate(holidays.getEndDate());
        existingHolidays.setCoefficient(holidays.getCoefficient());

        return holidaysRepository.save(existingHolidays);
    }

    @Override
    public void deleteHolidays(Integer id) {
        holidaysRepository.deleteById(id);
    }
}
