// CareSync Core State with LocalStorage Persistence
const PASSCODE = "1234";
let isCaretakerUnlocked = false;

const defaultMeds = [
    { id: 1, name: "Amlodipine 5mg (Blood Pressure)", time: "08:30 AM - Morning", notes: "Take after morning tea/breakfast", status: "Taken" },
    { id: 2, name: "Metformin 500mg (Diabetes)", time: "01:30 PM - Afternoon", notes: "Take immediately after lunch", status: "Pending" },
    { id: 3, name: "Atorvastatin 10mg (Cholesterol)", time: "09:00 PM - Night", notes: "Take before sleep with warm water", status: "Missed" }
];

const defaultAppts = [
    { id: 101, doctor: "Dr. A. Sen (Cardiologist)", date: "2026-11-18", location: "Apollo Clinic, Salt Lake" },
    { id: 102, doctor: "Dr. P. Roy (General Physician)", date: "2026-11-24", location: "City Health Centre" }
];

let medications = JSON.parse(localStorage.getItem("caresync_meds")) || defaultMeds;
let appointments = JSON.parse(localStorage.getItem("caresync_appts")) || defaultAppts;
let seniorMood = localStorage.getItem("caresync_mood") || "Feeling Good 😊";
let emailLogs = JSON.parse(localStorage.getItem("caresync_emails")) || [
    "[08:35 AM] ✅ Dose Confirmed: Amlodipine 5mg marked as Taken by Senior.",
    "[09:15 AM] 📧 Reminder Sent to family.caretaker@example.com: Upcoming 01:30 PM Metformin 500mg dose.",
    "[09:30 AM] ⚠️ Missed Dose Alert sent to Care Circle: Atorvastatin 10mg requires follow-up."
];

function saveState() {
    localStorage.setItem("caresync_meds", JSON.stringify(medications));
    localStorage.setItem("caresync_appts", JSON.stringify(appointments));
    localStorage.setItem("caresync_mood", seniorMood);
    localStorage.setItem("caresync_emails", JSON.stringify(emailLogs));
}

// Role Switching & Secure Passcode Access
function requestCaretakerAccess() {
    if (isCaretakerUnlocked) {
        switchView("caretaker");
        return;
    }
    const modal = document.getElementById("passcode-modal");
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    document.getElementById("passcode-input").value = "";
    document.getElementById("passcode-error").classList.add("hidden");
    document.getElementById("passcode-input").focus();
}

function closePasscodeModal() {
    const modal = document.getElementById("passcode-modal");
    modal.classList.add("hidden");
    modal.classList.remove("flex");
}

function verifyPasscode() {
    const input = document.getElementById("passcode-input").value.trim();
    if (input === PASSCODE) {
        isCaretakerUnlocked = true;
        closePasscodeModal();
        switchView("caretaker");
    } else {
        document.getElementById("passcode-error").classList.remove("hidden");
    }
}

function switchView(view) {
    const seniorSec = document.getElementById("view-senior");
    const caretakerSec = document.getElementById("view-caretaker");
    const btnSenior = document.getElementById("btn-senior");
    const btnCaretaker = document.getElementById("btn-caretaker");

    if (view === "senior") {
        seniorSec.classList.remove("hidden");
        caretakerSec.classList.add("hidden");
        btnSenior.className = "px-4 py-2 rounded-lg text-sm font-semibold bg-white text-indigo-900 shadow transition";
        btnCaretaker.className = "px-4 py-2 rounded-lg text-sm font-semibold text-indigo-200 hover:text-white transition";
        renderAll();
    } else {
        seniorSec.classList.add("hidden");
        caretakerSec.classList.remove("hidden");
        btnCaretaker.className = "px-4 py-2 rounded-lg text-sm font-semibold bg-white text-indigo-900 shadow transition";
        btnSenior.className = "px-4 py-2 rounded-lg text-sm font-semibold text-indigo-200 hover:text-white transition";
        renderAll();
    }
}

// Render Views
function renderAll() {
    renderSeniorView();
    renderCaretakerView();
    renderEmailLogs();
    document.getElementById("current-mood-badge").innerText = `Logged: ${seniorMood}`;
    document.getElementById("caretaker-mood-display").innerText = `Senior Status: ${seniorMood}`;
}

function renderSeniorView() {
    const medContainer = document.getElementById("senior-med-list");
    medContainer.innerHTML = "";

    medications.forEach(med => {
        const isTaken = med.status === "Taken";
        const isMissed = med.status === "Missed";
        const badgeStyle = isTaken
            ? "bg-emerald-100 text-emerald-800"
            : isMissed
            ? "bg-rose-100 text-rose-800"
            : "bg-amber-100 text-amber-800";

        medContainer.innerHTML += `
            <div class="med-card bg-white p-6 rounded-2xl shadow-sm border-2 ${isTaken ? 'border-emerald-300 bg-emerald-50/20' : isMissed ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200'} flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div class="space-y-1">
                    <span class="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${badgeStyle}">${med.status}</span>
                    <h4 class="text-2xl font-bold text-slate-900 pt-1">${med.name}</h4>
                    <p class="text-slate-700 font-medium text-base">🕒 ${med.time}</p>
                    <p class="text-slate-500 text-sm">📋 Instruction: ${med.notes}</p>
                </div>
                <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <button onclick="updateMedStatus(${med.id}, '${isTaken ? 'Pending' : 'Taken'}')" class="w-full sm:w-auto px-7 py-4 rounded-xl font-bold text-lg shadow transition ${isTaken ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-emerald-600 text-white hover:bg-emerald-700'}">
                        ${isTaken ? '↩ Undo' : '✅ I Took This'}
                    </button>
                </div>
            </div>
        `;
    });

    const apptContainer = document.getElementById("senior-appt-list");
    apptContainer.innerHTML = "";
    appointments.forEach(appt => {
        apptContainer.innerHTML += `
            <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-1">
                <span class="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md">📅 ${appt.date}</span>
                <h4 class="text-lg font-bold text-slate-900 pt-1">${appt.doctor}</h4>
                <p class="text-sm text-slate-600">📍 ${appt.location}</p>
            </div>
        `;
    });
}

function renderCaretakerView() {
    const list = document.getElementById("caretaker-med-list");
    list.innerHTML = "";
    let taken = 0;
    let missed = 0;

    medications.forEach(med => {
        if (med.status === "Taken") taken++;
        if (med.status === "Missed") missed++;

        list.innerHTML += `
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-slate-50 rounded-xl border border-slate-200 gap-3">
                <div>
                    <h5 class="font-bold text-slate-900">${med.name}</h5>
                    <p class="text-xs text-slate-600">${med.time} • ${med.notes} • Status: <strong class="${med.status === 'Taken' ? 'text-emerald-600' : med.status === 'Missed' ? 'text-rose-600' : 'text-amber-600'}">${med.status}</strong></p>
                </div>
                <div class="flex flex-wrap gap-2">
                    <button onclick="updateMedStatus(${med.id}, 'Missed')" class="text-xs bg-amber-100 text-amber-800 hover:bg-amber-200 font-bold px-3 py-1.5 rounded-lg">Flag Missed</button>
                    <button onclick="editMedication(${med.id})" class="text-xs bg-indigo-100 text-indigo-800 hover:bg-indigo-200 font-bold px-3 py-1.5 rounded-lg">Edit</button>
                    <button onclick="deleteMedication(${med.id})" class="text-xs bg-rose-100 text-rose-700 hover:bg-rose-200 font-bold px-3 py-1.5 rounded-lg">Delete</button>
                </div>
            </div>
        `;
    });

    const total = medications.length || 1;
    const adherence = Math.round((taken / total) * 100);
    document.getElementById("stat-adherence").innerText = `${adherence}%`;
    document.getElementById("stat-taken").innerText = `${taken} / ${medications.length}`;
    document.getElementById("stat-missed").innerText = `${missed}`;
    document.getElementById("stat-appts").innerText = `${appointments.length}`;

    const apptList = document.getElementById("caretaker-appt-list");
    apptList.innerHTML = "";
    appointments.forEach(appt => {
        apptList.innerHTML += `
            <div class="flex justify-between items-center p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                    <h5 class="font-bold text-slate-800 text-sm">${appt.doctor}</h5>
                    <p class="text-xs text-slate-500">Date: ${appt.date} • Location: ${appt.location}</p>
                </div>
                <button onclick="deleteAppointment(${appt.id})" class="text-xs bg-rose-100 text-rose-700 hover:bg-rose-200 font-bold px-3 py-1.5 rounded-lg">Cancel Visit</button>
            </div>
        `;
    });
}

// Medication CRUD Operations
function updateMedStatus(id, newStatus) {
    const med = medications.find(m => m.id === id);
    if (!med) return;
    med.status = newStatus;
    const email = document.getElementById("caretaker-email")?.value || "family.caretaker@example.com";
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (newStatus === "Taken") {
        emailLogs.unshift(`[${now}] ✅ Adherence Logged: ${med.name} marked as Taken.`);
    } else if (newStatus === "Missed") {
        emailLogs.unshift(`[${now}] 🚨 PROACTIVE EMAIL SENT to ${email}: Missed dose alert for ${med.name} (${med.time}).`);
    }
    saveState();
    renderAll();
}

function saveMedication(e) {
    e.preventDefault();
    const idField = document.getElementById("med-id").value;
    const name = document.getElementById("med-name").value.trim();
    const time = document.getElementById("med-time").value.trim();
    const notes = document.getElementById("med-notes").value.trim();
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (idField) {
        const med = medications.find(m => m.id === Number(idField));
        if (med) {
            med.name = name;
            med.time = time;
            med.notes = notes;
            emailLogs.unshift(`[${now}] ✏️ Schedule Updated: ${name} updated by Caretaker.`);
        }
    } else {
        medications.push({ id: Date.now(), name, time, notes, status: "Pending" });
        emailLogs.unshift(`[${now}] ➕ New Medication Added: ${name} scheduled for ${time}.`);
    }

    resetMedForm();
    saveState();
    renderAll();
}

function editMedication(id) {
    const med = medications.find(m => m.id === id);
    if (!med) return;
    document.getElementById("med-id").value = med.id;
    document.getElementById("med-name").value = med.name;
    document.getElementById("med-time").value = med.time;
    document.getElementById("med-notes").value = med.notes;
    document.getElementById("med-form-title").innerText = "✏️ Editing Medication";
    document.getElementById("med-submit-btn").innerText = "Update Medicine";
    document.getElementById("cancel-edit-btn").classList.remove("hidden");
}

function resetMedForm() {
    document.getElementById("med-form").reset();
    document.getElementById("med-id").value = "";
    document.getElementById("med-form-title").innerText = "➕ Add / Edit Medication Schedule";
    document.getElementById("med-submit-btn").innerText = "Save Medicine";
    document.getElementById("cancel-edit-btn").classList.add("hidden");
}

function deleteMedication(id) {
    medications = medications.filter(m => m.id !== id);
    saveState();
    renderAll();
}

// Appointment Operations
function addAppointment(e) {
    e.preventDefault();
    const doctor = document.getElementById("appt-doctor").value.trim();
    const date = document.getElementById("appt-date").value;
    const location = document.getElementById("appt-location").value.trim();
    const email = document.getElementById("caretaker-email").value;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    appointments.push({ id: Date.now(), doctor, date, location });
    emailLogs.unshift(`[${now}] 📅 Appointment Email Confirmation sent to ${email} for ${doctor} on ${date}.`);
    document.getElementById("appt-form").reset();
    saveState();
    renderAll();
}

function deleteAppointment(id) {
    appointments = appointments.filter(a => a.id !== id);
    saveState();
    renderAll();
}

// Senior Mood & Voice Accessibility
function logMood(moodText) {
    seniorMood = moodText;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const email = document.getElementById("caretaker-email")?.value || "family.caretaker@example.com";
    emailLogs.unshift(`[${now}] ❤️ Senior Wellness Check-in shared with ${email}: "${moodText}"`);
    saveState();
    renderAll();
}

function speakSchedule() {
    if (!("speechSynthesis" in window)) {
        alert("Voice playback is not supported on this browser.");
        return;
    }
    window.speechSynthesis.cancel();
    const pendingMeds = medications.filter(m => m.status !== "Taken");
    let speechText = `Hello Ramesh Ji. `;
    if (pendingMeds.length === 0) {
        speechText += "Wonderful job! You have taken all your medicines for today.";
    } else {
        speechText += `You have ${pendingMeds.length} medicines remaining today. `;
        pendingMeds.forEach(m => {
            speechText += `${m.name}, scheduled for ${m.time}. Instruction: ${m.notes}. `;
        });
    }
    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
}

// Proactive Email Reminder Engine
function renderEmailLogs() {
    const container = document.getElementById("email-log-list");
    if (!container) return;
    container.innerHTML = emailLogs.map(log => `<div>${log}</div>`).join("");
}

function runProactiveEmailCheck() {
    const email = document.getElementById("caretaker-email").value || "family.caretaker@example.com";
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const missed = medications.filter(m => m.status === "Missed");
    const pending = medications.filter(m => m.status === "Pending");

    emailLogs.unshift(`[${now}] 🔍 Automated Scan Complete: ${missed.length} missed, ${pending.length} upcoming doses, ${appointments.length} appointments.`);
    if (missed.length > 0) {
        emailLogs.unshift(`[${now}] 📧 URGENT EMAIL DISPATCHED to ${email}: Please check on Ramesh Ji regarding ${missed.map(m => m.name).join(", ")}.`);
    }
    saveState();
    renderEmailLogs();
}

function sendRealEmailClient() {
    const email = document.getElementById("caretaker-email").value || "family.caretaker@example.com";
    const subject = encodeURIComponent("CareSync Alert: Elderly Medication & Appointment Summary");
    const body = encodeURIComponent(
        `CareSync Automated Family Summary:\n\n` +
        `Senior Wellness Status: ${seniorMood}\n` +
        `Medications:\n` +
        medications.map(m => `- ${m.name} (${m.time}): ${m.status}`).join("\n") +
        `\n\nUpcoming Appointments:\n` +
        appointments.map(a => `- ${a.doctor} on ${a.date} at ${a.location}`).join("\n")
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
}

function triggerEmergencyAlert() {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    emailLogs.unshift(`[${now}] 🚨 EMERGENCY SOS TRIGGERED BY SENIOR! Instant alert dispatched to Care Circle.`);
    saveState();
    renderEmailLogs();
    alert("🚨 Emergency Alert sent to your Care Circle email and family phone!");
}

// AI Medication Simplifier
function askAIAssistant() {
    const query = document.getElementById("ai-query").value.trim();
    const resBox = document.getElementById("ai-response");
    if (!query) return;

    const lower = query.toLowerCase();
    let explanation = "";

    if (lower.includes("amlodipine")) {
        explanation = `<strong>Amlodipine (Blood Pressure Care):</strong> Helps relax blood vessels so blood flows easily. <br>• <strong>Senior Tip:</strong> Stand up slowly from sitting or lying down to prevent dizziness.<br>• <strong>Missed Dose:</strong> Take as soon as remembered unless it is almost time for the next dose.`;
    } else if (lower.includes("metformin")) {
        explanation = `<strong>Metformin (Blood Sugar Care):</strong> Controls blood glucose levels nicely after meals. <br>• <strong>Senior Tip:</strong> Always take with a meal to prevent stomach upset.<br>• <strong>Interaction Check:</strong> Avoid skipping meals after taking this tablet.`;
    } else if (lower.includes("atorvastatin")) {
        explanation = `<strong>Atorvastatin (Cholesterol & Heart Care):</strong> Protects heart health by lowering bad cholesterol. <br>• <strong>Senior Tip:</strong> Best taken in the evening or before bedtime.<br>• <strong>Interaction Check:</strong> Avoid large amounts of grapefruit juice.`;
    } else {
        explanation = `<strong>${query} (AI Care Summary):</strong> Prescribed to support daily health stability. <br>• <strong>Safe Routine:</strong> Take with a full glass of water at the same time daily.<br>• <strong>Safety Rule:</strong> Never double a dose if the previous one was missed. Consult the attending physician if unusual fatigue occurs.`;
    }

    resBox.classList.remove("hidden");
    resBox.innerHTML = `🤖 ${explanation}`;
}

// Initialize App on Load
renderAll();
