/**
 * PyCampus Quest Main Application Logic
 * Manages student state, XP, gems, rewards, particle animations, and UI interactions.
 */

const STORAGE_KEY = "pyquest_campus_student_state_v2";
const LEGACY_STORAGE_KEY = "pycampus_student_state_2026";

const DEFAULT_PROFILE = {
    name: "College Coder",
    college: "PyQuest Campus Institute of Tech",
    avatar: "ðŸ‘¨â€ðŸ’»",
    roll_no: "2026-PYQ-1042",
    xp: 0,
    gems: 0,
    coins: 0,
    mastered_levels: [],
    unlocked_vaults: ["primitive-types"],
    completed_challenges: {},
    attempts: {},
    hints_used: {},
    streak: 0,
    last_play_date: null,
    badges: [],
    achievements: [],
    unlocked_themes: ["default"],
    unlocked_avatars: ["ðŸ‘¨â€ðŸ’»", "ðŸ‘©â€ðŸ’»"],
    daily_challenge_date: null,
    daily_challenge_completed: false
};

// Pending loot cache
let pendingLoot = null;

// Get current state
function getStudentProfile() {
    try {
        let raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            // Try to migrate from legacy key
            const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
            if (legacyRaw) {
                raw = legacyRaw;
                // Migrate
                const legacyData = JSON.parse(legacyRaw);
                const migrated = Object.assign({}, DEFAULT_PROFILE, legacyData);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
                localStorage.removeItem(LEGACY_STORAGE_KEY);
            }
        }
        if (raw) {
            const data = JSON.parse(raw);
            // Ensure all fields exist for backward compatibility
            return Object.assign({}, DEFAULT_PROFILE, data);
        }
    } catch (e) {
        console.error("Failed to read student profile", e);
    }
    return Object.assign({}, DEFAULT_PROFILE);
}

// Save state
function saveStudentState(profile) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
        console.error("Failed to write student state", e);
    }
}

// Track attempt for a challenge
function recordAttempt(challengeId) {
    const profile = getStudentProfile();
    if (!profile.attempts) profile.attempts = {};
    profile.attempts[challengeId] = (profile.attempts[challengeId] || 0) + 1;
    saveStudentState(profile);
    return profile.attempts[challengeId];
}

// Get attempt count
function getAttemptCount(challengeId) {
    const profile = getStudentProfile();
    if (!profile.attempts) return 0;
    return profile.attempts[challengeId] || 0;
}

// Track hints used
function recordHintUsed(challengeId) {
    const profile = getStudentProfile();
    if (!profile.hints_used) profile.hints_used = {};
    profile.hints_used[challengeId] = (profile.hints_used[challengeId] || 0) + 1;
    saveStudentState(profile);
    return profile.hints_used[challengeId];
}

// Update streak
function updateStreak() {
    const profile = getStudentProfile();
    const today = new Date().toDateString();
    if (profile.last_play_date !== today) {
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        if (profile.last_play_date === yesterday) {
            profile.streak = (profile.streak || 0) + 1;
        } else if (profile.last_play_date !== today) {
            profile.streak = 1;
        }
        profile.last_play_date = today;
        saveStudentState(profile);
    }
    return profile.streak || 0;
}

// Award challenge completion with duplicate prevention
function awardChallengeCompletion(challengeId, { xp = 0, coins = 0, gems = 0, badge = null, perfect = false, noHints = false }) {
    const profile = getStudentProfile();
    if (!profile.completed_challenges) profile.completed_challenges = {};
    
    // Prevent duplicate rewards
    if (profile.completed_challenges[challengeId] && profile.completed_challenges[challengeId].completed) {
        return { awarded: false, reason: "Already completed" };
    }
    
    updateStreak();
    const attempts = getAttemptCount(challengeId);
    const hintsUsed = profile.hints_used && profile.hints_used[challengeId] ? profile.hints_used[challengeId] : 0;
    
    let bonusXP = 0;
    let bonusCoins = 0;
    
    // Perfect score bonus
    if (perfect) {
        bonusXP += Math.floor(xp * 0.25);
        bonusCoins += 10;
    }
    
    // No hints bonus
    if (noHints && hintsUsed === 0) {
        bonusXP += Math.floor(xp * 0.15);
        bonusCoins += 5;
    }
    
    // First attempt bonus
    if (attempts <= 1) {
        bonusXP += Math.floor(xp * 0.1);
    }
    
    // Streak bonus
    const streak = profile.streak || 1;
    if (streak >= 3) {
        bonusXP += streak * 5;
    }
    
    const totalXP = xp + bonusXP;
    const totalCoins = coins + bonusCoins;
    const totalGems = gems;
    
    profile.xp = (profile.xp || 0) + totalXP;
    profile.coins = (profile.coins || 0) + totalCoins;
    profile.gems = (profile.gems || 0) + totalGems;
    
    if (badge && !profile.badges.includes(badge)) {
        profile.badges.push(badge);
    }
    
    profile.completed_challenges[challengeId] = {
        completed: true,
        completedAt: new Date().toISOString(),
        xpEarned: totalXP,
        coinsEarned: totalCoins,
        perfect: perfect,
        attempts: attempts,
        hintsUsed: hintsUsed
    };
    
    saveStudentState(profile);
    updateGlobalNavUI();
    
    return {
        awarded: true,
        totalXP,
        bonusXP,
        totalCoins,
        bonusCoins,
        totalGems,
        streak: profile.streak
    };
}

// Calculate academic rank from total XP
function calculateAcademicRank(xp) {
    if (xp >= 3500) return { rank: "Python Grandmaster", tier: "Tier 6: Placement Star" };
    if (xp >= 2500) return { rank: "Open Source Fellow", tier: "Tier 5: Tech Lead" };
    if (xp >= 1500) return { rank: "Senior Engineer", tier: "Tier 4: Senior Scholar" };
    if (xp >= 800)  return { rank: "Junior Developer", tier: "Tier 3: Junior Coder" };
    if (xp >= 300)  return { rank: "Sophomore Hacker", tier: "Tier 2: Sophomore" };
    return { rank: "Fresher", tier: "Tier 1: Freshman Apprentice" };
}

// Add XP and sync
function addXP(amount) {
    const profile = getStudentProfile();
    profile.xp = (profile.xp || 0) + amount;
    saveStudentState(profile);
    updateGlobalNavUI();
    showFloatingReward(`+${amount} XP`, "xp");
}

// Add Gems and sync
function addGems(amount) {
    const profile = getStudentProfile();
    profile.gems = (profile.gems || 0) + amount;
    saveStudentState(profile);
    updateGlobalNavUI();
    showFloatingReward(`+${amount} 💎`, "gem");
}

// Add combined rewards
function addRewards({ xp = 0, gems = 0, badge = null, title = null }) {
    const profile = getStudentProfile();
    if (xp > 0) profile.xp = (profile.xp || 0) + xp;
    if (gems > 0) profile.gems = (profile.gems || 0) + gems;
    if (badge && !profile.mastered_levels.includes(badge)) {
        profile.mastered_levels.push(badge);
    }
    saveStudentState(profile);
    updateGlobalNavUI();
    if (xp > 0) showFloatingReward(`+${xp} XP`, "xp");
    if (gems > 0) setTimeout(() => showFloatingReward(`+${gems} 💎`, "gem"), 250);
}

// Mark level as mastered
function markLevelMastered(levelId, xpAward) {
    const profile = getStudentProfile();
    const gemsAward = Math.floor(xpAward / 2);
    const wasAlreadyMastered = profile.mastered_levels.includes(levelId);

    if (!wasAlreadyMastered) {
        profile.mastered_levels.push(levelId);
        profile.xp = (profile.xp || 0) + xpAward;
        profile.gems = (profile.gems || 0) + gemsAward;
    }
    if (!profile.unlocked_vaults.includes(levelId)) {
        profile.unlocked_vaults.push(levelId);
    }
    saveStudentState(profile);
    updateGlobalNavUI();

    // Trigger Mystery Loot Chest if newly mastered
    if (!wasAlreadyMastered) {
        triggerLootDrop({
            title: "Level Conquered!",
            desc: `You mastered Level ${levelId}! Crack open the victory chest to claim your engineering loot.`,
            xp: xpAward,
            gems: gemsAward,
            badge: window.CURRENT_LEVEL ? window.CURRENT_LEVEL.badge : "Mastery Badge",
            badge_icon: window.CURRENT_LEVEL ? window.CURRENT_LEVEL.badge_icon : "🏆"
        });
    }
}

// Update Top Navigation Bar UI
function updateGlobalNavUI() {
    const profile = getStudentProfile();
    const navAvatar = document.getElementById("navAvatar");
    const navName = document.getElementById("navStudentName");
    const navXP = document.getElementById("navTotalXP");
    const navGems = document.getElementById("navTotalGems");
    const globalBar = document.getElementById("globalProgressBar");

    if (navAvatar) navAvatar.innerText = profile.avatar || "👨‍💻";
    if (navName) navName.innerText = profile.name || "Student";
    if (navXP) navXP.innerText = profile.xp || 0;
    if (navGems) navGems.innerText = profile.gems || 0;

    const totalMastered = (profile.mastered_levels || []).length;
    const pct = Math.min(100, Math.round((totalMastered / 22) * 100));
    if (globalBar) globalBar.style.width = `${pct}%`;
}

// Refresh Campus Dashboard (index.html)
function refreshCampusDashboard() {
    const profile = getStudentProfile();
    updateGlobalNavUI();

    const rankInfo = calculateAcademicRank(profile.xp || 0);

    const heroRank = document.getElementById("heroRank");
    const heroXP = document.getElementById("heroXP");
    const heroMastered = document.getElementById("heroMastered");

    if (heroRank) heroRank.innerText = rankInfo.rank;
    if (heroXP) heroXP.innerText = `${profile.xp || 0} XP`;
    if (heroMastered) heroMastered.innerText = `${(profile.mastered_levels || []).length} / 22`;

    // ID Badge on index
    const idBadgeName = document.getElementById("idBadgeName");
    const idBadgeSchool = document.getElementById("idBadgeSchool");
    const idBadgeAvatar = document.getElementById("idBadgeAvatar");
    const idBadgeTier = document.getElementById("idBadgeTier");
    const idBadgePct = document.getElementById("idBadgePct");
    const idBadgeFill = document.getElementById("idBadgeFill");

    const pct = Math.min(100, Math.round(((profile.mastered_levels || []).length / 22) * 100));
    if (idBadgeName) idBadgeName.innerText = profile.name || "College Coder";
    if (idBadgeSchool) idBadgeSchool.innerText = profile.college || "PyCampus University";
    if (idBadgeAvatar) idBadgeAvatar.innerText = profile.avatar || "👨‍💻";
    if (idBadgeTier) idBadgeTier.innerText = rankInfo.tier;
    if (idBadgePct) idBadgePct.innerText = `${pct}%`;
    if (idBadgeFill) idBadgeFill.style.width = `${pct}%`;

    // Update level cards visual status
    const masteredList = profile.mastered_levels || [];
    const unlockedVaults = profile.unlocked_vaults || ["primitive-types"];

    document.querySelectorAll(".level-card").forEach(card => {
        const id = card.id.replace("levelCard-", "");
        const statusIcon = document.getElementById(`statusIcon-${id}`);
        const playBtn = document.getElementById(`playBtn-${id}`);

        if (masteredList.includes(id)) {
            card.classList.add("mastered");
            if (statusIcon) statusIcon.innerText = "⭐";
            if (playBtn) playBtn.innerHTML = "<span>⭐ Mastered</span>";
        } else if (unlockedVaults.includes(id)) {
            if (statusIcon) statusIcon.innerText = "⚡";
            if (playBtn) playBtn.innerHTML = "<span>🎮 Play Mission</span>";
        } else {
            if (statusIcon) statusIcon.innerText = "🔒";
        }
    });
}

// Student Profile Modal Handling
function toggleProfileModal(show) {
    const modal = document.getElementById("profileModal");
    if (!modal) return;
    if (show) {
        const profile = getStudentProfile();
        const rankInfo = calculateAcademicRank(profile.xp || 0);
        document.getElementById("inputStudentName").value = profile.name || "College Coder";
        document.getElementById("inputCollegeName").value = profile.college || "PyCampus University";
        document.getElementById("modalMasteredCount").innerText = `${(profile.mastered_levels || []).length}/22`;
        document.getElementById("modalTotalXP").innerText = profile.xp || 0;
        document.getElementById("modalTotalGems").innerText = profile.gems || 0;

        document.querySelectorAll(".avatar-opt").forEach(btn => {
            btn.classList.toggle("active", btn.innerText === (profile.avatar || "👨‍💻"));
        });
        modal.style.display = "flex";
    } else {
        modal.style.display = "none";
    }
}

function selectAvatar(avatarEmoji) {
    document.querySelectorAll(".avatar-opt").forEach(btn => {
        btn.classList.toggle("active", btn.innerText === avatarEmoji);
    });
}

function saveStudentProfile() {
    const profile = getStudentProfile();
    const name = document.getElementById("inputStudentName").value.trim() || "College Coder";
    const college = document.getElementById("inputCollegeName").value.trim() || "PyCampus University";
    const activeAvatarBtn = document.querySelector(".avatar-opt.active");
    const avatar = activeAvatarBtn ? activeAvatarBtn.innerText : "👨‍💻";

    profile.name = name;
    profile.college = college;
    profile.avatar = avatar;

    saveStudentState(profile);
    toggleProfileModal(false);
    updateGlobalNavUI();
    if (typeof refreshCampusDashboard === "function") refreshCampusDashboard();
    showToast("Profile successfully saved!", "success");
}

function resetAllProgress() {
    if (confirm("Are you sure you want to reset all campus progress and XP?")) {
        localStorage.removeItem(STORAGE_KEY);
        updateGlobalNavUI();
        if (typeof refreshCampusDashboard === "function") refreshCampusDashboard();
        toggleProfileModal(false);
        showToast("Progress has been reset.", "info");
        window.location.reload();
    }
}

// =============================================================================
// REWARDS & INTERACTIVE MYSTERY LOOT CHEST
// =============================================================================

function triggerLootDrop(lootData) {
    pendingLoot = lootData;
    const modal = document.getElementById("lootModal");
    if (!modal) return;

    document.getElementById("lootTitle").innerText = lootData.title || "Victory Loot Dropped!";
    document.getElementById("lootDesc").innerText = lootData.desc || "Click the mystery chest above to claim your reward!";
    document.getElementById("chestTapHint").innerText = "✨ CLICK CHEST TO CLAIM REWARD! ✨";
    document.getElementById("animatedLootChest").innerText = "🎁";
    document.getElementById("animatedLootChest").classList.remove("chest-opened");
    document.getElementById("lootRewardsGrid").style.display = "none";
    document.getElementById("lootActions").style.display = "none";

    modal.style.display = "flex";
    if (window.soundFX) soundFX.playStart();
}

function openLootChest() {
    if (!pendingLoot) return;

    const chest = document.getElementById("animatedLootChest");
    chest.classList.add("chest-opened");
    chest.innerText = "📦✨";
    document.getElementById("chestTapHint").innerText = "🎉 LOOT UNLOCKED! 🎉";

    const grid = document.getElementById("lootRewardsGrid");
    grid.innerHTML = `
        <div class="loot-item-card xp-item">
            <span class="loot-item-icon">⚡</span>
            <div class="loot-item-val">+${pendingLoot.xp || 100} XP</div>
            <div class="loot-item-lbl">Experience Points</div>
        </div>
        <div class="loot-item-card gem-item">
            <span class="loot-item-icon">💎</span>
            <div class="loot-item-val">+${pendingLoot.gems || 50} GEMS</div>
            <div class="loot-item-lbl">Campus Currency</div>
        </div>
        <div class="loot-item-card badge-item">
            <span class="loot-item-icon">${pendingLoot.badge_icon || '🎖️'}</span>
            <div class="loot-item-val">${pendingLoot.badge || 'Level Badge'}</div>
            <div class="loot-item-lbl">Verified Honor Badge</div>
        </div>
        <div class="loot-item-card key-item">
            <span class="loot-item-icon">🔑</span>
            <div class="loot-item-val">Archive Key</div>
            <div class="loot-item-lbl">Knowledge Decrypted</div>
        </div>
    `;
    grid.style.display = "grid";
    document.getElementById("lootActions").style.display = "flex";

    if (window.soundFX) soundFX.playWin();
    triggerConfetti();
    pendingLoot = null;
}

function closeLootModal() {
    const modal = document.getElementById("lootModal");
    if (modal) modal.style.display = "none";
}

// Floating animated text (+100 XP, +50 Gems)
function showFloatingReward(text, type = "xp") {
    const el = document.createElement("div");
    el.className = `floating-reward-tag reward-${type}`;
    el.innerText = text;
    el.style.left = `${window.innerWidth / 2 - 40 + (Math.random() * 60 - 30)}px`;
    el.style.top = `${window.innerHeight / 2 - 20}px`;

    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1600);
}

// Smooth scroll helper
function scrollSection(id) {
    const el = document.getElementById(id);
    if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

// Toast Notifications
function showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    const icon = type === "success" ? "✔" : (type === "error" ? "❌" : "ℹ️");
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;

    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// Escape HTML helper
function escapeHtml(text) {
    if (!text) return "";
    return text.toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Confetti particle celebration animation
function triggerConfetti() {
    const colors = ["#38bdf8", "#a855f7", "#10b981", "#f59e0b", "#f43f5e"];
    for (let i = 0; i < 70; i++) {
        const conf = document.createElement("div");
        conf.style.position = "fixed";
        conf.style.zIndex = "99999";
        conf.style.left = `${Math.random() * 100}vw`;
        conf.style.top = "-10px";
        conf.style.width = `${Math.random() * 8 + 6}px`;
        conf.style.height = `${Math.random() * 8 + 6}px`;
        conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        conf.style.borderRadius = "2px";
        conf.style.pointerEvents = "none";
        conf.style.transform = `rotate(${Math.random() * 360}deg)`;
        conf.style.transition = `all ${Math.random() * 2 + 1.5}s ease-out`;

        document.body.appendChild(conf);

        setTimeout(() => {
            conf.style.top = `${window.innerHeight + 20}px`;
            conf.style.transform = `rotate(${Math.random() * 720}deg)`;
            conf.style.opacity = "0";
            setTimeout(() => conf.remove(), 2500);
        }, 20);
    }
}

// =============================================================================
// AMBIENT CYBER PARTICLES BACKGROUND
// =============================================================================

function initCyberParticles() {
    const canvas = document.getElementById("cyberBgCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener("resize", () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const count = Math.min(45, Math.floor(width / 30));

    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            radius: Math.random() * 1.8 + 0.8,
            color: Math.random() > 0.5 ? "rgba(56, 189, 248, 0.4)" : "rgba(168, 85, 247, 0.35)"
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();

            // Draw faint connection lines
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(56, 189, 248, ${0.12 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
}

document.addEventListener("DOMContentLoaded", () => {
    updateGlobalNavUI();
    initCyberParticles();

    const profileBtn = document.getElementById("studentProfileBtn");
    if (profileBtn) {
        profileBtn.addEventListener("click", () => toggleProfileModal(true));
    }
});
