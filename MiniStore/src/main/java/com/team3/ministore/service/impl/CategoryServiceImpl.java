package com.team3.ministore.service.impl;

import com.team3.ministore.model.Category;
import com.team3.ministore.repository.CategoryRepository;
import com.team3.ministore.service.CategoryService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<Category> getAllCategory() {
        return categoryRepository.findAll();
    }

    @Override
    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    @Override
    public Category getCategoryById(Integer id) {
        return categoryRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Invalid category ID:" + id));
    }

    @Override
    public Category updateCategory(Integer id, Category category) {
        Category existingCategory = getCategoryById(id);

        existingCategory.setName(category.getName());
        existingCategory.setDescription(category.getDescription());

        return categoryRepository.save(existingCategory);
    }

    @Override
    public void deleteCategory(Integer id) {
        categoryRepository.deleteById(id);
    }

    @Override
    public List<Category> getCategoryByNameLike(String name) {
        return categoryRepository.getCategoryByNameLike(name);
    }

    @Override
    public Page<Category> findAllPagingCategory(int pageIndex, int pageSize) {
        Pageable pageable = PageRequest.of(pageIndex - 1, pageSize);
        return categoryRepository.findAllPagingCategory(pageable);
    }
}
