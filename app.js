// Daemon Directorate - Game Logic
class DaemonDirectorate {
    constructor() {
        this.gameState = {
            resources: {
                credits: 500,
                soulEssence: 0,
                bureaucraticLeverage: 0,
                rawMaterials: 0
            },
            daemons: [],
            equipment: [],
            rooms: [],
            planets: [],
            recruitmentPool: [],
            activeMission: null,
            corporateEvents: [],
            daysPassed: 0,
            gameStarted: false
        };
        
        this.selectedDaemons = new Set();
        this.currentPlanet = null;
        
        this.initializeGame();
    }

    initializeGame() {
        // Set up event listeners
        this.setupEventListeners();
        
        // Load saved game or start new
        if (this.loadGame()) {
            this.updateAllDisplays();
        } else {
            this.startNewGame();
        }
        
        // Show tutorial for new players
        if (!this.gameState.gameStarted) {
            setTimeout(() => this.showTutorial(), 500);
        }
        
        // Start daily progression
        setInterval(() => this.processDailyUpdate(), 30000); // Every 30 seconds = 1 game day
    }

    setupEventListeners() {
        // Tutorial button
        const closeTutorialBtn = document.getElementById('close-tutorial-btn');
        if (closeTutorialBtn) {
            closeTutorialBtn.addEventListener('click', () => this.closeTutorial());
        }

        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.target.getAttribute('data-tab');
                this.showTab(tabName);
            });
        });

        // Game control buttons
        const saveBtn = document.getElementById('save-game-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveGame();
                this.showNotification('Game progress saved!', 'success');
            });
        }

        const loadBtn = document.getElementById('load-game-btn');
        if (loadBtn) {
            loadBtn.addEventListener('click', () => {
                if (this.loadGame()) {
                    this.updateAllDisplays();
                    this.showNotification('Game progress loaded!', 'success');
                } else {
                    this.showNotification('No saved game found!', 'error');
                }
            });
        }

        const resetBtn = document.getElementById('reset-game-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetGame());
        }

        // Corporate events button
        const triggerEventBtn = document.getElementById('trigger-event-btn');
        if (triggerEventBtn) {
            triggerEventBtn.addEventListener('click', () => this.triggerRandomEvent());
        }

        // Recruitment button
        const refreshRecruitmentBtn = document.getElementById('refresh-recruitment-btn');
        if (refreshRecruitmentBtn) {
            refreshRecruitmentBtn.addEventListener('click', () => this.refreshRecruitmentPool());
        }

        // Modal buttons
        const closeMemorialBtn = document.getElementById('close-memorial-btn');
        if (closeMemorialBtn) {
            closeMemorialBtn.addEventListener('click', () => this.closeMemorial());
        }

        const executeMissionBtn = document.getElementById('execute-mission-btn');
        if (executeMissionBtn) {
            executeMissionBtn.addEventListener('click', () => this.executeMission());
        }

        const cancelMissionBtn = document.getElementById('cancel-mission-btn');
        if (cancelMissionBtn) {
            cancelMissionBtn.addEventListener('click', () => this.closeMissionModal());
        }

        const closeMissionResultsBtn = document.getElementById('close-mission-results-btn');
        if (closeMissionResultsBtn) {
            closeMissionResultsBtn.addEventListener('click', () => this.closeMissionResults());
        }

        // Crafting buttons
        document.querySelectorAll('[data-craft]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemType = e.target.getAttribute('data-craft');
                this.craftItem(itemType);
            });
        });
    }

    startNewGame() {
        // Initialize with starter data
        const starterData = {
            "starter_daemons": [
                {"name": "Belphegor-7734", "specialization": "Infiltration", "health": 100, "morale": 75, "lifespanDays": 45, "quirks": ["Loves paperwork", "Afraid of printers"]},
                {"name": "Malphas-2156", "specialization": "Combat", "health": 100, "morale": 60, "lifespanDays": 60, "quirks": ["Aggressive in meetings", "Collects staplers"]},
                {"name": "Vassago-9981", "specialization": "Sabotage", "health": 100, "morale": 80, "lifespanDays": 30, "quirks": ["Excellent with Excel", "Steals lunch from fridge"]}
            ],
            "starter_equipment": [
                {"name": "Standard Issue Briefcase", "type": "Infiltration", "durability": 100, "ability": "Blend In (+15 stealth)"},
                {"name": "Corporate Tie of Binding", "type": "Combat", "durability": 100, "ability": "Intimidate (+10 combat)"},
                {"name": "Cursed Calculator", "type": "Sabotage", "durability": 90, "ability": "Data Corruption (+20 sabotage)"}
            ],
            "planets": [
                {"name": "Xerox-7", "difficulty": "Easy", "type": "Office Planet", "resistance": "Militant Accountants", "reward": "150 Credits, 2 Soul Essence"},
                {"name": "Synergy-Prime", "difficulty": "Medium", "type": "Corporate Headquarters", "resistance": "Executive Board", "reward": "300 Credits, 5 Bureaucratic Leverage"},
                {"name": "Productivity-Nine", "difficulty": "Hard", "type": "Factory World", "resistance": "Union Demons", "reward": "500 Credits, 3 Raw Materials"}
            ],
            "apartment_rooms": [
                {"name": "Living Quarters", "level": 1, "bonus": "Morale Recovery +5/day", "upgrade_cost": 200},
                {"name": "Command Center", "level": 1, "bonus": "Mission Success +5%", "upgrade_cost": 300},
                {"name": "Training Hall", "level": 0, "bonus": "Skill Development +10%", "upgrade_cost": 400},
                {"name": "Recovery Ward", "level": 0, "bonus": "Health Recovery +15/day", "upgrade_cost": 350},
                {"name": "Item Forge", "level": 0, "bonus": "Equipment Repair -20% cost", "upgrade_cost": 450}
            ]
        };

        this.gameState.daemons = starterData.starter_daemons.map(d => ({
            ...d,
            id: this.generateId(),
            assignments: [],
            equipment: null,
            isActive: true
        }));

        this.gameState.equipment = starterData.starter_equipment.map(e => ({
            ...e,
            id: this.generateId(),
            assignedTo: null
        }));

        this.gameState.rooms = starterData.apartment_rooms.map(r => ({
            ...r,
            id: this.generateId()
        }));

        this.gameState.planets = starterData.planets.map(p => ({
            ...p,
            id: this.generateId(),
            conquered: false,
            lastMission: null
        }));

        this.generateRecruitmentPool();
        this.updateAllDisplays();
    }

    generateId() {
        return 'id_' + Math.random().toString(36).substr(2, 9);
    }

    showTutorial() {
        const tutorial = document.getElementById('tutorial-overlay');
        if (tutorial) {
            tutorial.classList.remove('hidden');
        }
    }

    closeTutorial() {
        const tutorial = document.getElementById('tutorial-overlay');
        if (tutorial) {
            tutorial.classList.add('hidden');
        }
        this.gameState.gameStarted = true;
        this.saveGame();
        this.showNotification('Welcome to your corporate nightmare!', 'success');
    }

    // Tab Management - Fixed version
    showTab(tabName) {
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.add('hidden');
            tab.classList.remove('active');
        });
        
        // Remove active class from all buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Show selected tab
        const targetTab = document.getElementById(tabName);
        if (targetTab) {
            targetTab.classList.remove('hidden');
            targetTab.classList.add('active');
        }
        
        // Activate the correct button
        const targetButton = document.querySelector(`[data-tab="${tabName}"]`);
        if (targetButton) {
            targetButton.classList.add('active');
        }
        
        // Update content based on tab
        switch(tabName) {
            case 'dashboard':
                this.updateDashboard();
                break;
            case 'team':
                this.updateTeamDisplay();
                break;
            case 'missions':
                this.updateMissionsDisplay();
                break;
            case 'apartment':
                this.updateApartmentDisplay();
                break;
            case 'equipment':
                this.updateEquipmentDisplay();
                break;
        }
    }

    // Resource Management
    updateResourceDisplay() {
        const creditEl = document.getElementById('credits');
        const soulEl = document.getElementById('soul-essence');
        const leverageEl = document.getElementById('bureaucratic-leverage');
        const materialsEl = document.getElementById('raw-materials');
        
        if (creditEl) creditEl.textContent = this.gameState.resources.credits;
        if (soulEl) soulEl.textContent = this.gameState.resources.soulEssence;
        if (leverageEl) leverageEl.textContent = this.gameState.resources.bureaucraticLeverage;
        if (materialsEl) materialsEl.textContent = this.gameState.resources.rawMaterials;
    }

    canAfford(cost) {
        return this.gameState.resources.credits >= cost;
    }

    spendCredits(amount) {
        if (this.canAfford(amount)) {
            this.gameState.resources.credits -= amount;
            this.updateResourceDisplay();
            return true;
        }
        return false;
    }

    addResources(credits = 0, soulEssence = 0, bureaucraticLeverage = 0, rawMaterials = 0) {
        this.gameState.resources.credits += credits;
        this.gameState.resources.soulEssence += soulEssence;
        this.gameState.resources.bureaucraticLeverage += bureaucraticLeverage;
        this.gameState.resources.rawMaterials += rawMaterials;
        this.updateResourceDisplay();
    }

    // Dashboard Updates
    updateDashboard() {
        this.updateMissionStatus();
        this.updateTeamOverview();
        this.updateCorporateEvents();
    }

    updateMissionStatus() {
        const statusDiv = document.getElementById('mission-status');
        if (!statusDiv) return;
        
        if (this.gameState.activeMission) {
            statusDiv.innerHTML = `
                <div class="status status--info">
                    <strong>Mission in Progress:</strong> ${this.gameState.activeMission.planetName}
                </div>
            `;
        } else {
            statusDiv.innerHTML = `
                <div class="status status--success">
                    All operatives available for deployment
                </div>
            `;
        }
    }

    updateTeamOverview() {
        const overviewDiv = document.getElementById('team-overview');
        if (!overviewDiv) return;
        
        const activeDaemons = this.gameState.daemons.filter(d => d.isActive);
        const avgHealth = activeDaemons.length > 0 ? Math.round(activeDaemons.reduce((sum, d) => sum + d.health, 0) / activeDaemons.length) : 0;
        const avgMorale = activeDaemons.length > 0 ? Math.round(activeDaemons.reduce((sum, d) => sum + d.morale, 0) / activeDaemons.length) : 0;
        const criticalLifespans = activeDaemons.filter(d => d.lifespanDays <= 10).length;
        
        overviewDiv.innerHTML = `
            <div class="team-stats">
                <p><strong>Active Operatives:</strong> ${activeDaemons.length}</p>
                <p><strong>Average Health:</strong> ${avgHealth}%</p>
                <p><strong>Average Morale:</strong> ${avgMorale}%</p>
                <p><strong>Critical Lifespans:</strong> ${criticalLifespans}</p>
            </div>
        `;
    }

    updateCorporateEvents() {
        const eventsDiv = document.getElementById('corporate-events');
        if (!eventsDiv) return;
        
        if (this.gameState.corporateEvents.length > 0) {
            const latestEvent = this.gameState.corporateEvents[this.gameState.corporateEvents.length - 1];
            eventsDiv.innerHTML = `
                <div class="status status--warning">
                    <strong>${latestEvent.name}:</strong> ${latestEvent.description}
                </div>
            `;
        } else {
            eventsDiv.innerHTML = 'All systems nominal. Await further directives.';
        }
    }

    // Team Management
    updateTeamDisplay() {
        this.updateActiveDaemons();
        this.updateRecruitmentPool();
    }

    updateActiveDaemons() {
        const daemonList = document.getElementById('daemon-list');
        if (!daemonList) return;
        
        const activeDaemons = this.gameState.daemons.filter(d => d.isActive);
        
        daemonList.innerHTML = activeDaemons.map(daemon => `
            <div class="daemon-card">
                <div class="daemon-header">
                    <h4 class="daemon-name">${daemon.name}</h4>
                    <span class="daemon-specialization">${daemon.specialization}</span>
                </div>
                
                <div class="daemon-stats">
                    <div class="stat-bar">
                        <span class="stat-label">Health: ${daemon.health}%</span>
                        <div class="progress-bar">
                            <div class="progress-fill health" style="width: ${daemon.health}%"></div>
                        </div>
                    </div>
                    
                    <div class="stat-bar">
                        <span class="stat-label">Morale: ${daemon.morale}%</span>
                        <div class="progress-bar">
                            <div class="progress-fill morale" style="width: ${daemon.morale}%"></div>
                        </div>
                    </div>
                </div>
                
                <div class="stat-bar">
                    <span class="stat-label ${daemon.lifespanDays <= 10 ? 'lifespan-critical' : daemon.lifespanDays <= 20 ? 'lifespan-warning' : ''}">
                        Lifespan: ${daemon.lifespanDays} days
                    </span>
                    <div class="progress-bar">
                        <div class="progress-fill lifespan" style="width: ${Math.max(daemon.lifespanDays, 0)}%"></div>
                    </div>
                </div>
                
                <div class="daemon-quirks">
                    ${daemon.quirks.map(quirk => `<span class="quirk-tag">${quirk}</span>`).join('')}
                </div>
                
                <div class="daemon-actions">
                    <button class="btn btn--outline btn--sm" onclick="game.assignEquipment('${daemon.id}')">
                        Equipment
                    </button>
                    <button class="btn btn--outline btn--sm" onclick="game.viewDaemonDetails('${daemon.id}')">
                        Details
                    </button>
                </div>
            </div>
        `).join('');
    }

    updateRecruitmentPool() {
        const poolDiv = document.getElementById('recruitment-pool');
        if (!poolDiv) return;
        
        poolDiv.innerHTML = this.gameState.recruitmentPool.map(daemon => `
            <div class="daemon-card">
                <div class="daemon-header">
                    <h4 class="daemon-name">${daemon.name}</h4>
                    <span class="daemon-specialization">${daemon.specialization}</span>
                </div>
                
                <div class="daemon-stats">
                    <div class="stat-bar">
                        <span class="stat-label">Health: ${daemon.health}%</span>
                        <div class="progress-bar">
                            <div class="progress-fill health" style="width: ${daemon.health}%"></div>
                        </div>
                    </div>
                    
                    <div class="stat-bar">
                        <span class="stat-label">Morale: ${daemon.morale}%</span>
                        <div class="progress-bar">
                            <div class="progress-fill morale" style="width: ${daemon.morale}%"></div>
                        </div>
                    </div>
                </div>
                
                <div class="stat-bar">
                    <span class="stat-label">Lifespan: ${daemon.lifespanDays} days</span>
                    <div class="progress-bar">
                        <div class="progress-fill lifespan" style="width: ${Math.max(daemon.lifespanDays, 0)}%"></div>
                    </div>
                </div>
                
                <div class="daemon-quirks">
                    ${daemon.quirks.map(quirk => `<span class="quirk-tag">${quirk}</span>`).join('')}
                </div>
                
                <div class="daemon-actions">
                    <button class="btn btn--primary recruit-btn" onclick="game.recruitDaemon('${daemon.id}')">
                        Hire (${daemon.cost} Credits)
                    </button>
                </div>
            </div>
        `).join('');
    }

    generateRecruitmentPool() {
        const specializations = ["Infiltration", "Combat", "Sabotage", "Logistics", "Bureaucracy", "Soul Harvesting"];
        const quirks = [
            "Loves paperwork", "Afraid of printers", "Aggressive in meetings", "Collects staplers", 
            "Excellent with Excel", "Steals lunch from fridge", "Always wears same tie", "Speaks only in corporate jargon",
            "Hoards office supplies", "Never uses sick days", "Brings homemade cookies", "Fears the coffee machine",
            "Knows all the good gossip", "Perfect attendance record", "Terrible at small talk", "Obsessed with efficiency metrics"
        ];

        this.gameState.recruitmentPool = [];
        for (let i = 0; i < 3; i++) {
            const daemon = {
                id: this.generateId(),
                name: this.generateDaemonName(),
                specialization: specializations[Math.floor(Math.random() * specializations.length)],
                health: Math.floor(Math.random() * 30) + 70, // 70-100
                morale: Math.floor(Math.random() * 40) + 50, // 50-90
                lifespanDays: Math.floor(Math.random() * 40) + 20, // 20-60
                quirks: this.getRandomQuirks(quirks, 2),
                cost: Math.floor(Math.random() * 100) + 100, // 100-200 credits
                isActive: true
            };
            this.gameState.recruitmentPool.push(daemon);
        }
    }

    generateDaemonName() {
        const prefixes = ["Belphegor", "Malphas", "Vassago", "Andras", "Foras", "Asmoday", "Gaap", "Furfur", "Marchosias", "Stolas"];
        const suffix = Math.floor(Math.random() * 9999) + 1000;
        return `${prefixes[Math.floor(Math.random() * prefixes.length)]}-${suffix}`;
    }

    getRandomQuirks(quirksList, count) {
        const shuffled = [...quirksList].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    recruitDaemon(daemonId) {
        const daemon = this.gameState.recruitmentPool.find(d => d.id === daemonId);
        if (daemon && this.spendCredits(daemon.cost)) {
            // Remove from recruitment pool
            this.gameState.recruitmentPool = this.gameState.recruitmentPool.filter(d => d.id !== daemonId);
            
            // Add to active daemons
            delete daemon.cost;
            daemon.assignments = [];
            daemon.equipment = null;
            this.gameState.daemons.push(daemon);
            
            this.updateTeamDisplay();
            this.saveGame();
            
            this.showNotification(`${daemon.name} has joined your corporate team!`, 'success');
        } else {
            this.showNotification('Insufficient credits for recruitment!', 'error');
        }
    }

    refreshRecruitmentPool() {
        if (this.spendCredits(50)) {
            this.generateRecruitmentPool();
            this.updateRecruitmentPool();
            this.showNotification('New candidates have been sourced by HR.', 'info');
            this.saveGame();
        } else {
            this.showNotification('Insufficient credits to refresh candidate pool!', 'error');
        }
    }

    // Missions System
    updateMissionsDisplay() {
        const planetList = document.getElementById('planet-list');
        if (!planetList) return;
        
        planetList.innerHTML = this.gameState.planets.map(planet => `
            <div class="planet-card">
                <div class="planet-header">
                    <h3 class="planet-name">${planet.name}</h3>
                    <span class="difficulty-badge difficulty-${planet.difficulty.toLowerCase()}">${planet.difficulty}</span>
                </div>
                
                <div class="planet-info">
                    <p><strong>Type:</strong> ${planet.type}</p>
                    <p><strong>Resistance:</strong> ${planet.resistance}</p>
                    ${planet.conquered ? '<p class="status status--success">CONQUERED</p>' : ''}
                </div>
                
                <div class="planet-reward">
                    <strong>Rewards:</strong> ${planet.reward}
                </div>
                
                <button class="btn ${planet.conquered ? 'btn--secondary' : 'btn--primary'}" 
                        onclick="game.selectPlanetForMission('${planet.id}')">
                    ${planet.conquered ? 'Return Mission' : 'Deploy Team'}
                </button>
            </div>
        `).join('');
    }

    selectPlanetForMission(planetId) {
        this.currentPlanet = this.gameState.planets.find(p => p.id === planetId);
        if (!this.currentPlanet) return;

        // Show mission modal
        const modal = document.getElementById('mission-modal');
        const detailsDiv = document.getElementById('mission-details');
        const selectionDiv = document.getElementById('team-selection');

        if (!modal || !detailsDiv || !selectionDiv) return;

        detailsDiv.innerHTML = `
            <h3>Operation: ${this.currentPlanet.name}</h3>
            <p><strong>Target:</strong> ${this.currentPlanet.type}</p>
            <p><strong>Opposition:</strong> ${this.currentPlanet.resistance}</p>
            <p><strong>Difficulty:</strong> ${this.currentPlanet.difficulty}</p>
            <p><strong>Expected Rewards:</strong> ${this.currentPlanet.reward}</p>
            <p class="corporate-text">Select operatives for deployment. Mission success depends on team composition and equipment readiness.</p>
        `;

        const activeDaemons = this.gameState.daemons.filter(d => d.isActive && d.health > 20);
        selectionDiv.innerHTML = `
            <h4>Available Operatives:</h4>
            ${activeDaemons.map(daemon => `
                <div class="selectable-daemon" onclick="game.toggleDaemonSelection('${daemon.id}')">
                    <input type="checkbox" class="daemon-checkbox" id="daemon-${daemon.id}">
                    <div>
                        <strong>${daemon.name}</strong> (${daemon.specialization})
                        <br><small>Health: ${daemon.health}% | Morale: ${daemon.morale}% | Lifespan: ${daemon.lifespanDays} days</small>
                    </div>
                </div>
            `).join('')}
        `;

        this.selectedDaemons.clear();
        modal.classList.remove('hidden');
    }

    toggleDaemonSelection(daemonId) {
        const checkbox = document.getElementById(`daemon-${daemonId}`);
        if (!checkbox) return;
        
        const daemonDiv = checkbox.parentElement;

        if (this.selectedDaemons.has(daemonId)) {
            this.selectedDaemons.delete(daemonId);
            checkbox.checked = false;
            daemonDiv.classList.remove('selected');
        } else {
            this.selectedDaemons.add(daemonId);
            checkbox.checked = true;
            daemonDiv.classList.add('selected');
        }
    }

    executeMission() {
        if (this.selectedDaemons.size === 0) {
            this.showNotification('Please select at least one operative for the mission!', 'error');
            return;
        }

        const selectedTeam = Array.from(this.selectedDaemons).map(id => 
            this.gameState.daemons.find(d => d.id === id)
        );

        // Calculate mission success
        const missionResult = this.calculateMissionSuccess(selectedTeam, this.currentPlanet);
        
        // Apply mission results
        this.applyMissionResults(selectedTeam, missionResult);
        
        // Close mission modal and show results
        this.closeMissionModal();
        this.showMissionResults(missionResult);
        
        // Update displays
        this.updateAllDisplays();
        this.saveGame();
    }

    calculateMissionSuccess(team, planet) {
        let successChance = 50; // Base 50% chance
        
        // Team composition bonuses
        const specializations = team.map(d => d.specialization);
        const avgHealth = team.reduce((sum, d) => sum + d.health, 0) / team.length;
        const avgMorale = team.reduce((sum, d) => sum + d.morale, 0) / team.length;
        
        // Specialization matching
        if (planet.difficulty === 'Easy' && specializations.includes('Infiltration')) successChance += 20;
        if (planet.difficulty === 'Medium' && specializations.includes('Bureaucracy')) successChance += 15;
        if (planet.difficulty === 'Hard' && specializations.includes('Combat')) successChance += 25;
        
        // Team condition
        successChance += (avgHealth - 50) * 0.3;
        successChance += (avgMorale - 50) * 0.2;
        
        // Equipment bonuses
        team.forEach(daemon => {
            if (daemon.equipment) {
                const equipment = this.gameState.equipment.find(e => e.id === daemon.equipment);
                if (equipment && equipment.durability > 0) {
                    successChance += 10;
                }
            }
        });

        // Room bonuses
        const commandCenter = this.gameState.rooms.find(r => r.name === 'Command Center');
        if (commandCenter && commandCenter.level > 0) {
            successChance += commandCenter.level * 5;
        }

        // Difficulty penalties
        const difficultyPenalties = { Easy: 0, Medium: -15, Hard: -30 };
        successChance += difficultyPenalties[planet.difficulty] || 0;

        // Cap success chance
        successChance = Math.max(10, Math.min(90, successChance));
        
        const success = Math.random() * 100 < successChance;
        
        return {
            success,
            successChance: Math.round(successChance),
            casualties: this.calculateCasualties(team, planet, success),
            rewards: this.calculateRewards(planet, success),
            narrative: this.generateMissionNarrative(planet, success, team)
        };
    }

    calculateCasualties(team, planet, success) {
        const casualties = [];
        
        team.forEach(daemon => {
            let survivalChance = 85;
            
            if (!success) survivalChance -= 30;
            if (planet.difficulty === 'Hard') survivalChance -= 20;
            if (daemon.health < 50) survivalChance -= 15;
            if (daemon.morale < 40) survivalChance -= 10;
            
            // Equipment protection
            if (daemon.equipment) {
                const equipment = this.gameState.equipment.find(e => e.id === daemon.equipment);
                if (equipment && equipment.durability > 50) {
                    survivalChance += 15;
                }
            }
            
            const healthLoss = Math.floor(Math.random() * 30) + 10;
            const moraleLoss = Math.floor(Math.random() * 20) + 5;
            const lifespanLoss = Math.floor(Math.random() * 3) + 1;
            
            casualties.push({
                daemonId: daemon.id,
                survived: Math.random() * 100 < survivalChance,
                healthLoss,
                moraleLoss,
                lifespanLoss
            });
        });
        
        return casualties;
    }

    calculateRewards(planet, success) {
        const baseRewards = {
            Easy: { credits: 150, soulEssence: 2 },
            Medium: { credits: 300, bureaucraticLeverage: 5 },
            Hard: { credits: 500, rawMaterials: 3 }
        };
        
        const rewards = baseRewards[planet.difficulty] || baseRewards.Easy;
        
        if (!success) {
            rewards.credits = Math.floor(rewards.credits * 0.3);
            Object.keys(rewards).forEach(key => {
                if (key !== 'credits') {
                    rewards[key] = Math.floor((rewards[key] || 0) * 0.2);
                }
            });
        }
        
        return rewards;
    }

    generateMissionNarrative(planet, success, team) {
        const teamSize = team.length;
        const specializations = team.map(d => d.specialization).join(', ');
        
        if (success) {
            return `Mission accomplished! Your ${teamSize}-daemon team (${specializations}) successfully neutralized ${planet.resistance} on ${planet.name}. Corporate efficiency metrics show marked improvement.`;
        } else {
            return `Mission failed. Despite best corporate practices, your team encountered unexpected resistance from ${planet.resistance}. Recommend process improvement and additional training.`;
        }
    }

    applyMissionResults(team, result) {
        // Apply casualties
        result.casualties.forEach(casualty => {
            const daemon = this.gameState.daemons.find(d => d.id === casualty.daemonId);
            if (daemon) {
                if (casualty.survived) {
                    daemon.health = Math.max(0, daemon.health - casualty.healthLoss);
                    daemon.morale = Math.max(0, daemon.morale - casualty.moraleLoss);
                    daemon.lifespanDays = Math.max(0, daemon.lifespanDays - casualty.lifespanLoss);
                    
                    if (daemon.lifespanDays <= 0) {
                        this.processDaemonDeath(daemon);
                    }
                } else {
                    this.processDaemonDeath(daemon);
                }
            }
        });

        // Degrade equipment
        team.forEach(daemon => {
            if (daemon.equipment) {
                const equipment = this.gameState.equipment.find(e => e.id === daemon.equipment);
                if (equipment) {
                    equipment.durability = Math.max(0, equipment.durability - (Math.floor(Math.random() * 10) + 5));
                }
            }
        });

        // Add rewards
        if (result.rewards.credits) this.addResources(result.rewards.credits);
        if (result.rewards.soulEssence) this.addResources(0, result.rewards.soulEssence);
        if (result.rewards.bureaucraticLeverage) this.addResources(0, 0, result.rewards.bureaucraticLeverage);
        if (result.rewards.rawMaterials) this.addResources(0, 0, 0, result.rewards.rawMaterials);

        // Mark planet as conquered if successful
        if (result.success && !this.currentPlanet.conquered) {
            this.currentPlanet.conquered = true;
        }
    }

    processDaemonDeath(daemon) {
        // Mark as inactive
        daemon.isActive = false;
        daemon.lifespanDays = 0;
        
        // Show memorial
        this.showMemorial(daemon);
        
        // Legacy effects - equipment inheritance chance
        if (daemon.equipment && Math.random() < 0.3) {
            const equipment = this.gameState.equipment.find(e => e.id === daemon.equipment);
            if (equipment) {
                equipment.durability = Math.min(100, equipment.durability + 20); // Restore some durability
                equipment.assignedTo = null;
            }
        }
    }

    showMemorial(daemon) {
        const modal = document.getElementById('memorial-modal');
        const content = document.getElementById('memorial-content');
        
        if (!modal || !content) return;
        
        const achievements = [
            `Completed ${Math.floor(Math.random() * 5) + 1} successful missions`,
            `Maintained ${daemon.morale > 70 ? 'excellent' : daemon.morale > 40 ? 'adequate' : 'poor'} workplace morale`,
            `Specialized in ${daemon.specialization} operations`,
            `Known for: ${daemon.quirks.join(', ')}`
        ];
        
        content.innerHTML = `
            <div class="memorial-content">
                <div class="memorial-daemon">${daemon.name}</div>
                <p><em>"A dedicated servant of the Corporate Hierarchy"</em></p>
                
                <div class="memorial-achievements">
                    <h4>Service Record:</h4>
                    ${achievements.map(achievement => `<div class="achievement">• ${achievement}</div>`).join('')}
                </div>
                
                <div class="inheritance-item">
                    <strong>Corporate Legacy:</strong> Their dedication to bureaucratic excellence will be remembered in the employee handbook.
                </div>
            </div>
        `;
        
        modal.classList.remove('hidden');
    }

    closeMemorial() {
        const modal = document.getElementById('memorial-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    closeMissionModal() {
        const modal = document.getElementById('mission-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
        this.selectedDaemons.clear();
        this.currentPlanet = null;
    }

    showMissionResults(result) {
        const modal = document.getElementById('mission-results');
        const content = document.getElementById('mission-outcome');
        
        if (!modal || !content) return;
        
        content.innerHTML = `
            <div class="status ${result.success ? 'status--success' : 'status--error'}">
                ${result.success ? 'MISSION SUCCESSFUL' : 'MISSION FAILED'}
            </div>
            
            <p>${result.narrative}</p>
            
            <div class="mission-details">
                <h4>Mission Summary:</h4>
                <p><strong>Success Probability:</strong> ${result.successChance}%</p>
                <p><strong>Casualties:</strong> ${result.casualties.filter(c => !c.survived).length}/${result.casualties.length} operatives</p>
                
                <h4>Resource Acquisition:</h4>
                ${Object.entries(result.rewards).map(([key, value]) => 
                    value > 0 ? `<p>+${value} ${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</p>` : ''
                ).join('')}
            </div>
        `;
        
        modal.classList.remove('hidden');
    }

    closeMissionResults() {
        const modal = document.getElementById('mission-results');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    // Apartment Management
    updateApartmentDisplay() {
        const roomList = document.getElementById('room-list');
        if (!roomList) return;
        
        roomList.innerHTML = this.gameState.rooms.map(room => `
            <div class="room-card">
                <div class="room-header">
                    <h3>${room.name}</h3>
                    <span class="room-level">Level ${room.level}</span>
                </div>
                
                <div class="room-bonus">
                    <strong>Bonus:</strong> ${room.bonus}
                </div>
                
                <div class="room-actions">
                    <button class="btn btn--primary btn--sm" 
                            onclick="game.upgradeRoom('${room.id}')"
                            ${!this.canAfford(room.upgrade_cost) ? 'disabled' : ''}>
                        Upgrade (${room.upgrade_cost} Credits)
                    </button>
                </div>
            </div>
        `).join('');
    }

    upgradeRoom(roomId) {
        const room = this.gameState.rooms.find(r => r.id === roomId);
        if (!room) return;

        if (this.spendCredits(room.upgrade_cost)) {
            room.level += 1;
            room.upgrade_cost = Math.floor(room.upgrade_cost * 1.5); // Increase cost
            
            // Update bonus description
            const bonusMultiplier = room.level;
            room.bonus = room.bonus.replace(/\d+/, (match) => {
                const baseValue = parseInt(match);
                return Math.floor(baseValue * bonusMultiplier);
            });
            
            this.updateApartmentDisplay();
            this.saveGame();
            
            this.showNotification(`${room.name} upgraded to level ${room.level}!`, 'success');
        } else {
            this.showNotification('Insufficient credits for room upgrade!', 'error');
        }
    }

    // Equipment Management
    updateEquipmentDisplay() {
        const equipmentList = document.getElementById('equipment-list');
        if (!equipmentList) return;
        
        equipmentList.innerHTML = this.gameState.equipment.map(equipment => `
            <div class="equipment-card">
                <div class="equipment-header">
                    <h4>${equipment.name}</h4>
                    <span class="equipment-type">${equipment.type}</span>
                </div>
                
                <div class="equipment-ability">
                    <strong>Ability:</strong> ${equipment.ability}
                </div>
                
                <div class="durability-bar">
                    <span class="stat-label">Durability: ${equipment.durability}%</span>
                    <div class="progress-bar">
                        <div class="progress-fill ${equipment.durability > 70 ? 'durability-high' : equipment.durability > 30 ? 'durability-medium' : 'durability-low'}" 
                             style="width: ${equipment.durability}%"></div>
                    </div>
                </div>
                
                <div class="equipment-actions">
                    <button class="btn btn--secondary btn--sm" 
                            onclick="game.repairEquipment('${equipment.id}')"
                            ${equipment.durability >= 90 ? 'disabled' : ''}>
                        Repair (${Math.floor((100 - equipment.durability) * 2)} Credits)
                    </button>
                    ${equipment.assignedTo ? 
                        `<button class="btn btn--outline btn--sm" onclick="game.unassignEquipment('${equipment.id}')">Unassign</button>` :
                        `<button class="btn btn--primary btn--sm" onclick="game.showEquipmentAssignment('${equipment.id}')">Assign</button>`
                    }
                </div>
                
                ${equipment.assignedTo ? `<p class="equipment-assigned">Assigned to: ${this.getDaemonName(equipment.assignedTo)}</p>` : ''}
            </div>
        `).join('');
    }

    getDaemonName(daemonId) {
        const daemon = this.gameState.daemons.find(d => d.id === daemonId);
        return daemon ? daemon.name : 'Unknown';
    }

    repairEquipment(equipmentId) {
        const equipment = this.gameState.equipment.find(e => e.id === equipmentId);
        if (!equipment) return;

        const repairCost = Math.floor((100 - equipment.durability) * 2);
        const forgeRoom = this.gameState.rooms.find(r => r.name === 'Item Forge');
        const discount = forgeRoom && forgeRoom.level > 0 ? 0.8 : 1.0;
        const finalCost = Math.floor(repairCost * discount);

        if (this.spendCredits(finalCost)) {
            equipment.durability = Math.min(100, equipment.durability + 50);
            this.updateEquipmentDisplay();
            this.saveGame();
            
            this.showNotification(`${equipment.name} repaired!`, 'success');
        } else {
            this.showNotification('Insufficient credits for repair!', 'error');
        }
    }

    craftItem(itemType) {
        const recipes = {
            briefcase: { cost: 100, materials: 0, name: 'Standard Issue Briefcase', type: 'Infiltration', ability: 'Blend In (+15 stealth)' },
            tie: { cost: 75, materials: 0, name: 'Corporate Tie of Binding', type: 'Combat', ability: 'Intimidate (+10 combat)' },
            calculator: { cost: 125, materials: 1, name: 'Cursed Calculator', type: 'Sabotage', ability: 'Data Corruption (+20 sabotage)' }
        };

        const recipe = recipes[itemType];
        if (!recipe) return;

        const canAffordCredits = this.canAfford(recipe.cost);
        const hasEnoughMaterials = this.gameState.resources.rawMaterials >= recipe.materials;

        if (canAffordCredits && hasEnoughMaterials) {
            this.spendCredits(recipe.cost);
            this.gameState.resources.rawMaterials -= recipe.materials;
            
            const newEquipment = {
                id: this.generateId(),
                name: recipe.name,
                type: recipe.type,
                durability: 100,
                ability: recipe.ability,
                assignedTo: null
            };

            this.gameState.equipment.push(newEquipment);
            this.updateEquipmentDisplay();
            this.updateResourceDisplay();
            this.saveGame();
            
            this.showNotification(`${recipe.name} crafted successfully!`, 'success');
        } else {
            this.showNotification('Insufficient resources for crafting!', 'error');
        }
    }

    // Corporate Events
    triggerRandomEvent() {
        const events = [
            {
                name: "Performance Review",
                description: "All daemons must attend mandatory performance evaluation",
                effect: () => {
                    this.gameState.daemons.forEach(daemon => {
                        if (daemon.isActive) daemon.lifespanDays = Math.max(0, daemon.lifespanDays - 1);
                    });
                    this.addResources(50);
                }
            },
            {
                name: "Team Building Exercise",
                description: "Corporate mandated trust falls and trust exercises",
                effect: () => {
                    this.gameState.daemons.forEach(daemon => {
                        if (daemon.isActive) daemon.morale = Math.min(100, daemon.morale + 10);
                    });
                    this.spendCredits(100);
                }
            },
            {
                name: "Budget Cuts",
                description: "The Directorate is tightening its belt",
                effect: () => {
                    // Temporarily increase room upgrade costs (handled in upgrade function)
                    this.showNotification('All upgrades now cost 50% more for the next 3 missions!', 'warning');
                }
            },
            {
                name: "Equipment Audit",
                description: "Corporate needs to verify all equipment is properly maintained",
                effect: () => {
                    this.gameState.equipment.forEach(equipment => {
                        equipment.durability = Math.max(0, equipment.durability - 10);
                    });
                    this.addResources(0, 0, 2);
                }
            }
        ];

        const randomEvent = events[Math.floor(Math.random() * events.length)];
        randomEvent.effect();
        
        this.gameState.corporateEvents.push({
            ...randomEvent,
            timestamp: Date.now()
        });

        this.updateCorporateEvents();
        this.updateAllDisplays();
        this.saveGame();
        
        this.showNotification(`Corporate Event: ${randomEvent.name}`, 'info');
    }

    // Daily Updates
    processDailyUpdate() {
        if (!this.gameState.gameStarted) return;

        this.gameState.daysPassed += 1;
        
        // Age all daemons
        this.gameState.daemons.forEach(daemon => {
            if (daemon.isActive) {
                daemon.lifespanDays = Math.max(0, daemon.lifespanDays - 1);
                
                // Check for natural death
                if (daemon.lifespanDays <= 0) {
                    this.processDaemonDeath(daemon);
                }
                
                // Room bonuses
                const livingQuarters = this.gameState.rooms.find(r => r.name === 'Living Quarters');
                if (livingQuarters && livingQuarters.level > 0) {
                    daemon.morale = Math.min(100, daemon.morale + (livingQuarters.level * 5));
                }
                
                const recoveryWard = this.gameState.rooms.find(r => r.name === 'Recovery Ward');
                if (recoveryWard && recoveryWard.level > 0 && daemon.health < 100) {
                    daemon.health = Math.min(100, daemon.health + (recoveryWard.level * 15));
                }
            }
        });

        // Random corporate events (5% chance per day)
        if (Math.random() < 0.05) {
            this.triggerRandomEvent();
        }

        this.updateAllDisplays();
        this.saveGame();
    }

    // Utility Functions
    updateAllDisplays() {
        this.updateResourceDisplay();
        this.updateDashboard();
        
        // Update current tab display based on which tab is currently active
        const activeTab = document.querySelector('.tab-btn.active');
        if (activeTab) {
            const tabName = activeTab.getAttribute('data-tab');
            if (tabName && tabName !== 'dashboard') {
                // Don't call showTab to avoid recursion, just update the content
                switch(tabName) {
                    case 'team':
                        this.updateTeamDisplay();
                        break;
                    case 'missions':
                        this.updateMissionsDisplay();
                        break;
                    case 'apartment':
                        this.updateApartmentDisplay();
                        break;
                    case 'equipment':
                        this.updateEquipmentDisplay();
                        break;
                }
            }
        }
    }

    showNotification(message, type = 'info') {
        // Create a simple notification system
        const notification = document.createElement('div');
        notification.className = `notification status status--${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1001;
            min-width: 300px;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Save/Load System
    saveGame() {
        try {
            localStorage.setItem('daemonDirectorate', JSON.stringify(this.gameState));
        } catch (e) {
            console.error('Failed to save game:', e);
        }
    }

    loadGame() {
        try {
            const saved = localStorage.getItem('daemonDirectorate');
            if (saved) {
                this.gameState = JSON.parse(saved);
                return true;
            }
        } catch (e) {
            console.error('Failed to load game:', e);
        }
        return false;
    }

    resetGame() {
        if (confirm('Are you sure you want to start a new corporate restructure? All progress will be lost.')) {
            localStorage.removeItem('daemonDirectorate');
            location.reload();
        }
    }

    // Additional placeholder methods for buttons that don't have full functionality yet
    assignEquipment(daemonId) {
        this.showNotification('Equipment assignment system coming soon!', 'info');
    }

    viewDaemonDetails(daemonId) {
        const daemon = this.gameState.daemons.find(d => d.id === daemonId);
        if (daemon) {
            this.showNotification(`${daemon.name} details: ${daemon.specialization} specialist with ${daemon.lifespanDays} days remaining.`, 'info');
        }
    }

    unassignEquipment(equipmentId) {
        this.showNotification('Equipment unassignment coming soon!', 'info');
    }

    showEquipmentAssignment(equipmentId) {
        this.showNotification('Equipment assignment coming soon!', 'info');
    }
}

// Global game instance
let game;

// Global functions for HTML onclick handlers that still need them
window.game = null;

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    try {
        game = new DaemonDirectorate();
        window.game = game; // Make accessible globally for onclick handlers
        
        // Add CSS for notifications
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            .notification {
                box-shadow: var(--shadow-lg);
                border-radius: var(--radius-base);
            }
        `;
        document.head.appendChild(style);
        
        console.log('Daemon Directorate initialized successfully');
    } catch (error) {
        console.error('Failed to initialize game:', error);
    }
});