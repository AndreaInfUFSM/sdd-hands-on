import { mockBootstrap } from "../shared/mock-data.js";

const state = {
  selectedStudent: null,
  typedName: "",
  response: {}
};

const studentInput = document.querySelector("#student-input");
const suggestionsEl = document.querySelector("#student-suggestions");
const studentStatus = document.querySelector("#student-status");
const challengeEl = document.querySelector("#challenge");
const responseForm = document.querySelector("#response-form");
const submitButton = document.querySelector("#submit-button");
const feedbackEl = document.querySelector("#feedback");

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

  return `<p class="error">Unsupported block type: ${escapeHtml(block.type)}</p>`;
}

function renderChallenge() {
  const challenge = mockBootstrap.challenge;

  challengeEl.innerHTML = `
    <div class="challenge-header">
      <p class="daily-label">Today's challenge</p>
      <h2>${escapeHtml(challenge.title)}</h2>
      <div class="tags">
        ${challenge.topics.map(topic => `<span>${escapeHtml(topic)}</span>`).join("")}
        <span>${escapeHtml(challenge.difficulty)}</span>
      </div>
    </div>

    <div class="challenge-body">
      ${challenge.intro.map(renderBlock).join("")}
      ${challenge.prompt.map(renderBlock).join("")}
    </div>
  `;
}

function renderResponseForm() {
  const fields = mockBootstrap.challenge.response.fields;

  responseForm.innerHTML = fields.map(field => {
    if (field.type === "single_choice") {
      return `
        <fieldset class="field-group">
          <legend>${escapeHtml(field.label)}</legend>
          <div class="choice-grid">
            ${field.options.map(option => `
              <label class="choice-card">
                <input type="radio" name="${escapeHtml(field.id)}" value="${escapeHtml(option.id)}">
                <span>${escapeHtml(option.label)}</span>
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
            placeholder="${escapeHtml(field.placeholder)}"
          ></textarea>
        </label>
      `;
    }

    return `<p class="error">Unsupported response field: ${escapeHtml(field.type)}</p>`;
  }).join("");
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
    studentStatus.textContent = "This name is not in the list, but manual entry is allowed.";
  } else if (matches.length === 0) {
    studentStatus.textContent = "Choose a name from the list.";
  } else {
    studentStatus.textContent = "";
  }
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
  studentStatus.textContent = `Selected: ${student.display_name}`;
});

studentInput.addEventListener("input", updateSuggestions);

submitButton.addEventListener("click", () => {
  const formData = new FormData(responseForm);
  const choice = formData.get("choice");
  const explanation = String(formData.get("explanation") ?? "").trim();

  const typedName = studentInput.value.trim();

  if (!state.selectedStudent && !typedName) {
    alert("Choose or enter your name.");
    return;
  }

  if (!choice) {
    alert("Choose one option.");
    return;
  }

  if (explanation.length < 30) {
    alert("Write a slightly longer explanation. Yes, thinking is required. Tragic.");
    return;
  }

  feedbackEl.classList.remove("hidden");
  feedbackEl.innerHTML = `
    <h2>Feedback</h2>
    ${mockBootstrap.mockFeedback.messages.map(message => `
      <p>${escapeHtml(message)}</p>
    `).join("")}

    <div class="after-submission">
      ${mockBootstrap.mockFeedback.after_submission.map(renderBlock).join("")}
    </div>
  `;

  feedbackEl.scrollIntoView({ behavior: "smooth", block: "start" });
});

renderChallenge();
renderResponseForm();