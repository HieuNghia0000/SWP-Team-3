package com.team3.ministore.controller;

import com.team3.ministore.model.Orders;
import com.team3.ministore.service.OrdersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Repository
@RequestMapping("/orders")
public class OrdersController {

    @Autowired
    private OrdersService ordersService;

    @PostMapping("/")
    public ResponseEntity<Orders> createOrders(@RequestBody Orders orders) {
        Orders createdOrders = ordersService.createOrders(orders);
        return new ResponseEntity<>(createdOrders, HttpStatus.CREATED);
    }

    @GetMapping("/")
    public ResponseEntity<List<Orders>> getAllOrders() {
        List<Orders> ordersList = ordersService.getAllOrders();
        return new ResponseEntity<>(ordersList, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Orders> getOrdersById(@PathVariable("id") Integer id) {
        Orders orders = ordersService.getOrdersById(id);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Orders> updateOrders(@PathVariable("id") Integer id, @RequestBody Orders orders) {
        Orders updatedOrders = ordersService.updateOrders(id, orders);
        return new ResponseEntity<>(updatedOrders, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrders(@PathVariable("id") Integer id) {
        ordersService.deleteOrders(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
