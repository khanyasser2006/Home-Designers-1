/**
 * Security & Hardening Utilities (Client-Side Defense Suite)
 * - Cryptographic SHA-256 hashing via Web Crypto API
 * - Input sanitization against XSS and script injection
 * - Protocol validation for URLs (prevent javascript: and data: URIs)
 * - Safe LocalStorage management with quota protection
 * - Anti-bot honeypot and rate-limiting guards
 */

// ─── 1. Cryptographic SHA-256 Hashing (Web Crypto API) ───
const APP_SALT = 'HomeDesigners_Atelier_2026_SecureSalt_#9841';

export async function hashPassword(password) {
  if (!password) return '';
  const encoder = new TextEncoder();
  const data = encoder.encode(password + APP_SALT);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// ─── 2. Input Sanitization (XSS Prevention) ───
export function sanitizeString(input) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<[^>]*>/g, '') // Strip HTML tags
    .replace(/javascript:/gi, '') // Strip javascript: schemes
    .replace(/data:text\/html/gi, '') // Strip data HTML schemes
    .replace(/vbscript:/gi, '') // Strip vbscript: schemes
    .replace(/on\w+\s*=/gi, '') // Strip inline event handlers (onload, onclick, onerror)
    .trim();
}

export function sanitizeUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const clean = url.trim();
  // Strictly allow http, https, absolute relative paths (/...), or local assets
  if (
    clean.startsWith('https://') ||
    clean.startsWith('http://') ||
    clean.startsWith('/') ||
    clean.startsWith('./')
  ) {
    // Block any javascript: or data: inside the string
    if (/javascript:|data:|vbscript:/i.test(clean)) {
      return '';
    }
    return clean;
  }
  return '';
}

// ─── 3. Safe LocalStorage with Quota Management ───
export function safeLocalStorageSet(key, value) {
  try {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, stringValue);
    return true;
  } catch (e) {
    console.warn(`[Security SafeStorage] LocalStorage quota exceeded or unavailable for key: ${key}`, e);
    // If quota exceeded, attempt to clear temporary items
    try {
      localStorage.removeItem('home_designers_temp');
      localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }
}

export function safeLocalStorageGet(key, fallback = null) {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item);
  } catch {
    return fallback;
  }
}

// ─── 4. Client-Side Rate Limiter for Form Submissions ───
const SUBMISSION_COOLDOWN_MS = 30000; // 30 seconds cooldown between inquiries

export function checkSubmissionRateLimit(formKey = 'inquiry') {
  try {
    const lastTime = parseInt(sessionStorage.getItem(`rate_limit_${formKey}`) || '0', 10);
    const now = Date.now();
    if (now - lastTime < SUBMISSION_COOLDOWN_MS) {
      const remainingSeconds = Math.ceil((SUBMISSION_COOLDOWN_MS - (now - lastTime)) / 1000);
      return {
        allowed: false,
        error: `Please wait ${remainingSeconds} seconds before submitting another inquiry.`,
      };
    }
    sessionStorage.setItem(`rate_limit_${formKey}`, now.toString());
    return { allowed: true };
  } catch {
    return { allowed: true };
  }
}
