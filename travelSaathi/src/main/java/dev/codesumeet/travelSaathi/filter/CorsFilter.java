package dev.codesumeet.travelSaathi.filter;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class CorsFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(CorsFilter.class);

    private static final String ALLOWED_ORIGIN = "http://localhost:5173";
    private static final String ALLOWED_METHODS = "GET, POST, PUT, DELETE, OPTIONS";
    private static final String ALLOWED_HEADERS = "authorization, content-type, xsrf-token";
    private static final String EXPOSED_HEADERS = "xsrf-token";

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        response.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setHeader("Access-Control-Allow-Methods", ALLOWED_METHODS);
        response.setHeader("Access-Control-Max-Age", "3600");
        response.setHeader("Access-Control-Allow-Headers", ALLOWED_HEADERS);
        response.addHeader("Access-Control-Expose-Headers", EXPOSED_HEADERS);

        if ("OPTIONS".equals(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }
        filterChain.doFilter(request, response);
        logRequestDetails(request);
    }

    private void logRequestDetails(HttpServletRequest request) {
        if (logger.isDebugEnabled()) {
            logger.debug("CORS Filter: {} request to {}", request.getMethod(), request.getRequestURI());
            logger.debug("Request Headers:");
            request.getHeaderNames().asIterator().forEachRemaining(header ->
                    logger.debug("{}: {}", header, request.getHeader(header)));
        }
    }

    @Override
    public void destroy() {
        // No cleanup necessary
    }
}
