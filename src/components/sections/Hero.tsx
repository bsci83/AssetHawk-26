"use client";

import { motion } from "framer-motion";
import FloatingCard from "@/components/ui/floating-card";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { Bot, Code } from "lucide-react";

const Hero = () => {
  return (
    <section id="home" className="relative pt-28 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-white -z-10"></div>
      <div className="absolute top-20 right-0 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-30 -z-10"></div>
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-sky-300 rounded-full blur-3xl opacity-20 -z-10"></div>

      <div className="absolute inset-0 opacity-[0.03] -z-10"
        style={{ backgroundImage: "radial-gradient(#10B981 1px, transparent 1px)", backgroundSize: "30px 30px" }}>
      </div>

      <motion.div
        variants={staggerContainer()}
        initial="hidden"
        animate="show"
        className="container mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={fadeIn("right", "tween", 0.2, 0.8)}
            className="order-2 md:order-1"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold leading-tight text-gray-900">
              Powering Your <span className="text-emerald-600">Digital</span> Transformation
            </h1>
            <p className="mt-6 text-lg text-gray-600 leading-relaxed">
              At Sage AAA, we combine AI innovation with expert development to create cutting-edge solutions that drive your business forward. From automation to custom software, we build technology that works for you.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="/start-project" className="bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-8 rounded-lg shadow-lg font-medium transition duration-300 transform hover:-translate-y-0.5">
                Start a Project
              </a>
              <a href="#services" className="bg-white text-emerald-600 border-2 border-emerald-200 py-3 px-8 rounded-lg font-medium hover:bg-emerald-50 transition duration-300">
                Explore Services
              </a>
            </div>
          </motion.div>

          <motion.div
            variants={fadeIn("left", "tween", 0.2, 0.8)}
            className="order-1 md:order-2 relative"
          >
            <div className="relative z-10">
              <img
                src="https://images.unsplash.com/photo-1581089781785-603411fa81e5?auto=format&fit=crop&q=80&w=600&h=400"
                alt="Modern technology solutions"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>

            <div className="relative">
              <div className="mb-6 mx-auto max-w-[200px] sm:hidden">
                <FloatingCard
                  className="animate-float"
                  icon={<Bot className="h-5 w-5" />}
                  title="AI Automation"
                  description="Smart solutions that work for you 24/7"
                  iconBgClass="bg-emerald-100 text-emerald-600"
                />
              </div>

              <div className="hidden sm:block absolute top-0 left-0 transform -translate-x-1/3 -translate-y-1/4 z-20">
                <FloatingCard
                  className="animate-float"
                  icon={<Bot className="h-5 w-5" />}
                  title="AI Automation"
                  description="Smart solutions that work for you 24/7"
                  iconBgClass="bg-emerald-100 text-emerald-600"
                />
              </div>

              <div className="mt-6 mx-auto max-w-[200px] sm:hidden">
                <FloatingCard
                  className="animate-float-delayed"
                  icon={<Code className="h-5 w-5" />}
                  title="Custom Development"
                  description="Tailored software for your unique needs"
                  iconBgClass="bg-sky-100 text-sky-600"
                />
              </div>

              <div className="hidden sm:block absolute bottom-0 right-0 transform translate-x-1/3 translate-y-1/4 z-20">
                <FloatingCard
                  className="animate-float-delayed"
                  icon={<Code className="h-5 w-5" />}
                  title="Custom Development"
                  description="Tailored software for your unique needs"
                  iconBgClass="bg-sky-100 text-sky-600"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
