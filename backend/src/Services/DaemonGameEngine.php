<?php

declare(strict_types=1);

namespace App\Services;

use DomainException;

final class DaemonGameEngine
{
    private const MAP_FIELDS = [
        'promotionProgress' => true,
        'complianceDeadlines' => true,
        'legacyBook' => true,
    ];

    public function initialState(): array
    {
        return [
            'resources' => [
                'credits' => 500,
                'soulEssence' => 0,
                'bureaucraticLeverage' => 0,
                'rawMaterials' => 0,
            ],
            'daemons' => $this->starterDaemons(),
            'recruitmentPool' => [],
            'equipment' => $this->starterEquipment(),
            'rooms' => $this->starterRooms(),
            'planets' => $this->starterPlanets(),
            'activeMission' => null,
            'corporateEvents' => [],
            'gameModifiers' => [
                'passiveIncome' => 0,
                'recruitmentDiscount' => 0,
                'equipmentRepairDiscount' => 0,
                'missionSuccessBonus' => 0,
                'managementStress' => false,
                'hrInvestigation' => 0,
                'productivityBonus' => 0,
                'productivityBonusRemainingMissions' => 0,
                'roomSynergyBonus' => 0,
                'roomSynergyMissionBonus' => 0,
                'takeoverDefense' => 0,
                'espionageImmunity' => 0,
                'boardLoyalty' => 0,
                'corporateControl' => 0,
                'regulatoryFavor' => 0,
            ],
            'daysPassed' => 0,
            'gameStarted' => true,
            'tutorialCompleted' => false,
            'reputation' => 0,
            'availableProceduralMissions' => [],
            'missionConsequences' => [],
            'futureOpportunities' => [],
            'corporateTier' => [
                'id' => 'daemon_ops',
                'name' => 'Daemon Operator',
                'level' => 1,
                'requirements' => [],
                'unlocks' => [],
            ],
            'promotionProgress' => [],
            'complianceTasks' => [],
            'complianceDeadlines' => [],
            'legacyBook' => [],
            'hallOfInfamy' => [],
            'endgameState' => [
                'managementStyle' => 'none',
                'endingAchieved' => false,
                'endingType' => '',
                'prestigeLevel' => 0,
                'permanentBonuses' => [],
            ],
            'unlockedContent' => [
                'daemonArchetypes' => [],
                'factions' => [],
                'events' => [],
                'tierFeatures' => [],
            ],
            'corporateRivals' => [],
            'currentTab' => 'dashboard',
            'selectedDaemons' => [],
            'currentPlanet' => null,
            'selectedMissionType' => 'conquest',
            'showTutorial' => false,
            'showMemorial' => false,
            'showMissionModal' => false,
            'showMissionResults' => false,
            'showEventModal' => false,
            'memorialDaemon' => null,
            'missionResults' => null,
            'currentEvent' => null,
            'notifications' => [],
            'completedMissions' => [],
            'gameIntervalId' => null,
            'totalRestarts' => 0,
        ];
    }

    public function applyAction(string $actionType, array $state, array $payload): array
    {
        return match ($actionType) {
            'start' => $this->initialState(),
            'new' => $this->initialState(),
            'replace' => $this->requireStatePayload($payload),
            'patch' => $this->applyPatch($state, $payload),
            default => throw new DomainException('Unsupported action type: ' . $actionType),
        };
    }

    public function sanitizeState(array $state): array
    {
        $sanitized = $this->applyPatch($this->initialState(), [
            'patch' => $state,
        ]);
        $sanitized = $this->filterUnknownKeys($sanitized);
        $sanitized = $this->normalizeFieldShapes($sanitized);
        $sanitized['selectedDaemons'] = $this->normalizeIdCollection($sanitized['selectedDaemons'] ?? []);

        return $sanitized;
    }

    public function mergeState(array $baseState, array $incomingState): array
    {
        return $this->applyPatch($baseState, ['patch' => $incomingState]);
    }

    private function requireStatePayload(array $payload): array
    {
        $state = $payload['state'] ?? null;
        if (!is_array($state)) {
            throw new DomainException('Missing or invalid state payload.');
        }

        return $state;
    }

    private function applyPatch(array $state, array $payload): array
    {
        if (!isset($payload['patch']) || !is_array($payload['patch'])) {
            throw new DomainException('Missing patch payload.');
        }

        return $this->recursiveMerge($state, $payload['patch']);
    }

    private function normalizeIdCollection(mixed $candidate): array
    {
        if (is_array($candidate)) {
            $ids = $candidate;
        } elseif ($candidate instanceof \Traversable) {
            $ids = iterator_to_array($candidate);
        } else {
            return [];
        }

        $filtered = array_values(array_filter(
            $ids,
            static fn($value): bool => is_string($value) || is_int($value)
        ));
        return array_values(array_unique(array_map('strval', $filtered)));
    }

    private function recursiveMerge(array $base, array $patch): array
    {
        foreach ($patch as $key => $value) {
            if (!array_key_exists($key, $base)) {
                $base[$key] = $value;
                continue;
            }

            if (is_array($base[$key]) && is_array($value)) {
                $base[$key] = $this->mergeArrays($base[$key], $value, (string) $key);
                continue;
            }

            $base[$key] = $value;
        }

        return $base;
    }

    private function mergeArrays(array $base, array $patch, string $key): array
    {
        if (!$this->isMapField($key) && !$this->looksLikeList($base) && !$this->looksLikeList($patch)) {
            return $this->recursiveMerge($base, $patch);
        }

        if (!$this->isMapField($key) && $this->looksLikeList($base) && $this->looksLikeList($patch)) {
            return array_values($patch);
        }

        return $this->recursiveMerge($base, $patch);
    }

    private function filterUnknownKeys(array $state): array
    {
        $allowedKeys = array_keys($this->initialState());
        $allowedSet = array_fill_keys($allowedKeys, true);

        return array_intersect_key($state, $allowedSet);
    }

    private function normalizeFieldShapes(array $state): array
    {
        $state['resources'] = is_array($state['resources'] ?? null) ? $state['resources'] : $this->initialState()['resources'];
        $state['daemons'] = $this->toList($state['daemons'] ?? []);
        $state['recruitmentPool'] = $this->toList($state['recruitmentPool'] ?? []);
        $state['equipment'] = $this->toList($state['equipment'] ?? []);
        $state['rooms'] = $this->toList($state['rooms'] ?? []);
        $state['planets'] = $this->toList($state['planets'] ?? []);
        $state['corporateEvents'] = $this->toList($state['corporateEvents'] ?? []);
        $state['notifications'] = $this->toList($state['notifications'] ?? []);
        $state['complianceTasks'] = $this->toList($state['complianceTasks'] ?? []);
        $state['hallOfInfamy'] = $this->toList($state['hallOfInfamy'] ?? []);
        $state['missionConsequences'] = $this->toList($state['missionConsequences'] ?? []);
        $state['futureOpportunities'] = $this->toList($state['futureOpportunities'] ?? []);
        $state['corporateRivals'] = $this->toList($state['corporateRivals'] ?? []);
        $state['legacyBook'] = $this->normalizeRecord($state['legacyBook'] ?? []);
        $state['promotionProgress'] = $this->normalizeRecord($state['promotionProgress'] ?? []);
        $state['complianceDeadlines'] = $this->normalizeRecord($state['complianceDeadlines'] ?? []);

        return $state;
    }

    private function toList(mixed $value): array
    {
        if (!is_array($value)) {
            return [];
        }

        if ($this->looksLikeList($value)) {
            return array_values($value);
        }

        return [];
    }

    private function normalizeRecord(mixed $value): array
    {
        if (!is_array($value)) {
            return [];
        }

        $output = [];
        foreach ($value as $recordKey => $recordValue) {
            if (is_string($recordKey) || is_int($recordKey)) {
                $output[(string) $recordKey] = $recordValue;
            }
        }

        return $output;
    }

    private function looksLikeList(array $value): bool
    {
        if ($value === []) {
            return true;
        }

        return array_keys($value) === range(0, count($value) - 1);
    }

    private function isMapField(string $key): bool
    {
        return array_key_exists($key, self::MAP_FIELDS);
    }

    private function starterDaemons(): array
    {
        return [
            [
                'id' => $this->generateId(),
                'name' => 'Belphegor-7734',
                'specialization' => 'Infiltration',
                'health' => 100,
                'morale' => 75,
                'lifespanDays' => 45,
                'quirks' => [
                    $this->quirk('Process documentation enthusiast', 'bureaucratic_bonus', 2, '+2 Bureaucratic Leverage per day'),
                    $this->quirk('Equipment anxiety disorder', 'office_penalty', -5, '-5% operational efficiency in technology-dependent environments'),
                ],
                'assignments' => [],
                'equipment' => null,
                'isActive' => true,
                'generation' => 1,
                'bloodline' => 'House of Burning Spreadsheets',
                'mentor' => null,
                'inheritedTraits' => [],
                'legacy' => [
                    'successfulMissions' => 0,
                    'planetsConquered' => 0,
                    'equipmentCreated' => 0,
                    'yearsServed' => 0,
                ],
            ],
            [
                'id' => $this->generateId(),
                'name' => 'Malphas-2156',
                'specialization' => 'Combat',
                'health' => 100,
                'morale' => 60,
                'lifespanDays' => 60,
                'quirks' => [
                    $this->quirk('Assertive stakeholder engagement style', 'combat_bonus', 15, '+15% tactical effectiveness during confrontational negotiations'),
                    $this->quirk('Office supply procurement specialist', 'equipment_durability', 10, '+10% asset longevity through superior maintenance protocols'),
                ],
                'assignments' => [],
                'equipment' => null,
                'isActive' => true,
                'generation' => 1,
                'bloodline' => 'The Synergy Syndicate',
                'mentor' => null,
                'inheritedTraits' => [],
                'legacy' => [
                    'successfulMissions' => 0,
                    'planetsConquered' => 0,
                    'equipmentCreated' => 0,
                    'yearsServed' => 0,
                ],
            ],
            [
                'id' => $this->generateId(),
                'name' => 'Vassago-9981',
                'specialization' => 'Sabotage',
                'health' => 100,
                'morale' => 80,
                'lifespanDays' => 30,
                'quirks' => [
                    $this->quirk('Spreadsheet manipulation virtuoso', 'sabotage_bonus', 20, '+20% data corruption and financial obfuscation success rate'),
                    $this->quirk('Unauthorized resource redistribution', 'morale_penalty', -3, '-3 workplace satisfaction across all corporate assets'),
                ],
                'assignments' => [],
                'equipment' => null,
                'isActive' => true,
                'generation' => 1,
                'bloodline' => 'Clan PowerPoint',
                'mentor' => null,
                'inheritedTraits' => [],
                'legacy' => [
                    'successfulMissions' => 0,
                    'planetsConquered' => 0,
                    'equipmentCreated' => 0,
                    'yearsServed' => 0,
                ],
            ],
        ];
    }

    private function starterEquipment(): array
    {
        return [
            [
                'id' => $this->generateId(),
                'name' => 'Standard Issue Briefcase',
                'type' => 'Infiltration',
                'durability' => 100,
                'ability' => 'Blend In (+15 stealth)',
                'assignedTo' => null,
                'generation' => 0,
                'legacyBonus' => 0,
                'history' => ['Corporate standard issue'],
                'rarity' => 'Common',
            ],
            [
                'id' => $this->generateId(),
                'name' => 'Corporate Tie of Binding',
                'type' => 'Combat',
                'durability' => 100,
                'ability' => 'Intimidate (+10 combat)',
                'assignedTo' => null,
                'generation' => 0,
                'legacyBonus' => 0,
                'history' => ['Corporate standard issue'],
                'rarity' => 'Common',
            ],
            [
                'id' => $this->generateId(),
                'name' => 'Cursed Calculator',
                'type' => 'Sabotage',
                'durability' => 90,
                'ability' => 'Data Corruption (+20 sabotage)',
                'assignedTo' => null,
                'generation' => 0,
                'legacyBonus' => 0,
                'history' => ['Corporate standard issue'],
                'rarity' => 'Cursed',
            ],
        ];
    }

    private function starterRooms(): array
    {
        return [
            $this->starterRoom('Living Quarters', 'utility', 1, 'Morale Recovery +5/day', 200, [], 6, true),
            $this->starterRoom('Command Center', 'operations', 1, 'Mission Success +5%', 300, [], 3, true),
            $this->starterRoom('Training Hall', 'operations', 0, 'Skill Development +10%', 400, ['specialization' => 'Combat'], 4, true),
            $this->starterRoom('Recovery Ward', 'living', 0, 'Health Recovery +15/day', 350, [], 4, true),
            $this->starterRoom('War Room', 'operations', 0, 'Strategic Planning +10%', 500, ['specialization' => 'Infiltration'], 3, false),
            $this->starterRoom('Item Forge', 'utility', 0, 'Equipment Repair -20% cost', 450, ['specialization' => 'Sabotage'], 2, true),
        ];
    }

    private function starterPlanets(): array
    {
        return [
            [
                'id' => $this->generateId(),
                'name' => 'Xerox-7',
                'difficulty' => 'Easy',
                'type' => 'Office Planet',
                'resistance' => 'Militant Accountants',
                'reward' => '150 Credits, 2 Soul Essence',
                'conquered' => false,
                'lastMission' => null,
                'stability' => 75,
                'corporatePresence' => 0,
                'availableMissions' => ['conquest', 'reconnaissance', 'sabotage'],
                'missionHistory' => [],
                'specialFeatures' => ['Paper Trail Security', 'Copy Machine Infrastructure'],
            ],
            [
                'id' => $this->generateId(),
                'name' => 'Synergy-Prime',
                'difficulty' => 'Medium',
                'type' => 'Corporate Headquarters',
                'resistance' => 'Executive Board',
                'reward' => '300 Credits, 5 Bureaucratic Leverage',
                'conquered' => false,
                'lastMission' => null,
                'stability' => 60,
                'corporatePresence' => 0,
                'availableMissions' => ['diplomacy', 'conquest', 'extraction'],
                'missionHistory' => [],
                'specialFeatures' => ['Board Room Politics', 'Executive Security'],
            ],
            [
                'id' => $this->generateId(),
                'name' => 'Productivity-Nine',
                'difficulty' => 'Hard',
                'type' => 'Factory World',
                'resistance' => 'Union Demons',
                'reward' => '500 Credits, 3 Raw Materials',
                'conquered' => false,
                'lastMission' => null,
                'stability' => 40,
                'corporatePresence' => 0,
                'availableMissions' => ['conquest', 'sabotage', 'diplomacy'],
                'missionHistory' => [],
                'specialFeatures' => ['Industrial Espionage Network', 'Worker Solidarity'],
            ],
        ];
    }

    private function quirk(string $name, string $effect, int|float $value, string $description): array
    {
        return [
            'name' => $name,
            'effect' => $effect,
            'value' => $value,
            'description' => $description,
        ];
    }

    private function starterRoom(
        string $name,
        string $type,
        int $level,
        string $bonus,
        int $upgradeCost,
        array $specialization,
        int $maxAssignments,
        bool $unlocked
    ): array {
        return [
            'id' => $this->generateId(),
            'name' => $name,
            'level' => $level,
            'maxLevel' => null,
            'efficiency' => null,
            'description' => null,
            'upgrade_cost' => $upgradeCost,
            'assignedDaemons' => [],
            'maxAssignments' => $maxAssignments,
            'specialization' => $specialization['specialization'] ?? null,
            'roomType' => $type,
            'unlocked' => $unlocked,
            'synergyBonuses' => [],
            'bonus' => $bonus,
        ];
    }

    private function generateId(): string
    {
        return bin2hex(random_bytes(8));
    }
}
