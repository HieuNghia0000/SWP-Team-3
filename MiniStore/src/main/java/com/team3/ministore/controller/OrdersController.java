package com.team3.ministore.controller;

import com.team3.ministore.model.Orders;
import com.team3.ministore.service.OrdersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/orders")
public class OrdersController {

    @Autowired
    private OrdersService ordersService;

    @PostMapping("/add")
    public ResponseEntity<Orders> createOrders(@RequestBody Orders orders) {
        Orders createdOrders = ordersService.createOrders(orders);
        return new ResponseEntity<>(createdOrders, HttpStatus.CREATED);
    }

    @GetMapping("/search/{id}")
    public ResponseEntity<Orders> getOrdersById(@PathVariable("id") Integer id) {
        Orders orders = ordersService.getOrdersById(id);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Orders> updateOrders(@PathVariable("id") Integer id, @RequestBody Orders orders) {
        Orders updatedOrders = ordersService.updateOrders(id, orders);
        return new ResponseEntity<>(updatedOrders, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteOrders(@PathVariable("id") Integer id) {
        ordersService.deleteOrders(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("")
    public ResponseEntity<List<Orders>> getOrders(@RequestParam("ago") Optional<String> agoParam,
                                                  @RequestParam("from") Optional<String> fromDateParam,
                                                  @RequestParam("to") Optional<String> toDateParam) {
        List<Orders> ordersList;

        if (agoParam.isPresent()) {
            String ago = agoParam.get();
            ordersList = ordersService.getOrdersFromTimeAgo(ago);
        } else if (fromDateParam.isPresent() && toDateParam.isPresent()) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            LocalDate fromDate = LocalDate.parse(fromDateParam.get(), formatter);
            LocalDate toDate = LocalDate.parse(toDateParam.get(), formatter);

            LocalDateTime fromDateTime = fromDate.atStartOfDay();
            LocalDateTime toDateTime = toDate.atStartOfDay().plusDays(1).minusNanos(1);

            ordersList = ordersService.getOrdersBetweenDate(fromDateTime, toDateTime);
        } else {
            ordersList = ordersService.getAllOrders();
        }
        return new ResponseEntity<>(ordersList, HttpStatus.OK);
    }
}
