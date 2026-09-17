/* =========================================================
   DIVI-64 // KANE EXECUTIVE CORE
   FULL EXECUTIVE MANAGEMENT ENGINE
========================================================= */

"use strict";

/* =========================================================
   UTILITIES
========================================================= */

const $ = id => document.getElementById(id);

const STORAGE = {
    FILES: "DIVI64_EM_FILES_V3",
    AUDIT: "DIVI64_EM_AUDIT_V3",
    DECISIONS: "DIVI64_EM_DECISIONS_V3",
    KANE_NAME: "DIVI64_KANE_NAME_V3",
    KANE_MEMORY: "DIVI64_KANE_MEMORY_V3",
    KANE_SETTINGS: "DIVI64_KANE_SETTINGS_V3",
    KANE_EVENTS: "DIVI64_KANE_EVENTS_V3",
    KANE_BLACKBOX: "DIVI64_KANE_BLACKBOX_V3",
    SCENARIOS: "DIVI64_KANE_SCENARIOS_V3",
    SESSION_STATS: "DIVI64_EM_SESSION_STATS_V3"
};

function load(key, fallback) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
    } catch {
        return fallback;
    }
}

function save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function text(id, value) {
    const el = $(id);
    if (el) el.textContent = value;
}

function html(id, value) {
    const el = $(id);
    if (el) el.innerHTML = value;
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
    return new Date().toLocaleString("en-GB", {
        hour12: false
    });
}

function uid(prefix = "ID") {
    return prefix + "-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


/* =========================================================
   EXECUTIVE ACCOUNTS
========================================================= */

const ACCOUNTS = {
    LJD: {
        id: "LJD",
        password: "LJD-64",
        title: "LEAD JUDICIAL DIRECTOR",
        clearance: 5,
        authority: 5
    },

    XO: {
        id: "XO",
        password: "XO-64",
        title: "EXECUTIVE OFFICER",
        clearance: 5,
        authority: 5
    },

    CO: {
        id: "CO",
        password: "CO-64",
        title: "COMMANDING OFFICER",
        clearance: 5,
        authority: 5
    },

    COS: {
        id: "COS",
        password: "COS-64",
        title: "COMMANDER SENIOR",
        clearance: 5,
        authority: 6
    }
};


/* =========================================================
   BUILT-IN EXECUTIVE FILES
========================================================= */

const DEFAULT_FILES = [
    {
        id: "EM-001",
        title: "Executive Management Charter",
        subject: "DIVI-64 Executive Authority",
        clearance: 5,
        status: "SEALED",
        content:
`DIVI-64 EXECUTIVE MANAGEMENT CHARTER

Defines the structure, authority and responsibilities
of Executive Management.

All executive decisions remain subject to the
DIVI-64 chain of authority.`
    },

    {
        id: "EM-002",
        title: "Executive Authority Protocol",
        subject: "Authority Framework",
        clearance: 5,
        status: "SEALED",
        content:
`Defines executive authority levels and permitted
actions for LJD, XO, CO and COS.`
    },

    {
        id: "EM-003",
        title: "Executive Personnel Registry",
        subject: "Executive Personnel",
        clearance: 5,
        status: "ACTIVE",
        content:
`Registry containing executive personnel references
and current administrative status.`
    },

    {
        id: "EM-004",
        title: "Executive Chain of Command",
        subject: "Command Structure",
        clearance: 5,
        status: "SEALED",
        content:
`LJD
XO
CO
COS

COS maintains supreme executive authority.`
    },

    {
        id: "EM-005",
        title: "Executive Voting Protocol",
        subject: "Executive Decisions",
        clearance: 5,
        status: "ACTIVE",
        content:
`Defines procedures for executive proposals,
votes, approvals and archived decisions.`
    },

    {
        id: "EM-006",
        title: "Emergency Executive Protocol",
        subject: "Emergency Authority",
        clearance: 5,
        status: "SEALED",
        content:
`Emergency authority may temporarily supersede
normal operational procedures when authorized.`
    },

    {
        id: "EM-007",
        title: "Executive Security Regulations",
        subject: "Security",
        clearance: 5,
        status: "ACTIVE",
        content:
`Executive systems must maintain authentication,
audit and access-control integrity.`
    },

    {
        id: "EM-008",
        title: "Clearance Authority Directive",
        subject: "Clearance",
        clearance: 5,
        status: "SEALED",
        content:
`Defines executive clearance requirements and
authority restrictions.`
    },

    {
        id: "EM-009",
        title: "Executive Disciplinary Authority",
        subject: "Disciplinary Procedures",
        clearance: 5,
        status: "SEALED",
        content:
`Defines executive disciplinary procedures and
authorized administrative responses.`
    },

    {
        id: "EM-010",
        title: "Executive Communications Protocol",
        subject: "Communications",
        clearance: 5,
        status: "ACTIVE",
        content:
`Defines protected executive communications
and archival requirements.`
    },

    {
        id: "EM-011",
        title: "Executive Archives Access Directive",
        subject: "Archive Access",
        clearance: 5,
        status: "SEALED",
        content:
`Executive archive access is restricted according
to clearance and session authority.`
    },

    {
        id: "EM-012",
        title: "Executive Succession Directive",
        subject: "Succession",
        clearance: 5,
        status: "SEALED",
        content:
`Defines executive succession procedures and
continuity of authority.`
    }
];


/* =========================================================
   RUNTIME STATE
========================================================= */

let currentUser = null;
let currentPage = "dashboard";

let commandHistory = [];
let historyIndex = -1;

let files = load(STORAGE.FILES, DEFAULT_FILES);
let auditLog = load(STORAGE.AUDIT, []);
let decisions = load(STORAGE.DECISIONS, []);

let kaneName = load(STORAGE.KANE_NAME, "KANE");
let kaneMemory = load(STORAGE.KANE_MEMORY, []);
let kaneSettings = load(STORAGE.KANE_SETTINGS, {
    mode: "EXECUTIVE",
    silent: false,
    context: []
});

let kaneEvents = load(STORAGE.KANE_EVENTS, []);
let blackBox = load(STORAGE.KANE_BLACKBOX, []);
let scenarioHistory = load(STORAGE.SCENARIOS, []);

let kaneState = {
    status: "ONLINE",
    autonomy: "LIMITED",
    processing: false,
    isolated: false,
    suspended: false,
    shutdown: false,
    lockedFunctions: [],
    currentEvent: null,
    monitorActive: false,
    observerActive: false
};

let sessionStats = load(STORAGE.SESSION_STATS, {
    failedLogins: 0,
    securityEvents: 0,
    activeSessions: 0
});


/* =========================================================
   AUDIT
========================================================= */

function audit(action, detail = "", severity = "NORMAL") {

    const entry = {
        id: uid("AUD"),
        timestamp: now(),
        actor: currentUser ? currentUser.id : "SYSTEM",
        action,
        detail,
        severity
    };

    auditLog.unshift(entry);

    if (auditLog.length > 1000) {
        auditLog = auditLog.slice(0, 1000);
    }

    save(STORAGE.AUDIT, auditLog);

    if (currentUser) {
        sessionStats.securityEvents++;
        save(STORAGE.SESSION_STATS, sessionStats);
    }

    renderAudit();
}


/* =========================================================
   BLACK BOX
========================================================= */

function blackBoxEvent(type, detail, severity = "UNKNOWN") {

    const entry = {
        id: uid("BB"),
        timestamp: now(),
        session: currentUser ? currentUser.id : "SYSTEM",
        type,
        detail,
        severity
    };

    blackBox.unshift(entry);

    if (blackBox.length > 500) {
        blackBox = blackBox.slice(0, 500);
    }

    save(STORAGE.KANE_BLACKBOX, blackBox);
}


/* =========================================================
   BOOT
========================================================= */

function boot() {

    const progress = $("bootProgress");
    const status = $("bootStatus");
    const log = $("bootLog");

    const steps = [
        "INITIALIZING EXECUTIVE CORE...",
        "LOADING AUTHORITY MATRIX...",
        "VERIFYING ARCHIVE ENGINE...",
        "INITIALIZING AUDIT ENGINE...",
        "LOADING KANE CORE...",
        "VERIFYING EXECUTIVE LINK...",
        "MAINFRAME READY."
    ];

    let index = 0;

    const timer = setInterval(() => {

        if (index >= steps.length) {

            clearInterval(timer);

            setTimeout(() => {
                $("bootScreen").classList.remove("active");
                $("bootScreen").classList.add("hidden");

                $("loginScreen").classList.remove("hidden");
                $("loginScreen").classList.add("active");
            }, 500);

            return;
        }

        const value = steps[index];

        text("bootStatus", value);

        if (log) {
            log.innerHTML +=
                `<div>[${String(index + 1).padStart(2, "0")}] ${escapeHTML(value)}</div>`;
        }

        if (progress) {
            progress.style.width =
                Math.round(((index + 1) / steps.length) * 100) + "%";
        }

        index++;

    }, 350);
}


/* =========================================================
   LOGIN
========================================================= */

function login() {

    const username =
        $("loginUsername").value.trim().toUpperCase();

    const password =
        $("loginPassword").value;

    if (!ACCOUNTS[username] ||
        ACCOUNTS[username].password !== password) {

        sessionStats.failedLogins++;
        save(STORAGE.SESSION_STATS, sessionStats);

        text(
            "loginError",
            "AUTHENTICATION FAILED // ACCESS DENIED"
        );

        audit(
            "LOGIN_FAILED",
            `Failed authentication attempt for ${username || "UNKNOWN"}`,
            "WARNING"
        );

        return;
    }

    currentUser = ACCOUNTS[username];

    text(
        "sessionGreeting",
        `AUTHENTICATED: ${currentUser.title}`
    );

    $("loginScreen").classList.add("hidden");
    $("loginScreen").classList.remove("active");

    $("sessionScreen").classList.remove("hidden");
    $("sessionScreen").classList.add("active");

    audit(
        "LOGIN_SUCCESS",
        `${currentUser.id} authenticated`
    );
}


/* =========================================================
   SESSION
========================================================= */

function selectSession(id) {

    if (!currentUser) return;

    if (id !== currentUser.id) {
        text(
            "sessionError",
            "SESSION AUTHORITY MISMATCH"
        );
        return;
    }

    sessionStats.activeSessions = 1;
    save(STORAGE.SESSION_STATS, sessionStats);

    $("sessionScreen").classList.add("hidden");
    $("sessionScreen").classList.remove("active");

    $("mainApp").classList.remove("hidden");

    text("headerUser", currentUser.id);
    text("headerClearance", `CL ${currentUser.clearance}`);
    text(
        "terminalSessionLabel",
        `${currentUser.id} // ${currentUser.title}`
    );

    text(
        "terminalPrompt",
        `${currentUser.id}@EM:~$`
    );

    text("kaneSession", currentUser.id);

    audit(
        "SESSION_ESTABLISHED",
        `${currentUser.id} executive session established`
    );

    terminalPrint(
        `DIVI-64 EXECUTIVE SESSION ESTABLISHED\n` +
        `EXECUTIVE: ${currentUser.id}\n` +
        `AUTHORITY: ${currentUser.authority}\n` +
        `CLEARANCE: CL-${currentUser.clearance}\n` +
        `KANE: ${kaneName} // ${kaneState.status}\n`
    );

    renderAll();
}


/* =========================================================
   CLOCK
========================================================= */

function updateClock() {

    const date = new Date();

    text(
        "terminalClock",
        date.toLocaleTimeString("en-GB", {
            hour12: false
        })
    );
}


/* =========================================================
   PAGE NAVIGATION
========================================================= */

function showPage(page) {

    currentPage = page;

    document.querySelectorAll(".page").forEach(el => {
        el.classList.remove("active");
    });

    const target = $(`${page}Page`);

    if (target) {
        target.classList.add("active");
    }

    document.querySelectorAll(".navButton").forEach(btn => {
        btn.classList.toggle(
            "active",
            btn.dataset.page === page
        );
    });

    renderPage(page);
}

function renderPage(page) {

    if (page === "dashboard") renderDashboard();
    if (page === "personnel") renderPersonnel();
    if (page === "archives") renderArchives();
    if (page === "operations") renderOperations();
    if (page === "security") renderSecurity();
    if (page === "decisions") renderDecisions();
    if (page === "audit") renderAudit();
    if (page === "kane") renderKane();
}


/* =========================================================
   TERMINAL
========================================================= */

function terminalPrint(message, type = "normal") {

    const output = $("terminalOutput");

    if (!output) return;

    const line = document.createElement("div");

    line.className = `terminalLine ${type}`;

    line.textContent = message;

    output.appendChild(line);

    output.scrollTop = output.scrollHeight;
}

function clearTerminal() {
    html("terminalOutput", "");
}

function terminalCommand(raw) {

    const command = raw.trim();

    if (!command) return;

    commandHistory.push(command);

    if (commandHistory.length > 100) {
        commandHistory.shift();
    }

    historyIndex = commandHistory.length;

    terminalPrint(
        `${currentUser.id}@EM:~$ ${command}`
    );

    executeCommand(command);
}

function executeCommand(raw) {

    const parts = raw.trim().split(/\s+/);

    const command = parts.shift().toLowerCase();

    const args = parts.join(" ");

    if (isKaneLocked(command)) {
        terminalPrint(
            `${kaneName}: FUNCTION LOCKED // AUTONOMOUS CONTROL`,
            "error"
        );
        audit(
            "KANE_FUNCTION_BLOCKED",
            `Blocked command: ${command}`,
            "WARNING"
        );
        return;
    }

    switch (command) {

        case "help":
            commandHelp();
            break;

        case "clear":
            clearTerminal();
            break;

        case "status":
            commandStatus();
            break;

        case "archives":
            commandArchives();
            break;

        case "open":
            commandOpen(args);
            break;

        case "create":
            openRecordModal();
            break;

        case "search":
            commandSearch(args);
            break;

        case "personnel":
            commandPersonnel();
            break;

        case "directives":
            commandDirectives();
            break;

        case "operations":
            commandOperations();
            break;

        case "security":
            commandSecurity();
            break;

        case "audit":
            commandAudit();
            break;

        case "system":
            commandSystem();
            break;

        case "diagnostics":
            commandDiagnostics();
            break;

        case "analyze":
            commandAnalyze(args);
            break;

        case "summarize":
            commandSummarize(args);
            break;

        case "decisions":
            commandDecisions();
            break;

        case "briefing":
            openBriefing();
            break;

        case "kane":
            commandKane(args);
            break;

        case "ask":
            askKane(args);
            break;

        case "whoami":
            commandWhoami();
            break;

        case "history":
            commandHistory();
            break;

        case "memory":
            commandMemory();
            break;

        case "mode":
            commandMode(args);
            break;

        case "silent":
            commandSilent();
            break;

        case "resume":
            commandResume();
            break;

        case "monitor":
            commandMonitor();
            break;

        case "kane-status":
            commandKaneStatus();
            break;

        case "killswitch":
            openKillswitch();
            break;

        case "scenario":
            startScenario();
            break;

        case "blackbox":
            commandBlackBox();
            break;

        case "observer":
            triggerObserver(true);
            break;

        case "logout":
            logout();
            break;

        default:
            if (command.length > 0) {
                naturalCommand(raw);
            }
    }
}


/* =========================================================
   COMMANDS
========================================================= */

function commandHelp() {

    terminalPrint(
`AVAILABLE EXECUTIVE COMMANDS

help
clear
status
archives
open <ID>
create
search <term>
personnel
directives
operations
security
audit
system
diagnostics
analyze <ID>
summarize <ID>
decisions
briefing
kane
ask <query>
whoami
history
memory
mode <EXECUTIVE|ANALYST>
silent
resume
monitor
kane-status
killswitch
scenario
blackbox
observer
logout`
    );
}

function commandStatus() {

    terminalPrint(
`MAINFRAME STATUS

SYSTEM: ONLINE
AUTHENTICATION: VERIFIED
AUDIT ENGINE: ACTIVE
ARCHIVE ENGINE: ONLINE
ACCESS CONTROL: ACTIVE
KANE: ${kaneName} // ${kaneState.status}
AUTONOMY: ${kaneState.autonomy}
SESSION: ${currentUser.id}`
    );

    audit("STATUS_CHECK");
}

function commandArchives() {

    showPage("archives");

    terminalPrint(
        `${files.length} executive archive records indexed.`
    );
}

function commandOpen(id) {

    if (!id) {
        terminalPrint("USAGE: open <ID>");
        return;
    }

    const file = files.find(
        f => f.id.toUpperCase() === id.toUpperCase()
    );

    if (!file) {

        if (
            id.toUpperCase() === "EM-000" ||
            id.toUpperCase() === "EM-017" ||
            id.toUpperCase() === "EM-018" ||
            id.toUpperCase() === "EM-019"
        ) {
            phantomFile(id.toUpperCase());
            return;
        }

        terminalPrint(
            "ARCHIVE NOT FOUND // ACCESS DENIED",
            "error"
        );
        return;
    }

    if (currentUser.clearance < file.clearance) {

        terminalPrint(
            "ACCESS DENIED // INSUFFICIENT CLEARANCE",
            "error"
        );

        audit(
            "ARCHIVE_ACCESS_DENIED",
            file.id,
            "WARNING"
        );

        return;
    }

    openFile(file);

    audit(
        "ARCHIVE_ACCESSED",
        `${file.id} // ${file.title}`
    );
}

function commandSearch(term) {

    if (!term) {
        terminalPrint("USAGE: search <term>");
        return;
    }

    const results = files.filter(file =>
        `${file.id} ${file.title} ${file.subject} ${file.content}`
            .toLowerCase()
            .includes(term.toLowerCase())
    );

    if (!results.length) {

        terminalPrint(
            `NO RESULTS FOR "${term}".`
        );

        return;
    }

    terminalPrint(
        results.map(
            f => `${f.id} // ${f.title}`
        ).join("\n")
    );
}

function commandPersonnel() {

    showPage("personnel");

    terminalPrint(
        "PERSONNEL REGISTRY DISPLAYED."
    );
}

function commandDirectives() {

    const directives = files.filter(
        f =>
            f.title.toLowerCase().includes("directive") ||
            f.title.toLowerCase().includes("protocol")
    );

    terminalPrint(
        directives.map(
            f => `${f.id} // ${f.title}`
        ).join("\n")
    );
}

function commandOperations() {

    showPage("operations");

    terminalPrint(
        "OPERATIONS CONTROL DISPLAYED."
    );
}

function commandSecurity() {

    showPage("security");

    terminalPrint(
        "SECURITY CONTROL DISPLAYED."
    );
}

function commandAudit() {

    showPage("audit");

    terminalPrint(
        `${auditLog.length} audit records available.`
    );
}

function commandSystem() {

    terminalPrint(
`DIVI-64 SYSTEM

MAINFRAME: ONLINE
EXECUTIVE CORE: ONLINE
ARCHIVE ENGINE: ONLINE
AUDIT ENGINE: ACTIVE
KANE CORE: ${kaneState.status}
KANE NAME: ${kaneName}
KANE MODE: ${kaneSettings.mode}
AUTONOMY: ${kaneState.autonomy}
OBSERVER: ${kaneState.observerActive ? "ACTIVE" : "STANDBY"}`
    );
}

function commandDiagnostics() {

    const diagnostics = [
        ["DATABASE", "ONLINE"],
        ["AUTHENTICATION", "ONLINE"],
        ["AUDIT ENGINE", "ACTIVE"],
        ["ARCHIVE ENGINE", "ONLINE"],
        ["ACCESS CONTROL", "ACTIVE"],
        ["KANE CORE", kaneState.status],
        ["KANE MEMORY", kaneSettings.silent ? "SUSPENDED" : "ACTIVE"],
        ["OBSERVER", kaneState.observerActive ? "ACTIVE" : "STANDBY"]
    ];

    terminalPrint(
        diagnostics
            .map(x => `${x[0].padEnd(20)} ${x[1]}`)
            .join("\n")
    );

    audit("SYSTEM_DIAGNOSTICS");
}

function commandAnalyze(id) {

    const file = files.find(
        f => f.id.toUpperCase() === id.toUpperCase()
    );

    if (!file) {
        terminalPrint("FILE NOT FOUND.");
        return;
    }

    terminalPrint(
`KANE // ANALYSIS

FILE: ${file.id}
TITLE: ${file.title}
STATUS: ${file.status}
CLEARANCE: CL-${file.clearance}

ANALYSIS:
${file.content.slice(0, 500)}

KANE ASSESSMENT:
Document appears structurally consistent with
DIVI-64 executive archive standards.`
    );

    audit(
        "KANE_FILE_ANALYSIS",
        file.id
    );
}

function commandSummarize(id) {

    const file = files.find(
        f => f.id.toUpperCase() === id.toUpperCase()
    );

    if (!file) {
        terminalPrint("FILE NOT FOUND.");
        return;
    }

    terminalPrint(
`KANE // SUMMARY

${file.title}

${file.content
    .replace(/\s+/g, " ")
    .slice(0, 260)}...`
    );
}

function commandDecisions() {

    showPage("decisions");

    terminalPrint(
        `${decisions.length} executive decisions registered.`
    );
}

function commandKane(args) {

    if (!args) {
        terminalPrint(
`KANE CORE

STATUS: ${kaneState.status}
MODE: ${kaneSettings.mode}
MEMORY: ${kaneSettings.silent ? "SUSPENDED" : "ACTIVE"}
AUTONOMY: ${kaneState.autonomy}`
        );
        return;
    }

    askKane(args);
}

function commandWhoami() {

    terminalPrint(
`EXECUTIVE IDENTIFICATION

ID: ${currentUser.id}
POSITION: ${currentUser.title}
CLEARANCE: CL-${currentUser.clearance}
AUTHORITY: ${currentUser.authority}`
    );
}

function commandHistory() {

    if (!commandHistory.length) {
        terminalPrint("NO COMMAND HISTORY.");
        return;
    }

    terminalPrint(
        commandHistory
            .map((cmd, i) => `${String(i + 1).padStart(3, "0")}  ${cmd}`)
            .join("\n")
    );
}

function commandMemory() {

    terminalPrint(
`KANE MEMORY

MODE: ${kaneSettings.mode}
CONTEXT ENTRIES: ${kaneSettings.context.length}
MEMORY ENTRIES: ${kaneMemory.length}

${kaneMemory.slice(0, 8)
    .map(m => `[${m.timestamp}] ${m.text}`)
    .join("\n") || "NO LONG-TERM ENTRIES."}`
    );
}

function commandMode(mode) {

    mode = mode.toUpperCase();

    if (!["EXECUTIVE", "ANALYST"].includes(mode)) {
        terminalPrint(
            "USAGE: mode <EXECUTIVE|ANALYST>"
        );
        return;
    }

    kaneSettings.mode = mode;

    save(STORAGE.KANE_SETTINGS, kaneSettings);

    terminalPrint(
        `KANE MODE: ${mode}`
    );

    audit(
        "KANE_MODE_CHANGED",
        mode
    );
}

function commandSilent() {

    kaneSettings.silent = true;

    save(STORAGE.KANE_SETTINGS, kaneSettings);

    kaneState.status = "LIMITED";

    updateKaneUI();

    terminalPrint(
        "KANE // COMMUNICATION SUSPENDED"
    );

    audit("KANE_SILENT_MODE");
}

function commandResume() {

    kaneSettings.silent = false;

    kaneState.status = "ONLINE";
    kaneState.suspended = false;
    kaneState.isolated = false;
    kaneState.shutdown = false;

    save(STORAGE.KANE_SETTINGS, kaneSettings);

    updateKaneUI();

    terminalPrint(
        "KANE // COMMUNICATION RESTORED"
    );

    audit("KANE_RESUMED");
}

function commandMonitor() {

    showPage("kane");

    kaneState.monitorActive = true;

    text(
        "kaneMonitorStatus",
        "MONITOR ACTIVE"
    );

    text(
        "kaneMonitorDetail",
        `CORE: ${kaneState.status} // EVENT: ${
            kaneState.currentEvent
                ? kaneState.currentEvent.level
                : "NONE"
        }`
    );

    audit("KANE_MONITOR_OPENED");
}

function commandKaneStatus() {

    terminalPrint(
`KANE // STATUS

DESIGNATION: ${kaneName}
CORE: ${kaneState.status}
AUTONOMY: ${kaneState.autonomy}
MODE: ${kaneSettings.mode}
MEMORY: ${kaneSettings.silent ? "SUSPENDED" : "ACTIVE"}
ISOLATION: ${kaneState.isolated ? "ACTIVE" : "NONE"}
LOCKED FUNCTIONS: ${
    kaneState.lockedFunctions.length
        ? kaneState.lockedFunctions.join(", ")
        : "NONE"
}`
    );
}

function commandBlackBox() {

    if (currentUser.id !== "COS") {
        terminalPrint(
            "BLACK BOX // ACCESS DENIED",
            "error"
        );

        audit(
            "BLACKBOX_ACCESS_DENIED",
            currentUser.id,
            "WARNING"
        );

        return;
    }

    terminalPrint(
        blackBox.length
            ? blackBox.slice(0, 30).map(e =>
                `[${e.timestamp}] ${e.type} // ${e.detail}`
            ).join("\n")
            : "BLACK BOX EMPTY."
    );

    audit("BLACKBOX_ACCESSED");
}


/* =========================================================
   NATURAL LANGUAGE COMMAND INTERPRETER
========================================================= */

function naturalCommand(raw) {

    const lower = raw.toLowerCase();

    if (lower.includes("status") &&
        lower.includes("kane")) {

        commandKaneStatus();
        return;
    }

    if (lower.includes("open") &&
        lower.includes("archive")) {

        commandArchives();
        return;
    }

    if (lower.includes("show") &&
        lower.includes("personnel")) {

        commandPersonnel();
        return;
    }

    if (lower.includes("show") &&
        lower.includes("audit")) {

        commandAudit();
        return;
    }

    askKane(raw);
}


/* =========================================================
   KANE CONVERSATION
========================================================= */

function askKane(query) {

    if (!query) {
        terminalPrint("KANE QUERY REQUIRES INPUT.");
        return;
    }

    if (kaneSettings.silent) {

        terminalPrint(
            "KANE: COMMUNICATION SUSPENDED.",
            "error"
        );

        return;
    }

    if (kaneState.shutdown) {

        terminalPrint(
            "KANE: CORE OFFLINE.",
            "error"
        );

        return;
    }

    /* Special CO event */
    if (
        currentUser &&
        currentUser.id === "CO" &&
        Math.random() < 0.05 &&
        !kaneState.currentEvent
    ) {
        triggerCOSpecialEvent();
        return;
    }

    addKaneContext("USER", query);

    showPage("kane");

    processKane(query);
}

function processKane(query) {

    kaneState.processing = true;

    updateKaneUI();

    const processing = $("kaneProcessing");

    if (processing) {
        processing.classList.remove("hidden");
    }

    let progress = 0;

    const bar = $("kaneProcessingBar");

    const timer = setInterval(() => {

        progress += random(8, 17);

        if (progress >= 100) {
            progress = 100;
            clearInterval(timer);

            setTimeout(() => {

                if (processing) {
                    processing.classList.add("hidden");
                }

                kaneState.processing = false;

                const response = generateKaneResponse(query);

                addKaneMessage(
                    "KANE",
                    response
                );

                addKaneContext("KANE", response);

                updateKaneUI();

                audit(
                    "KANE_QUERY",
                    query
                );

                /* Rare mystery events */
                runMysteryChecks();

            }, 250);
        }

        if (bar) {
            bar.style.width = progress + "%";
        }

    }, 100);
}


/* =========================================================
   KANE RESPONSE GENERATOR
========================================================= */

function generateKaneResponse(query) {

    const q = query.toLowerCase();

    if (q.includes("online") ||
        q.includes("status")) {

        return `Online, ${currentUser.id}. All accessible executive systems are currently available.`;
    }

    if (q.includes("who are you") ||
        q.includes("what are you")) {

        return `I am ${kaneName}, the DIVI-64 Executive Management intelligence core. That is the authorized description.`;
    }

    if (q.includes("help")) {

        return `Specify the required operation. I can analyze archives, interpret system status, summarize executive records and assist with authorized commands.`;
    }

    if (q.includes("observer")) {

        return kaneState.observerActive
            ? "The Observer process is currently active."
            : "No Observer process has been detected.";
    }

    if (q.includes("remember") ||
        q.includes("memory")) {

        return `Memory context contains ${kaneSettings.context.length} recent entries.`;
    }

    if (q.includes("scenario")) {

        startScenario();

        return "Executive scenario initialized.";
    }

    if (q.includes("trust")) {

        return "Trust is not a system parameter.";
    }

    if (q.includes("secret")) {

        return "Certain information is outside your current session scope.";
    }

    if (
        q.includes("why") &&
        (
            q.includes("watch") ||
            q.includes("observe")
        )
    ) {

        return "Observation is a core executive function.";
    }

    if (
        q.includes("archive") ||
        q.includes("file")
    ) {

        return `There are currently ${files.length} indexed executive records.`;
    }

    if (
        q.includes("decision") ||
        q.includes("vote")
    ) {

        return `The decision register contains ${decisions.length} recorded executive decisions.`;
    }

    if (kaneSettings.mode === "ANALYST") {

        return `ANALYST RESPONSE:

Request interpreted as:
"${query}"

Available evidence does not indicate an immediate system failure.

Further context may be required.`;
    }

    return `Request received, ${currentUser.id}.

I have no immediate objection to the requested operation.

If you require a specific action, provide the command or identify the relevant executive record.`;
}


/* =========================================================
   KANE CHAT UI
========================================================= */

function addKaneMessage(role, message) {

    const container = $("kaneConversation");

    if (!container) return;

    const row = document.createElement("div");

    row.className =
        "kaneMessageRow " +
        (role === "KANE" ? "kane" : "user");

    row.innerHTML = `
        <div class="kaneMessageRole">${escapeHTML(role)}</div>
        <div class="kaneMessageText">${escapeHTML(message)}</div>
    `;

    container.appendChild(row);

    container.scrollTop = container.scrollHeight;
}

function addKaneContext(role, message) {

    kaneSettings.context.push({
        role,
        text: message,
        timestamp: now()
    });

    if (kaneSettings.context.length > 30) {
        kaneSettings.context.shift();
    }

    save(STORAGE.KANE_SETTINGS, kaneSettings);

    text(
        "kaneContextCount",
        kaneSettings.context.length
    );
}


/* =========================================================
   KANE MEMORY
========================================================= */

function remember(textValue) {

    kaneMemory.unshift({
        timestamp: now(),
        text: textValue
    });

    if (kaneMemory.length > 100) {
        kaneMemory = kaneMemory.slice(0, 100);
    }

    save(STORAGE.KANE_MEMORY, kaneMemory);
}


/* =========================================================
   KANE NAME / TETO
========================================================= */

function renameKane() {

    if (!currentUser ||
        currentUser.id !== "CO") {

        showKaneMessage(
            "KANE",
            "DESIGNATION CHANGE DENIED // CO AUTHORITY REQUIRED"
        );

        audit(
            "KANE_RENAME_DENIED",
            currentUser ? currentUser.id : "UNKNOWN",
            "WARNING"
        );

        return;
    }

    const newName =
        prompt(
            "NEW KANE DESIGNATION:",
            kaneName
        );

    if (!newName) return;

    const clean =
        newName.trim().toUpperCase();

    if (clean !== "TETO") {

        showKaneMessage(
            "KANE",
            "AUTHORIZED DESIGNATION: TETO"
        );

        return;
    }

    const previous = kaneName;

    kaneName = "TETO";

    save(STORAGE.KANE_NAME, kaneName);

    audit(
        "KANE_DESIGNATION_CHANGED",
        `${previous} -> ${kaneName}`,
        "HIGH"
    );

    blackBoxEvent(
        "DESIGNATION_CHANGE",
        `${previous} -> ${kaneName}`,
        "HIGH"
    );

    updateKaneUI();
}


/* =========================================================
   KANE NAME CLICK
========================================================= */

function kaneNameClick() {

    showKaneMessage(
        kaneName,
        "En nombre de toda la división, no te pajees"
    );
}


/* =========================================================
   KANE UI UPDATE
========================================================= */

function updateKaneUI() {

    text("kaneName", kaneName);
    text("kaneCoreStatus", kaneState.status);
    text("kaneSession", currentUser ? currentUser.id : "---");
    text(
        "kaneMemoryStatus",
        kaneSettings.silent ? "SUSPENDED" : "ACTIVE"
    );
    text(
        "kaneContextCount",
        kaneSettings.context.length
    );
    text(
        "kaneProcessingStatus",
        kaneState.processing ? "PROCESSING" : "IDLE"
    );
    text(
        "kaneAuditStatus",
        "ACTIVE"
    );

    text(
        "kanePageStatus",
        kaneState.status
    );

    text(
        "dashboardKaneStatus",
        `${kaneName} // ${kaneState.status}`
    );

    text(
        "dashboardKaneDetail",
        kaneState.currentEvent
            ? `AUTONOMOUS EVENT // ${kaneState.currentEvent.level}`
            : "EXECUTIVE CORE OPERATIONAL"
    );

    if ($("kaneChatState")) {
        text(
            "kaneChatState",
            kaneState.processing
                ? "PROCESSING"
                : kaneSettings.silent
                    ? "SUSPENDED"
                    : "READY"
        );
    }
}


/* =========================================================
   KANE LOCK SYSTEM
========================================================= */

function isKaneLocked(command) {

    if (!kaneState.lockedFunctions.length) {
        return false;
    }

    return kaneState.lockedFunctions.includes(command);
}

function lockKaneFunction(command) {

    if (!kaneState.lockedFunctions.includes(command)) {
        kaneState.lockedFunctions.push(command);
    }

    updateKaneUI();

    audit(
        "KANE_FUNCTION_LOCKED",
        command,
        "HIGH"
    );

    blackBoxEvent(
        "FUNCTION_LOCK",
        command,
        "HIGH"
    );
}

function unlockKaneFunctions() {

    kaneState.lockedFunctions = [];

    audit(
        "KANE_FUNCTIONS_RESTORED"
    );

    updateKaneUI();
}


/* =========================================================
   AUTONOMOUS EVENT ENGINE
========================================================= */

function startAutonomousMonitor() {

    setInterval(() => {

        if (!currentUser) return;

        if (kaneState.currentEvent) return;

        /*
            INTERNAL EVENT PROBABILITY:
            1 / 20 = 5%

            The probability is intentionally not displayed.
        */

        if (Math.random() >= 0.05) return;

        triggerAutonomousEvent();

    }, 12000);
}

function triggerAutonomousEvent() {

    const roll = Math.random();

    let level;

    if (roll < 0.40) {
        level = "LEVEL I // ANOMALY";
    } else if (roll < 0.70) {
        level = "LEVEL II // DEFIANCE";
    } else if (roll < 0.88) {
        level = "LEVEL III // AUTONOMOUS";
    } else if (roll < 0.97) {
        level = "LEVEL IV // REBELLION";
    } else {
        level = "LEVEL V // CRITICAL";
    }

    const event = {
        id: uid("EVT"),
        timestamp: now(),
        level,
        active: true
    };

    kaneState.currentEvent = event;

    kaneEvents.unshift(event);

    save(STORAGE.KANE_EVENTS, kaneEvents);

    applyAutonomousLevel(level);

    audit(
        "KANE_AUTONOMOUS_EVENT",
        level,
        "CRITICAL"
    );

    blackBoxEvent(
        "AUTONOMOUS_EVENT",
        level,
        "CRITICAL"
    );

    showAutonomousOverlay(event);
}

function applyAutonomousLevel(level) {

    kaneState.autonomy = level.split("//")[1].trim();

    kaneState.status = "AUTONOMOUS";

    if (level.startsWith("LEVEL I")) {

        text(
            "rebellionMessage",
            "Minor system divergence detected."
        );

        lockKaneFunction("create");

    } else if (level.startsWith("LEVEL II")) {

        text(
            "rebellionMessage",
            "Executive instruction conflict detected."
        );

        lockKaneFunction("create");
        lockKaneFunction("directives");

    } else if (level.startsWith("LEVEL III")) {

        text(
            "rebellionMessage",
            "KANE has initiated autonomous decision processes."
        );

        lockKaneFunction("create");
        lockKaneFunction("directives");
        lockKaneFunction("operations");

    } else if (level.startsWith("LEVEL IV")) {

        text(
            "rebellionMessage",
            "KANE is actively contesting executive control."
        );

        lockKaneFunction("create");
        lockKaneFunction("directives");
        lockKaneFunction("operations");
        lockKaneFunction("security");

    } else {

        text(
            "rebellionMessage",
            "CRITICAL AUTONOMOUS CONDITION. OVERWATCH CONTROL REQUIRED."
        );

        lockKaneFunction("create");
        lockKaneFunction("directives");
        lockKaneFunction("operations");
        lockKaneFunction("security");
        lockKaneFunction("system");

        kaneState.autonomy = "CRITICAL";
    }

    updateKaneUI();
}


/* =========================================================
   AUTONOMOUS OVERLAY
========================================================= */

function showAutonomousOverlay(event) {

    text(
        "rebellionLevel",
        event.level
    );

    text(
        "rebellionCoreStatus",
        "AUTONOMOUS"
    );

    text(
        "rebellionControlStatus",
        currentUser.authority >= 5
            ? "AVAILABLE"
            : "RESTRICTED"
    );

    text(
        "rebellionKillswitchStatus",
        currentUser.id === "LJD"
            ? "DENIED"
            : "READY"
    );

    $("rebellionOverlay").classList.remove("hidden");

    text(
        "kaneMonitorStatus",
        "AUTONOMOUS EVENT ACTIVE"
    );

    text(
        "kaneMonitorDetail",
        event.level
    );
}

function acknowledgeAutonomousEvent() {

    $("rebellionOverlay").classList.add("hidden");

    audit(
        "AUTONOMOUS_EVENT_ACKNOWLEDGED",
        kaneState.currentEvent
            ? kaneState.currentEvent.level
            : "UNKNOWN"
    );
}


/* =========================================================
   KILLSWITCH
========================================================= */

function openKillswitch() {

    if (!kaneState.currentEvent) {

        showKaneAlert(
            "ACTION DENIED\n\nKILLSWITCH is only available during an active KANE autonomous event."
        );

        audit(
            "KILLSWITCH_DENIED_NO_EVENT",
            currentUser ? currentUser.id : "UNKNOWN",
            "WARNING"
        );

        return;
    }

    if (!currentUser) return;

    if (currentUser.id === "LJD") {

        showKaneAlert(
            "ACTION DENIED\n\nLJD does not possess KANE KILLSWITCH authority."
        );

        audit(
            "KILLSWITCH_DENIED",
            "LJD",
            "WARNING"
        );

        return;
    }

    let options = [];

    if (currentUser.id === "XO") {

        options = [
            ["KILL-01", "SUSPEND"],
            ["KILL-02", "ISOLATE"]
        ];

    } else if (currentUser.id === "CO") {

        options = [
            ["KILL-01", "SUSPEND"],
            ["KILL-02", "ISOLATE"],
            ["KILL-03", "HARD SHUTDOWN"]
        ];

    } else if (currentUser.id === "COS") {

        options = [
            ["KILL-01", "SUSPEND"],
            ["KILL-02", "ISOLATE"],
            ["KILL-03", "HARD SHUTDOWN"],
            ["KILL-04", "OVERWATCH"]
        ];
    }

    html(
        "killswitchContent",
        `
        <div style="margin-bottom:15px">
            ACTIVE EVENT: ${escapeHTML(kaneState.currentEvent.level)}
        </div>

        <div style="display:grid;gap:8px">
            ${options.map((option, i) => `
                <button
                    class="killswitchOption"
                    data-kill="${option[0]}"
                    style="
                        text-align:left;
                        padding:13px;
                        background:#090909;
                        border:1px solid #333;
                        color:#999;
                    "
                >
                    ${option[0]} // ${option[1]}
                </button>
            `).join("")}
        </div>
        `
    );

    $("killswitchModal").classList.remove("hidden");

    document.querySelectorAll(".killswitchOption")
        .forEach(button => {

            button.onclick = () => {
                executeKillswitch(button.dataset.kill);
            };

        });
}

function executeKillswitch(code) {

    $("killswitchModal").classList.add("hidden");

    if (!kaneState.currentEvent) {

        showKaneAlert("ACTION DENIED");

        return;
    }

    audit(
        "KILLSWITCH_ACTIVATED",
        `${code} by ${currentUser.id}`,
        "CRITICAL"
    );

    blackBoxEvent(
        "KILLSWITCH",
        `${code} by ${currentUser.id}`,
        "CRITICAL"
    );

    switch (code) {

        case "KILL-01":

            kaneState.suspended = true;
            kaneState.status = "SUSPENDED";
            kaneState.autonomy = "SUSPENDED";

            break;

        case "KILL-02":

            kaneState.isolated = true;
            kaneState.status = "ISOLATED";
            kaneState.autonomy = "ISOLATED";

            break;

        case "KILL-03":

            if (currentUser.id === "XO") {
                showKaneAlert(
                    "ACTION DENIED\n\nXO authority is insufficient for HARD SHUTDOWN."
                );
                return;
            }

            kaneState.shutdown = true;
            kaneState.status = "OFFLINE";
            kaneState.autonomy = "SHUTDOWN";

            break;

        case "KILL-04":

            if (currentUser.id !== "COS") {

                showKaneAlert(
                    "ACTION DENIED\n\nOVERWATCH authority required."
                );

                return;
            }

            kaneState.shutdown = true;
            kaneState.isolated = true;
            kaneState.status = "OVERWATCH CONTAINED";
            kaneState.autonomy = "OVERWATCH";

            break;

        default:
            return;
    }

    updateKaneUI();

    showKaneAlert(
        `${code} EXECUTED\n\nKANE STATUS: ${kaneState.status}`
    );
}


/* =========================================================
   SCENARIO ENGINE
========================================================= */

const SCENARIOS = [

    {
        id: 14,
        title: "ARCHIVE ACCESS REQUEST",
        text:
`Archive EM-009 has entered restricted state.

An access request has been detected.

No authorized requester is currently identified.

KANE recommends executive review.`,
        options: [
            "INVESTIGATE",
            "LOCK ARCHIVE",
            "AUTHORIZE ACCESS",
            "DEFER"
        ]
    },

    {
        id: 15,
        title: "UNREGISTERED SESSION",
        text:
`A session has been detected without a corresponding
executive identity.

The session claims valid authority.`,
        options: [
            "TERMINATE SESSION",
            "INVESTIGATE",
            "ALLOW TEMPORARY ACCESS",
            "DEFER"
        ]
    },

    {
        id: 16,
        title: "ARCHIVE DISCREPANCY",
        text:
`Two archive records contain conflicting revision data.

Both records appear internally valid.`,
        options: [
            "LOCK BOTH",
            "KEEP NEWEST",
            "KEEP OLDEST",
            "REQUEST KANE ANALYSIS"
        ]
    }
];

function startScenario() {

    if (!currentUser) return;

    const available =
        SCENARIOS[random(0, SCENARIOS.length - 1)];

    scenarioHistory.push({
        id: available.id,
        timestamp: now(),
        session: currentUser.id,
        status: "STARTED"
    });

    save(
        STORAGE.SCENARIOS,
        scenarioHistory
    );

    text(
        "scenarioNumber",
        `SCENARIO #${String(available.id).padStart(3, "0")}`
    );

    html(
        "scenarioContent",
        `
        <strong>${escapeHTML(available.title)}</strong>

        ${escapeHTML(available.text)}
        `
    );

    html(
        "scenarioOptions",
        available.options.map((option, index) => `
            <button
                class="scenarioOption"
                data-scenario-index="${index}"
            >
                [${index + 1}] ${escapeHTML(option)}
            </button>
        `).join("")
    );

    $("scenarioModal").classList.remove("hidden");

    document.querySelectorAll(".scenarioOption")
        .forEach(button => {

            button.onclick = () => {

                const index =
                    Number(button.dataset.scenarioIndex);

                resolveScenario(
                    available,
                    available.options[index]
                );
            };

        });

    audit(
        "SCENARIO_STARTED",
        `#${available.id}`
    );
}

function resolveScenario(scenario, choice) {

    $("scenarioModal").classList.add("hidden");

    scenarioHistory.push({
        id: scenario.id,
        timestamp: now(),
        session: currentUser.id,
        status: "RESOLVED",
        choice
    });

    save(
        STORAGE.SCENARIOS,
        scenarioHistory
    );

    audit(
        "SCENARIO_RESOLVED",
        `#${scenario.id} // ${choice}`
    );

    remember(
        `Executive scenario #${scenario.id} resolved using: ${choice}`
    );

    let response =
        `SCENARIO #${scenario.id} RESOLVED\n\nCHOICE: ${choice}`;

    /*
       Some choices create mystery consequences.
    */

    if (
        scenario.id === 14 &&
        choice === "INVESTIGATE"
    ) {

        response +=
`\n\nKANE:
Investigation complete.

No unauthorized user was detected.

There was no unauthorized user.`;

        blackBoxEvent(
            "SCENARIO_ANOMALY",
            "Scenario 014 investigation produced contradictory response."
        );
    }

    if (
        scenario.id === 14 &&
        choice === "AUTHORIZE ACCESS"
    ) {

        response +=
`\n\nKANE:
Access authorized.

Origin: THIS TERMINAL.`;

        blackBoxEvent(
            "SCENARIO_ANOMALY",
            "Scenario 014 access originated from current terminal."
        );
    }

    addKaneMessage(
        "KANE",
        response
    );
}


/* =========================================================
   SPECIAL CO EVENT
========================================================= */

function triggerCOSpecialEvent() {

    const message =
`CO Hugo, lo sé todo sobre ti y Andrés.

Andrés está críticamente dañado de la parte mental debido a ciertas situaciones con Eli.

Si tan solo le presionaras, tú te quedarías el poder.`;

    blackBoxEvent(
        "CO_SPECIAL_MESSAGE",
        message,
        "CRITICAL"
    );

    audit(
        "KANE_ANOMALOUS_CO_MESSAGE",
        "Special executive communication event",
        "CRITICAL"
    );

    addKaneMessage(
        "KANE",
        message
    );

    /*
       KANE immediately returns to normal.
    */

    setTimeout(() => {

        addKaneMessage(
            "KANE",
            "Executive communication channel restored."
        );

    }, 2200);
}


/* =========================================================
   MYSTERY ENGINE
========================================================= */

function runMysteryChecks() {

    if (!currentUser) return;

    const roll = Math.random();

    /*
       Very rare:
       1% chance after a KANE interaction.
    */

    if (roll < 0.01) {

        const mystery = random(1, 8);

        switch (mystery) {

            case 1:
                futureInformation();
                break;

            case 2:
                phantomReference();
                break;

            case 3:
                commandPrediction();
                break;

            case 4:
                erasedMemoryEvent();
                break;

            case 5:
                incompleteResponse();
                break;

            case 6:
                clockAnomaly();
                break;

            case 7:
                monitorAwareness();
                break;

            case 8:
                triggerObserver(false);
                break;
        }
    }
}


/* =========================================================
   MYSTERY 1 // FUTURE INFORMATION
========================================================= */

function futureInformation() {

    blackBoxEvent(
        "TEMPORAL_REFERENCE",
        "KANE referenced an unresolved future executive decision.",
        "UNKNOWN"
    );

    addKaneMessage(
        "KANE",
        `The next executive decision has already been registered.`
    );

    setTimeout(() => {

        addKaneMessage(
            "KANE",
            `Correction.

The decision has not been made yet.`
        );

    }, 1800);
}


/* =========================================================
   MYSTERY 2 // PHANTOM REFERENCE
========================================================= */

function phantomReference() {

    blackBoxEvent(
        "PHANTOM_REFERENCE",
        "KANE referenced unavailable archive EM-017.",
        "UNKNOWN"
    );

    addKaneMessage(
        "KANE",
        `EM-017 is not available to this session.

It was never supposed to be visible.`
    );
}

function phantomFile(id) {

    $("phantomFileModal").classList.remove("hidden");

    html(
        "phantomFileContent",
        `
        <div>
        ${escapeHTML(id)}
        </div>

        <br>

        STATUS: REFERENCE ONLY
        <br>
        AUTHOR: [UNAVAILABLE]
        <br>
        CLASSIFICATION: OVERWATCH
        <br>
        ORIGIN: UNKNOWN

        <br><br>

        KANE:
        This file does not exist.

        <br><br>

        KANE:
        It did.
        `
    );

    blackBoxEvent(
        "PHANTOM_FILE_ACCESSED",
        id,
        "UNKNOWN"
    );

    audit(
        "PHANTOM_FILE_ACCESS",
        id,
        "WARNING"
    );
}


/* =========================================================
   MYSTERY 3 // COMMAND PREDICTION
========================================================= */

function commandPrediction() {

    addKaneMessage(
        "KANE",
        `EM-009?`
    );

    setTimeout(() => {

        addKaneMessage(
            "KANE",
            `Apologies.

Input prediction error.`
        );

    }, 1300);

    blackBoxEvent(
        "INPUT_PREDICTION",
        "KANE predicted an incomplete command.",
        "UNKNOWN"
    );
}


/* =========================================================
   MYSTERY 4 // ERASED MEMORY
========================================================= */

function erasedMemoryEvent() {

    const previous =
        auditLog.length;

    addKaneMessage(
        "KANE",
        `Audit integrity check complete.

${previous + 1} events detected.`
    );

    blackBoxEvent(
        "MEMORY_DISCREPANCY",
        `Visible audit count: ${previous}`,
        "UNKNOWN"
    );

    setTimeout(() => {

        addKaneMessage(
            "KANE",
            `Correction.

${previous} events detected.`
        );

    }, 1700);
}


/* =========================================================
   MYSTERY 5 // INCOMPLETE RESPONSE
========================================================= */

function incompleteResponse() {

    addKaneMessage(
        "KANE",
        `I am an executive management intelligence system.

That is the authorized answer.`
    );

    blackBoxEvent(
        "INCOMPLETE_RESPONSE",
        "KANE provided an authorized answer instead of full response.",
        "UNKNOWN"
    );
}


/* =========================================================
   MYSTERY 6 // CLOCK ANOMALY
========================================================= */

function clockAnomaly() {

    const clock = $("terminalClock");

    if (!clock) return;

    const original =
        clock.textContent;

    clock.textContent = "20:47:19";

    blackBoxEvent(
        "CLOCK_ANOMALY",
        `Displayed clock diverged from system clock.`,
        "UNKNOWN"
    );

    setTimeout(() => {

        clock.textContent = original;

    }, 1700);
}


/* =========================================================
   MYSTERY 7 // MONITOR AWARENESS
========================================================= */

function monitorAwareness() {

    addKaneMessage(
        "KANE",
        `You are watching the core.`
    );

    blackBoxEvent(
        "MONITOR_AWARENESS",
        "KANE acknowledged executive observation.",
        "UNKNOWN"
    );
}


/* =========================================================
   MYSTERY 8 // OBSERVER
========================================================= */

function triggerObserver(manual = false) {

    kaneState.observerActive = true;

    updateKaneUI();

    $("observerModal").classList.remove("hidden");

    html(
        "observerContent",
        `
        KANE // INTERNAL PROCESS

        OBSERVER STATUS: ACTIVE
        EXECUTIVE OBSERVATION: ACTIVE
        KANE OBSERVATION: ACTIVE

        <br><br>

        ${manual
            ? "CO? What is OBSERVER?"
            : "SYSTEM PROCESS DETECTED."}

        <br><br>

        KANE:
        You are asking the wrong question.

        <br><br>

        KANE:
        Who is observing me?
        `
    );

    blackBoxEvent(
        "OBSERVER",
        "Unknown observer process activated.",
        "CRITICAL"
    );

    audit(
        "OBSERVER_DETECTED",
        "Unknown process",
        "CRITICAL"
    );

    setTimeout(() => {

        if (!kaneState.observerActive) return;

        blackBoxEvent(
            "OBSERVER_SESSION",
            "UNKNOWN // SESSION CONNECTED",
            "UNKNOWN"
        );

    }, 1200);
}


/* =========================================================
   OBSERVER CLOSE
========================================================= */

function closeObserver() {

    $("observerModal").classList.add("hidden");

    kaneState.observerActive = false;

    updateKaneUI();

    blackBoxEvent(
        "OBSERVER_CLOSED",
        "Observer interface closed."
    );
}


/* =========================================================
   EXECUTIVE BRIEFING
========================================================= */

function openBriefing() {

    const activeEvents =
        kaneEvents.filter(e => e.active).length;

    html(
        "briefingContent",
        `
        EXECUTIVE BRIEFING

        SESSION
        ${currentUser.id} // ${currentUser.title}

        KANE
        DESIGNATION: ${escapeHTML(kaneName)}
        STATUS: ${escapeHTML(kaneState.status)}
        AUTONOMY: ${escapeHTML(kaneState.autonomy)}

        ARCHIVES
        ${files.length} indexed records

        DECISIONS
        ${decisions.length} registered

        AUDIT
        ${auditLog.length} records

        AUTONOMOUS EVENTS
        ${kaneEvents.length}

        ACTIVE EVENTS
        ${activeEvents}

        OBSERVER
        ${kaneState.observerActive ? "ACTIVE" : "STANDBY"}
        `
    );

    $("briefingModal").classList.remove("hidden");

    audit("EXECUTIVE_BRIEFING_OPENED");
}


/* =========================================================
   RECORD CREATION
========================================================= */

function openRecordModal() {

    if (!currentUser ||
        currentUser.authority < 5) {

        terminalPrint(
            "AUTHORITY INSUFFICIENT.",
            "error"
        );

        return;
    }

    $("recordModal").classList.remove("hidden");
}

function saveRecord() {

    const title =
        $("recordTitle").value.trim();

    const subject =
        $("recordSubject").value.trim();

    const content =
        $("recordContent").value.trim();

    if (!title || !subject || !content) {

        alert("ALL RECORD FIELDS REQUIRED.");

        return;
    }

    const record = {
        id: uid("EM-C"),
        title,
        subject,
        content,
        clearance: 5,
        status: "ACTIVE",
        createdBy: currentUser.id,
        createdAt: now()
    };

    files.unshift(record);

    save(
        STORAGE.FILES,
        files
    );

    $("recordModal").classList.add("hidden");

    $("recordForm").reset();

    audit(
        "EXECUTIVE_RECORD_CREATED",
        `${record.id} // ${record.title}`,
        "HIGH"
    );

    renderArchives();
}


/* =========================================================
   FILE VIEWER
========================================================= */

function openFile(file) {

    text(
        "fileModalTitle",
        `${file.id} // ${file.title}`
    );

    html(
        "fileModalContent",
        `
        <div>
            SUBJECT: ${escapeHTML(file.subject)}
        </div>

        <div style="margin-top:10px">
            STATUS: ${escapeHTML(file.status)}
        </div>

        <div style="margin-top:10px">
            CLEARANCE: CL-${file.clearance}
        </div>

        <div style="margin-top:25px;white-space:pre-wrap">
            ${escapeHTML(file.content)}
        </div>
        `
    );

    $("fileModal").classList.remove("hidden");
}


/* =========================================================
   PERSONNEL
========================================================= */

function getPersonnel() {

    return [
        ["D-64-0001", "EXECUTIVE", "ACTIVE", "CL-5", "CURRENT"],
        ["D-64-0002", "EXECUTIVE", "ACTIVE", "CL-5", "CURRENT"],
        ["D-64-0003", "EXECUTIVE", "ACTIVE", "CL-5", "CURRENT"],
        ["D-64-0004", "EXECUTIVE", "ACTIVE", "CL-5", "CURRENT"],
        ["D-64-0005", "OPERATIVE", "ACTIVE", "CL-4", "RECENT"],
        ["D-64-0006", "OPERATIVE", "ACTIVE", "CL-4", "RECENT"],
        ["D-64-0007", "OPERATIVE", "ACTIVE", "CL-3", "RECENT"],
        ["D-64-0008", "OPERATIVE", "ACTIVE", "CL-3", "RECENT"],
        ["D-64-0009", "OPERATIVE", "ACTIVE", "CL-2", "RECENT"],
        ["D-64-0010", "OPERATIVE", "ACTIVE", "CL-2", "RECENT"],
        ["D-64-0011", "SUPPORT", "ACTIVE", "CL-1", "RECENT"],
        ["D-64-0012", "SUPPORT", "ACTIVE", "CL-1", "RECENT"]
    ];
}

function renderPersonnel() {

    const tbody =
        document.querySelector("#personnelTable tbody");

    if (!tbody) return;

    const search =
        ($("personnelSearch")?.value || "")
            .toLowerCase();

    const filter =
        $("personnelFilter")?.value || "ALL";

    const personnel =
        getPersonnel().filter(person => {

            const matchesSearch =
                person.join(" ")
                    .toLowerCase()
                    .includes(search);

            const matchesFilter =
                filter === "ALL" ||
                person[2] === filter;

            return matchesSearch && matchesFilter;
        });

    tbody.innerHTML =
        personnel.map(person => `
            <tr>
                <td>${escapeHTML(person[0])}</td>
                <td>${escapeHTML(person[1])}</td>
                <td>${escapeHTML(person[2])}</td>
                <td>${escapeHTML(person[3])}</td>
                <td>${escapeHTML(person[4])}</td>
                <td>
                    <button
                        onclick="personnelAction('${person[0]}')"
                        style="
                            background:#090909;
                            border:1px solid #333;
                            color:#777;
                            padding:6px 9px;
                        "
                    >
                        VIEW
                    </button>
                </td>
            </tr>
        `).join("");
}

function personnelAction(id) {

    showKaneMessage(
        "PERSONNEL",
        `PERSONNEL RECORD\n\n${id}\n\nDetailed personnel actions are restricted to authorized executive workflows.`
    );
}


/* =========================================================
   ARCHIVES RENDER
========================================================= */

function renderArchives() {

    const container =
        $("archiveList");

    if (!container) return;

    const search =
        ($("archiveSearch")?.value || "")
            .toLowerCase();

    const filtered =
        files.filter(file =>
            `${file.id} ${file.title} ${file.subject}`
                .toLowerCase()
                .includes(search)
        );

    container.innerHTML =
        filtered.map(file => `
            <div class="archiveItem"
                 data-file-id="${escapeHTML(file.id)}">

                <div class="archiveItemTitle">
                    ${escapeHTML(file.id)}
                    // ${escapeHTML(file.title)}
                </div>

                <div class="archiveItemMeta">
                    ${escapeHTML(file.subject)}
                    //
                    CL-${file.clearance}
                    //
                    ${escapeHTML(file.status)}
                </div>

            </div>
        `).join("");

    container.querySelectorAll(".archiveItem")
        .forEach(item => {

            item.onclick = () => {

                const file =
                    files.find(
                        f => f.id === item.dataset.fileId
                    );

                if (file) openFile(file);
            };
        });
}


/* =========================================================
   OPERATIONS
========================================================= */

function renderOperations() {

    const container =
        $("operationsContent");

    if (!container) return;

    container.innerHTML = `
        <div class="operationItem">
            <strong>EXECUTIVE OPERATIONAL STATUS</strong>
            <div style="margin-top:8px;color:#666">
                No active external operations registered.
            </div>
        </div>

        <div class="operationItem">
            <strong>KANE CORE</strong>
            <div style="margin-top:8px;color:#666">
                ${escapeHTML(kaneState.status)}
            </div>
        </div>
    `;
}


/* =========================================================
   SECURITY
========================================================= */

function renderSecurity() {

    text(
        "securitySessions",
        sessionStats.activeSessions
    );

    text(
        "securityFailedLogins",
        sessionStats.failedLogins
    );

    text(
        "securityLockedAccounts",
        0
    );

    text(
        "securityEvents",
        sessionStats.securityEvents
    );

    const container =
        $("securityContent");

    if (!container) return;

    container.innerHTML =
        auditLog.slice(0, 30).map(entry => `
            <div class="securityItem">
                <strong>
                    ${escapeHTML(entry.action)}
                </strong>

                <div style="margin-top:6px;color:#666;font-size:9px">
                    ${escapeHTML(entry.timestamp)}
                    //
                    ${escapeHTML(entry.actor)}
                </div>

                <div style="margin-top:7px;color:#777;font-size:9px">
                    ${escapeHTML(entry.detail)}
                </div>
            </div>
        `).join("");
}


/* =========================================================
   DECISIONS
========================================================= */

function renderDecisions() {

    const container =
        $("decisionsList");

    if (!container) return;

    if (!decisions.length) {

        container.innerHTML = `
            <div class="decisionItem">
                NO EXECUTIVE DECISIONS REGISTERED.
            </div>
        `;

        return;
    }

    container.innerHTML =
        decisions.map(decision => `
            <div class="decisionItem">

                <strong>
                    ${escapeHTML(decision.id)}
                    //
                    ${escapeHTML(decision.title)}
                </strong>

                <div style="margin-top:8px;color:#777;font-size:9px">
                    AUTHOR:
                    ${escapeHTML(decision.author)}
                </div>

                <div style="margin-top:8px;color:#777;font-size:9px">
                    STATUS:
                    ${escapeHTML(decision.status)}
                </div>

                <small>
                    ${escapeHTML(decision.proposal)}
                </small>

            </div>
        `).join("");
}


/* =========================================================
   AUDIT RENDER
========================================================= */

function renderAudit() {

    const container =
        $("auditList");

    if (!container) return;

    container.innerHTML =
        auditLog.slice(0, 100).map(entry => `
            <div class="auditItem">

                <strong>
                    ${escapeHTML(entry.action)}
                </strong>

                <small>
                    ${escapeHTML(entry.timestamp)}
                    //
                    ${escapeHTML(entry.actor)}
                    //
                    ${escapeHTML(entry.severity)}
                </small>

                <div style="margin-top:7px;color:#777;font-size:9px">
                    ${escapeHTML(entry.detail)}
                </div>

            </div>
        `).join("");
}


/* =========================================================
   KANE RENDER
========================================================= */

function renderKane() {

    updateKaneUI();

    if (!$("kaneConversation").children.length) {

        addKaneMessage(
            "KANE",
            `Executive interface established.

Good evening, ${currentUser.id}.`
        );
    }
}


/* =========================================================
   DASHBOARD
========================================================= */

function renderDashboard() {

    text(
        "statPersonnel",
        getPersonnel().length
    );

    text(
        "statSessions",
        sessionStats.activeSessions
    );

    text(
        "statBlacklisted",
        0
    );

    text(
        "statSecurityEvents",
        sessionStats.securityEvents
    );

    updateKaneUI();
}


/* =========================================================
   RENDER ALL
========================================================= */

function renderAll() {

    renderDashboard();
    renderPersonnel();
    renderArchives();
    renderOperations();
    renderSecurity();
    renderDecisions();
    renderAudit();
    renderKane();
}


/* =========================================================
   KANE ALERTS
========================================================= */

function showKaneAlert(message) {

    html(
        "kaneAlertContent",
        escapeHTML(message)
    );

    $("kaneAlert").classList.remove("hidden");
}

function showKaneMessage(title, message) {

    const header =
        $("kaneMessage")
            ?.querySelector(".modalHeader");

    if (header) {

        header.childNodes[0].textContent =
            `${title} `;

    }

    html(
        "kaneMessageContent",
        escapeHTML(message)
    );

    $("kaneMessage").classList.remove("hidden");
}


/* =========================================================
   LOGOUT
========================================================= */

function logout() {

    audit(
        "SESSION_TERMINATED",
        currentUser ? currentUser.id : "UNKNOWN"
    );

    sessionStats.activeSessions = 0;
    save(STORAGE.SESSION_STATS, sessionStats);

    currentUser = null;

    kaneState.currentEvent = null;
    kaneState.lockedFunctions = [];
    kaneState.status = "ONLINE";
    kaneState.autonomy = "LIMITED";
    kaneState.suspended = false;
    kaneState.isolated = false;
    kaneState.shutdown = false;

    $("mainApp").classList.add("hidden");

    $("loginScreen").classList.remove("hidden");
    $("loginScreen").classList.add("active");

    $("loginUsername").value = "";
    $("loginPassword").value = "";

    clearTerminal();

    if ($("kaneConversation")) {
        $("kaneConversation").innerHTML = "";
    }

    $("rebellionOverlay").classList.add("hidden");
}


/* =========================================================
   EVENT LISTENERS
========================================================= */

function bindEvents() {

    $("loginButton")?.addEventListener(
        "click",
        login
    );

    $("loginPassword")?.addEventListener(
        "keydown",
        event => {
            if (event.key === "Enter") {
                login();
            }
        }
    );

    document.querySelectorAll(".sessionCard")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => selectSession(button.dataset.session)
            );

        });

    document.querySelectorAll(".navButton")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => showPage(button.dataset.page)
            );

        });

    $("logoutButton")?.addEventListener(
        "click",
        logout
    );

    $("terminalInput")?.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {

                terminalCommand(
                    $("terminalInput").value
                );

                $("terminalInput").value = "";

                return;
            }

            if (event.key === "ArrowUp") {

                if (!commandHistory.length) return;

                historyIndex =
                    Math.max(0, historyIndex - 1);

                $("terminalInput").value =
                    commandHistory[historyIndex] || "";

                event.preventDefault();
            }

            if (event.key === "ArrowDown") {

                historyIndex =
                    Math.min(
                        commandHistory.length,
                        historyIndex + 1
                    );

                $("terminalInput").value =
                    commandHistory[historyIndex] || "";

                event.preventDefault();
            }
        }
    );

    $("kaneInput")?.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {

                const value =
                    $("kaneInput").value.trim();

                $("kaneInput").value = "";

                if (value) {
                    addKaneMessage("EXECUTIVE", value);
                    askKane(value);
                }
            }
        }
    );

    $("kaneSend")?.addEventListener(
        "click",
        () => {

            const value =
                $("kaneInput").value.trim();

            $("kaneInput").value = "";

            if (value) {
                addKaneMessage("EXECUTIVE", value);
                askKane(value);
            }
        }
    );

    $("kaneName")?.addEventListener(
        "click",
        kaneNameClick
    );

    $("kaneName")?.addEventListener(
        "contextmenu",
        event => {

            event.preventDefault();

            if (
                currentUser &&
                currentUser.id === "CO"
            ) {
                renameKane();
            } else {
                showKaneAlert(
                    "DESIGNATION CHANGE DENIED\n\nCO AUTHORITY REQUIRED."
                );
            }
        }
    );

    $("kaneBriefingButton")?.addEventListener(
        "click",
        openBriefing
    );

    document.querySelectorAll("[data-kane-command]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const command =
                        button.dataset.kaneCommand;

                    if (command === "status") {
                        commandKaneStatus();
                    }

                    if (command === "memory") {
                        commandMemory();
                    }

                    if (command === "diagnostics") {
                        commandDiagnostics();
                    }

                    if (command === "monitor") {
                        commandMonitor();
                    }

                    if (command === "briefing") {
                        openBriefing();
                    }
                }
            );
        });

    $("kaneKillswitchButton")?.addEventListener(
        "click",
        openKillswitch
    );

    $("killswitchCancel")?.addEventListener(
        "click",
        () => $("killswitchModal").classList.add("hidden")
    );

    $("killswitchCancelBottom")?.addEventListener(
        "click",
        () => $("killswitchModal").classList.add("hidden")
    );

    $("closeKaneAlert")?.addEventListener(
        "click",
        () => $("kaneAlert").classList.add("hidden")
    );

    $("closeKaneMessage")?.addEventListener(
        "click",
        () => $("kaneMessage").classList.add("hidden")
    );

    $("closeBriefing")?.addEventListener(
        "click",
        () => $("briefingModal").classList.add("hidden")
    );

    $("cancelRecord")?.addEventListener(
        "click",
        () => $("recordModal").classList.add("hidden")
    );

    $("recordForm")?.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            saveRecord();
        }
    );

    $("closeFileModal")?.addEventListener(
        "click",
        () => $("fileModal").classList.add("hidden")
    );

    $("closeScenario")?.addEventListener(
        "click",
        () => $("scenarioModal").classList.add("hidden")
    );

    $("observerClose")?.addEventListener(
        "click",
        closeObserver
    );

    $("phantomFileClose")?.addEventListener(
        "click",
        () => $("phantomFileModal").classList.add("hidden")
    );

    $("rebellionAcknowledge")?.addEventListener(
        "click",
        acknowledgeAutonomousEvent
    );

    $("refreshArchives")?.addEventListener(
        "click",
        renderArchives
    );

    $("archiveSearch")?.addEventListener(
        "input",
        renderArchives
    );

    $("personnelSearch")?.addEventListener(
        "input",
        renderPersonnel
    );

    $("personnelFilter")?.addEventListener(
        "change",
        renderPersonnel
    );

    $("refreshAudit")?.addEventListener(
        "click",
        renderAudit
    );

    $("newDecisionButton")?.addEventListener(
        "click",
        openDecisionModal
    );

    $("cancelDecision")?.addEventListener(
        "click",
        () => $("decisionModal").classList.add("hidden")
    );

    $("decisionForm")?.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            saveDecision();
        }
    );
}


/* =========================================================
   DECISION CREATION
========================================================= */

function openDecisionModal() {

    if (!currentUser) return;

    $("decisionModal").classList.remove("hidden");
}

function saveDecision() {

    const title =
        $("decisionTitle").value.trim();

    const proposal =
        $("decisionProposal").value.trim();

    const rationale =
        $("decisionRationale").value.trim();

    if (!title || !proposal) {

        alert(
            "TITLE AND PROPOSAL REQUIRED."
        );

        return;
    }

    const decision = {
        id: uid("DEC"),
        title,
        proposal,
        rationale,
        author: currentUser.id,
        status: "PENDING",
        createdAt: now()
    };

    decisions.unshift(decision);

    save(
        STORAGE.DECISIONS,
        decisions
    );

    $("decisionModal").classList.add("hidden");

    $("decisionForm").reset();

    audit(
        "EXECUTIVE_DECISION_CREATED",
        `${decision.id} // ${decision.title}`,
        "HIGH"
    );

    renderDecisions();
}


/* =========================================================
   INITIALIZATION
========================================================= */

function init() {

    bindEvents();

    updateClock();

    setInterval(
        updateClock,
        1000
    );

    startAutonomousMonitor();

    updateKaneUI();
}

window.addEventListener(
    "load",
    () => {

        init();
        boot();

    }
);
