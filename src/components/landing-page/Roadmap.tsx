import { Check, Target } from "lucide-react";

const Roadmap = () => {
  return (
    <section className="relative z-10 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-200 rounded-full px-4 py-2 text-sm font-medium mb-6">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-500 to-blue-500 animate-pulse"></div>
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent font-semibold">
              Actively in Development
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            What's Next for Skadi
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Skadi is currently in MVP phase with core job tracking features.
            Here's what's coming next as we evolve into the ultimate career
            hunting platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white border border-gray-200 rounded-xl p-8 relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                MVP • Available Now
              </div>
            </div>
            <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white mb-6">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Core Features
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Multi-industry job list management</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Detailed job application cards</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Kanban-style status tracking</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Basic notes</span>
              </li>
            </ul>
          </div>

          {/* Next Phase */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-8 relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                Phase 2 • Coming Soon
              </div>
            </div>
            <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white mb-6">
              <Target className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Enhanced Tracking
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mt-0.5 flex-shrink-0"></div>
                <span>Search and filtering</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mt-0.5 flex-shrink-0"></div>
                <span>Richer details and deadline tracking</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mt-0.5 flex-shrink-0"></div>
                <span>Customisable Kanban</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mt-0.5 flex-shrink-0"></div>
                <span>Alternative list view and more...</span>
              </li>
            </ul>
          </div>
        </div>

        {/* <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white mx-auto mb-4">
              <BetweenVerticalStart className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Phase 3</h4>
            <p className="text-sm text-gray-600">
              Customisable Kanban Columns
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center text-white mx-auto mb-4">
              <List className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Phase 4</h4>
            <p className="text-sm text-gray-600">
              Alternate List View
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center text-white mx-auto mb-4">
              <Briefcase className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Phase 5</h4>
            <p className="text-sm text-gray-600">
              
            </p>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default Roadmap;
