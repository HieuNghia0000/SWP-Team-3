package com.team3.ministore.dto;

import lombok.Data;

@Data
public class PaymentItems {
    private String orderType;
    private int grandTotal;
}
