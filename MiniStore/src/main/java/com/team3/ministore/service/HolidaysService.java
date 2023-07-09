package com.team3.ministore.service;

import com.team3.ministore.model.Holidays;

import java.util.List;

public interface HolidaysService {
    List<Holidays> getAllHolidays();

    Holidays createHolidays(Holidays holidays);

    Holidays getHolidaysById(Integer id);

    Holidays updateHolidays(Integer id, Holidays holidays);

    void deleteHolidays(Integer id);
}
