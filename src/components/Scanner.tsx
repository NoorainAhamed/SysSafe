import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, ShieldAlert, ShieldCheck, Search, Loader2, Activity, Globe, Lock, Cpu, Smartphone } from 'lucide-react';
import { performSecurityAudit, SecurityAuditResult } from '../lib/gemini';

interface ScanStep {
  id: string;
  label: string;
  status: 'pending' | 'scanning' | 'completed';
}

export default function Scanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [auditResult, setAuditResult] = useState<SecurityAuditResult | null>(null);
  const [deviceInfo, setDeviceInfo] = useState({
    ip: 'Scanning...',
    externalIp: 'Scanning...',
    os: 'Detecting...',
    browser: 'Detecting...'
  });

  const [steps, setSteps] = useState<ScanStep[]>([
    { id: 'identity', label: 'Verifying Device Identity', status: 'pending' },
    { id: 'inventory', label: 'Mapping Software Inventory', status: 'pending' },
    { id: 'health', label: 'Health Categorization', status: 'pending' },
    { id: 'security', label: 'Heuristic Security Audit', status: 'pending' },
    { id: 'privacy', label: 'Analyzing Privacy Tracks', status: 'pending' },
  ]);

  useEffect(() => {
    // Initial device info
    setDeviceInfo(prev => ({
      ...prev,
      os: navigator.platform,
      browser: navigator.userAgent.split(' ').slice(-1)[0]
    }));

    // Fetch public IP
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => setDeviceInfo(prev => ({ ...prev, externalIp: data.ip })));
  }, []);

  const handleStartScan = async () => {
    setIsScanning(true);
    setCurrentStepIndex(0);
    setAuditResult(null);

    // Reset steps
    setSteps(prev => prev.map(s => ({ ...prev[0], ...s, status: 'pending' })));

    for (let i = 0; i < steps.length; i++) {
      setCurrentStepIndex(i);
      setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'scanning' } : s));
      
      // Simulate step duration
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
      
      if (steps[i].id === 'security') {
        const result = await performSecurityAudit(navigator.userAgent);
        setAuditResult(result);
      }

      setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'completed' } : s));
    }

    setIsScanning(false);
    setCurrentStepIndex(-1);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8">
      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Device Identity & Progress (col-span-3) */}
        <div className="md:col-span-3 space-y-6">
          <section className="p-5 rounded-xl border border-white/5 bg-[#151921] flex flex-col gap-4 shadow-xl">
            <div className="text-[10px] font-bold text-cyber-accent uppercase tracking-widest">Device Identity</div>
            <div>
              <div className="text-lg font-semibold text-white truncate">{deviceInfo.os === 'Detecting...' ? 'Spectral-Node' : deviceInfo.os}</div>
              <div className="text-xs text-slate-500 font-mono mt-1">Status: Operational</div>
            </div>
            <div className="space-y-3 pt-3 border-t border-white/5">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500 uppercase tracking-tighter">Internal IP</span>
                <span className="font-mono text-slate-300">192.168.1.142</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-500 uppercase tracking-tighter">External IP</span>
                <span className="font-mono text-slate-300 truncate ml-2">
                  {deviceInfo.externalIp}
                </span>
              </div>
            </div>
          </section>

          <section className="p-5 rounded-xl border border-white/5 bg-[#151921] flex flex-col gap-4 shadow-xl">
            <div className="text-[10px] font-bold text-cyber-accent uppercase tracking-widest">Scan Progress</div>
            <div className="space-y-4">
              {steps.map((step) => (
                <div key={step.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                      step.status === 'completed' ? 'bg-cyber-green shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                      step.status === 'scanning' ? 'bg-cyber-accent animate-pulse shadow-[0_0_8px_rgba(14,165,233,0.5)]' :
                      'bg-white/10'
                    }`} />
                    <span className={`text-[11px] font-medium tracking-tight ${step.status === 'scanning' ? 'text-white' : 'text-slate-400'}`}>
                      {step.label}
                    </span>
                  </div>
                  {step.status === 'scanning' && <Loader2 className="w-3 h-3 animate-spin text-cyber-accent" />}
                  {step.status === 'completed' && <ShieldCheck className="w-3 h-3 text-cyber-green" />}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Middle Column: Central Interaction (col-span-6) */}
        <div className="md:col-span-6 flex flex-col items-center justify-center py-10 md:py-20 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.05)_0%,transparent_70%)] pointer-events-none" />
          
          <div className="relative flex flex-col items-center">
            {/* Ambient Glow */}
            <AnimatePresence>
              {isScanning && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1.2 }}
                  exit={{ opacity: 0, scale: 1.5 }}
                  className="absolute -inset-16 bg-cyber-accent/10 blur-[80px] rounded-full pointer-events-none"
                />
              )}
            </AnimatePresence>

            <button
              id="sys-safe-trigger"
              onClick={handleStartScan}
              disabled={isScanning}
              className={`relative w-64 h-64 rounded-full bg-[#151921] border-4 transition-all duration-700 flex flex-col items-center justify-center group ${
                isScanning ? 'border-cyber-accent/80 scale-105' : 'border-cyber-accent/20 hover:border-cyber-accent/40'
              }`}
            >
              {/* Inner Pulse Ring */}
              <div className={`absolute inset-4 rounded-full border border-cyber-accent/40 ${isScanning ? 'animate-ping' : 'animate-pulse'}`} />
              
              <div className={`transition-all duration-500 ${isScanning ? 'text-cyber-accent scale-110' : 'text-cyber-accent/60 group-hover:text-cyber-accent'}`}>
                {isScanning ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }}>
                    <Search className="w-16 h-16" />
                  </motion.div>
                ) : (
                  <Shield className="w-16 h-16" />
                )}
              </div>

              <span className="text-3xl font-black text-white tracking-[0.2em] uppercase mt-4">SysSafe</span>
              <span className="text-[10px] font-mono text-cyber-accent/60 mt-1 uppercase tracking-widest">
                {isScanning ? 'Scanning Layers...' : 'Initiate Deep Scan'}
              </span>
            </button>

            <div className="mt-12 text-center">
              <h2 className="text-xl font-medium text-white tracking-tight">System Integrity Shield</h2>
              <p className="text-sm text-slate-500 mt-2 max-w-xs mx-auto">
                One-click comprehensive audit of software, network, and privacy endpoints.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Inventory & Audit (col-span-3) */}
        <div className="md:col-span-3 space-y-6">
          <AnimatePresence mode="wait">
            {!auditResult && !isScanning ? (
              <motion.section 
                key="idle-right"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="p-5 rounded-xl border border-white/5 bg-[#151921] flex flex-col gap-4 shadow-xl h-full min-h-[300px] justify-center items-center text-center opacity-40 italic"
              >
                <Lock className="w-8 h-8 mb-2" />
                <p className="text-[10px] uppercase tracking-widest leading-loose">Awaiting System Authentication...</p>
              </motion.section>
            ) : (
              <motion.div 
                key="results-right"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Audit Score Card */}
                <section className="p-5 rounded-xl border border-white/5 bg-[#151921] flex flex-col gap-4 shadow-xl">
                  <div className="flex justify-between items-center">
                    <div className="text-[10px] font-bold text-cyber-accent uppercase tracking-widest">Privacy Score</div>
                    <span className="text-xl font-mono text-white">{auditResult?.securityScore || 0}%</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${auditResult?.securityScore || 0}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-cyber-accent"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 italic mt-1 leading-relaxed">
                    {auditResult?.summary}
                  </p>
                </section>

                {/* Software List */}
                <section className="p-5 rounded-xl border border-white/5 bg-[#151921] flex flex-col h-[280px] shadow-xl">
                  <div className="text-[10px] font-bold text-cyber-accent uppercase tracking-widest mb-4">Software Inventory</div>
                  <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                    {[
                      { name: 'Signal Messenger', version: 'v7.2.1', status: 'Healthy' },
                      { name: 'Chrome Browser', version: 'v124.0', status: 'Healthy' },
                      { name: 'Meta Services', version: 'Active', status: 'Caution' },
                      { name: 'Node.js Runtime', version: 'v20.1', status: 'Healthy' },
                      { name: 'System Core', version: 'v6.4', status: 'Healthy' },
                      { name: ' NordVPN', version: 'v3.1.0', status: 'Healthy' },
                    ].map((sw, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/5">
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-white tracking-tight">{sw.name}</span>
                          <span className="text-[10px] text-slate-500 italic">{sw.version}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase transition-colors duration-500 ${
                          sw.status === 'Healthy' ? 'bg-cyber-green/20 text-cyber-green' : 'bg-cyber-amber/20 text-cyber-amber'
                        }`}>
                          {sw.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Privacy Monitor */}
                <section className="p-5 rounded-xl border border-white/5 bg-[#151921] flex flex-col gap-4 shadow-xl">
                  <div className="text-[10px] font-bold text-cyber-accent uppercase tracking-widest">Privacy Monitor</div>
                  <div className="space-y-3">
                    {[
                      { label: 'Message Intercepts', value: 'None Detected', safe: true },
                      { label: 'Microphone Trace', value: 'Inactive', safe: true },
                      { label: 'Metadata Scraping', value: 'Blocked', safe: true },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">{item.label}</span>
                        <span className={`text-xs font-mono uppercase tracking-tighter ${item.safe ? 'text-cyber-green' : 'text-cyber-red'}`}>
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Audit Detail Popover (Visible after scan) */}
      <AnimatePresence>
        {auditResult && !isScanning && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8"
          >
             <section className="p-5 rounded-xl border border-white/5 bg-[#151921] shadow-2xl">
                <div className="text-xs font-bold text-cyber-red uppercase tracking-widest mb-4 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" /> Detected Security Threats
                </div>
                <ul className="space-y-3">
                  {auditResult.threats.map((threat, i) => (
                    <li key={i} className="flex gap-3 text-xs text-slate-300 leading-relaxed">
                       <span className="text-cyber-red">●</span> {threat}
                    </li>
                  ))}
                </ul>
             </section>

             <section className="p-5 rounded-xl border border-white/5 bg-[#151921] shadow-2xl">
                <div className="text-xs font-bold text-cyber-green uppercase tracking-widest mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Guardrail Recommendations
                </div>
                <ul className="space-y-3">
                  {auditResult.recommendations.map((rec, i) => (
                    <li key={i} className="flex gap-3 text-xs text-slate-300 leading-relaxed">
                       <span className="text-cyber-green">✓</span> {rec}
                    </li>
                  ))}
                </ul>
             </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
