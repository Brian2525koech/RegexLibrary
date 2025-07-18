# RegexLibrary
A professional utility library for regex-based operations in JavaScript.
# regex-utils

A professional JavaScript library for regex-based validation, formatting, and text processing. Supports international phone number validation, password strength checking, email validation, and more.

## Features
- **International Phone Number Validation**: Validates phone numbers for countries like USA (+1), Kenya (+254), Tanzania (+255), UK (+44), India (+91), Australia (+61), Nigeria (+234), Brazil (+55), Germany (+49), Japan (+81), with country-specific mobile prefixes and length checks.
- **Phone Number Formatting**: Standardizes phone numbers to a consistent format (e.g., `+12025550123`).
- **Password Validation**: Checks password complexity and provides real-time feedback on requirements (8+ chars, uppercase, lowercase, digit, special char, no whitespace).
- **Email Validation**: Validates email addresses per RFC 5322 (simplified).
- **Text Processing**: Extracts hashtags, mentions, URLs, and tokenizes text into words, numbers, and punctuation.
- **TypeScript Support**: Includes JSDoc annotations for TypeScript compatibility.
- **Browser and Node.js Compatible**: Works in both environments.
- **Front-End Demo**: A responsive UI with real-time validation and a password strength meter.

## Installation

### npm
```bash
npm install regex-utils