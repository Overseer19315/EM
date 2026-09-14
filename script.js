(()=>{
"use strict";

/* =========================================================
   DIVI-64 // EXECUTIVE MANAGEMENT
   LOCAL EXECUTIVE DATABASE
   ========================================================= */

const $=id=>document.getElementById(id);

const bootScreen=$("bootScreen");
const loginScreen=$("loginScreen");
const sessionScreen=$("sessionScreen");
const terminalScreen=$("terminalScreen");

const bootProgress=$("bootProgress");
const bootPercent=$("bootPercent");
const bootStatus=$("bootStatus");
const bootMessage=$("bootMessage");

const loginForm=$("loginForm");
const usernameInput=$("username");
const passwordInput=$("password");
const loginMessage=$("loginMessage");

const currentSession=$("currentSession");
const authorityLevel=$("authorityLevel");
const welcomeText=$("welcomeText");

const terminalOutput=$("terminalOutput");
const commandForm=$("commandForm");
const commandInput=$("commandInput");
const commandPrompt=$("commandPrompt");
const terminalClock=$("terminalClock");
const logoutButton=$("logoutButton");


/* =========================================================
   EXECUTIVE ACCOUNTS
   ========================================================= */

const ACCOUNTS={
"LJD":{
user:"LJD",
pass:"LJD-64",
authority:"EXECUTIVE",
session:"LJD"
},

"XO":{
user:"XO",
pass:"XO-64",
authority:"EXECUTIVE COMMAND",
session:"XO"
},

"CO":{
user:"CO",
pass:"CO-64",
authority:"COMMAND",
session:"CO"
},

"COS":{
user:"COS",
pass:"COS-64",
authority:"SUPREME EXECUTIVE AUTHORITY",
session:"COS"
}
};


/* =========================================================
   SESSION DATA
   ========================================================= */

const SESSIONS={
LJD:{
authority:"EXECUTIVE",
welcome:
`WELCOME, LJD.

Executive Management recognizes your authority.

Executive records are available according to your assigned permissions.

All activity is recorded in the Executive Audit Register.`
},

XO:{
authority:"EXECUTIVE COMMAND",
welcome:
`WELCOME, XO.

Executive Command access confirmed.

The Executive Database is awaiting your directives.

All activity is recorded in the Executive Audit Register.`
},

CO:{
authority:"COMMAND",
welcome:
`WELCOME, CO.

Command authority verified.

Executive records and command functions are now available.

All activity is recorded in the Executive Audit Register.`
},

COS:{
authority:"SUPREME EXECUTIVE AUTHORITY",
welcome:
`WELCOME, COS.

SUPREME EXECUTIVE AUTHORITY VERIFIED.

All Executive Management functions are available.

The system recognizes your authority above all other executive sessions.

All activity is recorded in the Executive Audit Register.`
}
};


/* =========================================================
   STORAGE
   ========================================================= */

const FILE_KEY="DIVI64_EXECUTIVE_FILES";
const AUDIT_KEY="DIVI64_EXECUTIVE_AUDIT";

let currentUser=null;
let currentSessionName=null;

function getFiles(){
try{
return JSON.parse(localStorage.getItem(FILE_KEY))||[];
}catch{
return [];
}
}

function saveFiles(files){
localStorage.setItem(FILE_KEY,JSON.stringify(files));
}

function getAudit(){
try{
return JSON.parse(localStorage.getItem(AUDIT_KEY))||[];
}catch{
return [];
}
}

function saveAudit(audit){
localStorage.setItem(AUDIT_KEY,JSON.stringify(audit));
}


/* =========================================================
   AUDIT
   ========================================================= */

function audit(action,details=""){
const logs=getAudit();

logs.push({
time:new Date().toISOString(),
user:currentUser||"SYSTEM",
session:currentSessionName||"NONE",
action,
details
});

if(logs.length>500){
logs.splice(0,logs.length-500);
}

saveAudit(logs);
}


/* =========================================================
   BOOT
   ========================================================= */

function boot(){

let progress=0;

const messages=[
"INITIALIZING MAINFRAME",
"LOADING EXECUTIVE CORE",
"VERIFYING CLASSIFICATION",
"LOADING CL-5 ARCHIVE",
"INITIALIZING AUDIT ENGINE",
"EXECUTIVE SYSTEM READY"
];

bootStatus.textContent=messages[0];

const timer=setInterval(()=>{

progress+=Math.floor(Math.random()*5)+2;

if(progress>100)progress=100;

bootProgress.style.width=progress+"%";
bootPercent.textContent=progress+"%";

const index=Math.min(
messages.length-1,
Math.floor(progress/(100/messages.length))
);

bootStatus.textContent=messages[index];

const text=[
"Establishing executive environment...",
"Loading central management modules...",
"Verifying Overwatch classification...",
"Preparing restricted archives...",
"Initializing local audit register...",
"Awaiting executive authentication..."
];

bootMessage.textContent=text[index];

if(progress>=100){

clearInterval(timer);

setTimeout(()=>{
bootScreen.classList.add("hidden");
loginScreen.classList.remove("hidden");
usernameInput.focus();
},650);

}

},100);

}


/* =========================================================
   LOGIN
   ========================================================= */

loginForm.addEventListener("submit",e=>{

e.preventDefault();

const user=usernameInput.value.trim().toUpperCase();
const pass=passwordInput.value;

loginMessage.textContent="AUTHENTICATING...";

setTimeout(()=>{

const account=ACCOUNTS[user];

if(!account||account.pass!==pass){

loginMessage.textContent="ACCESS DENIED // INVALID CREDENTIALS";

audit("LOGIN_FAILURE",user);

passwordInput.value="";
passwordInput.focus();

return;
}

currentUser=account.user;

audit("LOGIN_SUCCESS","Authentication accepted");

loginMessage.textContent="AUTHENTICATION ACCEPTED";

setTimeout(()=>{

loginScreen.classList.add("hidden");
sessionScreen.classList.remove("hidden");

usernameInput.value="";
passwordInput.value="";
loginMessage.textContent="";

},400);

},350);

});


/* =========================================================
   SESSION SELECTION
   ========================================================= */

document.querySelectorAll(".sessionButton").forEach(button=>{

button.addEventListener("click",()=>{

const session=button.dataset.session;

if(currentUser!==session){

alert("ACCESS DENIED\n\nThe authenticated account does not correspond to this executive session.");

audit(
"SESSION_DENIED",
`Attempted session: ${session}`
);

return;
}

openSession(session);

});

});


function openSession(session){

currentSessionName=session;

const data=SESSIONS[session];

currentSession.textContent=session;
authorityLevel.textContent=data.authority;
welcomeText.textContent=data.welcome;

commandPrompt.textContent=
"D-64@"+session.toLowerCase()+":~$";

sessionScreen.classList.add("hidden");
terminalScreen.classList.remove("hidden");

terminalOutput.innerHTML="";

audit("SESSION_OPEN",session);

print(
`DIVI-64 // EXECUTIVE MANAGEMENT

SESSION: ${session}
AUTHORITY: ${data.authority}

${data.welcome}

Type "help" to display available commands.`,
"outputSuccess"
);

setTimeout(()=>commandInput.focus(),100);

}


/* =========================================================
   TERMINAL OUTPUT
   ========================================================= */

function print(text="",className=""){

const line=document.createElement("div");

if(className)
line.className=className;

line.textContent=text;

terminalOutput.appendChild(line);
terminalOutput.scrollTop=terminalOutput.scrollHeight;

}

function separator(){
print("------------------------------------------------------------");
}


/* =========================================================
   COMMAND TERMINAL
   ========================================================= */

commandForm.addEventListener("submit",e=>{

e.preventDefault();

const raw=commandInput.value.trim();

if(!raw)return;

print(
`${commandPrompt.textContent} ${raw}`,
"outputCommand"
);

commandInput.value="";

execute(raw);

});


function execute(raw){

const parts=raw.split(/\s+/);
const command=parts.shift().toLowerCase();
const argument=parts.join(" ");

switch(command){

case"help":
help();
break;

case"clear":
terminalOutput.innerHTML="";
break;

case"status":
status();
break;

case"archives":
archives();
break;

case"open":
openFile(argument);
break;

case"create":
createFile();
break;

case"search":
search(argument);
break;

case"personnel":
personnel();
break;

case"directives":
directives();
break;

case"audit":
showAudit();
break;

case"system":
system();
break;

case"logout":
logout();
break;

case"whoami":
whoami();
break;

default:

print(
`UNKNOWN COMMAND: ${command}

Type "help" for available commands.`,
"outputWarning"
);

}

}


/* =========================================================
   HELP
   ========================================================= */

function help(){

separator();

print("DIVI-64 // EXECUTIVE COMMAND REGISTER","outputTitle");

separator();

print(
`help              Display this command register
clear             Clear terminal output
status            Display current executive status
archives          Display executive archive index
open <ID>         Open an executive file
create            Create a new executive file
search <term>     Search executive records
personnel         Display executive personnel registry
directives        Display executive directives
audit             Display local audit register
system            Display system information
whoami            Display authenticated identity
logout             Terminate executive session`
);

separator();

}


/* =========================================================
   STATUS
   ========================================================= */

function status(){

separator();

print("DIVI-64 // SYSTEM STATUS","outputTitle");

separator();

print(
`MAINFRAME              ONLINE
EXECUTIVE DATABASE     ONLINE
AUTHENTICATION         ACTIVE
AUDIT ENGINE           ACTIVE
LOCAL ARCHIVE          AVAILABLE
CLASSIFICATION         CL-5
AUTHENTICATED USER     ${currentUser}
ACTIVE SESSION         ${currentSessionName}
AUTHORITY              ${SESSIONS[currentSessionName].authority}`
);

separator();

}


/* =========================================================
   ARCHIVES
   ========================================================= */

function archives(){

const files=getFiles();

separator();

print("EXECUTIVE ARCHIVE // CL-5","outputTitle");

separator();

print(
`EM-001  EXECUTIVE MANAGEMENT CHARTER
EM-002  EXECUTIVE AUTHORITY PROTOCOL
EM-003  EXECUTIVE PERSONNEL REGISTRY
EM-004  EXECUTIVE CHAIN OF COMMAND
EM-005  EXECUTIVE VOTING PROTOCOL
EM-006  EMERGENCY EXECUTIVE PROTOCOL
EM-007  EXECUTIVE SECURITY REGULATIONS
EM-008  CLEARANCE AUTHORITY DIRECTIVE
EM-009  EXECUTIVE DISCIPLINARY AUTHORITY
EM-010  EXECUTIVE COMMUNICATIONS PROTOCOL
EM-011  EXECUTIVE ARCHIVES ACCESS DIRECTIVE
EM-012  EXECUTIVE SUCCESSION DIRECTIVE`
);

if(files.length){

print("");
print("LOCAL EXECUTIVE FILES:");

files.forEach(file=>{
print(
`${file.id}  ${file.title}  [${file.status}]`
);
});

}

separator();

}


/* =========================================================
   BUILT-IN DIRECTIVES
   ========================================================= */

const DIRECTIVES={

"EM-001":{
title:"EXECUTIVE MANAGEMENT CHARTER",
content:
`DIVI-64 // EXECUTIVE MANAGEMENT CHARTER

Classification: CL-5 // OVERWATCH

The Executive Management structure establishes the highest administrative framework of Division 64.

Executive authority is exercised through the designated executive sessions.

All executive decisions remain subject to the established chain of command.`
},

"EM-002":{
title:"EXECUTIVE AUTHORITY PROTOCOL",
content:
`DIVI-64 // EXECUTIVE AUTHORITY PROTOCOL

Classification: CL-5 // OVERWATCH

Executive authority is distributed between LJD, XO, CO and COS.

COS possesses supreme executive authority.

All executive actions must be recorded in the audit register.`
},

"EM-003":{
title:"EXECUTIVE PERSONNEL REGISTRY",
content:
`DIVI-64 // EXECUTIVE PERSONNEL REGISTRY

Classification: CL-5 // OVERWATCH

LJD  // Executive
XO   // Executive Command
CO   // Command
COS  // Supreme Executive Authority`
},

"EM-004":{
title:"EXECUTIVE CHAIN OF COMMAND",
content:
`DIVI-64 // EXECUTIVE CHAIN OF COMMAND

Classification: CL-5 // OVERWATCH

01 // COS
02 // CO
03 // XO
04 // LJD

COS represents the highest executive authority.`
},

"EM-005":{
title:"EXECUTIVE VOTING PROTOCOL",
content:
`DIVI-64 // EXECUTIVE VOTING PROTOCOL

Classification: CL-5 // OVERWATCH

Executive decisions requiring collective approval are to be registered within the Executive Management system.

Voting records must remain classified and auditable.`
},

"EM-006":{
title:"EMERGENCY EXECUTIVE PROTOCOL",
content:
`DIVI-64 // EMERGENCY EXECUTIVE PROTOCOL

Classification: CL-5 // OVERWATCH

During an executive emergency, COS may assume immediate supreme authority.

Emergency actions must be recorded within the Executive Audit Register.`
},

"EM-007":{
title:"EXECUTIVE SECURITY REGULATIONS",
content:
`DIVI-64 // EXECUTIVE SECURITY REGULATIONS

Classification: CL-5 // OVERWATCH

All executive records require controlled access.

Unauthorized attempts are recorded.

Executive credentials must not be disclosed.`
},

"EM-008":{
title:"CLEARANCE AUTHORITY DIRECTIVE",
content:
`DIVI-64 // CLEARANCE AUTHORITY DIRECTIVE

Classification: CL-5 // OVERWATCH

Executive Management operates under CL-5 classification.

Changes to executive authority require proper authorization.`
},

"EM-009":{
title:"EXECUTIVE DISCIPLINARY AUTHORITY",
content:
`DIVI-64 // EXECUTIVE DISCIPLINARY AUTHORITY

Classification: CL-5 // OVERWATCH

Executive personnel remain accountable for actions performed through the Executive Management system.`
},

"EM-010":{
title:"EXECUTIVE COMMUNICATIONS PROTOCOL",
content:
`DIVI-64 // EXECUTIVE COMMUNICATIONS PROTOCOL

Classification: CL-5 // OVERWATCH

Executive communications are restricted to authorized personnel and must maintain classification standards.`
},

"EM-011":{
title:"EXECUTIVE ARCHIVES ACCESS DIRECTIVE",
content:
`DIVI-64 // EXECUTIVE ARCHIVES ACCESS DIRECTIVE

Classification: CL-5 // OVERWATCH

Executive archives are restricted to authenticated Executive Management personnel.`
},

"EM-012":{
title:"EXECUTIVE SUCCESSION DIRECTIVE",
content:
`DIVI-64 // EXECUTIVE SUCCESSION DIRECTIVE

Classification: CL-5 // OVERWATCH

Succession authority follows the established Executive Management hierarchy.

COS remains the supreme executive authority.`
}

};


/* =========================================================
   OPEN FILE
   ========================================================= */

function openFile(id){

if(!id){

print("USAGE: open <ID>","outputWarning");
return;

}

const key=id.toUpperCase();

if(DIRECTIVES[key]){

const file=DIRECTIVES[key];

separator();

print(`${key} // ${file.title}`,"outputTitle");

separator();

print(file.content);

separator();

audit("FILE_OPEN",key);

return;

}

const custom=getFiles().find(
f=>f.id.toUpperCase()===key
);

if(custom){

separator();

print(`${custom.id} // ${custom.title}`,"outputTitle");

separator();

print(
`STATUS: ${custom.status}
AUTHOR: ${custom.author}
CREATED: ${custom.created}

${custom.content}`
);

separator();

audit("FILE_OPEN",key);

return;

}

print(
`FILE NOT FOUND: ${key}`,
"outputWarning"
);

}


/* =========================================================
   CREATE FILE
   ========================================================= */

function createFile(){

const id=window.prompt(
"Executive File ID:",
"EM-"+String(getFiles().length+13).padStart(3,"0")
);

if(!id)return;

const cleanId=id.trim().toUpperCase();

if(DIRECTIVES[cleanId]||
getFiles().some(f=>f.id.toUpperCase()===cleanId)){

print(
"FILE CREATION FAILED // ID ALREADY EXISTS",
"outputWarning"
);

return;

}

const title=window.prompt(
"Executive File Title:",
"UNTITLED EXECUTIVE RECORD"
);

if(!title)return;

const content=window.prompt(
"Executive File Content:",
"ENTER CLASSIFIED CONTENT"
);

if(content===null)return;

const file={
id:cleanId,
title:title.trim().toUpperCase(),
content:content,
status:"ACTIVE",
classification:"CL-5",
author:currentSessionName,
created:new Date().toLocaleString()
};

const files=getFiles();

files.push(file);

saveFiles(files);

audit(
"FILE_CREATE",
cleanId
);

print(
`FILE CREATED SUCCESSFULLY

ID: ${file.id}
TITLE: ${file.title}
CLASSIFICATION: CL-5
AUTHOR: ${file.author}`,
"outputSuccess"
);

}


/* =========================================================
   SEARCH
   ========================================================= */

function search(term){

if(!term){

print("USAGE: search <term>","outputWarning");
return;

}

const query=term.toLowerCase();

const results=[];

Object.entries(DIRECTIVES).forEach(([id,file])=>{

if(
id.toLowerCase().includes(query)||
file.title.toLowerCase().includes(query)||
file.content.toLowerCase().includes(query)
){

results.push(`${id} // ${file.title}`);

}

});

getFiles().forEach(file=>{

if(
file.id.toLowerCase().includes(query)||
file.title.toLowerCase().includes(query)||
file.content.toLowerCase().includes(query)
){

results.push(`${file.id} // ${file.title}`);

}

});

separator();

if(results.length){

print(`SEARCH RESULTS: ${results.length}`);

results.forEach(r=>print(r));

}else{

print(
`NO RECORDS FOUND FOR: ${term}`,
"outputWarning"
);

}

separator();

audit("SEARCH",term);

}


/* =========================================================
   PERSONNEL
   ========================================================= */

function personnel(){

separator();

print("EXECUTIVE PERSONNEL REGISTRY","outputTitle");

separator();

print(
`LJD   // EXECUTIVE
XO    // EXECUTIVE COMMAND
CO    // COMMAND
COS   // SUPREME EXECUTIVE AUTHORITY`
);

separator();

}


/* =========================================================
   DIRECTIVES
   ========================================================= */

function directives(){

separator();

print("EXECUTIVE DIRECTIVE REGISTER","outputTitle");

separator();

Object.entries(DIRECTIVES).forEach(([id,file])=>{
print(`${id}  //  ${file.title}`);
});

separator();

}


/* =========================================================
   AUDIT
   ========================================================= */

function showAudit(){

const logs=getAudit();

separator();

print("EXECUTIVE AUDIT REGISTER","outputTitle");

separator();

if(!logs.length){

print("NO AUDIT EVENTS REGISTERED.");

}else{

logs.slice(-50).forEach(log=>{

print(
`${log.time}
USER: ${log.user}
SESSION: ${log.session}
ACTION: ${log.action}
DETAILS: ${log.details}
`
);

});

}

separator();

}


/* =========================================================
   SYSTEM
   ========================================================= */

function system(){

separator();

print("DIVI-64 // SYSTEM INFORMATION","outputTitle");

separator();

print(
`PLATFORM:      GitHub Pages
BACKEND:       LOCAL
DATABASE:      LOCAL STORAGE
SUPABASE:      DISABLED
CLASSIFICATION: CL-5
ARCHIVE MODE:  LOCAL
AUDIT MODE:    LOCAL
VERSION:       EXECUTIVE MANAGEMENT
`
);

separator();

}


/* =========================================================
   WHOAMI
   ========================================================= */

function whoami(){

separator();

print(
`AUTHENTICATED IDENTITY

USER:       ${currentUser}
SESSION:    ${currentSessionName}
AUTHORITY:  ${SESSIONS[currentSessionName].authority}
CLASS:      CL-5
STATUS:     AUTHENTICATED`
);

separator();

}


/* =========================================================
   LOGOUT
   ========================================================= */

function logout(){

audit("LOGOUT","Executive session terminated");

currentUser=null;
currentSessionName=null;

terminalScreen.classList.add("hidden");
loginScreen.classList.remove("hidden");

commandInput.value="";
terminalOutput.innerHTML="";

usernameInput.value="";
passwordInput.value="";
loginMessage.textContent="";

usernameInput.focus();

}


/* =========================================================
   CLOCK
   ========================================================= */

function updateClock(){

const now=new Date();

terminalClock.textContent=
now.toLocaleTimeString("es-ES",{
hour12:false
});

}

setInterval(updateClock,1000);
updateClock();


/* =========================================================
   START
   ========================================================= */

boot();

})();
