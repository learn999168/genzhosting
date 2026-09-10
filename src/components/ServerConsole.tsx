import React, { useState, useRef, useEffect } from 'react';
import { 
  Terminal as TerminalIcon, 
  Send, 
  Trash2, 
  Download, 
  ArrowDown, 
  Check, 
  CornerDownLeft, 
  HelpCircle,
  Play,
  RotateCw
} from 'lucide-react';
import { ConsoleLog, MinecraftServer } from '../types';

interface ServerConsoleProps {
  server: MinecraftServer;
  onSendCommand: (command: string) => void;
  onClearLogs: () => void;
}

const QUICK_COMMANDS = [
  { cmd: '/tps', desc: 'Check current tick rate' },
  { cmd: '/time set day', desc: 'Set time to morning' },
  { cmd: '/weather clear', desc: 'Clear rain and thunder' },
  { cmd: '/save-all', desc: 'Force world chunk save' },
  { cmd: '/say Welcome to the server!', desc: 'Broadcast server message' },
  { cmd: '/gamemode creative', desc: 'Switch game mode' },
  { cmd: '/help', desc: 'List all commands' },
];

export const ServerConsole: React.FC<ServerConsoleProps> = ({
  server,
  onSendCommand,
  onClearLogs,
}) => {
  const [inputCommand, setInputCommand] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [autoScroll, setAutoScroll] = useState(true);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll when new logs arrive
  useEffect(() => {
    if (autoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [server.consoleLogs, autoScroll]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputCommand.trim()) return;

    onSendCommand(inputCommand.trim());
    setHistory(prev => [...prev, inputCommand.trim()]);
    setHistoryIndex(-1);
    setInputCommand('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInputCommand(history[nextIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= history.length) {
        setHistoryIndex(-1);
        setInputCommand('');
      } else {
        setHistoryIndex(nextIndex);
        setInputCommand(history[nextIndex]);
      }
    }
  };

  const exportLogsAsText = () => {
    const textContent = server.consoleLogs
      .map(log => `[${log.timestamp}] [Server thread/${log.level}]: ${log.text}`)
      .join('\n');
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${server.name.replace(/\s+/g, '_')}_console_logs.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getLogStyle = (level: ConsoleLog['level']) => {
    switch (level) {
      case 'SUCCESS':
        return 'text-emerald-400';
      case 'WARN':
        return 'text-amber-400';
      case 'ERROR':
        return 'text-red-400 font-bold';
      case 'CHAT':
        return 'text-cyan-400';
      case 'INFO':
      default:
        return 'text-slate-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Console Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <TerminalIcon className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">Interactive Server Console</h2>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              STDIN / STDOUT &bull; {server.software.toUpperCase()} {server.version}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Auto Scroll Toggle */}
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              autoScroll 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            <ArrowDown className="w-3.5 h-3.5" />
            <span>Auto-Scroll {autoScroll ? 'ON' : 'OFF'}</span>
          </button>

          {/* Download Logs */}
          <button
            onClick={exportLogsAsText}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition-colors"
            title="Download Logs as TXT"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Clear Console */}
          <button
            id="clear-console-btn"
            onClick={onClearLogs}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition-colors"
            title="Clear Console Output"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Command Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-500 text-[11px] font-semibold uppercase px-1">Quick:</span>
        {QUICK_COMMANDS.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              onSendCommand(item.cmd);
              inputRef.current?.focus();
            }}
            className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 font-mono text-[11px] hover:border-emerald-500/40 hover:text-emerald-300 transition-all"
            title={item.desc}
          >
            {item.cmd}
          </button>
        ))}
      </div>

      {/* Console Display Screen */}
      <div className="relative rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl p-4 font-mono text-xs overflow-hidden">
        <div className="h-96 overflow-y-auto terminal-scroll space-y-1 pr-2">
          {server.consoleLogs.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-500 italic">
              Console output cleared. Send a command below to test.
            </div>
          ) : (
            server.consoleLogs.map((log) => (
              <div key={log.id} className="leading-relaxed break-words hover:bg-slate-900/40 px-1.5 py-0.5 rounded transition-colors">
                <span className="text-slate-500 font-normal select-none">[{log.timestamp}] </span>
                <span className="text-slate-400 font-medium select-none">
                  [{log.level === 'CHAT' ? 'Async Chat Thread' : 'Server thread'}/
                  <span className={log.level === 'ERROR' ? 'text-red-400' : log.level === 'WARN' ? 'text-amber-400' : 'text-slate-400'}>
                    {log.level}
                  </span>
                  ]:{' '}
                </span>
                <span className={getLogStyle(log.level)}>{log.text}</span>
              </div>
            ))
          )}
          <div ref={logsEndRef} />
        </div>

        {/* Command Prompt Form */}
        <form 
          onSubmit={handleSubmit}
          className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-2"
        >
          <div className="flex items-center text-emerald-400 font-bold select-none pl-1">
            <span>&gt;</span>
          </div>
          <input
            ref={inputRef}
            id="console-command-input"
            type="text"
            value={inputCommand}
            onChange={(e) => setInputCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={server.status === 'running' ? "Type a command (e.g., /op player, /gamemode, /tps) or message..." : "Server is offline. Start the server to send commands."}
            disabled={server.status !== 'running'}
            className="flex-1 bg-transparent text-white font-mono text-xs focus:outline-none placeholder:text-slate-600 disabled:opacity-50"
          />
          <button
            id="console-submit-btn"
            type="submit"
            disabled={!inputCommand.trim() || server.status !== 'running'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all disabled:opacity-40 disabled:hover:bg-emerald-500"
          >
            <span>Execute</span>
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
        <span>Press <kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px]">↑</kbd> and <kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px]">↓</kbd> to cycle through command history.</span>
        <span>Anti-Crash Command Guard active</span>
      </div>
    </div>
  );
};
