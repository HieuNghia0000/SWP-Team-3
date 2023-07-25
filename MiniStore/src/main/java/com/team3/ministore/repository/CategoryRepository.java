package com.team3.ministore.repository;

import com.team3.ministore.model.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {

    @Query("SELECT c FROM Category c WHERE c.name LIKE %:name%")
    List<Category> getCategoryByNameLike(@Param("name") String name);

    @Query("SELECT c FROM Category c")
    Page<Category> findAllPagingCategory(Pageable pageable);

    List<Category> findAllByNameContainingIgnoreCase(String search, Pageable pageable);
}
