import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import ModalWrapper from '../ModalWrapper';

type AuthModalProps = {
  mode: 'signin' | 'signup';
  onClose: () => void;
};

export default function AuthModal({ mode, onClose }: AuthModalProps) {
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const MAX_ATTEMPTS = 5;
  const MIN_PASSWORD_LENGTH = 8;
  const MAX_EMAIL_LENGTH = 254;
  const MAX_PASSWORD_LENGTH = 128;
  
  const [attemptCount, setAttemptCount] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    return () => {
      setPassword('');
      setEmail('');
    };
  }, []);

  const sanitizeInput = (input: string) => input.trim();

  const normalizeEmail = (email: string) => {
    return email.trim().toLowerCase();
  };

  const validatePassword = (password: string) => {
    if (mode === 'signup') {
      if (password.length < MIN_PASSWORD_LENGTH) {
        return 'Password must be at least 8 characters long';
      }
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
        return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
      }
    }
    return null;
  };

  const validateForm = () => {
    const trimmedEmail = sanitizeInput(email);
    const trimmedPassword = sanitizeInput(password);

    if (!trimmedEmail) {
      setError('Email is required');
      return false;
    }

    if (trimmedEmail.length > MAX_EMAIL_LENGTH) {
      setError('Email is too long');
      return false;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    if (!trimmedPassword) {
      setError('Password is required');
      return false;
    }

    if (trimmedPassword.length > MAX_PASSWORD_LENGTH) {
      setError('Password is too long');
      return false;
    }

    const passwordError = validatePassword(trimmedPassword);
    if (passwordError) {
      setError(passwordError);
      return false;
    }
    
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedEmail = sanitizeInput(e.currentTarget.value);
    setEmail(sanitizedEmail);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedPassword = sanitizeInput(e.currentTarget.value);
    setPassword(sanitizedPassword);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    if (attemptCount >= MAX_ATTEMPTS) {
      setError('Too many attempts. Please try again later.');
      return;
    }
    
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const fn = mode === 'signin' ? login : signup;
      const normalizedEmail = normalizeEmail(email);
      const trimmedPassword = sanitizeInput(password);
      
      const { data, error } = await fn(normalizedEmail, trimmedPassword);

      if (error) {
        setAttemptCount(prev => prev + 1);
        setError(error.message);
        return;
      }

      if (mode === 'signup' && !data.session) {
        setSuccess('Confirmation email sent! Please check your inbox.');
      } else {
        onClose();
        navigate('/dashboard');
      }
    } catch (err) {
      setAttemptCount(prev => prev + 1);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalWrapper onClose={onClose}>
      <h2 id="auth-modal-title" className="text-xl font-bold mb-4">
        {mode === 'signin' ? 'Sign In' : 'Sign Up'}
      </h2>

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label htmlFor="email" className="sr-only">Email address</label>
          <input
            id="email"
            type="email"
            ref={inputRef}
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            className="block w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-azul"
            required
            maxLength={MAX_EMAIL_LENGTH}
            disabled={isLoading || attemptCount >= MAX_ATTEMPTS}
            autoComplete="email"
            aria-describedby={error ? "error-message" : undefined}
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="password" className="sr-only">Password</label>
          <input
            id="password"
            type="password"
            placeholder={mode === "signup" ? "Create a Password" : "Password"}
            value={password}
            onChange={handlePasswordChange}
            className="block w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-azul"
            required
            minLength={mode === 'signup' ? MIN_PASSWORD_LENGTH : undefined}
            maxLength={MAX_PASSWORD_LENGTH}
            disabled={isLoading || attemptCount >= MAX_ATTEMPTS}
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            aria-describedby={error ? "error-message" : undefined}
          />
        </div>

        {error && (
          <p id="error-message" className="text-red-600 text-sm mb-3" role="alert" aria-live="polite">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-600 text-sm mb-3" role="status" aria-live="polite">
            {success}
          </p>
        )}

        {attemptCount >= MAX_ATTEMPTS && (
          <p className="text-red-600 text-sm mb-3" role="alert">
            Maximum attempts reached. Please refresh the page to try again.
          </p>
        )}

        <div className="flex justify-between">
          <button 
            type="button" 
            onClick={onClose} 
            className="text-sm"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-azul text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={isLoading || attemptCount >= MAX_ATTEMPTS}
          >
            {isLoading ? 'Loading...' : (mode === 'signin' ? 'Sign In' : 'Sign Up')}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
}