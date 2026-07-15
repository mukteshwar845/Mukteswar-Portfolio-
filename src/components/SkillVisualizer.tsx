import React, { useState } from "react";
import { Competency } from "../types";

interface SkillVisualizerProps {
  competencies: Competency[];
}

export const SkillVisualizer: React.FC<SkillVisualizerProps> = ({ competencies }) => {
  const [selectedSkill, setSelectedSkill] = useState<Competency>(competencies[0]);
  const [overclock, setOverclock] = useState(100); // 100% standard capacity up to 150%

  const handleSelect = (comp: Competency) => {
    setSelectedSkill(comp);
    setOverclock(100); // Reset overclock on switch
  };

  // Dynamic calculations based on overclock rate
  const adjustedPercentage = Math.min(100, Math.round(selectedSkill.percentage * (overclock / 100)));
  const overclockMultiplier = (overclock / 100).toFixed(2);
  const confidenceIndex = Math.round(100 * (overclock / 100));
  const deliveryVelocity = Math.round(48 * (overclock / 100));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
      {/* Competencies Selection List (Left Column) */}
      <div className="lg:col-span-5 space-y-4">
        <div className="text-[#adc6ff]/40 font-mono text-[9px] tracking-widest mb-2 uppercase">
          My Skill Sets
        </div>
        
        {competencies.map((comp) => {
          const isSelected = selectedSkill.id === comp.id;
          return (
            <div 
              key={comp.id}
              onClick={() => handleSelect(comp)}
              className={`p-6 border cursor-pointer transition-all duration-300 relative group flex justify-between items-center ${
                isSelected 
                  ? "border-[#adc6ff] bg-[#adc6ff]/5 shadow-[0_0_20px_rgba(173,198,255,0.06)]" 
                  : "border-white/5 bg-[#0f0f0f]/40 hover:border-white/20 hover:bg-white/5"
              }`}
            >
              <div>
                <div className="font-mono text-[9px] text-[#adc6ff] mb-1 uppercase tracking-widest">
                  {comp.category}
                </div>
                <div className="font-sora text-sm font-bold text-white group-hover:text-[#adc6ff] transition-colors">
                  {comp.name}
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-mono text-xs font-bold text-[#c3f400]">
                  {comp.percentage}%
                </div>
                <div className="w-16 h-1 bg-white/10 mt-2 overflow-hidden">
                  <div 
                    className="h-full bg-[#c3f400] transition-all duration-500" 
                    style={{ width: `${comp.percentage}%` }}
                  />
                </div>
              </div>

              {isSelected && (
                <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-[#c3f400]" />
              )}
            </div>
          );
        })}
      </div>

      {/* Advanced Skill Control Deck (Right Column) */}
      <div className="lg:col-span-7 glass-card p-10 flex flex-col justify-between border-l-2 border-l-[#adc6ff]">
        <div className="space-y-8">
          {/* Deck Header */}
          <div className="flex justify-between items-start border-b border-white/5 pb-6">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#c3f400] bg-[#c3f400]/5 px-2.5 py-1 border border-[#c3f400]/20 font-bold uppercase">
                {selectedSkill.category} Overview
              </span>
              <h3 className="font-sora text-2xl font-bold text-white mt-3">
                {selectedSkill.name}
              </h3>
            </div>
            
            <div className="text-right font-mono text-xs">
              <span className="text-white/40 block">Execution Level:</span>
              <span className="text-[#adc6ff] font-bold">{(1.0 * (overclock / 100)).toFixed(2)}x Speed</span>
            </div>
          </div>

          <p className="text-sm text-[#c1c6d7] leading-relaxed font-sans">
            {selectedSkill.description}
          </p>

          {/* Core Metrics Grids */}
          <div>
            <div className="text-white/40 font-mono text-[9px] tracking-widest uppercase mb-3">
              Core Expertise Areas
            </div>
            <div className="grid grid-cols-2 gap-4">
              {selectedSkill.metrics.map((metric, i) => (
                <div key={metric} className="bg-black/30 p-4 border border-white/5 flex items-center gap-3">
                  <span className="text-[#c3f400] font-mono text-[11px]">0{i + 1}_</span>
                  <span className="font-mono text-xs text-white/80">{metric}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Core Overclock Slider */}
          <div className="bg-[#050505] p-6 border border-white/5 space-y-4">
            <div className="flex justify-between items-center font-mono text-xs">
              <span className="text-white/40">Adjust Skill Focus & Experience:</span>
              <span className={`font-bold ${overclock > 120 ? "text-[#ffb4ab] animate-pulse" : "text-[#c3f400]"}`}>
                {overclock}% {overclock > 100 ? "Peak Focus" : "Standard Focus"}
              </span>
            </div>

            <input 
              type="range" 
              min="100" 
              max="150" 
              value={overclock} 
              onChange={(e) => setOverclock(parseInt(e.target.value))}
              className="w-full accent-[#c3f400] bg-white/10 h-1 cursor-ew-resize rounded-none"
            />

            <div className="grid grid-cols-3 pt-2 font-mono text-[10px] text-white/50 border-t border-white/5">
              <div>
                <span>Confidence:</span>
                <span className="block font-bold text-white mt-1">{confidenceIndex}%</span>
              </div>
              <div>
                <span>Delivery Velocity:</span>
                <span className="block font-bold text-white mt-1">{deliveryVelocity} Pts</span>
              </div>
              <div>
                <span>Multiplier:</span>
                <span className="block font-bold text-[#c3f400] mt-1">x{overclockMultiplier}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status Line */}
        <div className="border-t border-white/5 pt-6 mt-8 flex justify-between items-center font-mono text-[10px]">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${overclock > 135 ? "bg-red-500 animate-ping" : "bg-emerald-500 animate-pulse"}`} />
            <span className="text-white/50">Focus State: {overclock > 135 ? "High-Intensity Focus" : "Nominal State"}</span>
          </div>
          <span className="text-white/30">Adjusted Capability: {adjustedPercentage}%</span>
        </div>
      </div>
    </div>
  );
};
