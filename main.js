const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const ui = {
  title: document.getElementById("title-screen"),
  menuCacheBadge: document.getElementById("menu-cache-badge"),
  startBtn: document.getElementById("start-btn"),
  continueBtn: document.getElementById("continue-btn"),
  settingsBtn: document.getElementById("settings-btn"),
  quitBtn: document.getElementById("quit-btn"),
  settingsScreen: document.getElementById("settings-screen"),
  qualityProfileDetail: document.getElementById("quality-profile-detail"),
  qualityBatteryBtn: document.getElementById("quality-battery-btn"),
  qualityBalancedBtn: document.getElementById("quality-balanced-btn"),
  qualityPerformanceBtn: document.getElementById("quality-performance-btn"),
  fpsOffBtn: document.getElementById("fps-off-btn"),
  fpsOnBtn: document.getElementById("fps-on-btn"),
  settingsCloseBtn: document.getElementById("settings-close-btn"),
  tipScreen: document.getElementById("tip-screen"),
  tipStep: document.getElementById("tip-step"),
  tipTitle: document.getElementById("tip-title"),
  tipBodyA: document.getElementById("tip-body-a"),
  tipBodyB: document.getElementById("tip-body-b"),
  tipCloseBtn: document.getElementById("tip-close-btn"),
  hangarScreen: document.getElementById("hangar-screen"),
  resultsScreen: document.getElementById("results-screen"),
  hangarStatus: document.getElementById("hangar-status"),
  recentCargoValue: document.getElementById("recent-cargo-value"),
  recentSortieDetail: document.getElementById("recent-sortie-detail"),
  hangarBankValue: document.getElementById("hangar-bank-value"),
  hangarBankDetail: document.getElementById("hangar-bank-detail"),
  hangarPlanetValue: document.getElementById("hangar-planet-value"),
  hangarPlanetDetail: document.getElementById("hangar-planet-detail"),
  hangarSectorValue: document.getElementById("hangar-sector-value"),
  hangarSectorDetail: document.getElementById("hangar-sector-detail"),
  hangarCompletionValue: document.getElementById("hangar-completion-value"),
  hangarCoreValue: document.getElementById("hangar-core-value"),
  hangarContractName: document.getElementById("hangar-contract-name"),
  hangarContractDetail: document.getElementById("hangar-contract-detail"),
  hangarContractYield: document.getElementById("hangar-contract-yield"),
  hangarContractPressure: document.getElementById("hangar-contract-pressure"),
  hangarUpgradeGrid: document.getElementById("hangar-upgrade-grid"),
  hangarNextUpgrade: document.getElementById("hangar-next-upgrade"),
  planetPrevBtn: document.getElementById("planet-prev-btn"),
  planetNextBtn: document.getElementById("planet-next-btn"),
  upgradeTree: document.getElementById("upgrade-tree"),
  resultsTitle: document.getElementById("results-title"),
  resultsSortieLabel: document.getElementById("results-sortie-label"),
  resultsMinedLabel: document.getElementById("results-mined-label"),
  resultsBlocks: document.getElementById("results-blocks"),
  resultsTotalHaul: document.getElementById("results-total-haul"),
  resultsBankTotal: document.getElementById("results-bank-total"),
  resultsOre: document.getElementById("results-ore"),
  resultsPlatinum: document.getElementById("results-platinum"),
  resultsCrystal: document.getElementById("results-crystal"),
  resultsPeakCargo: document.getElementById("results-peak-cargo"),
  resultsPlanet: document.getElementById("results-planet"),
  resultsSector: document.getElementById("results-sector"),
  resultsCompletion: document.getElementById("results-completion"),
  resultsCoreStatus: document.getElementById("results-core-status"),
  resultsMap: document.getElementById("results-map"),
  resultsUpgradesBtn: document.getElementById("results-upgrades-btn"),
  resultsContinueBtn: document.getElementById("results-continue-btn"),
  bank: document.getElementById("bank-value"),
  bankOre: document.getElementById("bank-ore-value"),
  bankPlatinum: document.getElementById("bank-platinum-value"),
  bankCrystal: document.getElementById("bank-crystal-value"),
  cargo: document.getElementById("cargo-value"),
  sortie: document.getElementById("sortie-value"),
  fuelBar: document.getElementById("fuel-bar"),
  hpBar: document.getElementById("hp-bar"),
  dockBar: document.getElementById("dock-bar"),
  status: document.getElementById("status-text"),
  fuelAlert: document.getElementById("fuel-alert"),
  fpsCounter: document.getElementById("fps-counter"),
  launchSortieBtn: document.getElementById("launch-sortie-btn"),
  sellOreBtn: document.getElementById("sell-ore-btn"),
  sellPlatinumBtn: document.getElementById("sell-platinum-btn"),
  sellCrystalBtn: document.getElementById("sell-crystal-btn"),
  sellAllBtn: document.getElementById("sell-all-btn"),
  hangarTradeDetail: document.getElementById("hangar-trade-detail"),
  showUpgradesBtn: document.getElementById("show-upgrades-btn"),
  showResearchBtn: document.getElementById("show-research-btn"),
  researchTree: document.getElementById("research-tree"),
  moveStick: document.getElementById("move-stick"),
  aimStick: document.getElementById("aim-stick"),
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
const SAVE_VERSION = 2;
const IS_MOBILE = /iPhone|iPad|Android|Mobile/i.test(navigator.userAgent || "");

const QUALITY_PROFILES = {
  battery: {
    label: "Battery",
    description: "30 FPS, capped resolution, leaner effects.",
    fps: 30,
    dprCap: 1.25,
    particleCap: 60,
    screenShake: false,
    dynamicLights: false,
    backgroundStars: 50,
    backgroundObjects: 8,
  },
  balanced: {
    label: "Balanced",
    description: "Balanced battery and visuals.",
    fps: 45,
    dprCap: 1.5,
    particleCap: 120,
    screenShake: true,
    dynamicLights: false,
    backgroundStars: 100,
    backgroundObjects: 16,
  },
  performance: {
    label: "Performance",
    description: "Full frame rate and heavier neon effects.",
    fps: 60,
    dprCap: 2,
    particleCap: 240,
    screenShake: true,
    dynamicLights: true,
    backgroundStars: 180,
    backgroundObjects: 28,
  },
};

const WEAPON_STATS = {
  blaster: { rate: 0.34, bulletSpeed: 780, shotFuel: 0.50, spread: 0.02, life: 0.5 },
  laser: { shotFuel: .65, range: 320, pulseDamage: 1.50, cooldown: 0.50, burstLife: 0.08 },
};

const TIPS = [
  {
    title: "Flight Controls",
    bodyA: "Use thrusters to orbit the planet, line up your aim, and chew through the outer crust before diving deeper.",
    bodyB: "On desktop, move with WASD or arrows and aim with the mouse. On mobile, the left stick moves and the right stick aims and fires.",
  },
  {
    title: "Mining and Cargo",
    bodyA: "Destroyed blocks eject ore, platinum, or crystal pickups. Fly through them to load your cargo hold before anything drifts away.",
    bodyB: "Each contract has a different resource bias, so check the hangar contract panel when you want bulk ore or richer platinum and crystal routes.",
  },
  {
    title: "Danger",
    bodyA: "Crashing into blocks, sitting in hazards, or running out of fuel costs hull, fuel, and sometimes the whole sortie.",
    bodyB: "Cargo full? Mining can continue, but extra materials are wasted until you dock and store what you already collected.",
  },
  {
    title: "Extraction",
    bodyA: "Return to the docking ring above the planet and hold position for 3 seconds to extract safely and transfer cargo into the hangar hold.",
    bodyB: "Sell stored samples for credits, and spend rare samples in Research to unlock new systems and contracts.",
  },
];

const MATERIAL_TYPES = ["ore", "platinum", "crystal"];
const MATERIAL_SALE_VALUES = {
  ore: 12,
  platinum: 36,
  crystal: 84,
};

const SECTORS = [
  {
    id: "surface",
    name: "Surface",
    kind: "mining",
    minDepth: 0,
    maxDepth: 0.228,
    primaryMaterial: "ore",
    completionTarget: 0.5,
    hazardLabel: "defense ring",
    hazardType: "debris",
    hpWeights: [2, 3, 3, 4],
    ringColor: "rgba(255, 168, 96, 0.16)",
  },
  {
    id: "industrial",
    name: "Industrial Ore Band",
    kind: "mining",
    minDepth: 0.228,
    maxDepth: 0.48,
    primaryMaterial: "platinum",
    completionTarget: 0.58,
    hazardLabel: "heat vents",
    hazardType: "vent",
    hpWeights: [3, 3, 4, 4],
    ringColor: "rgba(255, 214, 92, 0.12)",
  },
  {
    id: "crystalFault",
    name: "Crystal Fault",
    kind: "mining",
    minDepth: 0.48,
    maxDepth: 0.76,
    primaryMaterial: "crystal",
    completionTarget: 0.62,
    hazardLabel: "electric discharge",
    hazardType: "zap",
    hpWeights: [5, 6, 6, 7],
    ringColor: "rgba(166, 120, 255, 0.12)",
  },
  {
    id: "coreShell",
    name: "Core Shell",
    kind: "mining",
    minDepth: 0.76,
    maxDepth: 1,
    primaryMaterial: "crystal",
    completionTarget: 0.68,
    hazardLabel: "gravity pulse",
    hazardType: "gravity",
    hpWeights: [6, 7, 7, 8],
    ringColor: "rgba(255, 96, 96, 0.14)",
  },
  {
    id: "coreEvent",
    name: "Core Event",
    kind: "event",
    completionTarget: 1,
    ringColor: "rgba(255, 196, 92, 0.24)",
  },
];

const PLANETS = [
  {
    id: "vesper-1",
    name: "Vesper-1",
    sectors: ["surface", "industrial", "crystalFault", "coreShell", "coreEvent"],
    nextPlanetId: "vesper-2",
    threatLabel: "Threat I",
    contractDetail: "Stable ore bands",
    materialBias: { ore: 1.3, platinum: 0.92, crystal: 0.82 },
    coreReward: { ore: 2, platinum: 8, crystal: 16 },
    blockHpBonus: 0,
    coreHp: 92,
    hazardRateMult: 1,
    sectorCompletionMult: 1,
  },
  {
    id: "vesper-2",
    name: "Vesper-2",
    sectors: ["surface", "industrial", "crystalFault", "coreShell", "coreEvent"],
    placeholder: true,
    threatLabel: "Threat II",
    contractDetail: "Dense shell • faster hazards",
    materialBias: { ore: 0.82, platinum: 1.22, crystal: 1.35 },
    coreReward: { ore: 0, platinum: 12, crystal: 24 },
    blockHpBonus: 1,
    coreHp: 124,
    hazardRateMult: 0.84,
    sectorCompletionMult: 1.12,
  },
];

const SECTOR_BY_ID = Object.fromEntries(SECTORS.map((sector) => [sector.id, sector]));
const PLANET_BY_ID = Object.fromEntries(PLANETS.map((planet) => [planet.id, planet]));
const DEFAULT_PLANET_ID = PLANETS[0].id;

const audio = {
  ctx: null,
  master: null,
  enabled: true,
};

function cost(ore = 0, platinum = 0, crystal = 0) {
  return ore * MATERIAL_SALE_VALUES.ore + platinum * MATERIAL_SALE_VALUES.platinum + crystal * MATERIAL_SALE_VALUES.crystal;
}

function researchCost(ore = 0, platinum = 0, crystal = 0) {
  return { ore, platinum, crystal };
}

function defaultQualityProfileId() {
  return IS_MOBILE ? "balanced" : "performance";
}

function sanitizeQualityProfile(profileId) {
  return QUALITY_PROFILES[profileId] ? profileId : defaultQualityProfileId();
}

const upgradeNodes = [
  { id: "hull1", x: 80, y: 90, label: "Hull Plate", lane: "Survival", symbol: "🛡", cost: cost(42), requires: [], effect: { hpMax: 10 } },
  { id: "hull2", x: 80, y: 240, label: "Impact Dampers", lane: "Survival", symbol: "⛨", cost: cost(56), requires: ["hull1"], effect: { collisionCostMult: 0.88 } },
  { id: "thrust1", x: 80, y: 390, label: "Thrusters", lane: "Mobility / Docking", symbol: "▲", cost: cost(68), requires: ["hull2"], effect: { thrust: 14 } },
  { id: "engineEco1", x: 80, y: 540, label: "Engine Efficiency", lane: "Mobility / Docking", symbol: "◌", cost: cost(82), requires: ["thrust1"], effect: { thrustFuelMult: 0.9 } },
  { id: "reactive1", x: 80, y: 690, label: "Reactive Weave", lane: "Survival", symbol: "🛡", cost: cost(108, 8), requires: ["engineEco1"], effect: { hpMax: 18 } },
  { id: "combatCore", x: 80, y: 840, label: "Crystal Dampers", lane: "Survival", symbol: "◈", cost: cost(122, 18, 8), requires: ["reactive1"], effect: { collisionCostMult: 0.74 } },
  { id: "hull3", x: 80, y: 990, label: "Reinforced Spine", lane: "Survival", symbol: "⛨", cost: cost(132, 22, 10), requires: ["combatCore"], effect: { hpMax: 12 } },
  { id: "thrust2", x: 80, y: 1140, label: "Vector Thrusters", lane: "Mobility / Docking", symbol: "▲", cost: cost(142, 26, 12), requires: ["hull3"], effect: { thrust: 18 } },
  { id: "engineEco2", x: 80, y: 1290, label: "Reaction Routing", lane: "Mobility / Docking", symbol: "◌", cost: cost(150, 32, 14), requires: ["thrust2"], effect: { thrustFuelMult: 0.9 } },
  { id: "dock2", x: 80, y: 1440, label: "Approach Thralls", lane: "Mobility / Docking", symbol: "⌂", cost: cost(158, 38, 16), requires: ["engineEco2"], effect: { dockRate: 1.15 } },
  { id: "reactive2", x: 80, y: 1590, label: "Reactive Spine", lane: "Survival", symbol: "🛡", cost: cost(166, 44, 18), requires: ["dock2"], effect: { collisionCostMult: 0.9 } },
  { id: "thrust3", x: 80, y: 1740, label: "Afterburn Coils", lane: "Mobility / Docking", symbol: "▲", cost: cost(174, 50, 22), requires: ["reactive2"], effect: { thrust: 22 } },
  { id: "engineEco3", x: 80, y: 1890, label: "Impulse Saver", lane: "Mobility / Docking", symbol: "◌", cost: cost(182, 56, 26), requires: ["thrust3"], effect: { thrustFuelMult: 0.88 } },
  { id: "hull4", x: 80, y: 2040, label: "Aegis Plating", lane: "Survival Mk II", symbol: "🛡", unlockPlanet: "vesper-2", researchId: "mk2Blueprints", cost: cost(72, 88, 52), requires: ["engineEco3"], effect: { hpMax: 16 } },
  { id: "reactive3", x: 80, y: 2190, label: "Shock Baffles", lane: "Survival Mk II", symbol: "⛨", unlockPlanet: "vesper-2", researchId: "mk2Blueprints", cost: cost(84, 102, 64), requires: ["hull4"], effect: { collisionCostMult: 0.86 } },
  { id: "hull5", x: 80, y: 2340, label: "Bastion Hull", lane: "Survival Mk II", symbol: "🛡", unlockPlanet: "vesper-2", researchId: "deepCoreOptics", cost: cost(96, 118, 78), requires: ["reactive3"], effect: { hpMax: 20 } },

  { id: "fire1", x: 340, y: 90, label: "Fire Rate", lane: "Combat: Fire Rate", symbol: "»", cost: cost(46), requires: [], effect: { rateMult: 0.94 } },
  { id: "drill1", x: 340, y: 210, label: "Bullet Force", lane: "Combat: AOE / Advanced", symbol: "✦", cost: cost(62), requires: ["fire1"], effect: { bulletDamage: 0.56 } },
  { id: "drill2", x: 340, y: 330, label: "Rifled Payloads", lane: "Combat: AOE / Advanced", symbol: "✦", cost: cost(70), requires: ["drill1"], effect: { bulletDamage: 0.18 } },
  { id: "blasterEco1", x: 340, y: 450, label: "Ammo Economy", lane: "Combat: Fire Rate", symbol: "◌", cost: cost(86), requires: ["drill2"], effect: { blasterFuelMult: 0.88 } },
  { id: "laser", x: 340, y: 570, label: "Unlock Laser", lane: "Combat: Range", symbol: "⚡", researchId: "laserTheory", cost: cost(94), requires: ["blasterEco1"], effect: { unlockLaser: true } },
  { id: "range1", x: 340, y: 690, label: "Range Boost", lane: "Combat: Range", symbol: "⇢", cost: cost(106), requires: ["laser"], effect: { bulletLifeMult: 1.18 } },
  { id: "drill3", x: 340, y: 810, label: "Dense Slugs", lane: "Combat: AOE / Advanced", symbol: "✦", cost: cost(110, 12, 4), requires: ["range1"], effect: { bulletDamage: 0.22 } },
  { id: "laser2", x: 340, y: 930, label: "Laser Focus", lane: "Combat: AOE / Advanced", symbol: "◎", cost: cost(114, 16, 6), requires: ["drill3"], effect: { laserDamage: 1.32 } },
  { id: "drill4", x: 340, y: 1050, label: "Kinetic Feed", lane: "Combat: AOE / Advanced", symbol: "✦", cost: cost(118, 20, 8), requires: ["laser2"], effect: { bulletDamage: 0.22 } },
  { id: "fire2", x: 340, y: 1170, label: "Cycler Core", lane: "Combat: Fire Rate", symbol: "»", cost: cost(122, 24, 10), requires: ["drill4"], effect: { rateMult: 0.95 } },
  { id: "splash2", x: 340, y: 1290, label: "Crystal Array", lane: "Combat: AOE / Advanced", symbol: "✹", researchId: "arrayTheory", cost: cost(126, 28, 12), requires: ["fire2"], effect: { splashRadius: 20, splashFalloff: 0.3, addLaser: { color: "#73f0ff", damageMult: 0.82 } } },
  { id: "drill5", x: 340, y: 1410, label: "Pressure Rounds", lane: "Combat: AOE / Advanced", symbol: "✦", cost: cost(132, 32, 12), requires: ["splash2"], effect: { bulletDamage: 0.2 } },
  { id: "blasterEco2", x: 340, y: 1530, label: "Recycled Charges", lane: "Combat: Fire Rate", symbol: "◌", cost: cost(138, 36, 14), requires: ["drill5"], effect: { blasterFuelMult: 0.9 } },
  { id: "range2", x: 340, y: 1650, label: "Long Barrel", lane: "Combat: Range", symbol: "⇢", cost: cost(144, 40, 14), requires: ["blasterEco2"], effect: { bulletLifeMult: 1.12 } },
  { id: "drill6", x: 340, y: 1770, label: "Ablative Tips", lane: "Combat: AOE / Advanced", symbol: "✦", cost: cost(150, 44, 16), requires: ["range2"], effect: { bulletDamage: 0.2 } },
  { id: "laserFuel1", x: 340, y: 1890, label: "Beam Recycler", lane: "Combat: AOE / Advanced", symbol: "◌", cost: cost(156, 48, 18), requires: ["drill6"], effect: { laserFuelMult: 0.92 } },
  { id: "drill7", x: 340, y: 2010, label: "Corebreaker Slugs", lane: "Combat: AOE / Advanced", symbol: "✦", cost: cost(162, 52, 20), requires: ["laserFuel1"], effect: { bulletDamage: 0.22 } },
  { id: "fire3", x: 340, y: 2130, label: "Accelerant Feed", lane: "Combat: Fire Rate", symbol: "»", cost: cost(168, 56, 24), requires: ["drill7"], effect: { rateMult: 0.96 } },
  { id: "drill8", x: 340, y: 2250, label: "Mass Driver", lane: "Combat: AOE / Advanced", symbol: "✦", cost: cost(174, 60, 28), requires: ["fire3"], effect: { bulletDamage: 0.22 } },
  { id: "laserFuel2", x: 340, y: 2370, label: "Prism Recycler", lane: "Combat: AOE / Advanced", symbol: "◌", cost: cost(180, 66, 32), requires: ["drill8"], effect: { laserFuelMult: 0.9 } },
  { id: "splash3", x: 340, y: 2490, label: "Shock Bloom", lane: "Combat: AOE / Advanced", symbol: "✹", cost: cost(186, 72, 36), requires: ["laserFuel2"], effect: { splashRadius: 28, splashFalloff: 0.34 } },
  { id: "drill9", x: 340, y: 2610, label: "Siege Payloads", lane: "Combat: AOE / Advanced", symbol: "✦", cost: cost(192, 78, 40), requires: ["splash3"], effect: { bulletDamage: 0.24 } },
  { id: "fire4", x: 340, y: 2730, label: "Burst Cyclers", lane: "Combat: Fire Rate", symbol: "»", cost: cost(198, 84, 46), requires: ["drill9"], effect: { rateMult: 0.96 } },
  { id: "splash4", x: 340, y: 2850, label: "Nova Array", lane: "Combat: AOE / Advanced", symbol: "✹", cost: cost(206, 92, 54), requires: ["fire4"], effect: { splashRadius: 36, splashFalloff: 0.38 } },
  { id: "fire5", x: 340, y: 2970, label: "Overdrive Feed", lane: "Combat Mk II", symbol: "»", unlockPlanet: "vesper-2", researchId: "mk2Blueprints", cost: cost(76, 104, 58), requires: ["splash4"], effect: { rateMult: 0.96 } },
  { id: "drill10", x: 340, y: 3090, label: "Planetcracker", lane: "Combat Mk II", symbol: "✦", unlockPlanet: "vesper-2", researchId: "mk2Blueprints", cost: cost(88, 118, 72), requires: ["fire5"], effect: { bulletDamage: 0.24 } },
  { id: "laser3", x: 340, y: 3210, label: "Prism Lance", lane: "Combat Mk II", symbol: "◎", unlockPlanet: "vesper-2", researchId: "deepCoreOptics", cost: cost(96, 132, 86), requires: ["drill10"], effect: { laserDamage: 1.22 } },

  { id: "fuel1", x: 600, y: 90, label: "Fuel Tank", lane: "Cargo / Collection", symbol: "⛽", cost: cost(44), requires: [], effect: { fuelMax: 12 } },
  { id: "cargo1", x: 600, y: 210, label: "Cargo Rack", lane: "Cargo / Collection", symbol: "◫", cost: cost(52), requires: ["fuel1"], effect: { cargoCap: 5 } },
  { id: "magnet1", x: 600, y: 330, label: "Magnet", lane: "Cargo / Collection", symbol: "🧲", cost: cost(66), requires: ["cargo1"], effect: { magnet: 8 } },
  { id: "dock1", x: 600, y: 450, label: "Dock Clamp", lane: "Mobility / Docking", symbol: "⌂", cost: cost(80), requires: ["magnet1"], effect: { dockRate: 1.18 } },
  { id: "cargo2", x: 600, y: 570, label: "Platinum Bins", lane: "Cargo / Collection", symbol: "⬒", cost: cost(98, 12, 2), requires: ["dock1"], effect: { cargoCap: 9 } },
  { id: "fuel2", x: 600, y: 690, label: "Crystal Reservoir", lane: "Cargo / Collection", symbol: "⛽", cost: cost(108, 18, 8), requires: ["cargo2"], effect: { fuelMax: 24 } },
  { id: "cargo3", x: 600, y: 810, label: "Expanded Crates", lane: "Cargo / Collection", symbol: "◫", cost: cost(116, 22, 10), requires: ["fuel2"], effect: { cargoCap: 6 } },
  { id: "fuel3", x: 600, y: 930, label: "Reserve Cells", lane: "Cargo / Collection", symbol: "⛽", cost: cost(124, 26, 12), requires: ["cargo3"], effect: { fuelMax: 12 } },
  { id: "magnet2", x: 600, y: 1050, label: "Collection Field", lane: "Cargo / Collection", symbol: "🧲", cost: cost(132, 30, 14), requires: ["fuel3"], effect: { magnet: 10 } },
  { id: "fuelEco1", x: 600, y: 1170, label: "Fuel Recycler", lane: "Cargo / Collection", symbol: "◌", cost: cost(140, 34, 16), requires: ["fuel3"], effect: { collisionFuelMult: 0.88 } },
  { id: "cargo4", x: 600, y: 1290, label: "Freight Lattice", lane: "Cargo / Collection", symbol: "⬒", cost: cost(148, 38, 18), requires: ["fuelEco1"], effect: { cargoCap: 5 } },
  { id: "fuel4", x: 600, y: 1410, label: "Aux Tanks", lane: "Cargo / Collection", symbol: "⛽", cost: cost(156, 42, 20), requires: ["cargo4"], effect: { fuelMax: 10 } },
  { id: "dock3", x: 600, y: 1530, label: "Auto Dock Grid", lane: "Mobility / Docking", symbol: "⌂", cost: cost(164, 46, 22), requires: ["fuel4"], effect: { dockRate: 1.14 } },
  { id: "cargo5", x: 600, y: 1650, label: "Bulk Holds", lane: "Cargo / Collection", symbol: "◫", cost: cost(172, 50, 26), requires: ["dock3"], effect: { cargoCap: 5 } },
  { id: "fuel5", x: 600, y: 1770, label: "Deep Core Fuel", lane: "Cargo / Collection", symbol: "⛽", cost: cost(180, 54, 30), requires: ["cargo5"], effect: { fuelMax: 12 } },
  { id: "magnet3", x: 600, y: 1890, label: "Grav Scoop", lane: "Cargo / Collection", symbol: "🧲", cost: cost(188, 60, 34), requires: ["fuel5"], effect: { magnet: 12 } },
  { id: "fuelEco2", x: 600, y: 2010, label: "Fuel Catalysts", lane: "Cargo / Collection", symbol: "◌", cost: cost(196, 66, 38), requires: ["magnet3"], effect: { collisionFuelMult: 0.88 } },
  { id: "cargo6", x: 600, y: 2130, label: "Vault Compartments", lane: "Cargo / Collection", symbol: "⬒", cost: cost(204, 72, 44), requires: ["fuelEco2"], effect: { cargoCap: 7 } },
  { id: "fuel6", x: 600, y: 2250, label: "Apex Reactor", lane: "Cargo / Collection", symbol: "⛽", cost: cost(212, 80, 52), requires: ["cargo6"], effect: { fuelMax: 16 } },
  { id: "fuel7", x: 600, y: 2370, label: "Long Haul Cells", lane: "Cargo Mk II", symbol: "⛽", unlockPlanet: "vesper-2", researchId: "mk2Blueprints", cost: cost(74, 98, 56), requires: ["fuel6"], effect: { fuelMax: 12 } },
  { id: "cargo7", x: 600, y: 2490, label: "Deep Vaults", lane: "Cargo Mk II", symbol: "◫", unlockPlanet: "vesper-2", researchId: "mk2Blueprints", cost: cost(86, 112, 68), requires: ["fuel7"], effect: { cargoCap: 5 } },
  { id: "fuelEco3", x: 600, y: 2610, label: "Catalytic Return", lane: "Cargo Mk II", symbol: "◌", unlockPlanet: "vesper-2", researchId: "deepCoreOptics", cost: cost(94, 126, 82), requires: ["cargo7"], effect: { thrustFuelMult: 0.92, collisionFuelMult: 0.86 } },
];

const RESEARCH_NODES = [
  { id: "laserTheory", label: "Laser Theory", description: "Unlock laser-grade emitters in the ship systems tree.", cost: researchCost(18, 8, 4), requires: [] },
  { id: "arrayTheory", label: "Array Theory", description: "Authorize support beams and wider AOE lattice experiments.", cost: researchCost(26, 16, 10), requires: ["laserTheory"] },
  { id: "vesper2License", label: "Vesper-2 License", description: "Clear Vesper-1, then spend samples to charter the next contract shell.", cost: researchCost(38, 22, 12), requires: ["arrayTheory"], planetClearRequirement: "vesper-1", unlockPlanet: "vesper-2" },
  { id: "mk2Blueprints", label: "Mk II Blueprints", description: "Open the next-grade survival, combat, and cargo systems for Vesper-2.", cost: researchCost(24, 30, 18), requires: ["vesper2License"], requiresPlanet: "vesper-2" },
  { id: "deepCoreOptics", label: "Deep Core Optics", description: "Authorize the final Vesper-2 refinements for late-contract dominance.", cost: researchCost(12, 34, 28), requires: ["mk2Blueprints"], requiresPlanet: "vesper-2" },
];

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function length2D(x, y) {
  return Math.sqrt(x * x + y * y);
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

async function updateMenuCacheBadge() {
  if (!ui.menuCacheBadge) return;
  try {
    const response = await fetch(`./sw.js?ts=${Date.now()}`, { cache: "no-store" });
    const source = await response.text();
    const match = source.match(/CACHE_NAME\s*=\s*["']([^"']+)["']/);
    ui.menuCacheBadge.textContent = match ? match[1] : "cache unknown";
  } catch {
    ui.menuCacheBadge.textContent = "cache unavailable";
  }
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function smoothstep(edge0, edge1, value) {
  if (edge0 === edge1) return value < edge0 ? 0 : 1;
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
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

function defaultPlanetProgress() {
  return {
    destroyedBlocks: [],
    currentSectorId: "surface",
    completionPercent: 0,
    coreUnlocked: false,
    coreCleared: false,
    cleared: false,
    sectors: {},
  };
}

function clonePlanetProgress(progressState = defaultPlanetProgress()) {
  return {
    ...defaultPlanetProgress(),
    ...progressState,
    destroyedBlocks: [...(progressState.destroyedBlocks || [])],
    sectors: { ...(progressState.sectors || {}) },
  };
}

function getPlanetDefinition(planetId = DEFAULT_PLANET_ID) {
  return PLANET_BY_ID[planetId] || PLANET_BY_ID[DEFAULT_PLANET_ID];
}

function planetContractDetail(planetId = DEFAULT_PLANET_ID) {
  const planet = getPlanetDefinition(planetId);
  return planet.contractDetail || "Standard mining contract";
}

function planetMaterialBias(planetId = DEFAULT_PLANET_ID) {
  return { ore: 1, platinum: 1, crystal: 1, ...(getPlanetDefinition(planetId).materialBias || {}) };
}

function planetCoreReward(planetId = DEFAULT_PLANET_ID) {
  return { ore: 0, platinum: 8, crystal: 18, ...(getPlanetDefinition(planetId).coreReward || {}) };
}

function planetThreatLabel(planetId = DEFAULT_PLANET_ID) {
  const planet = getPlanetDefinition(planetId);
  return planet.threatLabel || "Threat I";
}

function coreHpForPlanet(planetId = DEFAULT_PLANET_ID) {
  return getPlanetDefinition(planetId).coreHp || 92;
}

function planetYieldLabel(planetId = DEFAULT_PLANET_ID) {
  const bias = planetMaterialBias(planetId);
  const ranked = MATERIAL_TYPES.slice().sort((a, b) => bias[b] - bias[a]);
  return `${ranked[0][0].toUpperCase()}${ranked[0].slice(1)} focus`;
}

function getSectorDefinition(sectorId) {
  return SECTOR_BY_ID[sectorId] || SECTORS[0];
}

function orderedMiningSectors(planetId = DEFAULT_PLANET_ID) {
  return getPlanetDefinition(planetId).sectors
    .map((sectorId) => getSectorDefinition(sectorId))
    .filter((sector) => sector.kind === "mining");
}

function sectorForDepth(planetId, depth) {
  return orderedMiningSectors(planetId).find((sector, index, list) => {
    const isLast = index === list.length - 1;
    return depth >= sector.minDepth && (depth < sector.maxDepth || (isLast && depth <= sector.maxDepth));
  }) || orderedMiningSectors(planetId)[0];
}

function sectorLabel(sectorId) {
  return getSectorDefinition(sectorId).name;
}

function formatPercent(value) {
  return `${Math.round(value)}%`;
}

function addMaterials(a, b) {
  const merged = emptyMaterials();
  for (const material of MATERIAL_TYPES) {
    merged[material] = (a?.[material] || 0) + (b?.[material] || 0);
  }
  return merged;
}

function scaleMaterials(materials, factor) {
  const scaled = emptyMaterials();
  for (const material of MATERIAL_TYPES) {
    scaled[material] = Math.round((materials?.[material] || 0) * factor);
  }
  return scaled;
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

function formatCredits(value) {
  return `${fmt(value)} cr`;
}

function canAffordCredits(credits, nodeCost) {
  return credits >= nodeCost;
}

function spendCredits(nodeCost) {
  progress.credits = Math.max(0, progress.credits - nodeCost);
}

function missingCredits(credits, nodeCost) {
  return Math.max(0, nodeCost - credits);
}

function canAffordResearchCost(bank, nodeCost) {
  return MATERIAL_TYPES.every((material) => (bank[material] || 0) >= (nodeCost[material] || 0));
}

function subtractResearchCost(bank, nodeCost) {
  for (const material of MATERIAL_TYPES) {
    bank[material] -= nodeCost[material] || 0;
  }
}

function missingResearchCost(bank, nodeCost) {
  const missing = emptyMaterials();
  for (const material of MATERIAL_TYPES) {
    missing[material] = Math.max(0, (nodeCost[material] || 0) - (bank[material] || 0));
  }
  return missing;
}

function formatCost(nodeCost) {
  return formatCredits(nodeCost);
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
  if (effect.thrustFuelMult) {
    const current = state.ship.thrustFuelMult;
    const before = purchased ? current / effect.thrustFuelMult : current;
    const after = purchased ? current : current * effect.thrustFuelMult;
    return `${before.toFixed(2)}x -> ${after.toFixed(2)}x thrust fuel`;
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
  if (effect.blasterFuelMult) {
    const current = state.ship.blasterFuelMult;
    const before = purchased ? current / effect.blasterFuelMult : current;
    const after = purchased ? current : current * effect.blasterFuelMult;
    return `${before.toFixed(2)}x -> ${after.toFixed(2)}x blaster fuel`;
  }
  if (effect.collisionFuelMult) {
    const current = state.ship.collisionFuelMult;
    const before = purchased ? current / effect.collisionFuelMult : current;
    const after = purchased ? current : current * effect.collisionFuelMult;
    return `${before.toFixed(2)}x -> ${after.toFixed(2)}x impact fuel`;
  }
  if (effect.splashRadius) {
    const before = purchased ? effect.splashRadius : state.ship.bulletSplashRadius;
    const after = purchased ? state.ship.bulletSplashRadius : effect.splashRadius;
    return `${before} -> ${after} aoe`;
  }
  if (effect.unlockLaser) return purchased ? "Laser online" : "Unlock laser";
  if (effect.addLaser) return purchased ? "Beam online" : "Add support beam";
  return purchased ? "Installed" : "Upgrade";
}

function noise2D(x, y) {
  const value = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123;
  return value - Math.floor(value);
}

function blockMaterialAt(planetId, sector, depth, gx, gy) {
  const pocketNoise = noise2D(gx * 0.73, gy * 0.73);
  const richNoise = noise2D(gx * 1.13 + 41, gy * 1.13 - 19);
  const bias = planetMaterialBias(planetId);

  if (sector.id === "surface") return "ore";
  if (sector.id === "industrial") {
    const platinumThreshold = clamp(0.79 - (bias.platinum - 1) * 0.18 + (bias.ore - 1) * 0.1, 0.56, 0.88);
    return richNoise > platinumThreshold || depth > 0.34 + Math.max(0, 1 - bias.platinum) * 0.05 ? "platinum" : "ore";
  }
  if (sector.id === "crystalFault") {
    const crystalThreshold = clamp(0.24 - (bias.crystal - 1) * 0.14 + (bias.platinum - 1) * 0.04, 0.06, 0.3);
    return pocketNoise > crystalThreshold ? "crystal" : "platinum";
  }
  if (sector.id === "coreShell") {
    const shellThreshold = clamp(0.3 - (bias.crystal - 1) * 0.16, 0.08, 0.34);
    return richNoise > shellThreshold ? "crystal" : "platinum";
  }
  return sector.primaryMaterial;
}

function blockHpAt(sector, gx, gy) {
  const weights = sector.hpWeights || [3, 4, 5];
  const hpIndex = Math.floor(noise2D(gx * 0.51 - 14, gy * 0.51 + 7) * weights.length);
  return weights[clamp(hpIndex, 0, weights.length - 1)];
}

function ensurePlanetProgressRecord(progressState, planetId = DEFAULT_PLANET_ID) {
  if (!progressState.planetProgress || typeof progressState.planetProgress !== "object") {
    progressState.planetProgress = {};
  }
  if (!progressState.planetProgress[planetId]) {
    progressState.planetProgress[planetId] = defaultPlanetProgress();
  }
  progressState.planetProgress[planetId] = clonePlanetProgress(progressState.planetProgress[planetId]);
  return progressState.planetProgress[planetId];
}

function getActivePlanetProgress() {
  return ensurePlanetProgressRecord(progress, progress.currentPlanetId);
}

function syncLegacyDestroyedBlocks() {
  progress.destroyedBlocks = [...getActivePlanetProgress().destroyedBlocks];
}

function makePlanet(planetId = DEFAULT_PLANET_ID) {
  const blocks = [];
  const map = new Map();
  const sectorTotals = {};
  const planetDefinition = getPlanetDefinition(planetId);
  const destroyed = new Set(ensurePlanetProgressRecord(progress, planetId).destroyedBlocks || []);
  for (let gy = -PLANET_RADIUS_BLOCKS; gy <= PLANET_RADIUS_BLOCKS; gy += 1) {
    for (let gx = -PLANET_RADIUS_BLOCKS; gx <= PLANET_RADIUS_BLOCKS; gx += 1) {
      const dist = length2D(gx, gy);
      if (dist > PLANET_RADIUS_BLOCKS || dist < CORE_RADIUS_BLOCKS) continue;
      const depth = 1 - (dist - CORE_RADIUS_BLOCKS) / (PLANET_RADIUS_BLOCKS - CORE_RADIUS_BLOCKS);
      const sector = sectorForDepth(planetId, depth);
      const key = `${gx},${gy}`;
      const maxHp = clamp(blockHpAt(sector, gx, gy) + (planetDefinition.blockHpBonus || 0), 2, 10);
      const material = blockMaterialAt(planetId, sector, depth, gx, gy);
      const block = {
        gx,
        gy,
        x: gx * BLOCK_SIZE,
        y: gy * BLOCK_SIZE,
        key,
        sectorId: sector.id,
        maxHp,
        hp: destroyed.has(key) ? 0 : maxHp,
        material,
        materialValue: 1,
        alive: !destroyed.has(key),
      };
      blocks.push(block);
      map.set(key, block);
      sectorTotals[sector.id] = (sectorTotals[sector.id] || 0) + 1;
    }
  }
  return { id: planetId, definition: planetDefinition, blocks, map, totalBlocks: blocks.length, sectorTotals };
}

function defaultProgress() {
  return {
    saveVersion: SAVE_VERSION,
    credits: 0,
    bank: emptyMaterials(),
    sortie: 1,
    bestCargo: 0,
    lastDeliveredCargo: emptyMaterials(),
    lastSortieReport: null,
    destroyedBlocks: [],
    unlockedPlanets: [DEFAULT_PLANET_ID],
    currentPlanetId: DEFAULT_PLANET_ID,
    planetProgress: {
      [DEFAULT_PLANET_ID]: defaultPlanetProgress(),
    },
    settings: {
      qualityProfile: defaultQualityProfileId(),
      showFps: false,
    },
    research: {},
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
    merged.saveVersion = Number.isFinite(merged.saveVersion) ? merged.saveVersion : 1;
    if (typeof merged.bankOre === "number" && (!merged.bank || typeof merged.bank !== "object")) {
      merged.bank = { ore: merged.bankOre, platinum: 0, crystal: 0 };
    }
    if (typeof merged.lastDeliveredCargo === "number") {
      merged.lastDeliveredCargo = { ore: merged.lastDeliveredCargo, platinum: 0, crystal: 0 };
    }
    merged.bank = { ...emptyMaterials(), ...(merged.bank || {}) };
    merged.credits = Number.isFinite(merged.credits) ? merged.credits : 0;
    merged.lastDeliveredCargo = { ...emptyMaterials(), ...(merged.lastDeliveredCargo || {}) };
    merged.lastSortieReport = merged.lastSortieReport || null;
    merged.settings = {
      ...defaultProgress().settings,
      ...(merged.settings || {}),
    };
    merged.settings.qualityProfile = sanitizeQualityProfile(merged.settings.qualityProfile);
    merged.settings.showFps = !!merged.settings.showFps;
    merged.research = typeof merged.research === "object" && merged.research ? { ...merged.research } : {};
    merged.currentPlanetId = getPlanetDefinition(merged.currentPlanetId).id;
    merged.unlockedPlanets = Array.isArray(merged.unlockedPlanets) && merged.unlockedPlanets.length
      ? Array.from(new Set(merged.unlockedPlanets.filter((planetId) => PLANET_BY_ID[planetId])))
      : [DEFAULT_PLANET_ID];
    if (!merged.unlockedPlanets.includes(DEFAULT_PLANET_ID)) merged.unlockedPlanets.unshift(DEFAULT_PLANET_ID);
    if (!merged.unlockedPlanets.includes(merged.currentPlanetId)) merged.unlockedPlanets.push(merged.currentPlanetId);
    if (!merged.planetProgress || typeof merged.planetProgress !== "object") merged.planetProgress = {};
    const migratedDestroyedBlocks = Array.isArray(merged.destroyedBlocks) ? merged.destroyedBlocks : [];
    for (const planetId of merged.unlockedPlanets) {
      const existing = merged.planetProgress[planetId];
      merged.planetProgress[planetId] = clonePlanetProgress(existing || (planetId === merged.currentPlanetId ? { destroyedBlocks: migratedDestroyedBlocks } : defaultPlanetProgress()));
    }
    if (merged.upgrades?.laser) merged.research.laserTheory = true;
    if (merged.upgrades?.splash2) merged.research.arrayTheory = true;
    if (merged.unlockedPlanets.includes("vesper-2")) merged.research.vesper2License = true;
    if ((merged.upgrades?.hull4 || merged.upgrades?.fire5 || merged.upgrades?.fuel7) && merged.unlockedPlanets.includes("vesper-2")) merged.research.mk2Blueprints = true;
    if (merged.upgrades?.hull5 || merged.upgrades?.laser3 || merged.upgrades?.fuelEco3) merged.research.deepCoreOptics = true;
    syncLegacyDestroyedBlocksForLoad(merged);
    merged.saveVersion = SAVE_VERSION;
    return merged;
  } catch {
    return defaultProgress();
  }
}

function syncLegacyDestroyedBlocksForLoad(progressState) {
  const active = ensurePlanetProgressRecord(progressState, progressState.currentPlanetId);
  progressState.destroyedBlocks = [...active.destroyedBlocks];
}

const progress = loadProgress();
syncLegacyDestroyedBlocks();
let fpsSampleTime = 0;
let fpsSampleFrames = 0;
let displayedFps = 0;
let frameAccumulator = 0;
let lastUiSyncTime = -Infinity;
let nextPlanetProgressPersistAt = 0;
let backgroundCache = null;
let backgroundCacheKey = "";
let resultsMapCacheKey = "";
const PLANET_CACHE_SIZE = PLANET_RADIUS * 2 + BLOCK_SIZE * 4;
const PLANET_CACHE_ORIGIN = PLANET_CACHE_SIZE * 0.5;
const planetLayerCache = {
  canvas: null,
  ctx: null,
  planetId: "",
  dirty: true,
};

function currentQualityProfile() {
  return QUALITY_PROFILES[sanitizeQualityProfile(progress.settings?.qualityProfile)];
}

function qualityProfileId() {
  return sanitizeQualityProfile(progress.settings?.qualityProfile);
}

function dynamicLightsEnabled() {
  return currentQualityProfile().dynamicLights;
}

function screenShakeEnabled() {
  return currentQualityProfile().screenShake;
}

function particleBudget() {
  return currentQualityProfile().particleCap;
}

function setQualityProfile(profileId, { persist = true } = {}) {
  const nextProfile = sanitizeQualityProfile(profileId);
  if (!progress.settings) progress.settings = defaultProgress().settings;
  if (progress.settings.qualityProfile === nextProfile) return;
  progress.settings.qualityProfile = nextProfile;
  if (persist) saveProgress();
  resize();
  syncUi();
  render();
}

function setFpsVisibility(showFps, { persist = true } = {}) {
  if (!progress.settings) progress.settings = defaultProgress().settings;
  progress.settings.showFps = !!showFps;
  if (persist) saveProgress();
  syncUi();
}

function createCacheCanvas(width, height) {
  const cacheCanvas = document.createElement("canvas");
  cacheCanvas.width = width;
  cacheCanvas.height = height;
  return cacheCanvas;
}

function computePlanetProgressSnapshot(planet, planetProgressState) {
  const miningSectors = planet.definition.sectors
    .map((sectorId) => getSectorDefinition(sectorId))
    .filter((sector) => sector.kind === "mining");
  const sectorStates = {};
  let completedMiningSectors = 0;
  let totalMiningBlocks = 0;
  let totalClearedBlocks = 0;

  for (const sector of miningSectors) {
    const totalBlocks = planet.sectorTotals[sector.id] || 0;
    let aliveBlocks = 0;
    for (const block of planet.blocks) {
      if (block.sectorId === sector.id && block.alive) aliveBlocks += 1;
    }
    const clearedBlocks = totalBlocks - aliveBlocks;
    totalMiningBlocks += totalBlocks;
    totalClearedBlocks += clearedBlocks;
    const percentCleared = totalBlocks ? (clearedBlocks / totalBlocks) * 100 : 0;
    const completionTarget = clamp((sector.completionTarget || 1) * (planet.definition.sectorCompletionMult || 1), 0.25, 0.94) * 100;
    const completed = percentCleared >= completionTarget;
    if (completed) completedMiningSectors += 1;
    sectorStates[sector.id] = {
      id: sector.id,
      name: sector.name,
      totalBlocks,
      clearedBlocks,
      percentCleared,
      completed,
      completionTarget,
      hazardLabel: sector.hazardLabel || "",
      primaryMaterial: sector.primaryMaterial,
    };
  }

  const coreUnlocked = miningSectors.every((sector) => sectorStates[sector.id]?.completed);
  const coreCleared = !!planetProgressState.coreCleared;
  const coreState = {
    id: "coreEvent",
    name: sectorLabel("coreEvent"),
    completed: coreCleared,
    percentCleared: coreCleared ? 100 : 0,
    completionTarget: 100,
    primaryMaterial: "crystal",
    hazardLabel: "reactor pulse",
  };

  let currentSectorId = "coreEvent";
  for (const sector of miningSectors) {
    if (!sectorStates[sector.id].completed) {
      currentSectorId = sector.id;
      break;
    }
  }
  if (currentSectorId === "coreEvent" && !coreUnlocked) currentSectorId = miningSectors[miningSectors.length - 1].id;

  const completedSteps = completedMiningSectors + (coreCleared ? 1 : 0);
  const completionPercent = (completedSteps / planet.definition.sectors.length) * 100;
  const terrainClearedPercent = totalMiningBlocks ? (totalClearedBlocks / totalMiningBlocks) * 100 : 0;

  return {
    planetId: planet.id,
    planetName: planet.definition.name,
    sectors: { ...sectorStates, coreEvent: coreState },
    currentSectorId,
    currentSector: currentSectorId === "coreEvent" ? coreState : sectorStates[currentSectorId],
    coreUnlocked,
    coreCleared,
    cleared: coreCleared,
    completionPercent,
    terrainClearedPercent,
  };
}

function savePlanetProgressSnapshot(snapshot, persist = true) {
  const active = ensurePlanetProgressRecord(progress, snapshot.planetId);
  active.currentSectorId = snapshot.currentSectorId;
  active.completionPercent = snapshot.completionPercent;
  active.coreUnlocked = snapshot.coreUnlocked;
  active.coreCleared = snapshot.coreCleared;
  active.cleared = snapshot.cleared;
  active.sectors = {};
  for (const [sectorId, sectorState] of Object.entries(snapshot.sectors)) {
    active.sectors[sectorId] = {
      totalBlocks: sectorState.totalBlocks || 0,
      clearedBlocks: sectorState.clearedBlocks || 0,
      percentCleared: Number((sectorState.percentCleared || 0).toFixed(2)),
      completed: !!sectorState.completed,
    };
  }
  syncLegacyDestroyedBlocks();
  if (persist) saveProgress();
}

function showGameplayBanner(message, duration = 3.2) {
  state.bannerMessage = message;
  state.bannerUntil = state.time + duration;
}

function setCorePhase(phase, timer = 0) {
  state.core.phase = phase;
  state.core.phaseTimer = timer;
}

function triggerCorePulse(strength = 310) {
  state.core.pulseFlash = 0.42;
  state.gravityPulse.life = 0.82;
  state.gravityPulse.radius = PLANET_RADIUS * 0.24;
  state.gravityPulse.strength = strength;
  state.gravityPulse.timer = 4.2;
  showGameplayBanner("Core pulse. Stay clear of the center.", 1.8);
}

function refreshPlanetProgress({ persist = false, announce = false } = {}) {
  const previous = state.planetProgressSnapshot;
  const snapshot = computePlanetProgressSnapshot(state.planet, getActivePlanetProgress());
  state.planetProgressSnapshot = snapshot;
  state.planetProgressDirty = false;
  if (persist) state.planetProgressPersistNeeded = false;
  if (announce) state.planetProgressAnnounceNeeded = false;
  if (snapshot.coreCleared) state.core.phase = "cleared";
  else if (snapshot.coreUnlocked && state.core.phase === "sealed") setCorePhase("shielded", 1.15);
  savePlanetProgressSnapshot(snapshot, persist);
  if (!announce || !previous) return snapshot;
  if (previous.currentSectorId !== snapshot.currentSectorId) {
    const sector = snapshot.currentSector;
    showGameplayBanner(`${sector.name} entered. ${formatPercent(sector.percentCleared)} cleared.`);
  } else if (!previous.coreUnlocked && snapshot.coreUnlocked) {
    showGameplayBanner("Core shell broken. Core event unlocked.");
    setCorePhase("shielded", 1.15);
  }
  return snapshot;
}

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
  progress.saveVersion = SAVE_VERSION;
  syncLegacyDestroyedBlocks();
  localStorage.setItem(SAVE_KEY, JSON.stringify(progress));
}

function makeSortieReport(success, delivered, reportPlanetSnapshot = null, reportPlanetDefinition = null) {
  const planetSnapshot = reportPlanetSnapshot || state.planetProgressSnapshot || computePlanetProgressSnapshot(state.planet, getActivePlanetProgress());
  const planetDefinition = reportPlanetDefinition || state.planet.definition;
  return {
    success,
    sortieNumber: progress.sortie,
    blocksMined: state.runStats.blocksMined,
    minedPercent: planetSnapshot.terrainClearedPercent ?? 0,
    delivered: { ...emptyMaterials(), ...delivered },
    samplesAfter: { ...progress.bank },
    creditsAfter: progress.credits,
    bulletDamage: state.runStats.bulletDamage,
    laserDamage: state.runStats.laserDamage,
    bulletShots: state.runStats.bulletShots,
    laserPulses: state.runStats.laserPulses,
    peakCargo: state.runStats.peakCargo,
    bonusMaterials: { ...state.runStats.bonusMaterials },
    planetId: planetSnapshot.planetId,
    planetName: planetDefinition.name || planetSnapshot.planetName,
    sectorId: planetSnapshot.currentSectorId,
    sectorName: planetSnapshot.currentSector.name,
    planetCompletionPercent: planetSnapshot.completionPercent,
    coreUnlocked: planetSnapshot.coreUnlocked,
    coreCleared: planetSnapshot.coreCleared,
    coreStatusLabel: planetSnapshot.coreCleared ? "Cleared" : planetSnapshot.coreUnlocked ? "Unlocked" : "Sealed",
  };
}

function makeState() {
  const currentPlanetId = progress.currentPlanetId;
  const planet = makePlanet(currentPlanetId);
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
      aimY: 1,
      firing: false,
      touchMoveX: 0,
      touchMoveY: 0,
      touchAimX: 1,
      touchAimY: 1,
      touchAimActive: false,
    },
    keys: new Set(),
    camera: { x: 0, y: spawnY - 75, zoom: 0.78 },
    planet,
    planetProgressSnapshot: null,
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
      thrustFuelMult: 1,
      dockRate: 1,
      fireCooldown: 0,
      bulletDamage: 1,
      blasterFuelMult: 1,
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
      collisionFuelMult: 1,
      collisionCostMult: 1,
      facingAngle: Math.PI / 2,
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
    hazards: [],
    damageShake: 0,
    wreckTimer: 0,
    wrecked: false,
    failMode: "",
    failMessage: "",
    failAngle: 0,
    laserBursts: [],
    hazardCooldown: 1.8,
    hazardFlash: 0,
    gravityPulse: { timer: 2.6, life: 0, radius: 0, strength: 0 },
    cinematic: {
      active: false,
      type: "",
      timer: 0,
      duration: 0,
      blastRadius: 0,
    },
    core: {
      radius: 58,
      hpMax: coreHpForPlanet(currentPlanetId),
      hp: coreHpForPlanet(currentPlanetId),
      phase: "sealed",
      phaseTimer: 0,
      shieldDuration: 2.8,
      vulnerableDuration: 3.6,
      pulseFlash: 0,
    },
    hangarStatusUntil: 0,
    hangarView: "upgrades",
    treeZoom: 0.72,
    hangarMessage: progress.lastStatus,
    backgroundStars: [],
    backgroundObjects: [],
    planetProgressDirty: true,
    planetProgressPersistNeeded: false,
    planetProgressAnnounceNeeded: false,
    bannerMessage: "",
    bannerUntil: 0,
    tipIndex: 0,
    runStats: {
      blocksMined: 0,
      bulletShots: 0,
      bulletDamage: 0,
      laserPulses: 0,
      laserDamage: 0,
      materials: emptyMaterials(),
      peakCargo: 0,
      bonusMaterials: emptyMaterials(),
    },
  };
}

const state = makeState();
const revealedTreeNodes = new Set();

function getCameraTarget() {
  const baseTargetX = lerp(state.dock.x, state.ship.x, 0.54);
  const dist = length2D(state.ship.x - state.dock.x, state.ship.y - state.dock.y);
  const zoomBlend = smoothstep(180, 3200, dist);
  const desiredZoom = lerp(0.88, 0.58, zoomBlend);
  const horizontalSafeBand = (state.width * 0.19) / Math.max(desiredZoom, 0.001);
  const targetX = clamp(baseTargetX, state.ship.x - horizontalSafeBand, state.ship.x + horizontalSafeBand);
  const baseTargetY = lerp(state.dock.y, state.ship.y, 0.72);
  const safeLowerScreenRatio = 0.68;
  const minCameraY = state.ship.y - ((safeLowerScreenRatio - 0.5) * state.height) / Math.max(desiredZoom, 0.001);
  const transitionBand = Math.max(60, state.height / Math.max(desiredZoom, 0.001) * 0.08);
  const clampBlend = smoothstep(minCameraY - transitionBand, minCameraY + transitionBand, baseTargetY);
  const targetY = lerp(minCameraY, baseTargetY, clampBlend);
  return { targetX, targetY, desiredZoom };
}

function rebuildBackgroundField() {
  state.backgroundStars = [];
  state.backgroundObjects = [];

  const profile = currentQualityProfile();
  const starCount = clamp(Math.round((state.width * state.height) / 22000), 30, profile.backgroundStars);
  const objectCount = clamp(Math.round((state.width * state.height) / 98000), 4, profile.backgroundObjects);

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
    const roll = Math.random();
    const type = roll < 0.3 ? "asteroid" : roll < 0.62 ? "moon" : roll < 0.82 ? "planet" : "comet";
    state.backgroundObjects.push({
      x: rand(0, state.width),
      y: rand(0, state.height),
      size: rand(10, 34),
      depth: rand(0.03, 0.12),
      drift: rand(0.08, 0.5),
      rotation: rand(0, Math.PI * 2),
      type,
      alpha: rand(0.08, 0.22),
    });
  }
  backgroundCache = null;
  backgroundCacheKey = "";
}

function backgroundAccentCount() {
  return Math.min(18, state.backgroundStars.length);
}

function ensureBackgroundCache() {
  const profile = currentQualityProfile();
  const cacheKey = `${state.width}x${state.height}:${qualityProfileId()}:${state.backgroundStars.length}:${state.backgroundObjects.length}`;
  if (backgroundCache && backgroundCacheKey === cacheKey) return;
  backgroundCacheKey = cacheKey;
  backgroundCache = createCacheCanvas(canvas.width, canvas.height);
  const cacheCtx = backgroundCache.getContext("2d");
  cacheCtx.setTransform(canvas.width / Math.max(1, state.width), 0, 0, canvas.height / Math.max(1, state.height), 0, 0);
  const g = cacheCtx.createRadialGradient(state.width * 0.5, state.height * 0.44, 40, state.width * 0.5, state.height * 0.44, state.width * 0.7);
  g.addColorStop(0, "#13031a");
  g.addColorStop(0.6, "#07010d");
  g.addColorStop(1, "#030108");
  cacheCtx.fillStyle = g;
  cacheCtx.fillRect(0, 0, state.width, state.height);

  for (const obj of state.backgroundObjects) {
    cacheCtx.save();
    cacheCtx.translate(obj.x, obj.y);
    cacheCtx.rotate(obj.rotation);
    if (obj.type === "asteroid") {
      cacheCtx.fillStyle = `rgba(120, 164, 196, ${obj.alpha * 0.7})`;
      cacheCtx.beginPath();
      cacheCtx.moveTo(obj.size * 0.58, 0);
      cacheCtx.lineTo(obj.size * 0.2, -obj.size * 0.46);
      cacheCtx.lineTo(-obj.size * 0.26, -obj.size * 0.42);
      cacheCtx.lineTo(-obj.size * 0.54, -obj.size * 0.08);
      cacheCtx.lineTo(-obj.size * 0.4, obj.size * 0.38);
      cacheCtx.lineTo(obj.size * 0.14, obj.size * 0.52);
      cacheCtx.closePath();
      cacheCtx.fill();
      cacheCtx.strokeStyle = `rgba(196, 230, 255, ${obj.alpha * 0.4})`;
      cacheCtx.lineWidth = 1;
      cacheCtx.stroke();
    } else if (obj.type === "comet") {
      const tail = cacheCtx.createLinearGradient(-obj.size * 1.7, 0, obj.size * 0.2, 0);
      tail.addColorStop(0, "rgba(88, 223, 255, 0)");
      tail.addColorStop(0.6, `rgba(88, 223, 255, ${obj.alpha * 0.18})`);
      tail.addColorStop(1, `rgba(255, 246, 193, ${obj.alpha * 0.34})`);
      cacheCtx.fillStyle = tail;
      cacheCtx.beginPath();
      cacheCtx.moveTo(-obj.size * 1.8, 0);
      cacheCtx.quadraticCurveTo(-obj.size * 0.95, -obj.size * 0.24, obj.size * 0.12, 0);
      cacheCtx.quadraticCurveTo(-obj.size * 0.95, obj.size * 0.24, -obj.size * 1.8, 0);
      cacheCtx.fill();
      const head = cacheCtx.createRadialGradient(0, 0, 0, 0, 0, obj.size * 0.55);
      head.addColorStop(0, `rgba(255, 247, 213, ${obj.alpha * 1.15})`);
      head.addColorStop(0.5, `rgba(136, 228, 255, ${obj.alpha * 0.65})`);
      head.addColorStop(1, "rgba(88, 223, 255, 0)");
      cacheCtx.fillStyle = head;
      cacheCtx.beginPath();
      cacheCtx.arc(0, 0, obj.size * 0.55, 0, Math.PI * 2);
      cacheCtx.fill();
    } else if (obj.type === "moon") {
      const moon = cacheCtx.createRadialGradient(-obj.size * 0.2, -obj.size * 0.24, 0, 0, 0, obj.size * 0.95);
      moon.addColorStop(0, `rgba(243, 235, 217, ${obj.alpha * 1.05})`);
      moon.addColorStop(0.7, `rgba(148, 164, 194, ${obj.alpha * 0.8})`);
      moon.addColorStop(1, `rgba(72, 88, 124, ${obj.alpha * 0.16})`);
      cacheCtx.fillStyle = moon;
      cacheCtx.beginPath();
      cacheCtx.arc(0, 0, obj.size * 0.78, 0, Math.PI * 2);
      cacheCtx.fill();
      cacheCtx.fillStyle = `rgba(56, 72, 102, ${obj.alpha * 0.22})`;
      cacheCtx.beginPath();
      cacheCtx.arc(obj.size * 0.18, -obj.size * 0.1, obj.size * 0.14, 0, Math.PI * 2);
      cacheCtx.arc(-obj.size * 0.22, obj.size * 0.2, obj.size * 0.1, 0, Math.PI * 2);
      cacheCtx.fill();
    } else if (!profile.dynamicLights) {
      cacheCtx.fillStyle = `rgba(88, 223, 255, ${obj.alpha * 0.9})`;
      cacheCtx.beginPath();
      cacheCtx.arc(0, 0, obj.size * 0.56, 0, Math.PI * 2);
      cacheCtx.fill();
    } else {
      const orb = cacheCtx.createRadialGradient(0, 0, 0, 0, 0, obj.size);
      orb.addColorStop(0, `rgba(255, 224, 164, ${obj.alpha * 1.05})`);
      orb.addColorStop(0.4, `rgba(255, 133, 97, ${obj.alpha * 0.62})`);
      orb.addColorStop(0.78, `rgba(103, 86, 172, ${obj.alpha * 0.28})`);
      orb.addColorStop(1, "rgba(255, 90, 70, 0)");
      cacheCtx.fillStyle = orb;
      cacheCtx.beginPath();
      cacheCtx.arc(0, 0, obj.size * 0.86, 0, Math.PI * 2);
      cacheCtx.fill();
      cacheCtx.strokeStyle = `rgba(255, 244, 210, ${obj.alpha * 0.24})`;
      cacheCtx.lineWidth = 1;
      cacheCtx.beginPath();
      cacheCtx.arc(0, 0, obj.size * 0.92, -Math.PI * 0.2, Math.PI * 0.9);
      cacheCtx.stroke();
    }
    cacheCtx.restore();
  }

  const accentCount = backgroundAccentCount();
  for (let i = accentCount; i < state.backgroundStars.length; i += 1) {
    const star = state.backgroundStars[i];
    cacheCtx.fillStyle = `rgba(${star.color}, ${star.alpha * 0.82})`;
    cacheCtx.beginPath();
    cacheCtx.arc(star.x, star.y, star.size * 0.5, 0, Math.PI * 2);
    cacheCtx.fill();
  }
}

function ensurePlanetLayerCache() {
  if (!planetLayerCache.canvas) {
    planetLayerCache.canvas = createCacheCanvas(PLANET_CACHE_SIZE, PLANET_CACHE_SIZE);
    planetLayerCache.ctx = planetLayerCache.canvas.getContext("2d");
    planetLayerCache.dirty = true;
  }
  if (planetLayerCache.planetId !== state.planet.id) {
    planetLayerCache.planetId = state.planet.id;
    planetLayerCache.dirty = true;
  }
  if (!planetLayerCache.dirty) return;
  const cacheCtx = planetLayerCache.ctx;
  cacheCtx.clearRect(0, 0, PLANET_CACHE_SIZE, PLANET_CACHE_SIZE);
  for (const block of state.planet.blocks) drawBlockOnPlanetLayer(cacheCtx, block);
  planetLayerCache.dirty = false;
}

function invalidatePlanetLayerCache() {
  planetLayerCache.dirty = true;
}

function invalidateResultsMapCache() {
  resultsMapCacheKey = "";
}

function drawBlockOnPlanetLayer(targetCtx, block) {
  const left = block.x - BLOCK_SIZE * 0.5 + PLANET_CACHE_ORIGIN;
  const top = block.y - BLOCK_SIZE * 0.5 + PLANET_CACHE_ORIGIN;
  targetCtx.clearRect(left - 1, top - 1, BLOCK_SIZE + 2, BLOCK_SIZE + 2);
  if (!block.alive) return;
  const color = blockColor(block);
  targetCtx.save();
  targetCtx.fillStyle = color;
  targetCtx.fillRect(left, top, BLOCK_SIZE, BLOCK_SIZE);
  targetCtx.strokeStyle = "rgba(255, 245, 215, 0.28)";
  targetCtx.lineWidth = 1;
  targetCtx.strokeRect(left + 0.5, top + 0.5, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
  targetCtx.fillStyle = "rgba(255, 255, 255, 0.12)";
  targetCtx.fillRect(left + 2, top + 2, BLOCK_SIZE - 6, 3);
  if (block.material === "platinum") {
    targetCtx.strokeStyle = "rgba(149, 239, 255, 0.86)";
    targetCtx.beginPath();
    targetCtx.moveTo(left + BLOCK_SIZE * 0.2, top + BLOCK_SIZE * 0.22);
    targetCtx.lineTo(left + BLOCK_SIZE * 0.8, top + BLOCK_SIZE * 0.78);
    targetCtx.moveTo(left + BLOCK_SIZE * 0.8, top + BLOCK_SIZE * 0.22);
    targetCtx.lineTo(left + BLOCK_SIZE * 0.2, top + BLOCK_SIZE * 0.78);
    targetCtx.stroke();
  } else if (block.material === "crystal") {
    targetCtx.strokeStyle = "rgba(255, 186, 255, 0.92)";
    targetCtx.beginPath();
    targetCtx.moveTo(left + BLOCK_SIZE * 0.5, top + BLOCK_SIZE * 0.12);
    targetCtx.lineTo(left + BLOCK_SIZE * 0.86, top + BLOCK_SIZE * 0.5);
    targetCtx.lineTo(left + BLOCK_SIZE * 0.5, top + BLOCK_SIZE * 0.88);
    targetCtx.lineTo(left + BLOCK_SIZE * 0.14, top + BLOCK_SIZE * 0.5);
    targetCtx.closePath();
    targetCtx.stroke();
  }
  targetCtx.restore();
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
  ship.thrustFuelMult = 1;
  ship.dockRate = 1;
  ship.bulletDamage = 1;
  ship.blasterFuelMult = 1;
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
  ship.collisionFuelMult = 1;
  ship.collisionCostMult = 1;

  for (const node of upgradeNodes) {
    if (!progress.upgrades[node.id]) continue;
    const effect = node.effect;
    if (effect.fuelMax) ship.fuelMax += effect.fuelMax;
    if (effect.hpMax) ship.hpMax += effect.hpMax;
    if (effect.cargoCap) ship.cargoCap += effect.cargoCap;
    if (effect.magnet) ship.magnet += effect.magnet;
    if (effect.thrust) ship.thrust += effect.thrust;
    if (effect.thrustFuelMult) ship.thrustFuelMult *= effect.thrustFuelMult;
    if (effect.dockRate) ship.dockRate *= effect.dockRate;
    if (effect.bulletDamage) ship.bulletDamage += effect.bulletDamage;
    if (effect.blasterFuelMult) ship.blasterFuelMult *= effect.blasterFuelMult;
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
    if (effect.collisionFuelMult) ship.collisionFuelMult *= effect.collisionFuelMult;
    if (effect.collisionCostMult) ship.collisionCostMult *= effect.collisionCostMult;
  }
}

function resetSortie() {
  const fresh = makeState();
  Object.assign(state, fresh);
  nextPlanetProgressPersistAt = 0;
  invalidatePlanetLayerCache();
  invalidateResultsMapCache();
  applyUpgrades();
  state.ship.fuel = state.ship.fuelMax;
  state.ship.hp = state.ship.hpMax;
  refreshPlanetProgress({ persist: true });
  snapCameraToTarget();
}

function startNewGame() {
  ensureAudio()?.resume?.();
  playUiClick();
  Object.assign(progress, defaultProgress());
  saveProgress();
  resetSortie();
  state.mode = "tip";
  state.tipIndex = 0;
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
  if (state.planetProgressSnapshot?.currentSector) {
    const sector = state.planetProgressSnapshot.currentSector;
    showGameplayBanner(`${state.planet.definition.name} sortie. ${sector.name} at ${formatPercent(sector.percentCleared)}.`);
  }
  hideOverlays();
  syncUi();
  resize();
  snapCameraToTarget();
  render();
}

function unlockedPlanetIds() {
  return PLANETS.map((planet) => planet.id).filter((planetId) => progress.unlockedPlanets.includes(planetId));
}

function selectPlanet(direction) {
  const unlocked = unlockedPlanetIds();
  if (unlocked.length <= 1) return;
  const currentIndex = Math.max(0, unlocked.indexOf(progress.currentPlanetId));
  const nextIndex = (currentIndex + direction + unlocked.length) % unlocked.length;
  const nextPlanetId = unlocked[nextIndex];
  if (!nextPlanetId || nextPlanetId === progress.currentPlanetId) return;
  progress.currentPlanetId = nextPlanetId;
  ensurePlanetProgressRecord(progress, nextPlanetId);
  saveProgress();
  const previousZoom = state.treeZoom;
  resetSortie();
  state.treeZoom = previousZoom;
  state.mode = "hangar";
  hideOverlays();
  ui.hangarScreen.classList.add("visible");
  renderUpgradeTree();
  renderResearchTree();
  showHangarStatus(`Contract routed to ${getPlanetDefinition(nextPlanetId).name}.`);
  syncUi();
  render();
}

function sendToHangar(success, reportPlanetSnapshot = null, reportPlanetDefinition = null) {
  state.mode = success ? "results" : "hangar";
  hideOverlays();
  const delivered = success ? addMaterials(state.ship.cargo, state.runStats.bonusMaterials) : emptyMaterials();
  if (success) {
    for (const material of MATERIAL_TYPES) {
      progress.bank[material] += delivered[material] || 0;
    }
    progress.bestCargo = Math.max(progress.bestCargo, sumCargo(delivered));
    progress.lastDeliveredCargo = { ...emptyMaterials(), ...delivered };
    progress.lastSortieReport = makeSortieReport(true, delivered, reportPlanetSnapshot, reportPlanetDefinition);
    if (sumCargo(state.runStats.bonusMaterials) > 0) {
      showHangarStatus(`Core harvest secured. Delivered ${formatMaterials(delivered)} including ${formatMaterials(state.runStats.bonusMaterials)} bonus materials.`);
    } else {
      showHangarStatus(`Dock successful. Stored ${formatMaterials(delivered)} in the hangar hold.`);
    }
    progress.sortie += 1;
  } else {
    progress.lastDeliveredCargo = emptyMaterials();
    progress.lastSortieReport = makeSortieReport(false, emptyMaterials(), reportPlanetSnapshot, reportPlanetDefinition);
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

function advanceTip() {
  if (state.tipIndex >= TIPS.length - 1) {
    startSortie();
    return;
  }
  state.tipIndex += 1;
  syncUi();
  render();
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
  renderResearchTree();
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

function nodePlanetUnlocked(node) {
  return !node.unlockPlanet || progress.unlockedPlanets.includes(node.unlockPlanet);
}

function nodeResearchUnlocked(node) {
  return !node.researchId || !!progress.research?.[node.researchId];
}

function nodeUnlocked(node) {
  return nodePlanetUnlocked(node) && nodeResearchUnlocked(node) && node.requires.every((id) => progress.upgrades[id]);
}

function nodeVisible(node) {
  if (progress.upgrades[node.id]) return true;
  if (!nodePlanetUnlocked(node)) return false;
  if (!nodeResearchUnlocked(node)) return false;
  if (node.requires.length === 0) return true;
  return nodeUnlocked(node);
}

function availableUpgradeNodes() {
  return upgradeNodes.filter((node) => !progress.upgrades[node.id] && nodeUnlocked(node));
}

function visibleUpgradeNodeCount() {
  return upgradeNodes.filter((node) => progress.upgrades[node.id] || (nodePlanetUnlocked(node) && nodeResearchUnlocked(node))).length;
}

function lockedPlanetTierNode() {
  return upgradeNodes.find((node) => !progress.upgrades[node.id] && (!nodePlanetUnlocked(node) || !nodeResearchUnlocked(node))) || null;
}

function cheapestReadyUpgrade() {
  const readyNodes = availableUpgradeNodes().filter((node) => canAffordCredits(progress.credits, node.cost));
  readyNodes.sort((a, b) => a.cost - b.cost);
  return readyNodes[0] || null;
}

function nearestUpgradeGoal() {
  const locked = availableUpgradeNodes().filter((node) => !canAffordCredits(progress.credits, node.cost));
  locked.sort((a, b) => {
    const aMissing = missingCredits(progress.credits, a.cost);
    const bMissing = missingCredits(progress.credits, b.cost);
    return aMissing - bMissing;
  });
  return locked[0] || null;
}

function planetCoreCleared(planetId) {
  return !!progress.planetProgress?.[planetId]?.coreCleared;
}

function researchPlanetRequirementMet(node) {
  return !node.requiresPlanet || progress.unlockedPlanets.includes(node.requiresPlanet);
}

function researchClearRequirementMet(node) {
  return !node.planetClearRequirement || planetCoreCleared(node.planetClearRequirement);
}

function researchUnlocked(node) {
  return node.requires.every((id) => progress.research?.[id]) && researchPlanetRequirementMet(node) && researchClearRequirementMet(node);
}

function visibleResearchNodes() {
  return RESEARCH_NODES.filter((node) => progress.research?.[node.id] || researchUnlocked(node));
}

function nextResearchGoal() {
  const pending = visibleResearchNodes().filter((node) => !progress.research?.[node.id]);
  pending.sort((a, b) => sumCargo(missingResearchCost(progress.bank, a.cost)) - sumCargo(missingResearchCost(progress.bank, b.cost)));
  return pending[0] || null;
}

function showHangarStatus(message, duration = 3.6) {
  progress.lastStatus = message;
  state.hangarMessage = message;
  state.hangarStatusUntil = state.time + duration;
}

function setHangarView(view) {
  state.hangarView = view === "research" ? "research" : "upgrades";
  syncUi();
}

function getNodeTier(node) {
  if (node.cost >= 7000) return "crystal";
  if (node.cost >= 2500) return "platinum";
  return "ore";
}

function buyNode(id) {
  const node = upgradeNodes.find((entry) => entry.id === id);
  if (!node || progress.upgrades[id] || !nodeUnlocked(node) || !canAffordCredits(progress.credits, node.cost)) return;
  spendCredits(node.cost);
  progress.upgrades[id] = true;
  showHangarStatus(`${node.label} installed.`);
  saveProgress();
  applyUpgrades();
  playUnlock();
  renderUpgradeTree();
  renderResearchTree();
  syncUi();
}

function buyResearchNode(id) {
  const node = RESEARCH_NODES.find((entry) => entry.id === id);
  if (!node || progress.research?.[id] || !researchUnlocked(node) || !canAffordResearchCost(progress.bank, node.cost)) return;
  subtractResearchCost(progress.bank, node.cost);
  progress.research[id] = true;
  if (node.unlockPlanet && PLANET_BY_ID[node.unlockPlanet] && !progress.unlockedPlanets.includes(node.unlockPlanet)) {
    progress.unlockedPlanets.push(node.unlockPlanet);
    ensurePlanetProgressRecord(progress, node.unlockPlanet);
  }
  if (node.unlockPlanet && !progress.currentPlanetId) progress.currentPlanetId = node.unlockPlanet;
  showHangarStatus(`${node.label} completed.`);
  saveProgress();
  playUnlock();
  renderUpgradeTree();
  renderResearchTree();
  syncUi();
}

function sellMaterial(material, amount = progress.bank[material] || 0) {
  const available = progress.bank[material] || 0;
  const sellAmount = clamp(amount, 0, available);
  if (!sellAmount) return;
  progress.bank[material] -= sellAmount;
  progress.credits += sellAmount * MATERIAL_SALE_VALUES[material];
  showHangarStatus(`Sold ${fmt(sellAmount)} ${material} for ${formatCredits(sellAmount * MATERIAL_SALE_VALUES[material])}.`);
  saveProgress();
  renderUpgradeTree();
  renderResearchTree();
  syncUi();
}

function sellAllMaterials() {
  let totalCredits = 0;
  for (const material of MATERIAL_TYPES) {
    const amount = progress.bank[material] || 0;
    totalCredits += amount * MATERIAL_SALE_VALUES[material];
    progress.bank[material] = 0;
  }
  if (!totalCredits) return;
  progress.credits += totalCredits;
  showHangarStatus(`Sold the full hold for ${formatCredits(totalCredits)}.`);
  saveProgress();
  renderUpgradeTree();
  renderResearchTree();
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
      const distance = length2D(dx, dy);
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
      line.style.width = `${Math.max(0, length2D(lineDx, lineDy))}px`;
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
    button.disabled = purchased || !unlocked || !canAffordCredits(progress.credits, node.cost);
    button.innerHTML = `
      <div class="node-inner">
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

function renderResearchTree() {
  ui.researchTree.innerHTML = "";
  const nodes = visibleResearchNodes();
  for (const node of nodes) {
    const purchased = !!progress.research?.[node.id];
    const unlocked = purchased || researchUnlocked(node);
    const card = document.createElement("button");
    card.className = `research-card${purchased ? " purchased" : ""}${unlocked ? "" : " locked"}`;
    card.disabled = purchased || !unlocked || !canAffordResearchCost(progress.bank, node.cost);
    card.innerHTML = `
      <span class="research-label">${node.label}</span>
      <span class="research-copy">${node.description}</span>
      <span class="research-cost">${purchased ? "Completed" : formatMaterials(node.cost)}</span>
    `;
    card.addEventListener("click", () => buyResearchNode(node.id));
    ui.researchTree.appendChild(card);
  }
}

function setupUpgradeTreeZoom() {
  let pinchDistance = 0;
  let pinchZoom = 0;

  ui.upgradeTree.addEventListener(
    "touchstart",
    (event) => {
      if (event.touches.length !== 2) return;
      const [a, b] = event.touches;
      pinchDistance = length2D(a.clientX - b.clientX, a.clientY - b.clientY);
      pinchZoom = state.treeZoom;
    },
    { passive: true },
  );

  ui.upgradeTree.addEventListener(
    "touchmove",
    (event) => {
      if (event.touches.length !== 2) return;
      const [a, b] = event.touches;
      const nextDistance = length2D(a.clientX - b.clientX, a.clientY - b.clientY);
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
  const visualHp = blockVisualHp(block);
  if (block.sectorId === "surface") {
    return visualHp >= 3 ? "#ff8c63" : visualHp === 2 ? "#ffd24f" : "#79ff9e";
  }
  if (block.sectorId === "industrial") {
    return block.material === "platinum"
      ? visualHp >= 4 ? "#89efff" : visualHp === 3 ? "#b9f5ff" : visualHp === 2 ? "#ffe07d" : "#8cffba"
      : visualHp >= 4 ? "#ff7c52" : visualHp === 3 ? "#ffaf70" : visualHp === 2 ? "#ffe07d" : "#8cffba";
  }
  if (block.sectorId === "crystalFault") {
    return block.material === "crystal"
      ? visualHp >= 5 ? "#f889ff" : visualHp === 4 ? "#d582ff" : visualHp === 3 ? "#ffacf7" : visualHp === 2 ? "#ffe07d" : "#8cffba"
      : visualHp >= 4 ? "#7ddcff" : visualHp === 3 ? "#c3f4ff" : visualHp === 2 ? "#ffe07d" : "#8cffba";
  }
  return block.material === "crystal"
    ? visualHp >= 5 ? "#ff74ba" : visualHp === 4 ? "#ff9ae0" : visualHp === 3 ? "#ffd1f7" : visualHp === 2 ? "#ffe07d" : "#8cffba"
    : visualHp >= 5 ? "#93b0ff" : visualHp === 4 ? "#badaff" : visualHp === 3 ? "#ffe3a3" : visualHp === 2 ? "#ffb96d" : "#8cffba";
}

function blockVisualHp(block) {
  return Math.max(1, Math.ceil(block.hp));
}

function worldToScreen(x, y) {
  const shakeX = screenShakeEnabled() && state.damageShake > 0 ? Math.sin(state.time * 70) * state.damageShake * 8 : 0;
  const shakeY = screenShakeEnabled() && state.damageShake > 0 ? Math.cos(state.time * 85) * state.damageShake * 8 : 0;
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

function distanceSq(ax, ay, bx, by) {
  const dx = ax - bx;
  const dy = ay - by;
  return dx * dx + dy * dy;
}

function distancePointToSegment(px, py, ax, ay, bx, by) {
  const abx = bx - ax;
  const aby = by - ay;
  const lengthSq = abx * abx + aby * aby;
  if (lengthSq <= 0.0001) return length2D(px - ax, py - ay);
  const t = clamp(((px - ax) * abx + (py - ay) * aby) / lengthSq, 0, 1);
  const cx = ax + abx * t;
  const cy = ay + aby * t;
  return length2D(px - cx, py - cy);
}

function distancePointToBlockEdge(px, py, block) {
  const half = BLOCK_SIZE * 0.5;
  const dx = Math.max(Math.abs(px - block.x) - half, 0);
  const dy = Math.max(Math.abs(py - block.y) - half, 0);
  return Math.sqrt(dx * dx + dy * dy);
}

function activeDefenseRings() {
  return state.hazards.filter((hazard) => hazard.type === "debris" && hazard.active && hazard.life > 0);
}

function pointInsideDefenseRing(x, y) {
  return activeDefenseRings().some((hazard) => distanceSq(x, y, hazard.x, hazard.y) <= hazard.radius * hazard.radius);
}

function segmentBlockedByDefenseRing(ax, ay, bx, by) {
  return activeDefenseRings().some((hazard) => distancePointToSegment(hazard.x, hazard.y, ax, ay, bx, by) <= hazard.radius);
}

function pickDefenseRingAnchor() {
  const searchBounds = {
    left: state.ship.x - 220,
    right: state.ship.x + 220,
    top: state.ship.y - 220,
    bottom: state.ship.y + 220,
  };
  const candidates = [];
  forEachBlockInBounds(searchBounds, (block) => {
    if (block.sectorId !== "surface") return;
    if (distanceSq(block.x, block.y, state.ship.x, state.ship.y) > 220 * 220) return;
    candidates.push(block);
  });
  if (!candidates.length) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

function pushParticle(particle) {
  if (state.particles.length >= particleBudget()) return;
  state.particles.push(particle);
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
    if (pointInsideDefenseRing(block.x, block.y)) return;
    if (segmentBlockedByDefenseRing(state.ship.x, state.ship.y, block.x, block.y)) return;
    candidates.push({ type: "block", block, x: block.x, y: block.y, distSq });
  });
  if (state.planetProgressSnapshot?.coreUnlocked && state.core.phase === "vulnerable") {
    const dx = -state.ship.x;
    const dy = -state.ship.y;
    const distSq = dx * dx + dy * dy;
    if (distSq <= rangeSq && !segmentBlockedByDefenseRing(state.ship.x, state.ship.y, 0, 0)) {
      candidates.push({ type: "core", x: 0, y: 0, distSq });
    }
  }
  candidates.sort((a, b) => a.distSq - b.distSq);
  return candidates.slice(0, maxCount);
}

function pickupBlockDamage(block, damage) {
  if (!block || !block.alive) return false;
  const previousVisualHp = blockVisualHp(block);
  block.hp -= damage;
  const nextVisualHp = block.hp > 0 ? blockVisualHp(block) : 0;
  if (block.hp > 0 && nextVisualHp !== previousVisualHp) {
    ensurePlanetLayerCache();
    drawBlockOnPlanetLayer(planetLayerCache.ctx, block);
  }
  if (block.hp <= 0) {
    block.alive = false;
    ensurePlanetLayerCache();
    drawBlockOnPlanetLayer(planetLayerCache.ctx, block);
    invalidateResultsMapCache();
    state.runStats.blocksMined += 1;
    state.runStats.materials[block.material] += 1;
    const activePlanetProgress = getActivePlanetProgress();
    if (!activePlanetProgress.destroyedBlocks.includes(block.key)) {
      activePlanetProgress.destroyedBlocks.push(block.key);
      syncLegacyDestroyedBlocks();
      state.planetProgressDirty = true;
      state.planetProgressPersistNeeded = true;
      state.planetProgressAnnounceNeeded = true;
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
      const dist = distancePointToBlockEdge(x, y, block);
      if (dist > radius) continue;
      const falloff = 1 - dist / Math.max(radius, 0.001);
      const splashDamage = state.ship.bulletDamage * state.ship.bulletSplashFalloff * falloff;
      if (splashDamage > 0.025) pickupBlockDamage(block, splashDamage);
    }
  }
  for (let i = 0; i < 8; i += 1) {
    pushParticle({
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
    pushParticle({
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
    pushParticle({
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
      pushParticle({
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
  const len = length2D(x, y) || 1;
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
  state.ship.fuel = Math.max(0, state.ship.fuel - stats.shotFuel * state.ship.blasterFuelMult);
  playShoot();
}

function failSortie(message) {
  state.hangarMessage = message;
  progress.lastStatus = message;
  saveProgress();
  sendToHangar(false);
}

function shipDepth() {
  const distBlocks = length2D(state.ship.x, state.ship.y) / BLOCK_SIZE;
  const depth = 1 - (distBlocks - CORE_RADIUS_BLOCKS) / (PLANET_RADIUS_BLOCKS - CORE_RADIUS_BLOCKS);
  return clamp(depth, 0, 1);
}

function shipSectorDefinition() {
  if (state.planetProgressSnapshot?.coreUnlocked && state.core.phase !== "cleared" && shipDepth() >= 0.9) {
    return getSectorDefinition("coreEvent");
  }
  return sectorForDepth(state.planet.id, shipDepth());
}

function damageShip(hullDamage, fuelDamage, dtMultiplier = 1) {
  if (state.wrecked || state.cinematic.active) return;
  state.ship.hp = Math.max(0, state.ship.hp - hullDamage * dtMultiplier);
  state.ship.fuel = Math.max(0, state.ship.fuel - fuelDamage * dtMultiplier * state.ship.collisionFuelMult);
  state.damageShake = Math.max(state.damageShake, 0.55);
  state.hazardFlash = 0.18;
}

function startCoreMeltdown() {
  if (state.cinematic.active || state.core.phase === "cleared") return;
  setCorePhase("meltdown", 0);
  state.cinematic.active = true;
  state.cinematic.type = "planet-break";
  state.cinematic.timer = 0;
  state.cinematic.duration = 3.8;
  state.cinematic.blastRadius = 0;
  state.hazards = [];
  state.gravityPulse.life = 1.25;
  state.gravityPulse.radius = CORE_RADIUS_BLOCKS * BLOCK_SIZE * 0.8;
  state.gravityPulse.strength = 320;
  state.runStats.bonusMaterials = addMaterials(state.runStats.bonusMaterials, planetCoreReward(state.planet.id));
  showGameplayBanner("Ancient core destabilized. Planet failure imminent.", 4);
  const activePlanetProgress = getActivePlanetProgress();
  activePlanetProgress.coreCleared = true;
  activePlanetProgress.cleared = true;
  state.planetProgressDirty = true;
  state.planetProgressPersistNeeded = true;
  refreshPlanetProgress({ persist: true });
}

function finishCoreMeltdown() {
  const reportSnapshot = state.planetProgressSnapshot
    ? {
        ...state.planetProgressSnapshot,
        currentSector: { ...state.planetProgressSnapshot.currentSector },
      }
    : null;
  const reportPlanetDefinition = { ...state.planet.definition };
  const activePlanet = getPlanetDefinition(state.planet.id);
  const activePlanetProgress = getActivePlanetProgress();
  activePlanetProgress.coreCleared = true;
  activePlanetProgress.cleared = true;
  syncLegacyDestroyedBlocks();
  saveProgress();
  state.cinematic.active = false;
  setCorePhase("cleared", 0);
  state.hangarMessage = activePlanet.nextPlanetId && !progress.unlockedPlanets.includes(activePlanet.nextPlanetId)
    ? "Planet cracked open. Core haul recovered. Research the next contract in the hangar."
    : "Planet cracked open. Core haul recovered.";
  progress.lastStatus = state.hangarMessage;
  sendToHangar(true, reportSnapshot, reportPlanetDefinition);
}

function coreHitTest(x, y) {
  if (!state.planetProgressSnapshot?.coreUnlocked || state.core.phase !== "vulnerable") return false;
  return x * x + y * y <= state.core.radius * state.core.radius;
}

function damageCore(amount, hitX = 0, hitY = 0, source = "bullet") {
  if (state.core.phase !== "vulnerable") return false;
  state.core.hp = Math.max(0, state.core.hp - amount);
  recordDamage(source, amount);
  state.damageShake = Math.max(state.damageShake, 0.8);
  for (let i = 0; i < 8; i += 1) {
    pushParticle({
      x: hitX,
      y: hitY,
      vx: rand(-160, 160),
      vy: rand(-160, 160),
      life: rand(0.24, 0.58),
      color: i % 2 === 0 ? "#ffd24f" : "#ff7b47",
    });
  }
  if (state.core.hp <= 0) {
    startCoreMeltdown();
  }
  return true;
}

function updateCoreEvent(dt) {
  state.core.pulseFlash = Math.max(0, state.core.pulseFlash - dt);
  if (!state.planetProgressSnapshot?.coreUnlocked || state.cinematic.active) return;
  if (state.core.phase === "sealed" || state.core.phase === "cleared" || state.core.phase === "meltdown") return;

  state.core.phaseTimer = Math.max(0, state.core.phaseTimer - dt);
  if (state.core.phase === "shielded") {
    if (state.core.phaseTimer <= 0) {
      setCorePhase("vulnerable", state.core.vulnerableDuration);
      showGameplayBanner("Core exposed. Fire into the reactor.", 1.8);
    }
    return;
  }

  if (state.core.phase === "vulnerable" && state.core.phaseTimer <= 0) {
    setCorePhase("shielded", state.core.shieldDuration);
    triggerCorePulse(300);
  }
}

function updateShip(dt) {
  const move = getMoveAxis();
  const ship = state.ship;
  if (state.input.aimX * state.input.aimX + state.input.aimY * state.input.aimY > 0.000001) {
    ship.facingAngle = Math.atan2(state.input.aimY, state.input.aimX);
  }
  state.damageShake = Math.max(0, state.damageShake - dt * 5);
  if (state.wreckTimer > 0) {
    if (state.failMode === "damage") {
      state.failAngle += dt * 10;
      ship.vx += Math.cos(state.time * 32) * 180 * dt;
      ship.vy += Math.sin(state.time * 27) * 180 * dt;
      if (Math.random() < 0.35) {
        pushParticle({
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
        pushParticle({
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
    ship.fuel = Math.max(0, ship.fuel - dt * 2.8 * ship.thrustFuelMult);
  }

  ship.x += ship.vx * dt;
  ship.y += ship.vy * dt;
  ship.vx *= 0.985;
  ship.vy *= 0.985;

  const hit = shipHitsBlock();
  if (hit) {
    const impactSpeed = length2D(ship.vx, ship.vy);
    let pushX = ship.x - hit.x;
    let pushY = ship.y - hit.y;
    let pushLen = length2D(pushX, pushY);
    if (pushLen < 0.001) {
      pushX = ship.vx !== 0 || ship.vy !== 0 ? ship.vx : ship.x;
      pushY = ship.vx !== 0 || ship.vy !== 0 ? ship.vy : ship.y - hit.y - 1;
      pushLen = length2D(pushX, pushY) || 1;
    }
    pushX /= pushLen;
    pushY /= pushLen;
    const separation = BLOCK_SIZE * 0.5 + SHIP_RADIUS + 4;
    ship.x = hit.x + pushX * separation;
    ship.y = hit.y + pushY * separation;
    const impactHullDamage = (82 + impactSpeed * 0.42) * ship.collisionCostMult;
    const impactFuelDamage = (28 + impactSpeed * 0.12) * lerp(1, ship.collisionCostMult, 0.8) * ship.collisionFuelMult;
    ship.hp = Math.max(0, ship.hp - dt * impactHullDamage);
    ship.fuel = Math.max(0, ship.fuel - dt * impactFuelDamage);
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

  const distFromCenterSq = ship.x * ship.x + ship.y * ship.y;
  const boundaryRadius = PLANET_RADIUS + 420;
  if (distFromCenterSq > boundaryRadius * boundaryRadius) {
    const distFromCenter = Math.sqrt(distFromCenterSq);
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
      const target = availableTargets[Math.min(index, availableTargets.length - 1)];
      if (!target) return;
      const damage = WEAPON_STATS.laser.pulseDamage * ship.laserDamage * laser.damageMult;
      if (target.type === "core") {
        damageCore(damage, target.x, target.y, "laser");
      } else {
        pickupBlockDamage(target.block, damage);
        recordDamage("laser", damage);
      }
      state.laserBursts.push({
        sx: ship.x,
        sy: ship.y,
        tx: target.x,
        ty: target.y,
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
    const travel = length2D(dx, dy);
    const steps = Math.max(1, Math.ceil(travel / (BLOCK_SIZE * 0.35)));
    let hit = false;

    for (let step = 1; step <= steps; step += 1) {
      const sampleX = bullet.x + (dx * step) / steps;
      const sampleY = bullet.y + (dy * step) / steps;
      if (pointInsideDefenseRing(sampleX, sampleY)) {
        bullet.x = sampleX;
        bullet.y = sampleY;
        bullet.life = 0;
        hit = true;
        break;
      }
      if (coreHitTest(sampleX, sampleY)) {
        damageCore(bullet.damage, sampleX, sampleY, "bullet");
        bullet.x = sampleX;
        bullet.y = sampleY;
        bullet.life = 0;
        hit = true;
        break;
      }
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
    const distSq = dx * dx + dy * dy;
    const magnetSq = state.ship.magnet * state.ship.magnet;
    if (distSq < magnetSq) {
      const dist = Math.sqrt(distSq);
      const pull = clamp(1 - dist / state.ship.magnet, 0, 1);
      pickup.vx += (dx / Math.max(dist, 1)) * pull * 240 * dt;
      pickup.vy += (dy / Math.max(dist, 1)) * pull * 240 * dt;
    }
    const pickupRange = SHIP_RADIUS + 8;
    if (distSq < pickupRange * pickupRange) {
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
  state.hazardFlash = Math.max(0, state.hazardFlash - dt);
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

function spawnHazardForSector(sector) {
  if (!sector?.hazardType) return;
  if (sector.hazardType === "debris") {
    const anchor = pickDefenseRingAnchor();
    if (!anchor) return;
    state.hazards.push({
      type: "debris",
      x: anchor.x,
      y: anchor.y,
      radius: rand(22, 34),
      life: 2.6,
      telegraph: 0.85,
      active: false,
      color: "#ff9d4d",
    });
    showGameplayBanner("Defense ring locking down surface blocks.", 1.8);
    return;
  }

  if (sector.hazardType === "vent") {
    const angle = rand(-Math.PI, Math.PI);
    const radius = rand(80, 150);
    state.hazards.push({
      type: "vent",
      x: state.ship.x + Math.cos(angle) * radius,
      y: state.ship.y + Math.sin(angle) * radius,
      radius: rand(34, 48),
      life: 2.8,
      telegraph: 0.8,
      active: false,
      color: "#ff7b47",
    });
    showGameplayBanner("Heat vent rising.", 1.8);
    return;
  }

  if (sector.hazardType === "zap") {
    const angle = rand(-Math.PI, Math.PI);
    const radius = rand(90, 160);
    state.hazards.push({
      type: "zap",
      x: state.ship.x + Math.cos(angle) * radius,
      y: state.ship.y + Math.sin(angle) * radius,
      radius: 96,
      life: 1.9,
      telegraph: 0.7,
      active: false,
      fired: false,
      color: "#d58cff",
    });
    showGameplayBanner("Crystal charge building.", 1.8);
    return;
  }

  if (sector.hazardType === "gravity") {
    state.gravityPulse.life = 0.95;
    state.gravityPulse.radius = PLANET_RADIUS * 0.3;
    state.gravityPulse.strength = 240;
    showGameplayBanner("Gravity pulse. Stabilizers straining.", 2.2);
  }
}

function updateHazards(dt) {
  const sector = shipSectorDefinition();
  const hazardRateMult = state.planet.definition.hazardRateMult || 1;
  state.hazardCooldown -= dt;
  if (!state.cinematic.active && state.mode === "sortie" && !state.wrecked && state.hazardCooldown <= 0 && sector.kind !== "event") {
    spawnHazardForSector(sector);
    const baseCooldown = sector.id === "surface" ? 3.5 : sector.id === "industrial" ? 4.2 : sector.id === "crystalFault" ? 4.6 : 5.1;
    state.hazardCooldown = baseCooldown * hazardRateMult;
  }

  for (const hazard of state.hazards) {
    hazard.life -= dt;
    if (hazard.type === "debris") {
      if (hazard.telegraph > 0) {
        hazard.telegraph = Math.max(0, hazard.telegraph - dt);
        if (hazard.telegraph === 0) hazard.active = true;
      }
      if (hazard.active) {
        if (distanceSq(state.ship.x, state.ship.y, hazard.x, hazard.y) < hazard.radius * hazard.radius) damageShip(13, 6, dt);
      }
      continue;
    }

    if (hazard.telegraph > 0) {
      hazard.telegraph = Math.max(0, hazard.telegraph - dt);
      if (hazard.telegraph === 0) hazard.active = true;
    }

    if (hazard.type === "vent" && hazard.active) {
      if (distanceSq(state.ship.x, state.ship.y, hazard.x, hazard.y) < hazard.radius * hazard.radius) damageShip(12, 14, dt);
      continue;
    }

    if (hazard.type === "zap" && hazard.active && !hazard.fired) {
      hazard.fired = true;
      if (distanceSq(state.ship.x, state.ship.y, hazard.x, hazard.y) < hazard.radius * hazard.radius) {
        damageShip(20, 12, 1);
        state.laserBursts.push({
          sx: hazard.x,
          sy: hazard.y,
          tx: state.ship.x,
          ty: state.ship.y,
          color: "#d58cff",
          life: 0.16,
        });
      }
    }
  }

  state.hazards = state.hazards.filter((hazard) => hazard.life > 0);

  state.gravityPulse.timer = Math.max(0, state.gravityPulse.timer - dt);
  if (state.gravityPulse.life > 0) {
    state.gravityPulse.life = Math.max(0, state.gravityPulse.life - dt);
    const dist = length2D(state.ship.x, state.ship.y);
    const nx = dist > 0 ? -state.ship.x / dist : 0;
    const ny = dist > 0 ? -state.ship.y / dist : 0;
    state.ship.vx += nx * state.gravityPulse.strength * dt;
    state.ship.vy += ny * state.gravityPulse.strength * dt;
    if (dist < PLANET_RADIUS * 0.46) {
      const pulseMult = state.planetProgressSnapshot?.coreUnlocked ? 1.2 : 1;
      damageShip(6 * pulseMult, 8 * pulseMult, dt);
    }
  } else if (state.gravityPulse.timer <= 0 && shipSectorDefinition().id === "coreShell" && !state.cinematic.active) {
    state.gravityPulse.timer = 4.8;
    state.gravityPulse.life = 0.85;
    state.gravityPulse.radius = PLANET_RADIUS * 0.26;
    state.gravityPulse.strength = 220;
  }
}

function updateCinematic(dt) {
  if (!state.cinematic.active) return false;
  state.cinematic.timer += dt;
  const progressRatio = clamp(state.cinematic.timer / Math.max(0.001, state.cinematic.duration), 0, 1);
  state.cinematic.blastRadius = lerp(CORE_RADIUS_BLOCKS * BLOCK_SIZE, PLANET_RADIUS * 1.15, progressRatio);
  state.damageShake = Math.max(state.damageShake, 0.75 + progressRatio * 1.25);
  const shipDist = Math.max(1, length2D(state.ship.x, state.ship.y));
  state.ship.vx += (state.ship.x / shipDist) * 40 * dt;
  state.ship.vy += (state.ship.y / shipDist) * 40 * dt;
  state.ship.x += state.ship.vx * dt;
  state.ship.y += state.ship.vy * dt;
  state.ship.vx *= 0.988;
  state.ship.vy *= 0.988;

  for (let i = 0; i < 14; i += 1) {
    const angle = rand(-Math.PI, Math.PI);
    const radius = rand(CORE_RADIUS_BLOCKS * BLOCK_SIZE, state.cinematic.blastRadius);
    pushParticle({
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      vx: Math.cos(angle) * rand(60, 260),
      vy: Math.sin(angle) * rand(60, 260),
      life: rand(0.35, 0.9),
      color: i % 3 === 0 ? "#fff0b8" : i % 2 === 0 ? "#ff7b47" : "#58dfff",
    });
  }

  const collapseThreshold = state.cinematic.blastRadius;
  let cacheInvalidated = false;
  for (const block of state.planet.blocks) {
    if (!block.alive) continue;
    if (block.x * block.x + block.y * block.y <= collapseThreshold * collapseThreshold && Math.random() < 0.18) {
      block.alive = false;
      cacheInvalidated = true;
    }
  }
  if (cacheInvalidated) {
    invalidatePlanetLayerCache();
    invalidateResultsMapCache();
  }

  if (progressRatio >= 1) {
    for (const block of state.planet.blocks) block.alive = false;
    invalidatePlanetLayerCache();
    invalidateResultsMapCache();
    finishCoreMeltdown();
    return true;
  }
  return false;
}

function updateDocking(dt) {
  if (distanceSq(state.ship.x, state.ship.y, state.dock.x, state.dock.y) < state.dock.radius * state.dock.radius) {
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
  state.camera.zoom = lerp(state.camera.zoom, desiredZoom, 2.1 * dt);
}

function currentShipSectorProgress() {
  const sector = shipSectorDefinition();
  const snapshot = state.planetProgressSnapshot || computePlanetProgressSnapshot(state.planet, getActivePlanetProgress());
  const sectorState = snapshot.sectors?.[sector.id];
  return sectorState || {
    id: sector.id,
    name: sector.name,
    percentCleared: 0,
    completionTarget: clamp((sector.completionTarget || 1) * 100, 0, 100),
    completed: false,
    primaryMaterial: sector.primaryMaterial,
  };
}

function updateStatusText() {
  if (state.mode === "sortie") {
    const cargoFull = sumCargo(state.ship.cargo) >= state.ship.cargoCap;
    const sector = currentShipSectorProgress();
    const sectorText = sector ? `${sector.name} ${formatPercent(sector.percentCleared)}` : "";
    if (state.cinematic.active) {
      ui.status.textContent = "Planet core detonating. Hold the line.";
    } else if (state.core.phase === "vulnerable") {
      ui.status.textContent = `Core exposed ${Math.ceil(state.core.hp)} / ${state.core.hpMax}`;
    } else if (state.core.phase === "shielded") {
      ui.status.textContent = `Core shielded. Pulse cycle ${Math.max(0, state.core.phaseTimer).toFixed(1)}s`;
    } else if (state.dock.timer > 0) {
      ui.status.textContent = `Docking in ${Math.max(0, state.dock.needed - state.dock.timer).toFixed(1)}s`;
    } else if (state.bannerUntil > state.time && state.bannerMessage) {
      ui.status.textContent = state.bannerMessage;
    } else if (state.wreckTimer > 0) {
      ui.status.textContent = state.failMode === "fuel" ? "Fuel depleted." : "Ship critical.";
    } else {
      ui.status.textContent = cargoFull
        ? "Cargo full. Return to the docking station to bank the haul."
        : sectorText;
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
    syncUi(false);
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
    syncUi(false);
    return;
  }
  if (state.cinematic.active) {
    updateCinematic(dt);
    updateCamera(dt);
    updateStatusText();
    syncUi(false);
    return;
  }
  updateShip(dt);
  updateCoreEvent(dt);
  updateHazards(dt);
  updateWeapons(dt);
  updateBullets(dt);
  updatePickups(dt);
  updateDocking(dt);
  if (state.planetProgressDirty || (state.planetProgressPersistNeeded && state.time >= nextPlanetProgressPersistAt)) {
    const shouldPersist = state.planetProgressPersistNeeded && state.time >= nextPlanetProgressPersistAt;
    refreshPlanetProgress({
      persist: shouldPersist,
      announce: state.planetProgressDirty && state.planetProgressAnnounceNeeded,
    });
    if (shouldPersist) nextPlanetProgressPersistAt = state.time + 0.35;
  }
  updateCamera(dt);
  updateStatusText();
  syncUi(false);
}

function drawBackground() {
  ensureBackgroundCache();
  if (backgroundCache) {
    ctx.drawImage(backgroundCache, 0, 0, state.width, state.height);
  }
  const offsetX = state.camera.x * 0.035;
  const offsetY = state.camera.y * 0.035;
  const accentCount = backgroundAccentCount();
  for (let i = 0; i < accentCount; i += 1) {
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
  if (dynamicLightsEnabled()) {
    ctx.shadowColor = "#58dfff";
    ctx.shadowBlur = 18;
  }
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

function drawDockIndicator() {
  const dock = worldToScreen(state.dock.x, state.dock.y);
  const margin = 72;
  const isDockComfortablyVisible =
    dock.x >= margin &&
    dock.x <= state.width - margin &&
    dock.y >= margin &&
    dock.y <= state.height - margin;
  if (isDockComfortablyVisible) return;

  const centerX = state.width * 0.5;
  const centerY = state.height * 0.5;
  const dx = dock.x - centerX;
  const dy = dock.y - centerY;
  const lengthSq = dx * dx + dy * dy;
  if (lengthSq < 1) return;

  const anchorX = centerX;
  const anchorY = margin * 0.62;
  const angle = Math.atan2(dock.y - anchorY, dock.x - anchorX);
  const arrowLength = 20;
  const arrowWidth = 8;

  ctx.save();
  ctx.translate(anchorX, anchorY);
  ctx.rotate(angle);
  ctx.globalAlpha = 0.42;
  if (dynamicLightsEnabled()) {
    ctx.shadowColor = "rgba(88, 223, 255, 0.4)";
    ctx.shadowBlur = 8;
  }
  ctx.fillStyle = "#8ff0ff";
  ctx.beginPath();
  ctx.moveTo(arrowLength * 0.5, 0);
  ctx.lineTo(-arrowLength * 0.45, -arrowWidth);
  ctx.lineTo(-arrowLength * 0.1, 0);
  ctx.lineTo(-arrowLength * 0.45, arrowWidth);
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "rgba(143, 240, 255, 0.45)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-arrowLength * 0.9, 0);
  ctx.lineTo(-arrowLength * 0.2, 0);
  ctx.stroke();
  ctx.restore();
}

function drawPlanetBlocks() {
  ensurePlanetLayerCache();
  const bounds = visibleWorldBounds();
  const sourceLeft = clamp(bounds.left + PLANET_CACHE_ORIGIN, 0, PLANET_CACHE_SIZE);
  const sourceTop = clamp(bounds.top + PLANET_CACHE_ORIGIN, 0, PLANET_CACHE_SIZE);
  const sourceRight = clamp(bounds.right + PLANET_CACHE_ORIGIN, 0, PLANET_CACHE_SIZE);
  const sourceBottom = clamp(bounds.bottom + PLANET_CACHE_ORIGIN, 0, PLANET_CACHE_SIZE);
  const sourceWidth = Math.max(1, sourceRight - sourceLeft);
  const sourceHeight = Math.max(1, sourceBottom - sourceTop);
  const worldLeft = sourceLeft - PLANET_CACHE_ORIGIN;
  const worldTop = sourceTop - PLANET_CACHE_ORIGIN;
  const worldRight = sourceRight - PLANET_CACHE_ORIGIN;
  const worldBottom = sourceBottom - PLANET_CACHE_ORIGIN;
  const topLeft = worldToScreen(worldLeft, worldTop);
  const bottomRight = worldToScreen(worldRight, worldBottom);
  ctx.drawImage(
    planetLayerCache.canvas,
    sourceLeft,
    sourceTop,
    sourceWidth,
    sourceHeight,
    topLeft.x,
    topLeft.y,
    bottomRight.x - topLeft.x,
    bottomRight.y - topLeft.y,
  );
}

function drawHazards() {
  for (const hazard of state.hazards) {
    const screen = worldToScreen(hazard.x, hazard.y);
    if (hazard.type === "debris") {
      if (hazard.active && dynamicLightsEnabled()) {
        const glow = ctx.createRadialGradient(screen.x, screen.y, 0, screen.x, screen.y, hazard.radius * state.camera.zoom);
        glow.addColorStop(0, "rgba(255, 196, 92, 0.45)");
        glow.addColorStop(1, "rgba(255, 123, 71, 0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(screen.x, screen.y, hazard.radius * state.camera.zoom, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(screen.x, screen.y, hazard.radius * state.camera.zoom, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 157, 77, ${hazard.active ? 0.82 : 0.34 + (hazard.telegraph || 0) * 0.5})`;
      ctx.lineWidth = hazard.active ? 3 : 2;
      ctx.stroke();
      continue;
    }

    const telegraphAlpha = hazard.telegraph > 0 ? 0.25 + hazard.telegraph * 0.6 : 0.18;
    ctx.beginPath();
    ctx.arc(screen.x, screen.y, hazard.radius * state.camera.zoom, 0, Math.PI * 2);
    ctx.strokeStyle = hazard.type === "vent"
      ? `rgba(255, 123, 71, ${hazard.active ? 0.75 : telegraphAlpha})`
      : `rgba(213, 140, 255, ${hazard.active ? 0.8 : telegraphAlpha})`;
    ctx.lineWidth = hazard.active ? 3 : 2;
    ctx.stroke();

    if (hazard.type === "vent" && hazard.active && dynamicLightsEnabled()) {
      const glow = ctx.createRadialGradient(screen.x, screen.y, 0, screen.x, screen.y, hazard.radius * state.camera.zoom);
      glow.addColorStop(0, "rgba(255, 196, 92, 0.65)");
      glow.addColorStop(1, "rgba(255, 123, 71, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(screen.x, screen.y, hazard.radius * state.camera.zoom, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  if (state.gravityPulse.life > 0) {
    const center = worldToScreen(0, 0);
    ctx.beginPath();
    ctx.arc(center.x, center.y, state.gravityPulse.radius * state.camera.zoom, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255, 102, 102, ${0.28 + state.gravityPulse.life * 0.55})`;
    ctx.lineWidth = 4;
    ctx.stroke();
  }
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
    if (dynamicLightsEnabled()) {
      ctx.shadowColor = burst.color;
      ctx.shadowBlur = 20;
    }
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
  if (dynamicLightsEnabled()) {
    ctx.shadowColor = "#58dfff";
    ctx.shadowBlur = 18;
  }
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
  const radius = (state.core.phase === "vulnerable" || state.core.phase === "shielded" || state.core.phase === "meltdown" ? state.core.radius : CORE_RADIUS_BLOCKS * BLOCK_SIZE) * state.camera.zoom;
  const g = ctx.createRadialGradient(center.x, center.y, 4, center.x, center.y, radius);
  if (state.core.phase === "vulnerable") {
    g.addColorStop(0, "#fff3bf");
    g.addColorStop(0.48, "#ff7b47");
    g.addColorStop(1, "rgba(255,123,71,0.08)");
  } else if (state.core.phase === "shielded") {
    g.addColorStop(0, "#eaf7ff");
    g.addColorStop(0.4, "#73cfff");
    g.addColorStop(0.72, "#5a78ff");
    g.addColorStop(1, "rgba(90,120,255,0.12)");
  } else if (state.core.phase === "meltdown") {
    g.addColorStop(0, "#ffffff");
    g.addColorStop(0.32, "#ffd24f");
    g.addColorStop(0.7, "#ff5d49");
    g.addColorStop(1, "rgba(255,93,73,0.12)");
  } else {
    g.addColorStop(0, "#fff3bf");
    g.addColorStop(0.55, "#ff7b47");
    g.addColorStop(1, "rgba(255,123,71,0.04)");
  }
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
  ctx.fill();

  if (state.core.phase === "vulnerable" || state.core.phase === "shielded" || state.core.phase === "meltdown") {
    ctx.strokeStyle = state.core.phase === "meltdown"
      ? "rgba(255,255,255,0.92)"
      : state.core.phase === "shielded"
        ? "rgba(145, 220, 255, 0.95)"
        : "rgba(255, 241, 172, 0.95)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius * 0.52, 0, Math.PI * 2);
    ctx.stroke();

    if (state.core.phase === "vulnerable") {
      const hpRatio = clamp(state.core.hp / state.core.hpMax, 0, 1);
      ctx.beginPath();
      ctx.arc(center.x, center.y, radius * 0.86, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * hpRatio);
      ctx.strokeStyle = "#62ff8d";
      ctx.lineWidth = 5;
      ctx.stroke();
    } else if (state.core.phase === "shielded") {
      const ringAlpha = 0.48 + Math.sin(state.time * 7.5) * 0.18 + state.core.pulseFlash;
      ctx.beginPath();
      ctx.arc(center.x, center.y, radius * 0.88, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(136, 218, 255, ${clamp(ringAlpha, 0.22, 0.95)})`;
      ctx.lineWidth = 5;
      ctx.stroke();
    }
  }
}

function drawSectorBoundaries() {
  const center = worldToScreen(0, 0);
  for (const sector of orderedMiningSectors(state.planet.id)) {
    const worldRadius = lerp(PLANET_RADIUS, CORE_RADIUS_BLOCKS * BLOCK_SIZE, sector.maxDepth);
    ctx.beginPath();
    ctx.arc(center.x, center.y, worldRadius * state.camera.zoom, 0, Math.PI * 2);
    ctx.strokeStyle = sector.ringColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
}

function render() {
  drawBackground();
  drawCoreGlow();
  drawSectorBoundaries();
  drawPlanetBlocks();
  drawHazards();
  drawDock();
  drawDockIndicator();
  drawPickups();
  drawBullets();
  drawLaser();
  drawParticles();
  drawShip();
  if (state.cinematic.active) {
    ctx.fillStyle = `rgba(255, 240, 200, ${Math.min(0.42, state.cinematic.timer * 0.16)})`;
    ctx.fillRect(0, 0, state.width, state.height);
  } else if (state.hazardFlash > 0) {
    ctx.fillStyle = `rgba(255, 123, 71, ${state.hazardFlash * 0.22})`;
    ctx.fillRect(0, 0, state.width, state.height);
  }
}

function drawResultsMap(report) {
  const mapCanvas = ui.resultsMap;
  if (!mapCanvas || !report) return;
  const reportKey = `${report.sortieNumber}:${report.success ? "win" : "loss"}:${report.planetId}:${report.blocksMined}:${report.minedPercent.toFixed(1)}:${report.coreStatusLabel}`;
  if (resultsMapCacheKey === reportKey) return;
  resultsMapCacheKey = reportKey;
  const mapCtx = mapCanvas.getContext("2d");
  const size = mapCanvas.width;
  const radius = size * 0.42;
  const blockRadius = Math.max(1.3, radius / (PLANET_RADIUS_BLOCKS * 1.35));
  mapCtx.clearRect(0, 0, size, size);
  mapCtx.save();
  mapCtx.translate(size / 2, size / 2);
  mapCtx.beginPath();
  mapCtx.arc(0, 0, radius, 0, Math.PI * 2);
  mapCtx.clip();

  const fill = mapCtx.createRadialGradient(0, 0, size * 0.05, 0, 0, radius);
  fill.addColorStop(0, "rgba(32, 22, 18, 0.96)");
  fill.addColorStop(0.5, "rgba(20, 34, 40, 0.98)");
  fill.addColorStop(1, "rgba(22, 64, 84, 0.98)");
  mapCtx.fillStyle = fill;
  mapCtx.fillRect(-size / 2, -size / 2, size, size);

  for (const block of state.planet.blocks) {
    if (!block.alive) continue;
    const x = (block.gx / PLANET_RADIUS_BLOCKS) * radius;
    const y = (block.gy / PLANET_RADIUS_BLOCKS) * radius;
    const hpRatio = block.hp / Math.max(1, block.maxHp);
    if (block.material === "crystal") {
      mapCtx.fillStyle = `rgba(255, 112, 228, ${0.62 + hpRatio * 0.18})`;
    } else if (block.material === "platinum") {
      mapCtx.fillStyle = `rgba(122, 208, 255, ${0.58 + hpRatio * 0.16})`;
    } else {
      mapCtx.fillStyle = `rgba(108, 232, 132, ${0.48 + hpRatio * 0.18})`;
    }
    mapCtx.fillRect(x - blockRadius * 0.5, y - blockRadius * 0.5, blockRadius, blockRadius);
  }

  mapCtx.strokeStyle = "rgba(132, 235, 255, 0.16)";
  mapCtx.lineWidth = 2;
  mapCtx.beginPath();
  mapCtx.arc(0, 0, radius, 0, Math.PI * 2);
  mapCtx.stroke();

  mapCtx.beginPath();
  mapCtx.arc(0, 0, (CORE_RADIUS_BLOCKS / PLANET_RADIUS_BLOCKS) * radius, 0, Math.PI * 2);
  mapCtx.fillStyle = "rgba(232, 174, 58, 0.72)";
  mapCtx.fill();

  const dockAngle = -Math.PI / 2;
  const dockX = Math.cos(dockAngle) * radius * 0.86;
  const dockY = Math.sin(dockAngle) * radius * 0.86;
  mapCtx.fillStyle = "rgba(255, 245, 225, 0.9)";
  mapCtx.beginPath();
  mapCtx.arc(dockX, dockY, 3, 0, Math.PI * 2);
  mapCtx.fill();

  for (let i = 0; i < 14; i += 1) {
    const angle = (i / 14) * Math.PI * 2 + 0.21;
    const markerRadius = radius * (0.2 + (i % 4) * 0.14);
    mapCtx.beginPath();
    mapCtx.arc(Math.cos(angle) * markerRadius, Math.sin(angle) * markerRadius, 2, 0, Math.PI * 2);
    mapCtx.fillStyle = "rgba(255, 86, 61, 0.66)";
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
  ui.resultsBankTotal.textContent = formatCredits(report.creditsAfter || 0);
  ui.resultsOre.textContent = fmt(report.delivered.ore || 0);
  ui.resultsPlatinum.textContent = fmt(report.delivered.platinum || 0);
  ui.resultsCrystal.textContent = fmt(report.delivered.crystal || 0);
  ui.resultsPeakCargo.textContent = fmt(report.peakCargo);
  ui.resultsPlanet.textContent = report.planetName;
  ui.resultsSector.textContent = report.sectorName;
  ui.resultsCompletion.textContent = formatPercent(report.planetCompletionPercent || 0);
  ui.resultsCoreStatus.textContent = report.coreStatusLabel || (report.coreCleared ? "Cleared" : report.coreUnlocked ? "Unlocked" : "Sealed");
  drawResultsMap(report);
}

function syncUi(force = true) {
  if (!force && state.mode === "sortie" && state.time - lastUiSyncTime < 0.12) return;
  lastUiSyncTime = state.time;
  const activePlanet = getPlanetDefinition(progress.currentPlanetId);
  const planetSnapshot = state.planetProgressSnapshot || computePlanetProgressSnapshot(state.planet, getActivePlanetProgress());
  const unlocked = unlockedPlanetIds();
  const canCyclePlanets = unlocked.length > 1;
  const report = progress.lastSortieReport;
  const purchasedCount = upgradeNodes.filter((node) => progress.upgrades[node.id]).length;
  const visibleNodeCount = visibleUpgradeNodeCount();
  const readyUpgrade = cheapestReadyUpgrade();
  const nextGoal = nearestUpgradeGoal();
  const nextResearch = nextResearchGoal();
  const nextPlanetTierNode = lockedPlanetTierNode();
  ui.bank.textContent = formatCredits(progress.credits);
  ui.bankOre.textContent = `${fmt(progress.bank.ore)} ore`;
  ui.bankPlatinum.textContent = `${fmt(progress.bank.platinum)} platinum`;
  ui.bankCrystal.textContent = `${fmt(progress.bank.crystal)} crystal`;
  ui.cargo.textContent = `${fmt(sumCargo(state.ship.cargo))} / ${fmt(state.ship.cargoCap)}`;
  ui.sortie.textContent = `#${progress.sortie}`;
  const fuelRatio = state.ship.fuel / state.ship.fuelMax;
  ui.fuelBar.style.width = `${fuelRatio * 100}%`;
  ui.hpBar.style.width = `${(state.ship.hp / state.ship.hpMax) * 100}%`;
  ui.dockBar.style.width = `${(state.dock.timer / state.dock.needed) * 100}%`;
  ui.fuelBar.parentElement?.classList.toggle("low", fuelRatio <= 0.18);
  ui.recentCargoValue.textContent = formatMaterials(progress.lastDeliveredCargo);
  ui.recentSortieDetail.textContent = report
    ? `${report.success ? "Returned" : "Lost"} • ${report.planetName} • ${fmt(report.blocksMined)} blocks`
    : "No debrief yet";
  ui.hangarBankValue.textContent = formatCredits(progress.credits);
  ui.hangarBankDetail.textContent = `Samples: Ore ${fmt(progress.bank.ore)} • Platinum ${fmt(progress.bank.platinum)} • Crystal ${fmt(progress.bank.crystal)}`;
  ui.hangarPlanetValue.textContent = activePlanet.name;
  ui.hangarPlanetDetail.textContent = `${planetThreatLabel(activePlanet.id)} • ${planetContractDetail(activePlanet.id)}`;
  ui.hangarSectorValue.textContent = `${planetSnapshot.currentSector.name} ${formatPercent(planetSnapshot.currentSector.percentCleared)}`;
  ui.hangarSectorDetail.textContent = `${planetSnapshot.currentSector.primaryMaterial} route • target ${formatPercent(planetSnapshot.currentSector.completionTarget)}`;
  ui.hangarCompletionValue.textContent = formatPercent(planetSnapshot.terrainClearedPercent || 0);
  ui.hangarCoreValue.textContent = planetSnapshot.coreCleared ? "Cleared" : planetSnapshot.coreUnlocked ? "Unlocked" : "Sealed";
  ui.hangarContractName.textContent = activePlanet.name;
  ui.hangarContractDetail.textContent = planetContractDetail(activePlanet.id);
  ui.hangarContractYield.textContent = `Yield Bias: ${planetYieldLabel(activePlanet.id)}`;
  ui.hangarContractPressure.textContent = planetThreatLabel(activePlanet.id);
  ui.hangarUpgradeGrid.textContent = `${purchasedCount} / ${visibleNodeCount} online`;
  ui.hangarNextUpgrade.textContent = readyUpgrade
    ? `Install ${readyUpgrade.label}`
    : nextResearch
      ? canAffordResearchCost(progress.bank, nextResearch.cost)
        ? `Research ${nextResearch.label}`
        : `Need ${formatMaterials(missingResearchCost(progress.bank, nextResearch.cost))}`
    : nextGoal
      ? `Need ${formatCost(missingCredits(progress.credits, nextGoal.cost))}`
      : nextPlanetTierNode
        ? nextPlanetTierNode.researchId && !progress.research?.[nextPlanetTierNode.researchId]
          ? `Research ${RESEARCH_NODES.find((node) => node.id === nextPlanetTierNode.researchId)?.label || "new systems"}`
          : `Await ${getPlanetDefinition(nextPlanetTierNode.unlockPlanet).name} systems`
        : "All systems online";
  ui.hangarTradeDetail.textContent = `Ore ${MATERIAL_SALE_VALUES.ore} cr • Platinum ${MATERIAL_SALE_VALUES.platinum} cr • Crystal ${MATERIAL_SALE_VALUES.crystal} cr`;
  ui.sellOreBtn.disabled = !progress.bank.ore;
  ui.sellPlatinumBtn.disabled = !progress.bank.platinum;
  ui.sellCrystalBtn.disabled = !progress.bank.crystal;
  ui.sellAllBtn.disabled = !sumCargo(progress.bank);
  ui.showUpgradesBtn.classList.toggle("active", state.hangarView === "upgrades");
  ui.showResearchBtn.classList.toggle("active", state.hangarView === "research");
  ui.upgradeTree.classList.toggle("hidden", state.hangarView !== "upgrades");
  ui.researchTree.classList.toggle("hidden", state.hangarView !== "research");
  ui.launchSortieBtn.textContent = `Launch ${activePlanet.name} Sortie`;
  const qualityId = qualityProfileId();
  const qualityProfile = currentQualityProfile();
  ui.qualityProfileDetail.textContent = `${qualityProfile.description} ${qualityProfile.fps} FPS • DPR ${qualityProfile.dprCap} cap.`;
  ui.qualityBatteryBtn.classList.toggle("active", qualityId === "battery");
  ui.qualityBalancedBtn.classList.toggle("active", qualityId === "balanced");
  ui.qualityPerformanceBtn.classList.toggle("active", qualityId === "performance");
  ui.fpsOffBtn.classList.toggle("active", !progress.settings.showFps);
  ui.fpsOnBtn.classList.toggle("active", !!progress.settings.showFps);
  ui.fpsCounter.textContent = `FPS ${Math.round(displayedFps)}`;
  ui.planetPrevBtn.disabled = !canCyclePlanets;
  ui.planetNextBtn.disabled = !canCyclePlanets;
  ui.hangarStatus.textContent = progress.lastStatus;
  ui.hangarStatus.classList.toggle("hidden", state.mode !== "hangar" || state.time > state.hangarStatusUntil);
  const safeTipIndex = clamp(state.tipIndex, 0, TIPS.length - 1);
  const currentTip = TIPS[safeTipIndex];
  ui.tipStep.textContent = `${safeTipIndex + 1} / ${TIPS.length}`;
  ui.tipTitle.textContent = currentTip.title;
  ui.tipBodyA.textContent = currentTip.bodyA;
  ui.tipBodyB.textContent = currentTip.bodyB;
  ui.tipCloseBtn.textContent = safeTipIndex >= TIPS.length - 1 ? "Launch Sortie" : "Continue";
  ui.continueBtn.disabled = progress.sortie === 1 && progress.credits === 0 && sumCargo(progress.bank) === 0 && Object.keys(progress.upgrades).length === 0;
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
  ui.fpsCounter.classList.toggle("hidden", !inGameplay || !progress.settings.showFps);
  ui.title.classList.toggle("visible", inMenu);
  ui.hangarScreen.classList.toggle("visible", inHangar);
  ui.tipScreen.classList.toggle("visible", state.mode === "tip");
  ui.resultsScreen.classList.toggle("visible", inResults);
}

function resize() {
  syncViewportVars();
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, currentQualityProfile().dprCap);
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
  if (event.code === "Enter") {
    if (state.mode === "menu") {
      if (progress.hasSeenTip) startSortie();
      else ui.tipScreen.classList.add("visible");
    } else if (state.mode === "hangar") {
      startSortie();
    } else if (state.mode === "results") {
      showHangarScreen();
    } else if (state.mode === "tip") {
      advanceTip();
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
ui.qualityBatteryBtn.addEventListener("click", () => {
  playUiClick();
  setQualityProfile("battery");
});
ui.qualityBalancedBtn.addEventListener("click", () => {
  playUiClick();
  setQualityProfile("balanced");
});
ui.qualityPerformanceBtn.addEventListener("click", () => {
  playUiClick();
  setQualityProfile("performance");
});
ui.fpsOffBtn.addEventListener("click", () => {
  playUiClick();
  setFpsVisibility(false);
});
ui.fpsOnBtn.addEventListener("click", () => {
  playUiClick();
  setFpsVisibility(true);
});
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
  advanceTip();
});
ui.sellOreBtn.addEventListener("click", () => {
  playUiClick();
  sellMaterial("ore");
});
ui.sellPlatinumBtn.addEventListener("click", () => {
  playUiClick();
  sellMaterial("platinum");
});
ui.sellCrystalBtn.addEventListener("click", () => {
  playUiClick();
  sellMaterial("crystal");
});
ui.sellAllBtn.addEventListener("click", () => {
  playUiClick();
  sellAllMaterials();
});
ui.showUpgradesBtn.addEventListener("click", () => {
  playUiClick();
  setHangarView("upgrades");
});
ui.showResearchBtn.addEventListener("click", () => {
  playUiClick();
  setHangarView("research");
});
ui.launchSortieBtn.addEventListener("click", () => {
  playUiClick();
  startSortie();
});
ui.planetPrevBtn.addEventListener("click", () => {
  playUiClick();
  selectPlanet(-1);
});
ui.planetNextBtn.addEventListener("click", () => {
  playUiClick();
  selectPlanet(1);
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
    const dist = length2D(dx, dy) || 1;
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

function blockIOSGameGestures() {
  const targets = [
    canvas,
    ui.mobileControls,
    ui.moveStick,
    ui.aimStick,
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
    planet: {
      id: state.planet.id,
      name: state.planet.definition.name,
      currentSectorId: state.planetProgressSnapshot?.currentSectorId,
      currentSector: state.planetProgressSnapshot?.currentSector?.name,
      currentSectorCleared: Number((state.planetProgressSnapshot?.currentSector?.percentCleared || 0).toFixed(1)),
      completionPercent: Number((state.planetProgressSnapshot?.completionPercent || 0).toFixed(1)),
      coreUnlocked: !!state.planetProgressSnapshot?.coreUnlocked,
      coreCleared: !!state.planetProgressSnapshot?.coreCleared,
    },
    core: {
      phase: state.core.phase,
      phaseTimer: Number(state.core.phaseTimer.toFixed(2)),
      hp: Number(state.core.hp.toFixed(1)),
      hpMax: state.core.hpMax,
      cinematicActive: state.cinematic.active,
    },
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
      credits: progress.credits,
      samples: progress.bank,
      research: progress.research,
      sortie: progress.sortie,
    },
    hazards: state.hazards.map((hazard) => ({
      type: hazard.type,
      x: Math.round(hazard.x),
      y: Math.round(hazard.y),
      active: !!hazard.active,
      telegraph: Number((hazard.telegraph || 0).toFixed(2)),
    })),
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
  requestAnimationFrame(frame);
  if (document.hidden || state.mode !== "sortie") {
    last = now;
    frameAccumulator = 0;
    fpsSampleTime = now;
    fpsSampleFrames = 0;
    return;
  }
  const frameTime = 1000 / currentQualityProfile().fps;
  const elapsedSinceLastFrame = Math.min(100, now - last);
  last = now;
  frameAccumulator = Math.min(frameAccumulator + elapsedSinceLastFrame, frameTime * 3);
  if (frameAccumulator < frameTime) return;
  frameAccumulator -= frameTime;
  const dt = Math.min(0.05, frameTime / 1000);
  fpsSampleFrames += 1;
  if (!fpsSampleTime) fpsSampleTime = now;
  const elapsed = now - fpsSampleTime;
  if (elapsed >= 250) {
    displayedFps = (fpsSampleFrames * 1000) / elapsed;
    fpsSampleFrames = 0;
    fpsSampleTime = now;
  }
  update(dt);
  render();
}

resize();
applyUpgrades();
refreshPlanetProgress({ persist: true });
renderUpgradeTree();
renderResearchTree();
setupUpgradeTreeZoom();
setupUpgradeTreePan();
syncUi();
updateMenuCacheBadge();
requestAnimationFrame(frame);
window.addEventListener("resize", () => {
  resize();
  syncUi();
  if (state.mode === "sortie") snapCameraToTarget();
  if (state.mode === "hangar") {
    renderUpgradeTree();
    renderResearchTree();
  }
  render();
});
window.addEventListener("orientationchange", () => {
  window.setTimeout(() => {
    resize();
    syncUi();
    if (state.mode === "sortie") snapCameraToTarget();
    if (state.mode === "hangar") {
      renderUpgradeTree();
      renderResearchTree();
    }
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
