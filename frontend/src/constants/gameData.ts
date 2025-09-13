import type { StarterData } from '../types/game';

// Game configuration constants
export const GAME_CONFIG = {
  DAILY_UPDATE_INTERVAL: 30000, // 30 seconds = 1 game day
  RECRUITMENT_COST: 50,
  TUTORIAL_DELAY: 1000,
  NOTIFICATION_DEFAULT_DURATION: 5000,
} as const;

// Enhanced daemon quirks with mechanical effects
export const DAEMON_QUIRKS = [
  {
    name: 'Loves paperwork',
    effect: 'bureaucratic_bonus',
    value: 2,
    description: '+2 Bureaucratic Leverage per day',
  },
  {
    name: 'Afraid of printers',
    effect: 'office_penalty',
    value: -5,
    description: '-5% mission success in office environments',
  },
  {
    name: 'Aggressive in meetings',
    effect: 'combat_bonus',
    value: 15,
    description: '+15% combat effectiveness',
  },
  {
    name: 'Collects staplers',
    effect: 'equipment_durability',
    value: 10,
    description: '+10% equipment durability retention',
  },
  {
    name: 'Excellent with Excel',
    effect: 'sabotage_bonus',
    value: 20,
    description: '+20% sabotage success rate',
  },
  {
    name: 'Steals lunch from fridge',
    effect: 'morale_penalty',
    value: -3,
    description: '-3 morale for all team members',
  },
  {
    name: 'Always on time',
    effect: 'mission_speed',
    value: 0.8,
    description: 'Missions complete 20% faster',
  },
  {
    name: 'Hoards office supplies',
    effect: 'resource_bonus',
    value: 10,
    description: '+10% mission resource rewards',
  },
  {
    name: 'Talks to plants',
    effect: 'stress_reduction',
    value: 5,
    description: '+5 morale recovery per day',
  },
  {
    name: 'Obsessed with filing',
    effect: 'infiltration_bonus',
    value: 15,
    description: '+15% infiltration success rate',
  },
  {
    name: 'Makes terrible coffee',
    effect: 'team_morale_penalty',
    value: -2,
    description: '-2 morale for all daemons in apartment',
  },
  {
    name: 'Expert at small talk',
    effect: 'diplomatic_bonus',
    value: 25,
    description: '+25% success on diplomatic missions',
  },
  {
    name: 'Chronic overthinker',
    effect: 'analysis_bonus',
    value: 1,
    description: '+1 Bureaucratic Leverage when missions fail',
  },
  {
    name: 'Compulsive reorganizer',
    effect: 'efficiency_bonus',
    value: 5,
    description: '+5% apartment room effectiveness',
  },
  {
    name: 'Stress eats donuts',
    effect: 'health_drain',
    value: -2,
    description: '-2 health per day when below 50 morale',
  },
  {
    name: 'Speaks only in memos',
    effect: 'corporate_bonus',
    value: 3,
    description: '+3 Bureaucratic Leverage per successful mission',
  },
  {
    name: 'Paranoid about IT',
    effect: 'tech_penalty',
    value: -10,
    description: '-10% effectiveness with tech-based equipment',
  },
  {
    name: 'Judges your font choices',
    effect: 'perfectionist',
    value: 10,
    description: '+10% mission success but +1 day mission duration',
  },
  {
    name: 'Always cold',
    effect: 'comfort_dependent',
    value: -1,
    description: '-1 lifespan day per day unless apartment has heating upgrade',
  },
  {
    name: 'Micromanages everything',
    effect: 'control_bonus',
    value: 12,
    description: '+12% team mission success when assigned as team leader',
  },
  {
    name: 'Loves corporate buzzwords',
    effect: 'synergy_bonus',
    value: 8,
    description: '+8% mission success when working with 2+ team members',
  },
  {
    name: "Can't use technology",
    effect: 'analog_specialist',
    value: 20,
    description: '+20% effectiveness without equipment, -50% with equipment',
  },
  {
    name: 'Addicted to meetings',
    effect: 'bureaucracy_master',
    value: 5,
    description: '+5 Bureaucratic Leverage per week, -1 morale per day',
  },
  {
    name: 'Master of passive aggression',
    effect: 'psychological_warfare',
    value: 15,
    description: '+15% mission success against corporate targets',
  },
  {
    name: 'Sabotages team lunches',
    effect: 'team_saboteur',
    value: -5,
    description: 'Causes random equipment malfunction for team members',
  },
  {
    name: 'Refuses to update passwords',
    effect: 'security_risk',
    value: 0.1,
    description: '10% chance of triggering security audit events',
  },
  {
    name: 'Hoards vacation days',
    effect: 'longevity_bonus',
    value: 5,
    description: '+5 starting lifespan days',
  },
  {
    name: 'Suspicious of new hires',
    effect: 'veteran_insight',
    value: 0.05,
    description: '5% chance to detect mission ambushes in advance',
  },
  {
    name: 'Lives for performance reviews',
    effect: 'review_enthusiast',
    value: 10,
    description: '+10% chance of positive corporate events',
  },
];

// Starter game data
export const STARTER_DATA: StarterData = {
  starter_daemons: [
    {
      name: 'Belphegor-7734',
      specialization: 'Infiltration',
      health: 100,
      morale: 75,
      lifespanDays: 45,
      quirks: [DAEMON_QUIRKS[0], DAEMON_QUIRKS[1]], // Loves paperwork, Afraid of printers
      generation: 1,
      bloodline: 'House of Burning Spreadsheets',
      inheritedTraits: [],
      legacy: {
        successfulMissions: 0,
        planetsConquered: 0,
        equipmentCreated: 0,
        yearsServed: 0,
      },
    },
    {
      name: 'Malphas-2156',
      specialization: 'Combat',
      health: 100,
      morale: 60,
      lifespanDays: 60,
      quirks: [DAEMON_QUIRKS[2], DAEMON_QUIRKS[3]], // Aggressive in meetings, Collects staplers
      generation: 1,
      bloodline: 'The Synergy Syndicate',
      inheritedTraits: [],
      legacy: {
        successfulMissions: 0,
        planetsConquered: 0,
        equipmentCreated: 0,
        yearsServed: 0,
      },
    },
    {
      name: 'Vassago-9981',
      specialization: 'Sabotage',
      health: 100,
      morale: 80,
      lifespanDays: 30,
      quirks: [DAEMON_QUIRKS[4], DAEMON_QUIRKS[5]], // Excellent with Excel, Steals lunch from fridge
      generation: 1,
      bloodline: 'Clan PowerPoint',
      inheritedTraits: [],
      legacy: {
        successfulMissions: 0,
        planetsConquered: 0,
        equipmentCreated: 0,
        yearsServed: 0,
      },
    },
  ],
  starter_equipment: [
    {
      name: 'Standard Issue Briefcase',
      type: 'Infiltration',
      durability: 100,
      ability: 'Blend In (+15 stealth)',
      generation: 0,
      legacyBonus: 0,
      history: ['Corporate standard issue'],
    },
    {
      name: 'Corporate Tie of Binding',
      type: 'Combat',
      durability: 100,
      ability: 'Intimidate (+10 combat)',
      generation: 0,
      legacyBonus: 0,
      history: ['Corporate standard issue'],
    },
    {
      name: 'Cursed Calculator',
      type: 'Sabotage',
      durability: 90,
      ability: 'Data Corruption (+20 sabotage)',
      generation: 0,
      legacyBonus: 0,
      history: ['Corporate standard issue'],
    },
  ],
  planets: [
    {
      name: 'Xerox-7',
      difficulty: 'Easy',
      type: 'Office Planet',
      resistance: 'Militant Accountants',
      reward: '150 Credits, 2 Soul Essence',
    },
    {
      name: 'Synergy-Prime',
      difficulty: 'Medium',
      type: 'Corporate Headquarters',
      resistance: 'Executive Board',
      reward: '300 Credits, 5 Bureaucratic Leverage',
    },
    {
      name: 'Productivity-Nine',
      difficulty: 'Hard',
      type: 'Factory World',
      resistance: 'Union Demons',
      reward: '500 Credits, 3 Raw Materials',
    },
  ],
  apartment_rooms: [
    {
      name: 'Living Quarters',
      level: 1,
      bonus: 'Morale Recovery +5/day',
      upgrade_cost: 200,
    },
    {
      name: 'Command Center',
      level: 1,
      bonus: 'Mission Success +5%',
      upgrade_cost: 300,
    },
    {
      name: 'Training Hall',
      level: 0,
      bonus: 'Skill Development +10%',
      upgrade_cost: 400,
    },
    {
      name: 'Recovery Ward',
      level: 0,
      bonus: 'Health Recovery +15/day',
      upgrade_cost: 350,
    },
    {
      name: 'Item Forge',
      level: 0,
      bonus: 'Equipment Repair -20% cost',
      upgrade_cost: 450,
    },
  ],
};

// Daemon bloodlines for legacy system
export const DAEMON_BLOODLINES = [
  'House of Burning Spreadsheets',
  'The Excel Exarchs',
  'Clan PowerPoint',
  'The Synergy Syndicate',
  'Brotherhood of Bureaucracy',
  'The Productivity Prophets',
  'Order of Optimized Operations',
  'The Efficiency Elite',
  'House of Hostile Takeovers',
  'The Merger Magistrates',
];

// Inherited traits that can be passed down through generations
export const INHERITED_TRAITS = [
  'Veteran Negotiator (+10% mission success on diplomatic missions)',
  'Equipment Whisperer (+20% equipment durability)',
  'Corporate Bloodhound (+15% resource gathering)',
  'Legacy of Leadership (+5 morale for all team members)',
  'Ancient Wisdom (+1 extra day of lifespan)',
  'Master Craftsman (+50% equipment creation speed)',
  'Tactical Genius (+25% combat effectiveness)',
  'Shadow Walker (+30% infiltration success)',
  'Data Oracle (+20% sabotage precision)',
  "Survivor's Instinct (+10% chance to survive failed missions)",
  'Inspiring Presence (+5 morale to all daemons when active)',
  'Corporate Memory (+10% bureaucratic leverage generation)',
  'Resource Magnet (+25% mission rewards)',
  'Equipment Bond (can use any equipment regardless of specialization)',
  'Generational Momentum (+5% mission success per generation)',
];
export const DAEMON_NAMES = [
  'Belphegor',
  'Malphas',
  'Vassago',
  'Amon',
  'Barbatos',
  'Paimon',
  'Beleth',
  'Purson',
  'Marax',
  'Ipos',
  'Aim',
  'Naberius',
  'Glasya-labolas',
  'Bune',
  'Ronove',
  'Berith',
  'Astaroth',
  'Forneus',
  'Foras',
  'Asmoday',
  'Gaap',
  'Furfur',
  'Marchosias',
  'Stolas',
  'Phenex',
  'Halphas',
  'Malphas',
  'Raum',
  'Focalor',
  'Vepar',
  'Sabnock',
  'Shax',
  'Vine',
  'Bifrons',
  'Vual',
  'Haagenti',
  'Crocell',
  'Furcas',
  'Balam',
  'Alloces',
  'Caim',
  'Murmur',
  'Orobas',
  'Gremory',
  'Ose',
  'Amy',
  'Orias',
  'Vapula',
  'Zagan',
  'Valac',
  'Andras',
  'Flauros',
  'Andrealphus',
  'Kimaris',
  'Amdusias',
  'Belial',
  'Decarabia',
  'Seere',
  'Dantalion',
  'Andromalius',
];

// Corporate events with expanded variety and strategic choices
export const CORPORATE_EVENTS = [
  {
    id: 'performance_review',
    title: 'Performance Review',
    description:
      'Annual evaluations are being conducted. How do you handle the bureaucracy?',
    type: 'choice' as const,
    choices: [
      {
        label: 'Embrace the Process',
        description: 'Follow all protocols exactly',
        effects: [
          { type: 'morale', value: -5, description: 'Daemons find it tedious' },
          {
            type: 'bureaucraticLeverage',
            value: 3,
            description: 'Gain bureaucratic favor',
          },
        ],
      },
      {
        label: 'Creative Interpretation',
        description: 'Find loopholes in the system',
        effects: [
          {
            type: 'morale',
            value: 10,
            description: 'Daemons appreciate the cleverness',
          },
          { type: 'credits', value: 150, description: 'Efficiency bonus' },
          {
            type: 'corruption_risk',
            value: 0.1,
            description: '10% chance of audit next turn',
          },
        ],
      },
    ],
  },
  {
    id: 'budget_restructuring',
    title: 'Budget Restructuring',
    description:
      'Corporate is reshuffling departmental budgets. Do you lobby for more funding?',
    type: 'choice' as const,
    choices: [
      {
        label: 'Submit Formal Request',
        description: 'Go through proper channels',
        effects: [
          {
            type: 'bureaucraticLeverage',
            value: -2,
            description: 'Spend political capital',
          },
          {
            type: 'credits',
            value: 400,
            description: 'Secure additional funding',
          },
        ],
      },
      {
        label: 'Accept Cuts Gracefully',
        description: 'Show fiscal responsibility',
        effects: [
          {
            type: 'credits',
            value: -150,
            description: 'Reduced operational budget',
          },
          {
            type: 'bureaucraticLeverage',
            value: 1,
            description: 'Gain respect for restraint',
          },
        ],
      },
    ],
  },
  {
    id: 'hostile_takeover',
    title: 'Hostile Takeover Attempt',
    description:
      'A rival daemon corporation is trying to acquire your operations. How do you respond?',
    type: 'choice' as const,
    choices: [
      {
        label: 'Fight Back',
        description: 'Mobilize all resources to resist',
        effects: [
          {
            type: 'soulEssence',
            value: -1,
            description: 'Burn essence for power',
          },
          {
            type: 'morale',
            value: 15,
            description: 'Daemons rally to the cause',
          },
          { type: 'credits', value: 200, description: 'Victory spoils' },
        ],
      },
      {
        label: 'Negotiate Terms',
        description: 'Find a mutually beneficial arrangement',
        effects: [
          {
            type: 'bureaucraticLeverage',
            value: 2,
            description: 'Gain political connections',
          },
          {
            type: 'daemon_retirement',
            value: 1,
            description: 'One daemon transferred away',
          },
        ],
      },
    ],
  },
  {
    id: 'infernal_audit',
    title: 'Infernal Audit',
    description:
      "Hell's Revenue Service is conducting a thorough investigation of your books.",
    type: 'automatic' as const,
    effects: [
      { type: 'credits', value: -100, description: 'Audit fees and penalties' },
      {
        type: 'equipment_durability',
        value: -10,
        description: 'Equipment seized temporarily',
      },
      { type: 'morale', value: -8, description: 'Stress from investigation' },
    ],
  },
  {
    id: 'corporate_merger',
    title: 'Corporate Merger',
    description:
      'Your department is merging with the Circles of Bureaucratic Excellence.',
    type: 'automatic' as const,
    effects: [
      {
        type: 'recruitment_discount',
        value: 0.5,
        description: 'Half-price recruitment for 3 days',
      },
      {
        type: 'bureaucraticLeverage',
        value: 5,
        description: 'Enhanced political connections',
      },
      {
        type: 'office_politics',
        value: 1,
        description: 'Increased workplace drama',
      },
    ],
  },
  {
    id: 'soul_market_crash',
    title: 'Soul Market Crash',
    description: 'The infernal soul exchange has suffered a major downturn.',
    type: 'automatic' as const,
    effects: [
      { type: 'soulEssence', value: -2, description: 'Portfolio losses' },
      {
        type: 'equipment_discount',
        value: 0.3,
        description: '30% off equipment repairs',
      },
    ],
  },
  {
    id: 'mandatory_training',
    title: 'Mandatory Sensitivity Training',
    description:
      "HR requires all staff to attend 'Workplace Harmony in the 9th Circle.'",
    type: 'choice' as const,
    choices: [
      {
        label: 'Attend Enthusiastically',
        description: 'Show corporate spirit',
        effects: [
          { type: 'morale', value: -5, description: 'Boring but mandatory' },
          {
            type: 'bureaucraticLeverage',
            value: 1,
            description: 'HR brownie points',
          },
          {
            type: 'productivity_bonus',
            value: 0.1,
            description: '10% mission bonus for 5 missions',
          },
        ],
      },
      {
        label: 'Skip the Training',
        description: 'Find creative excuses',
        effects: [
          {
            type: 'morale',
            value: 8,
            description: 'Daemons appreciate the rebellion',
          },
          {
            type: 'hr_investigation',
            value: 1,
            description: 'HR scrutiny increases',
          },
        ],
      },
    ],
  },
  {
    id: 'equipment_recall',
    title: 'Equipment Recall Notice',
    description: 'Manufacturing defects found in corporate-issued briefcases.',
    type: 'automatic' as const,
    effects: [
      {
        type: 'equipment_upgrade',
        value: 1,
        description: 'One random equipment gets +20 durability',
      },
      { type: 'credits', value: 75, description: 'Compensation payment' },
    ],
  },
  {
    id: 'promotion_opportunity',
    title: 'Promotion Opportunity',
    description:
      'A senior management position has opened up. Do you pursue it?',
    type: 'choice' as const,
    requirements: { bureaucraticLeverage: 5 },
    choices: [
      {
        label: 'Apply for Promotion',
        description: 'Leverage your political capital',
        effects: [
          {
            type: 'bureaucraticLeverage',
            value: -5,
            description: 'Spend political capital',
          },
          {
            type: 'passive_income',
            value: 50,
            description: 'Earn 50 credits per day',
          },
          {
            type: 'management_stress',
            value: 1,
            description: 'All daemons lose 1 lifespan/day',
          },
        ],
      },
      {
        label: 'Decline Gracefully',
        description: 'Stay in your current role',
        effects: [
          {
            type: 'morale',
            value: 5,
            description: 'Less pressure on the team',
          },
          { type: 'credits', value: 100, description: 'Loyalty bonus' },
        ],
      },
    ],
  },
  {
    id: 'office_party',
    title: 'Annual Office Holiday Party',
    description: 'The company is throwing its legendary holiday celebration.',
    type: 'choice' as const,
    choices: [
      {
        label: 'Attend and Network',
        description: 'Schmooze with upper management',
        effects: [
          {
            type: 'bureaucraticLeverage',
            value: 2,
            description: 'Make valuable connections',
          },
          {
            type: 'credits',
            value: -30,
            description: 'Gift and outfit expenses',
          },
        ],
      },
      {
        label: 'Skip the Party',
        description: 'Use the time productively',
        effects: [
          {
            type: 'research_progress',
            value: 1,
            description: 'Advance equipment research',
          },
          { type: 'morale', value: -3, description: 'Team feels antisocial' },
        ],
      },
      {
        label: 'Volunteer to Organize',
        description: 'Take charge of the event',
        effects: [
          {
            type: 'morale',
            value: 12,
            description: 'Team loves your leadership',
          },
          {
            type: 'bureaucraticLeverage',
            value: 1,
            description: 'Impress management',
          },
          {
            type: 'stress',
            value: 1,
            description: 'One daemon loses 2 health',
          },
        ],
      },
    ],
  },
];

// Crafting recipes
export const CRAFTING_RECIPES = [
  {
    id: 'briefcase',
    name: 'Standard Briefcase',
    type: 'Infiltration',
    ability: 'Blend In (+10 stealth)',
    durability: 80,
    cost: { credits: 100, rawMaterials: 0 },
  },
  {
    id: 'tie',
    name: 'Corporate Tie',
    type: 'Combat',
    ability: 'Intimidate (+8 combat)',
    durability: 75,
    cost: { credits: 75, rawMaterials: 0 },
  },
  {
    id: 'calculator',
    name: 'Calculator',
    type: 'Sabotage',
    ability: 'Data Processing (+12 sabotage)',
    durability: 90,
    cost: { credits: 125, rawMaterials: 1 },
  },
];

// Mission success factors by specialization vs planet difficulty
export const MISSION_SUCCESS_FACTORS = {
  Easy: { Infiltration: 0.8, Combat: 0.7, Sabotage: 0.9 },
  Medium: { Infiltration: 0.6, Combat: 0.8, Sabotage: 0.7 },
  Hard: { Infiltration: 0.4, Combat: 0.9, Sabotage: 0.5 },
};

// Difficulty multipliers for rewards and casualties
export const DIFFICULTY_MODIFIERS = {
  Easy: { rewardMultiplier: 1.0, casualtyChance: 0.1 },
  Medium: { rewardMultiplier: 1.5, casualtyChance: 0.25 },
  Hard: { rewardMultiplier: 2.0, casualtyChance: 0.4 },
};
