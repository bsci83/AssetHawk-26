import Link from "next/link";
import { Facebook, Twitter, Linkedin, Instagram, MapPin, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Information */}
          <div>
            <Link href="/" className="inline-block">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">
                  S
                </div>
                <span className="text-xl font-montserrat font-bold text-white">
                  Sage<span className="text-emerald-400">AAA</span>
                </span>
              </div>
            </Link>
            <p className="text-gray-400 mb-6">
              Empowering businesses with innovative AI automation and development solutions that drive growth and efficiency.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300" aria-label="Instagram">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6 relative inline-block">
              Services
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-emerald-500"></span>
            </h3>
            <ul className="space-y-3">
              <li><a href="#services" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">AI Automation</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">Web Development</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">App Development</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">Software Development</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">UI/UX Design</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">Consulting Services</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-6 relative inline-block">
              Company
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-emerald-500"></span>
            </h3>
            <ul className="space-y-3">
              <li><Link href="/dashboard" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">Dashboard</Link></li>
              <li><Link href="/projects" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">Projects</Link></li>
              <li><Link href="/crm" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">CRM</Link></li>
              <li><Link href="/analytics" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">Analytics</Link></li>
              <li><Link href="/tasks" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">Tasks</Link></li>
              <li><a href="#contact" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">Start a Project</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-6 relative inline-block">
              Contact Us
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-emerald-500"></span>
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="text-emerald-400 mt-1 mr-3" size={18} />
                <span className="text-gray-400">Marietta, GA 30068</span>
              </li>
              <li className="flex items-center">
                <Mail className="text-emerald-400 mr-3" size={18} />
                <a href="mailto:info@sageaaa.com" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">info@sageaaa.com</a>
              </li>
              <li className="flex items-center">
                <Phone className="text-emerald-400 mr-3" size={18} />
                <a href="tel:+14703052918" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">(470) 305-2918</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Sage AAA. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
