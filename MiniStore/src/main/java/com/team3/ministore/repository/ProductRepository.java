package com.team3.ministore.repository;

import com.team3.ministore.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    @Query("SELECT p FROM Product p WHERE p.name LIKE %:productName%")
    List<Product> getProductsByNameLike(@Param("productName") String productName);

    @Query("SELECT p FROM Product p WHERE p.price >= :fromAmount AND p.price <= :toAmount")
    List<Product> findProductsByPriceBetween(@Param("fromAmount") float fromAmount, @Param("toAmount") float toAmount);

    @Query("SELECT p FROM Product p")
    Page<Product> findAllPagingProducts(Pageable pageable);
}
