
import React, { useEffect, useRef } from 'react';
import { Attack, Theme } from '../types';
import Tooltip from './Tooltip';
import { Minus } from 'lucide-react';

interface AttackLogProps {
  logs: Attack[];
  theme: Theme;
  onToggle: () => void;
}

const AttackLog: React.FC<AttackLogProps> = ({ logs, theme, onToggle }) => {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    return (
        <div 
            className="absolute top-6 right-6 w-80 h-64 md:h-96 backdrop-blur-sm border rounded-xl flex flex-col z-10 transition-colors duration-500 animate-fade-in"
            style={{
                backgroundColor: theme.colors.panelBg,
                borderColor: theme.colors.panelBorder,
                color: theme.colors.textPrimary
            }}
        >
            <div 
                className="p-3 border-b flex justify-between items-center rounded-t-xl"
                style={{ 
                    borderColor: theme.colors.panelBorder,
                    backgroundColor: 'rgba(0,0,0,0.1)'
                }}
            >
                <span className="text-xs font-bold uppercase tracking-wider opacity-80">Live Intercepts</span>
                <div className="flex items-center gap-3">
                    <Tooltip content="Real-time data stream active" theme={theme} position="bottom">
                        <div className="flex gap-1 cursor-help">
                            <span 
                                className="w-2 h-2 rounded-full animate-pulse"
                                style={{ backgroundColor: theme.colors.attackColors.ddos }}
                            ></span>
                            <span 
                                className="text-[10px] font-mono"
                                style={{ color: theme.colors.attackColors.ddos }}
                            >
                                LIVE
                            </span>
                        </div>
                    </Tooltip>
                    <Tooltip content="Hide Log" theme={theme} position="bottom">
                        <button 
                            onClick={onToggle}
                            className="opacity-50 hover:opacity-100 transition-opacity"
                        >
                            <Minus size={14} />
                        </button>
                    </Tooltip>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3 font-mono text-[10px] md:text-xs space-y-3 custom-scrollbar mask-image-gradient pointer-events-auto">
                {logs.length === 0 && <div className="italic text-center mt-10 opacity-50">Scanning network...</div>}
                {logs.map((log) => (
                    <div key={log.id} className="animate-fade-in-up border-b border-dashed pb-2 last:border-0" style={{ borderColor: `${theme.colors.textSecondary}33` }}>
                        <div className="flex justify-between items-center mb-1">
                            <span 
                                className="font-bold uppercase flex items-center gap-1"
                                style={{ color: theme.colors.attackColors[log.type] }}
                            >
                                {log.type === 'ddos' && '⚡'}
                                {log.type === 'malware' && '☣'}
                                {log.type === 'phishing' && '🎣'}
                                {log.type === 'exploit' && '🔓'}
                                {log.technique}
                            </span>
                            <span className="opacity-50" style={{ color: theme.colors.textSecondary }}>:{log.port}</span>
                        </div>
                        
                        <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center" style={{ color: theme.colors.textPrimary }}>
                            <div className="truncate text-right opacity-80" title={log.sourceIp}>{log.sourceIp}</div>
                            <div className="opacity-50 text-[10px]">➜</div>
                            <div className="truncate text-left font-bold" title={log.targetIp}>{log.targetIp}</div>
                        </div>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>
        </div>
    );
};

export default AttackLog;
