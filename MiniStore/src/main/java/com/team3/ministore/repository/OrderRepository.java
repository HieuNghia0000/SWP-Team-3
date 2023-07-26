package com.team3.ministore.repository;

import com.team3.ministore.model.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {

    @Query("SELECT o FROM Order o WHERE o.orderDate >= :targetDate")
    List<Order> findByOrderDateGreaterThanEqual(@Param("targetDate") LocalDateTime targetDate);

    @Query("SELECT o FROM Order o WHERE o.orderDate >= :fromDate AND o.orderDate <= :toDate")
    List<Order> findOrdersByOrderDateBetween(@Param("fromDate") LocalDateTime fromDate, @Param("toDate") LocalDateTime toDate);

    @Query("SELECT o FROM Order o WHERE o.grandTotal >= :fromAmount AND o.grandTotal <= :toAmount")
    List<Order> findOrdersByTotalAmountBetween(@Param("fromAmount") int fromAmount, @Param("toAmount") int toAmount);

    @Query("SELECT o FROM Order o")
    Page<Order> findAllPagingOrders(Pageable pageable);
}
