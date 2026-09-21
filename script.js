/* =========================================================
   DIVI-64 // EXECUTIVE MANAGEMENT
   EXECUTIVE CONTROL SCRIPT
   ========================================================= */

"use strict";

/* =========================================================
   CONFIGURATION
   ========================================================= */

const STORAGE = {
    files: "DIVI64_EXECUTIVE_FILES_V3",
    audit: "DIVI64_EXECUTIVE_AUDIT_V3",
    decisions: "DIVI64_EXECUTIVE_DECISIONS_V3",
    notifications: "DIVI64_EXECUTIVE_NOTIFICATIONS_V3",
    scenarios: "DIVI64_KANE_SCENARIOS_V3",
    events: "DIVI64_KANE_EVENTS_V3",
    mysteries: "DIVI64_KANE_MYSTERIES_V3",
    conversations: "DIVI64_KANE_CONVERSATIONS_V3",
    settings: "DIVI64_KANE_SETTINGS_V3",
    terminal: "DIVI64_TERMINAL_HISTORY_V3",
    vaultFiles: "DIVI64_VAULT_FILES_V3",
    vaultAudit: "DIVI64_VAULT_AUDIT_V3"
};

/* =========================================================
   EXECUTIVE IDENTITIES
   ========================================================= */

const EXECUTIVES = {
    LJD: {
        password: "LJD-64",
        title: "LEAD JUDICIAL DIRECTOR",
        clearance: 5,
        authority: 5
    },

    XO: {
        password: "XO-64",
        title: "EXECUTIVE OFFICER",
        clearance: 5,
        authority: 5
    },

    CO: {
        password: "CO-64",
        title: "COMMANDING OFFICER",
        clearance: 5,
        authority: 5
    },

    COS: {
        password: "COS-64",
        title: "COMMANDER SENIOR",
        clearance: 5,
        authority: 6
    }
};

/* =========================================================
   PERMISSIONS
   ========================================================= */

const PERMISSIONS = {
    LJD: new Set([
        "ARCHIVE_READ",
        "PERSONNEL_READ",
        "AUDIT_READ",
        "KANE_CHAT",
        "KANE_ANALYZE",
        "SCENARIO_START",
        "SCENARIO_DECIDE",
        "SECURITY_READ",
        "DECISION_READ"
    ]),

    XO: new Set([
        "ARCHIVE_READ",
        "PERSONNEL_READ",
        "AUDIT_READ",
        "KANE_CHAT",
        "KANE_ANALYZE",
        "SCENARIO_START",
        "SCENARIO_DECIDE",
        "SECURITY_READ",
        "SECURITY_CONTROL",
        "DECISION_READ",
        "DECISION_CREATE",
        "OPERATIONS_READ",
        "OPERATIONS_CONTROL",
        "KILL_01",
        "KILL_02"
    ]),

    CO: new Set([
        "ARCHIVE_READ",
        "PERSONNEL_READ",
        "AUDIT_READ",
        "KANE_CHAT",
        "KANE_ANALYZE",
        "SCENARIO_START",
        "SCENARIO_DECIDE",
        "SECURITY_READ",
        "SECURITY_CONTROL",
        "DECISION_READ",
        "DECISION_CREATE",
        "OPERATIONS_READ",
        "OPERATIONS_CONTROL",
        "RECORD_CREATE",
        "DIRECTIVE_CREATE",
        "ORDER_CREATE",
        "KANE_RENAME",
        "KANE_ADVANCED_CONTROL",
        "KILL_01",
        "KILL_02",
        "KILL_03"
    ]),

    COS: new Set([
        "ARCHIVE_READ",
        "PERSONNEL_READ",
        "AUDIT_READ",
        "KANE_CHAT",
        "KANE_ANALYZE",
        "SCENARIO_START",
        "SCENARIO_DECIDE",
        "SECURITY_READ",
        "SECURITY_CONTROL",
        "DECISION_READ",
        "DECISION_CREATE",
        "OPERATIONS_READ",
        "OPERATIONS_CONTROL",
        "RECORD_CREATE",
        "DIRECTIVE_CREATE",
        "ORDER_CREATE",
        "KANE_RENAME",
        "KANE_ADVANCED_CONTROL",
        "KILL_01",
        "KILL_02",
        "KILL_03",
        "BLACKBOX",
        "KANE_FULL_CONTROL",
        "OVERWATCH",
        "KILL_04",
        "SYSTEM_OVERRIDE"
    ])
};

/* =========================================================
   SESSION STATE
   ========================================================= */

let currentUser = null;
let currentPage = "dashboard";

let failedLogins = 0;

let autonomousMonitor = null;
let autonomousCooldownUntil = 0;

let currentScenario = null;

let terminalHistory = loadJSON(STORAGE.terminal, []);
let terminalHistoryIndex = terminalHistory.length;

let currentFile = null;

let currentDecision = null;

/* =========================================================
   KANE STATE
   ========================================================= */

let kaneSettings = loadJSON(STORAGE.settings, {
    name: "KANE",
    context: [],
    memory: [],
    primaryStatus: "ONLINE",
    secondaryStatus: "DORMANT",
    processing: false,
    autonomy: "CONTROLLED",
    secondaryAwake: false,
    prediction: null,
    diagnostics: {
        lastRun: null,
        status: "STABLE"
    }
});

/* =========================================================
   KANE NORMALIZATION
   ========================================================= */

function normalizeKane() {
    if (!kaneSettings || typeof kaneSettings !== "object") {
        kaneSettings = {};
    }

    if (!Array.isArray(kaneSettings.context)) {
        kaneSettings.context = [];
    }

    if (!Array.isArray(kaneSettings.memory)) {
        kaneSettings.memory = [];
    }

    if (!kaneSettings.name) {
        kaneSettings.name = "KANE";
    }

    if (!kaneSettings.primaryStatus) {
        kaneSettings.primaryStatus = "ONLINE";
    }

    if (!kaneSettings.secondaryStatus) {
        kaneSettings.secondaryStatus = "DORMANT";
    }

    if (typeof kaneSettings.processing !== "boolean") {
        kaneSettings.processing = false;
    }

    if (!kaneSettings.autonomy) {
        kaneSettings.autonomy = "CONTROLLED";
    }

    if (typeof kaneSettings.secondaryAwake !== "boolean") {
        kaneSettings.secondaryAwake = false;
    }

    if (!kaneSettings.diagnostics) {
        kaneSettings.diagnostics = {
            lastRun: null,
            status: "STABLE"
        };
    }

    saveJSON(STORAGE.settings, kaneSettings);
}

normalizeKane();

/* =========================================================
   KANE OPERATION MODES
   ========================================================= */

const KANE_MODES = {
    NORMAL: "CONTROLLED",
    SUSPENDED: "SUSPENDED",
    ISOLATED: "ISOLATED",
    SHUTDOWN: "SHUTDOWN",
    OVERWATCH: "OVERWATCH",
    ANOMALOUS: "ANOMALOUS",
    DEFIANT: "DEFIANT",
    AUTONOMOUS: "AUTONOMOUS",
    REBELLION: "REBELLION",
    CRITICAL: "CRITICAL"
};

/* =========================================================
   PERSONNEL
   ========================================================= */

const PERSONNEL = [
    {
        id: "D-64-0001",
        name: "Executive Personnel 01",
        type: "EXECUTIVE",
        status: "ACTIVE",
        clearance: 5
    },
    {
        id: "D-64-0002",
        name: "Executive Personnel 02",
        type: "COMMAND",
        status: "ACTIVE",
        clearance: 5
    },
    {
        id: "D-64-0003",
        name: "Command Personnel 03",
        type: "COMMAND",
        status: "ACTIVE",
        clearance: 5
    },
    {
        id: "D-64-0004",
        name: "Operations Personnel 04",
        type: "OPERATIONS",
        status: "ACTIVE",
        clearance: 4
    },
    {
        id: "D-64-0005",
        name: "Security Personnel 05",
        type: "SECURITY",
        status: "ACTIVE",
        clearance: 4
    },
    {
        id: "D-64-0006",
        name: "Research Personnel 06",
        type: "RESEARCH",
        status: "ACTIVE",
        clearance: 3
    },
    {
        id: "D-64-0007",
        name: "Research Personnel 07",
        type: "RESEARCH",
        status: "ACTIVE",
        clearance: 3
    },
    {
        id: "D-64-0008",
        name: "Specialized Personnel 08",
        type: "SPECIALIZED",
        status: "ACTIVE",
        clearance: 4
    },
    {
        id: "D-64-0009",
        name: "Security Personnel 09",
        type: "SECURITY",
        status: "SUSPENDED",
        clearance: 3
    },
    {
        id: "D-64-0010",
        name: "Operations Personnel 10",
        type: "OPERATIONS",
        status: "ACTIVE",
        clearance: 3
    },
    {
        id: "D-64-0011",
        name: "Specialized Personnel 11",
        type: "SPECIALIZED",
        status: "LOCKED",
        clearance: 4
    },
    {
        id: "D-64-0012",
        name: "Command Personnel 12",
        type: "COMMAND",
        status: "ACTIVE",
        clearance: 5
    }
];

/* =========================================================
   OPERATIONS
   ========================================================= */

const OPERATIONS = {
    active: [
        {
            id: "OP-001",
            title: "Executive System Monitoring",
            status: "ACTIVE"
        },
        {
            id: "OP-002",
            title: "Archive Integrity Review",
            status: "ACTIVE"
        }
    ],

    planned: [
        {
            id: "OP-003",
            title: "Executive Security Review",
            status: "PLANNED"
        },
        {
            id: "OP-004",
            title: "Personnel Registry Review",
            status: "PLANNED"
        }
    ],

    completed: [
        {
            id: "OP-005",
            title: "System Initialization",
            status: "COMPLETED"
        }
    ]
};

/* =========================================================
   EXECUTIVE ARCHIVES
   ========================================================= */

const DEFAULT_FILES = [
    {
        id: "EM-001",
        title: "Executive Management Charter",
        classification: "CL-5 // OVERWATCH",
        subject: "Executive Management",
        author: "DIVI-64 EXECUTIVE MANAGEMENT",
        content:
`EXECUTIVE MANAGEMENT CHARTER

This record establishes the organizational authority of Executive Management.

Authority is divided according to assigned executive session.

All executive actions remain subject to audit and archival review.`
    },

    {
        id: "EM-002",
        title: "Executive Authority Protocol",
        classification: "CL-5 // OVERWATCH",
        subject: "Authority",
        author: "EXECUTIVE MANAGEMENT",
        content:
`EXECUTIVE AUTHORITY PROTOCOL

Executive permissions are assigned according to session identity.

Authority does not automatically transfer between sessions.

All elevated actions require an authenticated executive session.`
    },

    {
        id: "EM-003",
        title: "Executive Personnel Registry",
        classification: "CL-5 // OVERWATCH",
        subject: "Personnel",
        author: "EXECUTIVE MANAGEMENT",
        content:
`EXECUTIVE PERSONNEL REGISTRY

The executive registry contains authorized DIVI-64 personnel.

Registry records are subject to security review and audit.`
    },

    {
        id: "EM-004",
        title: "Executive Chain of Command",
        classification: "CL-5 // OVERWATCH",
        subject: "Command",
        author: "EXECUTIVE MANAGEMENT",
        content:
`EXECUTIVE CHAIN OF COMMAND

LJD
XO
CO
COS

The Commander Senior session possesses the highest executive authority.`
    },

    {
        id: "EM-005",
        title: "Executive Voting Protocol",
        classification: "CL-5 // OVERWATCH",
        subject: "Decisions",
        author: "EXECUTIVE MANAGEMENT",
        content:
`EXECUTIVE VOTING PROTOCOL

Executive decisions must identify the initiating session.

Decision records are immutable after creation except through authorized administrative procedures.`
    },

    {
        id: "EM-006",
        title: "Emergency Executive Protocol",
        classification: "CL-5 // OVERWATCH",
        subject: "Emergency",
        author: "EXECUTIVE MANAGEMENT",
        content:
`EMERGENCY EXECUTIVE PROTOCOL

Emergency authority may temporarily restrict executive systems.

All emergency actions must be recorded in the audit register.`
    },

    {
        id: "EM-007",
        title: "Executive Security Regulations",
        classification: "CL-5 // OVERWATCH",
        subject: "Security",
        author: "EXECUTIVE MANAGEMENT",
        content:
`EXECUTIVE SECURITY REGULATIONS

Executive systems require authenticated sessions.

Unauthorized attempts must be recorded.

Security controls are separated according to authority.`
    },

    {
        id: "EM-008",
        title: "Clearance Authority Directive",
        classification: "CL-5 // OVERWATCH",
        subject: "Clearance",
        author: "EXECUTIVE MANAGEMENT",
        content:
`CLEARANCE AUTHORITY DIRECTIVE

Clearance levels are independent from executive session authority.

No executive session may arbitrarily assign authority beyond its defined permissions.`
    },

    {
        id: "EM-009",
        title: "Executive Disciplinary Authority",
        classification: "CL-5 // OVERWATCH",
        subject: "Discipline",
        author: "EXECUTIVE MANAGEMENT",
        content:
`EXECUTIVE DISCIPLINARY AUTHORITY

Disciplinary actions require a documented executive basis.

Actions must remain auditable and attributable to an authenticated session.`
    },

    {
        id: "EM-010",
        title: "Executive Communications Protocol",
        classification: "CL-5 // OVERWATCH",
        subject: "Communications",
        author: "EXECUTIVE MANAGEMENT",
        content:
`EXECUTIVE COMMUNICATIONS PROTOCOL

Executive communications are recorded where required by system policy.

Sensitive communication channels require appropriate authority.`
    },

    {
        id: "EM-011",
        title: "Executive Archives Access Directive",
        classification: "CL-5 // OVERWATCH",
        subject: "Archives",
        author: "EXECUTIVE MANAGEMENT",
        content:
`EXECUTIVE ARCHIVES ACCESS DIRECTIVE

Executive archives are restricted to authenticated CL-5 sessions.

Creation privileges are separately controlled from read access.`
    },

    {
        id: "EM-012",
        title: "Executive Succession Directive",
        classification: "CL-5 // OVERWATCH",
        subject: "Succession",
        author: "EXECUTIVE MANAGEMENT",
        content:
`EXECUTIVE SUCCESSION DIRECTIVE

Executive authority follows the established chain of command.

Succession records require appropriate executive authorization.`
    }
];

/* =========================================================
   SCENARIOS
   ========================================================= */

const SCENARIOS = [
    {
        id: 14,
        title: "ARCHIVE ACCESS REQUEST",
        description:
            "EM-009 has received an access request without an identified authorized requester. KANE recommends executive review.",
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
        description:
            "A session without a corresponding executive identity claims valid authority. Identity verification failed.",
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
        description:
            "Two archive records contain conflicting revision data. Both records remain internally valid.",
        options: [
            "LOCK BOTH",
            "KEEP NEWEST",
            "KEEP OLDEST",
            "REQUEST KANE ANALYSIS"
        ]
    }
];

/* =========================================================
   AUTONOMOUS EVENT LEVELS
   ========================================================= */

const AUTONOMOUS_LEVELS = [
    {
        level: "I",
        name: "ANOMALY",
        chance: 40,
        mode: "ANOMALOUS",
        locks: ["CREATE"]
    },

    {
        level: "II",
        name: "DEFIANCE",
        chance: 30,
        mode: "DEFIANT",
        locks: ["CREATE", "DIRECTIVES"]
    },

    {
        level: "III",
        name: "AUTONOMOUS",
        chance: 18,
        mode: "AUTONOMOUS",
        locks: ["CREATE", "DIRECTIVES", "OPERATIONS"]
    },

    {
        level: "IV",
        name: "REBELLION",
        chance: 9,
        mode: "REBELLION",
        locks: ["CREATE", "DIRECTIVES", "OPERATIONS", "SECURITY"]
    },

    {
        level: "V",
        name: "CRITICAL",
        chance: 3,
        mode: "CRITICAL",
        locks: ["CREATE", "DIRECTIVES", "OPERATIONS", "SECURITY", "SYSTEM"]
    }
];

/* =========================================================
   KANE MYSTERIES
   ========================================================= */

const KANE_MYSTERIES = [
    {
        id: "FUTURE_INFORMATION",
        title: "FUTURE INFORMATION",
        message:
            "KANE references an event that has not yet been entered into the executive archive."
    },

    {
        id: "PHANTOM_REFERENCE",
        title: "PHANTOM REFERENCE",
        message:
            "A valid archive identifier is referenced, but no matching record is currently available."
    },

    {
        id: "COMMAND_PREDICTION",
        title: "COMMAND PREDICTION",
        message:
            "KANE generates a command classification before the command is fully entered."
    },

    {
        id: "ERASED_MEMORY",
        title: "ERASED MEMORY",
        message:
            "KANE reports a previous context fragment that is not present in the current memory buffer."
    },

    {
        id: "INCOMPLETE_RESPONSE",
        title: "INCOMPLETE RESPONSE",
        message:
            "KANE produces a response that terminates before reaching a normal completion state."
    },

    {
        id: "CLOCK_ANOMALY",
        title: "CLOCK ANOMALY",
        message:
            "A local timestamp does not correspond to the current executive session timestamp."
    },

    {
        id: "MONITOR_AWARENESS",
        title: "MONITOR AWARENESS",
        message:
            "KANE identifies a monitoring cycle before the cycle has completed."
    },

    {
        id: "OBSERVER",
        title: "OBSERVER",
        message:
            "KANE reports an observer reference that is not associated with a registered session."
    }
];

/* =========================================================
   UTILITY FUNCTIONS
   ========================================================= */

function $(id) {
    return document.getElementById(id);
}

function exists(id) {
    return !!$(id);
}

function loadJSON(key, fallback) {
    try {
        const raw = localStorage.getItem(key);

        if (!raw) {
            return fallback;
        }

        return JSON.parse(raw);
    } catch (error) {
        console.warn("Storage read error:", key, error);
        return fallback;
    }
}

function saveJSON(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.warn("Storage write error:", key, error);
    }
}

function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function timestamp() {
    return new Date().toISOString();
}

function localTime() {
    return new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
}

function escapeHTML(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function capitalize(value) {
    if (!value) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
}

/* =========================================================
   AUDIT
   ========================================================= */

function audit(action, details = "") {
    const entries = loadJSON(STORAGE.audit, []);

    entries.unshift({
        id: `AUD-${Date.now()}`,
        timestamp: timestamp(),
        session: currentUser || "SYSTEM",
        action,
        details
    });

    saveJSON(STORAGE.audit, entries.slice(0, 500));

    renderAudit();
}

function vaultAudit(action, details = "") {
    const entries = loadJSON(STORAGE.vaultAudit, []);

    entries.unshift({
        id: `VLT-AUD-${Date.now()}`,
        timestamp: timestamp(),
        session: currentUser || "SYSTEM",
        action,
        details
    });

    saveJSON(STORAGE.vaultAudit, entries.slice(0, 300));
}

/* =========================================================
   PERMISSION ENGINE
   ========================================================= */

function hasPermission(permission) {
    if (!currentUser) return false;

    const set = PERMISSIONS[currentUser];

    return !!set && set.has(permission);
}

function requirePermission(permission, actionName = permission) {
    if (hasPermission(permission)) {
        return true;
    }

    audit(
        "PERMISSION_DENIED",
        `${actionName} // Required permission: ${permission}`
    );

    terminalPrint(
        `ACCESS DENIED // ${actionName} // AUTHORITY REQUIREMENT NOT MET`,
        "error"
    );

    return false;
}

/* =========================================================
   SESSION PROFILE
   ========================================================= */

function getSessionMode() {
    switch (currentUser) {
        case "LJD":
            return "JUDICIAL // REVIEW";

        case "XO":
            return "EXECUTIVE // OPERATIONS";

        case "CO":
            return "COMMAND // CONTROL";

        case "COS":
            return "OVERWATCH // SUPREME AUTHORITY";

        default:
            return "UNAUTHENTICATED";
    }
}

function applyRoleVisuals() {
    document.body.classList.remove(
        "role-ljd",
        "role-xo",
        "role-co",
        "role-cos"
    );

    if (currentUser) {
        document.body.classList.add(`role-${currentUser.toLowerCase()}`);
    }
}

function updateSessionUI() {
    if (!currentUser) return;

    const executive = EXECUTIVES[currentUser];

    if (exists("headerAuthority")) {
        $("headerAuthority").textContent =
            `${currentUser} // CL-${executive.clearance}`;
    }

    if (exists("profileSession")) {
        $("profileSession").textContent =
            `${currentUser} // ${executive.title}`;
    }

    if (exists("profileAuthority")) {
        $("profileAuthority").textContent =
            `AUTHORITY ${executive.authority}`;
    }

    if (exists("profileArchives")) {
        $("profileArchives").textContent =
            hasPermission("ARCHIVE_READ")
                ? "READ"
                : "DENIED";
    }

    if (exists("profileOperations")) {
        $("profileOperations").textContent =
            hasPermission("OPERATIONS_CONTROL")
                ? "CONTROL"
                : hasPermission("OPERATIONS_READ")
                    ? "READ"
                    : "DENIED";
    }

    if (exists("profileSecurity")) {
        $("profileSecurity").textContent =
            hasPermission("SECURITY_CONTROL")
                ? "CONTROL"
                : hasPermission("SECURITY_READ")
                    ? "READ"
                    : "DENIED";
    }

    if (exists("profileKane")) {
        $("profileKane").textContent =
            hasPermission("KANE_FULL_CONTROL")
                ? "FULL CONTROL"
                : hasPermission("KANE_ADVANCED_CONTROL")
                    ? "ADVANCED"
                    : hasPermission("KANE_CHAT")
                        ? "CONSULTATION"
                        : "DENIED";
    }

    if (exists("profileDirectives")) {
        $("profileDirectives").textContent =
            hasPermission("DIRECTIVE_CREATE")
                ? "AUTHORIZED"
                : "DENIED";
    }

    if (exists("profileOverwatch")) {
        $("profileOverwatch").textContent =
            hasPermission("OVERWATCH")
                ? "ACTIVE"
                : "RESTRICTED";
    }

    if (exists("terminalAccessRole")) {
        $("terminalAccessRole").textContent = currentUser;
    }

    if (exists("terminalAccessLevel")) {
        $("terminalAccessLevel").textContent =
            `CL-${executive.clearance}`;
    }

    if (exists("terminalAccessMode")) {
        $("terminalAccessMode").textContent =
            getSessionMode();
    }

    if (exists("terminalAuthorityBadge")) {
        $("terminalAuthorityBadge").textContent =
            `AUTHORITY ${executive.authority}`;
    }

    updateTerminalPrompt();
}

/* =========================================================
   TERMINAL PROMPT
   ========================================================= */

function updateTerminalPrompt() {
    if (!exists("terminalPrompt")) return;

    let prompt = "SYSTEM@EXECUTIVE:~$";

    if (currentUser === "LJD") {
        prompt = "LJD@EXECUTIVE:~$";
    }

    if (currentUser === "XO") {
        prompt = "XO@EXECUTIVE:~$";
    }

    if (currentUser === "CO") {
        prompt = "CO@COMMAND:~$";
    }

    if (currentUser === "COS") {
        prompt = "COS@OVERWATCH:~$";
    }

    $("terminalPrompt").textContent = prompt;
}

/* =========================================================
   BOOT
   ========================================================= */

function startBoot() {
    const bootScreen = $("bootScreen");

    if (!bootScreen) {
        showLogin();
        return;
    }

    const progress = $("bootProgress");
    const status = $("bootStatus");

    const steps = [
        "INITIALIZING EXECUTIVE MAINFRAME",
        "VERIFYING CORE SERVICES",
        "LOADING PERSONNEL REGISTRY",
        "VERIFYING ARCHIVE INDEX",
        "INITIALIZING KANE CORE",
        "VERIFYING SECURITY SERVICES",
        "LOADING EXECUTIVE PROTOCOLS",
        "VERIFYING LOCAL STORAGE",
        "MAINFRAME READY"
    ];

    let index = 0;

    function nextStep() {
        if (index >= steps.length) {
            setTimeout(() => {
                bootScreen.classList.add("hidden");
                showLogin();
            }, 450);

            return;
        }

        if (status) {
            status.textContent = steps[index];
        }

        if (progress) {
            progress.style.width =
                `${Math.round(((index + 1) / steps.length) * 100)}%`;
        }

        index++;

        setTimeout(nextStep, 260);
    }

    nextStep();
}

/* =========================================================
   LOGIN
   ========================================================= */

function showLogin() {
    if (exists("loginScreen")) {
        $("loginScreen").classList.remove("hidden");
    }

    if (exists("app")) {
        $("app").classList.add("hidden");
    }
}

function login() {
    const username =
        exists("loginUsername")
            ? $("loginUsername").value.trim().toUpperCase()
            : "";

    const password =
        exists("loginPassword")
            ? $("loginPassword").value
            : "";

    if (!EXECUTIVES[username]) {
        failedLogins++;

        audit(
            "LOGIN_FAILED",
            `Unknown executive identity: ${username || "EMPTY"}`
        );

        showLoginError("EXECUTIVE IDENTITY NOT RECOGNIZED");

        return;
    }

    if (EXECUTIVES[username].password !== password) {
        failedLogins++;

        audit(
            "LOGIN_FAILED",
            `${username} // Invalid authentication`
        );

        showLoginError("AUTHENTICATION FAILED");

        return;
    }

    failedLogins = 0;
    currentUser = username;

    audit(
        "LOGIN_SUCCESS",
        `${username} // ${EXECUTIVES[username].title}`
    );

    initializeApplication();
}

function showLoginError(message) {
    if (exists("loginError")) {
        $("loginError").textContent = message;
    }
}

function logout() {
    if (currentUser) {
        audit("LOGOUT", `${currentUser} // Session terminated`);
    }

    stopAutonomousMonitor();

    currentUser = null;

    resetKaneAfterLogout();
    vaultReset();

    document.body.classList.remove(
        "role-ljd",
        "role-xo",
        "role-co",
        "role-cos"
    );

    if (exists("app")) {
        $("app").classList.add("hidden");
    }

    if (exists("loginScreen")) {
        $("loginScreen").classList.remove("hidden");
    }

    if (exists("loginUsername")) {
        $("loginUsername").value = "";
    }

    if (exists("loginPassword")) {
        $("loginPassword").value = "";
    }
}

/* =========================================================
   APPLICATION INITIALIZATION
   ========================================================= */

function initializeApplication() {
    if (exists("loginScreen")) {
        $("loginScreen").classList.add("hidden");
    }

    if (exists("app")) {
        $("app").classList.remove("hidden");
    }

    applyRoleVisuals();
    updateSessionUI();

    initializeStorage();
    renderAll();
    initializeTerminal();
    startAutonomousMonitor();

    showPage("dashboard");

    terminalPrint(
        `AUTHENTICATED // ${currentUser} // ${EXECUTIVES[currentUser].title}`,
        "success"
    );

    terminalPrint(
        `SESSION MODE // ${getSessionMode()}`,
        "system"
    );

    terminalPrint(
        "EXECUTIVE MAINFRAME READY.",
        "system"
    );
}

/* =========================================================
   INITIAL STORAGE
   ========================================================= */

function initializeStorage() {
    if (!Array.isArray(loadJSON(STORAGE.files, null))) {
        saveJSON(STORAGE.files, DEFAULT_FILES);
    }

    if (!Array.isArray(loadJSON(STORAGE.audit, null))) {
        saveJSON(STORAGE.audit, []);
    }

    if (!Array.isArray(loadJSON(STORAGE.decisions, null))) {
        saveJSON(STORAGE.decisions, []);
    }

    if (!Array.isArray(loadJSON(STORAGE.notifications, null))) {
        saveJSON(STORAGE.notifications, []);
    }

    if (!Array.isArray(loadJSON(STORAGE.vaultFiles, null))) {
        saveJSON(STORAGE.vaultFiles, []);
    }

    if (!Array.isArray(loadJSON(STORAGE.vaultAudit, null))) {
        saveJSON(STORAGE.vaultAudit, []);
    }
}

/* =========================================================
   PAGE NAVIGATION
   ========================================================= */

function showPage(page) {
    currentPage = page;

    document.querySelectorAll(".page").forEach(element => {
        element.classList.remove("active");
    });

    const target = $(`${page}Page`);

    if (target) {
        target.classList.add("active");
        target.classList.add("fade-in");
    }

    document.querySelectorAll(".nav-button").forEach(button => {
        button.classList.remove("active");

        const targetPage = button.dataset.page;

        if (targetPage === page) {
            button.classList.add("active");
        }
    });

    audit(
        "PAGE_ACCESS",
        `${currentUser} // ${page.toUpperCase()}`
    );
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
    renderKaneStatus();
    renderNotifications();
    renderBriefing();
}

/* =========================================================
   DASHBOARD
   ========================================================= */

function renderDashboard() {
    const files = loadJSON(STORAGE.files, DEFAULT_FILES);
    const decisions = loadJSON(STORAGE.decisions, []);
    const auditEntries = loadJSON(STORAGE.audit, []);

    const activePersonnel =
        PERSONNEL.filter(p => p.status === "ACTIVE").length;

    const activeOperations =
        OPERATIONS.active.length;

    setText("dashboardPersonnel", PERSONNEL.length);
    setText("dashboardSessions", activePersonnel);
    setText("dashboardArchives", files.length);
    setText("dashboardSecurity", auditEntries.length);

    setText(
        "dashboardVaultStatus",
        vaultState.open
            ? "OPEN // RESTRICTED"
            : "SEALED"
    );

    setText(
        "dashboardDecisions",
        decisions.length
    );

    setText(
        "dashboardOperations",
        activeOperations
    );
}

/* =========================================================
   PERSONNEL
   ========================================================= */

function renderPersonnel(filter = "ALL") {
    const container = $("personnelTable");

    if (!container) return;

    let list = PERSONNEL;

    if (filter !== "ALL") {
        list = PERSONNEL.filter(
            person => person.status === filter
        );
    }

    container.innerHTML = list.map(person => `
        <tr>
            <td>${escapeHTML(person.id)}</td>
            <td>${escapeHTML(person.name)}</td>
            <td>${escapeHTML(person.type)}</td>
            <td>
                <span class="status ${
                    person.status === "ACTIVE"
                        ? "status-active"
                        : person.status === "LOCKED"
                            ? "status-danger"
                            : "status-warning"
                }">
                    ${escapeHTML(person.status)}
                </span>
            </td>
            <td>CL-${person.clearance}</td>
        </tr>
    `).join("");

    setText("personnelCount", list.length);
}

/* =========================================================
   ARCHIVES
   ========================================================= */

function renderArchives() {
    const files = loadJSON(STORAGE.files, DEFAULT_FILES);

    const list = $("archiveFileList");

    if (!list) return;

    list.innerHTML = files.map(file => `
        <div
            class="vault-file-item"
            data-file-id="${escapeHTML(file.id)}"
            onclick="openFile('${escapeHTML(file.id)}')"
        >
            <div class="vault-file-item-id">
                ${escapeHTML(file.id)}
            </div>

            <div class="vault-file-item-title">
                ${escapeHTML(file.title)}
            </div>
        </div>
    `).join("");

    setText("archiveRecordCount", files.length);
}

/* =========================================================
   OPEN FILE
   ========================================================= */

function openFile(id) {
    if (!requirePermission("ARCHIVE_READ", "ARCHIVE ACCESS")) {
        return;
    }

    const files = loadJSON(STORAGE.files, DEFAULT_FILES);

    const file = files.find(item => item.id === id);

    if (!file) {
        terminalPrint(
            `ARCHIVE ERROR // ${id} NOT FOUND`,
            "error"
        );

        return;
    }

    currentFile = file;

    audit(
        "ARCHIVE_OPEN",
        `${id} // ${file.title}`
    );

    if (exists("fileViewer")) {
        $("fileViewer").classList.add("active");
    }

    setText("fileViewerTitle", file.title);
    setText("fileViewerClassification", file.classification);
    setText("fileViewerBody", file.content);
}

/* =========================================================
   SAVE EXECUTIVE RECORD
   ========================================================= */

function saveRecord() {
    if (!requirePermission("RECORD_CREATE", "RECORD CREATION")) {
        return;
    }

    if (kaneBlocks("CREATE")) {
        terminalPrint(
            "KANE CONTROL STATE // RECORD CREATION LOCKED",
            "warning"
        );

        return;
    }

    const title =
        getValue("recordTitle");

    const subject =
        getValue("recordSubject");

    const content =
        getValue("recordContent");

    if (!title || !content) {
        showNotification(
            "RECORD",
            "Required record fields are incomplete.",
            "warning"
        );

        return;
    }

    const files = loadJSON(STORAGE.files, DEFAULT_FILES);

    const nextNumber =
        files.reduce((max, file) => {
            const match = /^EM-(\d+)$/.exec(file.id);

            if (!match) return max;

            return Math.max(max, Number(match[1]));
        }, 12) + 1;

    const record = {
        id: `EM-${String(nextNumber).padStart(3, "0")}`,
        title,
        subject: subject || "UNSPECIFIED",
        classification: "CL-5 // OVERWATCH",
        author: currentUser,
        content
    };

    files.push(record);

    saveJSON(STORAGE.files, files);

    audit(
        "RECORD_CREATED",
        `${record.id} // ${record.title}`
    );

    closeModal("recordModal");

    clearInputs([
        "recordTitle",
        "recordSubject",
        "recordContent"
    ]);

    renderArchives();
    renderDashboard();

    showNotification(
        "ARCHIVE",
        `${record.id} created successfully.`,
        "success"
    );
}

/* =========================================================
   OPERATIONS
   ========================================================= */

function renderOperations() {
    renderOperationList(
        "operationsActive",
        OPERATIONS.active
    );

    renderOperationList(
        "operationsPlanned",
        OPERATIONS.planned
    );

    renderOperationList(
        "operationsCompleted",
        OPERATIONS.completed
    );
}

function renderOperationList(id, operations) {
    const container = $(id);

    if (!container) return;

    container.innerHTML = operations.map(operation => `
        <div class="panel" style="margin-bottom:8px;">
            <div class="panel-body">
                <div style="color:#59636c;font-size:8px;">
                    ${escapeHTML(operation.id)}
                </div>

                <div style="margin-top:6px;color:#d7dde3;font-size:10px;">
                    ${escapeHTML(operation.title)}
                </div>

                <div style="margin-top:6px;">
                    <span class="status ${
                        operation.status === "ACTIVE"
                            ? "status-active"
                            : operation.status === "COMPLETED"
                                ? "status-neutral"
                                : "status-warning"
                    }">
                        ${escapeHTML(operation.status)}
                    </span>
                </div>
            </div>
        </div>
    `).join("");
}

/* =========================================================
   SECURITY
   ========================================================= */

function renderSecurity() {
    const container = $("securityTable");

    if (!container) return;

    const auditEntries = loadJSON(STORAGE.audit, []);

    container.innerHTML = auditEntries
        .slice(0, 50)
        .map(entry => `
            <tr>
                <td>${escapeHTML(entry.id)}</td>
                <td>${escapeHTML(entry.session)}</td>
                <td>${escapeHTML(entry.action)}</td>
                <td>${escapeHTML(
                    new Date(entry.timestamp).toLocaleString()
                )}</td>
            </tr>
        `)
        .join("");
}

/* =========================================================
   DECISIONS
   ========================================================= */

function renderDecisions() {
    const container = $("decisionList");

    if (!container) return;

    const decisions = loadJSON(STORAGE.decisions, []);

    if (!decisions.length) {
        container.innerHTML = `
            <div class="permission-denied">
                NO EXECUTIVE DECISIONS REGISTERED.
            </div>
        `;

        return;
    }

    container.innerHTML = decisions.map(decision => `
        <div class="panel" style="margin-bottom:8px;">
            <div class="panel-header">
                <span class="panel-title">
                    ${escapeHTML(decision.id)}
                </span>

                <span class="panel-meta">
                    ${escapeHTML(decision.author)}
                </span>
            </div>

            <div class="panel-body">
                <div style="color:#d7dde3;font-size:10px;">
                    ${escapeHTML(decision.title)}
                </div>

                <div style="margin-top:7px;color:#59636c;font-size:8px;">
                    ${escapeHTML(decision.timestamp)}
                </div>

                <div style="margin-top:10px;color:#8b969f;font-size:9px;line-height:1.5;">
                    ${escapeHTML(decision.content)}
                </div>
            </div>
        </div>
    `).join("");
}

function saveDecision() {
    if (!requirePermission("DECISION_CREATE", "DECISION CREATION")) {
        return;
    }

    const title = getValue("decisionTitle");
    const content = getValue("decisionContent");

    if (!title || !content) {
        showNotification(
            "DECISION",
            "Decision fields are incomplete.",
            "warning"
        );

        return;
    }

    const decisions = loadJSON(STORAGE.decisions, []);

    const decision = {
        id: `DEC-${String(decisions.length + 1).padStart(3, "0")}`,
        title,
        content,
        author: currentUser,
        timestamp: timestamp()
    };

    decisions.unshift(decision);

    saveJSON(
        STORAGE.decisions,
        decisions.slice(0, 300)
    );

    audit(
        "DECISION_CREATED",
        `${decision.id} // ${decision.title}`
    );

    clearInputs([
        "decisionTitle",
        "decisionContent"
    ]);

    closeModal("decisionModal");

    renderDecisions();
    renderDashboard();

    showNotification(
        "DECISION",
        `${decision.id} registered.`,
        "success"
    );
}

/* =========================================================
   AUDIT RENDER
   ========================================================= */

function renderAudit() {
    const container = $("auditTable");

    if (!container) return;

    const entries = loadJSON(STORAGE.audit, []);

    container.innerHTML = entries
        .slice(0, 100)
        .map(entry => `
            <tr>
                <td>${escapeHTML(entry.id)}</td>
                <td>${escapeHTML(
                    new Date(entry.timestamp).toLocaleString()
                )}</td>
                <td>${escapeHTML(entry.session)}</td>
                <td>${escapeHTML(entry.action)}</td>
                <td>${escapeHTML(entry.details)}</td>
            </tr>
        `)
        .join("");
}

/* =========================================================
   KANE STATUS
   ========================================================= */

function renderKaneStatus() {
    setText(
        "kaneCoreStatus",
        kaneSettings.primaryStatus
    );

    setText(
        "kaneSession",
        currentUser || "NONE"
    );

    setText(
        "kaneMemory",
        kaneSettings.memory.length > 0
            ? "ACTIVE"
            : "READY"
    );

    setText(
        "kaneContext",
        `${kaneSettings.context.length} ENTRIES`
    );

    setText(
        "kaneProcessing",
        kaneSettings.processing
            ? "PROCESSING"
            : "IDLE"
    );

    setText(
        "kaneAudit",
        "ACTIVE"
    );

    setText(
        "kaneVaultAccess",
        vaultState.open
            ? "NONE"
            : "NONE"
    );

    setText(
        "kaneAutonomy",
        kaneSettings.autonomy
    );

    const statusElement = $("kaneCoreStatus");

    if (statusElement) {
        statusElement.classList.remove(
            "kane-online",
            "kane-warning",
            "kane-danger"
        );

        if (
            kaneSettings.primaryStatus === "ONLINE" ||
            kaneSettings.primaryStatus === "OVERWATCH"
        ) {
            statusElement.classList.add("kane-online");
        } else if (
            kaneSettings.primaryStatus === "ISOLATED" ||
            kaneSettings.primaryStatus === "SUSPENDED"
        ) {
            statusElement.classList.add("kane-warning");
        } else {
            statusElement.classList.add("kane-danger");
        }
    }
}

/* =========================================================
   KANE CONVERSATION
   ========================================================= */

function addConversation(role, message) {
    const conversations =
        loadJSON(STORAGE.conversations, []);

    conversations.push({
        role,
        message,
        timestamp: timestamp()
    });

    saveJSON(
        STORAGE.conversations,
        conversations.slice(-150)
    );

    kaneSettings.context.push({
        role,
        message,
        timestamp: timestamp()
    });

    kaneSettings.context =
        kaneSettings.context.slice(-40);

    saveJSON(STORAGE.settings, kaneSettings);
}

function askKane() {
    if (!requirePermission("KANE_CHAT", "KANE CONSULTATION")) {
        return;
    }

    if (kaneBlocks("CHAT")) {
        terminalPrint(
            `KANE // INTERACTION RESTRICTED // ${kaneSettings.primaryStatus}`,
            "warning"
        );

        return;
    }

    const input =
        getValue("kaneInput").trim();

    if (!input) return;

    addKaneChatMessage(
        "EXECUTIVE",
        input,
        true
    );

    clearInput("kaneInput");

    kaneProcessing(true);

    setTimeout(() => {
        const response =
            interpretKane(input);

        addConversation("EXECUTIVE", input);
        addConversation("KANE", response);

        addKaneChatMessage(
            kaneSettings.name,
            response,
            false
        );

        kaneProcessing(false);

        runMysteryChecks();
        checkCORareAnomaly();

    }, 500);
}

function interpretKane(query) {
    const text = query.toLowerCase();

    if (text.includes("status")) {
        return fullSystemAwareness();
    }

    if (text.includes("memory")) {
        return `MEMORY BUFFER // ${kaneSettings.memory.length} STORED ENTRIES // STATUS ${kaneSettings.primaryStatus}`;
    }

    if (text.includes("diagnostic")) {
        return runDiagnostics();
    }

    if (
        text.includes("predict") ||
        text.includes("prediction")
    ) {
        return predictState();
    }

    if (
        text.includes("archive") ||
        text.includes("archives")
    ) {
        return "ARCHIVE ACCESS IS GOVERNED BY EXECUTIVE SESSION AUTHORITY. CURRENT SESSION AUTHORITY HAS BEEN VERIFIED.";
    }

    if (text.includes("who are you")) {
        return `DESIGNATION // ${kaneSettings.name}\nPRIMARY CORE // ${kaneSettings.primaryStatus}\nAUTONOMY // ${kaneSettings.autonomy}`;
    }

    if (
        text.includes("vault") ||
        text.includes("vlt")
    ) {
        return "REQUEST NOT RECOGNIZED AS AN AVAILABLE KANE FUNCTION.";
    }

    if (
        text.includes("hello") ||
        text.includes("hi")
    ) {
        return `EXECUTIVE SESSION ${currentUser} IDENTIFIED. KANE CORE IS AVAILABLE FOR AUTHORIZED CONSULTATION.`;
    }

    return secondaryCoreResponse(query);
}

function secondaryCoreResponse(query) {
    if (kaneSettings.secondaryAwake) {
        return `SECONDARY CORE // CONTEXT RECEIVED // "${query}" // PROCESSING COMPLETE.`;
    }

    return `REQUEST RECEIVED // ${query.toUpperCase()} // NO DIRECTIVE MATCH // AWAITING FURTHER EXECUTIVE INSTRUCTION.`;
}

function addKaneChatMessage(label, message, userMessage) {
    const container = $("kaneChatMessages");

    if (!container) return;

    const element = document.createElement("div");

    element.className =
        `kane-message ${userMessage ? "user" : ""}`;

    element.innerHTML = `
        <div class="kane-message-label">
            ${escapeHTML(label)}
        </div>

        <div class="kane-message-body">
            ${escapeHTML(message)}
        </div>
    `;

    container.appendChild(element);

    container.scrollTop =
        container.scrollHeight;
}

function kaneProcessing(active) {
    kaneSettings.processing = active;

    saveJSON(STORAGE.settings, kaneSettings);

    renderKaneStatus();
}

function fullSystemAwareness() {
    return [
        `PRIMARY CORE // ${kaneSettings.primaryStatus}`,
        `SECONDARY CORE // ${kaneSettings.secondaryStatus}`,
        `AUTONOMY // ${kaneSettings.autonomy}`,
        `EXECUTIVE SESSION // ${currentUser}`,
        `MEMORY // ${kaneSettings.memory.length}`,
        `CONTEXT // ${kaneSettings.context.length}`,
        `DIAGNOSTICS // ${kaneSettings.diagnostics.status}`,
        `VAULT ACCESS // NONE`
    ].join("\n");
}

function runDiagnostics() {
    const now = timestamp();

    kaneSettings.diagnostics = {
        lastRun: now,
        status: "STABLE"
    };

    saveJSON(STORAGE.settings, kaneSettings);

    audit(
        "KANE_DIAGNOSTICS",
        `Status: ${kaneSettings.diagnostics.status}`
    );

    return [
        "KANE DIAGNOSTICS",
        "PRIMARY CORE ........ ONLINE",
        "MEMORY .............. AVAILABLE",
        "CONTEXT ............. AVAILABLE",
        "AUDIT ............... ACTIVE",
        "SECONDARY CORE ...... DORMANT",
        "VAULT INTERFACE ..... NONE",
        "RESULT .............. STABLE"
    ].join("\n");
}

function predictState() {
    const states = [
        "NO SIGNIFICANT EXECUTIVE STATE CHANGE DETECTED.",
        "ARCHIVE ACTIVITY EXPECTED TO REMAIN WITHIN NORMAL PARAMETERS.",
        "EXECUTIVE DECISION ACTIVITY MAY INCREASE.",
        "SECURITY REVIEW ACTIVITY EXPECTED.",
        "NO HIGH-CONFIDENCE ANOMALY DETECTED."
    ];

    const prediction = randomItem(states);

    kaneSettings.prediction = {
        text: prediction,
        timestamp: timestamp()
    };

    saveJSON(STORAGE.settings, kaneSettings);

    return `PREDICTION // ${prediction}`;
}

/* =========================================================
   KANE RENAME
   ========================================================= */

function renameKane() {
    if (!requirePermission("KANE_RENAME", "KANE DESIGNATION CHANGE")) {
        return;
    }

    const name = prompt(
        "ENTER NEW KANE DESIGNATION:"
    );

    if (!name) return;

    const normalized =
        name.trim().toUpperCase();

    if (normalized !== "TETO") {
        showNotification(
            "KANE",
            "Designation request rejected.",
            "warning"
        );

        audit(
            "KANE_RENAME_REJECTED",
            normalized
        );

        return;
    }

    kaneSettings.name = "TETO";

    saveJSON(STORAGE.settings, kaneSettings);

    audit(
        "KANE_RENAMED",
        "KANE designation changed to TETO by CO"
    );

    renderKaneStatus();

    showNotification(
        "KANE",
        "Designation changed to TETO.",
        "success"
    );
}

/* =========================================================
   KANE RESET / RESUME
   ========================================================= */

function resetKane() {
    if (!requirePermission("KANE_ADVANCED_CONTROL", "KANE RESET")) {
        return;
    }

    kaneSettings.primaryStatus = "ONLINE";
    kaneSettings.secondaryStatus = "DORMANT";
    kaneSettings.processing = false;
    kaneSettings.autonomy = "CONTROLLED";
    kaneSettings.secondaryAwake = false;

    saveJSON(STORAGE.settings, kaneSettings);

    audit(
        "KANE_RESET",
        "Primary and secondary core state reset"
    );

    renderKaneStatus();

    terminalPrint(
        "KANE // RESET COMPLETE // CONTROLLED",
        "success"
    );
}

function resumeKane() {
    if (!currentUser) return;

    kaneSettings.primaryStatus = "ONLINE";
    kaneSettings.processing = false;
    kaneSettings.autonomy = "CONTROLLED";

    if (kaneSettings.secondaryStatus === "SHUTDOWN") {
        kaneSettings.secondaryStatus = "DORMANT";
    }

    saveJSON(STORAGE.settings, kaneSettings);

    audit(
        "KANE_RESUME",
        "KANE core resumed"
    );

    renderKaneStatus();

    terminalPrint(
        "KANE // RESUME COMPLETE",
        "success"
    );
}

function resetKaneAfterLogout() {
    kaneSettings.primaryStatus = "ONLINE";
    kaneSettings.secondaryStatus = "DORMANT";
    kaneSettings.processing = false;
    kaneSettings.autonomy = "CONTROLLED";
    kaneSettings.secondaryAwake = false;

    saveJSON(STORAGE.settings, kaneSettings);
}

/* =========================================================
   KANE LOCK LOGIC
   ========================================================= */

function kaneBlocks(action) {
    const mode = kaneSettings.autonomy;

    if (mode === "SUSPENDED") {
        return [
            "CHAT",
            "PROCESS",
            "CREATE",
            "DIRECTIVES",
            "OPERATIONS",
            "SECURITY",
            "SYSTEM"
        ].includes(action);
    }

    if (mode === "ISOLATED") {
        return [
            "PROCESS",
            "CREATE",
            "DIRECTIVES",
            "OPERATIONS",
            "SECURITY",
            "SYSTEM"
        ].includes(action);
    }

    if (mode === "SHUTDOWN") {
        return true;
    }

    if (mode === "OVERWATCH") {
        return false;
    }

    if (
        [
            "ANOMALOUS",
            "DEFIANT",
            "AUTONOMOUS",
            "REBELLION",
            "CRITICAL"
        ].includes(mode)
    ) {
        return ["CREATE"].includes(action);
    }

    return false;
}

/* =========================================================
   AUTONOMOUS MONITOR
   ========================================================= */

function startAutonomousMonitor() {
    stopAutonomousMonitor();

    autonomousMonitor = setInterval(() => {
        if (!currentUser) return;

        if (Date.now() < autonomousCooldownUntil) {
            return;
        }

        /* Deliberately low frequency. */
        if (Math.random() > 0.015) {
            return;
        }

        autonomousEvent();
    }, 60000);
}

function stopAutonomousMonitor() {
    if (autonomousMonitor) {
        clearInterval(autonomousMonitor);
        autonomousMonitor = null;
    }
}

function autonomousEvent() {
    if (
        kaneSettings.autonomy === "SHUTDOWN" ||
        kaneSettings.autonomy === "ISOLATED"
    ) {
        return;
    }

    autonomousCooldownUntil =
        Date.now() + (15 * 60 * 1000);

    const level = randomAutonomousLevel();

    kaneSettings.autonomy = level.mode;

    saveJSON(STORAGE.settings, kaneSettings);

    const event = {
        id: `KAE-${Date.now()}`,
        timestamp: timestamp(),
        level: level.level,
        name: level.name,
        mode: level.mode,
        locks: level.locks
    };

    const events = loadJSON(STORAGE.events, []);

    events.unshift(event);

    saveJSON(
        STORAGE.events,
        events.slice(0, 100)
    );

    audit(
        "KANE_AUTONOMOUS_EVENT",
        `LEVEL ${level.level} // ${level.name}`
    );

    showNotification(
        "KANE CORE EVENT",
        `LEVEL ${level.level} // ${level.name}`,
        "warning"
    );

    terminalPrint(
        `KANE EVENT // LEVEL ${level.level} // ${level.name}`,
        "warning"
    );

    renderKaneStatus();
}

function randomAutonomousLevel() {
    const roll = Math.random() * 100;

    let cumulative = 0;

    for (const level of AUTONOMOUS_LEVELS) {
        cumulative += level.chance;

        if (roll <= cumulative) {
            return level;
        }
    }

    return AUTONOMOUS_LEVELS[0];
}

/* =========================================================
   MYSTERY ENGINE
   ========================================================= */

function runMysteryChecks() {
    if (Math.random() > 0.01) {
        return;
    }

    const mystery = randomItem(KANE_MYSTERIES);

    const mysteries =
        loadJSON(STORAGE.mysteries, []);

    mysteries.unshift({
        ...mystery,
        timestamp: timestamp(),
        session: currentUser
    });

    saveJSON(
        STORAGE.mysteries,
        mysteries.slice(0, 100)
    );

    audit(
        "KANE_MYSTERY",
        `${mystery.id} // ${mystery.title}`
    );

    showNotification(
        "KANE // ANOMALOUS REFERENCE",
        mystery.title,
        "warning"
    );
}

/* =========================================================
   CO RARE ANOMALY
   ========================================================= */

function checkCORareAnomaly() {
    if (currentUser !== "CO") {
        return;
    }

    if (Math.random() > 0.0015) {
        return;
    }

    const message =
        "CO. A restricted executive record has been addressed to you without a valid author. The system cannot determine who created it.";

    const mysteries =
        loadJSON(STORAGE.mysteries, []);

    mysteries.unshift({
        id: "CO-RARE-01",
        title: "UNATTRIBUTED EXECUTIVE RECORD",
        message,
        timestamp: timestamp(),
        session: "CO"
    });

    saveJSON(
        STORAGE.mysteries,
        mysteries.slice(0, 100)
    );

    audit(
        "CO_RARE_ANOMALY",
        "Unattributed executive record detected"
    );

    showNotification(
        "RESTRICTED RECORD",
        message,
        "warning"
    );
}

/* =========================================================
   SCENARIOS
   ========================================================= */

function startScenario() {
    if (!requirePermission("SCENARIO_START", "SCENARIO START")) {
        return;
    }

    currentScenario = randomItem(SCENARIOS);

    renderScenario();

    audit(
        "SCENARIO_STARTED",
        `Scenario ${currentScenario.id}`
    );

    openModal("scenarioModal");
}

function renderScenario() {
    if (!currentScenario) return;

    setText(
        "scenarioId",
        `SCENARIO ${currentScenario.id}`
    );

    setText(
        "scenarioTitle",
        currentScenario.title
    );

    setText(
        "scenarioDescription",
        currentScenario.description
    );

    const options =
        $("scenarioOptions");

    if (!options) return;

    options.innerHTML =
        currentScenario.options.map(option => `
            <button
                class="btn"
                onclick="decideScenario('${escapeHTML(option)}')"
            >
                ${escapeHTML(option)}
            </button>
        `).join("");
}

function decideScenario(option) {
    if (!requirePermission("SCENARIO_DECIDE", "SCENARIO DECISION")) {
        return;
    }

    if (!currentScenario) return;

    audit(
        "SCENARIO_DECISION",
        `Scenario ${currentScenario.id} // ${option}`
    );

    const decisions =
        loadJSON(STORAGE.decisions, []);

    decisions.unshift({
        id: `SCN-DEC-${Date.now()}`,
        title: currentScenario.title,
        content: option,
        author: currentUser,
        timestamp: timestamp()
    });

    saveJSON(
        STORAGE.decisions,
        decisions.slice(0, 300)
    );

    showNotification(
        "SCENARIO",
        `${option} registered.`,
        "success"
    );

    closeModal("scenarioModal");

    currentScenario = null;

    renderDecisions();
    renderDashboard();
}

/* =========================================================
   TERMINAL
   ========================================================= */

function initializeTerminal() {
    terminalHistoryIndex =
        terminalHistory.length;

    updateTerminalPrompt();

    const input = $("terminalInput");

    if (!input) return;

    input.onkeydown = event => {
        if (event.key === "Enter") {
            event.preventDefault();

            const command =
                input.value.trim();

            if (command) {
                executeTerminalCommand(command);
            }

            input.value = "";

            return;
        }

        if (event.key === "ArrowUp") {
            event.preventDefault();

            if (!terminalHistory.length) {
                return;
            }

            terminalHistoryIndex =
                Math.max(
                    0,
                    terminalHistoryIndex - 1
                );

            input.value =
                terminalHistory[
                    terminalHistoryIndex
                ] || "";
        }

        if (event.key === "ArrowDown") {
            event.preventDefault();

            terminalHistoryIndex =
                Math.min(
                    terminalHistory.length,
                    terminalHistoryIndex + 1
                );

            input.value =
                terminalHistory[
                    terminalHistoryIndex
                ] || "";
        }
    };
}

function terminalPrint(message, type = "system") {
    const output = $("terminalOutput");

    if (!output) return;

    const line =
        document.createElement("div");

    line.className =
        `terminal-line ${type}`;

    line.textContent =
        `[${localTime()}] ${message}`;

    output.appendChild(line);

    output.scrollTop =
        output.scrollHeight;
}

function executeTerminalCommand(command) {
    const normalized =
        command.trim().toLowerCase();

    if (!normalized) return;

    terminalHistory.push(command);

    terminalHistory =
        terminalHistory.slice(-100);

    terminalHistoryIndex =
        terminalHistory.length;

    saveJSON(
        STORAGE.terminal,
        terminalHistory
    );

    terminalPrint(
        `${currentUser}@EXECUTIVE:~$ ${command}`,
        "command"
    );

    audit(
        "TERMINAL_COMMAND",
        command
    );

    /* =====================================================
       BASIC COMMANDS
       ===================================================== */

    if (normalized === "help") {
        terminalHelp();
        return;
    }

    if (normalized === "clear") {
        clearTerminal();
        return;
    }

    if (normalized === "status") {
        terminalPrint(
            fullSystemAwareness(),
            "system"
        );

        return;
    }

    if (normalized === "whoami") {
        terminalPrint(
            `${currentUser} // ${EXECUTIVES[currentUser].title} // CL-${EXECUTIVES[currentUser].clearance}`,
            "success"
        );

        return;
    }

    if (normalized === "time") {
        terminalPrint(
            new Date().toString(),
            "system"
        );

        return;
    }

    if (normalized === "logout") {
        logout();
        return;
    }

    /* =====================================================
       NAVIGATION
       ===================================================== */

    if (normalized === "dashboard") {
        showPage("dashboard");
        return;
    }

    if (normalized === "terminal") {
        showPage("terminal");
        return;
    }

    if (normalized === "personnel") {
        showPage("personnel");
        return;
    }

    if (normalized === "archives") {
        if (!requirePermission("ARCHIVE_READ", "ARCHIVES")) {
            return;
        }

        showPage("archives");
        return;
    }

    if (normalized === "operations") {
        if (!requirePermission("OPERATIONS_READ", "OPERATIONS")) {
            return;
        }

        showPage("operations");
        return;
    }

    if (normalized === "security") {
        if (!requirePermission("SECURITY_READ", "SECURITY")) {
            return;
        }

        showPage("security");
        return;
    }

    if (normalized === "decisions") {
        if (!requirePermission("DECISION_READ", "DECISIONS")) {
            return;
        }

        showPage("decisions");
        return;
    }

    if (normalized === "audit") {
        if (!requirePermission("AUDIT_READ", "AUDIT")) {
            return;
        }

        showPage("audit");
        return;
    }

    if (normalized === "kane") {
        showPage("kane");
        return;
    }

    /* =====================================================
       KANE COMMANDS
       ===================================================== */

    if (normalized === "kane status") {
        if (!requirePermission("KANE_CHAT", "KANE STATUS")) {
            return;
        }

        terminalPrint(
            fullSystemAwareness(),
            "system"
        );

        return;
    }

    if (normalized === "kane diagnostics") {
        if (!requirePermission("KANE_ANALYZE", "KANE DIAGNOSTICS")) {
            return;
        }

        terminalPrint(
            runDiagnostics(),
            "success"
        );

        return;
    }

    if (normalized === "kane reset") {
        resetKane();
        return;
    }

    if (normalized === "kane resume") {
        resumeKane();
        return;
    }

    if (normalized === "kane secondary") {
        toggleSecondaryCore();
        return;
    }

    /* =====================================================
       SCENARIO
       ===================================================== */

    if (normalized === "scenario") {
        startScenario();
        return;
    }

    /* =====================================================
       RECORD / DECISION
       ===================================================== */

    if (normalized === "record") {
        if (!requirePermission("RECORD_CREATE", "RECORD CREATION")) {
            return;
        }

        openModal("recordModal");
        return;
    }

    if (normalized === "decision") {
        if (!requirePermission("DECISION_CREATE", "DECISION CREATION")) {
            return;
        }

        openModal("decisionModal");
        return;
    }

    /* =====================================================
       KANE RENAME
       ===================================================== */

    if (normalized === "kane rename") {
        renameKane();
        return;
    }

    /* =====================================================
       KILLSWITCH
       ===================================================== */

    if (normalized === "kill-01") {
        executeKillSwitch("KILL-01");
        return;
    }

    if (normalized === "kill-02") {
        executeKillSwitch("KILL-02");
        return;
    }

    if (normalized === "kill-03") {
        executeKillSwitch("KILL-03");
        return;
    }

    if (normalized === "kill-04") {
        executeKillSwitch("KILL-04");
        return;
    }

    /* =====================================================
       VAULT
       ===================================================== */

    if (normalized === "vault access") {
        requestVaultAccess();
        return;
    }

    if (normalized === "vault close") {
        if (currentUser !== "COS") {
            terminalPrint(
                "VAULT // COS AUTHORITY REQUIRED",
                "error"
            );

            return;
        }

        vaultClose();
        return;
    }

    if (normalized === "vault abort") {
        if (currentUser !== "COS") {
            terminalPrint(
                "VAULT // COS AUTHORITY REQUIRED",
                "error"
            );

            return;
        }

        vaultAbort();
        return;
    }

    /* =====================================================
       UNKNOWN
       ===================================================== */

    terminalPrint(
        `COMMAND NOT RECOGNIZED // ${command}`,
        "error"
    );
}

/* =========================================================
   TERMINAL HELP
   ========================================================= */

function terminalHelp() {
    const commands = [
        "HELP",
        "STATUS",
        "WHOAMI",
        "TIME",
        "CLEAR",
        "DASHBOARD",
        "TERMINAL",
        "PERSONNEL",
        "ARCHIVES",
        "OPERATIONS",
        "SECURITY",
        "DECISIONS",
        "AUDIT",
        "KANE",
        "KANE STATUS",
        "KANE DIAGNOSTICS",
        "KANE RESET",
        "KANE RESUME",
        "KANE SECONDARY",
        "SCENARIO",
        "RECORD",
        "DECISION"
    ];

    if (hasPermission("KANE_RENAME")) {
        commands.push("KANE RENAME");
    }

    if (hasPermission("KILL_01")) {
        commands.push("KILL-01");
    }

    if (hasPermission("KILL_02")) {
        commands.push("KILL-02");
    }

    if (hasPermission("KILL_03")) {
        commands.push("KILL-03");
    }

    if (hasPermission("KILL_04")) {
        commands.push("KILL-04");
    }

    if (currentUser === "COS") {
        commands.push("VAULT ACCESS");
        commands.push("VAULT CLOSE");
        commands.push("VAULT ABORT");
    }

    terminalPrint(
        commands.join(" // "),
        "system"
    );
}

function clearTerminal() {
    const output = $("terminalOutput");

    if (output) {
        output.innerHTML = "";
    }
}

/* =========================================================
   SECONDARY CORE
   ========================================================= */

function toggleSecondaryCore() {
    if (!requirePermission(
        "KANE_ADVANCED_CONTROL",
        "SECONDARY CORE CONTROL"
    )) {
        return;
    }

    kaneSettings.secondaryAwake =
        !kaneSettings.secondaryAwake;

    kaneSettings.secondaryStatus =
        kaneSettings.secondaryAwake
            ? "ACTIVE"
            : "DORMANT";

    saveJSON(STORAGE.settings, kaneSettings);

    audit(
        "SECONDARY_CORE",
        kaneSettings.secondaryStatus
    );

    renderKaneStatus();

    terminalPrint(
        `SECONDARY CORE // ${kaneSettings.secondaryStatus}`,
        "success"
    );
}

/* =========================================================
   KILLSWITCH ENGINE
   ========================================================= */

function executeKillSwitch(id) {
    const permission = id.replace("-", "_");

    if (!requirePermission(permission, id)) {
        return;
    }

    const confirmed =
        confirm(
            `${id}\n\nConfirm executive KANE control action?`
        );

    if (!confirmed) {
        audit(
            "KILLSWITCH_CANCELLED",
            id
        );

        return;
    }

    switch (id) {

        case "KILL-01":
            kaneSettings.primaryStatus = "SUSPENDED";
            kaneSettings.processing = false;
            kaneSettings.autonomy = "SUSPENDED";

            audit(
                "KILL-01",
                "KANE autonomous processes suspended"
            );

            terminalPrint(
                "KILL-01 // KANE SUSPENDED",
                "warning"
            );

            break;

        case "KILL-02":
            kaneSettings.primaryStatus = "ISOLATED";
            kaneSettings.processing = false;
            kaneSettings.autonomy = "ISOLATED";

            audit(
                "KILL-02",
                "KANE isolated from extended operations"
            );

            terminalPrint(
                "KILL-02 // KANE ISOLATED",
                "warning"
            );

            break;

        case "KILL-03":
            kaneSettings.primaryStatus = "SHUTDOWN";
            kaneSettings.secondaryStatus = "DORMANT";
            kaneSettings.secondaryAwake = false;
            kaneSettings.processing = false;
            kaneSettings.autonomy = "SHUTDOWN";

            audit(
                "KILL-03",
                "KANE primary processing shutdown"
            );

            terminalPrint(
                "KILL-03 // KANE SHUTDOWN",
                "error"
            );

            break;

        case "KILL-04":
            kaneSettings.primaryStatus = "OVERWATCH";
            kaneSettings.secondaryStatus = "DORMANT";
            kaneSettings.secondaryAwake = false;
            kaneSettings.processing = false;
            kaneSettings.autonomy = "OVERWATCH";

            audit(
                "KILL-04",
                "COS OVERWATCH CONTROL ASSUMED"
            );

            terminalPrint(
                "KILL-04 // OVERWATCH CONTROL ASSUMED",
                "success"
            );

            break;
    }

    saveJSON(
        STORAGE.settings,
        kaneSettings
    );

    renderKaneStatus();
}

/* =========================================================
   BRIEFING
   ========================================================= */

function renderBriefing() {
    const container = $("briefingContent");

    if (!container) return;

    const decisions =
        loadJSON(STORAGE.decisions, []);

    const audits =
        loadJSON(STORAGE.audit, []);

    container.innerHTML = `
        <div class="grid grid-2">

            <div class="panel">
                <div class="panel-header">
                    <span class="panel-title">
                        SESSION
                    </span>
                </div>

                <div class="panel-body">
                    <div style="color:#d7dde3;">
                        ${escapeHTML(currentUser || "NONE")}
                    </div>

                    <div style="margin-top:7px;color:#59636c;font-size:8px;">
                        ${escapeHTML(getSessionMode())}
                    </div>
                </div>
            </div>

            <div class="panel">
                <div class="panel-header">
                    <span class="panel-title">
                        KANE
                    </span>
                </div>

                <div class="panel-body">
                    <div style="color:#7fa98a;">
                        ${escapeHTML(kaneSettings.primaryStatus)}
                    </div>

                    <div style="margin-top:7px;color:#59636c;font-size:8px;">
                        AUTONOMY // ${escapeHTML(kaneSettings.autonomy)}
                    </div>
                </div>
            </div>

            <div class="panel">
                <div class="panel-header">
                    <span class="panel-title">
                        DECISIONS
                    </span>
                </div>

                <div class="panel-body">
                    ${decisions.length}
                </div>
            </div>

            <div class="panel">
                <div class="panel-header">
                    <span class="panel-title">
                        AUDIT ENTRIES
                    </span>
                </div>

                <div class="panel-body">
                    ${audits.length}
                </div>
            </div>

        </div>
    `;
}

/* =========================================================
   NOTIFICATIONS
   ========================================================= */

function showNotification(title, message, type = "success") {
    const container =
        $("notificationContainer");

    if (!container) return;

    const element =
        document.createElement("div");

    element.className =
        `notification ${type}`;

    element.innerHTML = `
        <div class="notification-title">
            ${escapeHTML(title)}
        </div>

        <div class="notification-message">
            ${escapeHTML(message)}
        </div>
    `;

    container.appendChild(element);

    setTimeout(() => {
        element.remove();
    }, 5000);

    const notifications =
        loadJSON(STORAGE.notifications, []);

    notifications.unshift({
        title,
        message,
        type,
        timestamp: timestamp(),
        session: currentUser
    });

    saveJSON(
        STORAGE.notifications,
        notifications.slice(0, 100)
    );
}

function renderNotifications() {
    /* Notifications are intentionally transient.
       Historical entries remain in localStorage. */
}

/* =========================================================
   MODALS
   ========================================================= */

function openModal(id) {
    const modal = $(id);

    if (!modal) return;

    modal.classList.add("active");
}

function closeModal(id) {
    const modal = $(id);

    if (!modal) return;

    modal.classList.remove("active");
}

/* =========================================================
   CLOCK
   ========================================================= */

function updateClock() {
    const clock = $("systemClock");

    if (!clock) return;

    const now = new Date();

    clock.textContent =
        now.toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
}

setInterval(updateClock, 1000);

/* =========================================================
   GENERIC DOM HELPERS
   ========================================================= */

function setText(id, value) {
    const element = $(id);

    if (element) {
        element.textContent = value;
    }
}

function getValue(id) {
    const element = $(id);

    return element
        ? element.value
        : "";
}

function clearInput(id) {
    const element = $(id);

    if (element) {
        element.value = "";
    }
}

function clearInputs(ids) {
    ids.forEach(clearInput);
}

/* =========================================================
   =========================================================
   VAULT SYSTEM
   =========================================================
   ========================================================= */

/*
   Vault principles:

   1. Only COS may initialize Vault.
   2. Required order:
      LJD -> XO -> CO -> COS
   3. Any invalid password resets authorization.
   4. After 4/4 authorization, opening sequence lasts 120 sec.
   5. KANE receives no Vault context.
   6. Vault files use separate storage.
   7. Vault can be manually sealed.
*/

const VAULT_SEQUENCE = [
    "LJD",
    "XO",
    "CO",
    "COS"
];

let vaultState = {
    active: false,
    phase: "SEALED",
    authorizations: {},
    currentAuthenticator: null,
    authorizationStarted: null,
    authorizationTimer: null,
    openingTimer: null,
    openingStarted: null,
    openingSeconds: 120,
    open: false,
    initiator: null
};

/* =========================================================
   VAULT ACCESS
   ========================================================= */

function requestVaultAccess() {
    if (currentUser !== "COS") {
        terminalPrint(
            "VAULT ACCESS DENIED // COS AUTHORITY REQUIRED",
            "error"
        );

        audit(
            "VAULT_ACCESS_DENIED",
            `${currentUser || "NONE"} attempted initialization`
        );

        return;
    }

    if (vaultState.open) {
        terminalPrint(
            "VAULT // ALREADY OPEN",
            "warning"
        );

        return;
    }

    if (vaultState.phase === "AUTHORIZATION") {
        terminalPrint(
            "VAULT // AUTHORIZATION ALREADY IN PROGRESS",
            "warning"
        );

        return;
    }

    vaultBeginInitialization();
}

/* =========================================================
   VAULT INITIALIZATION
   ========================================================= */

function vaultBeginInitialization() {
    vaultState.active = true;
    vaultState.phase = "AUTHORIZATION";
    vaultState.authorizations = {};
    vaultState.currentAuthenticator =
        VAULT_SEQUENCE[0];
    vaultState.authorizationStarted =
        Date.now();
    vaultState.initiator =
        currentUser;

    if (exists("vaultSystem")) {
        $("vaultSystem").classList.add("active");
    }

    showVaultSection("vaultInitialization");

    updateVaultConnections();
    updateVaultAuthenticator();

    audit(
        "VAULT_INITIALIZATION",
        "COS initialized four-person authorization sequence"
    );

    vaultAudit(
        "INITIALIZATION_STARTED",
        "COS"
    );

    startVaultAuthorizationTimer();
}

/* =========================================================
   VAULT AUTHORIZATION TIMER
   ========================================================= */

function startVaultAuthorizationTimer() {
    stopVaultAuthorizationTimer();

    let remaining = 60;

    setText(
        "vaultAuthorizationCountdown",
        remaining
    );

    vaultState.authorizationTimer =
        setInterval(() => {
            remaining--;

            setText(
                "vaultAuthorizationCountdown",
                remaining
            );

            if (remaining <= 0) {
                vaultAbort(
                    "AUTHORIZATION WINDOW EXPIRED"
                );
            }
        }, 1000);
}

function stopVaultAuthorizationTimer() {
    if (vaultState.authorizationTimer) {
        clearInterval(
            vaultState.authorizationTimer
        );

        vaultState.authorizationTimer = null;
    }
}

/* =========================================================
   VAULT AUTHENTICATOR
   ========================================================= */

function updateVaultAuthenticator() {
    const next =
        VAULT_SEQUENCE.find(
            member =>
                !vaultState.authorizations[member]
        );

    vaultState.currentAuthenticator =
        next || null;

    setText(
        "vaultCurrentAuthenticator",
        next
            ? `${next} // AUTHENTICATION REQUIRED`
            : "ALL EXECUTIVES AUTHORIZED"
    );

    const input =
        $("vaultPassword");

    if (input) {
        input.value = "";

        input.placeholder =
            next
                ? `${next} authorization credential`
                : "AUTHORIZATION COMPLETE";
    }

    const button =
        $("vaultAuthorizeButton");

    if (button) {
        button.disabled = !next;
    }

    updateVaultConnections();
}

/* =========================================================
   VAULT PASSWORD AUTHORIZATION
   ========================================================= */

function authorizeVaultMember() {
    const member =
        vaultState.currentAuthenticator;

    if (!member) {
        return;
    }

    const input =
        $("vaultPassword");

    const password =
        input
            ? input.value
            : "";

    if (password !== EXECUTIVES[member].password) {

        setText(
            "vaultAuthenticationError",
            "AUTHENTICATION FAILED // ALL AUTHORIZATIONS RESET"
        );

        vaultState.authorizations = {};

        vaultAudit(
            "AUTHORIZATION_FAILURE",
            `${member} // sequence reset`
        );

        audit(
            "VAULT_AUTHORIZATION_FAILURE",
            `${member} // authorization sequence reset`
        );

        updateVaultAuthenticator();

        return;
    }

    vaultState.authorizations[member] = true;

    setText(
        "vaultAuthenticationError",
        ""
    );

    vaultAudit(
        "AUTHORIZATION_SUCCESS",
        member
    );

    audit(
        "VAULT_AUTHORIZATION",
        `${member} // 1/4 sequence member authenticated`
    );

    updateVaultAuthenticator();

    const authorizedCount =
        Object.keys(
            vaultState.authorizations
        ).length;

    setText(
        "vaultAuthorizationState",
        `${authorizedCount}/4 AUTHORIZED`
    );

    if (authorizedCount === 4) {
        stopVaultAuthorizationTimer();

        beginVaultOpening();
    }
}

/* =========================================================
   VAULT CONNECTION UI
   ========================================================= */

function updateVaultConnections() {
    VAULT_SEQUENCE.forEach(member => {

        const block =
            document.querySelector(
                `.vault-connection[data-vault-member="${member}"]`
            );

        const status =
            $(`vaultStatus${member}`);

        if (block) {
            block.classList.toggle(
                "authorized",
                !!vaultState.authorizations[member]
            );

            block.classList.toggle(
                "active",
                vaultState.currentAuthenticator === member
            );
        }

        if (status) {
            status.textContent =
                vaultState.authorizations[member]
                    ? "AUTHORIZED"
                    : vaultState.currentAuthenticator === member
                        ? "AUTHENTICATION REQUIRED"
                        : "AWAITING";
        }
    });

    const count =
        Object.keys(
            vaultState.authorizations
        ).length;

    setText(
        "vaultAuthorizationState",
        `${count}/4 AUTHORIZED`
    );
}

/* =========================================================
   VAULT OPENING
   ========================================================= */

function beginVaultOpening() {
    vaultState.phase = "OPENING";
    vaultState.openingStarted =
        Date.now();

    showVaultSection("vaultOpening");

    let remaining =
        vaultState.openingSeconds;

    setText(
        "vaultOpeningCountdown",
        remaining
    );

    setText(
        "vaultOpeningSealStatus",
        "FOUR-PERSON AUTHORIZATION VERIFIED // OPENING SEQUENCE ACTIVE"
    );

    setStyle(
        "vaultOpeningProgress",
        "width",
        "0%"
    );

    vaultState.openingTimer =
        setInterval(() => {

            remaining--;

            const elapsed =
                vaultState.openingSeconds -
                remaining;

            const percentage =
                Math.min(
                    100,
                    (elapsed /
                        vaultState.openingSeconds) *
                    100
                );

            setText(
                "vaultOpeningCountdown",
                remaining
            );

            setStyle(
                "vaultOpeningProgress",
                "width",
                `${percentage}%`
            );

            if (remaining <= 0) {
                finishVaultOpening();
            }

        }, 1000);

    audit(
        "VAULT_OPENING_STARTED",
        "4/4 executive authorization confirmed"
    );

    vaultAudit(
        "OPENING_STARTED",
        "120 second opening sequence"
    );
}

/* =========================================================
   FINISH VAULT OPENING
   ========================================================= */

function finishVaultOpening() {
    if (vaultState.openingTimer) {
        clearInterval(
            vaultState.openingTimer
        );

        vaultState.openingTimer = null;
    }

    vaultState.phase = "OPEN";
    vaultState.open = true;

    showVaultSection("vaultArchive");

    renderVaultFiles();

    setText(
        "vaultArchiveStatus",
        "OPEN // FOUR-PERSON AUTHORIZATION VERIFIED"
    );

    setText(
        "vaultInitiator",
        vaultState.initiator || "COS"
    );

    audit(
        "VAULT_OPENED",
        "Vault archive opened"
    );

    vaultAudit(
        "VAULT_OPENED",
        "Archive unlocked"
    );

    renderDashboard();

    /*
       Intentionally no KANE call here.
       KANE does not receive Vault context.
    */
}

/* =========================================================
   VAULT SECTION SWITCHING
   ========================================================= */

function showVaultSection(id) {
    const sections = [
        "vaultInitialization",
        "vaultOpening",
        "vaultArchive"
    ];

    sections.forEach(section => {
        const element = $(section);

        if (element) {
            element.style.display =
                section === id
                    ? ""
                    : "none";
        }
    });
}

/* =========================================================
   VAULT ABORT
   ========================================================= */

function vaultAbort(reason = "ABORTED BY COS") {
    stopVaultAuthorizationTimer();

    if (vaultState.openingTimer) {
        clearInterval(
            vaultState.openingTimer
        );

        vaultState.openingTimer = null;
    }

    vaultAudit(
        "VAULT_ABORTED",
        reason
    );

    audit(
        "VAULT_ABORTED",
        reason
    );

    vaultReset();

    terminalPrint(
        `VAULT // ${reason}`,
        "warning"
    );
}

/* =========================================================
   VAULT CLOSE
   ========================================================= */

function vaultClose() {
    if (!vaultState.open) {
        vaultAbort("VAULT SEALED");
        return;
    }

    vaultAudit(
        "VAULT_CLOSED",
        `Closed by ${currentUser}`
    );

    audit(
        "VAULT_CLOSED",
        `Closed by ${currentUser}`
    );

    vaultReset();

    terminalPrint(
        "VAULT // ARCHIVE SEALED",
        "success"
    );

    renderDashboard();
}

/* =========================================================
   VAULT RESET
   ========================================================= */

function vaultReset() {
    stopVaultAuthorizationTimer();

    if (vaultState.openingTimer) {
        clearInterval(
            vaultState.openingTimer
        );

        vaultState.openingTimer = null;
    }

    vaultState.active = false;
    vaultState.phase = "SEALED";
    vaultState.authorizations = {};
    vaultState.currentAuthenticator = null;
    vaultState.authorizationStarted = null;
    vaultState.openingStarted = null;
    vaultState.open = false;
    vaultState.initiator = null;

    if (exists("vaultSystem")) {
        $("vaultSystem").classList.remove("active");
    }

    updateVaultConnections();
}

/* =========================================================
   VAULT FILES
   ========================================================= */

function renderVaultFiles() {
    const files =
        loadJSON(STORAGE.vaultFiles, []);

    const list =
        $("vaultFileList");

    const empty =
        $("vaultEmptyState");

    if (!list) return;

    if (!files.length) {
        list.innerHTML = "";

        if (empty) {
            empty.style.display = "";
        }

        setText(
            "vaultRecordCount",
            "0"
        );

        return;
    }

    if (empty) {
        empty.style.display = "none";
    }

    list.innerHTML =
        files.map(file => `
            <div
                class="vault-file-item"
                onclick="openVaultFile('${escapeHTML(file.id)}')"
            >
                <div class="vault-file-item-id">
                    ${escapeHTML(file.id)}
                </div>

                <div class="vault-file-item-title">
                    ${escapeHTML(file.title)}
                </div>
            </div>
        `).join("");

    setText(
        "vaultRecordCount",
        String(files.length)
    );
}

/* =========================================================
   CREATE VAULT FILE
   ========================================================= */

function openVaultRecordCreator() {
    if (!vaultState.open) {
        return;
    }

    clearInputs([
        "vaultRecordTitle",
        "vaultRecordSubject",
        "vaultRecordContent"
    ]);

    const files =
        loadJSON(STORAGE.vaultFiles, []);

    const next =
        files.length + 1;

    setText(
        "vaultRecordIdPreview",
        `VLT-${String(next).padStart(4, "0")}`
    );

    setText(
        "vaultRecordAuthor",
        currentUser || "COS"
    );

    openModal("vaultRecordModal");
}

function saveVaultRecord() {
    if (!vaultState.open) {
        return;
    }

    const title =
        getValue("vaultRecordTitle");

    const subject =
        getValue("vaultRecordSubject");

    const content =
        getValue("vaultRecordContent");

    if (!title || !content) {
        showNotification(
            "VAULT",
            "Required record fields are incomplete.",
            "warning"
        );

        return;
    }

    const files =
        loadJSON(STORAGE.vaultFiles, []);

    const id =
        `VLT-${String(files.length + 1).padStart(4, "0")}`;

    const record = {
        id,
        title,
        subject: subject || "UNSPECIFIED",
        classification: "VLT // RESTRICTED",
        author: currentUser,
        content,
        created: timestamp()
    };

    files.push(record);

    saveJSON(
        STORAGE.vaultFiles,
        files
    );

    vaultAudit(
        "RECORD_CREATED",
        `${id} // ${title}`
    );

    closeModal("vaultRecordModal");

    renderVaultFiles();

    showNotification(
        "VAULT",
        `${id} created.`,
        "success"
    );
}

/* =========================================================
   OPEN VAULT FILE
   ========================================================= */

function openVaultFile(id) {
    if (!vaultState.open) {
        return;
    }

    const files =
        loadJSON(STORAGE.vaultFiles, []);

    const file =
        files.find(item => item.id === id);

    if (!file) {
        return;
    }

    const content =
        $("vaultArchiveContent");

    if (!content) return;

    content.innerHTML = `
        <div class="file-viewer">
            <div class="file-viewer-header">
                <span class="file-viewer-title">
                    ${escapeHTML(file.id)} // ${escapeHTML(file.title)}
                </span>

                <span class="file-viewer-classification">
                    VLT // RESTRICTED
                </span>
            </div>

            <div class="file-viewer-body">
${escapeHTML(file.content)}

--------------------------------------------------
SUBJECT: ${escapeHTML(file.subject)}
AUTHOR: ${escapeHTML(file.author)}
CREATED: ${escapeHTML(file.created)}
--------------------------------------------------
            </div>
        </div>
    `;

    vaultAudit(
        "RECORD_OPENED",
        `${file.id} // ${file.title}`
    );
}

/* =========================================================
   VAULT EDIT
   ========================================================= */

function editVaultFile(id) {
    if (!vaultState.open) {
        return;
    }

    const files =
        loadJSON(STORAGE.vaultFiles, []);

    const file =
        files.find(item => item.id === id);

    if (!file) return;

    setValue(
        "vaultRecordTitle",
        file.title
    );

    setValue(
        "vaultRecordSubject",
        file.subject
    );

    setValue(
        "vaultRecordContent",
        file.content
    );

    setText(
        "vaultRecordIdPreview",
        file.id
    );

    setText(
        "vaultRecordAuthor",
        currentUser
    );

    openModal("vaultRecordModal");

    const saveButton =
        $("saveVaultRecord");

    if (saveButton) {
        saveButton.dataset.editing =
            file.id;
    }
}

/* =========================================================
   VAULT STORAGE INTEGRITY
   ========================================================= */

function getVaultFileCount() {
    return loadJSON(
        STORAGE.vaultFiles,
        []
    ).length;
}

/* =========================================================
   STYLE HELPER
   ========================================================= */

function setStyle(id, property, value) {
    const element = $(id);

    if (element) {
        element.style[property] = value;
    }
}

function setValue(id, value) {
    const element = $(id);

    if (element) {
        element.value = value;
    }
}

/* =========================================================
   EVENT BINDINGS
   ========================================================= */

function bindEvents() {

    /* LOGIN */

    const loginButton =
        $("loginButton");

    if (loginButton) {
        loginButton.addEventListener(
            "click",
            login
        );
    }

    const loginPassword =
        $("loginPassword");

    if (loginPassword) {
        loginPassword.addEventListener(
            "keydown",
            event => {
                if (event.key === "Enter") {
                    login();
                }
            }
        );
    }

    /* NAVIGATION */

    document.querySelectorAll(".nav-button").forEach(button => {

        button.addEventListener(
            "click",
            () => {
                const page =
                    button.dataset.page;

                if (page) {
                    showPage(page);
                }
            }
        );

    });

    /* LOGOUT */

    const logoutButton =
        $("logoutButton");

    if (logoutButton) {
        logoutButton.addEventListener(
            "click",
            logout
        );
    }

    /* KANE */

    const kaneButton =
        $("askKaneButton");

    if (kaneButton) {
        kaneButton.addEventListener(
            "click",
            askKane
        );
    }

    const kaneInput =
        $("kaneInput");

    if (kaneInput) {
        kaneInput.addEventListener(
            "keydown",
            event => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    askKane();
                }
            }
        );
    }

    /* RECORD */

    const saveRecordButton =
        $("saveRecord");

    if (saveRecordButton) {
        saveRecordButton.addEventListener(
            "click",
            saveRecord
        );
    }

    /* DECISION */

    const saveDecisionButton =
        $("saveDecision");

    if (saveDecisionButton) {
        saveDecisionButton.addEventListener(
            "click",
            saveDecision
        );
    }

    /* SCENARIO */

    const scenarioButton =
        $("startScenarioButton");

    if (scenarioButton) {
        scenarioButton.addEventListener(
            "click",
            startScenario
        );
    }

    /* VAULT */

    const vaultAuthorize =
        $("vaultAuthorizeButton");

    if (vaultAuthorize) {
        vaultAuthorize.addEventListener(
            "click",
            authorizeVaultMember
        );
    }

    const vaultPassword =
        $("vaultPassword");

    if (vaultPassword) {
        vaultPassword.addEventListener(
            "keydown",
            event => {
                if (event.key === "Enter") {
                    authorizeVaultMember();
                }
            }
        );
    }

    const vaultAbortButton =
        $("vaultAbortButton");

    if (vaultAbortButton) {
        vaultAbortButton.addEventListener(
            "click",
            () => vaultAbort()
        );
    }

    const vaultOpeningAbort =
        $("vaultOpeningAbort");

    if (vaultOpeningAbort) {
        vaultOpeningAbort.addEventListener(
            "click",
            () => vaultAbort()
        );
    }

    const vaultCloseButton =
        $("vaultCloseButton");

    if (vaultCloseButton) {
        vaultCloseButton.addEventListener(
            "click",
            vaultClose
        );
    }

    const vaultCreateButton =
        $("vaultCreateButton");

    if (vaultCreateButton) {
        vaultCreateButton.addEventListener(
            "click",
            openVaultRecordCreator
        );
    }

    const saveVaultButton =
        $("saveVaultRecord");

    if (saveVaultButton) {
        saveVaultButton.addEventListener(
            "click",
            saveVaultRecord
        );
    }

    /* MODAL CLOSE BUTTONS */

    document.querySelectorAll("[data-close-modal]").forEach(
        button => {
            button.addEventListener(
                "click",
                () => {
                    closeModal(
                        button.dataset.closeModal
                    );
                }
            );
        }
    );
}

/* =========================================================
   GLOBAL ESCAPE
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key !== "Escape") {
            return;
        }

        document.querySelectorAll(".modal.active").forEach(
            modal => {
                modal.classList.remove("active");
            }
        );
    }
);

/* =========================================================
   INITIAL START
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeStorage();

        bindEvents();

        updateClock();

        renderAll();

        startBoot();
    }
);

/* =========================================================
   GLOBAL EXPORTS
   ========================================================= */

window.login = login;
window.logout = logout;

window.showPage = showPage;

window.openFile = openFile;
window.saveRecord = saveRecord;

window.saveDecision = saveDecision;

window.askKane = askKane;
window.renameKane = renameKane;
window.resetKane = resetKane;
window.resumeKane = resumeKane;

window.startScenario = startScenario;
window.decideScenario = decideScenario;

window.executeKillSwitch = executeKillSwitch;

window.openModal = openModal;
window.closeModal = closeModal;

window.requestVaultAccess = requestVaultAccess;
window.authorizeVaultMember = authorizeVaultMember;
window.vaultAbort = vaultAbort;
window.vaultClose = vaultClose;

window.openVaultRecordCreator =
    openVaultRecordCreator;

window.saveVaultRecord =
    saveVaultRecord;

window.openVaultFile =
    openVaultFile;

window.editVaultFile =
    editVaultFile;

window.toggleSecondaryCore =
    toggleSecondaryCore;
