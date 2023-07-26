package com.team3.ministore.service;

import com.team3.ministore.dto.OrderDto;
import com.team3.ministore.model.Order;
import org.springframework.data.domain.Page;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface OrderService {
    List<Order> getAllOrders();

    Order createOrders(OrderDto dto) throws Exception;

    Optional<Order> getOrdersById(Integer id);

    Optional<Order> updateOrders(Integer id, Order order);

    void deleteOrders(Integer id);

    List<Order> getOrdersFromTimeAgo(String ago);

    List<Order> getOrdersBetweenDate(LocalDateTime fromDate, LocalDateTime toDate);

    List<Order> getOrdersBetweenAmount(Integer fromAmount, Integer toAmount);

    Page<Order> findAllPagingOrders(int pageIndex, int pageSize);
}
