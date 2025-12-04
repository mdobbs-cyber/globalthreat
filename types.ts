
export interface Attack {
  id: string;
  source: [number, number]; // [longitude, latitude]
  target: [number, number]; // [longitude, latitude]
  sourceIp: string;
  targetIp: string;
  technique: string;
  port: number;
  progress: number; // 0 to 1
  speed: number;
  color: string;
  type: 'ddos' | 'malware' | 'phishing' | 'exploit';
  critical: boolean;
  viaSatellite: boolean;
}

export interface Ripple {
  id: string;
  coordinates: [number, number];
  color: string;
  radius: number;
  maxRadius: number;
  alpha: number;
  strokeWidth: number;
}

export interface Satellite {
  id: string;
  lat: number;
  lon: number;
  altitude: number; // 1.0 = surface, 1.5 = high orbit
  velocity: {
    lat: number;
    lon: number;
  };
  angle: number; // For rotation of the icon itself
}

export interface GlobeConfig {
  rotationSpeed: number; // degrees per frame
  attackIntensity: number; // max concurrent attacks
  isPlaying: boolean;
  showGraticule: boolean;
  zoom: number; // 0.5 to 2.0
  showSatellites: boolean;
  satelliteCount: number;
  wledIp: string; // IP address of WLED device
  wledBrightness: number; // 0-255
  wledEffect: number; // Effect ID
  majorCitiesOnly: boolean;
}

export interface GeoJSONWorld {
  type: string;
  features: Array<any>;
}

export interface ThemeColors {
  background: string;
  textPrimary: string;
  textSecondary: string;
  panelBg: string;
  panelBorder: string;
  accent: string;
  globeWater: string;
  globeLand: string;
  globeBorder: string;
  globeGraticule: string;
  countryBorder: string;
  starColor: string;
  haloStart: string;
  haloEnd: string;
  attackColors: {
    ddos: string;
    malware: string;
    phishing: string;
    exploit: string;
  };
}

export interface Theme {
  id: string;
  name: string;
  colors: ThemeColors;
}