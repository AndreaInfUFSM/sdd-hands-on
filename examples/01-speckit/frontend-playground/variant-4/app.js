import { mockBootstrap } from "../shared/mock-data.js";
import { challengeFixtures } from "../shared/challenge-fixtures.js";

const state = {
  selectedStudent: null,
  typedName: "",
  response: {},
  currentFixture: challengeFixtures[0]
};

const challengeSelector = document.querySelector("#challenge-selector");
const studentInput = document.querySelector("#student-input");
const suggestionsEl = document.querySelector("#student-suggestions");
const studentStatus = document.querySelector("#student-status");
const challengeEl = document.querySelector("#challenge");
const responseForm = document.querySelector("#response-form");
const submitButton = document.querySelector("#submit-button");
const feedbackEl = document.querySelector("#feedback");
const formMessageEl = document.querySelector("#form-message");

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

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

function renderChallenge() {
  const challenge = state.currentFixture.challenge;

  challengeEl.innerHTML = `
    <div class="challenge-header">
      <p class="daily-label">Desafio do dia</p>
      <h2>${escapeHtml(challenge.title)}</h2>
      <div class="tags">
        ${challenge.topics.map(topic => `<span>${escapeHtml(topic)}</span>`).join("")}
        <span>${escapeHtml(challenge.difficulty)}</span>
      </div>
    </div>

    <div class="challenge-body">
      ${(challenge.intro ?? []).map(renderBlock).join("")}
      ${(challenge.prompt ?? []).map(renderBlock).join("")}
    </div>
  `;
}

function renderResponseField(field) {
  if (field.type === "single_choice") {
    return `
      <fieldset class="field-group">
        <legend>${escapeHtml(field.label)}</legend>
        <div class="choice-grid">
          ${field.options.map(option => `
            <label class="choice-card">
              <input type="radio" name="${escapeHtml(field.id)}" value="${escapeHtml(option.id)}">
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
        ></textarea>
      </label>
    `;
  }

  return `<p class="error">Campo de resposta não suportado: ${escapeHtml(field.type)}</p>`;
}

function renderResponseForm() {
  const response = state.currentFixture.challenge.response;

  if (!response) {
    responseForm.innerHTML = `<p class="error">Este desafio não tem um modelo de resposta.</p>`;
    return;
  }

  if (response.type === "mixed") {
    responseForm.innerHTML = response.fields.map(renderResponseField).join("");
    return;
  }

  if (response.type === "open_text" || response.type === "code") {
    responseForm.innerHTML = renderResponseField({
      id: "answer",
      label: response.label ?? "Sua resposta",
      ...response
    });
    return;
  }

  responseForm.innerHTML = `<p class="error">Tipo de resposta não suportado: ${escapeHtml(response.type)}</p>`;
}

function renderChallengeSelector() {
  challengeSelector.innerHTML = challengeFixtures.map(fixture => `
    <option value="${escapeHtml(fixture.id)}">
      ${escapeHtml(fixture.label)}
    </option>
  `).join("");

  challengeSelector.value = state.currentFixture.id;
}

function resetFeedback() {
  feedbackEl.classList.add("hidden");
  feedbackEl.innerHTML = "";
}

function resetResponseState() {
  responseForm.reset();
  resetFeedback();
  clearFormMessage();
}

function showFormMessage(message, type = "error") {
  formMessageEl.className = `form-message form-message-${type}`;
  formMessageEl.textContent = message;
}

function clearFormMessage() {
  formMessageEl.classList.add("hidden");
  formMessageEl.textContent = "";
}

function updateCurrentFixture(fixtureId) {
  const fixture = challengeFixtures.find(item => item.id === fixtureId);

  if (!fixture) {
    console.warn(`Fixture not found: ${fixtureId}`);
    return;
  }

  state.currentFixture = fixture;
  renderChallenge();
  renderResponseForm();
  resetFeedback();
}

function updateSuggestions() {
  const query = studentInput.value.trim().toLowerCase();
  state.typedName = studentInput.value;
  state.selectedStudent = null;

  if (!query) {
    suggestionsEl.innerHTML = "";
    studentStatus.textContent = "";
    return;
  }

  const matches = mockBootstrap.students.filter(student =>
    student.display_name.toLowerCase().includes(query)
  );

  suggestionsEl.innerHTML = matches.map(student => `
    <li>
      <button type="button" data-student-id="${escapeHtml(student.student_id)}">
        ${escapeHtml(student.display_name)}
      </button>
    </li>
  `).join("");

  if (matches.length === 0 && mockBootstrap.app.allow_manual_name) {
    studentStatus.textContent = "Este nome não está na lista, mas a digitação manual é permitida.";
  } else if (matches.length === 0) {
    studentStatus.textContent = "Escolha um nome da lista.";
  } else {
    studentStatus.textContent = "";
  }
}

function collectResponse() {
  const formData = new FormData(responseForm);
  const response = {};
  const responseModel = state.currentFixture.challenge.response;

  if (responseModel.type === "mixed") {
    for (const field of responseModel.fields) {
      response[field.id] = String(formData.get(field.id) ?? "").trim();
    }

    return response;
  }

  response.answer = String(formData.get("answer") ?? "").trim();
  return response;
}

function validateResponse(response) {
  const responseModel = state.currentFixture.challenge.response;

  if (responseModel.type === "mixed") {
    for (const field of responseModel.fields) {
      const value = String(response[field.id] ?? "").trim();

      if (field.required && !value) {
        return `Preencha o campo: ${field.label}`;
      }

      if (field.min_length && value.length < field.min_length) {
        return `Escreva uma resposta mais longa para: ${field.label}`;
      }
    }

    return null;
  }

  const value = String(response.answer ?? "").trim();

  if (responseModel.required && !value) {
    return "Escreva sua resposta.";
  }

  if (responseModel.min_length && value.length < responseModel.min_length) {
    return "Escreva uma resposta um pouco mais longa.";
  }

  return null;
}

suggestionsEl.addEventListener("click", event => {
  const button = event.target.closest("button[data-student-id]");
  if (!button) return;

  const student = mockBootstrap.students.find(
    item => item.student_id === button.dataset.studentId
  );

  if (!student) return;

  state.selectedStudent = student;
  state.typedName = student.display_name;
  studentInput.value = student.display_name;
  suggestionsEl.innerHTML = "";
  studentStatus.textContent = `Selecionado: ${student.display_name}`;
});

// studentInput.addEventListener("input", updateSuggestions);

studentInput.addEventListener("input", () => {
  clearFormMessage();
  updateSuggestions();
});

challengeSelector.addEventListener("change", event => {
  updateCurrentFixture(event.target.value);
  resetResponseState();
});

submitButton.addEventListener("click", () => {
  const typedName = studentInput.value.trim();

  if (!state.selectedStudent && !typedName) {
    showFormMessage("Escolha ou digite seu nome.");
    return;
  }

  const response = collectResponse();
  const validationMessage = validateResponse(response);

  if (validationMessage) {
    showFormMessage(validationMessage);
    return;
  }

  clearFormMessage();

  const responseModel = state.currentFixture.challenge.response;
  const feedback = state.currentFixture.feedback;

  let answerStatusHtml = "";

  if (responseModel.type === "mixed") {
    const singleChoiceField = responseModel.fields.find(
      field => field.type === "single_choice"
    );

    if (singleChoiceField?.correct_option_id) {
      const selectedOptionId = response[singleChoiceField.id];
      const selectedOption = singleChoiceField.options.find(
        option => option.id === selectedOptionId
      );

      const isCorrect = selectedOptionId === singleChoiceField.correct_option_id;

      answerStatusHtml = `
        <div class="answer-status ${isCorrect ? "answer-correct" : "answer-incorrect"}">
          <p class="answer-status-label">
            ${isCorrect ? "Resposta correta" : "Resposta incorreta"}
          </p>
          <p>
            Você escolheu a opção 
            <strong>${escapeHtml(selectedOptionId).toUpperCase()}) ${escapeHtml(selectedOption?.label ?? "")}</strong>.
          </p>
        </div>
      `;
    }
  }

  feedbackEl.classList.remove("hidden");
  feedbackEl.innerHTML = `
    <h2>Feedback</h2>

    ${answerStatusHtml}

    ${(feedback.messages ?? []).map(message => `
      <p>${escapeHtml(message)}</p>
    `).join("")}

    <div class="after-submission">
      ${(feedback.after_submission ?? []).map(renderBlock).join("")}
    </div>
  `;

  feedbackEl.scrollIntoView({ behavior: "smooth", block: "start" });
});

renderChallengeSelector();
renderChallenge();
renderResponseForm();