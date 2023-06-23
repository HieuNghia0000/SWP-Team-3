package com.team3.ministore.controller;

import com.team3.ministore.model.Vouchers;
import com.team3.ministore.service.VouchersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/vouchers")
public class VouchersController {
    
    @Autowired
    private VouchersService vouchersService;

    @PostMapping("/add")
    public ResponseEntity<Vouchers> createVouchers(@RequestBody Vouchers vouchers) {
        Vouchers createdVouchers = vouchersService.createVouchers(vouchers);
        return new ResponseEntity<>(createdVouchers, HttpStatus.CREATED);
    }

    @PutMapping("/update/{code}")
    public ResponseEntity<Vouchers> updateVouchers(@PathVariable("code") String code, @RequestBody Vouchers vouchers) {
        Vouchers updatedVouchers = vouchersService.updateVouchers(code, vouchers);
        return new ResponseEntity<>(updatedVouchers, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{code}")
    public ResponseEntity<Void> deleteVouchers(@PathVariable("code") String code) {
        vouchersService.deleteVouchers(code);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("")
    public ResponseEntity<Page<Vouchers>> getVouchers(@RequestParam("search") Optional<String> searchParam,
                                                      @RequestParam("amount_from") Optional<Float> fromAmountParam,
                                                      @RequestParam("amount_to") Optional<Float> toAmountParam,
                                                      @RequestParam("curPage") Optional<Integer> curPageParam) {
        List<Vouchers> vouchersList;
        Page<Vouchers> vouchersPage;

        if (searchParam.isPresent()) {
            String search = searchParam.get();

            vouchersList = vouchersService.getVouchersByVoucherCodeLike(search);
        }
        else if (fromAmountParam.isPresent() && toAmountParam.isPresent()) {
            float fromAmount = fromAmountParam.get();
            float toAmount = toAmountParam.get();

            vouchersList = vouchersService.getVouchersByMaxDiscountBetween(fromAmount, toAmount);
        }
        else {
            vouchersList = vouchersService.getAllVouchers();
        }

        if (fromAmountParam.isPresent() && toAmountParam.isPresent()) {
            float fromAmount = fromAmountParam.get();
            float toAmount = toAmountParam.get();

            vouchersList = filterVouchersByAmount(vouchersList, fromAmount, toAmount);
        }

        if (curPageParam.isPresent()) {
            int curPage = curPageParam.get();
            int perPage = 10;

            vouchersPage = vouchersService.findAllPagingVouchers(curPage, perPage);

            if (vouchersPage.getSize() == 0) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
        }
        else {
            int curPage = 1;
            int perPage = 10;

            vouchersPage = vouchersService.findAllPagingVouchers(curPage, perPage);

            if (vouchersPage.getSize() == 0) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
        }

        if (vouchersList != null) {
            List<Vouchers> filteredVouchers = vouchersPage.stream().filter(vouchersList::contains).collect(Collectors.toList());

            vouchersPage = new PageImpl<>(filteredVouchers, vouchersPage.getPageable(), filteredVouchers.size());
        }

        return new ResponseEntity<>(vouchersPage, HttpStatus.OK);
    }

    private List<Vouchers> filterVouchersByAmount(List<Vouchers> vouchersList, float fromAmount, float toAmount) {
        List<Vouchers> filteredVouchers = new ArrayList<>();

        for (Vouchers vouchers : vouchersList) {
            float vouchersAmount = vouchers.getMaxDiscount();

            if (vouchersAmount >= fromAmount && vouchersAmount <= toAmount) {
                filteredVouchers.add(vouchers);
            }
        }

        return filteredVouchers;
    }
}
