import React, { useState } from 'react';
import { 
  Users, 
  Shield, 
  ShieldAlert, 
  UserMinus, 
  Ban, 
  Plus, 
  Crown, 
  Wifi,
  Sparkles,
  Gamepad2,
  Check
} from 'lucide-react';
import { MinecraftServer, Player } from '../types';

interface PlayerManagerProps {
  server: MinecraftServer;
  onKickPlayer: (playerName: string) => void;
  onBanPlayer: (playerName: string) => void;
  onToggleOp: (playerName: string) => void;
  onAddPlayer: (playerName: string) => void;
}

export const PlayerManager: React.FC<PlayerManagerProps> = ({
  server,
  onKickPlayer,
  onBanPlayer,
  onToggleOp,
  onAddPlayer,
}) => {
  const [newPlayerName, setNewPlayerName] = useState('');
  const [tab, setTab] = useState<'online' | 'whitelist' | 'banned'>('online');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayerName.trim()) return;
    onAddPlayer(newPlayerName.trim());
    setNewPlayerName('');
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">Player &amp; Whitelist Management</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {server.players.length} / {server.properties['max-players']} Online
              </span>
            </div>
            <p className="text-xs text-slate-400">Manage connected users, assign OP privileges, and moderate griefers</p>
          </div>
        </div>

        {/* Add player form */}
        <form onSubmit={handleAdd} className="flex items-center gap-2">
          <input
            type="text"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            placeholder="Minecraft Username..."
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={!newPlayerName.trim()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors disabled:opacity-50"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Add Player</span>
          </button>
        </form>
      </div>

      {/* Online Players Grid */}
      {server.players.length === 0 ? (
        <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center space-y-2">
          <Users className="w-8 h-8 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-300">No Players Currently Connected</h3>
          <p className="text-xs text-slate-500">
            Connect to <strong className="text-emerald-400">{server.domain}:{server.port}</strong> in Minecraft to join!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {server.players.map((player) => (
            <div
              key={player.uuid}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <img
                  src={`https://mc-heads.net/avatar/${player.name}/48`}
                  alt={player.name}
                  className="w-10 h-10 rounded-lg bg-slate-800 ring-1 ring-slate-700"
                  onError={(e) => {
                    // fallback if avatar host fails
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{player.name}</span>
                    {player.isOp && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                        <Crown className="w-3 h-3" />
                        OP
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                    <span className="capitalize text-emerald-400 font-mono">{player.gamemode}</span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1 text-slate-400 font-mono">
                      <Wifi className="w-3 h-3 text-emerald-400" />
                      {player.ping}ms
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onToggleOp(player.name)}
                  className={`p-2 rounded-xl text-xs transition-colors ${
                    player.isOp 
                      ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30' 
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                  title={player.isOp ? "Revoke OP rights (/deop)" : "Grant OP rights (/op)"}
                >
                  <Crown className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onKickPlayer(player.name)}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-amber-300 hover:bg-amber-500/20 text-xs transition-colors"
                  title="Kick player (/kick)"
                >
                  <UserMinus className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onBanPlayer(player.name)}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-red-500/20 text-xs transition-colors"
                  title="Ban player (/ban)"
                >
                  <Ban className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
