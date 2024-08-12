package com.forest.supia.config.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final CustomOAuth2UserService customOAuth2UserService;
    private final JwtRequestFilter jwtRequestFilter;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    public SecurityConfig(CustomOAuth2UserService customOAuth2UserService, JwtRequestFilter jwtRequestFilter) {
        this.customOAuth2UserService = customOAuth2UserService;
        this.jwtRequestFilter = jwtRequestFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

//        http
//                .csrf(AbstractHttpConfigurer::disable)
//                .authorizeHttpRequests((authorizeRequests) ->
//                        authorizeRequests
//                                .anyRequest().permitAll()
//                );
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeRequests(auth -> auth
                        .requestMatchers("/members/login", "/members/register", "/members/social-login","/openvidu/**", "/notification/subscribe/**").permitAll()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}
