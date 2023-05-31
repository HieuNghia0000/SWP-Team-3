package com.team3.ministore.service;

import com.team3.ministore.model.Product;

import java.util.List;

public interface ProductService {
    List<Product> getAllProduct();

    Product createProduct(Product product);

    Product getProductById(Integer id);

    Product updateProduct(Integer id, Product product);

    void deleteProduct(Integer id);
}
