import React from "react";
import { BookOpen, Star, Award, Brain, Rocket, TrendingUp } from "lucide-react";

function Education() {
  const courses = [
    {
      title: "Cryptonomics 101",
      description: "Learn the basics of crypto currency analysis and social sentiment tracking.",
      icon: Brain,
      level: "Beginner",
      duration: "2 hours",
      modules: 5,
    },
    {
      title: "Technical Analysis for Crypto Traders",
      description: "Master the art of reading charts and identifying moon patterns.",
      icon: TrendingUp,
      level: "Intermediate",
      duration: "3 hours",
      modules: 7,
    },
    {
      title: "Diamond Hands Strategy",
      description: "Develop the mindset of a true diamond-handed investor.",
      icon: Rocket,
      level: "Advanced",
      duration: "4 hours",
      modules: 6,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Cryptonomics Academy 📚</h1>
        <p className="text-xl text-gray-300">Level up your crypto trading game!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {courses.map((course) => {
          const Icon = course.icon;
          return (
            <div
              key={course.title}
              className="bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm
                       transform transition-all duration-300 hover:-translate-y-2"
            >
              <Icon className="w-12 h-12 text-yellow-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">{course.title}</h3>
              <p className="text-gray-300 mb-4">{course.description}</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>{course.modules} Modules</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  <span>{course.level}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  <span>{course.duration}</span>
                </div>
              </div>
              <button className="mt-6 w-full bg-gradient-to-r from-yellow-400 to-pink-500 
                               text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 
                               transition-opacity">
                Start Learning
              </button>
            </div>
          );
        })}
      </div>

      <div className="bg-gradient-to-r from-yellow-400/10 to-pink-500/10 rounded-xl p-8 backdrop-blur-sm">
        <h2 className="text-2xl font-bold mb-4">Why Learn with Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-4">
            <Brain className="w-8 h-8 text-yellow-400 flex-shrink-0" />
            <div>
              <h3 className="font-bold mb-2">Expert Knowledge</h3>
              <p className="text-gray-300">Learn from seasoned crypto traders and analysts.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Rocket className="w-8 h-8 text-yellow-400 flex-shrink-0" />
            <div>
              <h3 className="font-bold mb-2">Practical Skills</h3>
              <p className="text-gray-300">Real-world examples and hands-on practice.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Education;