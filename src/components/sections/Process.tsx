"use client";

import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { Check } from "lucide-react";

const processSteps = [
  {
    title: "Discovery & Planning",
    description: "We begin by understanding your goals, challenges, and requirements. Through in-depth discussions and analysis, we define the scope and create a strategic roadmap.",
    features: [
      "Needs assessment & goal setting",
      "Technology stack selection",
      "Timeline & milestone planning"
    ]
  },
  {
    title: "Design & Prototype",
    description: "We create intuitive designs and functional prototypes, ensuring the solution matches your vision and meets user needs before full development begins.",
    features: [
      "User interface prototyping",
      "Architecture & system design",
      "Approval & feedback loop"
    ]
  },
  {
    title: "Development",
    description: "Our expert developers bring your solution to life, using modern technologies and best practices to build robust, scalable systems.",
    features: [
      "Agile development methodology",
      "Regular progress updates",
      "Quality code with documentation"
    ]
  },
  {
    title: "Testing & Refinement",
    description: "We rigorously test every aspect of your solution to ensure quality, security, and performance, making refinements based on feedback.",
    features: [
      "Comprehensive testing suite",
      "User acceptance testing",
      "Performance optimization"
    ]
  },
  {
    title: "Launch & Support",
    description: "We manage a smooth deployment and provide ongoing support and maintenance to ensure your solution continues to perform optimally.",
    features: [
      "Controlled deployment",
      "Training & knowledge transfer",
      "Ongoing maintenance & updates"
    ]
  }
];

const Process = () => {
  return (
    <section id="process" className="py-20 bg-white relative">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-white opacity-70 -z-10"></div>

      <motion.div
        variants={staggerContainer()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="container mx-auto px-4 sm:px-6 lg:px-8"
      >
        <motion.div
          variants={fadeIn("up", "tween", 0.2, 0.8)}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-montserrat font-bold mb-4">
            Our <span className="text-emerald-500">Process</span>
          </h2>
          <p className="text-gray-600">
            We follow a proven methodology that ensures quality, efficiency, and successful outcomes for every project.
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-1/2 top-0 w-1 h-full bg-emerald-100 -translate-x-1/2 hidden lg:block"></div>

          {/* Mobile Layout */}
          <div className="lg:hidden space-y-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                variants={fadeIn("up", "tween", 0.2 + index * 0.1, 0.8)}
                className="space-y-4"
              >
                <div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-500 flex items-center justify-center mb-4">
                    <span className="font-bold">{index + 1}</span>
                  </div>
                  <ul className="space-y-2 text-gray-600">
                    {step.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className="text-emerald-500 mt-1 mr-2 h-5 w-5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:block space-y-0 relative">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                variants={fadeIn(index % 2 === 0 ? "right" : "left", "tween", 0.2 + index * 0.1, 0.8)}
                className={`lg:flex items-center ${index !== 0 ? "lg:mt-16" : ""}`}
              >
                {index % 2 === 0 ? (
                  <>
                    <div className="lg:w-1/2 lg:pr-16 lg:text-right">
                      <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                    <div className="absolute left-1/2 w-12 h-12 rounded-full bg-emerald-500 text-white -translate-x-1/2 flex items-center justify-center font-bold z-10">
                      {index + 1}
                    </div>
                    <div className="lg:w-1/2 lg:pl-16">
                      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:transform lg:translate-y-8">
                        <ul className="space-y-2 text-gray-600">
                          {step.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start">
                              <Check className="text-emerald-500 mt-1 mr-2 h-5 w-5" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="lg:w-1/2 lg:pr-16">
                      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:transform lg:translate-y-8">
                        <ul className="space-y-2 text-gray-600">
                          {step.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start">
                              <Check className="text-emerald-500 mt-1 mr-2 h-5 w-5" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="absolute left-1/2 w-12 h-12 rounded-full bg-emerald-500 text-white -translate-x-1/2 flex items-center justify-center font-bold z-10">
                      {index + 1}
                    </div>
                    <div className="lg:w-1/2 lg:pl-16">
                      <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Process;
