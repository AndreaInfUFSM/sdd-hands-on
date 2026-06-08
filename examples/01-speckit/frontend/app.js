import { fetchJson, setBackendUrl, getBackendUrl } from "./api-client.js";

// Application state
const appState = {
  config: null,
  students: [],
  currentChallenge: null,
  selectedStudentId: null,
  selectedStudentName: null,
  currentResponse: {},
  feedback: null,
  isLoading: false,
  error: null,
  submissionInProgress: false,
};

// DOM elements
const studentInput = document.querySelector("#student-input");
const suggestionsEl = document.querySelector("#student-suggestions");
const studentStatus = document.querySelector("#student-status");
const challengeEl = document.querySelector("#challenge");
const responseForm = document.querySelector("#response-form");
const submitButton = document.querySelector("#submit-button");
const feedbackEl = document.querySelector("#feedback");
const formMessageEl = document.querySelector("#form-message");

/**
 * HTML escape utility - prevents XSS attacks
 */
function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/**
 * Show loading state
 */
function showLoading() {
  appState.isLoading = true;
  submitButton.disabled = true;
  studentInput.disabled = true;
  responseForm.querySelectorAll("input, textarea, select").forEach(el => el.disabled = true);
  setFormMessage("Carregando...", "loading");
}

/**
 * Hide loading state
 */
function hideLoading() {
  appState.isLoading = false;
  submitButton.disabled = false;
  studentInput.disabled = false;
  responseForm.querySelectorAll("input, textarea, select").forEach(el => el.disabled = false);
}

/**
 * Display form message (error, success, loading)
 */
function setFormMessage(message, type = "error") {
  formMessageEl.className = `form-message form-message-${type}`;
  formMessageEl.textContent = message;
  if (!formMessageEl.classList.contains("hidden")) {
    formMessageEl.classList.remove("hidden");
  }
}

/**
 * Clear form message
 */
function clearFormMessage() {
  formMessageEl.classList.add("hidden");
  formMessageEl.textContent = "";
}

/**
 * Render a single challenge block
 */
function renderBlock(block) {
  if (block.type === "markdown") {
    return `<p class="text-block">${escapeHtml(block.content)}</p>`;
  }

  if (block.type === "question") {
    return `
      <div class="question-block">
        <span class="question-label">Seu desafio</span>
        <p>${escapeHtml(block.content)}</p>
      </div>
    `;
  }

  if (block.type === "code") {
    return `
      <figure class="code-block">
        <figcaption>${escapeHtml(block.language)}</figcaption>
        <pre><code>${escapeHtml(block.content)}</code></pre>
      </figure>
    `;
  }

  if (block.type === "callout") {
    return `
      <aside class="callout callout-${escapeHtml(block.style)}">
        ${escapeHtml(block.content)}
      </aside>
    `;
  }

  if (block.type === "image") {
    return `
      <figure class="image-block">
        <img src="${escapeHtml(block.url)}" alt="${escapeHtml(block.alt)}">
        ${block.caption ? `<figcaption>${escapeHtml(block.caption)}</figcaption>` : ""}
      </figure>
    `;
  }

  return `<p class="error">Tipo de bloco não suportado: ${escapeHtml(block.type)}</p>`;
}

/**
 * Render a single response field
 */
function renderResponseField(field) {
  if (field.type === "single_choice") {
    return `
      <fieldset class="field-group">
        <legend>${escapeHtml(field.label)}</legend>
        <div class="choice-grid">
          ${field.options.map(option => `
            <label class="choice-card">
              <input type="radio" name="${escapeHtml(field.id)}" value="${escapeHtml(option.id)}" ${field.required ? "required" : ""}>
              <span class="choice-option-letter">${escapeHtml(option.id).toUpperCase()})</span>
              <span class="choice-option-text">${escapeHtml(option.label)}</span>
            </label>
          `).join("")}
        </div>
      </fieldset>
    `;
  }

  if (field.type === "open_text") {
    return `
      <label class="field-group">
        <span>${escapeHtml(field.label)}</span>
        <textarea
          name="${escapeHtml(field.id)}"
          rows="5"
          placeholder="${escapeHtml(field.placeholder ?? "")}"
          ${field.required ? "required" : ""}
          ${field.min_length ? `data-min-length="${field.min_length}"` : ""}
        ></textarea>
      </label>
    `;
  }

  if (field.type === "code") {
    return `
      <label class="field-group">
        <span>${escapeHtml(field.label)}</span>
        <textarea
          class="code-response"
          name="${escapeHtml(field.id)}"
          rows="5"
          placeholder="${escapeHtml(field.placeholder ?? "")}"
          ${field.required ? "required" : ""}
          ${field.min_length ? `data-min-length="${field.min_length}"` : ""}
        ></textarea>
      </label>
    `;
  }

  return `<p class="error">Campo de resposta não suportado: ${escapeHtml(field.type)}</p>`;
}

/**
 * Render the entire challenge
 */
function renderChallenge() {
  const challenge = appState.currentChallenge;

  if (!challenge) {
    challengeEl.innerHTML = `<p class="error">Nenhum desafio carregado.</p>`;
    return;
  }

  challengeEl.innerHTML = `
    <div class="challenge-header">
      <p class="daily-label">Desafio do dia</p>
      <h2>${escapeHtml(challenge.title)}</h2>
      <div class="tags">
        ${(challenge.topics ?? []).map(topic => `<span>${escapeHtml(topic)}</span>`).join("")}
        ${challenge.difficulty ? `<span>${escapeHtml(challenge.difficulty)}</span>` : ""}
      </div>
    </div>

    <div class="challenge-body">
      ${(challenge.intro ?? []).map(renderBlock).join("")}
      ${(challenge.prompt ?? []).map(renderBlock).join("")}
    </div>
  `;
}

/**
 * Render the response form fields
 */
function renderResponseForm() {
  const challenge = appState.currentChallenge;

  if (!challenge || !challenge.response) {
    responseForm.innerHTML = `<p class="error">Este desafio não tem um modelo de resposta.</p>`;
    return;
  }

  const response = challenge.response;

  if (response.type === "mixed") {
    responseForm.innerHTML = response.fields.map(renderResponseField).join("");
    return;
  }

  if (response.type === "open_text" || response.type === "code") {
    responseForm.innerHTML = renderResponseField({
      id: "answer",
      label: response.label ?? "Sua resposta",
      required: response.required ?? false,
      min_length: response.min_length,
      ...response
    });
    return;
  }

  responseForm.innerHTML = `<p class="error">Tipo de resposta não suportado: ${escapeHtml(response.type)}</p>`;
}

/**
 * Render student suggestions
 */
function renderSuggestions(matches) {
  suggestionsEl.innerHTML = "";

  if (matches.length === 0) {
    suggestionsEl.classList.add("hidden");
    return;
  }

  matches.forEach(student => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.studentId = student.student_id || student.id;
    button.textContent = escapeHtml(student.display_name);
    button.addEventListener("click", (e) => {
      e.preventDefault();
      selectStudent(student);
    });
    item.appendChild(button);
    suggestionsEl.appendChild(item);
  });

  suggestionsEl.classList.remove("hidden");
}

/**
 * Handle student input and show suggestions
 */
function handleStudentInput() {
  const query = studentInput.value.trim().toLowerCase();
  appState.selectedStudentName = studentInput.value;

  if (!query) {
    appState.selectedStudentId = null;
    suggestionsEl.innerHTML = "";
    suggestionsEl.classList.add("hidden");
    studentStatus.textContent = "";
    return;
  }

  const matches = appState.students.filter(student =>
    student.display_name.toLowerCase().includes(query)
  );

  // If input doesn't match exactly, clear selection
  if (appState.selectedStudentId && !matches.find(s => s.student_id === appState.selectedStudentId)) {
    appState.selectedStudentId = null;
  }

  renderSuggestions(matches);

  // Update status message
  if (matches.length === 0) {
    if (appState.config?.allow_manual_name) {
      studentStatus.textContent = "Este nome não está na lista, mas a digitação manual é permitida.";
    } else {
      studentStatus.textContent = "Escolha um nome da lista.";
    }
  } else {
    studentStatus.textContent = "";
  }
}

/**
 * Select a student from suggestions
 */
function selectStudent(student) {
  appState.selectedStudentId = student.student_id || student.id;
  appState.selectedStudentName = student.display_name;
  studentInput.value = student.display_name;
  suggestionsEl.innerHTML = "";
  suggestionsEl.classList.add("hidden");
  studentStatus.textContent = `Selecionado: ${escapeHtml(student.display_name)}`;
  clearFormMessage();
}

/**
 * Collect response from form
 */
function collectResponse() {
  const formData = new FormData(responseForm);
  const response = {};
  const responseModel = appState.currentChallenge?.response;

  if (!responseModel) {
    return response;
  }

  if (responseModel.type === "mixed") {
    for (const field of responseModel.fields) {
      response[field.id] = String(formData.get(field.id) ?? "").trim();
    }
    return response;
  }

  response.answer = String(formData.get("answer") ?? "").trim();
  return response;
}

/**
 * Validate response before submission
 */
function validateResponse(response) {
  const responseModel = appState.currentChallenge?.response;

  if (!responseModel) {
    return null;
  }

  if (responseModel.type === "mixed") {
    for (const field of responseModel.fields) {
      const value = String(response[field.id] ?? "").trim();

      if (field.required && !value) {
        return `Preencha o campo: ${escapeHtml(field.label)}`;
      }

      if (field.min_length && value.length < field.min_length) {
        return `${escapeHtml(field.label)}: escreva pelo menos ${field.min_length} caracteres`;
      }
    }

    return null;
  }

  const value = String(response.answer ?? "").trim();

  if (responseModel.required && !value) {
    return "Escreva sua resposta.";
  }

  if (responseModel.min_length && value.length < responseModel.min_length) {
    return `Escreva uma resposta um pouco mais longa (mínimo ${responseModel.min_length} caracteres).`;
  }

  return null;
}

/**
 * Display feedback from backend
 */
function displayFeedback() {
  if (!appState.feedback) {
    return;
  }

  const feedback = appState.feedback;
  let statusHtml = "";

  if (feedback.status) {
    const statusClass = feedback.status === "correct" ? "answer-correct" : "answer-incorrect";
    statusHtml = `
      <div class="answer-status ${statusClass}">
        <p class="answer-status-label">
          ${feedback.status === "correct" ? "Resposta correta" : "Resposta incorreta"}
        </p>
      </div>
    `;
  }

  feedbackEl.classList.remove("hidden");
  feedbackEl.innerHTML = `
    <h2>Feedback</h2>
    ${statusHtml}
    <p>${escapeHtml(feedback.content ?? "")}</p>
  `;

  feedbackEl.scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * Handle form submission
 */
async function handleSubmit() {
  clearFormMessage();

  // Check student selected
  const studentName = studentInput.value.trim();
  if (!appState.selectedStudentId && !studentName) {
    setFormMessage("Escolha ou digite seu nome.", "error");
    return;
  }

  // Collect and validate response
  const response = collectResponse();
  const validationMessage = validateResponse(response);

  if (validationMessage) {
    setFormMessage(validationMessage, "error");
    return;
  }

  // Submit
  appState.submissionInProgress = true;
  showLoading();

  try {
    const submissionPayload = {
      studentId: appState.selectedStudentId,
      studentName: studentName,
      challengeId: appState.currentChallenge.id,
      response: response
    };

    console.log("Submitting response:", submissionPayload);

    const result = await fetchJson("/submitResponse", {
      method: "POST",
      body: submissionPayload
    });

    appState.feedback = result.feedback || result;
    clearFormMessage();
    displayFeedback();

    // Disable form after submission
    responseForm.querySelectorAll("input, textarea, select").forEach(el => el.disabled = true);
    submitButton.disabled = true;

  } catch (error) {
    console.error("Submission error:", error);
    setFormMessage(`Erro ao enviar: ${error.message}. Tente novamente.`, "error");
  } finally {
    appState.submissionInProgress = false;
    hideLoading();
  }
}

/**
 * Initialize app on page load
 */
async function initializeApp() {
  showLoading();

  try {
    // Load config
    console.log("Loading config...");
    const config = await fetchJson("/getConfig");
    appState.config = config;
    console.log("Config loaded:", config);

    // Load students
    console.log("Loading students...");
    const studentsData = await fetchJson("/getStudents");
    appState.students = studentsData.students || studentsData || [];
    console.log("Students loaded:", appState.students);

    // Load active challenge
    console.log("Loading active challenge...");
    const challengeData = await fetchJson("/getActiveChallenge");
    appState.currentChallenge = challengeData.challenge || challengeData;
    console.log("Challenge loaded:", appState.currentChallenge);

    // Render UI
    renderChallenge();
    renderResponseForm();

    // Update student input hint
    if (appState.students.length === 0) {
      studentStatus.textContent = "Nenhuma lista de estudantes disponível. Digite seu nome.";
    } else {
      studentStatus.textContent = appState.config?.allow_manual_name
        ? "Selecione um estudante ou digite seu nome."
        : "Selecione seu nome na lista.";
    }

    clearFormMessage();

  } catch (error) {
    console.error("Initialization error:", error);
    setFormMessage(`Erro ao carregar: ${error.message}. Verifique a conexão com o backend.`, "error");
    challengeEl.innerHTML = `<p class="error">Não foi possível carregar o desafio.</p>`;
  } finally {
    hideLoading();
  }
}

// Event listeners
studentInput.addEventListener("input", handleStudentInput);
studentInput.addEventListener("blur", () => {
  setTimeout(() => {
    suggestionsEl.classList.add("hidden");
  }, 200);
});

suggestionsEl.addEventListener("click", (e) => {
  const button = e.target.closest("button");
  if (button) {
    const studentId = button.dataset.studentId;
    const student = appState.students.find(s => (s.student_id || s.id) === studentId);
    if (student) {
      selectStudent(student);
    }
  }
});

submitButton.addEventListener("click", handleSubmit);

// Initialize on page load
window.addEventListener("load", initializeApp);

/**
 * Add retry button to error messages
 */
function addRetryButton(retryFn) {
  const existingButton = formMessageEl.querySelector("button");
  if (existingButton) existingButton.remove();
  
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "Tentar novamente";
  button.style.cssText = `
    margin-top: 8px;
    padding: 8px 14px;
    background: var(--red);
    color: var(--cream);
    border: 2px solid var(--black);
    border-radius: 6px;
    cursor: pointer;
    font-weight: 700;
    font-size: 0.9rem;
  `;
  button.addEventListener("click", () => {
    clearFormMessage();
    retryFn();
  });
  
  formMessageEl.appendChild(button);
}

/**
 * Enhanced error handler with retry capability
 */
async function handleInitializationError(error, retryFn) {
  console.error("Initialization error:", error);
  setFormMessage(`Erro ao carregar: ${error.message}`, "error");
  addRetryButton(retryFn);
  challengeEl.innerHTML = `<p class="error">Não foi possível carregar o desafio. Verifique a conexão com o backend.</p>`;
}

/**
 * Check if backend is available
 */
async function isBackendAvailable() {
  try {
    const response = await fetch(`${getBackendUrl()}/getConfig`, { 
      method: 'HEAD',
      mode: 'cors'
    }).catch(() => false);
    return response !== false;
  } catch {
    return false;
  }
}

// Store original initialize function
const originalInitializeApp = initializeApp;

// Enhance initializeApp with retry capability
window.initializeApp = async function() {
  await originalInitializeApp();
};
