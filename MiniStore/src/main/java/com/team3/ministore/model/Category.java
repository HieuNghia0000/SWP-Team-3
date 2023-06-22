package com.team3.ministore.model;

import lombok.Data;

import javax.persistence.*;

@Entity
@Data
@Table(name = "category")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private int categoryId;

    @Column(name = "name", length = 100)
    private String name;

    @Column(name = "description", length = 300)
    private String description;
}
