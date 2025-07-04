type NavProps = {
  onSignInClick: () => void;
  onSignUpClick: () => void;
}

const Nav = ({ onSignInClick, onSignUpClick }: NavProps) => {
  return (
    <header>
      <nav class="container flex items-center justify-between py-4">
        <a href="#top" class="text-xl font-bold text-azul">Skadi</a>

        <ul class="hidden md:flex gap-6 whitespace-nowrap" role="navigation">

        </ul>

        <div class="flex gap-4 whitespace-nowrap">
          <button class="sign-in" onClick={onSignInClick}>
            Sign in
          </button>
          <button class="sign-up" onClick={onSignUpClick}>
            Sign up
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Nav;
