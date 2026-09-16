"use strict";

/* =========================================================
   DIVI-64 // EXECUTIVE MANAGEMENT V3
   KANE // EXECUTIVE INTELLIGENCE CORE
========================================================= */


/* =========================================================
   EXECUTIVE ACCOUNTS
========================================================= */

const ACCOUNTS = {
    LJD: {
        password: "LJD-64",
        clearance: 2,
        role: "EXECUTIVE MANAGEMENT LIAISON"
    },

    XO: {
        password: "XO-64",
        clearance: 3,
        role: "EXECUTIVE OFFICER"
    },

    CO: {
        password: "CO-64",
        clearance: 4,
        role: "COMMAND OFFICER"
    },

    COS: {
        password: "COS-64",
        clearance: 5,
        role: "CHIEF EXECUTIVE OVERSEER"
    }
};


/* =========================================================
   STORAGE
========================================================= */

const KEYS = {
    files: "DIVI64_EM_FILES_V3",
    audit: "DIVI64_EM_AUDIT_V3",
    kaneName: "DIVI64_KANE_NAME_V3",
    decisions: "DIVI64_EM_DECISIONS_V3",
    settings: "DIVI64_KANE_SETTINGS_V3"
};


/* =========================================================
   STATE
========================================================= */

let authenticatedUser = null;
let currentSession = null;

let kaneContext = [];
let kaneHistory = [];

let processing = false;
let kaneSilent = false;

let lastOpenedFile = null;
let lastSearchResults = [];

let currentKaneMode = "EXECUTIVE";

let monitorTimer = null;


/* =========================================================
   ARCHIVE DATABASE
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
   BASIC HELPERS
========================================================= */

function $(id) {
    return document.getElementById(id);
}


function now() {
    return new Date().toLocaleString(
        "en-GB",
        {
            hour12: false
        }
    );
}


function load(key, fallback) {

    try {

        const value =
            localStorage.getItem(key);

        return value
            ? JSON.parse(value)
            : fallback;

    } catch {

        return fallback;

    }
}


function save(key, value) {

    try {

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

    } catch {

        console.warn(
            "DIVI-64 // LOCAL STORAGE WRITE FAILED"
        );

    }
}


function files() {
    return load(KEYS.files, []);
}


function auditLog() {
    return load(KEYS.audit, []);
}


function decisions() {
    return load(KEYS.decisions, []);
}


function kaneName() {

    return (
        localStorage.getItem(
            KEYS.kaneName
        ) || "KANE"
    );

}


function setKaneName(name) {

    localStorage.setItem(
        KEYS.kaneName,
        name
    );

}


function kaneSettings() {

    return load(
        KEYS.settings,
        {
            mode: "EXECUTIVE",
            silent: false,
            monitoring: true
        }
    );

}


function saveKaneSettings(settings) {

    save(
        KEYS.settings,
        settings
    );

}


/* =========================================================
   AUDIT
========================================================= */

function audit(
    action,
    details = ""
) {

    const log =
        auditLog();

    log.unshift({

        time: now(),

        user:
            currentSession ||
            authenticatedUser ||
            "SYSTEM",

        action,

        details

    });

    save(
        KEYS.audit,
        log.slice(0, 1000)
    );

}


/* =========================================================
   BOOT
========================================================= */

function boot() {

    const bootScreen =
        $("bootScreen");

    const status =
        $("bootStatus");

    const percent =
        $("bootPercent");

    const progress =
        $("bootProgress");

    const message =
        $("bootMessage");

    if (!bootScreen)
        return;

    let value = 0;

    const timer =
        setInterval(() => {

            value +=
                Math.floor(
                    Math.random() * 9
                ) + 4;

            if (value > 100)
                value = 100;

            if (percent)
                percent.textContent =
                    value + "%";

            if (progress)
                progress.style.width =
                    value + "%";


            if (value < 20) {

                status.textContent =
                    "INITIALIZING EXECUTIVE CORE";

                message.textContent =
                    "Loading executive systems...";

            }

            else if (value < 40) {

                status.textContent =
                    "VERIFYING ARCHIVE INTEGRITY";

                message.textContent =
                    "Checking executive records...";

            }

            else if (value < 60) {

                status.textContent =
                    "INITIALIZING KANE INTELLIGENCE CORE";

                message.textContent =
                    "Loading intelligence systems...";

            }

            else if (value < 80) {

                status.textContent =
                    "INITIALIZING EXECUTIVE MEMORY";

                message.textContent =
                    "Preparing session context...";

            }

            else {

                status.textContent =
                    "ESTABLISHING SECURE SESSION";

                message.textContent =
                    "Preparing authentication interface...";

            }


            if (value >= 100) {

                clearInterval(timer);

                setTimeout(() => {

                    bootScreen
                        .classList
                        .add("hidden");

                    $("loginScreen")
                        .classList
                        .remove("hidden");

                    updateKaneUI();

                }, 500);

            }

        }, 120);

}


/* =========================================================
   LOGIN
========================================================= */

function setupLogin() {

    $("loginForm")
        .addEventListener(
            "submit",
            event => {

                event.preventDefault();

                const username =
                    $("username")
                        .value
                        .trim()
                        .toUpperCase();

                const password =
                    $("password").value;

                const account =
                    ACCOUNTS[username];


                if (
                    !account ||
                    account.password !== password
                ) {

                    $("loginMessage")
                        .textContent =
                        "ACCESS DENIED // INVALID EXECUTIVE CREDENTIALS";

                    audit(
                        "LOGIN_FAILED",
                        username
                    );

                    return;

                }


                authenticatedUser =
                    username;

                $("loginMessage")
                    .textContent =
                    "AUTHENTICATION ACCEPTED";

                audit(
                    "LOGIN_SUCCESS",
                    username
                );


                setTimeout(() => {

                    $("loginScreen")
                        .classList
                        .add("hidden");

                    $("sessionScreen")
                        .classList
                        .remove("hidden");

                }, 450);

            }
        );

}


/* =========================================================
   SESSION SELECTION
========================================================= */

function setupSessions() {

    document
        .querySelectorAll(
            ".sessionButton"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const session =
                        button.dataset.session;


                    if (
                        session !==
                        authenticatedUser
                    ) {

                        audit(
                            "SESSION_REJECTED",
                            session
                        );

                        alert(
                            "SESSION REJECTED\n\nAUTHENTICATED IDENTITY MISMATCH"
                        );

                        return;

                    }


                    currentSession =
                        session;


                    $("sessionScreen")
                        .classList
                        .add("hidden");

                    $("terminalScreen")
                        .classList
                        .remove("hidden");


                    updateTerminal();

                    audit(
                        "SESSION_STARTED",
                        session
                    );


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


                    startAutonomousMonitor();

                    $("commandInput").focus();

                }
            );

        });

}


/* =========================================================
   WELCOME
========================================================= */

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

    $("commandForm")
        .addEventListener(
            "submit",
            event => {

                event.preventDefault();

                const input =
                    $("commandInput");

                const value =
                    input.value.trim();

                if (!value)
                    return;


                terminal(
                    `${currentSession}@EM:~$ ${value}`,
                    "command"
                );

                input.value = "";

                execute(value);

            }
        );

}


/* =========================================================
   TERMINAL OUTPUT
========================================================= */

function terminal(
    text,
    type = ""
) {

    const output =
        $("terminalOutput");

    if (!output)
        return;


    const line =
        document.createElement(
            "div"
        );

    line.className =
        "terminalLine " + type;

    line.textContent =
        text;

    output.appendChild(line);

    output.scrollTop =
        output.scrollHeight;

}


/* =========================================================
   COMMAND EXECUTION
========================================================= */

function execute(raw) {

    const parts =
        raw
            .trim()
            .split(/\s+/);

    const command =
        parts
            .shift()
            .toLowerCase();

    const argument =
        parts
            .join(" ")
            .trim();


    switch (command) {

        case "help":
            help();
            break;

        case "clear":
            $("terminalOutput")
                .innerHTML = "";
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

            if (argument)
                processKane(argument);

            else
                terminal(
                    "USAGE: ask <query>",
                    "error"
                );

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

        case "history":
            showKaneHistory();
            break;

        case "forget":
            forgetKane();
            break;

        case "briefing":
            generateBriefing();
            break;

        case "decision":
            createDecision();
            break;

        case "analyze-audit":
            analyzeAudit();
            break;

        case "kane-status":
            kaneStatus();
            break;

        case "kane-history":
            showKaneHistory();
            break;

        case "kane-silent":
        case "silent":
            kaneSilentMode();
            break;

        case "kane-resume":
        case "resume":
            kaneResume();
            break;

        case "kane-executive":
            setKaneMode("EXECUTIVE");
            break;

        case "kane-analyst":
            setKaneMode("ANALYST");
            break;

        case "kane-terminal":
            kaneTerminal();
            break;

        case "monitor":
            monitorStatus();
            break;

        case "relations":
        case "related":
            relationEngine(argument);
            break;

        case "activity":
            activityAnalysis();
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
   HELP
========================================================= */

function help() {

    terminal(
`DIVI-64 // EXECUTIVE COMMAND INDEX

CORE
help
clear
status
system
whoami
diagnostics
logout

ARCHIVES
archives
open <ID>
create
search <term>
personnel
directives
audit

KANE
ask <query>
ai
kane-status
kane-history
kane-silent
kane-resume
kane-executive
kane-analyst
kane-terminal
briefing

INTELLIGENCE
analyze <ID>
summarize <ID>
relations <ID>
activity
analyze-audit

EXECUTIVE
decision
rename-ai <name>

NATURAL LANGUAGE
KANE can interpret selected requests directly.

EXAMPLES

Open EM-004
Search authority
Analyze EM-006
Summarize EM-005
Run diagnostics
Find files related to authority
Generate briefing`,
        "system"
    );

}


/* =========================================================
   SYSTEM STATUS
========================================================= */

function status() {

    const account =
        ACCOUNTS[currentSession];


    terminal(
`DIVI-64 // EXECUTIVE STATUS

MAINFRAME        ONLINE
EXECUTIVE CORE   ONLINE
ARCHIVE SYSTEM   ONLINE
AUDIT SYSTEM     ONLINE
${kaneName()} AI CORE    ONLINE
MEMORY           ACTIVE
MONITOR          ${kaneSettings().monitoring ? "ACTIVE" : "DISABLED"}

CUSTOM FILES    ${files().length}
AUDIT EVENTS    ${auditLog().length}
DECISIONS       ${decisions().length}

SESSION         ${currentSession}
CLEARANCE       CL-${account.clearance}`,
        "system"
    );

}


/* =========================================================
   ARCHIVES
========================================================= */

function archives() {

    terminal(
        "EXECUTIVE ARCHIVES // CL-5 // OVERWATCH",
        "system"
    );


    Object
        .entries(ARCHIVES)
        .forEach(
            ([id, file]) => {

                terminal(
                    `${id} // ${file.title} // CL-5`
                );

            }
        );


    files().forEach(file => {

        terminal(
            `${file.id} // ${file.title} // CL-5 // CUSTOM`
        );

    });

}


/* =========================================================
   OPEN FILE
========================================================= */

function openFile(id) {

    if (!id) {

        terminal(
            "USAGE: open <ID>",
            "error"
        );

        return;

    }


    id =
        id
            .toUpperCase()
            .replace(/[.,!?]$/g, "");


    let file =
        getFile(id);


    if (!file) {

        terminal(
            `FILE NOT FOUND // ${id}`,
            "error"
        );

        return;

    }


    lastOpenedFile =
        id;


    audit(
        "FILE_OPENED",
        id
    );


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


    updateKaneCommandCenter();

}


/* =========================================================
   CREATE FILE
========================================================= */

function createFile() {

    const title =
        window.prompt(
            "EXECUTIVE FILE TITLE:"
        );

    if (!title)
        return;


    const content =
        window.prompt(
            "EXECUTIVE FILE CONTENT:"
        );

    if (!content)
        return;


    const id =
        "EM-C" +
        Date.now()
            .toString()
            .slice(-6);


    const newFile = {

        id,

        title,

        content,

        classification:
            "CL-5 // OVERWATCH",

        createdBy:
            currentSession,

        createdAt:
            now()

    };


    const all =
        files();

    all.push(newFile);

    save(
        KEYS.files,
        all
    );


    audit(
        "FILE_CREATED",
        `${id} // ${title}`
    );


    terminal(
        `FILE CREATED // ${id} // ${title}`,
        "success"
    );


    kaneSay(
        `New executive record registered: ${id}. The record is now available to the archive intelligence system.`
    );

}


/* =========================================================
   SEARCH
========================================================= */

function search(term) {

    if (!term) {

        terminal(
            "USAGE: search <term>",
            "error"
        );

        return;

    }


    const query =
        term
            .toLowerCase()
            .trim();

    const results = [];


    Object
        .entries(ARCHIVES)
        .forEach(
            ([id, file]) => {

                const searchable =
                    `${id} ${file.title} ${file.content}`
                        .toLowerCase();

                if (
                    searchable.includes(query)
                ) {

                    results.push({
                        id,
                        title: file.title
                    });

                }

            }
        );


    files().forEach(file => {

        const searchable =
            `${file.id} ${file.title} ${file.content}`
                .toLowerCase();

        if (
            searchable.includes(query)
        ) {

            results.push({
                id: file.id,
                title: file.title
            });

        }

    });


    lastSearchResults =
        results;


    audit(
        "ARCHIVE_SEARCH",
        term
    );


    if (!results.length) {

        terminal(
            "NO MATCHING RECORDS FOUND",
            "error"
        );

        return;

    }


    terminal(
`SEARCH RESULTS // ${results.length}

${results
    .map(
        item =>
            `${item.id} // ${item.title}`
    )
    .join("\n")}`,
        "system"
    );

}


/* =========================================================
   PERSONNEL
========================================================= */

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


/* =========================================================
   DIRECTIVES
========================================================= */

function directives() {

    Object
        .entries(ARCHIVES)
        .forEach(
            ([id, file]) => {

                terminal(
                    `${id} // ${file.title}`
                );

            }
        );

}


/* =========================================================
   AUDIT
========================================================= */

function showAudit() {

    const log =
        auditLog();


    if (!log.length) {

        terminal(
            "AUDIT LOG EMPTY",
            "system"
        );

        return;

    }


    terminal(
`EXECUTIVE AUDIT LOG

${log
    .slice(0, 50)
    .map(
        item =>
`[${item.time}] ${item.user} // ${item.action}${item.details ? " // " + item.details : ""}`
    )
    .join("\n")}`,
        "system"
    );

}


/* =========================================================
   SYSTEM INFO
========================================================= */

function systemInfo() {

    const account =
        ACCOUNTS[currentSession];


    terminal(
`DIVI-64 // EXECUTIVE MANAGEMENT V3

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
${currentKaneMode}

MEMORY:
ACTIVE

AUTONOMOUS MONITOR:
${kaneSettings().monitoring ? "ACTIVE" : "DISABLED"}

SESSION:
${currentSession}

CLEARANCE:
CL-${account.clearance}`,
        "system"
    );

}


/* =========================================================
   WHOAMI
========================================================= */

function whoami() {

    const account =
        ACCOUNTS[currentSession];


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
AUTHORIZED

EXECUTIVE SESSION:
ACTIVE`,
        "system"
    );

}


/* =========================================================
   FILE LOOKUP
========================================================= */

function getFile(id) {

    if (!id)
        return null;


    id =
        id
            .toUpperCase()
            .replace(/[.,!?]$/g, "");


    if (ARCHIVES[id])
        return ARCHIVES[id];


    return files().find(
        file =>
            file.id
                .toUpperCase() === id
    );

}


/* =========================================================
   ANALYZE FILE
========================================================= */

function analyze(id) {

    if (!id) {

        terminal(
            "USAGE: analyze <ID>",
            "error"
        );

        return;

    }


    const file =
        getFile(id);


    if (!file) {

        terminal(
            "FILE NOT FOUND",
            "error"
        );

        return;

    }


    audit(
        "AI_ANALYSIS",
        id
    );


    lastOpenedFile =
        id.toUpperCase();


    processAI(() => {

        const lines =
            file.content
                .split("\n")
                .length;


        const words =
            file.content
                .trim()
                .split(/\s+/)
                .filter(Boolean)
                .length;


        const sections =
            file.content
                .split(/\n\s*\n/)
                .filter(Boolean)
                .length;


        kaneSay(
`ANALYSIS COMPLETE

FILE: ${id.toUpperCase()}
TITLE: ${file.title}
CLASSIFICATION: CL-5 // OVERWATCH

LINES: ${lines}
ESTIMATED WORDS: ${words}
SECTIONS: ${sections}

CREATED BY:
${file.createdBy || "ARCHIVE"}

CREATED:
${file.createdAt || "LEGACY RECORD"}

ASSESSMENT:
This record concerns DIVI-64 executive management procedures and should be handled according to its classification.`
        );

    });

}


/* =========================================================
   SUMMARIZE FILE
========================================================= */

function summarize(id) {

    if (!id) {

        terminal(
            "USAGE: summarize <ID>",
            "error"
        );

        return;

    }


    const file =
        getFile(id);


    if (!file) {

        terminal(
            "FILE NOT FOUND",
            "error"
        );

        return;

    }


    audit(
        "AI_SUMMARY",
        id
    );


    processAI(() => {

        const lines =
            file.content
                .split("\n")
                .filter(
                    line =>
                        line.trim()
                )
                .slice(0, 10)
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

        [
            "DOM CORE",
            !!$("terminalScreen")
        ],

        [
            "LOGIN ENGINE",
            !!$("loginForm")
        ],

        [
            "TERMINAL ENGINE",
            !!$("commandForm")
        ],

        [
            "LOCAL STORAGE",
            !!window.localStorage
        ],

        [
            "KANE CORE",
            !!$("aiForm")
        ],

        [
            "AI CONVERSATION",
            !!$("aiConversationOutput")
        ],

        [
            "COMMAND CENTER",
            !!$("kaneCommandCenter")
        ],

        [
            "AUTONOMOUS MONITOR",
            !!$("kaneMonitor")
        ],

        [
            "BRIEFING ENGINE",
            !!$("briefingModal")
        ],

        [
            "ARCHIVE DATABASE",
            Object.keys(ARCHIVES).length === 12
        ]

    ];


    terminal(
`EXECUTIVE DIAGNOSTICS

${checks
    .map(
        item =>
            `${item[0].padEnd(24)} ${item[1] ? "PASS" : "FAIL"}`
    )
    .join("\n")}

RESULT:
${checks.every(
    item => item[1]
)
    ? "ALL SYSTEMS NOMINAL"
    : "SYSTEM ATTENTION REQUIRED"}`,
        "system"
    );

}


/* =========================================================
   KANE SETUP
========================================================= */

function setupKane() {

    $("aiForm")
        .addEventListener(
            "submit",
            event => {

                event.preventDefault();

                const input =
                    $("aiInput");

                const query =
                    input.value.trim();


                if (
                    !query ||
                    processing
                )
                    return;


                input.value = "";


                addAIMessage(
                    query,
                    "user"
                );


                processKane(
                    query
                );

            }
        );


    $("kaneName")
        .addEventListener(
            "click",
            () => {

                $("kaneMessage")
                    .classList
                    .remove("hidden");

            }
        );


    $("closeKaneMessage")
        .addEventListener(
            "click",
            () => {

                $("kaneMessage")
                    .classList
                    .add("hidden");

            }
        );


    $("closeKaneAlert")
        .addEventListener(
            "click",
            () => {

                $("kaneAlert")
                    .classList
                    .add("hidden");

            }
        );


    $("closeBriefing")
        .addEventListener(
            "click",
            () => {

                $("briefingModal")
                    .classList
                    .add("hidden");

            }
        );


    $("kaneBriefingButton")
        .addEventListener(
            "click",
            generateBriefing
        );


    updateKaneUI();

}


/* =========================================================
   KANE UI
========================================================= */

function updateKaneUI() {

    const name =
        kaneName();


    $("kaneName")
        .textContent =
        name;


    $("aiPrompt")
        .textContent =
        `${name}@AI:~$`;


    $("aiStatusText")
        .textContent =
        kaneSilent
            ? "SILENT MODE // EXECUTIVE INTERACTION SUSPENDED"
            : "READY FOR EXECUTIVE INTERACTION";


    if ($("kaneSession"))
        $("kaneSession")
            .textContent =
            currentSession || "---";


    if ($("kaneContextCount"))
        $("kaneContextCount")
            .textContent =
            String(
                kaneContext.length
            ).padStart(2, "0");


    if ($("kaneProcessingStatus"))
        $("kaneProcessingStatus")
            .textContent =
            processing
                ? "ACTIVE"
                : "IDLE";


    document.title =
        `DIVI64 // ${name} AI CORE`;

}


/* =========================================================
   AI PROCESSING
========================================================= */

function processAI(callback) {

    if (processing)
        return;


    processing = true;


    updateKaneUI();


    const panel =
        $("aiProcessing");

    const bar =
        $("aiProcessingBar");

    const percent =
        $("aiProcessingPercent");


    panel.style.display =
        "block";


    $("aiPanel")
        ?.classList
        .add("processing");


    let value = 0;


    const timer =
        setInterval(() => {

            value +=
                Math.floor(
                    Math.random() * 14
                ) + 8;


            if (value > 100)
                value = 100;


            bar.style.width =
                value + "%";

            percent.textContent =
                value + "%";


            if (value >= 100) {

                clearInterval(timer);


                setTimeout(() => {

                    panel.style.display =
                        "none";

                    bar.style.width =
                        "0%";

                    percent.textContent =
                        "0%";

                    processing =
                        false;


                    $("aiPanel")
                        ?.classList
                        .remove("processing");


                    updateKaneUI();

                    callback();

                }, 250);

            }

        }, 90);

}


/* =========================================================
   AI MESSAGE
========================================================= */

function addAIMessage(
    text,
    type
) {

    const output =
        $("aiConversationOutput");


    const message =
        document.createElement(
            "div"
        );


    message.className =
        type === "user"
            ? "aiMessage aiMessageUser"
            : "aiMessage aiMessageKane";


    const label =
        document.createElement(
            "div"
        );


    label.className =
        "aiMessageLabel";


    label.textContent =
        type === "user"
            ? currentSession
            : kaneName();


    const content =
        document.createElement(
            "div"
        );


    content.textContent =
        text;


    message.appendChild(
        label
    );

    message.appendChild(
        content
    );


    output.appendChild(
        message
    );


    output.scrollTop =
        output.scrollHeight;

}


/* =========================================================
   KANE RESPONSE
========================================================= */

function kaneSay(text) {

    addAIMessage(
        text,
        "kane"
    );


    kaneContext.push({

        role: "KANE",

        text,

        time: now()

    });


    kaneHistory.push({

        type: "KANE",

        text,

        time: now()

    });


    if (
        kaneContext.length > 30
    )
        kaneContext.shift();


    if (
        kaneHistory.length > 100
    )
        kaneHistory.shift();


    updateKaneUI();

}


/* =========================================================
   KANE PROCESSING / NATURAL LANGUAGE
========================================================= */

function processKane(query) {

    if (kaneSilent) {

        kaneSay(
            "Silent mode is active. Use `kane resume` to restore executive interaction."
        );

        return;

    }


    kaneContext.push({

        role:
            currentSession,

        text:
            query,

        time:
            now()

    });


    kaneHistory.push({

        type:
            currentSession,

        text:
            query,

        time:
            now()

    });


    if (
        kaneContext.length > 30
    )
        kaneContext.shift();


    if (
        kaneHistory.length > 100
    )
        kaneHistory.shift();


    updateKaneUI();


    processAI(() => {

        const original =
            query.trim();

        const q =
            original
                .toLowerCase()
                .trim();


        let response = "";


        /* ---------------------------------------------
           IDENTITY
        --------------------------------------------- */

        if (
            q.includes("who are you") ||
            q.includes("what are you") ||
            q.includes("quien eres") ||
            q.includes("qué eres") ||
            q.includes("que eres")
        ) {

            response =
`I am ${kaneName()}, the DIVI-64 Executive Intelligence Core.

Current mode:
${currentKaneMode}

I provide archive assistance, analysis, diagnostics, executive context and command support.`;


        }


        /* ---------------------------------------------
           ONLINE
        --------------------------------------------- */

        else if (
            q.includes("online") ||
            q.includes("are you there") ||
            q.includes("estás ahí") ||
            q.includes("estas ahi")
        ) {

            response =
                `Online, ${currentSession}. All local executive systems are currently available.`;


        }


        /* ---------------------------------------------
           STATUS
        --------------------------------------------- */

        else if (
            q.includes("status") ||
            q.includes("system status") ||
            q.includes("estado del sistema")
        ) {

            response =
`SYSTEM STATUS

MAINFRAME: ONLINE
ARCHIVES: ONLINE
AUDIT: ONLINE
MEMORY: ACTIVE
MONITOR: ${kaneSettings().monitoring ? "ACTIVE" : "DISABLED"}
${kaneName()}: ONLINE

CURRENT SESSION:
${currentSession}

CLEARANCE:
CL-${ACCOUNTS[currentSession].clearance}`;


        }


        /* ---------------------------------------------
           WHO AM I
        --------------------------------------------- */

        else if (
            q.includes("who am i") ||
            q.includes("quien soy") ||
            q.includes("mi autoridad")
        ) {

            response =
`CURRENT EXECUTIVE IDENTITY

SESSION:
${currentSession}

ROLE:
${ACCOUNTS[currentSession].role}

AUTHORITY:
CL-${ACCOUNTS[currentSession].clearance}`;


        }


        /* ---------------------------------------------
           HELP
        --------------------------------------------- */

        else if (
            q === "help" ||
            q.includes("what can you do") ||
            q.includes("que puedes hacer") ||
            q.includes("qué puedes hacer")
        ) {

            response =
`KANE // AVAILABLE FUNCTIONS

Archive navigation
Archive search
File creation awareness
File analysis
File summaries
Natural-language commands
System status
Diagnostics
Executive identity
Session memory
File context
Relation analysis
Audit analysis
Executive briefing
Decision records
Activity analysis
Autonomous monitoring
Command Center
Mode switching
Silent mode
Executive terminal automation

Try:

"Open EM-004"
"Find files about authority"
"Analyze EM-006"
"Summarize the file I opened"
"Run diagnostics"
"Generate an executive briefing"`;


        }


        /* ---------------------------------------------
           HELLO
        --------------------------------------------- */

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


        /* ---------------------------------------------
           THANKS
        --------------------------------------------- */

        else if (
            q.includes("thank you") ||
            q.includes("thanks") ||
            q.includes("gracias")
        ) {

            response =
                "Acknowledged. Executive assistance remains available.";


        }


        /* ---------------------------------------------
           OPEN FILE
        --------------------------------------------- */

        else if (
            q.match(
                /\b(open|abre|abrir)\s+(?:the\s+)?(?:file\s+)?(em-[0-9c]+)/i
            )
        ) {

            const match =
                q.match(
                    /\b(open|abre|abrir)\s+(?:the\s+)?(?:file\s+)?(em-[0-9c]+)/i
                );


            const id =
                match[2].toUpperCase();


            if (!getFile(id)) {

                response =
                    `No archive record matching ${id} was located.`;

            } else {

                response =
                    `Command recognized. Opening ${id}.`;

                setTimeout(
                    () => openFile(id),
                    300
                );

            }


        }


        /* ---------------------------------------------
           SEARCH
        --------------------------------------------- */

        else if (
            q.startsWith("search ") ||
            q.startsWith("find ") ||
            q.startsWith("buscar ")
        ) {

            const term =
                original
                    .replace(
                        /^(search|find|buscar)\s+/i,
                        ""
                    )
                    .trim();


            response =
                `Archive search initiated for "${term}".`;


            setTimeout(
                () => search(term),
                300
            );


        }


        /* ---------------------------------------------
           ANALYZE
        --------------------------------------------- */

        else if (
            q.match(
                /\b(analy[sz]e|analiza|analizar)\s+(?:the\s+)?(?:file\s+)?(em-[0-9c]+)/i
            )
        ) {

            const match =
                q.match(
                    /\b(analy[sz]e|analiza|analizar)\s+(?:the\s+)?(?:file\s+)?(em-[0-9c]+)/i
                );


            const id =
                match[2].toUpperCase();


            response =
                `Analysis request accepted for ${id}.`;


            setTimeout(
                () => analyze(id),
                300
            );


        }


        /* ---------------------------------------------
           SUMMARIZE
        --------------------------------------------- */

        else if (
            q.match(
                /\b(summarize|summary|resum[eé]|resume)\s+(?:the\s+)?(?:file\s+)?(em-[0-9c]+)/i
            )
        ) {

            const match =
                q.match(
                    /\b(summarize|summary|resum[eé]|resume)\s+(?:the\s+)?(?:file\s+)?(em-[0-9c]+)/i
                );


            const id =
                match[2].toUpperCase();


            response =
                `Summary request accepted for ${id}.`;


            setTimeout(
                () => summarize(id),
                300
            );


        }


        /* ---------------------------------------------
           SUMMARIZE LAST OPENED
        --------------------------------------------- */

        else if (
            q.includes("summarize it") ||
            q.includes("summarise it") ||
            q.includes("summarize the file") ||
            q.includes("resume el archivo") ||
            q.includes("resume esto")
        ) {

            if (!lastOpenedFile) {

                response =
                    "No file is currently present in the active context.";

            } else {

                response =
                    `Using active file context: ${lastOpenedFile}.`;

                setTimeout(
                    () =>
                        summarize(
                            lastOpenedFile
                        ),
                    300
                );

            }


        }


        /* ---------------------------------------------
           ANALYZE LAST OPENED
        --------------------------------------------- */

        else if (
            q.includes("analyze it") ||
            q.includes("analyse it") ||
            q.includes("analiza esto") ||
            q.includes("analyze the file")
        ) {

            if (!lastOpenedFile) {

                response =
                    "No file is currently present in the active context.";

            } else {

                response =
                    `Using active file context: ${lastOpenedFile}.`;

                setTimeout(
                    () =>
                        analyze(
                            lastOpenedFile
                        ),
                    300
                );

            }


        }


        /* ---------------------------------------------
           DIAGNOSTICS
        --------------------------------------------- */

        else if (
            q.includes("diagnostic") ||
            q.includes("run a system check") ||
            q.includes("system check") ||
            q.includes("diagnóstico") ||
            q.includes("comprueba el sistema")
        ) {

            response =
                "Executing executive diagnostics.";

            setTimeout(
                () => diagnostics(),
                300
            );


        }


        /* ---------------------------------------------
           BRIEFING
        --------------------------------------------- */

        else if (
            q.includes("briefing") ||
            q.includes("executive briefing") ||
            q.includes("informe ejecutivo") ||
            q.includes("resumen ejecutivo")
        ) {

            response =
                "Generating executive briefing.";

            setTimeout(
                () =>
                    generateBriefing(),
                350
            );


        }


        /* ---------------------------------------------
           RELATION ENGINE
        --------------------------------------------- */

        else if (
            q.includes("related") ||
            q.includes("relations") ||
            q.includes("related files") ||
            q.includes("archivos relacionados") ||
            q.includes("find related")
        ) {

            response =
                "Relation Engine activated.";

            setTimeout(
                () =>
                    relationEngine(
                        lastOpenedFile
                    ),
                350
            );


        }


        /* ---------------------------------------------
           ACTIVITY
        --------------------------------------------- */

        else if (
            q.includes("activity analysis") ||
            q.includes("analyze activity") ||
            q.includes("actividad reciente")
        ) {

            response =
                "Analyzing recent executive activity.";

            setTimeout(
                () =>
                    activityAnalysis(),
                350
            );


        }


        /* ---------------------------------------------
           AUDIT ANALYSIS
        --------------------------------------------- */

        else if (
            q.includes("analyze audit") ||
            q.includes("audit analysis") ||
            q.includes("analiza la auditoría")
        ) {

            response =
                "Analyzing Executive Audit records.";

            setTimeout(
                () =>
                    analyzeAudit(),
                350
            );


        }


        /* ---------------------------------------------
           SILENT MODE
        --------------------------------------------- */

        else if (
            q.includes("silent mode") ||
            q.includes("modo silencio")
        ) {

            kaneSilentMode();

            return;


        }


        /* ---------------------------------------------
           RESUME
        --------------------------------------------- */

        else if (
            q.includes("resume mode") ||
            q === "resume kane" ||
            q.includes("reanuda")
        ) {

            kaneResume();

            return;


        }


        /* ---------------------------------------------
           RENAME
        --------------------------------------------- */

        else if (
            q.includes("rename") ||
            q.includes("change your name") ||
            q.includes("cambia tu nombre")
        ) {

            response =
                "AI designation modification is restricted. The rename operation is available exclusively to CO.";


        }


        /* ---------------------------------------------
           CURRENT NAME
        --------------------------------------------- */

        else if (
            q.includes("your name") ||
            q.includes("tu nombre")
        ) {

            response =
                `Current AI designation: ${kaneName()}.`;


        }


        /* ---------------------------------------------
           DECISION
        --------------------------------------------- */

        else if (
            q.includes("create decision") ||
            q.includes("new decision") ||
            q.includes("crear decisión")
        ) {

            response =
                "Executive decision record interface ready.";

            setTimeout(
                () => createDecision(),
                300
            );


        }


        /* ---------------------------------------------
           SYSTEM TERMINAL
        --------------------------------------------- */

        else if (
            q.includes("take over terminal") ||
            q.includes("kane terminal") ||
            q.includes("control terminal")
        ) {

            response =
                "Executive terminal automation initialized.";

            setTimeout(
                () =>
                    kaneTerminal(),
                300
            );


        }


        /* ---------------------------------------------
           DEFAULT
        --------------------------------------------- */

        else {

            response =
`Request received.

No predefined direct interpretation was found.

I can attempt archive search, file analysis, system diagnostics or executive contextual interpretation.

Try:
"Open EM-004"
"Find files about authority"
"Analyze this file"
"Generate briefing"
"Run diagnostics"`;

        }


        kaneSay(response);

    });

}


/* =========================================================
   KANE HISTORY
========================================================= */

function showKaneHistory() {

    if (!kaneHistory.length) {

        terminal(
            "KANE HISTORY EMPTY",
            "system"
        );

        return;

    }


    terminal(
`KANE // SESSION HISTORY

${kaneHistory
    .slice(-40)
    .map(
        item =>
            `[${item.time}] ${item.type} // ${item.text}`
    )
    .join("\n")}`,
        "system"
    );

}


/* =========================================================
   FORGET CONTEXT
========================================================= */

function forgetKane() {

    kaneContext = [];

    lastOpenedFile = null;

    lastSearchResults = [];

    audit(
        "AI_CONTEXT_CLEARED"
    );


    terminal(
        "KANE CONTEXT CLEARED // SESSION MEMORY RESET",
        "success"
    );


    updateKaneUI();

}


/* =========================================================
   KANE STATUS
========================================================= */

function kaneStatus() {

    terminal(
`KANE // INTELLIGENCE CORE STATUS

DESIGNATION:
${kaneName()}

CORE:
ONLINE

MODE:
${currentKaneMode}

MEMORY:
ACTIVE

CONTEXT:
${kaneContext.length} ENTRIES

HISTORY:
${kaneHistory.length} ENTRIES

PROCESSING:
${processing ? "ACTIVE" : "IDLE"}

MONITOR:
${kaneSettings().monitoring ? "ACTIVE" : "DISABLED"}

AUDIT LINK:
ACTIVE

AUTHORITY LINK:
${currentSession}

CLEARANCE:
CL-${ACCOUNTS[currentSession].clearance}`,
        "system"
    );

}


/* =========================================================
   KANE SILENT
========================================================= */

function kaneSilentMode() {

    kaneSilent = true;

    const settings =
        kaneSettings();

    settings.silent = true;

    saveKaneSettings(
        settings
    );


    audit(
        "KANE_SILENT_MODE",
        currentSession
    );


    terminal(
        "KANE // SILENT MODE ENABLED",
        "success"
    );


    updateKaneUI();

}


/* =========================================================
   KANE RESUME
========================================================= */

function kaneResume() {

    kaneSilent = false;

    const settings =
        kaneSettings();

    settings.silent = false;

    saveKaneSettings(
        settings
    );


    audit(
        "KANE_RESUMED",
        currentSession
    );


    terminal(
        "KANE // EXECUTIVE INTERACTION RESTORED",
        "success"
    );


    kaneSay(
        `Executive interaction restored, ${currentSession}.`
    );

}


/* =========================================================
   KANE MODES
========================================================= */

function setKaneMode(mode) {

    const valid =
        [
            "EXECUTIVE",
            "ANALYST"
        ];


    if (
        !valid.includes(mode)
    )
        return;


    currentKaneMode =
        mode;


    const settings =
        kaneSettings();

    settings.mode =
        mode;

    saveKaneSettings(
        settings
    );


    audit(
        "KANE_MODE_CHANGED",
        mode
    );


    terminal(
        `KANE MODE // ${mode}`,
        "success"
    );


    kaneSay(
        mode === "ANALYST"
            ? "Analyst mode active. Archive relationships, activity and document structure will receive increased attention."
            : "Executive mode active. Responses will prioritize concise executive assistance."
    );

}


/* =========================================================
   COMMAND CENTER
========================================================= */

function updateKaneCommandCenter() {

    if (!$("kaneCoreStatus"))
        return;


    $("kaneCoreStatus")
        .textContent =
        "ONLINE";


    $("kaneSession")
        .textContent =
        currentSession || "---";


    $("kaneMemoryStatus")
        .textContent =
        "ACTIVE";


    $("kaneContextCount")
        .textContent =
        String(
            kaneContext.length
        ).padStart(2, "0");


    $("kaneProcessingStatus")
        .textContent =
        processing
            ? "ACTIVE"
            : "IDLE";


    $("kaneAuditStatus")
        .textContent =
        "ACTIVE";

}


/* =========================================================
   RELATION ENGINE
========================================================= */

function relationEngine(id) {

    if (!id)
        id = lastOpenedFile;


    if (!id) {

        terminal(
            "NO ACTIVE FILE CONTEXT",
            "error"
        );

        return;

    }


    const source =
        getFile(id);


    if (!source) {

        terminal(
            "SOURCE FILE NOT FOUND",
            "error"
        );

        return;

    }


    const sourceText =
        `${source.title} ${source.content}`
            .toLowerCase();


    const sourceWords =
        new Set(
            sourceText
                .split(/[^a-z0-9-]+/)
                .filter(
                    word =>
                        word.length >= 5
                )
        );


    const results = [];


    function compareFile(
        fileId,
        file
    ) {

        if (
            fileId.toUpperCase() ===
            id.toUpperCase()
        )
            return;


        const targetText =
            `${file.title} ${file.content}`
                .toLowerCase();


        let matches = 0;


        sourceWords.forEach(
            word => {

                if (
                    targetText.includes(
                        word
                    )
                )
                    matches++;

            }
        );


        if (matches >= 2) {

            results.push({

                id: fileId,

                title: file.title,

                matches

            });

        }

    }


    Object.entries(
        ARCHIVES
    ).forEach(
        ([fileId, file]) =>
            compareFile(
                fileId,
                file
            )
    );


    files().forEach(
        file =>
            compareFile(
                file.id,
                file
            )
    );


    results.sort(
        (a, b) =>
            b.matches -
            a.matches
    );


    audit(
        "RELATION_ANALYSIS",
        id
    );


    if (!results.length) {

        terminal(
`RELATION ENGINE

SOURCE:
${id}

NO STRONG DOCUMENT RELATIONSHIPS DETECTED.`,
            "system"
        );

        return;

    }


    terminal(
`RELATION ENGINE

SOURCE:
${id}

RELATED RECORDS:
${results
    .slice(0, 15)
    .map(
        item =>
            `${item.id} // ${item.title} // MATCHES: ${item.matches}`
    )
    .join("\n")}`,
        "system"
    );

}


/* =========================================================
   ACTIVITY ANALYSIS
========================================================= */

function activityAnalysis() {

    const log =
        auditLog();


    if (!log.length) {

        terminal(
            "NO ACTIVITY AVAILABLE",
            "system"
        );

        return;

    }


    const counts = {};


    log.forEach(
        item => {

            counts[item.action] =
                (
                    counts[item.action] ||
                    0
                ) + 1;

        }
    );


    const recent =
        log.slice(
            0,
            20
        );


    audit(
        "ACTIVITY_ANALYSIS"
    );


    terminal(
`KANE // ACTIVITY ANALYSIS

TOTAL AUDIT EVENTS:
${log.length}

RECENT EVENTS:
${recent.length}

ACTION DISTRIBUTION:

${Object.entries(counts)
    .sort(
        (a, b) =>
            b[1] - a[1]
    )
    .slice(0, 12)
    .map(
        ([action, count]) =>
            `${action.padEnd(25)} ${count}`
    )
    .join("\n")}

RECENT ACTIVITY:

${recent
    .slice(0, 10)
    .map(
        item =>
            `[${item.time}] ${item.user} // ${item.action}`
    )
    .join("\n")}`,
        "system"
    );


    updateMonitor(
        "SYSTEM ACTIVITY ANALYZED",
        `${log.length} audit events currently available.`,
        "normal"
    );

}


/* =========================================================
   AUDIT ANALYSIS
========================================================= */

function analyzeAudit() {

    const log =
        auditLog();


    if (!log.length) {

        terminal(
            "AUDIT LOG EMPTY",
            "system"
        );

        return;

    }


    const failed =
        log.filter(
            item =>
                item.action
                    .includes("FAILED") ||
                item.action
                    .includes("DENIED")
        ).length;


    const fileAccess =
        log.filter(
            item =>
                item.action ===
                "FILE_OPENED"
        ).length;


    const searches =
        log.filter(
            item =>
                item.action ===
                "ARCHIVE_SEARCH"
        ).length;


    const aiActions =
        log.filter(
            item =>
                item.action
                    .startsWith("AI_")
        ).length;


    audit(
        "AUDIT_ANALYSIS"
    );


    terminal(
`KANE // AUDIT ANALYSIS

TOTAL EVENTS:
${log.length}

FAILED / DENIED:
${failed}

FILE ACCESS:
${fileAccess}

ARCHIVE SEARCHES:
${searches}

AI EVENTS:
${aiActions}

ASSESSMENT:
Executive audit records are available for review.

${failed > 0
    ? "ATTENTION: Security-related events are present in the current audit history."
    : "NO FAILED OR DENIED EVENTS DETECTED IN CURRENT AUDIT HISTORY."}`,
        failed > 0
            ? "error"
            : "system"
    );


    if (failed > 0) {

        updateMonitor(
            "SECURITY-RELATED ACTIVITY DETECTED",
            `${failed} failed or denied event(s) found in audit history.`,
            "warning"
        );

    }

}


/* =========================================================
   EXECUTIVE BRIEFING
========================================================= */

function generateBriefing() {

    const modal =
        $("briefingModal");

    const content =
        $("briefingContent");


    modal.classList.remove(
        "hidden"
    );


    content.innerHTML =
        `<div class="briefingLoading">
            GENERATING EXECUTIVE BRIEFING...
        </div>`;


    audit(
        "EXECUTIVE_BRIEFING"
    );


    setTimeout(() => {

        const log =
            auditLog();

        const custom =
            files();

        const decisionList =
            decisions();


        const recent =
            log.slice(
                0,
                8
            );


        content.textContent =
`KANE // EXECUTIVE BRIEFING

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SESSION

EXECUTIVE:
${currentSession}

ROLE:
${ACCOUNTS[currentSession].role}

CLEARANCE:
CL-${ACCOUNTS[currentSession].clearance}

TIME:
${now()}


SYSTEM

MAINFRAME:
ONLINE

ARCHIVES:
ONLINE

AUDIT:
ONLINE

INTELLIGENCE CORE:
${kaneName()}

KANE MODE:
${currentKaneMode}

AUTONOMOUS MONITOR:
${kaneSettings().monitoring ? "ACTIVE" : "DISABLED"}


ARCHIVE STATUS

STANDARD RECORDS:
${Object.keys(ARCHIVES).length}

CUSTOM RECORDS:
${custom.length}

TOTAL RECORDS:
${Object.keys(ARCHIVES).length + custom.length}


ACTIVITY

AUDIT EVENTS:
${log.length}

DECISION RECORDS:
${decisionList.length}

KANE CONTEXT:
${kaneContext.length}

LAST OPENED:
${lastOpenedFile || "NONE"}


RECENT ACTIVITY

${recent.length
    ? recent
        .map(
            item =>
                `[${item.time}] ${item.user} // ${item.action}${item.details ? " // " + item.details : ""}`
        )
        .join("\n")
    : "NO RECENT ACTIVITY"}


SYSTEM ASSESSMENT

MAINFRAME:
NOMINAL

EXECUTIVE SESSION:
ACTIVE

ARCHIVE INTEGRITY:
AVAILABLE

AUDIT SYSTEM:
ACTIVE

INTELLIGENCE CORE:
OPERATIONAL

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

END OF EXECUTIVE BRIEFING`;

    }, 500);

}


/* =========================================================
   DECISION RECORDS
========================================================= */

function createDecision() {

    if (
        currentSession !== "CO" &&
        currentSession !== "COS"
    ) {

        terminal(
            "ACCESS DENIED // DECISION RECORDS REQUIRE CL-4 OR HIGHER",
            "error"
        );

        audit(
            "DECISION_CREATE_DENIED",
            currentSession
        );

        return;

    }


    $("recordModal")
        .classList
        .remove("hidden");


    $("recordTitle").value =
        "";

    $("recordSubject").value =
        "";

    $("recordContent").value =
        "";

}


/* =========================================================
   DECISION MODAL
========================================================= */

function setupDecisionModal() {

    $("cancelRecord")
        .addEventListener(
            "click",
            () => {

                $("recordModal")
                    .classList
                    .add("hidden");

            }
        );


    $("saveRecord")
        .addEventListener(
            "click",
            () => {

                const title =
                    $("recordTitle")
                        .value
                        .trim();

                const subject =
                    $("recordSubject")
                        .value
                        .trim();

                const content =
                    $("recordContent")
                        .value
                        .trim();


                if (
                    !title ||
                    !subject ||
                    !content
                ) {

                    alert(
                        "ALL EXECUTIVE RECORD FIELDS ARE REQUIRED"
                    );

                    return;

                }


                const id =
                    "DEC-" +
                    Date.now()
                        .toString()
                        .slice(-6);


                const record = {

                    id,

                    title,

                    subject,

                    content,

                    createdBy:
                        currentSession,

                    createdAt:
                        now()

                };


                const list =
                    decisions();

                list.unshift(
                    record
                );


                save(
                    KEYS.decisions,
                    list.slice(0, 500)
                );


                audit(
                    "DECISION_CREATED",
                    id
                );


                $("recordModal")
                    .classList
                    .add("hidden");


                terminal(
`EXECUTIVE DECISION RECORDED

ID:
${id}

TITLE:
${title}

SUBJECT:
${subject}

CREATED BY:
${currentSession}`,
                    "success"
                );


                kaneSay(
                    `Executive decision ${id} has been recorded and added to the local decision registry.`
                );

            }
        );

}


/* =========================================================
   KANE TERMINAL AUTOMATION
========================================================= */

function kaneTerminal() {

    const sequence = [

        "KANE // EXECUTIVE AUTOMATION",

        "> CHECK SYSTEM",

        "> CHECK ARCHIVES",

        "> CHECK AUDIT",

        "> CHECK SESSION",

        "> CHECK AI CORE",

        "",

        "ALL CHECKS COMPLETE",

        "SYSTEM STATUS: NOMINAL"

    ];


    let index = 0;


    const timer =
        setInterval(() => {

            if (
                index >=
                sequence.length
            ) {

                clearInterval(
                    timer
                );

                audit(
                    "KANE_TERMINAL_AUTOMATION"
                );

                return;

            }


            terminal(
                sequence[index],
                "system"
            );


            index++;

        }, 280);

}


/* =========================================================
   AUTONOMOUS MONITOR
========================================================= */

function startAutonomousMonitor() {

    stopAutonomousMonitor();


    const settings =
        kaneSettings();


    if (
        settings.monitoring === false
    )
        return;


    updateMonitor(
        "SYSTEM MONITORING ACTIVE",
        "NO ANOMALIES DETECTED",
        "normal"
    );


    monitorTimer =
        setInterval(
            autonomousMonitor,
            15000
        );

}


/* =========================================================
   STOP MONITOR
========================================================= */

function stopAutonomousMonitor() {

    if (monitorTimer) {

        clearInterval(
            monitorTimer
        );

        monitorTimer =
            null;

    }

}


/* =========================================================
   AUTONOMOUS MONITOR LOGIC
========================================================= */

function autonomousMonitor() {

    if (!currentSession)
        return;


    const log =
        auditLog();


    const recent =
        log.slice(
            0,
            12
        );


    const denied =
        recent.filter(
            item =>
                item.action
                    .includes("DENIED") ||
                item.action
                    .includes("FAILED")
        );


    const renameDenied =
        recent.filter(
            item =>
                item.action ===
                "AI_RENAME_DENIED"
        );


    if (
        denied.length >= 3
    ) {

        updateMonitor(
            "PRIORITY SECURITY EVENT",
            `${denied.length} failed or denied events detected in recent audit activity.`,
            "alert"
        );


        showKaneAlert(
`SYSTEM EVENT DETECTED

RECENT SECURITY ACTIVITY:
${denied.length} FAILED / DENIED EVENTS

ACTION:
EVENTS REMAIN RECORDED IN EXECUTIVE AUDIT

AUDIT STATUS:
ACTIVE`
        );

        return;

    }


    if (
        renameDenied.length > 0
    ) {

        updateMonitor(
            "RESTRICTED OPERATION DETECTED",
            "A denied AI designation change exists in recent audit history.",
            "warning"
        );

        return;

    }


    updateMonitor(
        "SYSTEM MONITORING ACTIVE",
        "NO ANOMALIES DETECTED",
        "normal"
    );

}


/* =========================================================
   MONITOR STATUS
========================================================= */

function monitorStatus() {

    const settings =
        kaneSettings();


    terminal(
`KANE // AUTONOMOUS MONITOR

STATUS:
${settings.monitoring ? "ACTIVE" : "DISABLED"}

SESSION:
${currentSession}

AUDIT LINK:
ACTIVE

LAST CHECK:
${now()}`,
        "system"
    );

}


/* =========================================================
   MONITOR UI
========================================================= */

function updateMonitor(
    status,
    detail,
    state = "normal"
) {

    const panel =
        $("kaneMonitor");

    const statusElement =
        $("kaneMonitorStatus");

    const detailElement =
        $("kaneMonitorDetail");


    if (
        !panel ||
        !statusElement ||
        !detailElement
    )
        return;


    panel.classList.remove(
        "alert",
        "warning"
    );


    if (
        state === "alert"
    )
        panel.classList.add(
            "alert"
        );


    if (
        state === "warning"
    )
        panel.classList.add(
            "warning"
        );


    statusElement.textContent =
        status;

    detailElement.textContent =
        detail;

}


/* =========================================================
   KANE ALERT
========================================================= */

function showKaneAlert(
    text
) {

    $("kaneAlertContent")
        .textContent =
        text;


    $("kaneAlert")
        .classList
        .remove("hidden");


    audit(
        "KANE_PRIORITY_ALERT",
        text
    );

}


/* =========================================================
   RENAME KANE / TETO
========================================================= */

function renameAI(newName) {

    if (!newName) {

        terminal(
            "USAGE: rename-ai <new name>",
            "error"
        );

        return;

    }


    if (
        currentSession !==
        "CO"
    ) {

        terminal(
            "ACCESS DENIED // ONLY CO MAY MODIFY AI DESIGNATION",
            "error"
        );


        audit(
            "AI_RENAME_DENIED",
            `${currentSession} attempted AI rename`
        );


        updateMonitor(
            "RESTRICTED OPERATION DETECTED",
            `${currentSession} attempted to modify AI designation.`,
            "warning"
        );


        return;

    }


    newName =
        newName
            .trim()
            .toUpperCase();


    if (
        !/^[A-Z0-9_-]{2,20}$/
            .test(newName)
    ) {

        terminal(
            "INVALID AI DESIGNATION",
            "error"
        );

        return;

    }


    const oldName =
        kaneName();


    setKaneName(
        newName
    );


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
   UPDATE TERMINAL
========================================================= */

function updateTerminal() {

    const account =
        ACCOUNTS[currentSession];


    $("currentSession")
        .textContent =
        currentSession;


    $("authorityLevel")
        .textContent =
        `CL-${account.clearance}`;


    $("welcomeText")
        .textContent =
        welcome(
            currentSession
        );


    updateKaneUI();

    updateKaneCommandCenter();

}


/* =========================================================
   CLOCK
========================================================= */

function clock() {

    const element =
        $("terminalClock");


    if (!element)
        return;


    element.textContent =
        new Date()
            .toLocaleTimeString(
                "en-GB",
                {
                    hour12: false
                }
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


    stopAutonomousMonitor();


    authenticatedUser =
        null;

    currentSession =
        null;

    kaneContext =
        [];

    lastOpenedFile =
        null;

    lastSearchResults =
        [];


    $("terminalOutput")
        .innerHTML =
        "";

    $("aiConversationOutput")
        .innerHTML =
        "";


    $("terminalScreen")
        .classList
        .add("hidden");


    $("loginScreen")
        .classList
        .remove("hidden");


    $("username")
        .value =
        "";

    $("password")
        .value =
        "";

    $("loginMessage")
        .textContent =
        "";


    updateKaneUI();

}


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupLogin();

        setupSessions();

        setupTerminal();

        setupKane();

        setupDecisionModal();


        $("logoutButton")
            .addEventListener(
                "click",
                logout
            );


        clock();

        setInterval(
            clock,
            1000
        );


        boot();

    }
);
