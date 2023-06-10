package com.team3.ministore.service;

import com.team3.ministore.model.Orders;

import java.util.List;

public interface OrdersService {
    List<Orders> getAllOrders();

    Orders createOrders(Orders orders);

    Orders getOrdersById(Integer id);

    Orders updateOrders(Integer id, Orders orders);

    void deleteOrders(Integer id);

    List<Orders> getOrdersFromTimeAgo(String ago);
}
