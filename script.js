"use strict";

/* =========================================================
   DIVI-64 // EXECUTIVE MANAGEMENT V2
   LOCAL EXECUTIVE SYSTEM + KANE AI CORE
   ========================================================= */

const ACCOUNTS = {
    LJD: { password: "LJD-64", clearance: 2, role: "EXECUTIVE MANAGEMENT LIAISON" },
    XO:  { password: "XO-64",  clearance: 3, role: "EXECUTIVE OFFICER" },
    CO:  { password: "CO-64",  clearance: 4, role: "COMMAND OFFICER" },
    COS: { password: "COS-64", clearance: 5, role: "CHIEF EXECUTIVE OVERSEER" }
};

const KEYS = {
    files: "DIVI64_EM_FILES_V2",
    audit: "DIVI64_EM_AUDIT_V2",
    kaneName: "DIVI64_KANE_NAME_V2"
};

let authenticatedUser = null;
let currentSession = null;
let kaneContext = [];
let processing = false;


/* =========================================================
   BUILT-IN ARCHIVES
   ========================================================= */

const ARCHIVES = {

    "EM-001": {
        title: "Executive Management Charter",
        content:
`DIVI-64 EXECUTIVE MANAGEMENT CHARTER

This document establishes the Executive Management structure of DIVI-64.

Recognized executive sessions:

LJD
XO
CO
COS

COS constitutes the highest executive authority.

All executive decisions remain subject to the established DIVI-64 authority hierarchy.`
    },

    "EM-002": {
        title: "Executive Authority Protocol",
        content:
`EXECUTIVE AUTHORITY PROTOCOL

LJD // CL-2
XO  // CL-3
CO  // CL-4
COS // CL-5

Executive authority determines access to restricted operations.

Certain operations may remain restricted to specifically designated executive sessions regardless of general clearance.`
    },

    "EM-003": {
        title: "Executive Personnel Registry",
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

CLASSIFICATION:
CL-5 // OVERWATCH`
    },

    "EM-004": {
        title: "Executive Chain of Command",
        content:
`EXECUTIVE CHAIN OF COMMAND

CL-5 // COS
CHIEF EXECUTIVE OVERSEER

CL-4 // CO
COMMAND OFFICER

CL-3 // XO
EXECUTIVE OFFICER

CL-2 // LJD
EXECUTIVE MANAGEMENT LIAISON

The hierarchy determines executive authority and operational access.`
    },

    "EM-005": {
        title: "Executive Voting Protocol",
        content:
`EXECUTIVE VOTING PROTOCOL

Executive votes may be initiated by authorized personnel.

A voting record should contain:

INITIATING AUTHORITY
SUBJECT
AVAILABLE DECISIONS
PARTICIPANTS
RESULT
TIMESTAMP

COS authority may supersede standard voting procedures when required.`
    },

    "EM-006": {
        title: "Emergency Executive Protocol",
        content:
`EMERGENCY EXECUTIVE PROTOCOL

1. Confirm incident.
2. Identify affected systems.
3. Restrict unnecessary access.
4. Notify appropriate authority.
5. Record all actions.
6. Preserve audit information.

Emergency activity must remain traceable through the Executive Audit System.`
    },

    "EM-007": {
        title: "Executive Security Regulations",
        content:
`EXECUTIVE SECURITY REGULATIONS

Executive credentials must remain confidential.

Restricted records may only be accessed by authorized personnel.

Sensitive operations must generate audit events.

Unauthorized modification of executive records is prohibited.`
    },

    "EM-008": {
        title: "Clearance Authority Directive",
        content:
`CLEARANCE AUTHORITY DIRECTIVE

CL-2
Basic executive access.

CL-3
Expanded executive access.

CL-4
Command-level access.

CL-5
OVERWATCH authority.

Individual operations may have additional restrictions.`
    },

    "EM-009": {
        title: "Executive Disciplinary Authority",
        content:
`EXECUTIVE DISCIPLINARY AUTHORITY

Executive personnel may be subject to disciplinary review following violations of DIVI-64 regulations.

Disciplinary actions must be documented.

The Executive Audit System preserves the corresponding event record.`
    },

    "EM-010": {
        title: "Executive Communications Protocol",
        content:
`EXECUTIVE COMMUNICATIONS PROTOCOL

Executive communications must remain clear, concise and attributable.

Sensitive information must only be transmitted to authorized personnel.

KANE AI CORE provides executive assistance but does not replace executive authority.`
    },

    "EM-011": {
        title: "Executive Archives Access Directive",
        content:
`EXECUTIVE ARCHIVES ACCESS DIRECTIVE

Executive archive records are classified CL-5 // OVERWATCH.

Authenticated executive personnel may access the archive.

Opening, searching and creating records may generate audit events.`
    },

    "EM-012": {
        title: "Executive Succession Directive",
        content:
`EXECUTIVE SUCCESSION DIRECTIVE

Executive continuity must be maintained during temporary absence.

Succession procedures are determined by executive authority.

COS retains final authority regarding succession decisions.`
    }

};


/* =========================================================
   UTILITIES
   ========================================================= */

function $(id) {
    return document.getElementById(id);
}

function now() {
    return new Date().toLocaleString("en-GB", {
        hour12: false
    });
}

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

function files() {
    return load(KEYS.files, []);
}

function auditLog() {
    return load(KEYS.audit, []);
}

function kaneName() {
    return localStorage.getItem(KEYS.kaneName) || "KANE";
}

function setKaneName(name) {
    localStorage.setItem(KEYS.kaneName, name);
}


/* =========================================================
   AUDIT
   ========================================================= */

function audit(action, details = "") {

    const log = auditLog();

    log.unshift({
        time: now(),
        user: currentSession || "SYSTEM",
        action,
        details
    });

    save(KEYS.audit, log.slice(0, 500));
}


/* =========================================================
   BOOT
   ========================================================= */

function boot() {

    const bootScreen = $("bootScreen");
    const status = $("bootStatus");
    const percent = $("bootPercent");
    const progress = $("bootProgress");
    const message = $("bootMessage");

    if (!bootScreen) return;

    let value = 0;

    const timer = setInterval(() => {

        value += Math.floor(Math.random() * 9) + 4;

        if (value > 100) value = 100;

        if (percent)
            percent.textContent = value + "%";

        if (progress)
            progress.style.width = value + "%";

        if (value < 25) {
            status.textContent = "INITIALIZING EXECUTIVE CORE";
            message.textContent = "Loading core systems...";
        }
        else if (value < 50) {
            status.textContent = "VERIFYING ARCHIVE INTEGRITY";
            message.textContent = "Checking executive records...";
        }
        else if (value < 75) {
            status.textContent = "INITIALIZING KANE AI CORE";
            message.textContent = "Loading intelligence core...";
        }
        else {
            status.textContent = "ESTABLISHING SECURE SESSION";
            message.textContent = "Preparing authentication interface...";
        }

        if (value >= 100) {

            clearInterval(timer);

            setTimeout(() => {

                bootScreen.classList.add("hidden");

                $("loginScreen").classList.remove("hidden");

                updateKaneUI();

            }, 500);
        }

    }, 120);
}


/* =========================================================
   LOGIN
   ========================================================= */

function setupLogin() {

    $("loginForm").addEventListener("submit", event => {

        event.preventDefault();

        const username = $("username").value.trim().toUpperCase();
        const password = $("password").value;

        const account = ACCOUNTS[username];

        if (!account || account.password !== password) {

            $("loginMessage").textContent =
                "ACCESS DENIED // INVALID EXECUTIVE CREDENTIALS";

            audit("LOGIN_FAILED", username);

            return;
        }

        authenticatedUser = username;

        $("loginMessage").textContent =
            "AUTHENTICATION ACCEPTED";

        audit("LOGIN_SUCCESS", username);

        setTimeout(() => {

            $("loginScreen").classList.add("hidden");
            $("sessionScreen").classList.remove("hidden");

        }, 450);
    });
}


/* =========================================================
   SESSION SELECTION
   ========================================================= */

function setupSessions() {

    document.querySelectorAll(".sessionButton").forEach(button => {

        button.addEventListener("click", () => {

            const session = button.dataset.session;

            if (session !== authenticatedUser) {

                audit("SESSION_REJECTED", session);

                alert(
                    "SESSION REJECTED\n\nAUTHENTICATED IDENTITY MISMATCH"
                );

                return;
            }

            currentSession = session;

            $("sessionScreen").classList.add("hidden");
            $("terminalScreen").classList.remove("hidden");

            updateTerminal();

            audit("SESSION_STARTED", session);

            terminal(
                `EXECUTIVE SESSION ESTABLISHED: ${session}`,
                "success"
            );

            terminal(
                welcome(session),
                "system"
            );

            kaneSay(
                `Executive session ${session} established. ${kaneName()} is online.`
            );

            $("commandInput").focus();

        });

    });
}

function welcome(session) {

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

    return messages[session];
}


/* =========================================================
   TERMINAL
   ========================================================= */

function setupTerminal() {

    $("commandForm").addEventListener("submit", event => {

        event.preventDefault();

        const input = $("commandInput");
        const value = input.value.trim();

        if (!value) return;

        terminal(
            `${currentSession}@EM:~$ ${value}`,
            "command"
        );

        input.value = "";

        execute(value);

    });
}

function terminal(text, type = "") {

    const output = $("terminalOutput");

    const line = document.createElement("div");

    line.className = "terminalLine " + type;

    line.textContent = text;

    output.appendChild(line);

    output.scrollTop = output.scrollHeight;
}


/* =========================================================
   COMMAND ENGINE
   ========================================================= */

function execute(raw) {

    const parts = raw.trim().split(/\s+/);
    const command = parts.shift().toLowerCase();
    const argument = parts.join(" ").trim();

    switch (command) {

        case "help":
            help();
            break;

        case "clear":
            $("terminalOutput").innerHTML = "";
            break;

        case "status":
            status();
            break;

        case "archives":
            archives();
            break;

        case "open":
            openFile(argument);
            break;

        case "create":
            createFile();
            break;

        case "search":
            search(argument);
            break;

        case "personnel":
            personnel();
            break;

        case "directives":
            directives();
            break;

        case "audit":
            showAudit();
            break;

        case "system":
            systemInfo();
            break;

        case "whoami":
            whoami();
            break;

        case "ask":
            if (argument) {
                processKane(argument);
            } else {
                terminal("USAGE: ask <query>", "error");
            }
            break;

        case "ai":
        case "kane":
        case "teto":
            focusAI();
            break;

        case "analyze":
            analyze(argument);
            break;

        case "summarize":
            summarize(argument);
            break;

        case "diagnostics":
            diagnostics();
            break;

        case "rename-ai":
            renameAI(argument);
            break;

        case "logout":
            logout();
            break;

        default:
            processKane(raw);
            break;
    }
}


/* =========================================================
   COMMANDS
   ========================================================= */

function help() {

    terminal(
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


function status() {

    terminal(
`DIVI-64 // EXECUTIVE STATUS

MAINFRAME       ONLINE
EXECUTIVE CORE  ONLINE
ARCHIVE SYSTEM  ONLINE
AUDIT SYSTEM    ONLINE
${kaneName()} AI CORE   ONLINE

CUSTOM FILES    ${files().length}
AUDIT EVENTS    ${auditLog().length}

SESSION         ${currentSession}
CLEARANCE       CL-${ACCOUNTS[currentSession].clearance}`,
        "system"
    );
}


function archives() {

    terminal(
        "EXECUTIVE ARCHIVES // CL-5 // OVERWATCH",
        "system"
    );

    Object.entries(ARCHIVES).forEach(([id, file]) => {

        terminal(
            `${id} // ${file.title} // CL-5`
        );

    });

    files().forEach(file => {

        terminal(
            `${file.id} // ${file.title} // CL-5 // CUSTOM`
        );

    });
}


function openFile(id) {

    if (!id) {

        terminal("USAGE: open <ID>", "error");

        return;
    }

    id = id.toUpperCase();

    let file = ARCHIVES[id];

    if (!file)
        file = files().find(f => f.id.toUpperCase() === id);

    if (!file) {

        terminal(
            `FILE NOT FOUND // ${id}`,
            "error"
        );

        return;
    }

    audit("FILE_OPENED", id);

    terminal(
`━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${id}
${file.title}
CL-5 // OVERWATCH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${file.content}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        "file"
    );
}


function createFile() {

    const title = prompt("EXECUTIVE FILE TITLE:");

    if (!title) return;

    const content = prompt("EXECUTIVE FILE CONTENT:");

    if (!content) return;

    const id =
        "EM-C" +
        Date.now().toString().slice(-6);

    const newFile = {

        id,
        title,
        content,
        classification: "CL-5 // OVERWATCH",
        createdBy: currentSession,
        createdAt: now()

    };

    const all = files();

    all.push(newFile);

    save(KEYS.files, all);

    audit("FILE_CREATED", id);

    terminal(
        `FILE CREATED // ${id} // ${title}`,
        "success"
    );
}


function search(term) {

    if (!term) {

        terminal(
            "USAGE: search <term>",
            "error"
        );

        return;
    }

    const query = term.toLowerCase();
    const results = [];

    Object.entries(ARCHIVES).forEach(([id, file]) => {

        const searchable =
            `${id} ${file.title} ${file.content}`.toLowerCase();

        if (searchable.includes(query))
            results.push(`${id} // ${file.title}`);

    });

    files().forEach(file => {

        const searchable =
            `${file.id} ${file.title} ${file.content}`.toLowerCase();

        if (searchable.includes(query))
            results.push(`${file.id} // ${file.title}`);

    });

    audit("ARCHIVE_SEARCH", term);

    if (!results.length) {

        terminal(
            "NO MATCHING RECORDS FOUND",
            "error"
        );

        return;
    }

    terminal(
`SEARCH RESULTS // ${results.length}

${results.join("\n")}`,
        "system"
    );
}


function personnel() {

    terminal(
`EXECUTIVE PERSONNEL REGISTRY

LJD
EXECUTIVE MANAGEMENT LIAISON
CL-2

XO
EXECUTIVE OFFICER
CL-3

CO
COMMAND OFFICER
CL-4

COS
CHIEF EXECUTIVE OVERSEER
CL-5`,
        "system"
    );
}


function directives() {

    Object.entries(ARCHIVES).forEach(([id, file]) => {

        terminal(
            `${id} // ${file.title}`
        );

    });
}


function showAudit() {

    const log = auditLog();

    if (!log.length) {

        terminal(
            "AUDIT LOG EMPTY",
            "system"
        );

        return;
    }

    terminal(
`EXECUTIVE AUDIT LOG

${log.slice(0, 40).map(item =>
`[${item.time}] ${item.user} // ${item.action}${item.details ? " // " + item.details : ""}`
).join("\n")}`,
        "system"
    );
}


function systemInfo() {

    terminal(
`DIVI-64 // EXECUTIVE MANAGEMENT V2

MAINFRAME:
ONLINE

STORAGE:
LOCAL

BACKEND:
NONE

AUTHENTICATION:
LOCAL EXECUTIVE AUTHORITY

INTELLIGENCE CORE:
${kaneName()}

AI MODE:
EXECUTIVE ASSISTANCE

SESSION:
${currentSession}

CLEARANCE:
CL-${ACCOUNTS[currentSession].clearance}`,
        "system"
    );
}


function whoami() {

    const account = ACCOUNTS[currentSession];

    terminal(
`IDENTITY

SESSION:
${currentSession}

ROLE:
${account.role}

CLEARANCE:
CL-${account.clearance}

ARCHIVE ACCESS:
AUTHORIZED

AI ACCESS:
AUTHORIZED`,
        "system"
    );
}


/* =========================================================
   FILE ANALYSIS
   ========================================================= */

function getFile(id) {

    id = id.toUpperCase();

    if (ARCHIVES[id])
        return ARCHIVES[id];

    return files().find(
        file => file.id.toUpperCase() === id
    );
}


function analyze(id) {

    if (!id) {

        terminal(
            "USAGE: analyze <ID>",
            "error"
        );

        return;
    }

    const file = getFile(id);

    if (!file) {

        terminal(
            "FILE NOT FOUND",
            "error"
        );

        return;
    }

    audit("AI_ANALYSIS", id);

    processAI(() => {

        const lines =
            file.content.split("\n").length;

        const words =
            file.content.trim().split(/\s+/).length;

        kaneSay(
`Analysis complete.

FILE: ${id.toUpperCase()}
TITLE: ${file.title}
CLASSIFICATION: CL-5 // OVERWATCH

LINES: ${lines}
ESTIMATED WORDS: ${words}

Assessment:
This record concerns DIVI-64 executive management procedures and should be handled according to its classification.`
        );

    });
}


/* =========================================================
   SUMMARY
   ========================================================= */

function summarize(id) {

    if (!id) {

        terminal(
            "USAGE: summarize <ID>",
            "error"
        );

        return;
    }

    const file = getFile(id);

    if (!file) {

        terminal(
            "FILE NOT FOUND",
            "error"
        );

        return;
    }

    audit("AI_SUMMARY", id);

    processAI(() => {

        const lines =
            file.content
                .split("\n")
                .filter(line => line.trim())
                .slice(0, 7)
                .join("\n");

        kaneSay(
`EXECUTIVE SUMMARY

${id.toUpperCase()}
${file.title}

${lines}

Classification:
CL-5 // OVERWATCH`
        );

    });
}


/* =========================================================
   DIAGNOSTICS
   ========================================================= */

function diagnostics() {

    const checks = [

        ["DOM CORE", !!$("terminalScreen")],
        ["LOGIN ENGINE", !!$("loginForm")],
        ["TERMINAL ENGINE", !!$("commandForm")],
        ["LOCAL STORAGE", !!window.localStorage],
        ["KANE CORE", !!$("aiForm")],
        ["AI CONVERSATION", !!$("aiConversationOutput")],
        ["ARCHIVE DATABASE", Object.keys(ARCHIVES).length === 12]

    ];

    terminal(
`EXECUTIVE DIAGNOSTICS

${checks.map(item =>
`${item[0].padEnd(22)} ${item[1] ? "PASS" : "FAIL"}`
).join("\n")}

RESULT:
${checks.every(item => item[1])
    ? "ALL SYSTEMS NOMINAL"
    : "SYSTEM ATTENTION REQUIRED"}`,
        "system"
    );
}


/* =========================================================
   KANE UI
   ========================================================= */

function setupKane() {

    $("aiForm").addEventListener("submit", event => {

        event.preventDefault();

        const input = $("aiInput");
        const query = input.value.trim();

        if (!query || processing)
            return;

        input.value = "";

        addAIMessage(query, "user");

        processKane(query);
    });


    $("kaneName").addEventListener("click", () => {

        $("kaneMessage").classList.remove("hidden");

    });


    $("closeKaneMessage").addEventListener("click", () => {

        $("kaneMessage").classList.add("hidden");

    });


    updateKaneUI();
}


function updateKaneUI() {

    const name = kaneName();

    $("kaneName").textContent = name;
    $("aiPrompt").textContent = `${name}@AI:~$`;

    $("aiStatusText").textContent =
        "READY FOR EXECUTIVE INTERACTION";

    document.title =
        `DIVI64 // ${name} AI CORE`;
}


/* =========================================================
   KANE PROCESSING
   ========================================================= */

function processAI(callback) {

    if (processing) return;

    processing = true;

    const panel = $("aiProcessing");
    const bar = $("aiProcessingBar");
    const percent = $("aiProcessingPercent");

    panel.style.display = "block";

    let value = 0;

    const timer = setInterval(() => {

        value += Math.floor(Math.random() * 14) + 8;

        if (value > 100)
            value = 100;

        bar.style.width = value + "%";
        percent.textContent = value + "%";

        if (value >= 100) {

            clearInterval(timer);

            setTimeout(() => {

                panel.style.display = "none";
                bar.style.width = "0%";
                percent.textContent = "0%";

                processing = false;

                callback();

            }, 250);
        }

    }, 90);
}


/* =========================================================
   KANE CONVERSATION
   ========================================================= */

function addAIMessage(text, type) {

    const output =
        $("aiConversationOutput");

    const message =
        document.createElement("div");

    message.className =
        type === "user"
            ? "aiMessage aiMessageUser"
            : "aiMessage aiMessageKane";

    const label =
        document.createElement("div");

    label.className =
        "aiMessageLabel";

    label.textContent =
        type === "user"
            ? currentSession
            : kaneName();

    const content =
        document.createElement("div");

    content.textContent = text;

    message.appendChild(label);
    message.appendChild(content);

    output.appendChild(message);

    output.scrollTop =
        output.scrollHeight;
}


function kaneSay(text) {

    addAIMessage(text, "kane");

    kaneContext.push({
        role: "KANE",
        text
    });

    if (kaneContext.length > 20)
        kaneContext.shift();
}


/* =========================================================
   KANE INTELLIGENCE
   ========================================================= */

function processKane(query) {

    kaneContext.push({
        role: currentSession,
        text: query
    });

    if (kaneContext.length > 20)
        kaneContext.shift();

    processAI(() => {

        const q =
            query.toLowerCase().trim();

        let response = "";


        /* IDENTITY */

        if (
            q.includes("who are you") ||
            q.includes("what are you") ||
            q.includes("quien eres") ||
            q.includes("qué eres") ||
            q.includes("que eres")
        ) {

            response =
                `I am ${kaneName()}, the DIVI-64 Executive Intelligence Core. I provide archive assistance, analysis, diagnostics and executive command support.`;

        }


        /* ONLINE */

        else if (
            q.includes("online") ||
            q.includes("are you there") ||
            q.includes("estás ahí") ||
            q.includes("estas ahi")
        ) {

            response =
                `Online, ${currentSession}. All local executive systems are currently available.`;

        }


        /* STATUS */

        else if (
            q.includes("status") ||
            q.includes("estado del sistema") ||
            q.includes("system status")
        ) {

            response =
                `System status is nominal. Mainframe, archive storage, audit logging and ${kaneName()} are online.`;

        }


        /* IDENTITY OF USER */

        else if (
            q.includes("who am i") ||
            q.includes("quien soy") ||
            q.includes("mi autoridad")
        ) {

            response =
                `Current identity: ${currentSession}. Executive authority: CL-${ACCOUNTS[currentSession].clearance}. Role: ${ACCOUNTS[currentSession].role}.`;

        }


        /* HELP */

        else if (
            q === "help" ||
            q.includes("what can you do") ||
            q.includes("que puedes hacer") ||
            q.includes("qué puedes hacer")
        ) {

            response =
`AVAILABLE KANE FUNCTIONS

Archive navigation
Archive search
File analysis
File summaries
System status
Diagnostics
Executive identity
Command assistance
Natural-language requests
Temporary conversation context

Examples:

"Open EM-004"
"Search authority"
"Analyze EM-006"
"Summarize EM-005"
"Run diagnostics"`;

        }


        /* OPEN FILE */

        else if (
            q.match(/open\s+(em-[0-9c]+)/i)
        ) {

            const match =
                q.match(/open\s+(em-[0-9c]+)/i);

            response =
                `Command recognized. Opening ${match[1].toUpperCase()}.`;

            setTimeout(() => {

                openFile(match[1]);

            }, 300);

        }


        /* SEARCH */

        else if (
            q.startsWith("search ")
        ) {

            const term =
                q.substring(7).trim();

            response =
                `Archive search initiated for "${term}".`;

            setTimeout(() => {

                search(term);

            }, 300);

        }


        /* ANALYZE */

        else if (
            q.match(/analy[sz]e\s+(em-[0-9c]+)/i)
        ) {

            const match =
                q.match(/analy[sz]e\s+(em-[0-9c]+)/i);

            response =
                `Analysis request accepted for ${match[1].toUpperCase()}.`;

            setTimeout(() => {

                analyze(match[1]);

            }, 300);

        }


        /* SUMMARY */

        else if (
            q.match(/summarize\s+(em-[0-9c]+)/i) ||
            q.match(/summary\s+(em-[0-9c]+)/i)
        ) {

            const match =
                q.match(/(?:summarize|summary)\s+(em-[0-9c]+)/i);

            response =
                `Summary request accepted for ${match[1].toUpperCase()}.`;

            setTimeout(() => {

                summarize(match[1]);

            }, 300);

        }


        /* DIAGNOSTICS */

        else if (
            q.includes("diagnostic") ||
            q.includes("run a system check") ||
            q.includes("system check")
        ) {

            response =
                "Executing executive diagnostics.";

            setTimeout(() => {

                diagnostics();

            }, 300);

        }


        /* GREETING */

        else if (
            q === "hello" ||
            q === "hi" ||
            q === "hey" ||
            q === "hola" ||
            q === "buenas"
        ) {

            response =
                `Acknowledged, ${currentSession}. ${kaneName()} is ready for executive interaction.`;

        }


        /* THANKS */

        else if (
            q.includes("thank you") ||
            q.includes("thanks") ||
            q.includes("gracias")
        ) {

            response =
                "Acknowledged. Executive assistance remains available.";

        }


        /* RENAME */

        else if (
            q.includes("rename") ||
            q.includes("change your name") ||
            q.includes("cambia tu nombre")
        ) {

            response =
                "AI designation modification is restricted. The rename operation is available exclusively to CO.";

        }


        /* GENERAL */

        else {

            response =
                `Request received. I have no predefined response for that query. Try "help", "status", "open EM-004", "search <term>", or "diagnostics".`;

        }


        kaneSay(response);

    });
}


/* =========================================================
   AI RENAME
   ========================================================= */

function renameAI(newName) {

    if (!newName) {

        terminal(
            "USAGE: rename-ai <new name>",
            "error"
        );

        return;
    }


    if (currentSession !== "CO") {

        terminal(
            "ACCESS DENIED // ONLY CO MAY MODIFY AI DESIGNATION",
            "error"
        );

        audit(
            "AI_RENAME_DENIED",
            `${currentSession} attempted AI rename`
        );

        return;
    }


    newName =
        newName.trim().toUpperCase();


    if (!/^[A-Z0-9_-]{2,20}$/.test(newName)) {

        terminal(
            "INVALID AI DESIGNATION",
            "error"
        );

        return;
    }


    const oldName =
        kaneName();


    setKaneName(newName);

    updateKaneUI();

    audit(
        "AI_RENAMED",
        `${oldName} -> ${newName}`
    );


    terminal(
        `AI DESIGNATION UPDATED // ${oldName} -> ${newName}`,
        "success"
    );


    kaneSay(
        `Designation updated. I am now ${newName}.`
    );
}


/* =========================================================
   FOCUS AI
   ========================================================= */

function focusAI() {

    const input =
        $("aiInput");

    input.focus();

    input.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}


/* =========================================================
   TERMINAL HEADER
   ========================================================= */

function updateTerminal() {

    const account =
        ACCOUNTS[currentSession];

    $("currentSession").textContent =
        currentSession;

    $("authorityLevel").textContent =
        `CL-${account.clearance}`;

    $("welcomeText").textContent =
        welcome(currentSession);

    updateKaneUI();
}


/* =========================================================
   CLOCK
   ========================================================= */

function clock() {

    const element =
        $("terminalClock");

    if (!element) return;

    element.textContent =
        new Date().toLocaleTimeString(
            "en-GB",
            { hour12: false }
        );
}


/* =========================================================
   LOGOUT
   ========================================================= */

function logout() {

    audit(
        "SESSION_TERMINATED",
        currentSession
    );

    authenticatedUser = null;
    currentSession = null;
    kaneContext = [];

    $("terminalOutput").innerHTML = "";
    $("aiConversationOutput").innerHTML = "";

    $("terminalScreen").classList.add("hidden");
    $("loginScreen").classList.remove("hidden");

    $("username").value = "";
    $("password").value = "";
    $("loginMessage").textContent = "";

    updateKaneUI();
}


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    setupLogin();
    setupSessions();
    setupTerminal();
    setupKane();

    $("logoutButton").addEventListener(
        "click",
        logout
    );

    clock();

    setInterval(clock, 1000);

    boot();

});
