package com.team3.ministore.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;

@Configuration
@EnableWebSecurity
public class SpringSecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
                .antMatchers("/", "/login").permitAll()
                .antMatchers("/admin/**").hasRole("admin")
                .antMatchers("/staff/**").hasRole("staff")
                .anyRequest().authenticated()
                .and()
            .formLogin()
                .loginPage("/")
                .permitAll()
                .loginProcessingUrl("/login")
                .successHandler(((request, response, authentication) -> response.setStatus(HttpStatus.OK.value())))
                .failureHandler(((request, response, exception) -> response.setStatus(HttpStatus.UNAUTHORIZED.value())))
                .and()
            .exceptionHandling()
                .accessDeniedHandler(((request, response, accessDeniedException) -> response.setStatus(HttpStatus.NOT_FOUND.value())))
                .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
                .and()
            .logout()
                .logoutUrl("/logout")
                .permitAll()
                .logoutSuccessHandler(((request, response, authentication) -> response.setStatus(HttpStatus.OK.value())))
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
                .and()
            .csrf().disable();
    }
}
