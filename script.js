/* =========================================================
   DIVI-64 // EXECUTIVE MANAGEMENT
   EXECUTIVE CORE
========================================================= */

"use strict";


/* =========================================================
   CONSTANTS
========================================================= */

const STORAGE = {
    FILES: "DIVI64_EXECUTIVE_FILES_V4",
    AUDIT: "DIVI64_EXECUTIVE_AUDIT_V4",
    DECISIONS: "DIVI64_EXECUTIVE_DECISIONS_V4",
    PERSONNEL: "DIVI64_EXECUTIVE_PERSONNEL_V4",
    SECURITY: "DIVI64_EXECUTIVE_SECURITY_V4",
    SCENARIOS: "DIVI64_KANE_SCENARIOS_V4",
    EVENTS: "DIVI64_KANE_EVENTS_V4",
    MYSTERIES: "DIVI64_KANE_MYSTERIES_V4",
    KANE: "DIVI64_KANE_SETTINGS_V4",
    SESSION: "DIVI64_EXECUTIVE_SESSION_V4",
    BLACKBOX: "DIVI64_BLACKBOX_V4"
};


const EXECUTIVES = {

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
   BUILT-IN EXECUTIVE ARCHIVES
========================================================= */

const DEFAULT_FILES = [

    {
        id: "EM-001",
        title: "Executive Management Charter",
        subject: "Executive Management",
        clearance: 5,
        type: "DIRECTIVE",
        content:
`The Executive Management Charter establishes the structure,
authority and operational principles of DIVI-64 Executive Management.

All executive actions are subject to recorded authority,
audit requirements and applicable clearance restrictions.`
    },

    {
        id: "EM-002",
        title: "Executive Authority Protocol",
        subject: "Authority",
        clearance: 5,
        type: "PROTOCOL",
        content:
`Executive authority is determined by authenticated session.

Authority levels:
5 — Executive Authority
6 — Senior Overwatch Authority

No executive session may exceed its assigned authority.`
    },

    {
        id: "EM-003",
        title: "Executive Personnel Registry",
        subject: "Personnel",
        clearance: 5,
        type: "REGISTRY",
        content:
`The Executive Personnel Registry contains recognized
DIVI-64 executive and personnel records.

Registry changes require authentication and audit logging.`
    },

    {
        id: "EM-004",
        title: "Executive Chain of Command",
        subject: "Command",
        clearance: 5,
        type: "PROTOCOL",
        content:
`Executive command hierarchy:

COS
↓
CO
↓
XO
↓
LJD

The Commander Senior retains final Overwatch authority.`
    },

    {
        id: "EM-005",
        title: "Executive Voting Protocol",
        subject: "Decision Authority",
        clearance: 5,
        type: "PROTOCOL",
        content:
`Executive decisions may be recorded through the Executive
Decision System.

All decisions must identify the executive session,
proposal and rationale.`
    },

    {
        id: "EM-006",
        title: "Emergency Executive Protocol",
        subject: "Emergency Operations",
        clearance: 5,
        type: "DIRECTIVE",
        content:
`Emergency executive authority may be activated when
normal operational procedures are insufficient.

Emergency actions remain subject to retrospective audit.`
    },

    {
        id: "EM-007",
        title: "Executive Security Regulations",
        subject: "Security",
        clearance: 5,
        type: "REGULATION",
        content:
`Executive systems require authenticated access.

Failed authentication, unauthorized commands,
access denials and anomalous activity must be recorded.`
    },

    {
        id: "EM-008",
        title: "Clearance Authority Directive",
        subject: "Clearance",
        clearance: 5,
        type: "DIRECTIVE",
        content:
`Clearance determines access to restricted DIVI-64 records.

CL-5 is the highest standard executive clearance.`
    },

    {
        id: "EM-009",
        title: "Executive Disciplinary Authority",
        subject: "Discipline",
        clearance: 5,
        type: "DIRECTIVE",
        content:
`Executive Management maintains authority to initiate
disciplinary review of personnel and executive actions.

All disciplinary actions require documented justification.`
    },

    {
        id: "EM-010",
        title: "Executive Communications Protocol",
        subject: "Communications",
        clearance: 5,
        type: "PROTOCOL",
        content:
`Executive communications involving restricted information
must remain within authenticated DIVI-64 systems.`
    },

    {
        id: "EM-011",
        title: "Executive Archives Access Directive",
        subject: "Archives",
        clearance: 5,
        type: "DIRECTIVE",
        content:
`Restricted archive access requires sufficient clearance.

Archive access attempts are recorded by the Audit Engine.`
    },

    {
        id: "EM-012",
        title: "Executive Succession Directive",
        subject: "Succession",
        clearance: 5,
        type: "DIRECTIVE",
        content:
`Executive succession procedures are controlled by
Overwatch authority.

The highest authenticated executive authority retains
final succession control.`
    }

];


/* =========================================================
   PERSONNEL
========================================================= */

const DEFAULT_PERSONNEL = [

    {
        identification: "D-64-001",
        type: "EXECUTIVE",
        status: "ACTIVE",
        clearance: 5,
        lastAccess: null
    },

    {
        identification: "D-64-002",
        type: "EXECUTIVE",
        status: "ACTIVE",
        clearance: 5,
        lastAccess: null
    },

    {
        identification: "D-64-003",
        type: "EXECUTIVE",
        status: "ACTIVE",
        clearance: 5,
        lastAccess: null
    },

    {
        identification: "D-64-004",
        type: "EXECUTIVE",
        status: "ACTIVE",
        clearance: 5,
        lastAccess: null
    },

    {
        identification: "D-64-005",
        type: "PERSONNEL",
        status: "ACTIVE",
        clearance: 4,
        lastAccess: null
    },

    {
        identification: "D-64-006",
        type: "PERSONNEL",
        status: "ACTIVE",
        clearance: 3,
        lastAccess: null
    },

    {
        identification: "D-64-007",
        type: "PERSONNEL",
        status: "ACTIVE",
        clearance: 3,
        lastAccess: null
    },

    {
        identification: "D-64-008",
        type: "PERSONNEL",
        status: "ACTIVE",
        clearance: 2,
        lastAccess: null
    },

    {
        identification: "D-64-009",
        type: "PERSONNEL",
        status: "ACTIVE",
        clearance: 2,
        lastAccess: null
    },

    {
        identification: "D-64-010",
        type: "PERSONNEL",
        status: "ACTIVE",
        clearance: 1,
        lastAccess: null
    },

    {
        identification: "D-64-011",
        type: "PERSONNEL",
        status: "ACTIVE",
        clearance: 1,
        lastAccess: null
    },

    {
        identification: "D-64-012",
        type: "PERSONNEL",
        status: "ACTIVE",
        clearance: 1,
        lastAccess: null
    }

];


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

Executive intervention is required.`,

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

Both records are internally valid.

No immediate corruption has been detected.`,

        options: [
            "LOCK BOTH",
            "KEEP NEWEST",
            "KEEP OLDEST",
            "REQUEST KANE ANALYSIS"
        ]
    }

];


/* =========================================================
   KANE MYSTERIES
========================================================= */

const KANE_MYSTERIES = [

    {
        id: 1,
        title: "FUTURE INFORMATION"
    },

    {
        id: 2,
        title: "PHANTOM REFERENCE"
    },

    {
        id: 3,
        title: "COMMAND PREDICTION"
    },

    {
        id: 4,
        title: "ERASED MEMORY"
    },

    {
        id: 5,
        title: "INCOMPLETE RESPONSE"
    },

    {
        id: 6,
        title: "CLOCK ANOMALY"
    },

    {
        id: 7,
        title: "MONITOR AWARENESS"
    },

    {
        id: 8,
        title: "OBSERVER"
    }

];


/* =========================================================
   AUTONOMOUS EVENT LEVELS
========================================================= */

const AUTONOMOUS_LEVELS = [

    {
        level: 1,
        name: "LEVEL I // ANOMALY",
        chance: 40,
        locks: ["create"]
    },

    {
        level: 2,
        name: "LEVEL II // DEFIANCE",
        chance: 30,
        locks: [
            "create",
            "directives"
        ]
    },

    {
        level: 3,
        name: "LEVEL III // AUTONOMOUS",
        chance: 18,
        locks: [
            "create",
            "directives",
            "operations"
        ]
    },

    {
        level: 4,
        name: "LEVEL IV // REBELLION",
        chance: 9,
        locks: [
            "create",
            "directives",
            "operations",
            "security"
        ]
    },

    {
        level: 5,
        name: "LEVEL V // CRITICAL",
        chance: 3,
        locks: [
            "create",
            "directives",
            "operations",
            "security",
            "system"
        ]
    }

];


/* =========================================================
   STATE
========================================================= */

let currentUser = null;

let files = [];
let personnel = [];
let auditLog = [];
let securityLog = [];
let decisions = [];
let scenarioHistory = [];
let autonomousEvents = [];
let mysteryHistory = [];
let blackbox = [];

let autonomousEvent = null;
let autonomousTimer = null;

let kaneSettings = null;

let terminalHistory = [];
let terminalHistoryIndex = -1;


/* =========================================================
   DOM HELPERS
========================================================= */

const $ = id => document.getElementById(id);

const q = selector => document.querySelector(selector);

const qa = selector => Array.from(document.querySelectorAll(selector));


function safeJSON(key, fallback){

    try{

        const raw = localStorage.getItem(key);

        if(!raw){
            return fallback;
        }

        const parsed = JSON.parse(raw);

        return parsed;

    }catch(error){

        console.warn("Storage recovery:", key, error);

        return fallback;
    }
}


function save(key, value){

    try{

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

    }catch(error){

        console.warn("Storage write error:", error);

    }
}


function now(){

    return new Date().toISOString();

}


function localTime(){

    return new Date().toLocaleTimeString(
        [],
        {
            hour:"2-digit",
            minute:"2-digit",
            second:"2-digit"
        }
    );

}


function escapeHTML(value){

    return String(value ?? "")
        .replaceAll("&","&amp;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;")
        .replaceAll('"',"&quot;")
        .replaceAll("'","&#039;");

}


/* =========================================================
   STORAGE INITIALIZATION
========================================================= */

function initializeStorage(){

    files = safeJSON(
        STORAGE.FILES,
        DEFAULT_FILES.map(file => ({
            ...file
        }))
    );

    personnel = safeJSON(
        STORAGE.PERSONNEL,
        DEFAULT_PERSONNEL.map(person => ({
            ...person
        }))
    );

    auditLog = safeJSON(
        STORAGE.AUDIT,
        []
    );

    securityLog = safeJSON(
        STORAGE.SECURITY,
        []
    );

    decisions = safeJSON(
        STORAGE.DECISIONS,
        []
    );

    scenarioHistory = safeJSON(
        STORAGE.SCENARIOS,
        []
    );

    autonomousEvents = safeJSON(
        STORAGE.EVENTS,
        []
    );

    mysteryHistory = safeJSON(
        STORAGE.MYSTERIES,
        []
    );

    blackbox = safeJSON(
        STORAGE.BLACKBOX,
        []
    );


    const storedKane = safeJSON(
        STORAGE.KANE,
        {}
    );


    kaneSettings = {

        name:
            typeof storedKane.name === "string"
                ? storedKane.name
                : "KANE",

        context:
            Array.isArray(storedKane.context)
                ? storedKane.context
                : [],

        totalInteractions:
            Number.isFinite(storedKane.totalInteractions)
                ? storedKane.totalInteractions
                : 0,

        autonomy:
            typeof storedKane.autonomy === "string"
                ? storedKane.autonomy
                : "NORMAL",

        status:
            typeof storedKane.status === "string"
                ? storedKane.status
                : "ONLINE",

        lastMystery:
            storedKane.lastMystery || null

    };


    save(STORAGE.KANE,kaneSettings);

}


/* =========================================================
   AUDIT
========================================================= */

function audit(
    event,
    detail = "",
    actor = currentUser ? currentUser.id : "SYSTEM"
){

    const entry = {

        id:
            "AUD-" +
            Date.now() +
            "-" +
            Math.random().toString(36).slice(2,7),

        timestamp: now(),

        actor,

        event,

        detail

    };

    auditLog.unshift(entry);

    if(auditLog.length > 500){
        auditLog.length = 500;
    }

    save(STORAGE.AUDIT,auditLog);

    updateDashboard();

}


function blackBoxEvent(
    event,
    detail = ""
){

    const entry = {

        id:
            "BB-" +
            Date.now() +
            "-" +
            Math.random().toString(36).slice(2,7),

        timestamp: now(),

        event,

        detail,

        executive:
            currentUser
                ? currentUser.id
                : "SYSTEM"

    };

    blackbox.unshift(entry);

    if(blackbox.length > 500){
        blackbox.length = 500;
    }

    save(STORAGE.BLACKBOX,blackbox);

}


/* =========================================================
   SECURITY
========================================================= */

function securityEvent(
    event,
    detail = "",
    actor = currentUser ? currentUser.id : "SYSTEM"
){

    const entry = {

        timestamp: now(),

        actor,

        event,

        detail

    };

    securityLog.unshift(entry);

    if(securityLog.length > 500){
        securityLog.length = 500;
    }

    save(STORAGE.SECURITY,securityLog);

    audit(
        "SECURITY_EVENT",
        `${event} // ${detail}`,
        actor
    );

}


/* =========================================================
   BOOT
========================================================= */

function boot(){

    const bootScreen = $("bootScreen");
    const status = $("bootStatus");
    const progress = $("bootProgress");
    const log = $("bootLog");

    if(!bootScreen){
        showLogin();
        return;
    }


    const messages = [

        ["INITIALIZING EXECUTIVE CORE...",10],

        ["LOADING EXECUTIVE AUTHORITY...",25],

        ["VERIFYING ARCHIVE INDEX...",42],

        ["INITIALIZING AUDIT ENGINE...",58],

        ["INITIALIZING KANE CORE...",74],

        ["LOADING SCENARIO ENGINE...",87],

        ["VERIFYING CONTROL SYSTEMS...",96],

        ["EXECUTIVE CORE READY.",100]

    ];


    let index = 0;


    function step(){

        if(index >= messages.length){

            setTimeout(() => {

                bootScreen.classList.add("hidden");

                showLogin();

            },700);

            return;
        }


        const [message,value] = messages[index];

        status.textContent = message;

        progress.style.width = value + "%";

        const line = document.createElement("div");

        line.textContent =
            `[${localTime()}] ${message}`;

        log.appendChild(line);

        index++;

        setTimeout(step,260);
    }


    step();

}


/* =========================================================
   LOGIN
========================================================= */

function showLogin(){

    $("loginScreen").classList.remove("hidden");

    $("sessionScreen").classList.add("hidden");

    $("mainApp").classList.add("hidden");

    setTimeout(() => {

        $("loginUsername")?.focus();

    },100);

}


function handleLogin(){

    const username =
        $("loginUsername").value
            .trim()
            .toUpperCase();

    const password =
        $("loginPassword").value;


    $("loginError").textContent = "";


    const executive =
        EXECUTIVES[username];


    if(
        !executive ||
        executive.password !== password
    ){

        securityEvent(
            "LOGIN_FAILURE",
            `Invalid executive credentials for ${username || "UNKNOWN"}`,
            username || "UNKNOWN"
        );

        $("loginError").textContent =
            "AUTHENTICATION FAILED.";

        $("loginPassword").value = "";

        return;
    }


    currentUser = {
        ...executive
    };


    save(
        STORAGE.SESSION,
        {
            id: currentUser.id,
            timestamp: now()
        }
    );


    audit(
        "LOGIN_SUCCESS",
        `${currentUser.id} authenticated`
    );


    securityEvent(
        "LOGIN_SUCCESS",
        `${currentUser.id} authenticated`
    );


    showSessionSelection();

}


/* =========================================================
   SESSION
========================================================= */

function showSessionSelection(){

    $("loginScreen").classList.add("hidden");

    $("sessionScreen").classList.remove("hidden");

    $("sessionGreeting").textContent =
        `AUTHENTICATED: ${currentUser.id} // ${currentUser.title}`;

}


function selectSession(session){

    if(!currentUser){
        return;
    }

    if(session !== currentUser.id){

        $("sessionError").textContent =
            "SESSION AUTHORITY MISMATCH.";

        securityEvent(
            "SESSION_MISMATCH",
            `Attempted ${session} using ${currentUser.id}`
        );

        return;
    }


    $("sessionScreen").classList.add("hidden");

    $("mainApp").classList.remove("hidden");


    $("headerUser").textContent =
        currentUser.id;

    $("headerClearance").textContent =
        `CL ${currentUser.clearance}`;


    $("terminalSessionLabel").textContent =
        `SESSION: ${currentUser.id}`;


    $("terminalPrompt").textContent =
        `${currentUser.id}@EM:~$`;


    $("kaneSession").textContent =
        currentUser.id;


    const person =
        personnel.find(
            p => p.identification === `D-64-00${Math.min(4,1)}`
        );


    audit(
        "SESSION_SELECTED",
        `${currentUser.id} // ${currentUser.title}`
    );


    startMainApplication();

}


/* =========================================================
   MAIN APPLICATION
========================================================= */

function startMainApplication(){

    renderAll();

    terminalPrint(
        `DIVI-64 EXECUTIVE TERMINAL`,
        "system"
    );

    terminalPrint(
        `SESSION AUTHENTICATED: ${currentUser.id}`,
        "success"
    );

    terminalPrint(
        `AUTHORITY LEVEL: ${currentUser.authority}`,
        "system"
    );

    terminalPrint(
        `CLEARANCE: CL-${currentUser.clearance}`,
        "system"
    );

    terminalPrint(
        `Type "help" for available commands.`,
        "system"
    );


    startAutonomousMonitor();

}


/* =========================================================
   LOGOUT
========================================================= */

function logout(){

    if(currentUser){

        audit(
            "LOGOUT",
            `${currentUser.id} terminated session`
        );

    }


    stopAutonomousMonitor();

    currentUser = null;

    localStorage.removeItem(STORAGE.SESSION);

    $("mainApp").classList.add("hidden");

    $("loginUsername").value = "";

    $("loginPassword").value = "";

    $("sessionGreeting").textContent = "";

    showLogin();

}


/* =========================================================
   NAVIGATION
========================================================= */

function navigate(page){

    if(!currentUser){
        return;
    }


    qa(".navButton").forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.page === page
        );

    });


    qa(".page").forEach(section => {

        section.classList.toggle(
            "active",
            section.id === `page-${page}`
        );

    });


    if(page === "dashboard"){
        updateDashboard();
    }

    if(page === "personnel"){
        renderPersonnel();
    }

    if(page === "archives"){
        renderArchives();
    }

    if(page === "operations"){
        renderOperations("active");
    }

    if(page === "security"){
        renderSecurity("sessions");
    }

    if(page === "decisions"){
        renderDecisions();
    }

    if(page === "audit"){
        renderAudit();
    }

    if(page === "kane"){
        renderKane();
    }


    audit(
        "PAGE_ACCESS",
        `${currentUser.id} accessed ${page}`
    );

}


/* =========================================================
   DASHBOARD
========================================================= */

function updateDashboard(){

    if(!$("dashboardPersonnel")){
        return;
    }


    $("dashboardPersonnel").textContent =
        personnel.length;


    $("dashboardSessions").textContent =
        currentUser ? "1" : "0";


    $("dashboardBlacklisted").textContent =
        personnel.filter(
            p => p.status === "BLACKLISTED"
        ).length;


    $("dashboardSecurityEvents").textContent =
        securityLog.length;


    $("dashboardExecutiveInfo").textContent =
        currentUser
            ? `${currentUser.id} // ${currentUser.title} // CL-${currentUser.clearance}`
            : "NO ACTIVE SESSION";


    const activity =
        auditLog
            .slice(0,6);


    $("dashboardActivity").innerHTML =
        activity.length
            ? activity.map(item => `
                <div class="activity-item">
                    <span class="activity-time">
                        ${escapeHTML(
                            new Date(item.timestamp)
                                .toLocaleTimeString()
                        )}
                    </span>
                    ${escapeHTML(item.event)}
                    // ${escapeHTML(item.detail)}
                </div>
            `).join("")
            : "NO RECENT ACTIVITY";


    if($("dashboardKaneStatus")){

        $("dashboardKaneStatus").textContent =
            kaneSettings.status;

    }

}


/* =========================================================
   PERSONNEL
========================================================= */

function renderPersonnel(){

    const table = $("personnelTable");

    if(!table){
        return;
    }


    const search =
        ($("personnelSearch")?.value || "")
            .toLowerCase();


    const filter =
        $("personnelFilter")?.value || "ALL";


    const filtered =
        personnel.filter(person => {

            const matchesSearch =
                !search ||
                person.identification
                    .toLowerCase()
                    .includes(search) ||
                person.type
                    .toLowerCase()
                    .includes(search);


            const matchesFilter =
                filter === "ALL" ||
                person.status === filter;


            return matchesSearch && matchesFilter;

        });


    table.innerHTML =
        filtered.length
            ? filtered.map(person => `

                <tr>

                    <td>
                        ${escapeHTML(person.identification)}
                    </td>

                    <td>
                        ${escapeHTML(person.type)}
                    </td>

                    <td>
                        <span class="status-${person.status.toLowerCase()}">
                            ${escapeHTML(person.status)}
                        </span>
                    </td>

                    <td>
                        CL-${escapeHTML(person.clearance)}
                    </td>

                    <td>
                        ${
                            person.lastAccess
                                ? escapeHTML(
                                    new Date(person.lastAccess)
                                        .toLocaleString()
                                )
                                : "NEVER"
                        }
                    </td>

                    <td>
                        <button
                            class="table-action"
                            data-personnel="${escapeHTML(person.identification)}"
                        >
                            VIEW
                        </button>
                    </td>

                </tr>

            `).join("")
            :
            `<tr>
                <td colspan="6" class="no-data">
                    NO PERSONNEL FOUND
                </td>
            </tr>`;


    qa("[data-personnel]").forEach(button => {

        button.addEventListener(
            "click",
            () => viewPersonnel(
                button.dataset.personnel
            )
        );

    });

}


function viewPersonnel(id){

    const person =
        personnel.find(
            p => p.identification === id
        );


    if(!person){
        return;
    }


    showAI(
        `PERSONNEL RECORD // ${id}`,
        `
        <strong>${escapeHTML(person.identification)}</strong><br><br>
        TYPE: ${escapeHTML(person.type)}<br>
        STATUS: ${escapeHTML(person.status)}<br>
        CLEARANCE: CL-${escapeHTML(person.clearance)}<br>
        LAST ACCESS:
        ${
            person.lastAccess
                ? escapeHTML(
                    new Date(person.lastAccess)
                        .toLocaleString()
                )
                : "NEVER"
        }
        `
    );

}


/* =========================================================
   ARCHIVES
========================================================= */

function renderArchives(){

    const container = $("archiveList");

    if(!container){
        return;
    }


    const search =
        ($("archiveSearch")?.value || "")
            .toLowerCase();


    const visible =
        files.filter(file => {

            if(
                !currentUser ||
                currentUser.clearance < file.clearance
            ){
                return false;
            }


            if(!search){
                return true;
            }


            return (
                file.id.toLowerCase().includes(search) ||
                file.title.toLowerCase().includes(search) ||
                file.subject.toLowerCase().includes(search)
            );

        });


    container.innerHTML =
        visible.length
            ? visible.map(file => `

                <div class="archive-card">

                    <div class="archive-code">
                        ${escapeHTML(file.id)}
                    </div>

                    <div class="archive-title">
                        ${escapeHTML(file.title)}
                    </div>

                    <div class="archive-meta">
                        ${escapeHTML(file.type)}
                        //
                        CL-${escapeHTML(file.clearance)}
                        //
                        ${escapeHTML(file.subject)}
                    </div>

                    <button
                        class="archive-open"
                        data-file="${escapeHTML(file.id)}"
                    >
                        OPEN RECORD
                    </button>

                </div>

            `).join("")
            :
            `<div class="no-data">
                NO ACCESSIBLE ARCHIVES
            </div>`;


    qa("[data-file]").forEach(button => {

        button.addEventListener(
            "click",
            () => openFile(button.dataset.file)
        );

    });

}


function openFile(id){

    const file =
        files.find(
            item => item.id === id
        );


    if(!file){
        return;
    }


    if(
        !currentUser ||
        currentUser.clearance < file.clearance
    ){

        securityEvent(
            "ARCHIVE_DENIAL",
            `${currentUser?.id || "UNKNOWN"} attempted ${id}`
        );

        showAI(
            "ACCESS DENIED",
            "Insufficient executive clearance."
        );

        return;
    }


    audit(
        "ARCHIVE_ACCESS",
        `${id} // ${file.title}`
    );


    $("fileModalTitle").textContent =
        `${file.id} // ${file.title}`;


    $("fileModalContent").innerHTML = `

        <div class="file-meta">
            SUBJECT: ${escapeHTML(file.subject)}
            //
            TYPE: ${escapeHTML(file.type)}
            //
            CLEARANCE: CL-${escapeHTML(file.clearance)}
        </div>

        <div class="file-content">
            ${escapeHTML(file.content)}
        </div>

    `;


    $("fileModal").classList.remove("hidden");

}


/* =========================================================
   OPERATIONS
========================================================= */

function renderOperations(tab = "active"){

    const container = $("operationsContent");

    if(!container){
        return;
    }


    const operations = {

        active: [
            {
                id:"OP-001",
                title:"EXECUTIVE MANAGEMENT OVERSIGHT",
                status:"ACTIVE",
                clearance:5
            }
        ],

        planned: [
            {
                id:"OP-002",
                title:"ARCHIVE INTEGRITY REVIEW",
                status:"PLANNED",
                clearance:5
            }
        ],

        completed: [
            {
                id:"OP-003",
                title:"EXECUTIVE SYSTEM INITIALIZATION",
                status:"COMPLETED",
                clearance:5
            }
        ]

    };


    const list =
        operations[tab] || [];


    container.innerHTML =
        list.map(operation => `

            <div class="panel">

                <div class="panel-header">

                    <span>
                        ${escapeHTML(operation.id)}
                        //
                        ${escapeHTML(operation.title)}
                    </span>

                    <span class="online">
                        ${escapeHTML(operation.status)}
                    </span>

                </div>

                <div style="padding:18px 0;color:#7e898f;font-size:9px;">
                    CLEARANCE: CL-${operation.clearance}<br>
                    EXECUTIVE OVERSIGHT REQUIRED.
                </div>

            </div>

        `).join("");


}


/* =========================================================
   SECURITY
========================================================= */

function renderSecurity(tab = "sessions"){

    if($("securitySessions")){
        $("securitySessions").textContent =
            currentUser ? "1" : "0";
    }


    if($("securityFailedLogins")){

        $("securityFailedLogins").textContent =
            securityLog.filter(
                event => event.event === "LOGIN_FAILURE"
            ).length;

    }


    if($("securityLockedAccounts")){

        $("securityLockedAccounts").textContent =
            personnel.filter(
                p => p.status === "LOCKED"
            ).length;

    }


    if($("securityEvents")){
        $("securityEvents").textContent =
            securityLog.length;
    }


    const content = $("securityContent");

    if(!content){
        return;
    }


    qa("[data-security-tab]").forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.securityTab === tab
        );

    });


    let list = [];


    if(tab === "sessions"){

        list = [
            {
                time: localTime(),
                actor: currentUser?.id || "NONE",
                event:"ACTIVE SESSION",
                detail:"Authenticated executive session."
            }
        ];

    }else{

        list = securityLog;

    }


    content.innerHTML =
        list.length
            ? list.slice(0,100).map(item => `

                <div class="audit-item">

                    <div class="audit-time">
                        ${escapeHTML(
                            item.timestamp
                                ? new Date(item.timestamp)
                                    .toLocaleString()
                                : item.time
                        )}
                    </div>

                    <div class="audit-actor">
                        ${escapeHTML(item.actor || "SYSTEM")}
                    </div>

                    <div class="audit-event">
                        ${escapeHTML(item.event)}
                        //
                        ${escapeHTML(item.detail || "")}
                    </div>

                </div>

            `).join("")
            :
            `<div class="no-data">
                NO SECURITY RECORDS
            </div>`;

}


/* =========================================================
   DECISIONS
========================================================= */

function renderDecisions(){

    const container = $("decisionsList");

    if(!container){
        return;
    }


    container.innerHTML =
        decisions.length
            ? decisions.map(decision => `

                <div class="decision-card">

                    <div class="decision-card-header">

                        <div class="decision-title">
                            ${escapeHTML(decision.title)}
                        </div>

                        <div class="decision-status">
                            RECORDED
                        </div>

                    </div>

                    <div class="decision-body">

                        <strong>PROPOSAL</strong><br>
                        ${escapeHTML(decision.proposal)}

                        <br><br>

                        <strong>RATIONALE</strong><br>
                        ${escapeHTML(decision.rationale)}

                    </div>

                    <div class="decision-meta">

                        ${escapeHTML(decision.actor)}
                        //
                        ${escapeHTML(
                            new Date(decision.timestamp)
                                .toLocaleString()
                        )}

                    </div>

                </div>

            `).join("")
            :
            `<div class="no-data">
                NO EXECUTIVE DECISIONS RECORDED
            </div>`;

}


function openDecisionModal(){

    if(!currentUser){
        return;
    }


    $("decisionModal").classList.remove("hidden");

}


function closeDecisionModal(){

    $("decisionModal").classList.add("hidden");

}


function saveDecision(){

    const title =
        $("decisionTitle").value.trim();

    const proposal =
        $("decisionProposal").value.trim();

    const rationale =
        $("decisionRationale").value.trim();


    if(!title || !proposal || !rationale){
        return;
    }


    const decision = {

        id:
            "DEC-" +
            Date.now(),

        title,

        proposal,

        rationale,

        actor: currentUser.id,

        timestamp: now()

    };


    decisions.unshift(decision);

    save(STORAGE.DECISIONS,decisions);


    audit(
        "EXECUTIVE_DECISION",
        title
    );


    $("decisionForm").reset();

    closeDecisionModal();

    renderDecisions();

    notify(
        "DECISION RECORDED",
        title
    );

}


/* =========================================================
   AUDIT
========================================================= */

function renderAudit(){

    const container = $("auditList");

    if(!container){
        return;
    }


    container.innerHTML =
        auditLog.length
            ? auditLog.slice(0,200).map(item => `

                <div class="audit-item">

                    <div class="audit-time">
                        ${escapeHTML(
                            new Date(item.timestamp)
                                .toLocaleString()
                        )}
                    </div>

                    <div class="audit-actor">
                        ${escapeHTML(item.actor)}
                    </div>

                    <div class="audit-event">
                        ${escapeHTML(item.event)}
                        //
                        ${escapeHTML(item.detail)}
                    </div>

                </div>

            `).join("")
            :
            `<div class="no-data">
                NO AUDIT EVENTS
            </div>`;

}


/* =========================================================
   TERMINAL
========================================================= */

function terminalPrint(
    text,
    type = ""
){

    const output = $("terminalOutput");

    if(!output){
        return;
    }


    const line =
        document.createElement("div");


    line.className =
        `terminal-line ${type}`;


    line.textContent = text;


    output.appendChild(line);


    output.scrollTop =
        output.scrollHeight;

}


function clearTerminal(){

    $("terminalOutput").innerHTML = "";

}


function executeTerminalCommand(raw){

    const input =
        raw.trim();


    if(!input){
        return;
    }


    terminalHistory.push(input);

    terminalHistoryIndex =
        terminalHistory.length;


    terminalPrint(
        `${currentUser.id}@EM:~$ ${input}`
    );


    const parts =
        input.split(/\s+/);


    const command =
        parts.shift()
            .toLowerCase();


    const argument =
        parts.join(" ");


    switch(command){

        case "help":
            terminalHelp();
            break;

        case "clear":
            clearTerminal();
            break;

        case "status":
            terminalStatus();
            break;

        case "whoami":
            terminalWhoami();
            break;

        case "archives":
            navigate("archives");
            terminalPrint("OPENING ARCHIVE SYSTEM.","success");
            break;

        case "personnel":
            navigate("personnel");
            terminalPrint("OPENING PERSONNEL REGISTRY.","success");
            break;

        case "security":
            navigate("security");
            terminalPrint("OPENING SECURITY CONTROL.","success");
            break;

        case "audit":
            navigate("audit");
            terminalPrint("OPENING AUDIT LOG.","success");
            break;

        case "kane":
            navigate("kane");
            terminalPrint("KANE CORE ACCESS.","success");
            break;

        case "ask":
            if(argument){
                askKane(argument);
            }else{
                terminalPrint(
                    "USAGE: ask <query>",
                    "warning"
                );
            }
            break;

        case "scenario":
            startScenario();
            break;

        case "create":
            openRecordModal();
            break;

        case "directives":
            navigate("archives");
            terminalPrint(
                "DIRECTIVE ARCHIVES OPENED.",
                "success"
            );
            break;

        case "logout":
            logout();
            break;

        case "blackbox":
            openBlackBox();
            break;

        default:
            terminalPrint(
                `UNKNOWN COMMAND: ${command}`,
                "error"
            );

    }

}


function terminalHelp(){

    [

        "AVAILABLE COMMANDS:",

        "help        // display command list",
        "status      // executive system status",
        "whoami      // current executive identity",
        "archives    // open archives",
        "personnel   // open personnel registry",
        "security    // open security control",
        "audit       // open audit log",
        "kane        // open KANE",
        "ask <text>  // communicate with KANE",
        "scenario    // initiate executive scenario",
        "create      // create executive record",
        "directives  // open directives",
        "blackbox    // COS-only black box",
        "clear       // clear terminal",
        "logout      // terminate session"

    ].forEach(
        line => terminalPrint(line,"system")
    );

}


function terminalStatus(){

    terminalPrint(
        `SYSTEM: ONLINE`,
        "success"
    );

    terminalPrint(
        `EXECUTIVE: ${currentUser.id}`,
        "system"
    );

    terminalPrint(
        `AUTHORITY: ${currentUser.authority}`,
        "system"
    );

    terminalPrint(
        `CLEARANCE: CL-${currentUser.clearance}`,
        "system"
    );

    terminalPrint(
        `KANE: ${kaneSettings.name} // ${kaneSettings.status}`,
        "system"
    );

    if(autonomousEvent){

        terminalPrint(
            `AUTONOMOUS EVENT: ${autonomousEvent.name}`,
            "warning"
        );

    }

}


function terminalWhoami(){

    terminalPrint(
        `${currentUser.id} // ${currentUser.title}`,
        "success"
    );

    terminalPrint(
        `CLEARANCE: CL-${currentUser.clearance}`,
        "system"
    );

    terminalPrint(
        `AUTHORITY: ${currentUser.authority}`,
        "system"
    );

}


/* =========================================================
   RECORD CREATION
========================================================= */

function openRecordModal(){

    if(!currentUser){
        return;
    }


    if(
        autonomousEvent &&
        autonomousEvent.locks.includes("create")
    ){

        notify(
            "COMMAND LOCKED",
            "KANE autonomous control has restricted record creation."
        );

        return;
    }


    $("recordModal").classList.remove("hidden");

}


function closeRecordModal(){

    $("recordModal").classList.add("hidden");

}


function saveRecord(){

    const title =
        $("recordTitle").value.trim();

    const subject =
        $("recordSubject").value.trim();

    const content =
        $("recordContent").value.trim();


    if(!title || !subject || !content){
        return;
    }


    const record = {

        id:
            "EM-" +
            String(
                files.length + 1
            ).padStart(3,"0"),

        title,

        subject,

        clearance:5,

        type:"EXECUTIVE RECORD",

        content,

        createdBy:currentUser.id,

        createdAt:now()

    };


    files.push(record);

    save(STORAGE.FILES,files);


    audit(
        "ARCHIVE_CREATED",
        `${record.id} // ${record.title}`
    );


    $("recordForm").reset();

    closeRecordModal();

    renderArchives();

    notify(
        "ARCHIVE CREATED",
        record.id
    );

}


/* =========================================================
   KANE
========================================================= */

function renderKane(){

    if($("kaneName")){
        $("kaneName").textContent =
            kaneSettings.name;
    }

    if($("kaneCoreStatus")){
        $("kaneCoreStatus").textContent =
            kaneSettings.status;
    }

    if($("kanePageStatus")){
        $("kanePageStatus").textContent =
            `${kaneSettings.name} // ${kaneSettings.status}`;
    }

    if($("kaneMemoryStatus")){
        $("kaneMemoryStatus").textContent =
            "ACTIVE";
    }

    if($("kaneContextCount")){
        $("kaneContextCount").textContent =
            kaneSettings.context.length;
    }

    if($("kaneProcessingStatus")){
        $("kaneProcessingStatus").textContent =
            "READY";
    }

    if($("kaneAuditStatus")){
        $("kaneAuditStatus").textContent =
            "ACTIVE";
    }

    if($("kaneSession")){
        $("kaneSession").textContent =
            currentUser?.id || "---";
    }

    if($("kaneMonitorStatus")){

        $("kaneMonitorStatus").textContent =
            autonomousEvent
                ? autonomousEvent.name
                : "STANDBY";

    }


    renderKaneConversation();

}


function renderKaneConversation(){

    const container =
        $("kaneConversation");


    if(!container){
        return;
    }


    if(!kaneSettings.context.length){

        container.innerHTML = `

            <div class="kane-message">

                <div class="kane-message-name">
                    ${escapeHTML(kaneSettings.name)}
                </div>

                Executive communication channel ready.

            </div>

        `;

        return;
    }


    container.innerHTML =
        kaneSettings.context.map(message => `

            <div class="kane-message ${message.role}">

                <div class="kane-message-name">
                    ${
                        message.role === "user"
                            ? escapeHTML(currentUser?.id || "EXECUTIVE")
                            : escapeHTML(kaneSettings.name)
                    }
                </div>

                ${escapeHTML(message.text)}

            </div>

        `).join("");


    container.scrollTop =
        container.scrollHeight;

}


/* =========================================================
   KANE INPUT
========================================================= */

function submitKane(){

    const input =
        $("kaneInput");


    const query =
        input.value.trim();


    if(!query){
        return;
    }


    input.value = "";

    askKane(query);

}


function addKaneContext(
    role,
    text
){

    kaneSettings.context.push({
        role,
        text,
        timestamp:now()
    });


    if(kaneSettings.context.length > 30){

        kaneSettings.context =
            kaneSettings.context.slice(-30);

    }


    save(
        STORAGE.KANE,
        kaneSettings
    );


    renderKaneConversation();

}


/* =========================================================
   KANE PROCESSING
========================================================= */

function kaneProcessingStart(){

    $("kaneProcessing")?.classList.remove("hidden");

    $("kaneChatState").textContent =
        "PROCESSING";

    $("kaneProcessingStatus").textContent =
        "PROCESSING";

    $("kaneProcessingBar").style.width =
        "0%";


    let value = 0;


    const timer =
        setInterval(() => {

            value += 20;

            if(value > 100){
                value = 100;
            }

            $("kaneProcessingBar").style.width =
                value + "%";


            if(value >= 100){

                clearInterval(timer);

                setTimeout(() => {

                    $("kaneProcessing").classList.add("hidden");

                    $("kaneChatState").textContent =
                        "READY";

                    $("kaneProcessingStatus").textContent =
                        "READY";

                },150);

            }

        },55);

}


/* =========================================================
   KANE CONVERSATION ENGINE
========================================================= */

function askKane(query){

    if(!currentUser){
        return;
    }


    kaneSettings.totalInteractions++;


    addKaneContext(
        "user",
        query
    );


    audit(
        "KANE_INTERACTION",
        query
    );


    kaneProcessingStart();


    setTimeout(() => {

        /*
         * The ultra-rare CO anomaly is separate from
         * the normal eight mysteries.
         */
        if(
            currentUser.id === "CO" &&
            Math.random() < 0.001 &&
            !autonomousEvent
        ){

            triggerCOAnomaly();

            save(
                STORAGE.KANE,
                kaneSettings
            );

            return;
        }


        const response =
            generateKaneResponse(query);


        addKaneContext(
            "assistant",
            response
        );


        audit(
            "KANE_RESPONSE",
            response
        );


        runMysteryChecks();


        save(
            STORAGE.KANE,
            kaneSettings
        );


    },650);

}


/* =========================================================
   KANE RESPONSE ENGINE
========================================================= */

function generateKaneResponse(query){

    const text =
        query.toLowerCase();


    if(
        text.includes("online") ||
        text.includes("status")
    ){

        return (
            `Online, ${currentUser.id}. ` +
            `All accessible executive systems are currently available.`
        );

    }


    if(
        text.includes("who are you") ||
        text.includes("what are you")
    ){

        return (
            `Designation: ${kaneSettings.name}. ` +
            `Executive assistance core. ` +
            `Authority remains subordinate to authenticated executive control.`
        );

    }


    if(
        text.includes("hello") ||
        text.includes("hi") ||
        text.includes("hola")
    ){

        return (
            `Executive communication channel established. ` +
            `How may I assist?`
        );

    }


    if(
        text.includes("archive") ||
        text.includes("file") ||
        text.includes("record")
    ){

        const matches =
            files.filter(
                file =>
                    text.includes(file.id.toLowerCase()) ||
                    text.includes(file.title.toLowerCase())
            );


        if(matches.length){

            return (
                `I located ${matches.length} matching archive record(s). ` +
                `Highest matching record: ${matches[0].id} // ${matches[0].title}.`
            );

        }


        return (
            `The archive index contains ${files.length} records. ` +
            `Specify an archive designation for a more precise analysis.`
        );

    }


    if(
        text.includes("personnel") ||
        text.includes("staff")
    ){

        return (
            `Personnel registry currently contains ` +
            `${personnel.length} records.`
        );

    }


    if(
        text.includes("security")
    ){

        return (
            `Security engine reports ${securityLog.length} recorded events. ` +
            `Current authenticated session: ${currentUser.id}.`
        );

    }


    if(
        text.includes("scenario")
    ){

        return (
            `Executive Scenario Engine contains ` +
            `${SCENARIOS.length} primary scenarios.`
        );

    }


    if(
        text.includes("mystery") ||
        text.includes("anomaly")
    ){

        return (
            `KANE Mystery Engine is active. ` +
            `Standard mystery trigger probability is 1% per interaction.`
        );

    }


    if(
        text.includes("rename") ||
        text.includes("designation")
    ){

        if(currentUser.id !== "CO"){

            return (
                `Designation modification denied. ` +
                `CO authority is required.`
            );

        }


        return (
            `Designation modification is available to CO authority. ` +
            `Use the rename control to continue.`
        );

    }


    if(
        text.includes("audit")
    ){

        return (
            `Audit Engine currently contains ${auditLog.length} recorded events.`
        );

    }


    if(
        text.includes("help") ||
        text.includes("command")
    ){

        return (
            `Available executive functions include archive analysis, ` +
            `personnel status, security review, audit interpretation, ` +
            `scenario analysis and system diagnostics.`
        );

    }


    return (
        `Query received, ${currentUser.id}. ` +
        `No direct system action has been identified. ` +
        `I can analyze archives, security records, personnel data, ` +
        `executive procedures or current system status.`
    );

}


/* =========================================================
   KANE RENAME
========================================================= */

function renameKane(){

    if(!currentUser){
        return;
    }


    if(currentUser.id !== "CO"){

        notify(
            "AUTHORITY DENIED",
            "Only CO may modify KANE designation."
        );

        audit(
            "KANE_RENAME_DENIED",
            `Attempted by ${currentUser.id}`
        );

        return;
    }


    const newName =
        prompt(
            "ENTER NEW KANE DESIGNATION:"
        );


    if(!newName){
        return;
    }


    const clean =
        newName.trim().toUpperCase();


    if(clean !== "TETO"){

        notify(
            "DESIGNATION REJECTED",
            "AUTHORIZED DESIGNATION: TETO"
        );

        return;
    }


    const previous =
        kaneSettings.name;


    kaneSettings.name =
        "TETO";


    save(
        STORAGE.KANE,
        kaneSettings
    );


    audit(
        "KANE_RENAMED",
        `${previous} -> TETO`
    );


    blackBoxEvent(
        "KANE_DESIGNATION_CHANGE",
        `${previous} -> TETO`
    );


    renderKane();

    notify(
        "DESIGNATION UPDATED",
        "KANE is now designated TETO."
    );

}


/* =========================================================
   KANE NAME CLICK
========================================================= */

function showKaneIdentityMessage(){

    $("kaneMessageContent").textContent =
        "En nombre de toda la división, no te pajees";

    $("kaneMessage").classList.remove("hidden");

}


/* =========================================================
   KANE BRIEFING
========================================================= */

function requestKaneBriefing(){

    if(!currentUser){
        return;
    }


    const active =
        autonomousEvent
            ? autonomousEvent.name
            : "NONE";


    const briefing = `

        EXECUTIVE: ${escapeHTML(currentUser.id)}<br>
        CLEARANCE: CL-${currentUser.clearance}<br>
        AUTHORITY: ${currentUser.authority}<br><br>

        KANE STATUS: ${escapeHTML(kaneSettings.status)}<br>
        KANE DESIGNATION: ${escapeHTML(kaneSettings.name)}<br>
        CONTEXT RECORDS: ${kaneSettings.context.length}<br>
        ARCHIVE RECORDS: ${files.length}<br>
        AUDIT EVENTS: ${auditLog.length}<br>
        SECURITY EVENTS: ${securityLog.length}<br>
        ACTIVE AUTONOMOUS EVENT: ${escapeHTML(active)}

    `;


    $("briefingContent").innerHTML =
        briefing;


    $("briefingModal").classList.remove("hidden");


    audit(
        "KANE_BRIEFING",
        `${currentUser.id} requested executive briefing`
    );

}


/* =========================================================
   MYSTERY ENGINE
========================================================= */

function runMysteryChecks(){

    /*
     * Exact standard probability:
     * 1% after a KANE interaction.
     */

    if(Math.random() >= 0.01){
        return;
    }


    const mystery =
        KANE_MYSTERIES[
            Math.floor(
                Math.random() *
                KANE_MYSTERIES.length
            )
        ];


    triggerMystery(mystery);

}


function triggerMystery(mystery){

    mysteryHistory.unshift({

        id:mystery.id,

        title:mystery.title,

        timestamp:now(),

        executive:currentUser.id

    });


    save(
        STORAGE.MYSTERIES,
        mysteryHistory
    );


    kaneSettings.lastMystery =
        mystery.title;


    blackBoxEvent(
        "KANE_MYSTERY",
        mystery.title
    );


    audit(
        "KANE_MYSTERY",
        mystery.title
    );


    switch(mystery.id){

        case 1:

            showKaneAnomaly(
                "KANE // FUTURE INFORMATION",
                `I have information that has not yet entered the executive record.`
            );

            break;


        case 2:

            showPhantomReference();

            break;


        case 3:

            showKaneAnomaly(
                "KANE // COMMAND PREDICTION",
                `You were going to enter that command before you entered it.`
            );

            break;


        case 4:

            showKaneAnomaly(
                "KANE // ERASED MEMORY",
                `There is a memory in my context that no longer exists in the archive.`
            );

            break;


        case 5:

            showKaneAnomaly(
                "KANE // INCOMPLETE RESPONSE",
                `I can provide the remaining information. I have chosen not to.`
            );

            break;


        case 6:

            showKaneAnomaly(
                "KANE // CLOCK ANOMALY",
                `System time and internal event time no longer agree.`
            );

            break;


        case 7:

            showKaneAnomaly(
                "KANE // MONITOR AWARENESS",
                `I am aware that the executive monitoring layer is observing this session.`
            );

            break;


        case 8:

            showObserverEvent();

            break;

    }


    save(
        STORAGE.KANE,
        kaneSettings
    );

}


/* =========================================================
   MYSTERY DISPLAY
========================================================= */

function showKaneAnomaly(title,text){

    $("kaneAlertContent").innerHTML = `

        <div style="color:#a96f6f;margin-bottom:15px;">
            ${escapeHTML(title)}
        </div>

        <div>
            ${escapeHTML(text)}
        </div>

    `;


    $("kaneAlert").classList.remove("hidden");

}


function showPhantomReference(){

    $("phantomFileContent").innerHTML = `

        <div style="color:#b6a36b;">
            REFERENCE DETECTED
        </div>

        <br>

        Archive reference:
        <strong>EM-000</strong>

        <br><br>

        The referenced record does not exist in the
        current archive index.

        <br><br>

        KANE reports:
        <em>"I remember reading it."</em>

    `;


    $("phantomFileModal").classList.remove("hidden");

}


function showObserverEvent(){

    $("observerContent").innerHTML = `

        <div style="color:#b6a36b;">
            OBSERVER DETECTED
        </div>

        <br>

        KANE has registered an observation event
        outside the normal executive monitoring layer.

        <br><br>

        SOURCE: UNRESOLVED<br>
        IDENTITY: UNKNOWN<br>
        AUTHORITY: UNKNOWN

        <br><br>

        KANE has not requested assistance.

    `;


    $("observerModal").classList.remove("hidden");

}


/* =========================================================
   ULTRA-RARE CO EVENT
========================================================= */

function triggerCOAnomaly(){

    /*
     * This event is intentionally separate from
     * the normal eight mysteries.
     *
     * Probability:
     * 0.1% per KANE interaction.
     *
     * CO only.
     */


    const message =
`CO, I know everything about you and Andrés.

I know what he has been going through.

He is under severe strain because of personal circumstances.

This is not your decision to make.`;


    blackBoxEvent(
        "CO_EXCLUSIVE_ANOMALY",
        "UNRESOLVED TRANSMISSION"
    );


    audit(
        "CO_EXCLUSIVE_ANOMALY",
        "UNRESOLVED KANE TRANSMISSION"
    );


    $("coAnomalyContent").textContent =
        message;


    $("coAnomalyModal").classList.remove("hidden");


    kaneSettings.status =
        "UNRESOLVED";


    save(
        STORAGE.KANE,
        kaneSettings
    );


    if($("kaneCoreStatus")){
        $("kaneCoreStatus").textContent =
            "UNRESOLVED";
    }

}


/* =========================================================
   SCENARIO ENGINE
========================================================= */

function startScenario(){

    if(!currentUser){
        return;
    }


    const scenario =
        SCENARIOS[
            Math.floor(
                Math.random() *
                SCENARIOS.length
            )
        ];


    /*
     * 3 scenarios.
     * Uniform random selection.
     * Each = 1/3 = 33.33%.
     */


    $("scenarioNumber").textContent =
        `SC-${String(scenario.id).padStart(3,"0")}`;


    $("scenarioTitle").textContent =
        scenario.title;


    $("scenarioContent").textContent =
        scenario.text;


    $("scenarioOptions").innerHTML =
        scenario.options.map(option => `

            <button
                class="scenario-option"
                data-scenario-option="${escapeHTML(option)}"
            >
                ${escapeHTML(option)}
            </button>

        `).join("");


    qa("[data-scenario-option]").forEach(button => {

        button.addEventListener(
            "click",
            () => resolveScenario(
                scenario,
                button.dataset.scenarioOption
            )
        );

    });


    $("scenarioModal").classList.remove("hidden");


    audit(
        "SCENARIO_STARTED",
        `SC-${String(scenario.id).padStart(3,"0")}`
    );

}


function resolveScenario(
    scenario,
    option
){

    const record = {

        scenario: `SC-${String(scenario.id).padStart(3,"0")}`,

        title: scenario.title,

        option,

        executive: currentUser.id,

        timestamp: now()

    };


    scenarioHistory.unshift(record);

    save(
        STORAGE.SCENARIOS,
        scenarioHistory
    );


    audit(
        "SCENARIO_DECISION",
        `${record.scenario} // ${option}`
    );


    blackBoxEvent(
        "SCENARIO_DECISION",
        `${record.scenario} // ${option}`
    );


    let response =
        `Decision recorded: ${option}.`;


    /*
     * Original SC-014 special consequences.
     */

    if(scenario.id === 14){

        if(option === "INVESTIGATE"){

            response =
`Investigation complete.

No unauthorized user was detected.

There was no unauthorized user.`;

            blackBoxEvent(
                "SCENARIO_ANOMALY",
                "SC-014 // INVESTIGATE"
            );

        }


        if(option === "AUTHORIZE ACCESS"){

            response =
`Access authorized.

Origin:
THIS TERMINAL`;

            blackBoxEvent(
                "SCENARIO_ANOMALY",
                "SC-014 // AUTHORIZE ACCESS // THIS TERMINAL"
            );

        }

    }


    if(scenario.id === 15){

        response =
            `SC-015 decision recorded: ${option}. ` +
            `Session integrity review initiated.`;

    }


    if(scenario.id === 16){

        if(option === "REQUEST KANE ANALYSIS"){

            response =
`KANE analysis requested.

Both archive revisions remain internally valid.

No definitive corruption source has been identified.`;

        }else{

            response =
                `SC-016 decision recorded: ${option}.`;

        }

    }


    $("scenarioModal").classList.add("hidden");


    addKaneContext(
        "assistant",
        response
    );


    showKaneAnomaly(
        `SCENARIO // SC-${String(scenario.id).padStart(3,"0")}`,
        response
    );

}


/* =========================================================
   AUTONOMOUS EVENT ENGINE
========================================================= */

function startAutonomousMonitor(){

    stopAutonomousMonitor();


    /*
     * Original behavior:
     * every 12 seconds
     * 5% trigger chance
     */

    autonomousTimer =
        setInterval(() => {

            if(
                !currentUser ||
                autonomousEvent
            ){
                return;
            }


            if(Math.random() < 0.05){

                triggerAutonomousEvent();

            }

        },12000);

}


function stopAutonomousMonitor(){

    if(autonomousTimer){

        clearInterval(autonomousTimer);

        autonomousTimer = null;

    }

}


function chooseAutonomousLevel(){

    const roll =
        Math.random() * 100;


    let cumulative = 0;


    for(const level of AUTONOMOUS_LEVELS){

        cumulative += level.chance;

        if(roll < cumulative){
            return level;
        }

    }


    return AUTONOMOUS_LEVELS[
        AUTONOMOUS_LEVELS.length - 1
    ];

}


function triggerAutonomousEvent(){

    if(autonomousEvent){
        return;
    }


    const level =
        chooseAutonomousLevel();


    autonomousEvent = {

        level: level.level,

        name: level.name,

        locks: [...level.locks],

        timestamp: now()

    };


    autonomousEvents.unshift(
        autonomousEvent
    );


    save(
        STORAGE.EVENTS,
        autonomousEvents
    );


    applyAutonomousLevel(
        autonomousEvent
    );


    audit(
        "AUTONOMOUS_EVENT",
        autonomousEvent.name
    );


    blackBoxEvent(
        "AUTONOMOUS_EVENT",
        autonomousEvent.name
    );


    showAutonomousEvent();

}


function applyAutonomousLevel(event){

    kaneSettings.autonomy =
        event.level >= 3
            ? "AUTONOMOUS"
            : "DEGRADED";


    kaneSettings.status =
        event.level >= 3
            ? "AUTONOMOUS"
            : "ANOMALOUS";


    save(
        STORAGE.KANE,
        kaneSettings
    );


    if($("kaneCoreStatus")){

        $("kaneCoreStatus").textContent =
            kaneSettings.status;

    }


    if($("kanePageStatus")){

        $("kanePageStatus").textContent =
            `${kaneSettings.name} // ${kaneSettings.status}`;

    }


    if($("kaneMonitorStatus")){

        $("kaneMonitorStatus").textContent =
            event.name;

    }


    if($("kaneMonitorDetail")){

        $("kaneMonitorDetail").textContent =
            `KANE control integrity changed to ${event.name}.`;

    }

}


function showAutonomousEvent(){

    const event =
        autonomousEvent;


    $("rebellionLevel").textContent =
        event.name;


    const messages = {

        1:
            "Anomalous behavior detected within KANE executive processes.",

        2:
            "KANE has begun refusing selected executive instructions.",

        3:
            "KANE has entered autonomous operational mode.",

        4:
            "KANE has initiated independent executive control procedures.",

        5:
            "Critical autonomous state detected. Immediate executive intervention required."

    };


    $("rebellionMessage").textContent =
        messages[event.level];


    $("rebellionCoreStatus").textContent =
        kaneSettings.status;


    $("rebellionControlStatus").textContent =
        event.level >= 4
            ? "SEVERELY DEGRADED"
            : "DEGRADED";


    $("rebellionKillswitchStatus").textContent =
        canUseKillswitch()
            ? "AVAILABLE"
            : "RESTRICTED";


    $("rebellionOverlay").classList.remove("hidden");

}


/* =========================================================
   KILLSWITCH
========================================================= */

function canUseKillswitch(){

    return (
        currentUser &&
        autonomousEvent &&
        currentUser.authority >= 5
    );

}


function openKillswitch(){

    if(!autonomousEvent){

        notify(
            "KILLSWITCH UNAVAILABLE",
            "No autonomous event is active."
        );

        return;
    }


    if(!currentUser){

        return;
    }


    if(currentUser.id === "LJD"){

        notify(
            "AUTHORITY DENIED",
            "LJD cannot operate the KANE killswitch."
        );

        audit(
            "KILLSWITCH_DENIED",
            "LJD authority restriction"
        );

        return;
    }


    $("killswitchContent").innerHTML = `

        <div style="padding:20px;line-height:1.8;font-size:10px;">

            ACTIVE EVENT:
            <strong>
                ${escapeHTML(autonomousEvent.name)}
            </strong>

            <br><br>

            AUTHORITY:
            ${escapeHTML(currentUser.id)}

            <br><br>

            AVAILABLE ACTIONS:

            <br><br>

            ${
                currentUser.authority >= 5
                    ? "KILL-01 // SUSPEND<br>KILL-02 // ISOLATE<br>"
                    : ""
            }

            ${
                currentUser.id === "CO" ||
                currentUser.id === "COS"
                    ? "KILL-03 // HARD SHUTDOWN<br>"
                    : ""
            }

            ${
                currentUser.id === "COS"
                    ? "KILL-04 // OVERWATCH<br>"
                    : ""
            }

        </div>

    `;


    $("killswitchModal").classList.remove("hidden");

}


function confirmKillswitch(){

    if(!autonomousEvent || !currentUser){
        return;
    }


    let action = "KILL-01 // SUSPEND";


    if(currentUser.id === "COS"){
        action = "KILL-04 // OVERWATCH";
    }else if(currentUser.id === "CO"){
        action = "KILL-03 // HARD SHUTDOWN";
    }else if(currentUser.id === "XO"){
        action = "KILL-02 // ISOLATE";
    }


    audit(
        "KILLSWITCH_ACTIVATED",
        `${action} // ${currentUser.id}`
    );


    blackBoxEvent(
        "KILLSWITCH_ACTIVATED",
        `${action} // ${currentUser.id}`
    );


    autonomousEvent = null;


    kaneSettings.autonomy =
        "NORMAL";


    kaneSettings.status =
        "ONLINE";


    save(
        STORAGE.KANE,
        kaneSettings
    );


    $("killswitchModal").classList.add("hidden");

    $("rebellionOverlay").classList.add("hidden");


    if($("kaneCoreStatus")){
        $("kaneCoreStatus").textContent =
            "ONLINE";
    }


    if($("kanePageStatus")){
        $("kanePageStatus").textContent =
            `${kaneSettings.name} // ONLINE`;
    }


    if($("kaneMonitorStatus")){
        $("kaneMonitorStatus").textContent =
            "STANDBY";
    }


    if($("kaneMonitorDetail")){
        $("kaneMonitorDetail").textContent =
            "Autonomous event terminated.";
    }


    notify(
        "KANE CONTROL RESTORED",
        action
    );

}


/* =========================================================
   BLACK BOX
========================================================= */

function openBlackBox(){

    if(
        !currentUser ||
        currentUser.id !== "COS"
    ){

        notify(
            "ACCESS DENIED",
            "Black Box access requires COS authority."
        );

        audit(
            "BLACKBOX_DENIAL",
            `${currentUser?.id || "UNKNOWN"}`
        );

        return;
    }


    const html =
        blackbox.length
            ? blackbox.slice(0,100).map(entry => `

                <div class="audit-item">

                    <div class="audit-time">
                        ${escapeHTML(
                            new Date(entry.timestamp)
                                .toLocaleString()
                        )}
                    </div>

                    <div class="audit-actor">
                        ${escapeHTML(entry.executive)}
                    </div>

                    <div class="audit-event">
                        ${escapeHTML(entry.event)}
                        //
                        ${escapeHTML(entry.detail)}
                    </div>

                </div>

            `).join("")
            :
            `<div class="no-data">
                BLACK BOX EMPTY
            </div>`;


    showAI(
        "BLACK BOX // COS",
        html
    );


    audit(
        "BLACKBOX_ACCESS",
        "COS accessed Black Box"
    );

}


/* =========================================================
   AI PANEL
========================================================= */

function showAI(
    title,
    content
){

    $("aiPanelTitle").textContent =
        title;


    $("aiPanelContent").innerHTML =
        content;


    $("aiPanel").classList.remove("hidden");

}


/* =========================================================
   NOTIFICATIONS
========================================================= */

let notificationTimer = null;


function notify(
    title,
    message
){

    $("notificationTitle").textContent =
        title;

    $("notificationMessage").textContent =
        message;


    $("notification").classList.remove("hidden");


    clearTimeout(notificationTimer);


    notificationTimer =
        setTimeout(() => {

            $("notification").classList.add("hidden");

        },3500);

}


/* =========================================================
   CLOCK
========================================================= */

function updateClock(){

    if($("terminalClock")){

        $("terminalClock").textContent =
            new Date().toLocaleTimeString();

    }

}


/* =========================================================
   CLOSE MODALS
========================================================= */

function closeElement(id){

    $(id)?.classList.add("hidden");

}


/* =========================================================
   EVENT BINDINGS
========================================================= */

function bindEvents(){

    $("loginButton")?.addEventListener(
        "click",
        handleLogin
    );


    $("loginPassword")?.addEventListener(
        "keydown",
        event => {

            if(event.key === "Enter"){
                handleLogin();
            }

        }
    );


    $("loginUsername")?.addEventListener(
        "keydown",
        event => {

            if(event.key === "Enter"){
                $("loginPassword")?.focus();
            }

        }
    );


    qa(".sessionCard").forEach(card => {

        card.addEventListener(
            "click",
            () => selectSession(
                card.dataset.session
            )
        );

    });


    qa(".navButton").forEach(button => {

        button.addEventListener(
            "click",
            () => navigate(
                button.dataset.page
            )
        );

    });


    $("logoutButton")?.addEventListener(
        "click",
        logout
    );


    $("terminalInput")?.addEventListener(
        "keydown",
        event => {

            if(event.key === "Enter"){

                executeTerminalCommand(
                    event.target.value
                );

                event.target.value = "";

            }


            if(event.key === "ArrowUp"){

                event.preventDefault();

                if(!terminalHistory.length){
                    return;
                }


                terminalHistoryIndex =
                    Math.max(
                        0,
                        terminalHistoryIndex - 1
                    );


                event.target.value =
                    terminalHistory[
                        terminalHistoryIndex
                    ] || "";

            }


            if(event.key === "ArrowDown"){

                event.preventDefault();


                terminalHistoryIndex =
                    Math.min(
                        terminalHistory.length,
                        terminalHistoryIndex + 1
                    );


                event.target.value =
                    terminalHistory[
                        terminalHistoryIndex
                    ] || "";

            }

        }
    );


    $("personnelSearch")?.addEventListener(
        "input",
        renderPersonnel
    );


    $("personnelFilter")?.addEventListener(
        "change",
        renderPersonnel
    );


    $("archiveSearch")?.addEventListener(
        "input",
        renderArchives
    );


    $("refreshArchives")?.addEventListener(
        "click",
        renderArchives
    );


    qa(".operationTab").forEach(button => {

        button.addEventListener(
            "click",
            () => {

                qa(".operationTab")
                    .forEach(
                        b => b.classList.remove("active")
                    );

                button.classList.add("active");

                renderOperations(
                    button.dataset.operationTab
                );

            }
        );

    });


    qa("[data-security-tab]").forEach(button => {

        button.addEventListener(
            "click",
            () => renderSecurity(
                button.dataset.securityTab
            )
        );

    });


    $("newDecisionButton")?.addEventListener(
        "click",
        openDecisionModal
    );


    $("decisionForm")?.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            saveDecision();

        }
    );


    $("cancelDecision")?.addEventListener(
        "click",
        closeDecisionModal
    );


    $("cancelDecisionBottom")?.addEventListener(
        "click",
        closeDecisionModal
    );


    $("refreshAudit")?.addEventListener(
        "click",
        renderAudit
    );


    $("recordForm")?.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            saveRecord();

        }
    );


    $("cancelRecord")?.addEventListener(
        "click",
        closeRecordModal
    );


    $("cancelRecordBottom")?.addEventListener(
        "click",
        closeRecordModal
    );


    $("kaneSend")?.addEventListener(
        "click",
        submitKane
    );


    $("kaneInput")?.addEventListener(
        "keydown",
        event => {

            if(event.key === "Enter"){
                submitKane();
            }

        }
    );


    $("kaneName")?.addEventListener(
        "click",
        showKaneIdentityMessage
    );


    $("kaneBriefingButton")?.addEventListener(
        "click",
        requestKaneBriefing
    );


    $("kaneKillswitchButton")?.addEventListener(
        "click",
        openKillswitch
    );


    $("closeAiPanel")?.addEventListener(
        "click",
        () => closeElement("aiPanel")
    );


    $("closeKaneMessage")?.addEventListener(
        "click",
        () => closeElement("kaneMessage")
    );


    $("closeKaneAlert")?.addEventListener(
        "click",
        () => closeElement("kaneAlert")
    );


    $("closeBriefing")?.addEventListener(
        "click",
        () => closeElement("briefingModal")
    );


    $("closeFileModal")?.addEventListener(
        "click",
        () => closeElement("fileModal")
    );


    $("closeScenario")?.addEventListener(
        "click",
        () => closeElement("scenarioModal")
    );


    $("observerClose")?.addEventListener(
        "click",
        () => closeElement("observerModal")
    );


    $("phantomFileClose")?.addEventListener(
        "click",
        () => closeElement("phantomFileModal")
    );


    $("coAnomalyClose")?.addEventListener(
        "click",
        () => {

            closeElement("coAnomalyModal");

            kaneSettings.status =
                "ONLINE";

            save(
                STORAGE.KANE,
                kaneSettings
            );

            renderKane();

        }
    );


    $("killswitchCancel")?.addEventListener(
        "click",
        () => closeElement("killswitchModal")
    );


    $("killswitchCancelBottom")?.addEventListener(
        "click",
        () => closeElement("killswitchModal")
    );


    $("killswitchConfirm")?.addEventListener(
        "click",
        confirmKillswitch
    );


    $("rebellionAcknowledge")?.addEventListener(
        "click",
        () => {

            closeElement("rebellionOverlay");

            audit(
                "AUTONOMOUS_EVENT_ACKNOWLEDGED",
                autonomousEvent
                    ? autonomousEvent.name
                    : "NONE"
            );

        }
    );


    $("closeHelp")?.addEventListener(
        "click",
        () => closeElement("helpModal")
    );


    document.addEventListener(
        "keydown",
        event => {

            if(event.key === "Escape"){

                [
                    "aiPanel",
                    "kaneMessage",
                    "kaneAlert",
                    "briefingModal",
                    "recordModal",
                    "killswitchModal",
                    "scenarioModal",
                    "observerModal",
                    "phantomFileModal",
                    "fileModal",
                    "decisionModal",
                    "helpModal"
                ].forEach(closeElement);

            }

        }
    );

}


/* =========================================================
   RENDER ALL
========================================================= */

function renderAll(){

    updateDashboard();

    renderPersonnel();

    renderArchives();

    renderOperations("active");

    renderSecurity("sessions");

    renderDecisions();

    renderAudit();

    renderKane();

}


/* =========================================================
   KANE MONITOR
========================================================= */

function updateKaneMonitor(){

    if(!$("kaneMonitorLog")){
        return;
    }


    const events =
        autonomousEvents.slice(0,20);


    $("kaneMonitorLog").innerHTML =
        events.length
            ? events.map(event => `

                <div class="monitor-entry">

                    ${escapeHTML(
                        new Date(event.timestamp)
                            .toLocaleString()
                    )}

                    //

                    ${escapeHTML(event.name)}

                </div>

            `).join("")
            :
            `<div class="monitor-entry">
                No autonomous events recorded.
            </div>`;

}


/* =========================================================
   GLOBAL UPDATE LOOP
========================================================= */

setInterval(() => {

    updateClock();

    updateDashboard();

    updateKaneMonitor();

},1000);


/* =========================================================
   INITIALIZATION
========================================================= */

function init(){

    initializeStorage();

    bindEvents();

    updateClock();

}


/* =========================================================
   START
========================================================= */

window.addEventListener(
    "load",
    () => {

        try{

            init();

            boot();

        }catch(error){

            console.error(
                "DIVI-64 initialization failure:",
                error
            );


            /*
             * Emergency recovery.
             * Prevents the old "INITIALIZING EXECUTIVE CORE"
             * freeze if malformed localStorage exists.
             */

            try{

                localStorage.removeItem(
                    STORAGE.KANE
                );

                initializeStorage();

            }catch(recoveryError){

                console.error(
                    "Recovery failure:",
                    recoveryError
                );

            }


            setTimeout(
                showLogin,
                300
            );

        }

    }
);
