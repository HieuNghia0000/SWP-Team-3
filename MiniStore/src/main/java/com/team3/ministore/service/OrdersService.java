package com.team3.ministore.service;

import com.team3.ministore.model.Orders;
import org.springframework.data.domain.Page;

import java.time.LocalDateTime;
import java.util.List;

public interface OrdersService {
    List<Orders> getAllOrders();

    Orders createOrders(Orders orders);

    Orders getOrdersById(Integer id);

    Orders updateOrders(Integer id, Orders orders);

    void deleteOrders(Integer id);

    List<Orders> getOrdersFromTimeAgo(String ago);

    List<Orders> getOrdersBetweenDate(LocalDateTime fromDate, LocalDateTime toDate);

    List<Orders> getOrdersBetweenAmount(Integer fromAmount, Integer toAmount);

    Page<Orders> findAllPagingOrders(int pageIndex, int pageSize);
}
