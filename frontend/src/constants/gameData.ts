import type { StarterData } from '../types/game';

// Game configuration constants
export const GAME_CONFIG = {
  DAILY_UPDATE_INTERVAL: 30000, // 30 seconds = 1 game day
  RECRUITMENT_COST: 50,
  TUTORIAL_DELAY: 1000,
  NOTIFICATION_DEFAULT_DURATION: 5000,
} as const;

// Starter game data
export const STARTER_DATA: StarterData = {
  starter_daemons: [
    {
      name: "Belphegor-7734",
      specialization: "Infiltration",
      health: 100,
      morale: 75,
      lifespanDays: 45,
      quirks: ["Loves paperwork", "Afraid of printers"]
    },
    {
      name: "Malphas-2156",
      specialization: "Combat",
      health: 100,
      morale: 60,
      lifespanDays: 60,
      quirks: ["Aggressive in meetings", "Collects staplers"]
    },
    {
      name: "Vassago-9981",
      specialization: "Sabotage",
      health: 100,
      morale: 80,
      lifespanDays: 30,
      quirks: ["Excellent with Excel", "Steals lunch from fridge"]
    }
  ],
  starter_equipment: [
    {
      name: "Standard Issue Briefcase",
      type: "Infiltration",
      durability: 100,
      ability: "Blend In (+15 stealth)"
    },
    {
      name: "Corporate Tie of Binding",
      type: "Combat",
      durability: 100,
      ability: "Intimidate (+10 combat)"
    },
    {
      name: "Cursed Calculator",
      type: "Sabotage",
      durability: 90,
      ability: "Data Corruption (+20 sabotage)"
    }
  ],
  planets: [
    {
      name: "Xerox-7",
      difficulty: "Easy",
      type: "Office Planet",
      resistance: "Militant Accountants",
      reward: "150 Credits, 2 Soul Essence"
    },
    {
      name: "Synergy-Prime",
      difficulty: "Medium",
      type: "Corporate Headquarters",
      resistance: "Executive Board",
      reward: "300 Credits, 5 Bureaucratic Leverage"
    },
    {
      name: "Productivity-Nine",
      difficulty: "Hard",
      type: "Factory World",
      resistance: "Union Demons",
      reward: "500 Credits, 3 Raw Materials"
    }
  ],
  apartment_rooms: [
    {
      name: "Living Quarters",
      level: 1,
      bonus: "Morale Recovery +5/day",
      upgrade_cost: 200
    },
    {
      name: "Command Center",
      level: 1,
      bonus: "Mission Success +5%",
      upgrade_cost: 300
    },
    {
      name: "Training Hall",
      level: 0,
      bonus: "Skill Development +10%",
      upgrade_cost: 400
    },
    {
      name: "Recovery Ward",
      level: 0,
      bonus: "Health Recovery +15/day",
      upgrade_cost: 350
    },
    {
      name: "Item Forge",
      level: 0,
      bonus: "Equipment Repair -20% cost",
      upgrade_cost: 450
    }
  ]
};

// Daemon name generation data
export const DAEMON_NAMES = [
  "Belphegor", "Malphas", "Vassago", "Amon", "Barbatos", "Paimon", "Beleth",
  "Purson", "Marax", "Ipos", "Aim", "Naberius", "Glasya-labolas", "Bune",
  "Ronove", "Berith", "Astaroth", "Forneus", "Foras", "Asmoday", "Gaap",
  "Furfur", "Marchosias", "Stolas", "Phenex", "Halphas", "Malphas", "Raum",
  "Focalor", "Vepar", "Sabnock", "Shax", "Vine", "Bifrons", "Vual", "Haagenti",
  "Crocell", "Furcas", "Balam", "Alloces", "Caim", "Murmur", "Orobas", "Gremory",
  "Ose", "Amy", "Orias", "Vapula", "Zagan", "Valac", "Andras", "Flauros",
  "Andrealphus", "Kimaris", "Amdusias", "Belial", "Decarabia", "Seere", "Dantalion",
  "Andromalius"
];

// Daemon quirks
export const DAEMON_QUIRKS = [
  "Loves paperwork",
  "Afraid of printers",
  "Aggressive in meetings",
  "Collects staplers",
  "Excellent with Excel",
  "Steals lunch from fridge",
  "Always on time",
  "Hoards office supplies",
  "Talks to plants",
  "Obsessed with filing",
  "Makes terrible coffee",
  "Expert at small talk",
  "Chronic overthinker",
  "Compulsive reorganizer",
  "Stress eats donuts",
  "Speaks only in memos",
  "Paranoid about IT",
  "Judges your font choices",
  "Always cold",
  "Micromanages everything",
  "Loves corporate buzzwords",
  "Can't use technology",
  "Addicted to meetings",
  "Master of passive aggression",
  "Sabotages team lunches",
  "Refuses to update passwords",
  "Hoards vacation days",
  "Suspicious of new hires",
  "Lives for performance reviews"
];

// Corporate events
export const CORPORATE_EVENTS = [
  {
    title: "Performance Review",
    description: "Annual evaluations are being conducted",
    effects: [
      { type: "morale", value: -10, description: "All daemons lose 10 morale" },
      { type: "credits", value: 100, description: "Receive efficiency bonus" }
    ]
  },
  {
    title: "Budget Cuts",
    description: "Corporate has reduced operational funding",
    effects: [
      { type: "credits", value: -200, description: "Lose 200 credits" }
    ]
  },
  {
    title: "Team Building Exercise",
    description: "Mandatory corporate bonding activities",
    effects: [
      { type: "morale", value: 15, description: "All daemons gain 15 morale" },
      { type: "credits", value: -50, description: "Activity costs 50 credits" }
    ]
  },
  {
    title: "Equipment Audit",
    description: "All equipment durability is being assessed",
    effects: [
      { type: "equipment_durability", value: -5, description: "All equipment loses 5 durability" }
    ]
  },
  {
    title: "Unexpected Bonus",
    description: "Corporate profits exceeded expectations",
    effects: [
      { type: "credits", value: 300, description: "Receive 300 credits" },
      { type: "soulEssence", value: 1, description: "Gain 1 Soul Essence" }
    ]
  }
];

// Crafting recipes
export const CRAFTING_RECIPES = [
  {
    id: "briefcase",
    name: "Standard Briefcase",
    type: "Infiltration",
    ability: "Blend In (+10 stealth)",
    durability: 80,
    cost: { credits: 100, rawMaterials: 0 }
  },
  {
    id: "tie",
    name: "Corporate Tie",
    type: "Combat",
    ability: "Intimidate (+8 combat)",
    durability: 75,
    cost: { credits: 75, rawMaterials: 0 }
  },
  {
    id: "calculator",
    name: "Calculator",
    type: "Sabotage",
    ability: "Data Processing (+12 sabotage)",
    durability: 90,
    cost: { credits: 125, rawMaterials: 1 }
  }
];

// Mission success factors by specialization vs planet difficulty
export const MISSION_SUCCESS_FACTORS = {
  Easy: { Infiltration: 0.8, Combat: 0.7, Sabotage: 0.9 },
  Medium: { Infiltration: 0.6, Combat: 0.8, Sabotage: 0.7 },
  Hard: { Infiltration: 0.4, Combat: 0.9, Sabotage: 0.5 }
};

// Difficulty multipliers for rewards and casualties
export const DIFFICULTY_MODIFIERS = {
  Easy: { rewardMultiplier: 1.0, casualtyChance: 0.1 },
  Medium: { rewardMultiplier: 1.5, casualtyChance: 0.25 },
  Hard: { rewardMultiplier: 2.0, casualtyChance: 0.4 }
};
