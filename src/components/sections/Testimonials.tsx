"use client";

import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/animations";

const testimonials = [
  {
    text: "Sage AAA transformed our operations with their custom AI solution. They understood our needs perfectly and delivered a system that exceeded our expectations.",
    name: "David Michaels",
    position: "CTO, TechNova Inc",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100"
  },
  {
    text: "Working with Sage AAA on our website redesign was a game-changer. Their team was responsive, creative, and delivered a site that has significantly increased our conversions.",
    name: "Sarah Johnson",
    position: "Marketing Director, Elevate Group",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100&h=100"
  },
  {
    text: "The mobile app that Sage AAA developed for us has revolutionized how we interact with our customers. The attention to detail and user experience design is exceptional.",
    name: "James Rodriguez",
    position: "CEO, Horizon Logistics",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100&h=100"
  }
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-white -z-10"></div>

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
            Client <span className="text-emerald-500">Testimonials</span>
          </h2>
          <p className="text-gray-600">
            Hear what our clients have to say about their experience working with Sage AAA.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={fadeIn("up", "tween", 0.2 + index * 0.1, 0.8)}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 relative"
            >
              <div className="absolute -top-3 left-8 text-5xl text-emerald-200">&ldquo;</div>
              <div className="relative z-10">
                <p className="text-gray-600 mb-6">{testimonial.text}</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden mr-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-500 text-sm">{testimonial.position}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Testimonials;
