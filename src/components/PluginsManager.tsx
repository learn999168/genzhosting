import React, { useState } from 'react';
import { 
  Puzzle, 
  Search, 
  Download, 
  Trash2, 
  Check, 
  Sliders, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  Smartphone, 
  Coins, 
  Wrench, 
  History,
  Zap,
  Clock,
  Activity,
  Radio
} from 'lucide-react';
import { MinecraftServer, PluginItem } from '../types';

interface PluginsManagerProps {
  server: MinecraftServer;
  onTogglePluginInstall: (pluginId: string) => void;
  onTogglePluginEnable: (pluginId: string) => void;
}

export const PluginsManager: React.FC<PluginsManagerProps> = ({
  server,
  onTogglePluginInstall,
  onTogglePluginEnable,
}) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('All');

  const categories = ['All', '24/7 Uptime', 'Performance', 'Administration', 'Security', 'World', 'Crossplay', 'Economy'];

  const filteredPlugins = server.plugins.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || p.category === category;
    return matchesSearch && matchesCategory;
  });

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Clock': return <Clock className="w-5 h-5 text-emerald-400" />;
      case 'Activity': return <Activity className="w-5 h-5 text-emerald-400" />;
      case 'Wrench': return <Wrench className="w-5 h-5 text-emerald-400" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'Layers': return <Layers className="w-5 h-5 text-emerald-400" />;
      case 'Coins': return <Coins className="w-5 h-5 text-amber-400" />;
      case 'History': return <History className="w-5 h-5 text-cyan-400" />;
      case 'Zap': return <Zap className="w-5 h-5 text-yellow-400" />;
      case 'Smartphone': return <Smartphone className="w-5 h-5 text-purple-400" />;
      default: return <Puzzle className="w-5 h-5 text-emerald-400" />;
    }
  };

  const installedCount = server.plugins.filter(p => p.installed).length;

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Puzzle className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">Plugin &amp; Mod Repository</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {installedCount} Active
              </span>
            </div>
            <p className="text-xs text-slate-400">One-click install tested for Paper &amp; Purpur 20.0 TPS optimization</p>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search plugins (e.g., Geyser, LuckPerms)..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 ${
              category === cat
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm shadow-emerald-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 24/7 Uptime Highlight Card */}
      {(category === 'All' || category === '24/7 Uptime') && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-cyan-950/30 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Clock className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">24/7 Always-Online &amp; No-Sleep Daemon</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500 text-slate-950">
                  ACTIVE 24/7
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Keep your server running around the clock without idle shutdowns. Automated garbage collection, socket keep-alives, and instant 3-second crash recovery.
              </p>
            </div>
          </div>
          <button
            onClick={() => setCategory('24/7 Uptime')}
            className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold shrink-0 transition-colors"
          >
            View 24/7 Plugins &rarr;
          </button>
        </div>
      )}

      {/* Plugin Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPlugins.map((plugin) => (
          <div
            key={plugin.id}
            className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
              plugin.installed
                ? 'bg-slate-900/90 border-emerald-500/40 ring-1 ring-emerald-500/20'
                : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                    {getIcon(plugin.iconName)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white leading-tight">{plugin.name}</h3>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span>v{plugin.version}</span>
                      <span>&bull;</span>
                      <span>by {plugin.author}</span>
                    </div>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                  {plugin.category}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {plugin.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              {plugin.installed ? (
                <>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onTogglePluginEnable(plugin.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                        plugin.enabled
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${plugin.enabled ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                      <span>{plugin.enabled ? 'Enabled' : 'Disabled'}</span>
                    </button>
                    <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                      <Check className="w-3.5 h-3.5" /> Installed
                    </span>
                  </div>

                  <button
                    onClick={() => onTogglePluginInstall(plugin.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Uninstall Plugin"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => onTogglePluginInstall(plugin.id)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>1-Click Install</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
