
// Major cities/hubs to ensure attacks start/end on land
// [longitude, latitude]
export const MAJOR_CITIES: [number, number][] = [
  [-74.006, 40.7128],   // New York
  [-118.2437, 34.0522], // Los Angeles
  [-122.4194, 37.7749], // San Francisco
  [-87.6298, 41.8781],  // Chicago
  [-0.1276, 51.5074],   // London
  [2.3522, 48.8566],    // Paris
  [13.4050, 52.5200],   // Berlin
  [37.6173, 55.7558],   // Moscow
  [139.6917, 35.6895],  // Tokyo
  [126.9780, 37.5665],  // Seoul
  [116.4074, 39.9042],  // Beijing
  [121.4737, 31.2304],  // Shanghai
  [72.8777, 19.0760],   // Mumbai
  [77.2090, 28.6139],   // New Delhi
  [151.2093, -33.8688], // Sydney
  [-43.1729, -22.9068], // Rio de Janeiro
  [-46.6333, -23.5505], // Sao Paulo
  [-58.3816, -34.6037], // Buenos Aires
  [31.2357, 30.0444],   // Cairo
  [28.0473, -26.2041],  // Johannesburg
  [55.2708, 25.2048],   // Dubai
  [103.8198, 1.3521],   // Singapore
  [-79.3832, 43.6532],  // Toronto
  [-123.1207, 49.2827], // Vancouver
  [12.4964, 41.9028],   // Rome
  [-3.7038, 40.4168],   // Madrid
  [4.9041, 52.3676],    // Amsterdam
  [18.0686, 59.3293],   // Stockholm
  [30.5234, 50.4501],   // Kyiv
  [34.7818, 32.0853],   // Tel Aviv
  [106.8456, -6.2088],  // Jakarta
  [100.5018, 13.7563],  // Bangkok
  [-99.1332, 19.4326],  // Mexico City
  [-77.0369, 38.9072],  // Washington DC
  [-80.1918, 25.7617],  // Miami
  [-122.3321, 47.6062], // Seattle
  [-71.0589, 42.3601],  // Boston
  [6.1432, 46.2044],    // Geneva
  [8.5417, 47.3769],    // Zurich
  [127.5623, 35.1595],  // Busan
  [120.9842, 14.5995],  // Manila
  [105.8342, 21.0278],  // Hanoi
  [-70.6693, -33.4489], // Santiago
  [-74.0721, 4.7110],   // Bogota
  [36.8219, -1.2921],   // Nairobi
  [3.3792, 6.5244],     // Lagos
  [67.0011, 24.8607],   // Karachi
  [51.3890, 35.6892],   // Tehran
  [46.6753, 24.7136],   // Riyadh
  [28.9784, 41.0082],   // Istanbul
  [-73.5673, 45.5017],  // Montreal
  [-95.3698, 29.7604],  // Houston
  [-77.0428, -12.0464], // Lima
  [-7.5898, 33.5731],   // Casablanca
  [38.7444, 9.0320],    // Addis Ababa
  [90.4125, 23.8103],   // Dhaka
  [135.5023, 34.6937],  // Osaka
  [144.9631, -37.8136], // Melbourne
  [174.7633, -36.8485], // Auckland
  [16.3738, 48.2082],   // Vienna
  [21.0122, 52.2297],   // Warsaw
  [23.7275, 37.9838],   // Athens
  [24.9384, 60.1699],   // Helsinki
  [10.7522, 59.9139],   // Oslo
  [12.5683, 55.6761],   // Copenhagen
  [-9.1393, 38.7223],   // Lisbon
  [-6.2603, 53.3498],   // Dublin
  [4.3517, 50.8503],    // Brussels
  [14.4378, 50.0755],   // Prague
  [19.0402, 47.4979]    // Budapest
];

export const getRandomLandCoord = (restrictToMajorCities: boolean = true): [number, number] => {
  if (restrictToMajorCities) {
    return MAJOR_CITIES[Math.floor(Math.random() * MAJOR_CITIES.length)];
  } else {
    // Random coordinate roughly within inhabited latitudes
    return [
      (Math.random() * 360) - 180,
      (Math.random() * 130) - 60
    ];
  }
};

export const getAttackColor = (type: string): string => {
  switch (type) {
    case 'ddos': return '#ef4444'; // Red-500
    case 'malware': return '#22c55e'; // Green-500
    case 'phishing': return '#eab308'; // Yellow-500
    case 'exploit': return '#d946ef'; // Fuchsia-500
    default: return '#3b82f6'; // Blue-500
  }
};

const ATTACK_TECHNIQUES = {
  ddos: ['SYN Flood', 'UDP Flood', 'NTP Amp', 'HTTP Flood', 'Slowloris', 'DNS Amp', 'Smurf Attack'],
  malware: ['Ransomware', 'Trojan', 'Spyware', 'Rootkit', 'Worm', 'Keylogger', 'Botnet Activity'],
  phishing: ['Spear Phish', 'Whaling', 'Smishing', 'Clone Phish', 'BEC', 'Evil Twin'],
  exploit: ['SQL Injection', 'XSS', 'Zero-Day RCE', 'Buffer Overflow', 'MITM', 'Brute Force', 'Priv Escalation']
};

const COMMON_PORTS = [80, 443, 22, 21, 25, 53, 3389, 8080, 445, 1433, 3306, 5432, 6379, 27017];

const generateIP = () => {
  return `${Math.floor(Math.random() * 223) + 1}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
};

export const generateAttack = (restrictToMajorCities: boolean = true): any => {
  const types = ['ddos', 'malware', 'phishing', 'exploit'] as const;
  const type = types[Math.floor(Math.random() * types.length)];
  const isCritical = Math.random() > 0.8;
  const viaSatellite = Math.random() > 0.7;

  const techniques = ATTACK_TECHNIQUES[type];
  const technique = techniques[Math.floor(Math.random() * techniques.length)];
  const port = COMMON_PORTS[Math.floor(Math.random() * COMMON_PORTS.length)];

  // Ensure source and target are different
  let source = getRandomLandCoord(restrictToMajorCities);
  let target = getRandomLandCoord(restrictToMajorCities);

  // Simple distance check to avoid same-city attacks (approximate)
  while (Math.abs(source[0] - target[0]) < 0.1 && Math.abs(source[1] - target[1]) < 0.1) {
    target = getRandomLandCoord(restrictToMajorCities);
  }

  return {
    id: Math.random().toString(36).substr(2, 9),
    source: source,
    target: target,
    sourceIp: generateIP(),
    targetIp: generateIP(),
    technique: technique,
    port: port,
    progress: 0,
    speed: 0.005 + Math.random() * 0.01,
    color: getAttackColor(type),
    type: type,
    critical: isCritical,
    viaSatellite: viaSatellite
  };
};
