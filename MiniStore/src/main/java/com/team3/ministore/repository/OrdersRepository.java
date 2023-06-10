package com.team3.ministore.repository;

import com.team3.ministore.model.Orders;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface OrdersRepository extends JpaRepository<Orders, Integer> {

    @Query("SELECT o from Orders o WHERE o.orderDate >= :targetDate")
    List<Orders> findByOrderDateGreaterThanEqual(@Param("targetDate") Date targetDate);
}
