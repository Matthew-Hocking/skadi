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

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const validateForm = () => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    if (!password.trim()) {
      setError('Password is required');
      return false;
    }
    
    if (mode === 'signup' && password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const fn = mode === 'signin' ? login : signup;
      const { data, error } = await fn(email, password);

      if (error) {
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
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalWrapper onClose={onClose}>
      <h2 id="auth-modal-title" className="text-xl font-bold mb-4">{mode === 'signin' ? 'Sign In' : 'Sign Up'}</h2>

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label htmlFor="email" className="sr-only">Email address</label>
          <input
            id="email"
            type="email"
            ref={inputRef}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            className="block w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-azul"
            required
            disabled={isLoading}
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
            onChange={(e) => setPassword(e.currentTarget.value)}
            className="block w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-azul"
            required
            minLength={mode === 'signup' ? 8 : undefined}
            disabled={isLoading}
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
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : (mode === 'signin' ? 'Sign In' : 'Sign Up')}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
}