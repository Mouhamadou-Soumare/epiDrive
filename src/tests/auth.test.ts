import { registerUser, loginUser, resetUsers } from '../services/auth';

describe('Auth Service', () => {
  beforeEach(() => {
    resetUsers();
  });

  describe('registerUser', () => {
    it('should register a new user successfully', () => {
      const result = registerUser('testuser', 'password123');
      expect(result).toBe('User registered successfully');
    });

    it('should not allow duplicate usernames', () => {
      registerUser('testuser', 'password123');
      expect(() => registerUser('testuser', 'newpassword')).toThrow('User already exists');
    });
  });

  describe('loginUser', () => {
    it('should login a user with correct credentials', () => {
      registerUser('testuser', 'password123');
      const result = loginUser('testuser', 'password123');
      expect(result).toBe('Login successful');
    });

    it('should not login a user with incorrect credentials', () => {
      registerUser('testuser', 'password123');
      expect(() => loginUser('testuser', 'wrongpassword')).toThrow('Invalid username or password');
    });

    it('should not login a non-existent user', () => {
      expect(() => loginUser('nonexistent', 'password123')).toThrow('Invalid username or password');
    });
  });
});
