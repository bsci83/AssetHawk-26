"use client";

import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { Bot, Globe, Smartphone, ArrowRight, Check } from "lucide-react";

const services = [
  {
    title: "AI Automation",
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=500&h=300",
    icon: <Bot className="h-6 w-6" />,
    description: "Harness the power of artificial intelligence to automate repetitive tasks, gain insights from data, and create intelligent systems that learn and adapt.",
    features: ["Custom AI Solutions", "Process Automation", "ML & Data Analytics"]
  },
  {
    title: "Web Development",
    image: "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?auto=format&fit=crop&q=80&w=500&h=300",
    icon: <Globe className="h-6 w-6" />,
    description: "Create stunning, high-performance websites and web applications that engage your audience and drive conversions across all devices.",
    features: ["Responsive Design", "E-commerce Solutions", "Web Applications"]
  },
  {
    title: "App Development",
    image: "https://images.unsplash.com/photo-1522199755839-a2bacb67c546?auto=format&fit=crop&q=80&w=500&h=300",
    icon: <Smartphone className="h-6 w-6" />,
    description: "Deliver exceptional mobile experiences with custom applications that connect with your audience and solve real business problems.",
    features: ["iOS & Android Apps", "Cross-platform Solutions", "Custom Business Apps"]
  }
];

const Services = () => {
  return (
    <section id="services" className="py-20 bg-gray-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-200 rounded-full blur-3xl opacity-20 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-300 rounded-full blur-3xl opacity-10 -z-10"></div>

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
            Our <span className="text-emerald-500">Services</span>
          </h2>
          <p className="text-gray-600">
            We offer comprehensive technology solutions tailored to your specific business needs and challenges.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={fadeIn("up", "tween", 0.2 + index * 0.1, 0.8)}
              className="service-card bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-48 object-cover object-center transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <h3 className="text-white font-semibold text-xl p-6">{service.title}</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-500 mb-4 card-icon transition-transform duration-300">
                  {service.icon}
                </div>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <ul className="text-gray-600 space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <Check className="text-emerald-500 mr-2 h-4 w-4" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <a href="#contact" className="text-emerald-500 font-medium flex items-center transition-all duration-300 hover:text-emerald-600">
                  Learn More
                  <ArrowRight className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          variants={fadeIn("up", "tween", 0.4, 0.8)}
          className="mt-16 text-center"
        >
          <a href="#contact" className="inline-flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-8 rounded-lg shadow-lg transition duration-300 transform hover:-translate-y-0.5">
            <span>Discuss Your Project</span>
            <ArrowRight className="h-5 w-5 ml-2" />
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Services;
