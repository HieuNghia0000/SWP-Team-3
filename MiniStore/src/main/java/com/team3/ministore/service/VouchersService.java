package com.team3.ministore.service;

import com.team3.ministore.model.Vouchers;
import org.springframework.data.domain.Page;

import java.util.List;

public interface VouchersService {
    List<Vouchers> getAllVouchers();

    Vouchers createVouchers(Vouchers vouchers);

    Vouchers getVouchersById(String id);

    Vouchers updateVouchers(String id, Vouchers vouchers);

    void deleteVouchers(String id);

    List<Vouchers> getVouchersByVoucherCodeLike(String voucherCode);

    Page<Vouchers> findAllPagingVouchers(int pageIndex, int pageSize);

    List<Vouchers> getVouchersByMaxDiscountBetween(float fromAmount, float toAmount);
}
