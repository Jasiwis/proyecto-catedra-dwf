package sv.udb.multiworksapi.config.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import sv.udb.multiworksapi.common.ApiResponse;
import sv.udb.multiworksapi.common.exceptions.InvalidJwtException;
import sv.udb.multiworksapi.config.security.UserDetailsServiceImpl;
import sv.udb.multiworksapi.entity.User;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsServiceImpl userDetailsService;
    private final ObjectMapper objectMapper;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        try {
            HttpServletRequest httpRequest = (HttpServletRequest) request;
            String path = httpRequest.getRequestURI();

            if (path.startsWith("/auth/login") || path.startsWith("/auth/register")) {
                filterChain.doFilter(request, response);
                return;
            }

            final String authHeader = request.getHeader("Authorization");


            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);


                if (!jwtUtil.validateToken(token)) {
                    throw new InvalidJwtException("No autorizado");
                }

                String userId = jwtUtil.extractUserId(token);
                User user = userDetailsService.getById(userId);

                var auth = new UsernamePasswordAuthenticationToken(
                        user, null, null
                );
                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(auth);


            } else {
                throw new InvalidJwtException("No autorizado");
            }
        } catch (Exception ex) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");

            ApiResponse<Void> errorResponse = ApiResponse.<Void>builder()
                    .success(false)
                    .message("No autorizado")
                    .errors(List.of(ApiResponse.ApiError.builder()
                            .field("authorization")
                            .message("No autorizado")
                            .build()))
                    .build();

            response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
            return;

        }

        filterChain.doFilter(request, response);
    }
}
