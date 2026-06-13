# Feature Description: Challenge of the Day App for Programming Paradigms

This file is the source description for the initial Spec Kit specification.

The goal is to describe what the app should do and why, not to provide an implementation plan.

Create a specification for a greenfield web app called Challenge of the Day App for Programming Paradigms.

The app is intended for students in a Programming Paradigms course. Its purpose is to encourage students to think about programming paradigms outside class through a daily learning challenge.

The app should present one configurable challenge per day. A challenge is not just plain text. It must be represented as structured JSON so that the instructor can define diverse activities, including text explanations, code snippets, images, multiple-choice questions, open-ended explanations, code responses, feedback shown before submission, and feedback/explanations shown after submission.

The system architecture must respect a no-hosting-budget constraint:
- frontend hosted on a free static hosting alternative, preferably GitHub Pages;
- backend implemented with Google Apps Script;
- data stored in Google Sheets.

Main users:
- Students use the web app.
- Instructors configure challenges and inspect responses directly in Google Sheets.
- There is no instructor web dashboard in the first version.

Student list and student identification:
- The list of students must be loaded from the Google Sheets backend.
- The expected list size is small, no more than about 40 students.
- The frontend must use a searchable autocomplete-style widget for student selection.
- When the student starts typing, the widget dynamically filters the full list of names in the browser.
- Matching names are shown as selectable suggestions.
- The student can select one of the names from the list.
- Optionally, if the typed name does not match an existing student, the app may allow the user to submit the typed name as an unlisted participant.
- Manual entry of unlisted names must be controlled by backend configuration.
- The app must clearly distinguish between a known student selected from the backend list and a manually entered name not found in the list.
- When logging a response, the backend must store student_id if the selected student exists, student_display_name, and student_source as either "listed" or "manual".
- A dropdown alone must not be treated as authentication. This app uses lightweight identification, not secure login.

Core behavior:
1. The app loads the current daily challenge from a Google Apps Script endpoint backed by Google Sheets.
2. The app loads the active student list from the Google Apps Script backend.
3. The app loads basic app configuration from the backend, including whether manual names are allowed.
4. The challenge is represented as JSON.
5. The frontend renders the challenge dynamically from the JSON representation.
6. Supported prompt blocks in the first version should include markdown/text, code snippets, images, and callouts.
7. Supported response types in the first version should include open text, single choice with explanation, code response, and mixed response fields.
8. The student selects their name through the autocomplete widget or manually enters a name if manual entry is enabled.
9. The student submits their response.
10. The backend logs timestamp, selected student information, challenge id, challenge version, response JSON, and feedback JSON in Google Sheets.
11. The app provides automatic feedback after submission.
12. Feedback should support at least static feedback, answer-key feedback for choice questions, and simple rule-based feedback for open-text explanations.
13. The app should show optional after-submission explanation blocks, also represented in JSON.
14. The app should avoid duplicate accidental submissions when possible.

Instructor workflow:
- The instructor maintains the app through Google Sheets.
- The instructor configures challenges directly in the spreadsheet.
- The instructor manages the student list directly in the spreadsheet.
- The instructor inspects submitted responses directly in the spreadsheet.
- There is no instructor-facing web interface in the first version.

Suggested Google Sheets structure:

Students sheet:
- student_id
- display_name
- active

Challenges sheet:
- challenge_id
- date
- active
- title
- topics
- difficulty
- challenge_json

Responses sheet:
- timestamp
- challenge_id
- challenge_version
- student_id
- student_display_name
- student_source
- response_json
- feedback_json
- elapsed_seconds
- frontend_version

App configuration:
The backend should be able to expose simple configuration values, such as:
- course_name
- timezone
- allow_manual_name
- frontend_version
- challenge_selection_mode

Challenge selection:
- Each challenge must have a unique challenge_id.
- Each challenge must have a version.
- Each challenge may be associated with a date.
- The backend should return the active challenge for the current date.
- The app timezone should be configurable, defaulting to America/Sao_Paulo.
- If no challenge is available for the current date, the app should show a clear message saying that no challenge is available.
- The first version may assume one active challenge per day.

Challenge JSON model:
Each challenge JSON object should include:
- challenge_id
- version
- date
- active
- title
- topics
- difficulty
- intro blocks
- prompt blocks
- response model
- feedback model
- after_submission blocks
- logging options

Supported block types for the first version:
1. Markdown/text block:
   - type: "markdown"
   - content: string

2. Code block:
   - type: "code"
   - language: string
   - content: string

3. Image block:
   - type: "image"
   - url: string
   - alt: string
   - optional caption: string

4. Callout block:
   - type: "callout"
   - style: "tip", "warning", "note", or "reflection"
   - content: string

Supported response models for the first version:
1. Open text:
   - type: "open_text"
   - required: boolean
   - min_length: number
   - max_length: number
   - placeholder: string

2. Single choice with optional explanation:
   - type: "single_choice"
   - required: boolean
   - options: list of options with id and label
   - explanation: optional nested open-text field

3. Code response:
   - type: "code"
   - language: string
   - required: boolean
   - placeholder: string

4. Mixed response:
   - type: "mixed"
   - fields: list of fields
   - each field has id, type, label, required flag, and type-specific configuration

Supported feedback models for the first version:
1. Static feedback:
   - always shows a configured message after submission.

2. Answer-key feedback:
   - used for single-choice questions.
   - compares selected option with configured correct option or options.
   - shows a correct or incorrect feedback message.

3. Rule-based feedback:
   - used for open-text explanations.
   - checks simple conditions such as whether the answer contains any terms from a configured list.
   - shows feedback messages for matched rules.
   - shows a default message when no rule matches.

4. Hybrid feedback:
   - combines answer-key feedback for a selected option and rule-based feedback for an explanation field.

Feedback must not require a paid LLM API in the first version.

Example challenge JSON:

{
  "challenge_id": "paradigms-2026-001",
  "version": 1,
  "date": "2026-06-10",
  "active": true,
  "title": "Imperative clues in a small program",
  "topics": ["imperative programming", "functional programming", "state"],
  "difficulty": "introductory",

  "intro": [
    {
      "type": "markdown",
      "content": "Today we will compare signs of imperative and functional programming."
    }
  ],

  "prompt": [
    {
      "type": "markdown",
      "content": "Consider the following JavaScript fragment:"
    },
    {
      "type": "code",
      "language": "javascript",
      "content": "let total = 0;\\nfor (const x of numbers) {\\n  total += x;\\n}"
    },
    {
      "type": "markdown",
      "content": "Which programming paradigm is most visible in this fragment? Explain your reasoning using evidence from the code."
    }
  ],

  "response": {
    "type": "mixed",
    "fields": [
      {
        "id": "choice",
        "type": "single_choice",
        "label": "Which paradigm is most visible?",
        "required": true,
        "options": [
          { "id": "imperative", "label": "Imperative" },
          { "id": "functional", "label": "Functional" },
          { "id": "logic", "label": "Logic" },
          { "id": "object_oriented", "label": "Object-oriented" }
        ]
      },
      {
        "id": "explanation",
        "type": "open_text",
        "label": "Explain your reasoning",
        "required": true,
        "min_length": 30,
        "placeholder": "Mention concrete clues from the code..."
      }
    ]
  },

  "feedback": {
    "mode": "hybrid",
    "choice_feedback": {
      "field_id": "choice",
      "correct_options": ["imperative"],
      "messages": {
        "correct": "Correct. The fragment is mostly imperative because it uses mutable state and explicit iteration.",
        "incorrect": "Not quite. The strongest clues are the assignment to total and the explicit loop."
      }
    },
    "explanation_rules": [
      {
        "id": "mentions-state",
        "condition": {
          "type": "contains_any",
          "terms": ["state", "mutable", "mutation", "assignment", "variable"]
        },
        "message": "Good: your explanation mentions state, mutation, assignment, or variables."
      },
      {
        "id": "mentions-loop",
        "condition": {
          "type": "contains_any",
          "terms": ["loop", "iteration", "for", "step by step"]
        },
        "message": "Good: your explanation mentions explicit iteration."
      }
    ],
    "default_message": "A strong explanation should refer to mutable state and explicit iteration."
  },

  "after_submission": [
    {
      "type": "markdown",
      "content": "One possible interpretation is that the fragment is mostly imperative because it updates a variable step by step."
    },
    {
      "type": "code",
      "language": "javascript",
      "content": "const total = numbers.reduce((acc, x) => acc + x, 0);"
    },
    {
      "type": "markdown",
      "content": "The second version is closer to a functional style because it expresses the computation as a transformation instead of a sequence of mutations."
    }
  ],

  "logging": {
    "store_response": true,
    "store_feedback_given": true,
    "store_elapsed_time": true
  }
}

Student selection behavior:
- The frontend loads the complete list of active students once when the page opens.
- Because the list is small, filtering should happen entirely in the browser.
- Matching should be case-insensitive.
- The autocomplete should display matching names as the user types.
- Selecting a suggestion stores the associated student_id internally.
- If the user edits the text after selecting a suggestion, the selected student_id should be cleared unless the typed text still exactly matches the selected student display name.
- If manual name entry is enabled, a typed name without a matching student_id may be submitted.
- If manual name entry is disabled, submission requires selecting one of the listed students.

Submission behavior:
- The app must validate that a student name is selected or manually entered according to configuration.
- The app must validate that all required response fields are completed.
- The app must validate minimum length for open-text fields when configured.
- The app should disable the submit button while submission is in progress.
- The app should avoid duplicate accidental submissions.
- The backend must validate submitted data before writing to the spreadsheet.
- The backend must reject malformed payloads.
- The backend must not trust frontend validation alone.

Out of scope for the first version:
- user login or institutional authentication;
- password-protected student access;
- instructor admin dashboard;
- automatic grading for complex code;
- executing submitted code;
- LLM-based feedback;
- ranking, scores, or gamification;
- file uploads;
- paid hosting;
- complex database;
- integration with Moodle or institutional systems;
- push notifications;
- multi-course management;
- advanced analytics dashboard.

Non-functional constraints:
- The app should be simple enough to deploy and maintain by an instructor.
- The frontend should be static HTML, CSS, and JavaScript unless the planning step identifies a strong reason for a framework.
- The backend should use Google Apps Script and Google Sheets.
- The design should work reasonably well on mobile and desktop browsers.
- The app should be usable by a small class.
- The app should minimize collection of personal data.
- The app should avoid exposing private spreadsheet data publicly.
- The app should not expose instructor notes or answer keys before submission.
- The Google Apps Script endpoint should validate submitted data before writing to the sheet.
- The frontend should handle malformed challenge JSON gracefully and show a useful error message.
- The system should be designed for small-class use, not high-traffic public use.

Acceptance criteria:
1. Given a valid challenge JSON exists for today, when a student opens the app, then the app renders the challenge blocks correctly.
2. Given the challenge contains a markdown block, when the app renders it, then the markdown/text content is displayed clearly.
3. Given the challenge contains a code block, when the app renders it, then the code is displayed in a readable preformatted style with its language label.
4. Given the challenge contains an image block, when the app renders it, then the image is displayed with alt text.
5. Given the Students sheet contains active students, when the app loads, then the frontend loads the student list from the backend.
6. Given the student list has no more than about 40 names, when the user starts typing in the student field, then the app filters the full list dynamically and shows matching names.
7. Given the user selects a name from the filtered suggestions, when the response is submitted, then the backend logs the corresponding student_id, display name, and student_source as "listed".
8. Given the user types a name that is not in the list and manual names are allowed, when the response is submitted, then the backend logs the typed name with student_id empty and student_source as "manual".
9. Given the user types a name that is not in the list and manual names are disabled, when the response is submitted, then the app prevents submission and asks the user to select a listed student.
10. Given the student list cannot be loaded, when the app opens, then the app shows a clear error message and does not allow submission until a name can be selected or entered according to configuration.
11. Given the challenge defines a single-choice response with explanation, when the student answers, then both the selected option and explanation are stored.
12. Given the challenge defines an open-text response, when the student submits a non-empty answer, then the response is stored as JSON.
13. Given the challenge defines a code response, when the student submits code text, then the code response is stored as JSON without executing it.
14. Given feedback is configured as answer-key feedback, when the student submits, then the app shows the corresponding correct or incorrect feedback message.
15. Given feedback is configured as rule-based feedback, when the student submits, then the app shows messages for matched rules and a default message when no rule matches.
16. Given feedback is configured as hybrid feedback, when the student submits, then the app combines choice feedback and explanation feedback.
17. Given after-submission blocks are configured, when the student submits successfully, then the app displays those blocks.
18. Given no challenge is configured for today, when the app loads, then the app shows a clear message that no challenge is available.
19. Given the backend receives invalid or incomplete data, then it rejects the request and does not write a malformed row.
20. Given the frontend receives malformed challenge JSON, then it shows a useful error instead of crashing silently.
21. Given a submission is in progress, when the student clicks submit again, then duplicate accidental submissions are prevented.
22. Given the instructor opens the Responses sheet, then responses appear in chronological order with timestamp, challenge id, student information, response JSON, and feedback JSON.

Do not generate code yet. First produce the specification and identify unclear assumptions or decisions that should be reviewed before implementation.