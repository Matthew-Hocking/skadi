import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AuthModal,
  CTA,
  Features,
  Hero,
  Nav,
  Roadmap,
  Workflow,
} from "../components/landing-page";
import { useAuth } from "../hooks/useAuth";

const LandingPage = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Nav
        onSignInClick={() => {
          setAuthMode("signin");
          setShowAuthModal(true);
        }}
        onSignUpClick={() => {
          setAuthMode("signup");
          setShowAuthModal(true);
        }}
      />

      <Hero
        onSignUpClick={() => {
          setAuthMode("signup");
          setShowAuthModal(true);
        }}
      />

      <Features />

      <Workflow />

      <Roadmap />
      <CTA
        onSignUpClick={() => {
          setAuthMode("signup");
          setShowAuthModal(true);
        }}
      />

      <footer className="relative z-10 py-12 px-4 border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Skadi
          </div>
          <p className="text-gray-600">
            © 2025 Skadi. Hunt your opportunities with precision.
          </p>
        </div>
      </footer>

      {showAuthModal && (
        <AuthModal mode={authMode} onClose={() => setShowAuthModal(false)} />
      )}
    </main>
  );
};

export default LandingPage;
