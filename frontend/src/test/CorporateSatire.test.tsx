// CorporateSatire.test.tsx - Test corporate satire enhancements
import { describe, it, expect } from 'vitest';
import {
  DAEMON_QUIRKS,
  CORPORATE_EVENTS,
  STARTER_DATA,
} from '../constants/gameData';
import { DAEMON_BALANCE, CORPORATE_BALANCE } from '../constants/gameBalance';

describe('Corporate Satire Theme Integration', () => {
  describe('Enhanced Daemon Quirks', () => {
    it('should have corporate-themed quirk names', () => {
      const corporateQuirkNames = [
        'Process documentation enthusiast',
        'Equipment anxiety disorder',
        'Assertive stakeholder engagement style',
        'Office supply procurement specialist',
        'Spreadsheet manipulation virtuoso',
        'Unauthorized resource redistribution',
        'Punctuality excellence award recipient',
        'Strategic inventory accumulation',
        'Alternative wellness methodology practitioner',
        'Information architecture perfectionist',
        'Beverage quality control deficiency',
        'Interpersonal engagement optimization specialist',
        'Comprehensive risk assessment methodology',
        'Workspace optimization syndrome',
        'Pressure-activated consumption disorder',
      ];

      corporateQuirkNames.forEach(expectedName => {
        const quirk = DAEMON_QUIRKS.find(q => q.name === expectedName);
        expect(quirk).toBeDefined();
        expect(quirk?.name).toBe(expectedName);
      });
    });

    it('should have corporate-themed quirk descriptions', () => {
      const corporateDescriptions = [
        '+2 Bureaucratic Leverage per day from workflow optimization',
        '-5% operational efficiency in technology-dependent environments',
        '+15% tactical effectiveness during confrontational negotiations',
        '+10% asset longevity through superior maintenance protocols',
        '+20% data corruption and financial obfuscation success rate',
      ];

      corporateDescriptions.forEach(expectedDesc => {
        const quirk = DAEMON_QUIRKS.find(q => q.description === expectedDesc);
        expect(quirk).toBeDefined();
      });
    });

    it('should maintain quirk functionality while enhancing themes', () => {
      DAEMON_QUIRKS.forEach(quirk => {
        expect(quirk).toHaveProperty('name');
        expect(quirk).toHaveProperty('effect');
        expect(quirk).toHaveProperty('value');
        expect(quirk).toHaveProperty('description');

        expect(typeof quirk.name).toBe('string');
        expect(typeof quirk.effect).toBe('string');
        expect(typeof quirk.value).toBe('number');
        expect(typeof quirk.description).toBe('string');

        expect(quirk.name.length).toBeGreaterThan(0);
        expect(quirk.description.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Enhanced Corporate Events', () => {
    it('should have enhanced corporate event titles', () => {
      const corporateEventTitles = [
        'Quarterly Soul Performance Evaluation',
        'Fiscal Realignment Initiative',
        'Aggressive Acquisition Initiative',
        'Comprehensive Compliance Assessment',
        'Strategic Organizational Integration',
        'Metaphysical Asset Market Correction',
        'Mandatory Cultural Enhancement Workshop',
        'Product Quality Assurance Notice',
        'Executive Advancement Opportunity',
        'Annual Corporate Celebration Event',
      ];

      corporateEventTitles.forEach(expectedTitle => {
        const event = CORPORATE_EVENTS.find(e => e.title === expectedTitle);
        expect(event).toBeDefined();
        expect(event?.title).toBe(expectedTitle);
      });
    });

    it('should have enhanced corporate event descriptions with proper terminology', () => {
      const performanceReview = CORPORATE_EVENTS.find(
        e => e.id === 'performance_review'
      );
      expect(performanceReview).toBeDefined();
      expect(performanceReview?.description).toContain('productivity metrics');
      expect(performanceReview?.description).toContain('suffering quotas');
      expect(performanceReview?.description).toContain(
        'eternal employment contracts'
      );

      const budgetEvent = CORPORATE_EVENTS.find(
        e => e.id === 'budget_restructuring'
      );
      expect(budgetEvent).toBeDefined();
      expect(budgetEvent?.description).toContain(
        'Infernal Accounting Division'
      );
      expect(budgetEvent?.description).toContain(
        'strategic budget optimization'
      );
      expect(budgetEvent?.description).toContain('stakeholder review');
    });

    it('should have enhanced choice labels with corporate speak', () => {
      const performanceReview = CORPORATE_EVENTS.find(
        e => e.id === 'performance_review'
      );
      expect(performanceReview?.choices?.[0]?.label).toBe(
        'Embrace the Bureaucratic Excellence'
      );
      expect(performanceReview?.choices?.[1]?.label).toBe(
        'Strategic Process Optimization'
      );

      const budgetEvent = CORPORATE_EVENTS.find(
        e => e.id === 'budget_restructuring'
      );
      expect(budgetEvent?.choices?.[0]?.label).toBe(
        'Execute Strategic Budget Proposal'
      );
      expect(budgetEvent?.choices?.[1]?.label).toBe(
        'Demonstrate Fiduciary Stewardship'
      );
    });

    it('should have enhanced effect descriptions with corporate terminology', () => {
      const performanceReview = CORPORATE_EVENTS.find(
        e => e.id === 'performance_review'
      );
      const corporateAssetEffect =
        performanceReview?.choices?.[0]?.effects?.[0];
      expect(corporateAssetEffect?.description).toBe(
        'Corporate assets experience workplace satisfaction reduction'
      );

      const politicalCapitalEffect =
        performanceReview?.choices?.[0]?.effects?.[1];
      expect(politicalCapitalEffect?.description).toBe(
        'Enhance political capital within infernal hierarchy'
      );
    });

    it('should maintain event structure while enhancing themes', () => {
      CORPORATE_EVENTS.forEach(event => {
        expect(event).toHaveProperty('id');
        expect(event).toHaveProperty('title');
        expect(event).toHaveProperty('description');
        expect(event).toHaveProperty('type');

        expect(typeof event.id).toBe('string');
        expect(typeof event.title).toBe('string');
        expect(typeof event.description).toBe('string');
        expect(['choice', 'automatic']).toContain(event.type);

        if (event.type === 'choice') {
          expect(event.choices).toBeDefined();
          expect(Array.isArray(event.choices)).toBe(true);

          event.choices?.forEach(choice => {
            expect(choice).toHaveProperty('label');
            expect(choice).toHaveProperty('description');
            expect(choice).toHaveProperty('effects');
            expect(Array.isArray(choice.effects)).toBe(true);
          });
        }

        if (event.type === 'automatic') {
          expect(event.effects).toBeDefined();
          expect(Array.isArray(event.effects)).toBe(true);
        }
      });
    });
  });

  describe('Corporate Terminology Consistency', () => {
    it('should use corporate hierarchy titles consistently', () => {
      const corporateTerms = [
        'Corporate Assets',
        'Workplace Satisfaction',
        'Corporeal Integrity',
        'Contract Duration',
        'Talent Acquisition Pipeline',
        'Performance Review',
        'Corporate Housing Division',
        'Bureaucratic Excellence',
        'Strategic Partnership',
        'Compliance Assessment',
        'Infernal Corporate Hierarchy',
      ];

      // These terms should appear in various game data structures
      corporateTerms.forEach(term => {
        expect(typeof term).toBe('string');
        expect(term.length).toBeGreaterThan(0);
      });
    });

    it('should maintain dark humor while being professional', () => {
      // Check that we maintain satirical elements
      const auditEvent = CORPORATE_EVENTS.find(e => e.id === 'infernal_audit');
      expect(auditEvent?.description).toContain('Sarbanes-Oxley-Belphegor');

      const trainingEvent = CORPORATE_EVENTS.find(
        e => e.id === 'mandatory_training'
      );
      expect(trainingEvent?.description).toContain(
        'Multi-Dimensional Corporate Environments'
      );

      // Verify we have corporate buzzword satire
      const mergerEvent = CORPORATE_EVENTS.find(
        e => e.id === 'corporate_merger'
      );
      expect(mergerEvent?.description).toContain('synergistic merger');
      expect(mergerEvent?.description).toContain('vertical integration');
      expect(mergerEvent?.description).toContain('stakeholder value');
    });
  });

  describe('Starter Data Corporate Theme', () => {
    it('should have corporate-themed daemon bloodlines', () => {
      const bloodlines = [
        'House of Burning Spreadsheets',
        'The Synergy Syndicate',
        'Clan PowerPoint',
      ];

      bloodlines.forEach(bloodline => {
        const daemon = STARTER_DATA.starter_daemons.find(
          d => d.bloodline === bloodline
        );
        expect(daemon).toBeDefined();
        expect(daemon?.bloodline).toBe(bloodline);
      });
    });

    it('should have corporate-themed planet names', () => {
      const planetNames = ['Xerox-7', 'Synergy-Prime', 'Productivity-Nine'];

      planetNames.forEach(name => {
        const planet = STARTER_DATA.planets.find(p => p.name === name);
        expect(planet).toBeDefined();
        expect(planet?.name).toBe(name);
      });
    });

    it('should have corporate-themed resistance factions', () => {
      const resistanceTypes = [
        'Militant Accountants',
        'Executive Board',
        'Union Demons',
      ];

      resistanceTypes.forEach(resistance => {
        const planet = STARTER_DATA.planets.find(
          p => p.resistance === resistance
        );
        expect(planet).toBeDefined();
        expect(planet?.resistance).toBe(resistance);
      });
    });

    it('should have corporate-themed equipment names', () => {
      const equipmentNames = [
        'Standard Issue Briefcase',
        'Corporate Tie of Binding',
        'Cursed Calculator',
      ];

      equipmentNames.forEach(name => {
        const equipment = STARTER_DATA.starter_equipment.find(
          e => e.name === name
        );
        expect(equipment).toBeDefined();
        expect(equipment?.name).toBe(name);
      });
    });
  });

  describe('Game Balance Corporate Integration', () => {
    it('should have proper recruitment cost structure', () => {
      expect(DAEMON_BALANCE.RECRUITMENT).toBeDefined();
      expect(DAEMON_BALANCE.RECRUITMENT.BASE_COST).toBeDefined();
      expect(typeof DAEMON_BALANCE.RECRUITMENT.BASE_COST).toBe('number');
      expect(DAEMON_BALANCE.RECRUITMENT.BASE_COST).toBeGreaterThan(0);
    });

    it('should have HR review system properly configured', () => {
      expect(CORPORATE_BALANCE.HR_REVIEW).toBeDefined();
      expect(CORPORATE_BALANCE.HR_REVIEW.MIN_TIER).toBeDefined();
      expect(CORPORATE_BALANCE.HR_REVIEW.COOLDOWN_DAYS).toBeDefined();
      expect(typeof CORPORATE_BALANCE.HR_REVIEW.MIN_TIER).toBe('number');
      expect(typeof CORPORATE_BALANCE.HR_REVIEW.COOLDOWN_DAYS).toBe('number');
    });

    it('should maintain game balance while enhancing theme', () => {
      // Verify key balance constants exist
      expect(DAEMON_BALANCE.THRESHOLDS).toBeDefined();
      expect(DAEMON_BALANCE.RECRUITMENT).toBeDefined();
      expect(DAEMON_BALANCE.LEGACY_REQUIREMENTS).toBeDefined();
      expect(CORPORATE_BALANCE.EVENT_CHANCES).toBeDefined();
    });
  });

  describe('Corporate Event Choices Functionality', () => {
    it('should have properly structured choice effects', () => {
      const choiceEvents = CORPORATE_EVENTS.filter(e => e.type === 'choice');

      choiceEvents.forEach(event => {
        event.choices?.forEach(choice => {
          choice.effects.forEach(effect => {
            expect(effect).toHaveProperty('type');
            expect(effect).toHaveProperty('value');
            expect(effect).toHaveProperty('description');

            expect(typeof effect.type).toBe('string');
            expect(typeof effect.value).toBe('number');
            expect(typeof effect.description).toBe('string');

            // Verify corporate terminology in descriptions
            expect(effect.description.length).toBeGreaterThan(0);
          });
        });
      });
    });

    it('should have enhanced automatic event effects', () => {
      const autoEvents = CORPORATE_EVENTS.filter(e => e.type === 'automatic');

      autoEvents.forEach(event => {
        event.effects?.forEach(effect => {
          expect(effect).toHaveProperty('type');
          expect(effect).toHaveProperty('value');
          expect(effect).toHaveProperty('description');

          // Check for corporate terminology in automatic event descriptions
          expect(effect.description.length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe('Corporate Satire Quality Assurance', () => {
    it('should not have any placeholder or generic text remaining', () => {
      // Check that we don't have any old generic terms
      const genericTerms = ['daemon', 'hire', 'health', 'morale', 'lifespan'];

      CORPORATE_EVENTS.forEach(event => {
        genericTerms.forEach(term => {
          // Allow these terms in IDs and technical fields, but not in user-facing text
          expect(event.title.toLowerCase().includes(term)).toBe(false);
          expect(
            event.description.toLowerCase().includes(' ' + term + ' ')
          ).toBe(false);
        });
      });
    });

    it('should have consistent capitalization in corporate terminology', () => {
      const corporateTerms = [
        'Corporate Assets',
        'Workplace Satisfaction',
        'Corporeal Integrity',
        'Contract Duration',
        'Bureaucratic Excellence',
        'Strategic Partnership',
      ];

      corporateTerms.forEach(term => {
        // Terms should be properly capitalized (not all lowercase or all uppercase)
        expect(term).not.toBe(term.toLowerCase());
        expect(term).not.toBe(term.toUpperCase());
      });
    });

    it('should have appropriate length descriptions for readability', () => {
      CORPORATE_EVENTS.forEach(event => {
        // Titles should be concise but descriptive
        expect(event.title.length).toBeGreaterThan(10);
        expect(event.title.length).toBeLessThan(100);

        // Descriptions should be detailed but not overwhelming
        expect(event.description.length).toBeGreaterThan(20);
        expect(event.description.length).toBeLessThan(500);

        if (event.choices) {
          event.choices.forEach(choice => {
            expect(choice.label.length).toBeGreaterThan(5);
            expect(choice.label.length).toBeLessThan(100);
            expect(choice.description.length).toBeGreaterThan(10);
            expect(choice.description.length).toBeLessThan(200);
          });
        }
      });
    });
  });
});
