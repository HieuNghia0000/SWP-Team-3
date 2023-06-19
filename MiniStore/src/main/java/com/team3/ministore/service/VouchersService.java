package com.team3.ministore.service;

import com.team3.ministore.model.Vouchers;

import java.util.List;

public interface VouchersService {
    List<Vouchers> getAllVouchers();

    Vouchers createVouchers(Vouchers vouchers);

    Vouchers getVouchersById(String id);

    Vouchers updateVouchers(String id, Vouchers vouchers);

    void deleteVouchers(String id);
}
