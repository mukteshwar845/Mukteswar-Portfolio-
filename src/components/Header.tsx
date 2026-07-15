import React, { useState, useEffect } from "react";
import { Download, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface HeaderProps {
  onContactClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onContactClick }) => {
  const [activeItem, setActiveItem] = useState("Home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { label: "Home", href: "#" },
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#case-studies" },
    { label: "Achievements", href: "#credentials" },
    { label: "Contact", href: "#uplink-section" }
  ];

  // Monitor scroll height to activate the proper navigational header link
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 250;
      
      // Special check for bottom of page to auto-highlight Contact
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50) {
        setActiveItem("Contact");
        return;
      }

      for (const item of menuItems) {
        if (item.href === "#") {
          if (window.scrollY < 200) {
            setActiveItem("Home");
            break;
          }
          continue;
        }
        
        const el = document.getElementById(item.href.replace("#", ""));
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveItem(item.label);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, label: string) => {
    e.preventDefault();
    setActiveItem(label);
    setIsMobileMenuOpen(false);
    
    if (href === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const el = document.getElementById(href.replace("#", ""));
      if (el) {
        const offset = 90; // account for header
        const elementPosition = el.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: elementPosition - offset,
          behavior: "smooth"
        });
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#040406]/80 backdrop-blur-xl border-b border-white/5 h-20 transition-all duration-300">
      <div className="flex justify-between items-center h-full px-4 md:px-16 max-w-7xl mx-auto w-full">
        {/* Brand Logo with MG Gradient Box */}
        <a 
          href="#" 
          onClick={(e) => handleNavClick(e, "#", "Home")}
          className="flex items-center gap-2.5 sm:gap-3 group transition-all shrink-0"
          id="nav-logo"
        >
          <div className="bg-gradient-to-tr from-[#6366f1] to-[#3b82f6] text-white font-black text-xs sm:text-sm px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg shadow-[0_0_15px_rgba(99,102,241,0.3)] group-hover:scale-105 transition-transform">
            MG
          </div>
          <span className="font-sora text-xs sm:text-sm md:text-base font-extrabold text-white tracking-tight group-hover:text-indigo-400 transition-colors truncate max-w-[130px] xxs:max-w-[180px] sm:max-w-none">
            Mukteswar Gochhayat
          </span>
        </a>
        
        {/* Navigation Links - Desktop and Laptop */}
        <nav className="hidden lg:flex gap-8 items-center">
          {menuItems.map((item) => {
            const isActive = activeItem === item.label;
            return (
              <a 
                key={item.label}
                href={item.href} 
                onClick={(e) => handleNavClick(e, item.href, item.label)}
                className={`font-sans text-sm font-medium tracking-wide transition-all relative py-2 group ${
                  isActive 
                    ? "text-indigo-400 font-semibold" 
                    : "text-white/70 hover:text-white"
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1] animate-pulse" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Action Buttons: Resume & Mobile Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Resume Button with Download Icon */}
          <button 
            onClick={() => {
              const link = document.createElement("a");
              link.href = "/api/resume/download";
              link.setAttribute("download", "Mukteswar_Gochhayat_Resume");
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="bg-[#1c1236]/80 hover:bg-[#2e1d5a] border border-[#6366f1]/20 hover:border-[#6366f1]/50 text-white font-sans text-[11px] sm:text-xs font-semibold px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl transition-all duration-300 flex items-center gap-1.5 sm:gap-2 shadow-[0_4px_20px_rgba(99,102,241,0.15)] hover:shadow-[0_4px_25px_rgba(99,102,241,0.25)] hover:scale-[1.02] cursor-pointer" 
            id="btn-init-contact"
          >
            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400" />
            <span className="hidden xxs:inline">Resume</span>
          </button>

          {/* Hamburger Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex lg:hidden w-9 h-9 sm:w-10 sm:h-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 active:scale-95 transition-all cursor-pointer"
            aria-label="Toggle Navigation Menu"
            id="btn-mobile-nav"
          >
            {isMobileMenuOpen ? (
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-300" />
            ) : (
              <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-300" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute top-20 left-0 w-full bg-[#040406]/95 backdrop-blur-2xl border-b border-white/10 z-40 flex flex-col py-4 px-6 lg:hidden shadow-[0_15px_30px_rgba(0,0,0,0.8)]"
            id="mobile-nav-panel"
          >
            <div className="flex flex-col gap-1.5">
              {menuItems.map((item, index) => {
                const isActive = activeItem === item.label;
                return (
                  <motion.a
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04 }}
                    key={item.label}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href, item.label)}
                    className={`font-sans text-sm font-semibold tracking-wide py-3 px-4 rounded-xl flex items-center justify-between transition-all ${
                      isActive
                        ? "bg-[#6366f1]/10 text-indigo-400 border-l-2 border-indigo-500 pl-4"
                        : "text-white/70 hover:text-white hover:bg-white/5 border-l-2 border-transparent pl-3"
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]" />
                    )}
                  </motion.a>
                );
              })}
            </div>
            
            {/* Direct Contact Button in Mobile Drawer */}
            <div className="pt-4 mt-2 border-t border-white/5 flex flex-col gap-3">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onContactClick();
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#3b82f6] text-white font-sans text-xs font-bold text-center tracking-wide hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer shadow-[0_4px_15px_rgba(99,102,241,0.25)]"
              >
                Launch Contact Uplink
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
