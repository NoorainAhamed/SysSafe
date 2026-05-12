import React from 'react';
import Scanner from './components/Scanner';

function App() {
  return (
    <div className="min-h-screen flex flex-col selection:bg-cyber-accent selection:text-white overflow-hidden">
      {/* Header Navigation */}
      <nav className="h-16 px-8 flex items-center justify-between border-b border-cyber-border bg-cyber-nav relative z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-cyber-accent flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-pulse" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Ping Path <span className="text-cyber-accent font-normal">| SysSafe</span></span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyber-green shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-xs font-mono uppercase tracking-widest">System Secure</span>
          </div>
          <div className="h-6 w-px bg-white/10 hidden md:block" />
          <span className="text-xs font-mono text-slate-500 uppercase tracking-tighter hidden md:block">Last Scan: 14:02 UTC</span>
        </div>
      </nav>

      {/* App Content */}
      <main className="flex-1 overflow-y-auto relative z-10 custom-scrollbar">
        <Scanner />
      </main>

      {/* Footer Status Bar */}
      <footer className="h-12 px-8 flex items-center justify-between border-t border-cyber-border bg-cyber-nav text-[10px] font-mono text-slate-500 relative z-50">
        <div className="flex gap-8">
          <span className="hidden sm:inline">NETWORK: STABLE</span>
          <span className="hidden sm:inline">LATENCY: 12ms</span>
          <span className="hidden sm:inline text-cyber-accent">ENCRYPTION: AES-256</span>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex -space-x-1 overflow-hidden opacity-50">
            <div className="inline-block h-3 w-3 rounded-full ring-2 ring-cyber-nav bg-cyber-accent/20" />
            <div className="inline-block h-3 w-3 rounded-full ring-2 ring-cyber-nav bg-cyber-green/20" />
            <div className="inline-block h-3 w-3 rounded-full ring-2 ring-cyber-nav bg-indigo-500/20" />
          </div>
          <span className="uppercase tracking-widest">Active Guardrails</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
