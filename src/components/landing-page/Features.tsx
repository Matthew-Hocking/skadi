import { Briefcase, Layout, Target } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <Layout className="w-8 h-8" />,
      title: "Diverse Tracking",
      description:
        "Applying across industries, or categorising your entries? Keep your job hunts organised and focused.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: "Detailed Job Cards",
      description:
        "Store all job details in one place. Never lose track of important information.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Kanban Workflow",
      description:
        "Visualise your job application journey. Track your progress at a glance.",
      gradient: "from-indigo-500 to-purple-500",
    },
  ];

  return (
    <section className="relative z-10 py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Master Your Job Hunt
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Skadi provides the tools and organisation you need to track
            opportunities across categories and land your dream job.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={
                "group bg-white border border-gray-200 rounded-xl p-8 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              }
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div
                className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
