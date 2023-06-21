package com.team3.ministore.service.impl;

import com.team3.ministore.model.Product;
import com.team3.ministore.repository.ProductRepository;
import com.team3.ministore.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {
    
    @Autowired
    private ProductRepository productRepository;

    @Override
    public List<Product> getAllProduct() {
        return productRepository.findAll();
    }

    @Override
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    @Override
    public Product getProductById(Integer id) {
        return productRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Invalid Order ID: " + id));
    }

    @Override
    public Product updateProduct(Integer id, Product product) {
        Product existingProduct = getProductById(id);

        existingProduct.setBarCode(product.getBarCode());
        existingProduct.setName(product.getName());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setCategory(product.getCategory());
        existingProduct.setPrice(product.getPrice());
        existingProduct.setQuantity(product.getQuantity());

        return productRepository.save(existingProduct);
    }

    @Override
    public void deleteProduct(Integer id) {
        productRepository.deleteById(id);
    }

    @Override
    public List<Product> getStaffByNameLike(String name) {
        return productRepository.getProductsByNameLike(name);
    }

    @Override
    public List<Product> findProductsByPriceBetween(Float fromAmount, Float toAmount) {
        return productRepository.findProductsByPriceBetween(fromAmount, toAmount);
    }

    @Override
    public Page<Product> findAllPagingProducts(int pageIndex, int pageSize) {
        Pageable pageable = PageRequest.of(pageIndex - 1, pageSize);
        return productRepository.findAllPagingProducts(pageable);
    }
}
