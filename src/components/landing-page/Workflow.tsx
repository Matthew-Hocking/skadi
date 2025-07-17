const Workflow = () => {
  const workflowStages = [
    {
      name: "Saved",
      description: "Bookmark interesting opportunities",
      gradient: "from-gray-500 to-gray-600",
    },
    {
      name: "Applied",
      description: "Track submitted applications",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      name: "Interviewing",
      description: "Manage interview schedules",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      name: "Offered",
      description: "Celebrate your success!",
      gradient: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <section className="relative z-10 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Your Job Hunt Journey
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Visualize every step of your application process with our intuitive
            kanban board
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {workflowStages.map((stage, index) => (
            <div key={stage.name} className="relative">
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-all duration-300 group">
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${stage.gradient} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <span className="text-white font-bold">{index + 1}</span>
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  {stage.name}
                </h3>
                <p className="text-gray-600 text-sm">{stage.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Workflow;
