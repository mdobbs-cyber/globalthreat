
import React, { useState } from 'react';
import { GlobeConfig, Theme } from '../types';
import { THEMES } from '../utils/themes';
import { Play, Pause, Grid, Globe, Zap, Activity, Palette, ZoomIn, Satellite, Minimize2, Lightbulb, Wifi, Check, X, MapPin } from 'lucide-react';
import Tooltip from './Tooltip';
import { setWledTheme } from '../utils/wled';

interface ControlPanelProps {
    config: GlobeConfig;
    setConfig: React.Dispatch<React.SetStateAction<GlobeConfig>>;
    currentTheme: Theme;
    setTheme: (theme: Theme) => void;
    onToggle: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ config, setConfig, currentTheme, setTheme, onToggle }) => {
    const [wledStatus, setWledStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

    const togglePlay = () => setConfig(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
    const toggleGraticule = () => setConfig(prev => ({ ...prev, showGraticule: !prev.showGraticule }));
    const toggleSatellites = () => setConfig(prev => ({ ...prev, showSatellites: !prev.showSatellites }));
    const toggleMajorCities = () => setConfig(prev => ({ ...prev, majorCitiesOnly: !prev.majorCitiesOnly }));

    const testWled = async () => {
        if (!config.wledIp) return;
        setWledStatus('testing');
        const result = await setWledTheme(config.wledIp, currentTheme, config.wledBrightness, config.wledEffect);
        setWledStatus(result.success ? 'success' : 'error');

        // Reset status after 3 seconds
        setTimeout(() => {
            setWledStatus('idle');
        }, 3000);
    };

    return (
        <div
            className="absolute bottom-6 left-6 right-6 md:left-1/2 md:right-auto md:-translate-x-1/2 p-6 rounded-2xl shadow-2xl flex flex-col gap-6 md:min-w-[550px] z-20 transition-colors duration-500 backdrop-blur-md border animate-fade-in-up"
            style={{
                backgroundColor: currentTheme.colors.panelBg,
                borderColor: currentTheme.colors.panelBorder,
                color: currentTheme.colors.textPrimary
            }}
        >

            {/* Header controls */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2" style={{ color: currentTheme.colors.accent }}>
                    <Activity size={20} />
                    <span className="font-bold tracking-widest text-sm uppercase">Threat Control</span>
                </div>
                <div className="flex gap-2">
                    <Tooltip content={config.isPlaying ? "Pause Simulation" : "Resume Simulation"} theme={currentTheme}>
                        <button
                            onClick={togglePlay}
                            className="p-2 rounded-lg transition-colors border border-transparent"
                            style={{
                                backgroundColor: config.isPlaying ? `${currentTheme.colors.accent}33` : 'rgba(0,0,0,0.2)',
                                color: config.isPlaying ? currentTheme.colors.accent : currentTheme.colors.textSecondary,
                                borderColor: config.isPlaying ? currentTheme.colors.accent : 'transparent'
                            }}
                        >
                            {config.isPlaying ? <Pause size={20} /> : <Play size={20} />}
                        </button>
                    </Tooltip>

                    <Tooltip content={config.showSatellites ? "Hide Satellites" : "Show Satellites"} theme={currentTheme}>
                        <button
                            onClick={toggleSatellites}
                            className="p-2 rounded-lg transition-colors border border-transparent"
                            style={{
                                backgroundColor: config.showSatellites ? `${currentTheme.colors.accent}33` : 'rgba(0,0,0,0.2)',
                                color: config.showSatellites ? currentTheme.colors.accent : currentTheme.colors.textSecondary,
                                borderColor: config.showSatellites ? currentTheme.colors.accent : 'transparent'
                            }}
                        >
                            <Satellite size={20} />
                        </button>
                    </Tooltip>

                    <Tooltip content={config.showGraticule ? "Hide Coordinate Grid" : "Show Coordinate Grid"} theme={currentTheme}>
                        <button
                            onClick={toggleGraticule}
                            className="p-2 rounded-lg transition-colors border border-transparent"
                            style={{
                                backgroundColor: config.showGraticule ? `${currentTheme.colors.accent}33` : 'rgba(0,0,0,0.2)',
                                color: config.showGraticule ? currentTheme.colors.accent : currentTheme.colors.textSecondary,
                                borderColor: config.showGraticule ? currentTheme.colors.accent : 'transparent'
                            }}
                        >
                            <Grid size={20} />
                        </button>
                    </Tooltip>

                    <Tooltip content="Hide Panel" theme={currentTheme}>
                        <button
                            onClick={onToggle}
                            className="p-2 rounded-lg transition-colors border border-transparent hover:bg-black/10"
                            style={{
                                color: currentTheme.colors.textSecondary
                            }}
                        >
                            <Minimize2 size={20} />
                        </button>
                    </Tooltip>
                </div>
            </div>

            {/* Sliders */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Rotation Speed */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono" style={{ color: currentTheme.colors.textSecondary }}>
                        <div className="flex items-center gap-1"><Globe size={14} /> <span>SPIN</span></div>
                        <span>{(config.rotationSpeed * 10).toFixed(1)}x</span>
                    </div>
                    <Tooltip content="Adjust globe rotation velocity" theme={currentTheme} position="top">
                        <input
                            type="range"
                            min="0"
                            max="1.0"
                            step="0.05"
                            value={config.rotationSpeed}
                            onChange={(e) => setConfig(prev => ({ ...prev, rotationSpeed: parseFloat(e.target.value) }))}
                            className="w-full h-1 rounded-lg appearance-none cursor-pointer"
                            style={{
                                background: currentTheme.colors.panelBorder,
                            }}
                        />
                    </Tooltip>
                </div>

                {/* Attack Intensity */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono" style={{ color: currentTheme.colors.textSecondary }}>
                        <div className="flex items-center gap-1"><Zap size={14} /> <span>LOAD</span></div>
                        <span>{config.attackIntensity}</span>
                    </div>
                    <Tooltip content="Set maximum concurrent cyber attacks" theme={currentTheme} position="top">
                        <input
                            type="range"
                            min="0"
                            max="50"
                            step="1"
                            value={config.attackIntensity}
                            onChange={(e) => setConfig(prev => ({ ...prev, attackIntensity: parseInt(e.target.value) }))}
                            className="w-full h-1 rounded-lg appearance-none cursor-pointer"
                            style={{
                                background: currentTheme.colors.panelBorder,
                            }}
                        />
                    </Tooltip>
                </div>

                {/* Satellites */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono" style={{ color: currentTheme.colors.textSecondary }}>
                        <div className="flex items-center gap-1"><Satellite size={14} /> <span>SATS</span></div>
                        <span>{config.satelliteCount}</span>
                    </div>
                    <Tooltip content="Number of orbiting satellites" theme={currentTheme} position="top">
                        <input
                            type="range"
                            min="0"
                            max="20"
                            step="1"
                            value={config.satelliteCount}
                            onChange={(e) => setConfig(prev => ({ ...prev, satelliteCount: parseInt(e.target.value) }))}
                            className="w-full h-1 rounded-lg appearance-none cursor-pointer"
                            style={{
                                background: currentTheme.colors.panelBorder,
                            }}
                        />
                    </Tooltip>
                </div>

                {/* Zoom */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono" style={{ color: currentTheme.colors.textSecondary }}>
                        <div className="flex items-center gap-1"><ZoomIn size={14} /> <span>ZOOM</span></div>
                        <span>{config.zoom.toFixed(1)}x</span>
                    </div>
                    <Tooltip content="Zoom In/Out (or scroll)" theme={currentTheme} position="top">
                        <input
                            type="range"
                            min="0.5"
                            max="3.0"
                            step="0.1"
                            value={config.zoom}
                            onChange={(e) => setConfig(prev => ({ ...prev, zoom: parseFloat(e.target.value) }))}
                            className="w-full h-1 rounded-lg appearance-none cursor-pointer"
                            style={{
                                background: currentTheme.colors.panelBorder,
                            }}
                        />
                    </Tooltip>
                </div>
            </div>

            {/* Theme Selector */}
            <div className="space-y-2 border-t pt-4" style={{ borderColor: currentTheme.colors.panelBorder }}>
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2 text-xs font-mono" style={{ color: currentTheme.colors.textSecondary }}>
                        <Palette size={14} /> <span>VISUAL_THEME</span>
                    </div>

                    {/* WLED IP Input & Test */}
                    <Tooltip content="Enter WLED IP address to sync lighting (e.g., 192.168.1.50)" theme={currentTheme} position="left">
                        <div className="flex items-center gap-1">
                            <Lightbulb size={14} style={{ color: config.wledIp ? currentTheme.colors.accent : currentTheme.colors.textSecondary }} />
                            <input
                                type="text"
                                placeholder="WLED IP"
                                value={config.wledIp}
                                onChange={(e) => setConfig(prev => ({ ...prev, wledIp: e.target.value }))}
                                className="bg-transparent border rounded px-2 py-0.5 text-[10px] w-24 font-mono focus:outline-none"
                                style={{
                                    borderColor: currentTheme.colors.panelBorder,
                                    color: currentTheme.colors.textPrimary
                                }}
                            />
                            <button
                                onClick={testWled}
                                disabled={!config.wledIp || wledStatus === 'testing'}
                                className="p-1 rounded hover:bg-white/10 transition-colors"
                                style={{ color: currentTheme.colors.textSecondary }}
                                title="Test Connection"
                            >
                                {wledStatus === 'idle' && <Wifi size={12} />}
                                {wledStatus === 'testing' && <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>}
                                {wledStatus === 'success' && <Check size={12} className="text-green-500" />}
                                {wledStatus === 'error' && <X size={12} className="text-red-500" />}
                            </button>
                        </div>
                    </Tooltip>
                </div>

                {/* WLED Controls (Brightness & Effect) */}
                {config.wledIp && (
                    <div className="flex gap-2 items-center mb-2 animate-fade-in justify-end">
                        <div className="flex items-center gap-1 text-xs font-mono w-20" style={{ color: currentTheme.colors.textSecondary }}>
                            <Lightbulb size={14} /> <span>{Math.round(config.wledBrightness / 255 * 100)}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="255"
                            step="5"
                            value={config.wledBrightness}
                            onChange={(e) => setConfig(prev => ({ ...prev, wledBrightness: parseInt(e.target.value) }))}
                            className="w-20 h-1 rounded-lg appearance-none cursor-pointer"
                            style={{ background: currentTheme.colors.panelBorder }}
                        />

                        <select
                            value={config.wledEffect}
                            onChange={(e) => setConfig(prev => ({ ...prev, wledEffect: parseInt(e.target.value) }))}
                            className="bg-transparent border rounded px-2 py-0.5 text-[10px] font-mono focus:outline-none ml-2 w-24"
                            style={{
                                borderColor: currentTheme.colors.panelBorder,
                                color: currentTheme.colors.textPrimary
                            }}
                        >
                            <option value={0}>Solid</option>
                            <option value={1}>Blink</option>
                            <option value={2}>Breathe</option>
                            <option value={3}>Wipe</option>
                            <option value={8}>Colorloop</option>
                            <option value={9}>Rainbow</option>
                            <option value={12}>Fade</option>
                            <option value={18}>Dissolve</option>
                            <option value={20}>Sparkle</option>
                            <option value={37}>Pacifica</option>
                            <option value={41}>Lighthouse</option>
                            <option value={58}>Sinusoid</option>
                            <option value={64}>Juggle</option>
                            <option value={75}>Noise</option>
                            <option value={101}>Ripple</option>
                            <option value={117}>Sunrise</option>
                        </select>
                    </div>
                )}

                <div className="flex gap-2 flex-wrap">
                    {THEMES.map(theme => (
                        <Tooltip key={theme.id} content={`Apply ${theme.name} Theme`} theme={currentTheme} position="top">
                            <button
                                onClick={() => setTheme(theme)}
                                className={`px-3 py-1.5 rounded text-xs font-bold uppercase transition-all border ${currentTheme.id === theme.id ? 'ring-2 ring-offset-2 ring-offset-black/50' : 'opacity-70 hover:opacity-100'}`}
                                style={{
                                    backgroundColor: theme.colors.background,
                                    borderColor: theme.colors.accent,
                                    color: theme.colors.accent,
                                    boxShadow: currentTheme.id === theme.id ? `0 0 10px ${theme.colors.accent}44` : 'none'
                                }}
                            >
                                {theme.name}
                            </button>
                        </Tooltip>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ControlPanel;
