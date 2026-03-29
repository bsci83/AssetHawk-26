"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { user, login, logout, isConfigured } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const isHomePage = pathname === "/";
  const headerClass = !isHomePage || isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-transparent";

  return (
    <>
      <header className={`fixed w-full z-50 transition-all duration-300 ${headerClass}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">
                S
              </div>
              <span className="text-xl font-montserrat font-bold text-emerald-700">
                Ninja<span className="text-emerald-500">Sites</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-700 hover:text-emerald-500 font-medium transition duration-200">Home</Link>

              {/* Services Dropdown */}
              <div className="relative">
                <button
                  onClick={() => { setServicesDropdownOpen(!servicesDropdownOpen); setCompanyDropdownOpen(false); }}
                  className="flex items-center text-gray-700 hover:text-emerald-500 font-medium transition duration-200"
                >
                  Services <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                <div className={`absolute z-10 top-full -left-4 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-all duration-200 ${servicesDropdownOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}>
                  <div className="py-1">
                    <Link href="#services" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setServicesDropdownOpen(false)}>All Services</Link>
                    <Link href="#services" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setServicesDropdownOpen(false)}>AI Automation</Link>
                    <Link href="#services" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setServicesDropdownOpen(false)}>Web Development</Link>
                  </div>
                </div>
              </div>

              {/* Company Dropdown */}
              <div className="relative">
                <button
                  onClick={() => { setCompanyDropdownOpen(!companyDropdownOpen); setServicesDropdownOpen(false); }}
                  className="flex items-center text-gray-700 hover:text-emerald-500 font-medium transition duration-200"
                >
                  Company <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                <div className={`absolute z-10 top-full -left-4 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-all duration-200 ${companyDropdownOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}>
                  <div className="py-1">
                    <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setCompanyDropdownOpen(false)}>Dashboard</Link>
                    <Link href="/projects" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setCompanyDropdownOpen(false)}>Projects</Link>
                  </div>
                </div>
              </div>

              <a href="#process" className="text-gray-700 hover:text-emerald-500 font-medium transition duration-200">Process</a>
              <a href="#portfolio" className="text-gray-700 hover:text-emerald-500 font-medium transition duration-200">Portfolio</a>
              <a href="#contact" className="text-gray-700 hover:text-emerald-500 font-medium transition duration-200">Contact Us</a>

              <a href="#contact" className="bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-5 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-0.5">
                Start a Project
              </a>

              {isConfigured && (
                user ? (
                  <button onClick={logout} className="flex items-center space-x-1 text-gray-700 hover:text-emerald-500 transition duration-200">
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm">Logout</span>
                  </button>
                ) : (
                  <button onClick={login} className="flex items-center space-x-1 text-gray-700 hover:text-emerald-500 transition duration-200">
                    <User className="h-4 w-4" />
                    <span className="text-sm">Login</span>
                  </button>
                )
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden bg-gray-100 p-2 rounded-lg"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6 text-gray-700" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      <div className={`fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div className={`bg-white h-full w-3/4 max-w-sm p-6 shadow-xl flex flex-col transition-transform duration-300 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex justify-between items-center mb-8">
            <Link href="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                S
              </div>
              <span className="text-lg font-montserrat font-bold text-emerald-700">
                Ninja<span className="text-emerald-500">Sites</span>
              </span>
            </Link>
            <button className="p-2" onClick={closeMobileMenu} aria-label="Close menu">
              <X className="h-6 w-6 text-gray-700" />
            </button>
          </div>

          <nav className="flex flex-col space-y-4">
            <Link href="/" className="text-gray-700 hover:text-emerald-500 py-2 font-medium border-b border-gray-100" onClick={closeMobileMenu}>Home</Link>
            <a href="#services" className="text-gray-700 hover:text-emerald-500 py-2 font-medium border-b border-gray-100" onClick={closeMobileMenu}>Services</a>
            <Link href="/dashboard" className="text-gray-700 hover:text-emerald-500 py-2 font-medium border-b border-gray-100" onClick={closeMobileMenu}>Dashboard</Link>
            <a href="#process" className="text-gray-700 hover:text-emerald-500 py-2 font-medium border-b border-gray-100" onClick={closeMobileMenu}>Process</a>
            <a href="#portfolio" className="text-gray-700 hover:text-emerald-500 py-2 font-medium border-b border-gray-100" onClick={closeMobileMenu}>Portfolio</a>
            <a href="#contact" className="text-gray-700 hover:text-emerald-500 py-2 font-medium border-b border-gray-100" onClick={closeMobileMenu}>Contact Us</a>
            <a href="#contact" className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-5 rounded-lg shadow-md text-center transition duration-300" onClick={closeMobileMenu}>
              Start a Project
            </a>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Header;
