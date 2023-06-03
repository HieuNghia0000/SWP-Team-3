package com.team3.ministore.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@Configuration
public class SpringMvcConfig implements WebMvcConfigurer {

    private final CustomMessageConverterConfig config;

    public SpringMvcConfig(CustomMessageConverterConfig config) {
        this.config = config;
    }

    @Override
    public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
        config.webMvcConfigurer().configureMessageConverters(converters);
    }

    
}
