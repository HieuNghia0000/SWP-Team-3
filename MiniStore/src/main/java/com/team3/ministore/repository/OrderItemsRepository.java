package com.team3.ministore.repository;

import com.team3.ministore.model.OrderItems;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemsRepository extends JpaRepository<OrderItems, Integer> {
    @Query("SELECT o FROM OrderItems o WHERE o.orders.orderId = :orderId")
    List<OrderItems> getOrderItemsByOrderId(@Param("orderId") Integer id);
}
