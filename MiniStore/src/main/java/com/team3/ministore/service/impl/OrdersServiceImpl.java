package com.team3.ministore.service.impl;

import com.team3.ministore.model.Orders;
import com.team3.ministore.repository.OrdersRepository;
import com.team3.ministore.service.OrdersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
        existingOrders.setTotalAmount(orders.getTotalAmount());

        return ordersRepository.save(existingOrders);
    }

    @Override
    public void deleteOrders(Integer id) {
        ordersRepository.deleteById(id);
    }

    @Override
    public List<Orders> getOrdersFromTimeAgo(String ago) {
        Date currentDate = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(currentDate);

        switch (ago) {
            case "12months":
                calendar.add(Calendar.MONTH, -12);
                break;
            case "30days":
                calendar.add(Calendar.DAY_OF_YEAR, -30);
                break;
            case "7days":
                calendar.add(Calendar.DAY_OF_YEAR, -7);
                break;
            case "24hours":
                calendar.add(Calendar.HOUR_OF_DAY, -24);
                break;
            default:
                throw new IllegalArgumentException("Invalid time: " + ago);
        }

        Date targetDate = calendar.getTime();

        return ordersRepository.findByOrderDateGreaterThanEqual(targetDate);
    }
}
