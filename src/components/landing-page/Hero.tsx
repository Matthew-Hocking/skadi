import { ChevronRight } from "lucide-react";

type HeroProps = {
  onSignUpClick: () => void;
};

const Hero = ({ onSignUpClick }: HeroProps) => {
  return (
    <section className="relative z-10 pt-20 pb-32 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200 rounded-full px-4 py-2 text-sm font-medium">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
              Hunt Your Next Opportunity
            </span>
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Skadi
        </h1>

        <p className="text-xl md:text-2xl text-gray-600 mb-4 max-w-3xl mx-auto">
          The Jötunn goddess of hunting guides your job search
        </p>

        <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
          Track applications with precision. From saved opportunities to job
          offers, manage your career hunt like a warrior.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onSignUpClick}
            className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Start Your Hunt
            <ChevronRight className="inline w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
