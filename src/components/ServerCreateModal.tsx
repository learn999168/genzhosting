import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Sparkles, 
  Cpu, 
  HardDrive, 
  Wifi, 
  ShieldAlert, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  Server,
  Layers,
  Terminal,
  Zap,
  Image as ImageIcon,
  Clock
} from 'lucide-react';
import { DATACENTER_REGIONS, HARDWARE_TIERS, DEFAULT_PLUGINS } from '../data/serverPresets';
import { DatacenterRegion, HardwareTier, MinecraftServer, ServerEdition, ServerSoftware } from '../types';
import { VersionSelector } from './VersionSelector';
import { ServerLogoModal } from './ServerLogoModal';
import { PRESET_SERVER_LOGOS, DEFAULT_SERVER_LOGO } from '../data/serverLogos';

interface ServerCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onServerCreated: (newServer: MinecraftServer) => void;
}

export const ServerCreateModal: React.FC<ServerCreateModalProps> = ({
  isOpen,
  onClose,
  onServerCreated,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  
  // Form State
  const [serverName, setServerName] = useState('My Minecraft World');
  const [subdomain, setSubdomain] = useState('play-world');
  const [edition, setEdition] = useState<ServerEdition>('crossplay');
  const [software, setSoftware] = useState<ServerSoftware>('paper');
  const [version, setVersion] = useState('1.21.4');
  const [serverLogo, setServerLogo] = useState<string>(DEFAULT_SERVER_LOGO);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState<boolean>(false);
  const [install247Plugin, setInstall247Plugin] = useState<boolean>(true);
  const [selectedRegion, setSelectedRegion] = useState<DatacenterRegion>(DATACENTER_REGIONS[0]);
  const [selectedHardware, setSelectedHardware] = useState<HardwareTier>(HARDWARE_TIERS[2]); // 8GB Pro
  
  // Deploying simulation state
  const [deployLogs, setDeployLogs] = useState<string[]>([]);
  const [deployProgress, setDeployProgress] = useState(0);

  if (!isOpen) return null;

  const handleStartDeploy = () => {
    setStep(5);
    setDeployProgress(10);
    setDeployLogs(['[Deployer] Provisioning dedicated container on Ryzen 9 7950X cluster...']);

    setTimeout(() => {
      setDeployProgress(30);
      setDeployLogs(prev => [...prev, `[Storage] Allocating ${selectedHardware.diskGb} GB NVMe Gen4 Storage in ${selectedRegion.city}...`]);
    }, 600);

    setTimeout(() => {
      setDeployProgress(55);
      setDeployLogs(prev => [...prev, `[Network] Binding Anycast IP & ${selectedRegion.mitigationCapacity} Path.net DDoS Shield...`]);
    }, 1200);

    setTimeout(() => {
      setDeployProgress(75);
      setDeployLogs(prev => [...prev, `[Build] Downloading ${software.toUpperCase()} ${version} core and generating server.properties...`]);
    }, 1900);

    setTimeout(() => {
      setDeployProgress(90);
      setDeployLogs(prev => [...prev, `[EULA] Accepted Mojang EULA. Preparing clean world spawn chunks...`]);
    }, 2600);

    setTimeout(() => {
      setDeployProgress(100);
      setDeployLogs(prev => [...prev, `[Ready] Server online! Anycast DNS propagated to ${subdomain}.playmc.host:25565`]);

      const newServer: MinecraftServer = {
        id: `srv-${Date.now().toString(36)}`,
        name: serverName,
        edition,
        software,
        version,
        status: 'running',
        domain: `${subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '')}.playmc.host`,
        port: 25565,
        bedrockPort: edition === 'crossplay' || edition === 'bedrock' ? 19132 : undefined,
        logoUrl: serverLogo,
        region: selectedRegion,
        hardware: selectedHardware,
        uptimePercentage: 100.0,
        autoRestartEnabled: true,
        alwaysOnline247: install247Plugin,
        createdAt: new Date().toISOString().split('T')[0],
        ddos: {
          provider: 'Path.net Anycast Enterprise',
          capacity: selectedRegion.mitigationCapacity,
          status: 'protected',
          attacksBlockedTotal: 0,
          currentInboundGbps: 0.01,
          filteredTrafficPercent: 100,
          activeFilterProtocol: 'Layer 3/4 + Layer 7 Game-Packet Inspector',
        },
        telemetry: {
          tps: 20.0,
          cpuPercent: 12.0,
          ramUsedMb: Math.round(selectedHardware.ramGb * 1024 * 0.35),
          ramTotalMb: selectedHardware.ramGb * 1024,
          diskUsedGb: 3.2,
          diskTotalGb: selectedHardware.diskGb,
          uptimeSeconds: 15,
          pingMs: selectedRegion.basePing,
          networkInMbps: 1.2,
          networkOutMbps: 2.4,
        },
        properties: {
          motd: `§a§l${serverName} §7- §b[${version}] §eWelcome!`,
          'max-players': parseInt(selectedHardware.recommendedPlayers.split('-')[1]?.replace(/\D/g, '') || '50'),
          difficulty: 'normal',
          gamemode: 'survival',
          pvp: true,
          'online-mode': true,
          'white-list': false,
          'view-distance': 12,
          'simulation-distance': 8,
          'spawn-protection': 16,
          'allow-nether': true,
          'enable-command-block': true,
          hardcore: false,
          'allow-flight': false,
          'level-seed': Math.floor(Math.random() * 9000000000000).toString(),
        },
        players: [],
        plugins: DEFAULT_PLUGINS.map(p => ({ 
          ...p, 
          installed: p.category === '24/7 Uptime' ? install247Plugin : p.installed,
          enabled: p.category === '24/7 Uptime' ? install247Plugin : p.enabled
        })),
        consoleLogs: [
          { id: '1', timestamp: new Date().toLocaleTimeString(), level: 'INFO', text: `Starting minecraft server version ${version} (${software})` },
          { id: '2', timestamp: new Date().toLocaleTimeString(), level: 'SUCCESS', text: `[Path.net DDoS Shield] Active (${selectedRegion.mitigationCapacity}) with 0ms overhead` },
          { id: '3', timestamp: new Date().toLocaleTimeString(), level: 'INFO', text: 'Preparing spawn area: 100%' },
          { id: '4', timestamp: new Date().toLocaleTimeString(), level: 'SUCCESS', text: 'Done! For help, type "help"' }
        ],
        backups: [],
      };

      setTimeout(() => {
        onServerCreated(newServer);
        onClose();
        setStep(1);
        setDeployLogs([]);
      }, 1200);
    }, 3200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Create Minecraft Server</h2>
              <p className="text-xs text-slate-400">High-uptime Anycast network with enterprise DDoS protection</p>
            </div>
          </div>
          {step !== 5 && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Step Indicator (when not deploying) */}
        {step !== 5 && (
          <div className="px-6 pt-4 pb-2 flex items-center justify-between border-b border-slate-800/60 bg-slate-900/40 text-xs">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800'}`}>1</span>
              <span>Identity</span>
            </div>
            <div className="w-8 h-px bg-slate-800" />
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800'}`}>2</span>
              <span>Software</span>
            </div>
            <div className="w-8 h-px bg-slate-800" />
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800'}`}>3</span>
              <span>Datacenter</span>
            </div>
            <div className="w-8 h-px bg-slate-800" />
            <div className={`flex items-center gap-2 ${step >= 4 ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 4 ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800'}`}>4</span>
              <span>Hardware</span>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6">
          {/* STEP 1: Identity & Edition */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Server Name
                </label>
                <input
                  type="text"
                  value={serverName}
                  onChange={(e) => setServerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  placeholder="e.g. My Survival SMP"
                />
              </div>

              {/* Server Logo Selection */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Server Logo &amp; Icon (server-icon.png)
                  </label>
                  <span className="text-[10px] text-emerald-400 font-mono">64x64 Standard</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={serverLogo}
                      alt="Server Logo"
                      className="w-14 h-14 rounded-lg bg-slate-900 border border-slate-600 shrink-0 [image-rendering:pixelated] object-cover shadow-md"
                    />
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>Multiplayer List Icon</span>
                        <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold">
                          Active
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Shown to players next to your server name in the Minecraft client.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Quick Preset avatars */}
                    <div className="flex items-center gap-1">
                      {PRESET_SERVER_LOGOS.slice(0, 4).map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setServerLogo(p.dataUrl)}
                          className={`p-1 rounded-lg border transition-all ${
                            serverLogo === p.dataUrl
                              ? 'border-emerald-500 bg-emerald-500/20'
                              : 'border-slate-700 hover:border-slate-500 bg-slate-900'
                          }`}
                          title={p.name}
                        >
                          <img src={p.dataUrl} alt={p.name} className="w-6 h-6 [image-rendering:pixelated]" />
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsLogoModalOpen(true)}
                      className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Custom / Upload</span>
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Free Custom Subdomain
                </label>
                <div className="flex items-center rounded-xl bg-slate-800/80 border border-slate-700 overflow-hidden focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
                  <input
                    type="text"
                    value={subdomain}
                    onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    className="flex-1 px-3.5 py-2.5 bg-transparent text-white text-sm font-mono focus:outline-none"
                    placeholder="my-server"
                  />
                  <span className="px-3 py-2.5 text-xs text-slate-400 bg-slate-950/40 border-l border-slate-700 font-mono">
                    .playmc.host:25565
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Connect instantly from Minecraft without typing cumbersome numerical IP addresses.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Target Edition
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'crossplay' as ServerEdition,
                      title: 'Cross-Play (Recommended)',
                      desc: 'Java & Bedrock (PC, Mobile, Console) play together smoothly.',
                      badge: 'Most Popular',
                    },
                    {
                      id: 'java' as ServerEdition,
                      title: 'Java Edition Only',
                      desc: 'Optimized for PC players, custom mods, and competitive PvP.',
                      badge: 'Standard',
                    },
                    {
                      id: 'bedrock' as ServerEdition,
                      title: 'Bedrock Dedicated',
                      desc: 'Native Bedrock for Windows 10/11, Xbox, PlayStation, Switch & iOS/Android.',
                      badge: 'Mobile/Console',
                    },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setEdition(item.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        edition === item.id
                          ? 'bg-emerald-500/10 border-emerald-500/60 ring-1 ring-emerald-500/30'
                          : 'bg-slate-800/40 border-slate-700 hover:bg-slate-800/80 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white">{item.title}</span>
                        {edition === item.id && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Software & Engine */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Server Software / Core
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      id: 'paper' as ServerSoftware,
                      name: 'PaperMC',
                      tag: 'High Performance & Plugins',
                      desc: 'Industry standard for 20.0 TPS, low CPU lag, and huge plugin support.',
                      recommended: true,
                    },
                    {
                      id: 'purpur' as ServerSoftware,
                      name: 'Purpur',
                      tag: 'Extreme Optimization',
                      desc: 'Fork of Paper with extra performance tweaks and gameplay customizability.',
                    },
                    {
                      id: 'fabric' as ServerSoftware,
                      name: 'Fabric',
                      tag: 'Lightweight Modding',
                      desc: 'Ideal for tech mods, performance mods (Lithium, FerriteCore), and fast loading.',
                    },
                    {
                      id: 'forge' as ServerSoftware,
                      name: 'Forge / NeoForge',
                      tag: 'Heavy Modpacks',
                      desc: 'Supports large complex modpacks (Create, All The Mods, Pixelmon).',
                    },
                    {
                      id: 'vanilla' as ServerSoftware,
                      name: 'Vanilla',
                      tag: 'Pure Official Mojang',
                      desc: 'Official unaltered Mojang server jar without modifications.',
                    },
                    {
                      id: 'bedrock' as ServerSoftware,
                      name: 'Bedrock Dedicated (BDS)',
                      tag: 'Native Bedrock Engine',
                      desc: 'Official Mojang Bedrock server software with full add-on support.',
                    },
                  ].map((soft) => (
                    <button
                      key={soft.id}
                      type="button"
                      onClick={() => setSoftware(soft.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        software === soft.id
                          ? 'bg-emerald-500/10 border-emerald-500/60 ring-1 ring-emerald-500/30'
                          : 'bg-slate-800/40 border-slate-700 hover:bg-slate-800/80 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{soft.name}</span>
                          {soft.recommended && (
                            <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold rounded">
                              Recommended
                            </span>
                          )}
                        </div>
                        {software === soft.id && <Check className="w-4 h-4 text-emerald-400" />}
                      </div>
                      <span className="text-[11px] font-mono text-emerald-400 block mb-1">{soft.tag}</span>
                      <p className="text-xs text-slate-400">{soft.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* All Minecraft Versions Chooser */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Minecraft Version Selection
                  </label>
                  <span className="text-emerald-400 font-mono text-xs font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Selected: {version}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/80">
                  <VersionSelector selectedVersion={version} onSelectVersion={setVersion} compact />
                </div>
              </div>

              {/* 24/7 Always-Online Plug-in Option */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">Pre-install 24/7 Always-Online Plugin</span>
                      <span className="px-1.5 py-0.2 rounded bg-emerald-500 text-slate-950 text-[10px] font-extrabold">
                        RECOMMENDED
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={install247Plugin}
                        onChange={(e) => setInstall247Plugin(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1">
                    Prevents server hibernation when 0 players are logged in. Keeps mob farms loaded, handles automatic 3-second crash recovery, and answers client pings around the clock.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Datacenter Location & Anycast DDoS */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-semibold text-emerald-300">All locations backed by Path.net 3.2+ Tbps Anycast Anti-DDoS</p>
                  <p className="text-slate-300 mt-0.5">
                    Our scrubbers absorb Layer 3/4 SYN, UDP floods and Layer 7 Minecraft bot attacks with 0ms added latency.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                {DATACENTER_REGIONS.map((region) => (
                  <button
                    key={region.id}
                    type="button"
                    onClick={() => setSelectedRegion(region)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      selectedRegion.id === region.id
                        ? 'bg-emerald-500/10 border-emerald-500/60 ring-1 ring-emerald-500/30'
                        : 'bg-slate-800/40 border-slate-700 hover:bg-slate-800/80 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{region.flag}</span>
                        <div>
                          <div className="text-sm font-bold text-white leading-tight flex items-center gap-1.5">
                            <span>{region.name}</span>
                            {region.id === 'kh-pnh' && (
                              <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                                Direct CNX
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400">{region.city}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono font-semibold text-emerald-400">{region.basePing}ms</span>
                        <div className="text-[10px] text-slate-500">estimated</div>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Mitigation: <strong className="text-slate-200">{region.mitigationCapacity}</strong></span>
                      <span className="text-emerald-400/90 font-medium">99.99% SLA</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Hardware & RAM Allocation */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {HARDWARE_TIERS.map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setSelectedHardware(tier)}
                    className={`p-4 rounded-xl border text-left relative transition-all ${
                      selectedHardware.id === tier.id
                        ? 'bg-emerald-500/10 border-emerald-500/60 ring-1 ring-emerald-500/30'
                        : 'bg-slate-800/40 border-slate-700 hover:bg-slate-800/80 hover:border-slate-600'
                    } ${tier.highlight ? 'sm:col-span-2' : ''}`}
                  >
                    {tier.highlight && (
                      <span className="absolute top-3 right-3 px-2 py-0.5 bg-emerald-500 text-slate-950 text-[10px] font-extrabold uppercase rounded tracking-wider">
                        Most Popular For SMP
                      </span>
                    )}
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-base font-bold text-white">{tier.name}</div>
                      <div className="text-right">
                        <span className="text-base font-extrabold text-emerald-400">${tier.priceMonthly}</span>
                        <span className="text-xs text-slate-400">/mo</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 py-2 text-xs border-y border-slate-700/60 my-2">
                      <div>
                        <span className="text-slate-400 text-[10px] block">DDR5 RAM</span>
                        <span className="font-bold text-white font-mono">{tier.ramGb} GB</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">CPU</span>
                        <span className="font-bold text-white font-mono">{tier.cpuCores} vCPU</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">NVMe Gen4</span>
                        <span className="font-bold text-white font-mono">{tier.diskGb} GB</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>{tier.cpuModel}</span>
                      <span className="text-emerald-400 font-medium">{tier.recommendedPlayers}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: Deployment Progress Sequence */}
          {step === 5 && (
            <div className="py-6 space-y-6">
              <div className="text-center space-y-2">
                <div className="inline-flex p-3 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 animate-bounce">
                  <Zap className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white">Deploying Your Minecraft Server</h3>
                <p className="text-xs text-slate-400">Configuring hardware isolation, Anycast routing and Anti-DDoS filter...</p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">Deployment Progress</span>
                  <span className="text-emerald-400 font-bold">{deployProgress}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                    style={{ width: `${deployProgress}%` }}
                  />
                </div>
              </div>

              {/* Terminal Logs */}
              <div className="rounded-xl bg-slate-950 border border-slate-800 p-3 font-mono text-xs text-slate-300 h-40 overflow-y-auto terminal-scroll space-y-1">
                {deployLogs.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-500">&gt;</span>
                    <span className="text-slate-200">{log}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        {step !== 5 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/40">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((step - 1) as any)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep((step + 1) as any)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStartDeploy}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold transition-all shadow-lg shadow-emerald-500/30 active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Deploy Server Now</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Server Logo Modal */}
      <ServerLogoModal
        isOpen={isLogoModalOpen}
        currentLogoUrl={serverLogo}
        serverName={serverName}
        onClose={() => setIsLogoModalOpen(false)}
        onSelectLogo={(logo) => setServerLogo(logo)}
      />
    </div>
  );
};
