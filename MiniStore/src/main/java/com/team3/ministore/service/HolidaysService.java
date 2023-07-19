package com.team3.ministore.service;

import com.team3.ministore.dto.HolidayDto;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface HolidaysService {
    List<HolidayDto> getHolidays(String search, int page, int pageSize);

    List<HolidayDto> getHolidays(int page, int pageSize);

    HolidayDto createHolidays(HolidayDto holiday);

    Optional<HolidayDto> updateHolidays(Integer id, HolidayDto dto);

    void deleteHolidays(Integer id);

    List<HolidayDto> getAllHolidays(LocalDate startDate, LocalDate endDate);
}
