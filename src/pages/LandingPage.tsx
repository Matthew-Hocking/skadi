import { useState } from "preact/hooks";
import { AuthModal, Nav } from "../components/landing-page";

const LandingPage = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

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
