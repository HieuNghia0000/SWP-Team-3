package com.team3.ministore.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentItems {
    private String name;
    private double price;
    private int quantity;
}
