package com.team3.ministore.config;

import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.http.converter.xml.MappingJackson2XmlHttpMessageConverter;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;

@Configuration
public class CustomMessageConverterConfig {

    @Bean
    public MappingJackson2HttpMessageConverter jsonMessageConverter() {
        MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
        converter.setSupportedMediaTypes(List.of(MediaType.APPLICATION_JSON));
        converter.setDefaultCharset(StandardCharsets.UTF_8);
        return converter;
    }

    @Bean
    public MappingJackson2XmlHttpMessageConverter xmlMessageConverter() {
        MappingJackson2XmlHttpMessageConverter converter = new MappingJackson2XmlHttpMessageConverter();
        converter.setSupportedMediaTypes(Arrays.asList(MediaType.APPLICATION_XML, MediaType.TEXT_XML, MediaType.valueOf("application/vnd.mycompany.custom+xml")));
        converter.setDefaultCharset(StandardCharsets.UTF_8);
        converter.setObjectMapper(new XmlMapper());
        return converter;
    }

    @Bean
    public MappingJackson2HttpMessageConverter allMediaTypeMessageConverter() {
        MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
        converter.setSupportedMediaTypes(List.of(MediaType.ALL));
        converter.setDefaultCharset(StandardCharsets.UTF_8);
        return converter;
    }

    @Bean
    public WebMvcConfigurer webMvcConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
                converters.add(jsonMessageConverter());
                converters.add(xmlMessageConverter());
                converters.add(allMediaTypeMessageConverter());
            }
        };
    }
}
