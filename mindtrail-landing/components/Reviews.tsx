import React from 'react';

type ReviewProps = {
  text: string;
  role: string;
};

const Review = ({ text, role }: ReviewProps) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-md flex flex-col h-full">
      {/* Review Text */}
      <div className="flex-grow">
        <p className="text-gray-700 mb-6 font-medium">{text}</p>
      </div>
      
      {/* Role */}
      <div className="mt-auto pt-4">
        <p className="text-sm font-medium text-gray-600">— {role}</p>
      </div>
    </div>
  );
};

export default function Reviews() {
  const reviews = [
    {
      text: "A simple, intuitive tab manager that makes organizing and navigating tabs effortless.",
      role: "PhD Candidate"
    },
    {
      text: "As a developer juggling multiple projects, Mindtrail is a game-changer. The ability to save context with my sessions means I can switch between tasks without the mental overhead.",
      role: "Software Engineer"
    },
    {
      text: "I've tried many tab managers, but Mindtrail stands out with its thoughtful design and focus on context. It's become an essential part of my daily workflow.",
      role: "Content Strategist"
    }
  ];

  return (
    <section className="py-20 bg-gray-50" id="reviews">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            What People Are Saying
          </h2>
          <p className="text-gray-600 text-lg">
            Join professionals who have transformed their browsing experience with Mindtrail.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <Review key={index} {...review} />
          ))}
        </div>
      </div>
    </section>
  );
}
