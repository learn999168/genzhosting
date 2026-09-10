import React, { useState, useMemo } from 'react';
import { Search, Check, Sparkles, Filter, Layers, HelpCircle } from 'lucide-react';
import { 
  ALL_MINECRAFT_VERSIONS, 
  MINECRAFT_ERAS, 
  POPULAR_VERSION_SHORTCUTS, 
  MinecraftVersionInfo 
} from '../data/minecraftVersions';

interface VersionSelectorProps {
  selectedVersion: string;
  onSelectVersion: (version: string) => void;
  compact?: boolean;
}

export const VersionSelector: React.FC<VersionSelectorProps> = ({
  selectedVersion,
  onSelectVersion,
  compact = false,
}) => {
  const [search, setSearch] = useState('');
  const [selectedEra, setSelectedEra] = useState<string>('All');
  const [customVersion, setCustomVersion] = useState('');

  const filteredVersions = useMemo(() => {
    return ALL_MINECRAFT_VERSIONS.filter((v) => {
      const matchesSearch = v.version.toLowerCase().includes(search.toLowerCase()) ||
                            (v.name && v.name.toLowerCase().includes(search.toLowerCase())) ||
                            (v.tag && v.tag.toLowerCase().includes(search.toLowerCase()));
      const matchesEra = selectedEra === 'All' || v.era === selectedEra;
      return matchesSearch && matchesEra;
    });
  }, [search, selectedEra]);

  const handleCustomApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (customVersion.trim()) {
      onSelectVersion(customVersion.trim());
      setCustomVersion('');
    }
  };

  return (
    <div className="space-y-3">
      {/* Popular Quick-Select Badges */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Popular Versions
          </span>
          <span className="text-[10px] text-slate-500">
            {ALL_MINECRAFT_VERSIONS.length} official releases available
          </span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {POPULAR_VERSION_SHORTCUTS.map((ver) => {
            const isSelected = selectedVersion === ver;
            return (
              <button
                key={ver}
                type="button"
                onClick={() => onSelectVersion(ver)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all shrink-0 ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-400 shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                }`}
              >
                {ver}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search & Era Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <div className="relative flex-1 w-full">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search all versions (e.g. 1.21.4, 1.16.5, 1.8.9)..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <select
          value={selectedEra}
          onChange={(e) => setSelectedEra(e.target.value)}
          aria-label="Filter Minecraft Era"
          className="w-full sm:w-auto px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-medium"
        >
          {MINECRAFT_ERAS.map((era) => (
            <option key={era} value={era} className="bg-slate-900 text-white">
              {era}
            </option>
          ))}
        </select>
      </div>

      {/* Scrollable Version Grid */}
      <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 overflow-y-auto pr-1 ${compact ? 'max-h-48' : 'max-h-60'}`}>
        {filteredVersions.length === 0 ? (
          <div className="col-span-full py-6 text-center text-xs text-slate-500">
            No version matched &quot;{search}&quot;. You can type a custom version below.
          </div>
        ) : (
          filteredVersions.map((v) => {
            const isSelected = selectedVersion === v.version;
            return (
              <button
                key={v.version}
                type="button"
                onClick={() => onSelectVersion(v.version)}
                className={`p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-500/20 border-emerald-500 text-white ring-1 ring-emerald-500/40 shadow-sm'
                    : 'bg-slate-800/50 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-mono font-bold text-xs text-white">
                    {v.version}
                  </span>
                  {isSelected ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                  ) : v.recommended ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Recommended Release" />
                  ) : null}
                </div>

                <div className="text-[10px] text-slate-400 truncate w-full" title={v.name || v.era}>
                  {v.tag ? (
                    <span className={`px-1 py-0.2 rounded font-semibold ${
                      isSelected ? 'bg-emerald-400/30 text-emerald-200' : 'bg-slate-700/60 text-slate-300'
                    }`}>
                      {v.tag}
                    </span>
                  ) : (
                    v.releaseYear
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Custom Version Form */}
      <form onSubmit={handleCustomApply} className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
        <span className="text-[11px] text-slate-400 shrink-0">Custom or Snapshot:</span>
        <input
          type="text"
          value={customVersion}
          onChange={(e) => setCustomVersion(e.target.value)}
          placeholder="e.g. 1.21.5, 24w45a, b1.8..."
          className="flex-1 px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
        />
        <button
          type="submit"
          disabled={!customVersion.trim()}
          className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors disabled:opacity-50"
        >
          Set
        </button>
      </form>
    </div>
  );
};
