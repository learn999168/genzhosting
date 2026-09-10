import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Zap, 
  Wifi, 
  Globe, 
  Activity, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  Radio, 
  Play, 
  RotateCw,
  Server,
  Lock,
  Flame
} from 'lucide-react';
import { DATACENTER_REGIONS } from '../data/serverPresets';
import { MinecraftServer, DatacenterRegion } from '../types';

interface NetworkDDoSCenterProps {
  server: MinecraftServer;
  onSimulateAttack: (type: 'udp' | 'syn' | 'bot') => void;
  onSwitchRegion?: (region: DatacenterRegion) => void;
}

export const NetworkDDoSCenter: React.FC<NetworkDDoSCenterProps> = ({
  server,
  onSimulateAttack,
  onSwitchRegion,
}) => {
  const [activeSimulation, setActiveSimulation] = useState<string | null>(null);
  const [simStep, setSimStep] = useState(0);
  const [simPeakGbps, setSimPeakGbps] = useState(0);
  const [simFilteredRate, setSimFilteredRate] = useState(100);
  const [pings, setPings] = useState<Record<string, number>>({});
  const [testingPing, setTestingPing] = useState(false);

  // Initialize simulated live pings with subtle variation
  useEffect(() => {
    const initial: Record<string, number> = {};
    DATACENTER_REGIONS.forEach(r => {
      initial[r.id] = r.basePing;
    });
    setPings(initial);
  }, []);

  const runLatencyTest = () => {
    setTestingPing(true);
    setTimeout(() => {
      const updated: Record<string, number> = {};
      DATACENTER_REGIONS.forEach(r => {
        // slight natural jitter +/- 2ms
        updated[r.id] = Math.max(5, r.basePing + Math.floor((Math.random() - 0.5) * 4));
      });
      setPings(updated);
      setTestingPing(false);
    }, 800);
  };

  const handleTriggerSim = (type: 'udp' | 'syn' | 'bot') => {
    setActiveSimulation(type);
    setSimStep(1);
    const peak = type === 'udp' ? 450 : type === 'syn' ? 120 : 25;
    setSimPeakGbps(peak);

    onSimulateAttack(type);

    setTimeout(() => setSimStep(2), 600); // scrub active
    setTimeout(() => setSimStep(3), 1500); // 100% filtered
    setTimeout(() => {
      setSimStep(4);
      setTimeout(() => setActiveSimulation(null), 2500);
    }, 2800);
  };

  return (
    <div className="space-y-6">
      {/* Hero Header for DDoS & Network */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/30 border border-emerald-500/30 p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase bg-emerald-500 text-slate-950">
                ENTERPRISE ANYCAST SHIELD
              </span>
              <span className="text-xs font-mono text-emerald-400 font-semibold">
                3.8 Tbps Active Capacity
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Unbreakable Uptime &amp; Lag-Free DDoS Defense
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Every Minecraft server deployed on HyperSurge is routed across an Anycast BGP network with direct 
              Path.net and Corero scrubbing filters. Attack traffic is scrubbed at the global edge before it ever 
              reaches your game port, maintaining a constant <strong>20.0 TPS</strong>.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-emerald-500/40 rounded-2xl p-4 shrink-0 space-y-2 min-w-[240px]">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Filter Status:</span>
              <span className="text-emerald-400 font-bold uppercase flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Active Protection
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Uptime SLA:</span>
              <span className="text-white font-mono font-bold">99.99% Guaranteed</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>BGP Anycast Routing:</span>
              <span className="text-white font-mono font-bold">8 Worldwide POPs</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>In-game Packet Overhead:</span>
              <span className="text-emerald-400 font-mono font-bold">&lt; 0.1 ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive DDoS Attack Mitigation Sandbox */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">Live DDoS Attack Mitigation Sandbox</h3>
            </div>
            <p className="text-xs text-slate-400">
              Test your server's resilience in real-time. Trigger synthetic attack vectors to see how the Anycast filter responds.
            </p>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 self-start sm:self-auto">
            Safe Sandbox Mode
          </span>
        </div>

        {/* Attack Vector Triggers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            id="sim-udp-flood-btn"
            onClick={() => handleTriggerSim('udp')}
            disabled={activeSimulation !== null}
            className="p-3.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 text-left transition-all hover:border-amber-500/50 disabled:opacity-50"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-white">450 Gbps UDP Flood</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-[11px] text-slate-400">NTP &amp; DNS amplification targeting Minecraft UDP/TCP port.</p>
          </button>

          <button
            id="sim-syn-flood-btn"
            onClick={() => handleTriggerSim('syn')}
            disabled={activeSimulation !== null}
            className="p-3.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 text-left transition-all hover:border-red-500/50 disabled:opacity-50"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-white">120 Gbps SYN Flood</span>
              <Activity className="w-4 h-4 text-red-400" />
            </div>
            <p className="text-[11px] text-slate-400">TCP connection saturation attempt to exhaust server sockets.</p>
          </button>

          <button
            id="sim-bot-flood-btn"
            onClick={() => handleTriggerSim('bot')}
            disabled={activeSimulation !== null}
            className="p-3.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 text-left transition-all hover:border-emerald-500/50 disabled:opacity-50"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-white">2.5M Bot Handshakes/sec</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-[11px] text-slate-400">Layer 7 fake client handshake flood filtered by deep packet parser.</p>
          </button>
        </div>

        {/* Live Simulation Display Card */}
        {activeSimulation && (
          <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-2">
                <RotateCw className="w-4 h-4 animate-spin text-emerald-400" />
                Simulating: <span className="uppercase text-emerald-400">{activeSimulation} ATTACK</span>
              </span>
              <span className="font-mono font-bold text-emerald-400">
                {simStep === 1 ? 'Inbound Spike Detected' : simStep === 2 ? 'Scrubbing Center Engaged' : '100% Traffic Mitigated'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1 border-t border-slate-800">
              <div>
                <span className="text-slate-400 block text-[10px]">Peak Attack Rate</span>
                <span className="text-base font-bold font-mono text-red-400">{simPeakGbps} Gbps</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Scrubbing Response</span>
                <span className="text-base font-bold font-mono text-emerald-400">0.08 seconds</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Malicious Drops</span>
                <span className="text-base font-bold font-mono text-emerald-400">100.0%</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">In-Game TPS Impact</span>
                <span className="text-base font-bold font-mono text-emerald-400">0.0 TPS Drop (20.0 Stable)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cambodia Edge Network Feature Card */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/40 p-5 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-800 border border-emerald-500/40 flex items-center justify-center text-3xl shadow-inner shrink-0">
              🇰🇭
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold text-white">Cambodia High-Speed Edge Network (Phnom Penh)</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500 text-slate-950 tracking-wider">
                  CNX Direct Peering
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  Sub-15ms Latency
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                Directly connected to the <strong>Cambodia National Internet Exchange (CNX)</strong> with BGP peering 
                across <strong>Smart Axiata, Cellcard, Ezecom, Metfone, SINET &amp; Telecom Cambodia</strong>. 
                Protected by 2.5 Tbps inline Anycast DDoS mitigation with zero packet loss across Southeast Asia.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
                <span>📍 Tier-3 Ezecom Data Center, Phnom Penh</span>
                <span>⚡ 8-15ms Cambodia Ping</span>
                <span>🛡️ Layer 3/4/7 Minecraft Attack Scrubber</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-2 md:pt-0 border-t sm:border-t-0 border-slate-800">
            {server.region.id === 'kh-pnh' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Current Server Location
              </span>
            ) : (
              <button
                type="button"
                onClick={() => {
                  const cambodiaRegion = DATACENTER_REGIONS.find(r => r.id === 'kh-pnh');
                  if (cambodiaRegion && onSwitchRegion) {
                    onSwitchRegion(cambodiaRegion);
                  }
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
              >
                <span>Switch Server to Cambodia 🇰🇭</span>
              </button>
            )}
            <span className="text-[10px] text-slate-500">Live migration with 0 data loss</span>
          </div>
        </div>
      </div>

      {/* Global Anycast Low-Latency Ping Matrix */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Global Edge Network &amp; Datacenters</h3>
            </div>
            <p className="text-xs text-slate-400">
              Low-latency Anycast routing nodes connected via premium Tier-1 transit (Telia, Lumen, DE-CIX, CNX).
            </p>
          </div>

          <button
            id="test-latency-btn"
            onClick={runLatencyTest}
            disabled={testingPing}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors disabled:opacity-50"
          >
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <span>{testingPing ? 'Measuring Ping...' : 'Test Network Latency'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {DATACENTER_REGIONS.map((region) => {
            const currentPing = pings[region.id] || region.basePing;
            const isServerRegion = region.id === server.region.id;

            return (
              <div
                key={region.id}
                className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                  isServerRegion 
                    ? 'bg-emerald-500/10 border-emerald-500/50 ring-1 ring-emerald-500/30' 
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{region.flag}</span>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1">
                          <span>{region.city}</span>
                          {isServerRegion && (
                            <span className="text-[9px] uppercase px-1 rounded bg-emerald-500 text-slate-950 font-extrabold">
                              Active
                            </span>
                          )}
                          {region.id === 'kh-pnh' && !isServerRegion && (
                            <span className="text-[9px] uppercase px-1 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                              CNX
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400">{region.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-mono font-bold ${
                        currentPing < 30 ? 'text-emerald-400' : currentPing < 60 ? 'text-cyan-400' : 'text-amber-400'
                      }`}>
                        {currentPing}ms
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                    <span>Capacity: {region.mitigationCapacity}</span>
                    <span className="text-emerald-400">0% Loss</span>
                  </div>
                </div>

                {!isServerRegion && onSwitchRegion && (
                  <button
                    type="button"
                    onClick={() => onSwitchRegion(region)}
                    className="mt-3 w-full py-1 rounded-lg bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 text-[11px] font-semibold transition-all"
                  >
                    Migrate Server Here
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 99.99% Uptime Calendar Timeline */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>30-Day Network Uptime (99.99% SLA)</span>
            </h3>
            <p className="text-xs text-slate-400">Zero unplanned downtime or dropped connections recorded.</p>
          </div>
          <span className="text-xs font-bold font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
            100% OPERATIONAL
          </span>
        </div>

        {/* 30 Day blocks */}
        <div className="space-y-2">
          <div className="grid grid-cols-15 sm:grid-cols-30 gap-1 sm:gap-1.5">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="h-7 sm:h-8 rounded bg-emerald-500/80 hover:bg-emerald-400 transition-colors cursor-pointer group relative"
                title={`Day ${i + 1}: 100% Uptime (0 incidents)`}
              >
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block px-2 py-1 bg-slate-950 text-[10px] text-white rounded shadow-lg whitespace-nowrap z-20 border border-slate-700">
                  Day {30 - i} days ago: 100% (20.0 TPS)
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span>30 days ago</span>
            <span className="text-emerald-400 font-medium">99.99% Uptime guarantee backed by SLA credit</span>
            <span>Today</span>
          </div>
        </div>
      </div>
    </div>
  );
};
