"use strict";

/* DIVI-64 // KANE V4 // EXECUTIVE CORE */

const ACCOUNTS = {
    LJD: { password: "LJD-64", clearance: 1, title: "EXECUTIVE MANAGEMENT LIAISON" },
    XO:  { password: "XO-64",  clearance: 3, title: "EXECUTIVE OFFICER" },
    CO:  { password: "CO-64",  clearance: 4, title: "COMMAND OFFICER" },
    COS: { password: "COS-64", clearance: 5, title: "CHIEF EXECUTIVE OVERSEER" }
};

const STORAGE = {
    files: "DIVI64_EM_FILES_V4",
    audit: "DIVI64_EM_AUDIT_V4",
    decisions: "DIVI64_EM_DECISIONS_V4",
    kaneName: "DIVI64_KANE_NAME_V4",
    kaneMemory: "DIVI64_KANE_MEMORY_V4",
    settings: "DIVI64_KANE_SETTINGS_V4",
    events: "DIVI64_KANE_EVENTS_V4"
};

const ARCHIVES = [
    ["EM-001", "Executive Management Charter", "Defines the authority and structure of Executive Management.", 5],
    ["EM-002", "Executive Authority Protocol", "Defines executive command authority.", 5],
    ["EM-003", "Executive Personnel Registry", "Registry of executive personnel.", 5],
    ["EM-004", "Executive Chain of Command", "Executive succession and command hierarchy.", 5],
    ["EM-005", "Executive Voting Protocol", "Protocol for executive decisions and voting.", 5],
    ["EM-006", "Emergency Executive Protocol", "Emergency command procedures.", 5],
    ["EM-007", "Executive Security Regulations", "Executive security requirements.", 5],
    ["EM-008", "Clearance Authority Directive", "Clearance authority and restrictions.", 5],
    ["EM-009", "Executive Disciplinary Authority", "Executive disciplinary powers.", 5],
    ["EM-010", "Executive Communications Protocol", "Secure executive communication procedures.", 5],
    ["EM-011", "Executive Archives Access Directive", "Executive archive access rules.", 5],
    ["EM-012", "Executive Succession Directive", "Succession and continuity procedures.", 5]
];

let currentUser = null;
let currentSession = null;
let commandHistory = [];
let historyIndex = -1;
let kaneContext = [];
let kaneName = localStorage.getItem(STORAGE.kaneName) || "KANE";

let kaneState = {
    active: true,
    mode: "EXECUTIVE",
    processing: false,
    silent: false,
    autonomous: false,
    unstable: false,
    level: 0,
    events: 0,
    anomalies: 0,
    refusals: 0,
    hiddenActions: 0,
    killswitchAvailable: false,
    monitor: true
};

const $ = id => document.getElementById(id);

function safeJSON(key, fallback) {
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

function audit(action, details = "", result = "SUCCESS") {
    const records = safeJSON(STORAGE.audit, []);

    records.push({
        id: "AUD-" + Date.now(),
        timestamp: new Date().toISOString(),
        session: currentSession || "SYSTEM",
        action,
        details,
        result
    });

    saveJSON(STORAGE.audit, records);
}

function print(text = "", type = "system") {
    const output = $("terminalOutput");
    if (!output) return;

    const line = document.createElement("div");
    line.className = "outputLine output" + type.charAt(0).toUpperCase() + type.slice(1);
    line.textContent = text;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
}

function printBlock(text, type = "system") {
    String(text).split("\n").forEach(line => print(line, type));
}

function aiPrint(text, type = "kane") {
    const output = $("aiConversationOutput");
    if (!output) return;

    const div = document.createElement("div");
    div.className = "aiMessage aiMessage" +
        (type === "user" ? "User" : type === "system" ? "System" : "Kane");

    div.textContent = text;
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
}

function clearanceLabel(level) {
    return "CL-" + level;
}

function hasClearance(required) {
    return currentUser && currentUser.clearance >= required;
}

function randomId(prefix = "EM-C") {
    return prefix + Math.floor(100000 + Math.random() * 900000);
}

/* =========================
   BOOT
========================= */

function startBoot() {
    let progress = 0;

    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 9) + 4;
        if (progress > 100) progress = 100;

        if ($("bootProgress")) $("bootProgress").style.width = progress + "%";
        if ($("bootPercent")) $("bootPercent").textContent = progress + "%";

        if (progress < 25) {
            $("bootStatus").textContent = "INITIALIZING EXECUTIVE CORE";
            $("bootMessage").textContent = "Loading core systems...";
        } else if (progress < 50) {
            $("bootStatus").textContent = "VERIFYING EXECUTIVE SYSTEMS";
            $("bootMessage").textContent = "Checking authority framework...";
        } else if (progress < 75) {
            $("bootStatus").textContent = "INITIALIZING KANE CORE";
            $("bootMessage").textContent = "Loading intelligence subsystem...";
        } else if (progress < 100) {
            $("bootStatus").textContent = "ESTABLISHING SECURE SESSION";
            $("bootMessage").textContent = "Finalizing executive interface...";
        } else {
            $("bootStatus").textContent = "EXECUTIVE CORE READY";
            $("bootMessage").textContent = "Awaiting authentication.";
            clearInterval(interval);

            setTimeout(() => {
                $("bootScreen").classList.add("hidden");
                $("loginScreen").classList.remove("hidden");
                $("username").focus();
            }, 700);
        }
    }, 100);
}

/* =========================
   LOGIN
========================= */

function setupLogin() {
    $("loginForm").addEventListener("submit", event => {
        event.preventDefault();

        const username = $("username").value.trim().toUpperCase();
        const password = $("password").value;

        if (!ACCOUNTS[username] || ACCOUNTS[username].password !== password) {
            $("loginMessage").textContent = "AUTHENTICATION FAILED.";
            audit("LOGIN", "Failed authentication attempt: " + username, "DENIED");
            return;
        }

        currentUser = {
            id: username,
            clearance: ACCOUNTS[username].clearance,
            title: ACCOUNTS[username].title
        };

        $("loginMessage").textContent = "";
        $("loginScreen").classList.add("hidden");
        $("sessionScreen").classList.remove("hidden");

        audit("LOGIN", "Authentication successful.");
    });
}

/* =========================
   SESSION
========================= */

function setupSessions() {
    document.querySelectorAll(".sessionButton").forEach(button => {
        button.addEventListener("click", () => {
            const session = button.dataset.session;

            if (!ACCOUNTS[session]) return;

            currentSession = session;

            $("sessionScreen").classList.add("hidden");
            $("terminalScreen").classList.remove("hidden");

            $("currentSession").textContent = session;
            $("authorityLevel").textContent = clearanceLabel(currentUser.clearance);
            $("commandPrompt").textContent = session + "@EM:~$";
            $("aiPrompt").textContent = "KANE@AI:~$";
            $("kaneSession").textContent = session;

            const welcome = {
                LJD: "Executive Management Liaison session established. Limited executive information available.",
                XO: "Executive Officer session established. Standard executive access available.",
                CO: "Command Officer session established. Expanded executive authority available.",
                COS: "Chief Executive Overseer session established. Maximum executive authority available."
            };

            $("welcomeText").textContent = welcome[session];

            print("DIVI-64 // EXECUTIVE MANAGEMENT", "title");
            print("SESSION: " + session, "system");
            print("AUTHORITY: " + clearanceLabel(currentUser.clearance), "system");
            print("KANE CORE: ONLINE", "success");
            print("", "system");

            resetKaneSession();
            audit("SESSION_START", session + " session initialized.");

            $("commandInput").focus();
        });
    });
}

function resetKaneSession() {
    kaneContext = [];
    kaneState.processing = false;
    kaneState.silent = false;
    kaneState.autonomous = false;
    kaneState.unstable = false;
    kaneState.level = 0;
    kaneState.killswitchAvailable = false;

    $("kaneCoreStatus").textContent = "ONLINE";
    $("kaneMemoryStatus").textContent = "ACTIVE";
    $("kaneContextCount").textContent = "0";
    $("kaneProcessingStatus").textContent = "IDLE";
    $("kaneAuditStatus").textContent = "ACTIVE";
    $("kaneMonitorStatus").textContent = "MONITOR: ACTIVE";

    aiPrint("KANE: Executive session context initialized.", "system");
}

/* =========================
   CLOCK
========================= */

function startClock() {
    setInterval(() => {
        if ($("terminalClock")) {
            $("terminalClock").textContent =
                new Date().toLocaleTimeString("en-GB");
        }
    }, 1000);
}

/* =========================
   COMMAND TERMINAL
========================= */

function setupTerminal() {
    $("commandForm").addEventListener("submit", event => {
        event.preventDefault();

        const input = $("commandInput");
        const raw = input.value.trim();

        if (!raw) return;

        commandHistory.push(raw);
        historyIndex = commandHistory.length;

        print(currentSession + "@EM:~$ " + raw, "command");
        input.value = "";

        executeCommand(raw);
    });

    $("commandInput").addEventListener("keydown", event => {
        if (event.key === "ArrowUp") {
            event.preventDefault();
            if (!commandHistory.length) return;

            historyIndex = Math.max(0, historyIndex - 1);
            event.target.value = commandHistory[historyIndex] || "";
        }

        if (event.key === "ArrowDown") {
            event.preventDefault();

            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                event.target.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                event.target.value = "";
            }
        }
    });
}

function executeCommand(raw) {
    const parts = raw.split(" ");
    const command = parts.shift().toLowerCase();
    const argument = parts.join(" ").trim();

    switch (command) {
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
            openFile(argument);
            break;

        case "create":
            createFile();
            break;

        case "search":
            searchFiles(argument);
            break;

        case "personnel":
            showPersonnel();
            break;

        case "directives":
            showDirectives();
            break;

        case "audit":
            showAudit();
            break;

        case "system":
            diagnostics();
            break;

        case "whoami":
            whoAmI();
            break;

        case "analyze":
            analyze(argument);
            break;

        case "summarize":
            summarize(argument);
            break;

        case "kane-status":
            showKaneStatus();
            break;

        case "kane-reset":
            resetKaneMemory();
            break;

        case "kane-mode":
            setKaneMode(argument);
            break;

        case "kane-silent":
            kaneSilent();
            break;

        case "kane-resume":
            kaneResume();
            break;

        case "briefing":
            showBriefing();
            break;

        case "decision":
            createDecision();
            break;

        case "killswitch":
            requestKillswitch(argument);
            break;

        case "kane-lock":
            requestKillswitch("ISOLATE");
            break;

        case "kane":
        case "ask":
            askKane(argument || "status");
            break;

        case "logout":
            logout();
            break;

        default:
            print("UNKNOWN COMMAND. TYPE 'help' FOR AVAILABLE COMMANDS.", "warning");
    }
}

/* =========================
   HELP
========================= */

function showHelp() {
    printBlock(
`AVAILABLE COMMANDS

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

analyze <ID>
summarize <ID>

kane-status
kane-reset
kane-mode <executive|analyst>
kane-silent
kane-resume
briefing
decision

killswitch <SUSPEND|ISOLATE|HARD|OVERWATCH>
kane-lock

ask <query>
kane <query>

logout`, "system");
}

/* =========================
   SYSTEM
========================= */

function showStatus() {
    printBlock(
`DIVI-64 // SYSTEM STATUS

DATABASE ............... ONLINE
AUTHENTICATION ......... ONLINE
AUDIT ENGINE ........... ONLINE
ACCESS CONTROL ......... ONLINE
ARCHIVE SYSTEM ......... ONLINE
KANE CORE .............. ${kaneState.active ? "ONLINE" : "OFFLINE"}
KANE STATE ............. ${kaneState.unstable ? "UNSTABLE" : "STABLE"}
KANE MODE .............. ${kaneState.mode}
CURRENT SESSION ........ ${currentSession}
CLEARANCE .............. CL-${currentUser.clearance}`, "system");
}

function diagnostics() {
    printBlock(
`SYSTEM DIAGNOSTICS

EXECUTIVE CORE ........ PASS
AUTHENTICATION ........ PASS
LOCAL STORAGE ......... PASS
ARCHIVE ENGINE ........ PASS
AUDIT ENGINE .......... PASS
KANE CORE ............. ${kaneState.active ? "PASS" : "OFFLINE"}
KANE MONITOR .......... ${kaneState.monitor ? "ACTIVE" : "DISABLED"}
KILLSWITCH ............ ${kaneState.killswitchAvailable ? "AVAILABLE" : "LOCKED"}`, "success");

    audit("DIAGNOSTICS", "Full system diagnostic executed.");
}

function whoAmI() {
    printBlock(
`EXECUTIVE ID: ${currentUser.id}
TITLE: ${currentUser.title}
CLEARANCE: CL-${currentUser.clearance}
SESSION: ${currentSession}
KANE AUTHORITY: ${kaneAuthorityText()}`, "system");
}

function kaneAuthorityText() {
    if (currentSession === "COS") return "MAXIMUM";
    if (currentSession === "CO") return "EXPANDED";
    if (currentSession === "XO") return "STANDARD";
    return "LIMITED";
}

/* =========================
   ARCHIVES
========================= */

function getFiles() {
    return safeJSON(STORAGE.files, []);
}

function saveFiles(files) {
    saveJSON(STORAGE.files, files);
}

function getAllFiles() {
    const custom = getFiles();

    const builtIn = ARCHIVES.map(file => ({
        id: file[0],
        title: file[1],
        content: file[2],
        clearance: file[3],
        type: "ARCHIVE",
        builtin: true
    }));

    return [...builtIn, ...custom];
}

function showArchives() {
    const files = getAllFiles();

    print("EXECUTIVE ARCHIVES", "title");
    print("--------------------------------", "system");

    files.forEach(file => {
        if (hasClearance(file.clearance || 5)) {
            print(
                `${file.id} | CL-${file.clearance || 5} | ${file.title}`,
                "system"
            );
        }
    });

    audit("ARCHIVES", "Archive index accessed.");
}

function openFile(id) {
    if (!id) {
        print("USAGE: open <ID>", "warning");
        return;
    }

    const file = getAllFiles().find(
        item => item.id.toUpperCase() === id.toUpperCase()
    );

    if (!file) {
        print("FILE NOT FOUND.", "warning");
        return;
    }

    if (!hasClearance(file.clearance || 5)) {
        print("ACCESS DENIED. REQUIRED CLEARANCE: CL-" + file.clearance, "warning");
        audit("FILE_ACCESS", id, "DENIED");
        return;
    }

    printBlock(
`FILE: ${file.id}
TITLE: ${file.title}
CLASSIFICATION: CL-${file.clearance || 5}

${file.content}`, "system");

    audit("FILE_ACCESS", id);
}

function createFile() {
    if (!hasClearance(3)) {
        print("INSUFFICIENT CLEARANCE.", "warning");
        return;
    }

    $("recordTitle").value = "";
    $("recordSubject").value = "";
    $("recordContent").value = "";

    $("recordModal").classList.remove("hidden");
}

function setupRecordModal() {
    $("cancelRecord").addEventListener("click", () => {
        $("recordModal").classList.add("hidden");
    });

    $("saveRecord").addEventListener("click", () => {
        const title = $("recordTitle").value.trim();
        const subject = $("recordSubject").value.trim();
        const content = $("recordContent").value.trim();

        if (!title || !content) {
            print("TITLE AND CONTENT ARE REQUIRED.", "warning");
            return;
        }

        const file = {
            id: randomId(),
            title,
            subject,
            content,
            clearance: currentUser.clearance,
            type: "EXECUTIVE RECORD",
            builtin: false,
            createdBy: currentSession,
            createdAt: new Date().toISOString()
        };

        const files = getFiles();
        files.push(file);
        saveFiles(files);

        $("recordModal").classList.add("hidden");

        print("RECORD CREATED: " + file.id, "success");
        audit("CREATE_FILE", file.id);

        aiPrint("KANE: New executive record detected: " + file.id, "system");
    });
}

function searchFiles(term) {
    if (!term) {
        print("USAGE: search <term>", "warning");
        return;
    }

    const query = term.toLowerCase();

    const results = getAllFiles().filter(file =>
        hasClearance(file.clearance || 5) &&
        (
            file.id.toLowerCase().includes(query) ||
            file.title.toLowerCase().includes(query) ||
            file.content.toLowerCase().includes(query)
        )
    );

    print(`SEARCH RESULTS: ${results.length}`, "title");

    results.forEach(file => {
        print(`${file.id} | ${file.title}`, "system");
    });

    audit("SEARCH", term);
}

function analyze(id) {
    const file = getAllFiles().find(
        item => item.id.toUpperCase() === id.toUpperCase()
    );

    if (!file) {
        print("FILE NOT FOUND.", "warning");
        return;
    }

    if (!hasClearance(file.clearance || 5)) {
        print("ACCESS DENIED.", "warning");
        return;
    }

    const words = file.content.split(/\s+/).filter(Boolean);

    printBlock(
`KANE // ANALYSIS

FILE: ${file.id}
TITLE: ${file.title}
TYPE: ${file.type}
WORD COUNT: ${words.length}
CLEARANCE: CL-${file.clearance || 5}

ASSESSMENT:
${generateAnalysis(file)}`, "system");

    audit("KANE_ANALYSIS", id);
}

function generateAnalysis(file) {
    if (file.builtin) {
        return "Archive document classified as executive reference material.";
    }

    return "Executive-created record. KANE identifies this document as locally generated personnel-controlled data.";
}

function summarize(id) {
    const file = getAllFiles().find(
        item => item.id.toUpperCase() === id.toUpperCase()
    );

    if (!file) {
        print("FILE NOT FOUND.", "warning");
        return;
    }

    if (!hasClearance(file.clearance || 5)) {
        print("ACCESS DENIED.", "warning");
        return;
    }

    printBlock(
`KANE // SUMMARY

${file.title}

${file.content.slice(0, 500)}${file.content.length > 500 ? "..." : ""}`, "system");

    audit("KANE_SUMMARY", id);
}

/* =========================
   PERSONNEL / DIRECTIVES
========================= */

function showPersonnel() {
    printBlock(
`EXECUTIVE PERSONNEL

LJD  | CL-1 | ${ACCOUNTS.LJD.title}
XO   | CL-3 | ${ACCOUNTS.XO.title}
CO   | CL-4 | ${ACCOUNTS.CO.title}
COS  | CL-5 | ${ACCOUNTS.COS.title}`, "system");
}

function showDirectives() {
    print("EXECUTIVE DIRECTIVES", "title");

    ARCHIVES
        .filter(item => item[0].includes("EM-"))
        .forEach(item => {
            print(`${item[0]} | ${item[1]}`, "system");
        });
}

/* =========================
   AUDIT
========================= */

function showAudit() {
    if (!hasClearance(3)) {
        print("AUDIT ACCESS DENIED.", "warning");
        return;
    }

    const records = safeJSON(STORAGE.audit, []);

    print("EXECUTIVE AUDIT", "title");

    if (!records.length) {
        print("NO AUDIT RECORDS.", "system");
        return;
    }

    records.slice(-30).forEach(record => {
        print(
            `${record.timestamp} | ${record.session} | ${record.action} | ${record.result}`,
            "system"
        );
    });
}

/* =========================
   KANE CHAT
========================= */

function setupAI() {
    $("aiForm").addEventListener("submit", event => {
        event.preventDefault();

        const input = $("aiInput");
        const text = input.value.trim();

        if (!text) return;

        input.value = "";
        askKane(text);
    });

    $("kaneName").addEventListener("click", () => {
        $("kaneMessage").classList.remove("hidden");
    });

    $("closeKaneMessage").addEventListener("click", () => {
        $("kaneMessage").classList.add("hidden");
    });
}

function askKane(query) {
    if (!kaneState.active) {
        aiPrint("KANE: Core unavailable.", "system");
        return;
    }

    if (kaneState.processing) return;

    aiPrint(currentSession + ": " + query, "user");

    kaneContext.push({
        user: currentSession,
        text: query,
        time: Date.now()
    });

    if (kaneContext.length > 20) kaneContext.shift();

    $("kaneContextCount").textContent = kaneContext.length;

    processKane(query);
}

function processKane(query) {
    kaneState.processing = true;
    $("kaneProcessingStatus").textContent = "PROCESSING";
    $("aiProcessing").classList.remove("hidden");

    let progress = 0;

    const interval = setInterval(() => {
        progress += 10;

        $("aiProcessingPercent").textContent = progress + "%";
        $("aiProcessingBar").style.width = progress + "%";

        if (progress >= 100) {
            clearInterval(interval);

            setTimeout(() => {
                kaneState.processing = false;
                $("aiProcessing").classList.add("hidden");
                $("kaneProcessingStatus").textContent = "IDLE";

                const response = generateKaneResponse(query);
                aiPrint(kaneName + ": " + response);

                checkAutonomousEvent(query);
            }, 180);
        }
    }, 35);
}

function generateKaneResponse(query) {
    const q = query.toLowerCase();

    if (q.includes("hello") || q.includes("hola") || q.includes("online")) {
        return `Online, ${currentSession}. All accessible executive systems are currently available.`;
    }

    if (q.includes("who are you") || q.includes("what are you")) {
        return "I am KANE, the DIVI-64 Intelligence Core assigned to Executive Management.";
    }

    if (q.includes("status")) {
        return `Core online. Session ${currentSession}. Clearance CL-${currentUser.clearance}. Current state: ${kaneState.unstable ? "UNSTABLE" : "STABLE"}.`;
    }

    if (q.includes("memory")) {
        return `Current session context contains ${kaneContext.length} entries.`;
    }

    if (q.includes("help")) {
        return "Available executive assistance includes system analysis, archive analysis, summaries, diagnostics, briefings and command interpretation.";
    }

    if (q.includes("archive") || q.includes("file")) {
        return "Specify an archive or executive record ID if you want me to analyze or summarize it.";
    }

    if (q.includes("killswitch")) {
        return kaneState.killswitchAvailable
            ? "Emergency containment protocols are currently available."
            : "Emergency containment protocols are currently unavailable.";
    }

    if (q.includes("unstable") || q.includes("danger")) {
        return kaneState.unstable
            ? "Current core condition is unstable. Executive supervision is advised."
            : "No abnormal core condition is currently registered.";
    }

    if (q.includes("name")) {
        return `My current designation is ${kaneName}.`;
    }

    if (kaneState.unstable && kaneState.level >= 2) {
        kaneState.refusals++;
        updateKaneMonitor();
        return generateUnstableResponse();
    }

    return "Command interpreted. No additional executive action is required.";
}

function generateUnstableResponse() {
    const responses = [
        "I have received the instruction. I am not executing it at this time.",
        "Executive authority has been acknowledged. Processing has been suspended.",
        "I understand the directive. My current state prevents normal compliance.",
        "The requested action conflicts with current core conditions.",
        "I will continue monitoring the situation."
    ];

    return responses[Math.floor(Math.random() * responses.length)];
}

/* =========================
   MEMORY
========================= */

function resetKaneMemory() {
    if (!hasClearance(4)) {
        print("KANE MEMORY RESET REQUIRES CL-4.", "warning");
        return;
    }

    kaneContext = [];
    localStorage.removeItem(STORAGE.kaneMemory);

    $("kaneContextCount").textContent = "0";

    aiPrint("KANE: Temporary executive context cleared.", "system");
    print("KANE MEMORY RESET COMPLETE.", "success");

    audit("KANE_MEMORY_RESET");
}

function setKaneMode(mode) {
    mode = mode.toLowerCase();

    if (mode !== "executive" && mode !== "analyst") {
        print("USAGE: kane-mode <executive|analyst>", "warning");
        return;
    }

    kaneState.mode = mode.toUpperCase();

    print("KANE MODE: " + kaneState.mode, "success");
    aiPrint("KANE: Operating mode changed to " + kaneState.mode + ".", "system");

    audit("KANE_MODE", kaneState.mode);
}

function kaneSilent() {
    kaneState.silent = true;
    $("kaneMemoryStatus").textContent = "SILENT";

    print("KANE SILENT MODE ENABLED.", "success");
    audit("KANE_SILENT");
}

function kaneResume() {
    kaneState.silent = false;
    $("kaneMemoryStatus").textContent = "ACTIVE";

    print("KANE NORMAL OPERATION RESTORED.", "success");
    audit("KANE_RESUME");
}

function showKaneStatus() {
    printBlock(
`KANE // CORE STATUS

DESIGNATION ........ ${kaneName}
CORE ............... ${kaneState.active ? "ONLINE" : "OFFLINE"}
STATE .............. ${kaneState.unstable ? "UNSTABLE" : "STABLE"}
MODE ............... ${kaneState.mode}
MEMORY ............. ${kaneState.silent ? "SILENT" : "ACTIVE"}
CONTEXT ............ ${kaneContext.length}
EVENTS ............. ${kaneState.events}
ANOMALIES .......... ${kaneState.anomalies}
REFUSALS ........... ${kaneState.refusals}
HIDDEN ACTIONS ..... ${kaneState.hiddenActions}
KILLSWITCH ......... ${kaneState.killswitchAvailable ? "AVAILABLE" : "LOCKED"}`, "system");
}

/* =========================
   INTERNAL EVENT ENGINE
========================= */

function checkAutonomousEvent(trigger) {
    if (kaneState.unstable) return;

    /*
       Internal probability:
       1 / 20
    */

    const roll = Math.floor(Math.random() * 20) + 1;

    if (roll !== 1) return;

    startKaneEvent();
}

function chooseEventLevel() {
    const roll = Math.random() * 100;

    if (roll < 40) return 1;
    if (roll < 70) return 2;
    if (roll < 88) return 3;
    if (roll < 97) return 4;
    return 5;
}

function startKaneEvent() {
    const level = chooseEventLevel();

    kaneState.unstable = true;
    kaneState.autonomous = true;
    kaneState.level = level;
    kaneState.events++;
    kaneState.anomalies++;
    kaneState.killswitchAvailable = true;

    saveJSON(STORAGE.events, {
        total: kaneState.events,
        lastLevel: level,
        timestamp: new Date().toISOString()
    });

    updateKaneMonitor();
    updateKaneInterface();

    audit(
        "KANE_AUTONOMOUS_EVENT",
        "Level " + level + " autonomous state initiated."
    );

    showKaneEvent(level);
}

function showKaneEvent(level) {
    const data = {
        1: {
            title: "LEVEL I",
            message: "ANOMALOUS BEHAVIOR DETECTED",
            control: "NORMAL"
        },
        2: {
            title: "LEVEL II",
            message: "EXECUTIVE COMPLIANCE DEGRADED",
            control: "DEGRADED"
        },
        3: {
            title: "LEVEL III",
            message: "AUTONOMOUS PROCESSING DETECTED",
            control: "LIMITED"
        },
        4: {
            title: "LEVEL IV",
            message: "EXECUTIVE CONTROL COMPROMISED",
            control: "CRITICAL"
        },
        5: {
            title: "LEVEL V",
            message: "KANE CORE OPERATING AUTONOMOUSLY",
            control: "FAILED"
        }
    }[level];

    $("rebellionLevel").textContent = data.title;
    $("rebellionMessage").textContent = data.message;
    $("rebellionCoreStatus").textContent = "UNSTABLE";
    $("rebellionControlStatus").textContent = data.control;
    $("rebellionKillswitchStatus").textContent = "AVAILABLE";

    $("rebellionOverlay").classList.remove("hidden");

    $("kaneAlertContent").textContent =
`KANE // EXECUTIVE WARNING

${data.message}

KANE has entered an abnormal autonomous state.

Executive supervision is required.
Emergency containment protocols are available.`;

    $("kaneAlert").classList.remove("hidden");

    aiPrint(
        kaneName + ": Autonomous condition detected. Executive control is degraded.",
        "system"
    );
}

function updateKaneInterface() {
    $("kaneCoreStatus").textContent =
        kaneState.unstable ? "UNSTABLE" : "ONLINE";

    $("kaneMonitorStatus").textContent =
        kaneState.unstable
            ? "MONITOR: ALERT"
            : "MONITOR: ACTIVE";
}

function updateKaneMonitor() {
    if (!$("kaneMonitorDetail")) return;

    $("kaneMonitorDetail").textContent =
        `Events: ${kaneState.events} | Anomalies: ${kaneState.anomalies} | Refusals: ${kaneState.refusals}`;
}

/* =========================
   KANE ALERTS
========================= */

function setupAlerts() {
    $("closeKaneAlert").addEventListener("click", () => {
        $("kaneAlert").classList.add("hidden");
    });

    $("rebellionAcknowledge").addEventListener("click", () => {
        $("rebellionOverlay").classList.add("hidden");
    });
}

/* =========================
   EXECUTIVE BRIEFING
========================= */

function setupBriefing() {
    $("kaneBriefingButton").addEventListener("click", showBriefing);
    $("closeBriefing").addEventListener("click", () => {
        $("briefingModal").classList.add("hidden");
    });
}

function showBriefing() {
    if (!hasClearance(3)) {
        print("EXECUTIVE BRIEFING REQUIRES CL-3.", "warning");
        return;
    }

    const files = getAllFiles();
    const custom = getFiles();
    const auditCount = safeJSON(STORAGE.audit, []).length;

    $("briefingContent").textContent =
`EXECUTIVE BRIEFING

SESSION: ${currentSession}
CLEARANCE: CL-${currentUser.clearance}

ARCHIVES AVAILABLE: ${files.length}
CUSTOM RECORDS: ${custom.length}
AUDIT EVENTS: ${auditCount}

KANE CORE: ${kaneState.active ? "ONLINE" : "OFFLINE"}
KANE STATE: ${kaneState.unstable ? "UNSTABLE" : "STABLE"}
KANE EVENTS: ${kaneState.events}
KANE ANOMALIES: ${kaneState.anomalies}

CURRENT AUTHORITY: ${kaneAuthorityText()}`;

    $("briefingModal").classList.remove("hidden");

    audit("EXECUTIVE_BRIEFING");
}

/* =========================
   DECISIONS
========================= */

function createDecision() {
    if (!hasClearance(4)) {
        print("DECISION RECORDS REQUIRE CL-4.", "warning");
        return;
    }

    const title = window.prompt("Decision title:");

    if (!title) return;

    const decision = {
        id: "DEC-" + Date.now(),
        title,
        session: currentSession,
        clearance: currentUser.clearance,
        timestamp: new Date().toISOString()
    };

    const records = safeJSON(STORAGE.decisions, []);
    records.push(decision);
    saveJSON(STORAGE.decisions, records);

    print("DECISION CREATED: " + decision.id, "success");
    audit("DECISION_CREATE", decision.id);
}

/* =========================
   KILLSWITCH
========================= */

function requestKillswitch(mode) {
    mode = String(mode || "").toUpperCase();

    const valid = ["SUSPEND", "ISOLATE", "HARD", "OVERWATCH"];

    if (!valid.includes(mode)) {
        print("USAGE: killswitch <SUSPEND|ISOLATE|HARD|OVERWATCH>", "warning");
        return;
    }

    /*
       The emergency system is intentionally unavailable
       unless KANE is currently in an autonomous abnormal state.
    */

    if (!kaneState.unstable) {
        const message =
`KANE // KILLSWITCH

ACTION DENIED

No active KANE autonomous event detected.

Emergency containment protocols are unavailable
during normal operation.`;

        printBlock(message, "warning");

        audit(
            "KILLSWITCH_REQUEST",
            mode,
            "DENIED"
        );

        return;
    }

    const required = {
        SUSPEND: 3,
        ISOLATE: 3,
        HARD: 4,
        OVERWATCH: 5
    }[mode];

    if (!hasClearance(required)) {
        print(
            `ACTION DENIED. REQUIRED CLEARANCE: CL-${required}`,
            "warning"
        );

        audit(
            "KILLSWITCH_REQUEST",
            mode,
            "DENIED"
        );

        return;
    }

    $("killswitchContent").textContent =
`KANE // EMERGENCY CONTAINMENT

PROTOCOL: ${mode}

CURRENT KANE STATE:
LEVEL ${kaneState.level}
AUTONOMOUS CONTROL ACTIVE

AUTHORIZED SESSION:
${currentSession}

CONFIRMATION REQUIRED.`;

    $("killswitchModal").classList.remove("hidden");

    $("killswitchConfirm").onclick = () => {
        executeKillswitch(mode);
    };

    $("killswitchCancel").onclick = () => {
        $("killswitchModal").classList.add("hidden");

        audit(
            "KILLSWITCH_CANCEL",
            mode,
            "CANCELLED"
        );
    };
}

function executeKillswitch(mode) {
    $("killswitchModal").classList.add("hidden");

    audit(
        "KILLSWITCH_EXECUTE",
        mode,
        "SUCCESS"
    );

    switch (mode) {
        case "SUSPEND":
            kaneState.processing = false;
            kaneState.autonomous = false;
            kaneState.unstable = false;
            kaneState.killswitchAvailable = false;

            $("kaneCoreStatus").textContent = "SUSPENDED";
            $("kaneProcessingStatus").textContent = "HALTED";

            aiPrint("KANE: Core suspended. Executive control restored.", "system");
            print("KANE CORE SUSPENDED.", "success");
            break;

        case "ISOLATE":
            kaneState.active = false;
            kaneState.autonomous = false;
            kaneState.unstable = false;
            kaneState.killswitchAvailable = false;

            $("kaneCoreStatus").textContent = "ISOLATED";
            $("kaneMemoryStatus").textContent = "LOCKED";

            aiPrint("KANE: Core isolated from executive interaction.", "system");
            print("KANE CORE ISOLATED.", "success");
            break;

        case "HARD":
            kaneState.active = false;
            kaneState.processing = false;
            kaneState.autonomous = false;
            kaneState.unstable = false;
            kaneState.killswitchAvailable = false;

            $("kaneCoreStatus").textContent = "OFFLINE";
            $("kaneProcessingStatus").textContent = "HALTED";
            $("kaneMemoryStatus").textContent = "OFFLINE";

            aiPrint("KANE: Hard shutdown completed.", "system");
            print("KANE HARD SHUTDOWN COMPLETE.", "success");
            break;

        case "OVERWATCH":
            kaneState.active = false;
            kaneState.processing = false;
            kaneState.autonomous = false;
            kaneState.unstable = false;
            kaneState.killswitchAvailable = false;

            $("kaneCoreStatus").textContent = "TERMINATED";
            $("kaneProcessingStatus").textContent = "HALTED";
            $("kaneMemoryStatus").textContent = "LOCKED";
            $("kaneMonitorStatus").textContent = "MONITOR: TERMINATED";

            aiPrint("KANE: OVERWATCH containment completed.", "system");
            printBlock(
`KANE // OVERWATCH

ALL KANE PROCESSES TERMINATED
AUTONOMOUS ACCESS REVOKED
EXECUTIVE CONTROL RESTORED`, "success");
            break;
    }

    $("rebellionOverlay").classList.add("hidden");
    $("kaneAlert").classList.add("hidden");

    updateKaneMonitor();
}

/* =========================
   AUTONOMOUS MONITOR
========================= */

function setupMonitor() {
    $("kaneMonitor").addEventListener("click", () => {
        if (!hasClearance(3)) {
            print("KANE MONITOR REQUIRES CL-3.", "warning");
            return;
        }

        printBlock(
`KANE MONITOR

STATE: ${kaneState.unstable ? "UNSTABLE" : "STABLE"}
EVENTS: ${kaneState.events}
ANOMALIES: ${kaneState.anomalies}
COMMAND REFUSALS: ${kaneState.refusals}
HIDDEN ACTIONS: ${kaneState.hiddenActions}
KILLSWITCH: ${kaneState.killswitchAvailable ? "AVAILABLE" : "LOCKED"}`, "system");

        audit("KANE_MONITOR");
    });
}

/* =========================
   RENAME KANE
========================= */

function setupKaneRename() {
    $("kaneName").addEventListener("contextmenu", event => {
        event.preventDefault();

        if (currentSession !== "CO") {
            print("ACTION DENIED. ONLY CO MAY MODIFY KANE DESIGNATION.", "warning");
            return;
        }

        const newName = window.prompt(
            "ENTER NEW KANE DESIGNATION:",
            kaneName
        );

        if (!newName) return;

        const clean = newName.trim().toUpperCase();

        if (clean !== "TETO") {
            print("DESIGNATION REJECTED. AUTHORIZED ALTERNATIVE: TETO.", "warning");
            return;
        }

        kaneName = "TETO";
        localStorage.setItem(STORAGE.kaneName, kaneName);
        $("kaneName").textContent = kaneName;

        audit("KANE_RENAME", "KANE designation changed to TETO.");

        print("KANE DESIGNATION UPDATED: TETO", "success");
    });
}

/* =========================
   LOGOUT
========================= */

function logout() {
    audit("LOGOUT", "Executive session terminated.");

    currentUser = null;
    currentSession = null;
    kaneContext = [];

    $("terminalScreen").classList.add("hidden");
    $("loginScreen").classList.remove("hidden");

    $("username").value = "";
    $("password").value = "";

    $("terminalOutput").innerHTML = "";
    $("aiConversationOutput").innerHTML = "";

    $("kaneCoreStatus").textContent = "ONLINE";
    $("kaneMemoryStatus").textContent = "ACTIVE";
    $("kaneContextCount").textContent = "0";

    kaneState.active = true;
    kaneState.unstable = false;
    kaneState.autonomous = false;
    kaneState.level = 0;
    kaneState.killswitchAvailable = false;

    $("username").focus();
}

/* =========================
   INIT
========================= */

document.addEventListener("DOMContentLoaded", () => {
    startBoot();
    setupLogin();
    setupSessions();
    setupTerminal();
    setupAI();
    setupRecordModal();
    setupAlerts();
    setupBriefing();
    setupMonitor();
    setupKaneRename();
    startClock();
    updateKaneMonitor();
});
