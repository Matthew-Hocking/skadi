import { Target } from "lucide-react";

type NavProps = {
  onSignInClick: () => void;
  onSignUpClick: () => void;
};

const Nav = ({ onSignInClick, onSignUpClick }: NavProps) => (
  <nav className="relative z-20 flex items-center justify-between p-6 max-w-7xl mx-auto">
    <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
      Skadi
    </div>
    <div className="flex items-center gap-4">
      <button
        onClick={onSignInClick}
        className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
      >
        Sign In
      </button>
      <button
        onClick={onSignUpClick}
        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
      >
        Sign Up
      </button>
    </div>
  </nav>
);

export default Nav;
