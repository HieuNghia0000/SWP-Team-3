package com.team3.ministore.service;

import com.team3.ministore.model.Product;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ProductService {
    List<Product> getAllProduct();

    Product createProduct(Product product);

    Product getProductById(Integer id);

    Product updateProduct(Integer id, Product product);

    void deleteProduct(Integer id);

    List<Product> getStaffByNameLike(String name);

    List<Product> findProductsByPriceBetween(Float fromAmount, Float toAmount);

    Page<Product> findAllPagingProducts(int pageIndex, int pageSize);
}
