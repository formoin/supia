package com.forest.supia.config.auth;

import com.forest.supia.member.model.Member;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureAlgorithm;

import java.security.Key;
import java.util.Date;

public class JwtUtil {
    private static final String SECRET_KEY = "6fda8ca2111576f2060cdae73aa593c4c9c7de435f95dad06a55291d4062054b439e943ab9d0fb43533d4c6fa33c437fc10d047aea9fdde205457a287543e17c";
    private static final long EXPIRATION_TIME = 86400000L; // 1일

    // Key 생성
    private static final Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    public static String generateToken(Member member) {
        return Jwts.builder().subject(member.getEmail())
                .claim("name", member.getName())
                .claim("role", "ROLE_USER")
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key)
                .compact();
    }

    public static String validateToken(String token) {
        return Jwts.parser().setSigningKey(key).build().parseClaimsJws(token).getBody().getSubject();

    }
}
