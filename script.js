/* =========================================================
   DIVI-64 // EXECUTIVE MANAGEMENT V2
   KANE AI CORE
   LOCAL EXECUTIVE SYSTEM
   ========================================================= */

"use strict";

/* =========================
   CONFIGURATION
   ========================= */

const ACCOUNTS = {
    LJD: { password: "LJD-64", name: "LJD", authority: 2 },
    XO:  { password: "XO-64",  name: "XO",  authority: 3 },
    CO:  { password: "CO-64",  name: "CO",  authority: 4 },
    COS: { password: "COS-64", name: "COS", authority: 5 }
};

const STORAGE = {
    files: "DIVI64_EM_FILES_V2",
    audit: "DIVI64_EM_AUDIT_V2",
    kaneName: "DIVI64_KANE_NAME_V2"
};

let currentUser = null;
let currentSession = null;
let kaneContext = [];

/* =========================
   BUILT-IN EXECUTIVE FILES
   ========================= */

const BUILTIN_FILES = {
    "EM-001": {
        title: "Executive Management Charter",
        classification: "CL-5 // OVERWATCH",
        content:
`DIVI-64 EXECUTIVE MANAGEMENT CHARTER

This document establishes the Executive Management structure of DIVI-64.

Executive authority is organized through four recognized executive sessions:

LJD
XO
CO
COS

The COS position constitutes the highest executive authority.

All executive decisions, directives and restricted actions are subject to the authority hierarchy established by DIVI-64.

STATUS:
ACTIVE`
    },

    "EM-002": {
        title: "Executive Authority Protocol",
        classification: "CL-5 // OVERWATCH",
        content:
`EXECUTIVE AUTHORITY PROTOCOL

Authority is assigned according to executive clearance.

LJD // AUTHORITY 2
XO  // AUTHORITY 3
CO  // AUTHORITY 4
COS // AUTHORITY 5

Higher authority may review operations conducted by lower executive sessions.

Certain operations remain restricted to specifically designated sessions regardless of general clearance.`
    },

    "EM-003": {
        title: "Executive Personnel Registry",
        classification: "CL-5 // OVERWATCH",
        content:
`EXECUTIVE PERSONNEL REGISTRY

LJD
Executive Management Liaison

XO
Executive Officer

CO
Command Officer

COS
Chief Executive Overseer

Registry classification:
CL-5 // OVERWATCH`
    },

    "EM-004": {
        title: "Executive Chain of Command",
        classification: "CL-5 // OVERWATCH",
        content:
`EXECUTIVE CHAIN OF COMMAND

LEVEL 5
COS // CHIEF EXECUTIVE OVERSEER

LEVEL 4
CO // COMMAND OFFICER

LEVEL 3
XO // EXECUTIVE OFFICER

LEVEL 2
LJD // EXECUTIVE MANAGEMENT LIAISON

The hierarchy determines authorization for restricted executive operations.`
    },

    "EM-005": {
        title: "Executive Voting Protocol",
        classification: "CL-5 // OVERWATCH",
        content:
`EXECUTIVE VOTING PROTOCOL

Executive votes may be initiated by authorized executive personnel.

Voting records are stored locally within the Executive Management archive.

Each vote must record:

- Initiating authority
- Subject
- Available decisions
- Participating executives
- Final result
- Timestamp

COS authority may supersede standard executive voting procedures when required.`
    },

    "EM-006": {
        title: "Emergency Executive Protocol",
        classification: "CL-5 // OVERWATCH",
        content:
`EMERGENCY EXECUTIVE PROTOCOL

In the event of a critical executive incident, the following sequence applies:

1. Confirm incident.
2. Identify affected systems.
3. Restrict unnecessary access.
4. Notify appropriate executive authority.
5. Record all actions.
6. Preserve audit information.

Emergency actions must remain traceable through the Executive Audit System.`
    },

    "EM-007": {
        title: "Executive Security Regulations",
        classification: "CL-5 // OVERWATCH",
        content:
`EXECUTIVE SECURITY REGULATIONS

All executive sessions are required to maintain operational security.

Authentication credentials must not be disclosed.

Restricted records must only be accessed by authorized personnel.

All sensitive operations must generate an audit event.

Unauthorized modification of executive records is prohibited.`
    },

    "EM-008": {
        title: "Clearance Authority Directive",
        classification: "CL-5 // OVERWATCH",
        content:
`CLEARANCE AUTHORITY DIRECTIVE

Clearance determines access to restricted executive operations.

CL-2
Basic executive access.

CL-3
Expanded executive access.

CL-4
Command-level access.

CL-5
OVERWATCH authority.

Special restrictions may apply to individual operations regardless of clearance.`
    },

    "EM-009": {
        title: "Executive Disciplinary Authority",
        classification: "CL-5 // OVERWATCH",
        content:
`EXECUTIVE DISCIPLINARY AUTHORITY

Executive personnel may be subject to disciplinary review following violations of DIVI-64 regulations.

Disciplinary actions must be documented.

The Executive Audit System must preserve the event record.

Final authority depends upon the classification and severity of the incident.`
    },

    "EM-010": {
        title: "Executive Communications Protocol",
        classification: "CL-5 // OVERWATCH",
        content:
`EXECUTIVE COMMUNICATIONS PROTOCOL

Executive communications must remain clear, concise and attributable.

Official communications may be stored as executive records.

Sensitive information must only be transmitted to authorized personnel.

KANE AI CORE communications are considered system-generated executive assistance and do not replace executive authority.`
    },

    "EM-011": {
        title: "Executive Archives Access Directive",
        classification: "CL-5 // OVERWATCH",
        content:
`EXECUTIVE ARCHIVES ACCESS DIRECTIVE

Executive archive records are classified as CL-5 // OVERWATCH.

Access requires an authenticated executive session.

Opening, searching and creating restricted records may generate audit events.

Archive integrity must be preserved.`
    },

    "EM-012": {
        title: "Executive Succession Directive",
        classification: "CL-5 // OVERWATCH",
        content:
`EXECUTIVE SUCCESSION DIRECTIVE

The executive hierarchy shall remain operational during temporary absence of individual executive personnel.

Succession procedures are determined by executive authority.

COS retains final authority regarding succession decisions.`
    }
};

/* =========================
   DOM HELPERS
   ========================= */

const $ = id => document.getElementById(id);

function escapeHTML(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function timestamp() {
    return new Date().toLocaleString("en-GB", {
        hour12: false
    });
}

/* =========================
   LOCAL STORAGE
   ========================= */

function loadJSON(key, fallback) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
    } catch {
        return fallback;
    }
}

function saveJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getFiles() {
    return loadJSON(STORAGE.files, []);
}

function getAudit() {
    return loadJSON(STORAGE.audit, []);
}

function getKaneName() {
    return localStorage.getItem(STORAGE.kaneName) || "KANE";
}

function setKaneName(name) {
    localStorage.setItem(STORAGE.kaneName, name);
}

/* =========================
   AUDIT SYSTEM
   ========================= */

function audit(action, details = "") {
    const logs = getAudit();

    logs.unshift({
        timestamp: timestamp(),
        user: currentSession || "SYSTEM",
        action,
        details
    });

    saveJSON(STORAGE.audit, logs.slice(0, 500));
}

/* =========================
   BOOT
   ========================= */

function bootSystem() {
    const bootScreen = $("bootScreen");
    const status = $("bootStatus");
    const percent = $("bootPercent");
    const progress = $("bootProgress");
    const message = $("bootMessage");

    if (!bootScreen) return;

    let p = 0;

    const interval = setInterval(() => {
        p += Math.floor(Math.random() * 8) + 4;

        if (p > 100) p = 100;

        if (percent) percent.textContent = p + "%";
        if (progress) progress.style.width = p + "%";

        if (p < 25) {
            if (status) status.textContent = "INITIALIZING EXECUTIVE CORE";
            if (message) message.textContent = "Loading core systems...";
        } else if (p < 50) {
            if (status) status.textContent = "VERIFYING ARCHIVE INTEGRITY";
            if (message) message.textContent = "Checking executive records...";
        } else if (p < 75) {
            if (status) status.textContent = "INITIALIZING KANE AI CORE";
            if (message) message.textContent = "Loading intelligence core...";
        } else {
            if (status) status.textContent = "ESTABLISHING SECURE SESSION";
            if (message) message.textContent = "Preparing authentication interface...";
        }

        if (p >= 100) {
            clearInterval(interval);

            setTimeout(() => {
                bootScreen.style.display = "none";

                const login = $("loginScreen");
                if (login) login.style.display = "flex";

                updateKaneInterface();
            }, 500);
        }
    }, 120);
}

/* =========================
   LOGIN
   ========================= */

function setupLogin() {
    const form = $("loginForm");

    if (!form) return;

    form.addEventListener("submit", e => {
        e.preventDefault();

        const username = $("username").value.trim().toUpperCase();
        const password = $("password").value;

        const account = ACCOUNTS[username];

        if (!account || account.password !== password) {
            $("loginMessage").textContent =
                "ACCESS DENIED // INVALID EXECUTIVE CREDENTIALS";

            audit("LOGIN_FAILED", username);

            return;
        }

        currentUser = username;

        $("loginMessage").textContent =
            "AUTHENTICATION ACCEPTED // SELECT EXECUTIVE SESSION";

        audit("LOGIN_SUCCESS", username);

        setTimeout(() => {
            $("loginScreen").style.display = "none";
            $("sessionScreen").style.display = "flex";
        }, 500);
    });
}

/* =========================
   SESSION SELECTION
   ========================= */

function setupSessions() {
    document.querySelectorAll(".sessionButton").forEach(button => {
        button.addEventListener("click", () => {
            const session = button.dataset.session;

            if (session !== currentUser) {
                alert("SESSION REJECTED // AUTHENTICATED IDENTITY MISMATCH");
                audit("SESSION_REJECTED", session);
                return;
            }

            currentSession = session;

            $("sessionScreen").style.display = "none";
            $("terminalScreen").style.display = "flex";

            updateTerminal();

            audit("SESSION_STARTED", session);

            printTerminal(
                `EXECUTIVE SESSION ESTABLISHED: ${session}`,
                "system"
            );

            printTerminal(
                getWelcomeMessage(session),
                "system"
            );

            kaneSay(
                `Executive session ${session} established. Intelligence core is online.`
            );
        });
    });
}

function getWelcomeMessage(session) {
    const messages = {
        LJD:
            "Welcome, LJD. Executive Management Liaison session recognized.",
        XO:
            "Welcome, XO. Executive Officer session recognized.",
        CO:
            "Welcome, CO. Command Officer session recognized.",
        COS:
            "Welcome, COS. Chief Executive Overseer session recognized."
    };

    return messages[session] || "Executive session recognized.";
}

/* =========================
   TERMINAL
   ========================= */

function setupTerminal() {
    const form = $("commandForm");

    if (!form) return;

    form.addEventListener("submit", e => {
        e.preventDefault();

        const input = $("commandInput");
        const command = input.value.trim();

        if (!command) return;

        printTerminal(
            `${currentSession}@EM:~$ ${escapeHTML(command)}`,
            "command"
        );

        input.value = "";

        executeCommand(command);
    });
}

function printTerminal(text, type = "") {
    const output = $("terminalOutput");

    if (!output) return;

    const line = document.createElement("div");

    line.className = `terminalLine ${type}`;
    line.innerHTML = text;

    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
}

/* =========================
   COMMAND ENGINE
   ========================= */

function executeCommand(raw) {
    const parts = raw.trim().split(/\s+/);
    const command = parts.shift().toLowerCase();
    const argument = parts.join(" ").trim();

    switch (command) {

        case "help":
            commandHelp();
            break;

        case "clear":
            $("terminalOutput").innerHTML = "";
            break;

        case "status":
            commandStatus();
            break;

        case "archives":
            commandArchives();
            break;

        case "open":
            commandOpen(argument);
            break;

        case "create":
            createFile();
            break;

        case "search":
            searchFiles(argument);
            break;

        case "personnel":
            commandPersonnel();
            break;

        case "directives":
            commandDirectives();
            break;

        case "audit":
            commandAudit();
            break;

        case "system":
            commandSystem();
            break;

        case "whoami":
            commandWhoami();
            break;

        case "ask":
            if (!argument) {
                printTerminal("USAGE: ask <query>", "error");
            } else {
                processKane(argument);
            }
            break;

        case "ai":
        case "kane":
        case "teto":
            focusAI();
            break;

        case "analyze":
            analyzeFile(argument);
            break;

        case "summarize":
            summarizeFile(argument);
            break;

        case "diagnostics":
            diagnostics();
            break;

        case "rename-ai":
            renameKane(argument);
            break;

        case "logout":
            logout();
            break;

        default:
            processKane(raw);
            break;
    }
}

/* =========================
   HELP
   ========================= */

function commandHelp() {
    printTerminal(
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
audit
system
whoami

ask <query>
ai
analyze <ID>
summarize <ID>
diagnostics

rename-ai <name>
logout`,
        "system"
    );
}

/* =========================
   STATUS
   ========================= */

function commandStatus() {
    const files = getFiles();
    const auditLogs = getAudit();

    printTerminal(
`DIVI-64 EXECUTIVE MANAGEMENT STATUS

MAINFRAME       ONLINE
EXECUTIVE CORE  ONLINE
KANE AI CORE    ONLINE
ARCHIVE SYSTEM  ONLINE
AUDIT SYSTEM    ONLINE

CUSTOM FILES    ${files.length}
AUDIT EVENTS    ${auditLogs.length}
ACTIVE SESSION  ${currentSession}
AUTHORITY       CL-${ACCOUNTS[currentSession].authority}`,
        "system"
    );
}

/* =========================
   ARCHIVES
   ========================= */

function commandArchives() {
    const custom = getFiles();

    printTerminal("EXECUTIVE ARCHIVES // CL-5", "system");

    Object.entries(BUILTIN_FILES).forEach(([id, file]) => {
        printTerminal(
            `${id} // ${file.title} // ${file.classification}`
        );
    });

    custom.forEach(file => {
        printTerminal(
            `${file.id} // ${file.title} // ${file.classification} // CUSTOM`
        );
    });
}

/* =========================
   OPEN FILE
   ========================= */

function commandOpen(id) {
    if (!id) {
        printTerminal("USAGE: open <ID>", "error");
        return;
    }

    id = id.toUpperCase();

    let file = BUILTIN_FILES[id];

    if (!file) {
        file = getFiles().find(f => f.id.toUpperCase() === id);
    }

    if (!file) {
        printTerminal(`FILE NOT FOUND // ${escapeHTML(id)}`, "error");
        return;
    }

    audit("FILE_OPENED", id);

    printTerminal(
`━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${id}
${file.title}
${file.classification}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${escapeHTML(file.content)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        "file"
    );
}

/* =========================
   CREATE FILE
   ========================= */

function createFile() {
    const title = prompt("EXECUTIVE FILE TITLE:");

    if (!title) return;

    const content = prompt("EXECUTIVE FILE CONTENT:");

    if (!content) return;

    const id = "EM-C" + Date.now().toString().slice(-6);

    const file = {
        id,
        title,
        classification: "CL-5 // OVERWATCH",
        content,
        createdBy: currentSession,
        createdAt: timestamp()
    };

    const files = getFiles();

    files.push(file);

    saveJSON(STORAGE.files, files);

    audit("FILE_CREATED", id);

    printTerminal(
        `FILE CREATED // ${id} // ${escapeHTML(title)}`,
        "success"
    );
}

/* =========================
   SEARCH
   ========================= */

function searchFiles(term) {
    if (!term) {
        printTerminal("USAGE: search <term>", "error");
        return;
    }

    term = term.toLowerCase();

    const results = [];

    Object.entries(BUILTIN_FILES).forEach(([id, file]) => {
        const searchable =
            `${id} ${file.title} ${file.content}`.toLowerCase();

        if (searchable.includes(term)) {
            results.push(`${id} // ${file.title}`);
        }
    });

    getFiles().forEach(file => {
        const searchable =
            `${file.id} ${file.title} ${file.content}`.toLowerCase();

        if (searchable.includes(term)) {
            results.push(`${file.id} // ${file.title}`);
        }
    });

    audit("ARCHIVE_SEARCH", term);

    if (!results.length) {
        printTerminal("NO MATCHING RECORDS FOUND", "error");
        return;
    }

    printTerminal(
        `SEARCH RESULTS // ${results.length}\n\n${results.join("\n")}`,
        "system"
    );
}

/* =========================
   PERSONNEL
   ========================= */

function commandPersonnel() {
    printTerminal(
`EXECUTIVE PERSONNEL REGISTRY

LJD
TYPE: EXECUTIVE
AUTHORITY: CL-2

XO
TYPE: EXECUTIVE
AUTHORITY: CL-3

CO
TYPE: COMMAND
AUTHORITY: CL-4

COS
TYPE: OVERWATCH
AUTHORITY: CL-5`,
        "system"
    );
}

/* =========================
   DIRECTIVES
   ========================= */

function commandDirectives() {
    printTerminal(
        Object.entries(BUILTIN_FILES)
            .map(([id, file]) => `${id} // ${file.title}`)
            .join("\n"),
        "system"
    );
}

/* =========================
   AUDIT
   ========================= */

function commandAudit() {
    const logs = getAudit();

    if (!logs.length) {
        printTerminal("AUDIT LOG EMPTY");
        return;
    }

    const visible = logs.slice(0, 30);

    printTerminal(
`EXECUTIVE AUDIT LOG

${visible.map(log =>
    `[${log.timestamp}] ${log.user} // ${log.action}${log.details ? " // " + log.details : ""}`
).join("\n")}`,
        "system"
    );
}

/* =========================
   SYSTEM
   ========================= */

function commandSystem() {
    printTerminal(
`DIVI-64 // EXECUTIVE MANAGEMENT V2

SYSTEM:
ONLINE

STORAGE:
LOCAL PERSISTENCE

BACKEND:
NONE

AUTHENTICATION:
LOCAL EXECUTIVE AUTHORITY

AI CORE:
${getKaneName()}

AI MODE:
EXECUTIVE ASSISTANCE

CURRENT SESSION:
${currentSession}

CLEARANCE:
CL-${ACCOUNTS[currentSession].authority}`,
        "system"
    );
}

/* =========================
   WHOAMI
   ========================= */

function commandWhoami() {
    const account = ACCOUNTS[currentSession];

    printTerminal(
`IDENTITY

SESSION: ${currentSession}
AUTHORITY: CL-${account.authority}
EXECUTIVE ROLE: ${getRole(currentSession)}
AI ACCESS: AUTHORIZED
ARCHIVE ACCESS: AUTHORIZED`,
        "system"
    );
}

function getRole(session) {
    const roles = {
        LJD: "EXECUTIVE MANAGEMENT LIAISON",
        XO: "EXECUTIVE OFFICER",
        CO: "COMMAND OFFICER",
        COS: "CHIEF EXECUTIVE OVERSEER"
    };

    return roles[session] || "UNKNOWN";
}

/* =========================
   FILE ANALYSIS
   ========================= */

function findFile(id) {
    id = id.toUpperCase();

    if (BUILTIN_FILES[id]) return BUILTIN_FILES[id];

    return getFiles().find(file => file.id.toUpperCase() === id);
}

function analyzeFile(id) {
    if (!id) {
        printTerminal("USAGE: analyze <ID>", "error");
        return;
    }

    const file = findFile(id);

    if (!file) {
        printTerminal("FILE NOT FOUND", "error");
        return;
    }

    audit("AI_ANALYSIS", id);

    const words = file.content.trim().split(/\s+/).length;
    const lines = file.content.split("\n").length;

    processAIVisual(() => {
        kaneSay(
`Analysis complete.

FILE: ${id.toUpperCase()}
TITLE: ${file.title}
CLASSIFICATION: ${file.classification}

Estimated words: ${words}
Lines: ${lines}

Assessment:
The record is an executive management document and should be treated according to its assigned classification.`
        );
    });
}

/* =========================
   FILE SUMMARY
   ========================= */

function summarizeFile(id) {
    if (!id) {
        printTerminal("USAGE: summarize <ID>", "error");
        return;
    }

    const file = findFile(id);

    if (!file) {
        printTerminal("FILE NOT FOUND", "error");
        return;
    }

    audit("AI_SUMMARY", id);

    processAIVisual(() => {
        const firstLines = file.content
            .split("\n")
            .filter(line => line.trim())
            .slice(0, 6)
            .join("\n");

        kaneSay(
`Executive summary for ${id.toUpperCase()}:

${firstLines}

This document is classified as ${file.classification} and concerns executive management procedures.`
        );
    });
}

/* =========================
   DIAGNOSTICS
   ========================= */

function diagnostics() {
    const tests = [
        ["DOM CORE", !!$("terminalScreen")],
        ["LOGIN SYSTEM", !!$("loginForm")],
        ["TERMINAL ENGINE", !!$("commandForm")],
        ["ARCHIVE STORAGE", !!window.localStorage],
        ["KANE CORE", !!$("aiForm")],
        ["AI CONVERSATION", !!$("aiConversationOutput")]
    ];

    printTerminal(
`EXECUTIVE DIAGNOSTICS

${tests.map(t =>
    `${t[0].padEnd(20, " ")} ${t[1] ? "PASS" : "FAIL"}`
).join("\n")}

RESULT:
${tests.every(t => t[1]) ? "ALL SYSTEMS NOMINAL" : "SYSTEM ATTENTION REQUIRED"}`,
        "system"
    );
}

/* =========================
   KANE AI
   ========================= */

function updateKaneInterface() {
    const name = getKaneName();

    const nameElement = $("kaneName");
    const prompt = $("aiPrompt");
    const status = $("aiStatusText");

    if (nameElement) nameElement.textContent = name;

    if (prompt) {
        prompt.textContent = `${name}@AI:~$`;
    }

    if (status) {
        status.textContent = "READY FOR EXECUTIVE INTERACTION";
    }

    document.title = `DIVI64 // ${name} AI CORE`;
}

function setupKane() {
    const form = $("aiForm");

    if (form) {
        form.addEventListener("submit", e => {
            e.preventDefault();

            const input = $("aiInput");
            const query = input.value.trim();

            if (!query) return;

            input.value = "";

            addAIMessage(query, "user");

            processKane(query);
        });
    }

    const kaneName = $("kaneName");

    if (kaneName) {
        kaneName.addEventListener("click", () => {
            $("kaneMessage").style.display = "flex";
        });
    }

    const close = $("closeKaneMessage");

    if (close) {
        close.addEventListener("click", () => {
            $("kaneMessage").style.display = "none";
        });
    }

    updateKaneInterface();
}

/* =========================
   AI PROCESSING
   ========================= */

function processAIVisual(callback) {
    const processing = $("aiProcessing");
    const bar = $("aiProcessingBar");
    const percent = $("aiProcessingPercent");

    if (!processing) {
        callback();
        return;
    }

    processing.style.display = "block";

    let value = 0;

    const interval = setInterval(() => {
        value += Math.floor(Math.random() * 15) + 8;

        if (value > 100) value = 100;

        if (bar) bar.style.width = value + "%";
        if (percent) percent.textContent = value + "%";

        if (value >= 100) {
            clearInterval(interval);

            setTimeout(() => {
                processing.style.display = "none";

                if (bar) bar.style.width = "0%";
                if (percent) percent.textContent = "0%";

                callback();
            }, 250);
        }
    }, 100);
}

/* =========================
   AI MESSAGE UI
   ========================= */

function addAIMessage(text, type) {
    const output = $("aiConversationOutput");

    if (!output) return;

    const message = document.createElement("div");

    message.className =
        `aiMessage ${type === "user" ? "aiMessageUser" : "aiMessageKane"}`;

    const label = document.createElement("div");

    label.className = "aiMessageLabel";

    label.textContent =
        type === "user" ? currentSession : getKaneName();

    const body = document.createElement("div");

    body.textContent = text;

    message.appendChild(label);
    message.appendChild(body);

    output.appendChild(message);

    output.scrollTop = output.scrollHeight;
}

function kaneSay(text) {
    addAIMessage(text, "kane");

    kaneContext.push({
        role: "kane",
        text
    });

    if (kaneContext.length > 20) {
        kaneContext.shift();
    }
}

/* =========================
   KANE INTELLIGENCE ENGINE
   ========================= */

function processKane(query) {
    const clean = query.toLowerCase().trim();

    kaneContext.push({
        role: "user",
        text: query
    });

    if (kaneContext.length > 20) {
        kaneContext.shift();
    }

    processAIVisual(() => {
        let response = null;

        /* Identity */

        if (
            clean.includes("who are you") ||
            clean.includes("what are you") ||
            clean.includes("quien eres") ||
            clean.includes("qué eres") ||
            clean.includes("que eres")
        ) {
            response =
                `I am ${getKaneName()}, the DIVI-64 Executive Intelligence Core. I provide analysis, archive assistance, diagnostics and executive command support.`;
        }

        /* Online */

        else if (
            clean.includes("are you online") ||
            clean.includes("online") ||
            clean.includes("estás online") ||
            clean.includes("estas online")
        ) {
            response =
                `Online, ${currentSession}. All local executive systems are currently available.`;
        }

        /* Status */

        else if (
            clean.includes("status") ||
            clean.includes("estado") ||
            clean.includes("systems")
        ) {
            response =
                `Executive systems are operational. Archive storage, audit logging and the ${getKaneName()} intelligence core are online.`;
        }

        /* Current identity */

        else if (
            clean.includes("who am i") ||
            clean.includes("quien soy") ||
            clean.includes("mi autoridad")
        ) {
            response =
                `You are ${currentSession}. Your current executive authority is CL-${ACCOUNTS[currentSession].authority}.`;
        }

        /* Help */

        else if (
            clean === "help" ||
            clean.includes("what can you do") ||
            clean.includes("que puedes hacer") ||
            clean.includes("qué puedes hacer")
        ) {
            response =
`I can assist with:

• Executive archive searches
• File analysis
• File summaries
• System diagnostics
• Status interpretation
• Executive identity
• Command assistance
• Archive navigation

You may also use natural-language requests such as:
"Open EM-004"
"Search chain of command"
"Analyze EM-006"`;
        }

        /* Open */

        else if (clean.match(/open\s+(em-[0-9c]+)/i)) {
            const match = clean.match(/open\s+(em-[0-9c]+)/i);

            response =
                `Command recognized. Opening ${match[1].toUpperCase()}.`;

            setTimeout(() => {
                commandOpen(match[1]);
            }, 300);
        }

        /* Search */

        else if (clean.includes("search ")) {
            const term = clean.split("search ")[1];

            response =
                `Understood. Searching the executive archive for "${term}".`;

            setTimeout(() => {
                searchFiles(term);
            }, 300);
        }

        /* Analyze */

        else if (clean.match(/analy[sz]e\s+(em-[0-9c]+)/i)) {
            const match = clean.match(/analy[sz]e\s+(em-[0-9c]+)/i);

            response =
                `Analysis request accepted for ${match[1].toUpperCase()}.`;

            setTimeout(() => {
                analyzeFile(match[1]);
            }, 300);
        }

        /* Summary */

        else if (
            clean.match(/summarize\s+(em-[0-9c]+)/i) ||
            clean.match(/summary\s+(em-[0-9c]+)/i)
        ) {
            const match =
                clean.match(/(?:summarize|summary)\s+(em-[0-9c]+)/i);

            response =
                `Summary request accepted for ${match[1].toUpperCase()}.`;

            setTimeout(() => {
                summarizeFile(match[1]);
            }, 300);
        }

        /* Diagnostics */

        else if (
            clean.includes("diagnostic") ||
            clean.includes("diagnostics") ||
            clean.includes("run a system check")
        ) {
            response =
                "Executing executive diagnostics.";

            setTimeout(() => {
                diagnostics();
            }, 300);
        }

        /* Greeting */

        else if (
            clean === "hello" ||
            clean === "hi" ||
            clean.includes("hola") ||
            clean.includes("buenas")
        ) {
            response =
                `Acknowledged, ${currentSession}. ${getKaneName()} is ready.`;
        }

        /* Thanks */

        else if (
            clean.includes("thank") ||
            clean.includes("gracias")
        ) {
            response =
                "Acknowledged. Executive assistance remains available.";
        }

        /* Rename */

        else if (
            clean.includes("rename") ||
            clean.includes("change your name") ||
            clean.includes("cambia tu nombre")
        ) {
            response =
                "AI designation changes are restricted. The rename operation is available exclusively to CO.";
        }

        /* Default */

        else {
            response =
                `Request received. I do not have a direct predefined response for that query. Try "help", "status", "open EM-004", "search <term>", or "diagnostics".`;
        }

        kaneSay(response);
    });
}

/* =========================
   RENAME KANE
   ========================= */

function renameKane(name) {
    if (!name) {
        printTerminal(
            "USAGE: rename-ai <new name>",
            "error"
        );
        return;
    }

    if (currentSession !== "CO") {
        printTerminal(
            "ACCESS DENIED // ONLY CO MAY MODIFY AI DESIGNATION",
            "error"
        );

        audit(
            "AI_RENAME_DENIED",
            `${currentSession} attempted rename`
        );

        return;
    }

    name = name.trim().toUpperCase();

    if (!/^[A-Z0-9_-]{2,20}$/.test(name)) {
        printTerminal(
            "INVALID AI DESIGNATION",
            "error"
        );
        return;
    }

    const oldName = getKaneName();

    setKaneName(name);

    updateKaneInterface();

    audit(
        "AI_RENAMED",
        `${oldName} -> ${name}`
    );

    printTerminal(
        `AI DESIGNATION UPDATED // ${oldName} -> ${name}`,
        "success"
    );

    kaneSay(
        `Designation updated. I am now ${name}.`
    );
}

/* =========================
   AI FOCUS
   ========================= */

function focusAI() {
    const input = $("aiInput");

    if (input) {
        input.focus();

        input.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }
}

/* =========================
   LOGOUT
   ========================= */

function logout() {
    audit("SESSION_TERMINATED", currentSession);

    currentUser = null;
    currentSession = null;
    kaneContext = [];

    $("terminalOutput").innerHTML = "";

    $("terminalScreen").style.display = "none";
    $("loginScreen").style.display = "flex";

    $("username").value = "";
    $("password").value = "";
    $("loginMessage").textContent = "";

    const aiOutput = $("aiConversationOutput");

    if (aiOutput) {
        aiOutput.innerHTML = "";
    }

    updateKaneInterface();
}

/* =========================
   TERMINAL HEADER
   ========================= */

function updateTerminal() {
    const account = ACCOUNTS[currentSession];

    if ($("currentSession")) {
        $("currentSession").textContent = currentSession;
    }

    if ($("authorityLevel")) {
        $("authorityLevel").textContent =
            `CL-${account.authority}`;
    }

    if ($("welcomeText")) {
        $("welcomeText").textContent =
            getWelcomeMessage(currentSession);
    }

    updateKaneInterface();
}

/* =========================
   CLOCK
   ========================= */

function updateClock() {
    const clock = $("terminalClock");

    if (!clock) return;

    const now = new Date();

    clock.textContent =
        now.toLocaleTimeString("en-GB", {
            hour12: false
        });
}

/* =========================
   INIT
   ========================= */

document.addEventListener("DOMContentLoaded", () => {
    setupLogin();
    setupSessions();
    setupTerminal();
    setupKane();

    const logoutButton = $("logoutButton");

    if (logoutButton) {
        logoutButton.addEventListener("click", logout);
    }

    updateClock();

    setInterval(updateClock, 1000);

    bootSystem();
});
