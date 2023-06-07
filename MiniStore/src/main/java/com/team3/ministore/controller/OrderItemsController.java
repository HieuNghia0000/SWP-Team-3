package com.team3.ministore.controller;

import com.team3.ministore.model.OrderItems;
import com.team3.ministore.service.OrderItemsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/order-items")
public class OrderItemsController {
    
    @Autowired
    private OrderItemsService orderItemsService;

    @PostMapping("/add")
    public ResponseEntity<OrderItems> createOrderItems(@RequestBody OrderItems orderItems) {
        OrderItems createdOrderItems = orderItemsService.createOrderItems(orderItems);
        return new ResponseEntity<>(createdOrderItems, HttpStatus.CREATED);
    }

    @GetMapping("/list")
    public ResponseEntity<List<OrderItems>> getAllOrderItems() {
        List<OrderItems> orderItemsList = orderItemsService.getAllOrderItems();
        return new ResponseEntity<>(orderItemsList, HttpStatus.OK);
    }

    @GetMapping("/search/{id}")
    public ResponseEntity<OrderItems> getOrderItemsById(@PathVariable("id") Integer id) {
        OrderItems orderItems = orderItemsService.getOrderItemsById(id);
        return new ResponseEntity<>(orderItems, HttpStatus.OK);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<OrderItems> updateOrderItems(@PathVariable("id") Integer id, @RequestBody OrderItems orderItems) {
        OrderItems updatedOrderItems = orderItemsService.updateOrderItems(id, orderItems);
        return new ResponseEntity<>(updatedOrderItems, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteOrderItems(@PathVariable("id") Integer id) {
        orderItemsService.deleteOrderItems(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
