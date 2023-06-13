package com.team3.ministore.repository;

import com.team3.ministore.model.Orders;
import org.aspectj.weaver.ast.Or;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Repository
public interface OrdersRepository extends JpaRepository<Orders, Integer> {

    @Query("SELECT o FROM Orders o WHERE o.orderDate >= :targetDate")
    List<Orders> findByOrderDateGreaterThanEqual(@Param("targetDate") LocalDateTime targetDate);

    @Query("SELECT o FROM Orders o WHERE o.orderDate >= :fromDate AND o.orderDate <= :toDate")
    List<Orders> findOrdersByOrderDateBetween(@Param("fromDate") LocalDateTime fromDate, @Param("toDate") LocalDateTime toDate);
}
