
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { GlobeConfig, Attack, Theme, Ripple, Satellite } from '../types';
import { generateAttack, MAJOR_CITIES } from '../utils/geo';

interface PewPewGlobeProps {
  config: GlobeConfig;
  setConfig: React.Dispatch<React.SetStateAction<GlobeConfig>>;
  theme: Theme;
  onAttackLog: (attack: Attack) => void;
}

const PewPewGlobe: React.FC<PewPewGlobeProps> = ({ config, setConfig, theme, onAttackLog }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mutable state for the animation loop
  const attacksRef = useRef<Attack[]>([]);
  const ripplesRef = useRef<Ripple[]>([]);
  const satellitesRef = useRef<Satellite[]>([]);
  const rotationRef = useRef<[number, number]>([0, -10]);
  const worldDataRef = useRef<any>(null);

  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load Data
  useEffect(() => {
    const loadData = async () => {
      if (worldDataRef.current) return; // Already loaded
      try {
        const response = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');
        const data = await response.json();
        worldDataRef.current = (topojson as any).feature(data, data.objects.countries);
      } catch (error) {
        console.error("Failed to load map data", error);
      }
    };
    loadData();
  }, []);

  // Handle Manual Rotation (Drag)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const drag = d3.drag<HTMLCanvasElement, unknown>()
      .on("drag", (event) => {
        const rotate = rotationRef.current;
        const sensitivity = 0.25;
        rotationRef.current = [
          rotate[0] + event.dx * sensitivity,
          Math.max(-90, Math.min(90, rotate[1] - event.dy * sensitivity))
        ];
      });

    d3.select(canvas).call(drag);
  }, []);

  // Handle Zoom (Wheel)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = -Math.sign(e.deltaY) * 0.1;
      setConfig(prev => ({
        ...prev,
        zoom: Math.max(0.5, Math.min(3.0, prev.zoom + delta))
      }));
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [setConfig]);

  // Generate Satellite
  const generateSatellite = (): Satellite => {
    return {
      id: Math.random().toString(36).substr(2, 9),
      lat: (Math.random() * 140) - 70,
      lon: Math.random() * 360 - 180,
      altitude: 1.1 + Math.random() * 0.3, // 1.1x to 1.4x earth radius
      velocity: {
        lon: (Math.random() > 0.5 ? 1 : -1) * (0.2 + Math.random() * 0.3),
        lat: (Math.random() - 0.5) * 0.1
      },
      angle: Math.random() * Math.PI * 2
    }
  }

  // Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // High DPI scaling
    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    context.scale(dpr, dpr);
    canvas.style.width = `${dimensions.width}px`;
    canvas.style.height = `${dimensions.height}px`;

    // Calculate dynamic scale based on zoom
    const baseScale = Math.min(dimensions.width, dimensions.height) / 2.2;
    const currentScale = baseScale * config.zoom;

    const projection = d3.geoOrthographic()
      .scale(currentScale)
      .translate([dimensions.width / 2, dimensions.height / 2])
      .clipAngle(90);

    const path = d3.geoPath()
      .projection(projection)
      .context(context);

    // Generate stars only when dimensions change, not every frame
    const stars = d3.range(200).map(() => ({
      x: Math.random() * dimensions.width,
      y: Math.random() * dimensions.height,
      size: Math.random() * 1.5,
      opacity: Math.random()
    }));

    const timer = d3.timer((elapsed) => {
      // 1. Update State
      if (config.isPlaying) {
        rotationRef.current[0] += config.rotationSpeed;
      }

      // Manage Satellites
      if (config.showSatellites) {
        while (satellitesRef.current.length < config.satelliteCount) {
          satellitesRef.current.push(generateSatellite());
        }
        while (satellitesRef.current.length > config.satelliteCount) {
          satellitesRef.current.pop();
        }

        if (config.isPlaying) {
          satellitesRef.current.forEach(sat => {
            sat.lon += sat.velocity.lon;
            sat.lat += sat.velocity.lat;
            // Wrap
            if (sat.lon > 180) sat.lon -= 360;
            if (sat.lon < -180) sat.lon += 360;
            if (sat.lat > 90) sat.velocity.lat *= -1;
            if (sat.lat < -90) sat.velocity.lat *= -1;

            sat.angle += 0.01;
          });
        }
      }

      // Manage Attacks
      // Remove finished
      for (let i = attacksRef.current.length - 1; i >= 0; i--) {
        const attack = attacksRef.current[i];
        attack.progress += attack.speed;

        if (attack.progress >= 1) {
          // Attack Landed: Create Ripple/Explosion
          const isCritical = attack.critical || attack.type === 'ddos';

          ripplesRef.current.push({
            id: Math.random().toString(36),
            coordinates: attack.target,
            color: theme.colors.attackColors[attack.type],
            radius: 0,
            maxRadius: isCritical ? 25 * config.zoom : 10 * config.zoom,
            alpha: 1,
            strokeWidth: isCritical ? 3 : 1
          });

          attacksRef.current.splice(i, 1);
        }
      }

      // Manage Ripples
      for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
        const ripple = ripplesRef.current[i];
        ripple.radius += 0.5 * config.zoom;
        ripple.alpha -= 0.02;
        ripple.strokeWidth -= 0.05;

        if (ripple.alpha <= 0) {
          ripplesRef.current.splice(i, 1);
        }
      }

      // Add new if below intensity
      if (attacksRef.current.length < config.attackIntensity) {
        // Chance to spawn per frame to stagger them
        if (Math.random() > 0.9) {
          const newAttack = generateAttack(config.majorCitiesOnly);
          // Override the random color from geo.ts with theme color if needed
          // We will resolve color during render
          attacksRef.current.push(newAttack);
          onAttackLog(newAttack);
        }
      }

      // 2. Render
      projection.rotate(rotationRef.current);

      context.clearRect(0, 0, dimensions.width, dimensions.height);

      // Draw Stars
      context.fillStyle = theme.colors.starColor;
      stars.forEach(star => {
        context.globalAlpha = star.opacity * 0.5;
        context.beginPath();
        context.arc(star.x, star.y, star.size, 0, 2 * Math.PI);
        context.fill();
      });
      context.globalAlpha = 1;

      // Draw Opaque Base (Black) to occlude stars
      context.beginPath();
      path({ type: 'Sphere' } as any);
      context.fillStyle = '#000000';
      context.fill();

      // Draw Globe Sphere (Water)
      context.beginPath();
      path({ type: 'Sphere' } as any);
      context.fillStyle = theme.colors.globeWater;
      context.fill();

      // Halo / Atmosphere effect
      const gradient = context.createRadialGradient(
        dimensions.width / 2, dimensions.height / 2,
        currentScale * 0.8,
        dimensions.width / 2, dimensions.height / 2,
        currentScale * 1.2
      );
      gradient.addColorStop(0, theme.colors.haloStart);
      gradient.addColorStop(1, theme.colors.haloEnd);
      context.fillStyle = gradient;
      context.beginPath();
      path({ type: 'Sphere' } as any);
      context.fill();

      // Draw Graticule
      if (config.showGraticule) {
        context.beginPath();
        path(d3.geoGraticule()() as any);
        context.strokeStyle = theme.colors.globeGraticule;
        context.lineWidth = 0.5;
        context.stroke();
      }

      // Draw Countries
      // Draw Countries
      if (worldDataRef.current) {
        context.beginPath();

        if (theme.id === 'geography') {
          // Per-feature rendering for Biome Simulation
          worldDataRef.current.features.forEach((feature: any) => {
            context.beginPath();
            path(feature);

            // Calculate centroid for latitude approximation
            const centroid = d3.geoCentroid(feature);
            const lat = Math.abs(centroid[1]);

            let biomeColor = '#2d4c1e'; // Default: Forest Green

            // Biome Logic based on Latitude (Approximate)
            if (lat > 60) {
              biomeColor = '#e5e7eb'; // Ice/Snow (Grey-200)
            } else if (lat > 50) {
              biomeColor = '#14532d'; // Boreal Forest (Green-900)
            } else if (lat > 35) {
              biomeColor = '#15803d'; // Temperate (Green-700)
            } else if (lat > 23) {
              biomeColor = '#d4b483'; // Desert/Arid (Tan)
            } else if (lat > 10) {
              biomeColor = '#3f6212'; // Savannah (Yellow-Green-800)
            } else {
              biomeColor = '#064e3b'; // Tropical Rainforest (Emerald-900)
            }

            context.fillStyle = biomeColor;
            context.fill();
          });
        } else {
          // Standard rendering (Single path for performance)
          path(worldDataRef.current);
          context.fillStyle = theme.colors.globeLand;
          context.fill();

          // High Contrast Borders (only if not geography)
          context.lineWidth = 0.75;
          context.strokeStyle = theme.colors.countryBorder;
          context.stroke();
        }
      }

      // Draw Major Cities
      if (config.majorCitiesOnly) {
        context.fillStyle = theme.colors.textSecondary;
        context.globalAlpha = 0.4;
        MAJOR_CITIES.forEach(city => {
          const p = projection(city);
          if (p) {
            context.beginPath();
            context.arc(p[0], p[1], 1.5 * config.zoom, 0, 2 * Math.PI);
            context.fill();
          }
        });
        context.globalAlpha = 1;
      }

      // Draw Border of Sphere
      context.beginPath();
      path({ type: 'Sphere' } as any);
      context.lineWidth = 1;
      context.strokeStyle = theme.colors.globeBorder;
      context.stroke();

      // Draw Orbiting Satellites (Icons and Paths)
      if (config.showSatellites) {
        const center = [dimensions.width / 2, dimensions.height / 2];

        satellitesRef.current.forEach(sat => {



          // 2. Draw Satellite Icon
          // Project the lat/lon to get the surface point
          const p = projection([sat.lon, sat.lat]);

          // Only render if visible (projection returns coords)
          if (p) {
            const dx = p[0] - center[0];
            const dy = p[1] - center[1];

            const satX = center[0] + dx * sat.altitude;
            const satY = center[1] + dy * sat.altitude;

            // Draw Satellite Icon
            context.save();
            context.translate(satX, satY);
            // Rotate to face velocity or just spin slowly
            context.rotate(sat.angle);

            const size = 3 * config.zoom;

            context.strokeStyle = theme.colors.accent;
            context.fillStyle = theme.colors.background;
            context.lineWidth = 1;

            // Solar Panels
            context.beginPath();
            context.rect(-size * 2, -size / 2, size, size); // Left panel
            context.rect(size, -size / 2, size, size);      // Right panel
            context.fillStyle = `${theme.colors.accent}88`;
            context.fill();
            context.stroke();

            // Body
            context.beginPath();
            context.rect(-size / 2, -size / 2, size, size);
            context.fillStyle = theme.colors.textPrimary;
            context.fill();
            context.stroke();

            // Antenna line
            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(0, size * 1.5);
            context.strokeStyle = theme.colors.textSecondary;
            context.stroke();

            context.restore();
          }
        });
      }

      // Draw Ripples (Explosions)
      ripplesRef.current.forEach(ripple => {
        const projected = projection(ripple.coordinates);
        // Only draw if on front side
        if (projected) {
          context.beginPath();
          context.arc(projected[0], projected[1], ripple.radius, 0, 2 * Math.PI);
          context.strokeStyle = ripple.color;
          context.lineWidth = Math.max(0.5, ripple.strokeWidth);
          context.globalAlpha = ripple.alpha;
          context.stroke();

          // Inner fill for critical hits
          if (ripple.maxRadius > 15) {
            context.beginPath();
            context.arc(projected[0], projected[1], ripple.radius * 0.5, 0, 2 * Math.PI);
            context.fillStyle = ripple.color;
            context.globalAlpha = ripple.alpha * 0.3;
            context.fill();
          }
        }
      });
      context.globalAlpha = 1;

      // Draw Attacks
      attacksRef.current.forEach(attack => {
        const { source, target, progress, type, viaSatellite, critical } = attack;
        const color = theme.colors.attackColors[type];

        // Calculate current position
        const interpolator = d3.geoInterpolate(source, target);
        const pos = interpolator(progress);

        // Project positions
        // Default projection on sphere surface
        const p1 = projection(pos);

        // Determine drawing mode (Standard or Satellite)
        const isSatellite = viaSatellite && config.showSatellites;

        if (p1) {
          let drawX = p1[0];
          let drawY = p1[1];

          // Satellite elevation logic for ATTACK PATHS
          if (isSatellite) {
            const centerX = dimensions.width / 2;
            const centerY = dimensions.height / 2;

            // Calculate altitude factor (Sine wave: 0 -> max -> 0)
            // Max altitude is proportional to path length, but let's keep it simple
            // Max height = 1.4x radius at midpoint (progress = 0.5)
            const altitude = 1 + Math.sin(progress * Math.PI) * 0.4;

            // Vector from center
            const dx = p1[0] - centerX;
            const dy = p1[1] - centerY;

            drawX = centerX + dx * altitude;
            drawY = centerY + dy * altitude;
          }

          // Draw Trajectory (faint line for standard, dashed for sat?)
          if (!isSatellite) {
            context.beginPath();
            const trajectoryLine = {
              type: "LineString",
              coordinates: [source, target]
            };
            path(trajectoryLine as any);
            context.strokeStyle = color;
            context.globalAlpha = 0.1;
            context.lineWidth = 1;
            context.stroke();
            context.globalAlpha = 1;
          }

          // Draw "Missile" / "Satellite" head
          context.beginPath();
          const headSize = (critical ? 4 : 2.5) * (isSatellite ? 1.2 : 1);

          if (isSatellite) {
            // Draw satellite icon (diamond shape)
            context.moveTo(drawX, drawY - headSize);
            context.lineTo(drawX + headSize, drawY);
            context.lineTo(drawX, drawY + headSize);
            context.lineTo(drawX - headSize, drawY);
            context.closePath();
          } else {
            context.arc(drawX, drawY, headSize, 0, 2 * Math.PI);
          }

          context.fillStyle = '#ffffff';
          if (theme.id === 'matrix') context.fillStyle = color;

          context.shadowColor = color;
          context.shadowBlur = critical ? 20 : 10;
          context.fill();
          context.shadowBlur = 0; // Reset

          // Draw Tail/Streak
          if (progress > 0.05) {
            let tailX = p1[0];
            let tailY = p1[1];

            const tailPos = interpolator(Math.max(0, progress - 0.15));
            const pTail = projection(tailPos);

            if (pTail) {
              if (isSatellite) {
                const centerX = dimensions.width / 2;
                const centerY = dimensions.height / 2;
                const altitudeTail = 1 + Math.sin(Math.max(0, progress - 0.15) * Math.PI) * 0.4;
                // Vector from center for tail
                const dxTail = pTail[0] - centerX;
                const dyTail = pTail[1] - centerY;
                tailX = centerX + dxTail * altitudeTail;
                tailY = centerY + dyTail * altitudeTail;
              } else {
                tailX = pTail[0];
                tailY = pTail[1];
              }

              context.beginPath();
              context.moveTo(drawX, drawY);
              context.lineTo(tailX, tailY);
              context.lineWidth = critical ? 3 : 2;
              context.lineCap = 'round';
              // Create gradient for tail
              const grad = context.createLinearGradient(drawX, drawY, tailX, tailY);
              grad.addColorStop(0, color);
              grad.addColorStop(1, 'rgba(0,0,0,0)');
              context.strokeStyle = grad;
              context.stroke();
            }
          }
        }
      });
    });

    return () => {
      timer.stop();
    };
  }, [config, dimensions, theme, onAttackLog]);

  return (
    <div ref={containerRef} className="w-full h-full relative cursor-move">
      <canvas ref={canvasRef} className="block" />
    </div>
  );
};

export default PewPewGlobe;
