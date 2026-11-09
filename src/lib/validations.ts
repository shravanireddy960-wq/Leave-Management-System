/**
 * Standard enterprise validation utilities for LMS
 */

/**
 * Validates phone numbers: accepts international (+91, +1, etc.) or 10-15 digit phone formats.
 * Must have between 10 and 15 numeric digits.
 */
export function validatePhone(phone: string): { isValid: boolean; error?: string } {
  if (!phone || !phone.trim()) {
    return { isValid: false, error: "Phone number is required." };
  }

  const trimmed = phone.trim();

  // Basic character allowance: digits, +, spaces, dashes, parentheses
  if (!/^[+]?[0-9\s\-().]{10,20}$/.test(trimmed)) {
    return {
      isValid: false,
      error: "Phone number contains invalid characters. Use digits and optional country code (e.g. +91 98450 12345).",
    };
  }

  const digits = trimmed.replace(/\D/g, "");
  if (digits.length < 10) {
    return { isValid: false, error: "Phone number must contain at least 10 digits." };
  }
  if (digits.length > 15) {
    return { isValid: false, error: "Phone number cannot exceed 15 digits." };
  }

  return { isValid: true };
}

/**
 * Validates email addresses
 */
export function validateEmail(email: string): { isValid: boolean; error?: string } {
  if (!email || !email.trim()) {
    return { isValid: false, error: "Email address is required." };
  }

  const trimmed = email.trim();
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

  if (!emailRegex.test(trimmed)) {
    return { isValid: false, error: "Please enter a valid official email address (e.g. employee@lms.in)." };
  }

  return { isValid: true };
}

/**
 * Validates human names
 */
export function validateName(name: string): { isValid: boolean; error?: string } {
  if (!name || !name.trim()) {
    return { isValid: false, error: "Full name is required." };
  }

  const trimmed = name.trim();
  if (trimmed.length < 2) {
    return { isValid: false, error: "Full name must be at least 2 characters long." };
  }
  if (trimmed.length > 70) {
    return { isValid: false, error: "Full name cannot exceed 70 characters." };
  }

  if (!/^[a-zA-Z\s.'\-]+$/.test(trimmed)) {
    return { isValid: false, error: "Name can only contain letters, spaces, hyphens, and periods." };
  }

  return { isValid: true };
}

/**
 * Validates Employee ID format
 */
export function validateEmployeeId(empId: string): { isValid: boolean; error?: string } {
  if (!empId || !empId.trim()) {
    return { isValid: false, error: "Employee ID is required." };
  }

  const trimmed = empId.trim().toUpperCase();
  if (trimmed.length < 3) {
    return { isValid: false, error: "Employee ID must be at least 3 characters." };
  }

  if (!/^[A-Z0-9\-_]+$/.test(trimmed)) {
    return { isValid: false, error: "Employee ID can only contain letters, numbers, hyphens, and underscores." };
  }

  return { isValid: true };
}

/**
 * Validates leave justification reasons
 */
export function validateLeaveReason(reason: string): { isValid: boolean; error?: string } {
  if (!reason || !reason.trim()) {
    return { isValid: false, error: "Please provide a reason or justification for this leave request." };
  }

  const trimmed = reason.trim();
  if (trimmed.length < 8) {
    return { isValid: false, error: "Reason must be at least 8 characters long for audit records." };
  }

  return { isValid: true };
}
