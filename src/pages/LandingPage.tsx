import { useState } from "preact/hooks";
import { useLocation } from "preact-iso";
import { AuthModal, Nav } from "../components/landing-page";
import { useAuth } from "../hooks/useAuth";

const LandingPage = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const { user } = useAuth();
  const { route } = useLocation()

  if (user) {
    route('/dashboard')
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
