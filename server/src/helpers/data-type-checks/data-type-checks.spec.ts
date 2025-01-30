import { isValidEmail, isValidPassword } from "./data-type-checks";

describe('isValidEmail', () => {
    it('should return true for valid email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('test+alias@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co')).toBe(true);
    });
  
    it('should return false for invalid email formats', () => {
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test@com')).toBe(false);
      expect(isValidEmail('plainaddress')).toBe(false);
    });
  
    it('should return false for inputs with SQL injection patterns', () => {
      expect(isValidEmail("test'; DROP TABLE users; --@example.com")).toBe(false);
      expect(isValidEmail("test@example.com' OR 1=1; --")).toBe(false);
    });
  
    it('should return false for inputs with XSS attempts', () => {
      expect(isValidEmail('<script>alert(1)</script>@example.com')).toBe(false);
      expect(isValidEmail('<img src=x onerror=alert(1)>@example.com')).toBe(false);
    });
  
    it('should return false for empty or whitespace-only strings', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('   ')).toBe(false);
    });
  
    it('should return false for non-string inputs', () => {
      expect(isValidEmail(null)).toBe(false);
      expect(isValidEmail(undefined)).toBe(false);
      expect(isValidEmail(12345)).toBe(false);
      expect(isValidEmail({})).toBe(false);
    });
  
    it('should return false for encoded values', () => {
      expect(isValidEmail('%27test@example.com')).toBe(false); // Encoded single quote
      expect(isValidEmail('%3Cscript%3Ealert%281%29%3C%2Fscript%3E@example.com')).toBe(false); // Encoded XSS
    });
});

describe('isValidPassword', () => {
    it('should return true for valid passwords', () => {
      expect(isValidPassword('abc123')).toBe(true);
      expect(isValidPassword('Passw0rd!')).toBe(true);
      expect(isValidPassword('123abc')).toBe(true);
    });
  
    it('should return false for passwords shorter than 6 characters', () => {
      expect(isValidPassword('123')).toBe(false);
      expect(isValidPassword('abc')).toBe(false);
      expect(isValidPassword('ab1')).toBe(false);
    });
  
    it('should return false for passwords without numbers', () => {
      expect(isValidPassword('abcdef')).toBe(false);
      expect(isValidPassword('Password')).toBe(false);
    });
  
    it('should return true for passwords with special characters and numbers', () => {
      expect(isValidPassword('abc!@#123')).toBe(true);
      expect(isValidPassword('!pass1')).toBe(true);
    });
  
    it('should return false for non-string inputs', () => {
      expect(isValidPassword(null)).toBe(false);
      expect(isValidPassword(undefined)).toBe(false);
      expect(isValidPassword(123456)).toBe(false);
      expect(isValidPassword({})).toBe(false);
    });
  
    it('should return false for empty or whitespace-only passwords', () => {
      expect(isValidPassword('')).toBe(false);
      expect(isValidPassword('     ')).toBe(false);
    });
});