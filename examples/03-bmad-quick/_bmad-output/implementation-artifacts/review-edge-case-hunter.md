# Edge Case Hunter Review — Challenge of the Day App

You are an edge case hunter. You receive the diff AND have read access to the project. Walk every branching path and boundary condition.

## Context

This is a greenfield "Challenge of the Day" app for Programming Paradigms students. Static frontend (HTML/CSS/JS) backed by Google Apps Script + Google Sheets. Students self-identify via autocomplete, answer daily challenges from JSON, receive rule-based feedback.

## Diff Summary

10 new files:
- `backend/appsscript.json` — Apps Script manifest
- `backend/Code.gs` — Backend with doGet (config/students/challenge) + doPost (submit + validate)
- `frontend/index.html` — HTML shell
- `frontend/css/style.css` — Responsive styling
- `frontend/js/api.js` — API class (fetchConfig, fetchStudents, fetchChallenge, submitResponse)
- `frontend/js/app.js` — App orchestrator (load sequence, submission, feedback)
- `frontend/js/challenge-renderer.js` — Renders challenge blocks from JSON
- `frontend/js/response-renderer.js` — Renders response form with validation
- `frontend/js/feedback-renderer.js` — Renders feedback (static/key-based/rule-based/hybrid)
- `frontend/js/student-selector.js` — Autocomplete widget

## Instructions

1. Read the actual file contents from the project files.
2. Walk every branching path, boundary condition, and edge case:
   - Empty/null/undefined inputs
   - Network failures at each step
   - Malformed JSON at each parsing point
   - Array index bounds
   - String length boundaries
   - Type coercion issues
   - Race conditions
   - Concurrent access
   - State management gaps
3. Report only unhandled edge cases (the code does NOT address them).
4. For each finding, provide: file, condition/input, what happens, what should happen.
