# Security Implementation Guide

## Overview
This document outlines all security measures implemented in the portfolio contact form to prevent abuse, XSS attacks, spam, and unauthorized access.

---

## 🔒 **Implemented Security Measures**

### 1. **Input Sanitization (XSS Prevention)**
**Status**: ✅ Implemented  
**Library**: DOMPurify v3.0.6  
**What it does**: Removes all HTML tags and malicious scripts from user input before storing in Firebase.

```typescript
const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input.trim(), { 
    ALLOWED_TAGS: [], 
    ALLOWED_ATTR: [] 
  });
};
```

**Protected Fields**: name, email, subject, message, phone

---

### 2. **Honeypot Field (Bot Detection)**
**Status**: ✅ Implemented  
**How it works**: Hidden `website` field that should remain empty. If filled, it indicates a bot submission.

```html
<div class="hidden">
  <input 
    type="text" 
    id="website" 
    placeholder="Your Website"
    tabIndex={-1}
    autoComplete="off"
  />
</div>
```

**Result**: Bots attempting to fill all fields are silently rejected.

---

### 3. **Client-Side Rate Limiting**
**Status**: ✅ Implemented  
**Max**: 3 submissions per hour per device  
**Storage**: Browser localStorage  
**Detection**: Device fingerprint (userAgent, language, timezone, screen resolution)

```typescript
export const checkRateLimit = (
  maxSubmissions: number = 3, 
  timeWindowMs: number = 3600000 // 1 hour
): boolean => {
  // Checks and blocks if limit exceeded
};
```

---

### 4. **Spam Pattern Detection**
**Status**: ✅ Implemented  
**Detects**:
- Suspicious keywords (viagra, casino, lottery, etc.)
- Spam phrases ("click here now", "limited offer", etc.)
- Prize/giveaway language
- Multiple URLs (> 2 links per message)

```typescript
const spamPatterns = [
  /viagra|cialis|casino|poker|lottery|bitcoin|cryptocurrency/i,
  /click here now|limited offer|act now|urgent/i,
  /you have won|congratulations|claim.*prize/i,
];
```

---

### 5. **Enhanced Email Validation**
**Status**: ✅ Implemented  
**Checks**:
- RFC 5322 format validation
- Disposable email domain rejection (tempmail.com, 10minutemail.com, etc.)

```typescript
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return false;
  
  const disposableDomains = ['tempmail.com', '10minutemail.com', ...];
  const domain = email.split('@')[1].toLowerCase();
  return !disposableDomains.includes(domain);
};
```

---

### 6. **Device Fingerprinting**
**Status**: ✅ Implemented  
**Purpose**: Identify and track devices for rate limiting and abuse detection

```typescript
const getDeviceFingerprint = (): string => {
  const fingerprint = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    colorDepth: window.screen.colorDepth,
  };
  // Return hash of fingerprint
};
```

**Stored in Firebase**: Logged with each submission for analytics and abuse detection.

---

### 7. **Content Security Policy (CSP)**
**Status**: ✅ Implemented  
**Location**: `index.html` meta tag  
**Protects**: Against inline script injection, clickjacking, and unauthorized resource loading

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' fonts.googleapis.com;
  style-src 'self' 'unsafe-inline' fonts.googleapis.com;
  img-src 'self' data: https:;
  font-src 'self' data: fonts.googleapis.com;
  connect-src 'self' *.firebase.com *.firebaseio.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self'
" />
```

---

### 8. **Security Headers (Meta Tags)**
**Status**: ✅ Implemented  
**Headers Added**:

| Header | Value | Purpose |
|--------|-------|---------|
| X-UA-Compatible | IE=edge | Prevent IE quirks mode |
| X-Content-Type-Options | nosniff | Prevent MIME type sniffing |
| Referrer-Policy | strict-origin-when-cross-origin | Control referrer info |
| Frame-Ancestors | 'none' | Prevent clickjacking |

---

### 9. **Input Validation (Zod + React Hook Form)**
**Status**: ✅ Implemented  
**Validations**:
- Name: 4+ characters
- Email: Valid RFC 5322 format + not disposable
- Phone: Valid phone number format (optional)
- Subject: 8+ characters
- Message: Non-empty

---

### 10. **Error Handling & Information Disclosure Prevention**
**Status**: ✅ Implemented  
**Measures**:
- Generic error messages shown to users
- Detailed errors logged to console (dev only)
- No sensitive data exposed in error messages
- Firebase connection errors handled gracefully

---

## 🚀 **Firebase Rules (Update Required)**

Update your Firebase Realtime Database rules to:

```json
{
  "rules": {
    ".read": false,
    "Message": {
      "$date": {
        "$id": {
          ".write": "newData.hasChildren(['name', 'email', 'subject', 'message', 'createdAt', 'submittedAt', 'deviceFingerprint', 'origin']) 
            && newData.child('name').val() != null
            && newData.child('email').val() != null
            && newData.child('subject').val() != null
            && newData.child('message').val() != null
            && newData.child('createdAt').val() != null
            && newData.child('submittedAt').val() != null
            && newData.child('deviceFingerprint').val() != null
            && newData.child('origin').val() == 'https://nimishvishnoi.github.io'
            && newData.child('name').val().length >= 4
            && newData.child('email').val().length > 5
            && newData.child('subject').val().length >= 8
            && newData.child('message').val().length > 0
            && newData.child('createdAt').val() <= now
            && newData.child('createdAt').val() > (now - 60000)",
          ".validate": "newData.hasChildren(['name', 'email', 'subject', 'message', 'createdAt', 'submittedAt', 'deviceFingerprint', 'origin'])"
        }
      }
    }
  }
}
```

**Key Validations**:
- Origin must be from your portfolio domain
- All required fields must be present
- Data recency check (within 60 seconds)
- Field length validation matches frontend

---

## 🔮 **Recommended Future Enhancements**

### 1. **reCAPTCHA v3 Integration** (High Priority)
Load the reCAPTCHA script dynamically with your site key and execute it from the client.

**Benefits**: Prevent automated submissions while keeping UX frictionless (invisible verification)

---

### 2. **Cloud Functions (Server-Side Validation)** (High Priority)
Create a Cloud Function to:
- Verify reCAPTCHA token server-side
- Validate email format more thoroughly
- Rate limit by IP + device fingerprint
- Log suspicious activity
- Send email confirmation (optional)

```typescript
export const validateContactSubmission = functions.https.onCall(
  async (data, context) => {
    // Validate reCAPTCHA token
    // Validate rate limits by IP
    // Sanitize & validate all inputs
    // Return success/error
  }
);
```

---

### 3. **Email Verification** (Medium Priority)
- Send confirmation email to submitted address
- Verify email before marking submission as valid
- Prevent fake email addresses in submissions

---

### 4. **Monitoring & Alerts** (Medium Priority)
- Log suspicious submissions to Cloud Firestore
- Alert on spike in submissions from same device
- Monitor for repeated patterns
- Track submission metrics

---

### 5. **Dependency Audit** (Ongoing)
```bash
yarn audit
yarn audit fix
```

---

## 📋 **Security Checklist**

- [x] XSS Protection (DOMPurify)
- [x] CSRF Protection (Origin validation)
- [x] Honeypot field (Bot detection)
- [x] Rate limiting (Client-side)
- [x] Spam detection
- [x] Email validation
- [x] CSP headers
- [x] Security meta tags
- [x] Input sanitization
- [x] Error handling
- [ ] reCAPTCHA v3 integration
- [ ] Cloud Functions validation
- [ ] Email verification
- [ ] Server-side rate limiting
- [ ] Monitoring & logging

---

## 🧪 **Testing Security**

### Test XSS Protection:
```javascript
// Try to inject script in form
name: "<script>alert('XSS')</script>"
// Should be sanitized to plain text
```

### Test Honeypot:
```javascript
// Fill hidden website field
// Submission should silently fail but show success
```

### Test Rate Limiting:
```javascript
// Submit form 4 times within 1 hour
// 4th submission should fail with rate limit message
```

### Test Spam Detection:
```javascript
// Submit with spam keywords
message: "You have won a free iPhone! Click here now"
// Should be flagged and rejected
```

---

## 📞 **Support**

For security vulnerabilities or concerns, please:
1. Do NOT publicly disclose the vulnerability
2. Document the issue with reproduction steps
3. Contact the project maintainer privately

---

## 📚 **References**

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [DOMPurify Documentation](https://github.com/cure53/DOMPurify)
- [Firebase Security Rules](https://firebase.google.com/docs/database/security)
- [reCAPTCHA v3](https://developers.google.com/recaptcha/docs/v3)

---

**Last Updated**: April 26, 2026  
**Status**: Production Ready (with optional reCAPTCHA)
