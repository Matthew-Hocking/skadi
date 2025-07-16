import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Auth callback error:", error);
          setStatus("error");
          setErrorMessage(error.message || "Authentication failed");

          setTimeout(() => {
            navigate("/login?error=auth_failed");
          }, 3000);
          return;
        }

        if (data.session) {
          setStatus("success");

          setTimeout(() => {
            navigate("/dashboard");
          }, 1500);
        } else {
          setStatus("error");
          setErrorMessage("No session found");

          setTimeout(() => {
            navigate("/login");
          }, 3000);
        }
      } catch (err) {
        console.error("Unexpected error in auth callback:", err);
        setStatus("error");
        setErrorMessage("An unexpected error occurred");

        setTimeout(() => {
          navigate("/login?error=unexpected");
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  const handleManualRedirect = () => {
    if (status === "success") {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
        {status === "loading" && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-azul mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Completing Authentication
            </h2>
            <p className="text-gray-600">Please wait while we sign you in...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="rounded-full h-12 w-12 bg-green-100 mx-auto mb-4 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Authentication Successful!
            </h2>
            <p className="text-gray-600 mb-4">
              Redirecting you to your dashboard...
            </p>
            <button
              onClick={handleManualRedirect}
              className="text-azul hover:text-azul-dark underline text-sm"
            >
              Click here if you're not redirected automatically
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <div className="rounded-full h-12 w-12 bg-red-100 mx-auto mb-4 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Authentication Failed
            </h2>
            <p className="text-gray-600 mb-4">
              {errorMessage || "Something went wrong during authentication."}
            </p>
            <div className="space-y-2">
              <button
                onClick={handleManualRedirect}
                className="w-full bg-azul text-white px-4 py-2 rounded hover:bg-azul-dark transition-colors"
              >
                Try Again
              </button>
              <p className="text-sm text-gray-500">
                Redirecting automatically in a few seconds...
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
