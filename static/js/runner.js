/**
 * PyCampus Quest Code Runner & Challenge Submission Engine
 */

async function runSandboxCode() {
    const editor = document.getElementById("codeEditor");
    const terminal = document.getElementById("terminalScreen");
    const execDisplay = document.getElementById("execTimeDisplay");

    if (!editor || !terminal) return;

    const code = editor.value;
    terminal.innerHTML = '<div class="term-line term-dim"># Running code in Python sandbox...</div>';

    try {
        const resp = await fetch("/api/run_code", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: code })
        });
        const data = await resp.json();

        if (execDisplay) execDisplay.innerText = `${data.elapsed || 0} ms`;

        if (!data.success) {
            terminal.innerHTML = `<div class="term-line term-err">❌ Error: ${escapeHtml(data.error)}</div>`;
            if (data.output) {
                terminal.innerHTML += `<div class="term-line term-out">${escapeHtml(data.output)}</div>`;
            }
            if (window.soundFX) soundFX.playError();
            return;
        }

        let html = `<div class="term-line term-succ">✔ Code executed in ${data.elapsed}ms</div>`;
        if (data.output) {
            html += `<div class="term-line term-out">${escapeHtml(data.output)}</div>`;
        } else {
            html += `<div class="term-line term-dim">(No stdout output)</div>`;
        }
        terminal.innerHTML = html;
        if (window.soundFX) soundFX.playCoin();
    } catch (err) {
        terminal.innerHTML = `<div class="term-line term-err">Network error: ${err.message}</div>`;
    }
}

async function submitChallengeCode() {
    const editor = document.getElementById("codeEditor");
    const terminal = document.getElementById("terminalScreen");
    const resultsList = document.getElementById("testResultsList");
    const levelContainer = document.getElementById("levelContainer");

    if (!editor || !levelContainer) return;

    const levelId = levelContainer.dataset.levelId;
    const levelXP = parseInt(levelContainer.dataset.levelXp || 100, 10);
    const code = editor.value;

    terminal.innerHTML = '<div class="term-line term-dim"># Validating solution against official test cases...</div>';
    if (resultsList) resultsList.innerHTML = "";

    try {
        const resp = await fetch("/api/verify_challenge", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                level_id: levelId,
                code: code
            })
        });
        const data = await resp.json();

        if (data.results && resultsList) {
            resultsList.innerHTML = data.results.map(tc => `
                <div class="test-item ${tc.passed ? 'pass' : 'fail'}">
                    <span class="icon">${tc.passed ? '✔' : '❌'}</span>
                    <div class="test-detail">
                        <div><strong>Test Case #${tc.test_case}:</strong> ${tc.passed ? 'Passed' : 'Failed'}</div>
                        ${!tc.passed ? `<div class="actual-val">Expected: ${escapeHtml(tc.expected)} | Got: ${escapeHtml(tc.actual || tc.error)}</div>` : ''}
                    </div>
                </div>
            `).join("");
        }

        if (data.success) {
            terminal.innerHTML = `<div class="term-line term-succ">🎉 ALL TEST CASES PASSED! Solution verified!</div>`;
            if (window.soundFX) soundFX.playWin();
            if (typeof triggerConfetti === "function") triggerConfetti();

            // Mark level as mastered in local state
            if (typeof markLevelMastered === "function") {
                markLevelMastered(levelId, levelXP);
            }

            // Reveal Victory Card
            const victoryCard = document.getElementById("victoryCard");
            if (victoryCard) {
                victoryCard.style.display = "block";
                victoryCard.scrollIntoView({ behavior: "smooth" });
            }
            showToast(`Level Mastered! +${levelXP} XP earned!`, "success");
        } else {
            terminal.innerHTML = `<div class="term-line term-err">❌ One or more test assertions failed. Review your code logic.</div>`;
            if (window.soundFX) soundFX.playError();
            showToast("Challenge incomplete. Check failed test cases.", "error");
        }
    } catch (err) {
        terminal.innerHTML = `<div class="term-line term-err">Submission error: ${err.message}</div>`;
    }
}

function resetStarterCode() {
    const editor = document.getElementById("codeEditor");
    if (editor && window.CURRENT_LEVEL && window.CURRENT_LEVEL.code_challenge) {
        editor.value = window.CURRENT_LEVEL.code_challenge.starter_code;
        showToast("Code reset to starter template", "info");
    }
}

function showChallengeHint() {
    if (window.CURRENT_LEVEL && window.CURRENT_LEVEL.code_challenge) {
        showToast("💡 Task: " + window.CURRENT_LEVEL.code_challenge.prompt, "info");
        if (window.soundFX) soundFX.playCoin();
    }
}

function revealChallengeSolution() {
    if (!window.CURRENT_LEVEL || !window.CURRENT_LEVEL.code_challenge) return;
    if (confirm("Load the reference solution into the editor? Use this to learn and compare with your code.")) {
        const editor = document.getElementById("codeEditor");
        if (editor && window.CURRENT_LEVEL.code_challenge.solution_code) {
            editor.value = window.CURRENT_LEVEL.code_challenge.solution_code;
            showToast("Reference solution loaded", "info");
            if (window.soundFX) soundFX.playCoin();
        }
    }
}

function checkQuizOption(button, qIndex, correctIndex, explanation) {
    const parentItem = button.closest(".quiz-item");
    if (!parentItem) return;

    const optButtons = parentItem.querySelectorAll(".quiz-opt-btn");
    optButtons.forEach(btn => btn.disabled = true);

    const feedback = parentItem.querySelector(".quiz-feedback");
    const chosenIndex = Array.from(optButtons).indexOf(button);

    if (chosenIndex === correctIndex) {
        button.style.borderColor = "var(--brand-emerald)";
        button.style.backgroundColor = "rgba(16, 185, 129, 0.2)";
        if (feedback) {
            feedback.className = "quiz-feedback correct";
            feedback.innerHTML = `<strong>✔ Correct!</strong> ${explanation}`;
            feedback.style.display = "block";
        }
        if (window.soundFX) soundFX.playCoin();
        if (typeof addXP === "function") addXP(20);
        if (typeof awardChallengeCompletion === "function") {
            awardChallengeCompletion(`quiz_${window.CURRENT_LEVEL ? window.CURRENT_LEVEL.id : 'quiz'}_${qIndex}`, {
                xp: 20,
                coins: 2,
                perfect: true,
                noHints: true
            });
        }
        showToast("Correct! +20 XP", "success");
    } else {
        button.style.borderColor = "var(--brand-rose)";
        button.style.backgroundColor = "rgba(244, 63, 94, 0.2)";
        const correctBtn = optButtons[correctIndex];
        if (correctBtn) {
            correctBtn.style.borderColor = "var(--brand-emerald)";
        }
        if (feedback) {
            feedback.className = "quiz-feedback wrong";
            feedback.innerHTML = `<strong>❌ Incorrect.</strong> ${explanation}`;
            feedback.style.display = "block";
        }
        if (window.soundFX) soundFX.playError();
    }
}
