package com.team3.ministore.service;

import com.team3.ministore.model.TimeOffRequests;

import java.util.List;

public interface TimeOffRequestsService {
    List<TimeOffRequests> getAllTimeOffRequests();

    TimeOffRequests createTimeOffRequests(TimeOffRequests timeOffRequests);

    TimeOffRequests getTimeOffRequestsById(Integer id);

    TimeOffRequests updateTimeOffRequests(Integer id, TimeOffRequests timeOffRequests);

    void deleteTimeOffRequests(Integer id);
}
