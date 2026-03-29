"use client";

import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/animations";

const Cta = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-emerald-600 to-emerald-700 text-white relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-10 -z-10"
        style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "20px 20px" }}
      ></div>

      <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl opacity-10 transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl opacity-10 transform translate-x-1/3 translate-y-1/3"></div>

      <motion.div
        variants={staggerContainer()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="container mx-auto px-4 sm:px-6 lg:px-8"
      >
        <motion.div
          variants={fadeIn("up", "tween", 0.2, 0.8)}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-6">Ready to Transform Your Business?</h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Partner with Sage AAA to develop innovative tech solutions that drive growth and efficiency. Let&apos;s build something amazing together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="/start-project"
              className="bg-white text-emerald-600 hover:bg-gray-100 py-3 px-8 rounded-lg shadow-lg transition duration-300 font-medium"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Start Your Project
            </motion.a>
            <motion.a
              href="#services"
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 py-3 px-8 rounded-lg transition duration-300 font-medium"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Explore Services
            </motion.a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Cta;
