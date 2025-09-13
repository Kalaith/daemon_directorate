import type { StarterData, CorporateTier, ComplianceTask, PrestigeBonus, CorporateRival } from '../types/game';

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

// Corporate Tier System
export const ASSOCIATE_TIER: CorporateTier = {
  id: 'associate',
  name: 'Associate',
  level: 1,
  requirements: {}, // Default tier
  unlocks: {
    mechanics: ['basic_missions', 'equipment_crafting'],
    apartmentRooms: ['living_quarters', 'command_center'],
    resources: ['credits']
  }
};

export const MANAGER_TIER: CorporateTier = {
  id: 'manager',
  name: 'Manager',
  level: 2,
  requirements: {
    planetsControlled: 1,
    daysLived: 20
  },
  unlocks: {
    mechanics: ['hr_reviews', 'team_disputes'],
    apartmentRooms: ['training_hall'],
    eventTypes: ['management_events']
  }
};

export const DIRECTOR_TIER: CorporateTier = {
  id: 'director',
  name: 'Director',
  level: 3,
  requirements: {
    planetsControlled: 2,
    completedHRReviews: 3
  },
  unlocks: {
    mechanics: ['planetary_reports', 'large_teams', 'surreal_events'],
    apartmentRooms: ['expanded_command_center'],
    eventTypes: ['absurd_bureaucracy']
  }
};

export const VP_TIER: CorporateTier = {
  id: 'vice_president',
  name: 'Vice President',
  level: 4,
  requirements: {
    planetsControlled: 3,
    legacyGenerations: 2
  },
  unlocks: {
    resources: ['soul_essence', 'bureaucratic_leverage'],
    mechanics: ['corporate_rivalries', 'hall_of_infamy'],
    apartmentRooms: ['war_room'],
    eventTypes: ['rival_corporations']
  }
};

export const BOARD_MEMBER_TIER: CorporateTier = {
  id: 'board_member',
  name: 'Board Member',
  level: 5,
  requirements: {
    defeatedRivals: 1,
    complianceAudits: 5
  },
  unlocks: {
    mechanics: ['board_compliance', 'company_policies', 'endgame_paths'],
    apartmentRooms: ['executive_suite'],
    eventTypes: ['apocalyptic_bureaucracy'],
    resources: ['executive_power']
  }
};

export const CORPORATE_TIERS = [
  ASSOCIATE_TIER,
  MANAGER_TIER,
  DIRECTOR_TIER,
  VP_TIER,
  BOARD_MEMBER_TIER
];

// Compliance System Templates
export const COMPLIANCE_TEMPLATES: ComplianceTask[] = [
  {
    id: 'performance_review_mandatory',
    type: 'performance_review',
    title: 'Quarterly Performance Reviews',
    description: 'All daemons must undergo rigorous performance evaluations.',
    deadline: 7,
    requirements: {
      daemonsRequired: 2,
      duration: 3
    },
    penalties: {
      moraleLoss: 15,
      resourceFines: { credits: 200 }
    }
  },
  {
    id: 'budget_cuts_immediate',
    type: 'budget_cut',
    title: 'Emergency Budget Restructuring',
    description: 'Corporate demands immediate cost reduction measures.',
    deadline: 5,
    requirements: {
      resourceCost: { credits: 150 }
    },
    penalties: {
      resourceFines: { credits: 300, bureaucraticLeverage: 2 }
    }
  },
  {
    id: 'mandatory_training_session',
    type: 'mandatory_training',
    title: 'Synergy Enhancement Workshop',
    description: 'All staff must attend mandatory corporate culture training.',
    deadline: 10,
    requirements: {
      daemonsRequired: 3,
      duration: 5
    },
    penalties: {
      moraleLoss: 10,
      daemonReassignment: true
    }
  },
  {
    id: 'compliance_audit',
    type: 'audit',
    title: 'Infernal Revenue Service Audit',
    description: 'Your department is subject to a comprehensive audit.',
    deadline: 14,
    requirements: {
      resourceCost: { bureaucraticLeverage: 5 }
    },
    penalties: {
      resourceFines: { credits: 500, rawMaterials: 2 }
    }
  }
];

// Surreal Corporate Events by Tier
export const SURREAL_EVENTS = {
  ASSOCIATE: [
    {
      id: 'copier_jam',
      title: 'The Great Copier Jam of Sector 7',
      description: 'A critical copier malfunction threatens quarterly reports.',
      type: 'choice' as const,
      tierLevel: 1,
      choices: [
        {
          label: 'Send your best technician',
          description: 'Sacrifice daemon efficiency',
          effects: [{ type: 'daemon_skill_loss', value: -10, description: 'Daemon loses skills' }]
        },
        {
          label: 'Ignore it and hope it resolves itself',
          description: 'Take the bureaucratic hit',
          effects: [{ type: 'bureaucratic_penalty', value: -50, description: 'Lose bureaucratic leverage' }]
        }
      ]
    },
    {
      id: 'stapler_shortage',
      title: 'Critical Stapler Shortage',
      description: 'The office supply closet has been mysteriously emptied.',
      type: 'automatic' as const,
      tierLevel: 1,
      effects: [
        { type: 'equipment_durability', value: -5, description: 'Equipment degrades faster' },
        { type: 'morale', value: -8, description: 'Frustration spreads' }
      ]
    }
  ],
  MANAGER: [
    {
      id: 'team_building_disaster',
      title: 'Trust Fall Catastrophe',
      description: 'Mandatory team building exercise results in actual casualties.',
      type: 'choice' as const,
      tierLevel: 2,
      choices: [
        {
          label: 'Cover up the incident',
          description: 'Protect company reputation',
          effects: [
            { type: 'credits', value: -100, description: 'Hush money' },
            { type: 'morale', value: -12, description: 'Team loses trust' }
          ]
        },
        {
          label: 'Report it to corporate',
          description: 'Follow proper channels',
          effects: [
            { type: 'bureaucratic_leverage', value: 2, description: 'Gain political points' },
            { type: 'daemon_retirement', value: 1, description: 'One daemon reassigned' }
          ]
        }
      ]
    }
  ],
  DIRECTOR: [
    {
      id: 'planetary_merger',
      title: 'Interdimensional Restructuring',
      description: 'Corporate has decided to merge three planets into one department.',
      type: 'automatic' as const,
      tierLevel: 3,
      effects: [
        { type: 'chaos_bonus', value: 100, description: 'Massive organizational chaos' },
        { type: 'credits', value: 300, description: 'Efficiency savings' }
      ]
    }
  ],
  VP: [
    {
      id: 'rival_acquisition',
      title: 'Hostile Takeover Defense',
      description: 'A rival corporation attempts to acquire your soul essence reserves.',
      type: 'choice' as const,
      tierLevel: 4,
      choices: [
        {
          label: 'Deploy corporate lawyers',
          description: 'Fight fire with bureaucracy',
          effects: [
            { type: 'bureaucratic_leverage', value: -5, description: 'Spend political capital' },
            { type: 'soul_essence', value: 3, description: 'Protect reserves' }
          ]
        },
        {
          label: 'Negotiate a merger',
          description: 'Join forces strategically',
          effects: [
            { type: 'corporate_rival_defeated', value: 1, description: 'Gain rival company' },
            { type: 'daemon_transfer', value: 2, description: 'Gain new daemons' }
          ]
        }
      ]
    }
  ],
  BOARD_MEMBER: [
    {
      id: 'reality_restructure',
      title: 'Reality Reorganization Initiative',
      description: 'The Board has voted to restructure the fundamental nature of existence.',
      type: 'automatic' as const,
      tierLevel: 5,
      effects: [
        { type: 'universe_reboot', value: 1, description: 'Everything changes' },
        { type: 'prestige_point', value: 1, description: 'Gain prestige for next run' }
      ]
    }
  ]
};

// Corporate Rivals
export const RIVAL_CORPORATIONS: CorporateRival[] = [
  {
    id: 'synergy_syndicate',
    name: 'The Synergy Syndicate',
    strength: 75,
    specialty: 'Bureaucratic Manipulation',
    threat: 'medium',
    defeated: false
  },
  {
    id: 'efficiency_empire',
    name: 'Efficiency Empire LLC',
    strength: 90,
    specialty: 'Resource Optimization',
    threat: 'high',
    defeated: false
  },
  {
    id: 'chaos_consulting',
    name: 'Chaos Consulting Group',
    strength: 60,
    specialty: 'Disruptive Innovation',
    threat: 'low',
    defeated: false
  }
];

// Prestige Bonuses
export const PRESTIGE_BONUSES: PrestigeBonus[] = [
  {
    id: 'veteran_manager',
    name: 'Veteran Manager',
    description: 'Your experience shows in improved daemon management',
    effects: [
      { type: 'daemon_lifespan_bonus', value: 5, description: '+5 days daemon lifespan' },
      { type: 'morale_bonus', value: 10, description: '+10 starting morale' }
    ],
    unlockedBy: 'Complete game as Manager tier'
  },
  {
    id: 'compliance_master',
    name: 'Compliance Master',
    description: 'You know how to navigate corporate bureaucracy',
    effects: [
      { type: 'bureaucratic_leverage_bonus', value: 2, description: '+2 daily bureaucratic leverage' },
      { type: 'audit_resistance', value: 0.5, description: '50% chance to avoid audits' }
    ],
    unlockedBy: 'Complete all compliance tasks in one run'
  },
  {
    id: 'legacy_builder',
    name: 'Legacy Builder',
    description: 'Your daemon bloodlines carry enhanced traits',
    effects: [
      { type: 'inherited_trait_bonus', value: 1, description: '+1 inherited trait per generation' },
      { type: 'equipment_legacy_bonus', value: 10, description: '+10% equipment legacy bonus' }
    ],
    unlockedBy: 'Reach 5th generation daemon'
  }
];

// Ending Scenarios
export const ENDING_SCENARIOS = {
  profit: {
    id: 'profit_maximizer',
    title: 'The Profit Maximizer',
    description: 'You have optimized every aspect of your operation for maximum revenue.',
    unlocks: ['efficiency_bonuses', 'resource_multipliers']
  },
  cult: {
    id: 'cult_of_personality',
    title: 'Cult of Personality',
    description: 'Your daemons worship you as their infernal deity.',
    unlocks: ['loyalty_bonuses', 'charisma_effects']
  },
  compliance: {
    id: 'compliance_survivor',
    title: 'The Compliance Survivor',
    description: 'You have mastered the art of corporate bureaucracy.',
    unlocks: ['bureaucracy_mastery', 'audit_immunity']
  },
  collapse: {
    id: 'burnout_collapse',
    title: 'Glorious Burnout',
    description: 'Your operation collapsed in spectacular fashion.',
    unlocks: ['chaos_bonuses', 'failure_benefits']
  }
};
