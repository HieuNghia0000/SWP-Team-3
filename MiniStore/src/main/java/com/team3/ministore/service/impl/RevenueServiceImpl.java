package com.team3.ministore.service.impl;

import com.team3.ministore.model.Revenue;
import com.team3.ministore.repository.RevenueRepository;
import com.team3.ministore.service.RevenueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RevenueServiceImpl implements RevenueService {

    @Autowired
    private RevenueRepository revenueRepository;

    @Override
    public List<Revenue> getAllRevenue() {
        return revenueRepository.findAll();
    }

    @Override
    public Revenue createRevenue(Revenue revenue) {
        return revenueRepository.save(revenue);
    }

    @Override
    public Revenue getRevenueById(Integer id) {
        return revenueRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Invalid Revenue ID: " + id));
    }

    @Override
    public Revenue updateRevenue(Integer id, Revenue revenue) {
        Revenue existingRevenue = getRevenueById(id);

        existingRevenue.setDate(revenue.getDate());
        existingRevenue.setAmount(revenue.getAmount());

        return revenueRepository.save(existingRevenue);
    }

    @Override
    public void deleteRevenue(Integer id) {
        revenueRepository.deleteById(id);
    }
}
