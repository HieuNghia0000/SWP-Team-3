package com.team3.ministore.dto;

import com.team3.ministore.model.Category;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDto {
    private int categoryId;
    private String name;
    private String description;
    private int numberOfProducts;

    public CategoryDto(Category category) {
        this.categoryId = category.getCategoryId();
        this.name = category.getName();
        this.description = category.getDescription();
        this.numberOfProducts = category.getProducts().size();
    }
}
