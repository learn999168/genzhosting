import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Check, 
  Image as ImageIcon, 
  Sparkles, 
  RefreshCw, 
  Link as LinkIcon,
  HelpCircle
} from 'lucide-react';
import { PRESET_SERVER_LOGOS, DEFAULT_SERVER_LOGO, ServerLogoPreset } from '../data/serverLogos';

interface ServerLogoModalProps {
  isOpen: boolean;
  currentLogoUrl?: string;
  serverName: string;
  onClose: () => void;
  onSelectLogo: (logoUrl: string) => void;
}

export const ServerLogoModal: React.FC<ServerLogoModalProps> = ({
  isOpen,
  currentLogoUrl,
  serverName,
  onClose,
  onSelectLogo,
}) => {
  const [selectedLogo, setSelectedLogo] = useState<string>(currentLogoUrl || DEFAULT_SERVER_LOGO);
  const [customUrlInput, setCustomUrlInput] = useState<string>('');
  const [tab, setTab] = useState<'presets' | 'upload' | 'url'>('presets');
  const [dragOver, setDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (.png, .jpg, .svg, .webp)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        // Draw to 64x64 canvas to ensure true Minecraft standard resolution
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = 64;
          canvas.height = 64;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.imageSmoothingEnabled = false; // pixel-crisp
            ctx.drawImage(img, 0, 0, 64, 64);
            const optimizedDataUrl = canvas.toDataURL('image/png');
            setSelectedLogo(optimizedDataUrl);
          } else {
            setSelectedLogo(result);
          }
        };
        img.src = result;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleApply = () => {
    onSelectLogo(selectedLogo);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Custom Server Icon (server-icon.png)</h2>
              <p className="text-xs text-slate-400">Displayed in the Minecraft multiplayer server list (64x64 px)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Live In-Game Server List Preview */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Minecraft Multiplayer Client Preview</span>
              <span className="text-emerald-400 font-mono">64 x 64 pixels</span>
            </div>

            <div className="p-3 rounded-lg bg-black/80 border border-slate-800 flex items-center gap-3">
              <img
                src={selectedLogo}
                alt="Server Icon Preview"
                className="w-16 h-16 rounded-md bg-slate-900 border border-slate-700 shrink-0 object-cover [image-rendering:pixelated]"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm font-mono truncate">{serverName}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[11px] text-slate-400 font-mono">0/50</span>
                    {/* 5 Ping Bars */}
                    <div className="flex items-end gap-[1.5px] h-3">
                      <span className="w-1 h-1 bg-emerald-400 rounded-xs" />
                      <span className="w-1 h-1.5 bg-emerald-400 rounded-xs" />
                      <span className="w-1 h-2 bg-emerald-400 rounded-xs" />
                      <span className="w-1 h-2.5 bg-emerald-400 rounded-xs" />
                      <span className="w-1 h-3 bg-emerald-400 rounded-xs" />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-emerald-400 font-mono mt-0.5 truncate">
                  §a★ 24/7 Always-On Ultra SMP §7- §bNo Lag
                </p>
                <p className="text-[11px] text-slate-500 font-mono truncate">
                  §fCompatible with all Minecraft versions
                </p>
              </div>
            </div>
          </div>

          {/* Selector Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <button
              onClick={() => setTab('presets')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                tab === 'presets'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              Preset Icons ({PRESET_SERVER_LOGOS.length})
            </button>
            <button
              onClick={() => setTab('upload')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                tab === 'upload'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              Upload Custom Image
            </button>
            <button
              onClick={() => setTab('url')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                tab === 'url'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              Image URL
            </button>
          </div>

          {/* TAB 1: Presets Gallery */}
          {tab === 'presets' && (
            <div className="space-y-3">
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 max-h-56 overflow-y-auto pr-1">
                {PRESET_SERVER_LOGOS.map((preset) => {
                  const isSelected = selectedLogo === preset.dataUrl;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setSelectedLogo(preset.dataUrl)}
                      className={`relative p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all group ${
                        isSelected
                          ? 'bg-emerald-500/20 border-emerald-500 ring-2 ring-emerald-500/40'
                          : 'bg-slate-800/60 border-slate-700 hover:border-slate-500 hover:bg-slate-800'
                      }`}
                      title={preset.name}
                    >
                      <img
                        src={preset.dataUrl}
                        alt={preset.name}
                        className="w-10 h-10 rounded-lg [image-rendering:pixelated] group-hover:scale-105 transition-transform"
                      />
                      <span className="text-[10px] font-medium text-slate-300 truncate w-full text-center">
                        {preset.name}
                      </span>
                      {isSelected && (
                        <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-[10px] font-bold">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: Drag and drop upload */}
          {tab === 'upload' && (
            <div className="space-y-3">
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  dragOver
                    ? 'border-emerald-400 bg-emerald-500/10'
                    : 'border-slate-700 hover:border-slate-500 bg-slate-950/40 hover:bg-slate-950/70'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp, image/svg+xml"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                />
                <div className="w-12 h-12 rounded-2xl bg-slate-800 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">
                  Drag &amp; Drop or Browse Image
                </h4>
                <p className="text-xs text-slate-400">
                  Supports PNG, JPG, WebP, SVG. Automatically scaled to 64x64 standard server icon.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: Direct URL */}
          {tab === 'url' && (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-300">
                Direct Image Link (HTTPS)
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <LinkIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    placeholder="https://example.com/my-server-logo.png"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (customUrlInput.trim()) {
                      setSelectedLogo(customUrlInput.trim());
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
                >
                  Load
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/40">
          <button
            type="button"
            onClick={() => setSelectedLogo(DEFAULT_SERVER_LOGO)}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            Reset to Default
          </button>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              id="apply-server-logo-btn"
              onClick={handleApply}
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all active:scale-95"
            >
              Apply Server Logo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
