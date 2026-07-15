import React, { useState, useEffect } from "react";
import { Project } from "../types";

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [showModal, setShowModal] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [isCompiling, setIsCompiling] = useState(false);

  // Simulated live logging effect when modal is active
  useEffect(() => {
    if (!showModal) {
      setTerminalLogs([]);
      return;
    }

    const initLogs = [
      `[System] Initializing view interface for: ${project.title}...`,
      `[Source Code] Connected to repository registry.`,
      `[Security Check] SSL connection verified securely.`,
      `[Metadata] Loaded stats: Response: ${project.stats.latency} | Performance: ${project.stats.throughput}`,
      `[Build Optimizer] Compiling web bundle in production mode...`
    ];

    setTerminalLogs(initLogs);

    let idx = 0;
    const additionalLogs = [
      `[Network Status] Safe gateway routing active on Port 3000.`,
      `[Build Optimizer] Minifying static styles and client code...`,
      `[Memory Monitor] Server-side runtime memory is steady at ${project.stats.memory}`,
      `[Build Optimizer] Static page cache flushed and ready.`,
      `[System Log] Build complete: Project is fully online and ready!`
    ];

    const timer = setInterval(() => {
      if (idx < additionalLogs.length) {
        setTerminalLogs(prev => [...prev, additionalLogs[idx]]);
        idx++;
      } else {
        clearInterval(timer);
      }
    }, 1200);

    return () => clearInterval(timer);
  }, [showModal, project]);

  const handleTestSandbox = () => {
    setIsCompiling(true);
    setTerminalLogs(prev => [...prev, `[Command Input] Running automated performance tests...`]);
    
    setTimeout(() => {
      setTerminalLogs(prev => [
        ...prev,
        `[Test Suite] Initializing local test suite for ${project.title}...`,
        `[Test Suite] Web application compiled successfully.`,
        `[Test Suite] Running automated unit tests...`,
        `[Test Suite] SUCCESS // All test cases passed successfully (average load time: 24.2ms).`
      ]);
      setIsCompiling(false);
    }, 1500);
  };

  return (
    <>
      <div 
        onClick={() => setShowModal(true)}
        className="glass-card group cursor-pointer p-1"
      >
        {/* Project Thumbnail Image */}
        <div className="h-60 bg-[#0f0f0f] relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center group-hover:scale-[1.05] transition-transform duration-1000 opacity-40 grayscale group-hover:grayscale-0"
            style={{ backgroundImage: `url('${project.imageUrl}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent opacity-90" />
          
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-[#adc6ff]/20 backdrop-blur-md px-3 py-1 text-[9px] font-mono border border-[#adc6ff]/40 text-[#adc6ff] uppercase tracking-widest font-bold">
              {project.category}
            </span>
          </div>

          <a 
            className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center bg-black/60 border border-white/20 text-white rounded-none opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#adc6ff] hover:text-[#001a41]"
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="material-symbols-outlined text-sm font-bold">code</span>
          </a>
        </div>

        {/* Project Content */}
        <div className="p-7">
          <h3 className="font-sora text-lg font-bold text-white group-hover:text-[#adc6ff] transition-colors mb-3">
            {project.title}
          </h3>
          <p className="text-[#c1c6d7] font-sans text-sm leading-relaxed mb-7">
            {project.description}
          </p>
          
          <div className="flex gap-4 items-center">
            {project.tags.map((tag, i) => (
              <React.Fragment key={tag}>
                {i > 0 && <div className="h-1 w-1 rounded-full bg-[#414755]" />}
                <span className="text-[9px] font-mono text-[#c3f400] font-bold tracking-wider">
                  #{tag}
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Futuristic Interactive Terminal Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          {/* Modal Overlay */}
          <div 
            className="absolute inset-0 bg-[#050505]/95 backdrop-blur-md cursor-zoom-out"
            onClick={() => setShowModal(false)}
          />
          
          {/* Modal Body */}
          <div className="relative w-full max-w-2xl bg-[#0f0f0f] border border-[#adc6ff]/30 p-1 rounded-none shadow-[0_0_50px_rgba(173,198,255,0.15)] overflow-hidden">
            <div className="absolute -top-1 -right-1 w-8 h-8 border-t border-r border-[#c3f400]" />
            <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b border-l border-[#adc6ff]" />

            {/* Header */}
            <div className="flex justify-between items-center bg-[#080808] border-b border-white/10 px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 bg-[#c3f400] rounded-none animate-pulse" />
                <span className="font-mono text-xs text-[#adc6ff] font-bold tracking-widest uppercase">
                  Project Status & Logs: {project.title}
                </span>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="text-white/60 hover:text-[#c3f400] font-mono text-xs uppercase"
              >
                Close
              </button>
            </div>

            {/* Project Quick Spec Grids */}
            <div className="grid grid-cols-4 border-b border-white/5 bg-black/40">
              <div className="p-4 border-r border-white/5 text-center">
                <div className="text-[8px] font-mono text-white/40 tracking-wider">RESPONSE TIME</div>
                <div className="font-mono text-xs text-[#adc6ff] font-bold mt-1">{project.stats.latency}</div>
              </div>
              <div className="p-4 border-r border-white/5 text-center">
                <div className="text-[8px] font-mono text-white/40 tracking-wider">PERFORMANCE</div>
                <div className="font-mono text-xs text-[#adc6ff] font-bold mt-1">{project.stats.throughput}</div>
              </div>
              <div className="p-4 border-r border-white/5 text-center">
                <div className="text-[8px] font-mono text-white/40 tracking-wider">MEMORY SIZE</div>
                <div className="font-mono text-xs text-[#adc6ff] font-bold mt-1">{project.stats.memory}</div>
              </div>
              <div className="p-4 text-center">
                <div className="text-[8px] font-mono text-white/40 tracking-wider">HOST CORES</div>
                <div className="font-mono text-xs text-[#c3f400] font-bold mt-1">{project.stats.cpu}</div>
              </div>
            </div>

            {/* Terminal Console Output */}
            <div className="p-6 bg-[#050505] font-mono text-[11px] text-white/80 h-72 overflow-y-auto space-y-2 select-text">
              {terminalLogs.map((log, i) => {
                let color = "text-white/60";
                if (log.startsWith("[System Log]") || log.startsWith("[Test Suite] SUCCESS")) color = "text-[#c3f400] font-bold";
                else if (log.startsWith("[Metadata]") || log.startsWith("[Source Code]")) color = "text-[#adc6ff]";
                else if (log.startsWith("[Command Input]")) color = "text-[#c3f400]";
                else if (log.includes("SUCCESSFUL") || log.includes("SUCCESS")) color = "text-[#c3f400] font-bold";
                
                return (
                  <div key={i} className={`${color} leading-relaxed`}>
                    {log}
                  </div>
                );
              })}
              {isCompiling && (
                <div className="text-[#c3f400] animate-pulse">
                  Running automated verification tests... █
                </div>
              )}
            </div>

            {/* Actions Footer */}
            <div className="bg-[#080808] border-t border-white/10 px-6 py-4 flex justify-between items-center">
              <div className="text-[9px] font-mono text-white/40">
                Performance tested and verified securely.
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={handleTestSandbox}
                  disabled={isCompiling}
                  className="px-4 py-2 bg-transparent border border-[#c3f400] text-[#c3f400] font-mono text-[10px] tracking-wider hover:bg-[#c3f400] hover:text-black transition-colors"
                >
                  {isCompiling ? "Running Tests..." : "Run Tests"}
                </button>
                <a 
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#adc6ff] text-[#001a41] font-mono text-[10px] tracking-wider hover:bg-[#c3f400] hover:text-black transition-colors flex items-center gap-1.5"
                >
                  View Code <span>›</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
