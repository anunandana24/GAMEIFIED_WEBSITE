/**
 * PyQuest Campus Game Engines
 * Implements interactive mini-games for all Python concepts.
 */

class CampusGameEngine {
    constructor() {
        this.level = window.CURRENT_LEVEL || {};
        this.container = document.getElementById("gameWorkspace");
        this.gameState = {};
    }

    init() {
        if (!this.container || !this.level.game_type) return;

        // Check if level was previously unlocked
        const profile = getStudentProfile();
        const isUnlocked = (profile.unlocked_vaults || []).includes(this.level.id);

        if (isUnlocked) {
            this.unlockVaultUI(false);
        }

        switch (this.level.game_type) {
            case "type_sorter":
                this.renderTypeSorter();
                break;
            case "memory_pointer":
                this.renderMemoryPointer();
                break;
            case "queue_slicer":
                this.renderQueueSlicer();
                break;
            case "tuple_vault":
                this.renderTupleVault();
                break;
            case "venn_matcher":
                this.renderVennMatcher();
                break;
            case "canteen_hash":
                this.renderCanteenHash();
                break;
            case "barista_pipeline":
                this.renderBaristaPipeline();
                break;
            case "robot_factory":
                this.renderRobotFactory();
                break;
            case "vault_security":
                this.renderVaultSecurity();
                break;
            case "hierarchy_tree":
                this.renderHierarchyTree();
                break;
            case "talent_mixer":
                this.renderTalentMixer();
                break;
            case "iot_blueprint":
                this.renderIoTBlueprint();
                break;
            case "exam_shield":
                this.renderExamShield();
                break;
            case "registrar_archive":
                this.renderRegistrarArchive();
                break;
            case "placement_stream":
                this.renderPlacementStream();
                break;
            case "sqlite_console":
                this.renderSqliteConsole();
                break;
            case "wifi_regex":
                this.renderWifiRegex();
                break;
            case "ticket_concurrency":
                this.renderTicketConcurrency();
                break;
            case "state_serializer":
                this.renderStateSerializer();
                break;
            case "iterator_conveyor":
                this.renderIteratorConveyor();
                break;
            case "generator_stream":
                this.renderGeneratorStream();
                break;
            case "gatekeeper_decorator":
                this.renderGatekeeperDecorator();
                break;
            default:
                this.renderGenericFallback();
                break;
        }
    }

    // =========================================================================
    // 1. TYPE SORTER (Primitive Data Types)
    // =========================================================================
    renderTypeSorter() {
        const cfg = this.level.game_config || {};
        this.gameState = { placements: {} };

        let html = `
            <div class="sorter-game-container">
                <div class="sorter-pool-header">
                    <strong>📦 Admissions Data Packet:</strong> Click an item, then click its destination bucket to assign it:
                </div>
                <div class="sorter-items-pool" id="sorterItemsPool">
                    ${cfg.items.map(item => `
                        <div class="sorter-chip" id="chip-${item.id}" data-item-id="${item.id}" data-target="${item.target}" onclick="gameEngine.handleChipSelect('${item.id}')">
                            ${item.label}
                        </div>
                    `).join("")}
                </div>
                <div class="sorter-buckets-grid">
                    ${cfg.buckets.map(b => `
                        <div class="sorter-bucket" id="bucket-${b}" onclick="gameEngine.handleBucketDrop('${b}')">
                            <div class="bucket-title">&lt;class '${b}'&gt;</div>
                            <div class="bucket-items" id="bucket-items-${b}"></div>
                        </div>
                    `).join("")}
                </div>
            </div>
        `;
        this.container.innerHTML = html;
        this.selectedChip = null;
    }

    handleChipSelect(itemId) {
        if (this.selectedChip) {
            const prev = document.getElementById(`chip-${this.selectedChip}`);
            if (prev) prev.style.borderColor = "var(--brand-cyan)";
        }
        this.selectedChip = itemId;
        const chip = document.getElementById(`chip-${itemId}`);
        if (chip) chip.style.borderColor = "var(--brand-amber)";
        if (window.soundFX) soundFX.playCoin();
    }

    handleBucketDrop(bucketName) {
        if (!this.selectedChip) return;
        const chip = document.getElementById(`chip-${this.selectedChip}`);
        const targetBucket = document.getElementById(`bucket-items-${bucketName}`);
        if (chip && targetBucket) {
            targetBucket.appendChild(chip);
            this.gameState.placements[this.selectedChip] = bucketName;
            chip.style.borderColor = "var(--brand-cyan)";
            this.selectedChip = null;
            if (window.soundFX) soundFX.playCoin();
        }
    }

    verifyTypeSorter() {
        const cfg = this.level.game_config || {};
        const items = cfg.items || [];
        let correctCount = 0;

        items.forEach(item => {
            if (this.gameState.placements[item.id] === item.target) {
                correctCount++;
            }
        });

        if (correctCount === items.length) {
            return { success: true, message: "Perfect classification! All student data packets assigned to their native primitive types." };
        } else {
            return { success: false, message: `Classified ${correctCount} of ${items.length} correctly. Review and try again!` };
        }
    }

    // =========================================================================
    // 2. MEMORY POINTER (Non-Primitive Types)
    // =========================================================================
    renderMemoryPointer() {
        const cfg = this.level.game_config || {};
        this.gameState = { answers: {} };

        let html = `
            <div class="memory-scenarios-wrap">
                <p class="section-subtitle">Predict the memory mutation effect for each scenario below:</p>
                ${cfg.scenarios.map((s, idx) => `
                    <div class="mem-scenario-card">
                        <div class="mem-code-box"><pre><code>${s.code}</code></pre></div>
                        <div class="mem-question-text"><strong>Q${idx+1}:</strong> ${s.question}</div>
                        <div class="mem-options-row">
                            ${s.options.map((opt, optIdx) => `
                                <button class="mem-opt-btn" id="mem-btn-${s.id}-${optIdx}" onclick="gameEngine.selectMemAnswer('${s.id}', ${optIdx})">
                                    ${opt}
                                </button>
                            `).join("")}
                        </div>
                    </div>
                `).join("")}
            </div>
        `;
        this.container.innerHTML = html;
    }

    selectMemAnswer(scenarioId, optIdx) {
        this.gameState.answers[scenarioId] = optIdx;
        const btns = document.querySelectorAll(`[id^="mem-btn-${scenarioId}-"]`);
        btns.forEach(b => b.classList.remove("selected"));
        const chosen = document.getElementById(`mem-btn-${scenarioId}-${optIdx}`);
        if (chosen) chosen.classList.add("selected");
        if (window.soundFX) soundFX.playCoin();
    }

    verifyMemoryPointer() {
        const cfg = this.level.game_config || {};
        let allCorrect = true;
        cfg.scenarios.forEach(s => {
            if (this.gameState.answers[s.id] !== s.correct) {
                allCorrect = false;
            }
        });

        if (allCorrect) {
            return { success: true, message: "Memory references decoded! You mastered mutable references vs independent clones." };
        }
        return { success: false, message: "One or more memory predictions are incorrect. Review list pointers vs deep copies!" };
    }

    // =========================================================================
    // 3. QUEUE SLICER (Lists & Slicing)
    // =========================================================================
    renderQueueSlicer() {
        const cfg = this.level.game_config || {};
        this.gameState = { inputs: {} };

        let html = `
            <div>
                <p class="section-subtitle">Hostel Roommate Chore Lineup:</p>
                <div class="queue-visual-track">
                    ${cfg.queue.map((student, idx) => `
                        <div class="queue-student-node">
                            <span class="node-index">[${idx}]</span>
                            <span class="node-name">${student}</span>
                            <span class="node-index">[-${cfg.queue.length - idx}]</span>
                        </div>
                    `).join("")}
                </div>
                <div class="slice-targets-grid">
                    ${cfg.targets.map((t, idx) => `
                        <div class="slice-target-card">
                            <div class="slice-target-header">${t.slice}</div>
                            <p style="font-size:0.85rem; color:var(--text-secondary);">${t.label}</p>
                            <input type="text" class="slice-input-box" id="slice-input-${idx}" placeholder="Enter resulting names separated by commas (e.g. Alex, Bella)">
                        </div>
                    `).join("")}
                </div>
            </div>
        `;
        this.container.innerHTML = html;
    }

    verifyQueueSlicer() {
        const cfg = this.level.game_config || {};
        let allCorrect = true;

        cfg.targets.forEach((t, idx) => {
            const inputVal = (document.getElementById(`slice-input-${idx}`).value || "")
                .split(",")
                .map(s => s.trim().toLowerCase())
                .filter(Boolean);
            const targetNorm = t.target.map(s => s.toLowerCase());

            if (JSON.stringify(inputVal) !== JSON.stringify(targetNorm)) {
                allCorrect = false;
            }
        });

        if (allCorrect) {
            return { success: true, message: "Flawless list slicing! You mastered [start : stop : step] notation." };
        }
        return { success: false, message: "Some sliced outputs did not match the expected lineup. Try again!" };
    }

    // =========================================================================
    // 4. TUPLE VAULT (Tuples & Immutability)
    // =========================================================================
    renderTupleVault() {
        this.gameState = { unpacked: false, mutationAnswered: false };
        let html = `
            <div style="display:flex; flex-direction:column; gap:20px;">
                <div class="mem-scenario-card">
                    <p><strong>Step 1: Tuple Unpacking</strong></p>
                    <div class="mem-code-box">transcript = ('CS2026', 'Meera Nair', 9.8, 'First Class')</div>
                    <p style="font-size:0.9rem;">Type the left-hand unpack statement to capture all 4 elements in one line:</p>
                    <input type="text" id="tupleUnpackInput" class="slice-input-box" placeholder="e.g. roll, name, cgpa, division = transcript">
                </div>
                <div class="mem-scenario-card">
                    <p><strong>Step 2: Immutability Defense</strong></p>
                    <p style="font-size:0.9rem;">What happens if someone runs <code>transcript[2] = 10.0</code>?</p>
                    <div class="mem-options-row">
                        <button class="mem-opt-btn" id="t-opt-1" onclick="gameEngine.selectTupleOpt(1)">Updates GPA to 10.0</button>
                        <button class="mem-opt-btn" id="t-opt-2" onclick="gameEngine.selectTupleOpt(2)">Raises TypeError: 'tuple' object does not support item assignment</button>
                    </div>
                </div>
            </div>
        `;
        this.container.innerHTML = html;
    }

    selectTupleOpt(opt) {
        this.gameState.mutationOption = opt;
        document.getElementById("t-opt-1").classList.toggle("selected", opt === 1);
        document.getElementById("t-opt-2").classList.toggle("selected", opt === 2);
        if (window.soundFX) soundFX.playCoin();
    }

    verifyTupleVault() {
        const unpackVal = (document.getElementById("tupleUnpackInput").value || "").replace(/\s+/g, "");
        const validUnpack = unpackVal.includes("=") && unpackVal.split("=")[0].split(",").length >= 4;
        const validMutation = this.gameState.mutationOption === 2;

        if (validUnpack && validMutation) {
            return { success: true, message: "Tuple vault validated! Immutability guarantees verified." };
        }
        return { success: false, message: "Ensure you provided 4 unpack variables and identified the correct TypeError." };
    }

    // =========================================================================
    // 5. VENN MATCHER (Sets & Operations)
    // =========================================================================
    renderVennMatcher() {
        const cfg = this.level.game_config || {};
        this.gameState = { answers: {} };

        let html = `
            <div>
                <div class="venn-container">
                    <div class="club-card">
                        <div class="club-title">💻 Coding Club Set (A)</div>
                        <div class="club-members-pills">
                            ${cfg.coding_club.map(m => `<span class="member-pill">${m}</span>`).join("")}
                        </div>
                    </div>
                    <div class="club-card">
                        <div class="club-title">🤖 Robotics Club Set (B)</div>
                        <div class="club-members-pills">
                            ${cfg.robotics_club.map(m => `<span class="member-pill">${m}</span>`).join("")}
                        </div>
                    </div>
                </div>

                <div class="venn-questions-list">
                    ${cfg.questions.map((q, idx) => `
                        <div class="venn-q-row">
                            <span class="venn-q-label"><strong>${q.op}:</strong> ${q.label}</span>
                            <input type="text" class="slice-input-box" id="venn-ans-${idx}" style="max-width:300px;" placeholder="Names separated by comma (e.g. Sneha, Vikram)">
                        </div>
                    `).join("")}
                </div>
            </div>
        `;
        this.container.innerHTML = html;
    }

    verifyVennMatcher() {
        const cfg = this.level.game_config || {};
        let allPassed = true;

        cfg.questions.forEach((q, idx) => {
            const userAns = (document.getElementById(`venn-ans-${idx}`).value || "")
                .split(",")
                .map(s => s.trim().toLowerCase())
                .filter(Boolean)
                .sort();
            const expAns = q.answer.map(s => s.toLowerCase()).sort();

            if (JSON.stringify(userAns) !== JSON.stringify(expAns)) {
                allPassed = false;
            }
        });

        if (allPassed) {
            return { success: true, message: "Venn Set operations mastered! Union, Intersection, and Differences confirmed." };
        }
        return { success: false, message: "One or more set outputs are incorrect. Check for typos and missing names." };
    }

    // =========================================================================
    // 6. CANTEEN HASH (Dictionaries)
    // =========================================================================
    renderCanteenHash() {
        const cfg = this.level.game_config || {};
        let html = `
            <div>
                <div class="mem-scenario-card" style="margin-bottom:16px;">
                    <div class="club-title">☕ Canteen Menu Hash Table:</div>
                    <pre class="mem-code-box"><code>${JSON.stringify(cfg.menu, null, 2)}</code></pre>
                </div>
                <div class="slice-targets-grid">
                    <div class="slice-target-card">
                        <div class="slice-target-header">Order 1: Samosa, Cold Coffee, Samosa</div>
                        <p style="font-size:0.85rem; color:var(--text-secondary);">Calculate total bill using dictionary lookup:</p>
                        <input type="number" id="canteenOrder1" class="slice-input-box" placeholder="Enter total bill (₹)">
                    </div>
                    <div class="slice-target-card">
                        <div class="slice-target-header">Order 2: Masala Dosa, Veg Puff, Brownie</div>
                        <p style="font-size:0.85rem; color:var(--text-secondary);">Brownie is not on menu! Use <code>menu.get('Brownie', 0)</code>:</p>
                        <input type="number" id="canteenOrder2" class="slice-input-box" placeholder="Enter total bill (₹)">
                    </div>
                </div>
            </div>
        `;
        this.container.innerHTML = html;
    }

    verifyCanteenHash() {
        const o1 = parseInt(document.getElementById("canteenOrder1").value, 10);
        const o2 = parseInt(document.getElementById("canteenOrder2").value, 10);

        if (o1 === 70 && o2 === 75) {
            return { success: true, message: "Dictionary lookups and safe .get() defaults mastered!" };
        }
        return { success: false, message: "Bills calculated incorrectly. Order 1 is 15+40+15=70, Order 2 is 50+25+0=75." };
    }

    // =========================================================================
    // 7. BARISTA PIPELINE (Functions & Scope)
    // =========================================================================
    renderBaristaPipeline() {
        let html = `
            <div class="mem-scenario-card">
                <p><strong>Campus Cafe Automated Coffee Machine:</strong> Assemble the Python parameter order.</p>
                <div class="mem-code-box"># Target: Accept customer name, base coffee type, extra toppings, and custom requests</div>
                <div style="display:flex; flex-direction:column; gap:10px; margin-top:14px;">
                    <button class="mem-opt-btn" id="b-opt-0" onclick="gameEngine.selectBaristaOpt(0)">def brew(customer, base='Espresso', *toppings, **customs):</button>
                    <button class="mem-opt-btn" id="b-opt-1" onclick="gameEngine.selectBaristaOpt(1)">def brew(*toppings, customer, **customs, base='Espresso'):</button>
                    <button class="mem-opt-btn" id="b-opt-2" onclick="gameEngine.selectBaristaOpt(2)">def brew(**customs, *toppings, customer):</button>
                </div>
            </div>
        `;
        this.container.innerHTML = html;
    }

    selectBaristaOpt(idx) {
        this.gameState.baristaChoice = idx;
        for (let i = 0; i < 3; i++) {
            document.getElementById(`b-opt-${i}`).classList.toggle("selected", i === idx);
        }
        if (window.soundFX) soundFX.playCoin();
    }

    verifyBaristaPipeline() {
        if (this.gameState.baristaChoice === 0) {
            return { success: true, message: "Function signature correctly ordered: positional -> defaults -> *args -> **kwargs!" };
        }
        return { success: false, message: "Incorrect order! Positional parameters must precede *args, which must precede **kwargs." };
    }

    // =========================================================================
    // 8. ROBOT FACTORY (Classes & Objects)
    // =========================================================================
    renderRobotFactory() {
        let html = `
            <div class="mem-scenario-card">
                <p><strong>Student Companion Robot Blueprint:</strong></p>
                <div class="mem-code-box">class StudentBot:\n    def __init__(self, name):\n        self.name = name\n        self.battery = 100\n\n    def study(self, hours):\n        self.battery -= hours * 10\n        return f"{self.name} studied for {hours}h!"</div>
                <p style="font-size:0.9rem; margin:10px 0;">If <code>bot = StudentBot('PyBot')</code> runs <code>bot.study(4)</code>, what is <code>bot.battery</code>?</p>
                <input type="number" id="robotBatteryInput" class="slice-input-box" style="max-width:200px;" placeholder="Battery %">
            </div>
        `;
        this.container.innerHTML = html;
    }

    verifyRobotFactory() {
        const val = parseInt(document.getElementById("robotBatteryInput").value, 10);
        if (val === 60) {
            return { success: true, message: "Object instance state tracked successfully! (100 - 40 = 60)" };
        }
        return { success: false, message: "Incorrect battery calculation. Initial 100 - (4 * 10) = 60." };
    }

    // =========================================================================
    // 9. VAULT SECURITY (Encapsulation)
    // =========================================================================
    renderVaultSecurity() {
        let html = `
            <div class="mem-scenario-card">
                <p><strong>Scholarship Fund Vault:</strong> Which property setter validates that balance cannot become negative?</p>
                <div style="display:flex; flex-direction:column; gap:10px; margin-top:14px;">
                    <button class="mem-opt-btn" id="v-opt-0" onclick="gameEngine.selectVaultOpt(0)">
                        @balance.setter<br>def balance(self, val): if val >= 0: self.__balance = val
                    </button>
                    <button class="mem-opt-btn" id="v-opt-1" onclick="gameEngine.selectVaultOpt(1)">
                        def set_balance(self, val): self.__balance = -val
                    </button>
                </div>
            </div>
        `;
        this.container.innerHTML = html;
    }

    selectVaultOpt(idx) {
        this.gameState.vaultChoice = idx;
        document.getElementById("v-opt-0").classList.toggle("selected", idx === 0);
        document.getElementById("v-opt-1").classList.toggle("selected", idx === 1);
        if (window.soundFX) soundFX.playCoin();
    }

    verifyVaultSecurity() {
        if (this.gameState.vaultChoice === 0) {
            return { success: true, message: "Pythonic @property setter encapsulation deployed!" };
        }
        return { success: false, message: "Select the @property.setter validation pattern." };
    }

    // =========================================================================
    // 10. HIERARCHY TREE (Inheritance)
    // =========================================================================
    renderHierarchyTree() {
        let html = `
            <div class="mem-scenario-card">
                <p><strong>Campus Hierarchy Tree:</strong> How does <code>Student(Person)</code> invoke its parent constructor?</p>
                <div style="display:flex; flex-direction:column; gap:10px; margin-top:14px;">
                    <button class="mem-opt-btn" id="h-opt-0" onclick="gameEngine.selectHierarchyOpt(0)">super().__init__(name, email)</button>
                    <button class="mem-opt-btn" id="h-opt-1" onclick="gameEngine.selectHierarchyOpt(1)">this.parent.init(name, email)</button>
                    <button class="mem-opt-btn" id="h-opt-2" onclick="gameEngine.selectHierarchyOpt(2)">Person = init(name, email)</button>
                </div>
            </div>
        `;
        this.container.innerHTML = html;
    }

    selectHierarchyOpt(idx) {
        this.gameState.hierarchyChoice = idx;
        for (let i = 0; i < 3; i++) {
            document.getElementById(`h-opt-${i}`).classList.toggle("selected", i === idx);
        }
        if (window.soundFX) soundFX.playCoin();
    }

    verifyHierarchyTree() {
        if (this.gameState.hierarchyChoice === 0) {
            return { success: true, message: "super().__init__() correctly delegates to parent class!" };
        }
        return { success: false, message: "Python uses `super()` to access parent class methods." };
    }

    // =========================================================================
    // 11. TALENT MIXER (Polymorphism)
    // =========================================================================
    renderTalentMixer() {
        let html = `
            <div class="mem-scenario-card">
                <p><strong>Campus Cultural Fest Stage Mixer (Duck Typing):</strong></p>
                <div class="mem-code-box">performers = [Guitarist(), Vocalist(), Dancer()]\nfor p in performers:\n    print(p.perform())</div>
                <p style="font-size:0.9rem;">Why does this execute cleanly without requiring a common Java/C++ interface?</p>
                <div style="display:flex; flex-direction:column; gap:10px; margin-top:14px;">
                    <button class="mem-opt-btn" id="poly-opt-0" onclick="gameEngine.selectPolyOpt(0)">Duck Typing: Python only cares that the object implements .perform()</button>
                    <button class="mem-opt-btn" id="poly-opt-1" onclick="gameEngine.selectPolyOpt(1)">Python converts all classes into strings automatically</button>
                </div>
            </div>
        `;
        this.container.innerHTML = html;
    }

    selectPolyOpt(idx) {
        this.gameState.polyChoice = idx;
        document.getElementById("poly-opt-0").classList.toggle("selected", idx === 0);
        document.getElementById("poly-opt-1").classList.toggle("selected", idx === 1);
        if (window.soundFX) soundFX.playCoin();
    }

    verifyTalentMixer() {
        if (this.gameState.polyChoice === 0) {
            return { success: true, message: "Duck typing confirmed: If it walks and quacks like a performer, it performs!" };
        }
        return { success: false, message: "Select Duck Typing." };
    }

    // =========================================================================
    // 12. IOT BLUEPRINT (Abstraction)
    // =========================================================================
    renderIoTBlueprint() {
        let html = `
            <div class="mem-scenario-card">
                <p><strong>Smart Classroom Sensor Contract:</strong></p>
                <div class="mem-code-box">from abc import ABC, abstractmethod\nclass SmartSensor(ABC):\n    @abstractmethod\n    def read(self): pass</div>
                <p style="font-size:0.9rem;">What happens if <code>TempSensor(SmartSensor)</code> forgets to define <code>read(self)</code>?</p>
                <div style="display:flex; flex-direction:column; gap:10px; margin-top:14px;">
                    <button class="mem-opt-btn" id="abs-opt-0" onclick="gameEngine.selectAbsOpt(0)">TypeError: Can't instantiate abstract class TempSensor with abstract method read</button>
                    <button class="mem-opt-btn" id="abs-opt-1" onclick="gameEngine.selectAbsOpt(1)">It automatically returns None</button>
                </div>
            </div>
        `;
        this.container.innerHTML = html;
    }

    selectAbsOpt(idx) {
        this.gameState.absChoice = idx;
        document.getElementById("abs-opt-0").classList.toggle("selected", idx === 0);
        document.getElementById("abs-opt-1").classList.toggle("selected", idx === 1);
        if (window.soundFX) soundFX.playCoin();
    }

    verifyIoTBlueprint() {
        if (this.gameState.absChoice === 0) {
            return { success: true, message: "Abstract contract enforcement verified!" };
        }
        return { success: false, message: "Python raises a TypeError if abstract methods are unimplemented." };
    }

    // =========================================================================
    // 13. EXAM SHIELD (Exception Handling)
    // =========================================================================
    renderExamShield() {
        let html = `
            <div class="mem-scenario-card">
                <p><strong>Exam Night Portal Shield:</strong> Match each crashing snippet to its handler:</p>
                <div style="display:flex; flex-direction:column; gap:12px; margin-top:14px;">
                    <div><code>100 / 0</code> -> <select id="ex-sel-1" class="venn-select-box"><option value="">-- Choose Exception --</option><option value="ZeroDivisionError">ZeroDivisionError</option><option value="KeyError">KeyError</option><option value="IndexError">IndexError</option></select></div>
                    <div><code>students['unregistered']</code> -> <select id="ex-sel-2" class="venn-select-box"><option value="">-- Choose Exception --</option><option value="ZeroDivisionError">ZeroDivisionError</option><option value="KeyError">KeyError</option><option value="IndexError">IndexError</option></select></div>
                    <div><code>queue[999]</code> -> <select id="ex-sel-3" class="venn-select-box"><option value="">-- Choose Exception --</option><option value="ZeroDivisionError">ZeroDivisionError</option><option value="KeyError">KeyError</option><option value="IndexError">IndexError</option></select></div>
                </div>
            </div>
        `;
        this.container.innerHTML = html;
    }

    verifyExamShield() {
        const s1 = document.getElementById("ex-sel-1").value;
        const s2 = document.getElementById("ex-sel-2").value;
        const s3 = document.getElementById("ex-sel-3").value;

        if (s1 === "ZeroDivisionError" && s2 === "KeyError" && s3 === "IndexError") {
            return { success: true, message: "All crash exceptions caught and mitigated by shield!" };
        }
        return { success: false, message: "Check your exception mappings." };
    }

    // =========================================================================
    // 14. REGISTRAR ARCHIVE (File Handling)
    // =========================================================================
    renderRegistrarArchive() {
        let html = `
            <div class="mem-scenario-card">
                <p><strong>Registrar's File Archives:</strong> Match each campus operation to its mode:</p>
                <div style="display:flex; flex-direction:column; gap:12px; margin-top:14px;">
                    <div>Add student to existing log without deleting old data -> <select id="file-mode-1" class="venn-select-box"><option value="">-- Mode --</option><option value="a">'a' (Append)</option><option value="w">'w' (Write)</option><option value="r">'r' (Read)</option><option value="rb">'rb' (Read Binary)</option></select></div>
                    <div>Read ID card photo JPEG file -> <select id="file-mode-2" class="venn-select-box"><option value="">-- Mode --</option><option value="a">'a' (Append)</option><option value="w">'w' (Write)</option><option value="r">'r' (Read)</option><option value="rb">'rb' (Read Binary)</option></select></div>
                </div>
            </div>
        `;
        this.container.innerHTML = html;
    }

    verifyRegistrarArchive() {
        const m1 = document.getElementById("file-mode-1").value;
        const m2 = document.getElementById("file-mode-2").value;

        if (m1 === "a" && m2 === "rb") {
            return { success: true, message: "File access modes validated!" };
        }
        return { success: false, message: "Use 'a' to append without truncating, and 'rb' for binary files." };
    }

    // =========================================================================
    // 15. PLACEMENT STREAM (Higher Order Functions)
    // =========================================================================
    renderPlacementStream() {
        let html = `
            <div class="mem-scenario-card">
                <p><strong>Placement Candidate Pipeline:</strong></p>
                <div class="mem-code-box">scores = [60, 75, 85, 90]\neligible = list(filter(lambda s: s >= 80, scores))</div>
                <p style="font-size:0.9rem;">What is the value of <code>eligible</code>?</p>
                <div class="mem-options-row">
                    <button class="mem-opt-btn" id="hof-opt-0" onclick="gameEngine.selectHofOpt(0)">[85, 90]</button>
                    <button class="mem-opt-btn" id="hof-opt-1" onclick="gameEngine.selectHofOpt(1)">[60, 75]</button>
                    <button class="mem-opt-btn" id="hof-opt-2" onclick="gameEngine.selectHofOpt(2)">[True, True]</button>
                </div>
            </div>
        `;
        this.container.innerHTML = html;
    }

    selectHofOpt(idx) {
        this.gameState.hofChoice = idx;
        for (let i = 0; i < 3; i++) {
            document.getElementById(`hof-opt-${i}`).classList.toggle("selected", i === idx);
        }
        if (window.soundFX) soundFX.playCoin();
    }

    verifyPlacementStream() {
        if (this.gameState.hofChoice === 0) {
            return { success: true, message: "Higher order filter pipeline evaluated correctly!" };
        }
        return { success: false, message: "filter keeps items where lambda returns True: [85, 90]." };
    }

    // =========================================================================
    // 16. SQLITE CONSOLE (Database)
    // =========================================================================
    renderSqliteConsole() {
        let html = `
            <div class="mem-scenario-card">
                <p><strong>Hostel Room DB Terminal:</strong> Which query prevents SQL Injection?</p>
                <div style="display:flex; flex-direction:column; gap:10px; margin-top:14px;">
                    <button class="mem-opt-btn" id="db-opt-0" onclick="gameEngine.selectDbOpt(0)">cursor.execute('INSERT INTO hostel VALUES (?, ?)', (student, room))</button>
                    <button class="mem-opt-btn" id="db-opt-1" onclick="gameEngine.selectDbOpt(1)">cursor.execute(f"INSERT INTO hostel VALUES ('{student}', '{room}')")</button>
                </div>
            </div>
        `;
        this.container.innerHTML = html;
    }

    selectDbOpt(idx) {
        this.gameState.dbChoice = idx;
        document.getElementById("db-opt-0").classList.toggle("selected", idx === 0);
        document.getElementById("db-opt-1").classList.toggle("selected", idx === 1);
        if (window.soundFX) soundFX.playCoin();
    }

    verifySqliteConsole() {
        if (this.gameState.dbChoice === 0) {
            return { success: true, message: "Parameterized query safely prevents SQL injection attacks!" };
        }
        return { success: false, message: "Always use parameterized queries (?) instead of raw f-strings." };
    }

    // =========================================================================
    // 17. WIFI REGEX (Regular Expressions)
    // =========================================================================
    renderWifiRegex() {
        let html = `
            <div class="mem-scenario-card">
                <p><strong>Campus WiFi Authenticator:</strong> Which pattern validates <code>student.cs26@univ.edu</code>?</p>
                <div style="display:flex; flex-direction:column; gap:10px; margin-top:14px;">
                    <button class="mem-opt-btn" id="re-opt-0" onclick="gameEngine.selectReOpt(0)">r'^[\\w\\.]+@univ\\.edu$'</button>
                    <button class="mem-opt-btn" id="re-opt-1" onclick="gameEngine.selectReOpt(1)">r'^univ\\.edu$'</button>
                </div>
            </div>
        `;
        this.container.innerHTML = html;
    }

    selectReOpt(idx) {
        this.gameState.reChoice = idx;
        document.getElementById("re-opt-0").classList.toggle("selected", idx === 0);
        document.getElementById("re-opt-1").classList.toggle("selected", idx === 1);
        if (window.soundFX) soundFX.playCoin();
    }

    verifyWifiRegex() {
        if (this.gameState.reChoice === 0) {
            return { success: true, message: "Regex pattern validated!" };
        }
        return { success: false, message: "Select the pattern with [\\w\\.] and the escaped @univ\\.edu domain." };
    }

    // =========================================================================
    // 18. TICKET CONCURRENCY (Multithreading)
    // =========================================================================
    renderTicketConcurrency() {
        this.gameState.tickets = 5;
        this.gameState.useLock = false;

        let html = `
            <div class="concurrency-stage">
                <div class="ticket-meter-box">
                    <span>VIP Fest Passes Remaining:</span>
                    <div class="ticket-count-huge" id="liveTicketCount">5</div>
                    <div>
                        <label>
                            <input type="checkbox" id="enableLockCheckbox" onchange="gameEngine.toggleThreadLock(this.checked)">
                            <strong>Activate <code>threading.Lock()</code></strong>
                        </label>
                    </div>
                </div>
                <div class="threads-race-track" id="threadsRaceTrack">
                    ${[1, 2, 3, 4, 5, 6, 7, 8].map(i => `
                        <div class="thread-runner-card">
                            <span>Thread #${i}</span>
                            <span class="thread-state-pill state-idle" id="t-state-${i}">Idle</span>
                        </div>
                    `).join("")}
                </div>
                <button class="btn btn-primary" onclick="gameEngine.simulateRace()">Simulate Ticket Rush</button>
            </div>
        `;
        this.container.innerHTML = html;
    }

    toggleThreadLock(enabled) {
        this.gameState.useLock = enabled;
        if (window.soundFX) soundFX.playCoin();
    }

    simulateRace() {
        let remaining = 5;
        const useLock = this.gameState.useLock;

        for (let i = 1; i <= 8; i++) {
            const pill = document.getElementById(`t-state-${i}`);
            if (useLock) {
                // Thread safe: exactly 5 succeed, 3 reject
                if (remaining > 0) {
                    remaining--;
                    pill.className = "thread-state-pill state-booked";
                    pill.innerText = "Booked ✔";
                } else {
                    pill.className = "thread-state-pill state-rejected";
                    pill.innerText = "Sold Out ❌";
                }
            } else {
                // Race condition simulation: all 8 book before counter updates!
                pill.className = "thread-state-pill state-booked";
                pill.innerText = "OVERBOOKED!";
                remaining = -3;
            }
        }

        document.getElementById("liveTicketCount").innerText = remaining;
        if (useLock) {
            this.gameState.raceSuccess = true;
            if (window.soundFX) soundFX.playCoin();
        } else {
            this.gameState.raceSuccess = false;
            if (window.soundFX) soundFX.playError();
        }
    }

    verifyTicketConcurrency() {
        if (this.gameState.raceSuccess) {
            return { success: true, message: "Race condition prevented! Thread lock ensured no ticket overbooking." };
        }
        return { success: false, message: "Check 'Activate threading.Lock()' and simulate the race safely!" };
    }

    // =========================================================================
    // 19. STATE SERIALIZER (JSON vs Pickle)
    // =========================================================================
    renderStateSerializer() {
        let html = `
            <div class="mem-scenario-card">
                <p><strong>Game State Serialization:</strong> Why should you NEVER run <code>pickle.loads(untrusted_bytes)</code>?</p>
                <div style="display:flex; flex-direction:column; gap:10px; margin-top:14px;">
                    <button class="mem-opt-btn" id="ser-opt-0" onclick="gameEngine.selectSerOpt(0)">It can execute arbitrary malicious code via constructor hooks</button>
                    <button class="mem-opt-btn" id="ser-opt-1" onclick="gameEngine.selectSerOpt(1)">It runs slower than JSON</button>
                </div>
            </div>
        `;
        this.container.innerHTML = html;
    }

    selectSerOpt(idx) {
        this.gameState.serChoice = idx;
        document.getElementById("ser-opt-0").classList.toggle("selected", idx === 0);
        document.getElementById("ser-opt-1").classList.toggle("selected", idx === 1);
        if (window.soundFX) soundFX.playCoin();
    }

    verifyStateSerializer() {
        if (this.gameState.serChoice === 0) {
            return { success: true, message: "Security principle understood! Never unpickle untrusted bytes." };
        }
        return { success: false, message: "Pickle deserialization allows arbitrary code execution." };
    }

    // =========================================================================
    // 20. ITERATOR CONVEYOR (Iterators)
    // =========================================================================
    renderIteratorConveyor() {
        this.gameState.tokens = ["Token #1: Biryani", "Token #2: Thali", "Token #3: Dosa"];
        this.gameState.step = 0;

        let html = `
            <div class="mem-scenario-card" style="text-align:center;">
                <p><strong>Cafeteria Meal Token Dispenser (Iterator Protocol):</strong></p>
                <div class="ticket-count-huge" id="tokenDisplay" style="font-size:1.8rem; margin:16px 0;">-- Press next() --</div>
                <button class="btn btn-secondary" onclick="gameEngine.stepIterator()">▶ Call next(token_stream)</button>
            </div>
        `;
        this.container.innerHTML = html;
    }

    stepIterator() {
        const display = document.getElementById("tokenDisplay");
        if (this.gameState.step < this.gameState.tokens.length) {
            display.innerText = this.gameState.tokens[this.gameState.step];
            this.gameState.step++;
            if (window.soundFX) soundFX.playCoin();
        } else {
            display.innerText = "💥 StopIteration Exception Raised!";
            display.style.color = "var(--brand-rose)";
            this.gameState.iteratorFinished = true;
            if (window.soundFX) soundFX.playError();
        }
    }

    verifyIteratorConveyor() {
        if (this.gameState.iteratorFinished) {
            return { success: true, message: "Iterator protocol stepped through to StopIteration!" };
        }
        return { success: false, message: "Keep pressing next() until the tokens are exhausted and StopIteration is raised." };
    }

    // =========================================================================
    // 21. GENERATOR STREAM (Generators)
    // =========================================================================
    renderGeneratorStream() {
        let html = `
            <div class="mem-scenario-card">
                <p><strong>Memory Efficiency: List vs Generator Stream</strong></p>
                <div class="mem-code-box">gen = (x for x in range(1000000000))\nlst = [x for x in range(1000000000)]  # Crashing 16GB RAM!</div>
                <p style="font-size:0.9rem;">Why does the generator expression <code>( ... )</code> consume almost zero RAM upfront?</p>
                <div style="display:flex; flex-direction:column; gap:10px; margin-top:14px;">
                    <button class="mem-opt-btn" id="gen-opt-0" onclick="gameEngine.selectGenOpt(0)">It generates items lazily on demand one by one</button>
                    <button class="mem-opt-btn" id="gen-opt-1" onclick="gameEngine.selectGenOpt(1)">It writes items to a temporary hard drive file</button>
                </div>
            </div>
        `;
        this.container.innerHTML = html;
    }

    selectGenOpt(idx) {
        this.gameState.genChoice = idx;
        document.getElementById("gen-opt-0").classList.toggle("selected", idx === 0);
        document.getElementById("gen-opt-1").classList.toggle("selected", idx === 1);
        if (window.soundFX) soundFX.playCoin();
    }

    verifyGeneratorStream() {
        if (this.gameState.genChoice === 0) {
            return { success: true, message: "Lazy generator evaluation principle mastered!" };
        }
        return { success: false, message: "Generators yield values on demand without allocating all in RAM." };
    }

    // =========================================================================
    // 22. GATEKEEPER DECORATOR (Decorators)
    // =========================================================================
    renderGatekeeperDecorator() {
        let html = `
            <div class="mem-scenario-card">
                <p><strong>Campus Gatekeeper Decorator:</strong></p>
                <div class="mem-code-box">@admin_only\ndef update_semester_grades():\n    pass</div>
                <p style="font-size:0.9rem;">Writing <code>@admin_only</code> above the function is syntactic sugar for what assignment?</p>
                <div style="display:flex; flex-direction:column; gap:10px; margin-top:14px;">
                    <button class="mem-opt-btn" id="dec-opt-0" onclick="gameEngine.selectDecOpt(0)">update_semester_grades = admin_only(update_semester_grades)</button>
                    <button class="mem-opt-btn" id="dec-opt-1" onclick="gameEngine.selectDecOpt(1)">admin_only = update_semester_grades.clone()</button>
                </div>
            </div>
        `;
        this.container.innerHTML = html;
    }

    selectDecOpt(idx) {
        this.gameState.decChoice = idx;
        document.getElementById("dec-opt-0").classList.toggle("selected", idx === 0);
        document.getElementById("dec-opt-1").classList.toggle("selected", idx === 1);
        if (window.soundFX) soundFX.playCoin();
    }

    verifyGatekeeperDecorator() {
        if (this.gameState.decChoice === 0) {
            return { success: true, message: "Decorator syntax sugar decoded: func = decorator(func)!" };
        }
        return { success: false, message: "Select the assignment func = decorator(func)." };
    }

    renderGenericFallback() {
        this.container.innerHTML = `<p>Interactive challenge ready. Click 'Verify & Unlock Vault'.</p>`;
    }

    // =========================================================================
    // GLOBAL GAME VERIFICATION & VAULT UNLOCK
    // =========================================================================
    verify() {
        let result = { success: true, message: "Game challenge complete!" };

        switch (this.level.game_type) {
            case "type_sorter": result = this.verifyTypeSorter(); break;
            case "memory_pointer": result = this.verifyMemoryPointer(); break;
            case "queue_slicer": result = this.verifyQueueSlicer(); break;
            case "tuple_vault": result = this.verifyTupleVault(); break;
            case "venn_matcher": result = this.verifyVennMatcher(); break;
            case "canteen_hash": result = this.verifyCanteenHash(); break;
            case "barista_pipeline": result = this.verifyBaristaPipeline(); break;
            case "robot_factory": result = this.verifyRobotFactory(); break;
            case "vault_security": result = this.verifyVaultSecurity(); break;
            case "hierarchy_tree": result = this.verifyHierarchyTree(); break;
            case "talent_mixer": result = this.verifyTalentMixer(); break;
            case "iot_blueprint": result = this.verifyIoTBlueprint(); break;
            case "exam_shield": result = this.verifyExamShield(); break;
            case "registrar_archive": result = this.verifyRegistrarArchive(); break;
            case "placement_stream": result = this.verifyPlacementStream(); break;
            case "sqlite_console": result = this.verifySqliteConsole(); break;
            case "wifi_regex": result = this.verifyWifiRegex(); break;
            case "ticket_concurrency": result = this.verifyTicketConcurrency(); break;
            case "state_serializer": result = this.verifyStateSerializer(); break;
            case "iterator_conveyor": result = this.verifyIteratorConveyor(); break;
            case "generator_stream": result = this.verifyGeneratorStream(); break;
            case "gatekeeper_decorator": result = this.verifyGatekeeperDecorator(); break;
        }

        if (result.success) {
            this.unlockVaultUI(true);
            showToast(result.message, "success");
            if (typeof addGems === "function") addGems(25);
            if (typeof addXP === "function") addXP(50);
            if (window.soundFX) soundFX.playWin();
            if (typeof triggerConfetti === "function") triggerConfetti();
        } else {
            showToast(result.message, "error");
            if (window.soundFX) soundFX.playError();
        }
    }

    unlockVaultUI(triggerSound = true) {
        // Unhide Post-Game Navigation Ribbon
        const ribbon = document.getElementById("gameCompleteRibbon");
        if (ribbon) {
            ribbon.style.display = "flex";
            if (triggerSound) {
                ribbon.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }

        // Unlock knowledge vault
        const vault = document.getElementById("knowledgeVault");
        if (vault) vault.classList.remove("locked");

        // Unlock code challenge
        const challenge = document.getElementById("codeChallengeSection");
        if (challenge) challenge.classList.remove("locked");

        // Unlock quiz
        const quiz = document.getElementById("quizSection");
        if (quiz) quiz.classList.remove("locked");

        // Shield UI
        const shieldIcon = document.getElementById("shieldIcon");
        const shieldLabel = document.getElementById("shieldLabel");
        if (shieldIcon) shieldIcon.innerText = "🔓";
        if (shieldLabel) {
            shieldLabel.innerText = "Vault Unlocked";
            shieldLabel.style.color = "var(--brand-emerald)";
        }

        // Save unlock to state
        const profile = getStudentProfile();
        if (!profile.unlocked_vaults.includes(this.level.id)) {
            profile.unlocked_vaults.push(this.level.id);
            saveStudentState(profile);
        }
    }
}

// Global game engine instance
window.gameEngine = new CampusGameEngine();

document.addEventListener("DOMContentLoaded", () => {
    window.gameEngine.init();
});

function verifyCurrentGame() {
    window.gameEngine.verify();
}

function resetCurrentGame() {
    window.gameEngine.init();
    showToast("Game reset to initial state", "info");
}

function giveGameHint() {
    const hintBox = document.getElementById("gameHintBox");
    const hintText = document.getElementById("gameHintText");
    if (!hintBox || !hintText) return;

    const mission = window.CURRENT_LEVEL ? window.CURRENT_LEVEL.mission : "Carefully observe the code logic!";
    hintText.innerText = mission;
    hintBox.style.display = "flex";
    if (window.soundFX) soundFX.playCoin();
}

function scrollBackToGame() {
    const el = document.getElementById("gameArena");
    if (el) el.scrollIntoView({ behavior: "smooth" });
}
