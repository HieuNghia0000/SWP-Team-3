package com.team3.ministore.service;

import com.team3.ministore.model.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CategoryService {
    List<Category> getAllCategory();

    Category createCategory(Category category);

    Category getCategoryById(Integer id);

    Category updateCategory(Integer id, Category category);

    void deleteCategory(Integer id);

    List<Category> getCategoryByNameLike(String name);

    Page<Category> findAllPagingCategory(int pageIndex, int pageSize);
}
