
import { Theme } from '../types';

// Helper to convert Hex to RGB array [r, g, b]
const hexToRgb = (hex: string): [number, number, number] => {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return [r, g, b];
};

export const setWledTheme = async (ip: string, theme: Theme, brightness: number = 128, effectId: number = 0): Promise<{ success: boolean, error?: string }> => {
  if (!ip || ip.length < 7) return { success: false, error: 'Invalid IP' };

  // Use the theme's accent color as primary, and textPrimary as secondary
  const primaryColor = hexToRgb(theme.colors.accent);
  const secondaryColor = hexToRgb(theme.colors.textPrimary);
  const bg = hexToRgb(theme.colors.background);

  // Payload for WLED JSON API
  // Documentation: https://kno.wled.ge/interfaces/json-api/
  const payload = {
    on: true,
    bri: brightness,
    seg: [
      {
        id: 0,
        col: [
          primaryColor,    // Primary
          secondaryColor,  // Secondary
          bg               // Background
        ],
        fx: effectId,
        sx: 128,
        ix: 128
      }
    ]
  };

  try {
    // Note: This requires the WLED device to allow CORS or the browser to be flexible with local IP mixed content.
    // Standard WLED firmware supports CORS.
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 3000); // 3 second timeout

    const response = await fetch(`http://${ip}/json/state`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(id);

    if (!response.ok) {
      console.warn(`WLED Error: ${response.statusText}`);
      return { success: false, error: response.statusText };
    }

    return { success: true };
  } catch (error: any) {
    console.warn('Failed to connect to WLED device:', error);
    return { success: false, error: error.message || 'Connection Failed' };
  }
};
