package com.team3.ministore.service;

import com.team3.ministore.model.OrderItems;

import java.util.List;

public interface OrderItemsService {
    List<OrderItems> getAllOrderItems();

    OrderItems createOrderItems(OrderItems orderItems);

    OrderItems getOrderItemsById(Integer id);

    OrderItems updateOrderItems(Integer id, OrderItems orderItems);

    void deleteOrderItems(Integer id);
}
