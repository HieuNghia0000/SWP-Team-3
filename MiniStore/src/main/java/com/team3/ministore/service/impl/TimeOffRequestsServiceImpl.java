package com.team3.ministore.service.impl;

import com.team3.ministore.model.TimeOffRequests;
import com.team3.ministore.repository.TimeOffRequestsRepository;
import com.team3.ministore.service.TimeOffRequestsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TimeOffRequestsServiceImpl implements TimeOffRequestsService {

    @Autowired
    private TimeOffRequestsRepository timeOffRequestsRepository;

    @Override
    public List<TimeOffRequests> getAllTimeOffRequests() {
        return timeOffRequestsRepository.findAll();
    }

    @Override
    public TimeOffRequests createTimeOffRequests(TimeOffRequests timeOffRequests) {
        return timeOffRequestsRepository.save(timeOffRequests);
    }

    @Override
    public TimeOffRequests getTimeOffRequestsById(Integer id) {
        return timeOffRequestsRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Invalid Leave Requests ID: " + id));
    }

    @Override
    public TimeOffRequests updateTimeOffRequests(Integer id, TimeOffRequests timeOffRequests) {
        TimeOffRequests existingTimeOffRequests = getTimeOffRequestsById(id);

        existingTimeOffRequests.setStaff(timeOffRequests.getStaff());
        existingTimeOffRequests.setAdminReply(timeOffRequests.getAdminReply());
        existingTimeOffRequests.setComments(timeOffRequests.getComments());
        existingTimeOffRequests.setStatus(timeOffRequests.getStatus());
        existingTimeOffRequests.setStartDate(timeOffRequests.getStartDate());
        existingTimeOffRequests.setEndDate(timeOffRequests.getEndDate());

        return timeOffRequestsRepository.save(existingTimeOffRequests);
    }

    @Override
    public void deleteTimeOffRequests(Integer id) {
        timeOffRequestsRepository.deleteById(id);
    }
}
