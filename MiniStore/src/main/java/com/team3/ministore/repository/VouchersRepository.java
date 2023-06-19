package com.team3.ministore.repository;

import com.team3.ministore.model.Vouchers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VouchersRepository extends JpaRepository<Vouchers, String> {
}
