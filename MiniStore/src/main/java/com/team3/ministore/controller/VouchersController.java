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

    @PostMapping("/")
    public ResponseEntity<Vouchers> createVouchers(@RequestBody Vouchers vouchers) {
        Vouchers createdVouchers = vouchersService.createVouchers(vouchers);
        return new ResponseEntity<>(createdVouchers, HttpStatus.CREATED);
    }

    @GetMapping("/")
    public ResponseEntity<List<Vouchers>> getAllVouchers() {
        List<Vouchers> vouchersList = vouchersService.getAllVouchers();
        return new ResponseEntity<>(vouchersList, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vouchers> getVouchersById(@PathVariable("id") Integer id) {
        Vouchers vouchers = vouchersService.getVouchersById(id);
        return new ResponseEntity<>(vouchers, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vouchers> updateVouchers(@PathVariable("id") Integer id, @RequestBody Vouchers vouchers) {
        Vouchers updatedVouchers = vouchersService.updateVouchers(id, vouchers);
        return new ResponseEntity<>(updatedVouchers, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVouchers(@PathVariable("id") Integer id) {
        vouchersService.deleteVouchers(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
