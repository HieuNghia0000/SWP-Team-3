package com.team3.ministore.service.impl;

import com.team3.ministore.model.Vouchers;
import com.team3.ministore.repository.VouchersRepository;
import com.team3.ministore.service.VouchersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VouchersServiceImpl implements VouchersService {
    
    @Autowired
    private VouchersRepository vouchersRepository;

    @Override
    public List<Vouchers> getAllVouchers() {
        return vouchersRepository.findAll();
    }

    @Override
    public Vouchers createVouchers(Vouchers vouchers) {
        return vouchersRepository.save(vouchers);
    }

    @Override
    public Vouchers getVouchersById(String code) {
        return vouchersRepository.findById(code).orElseThrow(() -> new IllegalArgumentException("Invalid Vouchers ID: " + code));
    }

    @Override
    public Vouchers updateVouchers(String code, Vouchers vouchers) {
        Vouchers existingVouchers = getVouchersById(code);

        existingVouchers.setVoucherType(vouchers.getVoucherType());
        existingVouchers.setDiscountType(vouchers.getDiscountType());
        existingVouchers.setMaxDiscount(vouchers.getMaxDiscount());
        existingVouchers.setValidFrom(vouchers.getValidFrom());
        existingVouchers.setValidTo(vouchers.getValidTo());
        existingVouchers.setUsedCount(vouchers.getUsedCount());

        return vouchersRepository.save(existingVouchers);
    }

    @Override
    public void deleteVouchers(String id) {
        vouchersRepository.deleteById(id);
    }
}
