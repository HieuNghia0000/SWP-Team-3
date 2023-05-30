package com.team3.ministore.service;

import com.team3.ministore.model.Revenue;

import java.util.List;

public interface RevenueService {
    List<Revenue> getAllRevenue();

    Revenue createRevenue(Revenue revenue);

    Revenue getRevenueById(Integer id);

    Revenue updateRevenue(Integer id, Revenue revenue);

    void deleteRevenue(Integer id);
}
