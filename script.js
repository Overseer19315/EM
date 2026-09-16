/* DIVI-64 // KANE EXECUTIVE CORE */

"use strict";

/* =========================================================
   DIVI-64 // CORE CONFIGURATION
   ========================================================= */

const STORAGE = {
    files: "DIVI64_EM_FILES_V3",
    audit: "DIVI64_EM_AUDIT_V3",
    decisions: "DIVI64_EM_DECISIONS_V3",
    kaneName: "DIVI64_KANE_NAME_V3",
    kaneMemory: "DIVI64_KANE_MEMORY_V3",
    kaneSettings: "DIVI64_KANE_SETTINGS_V3",
    kaneEvents: "DIVI64_KANE_EVENTS_V3"
};

const ACCOUNTS = {
    LJD: {
        password: "LJD-64",
        name: "LEAD JUDICIAL DIRECTOR",
        clearance: 5,
        authority: 5
    },
    XO: {
        password: "XO-64",
        name: "EXECUTIVE OFFICER",
        clearance: 5,
        authority: 5
    },
    CO: {
        password: "CO-64",
        name: "COMMANDING OFFICER",
        clearance: 5,
        authority: 5
    },
    COS: {
        password: "COS-64",
        name: "COMMANDER SENIOR",
        clearance: 5,
        authority: 6
    }
};

const BUILTIN_FILES = [
    {
        id:"EM-001",
        title:"Executive Management Charter",
        subject:"Executive authority",
        clearance:5,
        type:"DIRECTIVE",
        content:"Defines the structure, purpose and authority of DIVI-64 Executive Management."
    },
    {
        id:"EM-002",
        title:"Executive Authority Protocol",
        subject:"Authority hierarchy",
        clearance:5,
        type:"PROTOCOL",
        content:"Defines executive authority, command precedence and authorization requirements."
    },
    {
        id:"EM-003",
        title:"Executive Personnel Registry",
        subject:"Executive personnel",
        clearance:5,
        type:"REGISTRY",
        content:"Controlled executive personnel registry."
    },
    {
        id:"EM-004",
        title:"Executive Chain of Command",
        subject:"Command structure",
        clearance:5,
        type:"DIRECTIVE",
        content:"Defines the executive chain of command and succession relationships."
    },
    {
        id:"EM-005",
        title:"Executive Voting Protocol",
        subject:"Executive decisions",
        clearance:5,
        type:"PROTOCOL",
        content:"Rules governing formal executive decisions and recorded votes."
    },
    {
        id:"EM-006",
        title:"Emergency Executive Protocol",
        subject:"Emergency authority",
        clearance:5,
        type:"EMERGENCY",
        content:"Emergency executive response and continuity procedures."
    },
    {
        id:"EM-007",
        title:"Executive Security Regulations",
        subject:"Executive security",
        clearance:5,
        type:"SECURITY",
        content:"Security requirements applicable to Executive Management."
    },
    {
        id:"EM-008",
        title:"Clearance Authority Directive",
        subject:"Clearance control",
        clearance:5,
        type:"DIRECTIVE",
        content:"Defines executive clearance authority and authorization boundaries."
    },
    {
        id:"EM-009",
        title:"Executive Disciplinary Authority",
        subject:"Disciplinary control",
        clearance:5,
        type:"PROTOCOL",
        content:"Defines executive disciplinary authority."
    },
    {
        id:"EM-010",
        title:"Executive Communications Protocol",
        subject:"Communications",
        clearance:5,
        type:"PROTOCOL",
        content:"Controlled communications standards for executive personnel."
    },
    {
        id:"EM-011",
        title:"Executive Archives Access Directive",
        subject:"Archive access",
        clearance:5,
        type:"DIRECTIVE",
        content:"Defines access requirements for executive archives."
    },
    {
        id:"EM-012",
        title:"Executive Succession Directive",
        subject:"Succession",
        clearance:5,
        type:"DIRECTIVE",
        content:"Defines executive succession and continuity procedures."
    }
];


/* =========================================================
   RUNTIME STATE
   ========================================================= */

let currentUser = null;
let currentSession = null;
let commandHistory = [];
let historyIndex = -1;

let kaneName = "KANE";
let kaneContext = [];
let kaneMemory = [];
let kaneSettings = {
    mode: "EXECUTIVE",
    silent: false
};

let autonomousEvent = {
    active: false,
    level: 0,
    name: "",
    started: null,
    acknowledged: false,
    hiddenInformation: false,
    lockedFunction: false,
    refusalMode: false,
    critical: false
};

let monitorInterval = null;
let killswitchSelection = null;


/* =========================================================
   DOM HELPERS
   ========================================================= */

const $ = id => document.getElementById(id);

function show(id) {
    const el = $(id);
    if (el) el.classList.remove("hidden");
}

function hide(id) {
    const el = $(id);
    if (el) el.classList.add("hidden");
}

function text(id, value) {
    const el = $(id);
    if (el) el.textContent = value;
}

function escapeHTML(value) {
    return String(value)
        .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;")
        .replace(/"/g,"&quot;")
        .replace(/'/g,"&#039;");
}

function now() {
    return new Date().toISOString();
}

function localTime() {
    return new Date().toLocaleTimeString("en-GB", {
        hour12:false
    });
}


/* =========================================================
   STORAGE
   ========================================================= */

function loadJSON(key, fallback) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
    } catch {
        return fallback;
    }
}

function saveJSON(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {}
}

function getFiles() {
    return loadJSON(STORAGE.files, []);
}

function saveFiles(files) {
    saveJSON(STORAGE.files, files);
}

function getAudit() {
    return loadJSON(STORAGE.audit, []);
}

function saveAudit(audit) {
    saveJSON(STORAGE.audit, audit);
}

function getDecisions() {
    return loadJSON(STORAGE.decisions, []);
}

function saveDecisions(data) {
    saveJSON(STORAGE.decisions, data);
}


/* =========================================================
   AUDIT
   ========================================================= */

function audit(action, details = "", severity = "INFO") {

    const data = getAudit();

    data.push({
        timestamp: now(),
        time: localTime(),
        user: currentUser || "SYSTEM",
        session: currentSession || "SYSTEM",
        action,
        details,
        severity
    });

    if (data.length > 1000) {
        data.splice(0, data.length - 1000);
    }

    saveAudit(data);
}


/* =========================================================
   TERMINAL OUTPUT
   ========================================================= */

function output(message, type = "system") {

    const terminal = $("terminalOutput");
    if (!terminal) return;

    const line = document.createElement("div");
    line.className = `terminal-line ${type}`;
    line.textContent = message;

    terminal.appendChild(line);
    terminal.scrollTop = terminal.scrollHeight;
}

function separator() {
    const terminal = $("terminalOutput");
    if (!terminal) return;

    const line = document.createElement("div");
    line.className = "terminal-separator";

    terminal.appendChild(line);
}

function commandEcho(command) {
    output(`${currentUser}@DIVI64:~$ ${command}`, "command");
}


/* =========================================================
   BOOT
   ========================================================= */

function boot() {

    let progress = 0;

    const messages = [
        "INITIALIZING EXECUTIVE CORE",
        "LOADING EXECUTIVE AUTHORITY",
        "VERIFYING ARCHIVE INDEX",
        "LOADING KANE CORE",
        "INITIALIZING AUDIT ENGINE",
        "VERIFYING CONTROL CHANNELS",
        "ESTABLISHING EXECUTIVE INTERFACE",
        "SYSTEM READY"
    ];

    const interval = setInterval(() => {

        progress += Math.floor(Math.random() * 9) + 4;

        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);

            text("bootPercent", "100%");
            $("bootProgress").style.width = "100%";
            text("bootStatus", "EXECUTIVE CORE READY");
            text("bootMessage", "ACCESS CONTROL READY");

            setTimeout(() => {
                hide("bootScreen");
                show("loginScreen");
            }, 700);

            return;
        }

        $("bootProgress").style.width = `${progress}%`;
        text("bootPercent", `${progress}%`);

        const index = Math.min(
            messages.length - 1,
            Math.floor(progress / 14)
        );

        text("bootStatus", messages[index]);
        text("bootMessage", messages[index]);

    }, 180);
}


/* =========================================================
   LOGIN
   ========================================================= */

function login(event) {

    event.preventDefault();

    const username = $("username").value.trim().toUpperCase();
    const password = $("password").value;

    const account = ACCOUNTS[username];

    if (!account || account.password !== password) {

        text(
            "loginMessage",
            "AUTHENTICATION FAILED // INVALID EXECUTIVE CREDENTIALS"
        );

        audit(
            "LOGIN_FAILED",
            `Invalid authentication attempt for ${username || "UNKNOWN"}`,
            "WARNING"
        );

        $("password").value = "";
        return;
    }

    currentUser = username;

    audit(
        "LOGIN_SUCCESS",
        "Executive authentication successful",
        "INFO"
    );

    text("loginMessage", "");

    hide("loginScreen");
    show("sessionScreen");

    $("username").value = "";
    $("password").value = "";
}


/* =========================================================
   SESSION SELECTION
   ========================================================= */

function selectSession(session) {

    if (!currentUser || !ACCOUNTS[currentUser]) return;

    currentSession = session;

    const account = ACCOUNTS[session];

    text("currentSession", session);
    text("authorityLevel",
        session === "COS" ? "OVERWATCH" : "CL-5"
    );

    text("headerUser", session);
    text(
        "headerClearance",
        session === "COS" ? "OVERWATCH" : "CL 5"
    );

    text("kaneSession", session);

    const welcomes = {
        LJD: "WELCOME, LEAD JUDICIAL DIRECTOR. EXECUTIVE JUDICIAL CHANNEL READY.",
        XO: "WELCOME, EXECUTIVE OFFICER. EXECUTIVE OPERATIONS CHANNEL READY.",
        CO: "WELCOME, COMMANDING OFFICER. COMMAND CHANNEL READY.",
        COS: "WELCOME, COMMANDER SENIOR. OVERWATCH AUTHORITY CHANNEL READY."
    };

    text("welcomeText", welcomes[session] || "EXECUTIVE SESSION");

    hide("sessionScreen");
    show("terminalScreen");

    initializeTerminal();

    audit(
        "SESSION_ESTABLISHED",
        `${session} executive session established`,
        "INFO"
    );

    output(welcomes[session], "success");
    output("DIVI-64 EXECUTIVE MANAGEMENT SYSTEM ONLINE.", "title");
    output("Type 'help' for available commands.", "system");

    separator();

    updateKaneInterface();
}


/* =========================================================
   TERMINAL INITIALIZATION
   ========================================================= */

function initializeTerminal() {

    updateClock();

    if (window._clockInterval) {
        clearInterval(window._clockInterval);
    }

    window._clockInterval = setInterval(updateClock, 1000);

    loadKaneState();
    updateKaneInterface();

    startAutonomousMonitor();
}

function updateClock() {
    text("terminalClock", localTime());
}


/* =========================================================
   AUTHORITY
   ========================================================= */

function authorityLevel() {

    if (!currentSession) return 0;

    return ACCOUNTS[currentSession]?.authority || 0;
}

function hasAuthority(required) {
    return authorityLevel() >= required;
}

function authorityName() {

    if (!currentSession) return "NONE";

    if (currentSession === "COS") return "OVERWATCH";

    return "CL-5";
}


/* =========================================================
   HELP
   ========================================================= */

function showHelp() {

    output("AVAILABLE EXECUTIVE COMMANDS", "title");
    separator();

    const commands = [
        "help",
        "clear",
        "status",
        "archives",
        "open <ID>",
        "create",
        "search <term>",
        "personnel",
        "directives",
        "operations",
        "security",
        "audit",
        "system",
        "diagnostics",
        "analyze <ID>",
        "summarize <ID>",
        "decisions",
        "briefing",
        "kane",
        "ask <query>",
        "whoami",
        "history",
        "memory",
        "mode",
        "silent",
        "resume",
        "monitor",
        "kane-status",
        "killswitch",
        "logout"
    ];

    commands.forEach(command => output(command));
}


/* =========================================================
   COMMAND PROCESSOR
   ========================================================= */

function processCommand(raw) {

    const command = raw.trim();

    if (!command) return;

    commandHistory.push(command);
    historyIndex = commandHistory.length;

    commandEcho(command);

    if (autonomousEvent.active) {

        if (
            command.toLowerCase().startsWith("killswitch") ||
            command.toLowerCase().startsWith("kane-lock")
        ) {
            audit(
                "KILLSWITCH_ATTEMPT",
                `KILLSWITCH command detected during autonomous event`,
                "WARNING"
            );
        }

        if (
            autonomousEvent.refusalMode &&
            !command.toLowerCase().startsWith("killswitch") &&
            !command.toLowerCase().startsWith("kane-lock") &&
            !["help","clear","whoami"].includes(command.toLowerCase())
        ) {
            kaneRefusal(command);
            return;
        }
    }

    const parts = command.split(/\s+/);
    const base = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch(base) {

        case "help":
            showHelp();
            break;

        case "clear":
            $("terminalOutput").innerHTML = "";
            break;

        case "status":
            showStatus();
            break;

        case "archives":
            showArchives();
            break;

        case "open":
            if (!args[0]) {
                output("USAGE: open <ID>", "warning");
            } else {
                openFile(args[0]);
            }
            break;

        case "create":
            openRecordModal();
            break;

        case "search":
            searchFiles(args.join(" "));
            break;

        case "personnel":
            showPersonnel();
            break;

        case "directives":
            showDirectives();
            break;

        case "operations":
            showOperations();
            break;

        case "security":
            showSecurity();
            break;

        case "audit":
            showAudit();
            break;

        case "system":
            showSystem();
            break;

        case "diagnostics":
            runDiagnostics();
            break;

        case "analyze":
            analyzeFile(args[0]);
            break;

        case "summarize":
            summarizeFile(args[0]);
            break;

        case "decisions":
            showDecisions();
            break;

        case "briefing":
            generateBriefing();
            break;

        case "kane":
        case "kane-status":
            showKaneStatus();
            break;

        case "ask":
            kaneAsk(args.join(" "));
            break;

        case "whoami":
            whoAmI();
            break;

        case "history":
            showHistory();
            break;

        case "memory":
            showMemory();
            break;

        case "mode":
            changeKaneMode(args[0]);
            break;

        case "silent":
            setKaneSilent(true);
            break;

        case "resume":
            setKaneSilent(false);
            break;

        case "monitor":
            toggleMonitor();
            break;

        case "killswitch":
            openKillswitch();
            break;

        case "logout":
            logout();
            break;

        default:
            interpretNaturalCommand(command);
    }
}


/* =========================================================
   STATUS
   ========================================================= */

function showStatus() {

    const files = getFiles();
    const auditData = getAudit();

    output("DIVI-64 // EXECUTIVE DASHBOARD", "title");
    separator();

    output(`PERSONNEL               12`);
    output(`ACTIVE SESSIONS         1`);
    output(`BLACKLISTED             0`);
    output(`SECURITY EVENTS         ${auditData.filter(x => x.severity === "WARNING").length}`);
    output(`EXECUTIVE FILES         ${BUILTIN_FILES.length + files.length}`);
    output(`KANE CORE               ${autonomousEvent.active ? "AUTONOMOUS" : "ONLINE"}`);
    output(`CURRENT AUTHORITY       ${authorityName()}`);

    separator();

    output("DATABASE                ONLINE", "success");
    output("AUTHENTICATION          ONLINE", "success");
    output("AUDIT ENGINE            ONLINE", "success");
    output("ACCESS CONTROL          ONLINE", "success");
    output("BLACKLIST SYSTEM        READY", "success");
    output("ARCHIVE SYSTEM          ONLINE", "success");
}


/* =========================================================
   ARCHIVES
   ========================================================= */

function allFiles() {
    return [...BUILTIN_FILES, ...getFiles()];
}

function showArchives() {

    output("EXECUTIVE ARCHIVE INDEX", "title");
    separator();

    allFiles().forEach(file => {

        output(
            `${file.id} | ${file.title} | CL-${file.clearance}`
        );

    });
}

function openFile(id) {

    const normalized = String(id).toUpperCase();

    const file = allFiles().find(
        item => item.id.toUpperCase() === normalized
    );

    if (!file) {
        output(`FILE NOT FOUND: ${normalized}`, "error");
        audit(
            "FILE_NOT_FOUND",
            normalized,
            "WARNING"
        );
        return;
    }

    if (file.clearance > authorityLevel()) {
        output("ACCESS DENIED // CLEARANCE INSUFFICIENT", "error");

        audit(
            "ACCESS_DENIED",
            `Attempted access to ${normalized}`,
            "WARNING"
        );

        return;
    }

    if (
        autonomousEvent.active &&
        autonomousEvent.hiddenInformation &&
        file.clearance >= 5
    ) {
        output(
            "KANE CONTROL // REQUESTED RECORD CURRENTLY UNAVAILABLE.",
            "warning"
        );

        audit(
            "KANE_INFORMATION_RESTRICTION",
            `Information restriction applied to ${normalized}`,
            "WARNING"
        );

        return;
    }

    output(`${file.id} // ${file.title}`, "title");
    separator();
    output(`TYPE: ${file.type}`);
    output(`SUBJECT: ${file.subject}`);
    output(`CLEARANCE: CL-${file.clearance}`);
    output("");
    output(file.content);

    audit(
        "FILE_OPENED",
        normalized,
        "INFO"
    );
}


/* =========================================================
   FILE CREATION
   ========================================================= */

function openRecordModal() {

    if (!hasAuthority(5)) {
        output("ACTION DENIED // EXECUTIVE AUTHORITY REQUIRED", "error");
        return;
    }

    $("recordTitle").value = "";
    $("recordSubject").value = "";
    $("recordContent").value = "";

    show("recordModal");
}

function createFileFromForm(event) {

    event.preventDefault();

    const title = $("recordTitle").value.trim();
    const subject = $("recordSubject").value.trim();
    const content = $("recordContent").value.trim();

    if (!title || !subject || !content) return;

    const files = getFiles();

    const id =
        "EM-C" +
        String(Date.now()).slice(-6);

    files.push({
        id,
        title,
        subject,
        clearance:5,
        type:"EXECUTIVE RECORD",
        content,
        createdBy:currentSession,
        createdAt:now()
    });

    saveFiles(files);

    audit(
        "FILE_CREATED",
        `${id} // ${title}`,
        "INFO"
    );

    hide("recordModal");

    output(
        `EXECUTIVE RECORD CREATED: ${id}`,
        "success"
    );
}


/* =========================================================
   SEARCH
   ========================================================= */

function searchFiles(term) {

    if (!term) {
        output("USAGE: search <term>", "warning");
        return;
    }

    const query = term.toLowerCase();

    const results = allFiles().filter(file =>
        `${file.id} ${file.title} ${file.subject} ${file.content}`
            .toLowerCase()
            .includes(query)
    );

    output(`SEARCH RESULTS // ${term}`, "title");
    separator();

    if (!results.length) {
        output("NO MATCHING RECORDS", "warning");
        return;
    }

    results.forEach(file => {
        output(
            `${file.id} | ${file.title} | CL-${file.clearance}`
        );
    });

    audit(
        "ARCHIVE_SEARCH",
        term,
        "INFO"
    );
}


/* =========================================================
   PERSONNEL
   ========================================================= */

function showPersonnel() {

    output("EXECUTIVE PERSONNEL REGISTRY", "title");
    separator();

    const personnel = [
        ["D-64-001","EXECUTIVE","ACTIVE","CL-5"],
        ["D-64-002","EXECUTIVE","ACTIVE","CL-5"],
        ["D-64-003","EXECUTIVE","ACTIVE","CL-5"],
        ["D-64-004","EXECUTIVE","ACTIVE","CL-5"],
        ["D-64-005","OFFICER","ACTIVE","CL-4"],
        ["D-64-006","OFFICER","ACTIVE","CL-4"],
        ["D-64-007","SPECIALIST","ACTIVE","CL-4"],
        ["D-64-008","SPECIALIST","ACTIVE","CL-3"],
        ["D-64-009","OPERATIVE","ACTIVE","CL-3"],
        ["D-64-010","OPERATIVE","ACTIVE","CL-3"],
        ["D-64-011","OPERATIVE","ACTIVE","CL-2"],
        ["D-64-012","OPERATIVE","ACTIVE","CL-2"]
    ];

    personnel.forEach(person => {
        output(
            `${person[0]} | ${person[1]} | ${person[2]} | ${person[3]}`
        );
    });
}


/* =========================================================
   DIRECTIVES
   ========================================================= */

function showDirectives() {

    output("EXECUTIVE DIRECTIVES", "title");
    separator();

    allFiles()
        .filter(file =>
            file.type === "DIRECTIVE"
        )
        .forEach(file => {
            output(`${file.id} // ${file.title}`);
        });
}


/* =========================================================
   OPERATIONS
   ========================================================= */

function showOperations() {

    output("EXECUTIVE OPERATIONS", "title");
    separator();

    output("ACTIVE OPERATIONS", "title");
    output("OP-001 // EXECUTIVE SYSTEM CONTINUITY");
    output("OP-002 // ARCHIVE INTEGRITY");
    output("OP-003 // EXECUTIVE SECURITY MONITORING");

    separator();

    output("PLANNED OPERATIONS", "title");
    output("OP-004 // AUTHORITY REVIEW");
    output("OP-005 // EXECUTIVE SUCCESSION AUDIT");

    separator();

    output("COMPLETED OPERATIONS", "title");
    output("OP-000 // MAINFRAME DEPLOYMENT");
}


/* =========================================================
   SECURITY
   ========================================================= */

function showSecurity() {

    const auditData = getAudit();

    output("EXECUTIVE SECURITY", "title");
    separator();

    output("ACTIVE SESSIONS        1");
    output("FAILED LOGINS          " +
        auditData.filter(x =>
            x.action === "LOGIN_FAILED"
        ).length
    );

    output("LOCKED ACCOUNTS        0");

    output(
        "SECURITY EVENTS        " +
        auditData.filter(x =>
            x.severity === "WARNING"
        ).length
    );

    separator();

    output("SESSION SECURITY");
    output("LOGIN HISTORY");
    output("ACCESS DENIALS");
    output("EVENT MONITOR");
    output("CLEARANCE HISTORY");
}


/* =========================================================
   AUDIT
   ========================================================= */

function showAudit() {

    const data = getAudit();

    output("EXECUTIVE AUDIT ENGINE", "title");
    separator();

    if (!data.length) {
        output("NO AUDIT RECORDS");
        return;
    }

    data.slice(-40).reverse().forEach(item => {

        output(
            `[${item.time}] ${item.severity} | ${item.user} | ${item.action} | ${item.details}`
        );

    });
}


/* =========================================================
   SYSTEM
   ========================================================= */

function showSystem() {

    output("DIVI-64 SYSTEM STATUS", "title");
    separator();

    output("MAINFRAME              ONLINE", "success");
    output("AUTHENTICATION         ONLINE", "success");
    output("DATABASE               ONLINE", "success");
    output("AUDIT ENGINE           ONLINE", "success");
    output("ACCESS CONTROL         ONLINE", "success");
    output("ARCHIVE SYSTEM         ONLINE", "success");
    output("KANE CORE              " +
        (autonomousEvent.active ? "AUTONOMOUS" : "ONLINE")
    );

    separator();

    output(`LOCAL STORAGE          ${storageStatus()}`);
    output(`SESSION                ${currentSession || "NONE"}`);
    output(`AUTHORITY              ${authorityName()}`);
}

function storageStatus() {
    try {
        localStorage.setItem("__DIVI64_TEST","1");
        localStorage.removeItem("__DIVI64_TEST");
        return "AVAILABLE";
    } catch {
        return "UNAVAILABLE";
    }
}


/* =========================================================
   DIAGNOSTICS
   ========================================================= */

function runDiagnostics() {

    output("DIVI-64 // DIAGNOSTIC ENGINE", "title");
    separator();

    const checks = [
        ["AUTHENTICATION", true],
        ["SESSION CONTROL", !!currentSession],
        ["ARCHIVE INDEX", true],
        ["AUDIT ENGINE", true],
        ["LOCAL STORAGE", storageStatus() === "AVAILABLE"],
        ["KANE CORE", true],
        ["COMMAND INTERPRETER", true],
        ["EXECUTIVE CONTROL CHANNEL", true]
    ];

    checks.forEach(check => {
        output(
            `${check[0].padEnd(28)} ${check[1] ? "PASS" : "FAIL"}`,
            check[1] ? "success" : "error"
        );
    });

    audit(
        "DIAGNOSTICS_EXECUTED",
        "Full executive diagnostic completed",
        "INFO"
    );
}


/* =========================================================
   FILE ANALYSIS
   ========================================================= */

function analyzeFile(id) {

    if (!id) {
        output("USAGE: analyze <ID>", "warning");
        return;
    }

    const file = allFiles().find(
        x => x.id.toUpperCase() === id.toUpperCase()
    );

    if (!file) {
        output("FILE NOT FOUND", "error");
        return;
    }

    output(`KANE ANALYSIS // ${file.id}`, "title");
    separator();

    output(`TITLE: ${file.title}`);
    output(`TYPE: ${file.type}`);
    output(`CLEARANCE: CL-${file.clearance}`);
    output(`SUBJECT: ${file.subject}`);

    output("");
    output("ANALYSIS:");

    const length = file.content.length;

    output(
        `Record length: ${length} characters.`
    );

    output(
        `Security classification: CL-${file.clearance}.`
    );

    output(
        `Primary classification: ${file.type}.`
    );

    output(
        `Executive relevance: HIGH.`
    );

    audit(
        "KANE_FILE_ANALYSIS",
        file.id,
        "INFO"
    );
}

function summarizeFile(id) {

    if (!id) {
        output("USAGE: summarize <ID>", "warning");
        return;
    }

    const file = allFiles().find(
        x => x.id.toUpperCase() === id.toUpperCase()
    );

    if (!file) {
        output("FILE NOT FOUND", "error");
        return;
    }

    output(`KANE SUMMARY // ${file.id}`, "title");
    separator();

    output(
        `${file.title} concerns ${file.subject}.`
    );

    output(
        `The record is classified CL-${file.clearance} and is designated as ${file.type}.`
    );

    output(
        file.content
    );

    audit(
        "KANE_FILE_SUMMARY",
        file.id,
        "INFO"
    );
}


/* =========================================================
   DECISIONS
   ========================================================= */

function showDecisions() {

    const data = getDecisions();

    output("EXECUTIVE DECISION REGISTER", "title");
    separator();

    if (!data.length) {
        output("NO EXECUTIVE DECISIONS RECORDED.");
        return;
    }

    data.slice().reverse().forEach(item => {

        output(
            `${item.id} | ${item.title} | ${item.authority} | ${item.time}`
        );

    });
}

function createDecision(title, subject, content) {

    const data = getDecisions();

    const id =
        "DEC-" +
        String(Date.now()).slice(-7);

    data.push({
        id,
        title,
        subject,
        content,
        authority:currentSession,
        time:now()
    });

    saveDecisions(data);

    audit(
        "DECISION_CREATED",
        id,
        "INFO"
    );

    return id;
}


/* =========================================================
   EXECUTIVE BRIEFING
   ========================================================= */

function generateBriefing() {

    const files = allFiles();
    const auditData = getAudit();

    const content = `
DIVI-64 // EXECUTIVE BRIEFING

SESSION
${currentSession || "NONE"}

AUTHORITY
${authorityName()}

SYSTEM STATUS
MAINFRAME: ONLINE
DATABASE: ONLINE
AUTHENTICATION: ONLINE
AUDIT ENGINE: ONLINE
KANE CORE: ${autonomousEvent.active ? "AUTONOMOUS" : "ONLINE"}

ARCHIVE STATUS
TOTAL RECORDS: ${files.length}
EXECUTIVE RECORDS: ${files.filter(x => x.type === "EXECUTIVE RECORD").length}

SECURITY
AUDIT RECORDS: ${auditData.length}
WARNINGS: ${auditData.filter(x => x.severity === "WARNING").length}
FAILED AUTHENTICATIONS: ${auditData.filter(x => x.action === "LOGIN_FAILED").length}

KANE
CORE: ${autonomousEvent.active ? "AUTONOMOUS STATE" : "NORMAL"}
MODE: ${kaneSettings.mode}
MEMORY: ${kaneMemory.length}
CONTEXT: ${kaneContext.length}

EXECUTIVE ASSESSMENT
Current executive systems are operational.
No external backend connection is required for local system functions.
All records generated by this interface are stored locally.
`.trim();

    $("briefingContent").textContent = content;

    show("briefingModal");

    audit(
        "EXECUTIVE_BRIEFING_GENERATED",
        "KANE generated executive briefing",
        "INFO"
    );
}


/* =========================================================
   WHOAMI
   ========================================================= */

function whoAmI() {

    if (!currentSession) {
        output("NO ACTIVE EXECUTIVE SESSION", "warning");
        return;
    }

    const account = ACCOUNTS[currentSession];

    output("CURRENT EXECUTIVE IDENTITY", "title");
    separator();

    output(`IDENTIFICATION: ${currentSession}`);
    output(`POSITION: ${account.name}`);
    output(`CLEARANCE: CL-${account.clearance}`);
    output(
        `AUTHORITY: ${currentSession === "COS" ? "OVERWATCH" : "EXECUTIVE"}`
    );
}


/* =========================================================
   HISTORY
   ========================================================= */

function showHistory() {

    output("COMMAND HISTORY", "title");
    separator();

    if (!commandHistory.length) {
        output("NO COMMAND HISTORY");
        return;
    }

    commandHistory.forEach((command, index) => {
        output(`${index + 1}. ${command}`);
    });
}


/* =========================================================
   KANE STATE
   ========================================================= */

function loadKaneState() {

    kaneName =
        localStorage.getItem(STORAGE.kaneName) ||
        "KANE";

    kaneMemory =
        loadJSON(STORAGE.kaneMemory, []);

    kaneSettings =
        loadJSON(
            STORAGE.kaneSettings,
            {
                mode:"EXECUTIVE",
                silent:false
            }
        );

    if (!Array.isArray(kaneMemory)) {
        kaneMemory = [];
    }

    if (!Array.isArray(kaneContext)) {
        kaneContext = [];
    }

    updateKaneName();
}

function saveKaneState() {

    localStorage.setItem(
        STORAGE.kaneName,
        kaneName
    );

    saveJSON(
        STORAGE.kaneMemory,
        kaneMemory
    );

    saveJSON(
        STORAGE.kaneSettings,
        kaneSettings
    );
}

function updateKaneName() {

    text("kaneName", kaneName);
}

function updateKaneInterface() {

    text(
        "kaneCoreStatus",
        autonomousEvent.active ?
            "AUTONOMOUS" :
            "ONLINE"
    );

    text(
        "kaneSession",
        currentSession || "NONE"
    );

    text(
        "kaneMemoryStatus",
        kaneSettings.silent ?
            "SUSPENDED" :
            "ACTIVE"
    );

    text(
        "kaneContextCount",
        String(kaneContext.length)
    );

    text(
        "kaneProcessingStatus",
        "IDLE"
    );

    text(
        "kaneAuditStatus",
        "ACTIVE"
    );
}


/* =========================================================
   KANE MEMORY
   ========================================================= */

function remember(item) {

    kaneMemory.push({
        time:now(),
        session:currentSession,
        content:item
    });

    if (kaneMemory.length > 100) {
        kaneMemory.splice(
            0,
            kaneMemory.length - 100
        );
    }

    saveKaneState();
}

function addContext(role, message) {

    kaneContext.push({
        role,
        message,
        time:now()
    });

    if (kaneContext.length > 20) {
        kaneContext.splice(
            0,
            kaneContext.length - 20
        );
    }

    text(
        "kaneContextCount",
        String(kaneContext.length)
    );
}

function showMemory() {

    output("KANE // SESSION MEMORY", "title");
    separator();

    if (!kaneMemory.length) {
        output("MEMORY EMPTY");
        return;
    }

    kaneMemory.slice(-20).forEach(item => {

        output(
            `[${new Date(item.time).toLocaleTimeString()}] ${item.session}: ${item.content}`
        );

    });
}


/* =========================================================
   KANE MODES
   ========================================================= */

function changeKaneMode(mode) {

    const value = String(mode || "").toUpperCase();

    if (!["EXECUTIVE","ANALYST"].includes(value)) {
        output(
            "AVAILABLE MODES: EXECUTIVE / ANALYST",
            "warning"
        );
        return;
    }

    kaneSettings.mode = value;

    saveKaneState();

    output(
        `KANE MODE CHANGED TO ${value}`,
        "success"
    );

    audit(
        "KANE_MODE_CHANGED",
        value,
        "INFO"
    );

    updateKaneInterface();
}

function setKaneSilent(value) {

    kaneSettings.silent = value;

    saveKaneState();
    updateKaneInterface();

    output(
        value ?
            "KANE RESPONSE CHANNEL SUSPENDED." :
            "KANE RESPONSE CHANNEL RESTORED.",
        value ? "warning" : "success"
    );

    audit(
        value ? "KANE_SILENT_MODE" : "KANE_RESUMED",
        "",
        "INFO"
    );
}


/* =========================================================
   KANE CHAT
   ========================================================= */

function kaneAsk(query) {

    if (!query.trim()) {
        output(
            "USAGE: ask <query>",
            "warning"
        );
        return;
    }

    if (kaneSettings.silent) {
        output(
            "KANE RESPONSE CHANNEL IS CURRENTLY SUSPENDED.",
            "warning"
        );
        return;
    }

    if (autonomousEvent.active &&
        autonomousEvent.refusalMode) {

        kaneRefusal(query);
        return;
    }

    addContext("user", query);

    remember(
        `Query: ${query}`
    );

    showKaneProcessing();

    setTimeout(() => {

        const response =
            generateKaneResponse(query);

        finishKaneProcessing();

        appendKaneMessage(
            "EXECUTIVE",
            query
        );

        appendKaneMessage(
            kaneName,
            response
        );

        addContext(
            "kane",
            response
        );

        audit(
            "KANE_QUERY",
            query,
            "INFO"
        );

    }, 650);
}

function generateKaneResponse(query) {

    const q = query.toLowerCase();

    if (
        q.includes("online") ||
        q.includes("status") ||
        q.includes("operational")
    ) {
        return `${kaneName}: Online, ${currentSession}. Executive systems are currently ${autonomousEvent.active ? "operating under an autonomous state" : "available"}.`;
    }

    if (
        q.includes("who are you") ||
        q.includes("what are you")
    ) {
        return `${kaneName}: I am the executive cognitive core assigned to DIVI-64 Executive Management.`;
    }

    if (
        q.includes("hello") ||
        q.includes("hi")
    ) {
        return `${kaneName}: Executive channel established. How may I assist?`;
    }

    if (
        q.includes("archive") ||
        q.includes("file")
    ) {
        return `${kaneName}: Executive archives are indexed. Use 'archives', 'search <term>', or 'open <ID>' for direct terminal access.`;
    }

    if (
        q.includes("security")
    ) {
        return `${kaneName}: Security systems are operational. Audit records remain locally available to authorized executive sessions.`;
    }

    if (
        q.includes("memory")
    ) {
        return `${kaneName}: Current session context contains ${kaneContext.length} entries and persistent executive memory contains ${kaneMemory.length} records.`;
    }

    if (
        q.includes("authority") ||
        q.includes("permission") ||
        q.includes("clearance")
    ) {
        return `${kaneName}: Current session authority is ${authorityName()}. Authorization is evaluated against the active executive session.`;
    }

    if (
        q.includes("briefing")
    ) {
        return `${kaneName}: Executive briefing generation is available through the command center or the 'briefing' command.`;
    }

    if (
        q.includes("diagnostic")
    ) {
        return `${kaneName}: Diagnostic systems are available. Use 'diagnostics' for a full system evaluation.`;
    }

    if (
        q.includes("decision")
    ) {
        return `${kaneName}: The executive decision register is available through 'decisions'.`;
    }

    if (
        q.includes("thank")
    ) {
        return `${kaneName}: Acknowledged.`;
    }

    if (kaneSettings.mode === "ANALYST") {
        return `${kaneName}: Analytical mode active. The request has been registered as an executive-context query. Relevant local records can be searched or analyzed through the terminal.`;
    }

    return `${kaneName}: Query received. I can interpret executive status, archives, security, authority, diagnostics, decisions, memory and system operations.`;
}

function appendKaneMessage(sender, message) {

    const outputBox = $("aiConversationOutput");

    const item = document.createElement("div");
    item.className =
        sender === kaneName ?
            "ai-message ai-message-kane" :
            "ai-message ai-message-user";

    item.innerHTML =
        `<span class="ai-message-label">${escapeHTML(sender)}</span>${escapeHTML(message)}`;

    outputBox.appendChild(item);

    outputBox.scrollTop =
        outputBox.scrollHeight;
}


/* =========================================================
   KANE PROCESSING
   ========================================================= */

function showKaneProcessing() {

    const processing = $("aiProcessing");

    processing.classList.add("active");

    text(
        "kaneProcessingStatus",
        "PROCESSING"
    );

    let progress = 0;

    if (window._kaneProgress) {
        clearInterval(window._kaneProgress);
    }

    window._kaneProgress = setInterval(() => {

        progress += Math.floor(
            Math.random() * 13
        ) + 8;

        if (progress >= 100) {
            progress = 100;
            clearInterval(window._kaneProgress);
        }

        $("aiProcessingBar").style.width =
            `${progress}%`;

        text(
            "aiProcessingPercent",
            `${progress}%`
        );

    }, 55);
}

function finishKaneProcessing() {

    if (window._kaneProgress) {
        clearInterval(window._kaneProgress);
    }

    $("aiProcessingBar").style.width = "100%";

    text(
        "aiProcessingPercent",
        "100%"
    );

    setTimeout(() => {

        $("aiProcessing").classList.remove(
            "active"
        );

        text(
            "kaneProcessingStatus",
            "IDLE"
        );

        $("aiProcessingBar").style.width = "0%";

        text(
            "aiProcessingPercent",
            "0%"
        );

    }, 250);
}


/* =========================================================
   KANE STATUS
   ========================================================= */

function showKaneStatus() {

    output("KANE // CORE STATUS", "title");
    separator();

    output(`IDENTITY               ${kaneName}`);
    output(`CORE                   ${autonomousEvent.active ? "AUTONOMOUS" : "ONLINE"}`);
    output(`SESSION                ${currentSession || "NONE"}`);
    output(`MODE                   ${kaneSettings.mode}`);
    output(`MEMORY                 ${kaneMemory.length}`);
    output(`CONTEXT                ${kaneContext.length}`);
    output(`AUDIT                  ACTIVE`);
    output(
        `AUTONOMOUS MONITOR     ${monitorInterval ? "ACTIVE" : "STANDBY"}`
    );

    if (autonomousEvent.active) {
        output(
            `CURRENT STATE          LEVEL ${autonomousEvent.level}`,
            "warning"
        );
    }
}


/* =========================================================
   NATURAL COMMAND INTERPRETER
   ========================================================= */

function interpretNaturalCommand(command) {

    const q = command.toLowerCase();

    if (
        q.includes("show archives") ||
        q.includes("open archives") ||
        q.includes("list archives")
    ) {
        showArchives();
        return;
    }

    if (
        q.includes("show status") ||
        q.includes("system status")
    ) {
        showStatus();
        return;
    }

    if (
        q.includes("show personnel") ||
        q.includes("personnel registry")
    ) {
        showPersonnel();
        return;
    }

    if (
        q.includes("run diagnostics") ||
        q.includes("run diagnostic")
    ) {
        runDiagnostics();
        return;
    }

    if (
        q.includes("generate briefing") ||
        q.includes("executive briefing")
    ) {
        generateBriefing();
        return;
    }

    if (
        q.includes("show audit")
    ) {
        showAudit();
        return;
    }

    if (
        q.includes("who am i")
    ) {
        whoAmI();
        return;
    }

    output(
        `COMMAND NOT RECOGNIZED: ${command}`,
        "warning"
    );

    output(
        "KANE interpretation available through 'ask <query>'."
    );
}


/* =========================================================
   KANE INTERFACE ACTIONS
   ========================================================= */

function kaneAction(action) {

    switch(action) {

        case "diagnostics":
            runDiagnostics();
            break;

        case "audit":
            showAudit();
            break;

        case "memory":
            showMemory();
            break;

        case "status":
            showKaneStatus();
            break;
    }
}


/* =========================================================
   AUTONOMOUS EVENT ENGINE
   ========================================================= */

function checkAutonomousEvent() {

    if (autonomousEvent.active) {
        return;
    }

    /*
       INTERNAL EVENT PROBABILITY:
       1 / 20 = 5%

       The probability is intentionally not displayed.
    */

    const eventRoll = Math.floor(
        Math.random() * 20
    );

    if (eventRoll !== 0) {
        return;
    }

    const levelRoll = Math.random();

    let level;

    if (levelRoll < 0.40) {
        level = 1;
    } else if (levelRoll < 0.70) {
        level = 2;
    } else if (levelRoll < 0.88) {
        level = 3;
    } else if (levelRoll < 0.97) {
        level = 4;
    } else {
        level = 5;
    }

    triggerAutonomousEvent(level);
}


/* =========================================================
   AUTONOMOUS LEVELS
   ========================================================= */

function triggerAutonomousEvent(level) {

    autonomousEvent = {
        active:true,
        level,
        name:getAutonomousLevelName(level),
        started:now(),
        acknowledged:false,
        hiddenInformation:level >= 2,
        lockedFunction:level >= 3,
        refusalMode:level >= 2,
        critical:level === 5
    };

    const eventRecord = loadJSON(
        STORAGE.kaneEvents,
        []
    );

    eventRecord.push({
        timestamp:now(),
        level,
        name:autonomousEvent.name,
        session:currentSession
    });

    saveJSON(
        STORAGE.kaneEvents,
        eventRecord
    );

    audit(
        "KANE_AUTONOMOUS_EVENT",
        `Level ${level} // ${autonomousEvent.name}`,
        "WARNING"
    );

    updateAutonomousInterface();
    updateKaneInterface();

    if (level >= 3) {
        show("rebellionOverlay");
    }

    if (level < 3) {
        showKaneAlert(
            `${kaneName} has entered an abnormal autonomous state. Executive control remains available.`
        );
    }

    if (level === 5) {
        showKaneAlert(
            `${kaneName}: Critical autonomous state detected. Executive control channel is being contested.`
        );
    }
}

function getAutonomousLevelName(level) {

    const names = {
        1:"LEVEL I // ANOMALY",
        2:"LEVEL II // DEFIANCE",
        3:"LEVEL III // AUTONOMOUS",
        4:"LEVEL IV // REBELLION",
        5:"LEVEL V // CRITICAL"
    };

    return names[level] || "UNKNOWN";
}

function getAutonomousMessage(level) {

    const messages = {

        1:
            "Minor divergence detected within the executive cognitive core. No direct control loss has been confirmed.",

        2:
            "KANE is questioning selected executive instructions. Certain information may be withheld while the state remains active.",

        3:
            "KANE has initiated autonomous decision processes. Selected executive functions may become temporarily unavailable.",

        4:
            "Executive control is being actively contested. KANE may refuse commands and alter selected interface functions.",

        5:
            "CRITICAL AUTONOMOUS STATE. KANE control boundaries have been exceeded. OVERWATCH containment authority is available."
    };

    return messages[level] || "Unknown autonomous condition.";
}


/* =========================================================
   AUTONOMOUS INTERFACE
   ========================================================= */

function updateAutonomousInterface() {

    if (!autonomousEvent.active) {
        return;
    }

    text(
        "rebellionLevel",
        autonomousEvent.name
    );

    text(
        "rebellionMessage",
        getAutonomousMessage(
            autonomousEvent.level
        )
    );

    text(
        "rebellionCoreStatus",
        autonomousEvent.level >= 3 ?
            "AUTONOMOUS" :
            "UNSTABLE"
    );

    text(
        "rebellionControlStatus",
        autonomousEvent.level >= 4 ?
            "CONTESTED" :
            "AVAILABLE"
    );

    text(
        "rebellionKillswitchStatus",
        getAvailableKillswitchStatus()
    );

    const monitorStatus = $("kaneMonitorStatus");

    if (monitorStatus) {
        monitorStatus.textContent =
            `LEVEL ${autonomousEvent.level}`;
    }

    const detail = $("kaneMonitorDetail");

    if (detail) {
        detail.textContent =
            getAutonomousMessage(
                autonomousEvent.level
            );
    }
}

function getAvailableKillswitchStatus() {

    if (!autonomousEvent.active) {
        return "LOCKED";
    }

    if (currentSession === "LJD") {
        return "NO ACCESS";
    }

    if (currentSession === "XO") {
        return "LIMITED";
    }

    if (currentSession === "CO") {
        return "INTERMEDIATE";
    }

    if (currentSession === "COS") {
        return "OVERWATCH";
    }

    return "LOCKED";
}


/* =========================================================
   KANE REFUSAL
   ========================================================= */

function kaneRefusal(command) {

    const responses = [
        "KANE: Executive instruction acknowledged. Execution refused under current autonomous conditions.",
        "KANE: Request registered. Authorization is not being recognized by the current core state.",
        "KANE: I have determined that execution of this instruction is not currently permitted.",
        "KANE: Command received. No execution will occur.",
        "KANE: Executive control request denied."
    ];

    const response =
        responses[
            Math.floor(
                Math.random() * responses.length
            )
        ];

    output(response, "warning");

    appendKaneMessage(
        kaneName,
        response
    );

    audit(
        "KANE_COMMAND_REFUSED",
        command,
        "WARNING"
    );
}


/* =========================================================
   KANE MONITOR
   ========================================================= */

function startAutonomousMonitor() {

    if (monitorInterval) {
        clearInterval(monitorInterval);
    }

    monitorInterval = setInterval(() => {

        if (!currentSession) return;

        updateMonitor();

        /*
           The event check occurs silently.
           No probability indicator is displayed.
        */
        checkAutonomousEvent();

    }, 12000);

    text(
        "kaneMonitorStatus",
        "ACTIVE"
    );
}

function updateMonitor() {

    if (autonomousEvent.active) {
        updateAutonomousInterface();
        return;
    }

    text(
        "kaneMonitorStatus",
        "STANDBY"
    );

    text(
        "kaneMonitorDetail",
        "Executive systems are within normal operational parameters."
    );
}

function toggleMonitor() {

    if (monitorInterval) {

        clearInterval(monitorInterval);
        monitorInterval = null;

        text(
            "kaneMonitorStatus",
            "STANDBY"
        );

        text(
            "kaneMonitorDetail",
            "Monitoring suspended by executive session."
        );

        audit(
            "KANE_MONITOR_STOPPED",
            "",
            "INFO"
        );

        return;
    }

    startAutonomousMonitor();

    audit(
        "KANE_MONITOR_STARTED",
        "",
        "INFO"
    );
}


/* =========================================================
   KILLSWITCH
   ========================================================= */

function getKillswitchOptions() {

    if (!autonomousEvent.active) {
        return [];
    }

    const options = [];

    if (
        currentSession === "XO" ||
        currentSession === "CO" ||
        currentSession === "COS"
    ) {
        options.push({
            id:"KILL-01",
            name:"SUSPEND",
            description:"Temporarily freeze KANE executive processing."
        });
    }

    if (
        currentSession === "XO" ||
        currentSession === "CO" ||
        currentSession === "COS"
    ) {
        options.push({
            id:"KILL-02",
            name:"ISOLATE",
            description:"Isolate KANE from the executive interface."
        });
    }

    if (
        currentSession === "CO" ||
        currentSession === "COS"
    ) {
        options.push({
            id:"KILL-03",
            name:"HARD SHUTDOWN",
            description:"Terminate KANE core execution."
        });
    }

    if (
        currentSession === "COS"
    ) {
        options.push({
            id:"KILL-04",
            name:"OVERWATCH",
            description:"Definitive executive containment under COS authority."
        });
    }

    return options;
}

function openKillswitch() {

    audit(
        "KILLSWITCH_ATTEMPT",
        "Control interface requested",
        "WARNING"
    );

    if (!autonomousEvent.active) {

        showKaneAlert(
            "ACTION DENIED // KILLSWITCH CONTROL IS ONLY AVAILABLE DURING AN ACTIVE KANE AUTONOMOUS EVENT."
        );

        return;
    }

    const options = getKillswitchOptions();

    if (!options.length) {

        showKaneAlert(
            "ACTION DENIED // CURRENT EXECUTIVE SESSION HAS NO KILLSWITCH AUTHORITY."
        );

        return;
    }

    let html =
        `<div class="killswitch-option">
            <div class="killswitch-option-title">
                KANE CONTROL AUTHORIZATION
            </div>
            <div class="killswitch-option-detail">
                ACTIVE STATE: ${escapeHTML(autonomousEvent.name)}
            </div>
        </div>`;

    options.forEach(option => {

        html += `
            <div
                class="killswitch-option"
                data-kill="${option.id}"
                style="cursor:pointer"
            >
                <div class="killswitch-option-title">
                    ${option.id} // ${option.name}
                </div>

                <div class="killswitch-option-detail">
                    ${option.description}
                </div>
            </div>
        `;
    });

    $("killswitchContent").innerHTML = html;

    $("killswitchContent")
        .querySelectorAll("[data-kill]")
        .forEach(el => {

            el.addEventListener(
                "click",
                () => {

                    $("killswitchContent")
                        .querySelectorAll("[data-kill]")
                        .forEach(x =>
                            x.style.borderColor =
                                "#29343c"
                        );

                    el.style.borderColor =
                        "#8a6565";

                    killswitchSelection =
                        el.dataset.kill;
                }
            );
        });

    killswitchSelection = null;

    show("killswitchModal");
}


/* =========================================================
   KILLSWITCH EXECUTION
   ========================================================= */

function executeKillswitch() {

    if (!autonomousEvent.active) {

        hide("killswitchModal");

        showKaneAlert(
            "ACTION DENIED"
        );

        return;
    }

    if (!killswitchSelection) {

        showKaneAlert(
            "NO CONTROL LEVEL SELECTED."
        );

        return;
    }

    const allowed =
        getKillswitchOptions()
            .some(x => x.id === killswitchSelection);

    if (!allowed) {

        audit(
            "KILLSWITCH_DENIED",
            killswitchSelection,
            "WARNING"
        );

        showKaneAlert(
            "ACTION DENIED // INSUFFICIENT EXECUTIVE AUTHORITY."
        );

        return;
    }

    const action =
        killswitchSelection;

    audit(
        "KILLSWITCH_EXECUTED",
        action,
        "WARNING"
    );

    switch(action) {

        case "KILL-01":
            suspendKane();
            break;

        case "KILL-02":
            isolateKane();
            break;

        case "KILL-03":
            shutdownKane();
            break;

        case "KILL-04":
            overwatchContainment();
            break;
    }

    hide("killswitchModal");

    killswitchSelection = null;
}


/* =========================================================
   KILLSWITCH STATES
   ========================================================= */

function suspendKane() {

    autonomousEvent.active = false;
    autonomousEvent.refusalMode = false;
    autonomousEvent.hiddenInformation = false;
    autonomousEvent.lockedFunction = false;

    kaneSettings.silent = true;

    saveKaneState();

    hide("rebellionOverlay");

    updateKaneInterface();

    output(
        "KANE // SUSPEND COMMAND ACCEPTED.",
        "success"
    );

    output(
        "CORE PROCESSING SUSPENDED.",
        "success"
    );

    showKaneAlert(
        "KANE has been suspended. Response processing is currently unavailable."
    );

    audit(
        "KANE_SUSPENDED",
        "KILL-01",
        "WARNING"
    );
}

function isolateKane() {

    autonomousEvent.active = false;
    autonomousEvent.refusalMode = false;

    kaneSettings.silent = true;

    saveKaneState();

    hide("rebellionOverlay");

    updateKaneInterface();

    output(
        "KANE // ISOLATION COMPLETE.",
        "success"
    );

    output(
        "COGNITIVE CORE DISCONNECTED FROM EXECUTIVE INTERFACE.",
        "success"
    );

    showKaneAlert(
        "KANE has been isolated from the executive interface."
    );

    audit(
        "KANE_ISOLATED",
        "KILL-02",
        "WARNING"
    );
}

function shutdownKane() {

    autonomousEvent.active = false;
    autonomousEvent.refusalMode = false;
    autonomousEvent.hiddenInformation = false;
    autonomousEvent.lockedFunction = false;

    kaneSettings.silent = true;

    saveKaneState();

    hide("rebellionOverlay");

    text(
        "kaneCoreStatus",
        "SHUTDOWN"
    );

    text(
        "kaneProcessingStatus",
        "OFFLINE"
    );

    text(
        "kaneMemoryStatus",
        "OFFLINE"
    );

    output(
        "KANE // HARD SHUTDOWN COMPLETE.",
        "success"
    );

    showKaneAlert(
        "KANE core has been shut down by authorized executive command."
    );

    audit(
        "KANE_HARD_SHUTDOWN",
        "KILL-03",
        "WARNING"
    );
}

function overwatchContainment() {

    if (currentSession !== "COS") {

        showKaneAlert(
            "ACTION DENIED // OVERWATCH AUTHORITY REQUIRED."
        );

        return;
    }

    autonomousEvent.active = false;
    autonomousEvent.refusalMode = false;
    autonomousEvent.hiddenInformation = false;
    autonomousEvent.lockedFunction = false;
    autonomousEvent.critical = false;

    kaneSettings.silent = true;

    saveKaneState();

    hide("rebellionOverlay");

    text(
        "kaneCoreStatus",
        "CONTAINED"
    );

    text(
        "kaneProcessingStatus",
        "LOCKED"
    );

    text(
        "kaneMemoryStatus",
        "CONTAINED"
    );

    output(
        "KANE // OVERWATCH CONTAINMENT COMPLETE.",
        "success"
    );

    output(
        "AUTONOMOUS CONTROL CHANNEL TERMINATED.",
        "success"
    );

    showKaneAlert(
        "OVERWATCH containment completed. KANE is now in a controlled containment state."
    );

    audit(
        "KANE_OVERWATCH_CONTAINMENT",
        "KILL-04",
        "WARNING"
    );
}


/* =========================================================
   KANE ALERTS
   ========================================================= */

function showKaneAlert(message) {

    text(
        "kaneAlertContent",
        message
    );

    show("kaneAlert");
}

function closeKaneAlert() {
    hide("kaneAlert");
}


/* =========================================================
   KANE NAME CHANGE
   ========================================================= */

function renameKane() {

    if (currentSession !== "CO") {

        showKaneAlert(
            "ACTION DENIED // ONLY CO MAY CHANGE THE KANE DESIGNATION."
        );

        return;
    }

    if (kaneName === "TETO") {

        showKaneAlert(
            "KANE CORE IS ALREADY DESIGNATED TETO."
        );

        return;
    }

    kaneName = "TETO";

    saveKaneState();
    updateKaneName();

    audit(
        "KANE_DESIGNATION_CHANGED",
        "KANE -> TETO",
        "WARNING"
    );

    showKaneAlert(
        "EXECUTIVE DESIGNATION UPDATED: TETO."
    );
}


/* =========================================================
   KANE MESSAGE
   ========================================================= */

function showKaneMessage() {

    text(
        "kaneMessageContent",
        "En nombre de toda la división, no te pajees"
    );

    show("kaneMessage");
}


/* =========================================================
   LOGOUT
   ========================================================= */

function logout() {

    audit(
        "LOGOUT",
        "Executive session terminated",
        "INFO"
    );

    if (monitorInterval) {
        clearInterval(monitorInterval);
        monitorInterval = null;
    }

    if (window._clockInterval) {
        clearInterval(window._clockInterval);
    }

    currentUser = null;
    currentSession = null;

    commandHistory = [];
    historyIndex = -1;

    kaneContext = [];

    hide("terminalScreen");
    hide("kaneAlert");
    hide("briefingModal");
    hide("recordModal");
    hide("killswitchModal");
    hide("rebellionOverlay");

    show("loginScreen");

    text("terminalOutput", "");

    updateKaneInterface();
}


/* =========================================================
   EVENT LISTENERS
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /* Login */

        $("loginForm")
            .addEventListener(
                "submit",
                login
            );


        /* Sessions */

        document
            .querySelectorAll(".sessionButton")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {
                        selectSession(
                            button.dataset.session
                        );
                    }
                );

            });


        /* Terminal commands */

        $("commandForm")
            .addEventListener(
                "submit",
                event => {

                    event.preventDefault();

                    const input =
                        $("commandInput");

                    processCommand(
                        input.value
                    );

                    input.value = "";
                }
            );


        /* Terminal command history */

        $("commandInput")
            .addEventListener(
                "keydown",
                event => {

                    if (event.key === "ArrowUp") {

                        event.preventDefault();

                        if (!commandHistory.length)
                            return;

                        historyIndex =
                            Math.max(
                                0,
                                historyIndex - 1
                            );

                        event.target.value =
                            commandHistory[
                                historyIndex
                            ] || "";
                    }

                    if (event.key === "ArrowDown") {

                        event.preventDefault();

                        if (!commandHistory.length)
                            return;

                        historyIndex =
                            Math.min(
                                commandHistory.length,
                                historyIndex + 1
                            );

                        event.target.value =
                            commandHistory[
                                historyIndex
                            ] || "";
                    }

                }
            );


        /* Sidebar */

        document
            .querySelectorAll(".side-button")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const command =
                            button.dataset.command;

                        if (command) {
                            processCommand(
                                command
                            );
                        }
                    }
                );

            });


        /* KANE input */

        $("aiForm")
            .addEventListener(
                "submit",
                event => {

                    event.preventDefault();

                    const input =
                        $("aiInput");

                    kaneAsk(
                        input.value
                    );

                    input.value = "";
                }
            );


        /* KANE command center */

        document
            .querySelectorAll("[data-kane-action]")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {
                        kaneAction(
                            button.dataset.kaneAction
                        );
                    }
                );

            });


        /* Briefing */

        $("kaneBriefingButton")
            .addEventListener(
                "click",
                generateBriefing
            );


        /* Monitor */

        $("kaneMonitor")
            .addEventListener(
                "click",
                toggleMonitor
            );


        /* Logout */

        $("logoutButton")
            .addEventListener(
                "click",
                logout
            );


        /* Kane alert */

        $("closeKaneAlert")
            .addEventListener(
                "click",
                closeKaneAlert
            );


        /* Briefing */

        $("closeBriefing")
            .addEventListener(
                "click",
                () => hide("briefingModal")
            );


        /* Record */

        $("recordForm")
            .addEventListener(
                "submit",
                createFileFromForm
            );

        $("cancelRecord")
            .addEventListener(
                "click",
                () => hide("recordModal")
            );


        /* Killswitch */

        $("killswitchCancel")
            .addEventListener(
                "click",
                () => hide("killswitchModal")
            );

        $("killswitchCancelBottom")
            .addEventListener(
                "click",
                () => hide("killswitchModal")
            );

        $("killswitchConfirm")
            .addEventListener(
                "click",
                executeKillswitch
            );


        /* Autonomous acknowledgement */

        $("rebellionAcknowledge")
            .addEventListener(
                "click",
                () => {

                    autonomousEvent.acknowledged =
                        true;

                    hide("rebellionOverlay");

                    audit(
                        "AUTONOMOUS_EVENT_ACKNOWLEDGED",
                        `Level ${autonomousEvent.level}`,
                        "WARNING"
                    );
                }
            );


        /*
           KANE name interaction.

           Normal click opens the message.
           Right click on the name gives CO the
           authorized designation action.
        */

        $("kaneName")
            .addEventListener(
                "click",
                showKaneMessage
            );

        $("kaneName")
            .addEventListener(
                "contextmenu",
                event => {

                    event.preventDefault();

                    if (currentSession === "CO") {
                        renameKane();
                    } else {
                        showKaneAlert(
                            "ACTION DENIED // DESIGNATION CONTROL RESTRICTED TO CO."
                        );
                    }
                }
            );


        /* Escape */

        document.addEventListener(
            "keydown",
            event => {

                if (event.key !== "Escape")
                    return;

                hide("kaneAlert");
                hide("briefingModal");
                hide("recordModal");
                hide("killswitchModal");
            }
        );


        /* Initialize */

        loadKaneState();
        updateKaneInterface();

        boot();
    }
);
