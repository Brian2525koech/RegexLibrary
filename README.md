# regex-utils

[![npm version](https://img.shields.io/npm/v/regex-utils.svg)](https://www.npmjs.com/package/regex-utils)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repo-blue.svg)](https://github.com/Brian2525koech/RegexLibrary)
[![Build Status](https://img.shields.io/github/workflow/status/Brian2525koech/RegexLibrary/CI)](https://github.com/Brian2525koech/RegexLibrary/actions)
[![Downloads](https://img.shields.io/npm/dm/regex-utils)](https://www.npmjs.com/package/regex-utils)

A professional JavaScript library for regex-based validation, formatting, and text processing. Supports international phone number validation, password strength checking, email validation, and more.

## 🚀 Features

- **🌍 International Phone Number Validation**: Validates phone numbers for countries like:
  - USA (+1), Kenya (+254), Tanzania (+255), UK (+44), India (+91)
  - Australia (+61), Nigeria (+234), Brazil (+55), Germany (+49), Japan (+81)
  - Includes country-specific mobile prefixes and length checks
- **📱 Phone Number Formatting**: Standardizes phone numbers to a consistent format (e.g., `+12025550123`)
- **🔒 Password Validation**: Checks complexity with real-time feedback:
  - Minimum 8 characters, uppercase, lowercase, digit, special character
  - No leading/trailing whitespace
- **📧 Email Validation**: Validates email addresses per RFC 5322 (simplified)
- **🔍 Text Processing**: Extracts hashtags, mentions, URLs, and tokenizes text into words, numbers, and punctuation
- **📘 TypeScript Support**: Includes JSDoc annotations for TypeScript compatibility
- **🌐 Browser and Node.js Compatible**: Works seamlessly in both environments
- **🎨 Front-End Demo**: Responsive UI with real-time validation and password strength meter

## 📦 Installation

### npm
```bash
npm install regex-utils
```

### yarn
```bash
yarn add regex-utils
```

### CDN
```html
<script src="https://unpkg.com/regex-utils@latest/dist/regexUtils.min.js"></script>
```

## 💻 Local Setup

Clone the repository:
```bash
git clone https://github.com/Brian2525koech/RegexLibrary.git
cd RegexLibrary
```

Install dependencies:
```bash
npm install
```

Run tests:
```bash
npm test
```

## 🌐 Browser Usage

Copy `src/regexUtils.js` and `demo/index.html` to your project.
Open `demo/index.html` in a browser to explore the interactive demo.

## 🔧 Usage

### Node.js
```javascript
import { 
  validateInternationalPhoneNumber, 
  formatPhoneNumber, 
  checkPasswordStrength 
} from 'regex-utils';

console.log(validateInternationalPhoneNumber('+12025550123')); 
// { isValid: true, requirements: [...] }

console.log(formatPhoneNumber('+1 (202) 555-0123')); 
// "+12025550123"

console.log(checkPasswordStrength('Pass123!@#')); 
// { isValid: true, requirements: [...] }
```

### Browser
```html
<script src="src/regexUtils.js"></script>
<script>
  console.log(regexUtils.validateEmail('user@domain.com')); // true
  console.log(regexUtils.validateInternationalPhoneNumber('+254712345678')); 
  // { isValid: true, requirements: [...] }
</script>
```

## 📚 API Documentation

### `validateEmail(email: string): boolean`
Validates an email address per RFC 5322 (simplified).

**Example:**
```javascript
regexUtils.validateEmail('user@domain.com') // true
```

### `validateInternationalPhoneNumber(phone: string): ValidationResult`
Validates an international phone number with country-specific rules.

**Example:**
```javascript
regexUtils.validateInternationalPhoneNumber('+12025550123') 
// { isValid: true, requirements: [...] }
```

### `formatPhoneNumber(phone: string): string`
Formats a phone number to a standard format (e.g., +12025550123).

**Example:**
```javascript
regexUtils.formatPhoneNumber('+1 (202) 555-0123') // '+12025550123'
```

### `checkPasswordComplexity(password: string): boolean`
Checks if a password meets complexity requirements (8+ chars, uppercase, lowercase, digit, special char, no whitespace).

**Example:**
```javascript
regexUtils.checkPasswordComplexity('Pass123!@#') // true
```

### `checkPasswordStrength(password: string): ValidationResult`
Provides detailed feedback on password strength.

**Example:**
```javascript
regexUtils.checkPasswordStrength('Pass123!@#') 
// { isValid: true, requirements: [...] }
```

### `extractSocialMediaEntities(text: string): SocialMediaEntities`
Extracts hashtags, mentions, and URLs from text.

**Example:**
```javascript
regexUtils.extractSocialMediaEntities('Hello @user #coding https://example.com')
// { hashtags: ['#coding'], mentions: ['@user'], urls: ['https://example.com'] }
```

### `cleanString(text: string, options?: CleanOptions): string`
Cleans and formats a string (removes extra spaces, applies case, optionally removes special characters).

**Example:**
```javascript
regexUtils.cleanString('  Hello   World!  ', { case: 'title' }) // 'Hello World!'
```

### `tokenizeText(text: string): TokenizedText`
Tokenizes text into words, numbers, punctuation, hashtags, mentions, and URLs.

**Example:**
```javascript
regexUtils.tokenizeText('Hello, world! 123.45 and @user #coding https://example.com')
// { 
//   words: ['Hello', 'world'], 
//   numbers: ['123.45'], 
//   punctuation: [',', '!'], 
//   hashtags: ['#coding'], 
//   mentions: ['@user'], 
//   urls: ['https://example.com'] 
// }
```

## 🎨 Interactive Demo

Ensure `src/regexUtils.js` and `demo/index.html` are in the project directory.

Open `demo/index.html` in a browser.

### Test inputs:
- **Email**: `user@domain.com` (valid), `invalid@domain` (invalid)
- **Phone**: `+12025550123`, `+254712345678` (valid), `+254612345678` (invalid prefix)
- **Password**: `Pass123!@#` (valid), `pass123` (invalid)

## 🔧 TypeScript Support

Ensure `tsconfig.json` is configured. Run:
```bash
npm run build
```

This compiles `src/regexUtils.js` to `dist/regexUtils.js` for TypeScript compatibility.

## 🧪 Testing

Run unit tests to verify functionality:
```bash
npm test
```

## 🌍 Supported Countries

| Country | Code | Example |
|---------|------|---------|
| USA | +1 | +12025550123 |
| Kenya | +254 | +254712345678 |
| Tanzania | +255 | +255712345678 |
| UK | +44 | +447911123456 |
| India | +91 | +919876543210 |
| Australia | +61 | +61412345678 |
| Nigeria | +234 | +2348012345678 |
| Brazil | +55 | +5511987654321 |
| Germany | +49 | +4915123456789 |
| Japan | +81 | +819012345678 |

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.

## 🤝 Contributing

Contributions are welcome! Please submit a pull request or open an issue on [GitHub](https://github.com/Brian2525koech/RegexLibrary).

## 👨‍💻 Author

**Brian Koech**

- GitHub: [@Brian2525koech](https://github.com/Brian2525koech)
- Email: briankoech@example.com

---

**⭐ Star this repo if you find it useful!**