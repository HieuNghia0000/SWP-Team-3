package com.team3.ministore.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "vouchers")
public class Vouchers {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "voucher_id")
    private int voucherId;

    @OneToMany(mappedBy = "vouchers")
    private List<OrderItems> orderItems;

    @Column(name = "code")
    private String code;

    @Column(name = "voucher_type")
    private int voucherType;

    @Column(name = "discount_type")
    private int discountType;

    @Column(name = "max_discount")
    private float maxDiscount;

    @Column(name = "valid_from")
    private Timestamp validFrom;

    @Column(name = "valid_to")
    private Timestamp validTo;

    @Column(name = "used_count")
    private int usedCount;
}
