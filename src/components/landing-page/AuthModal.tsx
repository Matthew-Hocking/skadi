import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import ModalWrapper from "../ModalWrapper";

type AuthModalProps = {
  mode: "signin" | "signup";
  onClose: () => void;
};

type SocialProvider = {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  hoverColor: string;
};

const socialProviders: SocialProvider[] = [
  {
    id: "google",
    name: "Google",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
    ),
    color: "bg-white border border-gray-300 text-gray-700",
    hoverColor: "hover:bg-gray-50",
  },
  {
    id: "github",
    name: "GitHub",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
    color: "bg-gray-900 text-white",
    hoverColor: "hover:bg-gray-800",
  },
];

export default function AuthModal({ mode, onClose }: AuthModalProps) {
  const { signInWithProvider } = useAuth();

  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  useEffect(() => {
    setError("");
    setIsLoading(false);
    setLoadingProvider(null);
  }, [mode]);

  const handleSocialAuth = async (providerId: string) => {
    setError("");
    setIsLoading(true);
    setLoadingProvider(providerId);

    try {
      const { error } = await signInWithProvider(providerId);

      if (error) {
        setError(error.message || "Authentication failed");
        return;
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
      setLoadingProvider(null);
    }
  };

  const LoadingSpinner = () => (
    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
  );

  return (
    <ModalWrapper onClose={onClose}>
      <div className="text-center">
        <h2
          id="auth-modal-title"
          className="text-xl font-bold mb-2 text-gray-900"
        >
          {mode === "signin" ? "Sign In" : "Sign Up"}
        </h2>
        <p className="text-gray-600 mb-6">
          {mode === "signin"
            ? "Welcome back! Choose your preferred method to sign in."
            : "Create your account using one of these services."}
        </p>

        <div className="space-y-3">
          {socialProviders.map((provider) => (
            <button
              key={provider.id}
              onClick={() => handleSocialAuth(provider.id)}
              disabled={isLoading}
              className={`
                w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg
                font-medium transition-colors duration-200
                ${provider.color} ${provider.hoverColor}
                disabled:opacity-50 disabled:cursor-not-allowed
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
              `}
              aria-label={`${mode === "signin" ? "Sign in" : "Sign up"} with ${
                provider.name
              }`}
            >
              {loadingProvider === provider.id ? (
                <LoadingSpinner />
              ) : (
                provider.icon
              )}
              <span>
                {loadingProvider === provider.id
                  ? "Redirecting..."
                  : `Continue with ${provider.name}`}
              </span>
            </button>
          ))}
        </div>

        {error && (
          <div
            id="error-message"
            className="text-red-600 text-sm mt-4 p-3 bg-red-50 rounded-lg border border-red-200"
            role="alert"
            aria-live="polite"
          >
            {error}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-gray-600 hover:text-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded px-2 py-1"
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>

        <div className="mt-4 text-xs text-gray-500">
          By continuing, you agree to our{" "}
          <a
            href="/terms"
            className="text-indigo-600 hover:text-indigo-800 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="/privacy"
            className="text-indigo-600 hover:text-indigo-800 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </ModalWrapper>
  );
}
