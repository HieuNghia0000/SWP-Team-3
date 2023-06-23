package com.team3.ministore.repository;

import com.team3.ministore.model.Vouchers;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VouchersRepository extends JpaRepository<Vouchers, String> {

    @Query("SELECT v FROM Vouchers v WHERE v.voucherCode LIKE %:voucherCode%")
    List<Vouchers> getVouchersByVoucherCodeLike(@Param("voucherCode") String voucherCode);

    @Query("SELECT v FROM Vouchers v")
    Page<Vouchers> findAllPagingVouchers(Pageable pageable);

    @Query("SELECT v FROM Vouchers v WHERE v.maxDiscount >= :fromAmount AND v.maxDiscount <= :toAmount")
    List<Vouchers> getVouchersByMaxDiscountBetween(@Param("fromAmount") float fromAmount, @Param("toAmount") float toAmount);
}
