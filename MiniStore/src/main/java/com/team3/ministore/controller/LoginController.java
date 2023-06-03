package com.team3.ministore.controller;

import com.team3.ministore.model.Staff;
import com.team3.ministore.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class LoginController {

    @Autowired
    private StaffRepository staffRepository;

    @GetMapping("/login")
    public String showLoginForm(Model model) {
        model.addAttribute("errorMessage", "");
        return "login";
    }

    @PostMapping("/login")
    public String login(@RequestParam("username") String username, @RequestParam("password") String password, RedirectAttributes redirectAttributes) {
        Staff staff = staffRepository.findByUsername(username);

        if (staff != null && staff.getPassword().equals(password)) {
            String role = staff.getRole();
            if ("admin".equalsIgnoreCase(role)) {
                return "redirect:/admin";
            } else if ("staff".equalsIgnoreCase(role)) {
                return "redirect:/staff";
            }
        }

        redirectAttributes.addFlashAttribute("error", "Invalid username and password");
        return "redirect:/";
    }

}
