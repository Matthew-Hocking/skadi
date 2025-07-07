type NavProps = {
  onSignInClick: () => void;
  onSignUpClick: () => void;
};

const Nav = ({ onSignInClick, onSignUpClick }: NavProps) => {
  return (
    <header>
      <nav class="container flex items-center justify-between py-4">
        <a
          href="#top"
          class="text-5xl font-light text-azul"
        >
          <span class="underline-hover josefin-sans-display">Skadi</span>
        </a>

        <ul
          class="hidden md:flex gap-6 whitespace-nowrap"
          role="navigation"
        ></ul>

        <div class="flex gap-4 whitespace-nowrap">
          <button
            class="text-azul hover:text-azul-hover transition underline-hover py-4 px-10 "
            onClick={onSignInClick}
          >
            Sign in
          </button>
          <button
            class="text-white py-4 px-10 bg-azul hover:bg-azul-hover transition duration-[0.3s] ease-in-out"
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
