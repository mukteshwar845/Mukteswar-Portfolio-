import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Home, 
  User, 
  Code2, 
  Briefcase, 
  Trophy, 
  FileText, 
  Mail,
  Github,
  Linkedin,
  Lock
} from "lucide-react";

const LeetCodeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M16.102 17.93l-2.697 2.607c-.466.452-1.111.975-1.86.975-.778 0-1.423-.523-1.89-1.007L4.975 15.69c-.467-.483-.974-1.127-.974-1.905 0-.778.507-1.423.974-1.907l7.307-7.234c.467-.484 1.112-.975 1.89-.975.748 0 1.394.523 1.86.975l2.697 2.674c.484.452.484 1.196 0 1.648-.484.452-1.22.452-1.704 0l-2.502-2.47c-.244-.21-.523-.356-.838-.356-.316 0-.594.14-.814.356L6.92 13.784c-.21.21-.346.496-.346.814 0 .315.136.594.346.814l4.572 4.54c.22.21.498.356.814.356.315 0 .594-.146.814-.356l2.502-2.438c.484-.452 1.22-.452 1.704 0 .484.452.484 1.196 0 1.618z" />
    <path d="M20.104 12.338l-4.102-4.043c-.484-.452-1.22-.452-1.704 0-.484.452-.484 1.196 0 1.648l4.102 4.043c.484.452 1.22.452 1.704 0 .484-.452.484-1.196 0-1.648z" />
  </svg>
);

export const SidebarDock: React.FC = () => {
  const [activeItem, setActiveItem] = useState("Home");

  const menuItems = [
    { label: "Home", icon: Home, href: "#" },
    { label: "About", icon: User, href: "#about" },
    { label: "Skills", icon: Code2, href: "#skills" },
    { label: "Projects", icon: Briefcase, href: "#case-studies" },
    { label: "Achievements", icon: Trophy, href: "#credentials" },
    { label: "Contact", icon: Mail, href: "#uplink-section" }
  ];

  const socialItems = [
    {
      name: "GitHub",
      icon: Github,
      href: "https://github.com/mukteshwar845",
      color: "hover:text-white hover:border-white/20 hover:bg-white/5"
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: "https://www.linkedin.com/in/mukteswar-gochhayat-119a80368/",
      color: "hover:text-[#0077b5] hover:border-[#0077b5]/20 hover:bg-[#0077b5]/5"
    },
    {
      name: "LeetCode",
      icon: LeetCodeIcon,
      href: "https://leetcode.com/u/mukteswar845/",
      color: "hover:text-[#ffa116] hover:border-[#ffa116]/20 hover:bg-[#ffa116]/5"
    }
  ];

  // Monitor scroll height to activate the proper navigational dot
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
    <div className="hidden xl:flex fixed left-6 top-1/2 -translate-y-1/2 z-50 flex-col items-center">
      <motion.div 
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, cubicBezier: [0.16, 1, 0.3, 1] }}
        className="w-[52px] bg-[#050508]/85 border border-white/5 rounded-2xl backdrop-blur-xl flex flex-col justify-between items-center py-5 px-2 shadow-[0_20px_50px_rgba(0,0,0,0.6),_0_0_30px_rgba(99,102,241,0.02)] relative"
      >
        {/* Sleek top ambient glass reflection line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[1.5px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent rounded-full" />

        {/* SECTION 1: Top Navigation Icons list */}
        <div className="flex flex-col gap-3.5 w-full items-center">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeItem === item.label;

            return (
              <div key={item.label} className="flex flex-col items-center group relative w-full">
                <a
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href, item.label)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 relative ${
                    isActive 
                      ? "bg-gradient-to-tr from-[#6366f1] to-[#4f46e5] text-white shadow-[0_2px_10px_rgba(99,102,241,0.3)] scale-105" 
                      : "text-white/35 hover:text-white hover:bg-white/5 hover:scale-105"
                  }`}
                  title={item.label}
                >
                  <IconComponent className="w-4 h-4" />
                </a>

                {/* Compact dot indicator matching design */}
                <div className="h-1 flex items-center justify-center mt-1">
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        layoutId="activeDot"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="w-1 h-1 rounded-full bg-indigo-400 shadow-[0_0_6px_#6366f1]"
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                      />
                    )}
                  </AnimatePresence>
                </div>

                {/* Floating tooltip labels */}
                <span className="absolute left-14 bg-zinc-950 border border-white/10 text-white font-mono text-[9px] uppercase tracking-widest px-2.5 py-1.5 rounded-md shadow-2xl opacity-0 translate-x-[-8px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none whitespace-nowrap z-50">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Thinner sleek separator */}
        <div className="w-6 h-[1px] bg-white/5 my-3" />

        {/* SECTION 2: Bottom Social Badges + 3D Email Orb */}
        <div className="flex flex-col gap-3 w-full items-center">
          {socialItems.map((social) => {
            const IconComponent = social.icon;

            return (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-8 h-8 rounded-lg border border-white/5 bg-[#090a10]/85 flex items-center justify-center text-white/40 transition-all duration-300 hover:scale-110 shadow-md ${social.color} group relative`}
                title={social.name}
              >
                <IconComponent className="w-3.5 h-3.5" />

                {/* Floating tooltips */}
                <span className="absolute left-12 bg-zinc-950 border border-white/10 text-white font-mono text-[9px] uppercase tracking-widest px-2.5 py-1.5 rounded-md shadow-2xl opacity-0 translate-x-[-8px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none whitespace-nowrap z-50">
                  {social.name}
                </span>
              </a>
            );
          })}

          {/* Squeezed Glowing 3D Glass Sphere Orb for Quick Email Contact */}
          <a
            href="#uplink-section"
            onClick={(e) => handleNavClick(e, "#uplink-section", "Contact")}
            className="w-8 h-8 rounded-full bg-[radial-gradient(circle_at_30%_30%,_#a855f7,_#6366f1_70%,_#3b82f6)] shadow-[0_2px_12px_rgba(99,102,241,0.45),_inset_0_2px_4px_rgba(255,255,255,0.4),_inset_0_-2px_4px_rgba(0,0,0,0.5)] hover:scale-115 hover:shadow-[0_4px_18px_rgba(168,85,247,0.7)] flex items-center justify-center transition-all duration-300 cursor-pointer relative group"
            title="Direct Message"
          >
            {/* Pulsing inner glow */}
            <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Mail className="w-3.5 h-3.5 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]" />

            {/* Floating tooltip */}
            <span className="absolute left-12 bg-zinc-950 border border-white/10 text-white font-mono text-[9px] uppercase tracking-widest px-2.5 py-1.5 rounded-md shadow-2xl opacity-0 translate-x-[-8px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none whitespace-nowrap z-50">
              Direct Mail
            </span>
          </a>


        </div>

        {/* Sleek bottom glass reflection line */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[1.5px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent rounded-full" />
      </motion.div>
    </div>
  );
};
