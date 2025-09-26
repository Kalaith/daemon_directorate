import type {
  StarterData,
  CorporateTier,
  ComplianceTask,
  PrestigeBonus,
  CorporateRival,
} from '../types/game';

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
      stability: 75,
      corporatePresence: 0,
      availableMissions: ['conquest', 'reconnaissance', 'sabotage'],
      missionHistory: [],
      specialFeatures: ['Paper Trail Security', 'Copy Machine Infrastructure'],
    },
    {
      name: 'Synergy-Prime',
      difficulty: 'Medium',
      type: 'Corporate Headquarters',
      resistance: 'Executive Board',
      reward: '300 Credits, 5 Bureaucratic Leverage',
      stability: 60,
      corporatePresence: 0,
      availableMissions: ['diplomacy', 'conquest', 'extraction'],
      missionHistory: [],
      specialFeatures: ['Board Room Politics', 'Executive Security'],
    },
    {
      name: 'Productivity-Nine',
      difficulty: 'Hard',
      type: 'Factory World',
      resistance: 'Union Demons',
      reward: '500 Credits, 3 Raw Materials',
      stability: 40,
      corporatePresence: 0,
      availableMissions: ['conquest', 'sabotage', 'diplomacy'],
      missionHistory: [],
      specialFeatures: ['Industrial Espionage Network', 'Worker Solidarity'],
    },
  ],
  apartment_rooms: [
    {
      name: 'Living Quarters',
      level: 1,
      bonus: 'Morale Recovery +5/day',
      upgrade_cost: 200,
      assignedDaemons: [],
      maxAssignments: 6,
      roomType: 'utility',
      unlocked: true,
      synergyBonuses: [
        {
          requiredRooms: ['Recovery Ward'],
          minLevel: 2,
          bonus: 'Health & Morale Synergy',
          effect: {
            type: 'morale_health_bonus',
            value: 10,
            appliesToDaemons: true,
          },
        },
      ],
    },
    {
      name: 'Command Center',
      level: 1,
      bonus: 'Mission Success +5%',
      upgrade_cost: 300,
      assignedDaemons: [],
      maxAssignments: 3,
      roomType: 'command',
      unlocked: true,
      synergyBonuses: [
        {
          requiredRooms: ['War Room'],
          minLevel: 3,
          bonus: 'Strategic Command Synergy',
          effect: {
            type: 'mission_success_bonus',
            value: 15,
            appliesToMissions: true,
          },
        },
      ],
    },
    {
      name: 'Training Hall',
      level: 0,
      bonus: 'Skill Development +10%',
      upgrade_cost: 400,
      assignedDaemons: [],
      maxAssignments: 4,
      specialization: 'Combat',
      roomType: 'training',
      unlocked: true,
      synergyBonuses: [
        {
          requiredRooms: ['Command Center'],
          minLevel: 2,
          bonus: 'Training & Command Synergy',
          effect: {
            type: 'combat_training_bonus',
            value: 20,
            appliesToDaemons: true,
          },
        },
      ],
    },
    {
      name: 'Recovery Ward',
      level: 0,
      bonus: 'Health Recovery +15/day',
      upgrade_cost: 350,
      assignedDaemons: [],
      maxAssignments: 4,
      roomType: 'recovery',
      unlocked: true,
      synergyBonuses: [
        {
          requiredRooms: ['Living Quarters'],
          minLevel: 2,
          bonus: 'Comprehensive Care',
          effect: {
            type: 'health_recovery_bonus',
            value: 10,
            appliesToDaemons: true,
          },
        },
      ],
    },
    {
      name: 'War Room',
      level: 0,
      bonus: 'Strategic Planning +10%',
      upgrade_cost: 500,
      assignedDaemons: [],
      maxAssignments: 3,
      specialization: 'Infiltration',
      roomType: 'command',
      unlocked: false, // Unlocked at Manager tier
      synergyBonuses: [
        {
          requiredRooms: ['Command Center', 'Training Hall'],
          minLevel: 4,
          bonus: 'Military Command Complex',
          effect: {
            type: 'elite_operations_bonus',
            value: 25,
            appliesToMissions: true,
          },
        },
      ],
    },
    {
      name: 'Item Forge',
      level: 0,
      bonus: 'Equipment Repair -20% cost',
      upgrade_cost: 450,
      assignedDaemons: [],
      maxAssignments: 2,
      specialization: 'Sabotage',
      roomType: 'utility',
      unlocked: true,
    },
  ],
};

// Daemon bloodlines for legacy system
export const DAEMON_BLOODLINES = [
  'House of Burning Spreadsheets',
  'House of Eternal Audits',
  'House of Divine Bureaucracy',
  'House of Sacred Forms',
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

// Recruitment bloodlines subset (used in daemon generation)
export const RECRUITMENT_BLOODLINES = [
  'House of Burning Spreadsheets',
  'House of Eternal Audits',
  'House of Divine Bureaucracy',
  'House of Sacred Forms',
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

  // Hostile Takeover and Defense Events
  {
    id: 'hostile_takeover_threat',
    title: 'Hostile Takeover Threat',
    description:
      'A rival corporation has begun accumulating shares and positioning for a hostile takeover of your operations.',
    type: 'choice' as const,
    requirements: { bureaucraticLeverage: 8 },
    choices: [
      {
        label: 'Defensive Restructuring',
        description: 'Restructure operations to make takeover more difficult',
        effects: [
          {
            type: 'credits',
            value: -500,
            description: 'Legal and restructuring costs',
          },
          {
            type: 'bureaucratic_leverage',
            value: 3,
            description: 'Strengthen corporate defenses',
          },
          {
            type: 'takeover_defense',
            value: 25,
            description: 'Increased takeover resistance',
          },
        ],
      },
      {
        label: 'Counter-Acquisition',
        description:
          'Launch your own acquisition of the threatening corporation',
        effects: [
          { type: 'credits', value: -800, description: 'Acquisition costs' },
          {
            type: 'soul_essence',
            value: 2,
            description: 'Absorb rival resources',
          },
          {
            type: 'rival_defeat',
            value: 1,
            description: 'Neutralize takeover threat',
          },
        ],
      },
      {
        label: 'Poison Pill Strategy',
        description:
          'Make the company less attractive through strategic debt and obligations',
        effects: [
          {
            type: 'credits',
            value: -300,
            description: 'Strategic debt obligations',
          },
          {
            type: 'daemon_retention',
            value: 1,
            description: 'Lock in key personnel',
          },
          {
            type: 'takeover_immunity',
            value: 7,
            description: 'Temporary takeover immunity',
          },
        ],
      },
    ],
  },
  {
    id: 'board_coup_attempt',
    title: 'Board Coup Attempt',
    description:
      'Disgruntled board members are attempting to remove you from your position through corporate maneuvering.',
    type: 'choice' as const,
    requirements: { corporateTier: 'director' },
    choices: [
      {
        label: 'Political Maneuvering',
        description: 'Use your bureaucratic connections to counter the coup',
        effects: [
          {
            type: 'bureaucratic_leverage',
            value: -5,
            description: 'Expend political capital',
          },
          {
            type: 'board_loyalty',
            value: 20,
            description: 'Secure board loyalty',
          },
          {
            type: 'corporate_control',
            value: 15,
            description: 'Strengthen position',
          },
        ],
      },
      {
        label: 'Expose Corruption',
        description: 'Investigate and expose corruption among the coup leaders',
        effects: [
          {
            type: 'soul_essence',
            value: -1,
            description: 'Investigative costs',
          },
          { type: 'reputation', value: 25, description: 'Public vindication' },
          {
            type: 'coup_members_removed',
            value: 3,
            description: 'Remove threatening board members',
          },
        ],
      },
      {
        label: 'Strategic Resignation',
        description:
          'Resign strategically to maintain influence while avoiding coup',
        effects: [
          {
            type: 'corporate_tier_reduction',
            value: -1,
            description: 'Temporary demotion',
          },
          {
            type: 'underground_network',
            value: 1,
            description: 'Maintain shadow influence',
          },
          {
            type: 'comeback_opportunity',
            value: 30,
            description: 'Days to orchestrate return',
          },
        ],
      },
    ],
  },
  {
    id: 'corporate_espionage_discovery',
    title: 'Corporate Espionage Discovered',
    description:
      'Your security team has discovered a sophisticated espionage operation targeting your most sensitive operations.',
    type: 'choice' as const,
    requirements: { raw_materials: 2 },
    choices: [
      {
        label: 'Counter-Intelligence Operation',
        description:
          'Launch a counter-intelligence operation to track the spies',
        effects: [
          {
            type: 'raw_materials',
            value: -2,
            description: 'Counter-intel equipment costs',
          },
          {
            type: 'intelligence_gained',
            value: 40,
            description: 'Learn rival corporation secrets',
          },
          {
            type: 'double_agent',
            value: 1,
            description: 'Turn enemy spy into double agent',
          },
        ],
      },
      {
        label: 'Security Lockdown',
        description: 'Implement comprehensive security measures',
        effects: [
          {
            type: 'credits',
            value: -400,
            description: 'Security upgrade costs',
          },
          {
            type: 'espionage_immunity',
            value: 14,
            description: 'Days of enhanced security',
          },
          {
            type: 'daemon_paranoia',
            value: -10,
            description: 'Reduced morale from security measures',
          },
        ],
      },
      {
        label: 'Misinformation Campaign',
        description: 'Feed false information to the spies to mislead rivals',
        effects: [
          {
            type: 'bureaucratic_leverage',
            value: 2,
            description: 'Strategic advantage gained',
          },
          {
            type: 'rival_confusion',
            value: 21,
            description: 'Rivals act on false intelligence',
          },
          {
            type: 'reputation',
            value: 5,
            description: 'Reputation for cunning',
          },
        ],
      },
    ],
  },
  {
    id: 'insider_trading_allegation',
    title: 'Insider Trading Allegations',
    description:
      'Regulatory authorities are investigating allegations of insider trading within your corporation.',
    type: 'choice' as const,
    requirements: { credits: 300 },
    choices: [
      {
        label: 'Legal Defense',
        description:
          'Hire the best corporate lawyers to defend against charges',
        effects: [
          { type: 'credits', value: -600, description: 'Legal fees' },
          {
            type: 'regulatory_protection',
            value: 1,
            description: 'Reduced regulatory scrutiny',
          },
          {
            type: 'legal_precedent',
            value: 10,
            description: 'Establish favorable precedent',
          },
        ],
      },
      {
        label: 'Scapegoat Strategy',
        description: 'Blame a mid-level manager to protect upper management',
        effects: [
          {
            type: 'daemon_sacrifice',
            value: 1,
            description: 'Sacrifice daemon to authorities',
          },
          {
            type: 'corporate_reputation',
            value: -15,
            description: 'Internal morale damage',
          },
          {
            type: 'investigation_ended',
            value: 1,
            description: 'Investigation concluded',
          },
        ],
      },
      {
        label: 'Regulatory Cooperation',
        description: 'Cooperate fully with investigators to minimize penalties',
        effects: [
          {
            type: 'credits',
            value: -200,
            description: 'Cooperation costs and fines',
          },
          {
            type: 'reputation',
            value: 10,
            description: 'Reputation for transparency',
          },
          {
            type: 'regulatory_favor',
            value: 20,
            description: 'Improved regulatory relationship',
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
    resources: ['credits'],
  },
};

export const MANAGER_TIER: CorporateTier = {
  id: 'manager',
  name: 'Manager',
  level: 2,
  requirements: {
    planetsControlled: 1,
    daysLived: 20,
  },
  unlocks: {
    mechanics: ['hr_reviews', 'team_disputes'],
    apartmentRooms: ['training_hall'],
    eventTypes: ['management_events'],
  },
};

export const DIRECTOR_TIER: CorporateTier = {
  id: 'director',
  name: 'Director',
  level: 3,
  requirements: {
    planetsControlled: 2,
    completedHRReviews: 3,
  },
  unlocks: {
    mechanics: ['planetary_reports', 'large_teams', 'surreal_events'],
    apartmentRooms: ['expanded_command_center'],
    eventTypes: ['absurd_bureaucracy'],
  },
};

export const VP_TIER: CorporateTier = {
  id: 'vice_president',
  name: 'Vice President',
  level: 4,
  requirements: {
    planetsControlled: 3,
    legacyGenerations: 2,
  },
  unlocks: {
    resources: ['soul_essence', 'bureaucratic_leverage'],
    mechanics: ['corporate_rivalries', 'hall_of_infamy'],
    apartmentRooms: ['war_room'],
    eventTypes: ['rival_corporations'],
  },
};

export const BOARD_MEMBER_TIER: CorporateTier = {
  id: 'board_member',
  name: 'Board Member',
  level: 5,
  requirements: {
    defeatedRivals: 1,
    complianceAudits: 5,
  },
  unlocks: {
    mechanics: ['board_compliance', 'company_policies', 'endgame_paths'],
    apartmentRooms: ['executive_suite'],
    eventTypes: ['apocalyptic_bureaucracy'],
    resources: ['executive_power'],
  },
};

export const CORPORATE_TIERS = [
  ASSOCIATE_TIER,
  MANAGER_TIER,
  DIRECTOR_TIER,
  VP_TIER,
  BOARD_MEMBER_TIER,
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
      duration: 3,
    },
    penalties: {
      moraleLoss: 15,
      resourceFines: { credits: 200 },
    },
  },
  {
    id: 'budget_cuts_immediate',
    type: 'budget_cut',
    title: 'Emergency Budget Restructuring',
    description: 'Corporate demands immediate cost reduction measures.',
    deadline: 5,
    requirements: {
      resourceCost: { credits: 150 },
    },
    penalties: {
      resourceFines: { credits: 300, bureaucraticLeverage: 2 },
    },
  },
  {
    id: 'mandatory_training_session',
    type: 'mandatory_training',
    title: 'Synergy Enhancement Workshop',
    description: 'All staff must attend mandatory corporate culture training.',
    deadline: 10,
    requirements: {
      daemonsRequired: 3,
      duration: 5,
    },
    penalties: {
      moraleLoss: 10,
      daemonReassignment: true,
    },
  },
  {
    id: 'compliance_audit',
    type: 'audit',
    title: 'Infernal Revenue Service Audit',
    description: 'Your department is subject to a comprehensive audit.',
    deadline: 14,
    requirements: {
      resourceCost: { bureaucraticLeverage: 5 },
    },
    penalties: {
      resourceFines: { credits: 500, rawMaterials: 2 },
    },
  },
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
          effects: [
            {
              type: 'daemon_skill_loss',
              value: -10,
              description: 'Daemon loses skills',
            },
          ],
        },
        {
          label: 'Ignore it and hope it resolves itself',
          description: 'Take the bureaucratic hit',
          effects: [
            {
              type: 'bureaucratic_penalty',
              value: -50,
              description: 'Lose bureaucratic leverage',
            },
          ],
        },
      ],
    },
    {
      id: 'stapler_shortage',
      title: 'Critical Stapler Shortage',
      description: 'The office supply closet has been mysteriously emptied.',
      type: 'automatic' as const,
      tierLevel: 1,
      effects: [
        {
          type: 'equipment_durability',
          value: -5,
          description: 'Equipment degrades faster',
        },
        { type: 'morale', value: -8, description: 'Frustration spreads' },
      ],
    },
  ],
  MANAGER: [
    {
      id: 'team_building_disaster',
      title: 'Trust Fall Catastrophe',
      description:
        'Mandatory team building exercise results in actual casualties.',
      type: 'choice' as const,
      tierLevel: 2,
      choices: [
        {
          label: 'Cover up the incident',
          description: 'Protect company reputation',
          effects: [
            { type: 'credits', value: -100, description: 'Hush money' },
            { type: 'morale', value: -12, description: 'Team loses trust' },
          ],
        },
        {
          label: 'Report it to corporate',
          description: 'Follow proper channels',
          effects: [
            {
              type: 'bureaucratic_leverage',
              value: 2,
              description: 'Gain political points',
            },
            {
              type: 'daemon_retirement',
              value: 1,
              description: 'One daemon reassigned',
            },
          ],
        },
      ],
    },
  ],
  DIRECTOR: [
    {
      id: 'planetary_merger',
      title: 'Interdimensional Restructuring',
      description:
        'Corporate has decided to merge three planets into one department.',
      type: 'automatic' as const,
      tierLevel: 3,
      effects: [
        {
          type: 'chaos_bonus',
          value: 100,
          description: 'Massive organizational chaos',
        },
        { type: 'credits', value: 300, description: 'Efficiency savings' },
      ],
    },
  ],
  VP: [
    {
      id: 'rival_acquisition',
      title: 'Hostile Takeover Defense',
      description:
        'A rival corporation attempts to acquire your soul essence reserves.',
      type: 'choice' as const,
      tierLevel: 4,
      choices: [
        {
          label: 'Deploy corporate lawyers',
          description: 'Fight fire with bureaucracy',
          effects: [
            {
              type: 'bureaucratic_leverage',
              value: -5,
              description: 'Spend political capital',
            },
            { type: 'soul_essence', value: 3, description: 'Protect reserves' },
          ],
        },
        {
          label: 'Negotiate a merger',
          description: 'Join forces strategically',
          effects: [
            {
              type: 'corporate_rival_defeated',
              value: 1,
              description: 'Gain rival company',
            },
            {
              type: 'daemon_transfer',
              value: 2,
              description: 'Gain new daemons',
            },
          ],
        },
      ],
    },
  ],
  BOARD_MEMBER: [
    {
      id: 'reality_restructure',
      title: 'Reality Reorganization Initiative',
      description:
        'The Board has voted to restructure the fundamental nature of existence.',
      type: 'automatic' as const,
      tierLevel: 5,
      effects: [
        {
          type: 'universe_reboot',
          value: 1,
          description: 'Everything changes',
        },
        {
          type: 'prestige_point',
          value: 1,
          description: 'Gain prestige for next run',
        },
      ],
    },
  ],
};

// Corporate Rivals
export const RIVAL_CORPORATIONS: CorporateRival[] = [
  {
    id: 'synergy_syndicate',
    name: 'The Synergy Syndicate',
    strength: 75,
    specialty: 'Bureaucratic Manipulation',
    threat: 'medium',
    defeated: false,
    aiPersonality: {
      aggression: 40,
      cunning: 85,
      ambition: 70,
      loyalty: 30,
      adaptability: 75,
    },
    currentStrategy: {
      type: 'diplomatic_manipulation',
      priority: 7,
      duration: 15,
      targetPlayer: true,
    },
    resources: {
      credits: 2500,
      influence: 60,
      intelligence: 40,
    },
    ownedPlanets: [],
    activeOperations: [],
    relationshipWithPlayer: -20,
    lastActionDay: 0,
    strategicGoals: [
      'control_bureaucracy',
      'influence_player_decisions',
      'expand_political_network',
    ],
  },
  {
    id: 'efficiency_empire',
    name: 'Efficiency Empire LLC',
    strength: 90,
    specialty: 'Resource Optimization',
    threat: 'high',
    defeated: false,
    aiPersonality: {
      aggression: 80,
      cunning: 50,
      ambition: 95,
      loyalty: 60,
      adaptability: 40,
    },
    currentStrategy: {
      type: 'aggressive_expansion',
      priority: 9,
      duration: 20,
      targetPlanets: ['Productivity-Nine'],
      targetPlayer: false,
    },
    resources: {
      credits: 4000,
      influence: 45,
      intelligence: 25,
    },
    ownedPlanets: [],
    activeOperations: [],
    relationshipWithPlayer: -50,
    lastActionDay: 0,
    strategicGoals: [
      'dominate_resources',
      'eliminate_competition',
      'maximize_efficiency',
    ],
  },
  {
    id: 'chaos_consulting',
    name: 'Chaos Consulting Group',
    strength: 60,
    specialty: 'Disruptive Innovation',
    threat: 'low',
    defeated: false,
    aiPersonality: {
      aggression: 30,
      cunning: 90,
      ambition: 60,
      loyalty: 20,
      adaptability: 95,
    },
    currentStrategy: {
      type: 'shadow_operations',
      priority: 8,
      duration: 25,
      targetPlayer: true,
    },
    resources: {
      credits: 1800,
      influence: 70,
      intelligence: 80,
    },
    ownedPlanets: [],
    activeOperations: [],
    relationshipWithPlayer: 10,
    lastActionDay: 0,
    strategicGoals: [
      'disrupt_status_quo',
      'gather_intelligence',
      'create_opportunities',
    ],
  },
];

// Prestige Bonuses
export const PRESTIGE_BONUSES: PrestigeBonus[] = [
  {
    id: 'veteran_manager',
    name: 'Veteran Manager',
    description: 'Your experience shows in improved daemon management',
    effects: [
      {
        type: 'daemon_lifespan_bonus',
        value: 5,
        description: '+5 days daemon lifespan',
      },
      { type: 'morale_bonus', value: 10, description: '+10 starting morale' },
    ],
    unlockedBy: 'Complete game as Manager tier',
  },
  {
    id: 'compliance_master',
    name: 'Compliance Master',
    description: 'You know how to navigate corporate bureaucracy',
    effects: [
      {
        type: 'bureaucratic_leverage_bonus',
        value: 2,
        description: '+2 daily bureaucratic leverage',
      },
      {
        type: 'audit_resistance',
        value: 0.5,
        description: '50% chance to avoid audits',
      },
    ],
    unlockedBy: 'Complete all compliance tasks in one run',
  },
  {
    id: 'legacy_builder',
    name: 'Legacy Builder',
    description: 'Your daemon bloodlines carry enhanced traits',
    effects: [
      {
        type: 'inherited_trait_bonus',
        value: 1,
        description: '+1 inherited trait per generation',
      },
      {
        type: 'equipment_legacy_bonus',
        value: 10,
        description: '+10% equipment legacy bonus',
      },
    ],
    unlockedBy: 'Reach 5th generation daemon',
  },
];

// Enhanced Mission System
export const MISSION_TEMPLATES = {
  conquest: {
    id: 'conquest',
    name: 'Corporate Conquest',
    description: 'Establish complete corporate dominance over the target',
    baseDuration: 60, // minutes
    primaryObjective: {
      type: 'primary' as const,
      description: 'Neutralize all resistance forces',
      requirements: { minTeamSize: 2 },
      rewards: { credits: 200, bureaucraticLeverage: 2 },
    },
    secondaryObjectives: [
      {
        type: 'secondary' as const,
        description: 'Capture key strategic locations',
        requirements: { specialization: 'Combat' as const },
        rewards: { credits: 100, rawMaterials: 1 },
      },
      {
        type: 'secondary' as const,
        description: 'Establish supply chains',
        requirements: { minTeamSize: 3 },
        rewards: { credits: 150, soulEssence: 1 },
      },
    ],
    failureConsequences: [
      'reduced_stability',
      'corporate_retaliation',
      'reputation_loss',
    ],
  },
  sabotage: {
    id: 'sabotage',
    name: 'Corporate Sabotage',
    description: 'Undermine competitor operations through covert means',
    baseDuration: 45,
    primaryObjective: {
      type: 'primary' as const,
      description: 'Disrupt critical infrastructure',
      requirements: { specialization: 'Sabotage' as const },
      rewards: { credits: 150, bureaucraticLeverage: 3 },
    },
    secondaryObjectives: [
      {
        type: 'secondary' as const,
        description: 'Plant false evidence',
        requirements: { equipment: ['Cursed Calculator'] },
        rewards: { soulEssence: 2, reputation: 10 },
      },
      {
        type: 'bonus' as const,
        description: 'Remain undetected',
        requirements: { specialization: 'Infiltration' as const },
        rewards: { credits: 200, experience: 50 },
      },
    ],
    failureConsequences: [
      'exposure_risk',
      'security_increase',
      'rival_attention',
    ],
  },
  diplomacy: {
    id: 'diplomacy',
    name: 'Corporate Diplomacy',
    description: 'Negotiate favorable terms through political maneuvering',
    baseDuration: 90,
    primaryObjective: {
      type: 'primary' as const,
      description: 'Secure advantageous agreements',
      requirements: { resources: { bureaucraticLeverage: 3 } },
      rewards: { credits: 300, bureaucraticLeverage: 5 },
    },
    secondaryObjectives: [
      {
        type: 'secondary' as const,
        description: 'Form strategic alliances',
        requirements: { minTeamSize: 2 },
        rewards: { reputation: 25, futureOpportunities: ['joint_ventures'] },
      },
    ],
    failureConsequences: [
      'diplomatic_incident',
      'alliance_breakdown',
      'credibility_loss',
    ],
  },
  reconnaissance: {
    id: 'reconnaissance',
    name: 'Corporate Reconnaissance',
    description: 'Gather intelligence on target operations',
    baseDuration: 30,
    primaryObjective: {
      type: 'primary' as const,
      description: 'Collect strategic intelligence',
      requirements: { specialization: 'Infiltration' as const },
      rewards: { bureaucraticLeverage: 4, experience: 30 },
    },
    secondaryObjectives: [
      {
        type: 'bonus' as const,
        description: 'Identify key personnel',
        requirements: { equipment: ['Standard Issue Briefcase'] },
        rewards: { futureOpportunities: ['targeted_operations'] },
      },
    ],
    failureConsequences: ['intelligence_leak', 'cover_blown'],
  },
  extraction: {
    id: 'extraction',
    name: 'Asset Extraction',
    description: 'Retrieve valuable corporate assets or personnel',
    baseDuration: 75,
    primaryObjective: {
      type: 'primary' as const,
      description: 'Secure and extract target assets',
      requirements: { minTeamSize: 3, specialization: 'Combat' as const },
      rewards: { credits: 400, rawMaterials: 2 },
    },
    secondaryObjectives: [
      {
        type: 'secondary' as const,
        description: 'Minimize collateral damage',
        requirements: { equipment: ['Corporate Tie of Binding'] },
        rewards: { reputation: 15, bureaucraticLeverage: 1 },
      },
    ],
    failureConsequences: [
      'asset_lost',
      'security_escalation',
      'extraction_blacklist',
    ],
  },
};

// Mission Consequence Effects
export const MISSION_CONSEQUENCES = {
  // Immediate consequences
  reduced_stability: {
    id: 'reduced_stability',
    type: 'immediate' as const,
    description: 'Planet stability decreased by 20 points',
    effects: { planets: ['target'], stability: -20 },
  },
  corporate_retaliation: {
    id: 'corporate_retaliation',
    type: 'delayed' as const,
    description: 'Enemy corporation plans counter-attack',
    effects: { corporateEvents: ['retaliation_strike'], reputation: -10 },
  },
  reputation_loss: {
    id: 'reputation_loss',
    type: 'immediate' as const,
    description: 'Corporate reputation damaged',
    effects: { reputation: -15, futureOpportunities: ['limited_access'] },
  },
  exposure_risk: {
    id: 'exposure_risk',
    type: 'delayed' as const,
    description: 'Increased security scrutiny on future operations',
    effects: { corporateEvents: ['security_audit'], reputation: -5 },
  },
  security_increase: {
    id: 'security_increase',
    type: 'permanent' as const,
    description: 'Target planet permanently increases security measures',
    effects: { planets: ['target'], difficulty: 'increase' },
  },
  rival_attention: {
    id: 'rival_attention',
    type: 'delayed' as const,
    description: 'Rival corporations take notice of your activities',
    effects: { rivalActions: ['investigation', 'interference'] },
  },
  diplomatic_incident: {
    id: 'diplomatic_incident',
    type: 'immediate' as const,
    description: 'Failed negotiations create lasting tensions',
    effects: { reputation: -20, corporateEvents: ['diplomatic_crisis'] },
  },
  alliance_breakdown: {
    id: 'alliance_breakdown',
    type: 'permanent' as const,
    description: 'Potential alliances are permanently damaged',
    effects: { futureOpportunities: ['alliance_blacklist'] },
  },
  credibility_loss: {
    id: 'credibility_loss',
    type: 'immediate' as const,
    description: 'Corporate credibility questioned',
    effects: { reputation: -10, bureaucraticLeverage: -2 },
  },
  intelligence_leak: {
    id: 'intelligence_leak',
    type: 'delayed' as const,
    description: 'Your intelligence methods are compromised',
    effects: {
      corporateEvents: ['counter_intelligence'],
      futureOpportunities: ['restricted_intel'],
    },
  },
  cover_blown: {
    id: 'cover_blown',
    type: 'immediate' as const,
    description: 'Infiltration networks are exposed',
    effects: { reputation: -5, corporateEvents: ['security_sweep'] },
  },
  asset_lost: {
    id: 'asset_lost',
    type: 'immediate' as const,
    description: 'Target assets are lost or destroyed',
    effects: { rawMaterials: -1, credits: -200 },
  },
  security_escalation: {
    id: 'security_escalation',
    type: 'permanent' as const,
    description: 'All future missions face increased security',
    effects: { planets: ['all'], difficulty: 'slight_increase' },
  },
  extraction_blacklist: {
    id: 'extraction_blacklist',
    type: 'permanent' as const,
    description: 'Extraction operations become extremely difficult',
    effects: { futureOpportunities: ['extraction_banned'] },
  },
};

// Procedural Mission Generation Based on Territory Control
export const PROCEDURAL_MISSIONS = {
  // Missions that become available after conquering planets
  territory_defense: {
    id: 'territory_defense',
    name: 'Territory Defense',
    description: 'Defend conquered territory from corporate rivals',
    triggerCondition: 'conquered_planets >= 1',
    frequency: 0.15, // 15% chance per day per conquered planet
    difficulty: 'Medium',
    rewards: { credits: 250, bureaucraticLeverage: 2 },
  },
  expansion_opportunity: {
    id: 'expansion_opportunity',
    name: 'Expansion Opportunity',
    description: 'New territories become available for conquest',
    triggerCondition: 'corporate_presence >= 50',
    frequency: 0.1, // 10% chance when presence threshold reached
    difficulty: 'Variable',
    rewards: 'unlocks_new_planets',
  },
  corporate_espionage: {
    id: 'corporate_espionage',
    name: 'Corporate Espionage',
    description: 'Rival corporations attempt to steal trade secrets',
    triggerCondition: 'bureaucratic_leverage >= 10',
    frequency: 0.08, // 8% chance per day when threshold reached
    difficulty: 'Hard',
    consequences: ['intelligence_theft', 'competitive_disadvantage'],
  },
  supply_chain_disruption: {
    id: 'supply_chain_disruption',
    name: 'Supply Chain Crisis',
    description: 'Critical supply chains are under threat',
    triggerCondition: 'conquered_planets >= 2',
    frequency: 0.12,
    difficulty: 'Medium',
    consequences: ['resource_shortage', 'operations_slowdown'],
  },
};

// Ending Scenarios
export const ENDING_SCENARIOS = {
  profit: {
    id: 'profit_maximizer',
    title: 'The Profit Maximizer',
    description:
      'You have optimized every aspect of your operation for maximum revenue.',
    unlocks: ['efficiency_bonuses', 'resource_multipliers'],
  },
  cult: {
    id: 'cult_of_personality',
    title: 'Cult of Personality',
    description: 'Your daemons worship you as their infernal deity.',
    unlocks: ['loyalty_bonuses', 'charisma_effects'],
  },
  compliance: {
    id: 'compliance_survivor',
    title: 'The Compliance Survivor',
    description: 'You have mastered the art of corporate bureaucracy.',
    unlocks: ['bureaucracy_mastery', 'audit_immunity'],
  },
  collapse: {
    id: 'burnout_collapse',
    title: 'Glorious Burnout',
    description: 'Your operation collapsed in spectacular fashion.',
    unlocks: ['chaos_bonuses', 'failure_benefits'],
  },
};
