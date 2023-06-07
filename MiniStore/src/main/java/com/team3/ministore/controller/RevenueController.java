package com.team3.ministore.controller;

import com.team3.ministore.model.Revenue;
import com.team3.ministore.service.RevenueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/revenue")
public class RevenueController {
    
    @Autowired
    private RevenueService revenueService;

    @PostMapping("/add")
    public ResponseEntity<Revenue> createRevenue(@RequestBody Revenue revenue) {
        Revenue createdRevenue = revenueService.createRevenue(revenue);
        return new ResponseEntity<>(createdRevenue, HttpStatus.CREATED);
    }

    @GetMapping("/list")
    public ResponseEntity<List<Revenue>> getAllRevenue() {
        List<Revenue> revenueList = revenueService.getAllRevenue();
        return new ResponseEntity<>(revenueList, HttpStatus.OK);
    }

    @GetMapping("/search/{id}")
    public ResponseEntity<Revenue> getRevenueById(@PathVariable("id") Integer id) {
        Revenue revenue = revenueService.getRevenueById(id);
        return new ResponseEntity<>(revenue, HttpStatus.OK);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Revenue> updateRevenue(@PathVariable("id") Integer id, @RequestBody Revenue revenue) {
        Revenue updatedRevenue = revenueService.updateRevenue(id, revenue);
        return new ResponseEntity<>(updatedRevenue, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteRevenue(@PathVariable("id") Integer id) {
        revenueService.deleteRevenue(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
