package com.team3.ministore.controller;

import com.team3.ministore.model.Category;
import com.team3.ministore.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;


    @PostMapping("/add")
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        Category createdCategory = categoryService.createCategory(category);
        return new ResponseEntity<>(createdCategory, HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable("id") Integer id, @RequestBody Category category) {
        Category updatedCategory = categoryService.updateCategory(id, category);
        return new ResponseEntity<>(updatedCategory, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable("id") Integer id) {
        categoryService.deleteCategory(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("")
    public ResponseEntity<Page<Category>> getCategories(@RequestParam("search") Optional<String> searchParam,
                                                        @RequestParam("curPage")Optional<Integer> curPageParam) {
        List<Category> categoryList;
        Page<Category> categoryPage;

        if (searchParam.isPresent()) {
            String search = searchParam.get();

            categoryList = categoryService.getCategoryByNameLike(search);
        }
        else {
            categoryList = categoryService.getAllCategory();
        }

        if (curPageParam.isPresent()) {
            int curPage = curPageParam.get();
            int perPage = 10;

            categoryPage = categoryService.findAllPagingCategory(curPage, perPage);
            if (categoryPage.getSize() == 0) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
        }
        else {
            int curPage = 1;
            int perPage = 10;

            categoryPage = categoryService.findAllPagingCategory(curPage, perPage);
            if (categoryPage.getSize() == 0) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
        }

        if (categoryList != null) {
            List<Category> filteredCategories = categoryPage.stream().filter(categoryList::contains).collect(Collectors.toList());

            categoryPage = new PageImpl<>(filteredCategories, categoryPage.getPageable(), filteredCategories.size());
        }

        return new ResponseEntity<>(categoryPage, HttpStatus.OK);
    }
}
