# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security seriously. If you discover a vulnerability in VALO OS (Aurora Finanzix), please follow these steps:

1. **Do NOT report security issues via public GitHub Issues.**
2. Send an email to **seguridad@aurorafinanzix.com** or contact the lead maintainer directly via GitHub Security Advisories.
3. Include detailed steps to reproduce the issue, along with any relevant payloads or configuration details.
4. We will acknowledge receipt of your vulnerability report within 48 hours and provide a remediation timeline.

## Android App Signing & Secrets Management

- Production signing keys (`release.keystore` / `*.jks`) and `keystore.properties` are strictly excluded from version control via `.gitignore`.
- Signing credentials must be injected via CI/CD environment secrets or stored locally in ignored `keystore.properties`.
- Web push notification endpoints are protected via `PUSH_ADMIN_TOKEN` and strict VAPID validation.
