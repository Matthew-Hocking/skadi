type NavProps = {
  onSignInClick: () => void;
  onSignUpClick: () => void;
};

const Nav = ({ onSignInClick, onSignUpClick }: NavProps) => {
  return (
    <header>
      <nav class="container flex items-center justify-between py-4 mt-2 ">
        <a
          href="#top"
          class="text-3xl md:text-5xl grenze-gotisch-display"
        >
          Skadi
        </a>

        <ul
          class="hidden md:flex gap-6 whitespace-nowrap"
          role="navigation"
        ></ul>

        <div class="flex gap-4 whitespace-nowrap">
          <button
            class=""
            onClick={onSignInClick}
          >
            Log in
          </button>
          <button
            class=""
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
