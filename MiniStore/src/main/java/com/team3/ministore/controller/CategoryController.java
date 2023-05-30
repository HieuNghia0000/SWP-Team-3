package com.team3.ministore.controller;

import com.team3.ministore.model.Category;
import com.team3.ministore.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/controller")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;


    @PostMapping("/")
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        Category createdCategory = categoryService.createCategory(category);
        return new ResponseEntity<>(createdCategory, HttpStatus.CREATED);
    }

    @GetMapping("/")
    public ResponseEntity<List<Category>> getAllCategory() {
        List<Category> categoryList = categoryService.getAllCategory();
        return new ResponseEntity<>(categoryList, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable("id") Integer id) {
        Category category = categoryService.getCategoryById(id);
        return new ResponseEntity<>(category, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable("id") Integer id, @RequestBody Category category) {
        Category updatedCategory = categoryService.updateCategory(id, category);
        return new ResponseEntity<>(updatedCategory, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable("id") Integer id) {
        categoryService.deleteCategory(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
