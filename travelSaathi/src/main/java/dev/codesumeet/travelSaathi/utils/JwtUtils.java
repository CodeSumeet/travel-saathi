package dev.codesumeet.travelSaathi.utils;

import dev.codesumeet.travelSaathi.entity.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.Getter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.Map;

@Component
@Getter
public class JwtUtils {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    @Value("${application.security.jwt.secret}")
    private String jwtSecret;

    @Value("${application.security.jwt.expiration}")
    private Long jwtExpirationMs;

    @Value("${application.security.jwt.refresh-expiration}")
    private Long refreshExpirationMs;

    @Value("${application.security.jwt.cookie-name}")
    private String jwtCookieName;

    private Key signingKey;

    @PostConstruct
    public void init() {
        signingKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }

    public String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return getJwtFromCookies(request);
    }

    public String getJwtFromCookies(HttpServletRequest request) {
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if (jwtCookieName.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    public void addJwtToCookie(String token, HttpServletResponse response) {
        Cookie cookie = new Cookie(jwtCookieName, token);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        response.addCookie(cookie);
    }

    public String getUsernameFromJwt(String token) {
        try {
            return parseClaims(token).getSubject();
        } catch (ExpiredJwtException e) {
            logger.warn("Attempt to get username from expired token: {}", e.getMessage());
            throw e; // Rethrow to allow handling in calling methods
        } catch (JwtException e) {
            logger.error("Invalid JWT token: {}", e.getMessage());
            throw e; // Rethrow to allow handling in calling methods
        }
    }

    public boolean validateJwt(String authToken) {
        try {
            parseClaims(authToken);
            return true;
        } catch (ExpiredJwtException e) {
            logger.warn("JWT token expired: {}", e.getMessage());
            throw e;
        } catch (UnsupportedJwtException e) {
            logger.error("Unsupported JWT token: {}", e.getMessage());
            throw e;
        } catch (MalformedJwtException e) {
            logger.error("Malformed JWT token: {}", e.getMessage());
            throw e;
        } catch (SignatureException e) {
            logger.error("Invalid JWT signature: {}", e.getMessage());
            throw e;
        } catch (IllegalArgumentException e) {
            logger.error("JWT token is null or empty: {}", e.getMessage());
            throw e;
        } catch (JwtException e) {
            logger.error("Unexpected error validating JWT token: {}", e.getMessage());
            throw e;
        }
    }

    public String generateAccessToken(User user) {
        return generateToken(Map.of("roles", user.getRoles()), user.getUsername(), jwtExpirationMs);
    }

    public String generateRefreshToken(String username) {
        return generateToken(Map.of(), username, refreshExpirationMs);
    }

    public boolean isTokenExpired(String token) {
        try {
            return parseClaims(token).getExpiration().before(new Date());
        } catch (ExpiredJwtException e) {
            logger.info("Token has expired: {}", token);
            return true;
        } catch (JwtException e) {
            logger.error("Error parsing token: {}", token, e);
            return true;
        }
    }

    private String generateToken(Map<String, Object> claims, String subject, Long expirationMs) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(signingKey, SignatureAlgorithm.HS512)
                .compact();
    }

    private Claims parseClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(signingKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException e) {
            logger.warn("Token has expired: {}", e.getMessage());
            throw e; // Rethrow to allow higher-level handling
        } catch (JwtException e) {
            logger.error("Error parsing token: {}", e.getMessage());
            throw e; // Rethrow to allow higher-level handling
        }
    }

    public LocalDateTime getRefreshTokenExpiry() {
        Instant expirationInstant = Instant.now().plusMillis(refreshExpirationMs);
        return LocalDateTime.ofInstant(expirationInstant, ZoneId.systemDefault());
    }
}
