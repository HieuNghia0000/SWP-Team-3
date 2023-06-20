package com.team3.ministore.service.impl;

import com.team3.ministore.model.OrderItems;
import com.team3.ministore.repository.OrderItemsRepository;
import com.team3.ministore.service.OrderItemsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderItemsServiceImpl implements OrderItemsService {
    
    @Autowired
    private OrderItemsRepository orderItemsRepository;

    @Override
    public List<OrderItems> getAllOrderItems() {
        return orderItemsRepository.findAll();
    }

    @Override
    public OrderItems createOrderItems(OrderItems orderItems) {
        return orderItemsRepository.save(orderItems);
    }

    @Override
    public OrderItems getOrderItemsById(Integer id) {
        return orderItemsRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Invalid Order ID: " + id));
    }

    @Override
    public OrderItems updateOrderItems(Integer id, OrderItems orderItems) {
        OrderItems existingOrderItems = getOrderItemsById(id);

        existingOrderItems.setOrders(orderItems.getOrders());
        existingOrderItems.setProduct(orderItems.getProduct());
        existingOrderItems.setQuantity(orderItems.getQuantity());

        return orderItemsRepository.save(existingOrderItems);
    }

    @Override
    public void deleteOrderItems(Integer id) {
        orderItemsRepository.deleteById(id);
    }
}
