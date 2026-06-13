# Blind Hunter Review — Challenge of the Day App

You are a blind hunter reviewer. You receive ONLY the diff below — no spec, no project context, no access to other files. Review the code changes adversarially.

## Diff (new implementation, greenfield project)

```
=== frontend/index.html ===
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Challenge of the Day</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <div id="app">
    <header id="app-header">
      <h1 id="course-name">Challenge of the Day</h1>
    </header>
    <main>
      <div id="loading-indicator" class="loading">Loading...</div>
      <div id="error-message" class="error hidden" role="alert"></div>
      <div id="no-challenge" class="empty-state hidden">
        <p>No challenge is available for today.</p>
      </div>
      <div id="challenge-container" class="hidden">
        <div id="student-section">
          <label for="student-input">Your name</label>
          <div id="student-selector" class="autocomplete">
            <input type="text" id="student-input" placeholder="Start typing your name..." autocomplete="off">
            <ul id="student-suggestions" class="suggestions hidden"></ul>
          </div>
          <div id="student-status" class="field-status hidden"></div>
        </div>
        <div id="challenge-content">
          <div id="intro-blocks"></div>
          <div id="prompt-blocks"></div>
          <form id="response-form" novalidate>
            <div id="response-fields"></div>
            <button type="submit" id="submit-btn" disabled>Submit</button>
          </form>
        </div>
      </div>
      <div id="feedback-container" class="hidden">
        <div id="feedback-content"></div>
        <div id="after-submission-blocks"></div>
      </div>
    </main>
    <footer>
      <p id="frontend-version"></p>
    </footer>
  </div>
  <script src="js/api.js"></script>
  <script src="js/student-selector.js"></script>
  <script src="js/challenge-renderer.js"></script>
  <script src="js/response-renderer.js"></script>
  <script src="js/feedback-renderer.js"></script>
  <script src="js/app.js"></script>
</body>
</html>

=== frontend/js/api.js ===
class Api {
  constructor(baseUrl) { this.baseUrl = baseUrl; }
  async fetchConfig() {
    const url = this.baseUrl + '?action=config';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to load configuration');
    return res.json();
  }
  async fetchStudents() {
    const url = this.baseUrl + '?action=students';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to load student list');
    return res.json();
  }
  async fetchChallenge() {
    const url = this.baseUrl + '?action=challenge';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to load challenge');
    return res.json();
  }
  async submitResponse(payload) {
    const res = await fetch(this.baseUrl, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Submission failed');
    return data;
  }
}

=== frontend/js/student-selector.js ===
class StudentSelector { ... } // Autocomplete widget, case-insensitive filtering, manual name entry support

=== frontend/js/challenge-renderer.js ===
class ChallengeRenderer { ... } // Renders markdown, code, image, callout blocks from JSON

=== frontend/js/response-renderer.js ===
class ResponseRenderer { ... } // Renders open_text, single_choice, code, mixed response form fields with validation

=== frontend/js/feedback-renderer.js ===
class FeedbackRenderer { ... } // Renders static, answer_key, rule_based, hybrid feedback modes

=== frontend/js/app.js ===
IIFE that orchestrates load sequence (config -> students -> challenge), submission with validation, feedback display. Uses BACKEND_URL_PLACEHOLDER as API base.

=== backend/Code.gs ===
Google Apps Script backend with doGet (config/students/challenge) and doPost (validate + write to Responses sheet). Supports AppConfig, Students, Challenges, and Responses sheets.

=== backend/appsscript.json ===
Standard Apps Script manifest.
```

## Instructions

1. Review the code adversarially. Find bugs, security issues, design flaws, and correctness problems.
2. Only report findings that are likely real defects — not style preferences or hypotheticals.
3. For each finding, classify it as: `bug` (will cause incorrect behavior), `security` (data exposure, injection), `design` (structural problem), or `clarity` (misleading code).
4. Provide file:line references.
