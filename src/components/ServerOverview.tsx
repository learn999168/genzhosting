import React, { useState } from 'react';
import { 
  Play, 
  Square, 
  RotateCw, 
  Skull, 
  Copy, 
  Check, 
  ShieldCheck, 
  Wifi, 
  Cpu, 
  HardDrive, 
  Users, 
  Activity, 
  Zap, 
  ExternalLink,
  Clock,
  Radio,
  Sparkles,
  AlertTriangle,
  Image as ImageIcon,
  Edit3,
  Server,
  Layers,
  X
} from 'lucide-react';
import { MinecraftServer, ServerStatus } from '../types';
import { ServerLogoModal } from './ServerLogoModal';
import { VersionSelector } from './VersionSelector';
import { DEFAULT_SERVER_LOGO } from '../data/serverLogos';

interface ServerOverviewProps {
  server: MinecraftServer;
  onUpdateStatus: (status: ServerStatus) => void;
  onTriggerDDoSTest: () => void;
  onOpenConsole: () => void;
  onOpenPlayers: () => void;
  onUpdateServer?: (updates: Partial<MinecraftServer>) => void;
  onOpenPlugins?: () => void;
}

export const ServerOverview: React.FC<ServerOverviewProps> = ({
  server,
  onUpdateStatus,
  onTriggerDDoSTest,
  onOpenConsole,
  onOpenPlayers,
  onUpdateServer,
  onOpenPlugins,
}) => {
  const [copiedJava, setCopiedJava] = useState(false);
  const [copiedBedrock, setCopiedBedrock] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);

  const copyToClipboard = (text: string, isBedrock: boolean = false) => {
    navigator.clipboard.writeText(text);
    if (isBedrock) {
      setCopiedBedrock(true);
      setTimeout(() => setCopiedBedrock(false), 2000);
    } else {
      setCopiedJava(true);
      setTimeout(() => setCopiedJava(false), 2000);
    }
  };

  const getStatusBadge = () => {
    switch (server.status) {
      case 'running':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/10">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            ONLINE &amp; RUNNING
          </span>
        );
      case 'starting':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <RotateCw className="w-3 h-3 animate-spin" />
            STARTING UP...
          </span>
        );
      case 'stopping':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-500/10 text-orange-400 border border-orange-500/30">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            SAVING &amp; STOPPING...
          </span>
        );
      case 'offline':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-slate-500" />
            SERVER OFFLINE
          </span>
        );
    }
  };

  const formatUptime = (totalSeconds: number) => {
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    return `${hours}h ${minutes}m`;
  };

  // Convert Minecraft color codes (§a, §b, etc) into preview HTML
  const renderMotd = (motd: string) => {
    const parts = motd.split(/(§[0-9a-fk-or])/i);
    let currentColor = 'text-slate-200';
    let isBold = false;

    return (
      <span className="font-mono text-xs sm:text-sm">
        {parts.map((part, index) => {
          if (part.startsWith('§')) {
            const code = part.charAt(1).toLowerCase();
            switch (code) {
              case 'a': currentColor = 'text-emerald-400'; break;
              case 'b': currentColor = 'text-cyan-400'; break;
              case 'c': currentColor = 'text-red-400'; break;
              case 'd': currentColor = 'text-pink-400'; break;
              case 'e': currentColor = 'text-yellow-400'; break;
              case 'f': currentColor = 'text-white'; break;
              case '6': currentColor = 'text-amber-400'; break;
              case '7': currentColor = 'text-slate-400'; break;
              case '8': currentColor = 'text-slate-500'; break;
              case '9': currentColor = 'text-blue-400'; break;
              case 'l': isBold = true; break;
              case 'r': currentColor = 'text-slate-200'; isBold = false; break;
            }
            return null;
          }
          return (
            <span key={index} className={`${currentColor} ${isBold ? 'font-bold' : ''}`}>
              {part}
            </span>
          );
        })}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Card with Power Controls */}
      <div className="rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-5 sm:p-6 shadow-xl relative overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start sm:items-center gap-4">
            {/* Server 64x64 Logo with Quick Change Hover */}
            <div 
              className="relative group cursor-pointer shrink-0" 
              onClick={() => setIsLogoModalOpen(true)}
              title="Click to change server logo (server-icon.png 64x64)"
            >
              <img
                src={server.logoUrl || DEFAULT_SERVER_LOGO}
                alt={server.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-950 border-2 border-slate-700/80 group-hover:border-emerald-500 shadow-xl [image-rendering:pixelated] object-cover transition-all"
              />
              <div className="absolute inset-0 bg-black/75 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-[10px] text-white font-bold gap-1 p-1 text-center">
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                <span>Change Logo</span>
              </div>
              <div className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 text-slate-950 rounded-lg shadow sm:hidden">
                <Edit3 className="w-2.5 h-2.5" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">{server.name}</h1>
                {getStatusBadge()}

                {/* Interactive Version Badge */}
                <button
                  type="button"
                  onClick={() => setIsVersionModalOpen(true)}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-emerald-500/50 text-slate-200 flex items-center gap-1.5 transition-all group"
                  title="Click to change Minecraft version"
                >
                  <span className="text-emerald-400 font-bold">{server.software.toUpperCase()}</span>
                  <span>{server.version}</span>
                  <Edit3 className="w-3 h-3 text-slate-400 group-hover:text-emerald-400" />
                </button>

                <button
                  type="button"
                  onClick={onTriggerDDoSTest}
                  className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-300 flex items-center gap-1 transition-colors"
                  title="Click to view network & DDoS routing center"
                >
                  <span>{server.region.flag}</span>
                  <span>{server.region.city}</span>
                  <span className="text-[10px] text-emerald-400/90 font-mono font-bold">({server.telemetry.pingMs || server.region.basePing}ms)</span>
                </button>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  Uptime: <strong className="text-slate-200 font-mono">{formatUptime(server.telemetry.uptimeSeconds)}</strong>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  SLA: <strong className="text-emerald-400 font-mono">{server.uptimePercentage}%</strong>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  24/7 Engine: <strong className={server.alwaysOnline247 !== false ? 'text-emerald-400' : 'text-slate-400'}>
                    {server.alwaysOnline247 !== false ? 'Active (No Sleep)' : 'Standby'}
                  </strong>
                </span>
              </div>
            </div>
          </div>

          {/* Power Control Buttons */}
          <div className="flex items-center gap-2 flex-wrap self-start lg:self-center">
            {server.status === 'offline' ? (
              <button
                id="server-start-btn"
                onClick={() => onUpdateStatus('starting')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Server</span>
              </button>
            ) : (
              <>
                <button
                  id="server-restart-btn"
                  onClick={() => onUpdateStatus('starting')}
                  disabled={server.status === 'starting' || server.status === 'stopping'}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs sm:text-sm transition-all disabled:opacity-50"
                  title="Graceful restart"
                >
                  <RotateCw className="w-4 h-4" />
                  <span>Restart</span>
                </button>

                <button
                  id="server-stop-btn"
                  onClick={() => onUpdateStatus('stopping')}
                  disabled={server.status === 'stopping'}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-semibold text-xs sm:text-sm transition-all disabled:opacity-50"
                  title="Save world and stop gracefully"
                >
                  <Square className="w-4 h-4" />
                  <span>Stop</span>
                </button>

                <button
                  id="server-kill-btn"
                  onClick={() => onUpdateStatus('offline')}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-semibold text-xs sm:text-sm transition-all"
                  title="Force Kill (Use if server is unresponsive)"
                >
                  <Skull className="w-4 h-4" />
                  <span className="hidden sm:inline">Kill</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Server Address Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Java Server Address */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Java Edition Address</div>
              <div className="text-sm font-bold font-mono text-emerald-400 tracking-wide select-all">
                {server.domain}:{server.port}
              </div>
            </div>
            <button
              id="copy-java-ip-btn"
              onClick={() => copyToClipboard(`${server.domain}:${server.port}`, false)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              {copiedJava ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy IP</span>
                </>
              )}
            </button>
          </div>

          {/* Bedrock Server Address */}
          {server.bedrockPort && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Bedrock / Mobile Port</div>
                <div className="text-sm font-bold font-mono text-cyan-400 tracking-wide select-all">
                  {server.domain} <span className="text-slate-400 font-normal">Port:</span> {server.bedrockPort}
                </div>
              </div>
              <button
                id="copy-bedrock-ip-btn"
                onClick={() => copyToClipboard(`${server.domain}`, true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                {copiedBedrock ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy IP</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Authentic In-Game Multiplayer Server List Preview */}
        <div className="mt-4 p-4 rounded-xl bg-slate-950/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 flex-1 min-w-0">
            {/* Minecraft 64x64 server-icon.png with pixelated rendering */}
            <div className="relative group shrink-0">
              <img
                src={server.logoUrl || DEFAULT_SERVER_LOGO}
                alt="Minecraft Server Icon"
                className="w-14 h-14 rounded bg-slate-900 border border-slate-700 [image-rendering:pixelated] object-cover shadow"
              />
              <button
                type="button"
                onClick={() => setIsLogoModalOpen(true)}
                className="absolute inset-0 bg-black/70 rounded opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] text-white font-bold"
              >
                Edit
              </button>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <div className="font-minecraft text-sm font-bold text-white tracking-wide truncate">
                  {server.name}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {/* Ping bars */}
                  <div className="flex items-end gap-0.5 h-3.5" title={`${server.telemetry.pingMs}ms latency`}>
                    <div className="w-1 h-1.5 bg-emerald-500 rounded-xs" />
                    <div className="w-1 h-2 bg-emerald-500 rounded-xs" />
                    <div className="w-1 h-2.5 bg-emerald-500 rounded-xs" />
                    <div className="w-1 h-3 bg-emerald-500 rounded-xs" />
                    <div className="w-1 h-3.5 bg-emerald-500 rounded-xs" />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-400">
                    {server.telemetry.playersCurrent}/{server.properties['max-players']}
                  </span>
                </div>
              </div>
              <div className="mt-1">
                {renderMotd(server.properties.motd)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              type="button"
              onClick={() => setIsLogoModalOpen(true)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5 border border-slate-700"
            >
              <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span>Change Logo</span>
            </button>
            <button
              type="button"
              onClick={() => setIsVersionModalOpen(true)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5 border border-slate-700"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>All Versions</span>
            </button>
          </div>
        </div>
      </div>

      {/* 24/7 Always-Online Engine & Keep-Alive Daemon */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950/20 to-slate-900 border border-emerald-500/30 p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg shadow-emerald-500/10">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">24/7 Always-Online Keep-Alive Daemon</h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                  server.alwaysOnline247 !== false
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {server.alwaysOnline247 !== false ? 'ENGINE ACTIVE • 24/7 RUNNING' : 'DISABLED'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Prevents your Minecraft server from going to sleep or hibernating when 0 players are logged in.
                Keeps spawn chunks, automated redstone machines, and mob farms loaded while providing instant <strong>&lt;3 second crash recovery</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-center">
            {onOpenPlugins && (
              <button
                type="button"
                onClick={onOpenPlugins}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>24/7 Plugins</span>
              </button>
            )}

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={server.alwaysOnline247 !== false}
                onChange={(e) => onUpdateServer?.({ alwaysOnline247: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>
        </div>

        {/* 24/7 Specs Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-emerald-500/20 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Hibernation Mode</span>
            <span className="font-bold font-mono text-emerald-400 text-sm">
              {server.alwaysOnline247 !== false ? 'Zero Sleep (Disabled)' : 'Idle Sleep'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Crash Auto-Recovery</span>
            <span className="font-bold font-mono text-white text-sm">&lt; 3.0 Seconds</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Spawn Chunk Persistence</span>
            <span className="font-bold font-mono text-white text-sm">100% Loaded 24/7</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Active 24/7 Plugins</span>
            <span className="font-bold font-mono text-emerald-400 text-sm">
              {server.plugins.filter(p => p.category === '24/7 Uptime' && p.installed).length} Installed
            </span>
          </div>
        </div>
      </div>

      {/* Highest Network Uptime & DDoS Protection Card */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/40 border border-emerald-500/30 p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg shadow-emerald-500/10">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">Enterprise DDoS Shield &amp; Anycast Network</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-500 text-slate-950">
                  ACTIVE • 0ms OVERHEAD
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Protected by <strong className="text-emerald-400">{server.ddos.provider}</strong> with {server.ddos.capacity} filtering capacity.
                Layer 3/4 volumetric scrub and Layer 7 Minecraft protocol handshake inspection ensure your server runs at a flawless <strong>20.0 TPS</strong> without player disconnects or lag spikes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-center">
            <button
              id="simulate-ddos-btn"
              onClick={onTriggerDDoSTest}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all active:scale-95 shadow-sm"
            >
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Simulate DDoS Attack</span>
            </button>
          </div>
        </div>

        {/* Protection Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-emerald-500/20 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Mitigation Capacity</span>
            <span className="font-bold font-mono text-emerald-400 text-sm">{server.ddos.capacity}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Anycast Latency Overhead</span>
            <span className="font-bold font-mono text-white text-sm">0.0 ms</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Attacks Blocked Total</span>
            <span className="font-bold font-mono text-white text-sm">{server.ddos.attacksBlockedTotal} Incidents</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Packet Loss Rate</span>
            <span className="font-bold font-mono text-emerald-400 text-sm">0.00% (Lossless)</span>
          </div>
        </div>
      </div>

      {/* Real-time Telemetry Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* TPS (Ticks Per Second) */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tick Rate (TPS)</span>
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              <Sparkles className="w-3 h-3" />
              Lag-Free
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
              {server.status === 'running' ? server.telemetry.tps.toFixed(1) : '0.0'}
            </span>
            <span className="text-xs text-slate-500 font-mono">/ 20.0 TPS</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Standard tick interval: 50.0ms. Dedicated CPU thread ensures uninterrupted physics.
          </p>
        </div>

        {/* CPU Usage */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Processor (CPU)</span>
            <Cpu className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-white">
              {server.status === 'running' ? server.telemetry.cpuPercent.toFixed(1) : '0.0'}%
            </span>
            <span className="text-xs text-slate-400 font-mono">{server.hardware.cpuCores} vCPU</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div 
              className="h-full bg-emerald-500 transition-all duration-500" 
              style={{ width: `${server.status === 'running' ? Math.min(100, server.telemetry.cpuPercent) : 0}%` }}
            />
          </div>
        </div>

        {/* RAM Usage */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Memory (RAM)</span>
            <Activity className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-white">
              {server.status === 'running' ? (server.telemetry.ramUsedMb / 1024).toFixed(1) : '0.0'}
            </span>
            <span className="text-xs text-slate-400 font-mono">/ {server.hardware.ramGb} GB DDR5</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div 
              className="h-full bg-cyan-500 transition-all duration-500" 
              style={{ width: `${server.status === 'running' ? (server.telemetry.ramUsedMb / server.telemetry.ramTotalMb) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Players Online */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Players Online</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-white">
              {server.status === 'running' ? server.players.length : 0}
            </span>
            <span className="text-xs text-slate-400 font-mono">/ {server.properties['max-players']} Slots</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex -space-x-1.5 overflow-hidden">
              {server.players.slice(0, 4).map((p) => (
                <img
                  key={p.uuid}
                  src={`https://mc-heads.net/avatar/${p.name}/24`}
                  alt={p.name}
                  className="inline-block h-5 w-5 rounded ring-1 ring-slate-800 bg-slate-700"
                  title={p.name}
                />
              ))}
            </div>
            <button
              onClick={onOpenPlayers}
              className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300"
            >
              Manage &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Quick Navigation & Console Teaser */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Live Console Preview */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-950 border border-slate-800 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Server Console</span>
            </div>
            <button
              id="view-full-console-btn"
              onClick={onOpenConsole}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <span>Full Interactive Terminal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-32 bg-slate-900/90 rounded-xl p-3 font-mono text-xs text-slate-300 overflow-hidden space-y-1">
            {server.consoleLogs.slice(-4).map((log) => (
              <div key={log.id} className="truncate">
                <span className="text-slate-500">[{log.timestamp}] </span>
                <span className={log.level === 'SUCCESS' ? 'text-emerald-400' : log.level === 'WARN' ? 'text-amber-400' : 'text-slate-300'}>
                  {log.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Server Properties Snapshot */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-3">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">World Configuration</div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Difficulty:</span>
              <span className="font-bold capitalize text-white font-mono">{server.properties.difficulty}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">PVP Combat:</span>
              <span className={`font-bold font-mono ${server.properties.pvp ? 'text-emerald-400' : 'text-red-400'}`}>
                {server.properties.pvp ? 'ENABLED' : 'DISABLED'}
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Online Mode (Mojang):</span>
              <span className="font-bold font-mono text-emerald-400">AUTHENTICATED</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-400">View Distance:</span>
              <span className="font-bold font-mono text-white">{server.properties['view-distance']} Chunks</span>
            </div>
          </div>
        </div>
      </div>

      {/* Server Logo Modal */}
      <ServerLogoModal
        isOpen={isLogoModalOpen}
        currentLogoUrl={server.logoUrl || DEFAULT_SERVER_LOGO}
        serverName={server.name}
        onClose={() => setIsLogoModalOpen(false)}
        onSelectLogo={(logoUrl) => {
          onUpdateServer?.({ logoUrl });
        }}
      />

      {/* All Minecraft Versions Switcher Modal */}
      {isVersionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Switch Minecraft Version</h3>
                  <p className="text-[11px] text-slate-400">Current version: <span className="text-emerald-400 font-mono font-bold">{server.version}</span></p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsVersionModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1 space-y-4">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>
                  Switching Minecraft versions automatically preserves world chunks and backs up your world data before applying changes.
                </span>
              </div>

              <VersionSelector
                selectedVersion={server.version}
                onSelectVersion={(newVer) => {
                  onUpdateServer?.({
                    version: newVer,
                    consoleLogs: [
                      ...server.consoleLogs,
                      {
                        id: Date.now().toString(),
                        timestamp: new Date().toLocaleTimeString(),
                        level: 'WARN',
                        text: `[Version Switcher] Upgrading/Changing engine runtime to Minecraft ${newVer}...`
                      },
                      {
                        id: (Date.now() + 1).toString(),
                        timestamp: new Date().toLocaleTimeString(),
                        level: 'SUCCESS',
                        text: `[Version Switcher] Successfully patched server binaries to Minecraft ${newVer}.`
                      }
                    ]
                  });
                  setIsVersionModalOpen(false);
                }}
              />
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex justify-end">
              <button
                type="button"
                onClick={() => setIsVersionModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
