package com.team3.ministore.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "orders")
public class Orders {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private int orderId;

    @OneToMany(mappedBy = "orders")
    private List<OrderItems> orderItems;

    @Column(name = "order_date")
    private Date orderDate;

    @Column(name = "total_amount")
    private int totalAmount;
}