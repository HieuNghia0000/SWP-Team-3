package com.team3.ministore.controller;

import com.team3.ministore.model.Vouchers;
import com.team3.ministore.service.VouchersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/list")
    public ResponseEntity<List<Vouchers>> getAllVouchers() {
        List<Vouchers> vouchersList = vouchersService.getAllVouchers();
        return new ResponseEntity<>(vouchersList, HttpStatus.OK);
    }

    @GetMapping("/search/{code}")
    public ResponseEntity<Vouchers> getVouchersById(@PathVariable("code") String code) {
        Vouchers vouchers = vouchersService.getVouchersById(code);
        return new ResponseEntity<>(vouchers, HttpStatus.OK);
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
}
