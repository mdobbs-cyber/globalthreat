
import React, { useState, useCallback, useEffect } from 'react';
import PewPewGlobe from './components/PewPewGlobe';
import ControlPanel from './components/ControlPanel';
import AttackLog from './components/AttackLog';
import Tooltip from './components/Tooltip';
import { GlobeConfig, Attack, Theme } from './types';
import { THEMES } from './utils/themes';
import { setWledTheme } from './utils/wled';
import { ShieldAlert, Eye, EyeOff, Sliders, List } from 'lucide-react';

const APP_VERSION = "1.1.0";

function App() {
  const [config, setConfig] = useState<GlobeConfig>({
    rotationSpeed: 0.2,
    attackIntensity: 10,
    isPlaying: true,
    showGraticule: true,
    zoom: 1.0,
    showSatellites: true,
    satelliteCount: 8,
    wledIp: '',
    wledBrightness: 128,
    wledEffect: 0,
    majorCitiesOnly: true
  });

  const [currentTheme, setCurrentTheme] = useState<Theme>(THEMES[0]); // Default to Cyber
  const [logs, setLogs] = useState<Attack[]>([]);

  // Independent visibility states
  const [showControls, setShowControls] = useState(true);
  const [showLogs, setShowLogs] = useState(true);

  // Sync with WLED when theme or IP changes
  useEffect(() => {
    if (config.wledIp) {
      setWledTheme(config.wledIp, currentTheme, config.wledBrightness, config.wledEffect);
    }
  }, [currentTheme, config.wledIp]);

  const handleAttackLog = useCallback((attack: Attack) => {
    setLogs(prev => {
      const newLogs = [...prev, attack];
      if (newLogs.length > 30) return newLogs.slice(newLogs.length - 30);
      return newLogs;
    });
  }, []);

  return (
    <div
      className="w-full h-screen relative overflow-hidden transition-colors duration-700"
      style={{ backgroundColor: currentTheme.colors.background }}
    >

      {/* Background decoration - subtle radial */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${currentTheme.colors.globeWater} 0%, ${currentTheme.colors.background} 100%)`
        }}
      ></div>

      {/* Main Visual */}
      <PewPewGlobe
        config={config}
        setConfig={setConfig}
        theme={currentTheme}
        onAttackLog={handleAttackLog}
      />

      {/* Title (Always visible unless overlapped by panels, but placed safe) */}
      <div className="absolute top-6 left-6 z-10 select-none animate-fade-in pointer-events-auto">
        <Tooltip content="System Status: ONLINE" theme={currentTheme} position="right">
          <div>
            <h1
              className="text-3xl md:text-5xl font-bold tracking-tighter flex items-center gap-3 drop-shadow-lg transition-colors duration-500 cursor-default"
              style={{ color: currentTheme.colors.textPrimary }}
            >
              <ShieldAlert style={{ color: currentTheme.colors.accent }} size={40} />
              NET<span style={{ color: currentTheme.colors.accent }}>WATCH</span>
            </h1>
            <p
              className="text-sm md:text-base font-mono mt-1 ml-1 transition-colors duration-500"
              style={{ color: currentTheme.colors.textSecondary }}
            >
              Global Cyber Threat Intelligence Map
            </p>
          </div>
        </Tooltip>
      </div>

      {/* Attack Log Panel OR Show Button */}
      {showLogs ? (
        <div className="animate-fade-in top-20 right-6 absolute z-20">
          <AttackLog logs={logs} theme={currentTheme} onToggle={() => setShowLogs(false)} />
        </div>
      ) : (
        <div className="absolute top-6 right-6 z-20">
          <Tooltip content="Show Intercepts" theme={currentTheme} position="left">
            <button
              onClick={() => setShowLogs(true)}
              className="p-2 rounded-lg backdrop-blur-md border transition-all hover:scale-110 shadow-lg"
              style={{
                backgroundColor: currentTheme.colors.panelBg,
                borderColor: currentTheme.colors.panelBorder,
                color: currentTheme.colors.textSecondary
              }}
            >
              <List size={20} />
            </button>
          </Tooltip>
        </div>
      )}

      {/* Control Panel OR Show Button */}
      {showControls ? (
        <div className="animate-slide-up z-20 relative">
          <ControlPanel
            config={config}
            setConfig={setConfig}
            currentTheme={currentTheme}
            setTheme={setCurrentTheme}
            onToggle={() => setShowControls(false)}
          />
        </div>
      ) : (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
          <Tooltip content="Show Controls" theme={currentTheme} position="top">
            <button
              onClick={() => setShowControls(true)}
              className="p-3 rounded-full backdrop-blur-md border transition-all hover:scale-110 shadow-xl"
              style={{
                backgroundColor: currentTheme.colors.panelBg,
                borderColor: currentTheme.colors.panelBorder,
                color: currentTheme.colors.accent
              }}
            >
              <Sliders size={24} />
            </button>
          </Tooltip>
        </div>
      )}

      {/* Footer / Credits */}
      <div
        className="absolute bottom-2 right-4 text-[10px] font-mono z-0 pointer-events-none transition-colors duration-500"
        style={{ color: currentTheme.colors.textSecondary }}
      >
        VIZ_ENGINE: D3.JS_GEO_ORTHOGRAPHIC // THEME: {currentTheme.name.toUpperCase()} // V{APP_VERSION}
      </div>
    </div>
  );
}

export default App;