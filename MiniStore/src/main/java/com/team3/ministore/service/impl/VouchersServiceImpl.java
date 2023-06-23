package com.team3.ministore.service.impl;

import com.team3.ministore.model.Vouchers;
import com.team3.ministore.repository.VouchersRepository;
import com.team3.ministore.service.VouchersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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

        existingVouchers.setDiscountType(vouchers.getDiscountType());
        existingVouchers.setDiscountValue(vouchers.getDiscountValue());
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

    @Override
    public List<Vouchers> getVouchersByVoucherCodeLike(String voucherCode) {
        return vouchersRepository.getVouchersByVoucherCodeLike(voucherCode);
    }

    @Override
    public Page<Vouchers> findAllPagingVouchers(int pageIndex, int pageSize) {
        Pageable pageable = PageRequest.of(pageIndex - 1, pageSize);
        return vouchersRepository.findAllPagingVouchers(pageable);
    }

    @Override
    public List<Vouchers> getVouchersByMaxDiscountBetween(float fromAmount, float toAmount) {
        return vouchersRepository.getVouchersByMaxDiscountBetween(fromAmount, toAmount);
    }
}
