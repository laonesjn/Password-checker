# Password Strength Checker

A simple browser-based tool that checks the strength of a password in real time. Everything runs locally — nothing is sent to any server.

## Features

- Real-time strength meter (5 segments: Very Weak → Strong)
- Checklist of 5 validation rules
- Show/hide password toggle
- Secure password generator using the Web Crypto API

## Validation Rules

1. At least 8 characters
2. At least one uppercase letter (A–Z)
3. At least one lowercase letter (a–z)
4. At least one number (0–9)
5. At least one special character (`!@#$%^&*(),.?":{}|<>`)

## Project Structure

```
Password checker/
├── Password Strength Checker.html  # Markup
├── style.css                       # Styles
└── script.js                       # Logic
```

## Usage

Just open `Password Strength Checker.html` in any modern browser — no build tools or dependencies needed.
