---
title: 'Challenge of the Day App — First Version'
type: 'feature'
created: '2026-06-13'
status: 'done'
baseline_commit: '0a82ac96f93f675c747ca2febed04dc93f11e4fb'
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Programming Paradigms students lack a structured daily activity to apply paradigm concepts outside lectures. The instructor needs a no-cost, easy-to-maintain system for delivering configurable daily challenges and collecting responses.

**Approach:** Build a static frontend (HTML/CSS/JS) hosted on GitHub Pages, backed by Google Apps Script + Google Sheets. Students identify via an autocomplete widget, answer the daily challenge rendered from JSON, and receive automatic rule-based feedback without a paid API.

## Boundaries & Constraints

**Always:**
- Frontend must be pure static HTML/CSS/JS — no build step or framework
- Backend must be Google Apps Script + Google Sheets
- Student identity via lightweight autocomplete from backend list, not authentication
- Challenges represented as structured JSON with typed blocks
- All feedback must be rule-based or key-based — no LLM API calls
- Backend must validate all submitted data before writing
- Frontend must handle malformed JSON gracefully with error messages
- Mobile + desktop responsive
- No hosting budget — frontend on GitHub Pages

**Ask First:**
- Adding any frontend library or framework
- Switching deployment target from GitHub Pages
- Adding any paid or API-key-dependent service

**Never:**
- User login, passwords, or authentication
- Instructor web dashboard (v1)
- Executing submitted code
- File uploads
- LLM-based feedback
- Rankings, scores, or gamification
- Integration with external systems (Moodle, etc.)

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Happy path — challenge available | Valid challenge JSON for today from backend | Renders intro blocks, prompt blocks, response form. On submit: validates, POSTs to backend, shows feedback and after-submission blocks | N/A |
| No challenge today | Backend returns null/empty for today | Shows "No challenge available today" message | N/A |
| Student list load failure | Network error or bad response | Shows error message, blocks submission until list loads | In-app error banner |
| Malformed challenge JSON | Non-JSON or missing required fields | Shows "Could not load challenge" with details | Graceful error message, no crash |
| Student not selected (manual off) | Empty name, no suggestion selected | Validation blocks submission: "Please select your name from the list" | Inline validation |
| Student name not in list (manual on) | Typed name not matching any student | Submits with student_source="manual", student_id empty | N/A |
| Required field empty | User skips required response field | Submission blocked with field-level message | Inline per-field validation |
| Min length not met | Text shorter than configured min_length | Submission blocked with length hint | Inline per-field validation |
| Invalid backend payload | Missing fields or bad types | Backend returns 400, row not written | Frontend shows generic error |
| Duplicate submit click | User clicks submit during in-flight request | Button disabled during request | N/A |

</frozen-after-approval>

## Code Map

- `frontend/index.html` — Main HTML page with embedded app shell
- `frontend/css/style.css` — Responsive styling
- `frontend/js/app.js` — App bootstrap, load sequence, submission orchestration
- `frontend/js/api.js` — Backend API (fetch challenge, student list, config, submit response)
- `frontend/js/challenge-renderer.js` — Render challenge blocks from JSON (markdown, code, image, callout)
- `frontend/js/response-renderer.js` — Render response form fields (open_text, single_choice, code, mixed)
- `frontend/js/feedback-renderer.js` — Render feedback after submission (static, answer-key, rule-based, hybrid)
- `frontend/js/student-selector.js` — Autocomplete widget with case-insensitive filtering
- `backend/Code.gs` — Google Apps Script: doGet (read), doPost (write), validation logic
- `backend/appsscript.json` — Apps Script manifest

## Tasks & Acceptance

**Execution:**
- [x] `backend/appsscript.json` — Create Apps Script manifest with project metadata
- [x] `backend/Code.gs` — Implement doGet (serve challenge, student list, config) and doPost (validate + log response to Responses sheet)
- [x] `frontend/index.html` — Create HTML shell with meta viewport, script/style links, and app container
- [x] `frontend/css/style.css` — Implement responsive layout, card-based challenge display, autocomplete styling
- [x] `frontend/js/api.js` — Implement fetchChallenge(), fetchStudents(), fetchConfig(), submitResponse()
- [x] `frontend/js/student-selector.js` — Implement autocomplete with filtering, selection, manual entry support
- [x] `frontend/js/challenge-renderer.js` — Implement renderBlocks(blocks, container) supporting markdown/code/image/callout types
- [x] `frontend/js/response-renderer.js` — Implement renderResponse(responseModel, form) supporting open_text/single_choice/code/mixed
- [x] `frontend/js/feedback-renderer.js` — Implement renderFeedback(feedback, answers) supporting static/key-based/rule-based/hybrid
- [x] `frontend/js/app.js` — Implement load sequence (config → students → challenge), submission flow, validation, feedback display

**Acceptance Criteria:**
- Given a valid challenge JSON exists for today, when a student opens the app, then the challenge renders correctly with all block types
- Given the student list loads successfully, when the user types in the name field, then matching names appear in a filtered list
- Given the user selects a known student and completes all required fields, when they submit, then the response is POSTed to backend and feedback is shown
- Given no challenge is configured for today, when the app loads, then "No challenge available" is displayed
- Given the backend receives an invalid payload, then it rejects with 400 and writes no row
- Given the frontend receives malformed challenge JSON, then a useful error message is shown

## Spec Change Log


## Verification

**Commands:**
- No build or test commands for static frontend — manual inspection in browser

**Manual checks:**
- Open frontend/index.html in browser, verify app shell renders
- Verify student autocomplete filters as user types
- Verify challenge blocks render for each type (markdown, code, image, callout)
- Verify response fields render for each type (open_text, single_choice, code, mixed)
- Verify feedback renders correctly for each mode
- Verify error states (no challenge, bad JSON, no students)

## Suggested Review Order

**Orchestration & data flow**

- Entry point driving the full load-submit-feedback cycle
  [`app.js:54`](../../frontend/js/app.js#L54)

- App startup, config detection, and deployment guard
  [`app.js:4`](../../frontend/js/app.js#L4)

- API communication layer with timeout and error handling
  [`api.js:6`](../../frontend/js/api.js#L6)

**Backend (Google Apps Script)**

- GET endpoints serving config, students, and today's challenge
  [`Code.gs:1`](../../backend/Code.gs#L1)

- POST handler validating and writing submissions
  [`Code.gs:15`](../../backend/Code.gs#L15)

- Submission validation against required fields
  [`Code.gs:117`](../../backend/Code.gs#L117)

- Sheet queries for active students and challenges
  [`Code.gs:82`](../../backend/Code.gs#L82)

**Student identification**

- Autocomplete with case-insensitive in-browser filtering
  [`student-selector.js:26`](../../frontend/js/student-selector.js#L26)

- Selection tracking and manual entry support
  [`student-selector.js:109`](../../frontend/js/student-selector.js#L109)

**Challenge & response rendering**

- Block renderer for markdown, code, image, and callout types
  [`challenge-renderer.js:11`](../../frontend/js/challenge-renderer.js#L11)

- Basic inline markdown to HTML conversion
  [`challenge-renderer.js:31`](../../frontend/js/challenge-renderer.js#L31)

- Response form builder for open_text, single_choice, code, mixed
  [`response-renderer.js:19`](../../frontend/js/response-renderer.js#L19)

- Client-side field validation (required, min length)
  [`response-renderer.js:92`](../../frontend/js/response-renderer.js#L92)

**Feedback system**

- Feedback dispatcher supporting four modes
  [`feedback-renderer.js:2`](../../frontend/js/feedback-renderer.js#L2)

- Answer-key comparison and rule-based condition checking
  [`feedback-renderer.js:32`](../../frontend/js/feedback-renderer.js#L32)

**Presentation layer**

- HTML app shell with all section containers
  [`index.html:1`](../../frontend/index.html#L1)

- Responsive CSS with autocomplete, challenge block, and feedback styling
  [`style.css:1`](../../frontend/css/style.css#L1)
