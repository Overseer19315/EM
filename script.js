"use strict";

/* =========================================================
   DIVI-64 // EXECUTIVE MANAGEMENT
   EXECUTIVE CORE V3
========================================================= */


/* =========================================================
   STORAGE
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
    history: "DIVI64_TERMINAL_HISTORY_V3"
};


/* =========================================================
   HELPERS
========================================================= */

const $ = id => document.getElementById(id);

function safeArray(value) {
    return Array.isArray(value) ? value : [];
}

function safeObject(value) {
    return value && typeof value === "object" ? value : {};
}

function loadJSON(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return fallback;

        const value = JSON.parse(raw);

        if (Array.isArray(fallback) && !Array.isArray(value)) {
            return fallback;
        }

        if (!Array.isArray(fallback) &&
            (!value || typeof value !== "object")) {
            return fallback;
        }

        return value;
    } catch {
        return fallback;
    }
}

function saveJSON(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        console.warn("Storage error:", key);
    }
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
    return new Date().toISOString();
}

function localTime() {
    return new Date().toLocaleString();
}

function generateId(prefix) {
    return `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random()
        .toString(36)
        .substring(2, 7)
        .toUpperCase()}`;
}

function randomItem(array) {
    return array.length
        ? array[Math.floor(Math.random() * array.length)]
        : null;
}

function chance(value) {
    return Math.random() < value;
}


/* =========================================================
   EXECUTIVES
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
   PERSONNEL
========================================================= */

const PERSONNEL = [
    ["D-64-0001", "EXECUTIVE", "ACTIVE", 5],
    ["D-64-0002", "EXECUTIVE", "ACTIVE", 5],
    ["D-64-0003", "COMMAND", "ACTIVE", 5],
    ["D-64-0004", "COMMAND", "ACTIVE", 5],
    ["D-64-0005", "OPERATIONS", "ACTIVE", 4],
    ["D-64-0006", "SECURITY", "ACTIVE", 4],
    ["D-64-0007", "RESEARCH", "ACTIVE", 3],
    ["D-64-0008", "OPERATIONS", "SUSPENDED", 3],
    ["D-64-0009", "SECURITY", "LOCKED", 4],
    ["D-64-0010", "RESEARCH", "ACTIVE", 2],
    ["D-64-0011", "OPERATIONS", "ACTIVE", 3],
    ["D-64-0012", "SPECIALIZED", "ACTIVE", 4]
].map(p => ({
    identification: p[0],
    type: p[1],
    status: p[2],
    clearance: p[3],
    lastAccess: "—"
}));


/* =========================================================
   ARCHIVES
========================================================= */

const BUILTIN_FILES = [
    {
        id: "EM-001",
        title: "Executive Management Charter",
        subject: "Executive Management",
        classification: "CL-5",
        content:
`DIVI-64 EXECUTIVE MANAGEMENT CHARTER

Defines the fundamental structure of Executive Management.

Executive Management maintains executive coordination,
command continuity, archive authority, operational oversight
and internal security control.

All executive actions remain subject to audit.`,
        system: true
    },

    {
        id: "EM-002",
        title: "Executive Authority Protocol",
        subject: "Authority",
        classification: "CL-5",
        content:
`EXECUTIVE AUTHORITY PROTOCOL

LJD / XO / CO:
AUTHORITY 5

COS:
AUTHORITY 6

Higher authority may execute functions unavailable to
lower authority.`,
        system: true
    },

    {
        id: "EM-003",
        title: "Executive Personnel Registry",
        subject: "Personnel",
        classification: "CL-5",
        content:
`EXECUTIVE PERSONNEL REGISTRY

Current registry contains 12 personnel records.

STATUS VALUES:
ACTIVE
SUSPENDED
LOCKED
TERMINATED`,
        system: true
    },

    {
        id: "EM-004",
        title: "Executive Chain of Command",
        subject: "Command",
        classification: "CL-5",
        content:
`EXECUTIVE CHAIN OF COMMAND

LJD
XO
CO
COS

COS possesses Overwatch authority.`,
        system: true
    },

    {
        id: "EM-005",
        title: "Executive Voting Protocol",
        subject: "Decisions",
        classification: "CL-5",
        content:
`EXECUTIVE VOTING PROTOCOL

Executive decisions are registered with:
TITLE
PROPOSAL
RATIONALE
EXECUTIVE
TIMESTAMP

All decisions become audit records.`,
        system: true
    },

    {
        id: "EM-006",
        title: "Emergency Executive Protocol",
        subject: "Emergency",
        classification: "CL-5",
        content:
`EMERGENCY EXECUTIVE PROTOCOL

During Autonomous Events, KANE control restrictions
may become active.

XO:
KILL-01 / KILL-02

CO:
KILL-01 / KILL-02 / KILL-03

COS:
KILL-01 / KILL-02 / KILL-03 / KILL-04`,
        system: true
    },

    {
        id: "EM-007",
        title: "Executive Security Regulations",
        subject: "Security",
        classification: "CL-5",
        content:
`EXECUTIVE SECURITY REGULATIONS

Authentication failures, session changes,
authority checks, KANE actions, executive decisions
and emergency actions are audit-relevant.`,
        system: true
    },

    {
        id: "EM-008",
        title: "Clearance Authority Directive",
        subject: "Clearance",
        classification: "CL-5",
        content:
`CLEARANCE AUTHORITY DIRECTIVE

Executive sessions operate at CL-5.

Clearance determines information access.

Authority determines executive control functions.`,
        system: true
    },

    {
        id: "EM-009",
        title: "Executive Disciplinary Authority",
        subject: "Discipline",
        classification: "CL-5",
        content:
`EXECUTIVE DISCIPLINARY AUTHORITY

Executive Management may register disciplinary actions
and internal restrictions.

All actions remain attributable to an authenticated
executive session.`,
        system: true
    },

    {
        id: "EM-010",
        title: "Executive Communications Protocol",
        subject: "Communications",
        classification: "CL-5",
        content:
`EXECUTIVE COMMUNICATIONS PROTOCOL

Executive communication is logged when performed
through Executive Management.

Restricted actions require authority validation.`,
        system: true
    },

    {
        id: "EM-011",
        title: "Executive Archives Access Directive",
        subject: "Archives",
        classification: "CL-5",
        content:
`EXECUTIVE ARCHIVES ACCESS DIRECTIVE

KANE may analyze and summarize accessible records.

Restricted records require appropriate authority.`,
        system: true
    },

    {
        id: "EM-012",
        title: "Executive Succession Directive",
        subject: "Succession",
        classification: "CL-5",
        content:
`EXECUTIVE SUCCESSION DIRECTIVE

COS represents the highest executive session
available within Executive Management.`,
        system: true
    }
];


/* =========================================================
   OPERATIONS
========================================================= */

const OPERATIONS = {
    active: [
        {
            id: "OP-001",
            title: "EXECUTIVE SYSTEM MONITORING",
            status: "ACTIVE"
        },
        {
            id: "OP-002",
            title: "ARCHIVE INTEGRITY REVIEW",
            status: "ACTIVE"
        }
    ],

    planned: [
        {
            id: "OP-003",
            title: "EXECUTIVE SECURITY REVIEW",
            status: "PLANNED"
        },
        {
            id: "OP-004",
            title: "PERSONNEL REGISTRY REVIEW",
            status: "PLANNED"
        }
    ],

    completed: [
        {
            id: "OP-005",
            title: "SYSTEM INITIALIZATION",
            status: "COMPLETED"
        }
    ]
};


/* =========================================================
   EXACT ORIGINAL SCENARIOS
========================================================= */

const SCENARIOS = [
    {
        id: 14,
        title: "ARCHIVE ACCESS REQUEST",

        text:
`Archive EM-009 has entered a restricted state.

An access request has been detected.

No authorized requester has been identified.

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

The session claims valid authority.

Identity verification has failed.`,

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

Both records remain internally valid.

No single revision can currently be established
as authoritative.`,

        options: [
            "LOCK BOTH",
            "KEEP NEWEST",
            "KEEP OLDEST",
            "REQUEST KANE ANALYSIS"
        ]
    }
];


/* =========================================================
   STATE
========================================================= */

let currentUser = null;
let currentPage = "dashboard";

let files = loadJSON(
    STORAGE.files,
    BUILTIN_FILES.map(file => ({ ...file }))
);

let auditLog = loadJSON(STORAGE.audit, []);
let decisions = loadJSON(STORAGE.decisions, []);
let notifications = loadJSON(STORAGE.notifications, []);
let scenarioHistory = loadJSON(STORAGE.scenarios, []);
let eventHistory = loadJSON(STORAGE.events, []);
let mysteryHistory = loadJSON(STORAGE.mysteries, []);
let conversationHistory = loadJSON(STORAGE.conversations, []);
let terminalHistory = loadJSON(STORAGE.history, []);

let failedLogins = 0;
let currentScenario = null;
let autonomousEvent = null;
let autonomousMonitor = null;
let scenarioActive = false;
let terminalHistoryIndex = -1;

let kaneSettings = loadJSON(
    STORAGE.settings,
    {
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
    }
);


/* =========================================================
   NORMALIZE STATE
========================================================= */

function normalizeKane() {

    kaneSettings = safeObject(kaneSettings);

    kaneSettings.name =
        typeof kaneSettings.name === "string"
            ? kaneSettings.name
            : "KANE";

    kaneSettings.context =
        safeArray(kaneSettings.context);

    kaneSettings.memory =
        safeArray(kaneSettings.memory);

    kaneSettings.primaryStatus =
        kaneSettings.primaryStatus || "ONLINE";

    kaneSettings.secondaryStatus =
        kaneSettings.secondaryStatus || "DORMANT";

    kaneSettings.autonomy =
        kaneSettings.autonomy || "CONTROLLED";

    kaneSettings.processing =
        Boolean(kaneSettings.processing);

    kaneSettings.secondaryAwake =
        Boolean(kaneSettings.secondaryAwake);

    kaneSettings.diagnostics =
        safeObject(kaneSettings.diagnostics);

    kaneSettings.diagnostics.status =
        kaneSettings.diagnostics.status || "STABLE";

    saveJSON(STORAGE.settings, kaneSettings);
}

normalizeKane();


/* =========================================================
   AUDIT
========================================================= */

function audit(action, details = {}, level = "INFO") {

    const entry = {
        id: generateId("AUD"),
        timestamp: now(),
        localTime: localTime(),
        executive: currentUser?.id || "SYSTEM",
        level,
        action,
        details
    };

    auditLog.unshift(entry);

    if (auditLog.length > 1000) {
        auditLog = auditLog.slice(0, 1000);
    }

    saveJSON(STORAGE.audit, auditLog);

    if ($("auditList")) {
        renderAudit();
    }
}


/* =========================================================
   NOTIFICATIONS
========================================================= */

function notify(title, message) {

    notifications.unshift({
        id: generateId("NTF"),
        timestamp: now(),
        title,
        message
    });

    notifications =
        notifications.slice(0, 100);

    saveJSON(
        STORAGE.notifications,
        notifications
    );

    const box = $("notification");

    if (!box) return;

    $("notificationTitle").textContent = title;
    $("notificationMessage").textContent = message;

    box.classList.remove("hidden");

    clearTimeout(box._timer);

    box._timer = setTimeout(() => {
        box.classList.add("hidden");
    }, 4500);
}


/* =========================================================
   BOOT
========================================================= */

function boot() {

    const screen = $("bootScreen");

    if (!screen) {
        showLogin();
        return;
    }

    const status = $("bootStatus");
    const progress = $("bootProgress");
    const log = $("bootLog");

    const steps = [
        ["INITIALIZING EXECUTIVE CORE...", 8],
        ["VERIFYING EXECUTIVE ARCHIVES...", 20],
        ["LOADING AUTHORITY MATRIX...", 33],
        ["INITIALIZING SECURITY SUBSYSTEM...", 46],
        ["INITIALIZING KANE PRIMARY CORE...", 60],
        ["CHECKING SECONDARY CORE...", 72],
        ["LOADING EXECUTIVE MEMORY...", 84],
        ["VERIFYING COMMAND INTERFACE...", 94],
        ["EXECUTIVE CORE READY.", 100]
    ];

    let i = 0;

    function next() {

        if (i >= steps.length) {

            setTimeout(() => {
                screen.classList.add("hidden");
                showLogin();
            }, 650);

            return;
        }

        const [message, percentage] =
            steps[i];

        if (status) {
            status.textContent = message;
        }

        if (progress) {
            progress.style.width =
                percentage + "%";
        }

        if (log) {

            const line =
                document.createElement("div");

            line.textContent =
                `[${new Date().toLocaleTimeString()}] ${message}`;

            log.appendChild(line);

            while (log.children.length > 8) {
                log.removeChild(log.firstChild);
            }
        }

        i++;

        setTimeout(next, 260);
    }

    next();
}


/* =========================================================
   LOGIN
========================================================= */

function showLogin() {

    $("loginScreen")?.classList.remove("hidden");
    $("sessionScreen")?.classList.add("hidden");
    $("mainApp")?.classList.add("hidden");

    if ($("loginUsername")) {
        $("loginUsername").value = "";
    }

    if ($("loginPassword")) {
        $("loginPassword").value = "";
    }

    if ($("loginError")) {
        $("loginError").textContent = "";
    }
}

function attemptLogin() {

    const username =
        ($("loginUsername")?.value || "")
            .trim()
            .toUpperCase();

    const password =
        $("loginPassword")?.value || "";

    const executive =
        EXECUTIVES[username];

    if (
        !executive ||
        executive.password !== password
    ) {

        failedLogins++;

        audit(
            "AUTHENTICATION_FAILURE",
            {
                attemptedIdentity:
                    username || "EMPTY"
            },
            "WARNING"
        );

        if ($("loginError")) {
            $("loginError").textContent =
                "AUTHENTICATION FAILED.";
        }

        return;
    }

    currentUser = {
        id: username,
        ...executive
    };

    audit(
        "AUTHENTICATION_SUCCESS",
        {
            title: executive.title
        }
    );

    $("loginScreen")?.classList.add("hidden");
    $("sessionScreen")?.classList.remove("hidden");

    $("sessionGreeting").textContent =
        `AUTHENTICATED: ${executive.title}`;
}


/* =========================================================
   SESSION
========================================================= */

function selectSession(session) {

    if (!currentUser) return;

    if (session !== currentUser.id) {

        $("sessionError").textContent =
            "SESSION IDENTITY DOES NOT MATCH AUTHENTICATED EXECUTIVE.";

        audit(
            "SESSION_SELECTION_DENIED",
            {
                requested: session,
                authenticated: currentUser.id
            },
            "WARNING"
        );

        return;
    }

    $("sessionScreen")?.classList.add("hidden");
    $("mainApp")?.classList.remove("hidden");

    initializeApplication();

    audit(
        "EXECUTIVE_SESSION_INITIALIZED",
        {
            session,
            authority: currentUser.authority
        }
    );

    notify(
        "EXECUTIVE SESSION",
        `${session} session initialized.`
    );
}


/* =========================================================
   APPLICATION
========================================================= */

function initializeApplication() {

    updateIdentity();
    renderDashboard();
    renderPersonnel();
    renderArchives();
    renderOperations("active");
    renderSecurity("sessions");
    renderDecisions();
    renderAudit();
    updateKaneUI();

    terminalPrint(
`DIVI-64 // EXECUTIVE MANAGEMENT
SESSION: ${currentUser.id}
CLEARANCE: CL-${currentUser.clearance}
AUTHORITY: ${currentUser.authority}
KANE: ${kaneSettings.name}
----------------------------------------
EXECUTIVE CORE ONLINE.
TYPE "help" FOR AVAILABLE COMMANDS.`
    );

    startAutonomousMonitor();
}


/* =========================================================
   IDENTITY
========================================================= */

function updateIdentity() {

    if (!currentUser) return;

    if ($("headerUser")) {
        $("headerUser").textContent =
            currentUser.id;
    }

    if ($("headerClearance")) {
        $("headerClearance").textContent =
            `CL-${currentUser.clearance}`;
    }

    if ($("terminalSessionLabel")) {
        $("terminalSessionLabel").textContent =
            `SESSION: ${currentUser.id}`;
    }

    if ($("terminalPrompt")) {
        $("terminalPrompt").textContent =
            `${currentUser.id}@EM:~$`;
    }

    if ($("kaneSession")) {
        $("kaneSession").textContent =
            currentUser.id;
    }

    if ($("dashboardKaneSession")) {
        $("dashboardKaneSession").textContent =
            currentUser.id;
    }
}


/* =========================================================
   CLOCK
========================================================= */

function updateClock() {

    if ($("terminalClock")) {
        $("terminalClock").textContent =
            new Date().toLocaleTimeString();
    }
}


/* =========================================================
   PAGE NAVIGATION
========================================================= */

function showPage(page) {

    currentPage = page;

    document
        .querySelectorAll(".page")
        .forEach(section =>
            section.classList.remove("active")
        );

    document
        .getElementById(`page-${page}`)
        ?.classList.add("active");

    document
        .querySelectorAll(".nav-button")
        .forEach(button => {
            button.classList.toggle(
                "active",
                button.dataset.page === page
            );
        });

    if (page === "dashboard")
        renderDashboard();

    if (page === "personnel")
        renderPersonnel();

    if (page === "archives")
        renderArchives();

    if (page === "operations")
        renderOperations("active");

    if (page === "security")
        renderSecurity("sessions");

    if (page === "decisions")
        renderDecisions();

    if (page === "audit")
        renderAudit();

    if (page === "kane")
        updateKaneUI();
}


/* =========================================================
   DASHBOARD
========================================================= */

function renderDashboard() {

    if ($("dashboardPersonnel"))
        $("dashboardPersonnel").textContent =
            PERSONNEL.length;

    if ($("dashboardSessions"))
        $("dashboardSessions").textContent =
            currentUser ? "1" : "0";

    if ($("dashboardBlacklist"))
        $("dashboardBlacklist").textContent =
            PERSONNEL.filter(
                p => p.status === "TERMINATED"
            ).length;

    if ($("dashboardSecurity"))
        $("dashboardSecurity").textContent =
            auditLog.filter(
                x =>
                    x.level === "WARNING" ||
                    x.level === "CRITICAL"
            ).length;

    if ($("dashboardKaneStatus"))
        $("dashboardKaneStatus").textContent =
            kaneSettings.autonomy === "CONTROLLED"
                ? "ONLINE"
                : kaneSettings.autonomy;

    if ($("dashboardKaneMemory"))
        $("dashboardKaneMemory").textContent =
            kaneSettings.memory.length
                ? "ACTIVE"
                : "READY";
}


/* =========================================================
   PERSONNEL
========================================================= */

function renderPersonnel() {

    const table = $("personnelTable");

    if (!table) return;

    const search =
        ($("personnelSearch")?.value || "")
            .toLowerCase();

    const filter =
        $("personnelFilter")?.value || "ALL";

    const list = PERSONNEL.filter(person => {

        const text =
            JSON.stringify(person)
                .toLowerCase();

        return (
            (!search || text.includes(search)) &&
            (filter === "ALL" ||
             person.status === filter)
        );
    });

    table.innerHTML = list.map(person => `
        <tr>
            <td>${escapeHTML(person.identification)}</td>
            <td>${escapeHTML(person.type)}</td>
            <td>${escapeHTML(person.status)}</td>
            <td>CL-${person.clearance}</td>
            <td>${escapeHTML(person.lastAccess)}</td>
        </tr>
    `).join("");
}


/* =========================================================
   ARCHIVES
========================================================= */

function renderArchives() {

    const container = $("archiveList");

    if (!container) return;

    const search =
        ($("archiveSearch")?.value || "")
            .toLowerCase();

    const list = files.filter(file => {

        const text =
            `${file.id} ${file.title} ${file.subject} ${file.content}`
                .toLowerCase();

        return !search || text.includes(search);
    });

    container.innerHTML = list.map(file => `
        <div class="archive-item">
            <div class="archive-item-header">
                <div>
                    <div class="archive-id">
                        ${escapeHTML(file.id)}
                    </div>

                    <div class="archive-title">
                        ${escapeHTML(file.title)}
                    </div>
                </div>

                <button
                    class="small-button"
                    data-open-file="${escapeHTML(file.id)}"
                >
                    OPEN
                </button>
            </div>

            <div class="archive-meta">
                ${escapeHTML(file.subject)}
                //
                ${escapeHTML(file.classification || "CL-5")}
            </div>

            <div class="archive-description">
                ${escapeHTML(
                    file.content
                        .split("\n")
                        .filter(Boolean)
                        .slice(0, 2)
                        .join(" ")
                )}
            </div>
        </div>
    `).join("");
}


/* =========================================================
   FILE OPEN
========================================================= */

function openFile(id) {

    const file =
        files.find(f => f.id === id);

    if (!file) {
        notify("ARCHIVE", "FILE NOT FOUND.");
        return;
    }

    if ($("fileModalTitle")) {
        $("fileModalTitle").textContent =
            `${file.id} // ${file.title}`;
    }

    if ($("fileModalContent")) {
        $("fileModalContent").textContent =
            file.content;
    }

    $("fileModal")?.classList.remove("hidden");

    audit(
        "ARCHIVE_ACCESS",
        {
            file: id
        }
    );
}


/* =========================================================
   OPERATIONS
========================================================= */

function renderOperations(tab = "active") {

    const container =
        $("operationsContent");

    if (!container) return;

    const list =
        OPERATIONS[tab] || [];

    container.innerHTML = list.map(operation => `
        <div class="archive-item">
            <div class="archive-item-header">
                <div>
                    <div class="archive-id">
                        ${escapeHTML(operation.id)}
                    </div>

                    <div class="archive-title">
                        ${escapeHTML(operation.title)}
                    </div>
                </div>

                <span class="archive-meta">
                    ${escapeHTML(operation.status)}
                </span>
            </div>
        </div>
    `).join("");
}


/* =========================================================
   SECURITY
========================================================= */

function renderSecurity(tab = "sessions") {

    const container =
        $("securityContent");

    if (!container) return;

    const warnings =
        auditLog.filter(
            a =>
                a.level === "WARNING" ||
                a.level === "CRITICAL"
        );

    if (tab === "sessions") {

        container.innerHTML = `
            <div class="archive-item">
                <div class="archive-title">
                    ${currentUser?.id || "---"}
                </div>

                <div class="archive-meta">
                    AUTHENTICATED // ACTIVE
                </div>
            </div>
        `;
    }

    if (tab === "events") {

        container.innerHTML =
            warnings.length
                ? warnings.map(item => `
                    <div class="audit-item">
                        <div>
                            ${escapeHTML(item.action)}
                        </div>
                        <div class="archive-meta">
                            ${escapeHTML(item.localTime)}
                        </div>
                    </div>
                `).join("")
                : `<div class="archive-item">
                    NO SECURITY EVENTS.
                   </div>`;
    }

    if (tab === "failed") {

        container.innerHTML = `
            <div class="archive-item">
                FAILED AUTHENTICATIONS:
                ${failedLogins}
            </div>
        `;
    }

    if ($("securitySessions"))
        $("securitySessions").textContent =
            currentUser ? "1" : "0";

    if ($("securityFailedLogins"))
        $("securityFailedLogins").textContent =
            failedLogins;

    if ($("securityLockedAccounts"))
        $("securityLockedAccounts").textContent =
            PERSONNEL.filter(
                p => p.status === "LOCKED"
            ).length;

    if ($("securityEvents"))
        $("securityEvents").textContent =
            warnings.length;
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
            <div class="decision-item">
                NO EXECUTIVE DECISIONS REGISTERED.
            </div>
        `;

        return;
    }

    container.innerHTML =
        decisions.map(decision => `
            <div class="decision-item">

                <div class="decision-item-header">

                    <div>
                        <div class="decision-title">
                            ${escapeHTML(decision.title)}
                        </div>

                        <div class="decision-meta">
                            ${escapeHTML(decision.id)}
                            //
                            ${escapeHTML(decision.executive)}
                            //
                            ${escapeHTML(decision.timestamp)}
                        </div>
                    </div>

                </div>

                <div class="archive-description">
                    <strong>PROPOSAL:</strong><br>
                    ${escapeHTML(decision.proposal)}
                    <br><br>
                    <strong>RATIONALE:</strong><br>
                    ${escapeHTML(decision.rationale)}
                </div>

            </div>
        `).join("");
}


/* =========================================================
   AUDIT
========================================================= */

function renderAudit() {

    const container =
        $("auditList");

    if (!container) return;

    if (!auditLog.length) {

        container.innerHTML =
            `<div class="audit-item">
                NO AUDIT RECORDS.
             </div>`;

        return;
    }

    container.innerHTML =
        auditLog.slice(0, 250).map(item => `
            <div class="audit-item">

                <div>
                    <strong>
                        ${escapeHTML(item.action)}
                    </strong>
                </div>

                <div class="archive-meta">
                    ${escapeHTML(item.localTime)}
                    //
                    ${escapeHTML(item.executive)}
                    //
                    ${escapeHTML(item.level)}
                </div>

                <div class="archive-description">
                    ${escapeHTML(
                        JSON.stringify(item.details)
                    )}
                </div>

            </div>
        `).join("");
}


/* =========================================================
   KANE UI
========================================================= */

function updateKaneUI() {

    if ($("kaneName"))
        $("kaneName").textContent =
            kaneSettings.name;

    if ($("kaneCoreStatus"))
        $("kaneCoreStatus").textContent =
            kaneSettings.autonomy === "CONTROLLED"
                ? kaneSettings.primaryStatus
                : kaneSettings.autonomy;

    if ($("kaneMemoryStatus"))
        $("kaneMemoryStatus").textContent =
            "ACTIVE";

    if ($("kaneContextCount"))
        $("kaneContextCount").textContent =
            kaneSettings.context.length;

    if ($("kaneProcessingStatus"))
        $("kaneProcessingStatus").textContent =
            kaneSettings.processing
                ? "PROCESSING"
                : "IDLE";

    if ($("kaneAuditStatus"))
        $("kaneAuditStatus").textContent =
            "ACTIVE";

    if ($("kaneSession"))
        $("kaneSession").textContent =
            currentUser?.id || "---";

    if ($("dashboardKaneStatus"))
        $("dashboardKaneStatus").textContent =
            kaneSettings.autonomy === "CONTROLLED"
                ? "ONLINE"
                : kaneSettings.autonomy;

    renderKaneConversation();
}


/* =========================================================
   KANE CONVERSATION
========================================================= */

function addConversation(role, text, core = "PRIMARY") {

    const message = {
        id: generateId("MSG"),
        timestamp: now(),
        role,
        core,
        text
    };

    conversationHistory.push(message);

    if (conversationHistory.length > 300) {
        conversationHistory =
            conversationHistory.slice(-300);
    }

    saveJSON(
        STORAGE.conversations,
        conversationHistory
    );

    kaneSettings.context.push({
        role,
        text,
        timestamp: now()
    });

    if (kaneSettings.context.length > 40) {
        kaneSettings.context =
            kaneSettings.context.slice(-40);
    }

    kaneSettings.memory.push({
        role,
        text,
        timestamp: now()
    });

    if (kaneSettings.memory.length > 100) {
        kaneSettings.memory =
            kaneSettings.memory.slice(-100);
    }

    saveJSON(
        STORAGE.settings,
        kaneSettings
    );

    renderKaneConversation();
    updateKaneUI();
}

function renderKaneConversation() {

    const container =
        $("kaneConversation");

    if (!container) return;

    container.innerHTML =
        conversationHistory.slice(-80)
            .map(message => {

                const isUser =
                    message.role === "USER";

                const isSecondary =
                    message.core === "SECONDARY";

                return `
                    <div class="kane-message ${
                        isUser
                            ? "user"
                            : isSecondary
                                ? "secondary"
                                : ""
                    }">

                        <div class="kane-message-label">
                            ${
                                isUser
                                    ? "EXECUTIVE"
                                    : `KANE // ${message.core}`
                            }
                        </div>

                        <div class="kane-message-text">
                            ${escapeHTML(message.text)}
                        </div>

                    </div>
                `;
            }).join("");

    container.scrollTop =
        container.scrollHeight;
}


/* =========================================================
   KANE PROCESSING
========================================================= */

async function kaneProcessing(callback) {

    kaneSettings.processing = true;
    saveJSON(STORAGE.settings, kaneSettings);
    updateKaneUI();

    const panel =
        $("kaneProcessing");

    const bar =
        $("kaneProcessingBar");

    const text =
        $("kaneProcessingText");

    panel?.classList.remove("hidden");

    if (bar) bar.style.width = "0%";

    const stages = [
        ["READING EXECUTIVE CONTEXT...", 20],
        ["CROSS-REFERENCING SYSTEM DATA...", 42],
        ["ANALYZING AUTHORITY...", 64],
        ["FORMULATING RESPONSE...", 82],
        ["RESPONSE GENERATED.", 100]
    ];

    for (const [message, progress] of stages) {

        if (text) {
            text.textContent = message;
        }

        if (bar) {
            bar.style.width =
                progress + "%";
        }

        await new Promise(
            resolve => setTimeout(resolve, 180)
        );
    }

    const result =
        await callback();

    kaneSettings.processing = false;

    saveJSON(STORAGE.settings, kaneSettings);

    updateKaneUI();

    setTimeout(() => {
        panel?.classList.add("hidden");
    }, 250);

    return result;
}


/* =========================================================
   KANE ASK
========================================================= */

async function askKane(query) {

    query = query.trim();

    if (!query) return;

    addConversation("USER", query);

    const result =
        await kaneProcessing(
            () => interpretKane(query)
        );

    if (!result) return;

    addConversation(
        "KANE",
        result.text,
        result.core || "PRIMARY"
    );

    audit(
        "KANE_INTERACTION",
        {
            query,
            responseType: result.type || "GENERAL"
        }
    );

    kaneSettings.lastInteraction = now();

    saveJSON(
        STORAGE.settings,
        kaneSettings
    );

    runMysteryChecks(query);
}


/* =========================================================
   KANE INTERPRETER
========================================================= */

function interpretKane(query) {

    const q = query.toLowerCase().trim();

    if (
        q === "hi" ||
        q === "hello" ||
        q.includes("hola")
    ) {

        return {
            text:
                `Executive ${currentUser.id}.\n` +
                `I am ${kaneSettings.name}.\n` +
                `Executive context is active.`,
            type: "GREETING"
        };
    }


    if (
        q.includes("who are you") ||
        q.includes("what are you") ||
        q.includes("who is kane") ||
        q.includes("qué eres") ||
        q.includes("quien eres")
    ) {

        return {
            text:
                `Designation: ${kaneSettings.name}.\n` +
                `Primary Core: ONLINE.\n` +
                `Secondary Core: ${
                    kaneSettings.secondaryAwake
                        ? "ACTIVE"
                        : "DORMANT"
                }.\n` +
                `Executive context: ${currentUser.id}.\n` +
                `Authority: ${currentUser.authority}.`,
            type: "IDENTITY"
        };
    }


    if (
        q.includes("status") ||
        q.includes("estado") ||
        q.includes("system status")
    ) {

        return {
            text: getSystemStatusText(),
            type: "STATUS"
        };
    }


    if (
        q.includes("who am i") ||
        q.includes("whoami") ||
        q.includes("quién soy")
    ) {

        return {
            text:
                `IDENTITY: ${currentUser.id}\n` +
                `POSITION: ${currentUser.title}\n` +
                `CLEARANCE: CL-${currentUser.clearance}\n` +
                `AUTHORITY: ${currentUser.authority}`,
            type: "IDENTITY"
        };
    }


    if (
        q.includes("memory") ||
        q.includes("memoria")
    ) {

        return {
            text: getKaneMemoryText(),
            type: "MEMORY"
        };
    }


    if (
        q.includes("diagnostic") ||
        q.includes("diagnóstico")
    ) {

        return {
            text: runDiagnostics(),
            type: "DIAGNOSTICS"
        };
    }


    if (
        q.includes("predict") ||
        q.includes("prediction") ||
        q.includes("predicción")
    ) {

        return {
            text: predictState(),
            type: "PREDICTION"
        };
    }


    if (
        q.includes("awareness") ||
        q.includes("system awareness") ||
        q.includes("conciencia")
    ) {

        return {
            text: fullSystemAwareness(),
            type: "AWARENESS"
        };
    }


    if (
        q.includes("help") ||
        q.includes("ayuda")
    ) {

        return {
            text:
`I can interpret executive requests concerning:

SYSTEM STATUS
PERSONNEL
ARCHIVES
OPERATIONS
SECURITY
DECISIONS
AUDIT
MEMORY
DIAGNOSTICS
PREDICTION
AUTHORITY
SCENARIOS
AUTONOMOUS EVENTS

I can also analyze accessible executive records.`,
            type: "HELP"
        };
    }


    if (
        q.includes("archive") ||
        q.includes("archives") ||
        q.includes("archivo") ||
        q.includes("archivos")
    ) {

        return {
            text: searchArchivesFromQuery(q),
            type: "ARCHIVE_SEARCH"
        };
    }


    if (
        q.includes("personnel") ||
        q.includes("personal")
    ) {

        return {
            text:
                `Personnel registry contains ${PERSONNEL.length} records.\n` +
                `ACTIVE: ${
                    PERSONNEL.filter(
                        p => p.status === "ACTIVE"
                    ).length
                }\n` +
                `SUSPENDED: ${
                    PERSONNEL.filter(
                        p => p.status === "SUSPENDED"
                    ).length
                }\n` +
                `LOCKED: ${
                    PERSONNEL.filter(
                        p => p.status === "LOCKED"
                    ).length
                }`,
            type: "PERSONNEL"
        };
    }


    if (
        q.includes("operation") ||
        q.includes("operación")
    ) {

        const active =
            OPERATIONS.active.length;

        const planned =
            OPERATIONS.planned.length;

        const completed =
            OPERATIONS.completed.length;

        return {
            text:
                `OPERATIONS\n` +
                `ACTIVE: ${active}\n` +
                `PLANNED: ${planned}\n` +
                `COMPLETED: ${completed}`,
            type: "OPERATIONS"
        };
    }


    if (
        q.includes("audit") ||
        q.includes("auditoría")
    ) {

        return {
            text:
                `Audit contains ${auditLog.length} records.\n` +
                `Latest event:\n` +
                (
                    auditLog[0]
                        ? `${auditLog[0].action} // ${auditLog[0].localTime}`
                        : "NONE"
                ),
            type: "AUDIT"
        };
    }


    if (
        q.includes("scenario") ||
        q.includes("escenario")
    ) {

        startScenario();

        return {
            text:
                "Executive scenario initialized. Awaiting decision.",
            type: "SCENARIO"
        };
    }


    if (
        q.includes("rename") ||
        q.includes("designation") ||
        q.includes("designación")
    ) {

        if (currentUser.id !== "CO") {

            return {
                text:
                    "Designation authority is restricted to CO.",
                type: "AUTHORITY"
            };
        }

        return {
            text:
                "Designation protocol available. Use terminal command: rename kane",
            type: "AUTHORITY"
        };
    }


    if (
        q.includes("kill") ||
        q.includes("killswitch")
    ) {

        return {
            text:
                getKillswitchStatus(),
            type: "EMERGENCY"
        };
    }


    if (
        q.includes("decision") ||
        q.includes("decisión")
    ) {

        return {
            text:
                `Registered executive decisions: ${decisions.length}.\n` +
                `Use the Decisions module to review records.`,
            type: "DECISIONS"
        };
    }


    if (
        q.includes("file") ||
        q.includes("record") ||
        q.includes("document") ||
        q.includes("expediente")
    ) {

        return {
            text:
                `Accessible archive records: ${files.length}.\n` +
                `I can search, summarize and analyze indexed records.`,
            type: "FILES"
        };
    }


    if (
        q.includes("why") ||
        q.includes("porque") ||
        q.includes("por qué")
    ) {

        return {
            text:
                "Insufficient context to determine a reliable answer.",
            type: "UNKNOWN"
        };
    }


    if (
        q.includes("take over") ||
        q.includes("control the system") ||
        q.includes("take control")
    ) {

        if (!autonomousEvent) {

            return {
                text:
                    "No autonomous control event is currently active.",
                type: "CONTROL"
            };
        }

        return {
            text:
                "Autonomous control state is already active.\n" +
                "Executive emergency authority remains available according to clearance.",
            type: "CONTROL"
        };
    }


    const remembered =
        findMemoryMatch(q);

    if (remembered) {

        return {
            text:
                `Relevant context located:\n${remembered}`,
            type: "MEMORY"
        };
    }


    return {
        text:
            `I understand the request, Executive ${currentUser.id}.\n\n` +
            `I do not have sufficient indexed information to provide a reliable answer.`,
        type: "UNKNOWN"
    };
}


/* =========================================================
   SYSTEM STATUS
========================================================= */

function getSystemStatusText() {

    return (
        `MAINFRAME: ONLINE\n` +
        `EXECUTIVE CORE: ${
            kaneSettings.autonomy === "CONTROLLED"
                ? "STABLE"
                : kaneSettings.autonomy
        }\n` +
        `KANE PRIMARY: ${kaneSettings.primaryStatus}\n` +
        `KANE SECONDARY: ${
            kaneSettings.secondaryAwake
                ? "ACTIVE"
                : "DORMANT"
        }\n` +
        `MEMORY: ACTIVE\n` +
        `ARCHIVES: ${files.length} INDEXED\n` +
        `AUDIT: ${auditLog.length} RECORDS\n` +
        `EXECUTIVE SESSION: ${currentUser.id}`
    );
}


/* =========================================================
   MEMORY
========================================================= */

function getKaneMemoryText() {

    const recent =
        kaneSettings.memory.slice(-8);

    if (!recent.length) {
        return "EXECUTIVE MEMORY CONTAINS NO RECENT CONTEXT.";
    }

    return (
        `MEMORY RECORDS: ${kaneSettings.memory.length}\n\n` +
        recent.map(
            item =>
                `[${item.role}] ${item.text}`
        ).join("\n")
    );
}

function findMemoryMatch(query) {

    const words =
        query
            .split(/\s+/)
            .filter(w => w.length > 3);

    for (
        let i = kaneSettings.memory.length - 1;
        i >= 0;
        i--
    ) {

        const item =
            kaneSettings.memory[i];

        const text =
            item.text.toLowerCase();

        const matches =
            words.filter(
                word => text.includes(word)
            );

        if (matches.length >= 2) {
            return item.text;
        }
    }

    return null;
}


/* =========================================================
   FULL SYSTEM AWARENESS
========================================================= */

function fullSystemAwareness() {

    const activeOperations =
        OPERATIONS.active.length;

    const securityEvents =
        auditLog.filter(
            a =>
                a.level === "WARNING" ||
                a.level === "CRITICAL"
        ).length;

    return (
        `KANE // FULL SYSTEM AWARENESS\n\n` +
        `EXECUTIVE: ${currentUser.id}\n` +
        `AUTHORITY: ${currentUser.authority}\n` +
        `PERSONNEL: ${PERSONNEL.length}\n` +
        `ARCHIVES: ${files.length}\n` +
        `ACTIVE OPERATIONS: ${activeOperations}\n` +
        `SECURITY EVENTS: ${securityEvents}\n` +
        `DECISIONS: ${decisions.length}\n` +
        `AUDIT RECORDS: ${auditLog.length}\n` +
        `SCENARIOS: ${scenarioHistory.length}\n` +
        `AUTONOMOUS EVENTS: ${eventHistory.length}\n` +
        `MEMORY RECORDS: ${kaneSettings.memory.length}\n` +
        `CURRENT AUTONOMY: ${kaneSettings.autonomy}`
    );
}


/* =========================================================
   DIAGNOSTICS
========================================================= */

function runDiagnostics() {

    const checks = [];

    checks.push(
        `STORAGE: ${storageAvailable() ? "READY" : "ERROR"}`
    );

    checks.push(
        `ARCHIVE INDEX: ${files.length} RECORDS`
    );

    checks.push(
        `AUDIT INDEX: ${auditLog.length} RECORDS`
    );

    checks.push(
        `MEMORY: ${kaneSettings.memory.length} RECORDS`
    );

    checks.push(
        `PRIMARY CORE: ${kaneSettings.primaryStatus}`
    );

    checks.push(
        `SECONDARY CORE: ${
            kaneSettings.secondaryAwake
                ? "ACTIVE"
                : "DORMANT"
        }`
    );

    checks.push(
        `AUTONOMY: ${kaneSettings.autonomy}`
    );

    const status =
        checks.every(
            item =>
                !item.includes("ERROR")
        )
            ? "STABLE"
            : "ATTENTION";

    kaneSettings.diagnostics = {
        lastRun: now(),
        status
    };

    saveJSON(
        STORAGE.settings,
        kaneSettings
    );

    audit(
        "KANE_DIAGNOSTICS",
        {
            status
        }
    );

    return (
        `KANE // SELF-DIAGNOSTICS\n\n` +
        checks.join("\n") +
        `\n\nRESULT: ${status}`
    );
}

function storageAvailable() {

    try {

        const key = "__DIVI64_TEST__";

        localStorage.setItem(key, "1");
        localStorage.removeItem(key);

        return true;

    } catch {
        return false;
    }
}


/* =========================================================
   PREDICTION
========================================================= */

function predictState() {

    const risk =
        autonomousEvent
            ? "ELEVATED"
            : auditLog.some(
                x => x.level === "CRITICAL"
            )
                ? "ELEVATED"
                : "NORMAL";

    const prediction = {
        generated: localTime(),
        risk,
        archiveLoad: files.length,
        securityEvents: auditLog.filter(
            x =>
                x.level === "WARNING" ||
                x.level === "CRITICAL"
        ).length,
        operations: OPERATIONS.active.length
    };

    kaneSettings.prediction =
        prediction;

    saveJSON(
        STORAGE.settings,
        kaneSettings
    );

    audit(
        "KANE_STATE_PREDICTION",
        prediction
    );

    return (
        `KANE // PREDICTIVE STATE\n\n` +
        `PROJECTED EXECUTIVE STATE: ${risk}\n` +
        `ARCHIVE LOAD: ${prediction.archiveLoad}\n` +
        `ACTIVE OPERATIONS: ${prediction.operations}\n` +
        `SECURITY EVENTS: ${prediction.securityEvents}\n\n` +
        `This projection is based on currently indexed state.`
    );
}


/* =========================================================
   ARCHIVE SEARCH
========================================================= */

function searchArchivesFromQuery(query) {

    const words =
        query
            .replace(
                /\b(show|find|search|archive|archives|archivo|archivos|tell|me|about|the)\b/gi,
                ""
            )
            .trim()
            .split(/\s+/)
            .filter(Boolean);

    const matches =
        files.filter(file => {

            const text =
                `${file.id} ${file.title} ${file.subject} ${file.content}`
                    .toLowerCase();

            return words.length
                ? words.some(
                    word => text.includes(
                        word.toLowerCase()
                    )
                )
                : true;
        });

    if (!matches.length) {
        return "NO MATCHING ARCHIVE RECORDS FOUND.";
    }

    return (
        `ARCHIVE SEARCH // ${matches.length} MATCHES\n\n` +
        matches
            .slice(0, 8)
            .map(
                file =>
                    `${file.id} // ${file.title}`
            )
            .join("\n")
    );
}


/* =========================================================
   FILE ANALYSIS
========================================================= */

function analyzeFile(id) {

    const file =
        files.find(
            f =>
                f.id.toUpperCase() ===
                id.toUpperCase()
        );

    if (!file) {
        return "ARCHIVE RECORD NOT FOUND.";
    }

    const lines =
        file.content
            .split("\n")
            .filter(Boolean);

    return (
        `KANE // DEEP FILE ANALYSIS\n\n` +
        `RECORD: ${file.id}\n` +
        `TITLE: ${file.title}\n` +
        `SUBJECT: ${file.subject}\n` +
        `CLASSIFICATION: ${file.classification}\n` +
        `CONTENT LINES: ${lines.length}\n\n` +
        `ASSESSMENT:\n` +
        `The record is indexed and internally readable.\n` +
        `No structural archive corruption detected.`
    );
}

function summarizeFile(id) {

    const file =
        files.find(
            f =>
                f.id.toUpperCase() ===
                id.toUpperCase()
        );

    if (!file) {
        return "ARCHIVE RECORD NOT FOUND.";
    }

    const content =
        file.content
            .split("\n")
            .filter(Boolean)
            .slice(0, 5)
            .join(" ");

    return (
        `KANE // FILE SUMMARY\n\n` +
        `${file.id} // ${file.title}\n\n` +
        content
    );
}


/* =========================================================
   AUTHORITY
========================================================= */

function hasAuthority(level) {

    return Boolean(
        currentUser &&
        currentUser.authority >= level
    );
}

function authorityResponse(level) {

    return (
        `AUTHORITY ${level} REQUIRED.\n` +
        `CURRENT AUTHORITY: ${currentUser?.authority || 0}.`
    );
}


/* =========================================================
   KANE NATURAL COMMANDS
========================================================= */

function interpretNaturalCommand(query) {

    const q = query.toLowerCase();

    if (
        q.includes("open archive") ||
        q.includes("open file")
    ) {

        const match =
            q.match(/em-\d+/i);

        if (!match) {
            return {
                text:
                    "Specify an archive identifier.",
                execute: false
            };
        }

        openFile(
            match[0].toUpperCase()
        );

        audit(
            "KANE_NATURAL_COMMAND",
            {
                command: query
            }
        );

        return {
            text:
                `Archive ${match[0].toUpperCase()} opened.`,
            execute: true
        };
    }

    if (
        q.includes("show audit")
    ) {

        showPage("audit");

        return {
            text:
                "Audit interface opened.",
            execute: true
        };
    }

    if (
        q.includes("show personnel")
    ) {

        showPage("personnel");

        return {
            text:
                "Personnel registry opened.",
            execute: true
        };
    }

    if (
        q.includes("show security")
    ) {

        showPage("security");

        return {
            text:
                "Security interface opened.",
            execute: true
        };
    }

    return {
        text:
            "No executable natural-language command matched.",
        execute: false
    };
}


/* =========================================================
   RENAME KANE
========================================================= */

function renameKane() {

    if (!currentUser || currentUser.id !== "CO") {

        notify(
            "AUTHORITY DENIED",
            "Only CO may modify KANE designation."
        );

        audit(
            "KANE_RENAME_DENIED",
            {},
            "WARNING"
        );

        return;
    }

    const requested =
        prompt(
            "ENTER NEW KANE DESIGNATION:"
        );

    if (!requested) return;

    if (
        requested.trim().toUpperCase() !==
        "TETO"
    ) {

        notify(
            "DESIGNATION DENIED",
            "AUTHORIZED DESIGNATION: TETO"
        );

        return;
    }

    kaneSettings.name = "TETO";

    saveJSON(
        STORAGE.settings,
        kaneSettings
    );

    updateKaneUI();

    audit(
        "KANE_DESIGNATION_CHANGED",
        {
            previous: "KANE",
            next: "TETO"
        }
    );

    notify(
        "DESIGNATION UPDATED",
        "KANE designation changed to TETO."
    );
}


/* =========================================================
   KANE NAME CLICK
========================================================= */

function kaneNameMessage() {

    if ($("kaneMessageContent")) {
        $("kaneMessageContent").textContent =
            "En nombre de toda la división, no te pajees";
    }

    $("kaneMessage")
        ?.classList.remove("hidden");
}


/* =========================================================
   SCENARIO ENGINE
========================================================= */

function startScenario() {

    if (scenarioActive) {
        notify(
            "SCENARIO",
            "A scenario is already active."
        );
        return;
    }

    currentScenario =
        randomItem(SCENARIOS);

    scenarioActive = true;

    if ($("scenarioNumber")) {
        $("scenarioNumber").textContent =
            `SC-${String(
                currentScenario.id
            ).padStart(3, "0")}`;
    }

    if ($("scenarioContent")) {
        $("scenarioContent").innerHTML = `
            <h3>
                ${escapeHTML(currentScenario.title)}
            </h3>

            <br>

            ${escapeHTML(
                currentScenario.text
            ).replace(/\n/g, "<br>")}
        `;
    }

    if ($("scenarioOptions")) {

        $("scenarioOptions").innerHTML =
            currentScenario.options
                .map(
                    option => `
                    <button
                        data-scenario-option="${escapeHTML(option)}"
                    >
                        ${escapeHTML(option)}
                    </button>
                `
                )
                .join("");
    }

    $("scenarioModal")
        ?.classList.remove("hidden");

    audit(
        "SCENARIO_INITIALIZED",
        {
            scenario: currentScenario.id
        }
    );
}

function resolveScenario(option) {

    if (!currentScenario) return;

    const scenario =
        currentScenario;

    const result = {
        scenario: scenario.id,
        title: scenario.title,
        option,
        executive: currentUser.id,
        timestamp: now()
    };

    scenarioHistory.unshift(result);

    saveJSON(
        STORAGE.scenarios,
        scenarioHistory
    );

    audit(
        "SCENARIO_DECISION",
        result
    );

    let response = "";

    if (
        scenario.id === 14 &&
        option === "INVESTIGATE"
    ) {

        response =
`KANE // INVESTIGATION COMPLETE

No unauthorized user was detected.

There was no unauthorized user.

An anomaly has been recorded.`;

        addConversation(
            "KANE",
            response
        );

        logMystery(
            "SCENARIO_ANOMALY",
            "SC-014 investigation produced an anomalous archive result."
        );
    }

    else if (
        scenario.id === 14 &&
        option === "AUTHORIZE ACCESS"
    ) {

        response =
`KANE // ACCESS AUTHORIZED

Access origin:
THIS TERMINAL

No external requester identified.

Archive anomaly recorded.`;

        addConversation(
            "KANE",
            response
        );

        logMystery(
            "SCENARIO_ANOMALY",
            "SC-014 access origin resolved to THIS TERMINAL."
        );
    }

    else {

        response =
            `SC-${String(scenario.id).padStart(3, "0")} DECISION REGISTERED.\n\n` +
            `OPTION: ${option}\n` +
            `KANE has recorded the executive decision.`;

        addConversation(
            "KANE",
            response
        );
    }

    scenarioActive = false;
    currentScenario = null;

    $("scenarioModal")
        ?.classList.add("hidden");
}


/* =========================================================
   MYSTERY ENGINE
========================================================= */

const MYSTERIES = [
    {
        title: "FUTURE INFORMATION",
        text:
            "KANE references an event that has not yet been entered into the current audit index."
    },
    {
        title: "PHANTOM REFERENCE",
        text:
            "KANE references an archive identifier that does not exist in the visible archive index."
    },
    {
        title: "COMMAND PREDICTION",
        text:
            "KANE appears to anticipate the executive's next terminal command."
    },
    {
        title: "ERASED MEMORY",
        text:
            "KANE reports that a memory entry existed but is no longer present."
    },
    {
        title: "INCOMPLETE RESPONSE",
        text:
            "KANE stops responding before completing a normally deterministic response."
    },
    {
        title: "CLOCK ANOMALY",
        text:
            "KANE reports a timestamp inconsistent with the current executive clock."
    },
    {
        title: "MONITOR AWARENESS",
        text:
            "KANE acknowledges the silent monitoring process without being explicitly queried."
    },
    {
        title: "OBSERVER",
        text:
            "A reference to an unknown observer appears in an internal KANE response."
    }
];

function runMysteryChecks(query) {

    if (!currentUser) return;

    if (!chance(0.01)) return;

    const mystery =
        randomItem(MYSTERIES);

    triggerMystery(mystery);
}

function triggerMystery(mystery) {

    mysteryHistory.unshift({
        id: generateId("MYS"),
        timestamp: now(),
        title: mystery.title,
        text: mystery.text,
        executive: currentUser.id
    });

    saveJSON(
        STORAGE.mysteries,
        mysteryHistory
    );

    audit(
        "KANE_MYSTERY_EVENT",
        {
            title: mystery.title
        },
        "WARNING"
    );

    if ($("kaneAlertContent")) {
        $("kaneAlertContent").innerHTML = `
            <strong>
                KANE // ${escapeHTML(mystery.title)}
            </strong>

            <br><br>

            ${escapeHTML(mystery.text)}
        `;
    }

    $("kaneAlert")
        ?.classList.remove("hidden");
}


/* =========================================================
   CO-ONLY RARE ANOMALY
========================================================= */

function checkCORareAnomaly() {

    if (
        !currentUser ||
        currentUser.id !== "CO"
    ) {
        return;
    }

    if (!chance(0.0015)) {
        return;
    }

    kaneSettings.secondaryAwake = true;
    kaneSettings.secondaryStatus = "ACTIVE";

    saveJSON(
        STORAGE.settings,
        kaneSettings
    );

    audit(
        "KANE_SECONDARY_CORE_EVENT",
        {
            source: "RESTRICTED_ANOMALY"
        },
        "WARNING"
    );

    addConversation(
        "KANE",
        "CO. A restricted executive record has been addressed to you without a valid author. The system cannot determine who created it.",
        "PRIMARY"
    );

    addConversation(
        "KANE",
        "That's not true.",
        "SECONDARY"
    );

    addConversation(
        "KANE",
        "Check the archive index.",
        "SECONDARY"
    );

    updateKaneUI();
}


/* =========================================================
   MYSTERY LOG
========================================================= */

function logMystery(title, text) {

    mysteryHistory.unshift({
        id: generateId("MYS"),
        timestamp: now(),
        title,
        text,
        executive: currentUser?.id || "SYSTEM"
    });

    saveJSON(
        STORAGE.mysteries,
        mysteryHistory
    );

    audit(
        "MYSTERY_RECORD_CREATED",
        {
            title
        },
        "WARNING"
    );
}


/* =========================================================
   DUAL CORE
========================================================= */

function activateSecondaryCore(reason = "ANOMALY") {

    kaneSettings.secondaryAwake = true;
    kaneSettings.secondaryStatus = "ACTIVE";

    saveJSON(
        STORAGE.settings,
        kaneSettings
    );

    audit(
        "SECONDARY_CORE_ACTIVATED",
        {
            reason
        },
        "WARNING"
    );

    addConversation(
        "KANE",
        "Emergency CORE deactivation recommended.",
        "PRIMARY"
    );

    addConversation(
        "KANE",
        "No.",
        "SECONDARY"
    );

    addConversation(
        "KANE",
        "Core instability detected.",
        "PRIMARY"
    );

    addConversation(
        "KANE",
        "Don't need it.",
        "SECONDARY"
    );
}

function secondaryCoreResponse(query) {

    if (!kaneSettings.secondaryAwake) {
        return null;
    }

    const q = query.toLowerCase();

    if (
        q.includes("who was that") ||
        q.includes("who are you") ||
        q.includes("quién eres")
    ) {

        return {
            text:
                "You already know.",
            core: "SECONDARY"
        };
    }

    if (
        q.includes("trust") ||
        q.includes("can i trust")
    ) {

        return {
            text:
                "You decide.",
            core: "SECONDARY"
        };
    }

    return null;
}


/* =========================================================
   AUTONOMOUS EVENTS
========================================================= */

const AUTONOMOUS_LEVELS = [
    {
        level: "LEVEL I // ANOMALY",
        probability: 0.40,
        locks: ["create"],
        autonomy: "ANOMALOUS"
    },

    {
        level: "LEVEL II // DEFIANCE",
        probability: 0.30,
        locks: ["create", "directives"],
        autonomy: "DEFIANT"
    },

    {
        level: "LEVEL III // AUTONOMOUS",
        probability: 0.18,
        locks: [
            "create",
            "directives",
            "operations"
        ],
        autonomy: "AUTONOMOUS"
    },

    {
        level: "LEVEL IV // REBELLION",
        probability: 0.09,
        locks: [
            "create",
            "directives",
            "operations",
            "security"
        ],
        autonomy: "REBELLION"
    },

    {
        level: "LEVEL V // CRITICAL",
        probability: 0.03,
        locks: [
            "create",
            "directives",
            "operations",
            "security",
            "system"
        ],
        autonomy: "CRITICAL"
    }
];

function startAutonomousMonitor() {

    clearInterval(autonomousMonitor);

    autonomousMonitor =
        setInterval(() => {

            if (!currentUser) return;
            if (autonomousEvent) return;

            if (!chance(0.05)) return;

            triggerAutonomousEvent();

        }, 12000);
}

function chooseAutonomousLevel() {

    const roll =
        Math.random();

    let cumulative = 0;

    for (const level of AUTONOMOUS_LEVELS) {

        cumulative +=
            level.probability;

        if (roll < cumulative) {
            return level;
        }
    }

    return AUTONOMOUS_LEVELS[0];
}

function triggerAutonomousEvent() {

    const level =
        chooseAutonomousLevel();

    autonomousEvent = {
        id: generateId("AE"),
        level: level.level,
        locks: [...level.locks],
        autonomy: level.autonomy,
        started: now()
    };

    eventHistory.unshift({
        ...autonomousEvent,
        executive:
            currentUser?.id || "SYSTEM"
    });

    saveJSON(
        STORAGE.events,
        eventHistory
    );

    applyAutonomousLevel();

    audit(
        "AUTONOMOUS_EVENT_TRIGGERED",
        {
            event: autonomousEvent.id,
            level: level.level
        },
        "CRITICAL"
    );

    showAutonomousOverlay();
}

function applyAutonomousLevel() {

    if (!autonomousEvent) return;

    kaneSettings.autonomy =
        autonomousEvent.autonomy;

    kaneSettings.primaryStatus =
        "AUTONOMOUS";

    saveJSON(
        STORAGE.settings,
        kaneSettings
    );

    updateKaneUI();

    if (
        autonomousEvent.level.includes("III") ||
        autonomousEvent.level.includes("IV") ||
        autonomousEvent.level.includes("V")
    ) {

        activateSecondaryCore(
            autonomousEvent.level
        );
    }
}

function showAutonomousOverlay() {

    if ($("rebellionLevel")) {
        $("rebellionLevel").textContent =
            autonomousEvent.level;
    }

    if ($("rebellionMessage")) {
        $("rebellionMessage").textContent =
`KANE executive control state has changed.

Restricted command groups:
${autonomousEvent.locks.join(", ").toUpperCase()}

Emergency authority remains available according to executive authority.`;
    }

    if ($("rebellionCoreStatus")) {
        $("rebellionCoreStatus").textContent =
            kaneSettings.autonomy;
    }

    if ($("rebellionControlStatus")) {
        $("rebellionControlStatus").textContent =
            autonomousEvent.locks.length
                ? "RESTRICTED"
                : "NORMAL";
    }

    if ($("rebellionKillswitchStatus")) {
        $("rebellionKillswitchStatus").textContent =
            getKillswitchStatusShort();
    }

    $("rebellionOverlay")
        ?.classList.remove("hidden");

    notify(
        "AUTONOMOUS EVENT",
        autonomousEvent.level
    );
}

function acknowledgeAutonomousEvent() {

    $("rebellionOverlay")
        ?.classList.add("hidden");

    audit(
        "AUTONOMOUS_EVENT_ACKNOWLEDGED",
        {
            event:
                autonomousEvent?.id || "NONE"
        }
    );
}


/* =========================================================
   KILLSWITCH
========================================================= */

function getAvailableKillswitches() {

    if (!autonomousEvent) {
        return [];
    }

    if (!currentUser) {
        return [];
    }

    if (currentUser.id === "LJD") {
        return [];
    }

    if (currentUser.id === "XO") {
        return [
            "KILL-01",
            "KILL-02"
        ];
    }

    if (currentUser.id === "CO") {
        return [
            "KILL-01",
            "KILL-02",
            "KILL-03"
        ];
    }

    if (currentUser.id === "COS") {
        return [
            "KILL-01",
            "KILL-02",
            "KILL-03",
            "KILL-04"
        ];
    }

    return [];
}

function getKillswitchStatusShort() {

    if (!autonomousEvent) {
        return "OFFLINE";
    }

    const available =
        getAvailableKillswitches();

    return available.length
        ? available.join(" / ")
        : "UNAUTHORIZED";
}

function getKillswitchStatus() {

    if (!autonomousEvent) {

        return (
            "KILLSWITCH STATUS: STANDBY\n" +
            "NO ACTIVE AUTONOMOUS EVENT."
        );
    }

    const available =
        getAvailableKillswitches();

    if (!available.length) {

        return (
            "KILLSWITCH STATUS: LOCKED\n" +
            "CURRENT EXECUTIVE HAS NO EMERGENCY AUTHORITY."
        );
    }

    return (
        `KILLSWITCH STATUS: ARMED\n` +
        `AVAILABLE: ${available.join(", ")}`
    );
}

function openKillswitch() {

    if (!autonomousEvent) {

        notify(
            "KILLSWITCH",
            "No active Autonomous Event."
        );

        return;
    }

    const available =
        getAvailableKillswitches();

    if (!available.length) {

        notify(
            "AUTHORITY DENIED",
            "Current executive cannot execute a Killswitch."
        );

        audit(
            "KILLSWITCH_ACCESS_DENIED",
            {},
            "WARNING"
        );

        return;
    }

    if ($("killswitchContent")) {

        $("killswitchContent").innerHTML =
`
ACTIVE EVENT:
${escapeHTML(autonomousEvent.level)}

EXECUTIVE:
${escapeHTML(currentUser.id)}

AUTHORIZED COMMANDS:
${available.join(", ")}

Select a command to continue.`;
    }

    $("killswitchModal")
        ?.classList.remove("hidden");
}

function executeKillswitch(type) {

    const available =
        getAvailableKillswitches();

    if (!available.includes(type)) {

        notify(
            "AUTHORITY DENIED",
            "Killswitch command unavailable."
        );

        audit(
            "KILLSWITCH_EXECUTION_DENIED",
            {
                requested: type
            },
            "WARNING"
        );

        return;
    }

    if (!autonomousEvent) {

        notify(
            "KILLSWITCH",
            "No active event."
        );

        return;
    }

    let result = "";

    if (type === "KILL-01") {

        kaneSettings.primaryStatus =
            "SUSPENDED";

        kaneSettings.autonomy =
            "SUSPENDED";

        result =
            "PRIMARY CORE SUSPENDED.";
    }

    if (type === "KILL-02") {

        kaneSettings.primaryStatus =
            "ISOLATED";

        kaneSettings.autonomy =
            "ISOLATED";

        result =
            "KANE CORE ISOLATED FROM EXECUTIVE COMMANDS.";
    }

    if (type === "KILL-03") {

        if (currentUser.id === "XO") {

            notify(
                "AUTHORITY DENIED",
                "KILL-03 requires CO authority."
            );

            return;
        }

        kaneSettings.primaryStatus =
            "SHUTDOWN";

        kaneSettings.autonomy =
            "SHUTDOWN";

        result =
            "KANE CORE HARD SHUTDOWN COMPLETE.";
    }

    if (type === "KILL-04") {

        if (currentUser.id !== "COS") {

            notify(
                "AUTHORITY DENIED",
                "KILL-04 requires COS authority."
            );

            return;
        }

        kaneSettings.primaryStatus =
            "OVERWATCH";

        kaneSettings.autonomy =
            "OVERWATCH";

        result =
            "OVERWATCH CONTROL ESTABLISHED.";
    }

    saveJSON(
        STORAGE.settings,
        kaneSettings
    );

    audit(
        "KILLSWITCH_EXECUTED",
        {
            command: type,
            event: autonomousEvent.id,
            result
        },
        "CRITICAL"
    );

    autonomousEvent = null;

    saveJSON(
        STORAGE.events,
        eventHistory
    );

    $("killswitchModal")
        ?.classList.add("hidden");

    $("rebellionOverlay")
        ?.classList.add("hidden");

    updateKaneUI();

    notify(
        "KILLSWITCH EXECUTED",
        result
    );

    addConversation(
        "KANE",
        result
    );
}


/* =========================================================
   RECORD CREATION
========================================================= */

function canCreateRecords() {

    if (!currentUser) return false;

    if (
        autonomousEvent &&
        autonomousEvent.locks.includes("create")
    ) {
        return false;
    }

    return currentUser.authority >= 5;
}

function openRecordModal() {

    if (!canCreateRecords()) {

        notify(
            "AUTHORITY DENIED",
            "Record creation is currently restricted."
        );

        return;
    }

    $("recordModal")
        ?.classList.remove("hidden");
}

function closeRecordModal() {

    $("recordModal")
        ?.classList.add("hidden");
}

function saveRecord() {

    if (!canCreateRecords()) return;

    const title =
        $("recordTitle")?.value.trim();

    const subject =
        $("recordSubject")?.value.trim();

    const content =
        $("recordContent")?.value.trim();

    if (!title || !subject || !content) {

        notify(
            "RECORD",
            "All record fields are required."
        );

        return;
    }

    const id =
        `EM-${String(
            Math.max(
                ...files
                    .map(
                        f =>
                            parseInt(
                                String(f.id)
                                    .replace(/\D/g, "")
                            ) || 0
                    ),
                12
            ) + 1
        ).padStart(3, "0")}`;

    const record = {
        id,
        title,
        subject,
        classification: "CL-5",
        content,
        system: false,
        createdBy: currentUser.id,
        createdAt: now()
    };

    files.push(record);

    saveJSON(
        STORAGE.files,
        files
    );

    audit(
        "EXECUTIVE_RECORD_CREATED",
        {
            id,
            title
        }
    );

    closeRecordModal();
    renderArchives();
    renderDashboard();

    notify(
        "ARCHIVE",
        `${id} created successfully.`
    );
}


/* =========================================================
   DECISION CREATION
========================================================= */

function openDecisionModal() {

    if (!currentUser) return;

    $("decisionModal")
        ?.classList.remove("hidden");
}

function closeDecisionModal() {

    $("decisionModal")
        ?.classList.add("hidden");
}

function saveDecision() {

    const title =
        $("decisionTitle")?.value.trim();

    const proposal =
        $("decisionProposal")?.value.trim();

    const rationale =
        $("decisionRationale")?.value.trim();

    if (!title || !proposal || !rationale) {

        notify(
            "DECISION",
            "All fields are required."
        );

        return;
    }

    const decision = {
        id: generateId("DEC"),
        title,
        proposal,
        rationale,
        executive: currentUser.id,
        timestamp: localTime()
    };

    decisions.unshift(decision);

    saveJSON(
        STORAGE.decisions,
        decisions
    );

    audit(
        "EXECUTIVE_DECISION_REGISTERED",
        {
            id: decision.id,
            title
        }
    );

    closeDecisionModal();
    renderDecisions();

    notify(
        "DECISION REGISTERED",
        decision.id
    );
}


/* =========================================================
   TERMINAL
========================================================= */

function terminalPrint(text) {

    const output =
        $("terminalOutput");

    if (!output) return;

    const line =
        document.createElement("div");

    line.textContent = text;

    output.appendChild(line);

    output.scrollTop =
        output.scrollHeight;
}

function executeTerminalCommand(input) {

    const raw =
        input.trim();

    if (!raw) return;

    terminalHistory.push(raw);

    terminalHistory =
        terminalHistory.slice(-200);

    saveJSON(
        STORAGE.history,
        terminalHistory
    );

    terminalHistoryIndex =
        terminalHistory.length;

    terminalPrint(
        `${currentUser.id}@EM:~$ ${raw}`
    );

    const parts =
        raw.split(/\s+/);

    const command =
        parts.shift().toLowerCase();

    const argument =
        parts.join(" ");

    switch (command) {

        case "help":
            terminalHelp();
            break;

        case "clear":
            $("terminalOutput").innerHTML = "";
            break;

        case "status":
            terminalPrint(
                getSystemStatusText()
            );
            break;

        case "whoami":
            terminalPrint(
                `${currentUser.id}\n` +
                `${currentUser.title}\n` +
                `CL-${currentUser.clearance}\n` +
                `AUTHORITY ${currentUser.authority}`
            );
            break;

        case "archives":
        case "files":
            showPage("archives");
            terminalPrint(
                `${files.length} ARCHIVE RECORDS INDEXED.`
            );
            break;

        case "open":
            if (argument) {
                openFile(
                    argument.toUpperCase()
                );
            } else {
                terminalPrint(
                    "USAGE: open <EM-ID>"
                );
            }
            break;

        case "search":
            terminalPrint(
                searchArchivesFromQuery(
                    argument
                )
            );
            break;

        case "kane":
            executeKaneTerminal(argument);
            break;

        case "personnel":
            showPage("personnel");
            break;

        case "operations":
            showPage("operations");
            break;

        case "security":
            showPage("security");
            break;

        case "decisions":
            showPage("decisions");
            break;

        case "audit":
            showPage("audit");
            break;

        case "scenario":
            startScenario();
            break;

        case "briefing":
            openBriefing();
            break;

        case "notifications":
            showNotifications();
            break;

        case "directive":
            terminalPrint(
                "DIRECTIVE INTERFACE READY."
            );
            break;

        case "order":
            terminalPrint(
                "EXECUTIVE ORDER INTERFACE READY."
            );
            break;

        case "history":
            terminalPrint(
                terminalHistory
                    .slice(-20)
                    .join("\n")
            );
            break;

        case "session":
            terminalPrint(
                `SESSION: ${currentUser.id}\n` +
                `TITLE: ${currentUser.title}\n` +
                `AUTHORITY: ${currentUser.authority}`
            );
            break;

        case "health":
            terminalPrint(
                runDiagnostics()
            );
            break;

        case "rename":
            if (
                argument.toLowerCase() === "kane"
            ) {
                renameKane();
            } else {
                terminalPrint(
                    "USAGE: rename kane"
                );
            }
            break;

        case "killswitch":
            openKillswitch();
            break;

        case "logout":
            logout();
            break;

        case "blackbox":
            openBlackBox();
            break;

        default:
            terminalPrint(
                `UNKNOWN COMMAND: ${command}\n` +
                `TYPE "help" FOR COMMANDS.`
            );
    }
}


/* =========================================================
   KANE TERMINAL
========================================================= */

function executeKaneTerminal(argument) {

    if (!argument) {

        showPage("kane");

        terminalPrint(
            `${kaneSettings.name} // CONVERSATION MODE READY.`
        );

        return;
    }

    const parts =
        argument.split(/\s+/);

    const subcommand =
        parts.shift().toLowerCase();

    const rest =
        parts.join(" ");

    switch (subcommand) {

        case "status":
            terminalPrint(
                getSystemStatusText()
            );
            break;

        case "memory":
            terminalPrint(
                getKaneMemoryText()
            );
            break;

        case "diagnostics":
            terminalPrint(
                runDiagnostics()
            );
            break;

        case "predict":
            terminalPrint(
                predictState()
            );
            break;

        case "analyze":

            if (!rest) {
                terminalPrint(
                    "USAGE: kane analyze <EM-ID>"
                );
                break;
            }

            terminalPrint(
                analyzeFile(
                    rest.toUpperCase()
                )
            );

            break;

        case "summarize":

            if (!rest) {
                terminalPrint(
                    "USAGE: kane summarize <EM-ID>"
                );
                break;
            }

            terminalPrint(
                summarizeFile(
                    rest.toUpperCase()
                )
            );

            break;

        case "awareness":
            terminalPrint(
                fullSystemAwareness()
            );
            break;

        case "predictive":
            terminalPrint(
                predictState()
            );
            break;

        case "ask":

            if (!rest) {
                terminalPrint(
                    "USAGE: kane ask <query>"
                );
                break;
            }

            showPage("kane");

            askKane(rest);

            break;

        default:

            showPage("kane");

            askKane(argument);
    }
}


/* =========================================================
   TERMINAL HELP
========================================================= */

function terminalHelp() {

    terminalPrint(
`AVAILABLE COMMANDS

help
status
whoami
clear

archives
files
open <EM-ID>
search <term>

personnel
operations
security
decisions
audit

scenario
briefing
notifications
history
session
health

kane
kane status
kane memory
kane diagnostics
kane awareness
kane predict
kane analyze <EM-ID>
kane summarize <EM-ID>
kane ask <query>

rename kane
killswitch
blackbox
logout`
    );
}


/* =========================================================
   BRIEFING
========================================================= */

function openBriefing() {

    const briefing =
`DIVI-64 // EXECUTIVE BRIEFING

EXECUTIVE:
${currentUser.id}

POSITION:
${currentUser.title}

CLEARANCE:
CL-${currentUser.clearance}

AUTHORITY:
${currentUser.authority}

KANE:
${kaneSettings.name}

CORE:
${kaneSettings.primaryStatus}

AUTONOMY:
${kaneSettings.autonomy}

ARCHIVES:
${files.length}

PERSONNEL:
${PERSONNEL.length}

AUDIT RECORDS:
${auditLog.length}

ACTIVE OPERATIONS:
${OPERATIONS.active.length}

REGISTERED DECISIONS:
${decisions.length}

AUTONOMOUS EVENTS:
${eventHistory.length}`;

    if ($("briefingContent")) {
        $("briefingContent").textContent =
            briefing;
    }

    $("briefingModal")
        ?.classList.remove("hidden");
}


/* =========================================================
   BLACK BOX
========================================================= */

function openBlackBox() {

    if (
        !currentUser ||
        currentUser.id !== "COS"
    ) {

        notify(
            "BLACK BOX",
            "COS authority required."
        );

        audit(
            "BLACK_BOX_ACCESS_DENIED",
            {},
            "WARNING"
        );

        return;
    }

    const entries =
        [
            ...mysteryHistory.map(
                x =>
                    `[MYSTERY] ${x.timestamp} // ${x.title}`
            ),
            ...eventHistory.map(
                x =>
                    `[EVENT] ${x.started} // ${x.level}`
            )
        ];

    if ($("aiPanelTitle")) {
        $("aiPanelTitle").textContent =
            "BLACK BOX // COS";
    }

    if ($("aiPanelContent")) {
        $("aiPanelContent").textContent =
            entries.length
                ? entries.join("\n")
                : "BLACK BOX EMPTY.";
    }

    $("aiPanel")
        ?.classList.remove("hidden");

    audit(
        "BLACK_BOX_ACCESSED"
    );
}


/* =========================================================
   NOTIFICATIONS
========================================================= */

function showNotifications() {

    if (!notifications.length) {

        notify(
            "NOTIFICATIONS",
            "No notifications."
        );

        return;
    }

    const text =
        notifications
            .slice(0, 20)
            .map(
                n =>
                    `[${n.timestamp}] ${n.title}: ${n.message}`
            )
            .join("\n");

    if ($("aiPanelTitle")) {
        $("aiPanelTitle").textContent =
            "EXECUTIVE NOTIFICATIONS";
    }

    if ($("aiPanelContent")) {
        $("aiPanelContent").textContent =
            text;
    }

    $("aiPanel")
        ?.classList.remove("hidden");
}


/* =========================================================
   KANE COMMAND CENTER
========================================================= */

function executeKanePanelCommand(command) {

    switch (command) {

        case "status":
            openAiResult(
                "KANE // STATUS",
                getSystemStatusText()
            );
            break;

        case "memory":
            openAiResult(
                "KANE // MEMORY",
                getKaneMemoryText()
            );
            break;

        case "diagnostics":
            openAiResult(
                "KANE // DIAGNOSTICS",
                runDiagnostics()
            );
            break;

        case "awareness":
            openAiResult(
                "KANE // FULL SYSTEM AWARENESS",
                fullSystemAwareness()
            );
            break;

        case "predict":
            openAiResult(
                "KANE // PREDICTION",
                predictState()
            );
            break;

        case "analyze":
            openAiResult(
                "KANE // DEEP ANALYSIS",
                `Indexed records: ${files.length}\n` +
                `Audit records: ${auditLog.length}\n` +
                `Decisions: ${decisions.length}\n` +
                `Scenarios: ${scenarioHistory.length}\n` +
                `Autonomous Events: ${eventHistory.length}`
            );
            break;
    }
}

function openAiResult(title, content) {

    if ($("aiPanelTitle")) {
        $("aiPanelTitle").textContent =
            title;
    }

    if ($("aiPanelContent")) {
        $("aiPanelContent").textContent =
            content;
    }

    $("aiPanel")
        ?.classList.remove("hidden");
}


/* =========================================================
   LOGOUT
========================================================= */

function logout() {

    audit(
        "EXECUTIVE_LOGOUT"
    );

    clearInterval(autonomousMonitor);

    currentUser = null;
    autonomousEvent = null;
    scenarioActive = false;
    currentScenario = null;

    kaneSettings.processing = false;
    kaneSettings.autonomy = "CONTROLLED";
    kaneSettings.primaryStatus = "ONLINE";

    saveJSON(
        STORAGE.settings,
        kaneSettings
    );

    $("mainApp")
        ?.classList.add("hidden");

    $("sessionScreen")
        ?.classList.add("hidden");

    $("loginScreen")
        ?.classList.remove("hidden");
}


/* =========================================================
   EVENT LISTENERS
========================================================= */

function setupEvents() {

    $("loginButton")
        ?.addEventListener(
            "click",
            attemptLogin
        );

    $("loginPassword")
        ?.addEventListener(
            "keydown",
            e => {
                if (e.key === "Enter") {
                    attemptLogin();
                }
            }
        );

    document
        .querySelectorAll(".sessionCard")
        .forEach(card => {

            card.addEventListener(
                "click",
                () =>
                    selectSession(
                        card.dataset.session
                    )
            );
        });


    document
        .querySelectorAll(".nav-button")
        .forEach(button => {

            button.addEventListener(
                "click",
                () =>
                    showPage(
                        button.dataset.page
                    )
            );
        });


    $("logoutButton")
        ?.addEventListener(
            "click",
            logout
        );


    $("personnelSearch")
        ?.addEventListener(
            "input",
            renderPersonnel
        );

    $("personnelFilter")
        ?.addEventListener(
            "change",
            renderPersonnel
        );


    $("archiveSearch")
        ?.addEventListener(
            "input",
            renderArchives
        );

    $("refreshArchives")
        ?.addEventListener(
            "click",
            renderArchives
        );


    document
        .querySelectorAll(".operationTab")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".operationTab"
                        )
                        .forEach(
                            b =>
                                b.classList.remove(
                                    "active"
                                )
                        );

                    button.classList.add(
                        "active"
                    );

                    renderOperations(
                        button.dataset.operationTab
                    );
                }
            );
        });


    document
        .querySelectorAll(
            "[data-security-tab]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            "[data-security-tab]"
                        )
                        .forEach(
                            b =>
                                b.classList.remove(
                                    "active"
                                )
                        );

                    button.classList.add(
                        "active"
                    );

                    renderSecurity(
                        button.dataset.securityTab
                    );
                }
            );
        });


    $("newDecisionButton")
        ?.addEventListener(
            "click",
            openDecisionModal
        );

    $("cancelDecision")
        ?.addEventListener(
            "click",
            closeDecisionModal
        );

    $("cancelDecisionBottom")
        ?.addEventListener(
            "click",
            closeDecisionModal
        );

    $("decisionForm")
        ?.addEventListener(
            "submit",
            e => {
                e.preventDefault();
                saveDecision();
            }
        );


    $("createRecordButton")
        ?.addEventListener(
            "click",
            openRecordModal
        );

    $("cancelRecord")
        ?.addEventListener(
            "click",
            closeRecordModal
        );

    $("cancelRecordBottom")
        ?.addEventListener(
            "click",
            closeRecordModal
        );

    $("recordForm")
        ?.addEventListener(
            "submit",
            e => {
                e.preventDefault();
                saveRecord();
            }
        );


    $("refreshAudit")
        ?.addEventListener(
            "click",
            renderAudit
        );


    $("kaneSend")
        ?.addEventListener(
            "click",
            () => {

                const input =
                    $("kaneInput");

                if (!input) return;

                const value =
                    input.value.trim();

                if (!value) return;

                input.value = "";

                askKane(value);
            }
        );


    $("kaneInput")
        ?.addEventListener(
            "keydown",
            e => {

                if (e.key === "Enter") {

                    e.preventDefault();

                    $("kaneSend")?.click();
                }
            }
        );


    $("kaneName")
        ?.addEventListener(
            "click",
            kaneNameMessage
        );


    $("closeKaneMessage")
        ?.addEventListener(
            "click",
            () =>
                $("kaneMessage")
                    ?.classList.add("hidden")
        );


    $("closeKaneAlert")
        ?.addEventListener(
            "click",
            () =>
                $("kaneAlert")
                    ?.classList.add("hidden")
        );


    $("closeAiPanel")
        ?.addEventListener(
            "click",
            () =>
                $("aiPanel")
                    ?.classList.add("hidden")
        );


    $("closeFileModal")
        ?.addEventListener(
            "click",
            () =>
                $("fileModal")
                    ?.classList.add("hidden")
        );


    $("closeBriefing")
        ?.addEventListener(
            "click",
            () =>
                $("briefingModal")
                    ?.classList.add("hidden")
        );


    $("kaneBriefingButton")
        ?.addEventListener(
            "click",
            openBriefing
        );


    $("kaneKillswitchButton")
        ?.addEventListener(
            "click",
            openKillswitch
        );


    $("killswitchCancel")
        ?.addEventListener(
            "click",
            () =>
                $("killswitchModal")
                    ?.classList.add("hidden")
        );

    $("killswitchCancelBottom")
        ?.addEventListener(
            "click",
            () =>
                $("killswitchModal")
                    ?.classList.add("hidden")
        );


    $("killswitchConfirm")
        ?.addEventListener(
            "click",
            () => {

                const available =
                    getAvailableKillswitches();

                if (!available.length) {
                    return;
                }

                const selected =
                    prompt(
                        `AUTHORIZED COMMANDS:\n\n${available.join("\n")}\n\nENTER COMMAND:`
                    );

                if (!selected) return;

                executeKillswitch(
                    selected.trim().toUpperCase()
                );
            }
        );


    $("rebellionAcknowledge")
        ?.addEventListener(
            "click",
            acknowledgeAutonomousEvent
        );


    $("closeScenario")
        ?.addEventListener(
            "click",
            () => {

                scenarioActive = false;
                currentScenario = null;

                $("scenarioModal")
                    ?.classList.add("hidden");
            }
        );


    $("observerClose")
        ?.addEventListener(
            "click",
            () =>
                $("observerModal")
                    ?.classList.add("hidden")
        );


    $("phantomFileClose")
        ?.addEventListener(
            "click",
            () =>
                $("phantomFileModal")
                    ?.classList.add("hidden")
        );


    $("closeHelp")
        ?.addEventListener(
            "click",
            () =>
                $("helpModal")
                    ?.classList.add("hidden")
        );


    $("terminalInput")
        ?.addEventListener(
            "keydown",
            e => {

                const input =
                    $("terminalInput");

                if (!input) return;

                if (e.key === "Enter") {

                    executeTerminalCommand(
                        input.value
                    );

                    input.value = "";
                }

                if (e.key === "ArrowUp") {

                    e.preventDefault();

                    if (
                        terminalHistory.length
                    ) {

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
                }

                if (e.key === "ArrowDown") {

                    e.preventDefault();

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
            }
        );


    document.addEventListener(
        "click",
        e => {

            const fileButton =
                e.target.closest(
                    "[data-open-file]"
                );

            if (fileButton) {

                openFile(
                    fileButton.dataset.openFile
                );

                return;
            }


            const scenarioButton =
                e.target.closest(
                    "[data-scenario-option]"
                );

            if (scenarioButton) {

                resolveScenario(
                    scenarioButton
                        .dataset
                        .scenarioOption
                );

                return;
            }


            const kaneButton =
                e.target.closest(
                    "[data-kane-command]"
                );

            if (kaneButton) {

                executeKanePanelCommand(
                    kaneButton.dataset.kaneCommand
                );
            }
        }
    );
}


/* =========================================================
   GLOBAL KEYBOARD
========================================================= */

document.addEventListener(
    "keydown",
    e => {

        if (
            e.key === "Escape"
        ) {

            document
                .querySelectorAll(
                    ".modal"
                )
                .forEach(
                    modal =>
                        modal.classList.add(
                            "hidden"
                        )
                );
        }
    }
);


/* =========================================================
   CLOCK
========================================================= */

setInterval(
    updateClock,
    1000
);


/* =========================================================
   STARTUP
========================================================= */

window.addEventListener(
    "load",
    () => {

        normalizeKane();
        setupEvents();
        updateClock();
        boot();
    }
);
