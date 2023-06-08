package com.team3.ministore.service.impl;

import com.team3.ministore.dto.StaffDetails;
import com.team3.ministore.model.Staff;
import com.team3.ministore.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private StaffRepository staffRepository;

    public StaffDetails loadUserByUsername(String username)throws UsernameNotFoundException{
        Staff staff = staffRepository.findByUsername(username);
        if (staff == null) throw new UsernameNotFoundException("Không tìm thấy tài khoản!");

        Set<GrantedAuthority> authorities=new HashSet<GrantedAuthority>();
        String roleName = staff.getRole().name();
        authorities.add(new SimpleGrantedAuthority(roleName));

        return new StaffDetails(username, staff.getPassword(), authorities);
    }

}
