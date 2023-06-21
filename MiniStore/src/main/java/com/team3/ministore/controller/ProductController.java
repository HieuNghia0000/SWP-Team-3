package com.team3.ministore.controller;

import com.team3.ministore.model.Product;
import com.team3.ministore.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @PostMapping("/add")
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        Product createdProduct = productService.createProduct(product);
        return new ResponseEntity<>(createdProduct, HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable("id") Integer id, @RequestBody Product product) {
        Product updatedProduct = productService.updateProduct(id, product);
        return new ResponseEntity<>(updatedProduct, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable("id") Integer id) {
        productService.deleteProduct(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("")
    public ResponseEntity<Page<Product>> getProducts(@RequestParam("search") Optional<String> searchParam,
                                                     @RequestParam("amouunt_from") Optional<Float> fromAmountParam,
                                                     @RequestParam("amount_to") Optional<Float> toAmountParam,
                                                     @RequestParam("curPage") Optional<Integer> curPageParam) {
        List<Product> productList;
        Page<Product> productPage;

        if (searchParam.isPresent()) {
            String search = searchParam.get();

            productList = productService.getStaffByNameLike(search);
        }
        else if (fromAmountParam.isPresent() && toAmountParam.isPresent()) {
            float fromAmount = fromAmountParam.get();
            float toAmount = toAmountParam.get();

            productList = productService.findProductsByPriceBetween(fromAmount, toAmount);
        }
        else {
            productList = productService.getAllProduct();
        }

        if (fromAmountParam.isPresent() && toAmountParam.isPresent()) {
            float fromAmount = fromAmountParam.get();
            float toAmount = toAmountParam.get();

            productList = filterProductByAmount(productList, fromAmount, toAmount);
        }

        if (curPageParam.isPresent()) {
            int curPage = curPageParam.get();
            int perPage = 10;

            productPage = productService.findAllPagingProducts(curPage, perPage);
            if (productPage.getSize() == 0) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
        }
        else {
            int curPage = 1;
            int perPage = 10;

            productPage = productService.findAllPagingProducts(curPage, perPage);
            if (productPage.getSize() == 0) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
        }

        if (productList != null) {
            List<Product> filteredProducts = productPage.stream().filter(productList::contains).collect(Collectors.toList());

            productPage = new PageImpl<>(filteredProducts, productPage.getPageable(), filteredProducts.size());
        }

        return new ResponseEntity<>(productPage, HttpStatus.OK);
    }

    private List<Product> filterProductByAmount(List<Product> productList, float fromAmount, float toAmount) {
        List<Product> filteredProduct = new ArrayList<>();

        for (Product product : productList) {
            float productAmount = product.getPrice();

            if (productAmount >= fromAmount && productAmount <= toAmount) {
                filteredProduct.add(product);
            }
        }

        return filteredProduct;
    }
}