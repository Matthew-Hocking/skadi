import { ChevronRight } from "lucide-react";

type CTAProps = {
  onSignUpClick: () => void;
};

const CTA = ({ onSignUpClick }: CTAProps) => {
  return (
    <section className="relative z-10 py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Ready to Hunt?
            </h2>
            {/* <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of job seekers who've mastered their career hunt with Skadi. Your next opportunity is waiting.
            </p> */}
            <button
              onClick={() => {
                onSignUpClick();
              }}
              className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Start Today
              <ChevronRight className="inline w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
