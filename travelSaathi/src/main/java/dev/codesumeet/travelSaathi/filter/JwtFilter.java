package dev.codesumeet.travelSaathi.filter;

import dev.codesumeet.travelSaathi.service.impl.UserDetailsServiceImpl;
import dev.codesumeet.travelSaathi.utils.JwtUtils;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;
    private final UserDetailsServiceImpl customUserDetailsService;
    private static final Logger logger = LoggerFactory.getLogger(JwtFilter.class);

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        logger.info("shouldNotFilter called for URI: {}", request.getRequestURL());
        String path = request.getServletPath();
        return path.startsWith("/api/auth/") || path.startsWith("/notifications");
    }


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        logger.info("JwtFilter called for URI: {}", request.getRequestURI());

        try {
            String authHeader = request.getHeader("Authorization");

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String jwt = authHeader.substring(7); // Remove "Bearer " prefix
                logger.info("Extracted JWT: {}", jwt);

                if (jwtUtils.validateJwt(jwt)) {
                    logger.info("Valid JWT found");
                    setAuthenticationContext(jwt, request);
                } else {
                    logger.info("Invalid JWT found in request");
                }
            } else {
                logger.info("No Authorization header found or it does not start with Bearer");
            }
        } catch (ExpiredJwtException e) {
            logger.error("JWT expired: {}", e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Unauthorized: Token has expired");
            return;
        } catch (UnsupportedJwtException e) {
            logger.error("JWT format unsupported: {}", e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Unauthorized: Token format unsupported");
            return;
        } catch (Exception e) {
            logger.error("Cannot set user authentication: {}", e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Unauthorized: " + e.getMessage());
            return;
        }

        filterChain.doFilter(request, response);
    }

    private void setAuthenticationContext(String jwt, HttpServletRequest request) {
        logger.info("Setting authentication context for JWT: {}", jwt);
        String username = jwtUtils.getUsernameFromJwt(jwt);
        if (username != null) {
            logger.info("Username extracted from JWT: {}", username);
            UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
            if (userDetails != null) {
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
                logger.info("User '{}' authenticated with roles: {}", username, userDetails.getAuthorities());
            } else {
                logger.info("User details not found for username: {}", username);
            }
        } else {
            logger.info("Username could not be extracted from JWT");
        }
    }
}
