import React, { useState } from "react";
import { Credential } from "../types";

interface CredentialCardProps {
  credential: Credential;
}

export const CredentialCard: React.FC<CredentialCardProps> = ({ credential }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [scanStep, setScanStep] = useState(0);

  const triggerVerification = () => {
    setShowModal(true);
    setIsVerifying(true);
    setScanStep(1);

    setTimeout(() => {
      setScanStep(2); // Scan lines active
    }, 1000);

    setTimeout(() => {
      setScanStep(3); // Decryption completed
      setIsVerifying(false);
    }, 2800);
  };

  return (
    <>
      {/* Credential Badge Card */}
      <div className="holo-badge p-10 flex flex-col items-center text-center group">
        <div className="w-16 h-16 rounded-full bg-[#adc6ff]/10 flex items-center justify-center mb-8 border border-[#adc6ff]/30 group-hover:scale-110 group-hover:border-[#adc6ff] transition-all duration-300">
          <span className="material-symbols-outlined text-[#adc6ff] text-4xl electric-text">
            {credential.iconName}
          </span>
        </div>
        
        <h4 className="font-sora text-base font-bold mb-4 text-white group-hover:text-[#adc6ff] transition-colors">
          {credential.title}
        </h4>
        
        <p className="text-[#c1c6d7] text-xs mb-8 leading-relaxed font-sans max-w-xs">
          {credential.description}
        </p>
        
        <button 
          onClick={triggerVerification}
          className="mt-auto px-6 py-2.5 border border-[#adc6ff]/40 font-mono text-[10px] text-[#adc6ff] hover:bg-[#adc6ff] hover:text-[#001a41] transition-all duration-300 tracking-wider hover:shadow-[0_0_20px_rgba(173,198,255,0.4)] cursor-pointer"
        >
          View Certificate
        </button>
      </div>

      {/* Holographic Verification Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          {/* Modal Overlay */}
          <div 
            className="absolute inset-0 bg-[#050505]/95 backdrop-blur-md"
            onClick={() => {
              if (!isVerifying) setShowModal(false);
            }}
          />
          
          {/* Holographic Body */}
          <div className="relative w-full max-w-md bg-[#0f0f0f] border-2 border-[#adc6ff]/40 p-8 rounded-none shadow-[0_0_60px_rgba(173,198,255,0.2)] text-center overflow-hidden">
            {/* Holographic Scanner Scan Line */}
            {isVerifying && (
              <div 
                className="absolute inset-x-0 h-1 bg-[#c3f400] shadow-[0_0_20px_#c3f400] z-20 pointer-events-none"
                style={{ 
                  animation: "scanner 2s infinite linear", 
                  top: 0 
                }}
              />
            )}

            <div className="absolute top-2 left-2 font-mono text-[8px] text-[#adc6ff]/50 tracking-wider">
              Registry ID: SECURE_VAULT_042
            </div>
            
            <div className="absolute top-2 right-2 font-mono text-[8px] text-[#adc6ff]/50 tracking-wider">
              Validation Protocol: Verified
            </div>

            {/* Cert icon */}
            <div className="w-20 h-20 mx-auto rounded-full bg-[#adc6ff]/10 flex items-center justify-center my-6 border-2 border-[#adc6ff]/30 relative">
              <span className="material-symbols-outlined text-4xl text-[#adc6ff] animate-pulse">
                {credential.iconName}
              </span>
              {scanStep === 3 && (
                <div className="absolute -bottom-1 -right-1 bg-[#c3f400] text-[#161e00] rounded-full w-6 h-6 flex items-center justify-center border-2 border-[#0f0f0f]">
                  <span className="material-symbols-outlined text-xs font-bold">check</span>
                </div>
              )}
            </div>

            <div className="space-y-4 mb-6">
              <span className="text-[10px] font-mono tracking-[0.2em] text-[#c3f400] bg-[#c3f400]/5 px-3 py-1 border border-[#c3f400]/20 font-bold inline-block">
                {credential.issuer.toUpperCase()}
              </span>
              
              <h3 className="font-sora text-xl font-bold text-white tracking-tight">
                {credential.title}
              </h3>
              
              <p className="text-sm text-[#c1c6d7] max-w-sm mx-auto font-sans">
                {credential.description}
              </p>
            </div>

            {/* Scanning Progress & Terminal feedback */}
            <div className="bg-[#050505] p-5 border border-white/5 font-mono text-[10px] text-left space-y-2 mb-8">
              <div className="flex justify-between">
                <span className="text-white/40">Verification Status:</span>
                {scanStep === 1 && <span className="text-[#adc6ff] animate-pulse">Connecting...</span>}
                {scanStep === 2 && <span className="text-[#c3f400] animate-pulse">Verifying database record...</span>}
                {scanStep === 3 && <span className="text-[#c3f400] font-bold">Verified Secure ✅</span>}
              </div>
              
              <div className="flex justify-between">
                <span className="text-white/40">Credential ID:</span>
                <span className="text-[#adc6ff] select-all">{credential.verifyId}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-white/40">Issued Date:</span>
                <span className="text-[#c1c6d7]">{credential.date}</span>
              </div>

              <div className="border-t border-white/5 my-2 pt-2">
                <div className="text-[8px] text-white/30 mb-1">Key Skills:</div>
                <div className="flex flex-wrap gap-1.5">
                  {credential.skills.map(skill => (
                    <span key={skill} className="bg-white/5 px-2 py-0.5 text-[#adc6ff] text-[8px] font-bold">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button 
                onClick={() => setShowModal(false)}
                disabled={isVerifying}
                className="w-full py-3 border border-white/10 hover:border-white/30 text-white font-mono text-xs tracking-wider transition-colors cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
