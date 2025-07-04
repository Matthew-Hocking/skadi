import { useState } from 'preact/hooks';
import { useAuth } from '../../hooks/useAuth';
import { useLocation } from 'preact-iso';

type AuthModalProps = {
  mode: 'signin' | 'signup';
  onClose: () => void;
};

export default function AuthModal({ mode, onClose }: AuthModalProps) {
  const { login, signup } = useAuth();
  const { route } = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = async (e: Event) => {
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
        route('/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div class="bg-white rounded-lg p-6 shadow-lg w-[90%] max-w-sm">
        <h2 id="auth-modal-title" class="text-xl font-bold mb-4">{mode === 'signin' ? 'Sign In' : 'Sign Up'}</h2>

        <form onSubmit={handleSubmit} noValidate>
          <div class="mb-3">
            <label for="email" class="sr-only">Email address</label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onInput={(e) => setEmail(e.currentTarget.value)}
              class="block w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-azul"
              required
              disabled={isLoading}
              autocomplete="email"
              aria-describedby={error ? "error-message" : undefined}
            />
          </div>
          <div class="mb-4">
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onInput={(e) => setPassword(e.currentTarget.value)}
              class="block w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-azul"
              required
              minLength={mode === 'signup' ? 8 : undefined}
              disabled={isLoading}
              autocomplete={mode === 'signup' ? 'new-password' : 'current-password'}
              aria-describedby={error ? "error-message" : undefined}
            />
          </div>

          {error && (
            <p id="error-message" class="text-red-600 text-sm mb-3" role="alert" aria-live="polite">
              {error}
            </p>
          )}
          {success && (
            <p class="text-green-600 text-sm mb-3" role="status" aria-live="polite">
              {success}
            </p>
          )}

          <div class="flex justify-between">
            <button 
              type="button" 
              onClick={onClose} 
              class="text-sm"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              class="bg-azul text-white px-4 py-2 rounded disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : (mode === 'signin' ? 'Sign In' : 'Sign Up')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}