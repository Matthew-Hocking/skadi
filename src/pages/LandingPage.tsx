import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthModal, Nav } from "../components/landing-page";
import { useAuth } from "../hooks/useAuth";

const LandingPage = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const { user } = useAuth();
  const navigate = useNavigate()

  if (user) {
    navigate('/dashboard')
  }

  return (
    <main>
      <Nav
        onSignInClick={() => {
          setAuthMode('signin');
          setShowAuthModal(true);
        }}
        onSignUpClick={() => {
          setAuthMode('signup');
          setShowAuthModal(true);
        }}
      />
      {showAuthModal && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </main>
  );
};

export default LandingPage;
