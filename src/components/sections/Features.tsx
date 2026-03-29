"use client";

import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { Lightbulb, LineChart, Users, Headphones } from "lucide-react";

const featureItems = [
  {
    icon: <Lightbulb className="h-6 w-6" />,
    title: "Innovation First",
    description: "We stay ahead of the curve, leveraging the latest technologies to solve complex problems."
  },
  {
    icon: <LineChart className="h-6 w-6" />,
    title: "Results-Driven",
    description: "Our solutions are designed with clear metrics and tangible business outcomes in mind."
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Expert Team",
    description: "Our specialists bring decades of combined experience across multiple technology domains."
  },
  {
    icon: <Headphones className="h-6 w-6" />,
    title: "Ongoing Support",
    description: "We don't just deliver and leave - we ensure your solution continues to evolve and succeed."
  }
];

const Features = () => {
  return (
    <section className="py-16 bg-white">
      <motion.div
        variants={staggerContainer()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="container mx-auto px-4 sm:px-6 lg:px-8"
      >
        <motion.div
          variants={fadeIn("up", "tween", 0.1, 0.6)}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="text-3xl font-montserrat font-bold mb-4">
            Why Choose <span className="text-emerald-500">Sage AAA</span>
          </h2>
          <p className="text-gray-600">
            We combine technological expertise with business acumen to deliver solutions that make a real difference.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {featureItems.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeIn("up", "tween", 0.2 + index * 0.1, 0.8)}
              className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition duration-300"
            >
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-500 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Features;
