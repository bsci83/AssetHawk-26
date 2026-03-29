"use client";

import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { ArrowRight, ExternalLink } from "lucide-react";

const portfolioItems = [
  {
    title: "SlateFusion",
    subtitle: "Film Industry Software",
    description: "Advanced software solution that streamlines production workflows for film industry professionals.",
    image: "/images/portfolio/SlateFusion.png",
    projectUrl: "https://slatefusion.com",
    tags: [
      { name: "Film Industry", primary: true },
      { name: "Production", primary: false },
      { name: "Workflow", primary: false }
    ]
  },
  {
    title: "AssetHawk",
    subtitle: "Asset Management System",
    description: "QR code-based asset tracking system that simplifies inventory management and record keeping.",
    image: "/images/portfolio/AssetHawk.png",
    projectUrl: "https://assethawk.com",
    tags: [
      { name: "Asset Tracking", primary: true },
      { name: "QR Technology", primary: false },
      { name: "Inventory", primary: false }
    ]
  },
  {
    title: "Your Green Book",
    subtitle: "E-commerce Platform",
    description: "Complete build of Your Green Book's e-commerce platform with integrated payment processing.",
    image: "/images/portfolio/YourGreenBook.png",
    projectUrl: "https://yourgreenbook.com",
    tags: [
      { name: "E-commerce", primary: true },
      { name: "React", primary: false },
      { name: "Stripe", primary: false }
    ]
  }
];

const Portfolio = () => {
  return (
    <section id="portfolio" className="py-20 bg-gray-50 relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-30 -z-10"></div>

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
            Our <span className="text-emerald-500">Work</span>
          </h2>
          <p className="text-gray-600">
            Explore our recent projects and see how we&apos;ve helped businesses transform their digital presence.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioItems.map((item, index) => (
            <motion.a
              key={index}
              href={item.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              variants={fadeIn("up", "tween", 0.2 + index * 0.1, 0.8)}
              className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer block"
            >
              <div className="relative overflow-hidden">
                <img
                  src={item.image}
                  alt={`${item.title} - ${item.subtitle}`}
                  className="w-full h-48 object-cover object-center transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-6 flex items-center justify-between w-full">
                    <div>
                      <h3 className="text-white font-semibold text-xl">{item.title}</h3>
                      <p className="text-gray-200 text-sm">{item.subtitle}</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                      <ExternalLink className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-xl">{item.title}</h3>
                  <div className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ExternalLink className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className={`text-xs px-2 py-1 rounded-full ${
                        tag.primary
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-emerald-600 font-medium flex items-center">
                    <span>Visit Project</span>
                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                  </p>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        <motion.div
          variants={fadeIn("up", "tween", 0.4, 0.8)}
          className="mt-12 text-center"
        >
          <a href="/company/portfolio" className="inline-flex items-center justify-center border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 py-3 px-8 rounded-lg transition duration-300">
            <span>View All Projects</span>
            <ArrowRight className="h-5 w-5 ml-2" />
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Portfolio;
