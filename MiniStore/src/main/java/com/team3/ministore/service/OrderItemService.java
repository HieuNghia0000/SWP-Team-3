package com.team3.ministore.service;

import com.team3.ministore.model.OrderItem;

import java.util.List;

public interface OrderItemService {
    List<OrderItem> getAllOrderItems();

    OrderItem createOrderItems(OrderItem orderItem);

    OrderItem getOrderItemsById(Integer id);

    OrderItem updateOrderItems(Integer id, OrderItem orderItem);

    void deleteOrderItems(Integer id);

    List<OrderItem> getOrderItemsByOrderId(Integer id);
}
