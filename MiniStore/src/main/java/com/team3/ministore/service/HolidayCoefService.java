package com.team3.ministore.service;

import com.team3.ministore.model.HolidayCoef;

import java.util.List;

public interface HolidayCoefService {
    List<HolidayCoef> getAllHolidayCoef();

    HolidayCoef createHolidayCoef(HolidayCoef holidayCoef);

    HolidayCoef getHolidayCoefById(Integer id);

    HolidayCoef updateHolidayCoef(Integer id, HolidayCoef holidayCoef);

    void deleteHolidayCoef(Integer id);
}
