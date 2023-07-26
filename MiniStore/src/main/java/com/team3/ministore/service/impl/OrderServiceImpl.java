package com.team3.ministore.service.impl;

import com.team3.ministore.dto.OrderDto;
import com.team3.ministore.model.Order;
import com.team3.ministore.model.OrderItem;
import com.team3.ministore.model.Product;
import com.team3.ministore.model.Staff;
import com.team3.ministore.repository.OrderItemRepository;
import com.team3.ministore.repository.OrderRepository;
import com.team3.ministore.repository.StaffRepository;
import com.team3.ministore.service.OrderService;
import com.team3.ministore.service.ProductService;
import com.team3.ministore.utils.PaymentStatus;
import com.team3.ministore.utils.StaffStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private ProductService productService;

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public Order createOrders(OrderDto dto) throws IllegalArgumentException {

        Optional<Staff> staff = staffRepository.findById(dto.getStaffId());
        if (staff.isEmpty() || staff.get().getStatus() == StaffStatus.DISABLED) {
            throw new IllegalArgumentException("Invalid Staff ID: " + dto.getStaffId());
        }

        // Create order
        Order order = new Order();
        order.setOrderDate(dto.getOrderDate());
        order.setGrandTotal(dto.getGrandTotal());
        order.setPaymentStatus(PaymentStatus.PENDING);
        order.setStaff(staff.get());
        order.setOrderItems(new ArrayList<>());

        Order newOrder = orderRepository.save(order);

        // Create order items
        dto.getOrderItems().forEach(orderItemDto -> {
            Optional<Product> existingProduct = productService.getProductById(orderItemDto.getProductId());
            if (existingProduct.isEmpty()) {
                // Rollback
                orderRepository.delete(newOrder);
                throw new IllegalArgumentException("Invalid Product ID: " + orderItemDto.getProductId());
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(newOrder);
            orderItem.setProduct(existingProduct.get());
            orderItem.setQuantity(orderItemDto.getQuantity());
            OrderItem item = orderItemRepository.save(orderItem);
            newOrder.getOrderItems().add(item);
        });

        return newOrder;
    }

    @Override
    public Optional<Order> getOrdersById(Integer id) {
        return orderRepository.findById(id);
    }

    @Override
    public Optional<Order> updateOrders(Integer id, Order order) {
        Optional<Order> existingOrder = getOrdersById(id);
        if (existingOrder.isEmpty()) return Optional.empty();

        existingOrder.map(o -> {
            o.setOrderDate(order.getOrderDate());
            o.setGrandTotal(order.getGrandTotal());
            return o;
        });

        return Optional.of(orderRepository.save(existingOrder.get()));
    }

    @Override
    public void deleteOrders(Integer id) {
        orderRepository.deleteById(id);
    }

    @Override
    public List<Order> getOrdersFromTimeAgo(String ago) {
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
            case "":
                currentDateTime = LocalDateTime.of(1900, 1, 1, 0, 0, 0);
                break;
            default:
                throw new IllegalArgumentException("Invalid time: " + ago);
        }

        return orderRepository.findByOrderDateGreaterThanEqual(currentDateTime);
    }

    @Override
    public List<Order> getOrdersBetweenDate(LocalDateTime fromDate, LocalDateTime toDate) {
        return orderRepository.findOrdersByOrderDateBetween(fromDate, toDate);
    }

    @Override
    public List<Order> getOrdersBetweenAmount(Integer fromAmount, Integer toAmount) {
        return orderRepository.findOrdersByTotalAmountBetween(fromAmount, toAmount);
    }

    @Override
    public Page<Order> findAllPagingOrders(int pageIndex, int pageSize) {
        Pageable pageable = PageRequest.of(pageIndex - 1, pageSize);
        return orderRepository.findAllPagingOrders(pageable);
    }

}
