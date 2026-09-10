import React from 'react';
import { 
  Server, 
  ShieldCheck, 
  Plus, 
  ChevronDown, 
  Wifi, 
  Activity, 
  Zap,
  Globe
} from 'lucide-react';
import { MinecraftServer } from '../types';

interface HeaderProps {
  servers: MinecraftServer[];
  activeServer: MinecraftServer;
  onSelectServer: (server: MinecraftServer) => void;
  onOpenCreateModal: () => void;
  onOpenDDoSCenter: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  servers,
  activeServer,
  onSelectServer,
  onOpenCreateModal,
  onOpenDDoSCenter,
}) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const getStatusDot = (status: MinecraftServer['status']) => {
    switch (status) {
      case 'running':
        return 'bg-emerald-500 shadow-emerald-500/50';
      case 'starting':
      case 'installing':
        return 'bg-amber-500 animate-pulse shadow-amber-500/50';
      case 'stopping':
        return 'bg-orange-500 shadow-orange-500/50';
      case 'offline':
      default:
        return 'bg-slate-500';
    }
  };

  return (
    <header className="border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400/30">
            <Server className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-white font-mono">
                HYPER<span className="text-emerald-400">SURGE</span>
              </span>
              <span className="px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                HOST
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Enterprise Minecraft Cloud & Anti-DDoS</p>
          </div>
        </div>

        {/* Active Server Switcher */}
        <div className="relative">
          <button
            id="server-selector-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-sm font-medium text-slate-200 transition-all hover:border-slate-600"
          >
            {activeServer.logoUrl ? (
              <img 
                src={activeServer.logoUrl} 
                alt="Logo" 
                className="w-5 h-5 rounded [image-rendering:pixelated] object-cover bg-slate-900 border border-slate-700 shrink-0" 
              />
            ) : (
              <span className={`w-2 h-2 rounded-full shadow-sm ${getStatusDot(activeServer.status)}`} />
            )}
            <span className="max-w-[130px] sm:max-w-[180px] truncate font-semibold">{activeServer.name}</span>
            <span className="text-xs text-emerald-400 hidden md:inline font-mono bg-slate-900/60 px-1.5 py-0.5 rounded border border-slate-700/50">
              {activeServer.version}
            </span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute left-0 mt-2 w-76 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl z-50 p-2 space-y-1">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
                Your Servers ({servers.length})
              </div>
              {servers.map((srv) => (
                <button
                  key={srv.id}
                  id={`select-server-${srv.id}`}
                  onClick={() => {
                    onSelectServer(srv);
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between text-xs transition-colors ${
                    srv.id === activeServer.id
                      ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {srv.logoUrl ? (
                      <img 
                        src={srv.logoUrl} 
                        alt="Logo" 
                        className="w-5 h-5 rounded [image-rendering:pixelated] object-cover bg-slate-950 shrink-0" 
                      />
                    ) : (
                      <span className={`w-2 h-2 rounded-full ${getStatusDot(srv.status)}`} />
                    )}
                    <span className="font-medium truncate">{srv.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-mono text-slate-400">{srv.version}</span>
                    <span className="text-[11px] text-emerald-400 font-mono">
                      {srv.telemetry.playersCurrent}/{srv.properties['max-players']}
                    </span>
                  </div>
                </button>
              ))}

              <div className="pt-2 border-t border-slate-800">
                <button
                  id="header-create-server-btn"
                  onClick={() => {
                    setDropdownOpen(false);
                    onOpenCreateModal();
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg flex items-center gap-2 text-xs font-medium text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Another Server</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Badges & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* DDoS Shield Live Status Button */}
          <button
            id="header-ddos-badge-btn"
            onClick={onOpenDDoSCenter}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-500/30 text-emerald-300 text-xs transition-all shadow-sm group"
            title="Anycast BGP DDoS Protection Active (3.8 Tbps)"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <div className="hidden lg:flex flex-col text-left">
              <span className="font-semibold text-[11px] leading-tight">3.8 Tbps DDoS Shield</span>
              <span className="text-[10px] text-emerald-400/80">Path.net Anycast • 99.99% Uptime</span>
            </div>
            <span className="lg:hidden text-[11px] font-semibold">Protected</span>
          </button>

          {/* Create Server Action */}
          <button
            id="header-deploy-server-btn"
            onClick={onOpenCreateModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-bold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">Create Server</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>
      </div>
    </header>
  );
};
