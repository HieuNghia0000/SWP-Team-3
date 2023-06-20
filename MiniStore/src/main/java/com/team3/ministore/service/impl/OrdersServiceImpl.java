package com.team3.ministore.service.impl;

import com.team3.ministore.model.Orders;
import com.team3.ministore.repository.OrdersRepository;
import com.team3.ministore.service.OrdersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Service
public class OrdersServiceImpl implements OrdersService {

    @Autowired
    private OrdersRepository ordersRepository;

    @Override
    public List<Orders> getAllOrders() {
        return ordersRepository.findAll();
    }

    @Override
    public Orders createOrders(Orders orders) {
        return ordersRepository.save(orders);
    }

    @Override
    public Orders getOrdersById(Integer id) {
        return ordersRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Invalid Order ID: " + id));
    }

    @Override
    public Orders updateOrders(Integer id, Orders orders) {
        Orders existingOrders = getOrdersById(id);

        existingOrders.setOrderDate(orders.getOrderDate());
        existingOrders.setTotalPrice(orders.getTotalPrice());
        existingOrders.setVouchers(orders.getVouchers());

        return ordersRepository.save(existingOrders);
    }

    @Override
    public void deleteOrders(Integer id) {
        ordersRepository.deleteById(id);
    }

    @Override
    public List<Orders> getOrdersFromTimeAgo(String ago) {
        LocalDateTime currentDateTime = LocalDateTime.now();

        switch (ago) {
            case "12months":
                currentDateTime = currentDateTime.minusMonths(12);
                break;
            case "30days":
                currentDateTime = currentDateTime.minusDays(30);
                break;
            case "7days":
                currentDateTime = currentDateTime.minusDays(7);
                break;
            case "24hours":
                currentDateTime = currentDateTime.minusHours(24);
                break;
            default:
                throw new IllegalArgumentException("Invalid time: " + ago);
        }

        return ordersRepository.findByOrderDateGreaterThanEqual(currentDateTime);
    }

    @Override
    public List<Orders> getOrdersBetweenDate(LocalDateTime fromDate, LocalDateTime toDate) {
        return ordersRepository.findOrdersByOrderDateBetween(fromDate, toDate);
    }

    @Override
    public List<Orders> getOrdersBetweenAmount(Integer fromAmount, Integer toAmount) {
        return ordersRepository.findOrdersByTotalAmountBetween(fromAmount, toAmount);
    }

    @Override
    public Page<Orders> findAllPagingOrders(int pageIndex, int pageSize) {
        Pageable pageable = PageRequest.of(pageIndex - 1, pageSize);
        return ordersRepository.findAllPagingOrders(pageable);
    }

}
