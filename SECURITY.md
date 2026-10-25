# Security Policy — PlanAura

PlanAura implements defense-in-depth security principles across its client applications and Express 5 API server.

---

## 🛡️ Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

---

## 🔒 Defense-in-Depth Security Controls

PlanAura enforces 6 core security controls:

### 1. Manual Permissions-Policy Header
Restricts browser feature access to prevent unauthorized hardware access:
```http
Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(), usb=()
```

### 2. Strict Content Security Policy (CSP)
Whitelists only approved script, style, and font resources via Helmet:
```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; connect-src 'self' https://generativelanguage.googleapis.com; img-src 'self' data: https: blob:;
```

### 3. Clickjacking & MIME Sniffing Defense
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`

### 4. Distributed Request Tracing
Every incoming HTTP request is assigned a unique UUID in `X-Request-Id`, propagated through operational error boundaries and client telemetry.

### 5. Input Sanitization & Payload Protection
- Global XSS sanitizer strips `<script>` tags and JavaScript URLs from request bodies and query parameters.
- Strict JSON payload body limit capped at `250kb` to prevent memory exhaustion and payload bombs.

### 6. Rate Limiting & Denial of Service Protection
- API routes are throttled to 60 requests per minute per IP via `express-rate-limit`.

---

## 🚨 Reporting a Vulnerability

Please report any suspected vulnerability to:
`security@planaura.dev`

All reports will be acknowledged within 24 hours with a mitigation roadmap.
