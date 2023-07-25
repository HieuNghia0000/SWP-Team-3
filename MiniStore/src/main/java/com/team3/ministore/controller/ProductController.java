package com.team3.ministore.controller;

import com.team3.ministore.common.responsehandler.ResponseHandler;
import com.team3.ministore.dto.ProductDto;
import com.team3.ministore.model.Product;
import com.team3.ministore.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Optional;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @PostMapping("/add")
    public ResponseEntity<Object> createProduct(@Valid @RequestBody ProductDto product, BindingResult errors) {
        if (errors.hasErrors()) return ResponseHandler.getResponse(errors, HttpStatus.BAD_REQUEST);

        Optional<Product> createdProduct = productService.createProduct(product);
        return createdProduct.map(value -> ResponseHandler.getResponse(new ProductDto(value), HttpStatus.CREATED))
                .orElseGet(() -> ResponseHandler.getResponse(new Exception("Category not found. Or barcode is already existed."), HttpStatus.NOT_FOUND));

    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Object> updateProduct(@Valid @PathVariable("id") Integer id, @RequestBody ProductDto dto, BindingResult errors) {
        if (errors.hasErrors()) return ResponseHandler.getResponse(errors, HttpStatus.BAD_REQUEST);
        Optional<Product> updatedProduct = productService.updateProduct(id, dto);

        return updatedProduct.map(value -> ResponseHandler.getResponse(new ProductDto(value), HttpStatus.OK))
                .orElseGet(() -> ResponseHandler.getResponse(new Exception("Product or category not found. Or barcode is already existed."), HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Object> deleteProduct(@PathVariable("id") Integer id) {
        productService.deleteProduct(id);
        return ResponseHandler.getResponse(HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getProductById(@PathVariable("id") Integer id) {
        Optional<Product> product = productService.getProductById(id);

        return product.map(value -> ResponseHandler.getResponse(new ProductDto(value), HttpStatus.OK))
                .orElseGet(() -> ResponseHandler.getResponse(new Exception("Product not found"), HttpStatus.NOT_FOUND));
    }

    @GetMapping()
    public ResponseEntity<Object> getProducts(@RequestParam("search") Optional<String> search,
                                              @RequestParam("curPage") Integer curPage,
                                              @RequestParam("perPage") Integer perPage) {
        return search.map(s -> ResponseHandler.getResponse(productService.getAllProducts(s, curPage, perPage), HttpStatus.OK))
                .orElseGet(() -> ResponseHandler.getResponse(productService.getAllProducts(curPage, perPage), HttpStatus.OK));
    }
}