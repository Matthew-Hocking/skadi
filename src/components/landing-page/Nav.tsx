type NavProps = {
  onSignInClick: () => void;
  onSignUpClick: () => void;
};

const Nav = ({ onSignInClick, onSignUpClick }: NavProps) => {
  return (
    <header>
      <nav className="container flex items-center justify-between py-4 mt-2 ">
        <a
          href="#top"
          className="text-3xl md:text-5xl grenze-gotisch-display"
        >
          Skadi
        </a>

        <ul
          className="hidden md:flex gap-6 whitespace-nowrap"
          role="navigation"
        ></ul>

        <div className="flex gap-4 whitespace-nowrap">
          <button
            className=""
            onClick={onSignInClick}
          >
            Log in
          </button>
          <button
            className=""
            onClick={onSignUpClick}
          >
            Sign up
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Nav;
