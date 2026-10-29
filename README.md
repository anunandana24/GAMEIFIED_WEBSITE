# 🎓 PyCampus Quest: The Ultimate Gamified Python Learning Platform

> **A Complete Gamified Python Web Application Engineered for College Students to Master Python from Core Fundamentals to Advanced Engineering.**

![Python Version](https://img.shields.io/badge/Python-3.10%2B-blue.svg)
![Framework](https://img.shields.io/badge/Framework-Flask%203.0%2B-green.svg)
![Architecture](https://img.shields.io/badge/Full--Stack-Python%20Backend%20%2B%20REST%20API-orange.svg)
![Tests](https://img.shields.io/badge/Automated%20Tests-20%20Passed%20(100%25)-brightgreen.svg)

---

## 🌟 Table of Contents
1. [Overview & Concept](#overview--concept)
2. [Target Audience & Gamified Student Theme](#target-audience--gamified-student-theme)
3. [22 Comprehensive Python Concepts & Mini-Games](#22-comprehensive-python-concepts--mini-games)
4. [Exciting Game Modes](#exciting-game-modes)
5. [Prerequisites & Requirements](#prerequisites--requirements)
6. [How to Run the Application](#how-to-run-the-application)
7. [Running the Automated Test Suite](#running-the-automated-test-suite)
8. [Project File Architecture](#project-file-architecture)
9. [Security Sandbox Architecture](#security-sandbox-architecture)

---

## 1. Overview & Concept
**PyCampus Quest** is a gamified web platform where Python learning is never passive reading. 
In accordance with modern pedagogical design:
* **Knowledge Vault is Initially Encrypted 🔒**: The academic notes, syntax explanations, and cheat sheets for each concept are hidden inside a secured vault.
* **Play to Learn 🕹️**: Students interact directly with hands-on mini-game simulations (sorting data types, navigating memory pointers, slicing chore queues, defeating race conditions with thread locks).
* **Instant Decryption 🔓**: Beating the mini-game unlocks the **Campus Knowledge Archive** with deep conceptual breakdowns, college-themed code examples, and placement interview traps.
* **Code Quests & Live Python Sandbox 💻**: Students complete real Python code challenges verified in real-time by the Python backend runner.
* **Trophies & XP 🏆**: Earn XP, unlock academic badges, level up your student rank, and print a verified **Graduation Certificate of Python Mastery**.

---

## 2. Target Audience & Gamified Student Theme
Designed specifically for **college engineering students, CS undergrads, and campus placement aspirants**:
* **Theme**: College Campus Tech Odyssey (Freshman Academic Block, Hostel Room Allocations, Campus Canteen, Cultural Fest, Placement Interview Chambers).
* **Audio FX**: In-browser **Web Audio API 8-bit sound synthesizer** (zero external MP3 assets; works 100% offline).
* **Visuals**: Modern Cyberpunk College Campus aesthetic with dark-mode glassmorphism cards, glowing status nodes, animated progress tracks, and celebratory confetti particles.
* **Academic Rank Progression**:
  * `0 - 299 XP`: **Fresher Apprentice** (Tier 1)
  * `300 - 799 XP`: **Sophomore Hacker** (Tier 2)
  * `800 - 1499 XP`: **Junior Developer** (Tier 3)
  * `1500 - 2499 XP`: **Senior Engineer** (Tier 4)
  * `2500 - 3499 XP`: **Open Source Fellow** (Tier 5)
  * `3500+ XP`: **Python Grandmaster & Placement Star** (Tier 6)

---

## 3. 22 Comprehensive Python Concepts & Mini-Games
Every concept requested is fully represented with its dedicated level, custom mini-game, unlocked theoretical dossier, code challenge, and mastery quiz:

| Level | Topic | Category | Campus Theme & Storyline | Game Mechanic |
| :---: | :--- | :--- | :--- | :--- |
| **1** | **Primitive Data Types** | Freshman Core | *Campus ID Card Registry* | Drag & drop admissions attributes into `int`, `float`, `str`, `bool`, `NoneType` vaults. |
| **2** | **Non-Primitive Data Types** | Freshman Core | *Campus Memory & Reference Lab* | Predict pointer mutations vs independent clones in the RAM heap. |
| **3** | **Lists & Slicing** | Data Structures | *Hostel Roommate Chore Queue* | Slice dynamic arrays with `[start:stop:step]` and list comprehensions. |
| **4** | **Tuples & Immutability** | Data Structures | *Tamper-Proof Transcript Vault* | Tuple unpacking `roll, name, *marks` and defending against `TypeError`. |
| **5** | **Sets & Venn Operations** | Data Structures | *Campus Club Membership Overlap* | Calculate `&` (Intersection), `-` (Difference), and `^` (Symmetric Diff). |
| **6** | **Dictionaries & Hash Maps** | Data Structures | *College Canteen Order Hash Table* | Fast O(1) key-value meal lookups and safe fallback `.get()`. |
| **7** | **Functions & Scope** | Data Structures | *Campus Cafe Barista Pipeline* | Assemble parameter order: positional, defaults, `*args`, and `**kwargs`. |
| **8** | **Classes & Objects** | OOP Mastery | *Campus Robot Pet Blueprint* | Instantiate objects, bind methods with `self`, and track state via `__init__`. |
| **9** | **Encapsulation & Properties** | OOP Mastery | *College Bank Account & Grade Vault* | Encapsulate private `__balance` with `@property` and validation setters. |
| **10** | **Inheritance & `super()`** | OOP Mastery | *University Hierarchy Tree* | Derive `Student(Person)` and invoke base constructors using `super()`. |
| **11** | **Polymorphism & Duck Typing** | OOP Mastery | *Campus Cultural Fest Stage Mixer* | Polyphonic method dispatch on diverse performer objects (`.perform()`). |
| **12** | **Abstraction & ABCs** | OOP Mastery | *Smart Classroom IoT Hardware Interface* | Enforce hardware contracts using `abc.ABC` and `@abstractmethod`. |
| **13** | **Exception Handling** | Advanced Engineering | *Night Before Exam Bug Shield* | Catch `ZeroDivisionError`, `KeyError` using `try-except-else-finally`. |
| **14** | **File Handling** | Advanced Engineering | *The Registrar's Secret Archives* | Context managers (`with open`), file modes (`'r'`, `'w'`, `'a'`, `'rb'`). |
| **15** | **Higher Order Functions** | Advanced Engineering | *Placement Drive Candidate Filter* | Transform pipelines using `map()`, `filter()`, `reduce()`, and lambdas. |
| **16** | **Database (SQLite3)** | Advanced Engineering | *Hostel Room Allocation SQL Terminal* | Connect, execute parameterized queries (prevent SQL injection), commit. |
| **17** | **Regular Expressions (`re`)** | Advanced Engineering | *Campus Cyber-Security WiFi Validator* | Match college emails (`user@univ.edu`) and Roll numbers with regex. |
| **18** | **Multithreading & Locks** | Advanced Engineering | *Campus Fest Ticket Rush* | Concurrency simulation: race conditions vs thread synchronization with `Lock()`. |
| **19** | **JSON & PICKLE** | Advanced Engineering | *Save Game State & Profile Serializer* | Web text serialization (JSON) vs binary object pickling (security warnings). |
| **20** | **Iterators & Protocol** | Advanced Engineering | *Cafeteria Meal Token Conveyor* | Build custom iterator classes with `__iter__()`, `__next__()`, and `StopIteration`. |
| **21** | **Generators & `yield`** | Advanced Engineering | *Lazily Evaluated Roll Call* | Infinite streams and O(1) constant memory evaluation with `yield`. |
| **22** | **Decorators & Wrappers** | Advanced Engineering | *Campus Gatekeeper & Stopwatch* | Syntactic sugar wrappers (`@decorator`), `@wraps`, timing and auth checks. |

---

## 4. Exciting Game Modes

### 🎮 Mode 1: Campus Quest Map (Story Mode)
* 22 progressively unlocking levels.
* Visual indicators for Locked (`🔒`), In Progress (`⚡`), and Mastered (`⭐`).
* Filter by academic zone: Freshman Core, Collections, OOP Mastery, Advanced Engineering.

### 🕹️ Mode 2: Bug Buster Speed Arcade (`/arcade`)
* 60-second time-attack challenge!
* Quick-fire Python questions testing syntax bugs, memory references, and operators.
* Consecutive right answers build up a **Combo Multiplier** (`1x` -> `2x` -> `5x`) to boost your score!

### 👔 Mode 3: Campus Placement Technical Interview Boss Battle (`/boss`)
* Face off against the Senior Technical Lead in a 3-Round Live Coding Interview.
* **Round 1**: Collections & Algorithmic Filtering (DSA & Comprehensions).
* **Round 2**: OOP & Polymorphic System Architecture (Inheritance & Polymorphism).
* **Round 3**: Advanced Decorators & Exception Resilience (Retry Wrappers).
* Passing all 3 rounds unlocks the **Official Placement Offer Letter**!

### 💻 Mode 4: PyCampus Live Sandbox (`/sandbox`)
* Full-featured in-browser code editor with terminal stdout/stderr display.
* Pre-loaded starter templates for all 22 Python concepts for zero-setup experimentation!

### 📜 Mode 5: Official Graduation Certificate (`/certificate`)
* Formally issued by the Department of Computer Science & Software Engineering.
* Features student's custom name, college name, unique verification hash ID, date, and academic seals.
* Print-ready with CSS media print styling for saving directly as PDF!

### 🚪 Mode 6: Code Escape Room (`/escape-room`)
* A five-room progressive Python challenge where students write real code to unlock each door and escape the campus lab.
* **Room 1: Variables & Data Types** — Declare `room_key` (non-empty string) and `door_unlocked = True` to pass keypad verification.
* **Room 2: Type Conversion** — Convert the text code `"75"` to an integer with `int()`, add 25 to reach 100, and store in `access_code`.
* **Room 3: Conditionals** — Use `if`/`elif`/`else` to determine security clearance (`ACCESS GRANTED`, `PENDING REVIEW`, or `ACCESS DENIED`).
* **Room 4: Loops & Iteration** — Use a `for` loop with `range(1, 11)` to sum numbers 1 through 10 into `reactor_power` (total 55).
* **Room 5: Functions** — Write `generate_key(base, multiplier)` returning `base * multiplier`, then call `generate_key(7, 3)` for the final keycode 21.
* Each room includes a working code editor, Run Code button, instant pass/fail verification against the server, progressive hints, door-open animations, XP rewards (+200 per room), and Retry/Next Room/Back to Campus controls.
* Completion is only awarded when the server-side assertion passes — never merely because code ran without an error.

---

## 5. Prerequisites & Requirements
The application runs on standard Python 3.10, 3.11, 3.12, 3.13, or 3.14.

### Contents of `requirements.txt`:
```txt
Flask>=3.0.0
pytest>=8.0.0
requests>=2.31.0
python-dotenv
```

---

## 6. How to Run the Application
## 🚀 Getting Started

Follow these steps to run PyQuest Campus locally on Windows.

### 1. Clone the repository

```powershell
git clone YOUR_GITHUB_REPOSITORY_URL
cd GAMEIFIED_WEBSITE
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your actual GitHub repository URL.

### 2. Create a virtual environment

```powershell
python -m venv .venv
```

### 3. Activate the virtual environment

```powershell
.\.venv\Scripts\Activate.ps1
```

If PowerShell blocks activation, you can run the Python executable directly as shown in Step 5 instead.

### 4. Install dependencies

```powershell
python -m pip install -r requirements.txt
```

### 5. Configure environment variables

Create a `.env` file in the project root:

```env
FLASK_SECRET_KEY=replace_with_a_random_secret
```

Generate a secure secret using Python:

```powershell
python -c "import secrets; print(secrets.token_hex(32))"
```

Copy the generated value into `.env` after `FLASK_SECRET_KEY=`.

**Security:** Never commit or upload `.env` to GitHub. The repository's `.gitignore` should exclude it.

### 6. Run the application

```powershell
python app.py
```

Open your browser and visit:

- **Homepage:** http://127.0.0.1:5000
- **Escape Room:** http://127.0.0.1:5000/escape-room
- **Python Sandbox:** http://127.0.0.1:5000/sandbox
- **Arcade:** http://127.0.0.1:5000/arcade

Press `Ctrl + C` in the terminal to stop the development server.

### 7. Run tests

```powershell
python -m pytest test_app.py -v
```

### Troubleshooting

- **Missing Flask or another package:** Run `python -m pip install -r requirements.txt`.
- **Missing `FLASK_SECRET_KEY`:** Confirm that `.env` exists and that `python-dotenv` is installed.
- **Port 5000 is already in use:** Stop the other process using that port before starting the application again.

**Note:** This is a local development setup. Do not expose the development server publicly without appropriate security hardening.

## 7. Running the Automated Test Suite
To verify the system workflow, API reliability, code runner sandbox, and starter solutions:

```bash
python -m unittest test_app.py
```
Or with pytest:
```bash
pytest test_app.py -v
```

### Verified Test Suite Breakdown:
* **Web Routes (5 tests)**: Confirms Home, Arcade, Boss Battle, Sandbox, and Certificate views return `200 OK`.
* **Curriculum Completeness (3 tests)**: Verifies all 22 required concepts are registered, mapped, and individual routes render correctly.
* **REST API Endpoints (3 tests)**: Verifies `/api/levels`, `/api/level/<id>`, and `/api/leaderboard` JSON structures.
* **Sandbox & Security Guardrails (4 tests)**: Verifies stdout capture, expression evaluation, error recovery, and security blocks against dangerous operations (like `subprocess` or `os.system`).
* **Challenge & Solution Verification (4 tests)**: Confirms level 1 solution passes, invalid solutions fail, all starter codes require student implementation, and all 22 level solutions pass their designated assertions.
* **Boss Battle Verification (1 test)**: Verifies all 3 Technical Interview rounds evaluate cleanly.
* **Total Result**: `20 passed` ✅

---

## 8. Project File Architecture
```
GAMEIFIED_WEBSITE/
├── app.py                  # Core Flask backend with 22 levels, APIs, AST code runner & boss battle
├── requirements.txt        # Python dependency specifications
├── test_app.py             # 20 automated tests validating end-to-end functionality
├── run.bat                 # One-click Windows launcher batch script
├── run.ps1                 # One-click PowerShell launcher script
├── README.md               # Complete platform documentation
├── README.nd               # Identical documentation file as requested
├── static/
│   ├── css/
│   │   └── style.css       # Responsive cyber college styling, glassmorphism, certificate print
│   └── js/
│       ├── audio.js        # Web Audio API 8-bit sound synthesizer (zero external MP3 files)
│       ├── main.js         # Student state, localStorage sync, XP ranks, toast alerts, confetti
│       ├── games.js        # Interactive mini-game engines for all 22 Python concepts
│       └── runner.js       # Live code runner & challenge test assertion validator
└── templates/
    ├── base.html           # Master layout with navbar, audio toggle, and student profile modal
    ├── index.html          # Campus Academic Quest Map & Hall of Fame Leaderboard
    ├── level.html          # Level arena with Mini-Game, Locked Vault, Code Challenge & Quiz
    ├── arcade.html         # Bug Buster 60-second speed challenge with combo multipliers
    ├── boss.html           # Campus Placement Technical Interview 3-Round Simulator
    ├── sandbox.html        # Interactive Python code playground with 22 concept presets
    ├── certificate.html    # Verifiable graduation certificate with custom student name
    ├── escape_room.html    # Five-room Code Escape Room (Variables, Type Conversion, Conditionals, Loops, Functions)
    ├── bug_hunter.html     # Bug Hunter debug mission template
    └── daily_challenge.html# Daily Challenge template
```

---

## 9. Security Sandbox Architecture
The interactive in-browser Python execution engine in `app.py` incorporates safety mechanisms such as:
1. **Restricted Operation Guard**: Prohibits malicious operating system execution attempts (`subprocess`, `os.system`, `shutil.rmtree`).
2. **Standard Output & Error Redirection**: Uses `contextlib.redirect_stdout` and `contextlib.redirect_stderr` to safely capture student prints without leaking to server logs.
3. **AST Compilation & Evaluation**: Distinguishes between multi-statement definitions and final expression evaluation to ensure clean unit testing without external shell overhead.
4. **Execution Timer**: Benchmarks execution latency down to milliseconds.

**Important:** The code runner is intended for local development and classroom use. It has not been hardened as a fully secure, production-grade sandbox. Do not expose the development server publicly or run untrusted code from unknown sources unless proper isolation (containerization, resource limits, network restrictions) has been independently verified.

---

*Engineered with 💙 for College Students & Python Enthusiasts! Happy Coding & Good Luck with Placements!* 🚀
