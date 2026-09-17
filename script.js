"use strict";

/* =========================================================
   DIVI-64 // EXECUTIVE MANAGEMENT
   KANE // EXECUTIVE CORE
   COMPLETE LOCAL ENGINE
   ========================================================= */

/* =========================================================
   UTILITIES
   ========================================================= */

const $ = id => document.getElementById(id);

const STORAGE = {
    FILES: "DIVI64_EM_FILES_FINAL",
    AUDIT: "DIVI64_EM_AUDIT_FINAL",
    DECISIONS: "DIVI64_EM_DECISIONS_FINAL",
    KANE_NAME: "DIVI64_KANE_NAME_FINAL",
    KANE_MEMORY: "DIVI64_KANE_MEMORY_FINAL",
    KANE_SETTINGS: "DIVI64_KANE_SETTINGS_FINAL",
    KANE_EVENTS: "DIVI64_KANE_EVENTS_FINAL",
    BLACKBOX: "DIVI64_KANE_BLACKBOX_FINAL",
    SCENARIOS: "DIVI64_KANE_SCENARIOS_FINAL",
    STATS: "DIVI64_EM_STATS_FINAL",
    PERSONNEL: "DIVI64_EM_PERSONNEL_FINAL"
};

function load(key, fallback) {
    try {
        const value = localStorage.getItem(key);
        return value === null ? fallback : JSON.parse(value);
    } catch {
        return fallback;
    }
}

function save(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {}
}

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function now() {
    return new Date().toLocaleString("en-GB");
}

function uid(prefix = "ID") {
    return `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2,7).toUpperCase()}`;
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function showModal(id) {
    const el = $(id);
    if (el) {
        el.classList.add("open");
        el.style.display = "flex";
    }
}

function hideModal(id) {
    const el = $(id);
    if (el) {
        el.classList.remove("open");
        el.style.display = "none";
    }
}

function notify(title, message) {
    const box = $("notification");
    if (!box) return;

    $("notificationTitle").textContent = title;
    $("notificationMessage").textContent = message;

    box.classList.add("show");

    clearTimeout(window.__notificationTimer);

    window.__notificationTimer = setTimeout(() => {
        box.classList.remove("show");
    }, 4000);
}

/* =========================================================
   EXECUTIVE ACCOUNTS
   ========================================================= */

const ACCOUNTS = {
    LJD: {
        username: "LJD",
        password: "LJD-64",
        title: "LEAD JUDICIAL DIRECTOR",
        clearance: 5,
        authority: 5
    },

    XO: {
        username: "XO",
        password: "XO-64",
        title: "EXECUTIVE OFFICER",
        clearance: 5,
        authority: 5
    },

    CO: {
        username: "CO",
        password: "CO-64",
        title: "COMMANDING OFFICER",
        clearance: 5,
        authority: 5
    },

    COS: {
        username: "COS",
        password: "COS-64",
        title: "COMMANDER SENIOR",
        clearance: 5,
        authority: 6
    }
};

/* =========================================================
   PERSONNEL
   ========================================================= */

const DEFAULT_PERSONNEL = [
    {
        identification: "D-64-0001",
        type: "EXECUTIVE",
        status: "ACTIVE",
        clearance: 5,
        lastAccess: "SYSTEM",
        name: "LEAD JUDICIAL DIRECTOR"
    },
    {
        identification: "D-64-0002",
        type: "EXECUTIVE",
        status: "ACTIVE",
        clearance: 5,
        lastAccess: "SYSTEM",
        name: "EXECUTIVE OFFICER"
    },
    {
        identification: "D-64-0003",
        type: "EXECUTIVE",
        status: "ACTIVE",
        clearance: 5,
        lastAccess: "SYSTEM",
        name: "COMMANDING OFFICER"
    },
    {
        identification: "D-64-0004",
        type: "EXECUTIVE",
        status: "ACTIVE",
        clearance: 5,
        lastAccess: "SYSTEM",
        name: "COMMANDER SENIOR"
    },
    ...Array.from({length: 8}, (_, i) => ({
        identification: `D-64-${String(i + 5).padStart(4, "0")}`,
        type: "PERSONNEL",
        status: "ACTIVE",
        clearance: 1,
        lastAccess: "NOT RECORDED",
        name: `DIVI-64 PERSONNEL ${String(i + 1).padStart(3, "0")}`
    }))
];

/* =========================================================
   DEFAULT FILES
   ========================================================= */

const DEFAULT_FILES = [
    ["EM-001", "Executive Management Charter", "FOUNDATIONAL"],
    ["EM-002", "Executive Authority Protocol", "AUTHORITY"],
    ["EM-003", "Executive Personnel Registry", "PERSONNEL"],
    ["EM-004", "Executive Chain of Command", "COMMAND"],
    ["EM-005", "Executive Voting Protocol", "DECISION"],
    ["EM-006", "Emergency Executive Protocol", "EMERGENCY"],
    ["EM-007", "Executive Security Regulations", "SECURITY"],
    ["EM-008", "Clearance Authority Directive", "CLEARANCE"],
    ["EM-009", "Executive Disciplinary Authority", "DISCIPLINE"],
    ["EM-010", "Executive Communications Protocol", "COMMUNICATIONS"],
    ["EM-011", "Executive Archives Access Directive", "ARCHIVES"],
    ["EM-012", "Executive Succession Directive", "SUCCESSION"]
];

function createDefaultFiles() {
    return DEFAULT_FILES.map(([id, title, category]) => ({
        id,
        title,
        category,
        classification: "DIVI64 // OVERWATCH",
        clearance: 5,
        author: "EXECUTIVE MANAGEMENT",
        created: now(),
        content:
`DIVI-64 // EXECUTIVE MANAGEMENT

DOCUMENT: ${id}
TITLE: ${title}
CATEGORY: ${category}

CLASSIFICATION:
OVERWATCH / CL-5

This executive record is controlled by DIVI-64 Executive Management.

All access, modification and administrative activity is subject
to the Executive Audit System.

END OF DOCUMENT.`
    }));
}

/* =========================================================
   STATE
   ========================================================= */

let currentUser = null;
let currentPage = "dashboard";

let files = load(STORAGE.FILES, null);
let auditLog = load(STORAGE.AUDIT, []);
let decisions = load(STORAGE.DECISIONS, []);
let personnel = load(STORAGE.PERSONNEL, DEFAULT_PERSONNEL);

let kaneName = load(STORAGE.KANE_NAME, "KANE");

let kaneMemory = load(STORAGE.KANE_MEMORY, []);
let kaneSettings = load(STORAGE.KANE_SETTINGS, {
    mode: "EXECUTIVE",
    silent: false,
    autonomy: true,
    context: []
});

let kaneEvents = load(STORAGE.KANE_EVENTS, []);
let blackBox = load(STORAGE.BLACKBOX, []);
let scenarioHistory = load(STORAGE.SCENARIOS, []);

let stats = load(STORAGE.STATS, {
    sessions: 0,
    failedLogins: 0,
    securityEvents: 0,
    commands: 0,
    activeSessions: 0,
    blacklisted: 0
});

if (!Array.isArray(files)) files = createDefaultFiles();
if (!Array.isArray(auditLog)) auditLog = [];
if (!Array.isArray(decisions)) decisions = [];
if (!Array.isArray(personnel)) personnel = DEFAULT_PERSONNEL;
if (!Array.isArray(kaneMemory)) kaneMemory = [];
if (!Array.isArray(kaneEvents)) kaneEvents = [];
if (!Array.isArray(blackBox)) blackBox = [];
if (!Array.isArray(scenarioHistory)) scenarioHistory = [];

if (!kaneSettings || typeof kaneSettings !== "object") {
    kaneSettings = {};
}

if (!Array.isArray(kaneSettings.context)) {
    kaneSettings.context = [];
}

if (typeof kaneSettings.autonomy !== "boolean") {
    kaneSettings.autonomy = true;
}

/* =========================================================
   AUDIT / BLACK BOX
   ========================================================= */

function audit(action, details = "", severity = "INFO") {
    const entry = {
        id: uid("AUD"),
        time: now(),
        user: currentUser ? currentUser.username : "SYSTEM",
        action,
        details,
        severity
    };

    auditLog.unshift(entry);

    if (auditLog.length > 1500) {
        auditLog = auditLog.slice(0, 1500);
    }

    save(STORAGE.AUDIT, auditLog);

    stats.securityEvents++;
    save(STORAGE.STATS, stats);

    blackBox.unshift({
        id: uid("BB"),
        time: now(),
        source: "AUDIT",
        event: action,
        details
    });

    if (blackBox.length > 1000) {
        blackBox = blackBox.slice(0, 1000);
    }

    save(STORAGE.BLACKBOX, blackBox);

    renderAudit();
    renderSecurity();
    updateDashboard();
}

function kaneEvent(type, message, severity = "INFO") {
    const event = {
        id: uid("KANE"),
        time: now(),
        type,
        message,
        severity
    };

    kaneEvents.unshift(event);

    if (kaneEvents.length > 500) {
        kaneEvents = kaneEvents.slice(0, 500);
    }

    save(STORAGE.KANE_EVENTS, kaneEvents);

    blackBox.unshift({
        id: uid("BB"),
        time: now(),
        source: "KANE",
        event: type,
        details: message
    });

    save(STORAGE.BLACKBOX, blackBox);

    renderKaneMonitor();
}

/* =========================================================
   CLOCK
   ========================================================= */

function startClock() {
    const update = () => {
        const clock = $("terminalClock");

        if (clock) {
            clock.textContent = new Date().toLocaleTimeString("en-GB");
        }
    };

    update();

    if (!window.__clockStarted) {
        window.__clockStarted = true;
        setInterval(update, 1000);
    }
}

/* =========================================================
   BOOT
   ========================================================= */

function boot() {
    const screen = $("bootScreen");

    if (!screen) {
        init();
        return;
    }

    screen.style.display = "flex";

    const status = $("bootStatus");
    const progress = $("bootProgress");
    const log = $("bootLog");

    const steps = [
        "INITIALIZING EXECUTIVE CORE",
        "LOADING DIVI-64 CONTROL SYSTEM",
        "VERIFYING EXECUTIVE AUTHORITY",
        "INITIALIZING KANE",
        "LOADING CLASSIFIED ARCHIVES",
        "STARTING EXECUTIVE TERMINAL",
        "SYSTEM READY"
    ];

    let i = 0;

    function next() {
        if (i >= steps.length) {
            if (progress) progress.style.width = "100%";
            if (status) status.textContent = "SYSTEM READY";

            setTimeout(() => {
                screen.style.display = "none";

                const login = $("loginScreen");

                if (login) {
                    login.style.display = "flex";
                }

                init();
            }, 350);

            return;
        }

        const message = steps[i];

        if (status) {
            status.textContent = message;
        }

        if (progress) {
            progress.style.width =
                `${Math.round(((i + 1) / steps.length) * 100)}%`;
        }

        if (log) {
            const line = document.createElement("div");
            line.textContent = `[OK] ${message}`;
            log.appendChild(line);
        }

        i++;

        setTimeout(next, 250);
    }

    next();
}

/* =========================================================
   LOGIN
   ========================================================= */

function attemptLogin() {
    const username = $("loginUsername")?.value.trim().toUpperCase();
    const password = $("loginPassword")?.value;

    const error = $("loginError");

    if (!username || !password) {
        if (error) error.textContent = "EXECUTIVE CREDENTIALS REQUIRED.";
        return;
    }

    const account = ACCOUNTS[username];

    if (!account || account.password !== password) {
        stats.failedLogins++;
        save(STORAGE.STATS, stats);

        audit(
            "FAILED LOGIN",
            `Authentication failure for ${username}`,
            "WARNING"
        );

        if (error) {
            error.textContent = "INVALID EXECUTIVE CREDENTIALS.";
        }

        return;
    }

    currentUser = {...account};

    stats.sessions++;
    stats.activeSessions = 1;

    save(STORAGE.STATS, stats);

    audit(
        "EXECUTIVE LOGIN",
        `${account.username} authenticated as ${account.title}`
    );

    if ($("loginScreen")) {
        $("loginScreen").style.display = "none";
    }

    if ($("sessionScreen")) {
        $("sessionScreen").style.display = "flex";
    }

    if ($("sessionGreeting")) {
        $("sessionGreeting").textContent =
            `AUTHENTICATED: ${account.title} // SELECT EXECUTIVE SESSION`;
    }

    if ($("loginError")) {
        $("loginError").textContent = "";
    }

    $("loginPassword").value = "";

    notify(
        "AUTHENTICATION ACCEPTED",
        `${account.username} executive credentials verified.`
    );
}

/* =========================================================
   SESSION
   ========================================================= */

function selectSession(code) {
    if (!currentUser || !ACCOUNTS[code]) return;

    const session = ACCOUNTS[code];

    if (currentUser.username !== code) {
        if (code === "COS" && currentUser.username !== "COS") {
            $("sessionError").textContent =
                "SESSION DENIED. COS AUTHORITY REQUIRES COS CREDENTIALS.";
            audit(
                "SESSION DENIED",
                `${currentUser.username} attempted COS session`,
                "WARNING"
            );
            return;
        }

        $("sessionError").textContent =
            "SESSION AUTHORITY DOES NOT MATCH AUTHENTICATED ID.";
        return;
    }

    currentUser.session = code;

    if ($("sessionScreen")) {
        $("sessionScreen").style.display = "none";
    }

    if ($("mainApp")) {
        $("mainApp").style.display = "flex";
    }

    updateHeader();
    updateDashboard();
    renderPersonnel();
    renderArchives();
    renderOperations("active");
    renderSecurity("sessions");
    renderDecisions();
    renderAudit();
    updateKaneUI();
    renderKaneMonitor();

    terminalWrite(
        `DIVI-64 EXECUTIVE TERMINAL READY.\n` +
        `SESSION: ${currentUser.username}\n` +
        `AUTHORITY: ${currentUser.authority}\n` +
        `CLEARANCE: CL-${currentUser.clearance}\n` +
        `TYPE "help" FOR AVAILABLE COMMANDS.`
    );

    kaneAddMessage(
        `Executive session established. Welcome, ${currentUser.title}.`,
        "KANE"
    );

    audit(
        "SESSION ESTABLISHED",
        `${currentUser.username} established ${code} executive session`
    );

    notify(
        "SESSION ESTABLISHED",
        `${code} // CL-${currentUser.clearance}`
    );
}

/* =========================================================
   HEADER
   ========================================================= */

function updateHeader() {
    if (!currentUser) return;

    if ($("headerUser")) {
        $("headerUser").textContent =
            `${currentUser.username} // ${currentUser.title}`;
    }

    if ($("headerClearance")) {
        $("headerClearance").textContent =
            `CL-${currentUser.clearance}`;
    }

    if ($("terminalSessionLabel")) {
        $("terminalSessionLabel").textContent =
            `${currentUser.username} // CL-${currentUser.clearance}`;
    }

    if ($("kaneSession")) {
        $("kaneSession").textContent =
            `${currentUser.username} // AUTHORIZED`;
    }
}

/* =========================================================
   NAVIGATION
   ========================================================= */

function navigate(page) {
    if (!currentUser) return;

    document.querySelectorAll(".page").forEach(p => {
        p.classList.remove("active");
    });

    document.querySelectorAll(".navButton[data-page]").forEach(btn => {
        btn.classList.remove("active");
    });

    const target = $(`page-${page}`);

    if (!target) return;

    target.classList.add("active");

    const nav = document.querySelector(
        `.navButton[data-page="${page}"]`
    );

    if (nav) nav.classList.add("active");

    currentPage = page;

    if (page === "dashboard") updateDashboard();
    if (page === "personnel") renderPersonnel();
    if (page === "archives") renderArchives();
    if (page === "security") renderSecurity();
    if (page === "audit") renderAudit();
    if (page === "decisions") renderDecisions();
    if (page === "kane") updateKaneUI();
}

/* =========================================================
   DASHBOARD
   ========================================================= */

function updateDashboard() {
    const set = (id, value) => {
        const el = $(id);
        if (el) el.textContent = value;
    };

    set("dashboardPersonnel", personnel.length);
    set("dashboardSessions", stats.activeSessions || 0);
    set("dashboardBlacklist",
        personnel.filter(p => p.status === "BLACKLISTED").length
    );
    set("dashboardSecurity", stats.securityEvents || 0);

    set("securitySessions", stats.activeSessions || 0);
    set("securityFailedLogins", stats.failedLogins || 0);
    set("securityLockedAccounts",
        personnel.filter(p => p.status === "LOCKED").length
    );
    set("securityEvents", stats.securityEvents || 0);
}

/* =========================================================
   PERSONNEL
   ========================================================= */

function renderPersonnel() {
    const table = $("personnelTable");
    if (!table) return;

    const query =
        ($("personnelSearch")?.value || "").toLowerCase();

    const filter =
        $("personnelFilter")?.value || "ALL";

    const result = personnel.filter(person => {

        const matchesSearch =
            !query ||
            person.identification.toLowerCase().includes(query) ||
            person.type.toLowerCase().includes(query) ||
            person.status.toLowerCase().includes(query) ||
            person.name.toLowerCase().includes(query);

        const matchesFilter =
            filter === "ALL" ||
            person.status === filter;

        return matchesSearch && matchesFilter;
    });

    table.innerHTML = result.map(person => `
        <tr>
            <td>${escapeHTML(person.identification)}</td>
            <td>${escapeHTML(person.type)}</td>
            <td>${escapeHTML(person.status)}</td>
            <td>CL-${escapeHTML(person.clearance)}</td>
            <td>${escapeHTML(person.lastAccess)}</td>
            <td>
                <button
                    class="smallButton personnelView"
                    data-id="${escapeHTML(person.identification)}">
                    VIEW
                </button>
            </td>
        </tr>
    `).join("");

    table.querySelectorAll(".personnelView").forEach(btn => {
        btn.addEventListener("click", () => {
            viewPersonnel(btn.dataset.id);
        });
    });
}

function viewPersonnel(id) {
    const person = personnel.find(
        p => p.identification === id
    );

    if (!person) return;

    showModal("aiPanel");

    $("aiPanelTitle").textContent =
        `PERSONNEL // ${person.identification}`;

    $("aiPanelContent").innerHTML = `
        <strong>${escapeHTML(person.name)}</strong>

        <br><br>

        IDENTIFICATION:
        ${escapeHTML(person.identification)}

        <br>

        TYPE:
        ${escapeHTML(person.type)}

        <br>

        STATUS:
        ${escapeHTML(person.status)}

        <br>

        CLEARANCE:
        CL-${escapeHTML(person.clearance)}

        <br>

        LAST ACCESS:
        ${escapeHTML(person.lastAccess)}

        <br><br>

        <button
            class="smallButton"
            onclick="changePersonnelStatus('${escapeHTML(person.identification)}')">
            CHANGE STATUS
        </button>

        <button
            class="smallButton"
            onclick="changePersonnelClearance('${escapeHTML(person.identification)}')">
            CHANGE CLEARANCE
        </button>
    `;

    audit(
        "PERSONNEL RECORD VIEW",
        `Viewed personnel ${id}`
    );
}

function changePersonnelStatus(id) {
    if (!currentUser || currentUser.authority < 5) {
        notify("ACCESS DENIED", "Insufficient executive authority.");
        return;
    }

    const person = personnel.find(p => p.identification === id);
    if (!person) return;

    const value = prompt(
        "ENTER STATUS: ACTIVE / SUSPENDED / LOCKED / TERMINATED / BLACKLISTED"
    );

    if (!value) return;

    const status = value.trim().toUpperCase();

    const allowed = [
        "ACTIVE",
        "SUSPENDED",
        "LOCKED",
        "TERMINATED",
        "BLACKLISTED"
    ];

    if (!allowed.includes(status)) {
        notify("INVALID STATUS", "Status not recognized.");
        return;
    }

    person.status = status;
    person.lastAccess = now();

    save(STORAGE.PERSONNEL, personnel);

    audit(
        "PERSONNEL STATUS CHANGE",
        `${id}: ${status}`
    );

    renderPersonnel();
    updateDashboard();
    notify("PERSONNEL UPDATED", `${id} → ${status}`);
}

function changePersonnelClearance(id) {
    if (!currentUser || currentUser.authority < 5) {
        notify("ACCESS DENIED", "Insufficient executive authority.");
        return;
    }

    const person = personnel.find(p => p.identification === id);
    if (!person) return;

    const level = Number(
        prompt("ENTER NEW CLEARANCE LEVEL: 0-5")
    );

    if (!Number.isInteger(level) || level < 0 || level > 5) {
        notify("INVALID CLEARANCE", "Use a level from 0 to 5.");
        return;
    }

    if (level === 5 && currentUser.username !== "COS") {
        notify(
            "AUTHORITY DENIED",
            "Only COS may directly grant CL-5."
        );
        audit(
            "CLEARANCE CHANGE DENIED",
            `${currentUser.username} attempted CL-5 assignment`,
            "WARNING"
        );
        return;
    }

    const previous = person.clearance;

    person.clearance = level;
    person.lastAccess = now();

    save(STORAGE.PERSONNEL, personnel);

    audit(
        "CLEARANCE CHANGE",
        `${id}: CL-${previous} → CL-${level}`
    );

    renderPersonnel();

    notify(
        "CLEARANCE UPDATED",
        `${id} → CL-${level}`
    );
}

/* =========================================================
   ARCHIVES
   ========================================================= */

function renderArchives() {
    const list = $("archiveList");
    if (!list) return;

    const query =
        ($("archiveSearch")?.value || "").toLowerCase();

    const result = files.filter(file => {
        return !query ||
            file.id.toLowerCase().includes(query) ||
            file.title.toLowerCase().includes(query) ||
            file.category.toLowerCase().includes(query);
    });

    list.innerHTML = result.map(file => `
        <div class="archiveItem">

            <div class="archiveInfo">
                <strong>${escapeHTML(file.id)} // ${escapeHTML(file.title)}</strong>

                <span>
                    ${escapeHTML(file.category)}
                    //
                    ${escapeHTML(file.author)}
                </span>
            </div>

            <div class="archiveMeta">
                CL-${escapeHTML(file.clearance)}
            </div>

            <button
                class="smallButton archiveOpen"
                data-id="${escapeHTML(file.id)}">
                OPEN
            </button>

        </div>
    `).join("");

    list.querySelectorAll(".archiveOpen").forEach(btn => {
        btn.addEventListener("click", () => {
            openFile(btn.dataset.id);
        });
    });
}

function openFile(id) {
    const file = files.find(f => f.id === id);

    if (!file) {
        notify("ARCHIVE ERROR", "File not found.");
        return;
    }

    if (!currentUser || currentUser.clearance < file.clearance) {
        audit(
            "ARCHIVE ACCESS DENIED",
            `${id} requires CL-${file.clearance}`,
            "WARNING"
        );

        notify(
            "ACCESS DENIED",
            `CL-${file.clearance} required.`
        );

        return;
    }

    $("fileModalTitle").textContent =
        `${file.id} // ${file.title}`;

    $("fileModalContent").textContent =
        `${file.content}\n\n` +
        `AUTHOR: ${file.author}\n` +
        `CREATED: ${file.created}\n` +
        `CLASSIFICATION: ${file.classification}`;

    showModal("fileModal");

    audit(
        "ARCHIVE ACCESS",
        `Opened ${id}`
    );
}

function createRecord() {
    if (!currentUser || currentUser.authority < 5) {
        notify(
            "ACCESS DENIED",
            "Executive authority required."
        );
        return;
    }

    showModal("recordModal");
}

function saveRecord(event) {
    event.preventDefault();

    const title = $("recordTitle").value.trim();
    const subject = $("recordSubject").value.trim();
    const content = $("recordContent").value.trim();

    if (!title || !content) return;

    const record = {
        id: uid("EM"),
        title,
        category: subject || "EXECUTIVE RECORD",
        classification: "DIVI64 // OVERWATCH",
        clearance: 5,
        author: currentUser.username,
        created: now(),
        content
    };

    files.unshift(record);

    save(STORAGE.FILES, files);

    audit(
        "EXECUTIVE RECORD CREATED",
        `${record.id} // ${title}`
    );

    $("recordForm").reset();
    hideModal("recordModal");

    renderArchives();

    notify(
        "RECORD CREATED",
        `${record.id} registered successfully.`
    );
}

/* =========================================================
   OPERATIONS
   ========================================================= */

function renderOperations(mode = "active") {
    const container = $("operationsContent");
    if (!container) return;

    const data = {
        active: [
            [
                "EXECUTIVE MANAGEMENT",
                "CENTRAL AUTHORITY",
                "ACTIVE"
            ],
            [
                "KANE CORE",
                "EXECUTIVE INTELLIGENCE",
                "ACTIVE"
            ]
        ],

        planned: [
            [
                "EXECUTIVE REVIEW",
                "PERIODIC SYSTEM REVIEW",
                "PLANNED"
            ],
            [
                "ARCHIVE AUDIT",
                "CLASSIFIED ARCHIVE REVIEW",
                "PLANNED"
            ]
        ],

        completed: [
            [
                "SYSTEM INITIALIZATION",
                "DIVI-64 EM INITIAL DEPLOYMENT",
                "COMPLETED"
            ]
        ]
    };

    container.innerHTML = data[mode].map(item => `
        <div class="operationCard">
            <strong>${escapeHTML(item[0])}</strong>
            <span>
                ${escapeHTML(item[1])}
                <br>
                STATUS: ${escapeHTML(item[2])}
            </span>
        </div>
    `).join("");
}

/* =========================================================
   SECURITY
   ========================================================= */

function renderSecurity(tab = "sessions") {
    updateDashboard();

    const container = $("securityContent");
    if (!container) return;

    let html = "";

    if (tab === "sessions") {
        html = `
            <div class="securityItem">
                <strong>ACTIVE EXECUTIVE SESSION</strong>
                <span>
                    ${currentUser
                        ? `${escapeHTML(currentUser.username)} // ${escapeHTML(currentUser.title)}`
                        : "NONE"}
                </span>
            </div>
        `;
    }

    if (tab === "login-history") {
        const logs = auditLog.filter(
            x => x.action.includes("LOGIN")
        );

        html = logs.slice(0, 100).map(x => `
            <div class="securityItem">
                <strong>${escapeHTML(x.action)}</strong>
                <span>
                    ${escapeHTML(x.time)}
                    //
                    ${escapeHTML(x.user)}
                    <br>
                    ${escapeHTML(x.details)}
                </span>
            </div>
        `).join("") || `<div class="securityItem">NO LOGIN RECORDS.</div>`;
    }

    if (tab === "access-denials") {
        const logs = auditLog.filter(
            x =>
                x.action.includes("DENIED") ||
                x.severity === "WARNING"
        );

        html = logs.slice(0, 100).map(x => `
            <div class="securityItem">
                <strong>${escapeHTML(x.action)}</strong>
                <span>
                    ${escapeHTML(x.time)}
                    //
                    ${escapeHTML(x.details)}
                </span>
            </div>
        `).join("") || `<div class="securityItem">NO ACCESS DENIALS.</div>`;
    }

    if (tab === "events") {
        html = auditLog.slice(0, 100).map(x => `
            <div class="securityItem">
                <strong>${escapeHTML(x.action)}</strong>
                <span>
                    ${escapeHTML(x.time)}
                    //
                    ${escapeHTML(x.severity)}
                    <br>
                    ${escapeHTML(x.details)}
                </span>
            </div>
        `).join("");
    }

    if (tab === "clearance") {
        const logs = auditLog.filter(
            x => x.action.includes("CLEARANCE")
        );

        html = logs.slice(0, 100).map(x => `
            <div class="securityItem">
                <strong>${escapeHTML(x.action)}</strong>
                <span>
                    ${escapeHTML(x.time)}
                    //
                    ${escapeHTML(x.details)}
                </span>
            </div>
        `).join("") || `<div class="securityItem">NO CLEARANCE CHANGES.</div>`;
    }

    container.innerHTML = html;
}

/* =========================================================
   DECISIONS
   ========================================================= */

function newDecision() {
    if (!currentUser || currentUser.authority < 5) {
        notify(
            "ACCESS DENIED",
            "Executive authority required."
        );
        return;
    }

    showModal("decisionModal");
}

function saveDecision(event) {
    event.preventDefault();

    const title = $("decisionTitle").value.trim();
    const proposal = $("decisionProposal").value.trim();
    const rationale = $("decisionRationale").value.trim();

    if (!title || !proposal) return;

    const decision = {
        id: uid("DEC"),
        title,
        proposal,
        rationale,
        author: currentUser.username,
        status: "REGISTERED",
        created: now(),
        votes: {}
    };

    decisions.unshift(decision);

    save(STORAGE.DECISIONS, decisions);

    audit(
        "EXECUTIVE DECISION CREATED",
        `${decision.id} // ${title}`
    );

    $("decisionForm").reset();
    hideModal("decisionModal");

    renderDecisions();

    notify(
        "DECISION REGISTERED",
        decision.id
    );
}

function renderDecisions() {
    const list = $("decisionsList");
    if (!list) return;

    if (!decisions.length) {
        list.innerHTML =
            `<div class="decisionItem">NO EXECUTIVE DECISIONS REGISTERED.</div>`;
        return;
    }

    list.innerHTML = decisions.map(decision => `
        <div class="decisionItem">

            <div class="decisionHeader">
                <div class="decisionTitle">
                    ${escapeHTML(decision.id)}
                    //
                    ${escapeHTML(decision.title)}
                </div>

                <div class="decisionStatus">
                    ${escapeHTML(decision.status)}
                </div>
            </div>

            <div class="decisionBody">
                ${escapeHTML(decision.proposal)}
            </div>

            ${
                decision.rationale
                ? `<div class="decisionBody">
                    RATIONALE:
                    ${escapeHTML(decision.rationale)}
                   </div>`
                : ""
            }

            <div class="decisionMeta">
                AUTHOR:
                ${escapeHTML(decision.author)}
                //
                ${escapeHTML(decision.created)}
            </div>

        </div>
    `).join("");
}

/* =========================================================
   AUDIT
   ========================================================= */

function renderAudit() {
    const list = $("auditList");
    if (!list) return;

    list.innerHTML = auditLog.slice(0, 300).map(entry => `
        <div class="auditItem">

            <div class="auditTime">
                ${escapeHTML(entry.time)}
            </div>

            <div class="auditUser">
                ${escapeHTML(entry.user)}
            </div>

            <div class="auditAction">
                <span class="auditSeverity ${entry.severity.toLowerCase()}">
                    ${escapeHTML(entry.severity)}
                </span>
                <br>
                ${escapeHTML(entry.action)}
            </div>

            <div class="auditDetails">
                ${escapeHTML(entry.details)}
            </div>

        </div>
    `).join("");
}

/* =========================================================
   TERMINAL
   ========================================================= */

function terminalWrite(message, type = "response") {
    const output = $("terminalOutput");
    if (!output) return;

    const div = document.createElement("div");

    div.className =
        type === "command"
            ? "terminalLine terminalCommand"
            : "terminalLine terminalResponse";

    div.textContent = message;

    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
}

function terminalCommand(command) {
    terminalWrite(
        `EM@DIVI64:~$ ${command}`,
        "command"
    );
}

function terminalHelp() {
    terminalWrite(`
AVAILABLE EXECUTIVE COMMANDS

help
clear
status
system
whoami
archives
open <ID>
search <TERM>
personnel
directives
operations
security
decisions
audit
blackbox
kane
ask <QUERY>
analyze <ID>
summarize <ID>
briefing
scenario
observer
phantom
diagnostics
create
logout

RESTRICTED / AUTHORITY DEPENDENT

blacklist <ID>
clearance <ID>
rename-kane <NAME>
killswitch
autonomy
`.trim());
}

function terminalStatus() {
    terminalWrite(`
DIVI-64 STATUS

MAINFRAME: ONLINE
AUTHENTICATION: ONLINE
AUDIT ENGINE: ONLINE
ACCESS CONTROL: ACTIVE
ARCHIVE SYSTEM: ONLINE
KANE CORE: ${kaneSettings.autonomy ? "AUTONOMOUS" : "STANDBY"}

SESSION:
${currentUser.username}

CLEARANCE:
CL-${currentUser.clearance}

AUTHORITY:
${currentUser.authority}
`.trim());
}

function terminalSystem() {
    terminalWrite(`
DIVI-64 // EXECUTIVE MANAGEMENT

FILES: ${files.length}
PERSONNEL: ${personnel.length}
DECISIONS: ${decisions.length}
AUDIT ENTRIES: ${auditLog.length}
KANE EVENTS: ${kaneEvents.length}
BLACK BOX ENTRIES: ${blackBox.length}

STORAGE: LOCAL
BACKEND: NONE
EXECUTIVE CORE: ACTIVE
`.trim());
}

function terminalArchives() {
    terminalWrite(
        files.map(
            f => `${f.id} // ${f.title} // CL-${f.clearance}`
        ).join("\n")
    );
}

function terminalSearch(term) {
    if (!term) {
        terminalWrite("SEARCH TERM REQUIRED.");
        return;
    }

    const q = term.toLowerCase();

    const results = files.filter(
        f =>
            f.id.toLowerCase().includes(q) ||
            f.title.toLowerCase().includes(q) ||
            f.category.toLowerCase().includes(q) ||
            f.content.toLowerCase().includes(q)
    );

    terminalWrite(
        results.length
            ? results.map(
                f => `${f.id} // ${f.title}`
              ).join("\n")
            : "NO MATCHING RECORDS."
    );
}

function terminalPersonnel() {
    terminalWrite(
        personnel.map(
            p =>
                `${p.identification} // ${p.status} // CL-${p.clearance}`
        ).join("\n")
    );
}

function terminalDirectives() {
    terminalWrite(
        files
            .filter(f =>
                f.category === "AUTHORITY" ||
                f.category === "COMMAND" ||
                f.category === "DECISION"
            )
            .map(f => `${f.id} // ${f.title}`)
            .join("\n")
    );
}

function terminalAudit() {
    terminalWrite(
        auditLog.slice(0, 30).map(
            x =>
                `${x.time} // ${x.user} // ${x.action} // ${x.details}`
        ).join("\n") || "NO AUDIT RECORDS."
    );
}

function terminalBlackbox() {
    if (!currentUser || currentUser.authority < 5) {
        terminalWrite("ACCESS DENIED.");
        return;
    }

    terminalWrite(
        blackBox.slice(0, 50).map(
            x =>
                `${x.time} // ${x.source} // ${x.event} // ${x.details}`
        ).join("\n") || "BLACK BOX EMPTY."
    );

    audit("BLACK BOX ACCESS", "Executive black box accessed");
}

function terminalAnalyze(id) {
    const file = files.find(f => f.id === id);

    if (!file) {
        terminalWrite("FILE NOT FOUND.");
        return;
    }

    if (currentUser.clearance < file.clearance) {
        terminalWrite("ACCESS DENIED.");
        audit(
            "AI FILE ANALYSIS DENIED",
            id,
            "WARNING"
        );
        return;
    }

    terminalWrite(`
KANE ANALYSIS

DOCUMENT:
${file.id}

TITLE:
${file.title}

CATEGORY:
${file.category}

CLASSIFICATION:
CL-${file.clearance}

AUTHOR:
${file.author}

ASSESSMENT:
Document appears consistent with DIVI-64 executive archive structure.

SECURITY:
No external execution capability detected.

STATUS:
VALID EXECUTIVE RECORD.
`.trim());

    audit(
        "KANE FILE ANALYSIS",
        id
    );
}

function terminalSummarize(id) {
    const file = files.find(f => f.id === id);

    if (!file) {
        terminalWrite("FILE NOT FOUND.");
        return;
    }

    if (currentUser.clearance < file.clearance) {
        terminalWrite("ACCESS DENIED.");
        return;
    }

    terminalWrite(`
${file.id} // SUMMARY

${file.title}

${file.category}

${file.content.slice(0, 700)}
`.trim());

    audit(
        "KANE FILE SUMMARY",
        id
    );
}

function processCommand(raw) {
    const command = raw.trim();

    if (!command) return;

    stats.commands++;
    save(STORAGE.STATS, stats);

    terminalCommand(command);

    audit(
        "TERMINAL COMMAND",
        command
    );

    const parts = command.split(/\s+/);
    const base = parts.shift().toLowerCase();
    const argument = parts.join(" ").trim();

    switch (base) {

        case "help":
            terminalHelp();
            break;

        case "clear":
            $("terminalOutput").innerHTML = "";
            break;

        case "status":
            terminalStatus();
            break;

        case "system":
            terminalSystem();
            break;

        case "whoami":
            terminalWrite(
                `${currentUser.username} // ${currentUser.title} // CL-${currentUser.clearance} // AUTH-${currentUser.authority}`
            );
            break;

        case "archives":
            terminalArchives();
            break;

        case "open":
            if (argument) openFile(argument.toUpperCase());
            else terminalWrite("FILE ID REQUIRED.");
            break;

        case "search":
            terminalSearch(argument);
            break;

        case "personnel":
            terminalPersonnel();
            break;

        case "directives":
            terminalDirectives();
            break;

        case "operations":
            navigate("operations");
            terminalWrite("OPERATIONS MODULE OPENED.");
            break;

        case "security":
            navigate("security");
            terminalWrite("SECURITY MODULE OPENED.");
            break;

        case "decisions":
            navigate("decisions");
            terminalWrite("DECISION MODULE OPENED.");
            break;

        case "audit":
            terminalAudit();
            break;

        case "blackbox":
            terminalBlackbox();
            break;

        case "kane":
            navigate("kane");
            terminalWrite(`${kaneName} // EXECUTIVE AI CORE ONLINE.`);
            break;

        case "ask":
            if (argument) kaneAsk(argument);
            else terminalWrite("QUERY REQUIRED.");
            break;

        case "analyze":
            if (argument) terminalAnalyze(argument.toUpperCase());
            else terminalWrite("FILE ID REQUIRED.");
            break;

        case "summarize":
            if (argument) terminalSummarize(argument.toUpperCase());
            else terminalWrite("FILE ID REQUIRED.");
            break;

        case "briefing":
            generateBriefing();
            break;

        case "scenario":
            runScenario();
            break;

        case "observer":
            openObserver();
            break;

        case "phantom":
            openPhantom();
            break;

        case "diagnostics":
            diagnostics();
            break;

        case "create":
            createRecord();
            break;

        case "blacklist":
            blacklistPersonnel(argument);
            break;

        case "clearance":
            changePersonnelClearance(argument);
            break;

        case "rename-kane":
            renameKane(argument);
            break;

        case "killswitch":
            openKillswitch();
            break;

        case "autonomy":
            toggleAutonomy();
            break;

        case "logout":
            logout();
            break;

        default:
            terminalWrite(
                `UNKNOWN COMMAND: ${base}\nTYPE "help" FOR COMMANDS.`
            );
    }
}

/* =========================================================
   BLACKLIST
   ========================================================= */

function blacklistPersonnel(id) {
    if (!currentUser || currentUser.clearance < 4) {
        notify(
            "ACCESS DENIED",
            "CL-4 required."
        );
        return;
    }

    const person = personnel.find(
        p => p.identification.toUpperCase() === id.toUpperCase()
    );

    if (!person) {
        terminalWrite("PERSONNEL RECORD NOT FOUND.");
        return;
    }

    if (currentUser.clearance < 5) {
        terminalWrite(
            "BLACKLIST REQUEST REGISTERED. CL-5 EXECUTIVE APPROVAL REQUIRED."
        );

        audit(
            "BLACKLIST REQUEST",
            `${person.identification} requested by ${currentUser.username}`,
            "WARNING"
        );

        return;
    }

    person.status = "BLACKLISTED";
    stats.blacklisted++;

    save(STORAGE.PERSONNEL, personnel);
    save(STORAGE.STATS, stats);

    audit(
        "BLACKLIST EXECUTED",
        `${person.identification} blacklisted`,
        "CRITICAL"
    );

    renderPersonnel();
    updateDashboard();

    terminalWrite(
        `${person.identification} // BLACKLISTED`
    );
}

/* =========================================================
   KANE MEMORY
   ========================================================= */

function rememberKane(role, message) {
    kaneMemory.push({
        time: now(),
        role,
        message
    });

    if (kaneMemory.length > 50) {
        kaneMemory = kaneMemory.slice(-50);
    }

    kaneSettings.context.push({
        role,
        message
    });

    if (kaneSettings.context.length > 20) {
        kaneSettings.context =
            kaneSettings.context.slice(-20);
    }

    save(STORAGE.KANE_MEMORY, kaneMemory);
    save(STORAGE.KANE_SETTINGS, kaneSettings);

    updateKaneUI();
}

/* =========================================================
   KANE CONVERSATION
   ========================================================= */

function kaneAddMessage(message, sender = "KANE") {
    const container = $("kaneConversation");
    if (!container) return;

    const div = document.createElement("div");

    div.className =
        sender === "KANE"
            ? "kaneMessage"
            : "userMessage";

    div.innerHTML = `
        <span class="${sender === "KANE" ? "kaneMessageLabel" : "userMessageLabel"}">
            ${escapeHTML(sender)}
        </span>
        ${escapeHTML(message)}
    `;

    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

async function kaneAsk(query) {
    if (!currentUser) return;

    kaneAddMessage(query, currentUser.username);
    rememberKane("user", query);

    const processing = $("kaneProcessing");

    if (processing) {
        processing.style.display = "block";
    }

    if ($("kaneProcessingStatus")) {
        $("kaneProcessingStatus").textContent = "PROCESSING";
    }

    if ($("kaneProcessingBar")) {
        $("kaneProcessingBar").style.width = "0%";
    }

    for (let i = 0; i <= 100; i += 20) {
        await delay(60);

        if ($("kaneProcessingBar")) {
            $("kaneProcessingBar").style.width = `${i}%`;
        }
    }

    const response = kaneResponse(query);

    kaneAddMessage(response, kaneName);
    rememberKane("assistant", response);

    if (processing) {
        processing.style.display = "none";
    }

    if ($("kaneProcessingStatus")) {
        $("kaneProcessingStatus").textContent = "STANDBY";
    }

    kaneEvent(
        "CONVERSATION",
        `${currentUser.username} queried KANE`
    );

    audit(
        "KANE RESPONSE",
        query
    );
}

function kaneResponse(query) {
    const q = query.toLowerCase();

    if (
        q.includes("online") ||
        q.includes("online?")
    ) {
        return `Online, ${currentUser.username}. All executive modules currently report available.`;
    }

    if (q.includes("who are you") || q.includes("what are you")) {
        return `I am ${kaneName}, the DIVI-64 Executive Intelligence Core. My authority is subordinate to the active executive session.`;
    }

    if (q.includes("status")) {
        return `Mainframe online. Archive system operational. Audit engine active. Executive session ${currentUser.username} is authenticated at CL-${currentUser.clearance}.`;
    }

    if (q.includes("clearance")) {
        return `Your active clearance is CL-${currentUser.clearance}. Executive authority level: ${currentUser.authority}.`;
    }

    if (q.includes("memory")) {
        return `Current executive context contains ${kaneSettings.context.length} entries.`;
    }

    if (q.includes("archive") || q.includes("archives")) {
        return `The archive contains ${files.length} accessible executive records. Use "archives" or "search <term>" from the terminal.`;
    }

    if (q.includes("personnel")) {
        return `The personnel registry currently contains ${personnel.length} records.`;
    }

    if (q.includes("audit")) {
        return `The audit engine contains ${auditLog.length} recorded events.`;
    }

    if (q.includes("decision")) {
        return `There are currently ${decisions.length} registered executive decisions.`;
    }

    if (q.includes("help")) {
        return `I can interpret executive status, archives, personnel, security, audit activity and terminal functions. You may also use "help" in the executive terminal.`;
    }

    if (
        q.includes("teto") &&
        currentUser.username === "CO"
    ) {
        return `The requested designation can be applied through the authorized rename function.`;
    }

    return `Query received. I can process that within the current executive context, but no dedicated operational interpretation is available for that request.`;
}

/* =========================================================
   KANE UI
   ========================================================= */

function updateKaneUI() {
    const name = $("kaneName");

    if (name) {
        name.textContent = kaneName;
    }

    if ($("kaneCoreStatus")) {
        $("kaneCoreStatus").textContent =
            kaneSettings.autonomy ? "ONLINE" : "STANDBY";
    }

    if ($("kaneMemoryStatus")) {
        $("kaneMemoryStatus").textContent =
            kaneMemory.length ? "ACTIVE" : "EMPTY";
    }

    if ($("kaneContextCount")) {
        $("kaneContextCount").textContent =
            kaneSettings.context.length;
    }

    if ($("kaneAuditStatus")) {
        $("kaneAuditStatus").textContent = "ACTIVE";
    }

    if ($("kaneSession")) {
        $("kaneSession").textContent =
            currentUser
                ? `${currentUser.username} // AUTHORIZED`
                : "NONE";
    }
}

function renderKaneMonitor() {
    const log = $("kaneMonitorLog");
    if (!log) return;

    const latest = kaneEvents.slice(0, 20);

    log.innerHTML = latest.map(event => `
        <div>
            [${escapeHTML(event.time)}]
            ${escapeHTML(event.type)}
            //
            ${escapeHTML(event.message)}
        </div>
    `).join("");

    if ($("kaneMonitorStatus")) {
        $("kaneMonitorStatus").textContent =
            kaneSettings.autonomy
                ? "MONITOR ONLINE"
                : "MONITOR STANDBY";
    }

    if ($("kaneMonitorDetail")) {
        $("kaneMonitorDetail").textContent =
            latest.length
                ? `LATEST EVENT: ${latest[0].type}`
                : "NO ACTIVE EVENTS";
    }
}

/* =========================================================
   KANE NAME
   ========================================================= */

function renameKane(newName) {
    if (!currentUser || currentUser.username !== "CO") {
        notify(
            "AUTHORITY DENIED",
            "Only CO may change KANE's designation."
        );

        audit(
            "KANE RENAME DENIED",
            currentUser
                ? currentUser.username
                : "UNAUTHENTICATED",
            "WARNING"
        );

        return;
    }

    newName = String(newName || "").trim().toUpperCase();

    if (!newName) {
        newName = prompt(
            "ENTER NEW KANE DESIGNATION:"
        )?.trim().toUpperCase();
    }

    if (!newName) return;

    const previous = kaneName;

    kaneName = newName;

    save(STORAGE.KANE_NAME, kaneName);

    updateKaneUI();

    audit(
        "KANE DESIGNATION CHANGE",
        `${previous} → ${newName}`,
        "WARNING"
    );

    kaneEvent(
        "DESIGNATION",
        `${previous} designation changed to ${newName}`
    );

    notify(
        "KANE DESIGNATION UPDATED",
        `${previous} → ${newName}`
    );
}

/* =========================================================
   KANE CLICK MESSAGE
   ========================================================= */

function kaneNameMessage() {
    showModal("kaneMessage");

    if ($("kaneMessageContent")) {
        $("kaneMessageContent").textContent =
            "En nombre de toda la división, no te pajees";
    }
}

/* =========================================================
   AUTONOMY
   ========================================================= */

function toggleAutonomy() {
    if (!currentUser || currentUser.authority < 5) {
        notify(
            "ACCESS DENIED",
            "Executive authority required."
        );
        return;
    }

    kaneSettings.autonomy =
        !kaneSettings.autonomy;

    save(STORAGE.KANE_SETTINGS, kaneSettings);

    updateKaneUI();
    renderKaneMonitor();

    audit(
        "KANE AUTONOMY CHANGE",
        `Autonomy: ${kaneSettings.autonomy ? "ON" : "OFF"}`
    );

    kaneEvent(
        "AUTONOMY",
        `Autonomy ${kaneSettings.autonomy ? "enabled" : "disabled"}`
    );
}

/* =========================================================
   KILLSWITCH
   ========================================================= */

function openKillswitch() {
    if (!currentUser || currentUser.username !== "COS") {
        notify(
            "ACCESS DENIED",
            "COS authority required."
        );

        audit(
            "KILLSWITCH ACCESS DENIED",
            currentUser
                ? currentUser.username
                : "UNAUTHENTICATED",
            "WARNING"
        );

        return;
    }

    if ($("killswitchContent")) {
        $("killswitchContent").textContent =
`KANE EXECUTIVE CORE TERMINATION

This action will place KANE into standby
and disable autonomous executive processing.

COS authorization detected.

Proceed only if executive termination
is required.`;
    }

    showModal("killswitchModal");
}

function executeKillswitch() {
    if (!currentUser || currentUser.username !== "COS") {
        hideModal("killswitchModal");
        return;
    }

    kaneSettings.autonomy = false;
    kaneSettings.silent = true;

    save(STORAGE.KANE_SETTINGS, kaneSettings);

    kaneEvent(
        "KILLSWITCH",
        "KANE core placed into executive standby",
        "CRITICAL"
    );

    audit(
        "KANE KILLSWITCH EXECUTED",
        "KANE placed into standby",
        "CRITICAL"
    );

    hideModal("killswitchModal");

    updateKaneUI();
    renderKaneMonitor();

    notify(
        "KANE TERMINATED",
        "Executive core placed into standby."
    );
}

/* =========================================================
   SCENARIOS
   ========================================================= */

const SCENARIOS = [
    {
        text:
`EXECUTIVE SECURITY EVENT

A restricted archive access attempt has been detected.

No external system compromise is confirmed.

KANE requests executive direction.`,
        options: [
            "Review audit records",
            "Lock affected account",
            "Continue monitoring"
        ]
    },

    {
        text:
`EXECUTIVE DECISION REQUIRED

Multiple executive directives contain conflicting
operational priorities.

KANE has identified the conflict.`,
        options: [
            "Review directives",
            "Create executive decision",
            "Request KANE analysis"
        ]
    },

    {
        text:
`ARCHIVE ANOMALY

An executive archive record has been modified.

The modification is locally recorded but has not
yet been classified as unauthorized.`,
        options: [
            "Open audit",
            "Open archive",
            "Create investigation record"
        ]
    }
];

function runScenario() {
    const scenario =
        SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];

    scenarioHistory.unshift({
        id: uid("SCN"),
        time: now(),
        scenario: scenario.text
    });

    save(STORAGE.SCENARIOS, scenarioHistory);

    if ($("scenarioNumber")) {
        $("scenarioNumber").textContent =
            String(scenarioHistory.length).padStart(3, "0");
    }

    if ($("scenarioContent")) {
        $("scenarioContent").textContent =
            scenario.text;
    }

    const options = $("scenarioOptions");

    if (options) {
        options.innerHTML = "";

        scenario.options.forEach(option => {
            const button = document.createElement("button");

            button.textContent = option;

            button.addEventListener("click", () => {
                audit(
                    "SCENARIO RESPONSE",
                    option
                );

                hideModal("scenarioModal");

                notify(
                    "SCENARIO RESPONSE",
                    option
                );
            });

            options.appendChild(button);
        });
    }

    showModal("scenarioModal");

    kaneEvent(
        "SCENARIO",
        "Executive scenario initiated"
    );
}

/* =========================================================
   OBSERVER
   ========================================================= */

function openObserver() {
    if (!currentUser || currentUser.clearance < 5) {
        notify(
            "ACCESS DENIED",
            "CL-5 required."
        );
        return;
    }

    if ($("observerContent")) {
        $("observerContent").textContent =
`DIVI-64 // OBSERVER

CURRENT EXECUTIVE:
${currentUser.username}

SESSION:
${currentUser.session || "NONE"}

KANE:
${kaneName}

AUTONOMY:
${kaneSettings.autonomy ? "ACTIVE" : "STANDBY"}

ARCHIVE RECORDS:
${files.length}

AUDIT EVENTS:
${auditLog.length}

KANE EVENTS:
${kaneEvents.length}

BLACK BOX:
${blackBox.length}

The Observer is a read-only executive
system overview.`;
    }

    showModal("observerModal");

    audit(
        "OBSERVER ACCESS",
        "Read-only system overview opened"
    );
}

/* =========================================================
   PHANTOM FILE
   ========================================================= */

function openPhantom() {
    if (!currentUser || currentUser.clearance < 5) {
        notify(
            "ACCESS DENIED",
            "CL-5 required."
        );
        return;
    }

    if ($("phantomFileContent")) {
        $("phantomFileContent").textContent =
`DIVI-64 // PHANTOM FILE

FILE STATUS:
RESTRICTED

REFERENCE:
PH-000

The Phantom File is an isolated executive
record reserved for anomalous or unresolved
system observations.

No automatic external transmission exists.

ACCESS:
${currentUser.username}

TIMESTAMP:
${now()}`;
    }

    showModal("phantomFileModal");

    audit(
        "PHANTOM FILE ACCESS",
        "PH-000 accessed",
        "WARNING"
    );
}

/* =========================================================
   DIAGNOSTICS
   ========================================================= */

function diagnostics() {
    const checks = [
        ["MAINFRAME", true],
        ["AUTHENTICATION", !!currentUser],
        ["ARCHIVES", Array.isArray(files)],
        ["AUDIT", Array.isArray(auditLog)],
        ["DECISIONS", Array.isArray(decisions)],
        ["PERSONNEL", Array.isArray(personnel)],
        ["KANE MEMORY", Array.isArray(kaneMemory)],
        ["KANE EVENTS", Array.isArray(kaneEvents)],
        ["BLACK BOX", Array.isArray(blackBox)],
        ["LOCAL STORAGE", true]
    ];

    terminalWrite(
        checks.map(
            ([name, ok]) =>
                `${name.padEnd(18, " ")} ${ok ? "ONLINE" : "ERROR"}`
        ).join("\n")
    );

    audit(
        "SYSTEM DIAGNOSTICS",
        "Full diagnostic sequence executed"
    );
}

/* =========================================================
   BRIEFING
   ========================================================= */

function generateBriefing() {
    if (!currentUser) return;

    const briefing =
`DIVI-64 // EXECUTIVE BRIEFING

EXECUTIVE:
${currentUser.username} // ${currentUser.title}

CLEARANCE:
CL-${currentUser.clearance}

AUTHORITY:
${currentUser.authority}

SYSTEM:
ONLINE

PERSONNEL:
${personnel.length}

ARCHIVE RECORDS:
${files.length}

EXECUTIVE DECISIONS:
${decisions.length}

AUDIT EVENTS:
${auditLog.length}

KANE:
${kaneName}

KANE AUTONOMY:
${kaneSettings.autonomy ? "ACTIVE" : "STANDBY"}

KANE MEMORY:
${kaneMemory.length} entries

KANE EVENTS:
${kaneEvents.length}

BLACK BOX:
${blackBox.length}

CURRENT TIME:
${now()}

END OF BRIEFING.`;

    $("briefingContent").textContent = briefing;

    showModal("briefingModal");

    audit(
        "EXECUTIVE BRIEFING GENERATED",
        "Briefing generated"
    );
}

/* =========================================================
   HELP
   ========================================================= */

function showHelp() {
    if ($("helpContent")) {
        $("helpContent").textContent =
`DIVI-64 // EXECUTIVE TERMINAL HELP

NAVIGATION
Use the left navigation panel to access system modules.

TERMINAL
Type "help" for command information.

ARCHIVES
Executive records are stored locally and protected by clearance.

PERSONNEL
Personnel records can be searched and managed by authorized executives.

SECURITY
Displays authentication, access and audit activity.

DECISIONS
Registers executive decisions.

AUDIT
Displays recorded system activity.

KANE
Executive intelligence interface.

ADVANCED KANE
scenario
observer
phantom
blackbox
killswitch
autonomy

AUTHORITY
CL-5 executive authority is required for restricted administrative operations.

COS
COS possesses the highest executive authority.

CO
CO is the only executive authorized to rename KANE.`;
    }

    showModal("helpModal");
}

/* =========================================================
   LOGOUT
   ========================================================= */

function logout() {
    if (currentUser) {
        audit(
            "EXECUTIVE LOGOUT",
            `${currentUser.username} session terminated`
        );
    }

    currentUser = null;

    stats.activeSessions = 0;
    save(STORAGE.STATS, stats);

    if ($("mainApp")) {
        $("mainApp").style.display = "none";
    }

    if ($("sessionScreen")) {
        $("sessionScreen").style.display = "none";
    }

    if ($("loginScreen")) {
        $("loginScreen").style.display = "flex";
    }

    if ($("loginUsername")) {
        $("loginUsername").value = "";
    }

    if ($("loginPassword")) {
        $("loginPassword").value = "";
    }

    if ($("loginError")) {
        $("loginError").textContent = "";
    }

    if ($("terminalOutput")) {
        $("terminalOutput").innerHTML = "";
    }

    notify(
        "SESSION TERMINATED",
        "Executive session closed."
    );
}

/* =========================================================
   EVENT BINDING
   ========================================================= */

function bindEvents() {

    /* LOGIN */

    $("loginButton")?.addEventListener(
        "click",
        attemptLogin
    );

    $("loginPassword")?.addEventListener(
        "keydown",
        event => {
            if (event.key === "Enter") {
                attemptLogin();
            }
        }
    );

    $("loginUsername")?.addEventListener(
        "keydown",
        event => {
            if (event.key === "Enter") {
                $("loginPassword")?.focus();
            }
        }
    );


    /* SESSION */

    document.querySelectorAll(".sessionCard").forEach(card => {
        card.addEventListener("click", () => {
            selectSession(card.dataset.session);
        });
    });


    /* NAVIGATION */

    document.querySelectorAll(".navButton[data-page]").forEach(button => {
        button.addEventListener("click", () => {
            navigate(button.dataset.page);
        });
    });

    document.querySelectorAll(".navButton[data-action]").forEach(button => {
        button.addEventListener("click", () => {

            const action = button.dataset.action;

            if (action === "briefing") {
                generateBriefing();
            }

            if (action === "help") {
                showHelp();
            }
        });
    });


    /* LOGOUT */

    $("logoutButton")?.addEventListener(
        "click",
        logout
    );


    /* TERMINAL */

    $("terminalInput")?.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Enter") return;

            const input = $("terminalInput");
            const command = input.value;

            input.value = "";

            processCommand(command);
        }
    );


    /* PERSONNEL */

    $("personnelSearch")?.addEventListener(
        "input",
        renderPersonnel
    );

    $("personnelFilter")?.addEventListener(
        "change",
        renderPersonnel
    );


    /* ARCHIVES */

    $("archiveSearch")?.addEventListener(
        "input",
        renderArchives
    );

    $("refreshArchives")?.addEventListener(
        "click",
        renderArchives
    );

    $("createRecordButton")?.addEventListener(
        "click",
        createRecord
    );

    $("recordForm")?.addEventListener(
        "submit",
        saveRecord
    );


    /* OPERATIONS */

    document.querySelectorAll(".operationTab").forEach(tab => {
        tab.addEventListener("click", () => {

            document.querySelectorAll(".operationTab")
                .forEach(t => t.classList.remove("active"));

            tab.classList.add("active");

            renderOperations(
                tab.dataset.operation
            );
        });
    });


    /* SECURITY */

    document.querySelectorAll("[data-security-tab]").forEach(tab => {
        tab.addEventListener("click", () => {

            document.querySelectorAll("[data-security-tab]")
                .forEach(t => t.classList.remove("active"));

            tab.classList.add("active");

            renderSecurity(
                tab.dataset.securityTab
            );
        });
    });


    /* DECISIONS */

    $("newDecisionButton")?.addEventListener(
        "click",
        newDecision
    );

    $("decisionForm")?.addEventListener(
        "submit",
        saveDecision
    );


    /* AUDIT */

    $("refreshAudit")?.addEventListener(
        "click",
        renderAudit
    );


    /* KANE */

    $("kaneSend")?.addEventListener(
        "click",
        () => {

            const input = $("kaneInput");
            const query = input.value.trim();

            if (!query) return;

            input.value = "";

            kaneAsk(query);
        }
    );

    $("kaneInput")?.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {
                $("kaneSend")?.click();
            }
        }
    );

    $("kaneBriefingButton")?.addEventListener(
        "click",
        generateBriefing
    );

    $("kaneKillswitchButton")?.addEventListener(
        "click",
        openKillswitch
    );


    /* KANE NAME */

    document.querySelectorAll("#kaneName").forEach(el => {
        el.addEventListener(
            "click",
            kaneNameMessage
        );
    });


    /* KANE MODALS */

    $("closeKaneMessage")?.addEventListener(
        "click",
        () => hideModal("kaneMessage")
    );

    $("closeKaneAlert")?.addEventListener(
        "click",
        () => hideModal("kaneAlert")
    );

    $("closeAiPanel")?.addEventListener(
        "click",
        () => hideModal("aiPanel")
    );

    $("closeBriefing")?.addEventListener(
        "click",
        () => hideModal("briefingModal")
    );

    $("closeScenario")?.addEventListener(
        "click",
        () => hideModal("scenarioModal")
    );

    $("observerClose")?.addEventListener(
        "click",
        () => hideModal("observerModal")
    );

    $("phantomFileClose")?.addEventListener(
        "click",
        () => hideModal("phantomFileModal")
    );

    $("closeFileModal")?.addEventListener(
        "click",
        () => hideModal("fileModal")
    );

    $("closeHelp")?.addEventListener(
        "click",
        () => hideModal("helpModal")
    );


    /* RECORD MODAL */

    $("cancelRecord")?.addEventListener(
        "click",
        () => hideModal("recordModal")
    );

    $("cancelRecordBottom")?.addEventListener(
        "click",
        () => hideModal("recordModal")
    );


    /* DECISION MODAL */

    $("cancelDecision")?.addEventListener(
        "click",
        () => hideModal("decisionModal")
    );

    $("cancelDecisionBottom")?.addEventListener(
        "click",
        () => hideModal("decisionModal")
    );


    /* KILLSWITCH */

    $("killswitchCancel")?.addEventListener(
        "click",
        () => hideModal("killswitchModal")
    );

    $("killswitchCancelBottom")?.addEventListener(
        "click",
        () => hideModal("killswitchModal")
    );

    $("killswitchConfirm")?.addEventListener(
        "click",
        executeKillswitch
    );


    /* OUTSIDE MODAL CLICK */

    document.querySelectorAll(".modal").forEach(modal => {
        modal.addEventListener("click", event => {

            if (event.target === modal) {
                modal.classList.remove("open");
                modal.style.display = "none";
            }
        });
    });
}

/* =========================================================
   INITIALIZATION
   ========================================================= */

function init() {

    /* Make sure login is visible before authentication. */

    if ($("loginScreen") &&
        $("mainApp")?.style.display !== "flex") {

        $("loginScreen").style.display = "flex";
    }

    bindEvents();
    startClock();

    renderArchives();
    renderPersonnel();
    renderOperations("active");
    renderSecurity("sessions");
    renderDecisions();
    renderAudit();

    updateDashboard();
    updateKaneUI();
    renderKaneMonitor();

    if ($("kaneProcessing")) {
        $("kaneProcessing").style.display = "none";
    }

    /* KANE periodic autonomous monitor */

    if (!window.__kaneMonitorStarted) {

        window.__kaneMonitorStarted = true;

        setInterval(() => {

            if (!currentUser) return;
            if (!kaneSettings.autonomy) return;

            const roll = Math.random();

            /*
             * Low-frequency harmless autonomous event.
             * It does not change permissions or execute destructive actions.
             */

            if (roll < 0.025) {

                const messages = [
                    "Routine executive system scan completed.",
                    "Archive integrity verification completed.",
                    "Executive audit synchronization completed.",
                    "No anomalous executive activity detected."
                ];

                const message =
                    messages[
                        Math.floor(
                            Math.random() * messages.length
                        )
                    ];

                kaneEvent(
                    "AUTONOMOUS MONITOR",
                    message
                );
            }

        }, 30000);
    }
}

/* =========================================================
   START
   ========================================================= */

window.addEventListener("load", () => {

    /*
     * BOOT IS INDEPENDENT FROM INITIALIZATION.
     * This prevents a localStorage/UI error from freezing
     * the loading sequence.
     */

    boot();

});
