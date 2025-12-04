
import { Theme } from '../types';

export const THEMES: Theme[] = [
  {
    id: 'cyber',
    name: 'Cyber Dark',
    colors: {
      background: '#050505',
      textPrimary: '#e0e0e0',
      textSecondary: '#94a3b8',
      panelBg: 'rgba(15, 23, 42, 0.85)',
      panelBorder: '#334155',
      accent: '#06b6d4', // cyan-500
      globeWater: '#111827',
      globeLand: '#1e293b',
      globeBorder: '#0ea5e9',
      globeGraticule: '#1e293b',
      countryBorder: '#38bdf8', // High contrast cyan
      starColor: '#ffffff',
      haloStart: 'rgba(14, 165, 233, 0)',
      haloEnd: 'rgba(14, 165, 233, 0.15)',
      attackColors: {
        ddos: '#ef4444',
        malware: '#22c55e',
        phishing: '#eab308',
        exploit: '#d946ef'
      }
    }
  },
  {
    id: 'light',
    name: 'Corporate',
    colors: {
      background: '#050505', // Changed to black
      textPrimary: '#0f172a', // slate-900
      textSecondary: '#64748b', // slate-500
      panelBg: 'rgba(255, 255, 255, 0.85)',
      panelBorder: '#cbd5e1', // slate-300
      accent: '#0284c7', // sky-600
      globeWater: '#e0f2fe', // sky-100
      globeLand: '#ffffff',
      globeBorder: '#38bdf8', // sky-400
      globeGraticule: '#94a3b8', // slate-400
      countryBorder: '#475569', // Dark slate for contrast
      starColor: '#ffffff', // Changed to white to show on black bg
      haloStart: 'rgba(56, 189, 248, 0)',
      haloEnd: 'rgba(56, 189, 248, 0.1)',
      attackColors: {
        ddos: '#dc2626',
        malware: '#16a34a',
        phishing: '#ca8a04',
        exploit: '#c026d3'
      }
    }
  },
  {
    id: 'matrix',
    name: 'Terminal',
    colors: {
      background: '#000000',
      textPrimary: '#22c55e', // green-500
      textSecondary: '#15803d', // green-700
      panelBg: 'rgba(0, 20, 0, 0.9)',
      panelBorder: '#14532d', // green-900
      accent: '#4ade80', // green-400
      globeWater: '#022c22', // teal-950 (very dark green)
      globeLand: '#064e3b', // teal-900
      globeBorder: '#22c55e', // green-500
      globeGraticule: '#14532d',
      countryBorder: '#4ade80', // Bright green
      starColor: '#15803d',
      haloStart: 'rgba(34, 197, 94, 0)',
      haloEnd: 'rgba(34, 197, 94, 0.15)',
      attackColors: {
        ddos: '#ef4444',     // Standard Red
        malware: '#22c55e',  // Standard Green
        phishing: '#eab308', // Standard Yellow
        exploit: '#d946ef'   // Standard Purple
      }
    }
  },
  {
    id: 'midnight',
    name: 'Midnight',
    colors: {
      background: '#0f0518', // very dark purple
      textPrimary: '#e9d5ff', // purple-200
      textSecondary: '#7e22ce', // purple-700
      panelBg: 'rgba(26, 11, 46, 0.85)',
      panelBorder: '#581c87', // purple-900
      accent: '#d8b4fe', // purple-300
      globeWater: '#2e1065', // purple-950
      globeLand: '#4c1d95', // purple-900
      globeBorder: '#a855f7', // purple-500
      globeGraticule: '#581c87',
      countryBorder: '#d8b4fe', // Light purple
      starColor: '#e9d5ff',
      haloStart: 'rgba(168, 85, 247, 0)',
      haloEnd: 'rgba(168, 85, 247, 0.15)',
      attackColors: {
        ddos: '#f472b6', // pink
        malware: '#c084fc', // purple
        phishing: '#fb7185', // rose
        exploit: '#818cf8' // indigo
      }
    }
  },
  {
    id: 'geography',
    name: 'Geography',
    colors: {
      background: '#000000',
      textPrimary: '#ffffff',
      textSecondary: '#94a3b8',
      panelBg: 'rgba(0, 0, 0, 0.7)',
      panelBorder: '#334155',
      accent: '#38bdf8',
      globeWater: '#001e36',
      globeLand: '#2d4c1e', // Base color, overridden by biome logic
      globeBorder: '#4d94ff',
      globeGraticule: 'rgba(255, 255, 255, 0.05)',
      countryBorder: 'rgba(0, 0, 0, 0)', // Transparent borders
      starColor: '#ffffff',
      haloStart: 'rgba(77, 148, 255, 0)',
      haloEnd: 'rgba(77, 148, 255, 0.15)',
      attackColors: {
        ddos: '#ef4444',
        malware: '#22c55e',
        phishing: '#eab308',
        exploit: '#d946ef'
      }
    }
  }
];
