import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Terminal, 
  ShieldCheck, 
  Settings, 
  Puzzle, 
  Users, 
  HardDrive, 
  Activity,
  Plus,
  Radio,
  Zap,
  CheckCircle2,
  Lock,
  Globe
} from 'lucide-react';
import { INITIAL_SERVERS } from './data/serverPresets';
import { MinecraftServer, ServerProperties, ServerStatus } from './types';
import { Header } from './components/Header';
import { ServerCreateModal } from './components/ServerCreateModal';
import { ServerOverview } from './components/ServerOverview';
import { ServerConsole } from './components/ServerConsole';
import { NetworkDDoSCenter } from './components/NetworkDDoSCenter';
import { ServerPropertiesTab } from './components/ServerPropertiesTab';
import { PluginsManager } from './components/PluginsManager';
import { PlayerManager } from './components/PlayerManager';
import { BackupsManager } from './components/BackupsManager';

type NavTab = 'overview' | 'console' | 'network-ddos' | 'properties' | 'plugins' | 'players' | 'backups';

export default function App() {
  const [servers, setServers] = useState<MinecraftServer[]>(() => {
    const saved = localStorage.getItem('hypersurge_mc_servers');
    if (saved) {
      try {
        const parsed: MinecraftServer[] = JSON.parse(saved);
        // Ensure any new preset servers like Cambodia SMP are merged
        const missing = INITIAL_SERVERS.filter(initSrv => !parsed.some(p => p.id === initSrv.id));
        if (missing.length > 0) {
          return [...parsed, ...missing];
        }
        return parsed;
      } catch (e) {
        console.error('Failed to parse saved servers', e);
      }
    }
    return INITIAL_SERVERS;
  });

  const [activeServerId, setActiveServerId] = useState<string>(servers[0]?.id || 'srv-hypersmp-01');
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('hypersurge_mc_servers', JSON.stringify(servers));
  }, [servers]);

  const activeServer = servers.find(s => s.id === activeServerId) || servers[0];

  // Helper to update active server
  const updateActiveServer = (updater: (prev: MinecraftServer) => MinecraftServer) => {
    setServers(prev => prev.map(s => s.id === activeServer.id ? updater(s) : s));
  };

  // Real-time telemetry ticker for live server
  useEffect(() => {
    const interval = setInterval(() => {
      setServers(prevServers =>
        prevServers.map(srv => {
          if (srv.status !== 'running') return srv;

          // Subtle natural variation for CPU and RAM
          const jitterCpu = Math.max(5, Math.min(65, srv.telemetry.cpuPercent + (Math.random() - 0.5) * 3));
          const jitterRam = Math.max(
            srv.telemetry.ramTotalMb * 0.2, 
            Math.min(srv.telemetry.ramTotalMb * 0.85, srv.telemetry.ramUsedMb + (Math.random() - 0.5) * 20)
          );

          return {
            ...srv,
            telemetry: {
              ...srv.telemetry,
              cpuPercent: parseFloat(jitterCpu.toFixed(1)),
              ramUsedMb: Math.round(jitterRam),
              uptimeSeconds: srv.telemetry.uptimeSeconds + 1,
              // Stable 20.0 TPS with enterprise hardware
              tps: 20.0,
            }
          };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Server Power Controls
  const handleUpdateStatus = (newStatus: ServerStatus) => {
    const now = new Date().toLocaleTimeString();

    if (newStatus === 'starting') {
      updateActiveServer(s => ({
        ...s,
        status: 'starting',
        consoleLogs: [
          ...s.consoleLogs,
          { id: Date.now().toString(), timestamp: now, level: 'INFO', text: `Server reboot initiated by web panel` },
          { id: (Date.now() + 1).toString(), timestamp: now, level: 'INFO', text: `Loading libraries and engine components (${s.software.toUpperCase()})...` },
        ]
      }));

      setTimeout(() => {
        const startupTime = new Date().toLocaleTimeString();
        updateActiveServer(s => ({
          ...s,
          status: 'running',
          telemetry: { ...s.telemetry, uptimeSeconds: 0, tps: 20.0 },
          consoleLogs: [
            ...s.consoleLogs,
            { id: Date.now().toString(), timestamp: startupTime, level: 'SUCCESS', text: `[Path.net DDoS Shield] Anycast filter bound on port ${s.port} (0ms latency overhead)` },
            { id: (Date.now() + 1).toString(), timestamp: startupTime, level: 'INFO', text: `Preparing start region for dimension minecraft:overworld` },
            { id: (Date.now() + 2).toString(), timestamp: startupTime, level: 'SUCCESS', text: `Done (3.820s)! For help, type "help"` },
          ]
        }));
      }, 2000);
    } else if (newStatus === 'stopping') {
      updateActiveServer(s => ({
        ...s,
        status: 'stopping',
        consoleLogs: [
          ...s.consoleLogs,
          { id: Date.now().toString(), timestamp: now, level: 'WARN', text: `Server stop requested. Broadcasting shutdown notification to players...` },
          { id: (Date.now() + 1).toString(), timestamp: now, level: 'INFO', text: `Saving world chunks to NVMe storage...` },
        ]
      }));

      setTimeout(() => {
        const stopTime = new Date().toLocaleTimeString();
        updateActiveServer(s => ({
          ...s,
          status: 'offline',
          players: [],
          telemetry: { ...s.telemetry, tps: 0, cpuPercent: 0 },
          consoleLogs: [
            ...s.consoleLogs,
            { id: Date.now().toString(), timestamp: stopTime, level: 'INFO', text: `World saved successfully. Server shutdown complete.` }
          ]
        }));
      }, 1500);
    } else {
      updateActiveServer(s => ({
        ...s,
        status: newStatus,
        players: newStatus === 'offline' ? [] : s.players,
        telemetry: newStatus === 'offline' ? { ...s.telemetry, tps: 0, cpuPercent: 0 } : s.telemetry
      }));
    }
  };

  // Console Command Handler
  const handleSendCommand = (cmd: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const cleanCmd = cmd.trim();
    const lower = cleanCmd.toLowerCase();

    const userLog = {
      id: Date.now().toString(),
      timestamp,
      level: 'INFO' as const,
      text: `CONSOLE issued server command: ${cleanCmd}`
    };

    let responseLog: { id: string; timestamp: string; level: 'INFO' | 'WARN' | 'ERROR' | 'CHAT' | 'SUCCESS'; text: string };

    if (lower === '/help') {
      responseLog = {
        id: (Date.now() + 1).toString(),
        timestamp,
        level: 'INFO',
        text: 'Available commands: /tps, /time set <day|night>, /weather <clear|rain>, /op <player>, /deop <player>, /whitelist <add|remove>, /gamemode <mode>, /say <msg>, /save-all, /ban <player>, /kick <player>'
      };
    } else if (lower === '/tps') {
      responseLog = {
        id: (Date.now() + 1).toString(),
        timestamp,
        level: 'SUCCESS',
        text: `TPS from last 1m, 5m, 15m: 20.00, 20.00, 20.00 (Zero tick drops, CPU overhead: ${activeServer.telemetry.cpuPercent}%)`
      };
    } else if (lower.startsWith('/time set')) {
      const arg = lower.replace('/time set', '').trim();
      responseLog = {
        id: (Date.now() + 1).toString(),
        timestamp,
        level: 'INFO',
        text: `Set the time to ${arg === 'day' ? '1000' : arg === 'night' ? '13000' : arg}`
      };
    } else if (lower.startsWith('/weather')) {
      const arg = lower.replace('/weather', '').trim();
      responseLog = {
        id: (Date.now() + 1).toString(),
        timestamp,
        level: 'INFO',
        text: `Set the weather to ${arg || 'clear'}`
      };
    } else if (lower.startsWith('/say ')) {
      const msg = cleanCmd.substring(5);
      responseLog = {
        id: (Date.now() + 1).toString(),
        timestamp,
        level: 'CHAT',
        text: `[Server] ${msg}`
      };
    } else if (lower.startsWith('/op ')) {
      const targetName = cleanCmd.substring(4).trim();
      updateActiveServer(s => ({
        ...s,
        players: s.players.map(p => p.name.toLowerCase() === targetName.toLowerCase() ? { ...p, isOp: true } : p)
      }));
      responseLog = {
        id: (Date.now() + 1).toString(),
        timestamp,
        level: 'SUCCESS',
        text: `Made ${targetName} a server operator`
      };
    } else if (lower.startsWith('/deop ')) {
      const targetName = cleanCmd.substring(6).trim();
      updateActiveServer(s => ({
        ...s,
        players: s.players.map(p => p.name.toLowerCase() === targetName.toLowerCase() ? { ...p, isOp: false } : p)
      }));
      responseLog = {
        id: (Date.now() + 1).toString(),
        timestamp,
        level: 'INFO',
        text: `Made ${targetName} no longer a server operator`
      };
    } else if (lower.startsWith('/kick ')) {
      const targetName = cleanCmd.substring(6).trim();
      updateActiveServer(s => ({
        ...s,
        players: s.players.filter(p => p.name.toLowerCase() !== targetName.toLowerCase())
      }));
      responseLog = {
        id: (Date.now() + 1).toString(),
        timestamp,
        level: 'WARN',
        text: `Kicked ${targetName} from the server`
      };
    } else if (lower.startsWith('/ban ')) {
      const targetName = cleanCmd.substring(5).trim();
      updateActiveServer(s => ({
        ...s,
        players: s.players.filter(p => p.name.toLowerCase() !== targetName.toLowerCase())
      }));
      responseLog = {
        id: (Date.now() + 1).toString(),
        timestamp,
        level: 'ERROR',
        text: `Banned ${targetName}: Banned by an operator`
      };
    } else if (lower === '/save-all') {
      responseLog = {
        id: (Date.now() + 1).toString(),
        timestamp,
        level: 'SUCCESS',
        text: 'Saving the game (All chunks, player data, and plugins flushed to NVMe)'
      };
    } else {
      responseLog = {
        id: (Date.now() + 1).toString(),
        timestamp,
        level: 'INFO',
        text: `Executed command '${cleanCmd}' successfully`
      };
    }

    updateActiveServer(s => ({
      ...s,
      consoleLogs: [...s.consoleLogs, userLog, responseLog]
    }));
  };

  // Simulate DDoS Attack Trigger
  const handleSimulateAttack = (type: 'udp' | 'syn' | 'bot') => {
    const timestamp = new Date().toLocaleTimeString();
    const peakGbps = type === 'udp' ? 450.2 : type === 'syn' ? 120.5 : 28.4;
    const typeLabel = type === 'udp' ? 'UDP Volumetric Flood' : type === 'syn' ? 'SYN Connection Exhaustion' : 'Layer 7 Bot Handshake Flood';

    const detectLog = {
      id: Date.now().toString(),
      timestamp,
      level: 'WARN' as const,
      text: `[Path.net DDoS Shield] Detected inbound ${typeLabel} (${peakGbps} Gbps) targeting port ${activeServer.port}`
    };

    const scrubLog = {
      id: (Date.now() + 1).toString(),
      timestamp,
      level: 'SUCCESS' as const,
      text: `[Anycast Edge Filter] Scrubbing active. 99.99% invalid traffic dropped in 84ms. In-game TPS preserved at 20.00 TPS.`
    };

    updateActiveServer(s => ({
      ...s,
      ddos: {
        ...s.ddos,
        attacksBlockedTotal: s.ddos.attacksBlockedTotal + 1,
        lastAttackTimestamp: 'Just now',
        lastAttackPeakGbps: peakGbps,
      },
      consoleLogs: [...s.consoleLogs, detectLog, scrubLog]
    }));
  };

  // Player management actions
  const handleKickPlayer = (playerName: string) => {
    handleSendCommand(`/kick ${playerName}`);
  };

  const handleBanPlayer = (playerName: string) => {
    handleSendCommand(`/ban ${playerName}`);
  };

  const handleToggleOp = (playerName: string) => {
    const player = activeServer.players.find(p => p.name === playerName);
    if (player?.isOp) {
      handleSendCommand(`/deop ${playerName}`);
    } else {
      handleSendCommand(`/op ${playerName}`);
    }
  };

  const handleAddPlayer = (playerName: string) => {
    const newP = {
      uuid: `uuid-${Date.now().toString(36)}`,
      name: playerName,
      ping: Math.floor(Math.random() * 25) + 12,
      isOp: false,
      isBanned: false,
      joinedAt: 'Just now',
      gamemode: 'survival' as const,
    };
    updateActiveServer(s => ({
      ...s,
      players: [...s.players, newP],
      consoleLogs: [
        ...s.consoleLogs,
        {
          id: Date.now().toString(),
          timestamp: new Date().toLocaleTimeString(),
          level: 'INFO',
          text: `${playerName}[/${s.domain}:52140] logged in with entity id ${Math.floor(Math.random() * 800) + 100} at ([world]0.5, 64.0, 0.5)`
        }
      ]
    }));
  };

  // Plugin toggles
  const handleTogglePluginInstall = (pluginId: string) => {
    updateActiveServer(s => {
      const plugin = s.plugins.find(p => p.id === pluginId);
      const isInstalling = !plugin?.installed;
      const timestamp = new Date().toLocaleTimeString();

      const log = {
        id: Date.now().toString(),
        timestamp,
        level: 'INFO' as const,
        text: isInstalling 
          ? `[Plugin Manager] Downloaded and installed ${plugin?.name} v${plugin?.version}`
          : `[Plugin Manager] Uninstalled ${plugin?.name}. Restart server to unload completely.`
      };

      return {
        ...s,
        plugins: s.plugins.map(p => p.id === pluginId ? { ...p, installed: !p.installed, enabled: !p.installed } : p),
        consoleLogs: [...s.consoleLogs, log]
      };
    });
  };

  const handleTogglePluginEnable = (pluginId: string) => {
    updateActiveServer(s => ({
      ...s,
      plugins: s.plugins.map(p => p.id === pluginId ? { ...p, enabled: !p.enabled } : p)
    }));
  };

  // Backups actions
  const handleCreateBackup = (backupName: string) => {
    const newBackup = {
      id: `b-${Date.now().toString(36)}`,
      name: backupName,
      size: `${(Math.random() * 0.8 + 1.1).toFixed(2)} GB`,
      createdAt: 'Just now',
      type: 'manual' as const,
    };
    updateActiveServer(s => ({
      ...s,
      backups: [newBackup, ...s.backups],
      consoleLogs: [
        ...s.consoleLogs,
        {
          id: Date.now().toString(),
          timestamp: new Date().toLocaleTimeString(),
          level: 'SUCCESS',
          text: `[Backup System] Created world snapshot: ${backupName} (Encrypted off-site storage)`
        }
      ]
    }));
  };

  const handleRestoreBackup = (backupId: string) => {
    const backup = activeServer.backups.find(b => b.id === backupId);
    handleUpdateStatus('starting');
    updateActiveServer(s => ({
      ...s,
      consoleLogs: [
        ...s.consoleLogs,
        {
          id: Date.now().toString(),
          timestamp: new Date().toLocaleTimeString(),
          level: 'WARN',
          text: `[Backup Restore] Restoring world state from ${backup?.name}...`
        }
      ]
    }));
  };

  const handleDeleteBackup = (backupId: string) => {
    updateActiveServer(s => ({
      ...s,
      backups: s.backups.filter(b => b.id !== backupId)
    }));
  };

  // Save server properties
  const handleSaveProperties = (newProps: ServerProperties) => {
    updateActiveServer(s => ({
      ...s,
      properties: newProps,
      consoleLogs: [
        ...s.consoleLogs,
        {
          id: Date.now().toString(),
          timestamp: new Date().toLocaleTimeString(),
          level: 'INFO',
          text: `[Config] server.properties updated via HyperSurge Web Panel`
        }
      ]
    }));
  };

  const tabs: { id: NavTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'overview', label: 'Overview', icon: <Server className="w-4 h-4" /> },
    { id: 'console', label: 'Console', icon: <Terminal className="w-4 h-4" /> },
    { id: 'network-ddos', label: 'Network & DDoS Shield', icon: <ShieldCheck className="w-4 h-4" />, badge: '3.8 Tbps' },
    { id: 'properties', label: 'Server Properties', icon: <Settings className="w-4 h-4" /> },
    { id: 'plugins', label: 'Plugins & Mods', icon: <Puzzle className="w-4 h-4" />, badge: `${activeServer.plugins.filter(p => p.installed).length}` },
    { id: 'players', label: 'Players', icon: <Users className="w-4 h-4" />, badge: `${activeServer.players.length}` },
    { id: 'backups', label: 'Backups', icon: <HardDrive className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Global Header */}
      <Header
        servers={servers}
        activeServer={activeServer}
        onSelectServer={(srv) => setActiveServerId(srv.id)}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onOpenDDoSCenter={() => setActiveTab('network-ddos')}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-800 text-xs sm:text-sm font-medium">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-xl transition-all border-b-2 shrink-0 ${
                activeTab === tab.id
                  ? 'bg-slate-900/80 text-emerald-400 border-emerald-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900/40'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                  activeTab === tab.id
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content Display */}
        {activeTab === 'overview' && (
          <ServerOverview
            server={activeServer}
            onUpdateStatus={handleUpdateStatus}
            onTriggerDDoSTest={() => setActiveTab('network-ddos')}
            onOpenConsole={() => setActiveTab('console')}
            onOpenPlayers={() => setActiveTab('players')}
            onUpdateServer={(updates) => updateActiveServer(s => ({ ...s, ...updates }))}
            onOpenPlugins={() => setActiveTab('plugins')}
          />
        )}

        {activeTab === 'console' && (
          <ServerConsole
            server={activeServer}
            onSendCommand={handleSendCommand}
            onClearLogs={() => updateActiveServer(s => ({ ...s, consoleLogs: [] }))}
          />
        )}

        {activeTab === 'network-ddos' && (
          <NetworkDDoSCenter
            server={activeServer}
            onSimulateAttack={handleSimulateAttack}
            onSwitchRegion={(newRegion) => {
              updateActiveServer(s => ({
                ...s,
                region: newRegion,
                telemetry: {
                  ...s.telemetry,
                  pingMs: newRegion.basePing
                },
                ddos: {
                  ...s.ddos,
                  capacity: newRegion.mitigationCapacity,
                  provider: newRegion.scrubCenter
                },
                consoleLogs: [
                  ...s.consoleLogs,
                  {
                    id: Date.now().toString(),
                    timestamp: new Date().toLocaleTimeString(),
                    level: 'INFO',
                    text: `[Network Router] Migrated game traffic to ${newRegion.name} (${newRegion.city} ${newRegion.flag}) with ${newRegion.mitigationCapacity} scrubbing capacity.`
                  }
                ]
              }));
            }}
          />
        )}

        {activeTab === 'properties' && (
          <ServerPropertiesTab
            server={activeServer}
            onSaveProperties={handleSaveProperties}
          />
        )}

        {activeTab === 'plugins' && (
          <PluginsManager
            server={activeServer}
            onTogglePluginInstall={handleTogglePluginInstall}
            onTogglePluginEnable={handleTogglePluginEnable}
          />
        )}

        {activeTab === 'players' && (
          <PlayerManager
            server={activeServer}
            onKickPlayer={handleKickPlayer}
            onBanPlayer={handleBanPlayer}
            onToggleOp={handleToggleOp}
            onAddPlayer={handleAddPlayer}
          />
        )}

        {activeTab === 'backups' && (
          <BackupsManager
            server={activeServer}
            onCreateBackup={handleCreateBackup}
            onRestoreBackup={handleRestoreBackup}
            onDeleteBackup={handleDeleteBackup}
          />
        )}
      </main>

      {/* Footer Banner with SLA assurance */}
      <footer className="border-t border-slate-800/80 bg-slate-900/60 mt-12 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-200">HyperSurge Cloud Minecraft Engine</span>
            <span>&bull;</span>
            <span>99.99% Uptime Guarantee</span>
            <span>&bull;</span>
            <span>Path.net Enterprise Layer 3/4/7 Scrubbing</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Vanilla, Paper, Purpur, Fabric, Forge &amp; Bedrock</span>
            <span>NVMe Gen4 Storage</span>
          </div>
        </div>
      </footer>

      {/* Create Server Modal Wizard */}
      <ServerCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onServerCreated={(newServer) => {
          setServers(prev => [newServer, ...prev]);
          setActiveServerId(newServer.id);
          setActiveTab('overview');
        }}
      />
    </div>
  );
}
