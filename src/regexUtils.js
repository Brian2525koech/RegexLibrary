// @ts-nocheck // Uncomment to disable TypeScript checking if needed
/**
 * A professional utility library for regex-based operations in JavaScript.
 * Provides functions for validating, formatting, extracting, cleaning, tokenizing, and real-time validation of phone numbers and passwords.
 * @module regexUtils
 */

/**
 * Validates an email address according to common standards.
 * @param {string} email - The email address to validate.
 * @returns {boolean} True if the email is valid, false otherwise.
 */
function validateEmail(email) {
  if (typeof email !== 'string' || email.length === 0) return false;

  // Regex: username@domain.tld
  // - Username: letters, digits, dots, hyphens, underscores, %+- (1-64 chars)
  // - Domain: letters, digits, dots, hyphens
  // - TLD: letters (2-63 chars)
  const regex = /^[a-zA-Z0-9._%+-]{1,64}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/;
  return regex.test(email);
}

/**
 * Validates an international phone number for multiple countries (e.g., USA, Kenya, Tanzania, UK, India, Australia, Nigeria, Brazil, Germany, Japan).
 * Supports formats like +12025550123, +254712345678, +919876543210, etc.
 * @param {string} phone - The phone number to validate.
 * @returns {{ isValid: boolean, requirements: Array<{ met: boolean, message: string }> }} Object with isValid (boolean) and requirements (array of { met: boolean, message: string }).
 */
function validateInternationalPhoneNumber(phone) {
  if (typeof phone !== 'string' || phone.length === 0) {
    return {
      isValid: false,
      requirements: [
        { met: false, message: 'Must include country code (+ or 00)' },
        { met: false, message: 'Valid length for the country' },
        { met: false, message: 'Only digits, spaces, hyphens, or parentheses allowed' },
        { met: false, message: 'Valid country code (e.g., +1, +254, +44)' },
        { met: false, message: 'Valid mobile prefix for the country (if applicable)' }
      ]
    };
  }

  // Define requirements for validation
  const requirements = [
    {
      regex: /^(\+|00)/,
      message: 'Must include country code (+ or 00)',
      met: false
    },
    {
      regex: /^(\+|00)[0-9\s\-\(\)]{6,14}[0-9]$/,
      message: 'Valid length for the country',
      met: false
    },
    {
      regex: /^(\+|00)[0-9\s\-\(\)]*$/,
      message: 'Only digits, spaces, hyphens, or parentheses allowed',
      met: false
    },
    {
      // Common country codes: USA (+1), Kenya (+254), Tanzania (+255), UK (+44), India (+91), Australia (+61), Nigeria (+234), Brazil (+55), Germany (+49), Japan (+81)
      regex: /^(\+|00)(1|254|255|44|91|61|234|55|49|81)\d/,
      message: 'Valid country code (e.g., +1, +254, +44)',
      met: false
    },
    {
      // Placeholder for mobile prefix validation (updated below)
      regex: /.*/, // Will be dynamically set based on country code
      message: 'Valid mobile prefix for the country (if applicable)',
      met: true // Default to true, updated if country has specific mobile prefixes
    }
  ];

  // Test basic requirements
  requirements.forEach(req => {
    if (req.message !== 'Valid mobile prefix for the country (if applicable)') {
      req.met = req.regex.test(phone);
    }
  });

  // Country-specific validation (length and mobile prefixes)
  const countryCodeMatch = phone.match(/^(\+|00)(\d{1,3})/);
  let isValidLength = false;
  let isValidMobilePrefix = true;

  if (countryCodeMatch) {
    const countryCode = countryCodeMatch[2];
    const digits = phone.replace(/[^\d]/g, '').slice(countryCode.length);

    // Country-specific rules
    const countryRules = {
      '1': { length: 10, mobilePrefixes: ['202', '212', '310', '408', '415', '510', '650', '213', '323', '424', '619', '707', '805', '818', '831', '858', '909', '916', '925', '949'] }, // USA
      '254': { length: 9, mobilePrefixes: ['70', '71', '72', '73', '74', '75', '76', '77', '78', '79'] }, // Kenya
      '255': { length: 9, mobilePrefixes: ['65', '67', '68', '69', '71', '73', '74', '75', '76', '77', '78', '79'] }, // Tanzania
      '44': { length: 10, mobilePrefixes: ['74', '75', '77', '78', '79'] }, // UK
      '91': { length: 10, mobilePrefixes: ['6', '7', '8', '9'] }, // India
      '61': { length: 9, mobilePrefixes: ['4'] }, // Australia
      '234': { length: 10, mobilePrefixes: ['70', '80', '81', '90', '91'] }, // Nigeria
      '55': { length: [10, 11], mobilePrefixes: ['6', '7', '8', '9'] }, // Brazil
      '49': { length: [10, 11], mobilePrefixes: ['15', '16', '17'] }, // Germany
      '81': { length: 10, mobilePrefixes: ['70', '80', '90'] } // Japan
    };

    const rules = countryRules[countryCode];
    if (rules) {
      // Check length
      isValidLength = Array.isArray(rules.length)
        ? rules.length.includes(digits.length)
        : digits.length === rules.length;

      // Check mobile prefix (if provided)
      if (rules.mobilePrefixes) {
        const prefix = digits.slice(0, rules.mobilePrefixes[0].length);
        isValidMobilePrefix = rules.mobilePrefixes.includes(prefix);
        requirements[4].regex = new RegExp(`^(\\+|00)${countryCode}(${rules.mobilePrefixes.join('|')})`);
        requirements[4].met = isValidMobilePrefix;
      }
    } else {
      // General case: 6–14 digits
      isValidLength = digits.length >= 6 && digits.length <= 14;
      requirements[4].met = true; // No mobile prefix check for unknown country codes
    }

    requirements[1].met = requirements[1].met && isValidLength;
  } else {
    requirements[1].met = false;
    requirements[4].met = true; // No mobile prefix check if no country code
  }

  // Overall validity: all requirements must be met
  const isValid = requirements.every(req => req.met);

  return { isValid, requirements };
}

/**
 * Formats a phone number to a standardized format (e.g., +12025550123).
 * Removes spaces, hyphens, and parentheses, ensures + prefix.
 * @param {string} phone - The phone number to format.
 * @returns {string} The formatted phone number, or empty string if invalid.
 */
function formatPhoneNumber(phone) {
  if (typeof phone !== 'string' || phone.length === 0) return '';

  // Convert 00 to + if needed
  let formatted = phone.replace(/^00/, '+');

  // Remove spaces, hyphens, parentheses
  formatted = formatted.replace(/[\s\-\(\)]/g, '');

  // Ensure starts with +
  if (!formatted.startsWith('+')) {
    // If no country code, return empty (cannot determine correct format)
    return '';
  }

  // Validate basic format
  if (!/^(\+)[0-9]{6,15}$/.test(formatted)) return '';

  return formatted;
}

/**
 * Checks password complexity (basic boolean check).
 * Requirements: 8+ chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char, no leading/trailing whitespace.
 * @param {string} password - The password to check.
 * @returns {boolean} True if the password meets complexity requirements, false otherwise.
 */
function checkPasswordComplexity(password) {
  if (typeof password !== 'string' || password.length === 0) return false;

  // Regex: No leading/trailing whitespace, 8+ chars, requires uppercase, lowercase, digit, special char
  const regex = /^(?!\s)(?=\p{Lu}.*)(?=\p{Ll}.*)(?=\p{Number}.*)(?=[^\p{Letter}\p{Number}].*).{8,}$/u;
  return regex.test(password);
}

/**
 * Checks password strength and provides detailed feedback for each requirement.
 * Requirements: 8+ chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char, no leading/trailing whitespace.
 * @param {string} password - The password to check.
 * @returns {{ isValid: boolean, requirements: Array<{ met: boolean, message: string }> }} Object with isValid (boolean) and requirements (array of { met: boolean, message: string }).
 */
function checkPasswordStrength(password) {
  if (typeof password !== 'string' || password.length === 0) {
    return {
      isValid: false,
      requirements: [
        { met: false, message: 'At least 8 characters' },
        { met: false, message: 'At least one uppercase letter' },
        { met: false, message: 'At least one lowercase letter' },
        { met: false, message: 'At least one digit' },
        { met: false, message: 'At least one special character' },
        { met: false, message: 'No leading or trailing whitespace' }
      ]
    };
  }

  // Define individual regex checks for each requirement
  const requirements = [
    { regex: /.{8,}/, message: 'At least 8 characters', met: false },
    { regex: /\p{Lu}/u, message: 'At least one uppercase letter', met: false },
    { regex: /\p{Ll}/u, message: 'At least one lowercase letter', met: false },
    { regex: /\p{Number}/u, message: 'At least one digit', met: false },
    { regex: /[^\p{Letter}\p{Number}\s]/u, message: 'At least one special character', met: false },
    { regex: /^(?!\s).*(?<!\s)$/, message: 'No leading or trailing whitespace', met: false }
  ];

  // Test each requirement
  requirements.forEach(req => {
    req.met = req.regex.test(password);
  });

  // Overall validity: all requirements must be met
  const isValid = requirements.every(req => req.met);

  return { isValid, requirements };
}

/**
 * Extracts hashtags, mentions, and URLs from a text string.
 * @param {string} text - The text to extract from.
 * @returns {{ hashtags: string[], mentions: string[], urls: string[] }} Object with arrays of hashtags, mentions, and URLs.
 */
function extractSocialMediaEntities(text) {
  if (typeof text !== 'string' || text.length === 0) {
    return { hashtags: [], mentions: [], urls: [] };
  }

  // Hashtags: # followed by letters, digits, or underscores
  const hashtagRegex = /#[\p{L}\d_]+/gu;
  // Mentions: @ followed by letters, digits, or underscores
  const mentionRegex = /@[\p{L}\d_]+/gu;
  // URLs: http(s):// or www. followed by domain and optional path
  const urlRegex = /(?:https?:\/\/|www\.)[\p{L}\d\-._~:/?#[\]@!$&'()*+,;=]+/gu;

  return {
    hashtags: text.match(hashtagRegex) || [],
    mentions: text.match(mentionRegex) || [],
    urls: text.match(urlRegex) || []
  };
}

/**
 * Cleans and formats a string by removing extra spaces, converting to a specific case,
 * and optionally removing special characters.
 * @param {string} text - The text to clean.
 * @param {{ case?: 'upper' | 'lower' | 'title' | 'none', removeSpecial?: boolean }} [options] - Formatting options.
 * @returns {string} The cleaned and formatted string.
 */
function cleanString(text, { case: caseOption = 'none', removeSpecial = false } = {}) {
  if (typeof text !== 'string' || text.length === 0) return '';

  // Remove extra spaces
  let cleaned = text.replace(/\s+/g, ' ').trim();

  // Remove special characters if requested
  if (removeSpecial) {
    cleaned = cleaned.replace(/[^\p{L}\p{Number}\s]/gu, '');
  }

  // Case conversion
  switch (caseOption.toLowerCase()) {
    case 'upper':
      cleaned = cleaned.toUpperCase();
      break;
    case 'lower':
      cleaned = cleaned.toLowerCase();
      break;
    case 'title':
      cleaned = cleaned.replace(/\b\p{L}+\b/gu, word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
      break;
    default:
      break;
  }

  return cleaned;
}

/**
 * Tokenizes and parses text into words, numbers, punctuation, hashtags, mentions, and URLs.
 * @param {string} text - The text to tokenize.
 * @returns {{ words: string[], numbers: string[], punctuation: string[], hashtags: string[], mentions: string[], urls: string[] }} Object with arrays of words, numbers, punctuation, hashtags, mentions, and URLs.
 */
function tokenizeText(text) {
  if (typeof text !== 'string' || text.length === 0) {
    return { words: [], numbers: [], punctuation: [], hashtags: [], mentions: [], urls: [] };
  }

  // Words: Sequences of letters (Unicode-aware)
  const wordRegex = /\p{L}+/gu;
  // Numbers: Sequences of digits, including decimals
  const numberRegex = /\d+(?:\.\d+)?/g;
  // Punctuation: Non-letter, non-digit, non-whitespace characters
  const punctuationRegex = /[^\p{L}\p{Number}\s]/gu;
  // Hashtags, mentions, URLs (consistent with extractSocialMediaEntities)
  const hashtagRegex = /#[\p{L}\d_]+/gu;
  const mentionRegex = /@[\p{L}\d_]+/gu;
  const urlRegex = /(?:https?:\/\/|www\.)[\p{L}\d\-._~:/?#[\]@!$&'()*+,;=]+/gu;

  return {
    words: text.match(wordRegex) || [],
    numbers: text.match(numberRegex) || [],
    punctuation: text.match(punctuationRegex) || [],
    hashtags: text.match(hashtagRegex) || [],
    mentions: text.match(mentionRegex) || [],
    urls: text.match(urlRegex) || []
  };
}

// Export for Node.js or browser
const regexUtils = {
  validateEmail,
  validateInternationalPhoneNumber,
  formatPhoneNumber,
  checkPasswordComplexity,
  checkPasswordStrength,
  extractSocialMediaEntities,
  cleanString,
  tokenizeText
};

// Node.js export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = regexUtils;
}

// Browser export
if (typeof window !== 'undefined') {
  window.regexUtils = regexUtils;
}

// Test cases (run in Node.js only)
if (typeof module !== 'undefined' && module.exports) {
  console.log('Running test cases...');
  
  // Test validateEmail
  console.log('Email Tests:');
  console.log(regexUtils.validateEmail('user@domain.com')); // true
  console.log(regexUtils.validateEmail('invalid@domain')); // false
  console.log(regexUtils.validateEmail('user.name@sub.domain.com')); // true
  console.log(regexUtils.validateEmail('')); // false

  // Test validateInternationalPhoneNumber
  console.log('\nInternational Phone Number Tests:');
  console.log(regexUtils.validateInternationalPhoneNumber('+12025550123')); // { isValid: true, requirements: [...] }
  console.log(regexUtils.validateInternationalPhoneNumber('+254712345678')); // { isValid: true, requirements: [...] }
  console.log(regexUtils.validateInternationalPhoneNumber('+447123456789')); // { isValid: true, requirements: [...] }
  console.log(regexUtils.validateInternationalPhoneNumber('+255701234567')); // { isValid: true, requirements: [...] }
  console.log(regexUtils.validateInternationalPhoneNumber('+919876543210')); // { isValid: true, requirements: [...] }
  console.log(regexUtils.validateInternationalPhoneNumber('+61412345678')); // { isValid: true, requirements: [...] }
  console.log(regexUtils.validateInternationalPhoneNumber('+2348031234567')); // { isValid: true, requirements: [...] }
  console.log(regexUtils.validateInternationalPhoneNumber('+5511987654321')); // { isValid: true, requirements: [...] }
  console.log(regexUtils.validateInternationalPhoneNumber('+4915112345678')); // { isValid: true, requirements: [...] }
  console.log(regexUtils.validateInternationalPhoneNumber('+819012345678')); // { isValid: true, requirements: [...] }
  console.log(regexUtils.validateInternationalPhoneNumber('123456')); // { isValid: false, requirements: [...] }
  console.log(regexUtils.validateInternationalPhoneNumber('+12025550123x')); // { isValid: false, requirements: [...] }
  console.log(regexUtils.validateInternationalPhoneNumber('+254123456789')); // { isValid: false, requirements: [...] }
  console.log(regexUtils.validateInternationalPhoneNumber('+99912345678')); // { isValid: false, requirements: [...] }
  console.log(regexUtils.validateInternationalPhoneNumber('+254612345678')); // { isValid: false, requirements: [...] }

  // Test formatPhoneNumber
  console.log('\nPhone Number Format Tests:');
  console.log(regexUtils.formatPhoneNumber('+1 (202) 555-0123')); // "+12025550123"
  console.log(regexUtils.formatPhoneNumber('00 254 712 345 678')); // "+254712345678"
  console.log(regexUtils.formatPhoneNumber('123456')); // ""
  console.log(regexUtils.formatPhoneNumber('+12025550123x')); // ""

  // Test checkPasswordComplexity
  console.log('\nPassword Complexity Tests:');
  console.log(regexUtils.checkPasswordComplexity('Pass123!@#')); // true
  console.log(regexUtils.checkPasswordComplexity('pass123!')); // false (no uppercase)
  console.log(regexUtils.checkPasswordComplexity('Pass123')); // false (too short)
  console.log(regexUtils.checkPasswordComplexity(' Pass123!@#')); // false (leading space)

  // Test checkPasswordStrength
  console.log('\nPassword Strength Tests:');
  console.log(regexUtils.checkPasswordStrength('Pass123!@#')); // { isValid: true, requirements: [...] }
  console.log(regexUtils.checkPasswordStrength('pass123!')); // { isValid: false, requirements: [...] }

  // Test extractSocialMediaEntities
  console.log('\nSocial Media Entities Tests:');
  console.log(regexUtils.extractSocialMediaEntities('Hello @user #coding https://example.com'));
  // Output: { hashtags: ["#coding"], mentions: ["@user"], urls: ["https://example.com"] }

  // Test cleanString
  console.log('\nClean String Tests:');
  console.log(regexUtils.cleanString('  Hello   World!  ', { case: 'title' })); // "Hello World!"
  console.log(regexUtils.cleanString('Hello!!  World!!!', { case: 'lower', removeSpecial: true })); // "hello world"
  console.log(regexUtils.cleanString('  TEST   CASE  ', { case: 'upper' })); // "TEST CASE"

  // Test tokenizeText
  console.log('\nTokenize Text Tests:');
  console.log(regexUtils.tokenizeText('Hello, world! 123.45 and @user #coding https://example.com'));
  // Output: { words: ["Hello", "world"], numbers: ["123.45"], punctuation: [",", "!"], hashtags: ["#coding"], mentions: ["@user"], urls: ["https://example.com"] }
}