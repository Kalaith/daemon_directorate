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
    name: 'Process documentation enthusiast',
    effect: 'bureaucratic_bonus',
    value: 2,
    description: '+2 Bureaucratic Leverage per day from workflow optimization',
  },
  {
    name: 'Equipment anxiety disorder',
    effect: 'office_penalty',
    value: -5,
    description:
      '-5% operational efficiency in technology-dependent environments',
  },
  {
    name: 'Assertive stakeholder engagement style',
    effect: 'combat_bonus',
    value: 15,
    description:
      '+15% tactical effectiveness during confrontational negotiations',
  },
  {
    name: 'Office supply procurement specialist',
    effect: 'equipment_durability',
    value: 10,
    description: '+10% asset longevity through superior maintenance protocols',
  },
  {
    name: 'Spreadsheet manipulation virtuoso',
    effect: 'sabotage_bonus',
    value: 20,
    description: '+20% data corruption and financial obfuscation success rate',
  },
  {
    name: 'Unauthorized resource redistribution',
    effect: 'morale_penalty',
    value: -3,
    description: '-3 workplace satisfaction across all corporate assets',
  },
  {
    name: 'Punctuality excellence award recipient',
    effect: 'mission_speed',
    value: 0.8,
    description: 'Operations complete 20% faster due to temporal optimization',
  },
  {
    name: 'Strategic inventory accumulation',
    effect: 'resource_bonus',
    value: 10,
    description:
      '+10% operational resource acquisition through stockpiling expertise',
  },
  {
    name: 'Alternative wellness methodology practitioner',
    effect: 'stress_reduction',
    value: 5,
    description:
      '+5 daily workplace satisfaction through unconventional therapy techniques',
  },
  {
    name: 'Information architecture perfectionist',
    effect: 'infiltration_bonus',
    value: 15,
    description:
      '+15% covert operations success through superior organizational skills',
  },
  {
    name: 'Beverage quality control deficiency',
    effect: 'team_morale_penalty',
    value: -2,
    description:
      '-2 workplace satisfaction for all corporate assets in facility',
  },
  {
    name: 'Interpersonal engagement optimization specialist',
    effect: 'diplomatic_bonus',
    value: 25,
    description: '+25% success rate on relationship-building operations',
  },
  {
    name: 'Comprehensive risk assessment methodology',
    effect: 'analysis_bonus',
    value: 1,
    description:
      '+1 Bureaucratic Leverage from post-failure process improvement analysis',
  },
  {
    name: 'Workspace optimization syndrome',
    effect: 'efficiency_bonus',
    value: 5,
    description:
      '+5% facility productivity through continuous improvement initiatives',
  },
  {
    name: 'Pressure-activated consumption disorder',
    effect: 'health_drain',
    value: -2,
    description:
      '-2 corporeal integrity per day when workplace satisfaction below 50%',
  },
  {
    name: 'Formal communication protocol adherence',
    effect: 'corporate_bonus',
    value: 3,
    description:
      '+3 Bureaucratic Leverage per successful operation through documentation excellence',
  },
  {
    name: 'Cybersecurity hypervigilance disorder',
    effect: 'tech_penalty',
    value: -10,
    description:
      '-10% operational efficiency with digital infrastructure due to trust issues',
  },
  {
    name: 'Typography quality assurance specialist',
    effect: 'perfectionist',
    value: 10,
    description:
      '+10% operational success rate but +1 day duration due to aesthetic standards',
  },
  {
    name: 'Environmental comfort requirement syndrome',
    effect: 'comfort_dependent',
    value: -1,
    description:
      '-1 contract duration day unless facility has climate optimization systems',
  },
  {
    name: 'Comprehensive oversight methodology',
    effect: 'control_bonus',
    value: 12,
    description:
      '+12% team operational success when designated as project lead through detailed supervision',
  },
  {
    name: 'Strategic terminology optimization advocate',
    effect: 'synergy_bonus',
    value: 8,
    description:
      '+8% operational success when collaborating with 2+ corporate assets through linguistic alignment',
  },
  {
    name: 'Traditional methodology preference',
    effect: 'analog_specialist',
    value: 20,
    description:
      '+20% effectiveness using manual processes, -50% with digital equipment',
  },
  {
    name: 'Collaborative session dependency syndrome',
    effect: 'bureaucracy_master',
    value: 5,
    description:
      '+5 Bureaucratic Leverage per week, -1 workplace satisfaction daily due to meeting overload',
  },
  {
    name: 'Indirect communication methodology specialist',
    effect: 'psychological_warfare',
    value: 15,
    description:
      '+15% operational success against corporate targets through subtle intimidation techniques',
  },
  {
    name: 'Nutritional coordination disruption specialist',
    effect: 'team_saboteur',
    value: -5,
    description:
      'Generates random asset malfunction events among team members through social undermining',
  },
  {
    name: 'Authentication credential maintenance negligence',
    effect: 'security_risk',
    value: 0.1,
    description:
      '10% probability of triggering cybersecurity compliance review events',
  },
  {
    name: 'Personal time off accumulation specialist',
    effect: 'longevity_bonus',
    value: 5,
    description:
      '+5 initial contract duration days through strategic leave management',
  },
  {
    name: 'Talent acquisition quality assurance paranoia',
    effect: 'veteran_insight',
    value: 0.05,
    description:
      '5% probability of detecting operational security threats through recruitment skepticism',
  },
  {
    name: 'Performance evaluation optimization enthusiasm',
    effect: 'review_enthusiast',
    value: 10,
    description:
      '+10% probability of beneficial corporate development opportunities',
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
      rarity: 'Common',
    },
    {
      name: 'Corporate Tie of Binding',
      type: 'Combat',
      durability: 100,
      ability: 'Intimidate (+10 combat)',
      generation: 0,
      legacyBonus: 0,
      history: ['Corporate standard issue'],
      rarity: 'Common',
    },
    {
      name: 'Cursed Calculator',
      type: 'Sabotage',
      durability: 90,
      ability: 'Data Corruption (+20 sabotage)',
      generation: 0,
      legacyBonus: 0,
      history: ['Corporate standard issue'],
      rarity: 'Cursed',
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
  'Legacy of Leadership (+5 workplace satisfaction for all corporate assets)',
  'Ancient Wisdom (+1 extra day of contract duration)',
  'Master Craftsman (+50% equipment creation speed)',
  'Tactical Genius (+25% combat effectiveness)',
  'Shadow Walker (+30% infiltration success)',
  'Data Oracle (+20% sabotage precision)',
  "Survivor's Instinct (+10% chance to survive failed missions)",
  'Inspiring Presence (+5 workplace satisfaction to all corporate assets when active)',
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
    title: 'Quarterly Soul Performance Evaluation',
    description:
      "HR has mandated comprehensive performance reviews to assess productivity metrics and suffering quotas. Your daemons' eternal employment contracts are under scrutiny.",
    type: 'choice' as const,
    choices: [
      {
        label: 'Embrace the Bureaucratic Excellence',
        description:
          'Demonstrate unwavering commitment to corporate compliance procedures',
        effects: [
          {
            type: 'morale',
            value: -5,
            description:
              'Corporate assets experience workplace satisfaction reduction',
          },
          {
            type: 'bureaucraticLeverage',
            value: 3,
            description: 'Enhance political capital within infernal hierarchy',
          },
        ],
      },
      {
        label: 'Strategic Process Optimization',
        description:
          'Leverage regulatory ambiguities for competitive advantage',
        effects: [
          {
            type: 'morale',
            value: 10,
            description:
              'Corporate assets exhibit enhanced workplace satisfaction metrics',
          },
          {
            type: 'credits',
            value: 150,
            description: 'Productivity optimization dividends',
          },
          {
            type: 'corruption_risk',
            value: 0.1,
            description: '10% probability of compliance verification event',
          },
        ],
      },
    ],
  },
  {
    id: 'budget_restructuring',
    title: 'Fiscal Realignment Initiative',
    description:
      "The Infernal Accounting Division has identified synergy opportunities through strategic budget optimization. Your department's resource allocation requires immediate stakeholder review.",
    type: 'choice' as const,
    choices: [
      {
        label: 'Execute Strategic Budget Proposal',
        description:
          'Present comprehensive ROI justification through established hierarchical channels',
        effects: [
          {
            type: 'bureaucraticLeverage',
            value: -2,
            description: 'Invest bureaucratic influence currency',
          },
          {
            type: 'credits',
            value: 400,
            description: 'Achieve enhanced operational capital allocation',
          },
        ],
      },
      {
        label: 'Demonstrate Fiduciary Stewardship',
        description: 'Exhibit exemplary cost-containment leadership qualities',
        effects: [
          {
            type: 'credits',
            value: -150,
            description: 'Optimized expenditure framework implementation',
          },
          {
            type: 'bureaucraticLeverage',
            value: 1,
            description:
              'Enhanced reputation for fiscal discipline among stakeholders',
          },
        ],
      },
    ],
  },
  {
    id: 'hostile_takeover',
    title: 'Aggressive Acquisition Initiative',
    description:
      'A competitor organization has launched a strategic acquisition campaign targeting your operational assets. Their hostile merger proposal threatens your corporate autonomy and eternal employment security.',
    type: 'choice' as const,
    choices: [
      {
        label: 'Implement Defensive Countermeasures',
        description:
          'Deploy comprehensive anti-takeover strategies utilizing all available corporate resources',
        effects: [
          {
            type: 'soulEssence',
            value: -1,
            description:
              'Leverage metaphysical assets for competitive advantage',
          },
          {
            type: 'morale',
            value: 15,
            description:
              'Corporate assets demonstrate exceptional loyalty metrics',
          },
          {
            type: 'credits',
            value: 200,
            description: 'Successful defense compensation package',
          },
        ],
      },
      {
        label: 'Pursue Strategic Partnership',
        description:
          'Develop win-win stakeholder value proposition through collaborative framework',
        effects: [
          {
            type: 'bureaucraticLeverage',
            value: 2,
            description:
              'Expand strategic network within infernal business ecosystem',
          },
          {
            type: 'daemon_retirement',
            value: 1,
            description: 'Corporate asset reassignment as per merger agreement',
          },
        ],
      },
    ],
  },
  {
    id: 'infernal_audit',
    title: 'Comprehensive Compliance Assessment',
    description:
      'The Infernal Revenue Optimization Department has initiated a full-scope audit of your departmental financial practices and soul-handling procedures. All documentation must meet Sarbanes-Oxley-Belphegor standards.',
    type: 'automatic' as const,
    effects: [
      {
        type: 'credits',
        value: -100,
        description: 'Regulatory compliance costs and administrative penalties',
      },
      {
        type: 'equipment_durability',
        value: -10,
        description: 'Corporate assets temporarily impounded for verification',
      },
      {
        type: 'morale',
        value: -8,
        description: 'Workplace satisfaction impact from regulatory scrutiny',
      },
    ],
  },
  {
    id: 'corporate_merger',
    title: 'Strategic Organizational Integration',
    description:
      'Executive leadership has approved a synergistic merger with the Division of Perpetual Process Optimization. This vertical integration will enhance operational efficiency and stakeholder value.',
    type: 'automatic' as const,
    effects: [
      {
        type: 'recruitment_discount',
        value: 0.5,
        description: 'Temporary talent acquisition cost optimization program',
      },
      {
        type: 'bureaucraticLeverage',
        value: 5,
        description: 'Expanded hierarchical influence network access',
      },
      {
        type: 'office_politics',
        value: 1,
        description: 'Enhanced interpersonal dynamics complexity',
      },
    ],
  },
  {
    id: 'soul_market_crash',
    title: 'Metaphysical Asset Market Correction',
    description:
      'The Infernal Soul Exchange has experienced significant volatility due to market disruption events. Your spiritual investment portfolio requires immediate diversification strategies.',
    type: 'automatic' as const,
    effects: [
      {
        type: 'soulEssence',
        value: -2,
        description: 'Strategic asset revaluation adjustment',
      },
      {
        type: 'equipment_discount',
        value: 0.3,
        description:
          'Opportunistic procurement discount on infrastructure maintenance',
      },
    ],
  },
  {
    id: 'mandatory_training',
    title: 'Mandatory Cultural Enhancement Workshop',
    description:
      "Human Resources has scheduled mandatory attendance for 'Optimizing Interpersonal Dynamics in Multi-Dimensional Corporate Environments' to ensure compliance with modern workplace inclusivity standards.",
    type: 'choice' as const,
    choices: [
      {
        label: 'Demonstrate Proactive Engagement',
        description:
          'Exhibit exemplary corporate culture commitment and professional development enthusiasm',
        effects: [
          {
            type: 'morale',
            value: -5,
            description:
              'Mandatory professional development impact on productivity metrics',
          },
          {
            type: 'bureaucraticLeverage',
            value: 1,
            description: 'Enhanced Human Resources favorability rating',
          },
          {
            type: 'productivity_bonus',
            value: 0.1,
            description:
              'Temporary operational efficiency enhancement from cultural training',
          },
        ],
      },
      {
        label: 'Pursue Alternative Priorities',
        description:
          'Optimize time allocation through strategic absence management',
        effects: [
          {
            type: 'morale',
            value: 8,
            description:
              'Corporate assets value leadership decisiveness over compliance theater',
          },
          {
            type: 'hr_investigation',
            value: 1,
            description:
              'Enhanced Human Resources monitoring protocols activated',
          },
        ],
      },
    ],
  },
  {
    id: 'equipment_recall',
    title: 'Product Quality Assurance Notice',
    description:
      'Quality Control has identified manufacturing inconsistencies in standard-issue corporate assets. Remediation protocols have been activated per ISO-666 standards.',
    type: 'automatic' as const,
    effects: [
      {
        type: 'equipment_upgrade',
        value: 1,
        description: 'Asset optimization through defect remediation program',
      },
      {
        type: 'credits',
        value: 75,
        description: 'Customer satisfaction settlement disbursement',
      },
    ],
  },
  {
    id: 'promotion_opportunity',
    title: 'Executive Advancement Opportunity',
    description:
      'A strategic leadership role has become available within the hierarchical advancement matrix. This vertical mobility opportunity requires substantial political capital investment.',
    type: 'choice' as const,
    requirements: { bureaucraticLeverage: 5 },
    choices: [
      {
        label: 'Pursue Executive Advancement',
        description:
          'Deploy accumulated bureaucratic influence for hierarchical advancement',
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
        label: 'Maintain Current Positioning',
        description:
          'Continue focus on operational excellence within existing scope',
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
    title: 'Annual Corporate Celebration Event',
    description:
      'The Infernal Human Resources Division has organized the mandatory seasonal workplace satisfaction enhancement gathering. Attendance metrics will be tracked for performance evaluation purposes.',
    type: 'choice' as const,
    choices: [
      {
        label: 'Execute Strategic Networking',
        description:
          'Maximize relationship-building opportunities with senior stakeholders',
        effects: [
          {
            type: 'bureaucraticLeverage',
            value: 2,
            description:
              'Expand professional network within corporate hierarchy',
          },
          {
            type: 'credits',
            value: -30,
            description:
              'Professional appearance and networking investment costs',
          },
        ],
      },
      {
        label: 'Optimize Productivity Focus',
        description:
          'Prioritize operational efficiency over social engagement activities',
        effects: [
          {
            type: 'research_progress',
            value: 1,
            description: 'Accelerate strategic asset development initiatives',
          },
          {
            type: 'morale',
            value: -3,
            description:
              'Corporate assets experience social disconnect indicators',
          },
        ],
      },
      {
        label: 'Assume Event Leadership Role',
        description:
          'Demonstrate proactive management capabilities through event coordination',
        effects: [
          {
            type: 'morale',
            value: 12,
            description:
              'Corporate assets exhibit enhanced loyalty and appreciation metrics',
          },
          {
            type: 'bureaucraticLeverage',
            value: 1,
            description: 'Demonstrate executive potential to senior leadership',
          },
          {
            type: 'stress',
            value: 1,
            description:
              'Single corporate asset experiences stress-related productivity impact',
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
            description:
              'Reduced workplace satisfaction from security measures',
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
            description: 'Sacrifice corporate asset to regulatory authorities',
          },
          {
            type: 'corporate_reputation',
            value: -15,
            description: 'Internal workplace satisfaction impact',
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
    rarity: 'Common',
  },
  {
    id: 'tie',
    name: 'Corporate Tie',
    type: 'Combat',
    ability: 'Intimidate (+8 combat)',
    durability: 75,
    cost: { credits: 75, rawMaterials: 0 },
    rarity: 'Common',
  },
  {
    id: 'calculator',
    name: 'Calculator',
    type: 'Sabotage',
    ability: 'Data Processing (+12 sabotage)',
    durability: 90,
    cost: { credits: 125, rawMaterials: 1 },
    rarity: 'Uncommon',
  },
  // Enhanced Equipment Recipes
  {
    id: 'executive_briefcase',
    name: 'Executive Briefcase',
    type: 'Infiltration',
    ability: 'Corporate Authority (+20 infiltration)',
    durability: 95,
    cost: { credits: 300, rawMaterials: 2, bureaucraticLeverage: 1 },
    rarity: 'Rare',
    setName: 'Corporate Executive Suite',
  },
  {
    id: 'power_tie',
    name: 'Power Tie',
    type: 'Combat',
    ability: 'Executive Presence (+25 combat)',
    durability: 90,
    cost: { credits: 275, rawMaterials: 1, soulEssence: 1 },
    rarity: 'Rare',
    setName: 'Corporate Executive Suite',
  },
  {
    id: 'golden_calculator',
    name: 'Golden Calculator',
    type: 'Sabotage',
    ability: 'Financial Manipulation (+30 sabotage)',
    durability: 100,
    cost: { credits: 400, rawMaterials: 3, bureaucraticLeverage: 2 },
    rarity: 'Legendary',
    setName: 'Corporate Executive Suite',
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
          description: 'Sacrifice corporate asset operational efficiency',
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
              description: 'One corporate asset reassigned',
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
    description: 'Your experience shows in improved corporate asset management',
    effects: [
      {
        type: 'daemon_lifespan_bonus',
        value: 5,
        description: '+5 days corporate asset contract duration',
      },
      {
        type: 'morale_bonus',
        value: 10,
        description: '+10 starting workplace satisfaction',
      },
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
    description: 'Your corporate bloodlines carry enhanced traits',
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

// Enhanced Equipment System - Rarity Definitions
export const EQUIPMENT_RARITY_MODIFIERS = {
  Common: { durabilityBonus: 0, effectMultiplier: 1.0, legacyBonusRate: 1.0 },
  Uncommon: { durabilityBonus: 10, effectMultiplier: 1.2, legacyBonusRate: 1.1 },
  Rare: { durabilityBonus: 20, effectMultiplier: 1.5, legacyBonusRate: 1.2 },
  Legendary: { durabilityBonus: 40, effectMultiplier: 2.0, legacyBonusRate: 1.5 },
  Cursed: { durabilityBonus: -10, effectMultiplier: 2.5, legacyBonusRate: 2.0 },
} as const;

// Equipment Set Definitions
export const EQUIPMENT_SETS = {
  'Corporate Executive Suite': {
    pieces: ['Executive Briefcase', 'Power Tie', 'Golden Calculator'],
    setBonuses: [
      {
        requiredPieces: 2,
        effects: [{ type: 'bureaucratic_leverage_bonus', value: 1, description: '+1 daily bureaucratic leverage' }]
      },
      {
        requiredPieces: 3,
        effects: [
          { type: 'mission_success_bonus', value: 15, description: '+15% mission success rate' },
          { type: 'resource_generation_bonus', value: 0.2, description: '+20% resource generation' }
        ]
      }
    ]
  },
  'Infiltration Specialist Kit': {
    pieces: ['Shadow Briefcase', 'Stealth Tie', 'Encrypted Calculator'],
    setBonuses: [
      {
        requiredPieces: 2,
        effects: [{ type: 'infiltration_bonus', value: 10, description: '+10 infiltration missions success rate' }]
      },
      {
        requiredPieces: 3,
        effects: [
          { type: 'stealth_missions_unlock', value: 1, description: 'Unlocks advanced stealth missions' },
          { type: 'equipment_durability_bonus', value: 20, description: '+20% equipment durability' }
        ]
      }
    ]
  },
  'Combat Command Gear': {
    pieces: ['Tactical Briefcase', 'Combat Tie', 'Battle Calculator'],
    setBonuses: [
      {
        requiredPieces: 2,
        effects: [{ type: 'combat_bonus', value: 15, description: '+15 combat mission effectiveness' }]
      },
      {
        requiredPieces: 3,
        effects: [
          { type: 'team_damage_reduction', value: 25, description: '-25% team damage in missions' },
          { type: 'aggressive_missions_unlock', value: 1, description: 'Unlocks high-risk/high-reward missions' }
        ]
      }
    ]
  }
} as const;

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
  infiltration_specialist: {
    id: 'infiltration_specialist',
    name: 'Deep Cover Operations',
    description: 'Long-term infiltration requiring specialized daemon combinations',
    baseDuration: 120,
    primaryObjective: {
      type: 'primary' as const,
      description: 'Establish long-term corporate presence',
      requirements: { 
        minTeamSize: 2, 
        specialization: 'Infiltration' as const,
        requiredSpecializations: ['Infiltration', 'Sabotage']
      },
      rewards: { credits: 300, bureaucraticLeverage: 4, soulEssence: 1 },
    },
    secondaryObjectives: [
      {
        type: 'secondary' as const,
        description: 'Establish intelligence network',
        requirements: { equipment: ['Infiltration Specialist Kit'] },
        rewards: { futureOpportunities: ['advanced_intel_missions'] },
      },
      {
        type: 'bonus' as const,
        description: 'Recruit double agent',
        requirements: { minTeamSize: 3 },
        rewards: { newDaemonRecruitment: 1 },
      },
    ],
    failureConsequences: ['blown_cover', 'diplomatic_incident'],
  },
  combat_specialist: {
    id: 'combat_specialist',
    name: 'Tactical Assault Operations',
    description: 'High-intensity combat requiring specialized combat teams',
    baseDuration: 90,
    primaryObjective: {
      type: 'primary' as const,
      description: 'Neutralize heavily fortified position',
      requirements: { 
        minTeamSize: 3, 
        specialization: 'Combat' as const,
        forbiddenSpecializations: ['Infiltration']
      },
      rewards: { credits: 500, rawMaterials: 3 },
    },
    secondaryObjectives: [
      {
        type: 'secondary' as const,
        description: 'Capture strategic assets',
        requirements: { equipment: ['Combat Command Gear'] },
        rewards: { equipment: 1, reputation: 20 },
      },
      {
        type: 'bonus' as const,
        description: 'Zero casualty operation',
        requirements: { minTeamSize: 4 },
        rewards: { morale: 15, bureaucraticLeverage: 2 },
      },
    ],
    failureConsequences: ['heavy_casualties', 'equipment_loss', 'tactical_failure'],
  },
  multi_phase: {
    id: 'multi_phase',
    name: 'Multi-Phase Corporate Restructuring',
    description: 'Complex operation requiring multiple specialized teams',
    baseDuration: 180,
    primaryObjective: {
      type: 'primary' as const,
      description: 'Complete all operational phases',
      requirements: { 
        minTeamSize: 4,
        requiredSpecializations: ['Infiltration', 'Combat', 'Sabotage']
      },
      rewards: { credits: 800, bureaucraticLeverage: 6, soulEssence: 2, rawMaterials: 2 },
    },
    secondaryObjectives: [
      {
        type: 'secondary' as const,
        description: 'Phase 1: Intelligence gathering',
        requirements: { specialization: 'Infiltration' as const },
        rewards: { futureOpportunities: ['phase_2_bonus'] },
      },
      {
        type: 'secondary' as const,
        description: 'Phase 2: Tactical operations',
        requirements: { specialization: 'Combat' as const },
        rewards: { futureOpportunities: ['phase_3_bonus'] },
      },
      {
        type: 'secondary' as const,
        description: 'Phase 3: Data manipulation',
        requirements: { specialization: 'Sabotage' as const },
        rewards: { futureOpportunities: ['complete_restructuring'] },
      },
    ],
    failureConsequences: ['partial_completion', 'resource_waste', 'operational_exposure'],
  },
};

// Dynamic Event Chains - Corporate Storytelling
export const CORPORATE_EVENT_CHAINS = {
  quarterly_review_cycle: {
    chainId: 'quarterly_review_cycle',
    events: [
      {
        id: 'pre_review_preparation',
        title: 'Quarterly Review Preparation',
        description: 'Corporate management announces upcoming quarterly performance assessments. Preparation activities are recommended to optimize evaluation outcomes.',
        type: 'choice' as const,
        chainPosition: 0,
        triggerDelay: 0,
        choices: [
          {
            label: 'Intensive Preparation Campaign',
            description: 'Invest significant resources in preparation activities',
            effects: [
              { type: 'credits', value: -150, description: 'Preparation investment costs' },
              { type: 'morale', value: -5, description: 'Increased workplace pressure' },
              { type: 'review_preparation_bonus', value: 20, description: 'Enhanced review performance potential' },
            ],
          },
          {
            label: 'Standard Preparation Protocol',
            description: 'Follow established preparation procedures',
            effects: [
              { type: 'credits', value: -75, description: 'Standard preparation costs' },
              { type: 'review_preparation_bonus', value: 10, description: 'Adequate review preparation' },
            ],
          },
          {
            label: 'Minimal Preparation Strategy',
            description: 'Focus resources on operational priorities',
            effects: [
              { type: 'credits', value: 25, description: 'Resource optimization savings' },
              { type: 'review_preparation_penalty', value: -10, description: 'Reduced review performance potential' },
            ],
          },
        ],
        followUpEvents: [
          { eventId: 'quarterly_review_results', condition: 'choice_0', delay: 7 },
          { eventId: 'quarterly_review_results', condition: 'choice_1', delay: 7 },
          { eventId: 'quarterly_review_results', condition: 'choice_2', delay: 7 },
        ],
      },
      {
        id: 'quarterly_review_results',
        title: 'Quarterly Performance Assessment Results',
        description: 'Corporate leadership has completed the quarterly performance evaluation. Results will impact operational parameters and advancement opportunities.',
        type: 'automatic' as const,
        chainPosition: 1,
        effects: [
          { type: 'bureaucratic_leverage', value: 3, description: 'Performance recognition bonus' },
          { type: 'reputation', value: 15, description: 'Enhanced corporate standing' },
        ],
        followUpEvents: [
          { eventId: 'post_review_opportunities', condition: 'success', delay: 3 },
        ],
      },
      {
        id: 'post_review_opportunities',
        title: 'Post-Review Strategic Opportunities',
        description: 'Strong quarterly performance has unlocked additional strategic initiatives and resource allocation opportunities.',
        type: 'choice' as const,
        chainPosition: 2,
        choices: [
          {
            label: 'Expansion Initiative',
            description: 'Leverage strong performance for territorial expansion',
            effects: [
              { type: 'new_planets_unlocked', value: 2, description: 'Additional expansion opportunities' },
              { type: 'bureaucratic_leverage', value: -2, description: 'Political capital investment' },
            ],
          },
          {
            label: 'Resource Optimization',
            description: 'Focus on improving operational efficiency',
            effects: [
              { type: 'passive_income_bonus', value: 25, description: 'Daily resource generation bonus' },
              { type: 'efficiency_upgrade', value: 1, description: 'Permanent efficiency enhancement' },
            ],
          },
        ],
      },
    ],
  },
  corporate_merger_storyline: {
    chainId: 'corporate_merger_storyline',
    events: [
      {
        id: 'merger_announcement',
        title: 'Strategic Merger Announcement',
        description: 'Executive leadership announces strategic merger negotiations with a major competitor. This consolidation will significantly impact operational structures.',
        type: 'automatic' as const,
        chainPosition: 0,
        effects: [
          { type: 'uncertainty_penalty', value: -5, description: 'Organizational uncertainty impact' },
          { type: 'merger_preparation_time', value: 14, description: 'Preparation period activated' },
        ],
        followUpEvents: [
          { eventId: 'merger_preparation_phase', condition: 'success', delay: 5 },
        ],
      },
      {
        id: 'merger_preparation_phase',
        title: 'Merger Integration Preparation',
        description: 'Due diligence processes and integration planning require significant departmental coordination and resource allocation.',
        type: 'choice' as const,
        chainPosition: 1,
        choices: [
          {
            label: 'Aggressive Integration Strategy',
            description: 'Lead integration efforts to secure advantageous position',
            effects: [
              { type: 'bureaucratic_leverage', value: -3, description: 'Political capital investment' },
              { type: 'merger_leadership_position', value: 1, description: 'Enhanced post-merger authority' },
            ],
          },
          {
            label: 'Defensive Positioning',
            description: 'Focus on protecting current operational integrity',
            effects: [
              { type: 'current_operations_protection', value: 1, description: 'Operational continuity assurance' },
              { type: 'credits', value: 100, description: 'Cost-saving through defensive strategy' },
            ],
          },
        ],
        followUpEvents: [
          { eventId: 'merger_completion', condition: 'choice_0', delay: 10 },
          { eventId: 'merger_completion', condition: 'choice_1', delay: 10 },
        ],
      },
      {
        id: 'merger_completion',
        title: 'Merger Integration Complete',
        description: 'The strategic merger has been successfully completed. New operational parameters and enhanced capabilities are now available.',
        type: 'automatic' as const,
        chainPosition: 2,
        effects: [
          { type: 'corporate_tier_advancement', value: 1, description: 'Accelerated tier progression opportunity' },
          { type: 'new_daemon_archetypes', value: 2, description: 'Access to specialized daemon types' },
          { type: 'expanded_mission_types', value: 3, description: 'Advanced mission categories unlocked' },
        ],
      },
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
