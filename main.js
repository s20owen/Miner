const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const ui = {
  title: document.getElementById("title-screen"),
  startBtn: document.getElementById("start-btn"),
  continueBtn: document.getElementById("continue-btn"),
  settingsBtn: document.getElementById("settings-btn"),
  quitBtn: document.getElementById("quit-btn"),
  settingsScreen: document.getElementById("settings-screen"),
  settingsCloseBtn: document.getElementById("settings-close-btn"),
  tipScreen: document.getElementById("tip-screen"),
  tipCloseBtn: document.getElementById("tip-close-btn"),
  hangarScreen: document.getElementById("hangar-screen"),
  resultsScreen: document.getElementById("results-screen"),
  hangarStatus: document.getElementById("hangar-status"),
  recentCargoValue: document.getElementById("recent-cargo-value"),
  hangarBankValue: document.getElementById("hangar-bank-value"),
  upgradeTree: document.getElementById("upgrade-tree"),
  resultsTitle: document.getElementById("results-title"),
  resultsSortieLabel: document.getElementById("results-sortie-label"),
  resultsMinedLabel: document.getElementById("results-mined-label"),
  resultsBlocks: document.getElementById("results-blocks"),
  resultsTotalHaul: document.getElementById("results-total-haul"),
  resultsBankTotal: document.getElementById("results-bank-total"),
  resultsBulletDamage: document.getElementById("results-bullet-damage"),
  resultsLaserDamage: document.getElementById("results-laser-damage"),
  resultsBulletShots: document.getElementById("results-bullet-shots"),
  resultsLaserPulses: document.getElementById("results-laser-pulses"),
  resultsOre: document.getElementById("results-ore"),
  resultsPlatinum: document.getElementById("results-platinum"),
  resultsCrystal: document.getElementById("results-crystal"),
  resultsPeakCargo: document.getElementById("results-peak-cargo"),
  resultsMap: document.getElementById("results-map"),
  resultsUpgradesBtn: document.getElementById("results-upgrades-btn"),
  resultsContinueBtn: document.getElementById("results-continue-btn"),
  bank: document.getElementById("bank-value"),
  cargo: document.getElementById("cargo-value"),
  sortie: document.getElementById("sortie-value"),
  fuelBar: document.getElementById("fuel-bar"),
  hpBar: document.getElementById("hp-bar"),
  dockBar: document.getElementById("dock-bar"),
  status: document.getElementById("status-text"),
  fuelAlert: document.getElementById("fuel-alert"),
  launchSortieBtn: document.getElementById("launch-sortie-btn"),
  moveStick: document.getElementById("move-stick"),
  aimStick: document.getElementById("aim-stick"),
  dashTouchBtn: document.getElementById("dash-touch-btn"),
  hudLeft: document.querySelector(".hud-left"),
  hudRight: document.querySelector(".hud-right"),
  mobileControls: document.querySelector(".mobile-controls"),
  statusBanner: document.querySelector(".status-banner"),
};

const BLOCK_SIZE = 18;
const PLANET_RADIUS_BLOCKS = 72;
const CORE_RADIUS_BLOCKS = 10;
const PLANET_RADIUS = PLANET_RADIUS_BLOCKS * BLOCK_SIZE;
const SHIP_RADIUS = 11;
const SAVE_KEY = "orbit-mine-save-v1";

const WEAPON_STATS = {
  blaster: { rate: 0.34, bulletSpeed: 780, shotFuel: 0.50, spread: 0.02, life: 0.5 },
  laser: { shotFuel: .65, range: 320, pulseDamage: 1.50, cooldown: 0.50, burstLife: 0.08 },
};

const MATERIAL_TYPES = ["ore", "platinum", "crystal"];

const audio = {
  ctx: null,
  master: null,
  enabled: true,
};

function cost(ore = 0, platinum = 0, crystal = 0) {
  return { ore, platinum, crystal };
}

const upgradeNodes = [
  { id: "hull1", x: 80, y: 90, label: "Hull Plate", symbol: "🛡", cost: cost(42), requires: [], effect: { hpMax: 10 } },
  { id: "hull2", x: 80, y: 240, label: "Impact Dampers", symbol: "⛨", cost: cost(56), requires: ["hull1"], effect: { collisionCostMult: 0.88 } },
  { id: "thrust1", x: 80, y: 390, label: "Thrusters", symbol: "▲", cost: cost(68), requires: ["hull2"], effect: { thrust: 14 } },
  { id: "dash1", x: 80, y: 540, label: "Dash Jets", symbol: "➜", cost: cost(82), requires: ["thrust1"], effect: { dash: true } },
  { id: "reactive1", x: 80, y: 690, label: "Reactive Weave", symbol: "🛡", cost: cost(108, 8), requires: ["dash1"], effect: { hpMax: 18 } },
  { id: "combatCore", x: 80, y: 840, label: "Crystal Dampers", symbol: "◈", cost: cost(138, 12, 4), requires: ["reactive1"], effect: { collisionCostMult: 0.74 } },

  { id: "fire1", x: 340, y: 90, label: "Fire Rate", symbol: "»", cost: cost(46), requires: [], effect: { rateMult: 0.94 } },
  { id: "drill1", x: 340, y: 240, label: "Bullet Force", symbol: "✦", cost: cost(62), requires: ["fire1"], effect: { bulletDamage: 0.5 } },
  { id: "laser", x: 340, y: 390, label: "Unlock Laser", symbol: "⚡", cost: cost(94), requires: ["drill1"], effect: { unlockLaser: true } },
  { id: "range1", x: 340, y: 540, label: "Range Boost", symbol: "⇢", cost: cost(106), requires: ["laser"], effect: { bulletLifeMult: 1.18 } },
  { id: "laser2", x: 340, y: 690, label: "Laser Focus", symbol: "◎", cost: cost(122, 10), requires: ["range1"], effect: { laserDamage: 1.32 } },
  { id: "splash2", x: 340, y: 840, label: "Crystal Array", symbol: "✹", cost: cost(148, 12, 4), requires: ["laser2"], effect: { splashRadius: 20, splashFalloff: 0.3, addLaser: { color: "#73f0ff", damageMult: 0.82 } } },

  { id: "fuel1", x: 600, y: 90, label: "Fuel Tank", symbol: "⛽", cost: cost(44), requires: [], effect: { fuelMax: 12 } },
  { id: "cargo1", x: 600, y: 240, label: "Cargo Rack", symbol: "◫", cost: cost(52), requires: ["fuel1"], effect: { cargoCap: 5 } },
  { id: "magnet1", x: 600, y: 390, label: "Magnet", symbol: "🧲", cost: cost(66), requires: ["cargo1"], effect: { magnet: 8 } },
  { id: "dock1", x: 600, y: 540, label: "Dock Clamp", symbol: "⌂", cost: cost(80), requires: ["magnet1"], effect: { dockRate: 1.18 } },
  { id: "cargo2", x: 600, y: 690, label: "Platinum Bins", symbol: "⬒", cost: cost(104, 8), requires: ["dock1"], effect: { cargoCap: 8 } },
  { id: "fuel2", x: 600, y: 840, label: "Crystal Reservoir", symbol: "◌", cost: cost(136, 10, 4), requires: ["cargo2"], effect: { fuelMax: 20 } },
];

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function isStandaloneDisplay() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

function syncViewportVars() {
  const viewport = window.visualViewport;
  const width = Math.round(viewport?.width || window.innerWidth || document.documentElement.clientWidth || 0);
  const height = Math.round(viewport?.height || window.innerHeight || document.documentElement.clientHeight || 0);
  document.documentElement.style.setProperty("--app-width", `${width}px`);
  document.documentElement.style.setProperty("--app-height", `${height}px`);
  document.body.classList.toggle("is-standalone", isStandaloneDisplay());
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function fmt(num) {
  if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return `${Math.floor(num)}`;
}

function emptyMaterials() {
  return { ore: 0, platinum: 0, crystal: 0 };
}

function sumCargo(cargo) {
  return MATERIAL_TYPES.reduce((sum, material) => sum + (cargo[material] || 0), 0);
}

function formatMaterials(materials) {
  const parts = [];
  for (const material of MATERIAL_TYPES) {
    if (materials[material]) parts.push(`${fmt(materials[material])} ${material}`);
  }
  return parts.length ? parts.join(" • ") : "0 ore";
}

function canAffordCost(bank, nodeCost) {
  return MATERIAL_TYPES.every((material) => (bank[material] || 0) >= (nodeCost[material] || 0));
}

function subtractCost(bank, nodeCost) {
  for (const material of MATERIAL_TYPES) {
    bank[material] -= nodeCost[material] || 0;
  }
}

function formatCost(nodeCost) {
  return formatMaterials(nodeCost);
}

function previewTextForNode(node, purchased) {
  const effect = node.effect;
  if (effect.cargoCap) {
    const before = purchased ? state.ship.cargoCap - effect.cargoCap : state.ship.cargoCap;
    const after = purchased ? state.ship.cargoCap : state.ship.cargoCap + effect.cargoCap;
    return `${before} -> ${after} cargo`;
  }
  if (effect.fuelMax) {
    const before = purchased ? state.ship.fuelMax - effect.fuelMax : state.ship.fuelMax;
    const after = purchased ? state.ship.fuelMax : state.ship.fuelMax + effect.fuelMax;
    return `${before} -> ${after} fuel`;
  }
  if (effect.hpMax) {
    const before = purchased ? state.ship.hpMax - effect.hpMax : state.ship.hpMax;
    const after = purchased ? state.ship.hpMax : state.ship.hpMax + effect.hpMax;
    return `${before} -> ${after} hull`;
  }
  if (effect.collisionCostMult) {
    const current = state.ship.collisionCostMult;
    const before = purchased ? current / effect.collisionCostMult : current;
    const after = purchased ? current : current * effect.collisionCostMult;
    return `${Math.round(before * 100)}% -> ${Math.round(after * 100)}% crash dmg`;
  }
  if (effect.magnet) {
    const before = purchased ? state.ship.magnet - effect.magnet : state.ship.magnet;
    const after = purchased ? state.ship.magnet : state.ship.magnet + effect.magnet;
    return `${before} -> ${after} magnet`;
  }
  if (effect.thrust) {
    const before = purchased ? state.ship.thrust - effect.thrust : state.ship.thrust;
    const after = purchased ? state.ship.thrust : state.ship.thrust + effect.thrust;
    return `${before} -> ${after} thrust`;
  }
  if (effect.bulletDamage) {
    const before = purchased ? state.ship.bulletDamage - effect.bulletDamage : state.ship.bulletDamage;
    const after = purchased ? state.ship.bulletDamage : state.ship.bulletDamage + effect.bulletDamage;
    return `${before.toFixed(1)} -> ${after.toFixed(1)} dmg`;
  }
  if (effect.bulletLifeMult) {
    const current = WEAPON_STATS.blaster.life * WEAPON_STATS.blaster.bulletSpeed * state.ship.bulletLifeMult;
    const before = purchased ? current / effect.bulletLifeMult : current;
    const after = purchased ? current : current * effect.bulletLifeMult;
    return `${Math.round(before)} -> ${Math.round(after)} range`;
  }
  if (effect.rateMult) {
    const current = WEAPON_STATS.blaster.rate * state.ship.rateMult;
    const before = purchased ? current / effect.rateMult : current;
    const after = purchased ? current : current * effect.rateMult;
    return `${before.toFixed(2)}s -> ${after.toFixed(2)}s`;
  }
  if (effect.dockRate) {
    const current = state.ship.dockRate;
    const before = purchased ? current / effect.dockRate : current;
    const after = purchased ? current : current * effect.dockRate;
    return `${before.toFixed(2)}x -> ${after.toFixed(2)}x dock`;
  }
  if (effect.laserDamage) {
    const current = state.ship.laserDamage;
    const before = purchased ? current / effect.laserDamage : current;
    const after = purchased ? current : current * effect.laserDamage;
    return `${before.toFixed(1)}x -> ${after.toFixed(1)}x laser`;
  }
  if (effect.laserFuelMult) {
    const current = state.ship.laserFuelMult;
    const before = purchased ? current / effect.laserFuelMult : current;
    const after = purchased ? current : current * effect.laserFuelMult;
    return `${before.toFixed(2)}x -> ${after.toFixed(2)}x fuel use`;
  }
  if (effect.oreMult) {
    const current = state.ship.oreMult;
    const before = purchased ? current / effect.oreMult : current;
    const after = purchased ? current : current * effect.oreMult;
    return `${before.toFixed(1)}x -> ${after.toFixed(1)}x ore`;
  }
  if (effect.splashRadius) {
    const before = purchased ? effect.splashRadius : state.ship.bulletSplashRadius;
    const after = purchased ? state.ship.bulletSplashRadius : effect.splashRadius;
    return `${before} -> ${after} aoe`;
  }
  if (effect.unlockLaser) return purchased ? "Laser online" : "Unlock laser";
  if (effect.addLaser) return purchased ? "Beam online" : "Add support beam";
  if (effect.dash) return purchased ? "Dash ready" : "Unlock dash";
  return purchased ? "Installed" : "Upgrade";
}

function noise2D(x, y) {
  const value = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123;
  return value - Math.floor(value);
}

function blockMaterialAt(depth, gx, gy) {
  const pocketNoise = noise2D(gx * 0.73, gy * 0.73);
  const crystalNoise = noise2D(gx * 1.13 + 41, gy * 1.13 - 19);

  if (depth > 0.92) return "crystal";
  if (depth > 0.8 && crystalNoise > 0.83) return "crystal";
  if (depth > 0.74) return "platinum";

  const lowerFirstLayerPocket = depth > 0.35 && depth < 0.46 && pocketNoise > 0.968;
  const midSecondLayerPocket = depth > 0.54 && depth < 0.66 && pocketNoise > 0.942;

  if (lowerFirstLayerPocket || midSecondLayerPocket) return "platinum";
  return "ore";
}

function makePlanet() {
  const blocks = [];
  const map = new Map();
  const destroyed = new Set(progress.destroyedBlocks || []);
  for (let gy = -PLANET_RADIUS_BLOCKS; gy <= PLANET_RADIUS_BLOCKS; gy += 1) {
    for (let gx = -PLANET_RADIUS_BLOCKS; gx <= PLANET_RADIUS_BLOCKS; gx += 1) {
      const dist = Math.hypot(gx, gy);
      if (dist > PLANET_RADIUS_BLOCKS || dist < CORE_RADIUS_BLOCKS) continue;
      const depth = 1 - (dist - CORE_RADIUS_BLOCKS) / (PLANET_RADIUS_BLOCKS - CORE_RADIUS_BLOCKS);
      const key = `${gx},${gy}`;
      const maxHp = depth > 0.74 ? 5 : depth > 0.46 ? 4 : 3;
      const material = blockMaterialAt(depth, gx, gy);
      const block = {
        gx,
        gy,
        x: gx * BLOCK_SIZE,
        y: gy * BLOCK_SIZE,
        key,
        maxHp,
        hp: destroyed.has(key) ? 0 : maxHp,
        oreValue: Math.round(2 + depth * 8),
        material,
        materialValue: 1,
        alive: !destroyed.has(key),
      };
      blocks.push(block);
      map.set(key, block);
    }
  }
  return { blocks, map, totalBlocks: blocks.length };
}

function defaultProgress() {
  return {
    bank: emptyMaterials(),
    sortie: 1,
    bestCargo: 0,
    lastDeliveredCargo: emptyMaterials(),
    lastSortieReport: null,
    destroyedBlocks: [],
    upgrades: {},
    lastStatus: "Start your first sortie.",
    hasSeenTip: false,
  };
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return defaultProgress();
    const merged = { ...defaultProgress(), ...JSON.parse(raw) };
    if (typeof merged.bankOre === "number" && (!merged.bank || typeof merged.bank !== "object")) {
      merged.bank = { ore: merged.bankOre, platinum: 0, crystal: 0 };
    }
    if (typeof merged.lastDeliveredCargo === "number") {
      merged.lastDeliveredCargo = { ore: merged.lastDeliveredCargo, platinum: 0, crystal: 0 };
    }
    merged.bank = { ...emptyMaterials(), ...(merged.bank || {}) };
    merged.lastDeliveredCargo = { ...emptyMaterials(), ...(merged.lastDeliveredCargo || {}) };
    merged.lastSortieReport = merged.lastSortieReport || null;
    return merged;
  } catch {
    return defaultProgress();
  }
}

const progress = loadProgress();

function ensureAudio() {
  if (audio.ctx) return audio.ctx;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  audio.ctx = new AudioCtx();
  audio.master = audio.ctx.createGain();
  audio.master.gain.value = 0.06;
  audio.master.connect(audio.ctx.destination);
  return audio.ctx;
}

function playTone({ freq = 440, duration = 0.08, type = "sine", gain = 0.4, slideTo = null }) {
  const ctx = ensureAudio();
  if (!ctx || !audio.enabled) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, now + duration);
  amp.gain.setValueAtTime(0.0001, now);
  amp.gain.exponentialRampToValueAtTime(gain, now + 0.01);
  amp.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.connect(amp);
  amp.connect(audio.master);
  osc.start(now);
  osc.stop(now + duration + 0.02);
}

function playUiClick() {
  playTone({ freq: 540, slideTo: 760, duration: 0.06, type: "triangle", gain: 0.28 });
}

function playShoot() {
  playTone({ freq: 220, slideTo: 120, duration: 0.05, type: "square", gain: 0.18 });
}

function playHit() {
  playTone({ freq: 120, slideTo: 70, duration: 0.09, type: "sawtooth", gain: 0.24 });
}

function playPickup(material = "ore") {
  playTone({
    freq: material === "crystal" ? 980 : material === "platinum" ? 880 : 700,
    slideTo: material === "crystal" ? 1380 : material === "platinum" ? 1120 : 860,
    duration: 0.07,
    type: "triangle",
    gain: 0.22,
  });
}

function playUnlock() {
  playTone({ freq: 380, slideTo: 680, duration: 0.11, type: "triangle", gain: 0.24 });
  window.setTimeout(() => {
    playTone({ freq: 760, slideTo: 980, duration: 0.08, type: "triangle", gain: 0.18 });
  }, 55);
}

function saveProgress() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(progress));
}

function makeSortieReport(success, delivered) {
  const minedPercent = (state.runStats.blocksMined / Math.max(1, state.planet.totalBlocks)) * 100;
  return {
    success,
    sortieNumber: progress.sortie,
    blocksMined: state.runStats.blocksMined,
    minedPercent,
    delivered: { ...emptyMaterials(), ...delivered },
    bankAfter: { ...progress.bank },
    bulletDamage: state.runStats.bulletDamage,
    laserDamage: state.runStats.laserDamage,
    bulletShots: state.runStats.bulletShots,
    laserPulses: state.runStats.laserPulses,
    peakCargo: state.runStats.peakCargo,
  };
}

function makeState() {
  const planet = makePlanet();
  const dockY = -PLANET_RADIUS - 220;
  const spawnY = dockY + 120;
  return {
    mode: "menu",
    time: 0,
    width: canvas.width,
    height: canvas.height,
    input: {
      moveX: 0,
      moveY: 0,
      aimX: 1,
      aimY: 0,
      firing: false,
      dashQueued: false,
      touchMoveX: 0,
      touchMoveY: 0,
      touchAimX: 1,
      touchAimY: 0,
      touchAimActive: false,
    },
    keys: new Set(),
    camera: { x: 0, y: spawnY - 75, zoom: 0.78 },
    planet,
    ship: {
      x: 0,
      y: spawnY,
      vx: 0,
      vy: 0,
      radius: SHIP_RADIUS,
      fuelMax: 120,
      fuel: 120,
      hpMax: 80,
      hp: 80,
      cargoCap: 28,
      cargo: emptyMaterials(),
      magnet: 56,
      thrust: 170,
      dashImpulse: 220,
      dashCooldown: 0,
      dockRate: 1,
      fireCooldown: 0,
      bulletDamage: 1,
      bulletLifeMult: 1,
      bulletSplashRadius: 0,
      bulletSplashFalloff: 0,
      rateMult: 1,
      hasLaser: false,
      laserDamage: 1,
      laserFuelMult: 1,
      laserCooldown: 0,
      lasers: [],
      oreMult: 1,
      collisionCostMult: 1,
      facingAngle: 0,
    },
    dock: {
      x: 0,
      y: dockY,
      radius: 72,
      timer: 0,
      needed: 3,
    },
    bullets: [],
    pickups: [],
    particles: [],
    damageShake: 0,
    wreckTimer: 0,
    wrecked: false,
    failMode: "",
    failMessage: "",
    failAngle: 0,
    laserBursts: [],
    hangarStatusUntil: 0,
    treeZoom: 0.72,
    hangarMessage: progress.lastStatus,
    backgroundStars: [],
    backgroundObjects: [],
    runStats: {
      blocksMined: 0,
      bulletShots: 0,
      bulletDamage: 0,
      laserPulses: 0,
      laserDamage: 0,
      materials: emptyMaterials(),
      peakCargo: 0,
    },
  };
}

const state = makeState();
const revealedTreeNodes = new Set();

function getCameraTarget() {
  const targetX = (state.ship.x + state.dock.x) * 0.5;
  const dist = Math.hypot(state.ship.x - state.dock.x, state.ship.y - state.dock.y);
  const desiredZoom = clamp(0.78 - dist / 4200, 0.48, 0.84);
  const baseTargetY = lerp(state.dock.y, state.ship.y, 0.68);
  const safeLowerScreenRatio = 0.72;
  const minCameraY = state.ship.y - ((safeLowerScreenRatio - 0.5) * state.height) / Math.max(desiredZoom, 0.001);
  const targetY = Math.max(baseTargetY, minCameraY);
  return { targetX, targetY, desiredZoom };
}

function rebuildBackgroundField() {
  state.backgroundStars = [];
  state.backgroundObjects = [];

  const starCount = Math.max(90, Math.round((state.width * state.height) / 17000));
  const objectCount = Math.max(12, Math.round((state.width * state.height) / 82000));

  for (let i = 0; i < starCount; i += 1) {
    state.backgroundStars.push({
      x: rand(0, state.width),
      y: rand(0, state.height),
      size: rand(1, 3.6),
      depth: rand(0.08, 0.34),
      pulse: rand(0.2, 1.3),
      color: Math.random() < 0.22 ? "88,223,255" : "255,255,255",
      alpha: rand(0.45, 0.95),
    });
  }

  for (let i = 0; i < objectCount; i += 1) {
    state.backgroundObjects.push({
      x: rand(0, state.width),
      y: rand(0, state.height),
      size: rand(10, 34),
      depth: rand(0.03, 0.12),
      drift: rand(0.08, 0.5),
      rotation: rand(0, Math.PI * 2),
      type: Math.random() < 0.5 ? "diamond" : "glow",
      alpha: rand(0.08, 0.22),
    });
  }
}

function snapCameraToTarget() {
  const cameraTarget = getCameraTarget();
  state.camera.x = cameraTarget.targetX;
  state.camera.y = cameraTarget.targetY;
  state.camera.zoom = cameraTarget.desiredZoom;
}

function applyUpgrades() {
  const ship = state.ship;
  ship.fuelMax = 120;
  ship.hpMax = 80;
  ship.cargoCap = 28;
  ship.magnet = 56;
  ship.thrust = 170;
  ship.dockRate = 1;
  ship.bulletDamage = 1;
  ship.bulletLifeMult = 1;
  ship.bulletSplashRadius = 0;
  ship.bulletSplashFalloff = 0;
  ship.rateMult = 1;
  ship.hasLaser = false;
  ship.laserDamage = 1;
  ship.laserFuelMult = 1;
  ship.laserCooldown = 0;
  ship.lasers = [];
  ship.oreMult = 1;
  ship.collisionCostMult = 1;

  for (const node of upgradeNodes) {
    if (!progress.upgrades[node.id]) continue;
    const effect = node.effect;
    if (effect.fuelMax) ship.fuelMax += effect.fuelMax;
    if (effect.hpMax) ship.hpMax += effect.hpMax;
    if (effect.cargoCap) ship.cargoCap += effect.cargoCap;
    if (effect.magnet) ship.magnet += effect.magnet;
    if (effect.thrust) ship.thrust += effect.thrust;
    if (effect.dockRate) ship.dockRate *= effect.dockRate;
    if (effect.bulletDamage) ship.bulletDamage += effect.bulletDamage;
    if (effect.bulletLifeMult) ship.bulletLifeMult *= effect.bulletLifeMult;
    if (effect.splashRadius) ship.bulletSplashRadius = Math.max(ship.bulletSplashRadius, effect.splashRadius);
    if (effect.splashFalloff) ship.bulletSplashFalloff = Math.max(ship.bulletSplashFalloff, effect.splashFalloff);
    if (effect.rateMult) ship.rateMult *= effect.rateMult;
    if (effect.unlockLaser) {
      ship.hasLaser = true;
      if (!ship.lasers.some((laser) => laser.id === "amber")) {
        ship.lasers.push({ id: "amber", color: "#fff1ac", damageMult: 1 });
      }
    }
    if (effect.laserDamage) ship.laserDamage *= effect.laserDamage;
    if (effect.laserFuelMult) ship.laserFuelMult *= effect.laserFuelMult;
    if (effect.addLaser && !ship.lasers.some((laser) => laser.color === effect.addLaser.color)) {
      ship.lasers.push({
        id: `laser-${ship.lasers.length + 1}`,
        color: effect.addLaser.color,
        damageMult: effect.addLaser.damageMult || 1,
      });
    }
    if (effect.oreMult) ship.oreMult *= effect.oreMult;
    if (effect.collisionCostMult) ship.collisionCostMult *= effect.collisionCostMult;
    if (effect.dash) ship.dashImpulse = 280;
  }
}

function resetSortie() {
  const fresh = makeState();
  Object.assign(state, fresh);
  applyUpgrades();
  state.ship.fuel = state.ship.fuelMax;
  state.ship.hp = state.ship.hpMax;
  snapCameraToTarget();
}

function startNewGame() {
  ensureAudio()?.resume?.();
  playUiClick();
  Object.assign(progress, defaultProgress());
  saveProgress();
  resetSortie();
  state.mode = "tip";
  state.hangarMessage = "Fresh contract accepted.";
  hideOverlays();
  ui.tipScreen.classList.add("visible");
  syncUi();
  resize();
  snapCameraToTarget();
  render();
}

function startSortie() {
  ensureAudio()?.resume?.();
  playUiClick();
  resetSortie();
  state.mode = "sortie";
  hideOverlays();
  syncUi();
  resize();
  snapCameraToTarget();
  render();
}

function sendToHangar(success) {
  state.mode = success ? "results" : "hangar";
  hideOverlays();
  const delivered = success ? state.ship.cargo : emptyMaterials();
  if (success) {
    for (const material of MATERIAL_TYPES) {
      progress.bank[material] += delivered[material] || 0;
    }
    progress.bestCargo = Math.max(progress.bestCargo, sumCargo(delivered));
    progress.lastDeliveredCargo = { ...emptyMaterials(), ...delivered };
    progress.lastSortieReport = makeSortieReport(true, delivered);
    showHangarStatus(`Dock successful. Delivered ${formatMaterials(delivered)} to the hangar bank.`);
    progress.sortie += 1;
  } else {
    progress.lastDeliveredCargo = emptyMaterials();
    progress.lastSortieReport = makeSortieReport(false, emptyMaterials());
    showHangarStatus("Sortie failed. Cargo was lost before docking.");
  }
  progress.hasSeenTip = true;
  saveProgress();
  syncUi();
}

function showSettings() {
  ensureAudio()?.resume?.();
  playUiClick();
  ui.settingsScreen.classList.add("visible");
}

function hideSettings() {
  playUiClick();
  ui.settingsScreen.classList.remove("visible");
}

function hideOverlays() {
  ui.title.classList.remove("visible");
  ui.tipScreen.classList.remove("visible");
  ui.settingsScreen.classList.remove("visible");
  ui.hangarScreen.classList.remove("visible");
  ui.resultsScreen.classList.remove("visible");
}

function showHangarScreen() {
  state.mode = "hangar";
  hideOverlays();
  ui.hangarScreen.classList.add("visible");
  renderUpgradeTree();
  syncUi();
}

function toggleHangar() {
  if (state.mode === "hangar") {
    ui.hangarScreen.classList.remove("visible");
    state.mode = "menu";
    ui.title.classList.add("visible");
  } else if (state.mode !== "sortie") {
    showHangarScreen();
  }
  syncUi();
}

function nodeUnlocked(node) {
  return node.requires.every((id) => progress.upgrades[id]);
}

function nodeVisible(node) {
  if (progress.upgrades[node.id]) return true;
  if (node.requires.length === 0) return true;
  return nodeUnlocked(node);
}

function showHangarStatus(message, duration = 3.6) {
  progress.lastStatus = message;
  state.hangarMessage = message;
  state.hangarStatusUntil = state.time + duration;
}

function getNodeTier(node) {
  if (node.cost.crystal) return "crystal";
  if (node.cost.platinum) return "platinum";
  return "ore";
}

function buyNode(id) {
  const node = upgradeNodes.find((entry) => entry.id === id);
  if (!node || progress.upgrades[id] || !nodeUnlocked(node) || !canAffordCost(progress.bank, node.cost)) return;
  subtractCost(progress.bank, node.cost);
  progress.upgrades[id] = true;
  showHangarStatus(`${node.label} installed.`);
  saveProgress();
  applyUpgrades();
  playUnlock();
  renderUpgradeTree();
  syncUi();
}

function renderUpgradeTree() {
  ui.upgradeTree.innerHTML = "";
  const canvasEl = document.createElement("div");
  canvasEl.className = "tree-canvas";
  const visibleNodes = upgradeNodes.filter(nodeVisible);
  const compactLandscape = window.matchMedia("(hover: none) and (pointer: coarse) and (orientation: landscape)").matches;
  const scale = compactLandscape ? state.treeZoom : 1;
  const nodeSize = 96 * scale;
  const nodeHalf = nodeSize / 2;
  const maxNodeX = visibleNodes.reduce((max, node) => Math.max(max, node.x), 0);
  const maxNodeY = visibleNodes.reduce((max, node) => Math.max(max, node.y), 0);
  const canvasWidth = Math.ceil((maxNodeX + 96 + 56) * scale);
  const canvasHeight = Math.ceil((maxNodeY + 96 + 56) * scale);
  canvasEl.style.width = `${canvasWidth}px`;
  canvasEl.style.height = `${canvasHeight}px`;
  canvasEl.style.setProperty("--tree-node-size", `${nodeSize}px`);
  if (compactLandscape) canvasEl.classList.add("compact");

  for (const node of visibleNodes) {
    if (!nodeVisible(node)) continue;
    for (const depId of node.requires) {
      const dep = upgradeNodes.find((entry) => entry.id === depId);
      if (!dep || !nodeVisible(dep)) continue;
      const dx = node.x - dep.x;
      const dy = node.y - dep.y;
      const distance = Math.hypot(dx, dy);
      const dirX = distance === 0 ? 0 : dx / distance;
      const dirY = distance === 0 ? 0 : dy / distance;
      const nodeInset = nodeHalf;
      const startX = dep.x * scale + nodeHalf + dirX * nodeInset;
      const startY = dep.y * scale + nodeHalf + dirY * nodeInset;
      const endX = node.x * scale + nodeHalf - dirX * nodeInset;
      const endY = node.y * scale + nodeHalf - dirY * nodeInset;
      const lineDx = endX - startX;
      const lineDy = endY - startY;
      const line = document.createElement("div");
      line.className = "tree-line";
      line.style.left = `${startX}px`;
      line.style.top = `${startY}px`;
      line.style.width = `${Math.max(0, Math.hypot(lineDx, lineDy))}px`;
      line.style.transform = `rotate(${Math.atan2(lineDy, lineDx)}rad)`;
      canvasEl.appendChild(line);
    }
  }
  for (const node of visibleNodes) {
    const button = document.createElement("button");
    const purchased = !!progress.upgrades[node.id];
    const unlocked = purchased || nodeUnlocked(node);
    const firstReveal = unlocked && !revealedTreeNodes.has(node.id);
    const tier = getNodeTier(node);
    button.className = `tree-node tier-${tier}${purchased ? " purchased" : ""}${unlocked ? "" : " locked"}${firstReveal ? " reveal" : ""}`;
    button.style.left = `${node.x * scale}px`;
    button.style.top = `${node.y * scale}px`;
    button.disabled = purchased || !unlocked || !canAffordCost(progress.bank, node.cost);
    button.innerHTML = `
      <div class="node-inner">
        <span class="symbol">${node.symbol}</span>
        <span class="name">${node.label}</span>
        <span class="preview">${previewTextForNode(node, purchased)}</span>
        <span class="cost">${purchased ? "Owned" : formatCost(node.cost)}</span>
      </div>
    `;
    button.addEventListener("click", () => buyNode(node.id));
    canvasEl.appendChild(button);
    if (unlocked) revealedTreeNodes.add(node.id);
  }
  ui.upgradeTree.appendChild(canvasEl);
}

function setupUpgradeTreeZoom() {
  let pinchDistance = 0;
  let pinchZoom = 0;

  ui.upgradeTree.addEventListener(
    "touchstart",
    (event) => {
      if (event.touches.length !== 2) return;
      const [a, b] = event.touches;
      pinchDistance = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      pinchZoom = state.treeZoom;
    },
    { passive: true },
  );

  ui.upgradeTree.addEventListener(
    "touchmove",
    (event) => {
      if (event.touches.length !== 2) return;
      const [a, b] = event.touches;
      const nextDistance = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      if (!pinchDistance) {
        pinchDistance = nextDistance;
        pinchZoom = state.treeZoom;
        return;
      }
      event.preventDefault();
      const ratio = nextDistance / pinchDistance;
      state.treeZoom = clamp(pinchZoom * ratio, 0.58, 0.95);
      renderUpgradeTree();
    },
    { passive: false },
  );

  ui.upgradeTree.addEventListener("touchend", () => {
    if (ui.upgradeTree.classList.contains("hidden")) return;
    pinchDistance = 0;
  });
}

function setupUpgradeTreePan() {
  let pointerId = null;
  let startX = 0;
  let startY = 0;
  let startScrollLeft = 0;
  let startScrollTop = 0;

  ui.upgradeTree.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if (event.target.closest(".tree-node")) return;
    pointerId = event.pointerId;
    startX = event.clientX;
    startY = event.clientY;
    startScrollLeft = ui.upgradeTree.scrollLeft;
    startScrollTop = ui.upgradeTree.scrollTop;
    ui.upgradeTree.setPointerCapture(pointerId);
  });

  ui.upgradeTree.addEventListener("pointermove", (event) => {
    if (pointerId !== event.pointerId) return;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    ui.upgradeTree.scrollLeft = startScrollLeft - dx;
    ui.upgradeTree.scrollTop = startScrollTop - dy;
  });

  function releasePan(event) {
    if (pointerId !== event.pointerId) return;
    pointerId = null;
  }

  ui.upgradeTree.addEventListener("pointerup", releasePan);
  ui.upgradeTree.addEventListener("pointercancel", releasePan);
}

function blockColor(block) {
  const visualHp = Math.max(1, Math.ceil(block.hp));
  if (block.material === "crystal") {
    return visualHp === block.maxHp ? "#ff78dd" : visualHp >= 4 ? "#d06cff" : visualHp === 3 ? "#ff9aef" : visualHp === 2 ? "#ffd24f" : "#67ff8a";
  }
  if (block.material === "platinum") {
    return visualHp === block.maxHp ? "#79e8ff" : visualHp >= 3 ? "#9dd9ff" : visualHp === 2 ? "#ffd24f" : "#67ff8a";
  }
  if (block.maxHp === 3) return visualHp === 3 ? "#ff5d49" : visualHp === 2 ? "#ffd24f" : "#67ff8a";
  if (block.maxHp === 4) return visualHp === 4 ? "#79d7ff" : visualHp === 3 ? "#ff5d49" : visualHp === 2 ? "#ffd24f" : "#67ff8a";
  return visualHp === 5 ? "#7e63ff" : visualHp === 4 ? "#79d7ff" : visualHp === 3 ? "#ff5d49" : visualHp === 2 ? "#ffd24f" : "#67ff8a";
}

function worldToScreen(x, y) {
  const shakeX = state.damageShake > 0 ? Math.sin(state.time * 70) * state.damageShake * 8 : 0;
  const shakeY = state.damageShake > 0 ? Math.cos(state.time * 85) * state.damageShake * 8 : 0;
  return {
    x: (x - state.camera.x) * state.camera.zoom + state.width / 2 + shakeX,
    y: (y - state.camera.y) * state.camera.zoom + state.height / 2 + shakeY,
  };
}

function screenToWorld(x, y) {
  return {
    x: (x - state.width / 2) / state.camera.zoom + state.camera.x,
    y: (y - state.height / 2) / state.camera.zoom + state.camera.y,
  };
}

function visibleWorldBounds() {
  const halfW = state.width / state.camera.zoom / 2;
  const halfH = state.height / state.camera.zoom / 2;
  return {
    left: state.camera.x - halfW - BLOCK_SIZE,
    right: state.camera.x + halfW + BLOCK_SIZE,
    top: state.camera.y - halfH - BLOCK_SIZE,
    bottom: state.camera.y + halfH + BLOCK_SIZE,
  };
}

function forEachBlockInBounds(bounds, visitor) {
  const minGX = Math.floor(bounds.left / BLOCK_SIZE);
  const maxGX = Math.floor(bounds.right / BLOCK_SIZE);
  const minGY = Math.floor(bounds.top / BLOCK_SIZE);
  const maxGY = Math.floor(bounds.bottom / BLOCK_SIZE);
  for (let gy = minGY; gy <= maxGY; gy += 1) {
    for (let gx = minGX; gx <= maxGX; gx += 1) {
      const block = state.planet.map.get(`${gx},${gy}`);
      if (!block || !block.alive) continue;
      visitor(block);
    }
  }
}

function nearestLaserTargets(maxCount) {
  const range = WEAPON_STATS.laser.range;
  const rangeSq = range * range;
  const candidates = [];
  const bounds = {
    left: state.ship.x - range,
    right: state.ship.x + range,
    top: state.ship.y - range,
    bottom: state.ship.y + range,
  };
  forEachBlockInBounds(bounds, (block) => {
    const dx = block.x - state.ship.x;
    const dy = block.y - state.ship.y;
    const distSq = dx * dx + dy * dy;
    if (distSq > rangeSq) return;
    candidates.push({ block, distSq });
  });
  candidates.sort((a, b) => a.distSq - b.distSq);
  return candidates.slice(0, maxCount).map((entry) => entry.block);
}

function pickupBlockDamage(block, damage) {
  if (!block || !block.alive) return false;
  block.hp -= damage;
  if (block.hp <= 0) {
    block.alive = false;
    state.runStats.blocksMined += 1;
    state.runStats.materials[block.material] += 1;
    if (!progress.destroyedBlocks.includes(block.key)) {
      progress.destroyedBlocks.push(block.key);
      saveProgress();
    }
    spawnPickup(block);
  }
  return true;
}

function recordDamage(source, amount) {
  if (source === "bullet") state.runStats.bulletDamage += amount;
  if (source === "laser") state.runStats.laserDamage += amount;
}

function applySplashDamage(x, y, directKey) {
  if (state.ship.bulletSplashRadius <= 0) return;
  const radius = state.ship.bulletSplashRadius;
  const minGX = Math.floor((x - radius) / BLOCK_SIZE);
  const maxGX = Math.floor((x + radius) / BLOCK_SIZE);
  const minGY = Math.floor((y - radius) / BLOCK_SIZE);
  const maxGY = Math.floor((y + radius) / BLOCK_SIZE);
  for (let gy = minGY; gy <= maxGY; gy += 1) {
    for (let gx = minGX; gx <= maxGX; gx += 1) {
      const key = `${gx},${gy}`;
      if (key === directKey) continue;
      const block = state.planet.map.get(key);
      if (!block || !block.alive) continue;
      const dist = Math.hypot(block.x - x, block.y - y);
      if (dist > radius) continue;
      const falloff = 1 - dist / radius;
      const splashDamage = state.ship.bulletDamage * state.ship.bulletSplashFalloff * falloff;
      if (splashDamage > 0.08) pickupBlockDamage(block, splashDamage);
    }
  }
  for (let i = 0; i < 8; i += 1) {
    state.particles.push({
      x,
      y,
      vx: rand(-140, 140),
      vy: rand(-140, 140),
      life: 0.35,
      color: "#ffb15c",
    });
  }
}

function spawnPickup(block) {
  const value = 1;
  const pickupColor = block.material === "crystal" ? "#b494ff" : block.material === "platinum" ? "#79d7ff" : "#ffd24f";
  state.pickups.push({
    x: block.x + rand(-6, 6),
    y: block.y + rand(-6, 6),
    vx: rand(-45, 45),
    vy: rand(-45, 45),
    value,
    material: block.material,
    life: 14,
  });
  for (let i = 0; i < 5; i += 1) {
    state.particles.push({
      x: block.x,
      y: block.y,
      vx: rand(-110, 110),
      vy: rand(-110, 110),
      life: 0.5,
      color: pickupColor,
    });
  }
}

function spawnShipExplosion() {
  for (let i = 0; i < 26; i += 1) {
    state.particles.push({
      x: state.ship.x,
      y: state.ship.y,
      vx: rand(-240, 240),
      vy: rand(-240, 240),
      life: rand(0.25, 0.65),
      color: i % 3 === 0 ? "#fff0b8" : i % 2 === 0 ? "#ff9d4d" : "#58dfff",
    });
  }
}

function beginFailureSequence(mode, message) {
  if (state.wrecked) return;
  state.wrecked = true;
  state.failMode = mode;
  state.failMessage = message;
  state.wreckTimer = mode === "fuel" ? 1.1 : 0.95;
  state.failAngle = Math.atan2(state.input.aimY, state.input.aimX);
  state.damageShake = mode === "damage" ? 1.3 : 0.65;
  if (mode === "damage") {
    spawnShipExplosion();
    state.ship.vx *= 0.45;
    state.ship.vy *= 0.45;
  } else {
    for (let i = 0; i < 14; i += 1) {
      state.particles.push({
        x: state.ship.x,
        y: state.ship.y,
        vx: rand(-90, 90),
        vy: rand(-90, 90),
        life: rand(0.2, 0.55),
        color: i % 2 === 0 ? "#58dfff" : "#ffd24f",
      });
    }
  }
  playHit();
}

function getMoveAxis() {
  let x = state.input.touchMoveX || 0;
  let y = state.input.touchMoveY || 0;
  if (state.keys.has("ArrowLeft") || state.keys.has("KeyA")) x -= 1;
  if (state.keys.has("ArrowRight") || state.keys.has("KeyD")) x += 1;
  if (state.keys.has("ArrowUp") || state.keys.has("KeyW")) y -= 1;
  if (state.keys.has("ArrowDown") || state.keys.has("KeyS")) y += 1;
  const len = Math.hypot(x, y) || 1;
  return { x: x / len, y: y / len, active: x !== 0 || y !== 0 };
}

function shipGridCells(x, y) {
  const minGX = Math.floor((x - SHIP_RADIUS) / BLOCK_SIZE);
  const maxGX = Math.floor((x + SHIP_RADIUS) / BLOCK_SIZE);
  const minGY = Math.floor((y - SHIP_RADIUS) / BLOCK_SIZE);
  const maxGY = Math.floor((y + SHIP_RADIUS) / BLOCK_SIZE);
  const cells = [];
  for (let gy = minGY; gy <= maxGY; gy += 1) {
    for (let gx = minGX; gx <= maxGX; gx += 1) {
      cells.push(`${gx},${gy}`);
    }
  }
  return cells;
}

function shipHitsBlock() {
  for (const key of shipGridCells(state.ship.x, state.ship.y)) {
    const block = state.planet.map.get(key);
    if (!block || !block.alive) continue;
    const dx = state.ship.x - block.x;
    const dy = state.ship.y - block.y;
    if (Math.abs(dx) < BLOCK_SIZE * 0.5 + SHIP_RADIUS && Math.abs(dy) < BLOCK_SIZE * 0.5 + SHIP_RADIUS) {
      return block;
    }
  }
  return null;
}

function spawnBullet() {
  const stats = WEAPON_STATS.blaster;
  const angleJitter = rand(-stats.spread, stats.spread);
  const cos = Math.cos(angleJitter);
  const sin = Math.sin(angleJitter);
  const dx = Math.cos(state.ship.facingAngle);
  const dy = Math.sin(state.ship.facingAngle);
  const dirX = dx * cos - dy * sin;
  const dirY = dx * sin + dy * cos;
  state.bullets.push({
    x: state.ship.x + dirX * 20,
    y: state.ship.y + dirY * 20,
    vx: dirX * stats.bulletSpeed,
    vy: dirY * stats.bulletSpeed,
    life: stats.life * state.ship.bulletLifeMult,
    damage: state.ship.bulletDamage,
  });
  state.runStats.bulletShots += 1;
  state.ship.fuel = Math.max(0, state.ship.fuel - stats.shotFuel);
  playShoot();
}

function failSortie(message) {
  state.hangarMessage = message;
  progress.lastStatus = message;
  saveProgress();
  sendToHangar(false);
}

function updateShip(dt) {
  const move = getMoveAxis();
  const ship = state.ship;
  if (Math.hypot(state.input.aimX, state.input.aimY) > 0.001) {
    ship.facingAngle = Math.atan2(state.input.aimY, state.input.aimX);
  }
  state.damageShake = Math.max(0, state.damageShake - dt * 5);
  if (state.wreckTimer > 0) {
    if (state.failMode === "damage") {
      state.failAngle += dt * 10;
      ship.vx += Math.cos(state.time * 32) * 180 * dt;
      ship.vy += Math.sin(state.time * 27) * 180 * dt;
      if (Math.random() < 0.35) {
        state.particles.push({
          x: ship.x + rand(-10, 10),
          y: ship.y + rand(-10, 10),
          vx: rand(-120, 120),
          vy: rand(-120, 120),
          life: rand(0.12, 0.28),
          color: Math.random() < 0.5 ? "#ff9d4d" : "#fff0b8",
        });
      }
    } else if (state.failMode === "fuel") {
      state.failAngle += dt * 2.6;
      ship.vx *= 0.985;
      ship.vy *= 0.985;
      ship.vx += Math.cos(state.time * 9) * 18 * dt;
      ship.vy += Math.sin(state.time * 7) * 12 * dt;
      if (Math.random() < 0.18) {
        state.particles.push({
          x: ship.x + rand(-8, 8),
          y: ship.y + rand(-8, 8),
          vx: rand(-55, 55),
          vy: rand(-55, 55),
          life: rand(0.14, 0.34),
          color: Math.random() < 0.6 ? "#58dfff" : "#8ea2b8",
        });
      }
    }
    ship.vx *= 0.92;
    ship.vy *= 0.92;
    ship.x += ship.vx * dt;
    ship.y += ship.vy * dt;
    return;
  }
  if (move.active) {
    ship.vx += move.x * ship.thrust * dt;
    ship.vy += move.y * ship.thrust * dt;
    ship.fuel = Math.max(0, ship.fuel - dt * 2.8);
  }
  if (state.input.dashQueued && ship.dashCooldown <= 0) {
    const dashX = move.active ? move.x : state.input.aimX;
    const dashY = move.active ? move.y : state.input.aimY;
    const dashLen = Math.hypot(dashX, dashY) || 1;
    ship.vx += (dashX / dashLen) * ship.dashImpulse;
    ship.vy += (dashY / dashLen) * ship.dashImpulse;
    ship.dashCooldown = 1.5;
    ship.fuel = Math.max(0, ship.fuel - 8);
  }
  state.input.dashQueued = false;
  ship.dashCooldown = Math.max(0, ship.dashCooldown - dt);

  ship.x += ship.vx * dt;
  ship.y += ship.vy * dt;
  ship.vx *= 0.985;
  ship.vy *= 0.985;

  const hit = shipHitsBlock();
  if (hit) {
    let pushX = ship.x - hit.x;
    let pushY = ship.y - hit.y;
    let pushLen = Math.hypot(pushX, pushY);
    if (pushLen < 0.001) {
      pushX = ship.vx !== 0 || ship.vy !== 0 ? ship.vx : ship.x;
      pushY = ship.vx !== 0 || ship.vy !== 0 ? ship.vy : ship.y - hit.y - 1;
      pushLen = Math.hypot(pushX, pushY) || 1;
    }
    pushX /= pushLen;
    pushY /= pushLen;
    const separation = BLOCK_SIZE * 0.5 + SHIP_RADIUS + 4;
    ship.x = hit.x + pushX * separation;
    ship.y = hit.y + pushY * separation;
    ship.hp = Math.max(0, ship.hp - dt * 68 * ship.collisionCostMult);
    ship.fuel = Math.max(0, ship.fuel - dt * 24 * lerp(1, ship.collisionCostMult, 0.8));
    const normalVelocity = ship.vx * pushX + ship.vy * pushY;
    if (normalVelocity < 0) {
      ship.vx -= pushX * normalVelocity;
      ship.vy -= pushY * normalVelocity;
    }
    ship.vx = ship.vx * 0.42 + pushX * 18;
    ship.vy = ship.vy * 0.42 + pushY * 18;
    state.damageShake = 1;
    playHit();
  }

  const distFromCenter = Math.hypot(ship.x, ship.y);
  if (distFromCenter > PLANET_RADIUS + 420) {
    const nx = ship.x / distFromCenter;
    const ny = ship.y / distFromCenter;
    ship.vx -= nx * 120 * dt;
    ship.vy -= ny * 120 * dt;
  }

  if (ship.hp <= 0 && !state.wrecked) {
    ship.hp = 0;
    beginFailureSequence("damage", "Ship was damaged too much and blew up.");
    return;
  }

  if (ship.fuel <= 0 && !state.wrecked) {
    ship.fuel = 0;
    beginFailureSequence("fuel", "Ship ran out of fuel and drifted dead in space.");
  }
}

function updateWeapons(dt) {
  const ship = state.ship;
  ship.fireCooldown = Math.max(0, ship.fireCooldown - dt);
  ship.laserCooldown = Math.max(0, ship.laserCooldown - dt);
  if (!state.input.firing) return;

  const rate = WEAPON_STATS.blaster.rate * ship.rateMult;
  if (ship.fireCooldown <= 0) {
    spawnBullet();
    ship.fireCooldown = rate;
  }

  if (ship.hasLaser && ship.lasers.length && ship.laserCooldown <= 0) {
    const availableTargets = nearestLaserTargets(ship.lasers.length);
    if (!availableTargets.length) return;

    const neededFuel = WEAPON_STATS.laser.shotFuel * ship.laserFuelMult * ship.lasers.length;
    if (ship.fuel < neededFuel) return;

    ship.fuel = Math.max(0, ship.fuel - neededFuel);
    ship.laserCooldown = WEAPON_STATS.laser.cooldown;
    state.runStats.laserPulses += ship.lasers.length;
    ship.lasers.forEach((laser, index) => {
      const targetBlock = availableTargets[Math.min(index, availableTargets.length - 1)];
      if (!targetBlock) return;
      const damage = WEAPON_STATS.laser.pulseDamage * ship.laserDamage * laser.damageMult;
      pickupBlockDamage(targetBlock, damage);
      recordDamage("laser", damage);
      state.laserBursts.push({
        sx: ship.x,
        sy: ship.y,
        tx: targetBlock.x,
        ty: targetBlock.y,
        color: laser.color,
        life: WEAPON_STATS.laser.burstLife,
      });
    });
  }
}

function updateBullets(dt) {
  for (const bullet of state.bullets) {
    bullet.life -= dt;
    const nextX = bullet.x + bullet.vx * dt;
    const nextY = bullet.y + bullet.vy * dt;
    const dx = nextX - bullet.x;
    const dy = nextY - bullet.y;
    const travel = Math.hypot(dx, dy);
    const steps = Math.max(1, Math.ceil(travel / (BLOCK_SIZE * 0.35)));
    let hit = false;

    for (let step = 1; step <= steps; step += 1) {
      const sampleX = bullet.x + (dx * step) / steps;
      const sampleY = bullet.y + (dy * step) / steps;
      const key = `${Math.floor(sampleX / BLOCK_SIZE)},${Math.floor(sampleY / BLOCK_SIZE)}`;
      const block = state.planet.map.get(key);
      if (block && block.alive && pickupBlockDamage(block, bullet.damage)) {
        recordDamage("bullet", bullet.damage);
        bullet.x = sampleX;
        bullet.y = sampleY;
        applySplashDamage(sampleX, sampleY, key);
        bullet.life = 0;
        hit = true;
        break;
      }
    }

    if (!hit) {
      bullet.x = nextX;
      bullet.y = nextY;
    }
  }
  state.bullets = state.bullets.filter((bullet) => bullet.life > 0);
}

function updatePickups(dt) {
  for (const pickup of state.pickups) {
    pickup.life -= dt;
    pickup.x += pickup.vx * dt;
    pickup.y += pickup.vy * dt;
    pickup.vx *= 0.98;
    pickup.vy *= 0.98;
    const dx = state.ship.x - pickup.x;
    const dy = state.ship.y - pickup.y;
    const dist = Math.hypot(dx, dy);
    if (dist < state.ship.magnet) {
      const pull = clamp(1 - dist / state.ship.magnet, 0, 1);
      pickup.vx += (dx / Math.max(dist, 1)) * pull * 240 * dt;
      pickup.vy += (dy / Math.max(dist, 1)) * pull * 240 * dt;
    }
    if (dist < SHIP_RADIUS + 8) {
      const cargoCount = sumCargo(state.ship.cargo);
      if (cargoCount < state.ship.cargoCap) {
        const room = state.ship.cargoCap - cargoCount;
        const gained = Math.min(room, pickup.value);
        state.ship.cargo[pickup.material] += gained;
        state.runStats.peakCargo = Math.max(state.runStats.peakCargo, sumCargo(state.ship.cargo));
        playPickup(pickup.material);
      }
      pickup.life = 0;
    }
  }
  state.pickups = state.pickups.filter((pickup) => pickup.life > 0);
}

function updateParticles(dt) {
  for (const particle of state.particles) {
    particle.life -= dt;
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.vx *= 0.93;
    particle.vy *= 0.93;
  }
  state.particles = state.particles.filter((particle) => particle.life > 0);
}

function updateLaserBursts(dt) {
  for (const burst of state.laserBursts) {
    burst.life -= dt;
  }
  state.laserBursts = state.laserBursts.filter((burst) => burst.life > 0);
}

function updateDocking(dt) {
  const dist = Math.hypot(state.ship.x - state.dock.x, state.ship.y - state.dock.y);
  if (dist < state.dock.radius) {
    state.dock.timer = clamp(state.dock.timer + dt * state.ship.dockRate, 0, state.dock.needed);
    state.ship.vx *= 0.92;
    state.ship.vy *= 0.92;
    if (state.dock.timer >= state.dock.needed) {
      sendToHangar(true);
    }
  } else {
    state.dock.timer = Math.max(0, state.dock.timer - dt * 0.7);
  }
}

function updateCamera(dt) {
  const { targetX, targetY, desiredZoom } = getCameraTarget();
  const shipScreen = worldToScreen(state.ship.x, state.ship.y);
  const dockScreen = worldToScreen(state.dock.x, state.dock.y);
  const offscreenMargin = 120;
  const shipOffscreen =
    shipScreen.x < -offscreenMargin ||
    shipScreen.x > state.width + offscreenMargin ||
    shipScreen.y < -offscreenMargin ||
    shipScreen.y > state.height + offscreenMargin;
  const dockOffscreen =
    dockScreen.x < -offscreenMargin ||
    dockScreen.x > state.width + offscreenMargin ||
    dockScreen.y < -offscreenMargin ||
    dockScreen.y > state.height + offscreenMargin;

  if (shipOffscreen || dockOffscreen || !Number.isFinite(state.camera.x) || !Number.isFinite(state.camera.y) || !Number.isFinite(state.camera.zoom)) {
    snapCameraToTarget();
    return;
  }

  state.camera.x = lerp(state.camera.x, targetX, 5 * dt);
  state.camera.y = lerp(state.camera.y, targetY, 5 * dt);
  state.camera.zoom = lerp(state.camera.zoom, desiredZoom, 3 * dt);
}

function updateStatusText() {
  if (state.mode === "sortie") {
    const cargoFull = sumCargo(state.ship.cargo) >= state.ship.cargoCap;
    if (state.dock.timer > 0) {
      ui.status.textContent = `Docking in ${Math.max(0, state.dock.needed - state.dock.timer).toFixed(1)}s`;
    } else if (state.wreckTimer > 0) {
      ui.status.textContent = state.failMode === "fuel" ? "Fuel depleted." : "Ship critical.";
    } else {
      ui.status.textContent = cargoFull
        ? "Cargo full. Return to the docking station to bank the haul."
        : "";
    }
  } else {
    ui.status.textContent = state.hangarMessage;
  }
}

function update(dt) {
  state.time += dt;
  updateParticles(dt);
  updateLaserBursts(dt);
  if (state.mode !== "sortie") {
    updateStatusText();
    syncUi();
    return;
  }
  if (state.wreckTimer > 0) {
    state.wreckTimer = Math.max(0, state.wreckTimer - dt);
    updateShip(dt);
    updateCamera(dt);
    if (state.wreckTimer <= 0) {
      if (state.failMode === "damage") {
        spawnShipExplosion();
      }
      failSortie(state.failMessage || "Ship was lost before docking. Cargo discarded.");
      return;
    }
    updateStatusText();
    syncUi();
    return;
  }
  updateShip(dt);
  updateWeapons(dt);
  updateBullets(dt);
  updatePickups(dt);
  updateDocking(dt);
  updateCamera(dt);
  updateStatusText();
  syncUi();
}

function drawBackground() {
  const g = ctx.createRadialGradient(state.width * 0.5, state.height * 0.44, 40, state.width * 0.5, state.height * 0.44, state.width * 0.7);
  g.addColorStop(0, "#13031a");
  g.addColorStop(0.6, "#07010d");
  g.addColorStop(1, "#030108");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, state.width, state.height);

  const offsetX = state.camera.x * 0.035;
  const offsetY = state.camera.y * 0.035;
  for (let i = 0; i < state.backgroundObjects.length; i += 1) {
    const obj = state.backgroundObjects[i];
    const x = (obj.x - offsetX * obj.depth * 7 + state.time * obj.drift * 3 + state.width * 3) % state.width;
    const y = (obj.y - offsetY * obj.depth * 7 + Math.sin(state.time * 0.08 + i) * 6 + state.height * 3) % state.height;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(obj.rotation + state.time * obj.drift * 0.05);
    if (obj.type === "diamond") {
      ctx.fillStyle = `rgba(88, 223, 255, ${obj.alpha})`;
      ctx.beginPath();
      ctx.arc(0, 0, obj.size * 0.52, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const orb = ctx.createRadialGradient(0, 0, 0, 0, 0, obj.size);
      orb.addColorStop(0, `rgba(255, 214, 132, ${obj.alpha})`);
      orb.addColorStop(0.45, `rgba(255, 130, 88, ${obj.alpha * 0.55})`);
      orb.addColorStop(1, "rgba(255, 90, 70, 0)");
      ctx.fillStyle = orb;
      ctx.beginPath();
      ctx.arc(0, 0, obj.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  for (let i = 0; i < state.backgroundStars.length; i += 1) {
    const star = state.backgroundStars[i];
    const x = (star.x - offsetX * star.depth * 18 + state.width * 3) % state.width;
    const y = (star.y - offsetY * star.depth * 18 + state.height * 3) % state.height;
    const alpha = star.alpha * (0.72 + Math.sin(state.time * star.pulse + i * 0.37) * 0.16);
    ctx.fillStyle = `rgba(${star.color}, ${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, star.size * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawDock() {
  const dock = worldToScreen(state.dock.x, state.dock.y);
  const radius = state.dock.radius * state.camera.zoom;
  ctx.beginPath();
  ctx.arc(dock.x, dock.y, radius, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(88,223,255,0.85)";
  ctx.lineWidth = 3;
  ctx.shadowColor = "#58dfff";
  ctx.shadowBlur = 18;
  ctx.stroke();
  ctx.shadowBlur = 0;

  const arm = 10;
  const gap = 5;
  ctx.strokeStyle = "#8ff0ff";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(dock.x - arm, dock.y - arm);
  ctx.lineTo(dock.x - gap, dock.y - arm);
  ctx.lineTo(dock.x - gap, dock.y - gap);
  ctx.moveTo(dock.x + arm, dock.y - arm);
  ctx.lineTo(dock.x + gap, dock.y - arm);
  ctx.lineTo(dock.x + gap, dock.y - gap);
  ctx.moveTo(dock.x - arm, dock.y + arm);
  ctx.lineTo(dock.x - gap, dock.y + arm);
  ctx.lineTo(dock.x - gap, dock.y + gap);
  ctx.moveTo(dock.x + arm, dock.y + arm);
  ctx.lineTo(dock.x + gap, dock.y + arm);
  ctx.lineTo(dock.x + gap, dock.y + gap);
  ctx.stroke();

  ctx.fillStyle = "#8ff0ff";
  ctx.fillRect(dock.x - 4, dock.y - 4, 8, 8);
}

function drawPlanetBlocks() {
  const bounds = visibleWorldBounds();
  forEachBlockInBounds(bounds, (block) => {
    const left = block.x - BLOCK_SIZE * 0.5;
    const top = block.y - BLOCK_SIZE * 0.5;
    const screen = worldToScreen(left, top);
    const size = BLOCK_SIZE * state.camera.zoom;
    ctx.fillStyle = blockColor(block);
    ctx.fillRect(screen.x, screen.y, size, size);
    ctx.strokeStyle = ctx.fillStyle;
    ctx.lineWidth = 1;
    ctx.strokeRect(screen.x, screen.y, size, size);
    if (block.material === "platinum") {
      ctx.strokeStyle = "rgba(149, 239, 255, 0.82)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(screen.x + size * 0.2, screen.y + size * 0.2);
      ctx.lineTo(screen.x + size * 0.8, screen.y + size * 0.8);
      ctx.moveTo(screen.x + size * 0.8, screen.y + size * 0.2);
      ctx.lineTo(screen.x + size * 0.2, screen.y + size * 0.8);
      ctx.stroke();
    } else if (block.material === "crystal") {
      ctx.strokeStyle = "rgba(255, 180, 255, 0.9)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(screen.x + size * 0.5, screen.y + size * 0.12);
      ctx.lineTo(screen.x + size * 0.88, screen.y + size * 0.5);
      ctx.lineTo(screen.x + size * 0.5, screen.y + size * 0.88);
      ctx.lineTo(screen.x + size * 0.12, screen.y + size * 0.5);
      ctx.closePath();
      ctx.stroke();
    }
  });
}

function drawBullets() {
  ctx.fillStyle = "#fff2b3";
  for (const bullet of state.bullets) {
    const screen = worldToScreen(bullet.x, bullet.y);
    ctx.beginPath();
    ctx.arc(screen.x, screen.y, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawLaser() {
  for (const burst of state.laserBursts) {
    const start = worldToScreen(burst.sx, burst.sy);
    const end = worldToScreen(burst.tx, burst.ty);
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = burst.color;
    ctx.lineWidth = 4;
    ctx.shadowColor = burst.color;
    ctx.shadowBlur = 20;
    ctx.globalAlpha = clamp(burst.life / WEAPON_STATS.laser.burstLife, 0.28, 1);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }
}

function drawPickups() {
  for (const pickup of state.pickups) {
    const screen = worldToScreen(pickup.x, pickup.y);
    ctx.beginPath();
    ctx.arc(screen.x, screen.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = pickup.material === "crystal" ? "#b494ff" : pickup.material === "platinum" ? "#79d7ff" : "#ffd24f";
    ctx.fill();
  }
}

function drawParticles() {
  for (const particle of state.particles) {
    const screen = worldToScreen(particle.x, particle.y);
    ctx.globalAlpha = clamp(particle.life * 2, 0, 1);
    ctx.fillStyle = particle.color;
    ctx.fillRect(screen.x, screen.y, 2, 2);
  }
  ctx.globalAlpha = 1;
}

function drawShip() {
  const ship = worldToScreen(state.ship.x, state.ship.y);
  const angle = state.wreckTimer > 0 ? state.failAngle : state.ship.facingAngle;
  const alpha = state.failMode === "fuel" && state.wreckTimer > 0 ? clamp(state.wreckTimer / 1.1, 0.35, 1) : 1;
  ctx.save();
  ctx.translate(ship.x, ship.y);
  ctx.rotate(angle + Math.PI / 2);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "#89f3ff";
  ctx.shadowColor = "#58dfff";
  ctx.shadowBlur = 18;
  ctx.beginPath();
  ctx.moveTo(0, -14);
  ctx.lineTo(10, 12);
  ctx.lineTo(0, 7);
  ctx.lineTo(-10, 12);
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.restore();
}

function drawCoreGlow() {
  const center = worldToScreen(0, 0);
  const radius = CORE_RADIUS_BLOCKS * BLOCK_SIZE * state.camera.zoom;
  const g = ctx.createRadialGradient(center.x, center.y, 4, center.x, center.y, radius);
  g.addColorStop(0, "#fff3bf");
  g.addColorStop(0.55, "#ff7b47");
  g.addColorStop(1, "rgba(255,123,71,0.04)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
  ctx.fill();
}

function render() {
  drawBackground();
  drawCoreGlow();
  drawPlanetBlocks();
  drawDock();
  drawPickups();
  drawBullets();
  drawLaser();
  drawParticles();
  drawShip();
}

function drawResultsMap(report) {
  const mapCanvas = ui.resultsMap;
  if (!mapCanvas || !report) return;
  const mapCtx = mapCanvas.getContext("2d");
  const size = mapCanvas.width;
  mapCtx.clearRect(0, 0, size, size);
  mapCtx.save();
  mapCtx.translate(size / 2, size / 2);
  mapCtx.beginPath();
  mapCtx.arc(0, 0, size * 0.42, 0, Math.PI * 2);
  mapCtx.clip();

  const fill = mapCtx.createRadialGradient(0, 0, size * 0.04, 0, 0, size * 0.42);
  fill.addColorStop(0, "rgba(220, 156, 58, 0.86)");
  fill.addColorStop(0.18, "rgba(156, 183, 93, 0.76)");
  fill.addColorStop(0.56, "rgba(91, 184, 232, 0.78)");
  fill.addColorStop(1, "rgba(68, 164, 214, 0.94)");
  mapCtx.fillStyle = fill;
  mapCtx.fillRect(-size / 2, -size / 2, size, size);

  const slices = [
    { start: 2.1, end: 4.1, color: "rgba(176, 175, 97, 0.34)" },
    { start: 0.35, end: 2.2, color: "rgba(134, 183, 104, 0.24)" },
  ];
  for (const slice of slices) {
    mapCtx.beginPath();
    mapCtx.moveTo(0, 0);
    mapCtx.arc(0, 0, size * 0.42, slice.start, slice.end);
    mapCtx.closePath();
    mapCtx.fillStyle = slice.color;
    mapCtx.fill();
  }

  mapCtx.beginPath();
  mapCtx.arc(0, 0, size * 0.095, 0, Math.PI * 2);
  mapCtx.fillStyle = "rgba(203, 145, 50, 0.6)";
  mapCtx.fill();

  for (let i = 0; i < 1500; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * size * 0.41;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    mapCtx.fillStyle = Math.random() < 0.94 ? "rgba(210, 247, 255, 0.22)" : "rgba(255, 93, 73, 0.48)";
    mapCtx.fillRect(x, y, 1, 1);
  }

  for (let i = 0; i < 16; i += 1) {
    const angle = (i / 16) * Math.PI * 2 + 0.28;
    const radius = size * (0.12 + (i % 5) * 0.06);
    mapCtx.beginPath();
    mapCtx.arc(Math.cos(angle) * radius, Math.sin(angle) * radius, 2.2, 0, Math.PI * 2);
    mapCtx.fillStyle = "rgba(255, 86, 61, 0.8)";
    mapCtx.fill();
  }
  mapCtx.restore();
}

function renderResultsScreen() {
  const report = progress.lastSortieReport;
  if (!report) return;
  ui.resultsTitle.textContent = report.success ? "Return Complete" : "Sortie Lost";
  ui.resultsSortieLabel.textContent = `Sortie #${report.sortieNumber}`;
  ui.resultsMinedLabel.textContent = `Mining ${report.minedPercent.toFixed(1)}%`;
  ui.resultsBlocks.textContent = fmt(report.blocksMined);
  ui.resultsTotalHaul.textContent = formatMaterials(report.delivered);
  ui.resultsBankTotal.textContent = formatMaterials(report.bankAfter);
  ui.resultsBulletDamage.textContent = fmt(report.bulletDamage);
  ui.resultsLaserDamage.textContent = fmt(report.laserDamage);
  ui.resultsBulletShots.textContent = fmt(report.bulletShots);
  ui.resultsLaserPulses.textContent = fmt(report.laserPulses);
  ui.resultsOre.textContent = fmt(report.delivered.ore || 0);
  ui.resultsPlatinum.textContent = fmt(report.delivered.platinum || 0);
  ui.resultsCrystal.textContent = fmt(report.delivered.crystal || 0);
  ui.resultsPeakCargo.textContent = fmt(report.peakCargo);
  drawResultsMap(report);
}

function syncUi() {
  ui.bank.textContent = formatMaterials(progress.bank);
  ui.cargo.textContent = `${fmt(sumCargo(state.ship.cargo))} / ${fmt(state.ship.cargoCap)}`;
  ui.sortie.textContent = `#${progress.sortie}`;
  const fuelRatio = state.ship.fuel / state.ship.fuelMax;
  ui.fuelBar.style.width = `${fuelRatio * 100}%`;
  ui.hpBar.style.width = `${(state.ship.hp / state.ship.hpMax) * 100}%`;
  ui.dockBar.style.width = `${(state.dock.timer / state.dock.needed) * 100}%`;
  ui.fuelBar.parentElement?.classList.toggle("low", fuelRatio <= 0.18);
  ui.recentCargoValue.textContent = formatMaterials(progress.lastDeliveredCargo);
  ui.hangarBankValue.textContent = formatMaterials(progress.bank);
  ui.hangarStatus.textContent = progress.lastStatus;
  ui.hangarStatus.classList.toggle("hidden", state.mode !== "hangar" || state.time > state.hangarStatusUntil);
  ui.continueBtn.disabled = progress.sortie === 1 && sumCargo(progress.bank) === 0 && Object.keys(progress.upgrades).length === 0;
  const inGameplay = state.mode === "sortie";
  const inMenu = !inGameplay && state.mode !== "hangar" && state.mode !== "tip" && state.mode !== "results";
  const inHangar = state.mode === "hangar";
  const inResults = state.mode === "results";
  if (inResults) renderResultsScreen();
  ui.hudLeft.classList.toggle("hidden", !inGameplay);
  ui.hudRight.classList.toggle("hidden", !inGameplay);
  ui.mobileControls.classList.toggle("hidden", !inGameplay);
  ui.statusBanner.classList.toggle("hidden", !inGameplay || !ui.status.textContent);
  ui.fuelAlert.classList.toggle("hidden", !inGameplay || fuelRatio > 0.18);
  ui.title.classList.toggle("visible", inMenu);
  ui.hangarScreen.classList.toggle("visible", inHangar);
  ui.tipScreen.classList.toggle("visible", state.mode === "tip");
  ui.resultsScreen.classList.toggle("visible", inResults);
}

function resize() {
  syncViewportVars();
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  state.width = rect.width;
  state.height = rect.height;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  rebuildBackgroundField();
}

canvas.addEventListener("mousemove", (event) => {
  const rect = canvas.getBoundingClientRect();
  const world = screenToWorld(event.clientX - rect.left, event.clientY - rect.top);
  state.input.aimX = world.x - state.ship.x;
  state.input.aimY = world.y - state.ship.y;
});

canvas.addEventListener("mousedown", () => {
  ensureAudio()?.resume?.();
  state.input.firing = true;
});

window.addEventListener("mouseup", () => {
  state.input.firing = false;
});

window.addEventListener("keydown", (event) => {
  ensureAudio()?.resume?.();
  state.keys.add(event.code);
  if (event.code === "Space") {
    state.input.dashQueued = true;
    event.preventDefault();
  }
  if (event.code === "Enter") {
    if (state.mode === "menu") {
      if (progress.hasSeenTip) startSortie();
      else ui.tipScreen.classList.add("visible");
    } else if (state.mode === "hangar") {
      startSortie();
    } else if (state.mode === "results") {
      showHangarScreen();
    } else if (state.mode === "tip") {
      startSortie();
    }
  }
  if (event.code === "Tab") {
    if (state.mode !== "sortie") toggleHangar();
    event.preventDefault();
  }
  if (event.code === "KeyF") {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen?.();
  }
});

window.addEventListener("keyup", (event) => {
  state.keys.delete(event.code);
});

ui.startBtn.addEventListener("click", startNewGame);
ui.continueBtn.addEventListener("click", () => {
  playUiClick();
  showHangarScreen();
  resize();
  render();
});
ui.settingsBtn.addEventListener("click", showSettings);
ui.settingsCloseBtn.addEventListener("click", hideSettings);
ui.quitBtn.addEventListener("click", () => {
  playUiClick();
  state.mode = "menu";
  hideOverlays();
  syncUi();
  resize();
  render();
});
ui.tipCloseBtn.addEventListener("click", () => {
  playUiClick();
  ui.tipScreen.classList.remove("visible");
  startSortie();
});
ui.launchSortieBtn.addEventListener("click", () => {
  playUiClick();
  startSortie();
});
ui.resultsUpgradesBtn.addEventListener("click", () => {
  playUiClick();
  showHangarScreen();
});
ui.resultsContinueBtn.addEventListener("click", () => {
  playUiClick();
  startSortie();
});

function setupStick(element, { onMove, onStart, onEnd }) {
  const knob = element.querySelector(".stick-knob");
  let pointerId = null;
  function reset() {
    pointerId = null;
    knob.style.transform = "translate(-50%, -50%)";
    onEnd?.();
  }
  function update(clientX, clientY) {
    const rect = element.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = clientX - cx;
    const dy = clientY - cy;
    const maxDist = rect.width * 0.28;
    const dist = Math.hypot(dx, dy) || 1;
    const clamped = Math.min(dist, maxDist);
    const x = (dx / dist) * (clamped / maxDist);
    const y = (dy / dist) * (clamped / maxDist);
    knob.style.transform = `translate(calc(-50% + ${x * maxDist}px), calc(-50% + ${y * maxDist}px))`;
    onMove(x, y);
  }
  element.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    ensureAudio()?.resume?.();
    pointerId = event.pointerId;
    element.setPointerCapture(pointerId);
    onStart?.();
    update(event.clientX, event.clientY);
  });
  element.addEventListener("pointermove", (event) => {
    if (pointerId !== event.pointerId) return;
    event.preventDefault();
    update(event.clientX, event.clientY);
  });
  element.addEventListener("pointerup", (event) => {
    if (pointerId !== event.pointerId) return;
    event.preventDefault();
    reset();
  });
  element.addEventListener("pointercancel", (event) => {
    event.preventDefault();
    reset();
  });
}

setupStick(ui.moveStick, {
  onMove: (x, y) => {
    state.input.touchMoveX = x;
    state.input.touchMoveY = y;
  },
  onEnd: () => {
    state.input.touchMoveX = 0;
    state.input.touchMoveY = 0;
  },
});

setupStick(ui.aimStick, {
  onStart: () => {
    state.input.touchAimActive = true;
    state.input.firing = true;
  },
  onMove: (x, y) => {
    state.input.touchAimX = x;
    state.input.touchAimY = y;
    state.input.aimX = x;
    state.input.aimY = y;
  },
  onEnd: () => {
    state.input.touchAimActive = false;
    state.input.firing = false;
  },
});

ui.dashTouchBtn.addEventListener("click", () => {
  ensureAudio()?.resume?.();
  playUiClick();
  state.input.dashQueued = true;
});

function blockIOSGameGestures() {
  const targets = [
    canvas,
    ui.mobileControls,
    ui.moveStick,
    ui.aimStick,
    ui.dashTouchBtn,
  ].filter(Boolean);

  for (const element of targets) {
    element.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });

    element.addEventListener(
      "touchstart",
      (event) => {
        event.preventDefault();
      },
      { passive: false },
    );

    element.addEventListener(
      "touchmove",
      (event) => {
        event.preventDefault();
      },
      { passive: false },
    );

    element.addEventListener(
      "gesturestart",
      (event) => {
        event.preventDefault();
      },
      { passive: false },
    );
  }
}

blockIOSGameGestures();

window.render_game_to_text = () =>
  JSON.stringify({
    coordinateSystem: "world centered on planet core, screen origin top-left",
    mode: state.mode,
    ship: {
      x: Math.round(state.ship.x),
      y: Math.round(state.ship.y),
      fuel: Number(state.ship.fuel.toFixed(1)),
      hp: Number(state.ship.hp.toFixed(1)),
      cargo: state.ship.cargo,
      cargoCap: state.ship.cargoCap,
      laserOnline: state.ship.hasLaser,
    },
    dock: {
      x: state.dock.x,
      y: state.dock.y,
      timer: Number(state.dock.timer.toFixed(2)),
    },
    economy: {
      bank: progress.bank,
      sortie: progress.sortie,
    },
    pickups: state.pickups.length,
    bullets: state.bullets.length,
    visibleBlocksEstimate: state.planet.blocks.filter((block) => {
      if (!block.alive) return false;
      const bounds = visibleWorldBounds();
      const left = block.x - BLOCK_SIZE * 0.5;
      const top = block.y - BLOCK_SIZE * 0.5;
      return !(left > bounds.right || left + BLOCK_SIZE < bounds.left || top > bounds.bottom || top + BLOCK_SIZE < bounds.top);
    }).length,
  });

window.advanceTime = async (ms) => {
  const steps = Math.max(1, Math.round(ms / (1000 / 60)));
  const dt = ms / steps / 1000;
  for (let i = 0; i < steps; i += 1) update(dt);
  render();
};

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.033, (now - last) / 1000);
  last = now;
  update(dt);
  render();
  requestAnimationFrame(frame);
}

resize();
applyUpgrades();
renderUpgradeTree();
setupUpgradeTreeZoom();
setupUpgradeTreePan();
syncUi();
requestAnimationFrame(frame);
window.addEventListener("resize", () => {
  resize();
  syncUi();
  if (state.mode === "sortie") snapCameraToTarget();
  if (state.mode === "hangar") renderUpgradeTree();
  render();
});
window.addEventListener("orientationchange", () => {
  window.setTimeout(() => {
    resize();
    syncUi();
    if (state.mode === "sortie") snapCameraToTarget();
    if (state.mode === "hangar") renderUpgradeTree();
    render();
  }, 120);
});
window.addEventListener("pageshow", () => {
  resize();
  syncUi();
  render();
});
window.visualViewport?.addEventListener("resize", resize);
window.visualViewport?.addEventListener("scroll", resize);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").then((registration) => {
      registration.update().catch(() => {});
    }).catch(() => {});
  });
}
