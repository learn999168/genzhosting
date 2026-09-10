import React, { useState } from 'react';
import { 
  HardDrive, 
  Plus, 
  RotateCw, 
  Download, 
  Trash2, 
  Check, 
  Clock, 
  FileArchive,
  ShieldCheck
} from 'lucide-react';
import { MinecraftServer, ServerBackup } from '../types';

interface BackupsManagerProps {
  server: MinecraftServer;
  onCreateBackup: (name: string) => void;
  onRestoreBackup: (backupId: string) => void;
  onDeleteBackup: (backupId: string) => void;
}

export const BackupsManager: React.FC<BackupsManagerProps> = ({
  server,
  onCreateBackup,
  onRestoreBackup,
  onDeleteBackup,
}) => {
  const [creating, setCreating] = useState(false);
  const [restoringId, setRestoringId] = useState<string | null>(null);

  const handleCreate = () => {
    setCreating(true);
    setTimeout(() => {
      const backupName = `world-snapshot-${new Date().toISOString().split('T')[0]}-${Date.now().toString(36).slice(-4)}.tar.gz`;
      onCreateBackup(backupName);
      setCreating(false);
    }, 1200);
  };

  const handleRestore = (id: string) => {
    setRestoringId(id);
    setTimeout(() => {
      onRestoreBackup(id);
      setRestoringId(null);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <HardDrive className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">World Backups &amp; Snapshots</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Off-site Cloud Stored
              </span>
            </div>
            <p className="text-xs text-slate-400">Automated daily NVMe snapshots with one-click instant recovery</p>
          </div>
        </div>

        <button
          id="create-instant-backup-btn"
          onClick={handleCreate}
          disabled={creating}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
        >
          {creating ? (
            <>
              <RotateCw className="w-4 h-4 animate-spin" />
              <span>Packaging World Snapshot...</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Create Instant Backup</span>
            </>
          )}
        </button>
      </div>

      {/* Backups List */}
      <div className="space-y-3">
        {server.backups.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center space-y-2">
            <FileArchive className="w-8 h-8 text-slate-600 mx-auto" />
            <h3 className="text-sm font-bold text-slate-300">No Backups Created Yet</h3>
            <p className="text-xs text-slate-500">
              Click &quot;Create Instant Backup&quot; above to take a complete snapshot of your world, playerData, and plugins.
            </p>
          </div>
        ) : (
          server.backups.map((backup) => (
            <div
              key={backup.id}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400 shrink-0">
                  <FileArchive className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white font-mono">{backup.name}</span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold uppercase ${
                      backup.type === 'auto' 
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {backup.type === 'auto' ? 'Daily Auto' : 'Manual'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span>Size: <strong className="text-slate-200 font-mono">{backup.size}</strong></span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {backup.createdAt}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => handleRestore(backup.id)}
                  disabled={restoringId === backup.id}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  title="Restore this backup"
                >
                  {restoringId === backup.id ? (
                    <>
                      <RotateCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                      <span>Restoring...</span>
                    </>
                  ) : (
                    <>
                      <RotateCw className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Restore</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    alert(`Downloading ${backup.name} (${backup.size}) from off-site storage...`);
                  }}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                  title="Download Backup archive"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onDeleteBackup(backup.id)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 text-xs transition-colors"
                  title="Delete backup"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
