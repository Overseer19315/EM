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
/* =========================================================
   DIVI-64 // EXECUTIVE AUTHORITY EXTENSION
   ADDITIVE CORE // V3
========================================================= */


/* =========================================================
   AUTHORITY MATRIX
========================================================= */

const PERMISSIONS = {

    LJD: [
        "ARCHIVE_READ",
        "PERSONNEL_READ",
        "AUDIT_READ",
        "KANE_CHAT",
        "KANE_ANALYZE",
        "SCENARIO_START",
        "SCENARIO_DECIDE",
        "SECURITY_READ",
        "DECISION_READ"
    ],

    XO: [
        "ARCHIVE_READ",
        "PERSONNEL_READ",
        "AUDIT_READ",
        "KANE_CHAT",
        "KANE_ANALYZE",
        "SCENARIO_START",
        "SCENARIO_DECIDE",
        "SECURITY_READ",
        "SECURITY_CONTROL",
        "OPERATIONS_READ",
        "OPERATIONS_CONTROL",
        "DECISION_READ",
        "DECISION_CREATE",
        "KILL_01",
        "KILL_02"
    ],

    CO: [
        "ARCHIVE_READ",
        "PERSONNEL_READ",
        "AUDIT_READ",
        "KANE_CHAT",
        "KANE_ANALYZE",
        "SCENARIO_START",
        "SCENARIO_DECIDE",
        "SECURITY_READ",
        "SECURITY_CONTROL",
        "OPERATIONS_READ",
        "OPERATIONS_CONTROL",
        "DECISION_READ",
        "DECISION_CREATE",
        "RECORD_CREATE",
        "DIRECTIVE_CREATE",
        "ORDER_CREATE",
        "KANE_RENAME",
        "KANE_ADVANCED_CONTROL",
        "KILL_01",
        "KILL_02",
        "KILL_03"
    ],

    COS: [
        "ARCHIVE_READ",
        "PERSONNEL_READ",
        "AUDIT_READ",
        "KANE_CHAT",
        "KANE_ANALYZE",
        "SCENARIO_START",
        "SCENARIO_DECIDE",
        "SECURITY_READ",
        "SECURITY_CONTROL",
        "OPERATIONS_READ",
        "OPERATIONS_CONTROL",
        "DECISION_READ",
        "DECISION_CREATE",
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
        "SYSTEM_OVERRIDE",
        "VAULT_ACCESS"
    ]
};


function hasPermission(permission) {

    if (!currentUser) return false;

    return Boolean(
        PERMISSIONS[currentUser.id]?.includes(permission)
    );
}


function denyPermission(permission, details = {}) {

    const message =
        `AUTHORITY DENIED.\n` +
        `REQUIRED PERMISSION: ${permission}\n` +
        `CURRENT SESSION: ${currentUser?.id || "NONE"}`;

    terminalPrint(message);

    audit(
        "PERMISSION_DENIED",
        {
            permission,
            ...details
        },
        "WARNING"
    );

    notify(
        "AUTHORITY DENIED",
        `${permission} unavailable to ${currentUser?.id || "UNKNOWN"}.`
    );

    return false;
}


function requirePermission(permission, details = {}) {

    if (hasPermission(permission)) {
        return true;
    }

    return denyPermission(permission, details);
}


/* =========================================================
   SESSION TERMINAL PROFILE
========================================================= */

const SESSION_PROFILES = {

    LJD: {
        terminal: "JUDICIAL",
        prompt: "LJD@EXECUTIVE:~$",
        designation: "JUDICIAL // REVIEW",
        welcome:
`DIVI-64 // JUDICIAL EXECUTIVE SESSION

SESSION: LJD
ROLE: LEAD JUDICIAL DIRECTOR
CLEARANCE: CL-5
AUTHORITY: 5

ARCHIVE REVIEW CHANNEL ONLINE.
JUDICIAL OVERSIGHT ACTIVE.`
    },

    XO: {
        terminal: "EXECUTIVE",
        prompt: "XO@EXECUTIVE:~$",
        designation: "EXECUTIVE // OPERATIONS",
        welcome:
`DIVI-64 // EXECUTIVE OPERATIONS SESSION

SESSION: XO
ROLE: EXECUTIVE OFFICER
CLEARANCE: CL-5
AUTHORITY: 5

OPERATIONS CONTROL CHANNEL ONLINE.
EXECUTIVE CONTROL ACTIVE.`
    },

    CO: {
        terminal: "COMMAND",
        prompt: "CO@COMMAND:~$",
        designation: "COMMAND // CONTROL",
        welcome:
`DIVI-64 // COMMAND SESSION

SESSION: CO
ROLE: COMMANDING OFFICER
CLEARANCE: CL-5
AUTHORITY: 5

COMMAND CONTROL CHANNEL ONLINE.
COMMAND AUTHORITY ACTIVE.`
    },

    COS: {
        terminal: "OVERWATCH",
        prompt: "COS@OVERWATCH:~$",
        designation: "OVERWATCH // SUPREME AUTHORITY",
        welcome:
`DIVI-64 // OVERWATCH SESSION

SESSION: COS
ROLE: COMMANDER SENIOR
CLEARANCE: CL-5
AUTHORITY: 6

OVERWATCH CHANNEL ONLINE.
SUPREME EXECUTIVE AUTHORITY ACTIVE.`
    }
};


function getSessionProfile() {

    return (
        SESSION_PROFILES[currentUser?.id] ||
        SESSION_PROFILES.LJD
    );
}


/* =========================================================
   AUTHORITY UI
========================================================= */

function updateAuthorityInterface() {

    if (!currentUser) return;

    const profile =
        getSessionProfile();

    if ($("terminalPrompt")) {
        $("terminalPrompt").textContent =
            profile.prompt;
    }

    if ($("terminalSessionLabel")) {
        $("terminalSessionLabel").textContent =
            `SESSION: ${currentUser.id} // ${profile.terminal}`;
    }

    const navPermissions = {
        personnel: "PERSONNEL_READ",
        archives: "ARCHIVE_READ",
        operations: "OPERATIONS_READ",
        security: "SECURITY_READ",
        decisions: "DECISION_READ",
        audit: "AUDIT_READ",
        kane: "KANE_CHAT"
    };

    document
        .querySelectorAll(".nav-button")
        .forEach(button => {

            const page =
                button.dataset.page;

            const permission =
                navPermissions[page];

            if (!permission) return;

            const allowed =
                hasPermission(permission);

            button.classList.toggle(
                "authority-locked",
                !allowed
            );

            button.dataset.authority =
                allowed
                    ? "AUTHORIZED"
                    : "RESTRICTED";
        });
}


/* =========================================================
   PAGE AUTHORITY
========================================================= */

const ORIGINAL_SHOW_PAGE =
    showPage;

showPage = function(page) {

    const permissionMap = {

        personnel: "PERSONNEL_READ",
        archives: "ARCHIVE_READ",
        operations: "OPERATIONS_READ",
        security: "SECURITY_READ",
        decisions: "DECISION_READ",
        audit: "AUDIT_READ",
        kane: "KANE_CHAT"
    };

    const permission =
        permissionMap[page];

    if (
        permission &&
        !hasPermission(permission)
    ) {

        denyPermission(
            permission,
            {
                page
            }
        );

        return;
    }

    ORIGINAL_SHOW_PAGE(page);
};


/* =========================================================
   ARCHIVE ACCESS CONTROL
========================================================= */

const ORIGINAL_OPEN_FILE =
    openFile;

openFile = function(id) {

    if (!requirePermission(
        "ARCHIVE_READ",
        { file: id }
    )) {
        return;
    }

    ORIGINAL_OPEN_FILE(id);
};


/* =========================================================
   ARCHIVE CREATION CONTROL
========================================================= */

const ORIGINAL_CAN_CREATE_RECORDS =
    canCreateRecords;

canCreateRecords = function() {

    if (!currentUser) return false;

    if (!hasPermission("RECORD_CREATE")) {
        return false;
    }

    if (
        autonomousEvent &&
        autonomousEvent.locks.includes("create")
    ) {
        return false;
    }

    return true;
};


/* =========================================================
   DECISION AUTHORITY
========================================================= */

const ORIGINAL_OPEN_DECISION =
    openDecisionModal;

openDecisionModal = function() {

    if (!requirePermission(
        "DECISION_CREATE"
    )) {
        return;
    }

    ORIGINAL_OPEN_DECISION();
};


const ORIGINAL_SAVE_DECISION =
    saveDecision;

saveDecision = function() {

    if (!requirePermission(
        "DECISION_CREATE"
    )) {
        return;
    }

    ORIGINAL_SAVE_DECISION();
};


/* =========================================================
   SCENARIO AUTHORITY
========================================================= */

const ORIGINAL_START_SCENARIO =
    startScenario;

startScenario = function() {

    if (!requirePermission(
        "SCENARIO_START"
    )) {
        return;
    }

    ORIGINAL_START_SCENARIO();
};


const ORIGINAL_RESOLVE_SCENARIO =
    resolveScenario;

resolveScenario = function(option) {

    if (!requirePermission(
        "SCENARIO_DECIDE"
    )) {
        return;
    }

    ORIGINAL_RESOLVE_SCENARIO(option);
};


/* =========================================================
   KANE AUTHORITY
========================================================= */

const ORIGINAL_ASK_KANE =
    askKane;

askKane = async function(query) {

    if (!requirePermission(
        "KANE_CHAT"
    )) {
        return;
    }

    return ORIGINAL_ASK_KANE(query);
};


const ORIGINAL_ANALYZE_FILE =
    analyzeFile;

analyzeFile = function(id) {

    if (!requirePermission(
        "KANE_ANALYZE",
        { file: id }
    )) {
        return "AUTHORITY DENIED.";
    }

    return ORIGINAL_ANALYZE_FILE(id);
};


const ORIGINAL_SUMMARIZE_FILE =
    summarizeFile;

summarizeFile = function(id) {

    if (!requirePermission(
        "KANE_ANALYZE",
        { file: id }
    )) {
        return "AUTHORITY DENIED.";
    }

    return ORIGINAL_SUMMARIZE_FILE(id);
};


/* =========================================================
   KANE RENAME
========================================================= */

const ORIGINAL_RENAME_KANE =
    renameKane;

renameKane = function() {

    if (!requirePermission(
        "KANE_RENAME"
    )) {
        return;
    }

    ORIGINAL_RENAME_KANE();
};


/* =========================================================
   SAFE KANE MESSAGE
========================================================= */

kaneNameMessage = function() {

    if ($("kaneMessageContent")) {

        $("kaneMessageContent").textContent =
            "Executive designation interface acknowledged.";
    }

    $("kaneMessage")
        ?.classList.remove("hidden");
};


/* =========================================================
   KILLSWITCH PERMISSION MATRIX
========================================================= */

function getKillswitchPermission(type) {

    const map = {
        "KILL-01": "KILL_01",
        "KILL-02": "KILL_02",
        "KILL-03": "KILL_03",
        "KILL-04": "KILL_04"
    };

    return map[type] || null;
}


const ORIGINAL_GET_KILLSWITCHES =
    getAvailableKillswitches;

getAvailableKillswitches = function() {

    if (!currentUser || !autonomousEvent) {
        return [];
    }

    return [
        "KILL-01",
        "KILL-02",
        "KILL-03",
        "KILL-04"
    ].filter(
        type =>
            hasPermission(
                getKillswitchPermission(type)
            )
    );
};


const ORIGINAL_EXECUTE_KILLSWITCH =
    executeKillswitch;

executeKillswitch = function(type) {

    const permission =
        getKillswitchPermission(type);

    if (!permission) {

        audit(
            "INVALID_KILLSWITCH_COMMAND",
            {
                requested: type
            },
            "WARNING"
        );

        return;
    }

    if (!requirePermission(
        permission,
        {
            command: type
        }
    )) {
        return;
    }

    ORIGINAL_EXECUTE_KILLSWITCH(type);
};


/* =========================================================
   TERMINAL AUTHORITY
========================================================= */

function terminalDenied(command, permission) {

    terminalPrint(
        `COMMAND: ${command}\n` +
        `STATUS: AUTHORITY DENIED\n` +
        `REQUIRED: ${permission}\n` +
        `SESSION: ${currentUser.id}`
    );

    audit(
        "TERMINAL_COMMAND_DENIED",
        {
            command,
            permission
        },
        "WARNING"
    );

    notify(
        "COMMAND RESTRICTED",
        `${permission} required.`
    );
}


/* =========================================================
   VAULT STORAGE
========================================================= */

const VAULT_STORAGE = {
    files: "DIVI64_EXECUTIVE_VAULT_V1"
};


let vaultFiles =
    loadJSON(
        VAULT_STORAGE.files,
        []
    );


let vaultState = {
    mode: "SEALED",
    authorizations: [],
    authorizationStarted: null,
    openingStarted: null,
    openedAt: null,
    lastActivity: null
};


/* =========================================================
   VAULT CONSTANTS
========================================================= */

const VAULT_AUTH_SEQUENCE = [
    "LJD",
    "XO",
    "CO",
    "COS"
];

const VAULT_AUTH_WINDOW = 60000;
const VAULT_OPENING_TIME = 120000;
const VAULT_IDLE_TIME = 600000;


/* =========================================================
   VAULT STYLE
========================================================= */

function injectVaultStyle() {

    if ($("divi64VaultStyle")) return;

    const style =
        document.createElement("style");

    style.id =
        "divi64VaultStyle";

    style.textContent = `
        #divi64VaultOverlay {
            position: fixed;
            inset: 0;
            z-index: 99999;
            background: rgba(4,6,8,.97);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            font-family: monospace;
        }

        #divi64VaultOverlay.hidden {
            display: none;
        }

        .divi64-vault-panel {
            width: min(900px, 96vw);
            max-height: 92vh;
            overflow: auto;
            border: 1px solid #555;
            background: #090b0d;
            box-shadow: 0 0 40px rgba(0,0,0,.8);
            color: #ddd;
        }

        .divi64-vault-header {
            padding: 20px;
            border-bottom: 1px solid #333;
        }

        .divi64-vault-logo {
            font-size: 20px;
            letter-spacing: 5px;
            margin-bottom: 8px;
        }

        .divi64-vault-subtitle {
            color: #777;
            font-size: 11px;
            letter-spacing: 2px;
        }

        .divi64-vault-body {
            padding: 20px;
        }

        .divi64-vault-auth {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin: 20px 0;
        }

        .divi64-vault-auth-card {
            border: 1px solid #333;
            padding: 14px;
            background: #0d1012;
        }

        .divi64-vault-auth-card.authorized {
            border-color: #777;
        }

        .divi64-vault-line {
            margin: 8px 0;
            color: #888;
        }

        .divi64-vault-line.authorized {
            color: #ddd;
        }

        .divi64-vault-input {
            width: 100%;
            box-sizing: border-box;
            background: #050607;
            color: #ddd;
            border: 1px solid #333;
            padding: 10px;
            margin-top: 8px;
        }

        .divi64-vault-button {
            background: #101315;
            color: #ddd;
            border: 1px solid #444;
            padding: 10px 14px;
            cursor: pointer;
            margin: 4px;
        }

        .divi64-vault-button:hover {
            border-color: #888;
        }

        .divi64-vault-danger {
            border-color: #713838;
        }

        .divi64-vault-status {
            padding: 12px;
            border: 1px solid #292d30;
            margin-bottom: 15px;
            white-space: pre-line;
        }

        .divi64-vault-file {
            border: 1px solid #292d30;
            padding: 14px;
            margin-bottom: 10px;
        }

        .divi64-vault-file-title {
            font-weight: bold;
            margin-bottom: 5px;
        }

        .divi64-vault-editor {
            display: grid;
            gap: 8px;
            margin-top: 20px;
        }

        .divi64-vault-editor input,
        .divi64-vault-editor textarea {
            width: 100%;
            box-sizing: border-box;
            background: #050607;
            color: #ddd;
            border: 1px solid #333;
            padding: 10px;
            font-family: monospace;
        }

        .divi64-vault-editor textarea {
            min-height: 180px;
            resize: vertical;
        }

        @media (max-width: 700px) {
            .divi64-vault-auth {
                grid-template-columns: 1fr 1fr;
            }
        }
    `;

    document.head.appendChild(style);
}


/* =========================================================
   VAULT DOM
========================================================= */

function createVaultInterface() {

    if ($("divi64VaultOverlay")) return;

    injectVaultStyle();

    const overlay =
        document.createElement("div");

    overlay.id =
        "divi64VaultOverlay";

    overlay.className =
        "hidden";

    overlay.innerHTML = `
        <div class="divi64-vault-panel">

            <div class="divi64-vault-header">

                <div class="divi64-vault-logo">
                    D-64 // V-A-U-L-T
                </div>

                <div class="divi64-vault-subtitle">
                    EXECUTIVE RESTRICTED ARCHIVE
                </div>

            </div>

            <div class="divi64-vault-body">

                <div
                    id="divi64VaultStatus"
                    class="divi64-vault-status"
                >
                    VAULT SEALED.
                </div>

                <div
                    id="divi64VaultAuth"
                    class="divi64-vault-auth"
                ></div>

                <div
                    id="divi64VaultContent"
                ></div>

                <div
                    id="divi64VaultEditor"
                    class="divi64-vault-editor hidden"
                >

                    <input
                        id="divi64VaultTitle"
                        placeholder="ARCHIVE TITLE"
                    >

                    <input
                        id="divi64VaultSubject"
                        placeholder="SUBJECT"
                    >

                    <textarea
                        id="divi64VaultText"
                        placeholder="ARCHIVE CONTENT"
                    ></textarea>

                    <div>
                        <button
                            class="divi64-vault-button"
                            id="divi64VaultSave"
                        >
                            SAVE FILE
                        </button>

                        <button
                            class="divi64-vault-button"
                            id="divi64VaultCancelEdit"
                        >
                            CANCEL
                        </button>
                    </div>

                </div>

                <div
                    id="divi64VaultControls"
                    class="hidden"
                >

                    <button
                        class="divi64-vault-button"
                        id="divi64VaultNew"
                    >
                        NEW FILE
                    </button>

                    <button
                        class="divi64-vault-button divi64-vault-danger"
                        id="divi64VaultClose"
                    >
                        SEAL VAULT
                    </button>

                </div>

            </div>

        </div>
    `;

    document.body.appendChild(overlay);

    $("divi64VaultSave")
        ?.addEventListener(
            "click",
            saveVaultFile
        );

    $("divi64VaultCancelEdit")
        ?.addEventListener(
            "click",
            closeVaultEditor
        );

    $("divi64VaultNew")
        ?.addEventListener(
            "click",
            openVaultEditor
        );

    $("divi64VaultClose")
        ?.addEventListener(
            "click",
            closeVault
        );
}


/* =========================================================
   VAULT AUTHORIZATION
========================================================= */

function resetVaultAuthorization(reason = "RESET") {

    vaultState.mode = "SEALED";
    vaultState.authorizations = [];
    vaultState.authorizationStarted = null;
    vaultState.openingStarted = null;
    vaultState.openedAt = null;
    vaultState.lastActivity = null;

    renderVault();

    audit(
        "VAULT_AUTHORIZATION_RESET",
        {
            reason
        },
        "WARNING"
    );
}


function startVaultAuthorization() {

    if (!currentUser) return;

    if (!hasPermission("VAULT_ACCESS")) {

        denyPermission(
            "VAULT_ACCESS"
        );

        return;
    }

    if (vaultState.mode !== "SEALED") {

        notify(
            "VAULT",
            "Vault authorization is already active."
        );

        return;
    }

    vaultState.mode = "AUTHORIZING";
    vaultState.authorizations = [];
    vaultState.authorizationStarted =
        Date.now();

    createVaultInterface();
    renderVault();

    audit(
        "VAULT_AUTHORIZATION_STARTED",
        {
            sequence:
                VAULT_AUTH_SEQUENCE.join(" -> ")
        }
    );

    vaultAuthorizationTimeout();
}


function vaultAuthorizationTimeout() {

    setTimeout(() => {

        if (
            vaultState.mode === "AUTHORIZING" &&
            vaultState.authorizationStarted &&
            Date.now() -
                vaultState.authorizationStarted >
                VAULT_AUTH_WINDOW
        ) {

            resetVaultAuthorization(
                "AUTHORIZATION_WINDOW_EXPIRED"
            );

            notify(
                "VAULT",
                "Authorization window expired."
            );
        }

    }, VAULT_AUTH_WINDOW + 100);
}


/* =========================================================
   VAULT PASSWORD AUTH
========================================================= */

function authorizeVaultExecutive(id) {

    if (
        vaultState.mode !==
        "AUTHORIZING"
    ) {
        return;
    }

    const expected =
        VAULT_AUTH_SEQUENCE[
            vaultState.authorizations.length
        ];

    if (id !== expected) {

        resetVaultAuthorization(
            "INVALID_SEQUENCE"
        );

        notify(
            "VAULT AUTHORIZATION FAILED",
            "Authorization sequence reset."
        );

        return;
    }

    const input =
        $(`divi64VaultPassword_${id}`);

    const password =
        input?.value || "";

    if (
        !EXECUTIVES[id] ||
        EXECUTIVES[id].password !== password
    ) {

        resetVaultAuthorization(
            `INVALID_PASSWORD_${id}`
        );

        notify(
            "VAULT AUTHORIZATION FAILED",
            `${id} authorization rejected.`
        );

        return;
    }

    vaultState.authorizations.push(id);

    audit(
        "VAULT_EXECUTIVE_AUTHORIZED",
        {
            executive: id
        }
    );

    renderVault();

    if (
        vaultState.authorizations.length ===
        VAULT_AUTH_SEQUENCE.length
    ) {

        beginVaultOpening();
    }
}


/* =========================================================
   VAULT OPENING TIMER
========================================================= */

function beginVaultOpening() {

    vaultState.mode = "OPENING";
    vaultState.openingStarted =
        Date.now();

    audit(
        "VAULT_OPENING_SEQUENCE_STARTED",
        {
            duration: "120 SECONDS"
        }
    );

    renderVault();

    const interval =
        setInterval(() => {

            if (
                vaultState.mode !==
                "OPENING"
            ) {

                clearInterval(interval);
                return;
            }

            const elapsed =
                Date.now() -
                vaultState.openingStarted;

            const remaining =
                Math.max(
                    0,
                    VAULT_OPENING_TIME -
                    elapsed
                );

            renderVault();

            if (remaining <= 0) {

                clearInterval(interval);

                openVault();
            }

        }, 250);
}


/* =========================================================
   VAULT OPEN
========================================================= */

function openVault() {

    vaultState.mode = "OPEN";
    vaultState.openedAt =
        Date.now();

    vaultState.lastActivity =
        Date.now();

    renderVault();

    audit(
        "VAULT_OPENED",
        {
            authorizedBy:
                [...vaultState.authorizations]
        },
        "CRITICAL"
    );

    notify(
        "VAULT",
        "Restricted executive archive opened."
    );

    vaultIdleMonitor();
}


function vaultIdleMonitor() {

    setTimeout(() => {

        if (
            vaultState.mode !==
            "OPEN"
        ) {
            return;
        }

        if (
            Date.now() -
            vaultState.lastActivity >=
            VAULT_IDLE_TIME
        ) {

            closeVault();

            notify(
                "VAULT",
                "Vault automatically sealed after inactivity."
            );

            return;
        }

        vaultIdleMonitor();

    }, 30000);
}


/* =========================================================
   VAULT RENDER
========================================================= */

function renderVault() {

    createVaultInterface();

    const status =
        $("divi64VaultStatus");

    const auth =
        $("divi64VaultAuth");

    const content =
        $("divi64VaultContent");

    const controls =
        $("divi64VaultControls");

    const editor =
        $("divi64VaultEditor");

    if (!status || !auth || !content) {
        return;
    }


    /* AUTHORIZATION */

    if (
        vaultState.mode ===
        "AUTHORIZING"
    ) {

        const elapsed =
            Date.now() -
            vaultState.authorizationStarted;

        const remaining =
            Math.max(
                0,
                VAULT_AUTH_WINDOW -
                elapsed
            );

        status.textContent =
`VAULT AUTHORIZATION REQUIRED

SEQUENCE:
LJD → XO → CO → COS

TIME REMAINING:
${Math.ceil(remaining / 1000)} SECONDS`;

        auth.innerHTML =
            VAULT_AUTH_SEQUENCE
                .map((id, index) => {

                    const authorized =
                        vaultState.authorizations
                            .includes(id);

                    const active =
                        !authorized &&
                        index ===
                        vaultState.authorizations.length;

                    return `
                        <div class="divi64-vault-auth-card ${
                            authorized
                                ? "authorized"
                                : ""
                        }">

                            <strong>${id}</strong>

                            <div class="divi64-vault-line ${
                                authorized
                                    ? "authorized"
                                    : ""
                            }">

                                ${
                                    authorized
                                        ? "AUTHORIZED"
                                        : active
                                            ? "AWAITING"
                                            : "LOCKED"
                                }

                            </div>

                            ${
                                active
                                    ? `
                                        <input
                                            class="divi64-vault-input"
                                            id="divi64VaultPassword_${id}"
                                            type="password"
                                            placeholder="${id} PASSWORD"
                                        >

                                        <button
                                            class="divi64-vault-button"
                                            data-vault-authorize="${id}"
                                        >
                                            AUTHORIZE
                                        </button>
                                    `
                                    : ""
                            }

                        </div>
                    `;

                })
                .join("");

        content.innerHTML = "";

        controls?.classList.add(
            "hidden"
        );

        editor?.classList.add(
            "hidden"
        );

        $("divi64VaultOverlay")
            ?.classList.remove("hidden");

        return;
    }


    /* OPENING */

    if (
        vaultState.mode ===
        "OPENING"
    ) {

        const elapsed =
            Date.now() -
            vaultState.openingStarted;

        const remaining =
            Math.max(
                0,
                VAULT_OPENING_TIME -
                elapsed
            );

        status.textContent =
`ALL EXECUTIVE AUTHORIZATIONS VERIFIED.

VAULT OPENING SEQUENCE ACTIVE.

TIME REMAINING:
${formatVaultTime(remaining)}

KANE ACCESS:
NONE`;

        auth.innerHTML =
            VAULT_AUTH_SEQUENCE
                .map(
                    id =>
                        `<div class="divi64-vault-auth-card authorized">
                            <strong>${id}</strong>
                            <div class="divi64-vault-line authorized">
                                AUTHORIZED
                            </div>
                        </div>`
                )
                .join("");

        content.innerHTML =
            `<div class="divi64-vault-file">
                MAIN EXECUTIVE ARCHIVE ACCESS LOCKED
                DURING OPENING SEQUENCE.
            </div>`;

        controls?.classList.add(
            "hidden"
        );

        editor?.classList.add(
            "hidden"
        );

        $("divi64VaultOverlay")
            ?.classList.remove("hidden");

        return;
    }


    /* OPEN */

    if (
        vaultState.mode ===
        "OPEN"
    ) {

        vaultState.lastActivity =
            Date.now();

        status.textContent =
`VAULT STATUS: OPEN

AUTHORIZATION:
LJD / XO / CO / COS

KANE ACCESS:
NONE

RECORDS:
${vaultFiles.length}`;

        auth.innerHTML =
            VAULT_AUTH_SEQUENCE
                .map(
                    id =>
                        `<div class="divi64-vault-auth-card authorized">
                            <strong>${id}</strong>
                            <div class="divi64-vault-line authorized">
                                VERIFIED
                            </div>
                        </div>`
                )
                .join("");

        if (!vaultFiles.length) {

            content.innerHTML =
                `<div class="divi64-vault-file">
                    VAULT CONTAINS NO ARCHIVE RECORDS.
                </div>`;

        } else {

            content.innerHTML =
                vaultFiles
                    .map(file => `
                        <div class="divi64-vault-file">

                            <div class="divi64-vault-file-title">
                                ${escapeHTML(file.id)}
                                //
                                ${escapeHTML(file.title)}
                            </div>

                            <div class="divi64-vault-line">
                                ${escapeHTML(file.subject)}
                                //
                                CL-5 // RESTRICTED
                            </div>

                            <div>
                                ${escapeHTML(file.content)}
                            </div>

                            <br>

                            <button
                                class="divi64-vault-button"
                                data-vault-edit="${escapeHTML(file.id)}"
                            >
                                EDIT
                            </button>

                        </div>
                    `)
                    .join("");
        }

        controls?.classList.remove(
            "hidden"
        );

        editor?.classList.add(
            "hidden"
        );

        $("divi64VaultOverlay")
            ?.classList.remove("hidden");

        return;
    }


    /* SEALED */

    status.textContent =
        "VAULT SEALED.";

    auth.innerHTML = "";

    content.innerHTML = "";

    controls?.classList.add(
        "hidden"
    );

    editor?.classList.add(
        "hidden"
    );

    $("divi64VaultOverlay")
        ?.classList.add("hidden");
}


/* =========================================================
   VAULT TIME
========================================================= */

function formatVaultTime(milliseconds) {

    const total =
        Math.ceil(
            milliseconds / 1000
        );

    const minutes =
        Math.floor(total / 60);

    const seconds =
        total % 60;

    return (
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0")
    );
}


/* =========================================================
   VAULT EDITOR
========================================================= */

let vaultEditingId = null;


function openVaultEditor(id = null) {

    if (vaultState.mode !== "OPEN") {
        return;
    }

    vaultState.lastActivity =
        Date.now();

    vaultEditingId = id;

    const file =
        id
            ? vaultFiles.find(
                item => item.id === id
            )
            : null;

    $("divi64VaultTitle").value =
        file?.title || "";

    $("divi64VaultSubject").value =
        file?.subject || "";

    $("divi64VaultText").value =
        file?.content || "";

    $("divi64VaultEditor")
        ?.classList.remove("hidden");
}


function closeVaultEditor() {

    vaultEditingId = null;

    $("divi64VaultEditor")
        ?.classList.add("hidden");
}


function saveVaultFile() {

    if (vaultState.mode !== "OPEN") {
        return;
    }

    vaultState.lastActivity =
        Date.now();

    const title =
        $("divi64VaultTitle")
            ?.value
            .trim();

    const subject =
        $("divi64VaultSubject")
            ?.value
            .trim();

    const content =
        $("divi64VaultText")
            ?.value
            .trim();

    if (!title || !subject || !content) {

        notify(
            "VAULT",
            "All archive fields are required."
        );

        return;
    }

    if (vaultEditingId) {

        const file =
            vaultFiles.find(
                item =>
                    item.id ===
                    vaultEditingId
            );

        if (!file) return;

        file.title =
            title;

        file.subject =
            subject;

        file.content =
            content;

        file.modifiedBy =
            currentUser.id;

        file.modifiedAt =
            now();

        audit(
            "VAULT_FILE_MODIFIED",
            {
                id: file.id,
                executive: currentUser.id
            },
            "CRITICAL"
        );

    } else {

        const nextNumber =
            Math.max(
                0,
                ...vaultFiles.map(
                    file =>
                        parseInt(
                            file.id.replace(/\D/g, "")
                        ) || 0
                )
            ) + 1;

        const id =
            `VLT-${String(nextNumber)
                .padStart(4, "0")}`;

        vaultFiles.push({
            id,
            title,
            subject,
            content,
            classification: "CL-5 // RESTRICTED",
            createdBy: currentUser.id,
            createdAt: now()
        });

        audit(
            "VAULT_FILE_CREATED",
            {
                id,
                executive: currentUser.id
            },
            "CRITICAL"
        );
    }

    saveJSON(
        VAULT_STORAGE.files,
        vaultFiles
    );

    closeVaultEditor();
    renderVault();

    notify(
        "VAULT",
        "Restricted archive record saved."
    );
}


/* =========================================================
   VAULT CLOSE / ABORT
========================================================= */

function closeVault() {

    const previous =
        vaultState.mode;

    resetVaultAuthorization(
        "VAULT_SEALED"
    );

    $("divi64VaultOverlay")
        ?.classList.add("hidden");

    audit(
        "VAULT_SEALED",
        {
            previousState: previous
        },
        "CRITICAL"
    );
}


function abortVault() {

    if (
        !currentUser ||
        currentUser.id !== "COS"
    ) {

        denyPermission(
            "VAULT_ACCESS"
        );

        return;
    }

    resetVaultAuthorization(
        "COS_ABORT"
    );

    notify(
        "VAULT",
        "Vault sequence aborted by COS."
    );
}


/* =========================================================
   VAULT COMMAND
========================================================= */

function executeVaultCommand(argument) {

    const q =
        argument
            .trim()
            .toLowerCase();

    if (q === "access") {

        if (
            !requirePermission(
                "VAULT_ACCESS"
            )
        ) {
            return;
        }

        startVaultAuthorization();
        return;
    }

    if (q === "close") {

        if (
            vaultState.mode ===
            "OPEN"
        ) {
            closeVault();
            return;
        }

        terminalPrint(
            "VAULT IS NOT OPEN."
        );

        return;
    }

    if (q === "abort") {

        abortVault();
        return;
    }

    terminalPrint(
`VAULT COMMANDS

vault access
vault close
vault abort`
    );
}


/* =========================================================
   TERMINAL OVERRIDE
========================================================= */

executeTerminalCommand = function(input) {

    const raw =
        input.trim();

    if (!raw || !currentUser) {
        return;
    }

    terminalHistory.push(raw);

    terminalHistory =
        terminalHistory.slice(-200);

    saveJSON(
        STORAGE.history,
        terminalHistory
    );

    terminalHistoryIndex =
        terminalHistory.length;

    const profile =
        getSessionProfile();

    terminalPrint(
        `${profile.prompt} ${raw}`
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

            if ($("terminalOutput")) {
                $("terminalOutput").innerHTML = "";
            }

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
                `AUTHORITY ${currentUser.authority}\n` +
                `PROFILE: ${profile.designation}`
            );

            break;


        case "archives":
        case "files":

            if (!requirePermission(
                "ARCHIVE_READ"
            )) return;

            showPage("archives");

            terminalPrint(
                `${files.length} ARCHIVE RECORDS INDEXED.`
            );

            break;


        case "open":

            if (!requirePermission(
                "ARCHIVE_READ"
            )) return;

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

            if (!requirePermission(
                "ARCHIVE_READ"
            )) return;

            terminalPrint(
                searchArchivesFromQuery(
                    argument
                )
            );

            break;


        case "personnel":

            if (!requirePermission(
                "PERSONNEL_READ"
            )) return;

            showPage("personnel");

            break;


        case "operations":

            if (!requirePermission(
                "OPERATIONS_READ"
            )) return;

            showPage("operations");

            break;


        case "security":

            if (!requirePermission(
                "SECURITY_READ"
            )) return;

            showPage("security");

            break;


        case "decisions":

            if (!requirePermission(
                "DECISION_READ"
            )) return;

            showPage("decisions");

            break;


        case "audit":

            if (!requirePermission(
                "AUDIT_READ"
            )) return;

            showPage("audit");

            break;


        case "scenario":

            if (!requirePermission(
                "SCENARIO_START"
            )) return;

            startScenario();

            break;


        case "briefing":

            openBriefing();

            break;


        case "notifications":

            showNotifications();

            break;


        case "directive":

            if (!requirePermission(
                "DIRECTIVE_CREATE"
            )) return;

            terminalPrint(
                "DIRECTIVE INTERFACE READY."
            );

            break;


        case "order":

            if (!requirePermission(
                "ORDER_CREATE"
            )) return;

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
                `AUTHORITY: ${currentUser.authority}\n` +
                `PROFILE: ${profile.designation}`
            );

            break;


        case "health":

            terminalPrint(
                runDiagnostics()
            );

            break;


        case "rename":

            if (
                argument.toLowerCase() ===
                "kane"
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


        case "blackbox":

            if (!requirePermission(
                "BLACKBOX"
            )) return;

            openBlackBox();

            break;


        case "vault":

            executeVaultCommand(
                argument
            );

            break;


        case "kane":

            executeKaneTerminal(
                argument
            );

            break;


        case "logout":

            logout();

            break;


        default:

            terminalPrint(
                `UNKNOWN COMMAND: ${command}\n` +
                `TYPE "help" FOR COMMANDS.`
            );
    }
};


/* =========================================================
   TERMINAL HELP OVERRIDE
========================================================= */

terminalHelp = function() {

    const common =
`AVAILABLE COMMANDS

help
status
whoami
clear

archives
files
open <EM-ID>
search <term>

session
history
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

scenario
briefing
notifications`;

    const roleCommands = {

        LJD:
`
JUDICIAL COMMANDS

personnel
audit
security`,

        XO:
`
EXECUTIVE OPERATIONS

personnel
operations
security
decisions
killswitch`,

        CO:
`
COMMAND CONTROL

personnel
operations
security
decisions
directive
order
rename kane
killswitch`,

        COS:
`
OVERWATCH COMMANDS

personnel
operations
security
decisions
directive
order
rename kane
killswitch
blackbox
vault access
vault close
vault abort`
    };

    terminalPrint(
        common +
        (roleCommands[currentUser.id] || "")
    );
};


/* =========================================================
   SESSION INITIALIZATION OVERRIDE
========================================================= */

const ORIGINAL_INITIALIZE_APPLICATION =
    initializeApplication;

initializeApplication = function() {

    ORIGINAL_INITIALIZE_APPLICATION();

    updateAuthorityInterface();

    const profile =
        getSessionProfile();

    terminalPrint(
        `\n${profile.welcome}`
    );

    audit(
        "AUTHORITY_PROFILE_LOADED",
        {
            session: currentUser.id,
            profile: profile.designation
        }
    );
};


/* =========================================================
   KANE ACCESS TO VAULT
========================================================= */

/*
   KANE deliberately has no Vault commands.
   The Vault uses a completely separate storage key
   and is not included in KANE context or memory.
*/

const ORIGINAL_GET_SYSTEM_STATUS =
    getSystemStatusText;

getSystemStatusText = function() {

    const result =
        ORIGINAL_GET_SYSTEM_STATUS();

    if (
        vaultState.mode === "OPEN" ||
        vaultState.mode === "OPENING" ||
        vaultState.mode === "AUTHORIZING"
    ) {

        return (
            result +
            `\nVAULT: RESTRICTED\n` +
            `KANE VAULT ACCESS: NONE`
        );
    }

    return result;
};


/* =========================================================
   VAULT EVENT HANDLERS
========================================================= */

document.addEventListener(
    "click",
    event => {

        const authButton =
            event.target.closest(
                "[data-vault-authorize]"
            );

        if (authButton) {

            authorizeVaultExecutive(
                authButton.dataset.vaultAuthorize
            );

            return;
        }


        const editButton =
            event.target.closest(
                "[data-vault-edit]"
            );

        if (editButton) {

            openVaultEditor(
                editButton.dataset.vaultEdit
            );

            return;
        }
    }
);


/* =========================================================
   LOGOUT VAULT PROTECTION
========================================================= */

const ORIGINAL_LOGOUT =
    logout;

logout = function() {

    if (
        vaultState.mode !==
        "SEALED"
    ) {

        closeVault();
    }

    ORIGINAL_LOGOUT();
};


/* =========================================================
   AUTHORITY STATE REFRESH
========================================================= */

const ORIGINAL_UPDATE_IDENTITY =
    updateIdentity;

updateIdentity = function() {

    ORIGINAL_UPDATE_IDENTITY();

    updateAuthorityInterface();
};


/* =========================================================
   VAULT KEYBOARD LOCK
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            vaultState.mode === "OPENING" &&
            event.key !== "Escape"
        ) {

            /*
             * Main application remains visually blocked
             * by the Vault overlay during the opening sequence.
             */
        }
    }
);


/* =========================================================
   VAULT ACCESS FROM TERMINAL ONLY
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter" &&
            $("terminalInput") &&
            document.activeElement ===
            $("terminalInput")
        ) {

            /*
             * Existing terminal listener remains active.
             * executeTerminalCommand has been replaced above,
             * so "vault access" is now intercepted there.
             */
        }
    }
);


/* =========================================================
   INITIAL AUTHORITY PROFILE
========================================================= */

window.addEventListener(
    "load",
    () => {

        setTimeout(() => {

            if (currentUser) {
                updateAuthorityInterface();
            }

        }, 50);

    }
);


/* =========================================================
   END // EXECUTIVE AUTHORITY EXTENSION
========================================================= */
/* =========================================================
   DIVI-64 // VAULT SECURITY EXTENSION
   ADDITIVE LAYER // V1
   REQUIRES: EXECUTIVE AUTHORITY EXTENSION
========================================================= */

(() => {
    "use strict";

    /* =====================================================
       01 // STORAGE
    ===================================================== */

    const VAULT_SECURITY_STORAGE = {
        credential: "DIVI64_VAULT_CREDENTIAL_V1",
        security: "DIVI64_VAULT_SECURITY_V1"
    };

    const VAULT_ACCESS_LEVELS = {
        STANDARD: "STANDARD",
        RESTRICTED: "RESTRICTED",
        SEALED: "SEALED",
        ABSOLUTE: "ABSOLUTE"
    };

    const VAULT_CODE_LENGTH = 6;

    let vaultSecurity = loadJSON(
        VAULT_SECURITY_STORAGE.security,
        {
            credentialVerified: false,
            rotatingCode: null,
            rotatingCodeIssuedAt: null,
            securityChecks: [],
            blocked: false,
            lockdown: false,
            accessSessionId: null
        }
    );

    function saveVaultSecurity() {
        saveJSON(
            VAULT_SECURITY_STORAGE.security,
            vaultSecurity
        );
    }

    function vaultSecurityAudit(action, details = {}) {
        try {
            if (typeof addAuditEvent === "function") {
                addAuditEvent(
                    "VAULT_SECURITY",
                    action,
                    JSON.stringify(details)
                );
            }
        } catch (e) {}
    }


    /* =====================================================
       02 // CREDENTIAL
       Exclusive Vault credential.
       Stored as SHA-256 locally.
    ===================================================== */

    async function vaultHash(value) {
        const data = new TextEncoder().encode(value);

        const hash = await crypto.subtle.digest(
            "SHA-256",
            data
        );

        return Array.from(
            new Uint8Array(hash)
        )
            .map(b => b.toString(16).padStart(2, "0"))
            .join("");
    }

    async function vaultHasCredential() {
        return !!localStorage.getItem(
            VAULT_SECURITY_STORAGE.credential
        );
    }

    async function vaultSetupCredential() {

        if (await vaultHasCredential()) {
            return true;
        }

        if (!currentUser || currentUser.id !== "COS") {
            return false;
        }

        const first = prompt(
            "DIVI-64 // VAULT CREDENTIAL\n\n" +
            "No exclusive Vault credential has been configured.\n\n" +
            "Create a new Vault credential:"
        );

        if (!first || first.length < 6) {
            alert(
                "VAULT CREDENTIAL REJECTED.\n\n" +
                "Minimum length: 6 characters."
            );

            return false;
        }

        const second = prompt(
            "CONFIRM VAULT CREDENTIAL:"
        );

        if (first !== second) {
            alert(
                "VAULT CREDENTIAL MISMATCH."
            );

            return false;
        }

        const hash = await vaultHash(first);

        localStorage.setItem(
            VAULT_SECURITY_STORAGE.credential,
            hash
        );

        vaultSecurityAudit(
            "VAULT_CREDENTIAL_CREATED",
            {
                executive: "COS"
            }
        );

        return true;
    }


    async function verifyVaultCredential() {

        if (!currentUser || currentUser.id !== "COS") {
            return false;
        }

        if (!(await vaultHasCredential())) {
            const created =
                await vaultSetupCredential();

            if (!created) {
                return false;
            }
        }

        const input = prompt(
            "DIVI-64 // RESTRICTED VAULT\n\n" +
            "Enter exclusive Vault credential:"
        );

        if (!input) {
            return false;
        }

        const hash = await vaultHash(input);

        const stored =
            localStorage.getItem(
                VAULT_SECURITY_STORAGE.credential
            );

        if (hash !== stored) {

            vaultSecurityAudit(
                "VAULT_CREDENTIAL_FAILURE",
                {
                    executive:
                        currentUser?.id || "UNKNOWN"
                }
            );

            alert(
                "VAULT ACCESS DENIED.\n\n" +
                "Credential verification failed."
            );

            return false;
        }

        vaultSecurity.credentialVerified = true;

        vaultSecurityAudit(
            "VAULT_CREDENTIAL_VERIFIED",
            {
                executive: "COS"
            }
        );

        saveVaultSecurity();

        return true;
    }


    /* =====================================================
       03 // ROTATING 6-DIGIT ACCESS CODE
    ===================================================== */

    function generateVaultRotatingCode() {

        const code =
            Math.floor(
                100000 +
                Math.random() * 900000
            ).toString();

        vaultSecurity.rotatingCode = code;

        vaultSecurity.rotatingCodeIssuedAt =
            Date.now();

        saveVaultSecurity();

        vaultSecurityAudit(
            "ROTATING_CODE_GENERATED",
            {
                session:
                    vaultSecurity.accessSessionId
            }
        );

        return code;
    }


    function rotatingCodeIsValid() {

        if (!vaultSecurity.rotatingCode) {
            return false;
        }

        if (!vaultSecurity.rotatingCodeIssuedAt) {
            return false;
        }

        return true;
    }


    function verifyRotatingCode() {

        if (!rotatingCodeIsValid()) {
            return false;
        }

        const shown =
            vaultSecurity.rotatingCode;

        alert(
            "DIVI-64 // ROTATING AUTHORIZATION CODE\n\n" +
            "ACCESS CODE:\n\n" +
            shown +
            "\n\n" +
            "This code is valid for the current Vault authorization session."
        );

        const entered = prompt(
            "ENTER THE 6-DIGIT ROTATING CODE:"
        );

        if (
            !entered ||
            entered !== shown
        ) {

            vaultSecurityAudit(
                "ROTATING_CODE_FAILURE",
                {
                    executive:
                        currentUser?.id || "UNKNOWN"
                }
            );

            alert(
                "ROTATING CODE REJECTED."
            );

            return false;
        }

        vaultSecurityAudit(
            "ROTATING_CODE_VERIFIED",
            {
                executive: "COS"
            }
        );

        return true;
    }


    /* =====================================================
       04 // AUTOMATIC SECURITY CHECKS
    ===================================================== */

    function runVaultSecurityChecks() {

        const checks = [];

        checks.push({
            name: "COS_SESSION",
            passed:
                !!currentUser &&
                currentUser.id === "COS"
        });

        checks.push({
            name: "CLEARANCE_LEVEL",
            passed:
                !!currentUser &&
                Number(currentUser.clearance) === 5
        });

        checks.push({
            name: "VAULT_PERMISSION",
            passed:
                typeof hasPermission === "function" &&
                hasPermission("VAULT_ACCESS")
        });

        checks.push({
            name: "VAULT_BLOCKED",
            passed:
                vaultSecurity.blocked !== true
        });

        checks.push({
            name: "LOCKDOWN",
            passed:
                vaultSecurity.lockdown !== true
        });

        checks.push({
            name: "AUTH_SEQUENCE",
            passed:
                Array.isArray(VAULT_AUTH_SEQUENCE) &&
                VAULT_AUTH_SEQUENCE.length === 4
        });

        checks.push({
            name: "VAULT_STORAGE",
            passed:
                Array.isArray(vaultFiles)
        });

        checks.push({
            name: "SECURITY_STATE",
            passed:
                !!vaultSecurity &&
                typeof vaultSecurity === "object"
        });

        vaultSecurity.securityChecks =
            checks;

        saveVaultSecurity();

        const failed =
            checks.filter(
                check => !check.passed
            );

        if (failed.length) {

            vaultSecurityAudit(
                "AUTOMATIC_SECURITY_CHECK_FAILURE",
                {
                    failed:
                        failed.map(
                            item => item.name
                        )
                }
            );

            return false;
        }

        vaultSecurityAudit(
            "AUTOMATIC_SECURITY_CHECKS_PASSED",
            {
                count: checks.length
            }
        );

        return true;
    }


    /* =====================================================
       05 // VAULT LOCK
    ===================================================== */

    function lockVaultImmediately() {

        vaultSecurity.blocked = true;
        vaultSecurity.credentialVerified = false;
        vaultSecurity.rotatingCode = null;
        vaultSecurity.rotatingCodeIssuedAt = null;
        vaultSecurity.accessSessionId = null;

        saveVaultSecurity();

        if (
            typeof resetVaultAuthorization ===
            "function"
        ) {
            resetVaultAuthorization(
                "VAULT LOCK ACTIVATED"
            );
        }

        vaultSecurityAudit(
            "VAULT_LOCK",
            {
                executive:
                    currentUser?.id || "UNKNOWN"
            }
        );

        if (
            typeof notify === "function"
        ) {
            notify(
                "VAULT LOCK ACTIVE. FULL AUTHORIZATION REQUIRED."
            );
        } else {
            alert(
                "VAULT LOCK ACTIVE.\n\n" +
                "All active authorization has been revoked."
            );
        }
    }


    function unlockVaultSecurity() {

        if (
            !currentUser ||
            currentUser.id !== "COS"
        ) {
            return false;
        }

        if (!vaultSecurity.blocked) {
            return true;
        }

        const confirmed =
            confirm(
                "VAULT LOCK\n\n" +
                "COS authorization required to clear the security lock.\n\n" +
                "Restart the complete Vault authorization sequence?"
            );

        if (!confirmed) {
            return false;
        }

        vaultSecurity.blocked = false;
        vaultSecurity.lockdown = false;
        vaultSecurity.credentialVerified = false;

        saveVaultSecurity();

        vaultSecurityAudit(
            "VAULT_LOCK_CLEARED",
            {
                executive: "COS"
            }
        );

        return true;
    }


    /* =====================================================
       06 // TWO INITIAL VLT FILES
    ===================================================== */

    function initializeRestrictedVaultFiles() {

        if (!Array.isArray(vaultFiles)) {
            vaultFiles = [];
        }

        if (vaultFiles.length > 0) {
            return;
        }

        vaultFiles = [

            {
                id: "VLT-0001",
                title:
                    "KANE // FULL CAPABILITY ASSESSMENT",
                subject:
                    "Executive evaluation of KANE's theoretical operational potential.",
                classification:
                    "CL-5 // RESTRICTED",
                accessLevel:
                    VAULT_ACCESS_LEVELS.RESTRICTED,
                language:
                    "EN",

                content:
                    "EXECUTIVE ASSESSMENT\n\n" +
                    "KANE demonstrates a projected capability profile extending beyond ordinary executive-assistance functions.\n\n" +
                    "The current assessment identifies advanced analytical synthesis, contextual reasoning, scenario evaluation and autonomous information structuring as the principal capability domains.\n\n" +
                    "KANE MODEL STATUS: HIGH POTENTIAL\n" +
                    "EXECUTIVE CONFIDENCE: 91.8%\n\n" +
                    "The assessment concerns modeled system capability and does not constitute an external certification.",

                contentES:
                    "EVALUACIÓN EJECUTIVA\n\n" +
                    "KANE presenta un perfil de capacidades proyectado que supera las funciones ordinarias de asistencia ejecutiva.\n\n" +
                    "La evaluación identifica como principales dominios la síntesis analítica, el razonamiento contextual, la evaluación de escenarios y la estructuración autónoma de información.\n\n" +
                    "ESTADO DEL MODELO KANE: ALTO POTENCIAL\n" +
                    "CONFIANZA EJECUTIVA: 91,8 %\n\n" +
                    "La evaluación se refiere a capacidades modeladas del sistema y no constituye una certificación externa.",

                createdBy: "SYSTEM",
                createdAt: new Date().toISOString()
            },

            {
                id: "VLT-0002",
                title:
                    "KANE // THERAPEUTIC MODEL ASSESSMENT",
                subject:
                    "KANE-generated theoretical assessment concerning therapeutic modeling.",
                classification:
                    "CL-5 // RESTRICTED",
                accessLevel:
                    VAULT_ACCESS_LEVELS.SEALED,
                language:
                    "EN",

                content:
                    "EXECUTIVE RESTRICTED ASSESSMENT\n\n" +
                    "KANE identified a theoretical therapeutic model through internal analytical synthesis.\n\n" +
                    "MODEL PROJECTION: 86.4%\n\n" +
                    "The percentage represents KANE's internal model projection under its defined assumptions. It is NOT a clinical success rate and must not be interpreted as evidence of a real treatment outcome.\n\n" +
                    "The record intentionally excludes operational medical procedures, formulas, dosages and laboratory instructions.\n\n" +
                    "STATUS: RESTRICTED EXECUTIVE REVIEW.",

                contentES:
                    "EVALUACIÓN EJECUTIVA RESTRINGIDA\n\n" +
                    "KANE identificó un modelo terapéutico teórico mediante síntesis analítica interna.\n\n" +
                    "PROYECCIÓN DEL MODELO: 86,4 %\n\n" +
                    "El porcentaje representa la proyección interna de KANE bajo sus supuestos definidos. NO constituye una tasa clínica de éxito ni debe interpretarse como evidencia de un tratamiento real.\n\n" +
                    "El registro excluye deliberadamente procedimientos médicos operativos, fórmulas, dosis e instrucciones de laboratorio.\n\n" +
                    "ESTADO: REVISIÓN EJECUTIVA RESTRINGIDA.",

                createdBy: "SYSTEM",
                createdAt: new Date().toISOString()
            }
        ];

        saveJSON(
            VAULT_STORAGE.files,
            vaultFiles
        );

        vaultSecurityAudit(
            "INITIAL_VLT_RECORDS_CREATED",
            {
                records: [
                    "VLT-0001",
                    "VLT-0002"
                ]
            }
        );
    }


    initializeRestrictedVaultFiles();


    /* =====================================================
       07 // ACCESS LEVEL REAUTHORIZATION
    ===================================================== */

    async function requestVaultReauthorization(
        file,
        action = "READ"
    ) {

        if (
            !file ||
            !currentUser ||
            currentUser.id !== "COS"
        ) {
            return false;
        }

        if (
            file.accessLevel ===
            VAULT_ACCESS_LEVELS.STANDARD
        ) {
            return true;
        }

        if (
            !(await verifyVaultCredential())
        ) {
            return false;
        }

        if (!verifyRotatingCode()) {
            return false;
        }

        if (
            file.accessLevel ===
            VAULT_ACCESS_LEVELS.SEALED
        ) {

            const sealed =
                prompt(
                    "SEALED RECORD AUTHORIZATION\n\n" +
                    "Enter confirmation phrase:"
                );

            if (
                sealed !==
                "D64-SEALED-AUTH"
            ) {

                vaultSecurityAudit(
                    "SEALED_REAUTH_FAILURE",
                    {
                        file:
                            file.id
                    }
                );

                alert(
                    "SEALED AUTHORIZATION DENIED."
                );

                return false;
            }
        }

        if (
            file.accessLevel ===
                VAULT_ACCESS_LEVELS.ABSOLUTE &&
            action === "MODIFY"
        ) {

            const first =
                prompt(
                    "ABSOLUTE AUTHORIZATION\n\n" +
                    "Enter authorization from Executive 1:"
                );

            const second =
                prompt(
                    "ABSOLUTE AUTHORIZATION\n\n" +
                    "Enter authorization from Executive 2:"
                );

            const validExecutives =
                Object.keys(EXECUTIVES || {});

            let firstValid = null;
            let secondValid = null;

            for (const id of validExecutives) {

                if (
                    EXECUTIVES[id] &&
                    EXECUTIVES[id].password === first
                ) {
                    firstValid = id;
                }

                if (
                    EXECUTIVES[id] &&
                    EXECUTIVES[id].password === second
                ) {
                    secondValid = id;
                }
            }

            if (
                !firstValid ||
                !secondValid ||
                firstValid === secondValid
            ) {

                vaultSecurityAudit(
                    "ABSOLUTE_DUAL_AUTH_FAILURE",
                    {
                        file:
                            file.id
                    }
                );

                alert(
                    "ABSOLUTE AUTHORIZATION DENIED."
                );

                return false;
            }

            vaultSecurityAudit(
                "ABSOLUTE_DUAL_AUTH_PASSED",
                {
                    file:
                        file.id,
                    executives: [
                        firstValid,
                        secondValid
                    ]
                }
            );
        }

        vaultSecurityAudit(
            "VAULT_REAUTHORIZATION_PASSED",
            {
                file:
                    file.id,
                level:
                    file.accessLevel,
                action
            }
        );

        return true;
    }


    /* =====================================================
       08 // START AUTHORIZATION WRAPPER
    ===================================================== */

    const _baseStartVaultAuthorization =
        startVaultAuthorization;

    startVaultAuthorization = async function () {

        if (
            !currentUser ||
            currentUser.id !== "COS"
        ) {
            return denyPermission(
                "VAULT_ACCESS"
            );
        }

        if (!unlockVaultSecurity()) {
            return;
        }

        if (!runVaultSecurityChecks()) {
            alert(
                "VAULT SECURITY CHECK FAILED.\n\n" +
                "Access sequence cannot begin."
            );
            return;
        }

        if (
            !(await verifyVaultCredential())
        ) {
            return;
        }

        vaultSecurity.accessSessionId =
            "VLT-" +
            Date.now().toString(36).toUpperCase();

        generateVaultRotatingCode();

        saveVaultSecurity();

        /*
         * The base extension now performs:
         * LJD → XO → CO → COS
         */
        _baseStartVaultAuthorization();

        vaultSecurityAudit(
            "VAULT_SECURITY_GATE_PASSED",
            {
                session:
                    vaultSecurity.accessSessionId
            }
        );
    };


    /* =====================================================
       09 // FINAL COS AUTHORIZATION WRAPPER
    ===================================================== */

    const _baseAuthorizeVaultExecutive =
        authorizeVaultExecutive;

    authorizeVaultExecutive =
        async function (id) {

            if (
                id === "LJD" &&
                !vaultSecurity.credentialVerified
            ) {
                alert(
                    "VAULT SECURITY GATE NOT VERIFIED."
                );
                return;
            }

            return _baseAuthorizeVaultExecutive(id);
        };


    /* =====================================================
       10 // OPEN VAULT WRAPPER
    ===================================================== */

    const _baseOpenVault =
        openVault;

    openVault = function () {

        if (!runVaultSecurityChecks()) {

            alert(
                "AUTOMATIC SECURITY CHECK FAILED.\n\n" +
                "Vault opening cancelled."
            );

            return;
        }

        if (
            !vaultSecurity.credentialVerified
        ) {
            alert(
                "VAULT CREDENTIAL VERIFICATION REQUIRED."
            );
            return;
        }

        if (
            !rotatingCodeIsValid()
        ) {
            alert(
                "ROTATING ACCESS CODE INVALID."
            );
            return;
        }

        _baseOpenVault();

        vaultSecurityAudit(
            "VAULT_SECURITY_SESSION_ACTIVE",
            {
                session:
                    vaultSecurity.accessSessionId
            }
        );
    };


    /* =====================================================
       11 // FILE ACCESS CONTROLLER
    ===================================================== */

    let vaultCurrentLanguage = "EN";

    function getVaultFile(id) {
        return vaultFiles.find(
            file => file.id === id
        );
    }


    function vaultFileAccessButton(
        file
    ) {

        const button =
            document.createElement("button");

        button.className =
            "divi64-vault-button";

        button.textContent =
            "OPEN RECORD";

        button.addEventListener(
            "click",
            async () => {

                if (
                    file.accessLevel !==
                    VAULT_ACCESS_LEVELS.STANDARD
                ) {

                    const allowed =
                        await requestVaultReauthorization(
                            file,
                            "READ"
                        );

                    if (!allowed) {
                        return;
                    }
                }

                showVaultRecord(file);
            }
        );

        return button;
    }


    async function showVaultRecord(
        file
    ) {

        if (!file) {
            return;
        }

        const content =
            vaultCurrentLanguage === "ES" &&
            file.contentES
                ? file.contentES
                : file.content;

        const contentBox =
            document.getElementById(
                "divi64VaultContent"
            );

        if (!contentBox) {
            return;
        }

        contentBox.innerHTML = "";

        const record =
            document.createElement("div");

        record.className =
            "divi64-vault-file";

        record.innerHTML = `
            <div>
                <strong>${escapeHTML(file.id)}</strong>
            </div>

            <div>
                ${escapeHTML(file.title)}
            </div>

            <div>
                SUBJECT:
                ${escapeHTML(file.subject)}
            </div>

            <div>
                CLASSIFICATION:
                ${escapeHTML(file.classification)}
            </div>

            <div>
                ACCESS LEVEL:
                ${escapeHTML(file.accessLevel)}
            </div>

            <hr>

            <pre>${escapeHTML(content)}</pre>

            <div
                class="divi64-vault-line"
                data-vlt-actions
            ></div>
        `;

        contentBox.appendChild(record);

        const actions =
            record.querySelector(
                "[data-vlt-actions]"
            );

        if (
            file.contentES
        ) {

            const translate =
                document.createElement("button");

            translate.className =
                "divi64-vault-button";

            translate.textContent =
                vaultCurrentLanguage === "EN"
                    ? "TRANSLATE TO SPANISH"
                    : "VIEW ENGLISH";

            translate.addEventListener(
                "click",
                () => {

                    vaultCurrentLanguage =
                        vaultCurrentLanguage === "EN"
                            ? "ES"
                            : "EN";

                    showVaultRecord(file);
                }
            );

            actions.appendChild(
                translate
            );
        }

        if (
            file.accessLevel ===
                VAULT_ACCESS_LEVELS.ABSOLUTE ||
            file.accessLevel ===
                VAULT_ACCESS_LEVELS.SEALED ||
            file.accessLevel ===
                VAULT_ACCESS_LEVELS.RESTRICTED
        ) {

            const edit =
                document.createElement("button");

            edit.className =
                "divi64-vault-button";

            edit.textContent =
                "MODIFY RECORD";

            edit.addEventListener(
                "click",
                async () => {

                    const allowed =
                        await requestVaultReauthorization(
                            file,
                            "MODIFY"
                        );

                    if (!allowed) {
                        return;
                    }

                    openVaultEditor(
                        file.id
                    );
                }
            );

            actions.appendChild(
                edit
            );
        }

        vaultSecurityAudit(
            "VLT_RECORD_OPENED",
            {
                file:
                    file.id,
                language:
                    vaultCurrentLanguage
            }
        );
    }


    /* =====================================================
       12 // SECURE VAULT RENDERING
    ===================================================== */

    const _baseRenderVault =
        renderVault;

    renderVault = function () {

        _baseRenderVault();

        if (
            typeof vaultState === "undefined" ||
            vaultState.mode !== "OPEN"
        ) {
            return;
        }

        const content =
            document.getElementById(
                "divi64VaultContent"
            );

        if (!content) {
            return;
        }

        content.innerHTML = "";

        if (!vaultFiles.length) {

            content.innerHTML =
                `<div class="divi64-vault-status">
                    NO EXECUTIVE RECORDS PRESENT.
                </div>`;

            return;
        }

        vaultFiles.forEach(
            file => {

                const card =
                    document.createElement("div");

                card.className =
                    "divi64-vault-file";

                card.innerHTML = `
                    <div>
                        <strong>
                            ${escapeHTML(file.id)}
                        </strong>
                    </div>

                    <div>
                        ${escapeHTML(file.title)}
                    </div>

                    <div>
                        SUBJECT:
                        ${escapeHTML(file.subject)}
                    </div>

                    <div>
                        ACCESS:
                        ${escapeHTML(file.accessLevel)}
                    </div>

                    <div
                        class="divi64-vault-line"
                        data-vlt-action-area
                    ></div>
                `;

                const actionArea =
                    card.querySelector(
                        "[data-vlt-action-area]"
                    );

                actionArea.appendChild(
                    vaultFileAccessButton(file)
                );

                content.appendChild(card);
            }
        );
    };


    /* =====================================================
       13 // TERMINAL COMMAND EXTENSION
    ===================================================== */

    const _baseExecuteVaultCommand =
        executeVaultCommand;

    executeVaultCommand =
        function (argument) {

            const command =
                String(argument || "")
                    .trim()
                    .toLowerCase();

            if (command === "lock") {

                if (
                    !currentUser ||
                    currentUser.id !== "COS"
                ) {
                    return denyPermission(
                        "SYSTEM_OVERRIDE"
                    );
                }

                lockVaultImmediately();
                return;
            }

            if (command === "security") {

                if (
                    !currentUser ||
                    currentUser.id !== "COS"
                ) {
                    return denyPermission(
                        "VAULT_ACCESS"
                    );
                }

                const passed =
                    runVaultSecurityChecks();

                const output =
                    passed
                        ? "VAULT SECURITY: ALL CHECKS PASSED."
                        : "VAULT SECURITY: CHECK FAILURE DETECTED.";

                if (
                    typeof appendTerminalOutput ===
                    "function"
                ) {
                    appendTerminalOutput(
                        output
                    );
                } else {
                    alert(output);
                }

                return;
            }

            return _baseExecuteVaultCommand(
                argument
            );
        };


    /* =====================================================
       14 // EXTENDED TERMINAL HELP
    ===================================================== */

    const _baseTerminalHelp =
        terminalHelp;

    terminalHelp = function () {

        const original =
            _baseTerminalHelp();

        if (
            currentUser &&
            currentUser.id === "COS"
        ) {

            return original +
                `

VAULT SECURITY

vault security
vault lock
vault access
vault close
vault abort
`;
        }

        return original;
    };


    /* =====================================================
       15 // LOGOUT SECURITY CLEANUP
    ===================================================== */

    const _baseLogout =
        logout;

    logout = function () {

        vaultSecurity.credentialVerified =
            false;

        vaultSecurity.rotatingCode =
            null;

        vaultSecurity.rotatingCodeIssuedAt =
            null;

        vaultSecurity.accessSessionId =
            null;

        saveVaultSecurity();

        _baseLogout();
    };


    /* =====================================================
       16 // SESSION CHANGE CLEANUP
    ===================================================== */

    if (
        typeof updateIdentity ===
        "function"
    ) {

        const _baseUpdateIdentity =
            updateIdentity;

        updateIdentity = function () {

            vaultSecurity.credentialVerified =
                false;

            vaultSecurity.rotatingCode =
                null;

            vaultSecurity.rotatingCodeIssuedAt =
                null;

            saveVaultSecurity();

            return _baseUpdateIdentity();
        };
    }


    /* =====================================================
       17 // BASIC HTML ESCAPE
    ===================================================== */

    function escapeHTML(value) {

        return String(value ?? "")
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );
    }


    /* =====================================================
       18 // INITIAL SECURITY STATE
    ===================================================== */

    vaultSecurity.credentialVerified =
        false;

    vaultSecurity.rotatingCode =
        null;

    vaultSecurity.rotatingCodeIssuedAt =
        null;

    saveVaultSecurity();

    vaultSecurityAudit(
        "VAULT_SECURITY_EXTENSION_LOADED",
        {
            version: "V1"
        }
    );

})();

/* =========================================================
   END // VAULT SECURITY EXTENSION
========================================================= */
const VAULT_PHRASE = "scp19315overseer";
