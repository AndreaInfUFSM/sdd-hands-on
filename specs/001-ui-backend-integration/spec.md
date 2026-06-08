# Feature Specification: UI Backend Integration

**Feature Branch**: `001-ui-backend-integration`

**Created**: 2026-06-08

**Status**: Draft

**Input**: User description: "Create a feature specification for replacing the UI with the new architecture. Current state: Frontend-playground/variant-4-selector contains new UI architecture but uses hardcoded fixtures and test selector. Original frontend folder has the backend APIs we need to connect to. Fixtures should be repurposed as JSON schema examples. Required work: 1. Remove hardcoded fixtures from variant-4-selector, 2. Remove test selector code, 3. Connect the UI to actual backend APIs from the original frontend folder, 4. Use the existing fixtures as examples/documentation for the JSON schema describing challenges."

## Problem Statement

The application currently has two disconnected systems:

1. **New UI Architecture** (`frontend-playground/variant-4-selector`): A clean, modern component-based interface that renders challenges and collects student responses, but relies on hardcoded test data (fixtures) and includes developer testing features (test selector dropdown).

2. **Backend API Layer** (`frontend` folder): Functional backend with working endpoints for authentication, challenge retrieval, student management, and response submission, but not integrated with the new UI.

The challenge is to connect these systems while removing test-only code and establishing a clear contract between frontend and backend using the existing fixture data as schema documentation.

### Current Gaps

- **Hard-coded test data**: Test selector dropdown forces manual challenge selection instead of loading the active challenge from backend
- **No API integration**: UI doesn't call backend endpoints; fixtures are static instead of fetched
- **Unused backend**: Working APIs (getConfig, getStudents, getActiveChallenge, submitResponse) are not leveraged by the new UI
- **Implicit schemas**: Challenge structure exists in code but is not formally documented; fixtures serve as examples but not as schema definitions

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Student Submits Response to Active Challenge (Priority: P1)

A student arrives at the application, sees the challenge of the day (loaded from backend), fills out their response, and submits it. The system validates the response, sends it to the backend, receives feedback, and displays it to the student.

**Why this priority**: This is the core user journey and primary value of the application. Without this working, the application has no purpose.

**Independent Test**: Can be fully tested by loading the application, verifying the active challenge displays, filling out and submitting a response, and confirming feedback appears. Delivers the complete user workflow.

**Acceptance Scenarios**:

1. **Given** the app is loaded and backend is accessible, **When** the page renders, **Then** the active challenge loads from backend (no manual selector needed)
2. **Given** a challenge is displayed, **When** student fills in all required fields and clicks submit, **Then** a submission request is sent to the backend with the challenge_id, version, response_json, and student info
3. **Given** the backend returns a success response, **When** submission completes, **Then** feedback is displayed to the student showing results and explanations
4. **Given** the backend returns an error, **When** submission fails, **Then** an error message is shown and the form remains accessible for retry

---

### User Story 2 - Student Selects Identity from Student List (Priority: P1)

A student types their name in an autocomplete field and selects themselves from a list provided by the backend. The system records whether they selected a listed student or entered a manual name.

**Why this priority**: Student identification is critical for tracking responses and compliance. This integrates backend student data with the form submission.

**Independent Test**: Can be fully tested by typing a partial name, verifying suggestions appear from the backend student list, selecting one, and confirming the submission captures student_id with source='listed'.

**Acceptance Scenarios**:

1. **Given** the app loads and student list is fetched from backend, **When** student types in the name field, **Then** suggestions appear matching the typed query from the fetched student list
2. **Given** suggestions are visible, **When** student clicks a suggestion, **Then** the student_id is captured and source is set to 'listed'
3. **Given** no suggestions match and manual entry is allowed, **When** student enters a name and submits, **Then** student_id is empty and source is set to 'manual'
4. **Given** a student is selected, **When** the form is submitted, **Then** the student name and identification method are included in the backend submission

---

### User Story 3 - Configuration and Display Personalization (Priority: P2)

The system loads configuration from the backend (course name, timezone, feature flags like allow_manual_name) and personalizes the display accordingly. If configuration is missing, sensible defaults are used.

**Why this priority**: Ensures the application is configurable for different courses and deployments without code changes. Enables feature flags for A/B testing and gradual rollout.

**Independent Test**: Can be fully tested by mocking different config responses and verifying the UI displays the correct course name, respects feature flags, and shows appropriate error states when backend is unavailable.

**Acceptance Scenarios**:

1. **Given** the app loads, **When** configuration is fetched from backend, **Then** the course name, timezone, and feature flags are applied to the UI
2. **Given** the backend is unavailable, **When** the app loads, **Then** sensible defaults are applied and the user can still attempt to interact with the form
3. **Given** allow_manual_name is false, **When** no suggestion matches the typed name, **Then** an error message says "Choose a name from the list"
4. **Given** allow_manual_name is true, **When** no suggestion matches, **Then** a helper message says "This name is not on the list, but manual entry is allowed"

---

### User Story 4 - Challenge Schema Evolution and Examples (Priority: P2)

The system is designed to accept challenges with a defined schema. The current fixtures (Java reference questions, static attributes, etc.) serve as concrete examples of valid challenges, and new challenge types can be added without code changes to the rendering engine.

**Why this priority**: Ensures the system is extensible for new challenge types and maintains a contract between backend and frontend. Documented examples reduce ambiguity.

**Independent Test**: Can be fully tested by verifying that the rendering engine correctly handles all block types (markdown, code, question, callout, image) and response field types (single_choice, open_text, code) from the schema, and that new fixtures can be added without breaking existing rendering logic.

**Acceptance Scenarios**:

1. **Given** a challenge with markdown, code, and image blocks in the intro and prompt, **When** the challenge renders, **Then** all block types are displayed correctly with proper formatting and escaping
2. **Given** a response form with mixed field types (single_choice, open_text, code), **When** the form renders, **Then** each field type displays the correct UI (radio buttons, textarea, code editor) with labels and placeholders
3. **Given** a fixture is added with new block or field types, **When** the rendering engine encounters an unsupported type, **Then** a clear error message is shown instead of breaking the UI
4. **Given** feedback with static messages and after_submission blocks, **When** feedback is rendered, **Then** all feedback structures display correctly regardless of complexity

---

### Edge Cases

- What happens when the backend is slow or times out? System should show loading state and timeout gracefully after a reasonable wait
- What happens when a challenge has no response form or feedback? System should display appropriate message rather than blank section
- What happens when a student submits an invalid response (missing required fields)? System should validate client-side and show error without sending to backend
- What happens when response form has both single_choice and open_text fields but student only fills one? System should validate required fields and prevent submission until all required fields are filled
- What happens when a challenge contains code blocks with special characters or malformed HTML? System should escape all user-provided content to prevent XSS attacks

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST fetch application configuration (course name, timezone, feature flags) from `getConfig` endpoint on app load
- **FR-002**: System MUST fetch the list of students from `getStudents` endpoint on app load and use this list for name autocomplete suggestions
- **FR-003**: System MUST fetch the active challenge from `getActiveChallenge` endpoint on app load and display it to the user
- **FR-004**: System MUST remove the challenge selector dropdown (`#challenge-selector`) from the UI since the active challenge is loaded from backend
- **FR-005**: System MUST render challenges according to a defined schema supporting: intro and prompt blocks with types (markdown, code, question, callout, image), and response forms with field types (single_choice, open_text, code, mixed)
- **FR-006**: System MUST validate response fields before submission: required fields must have values, text fields must meet minimum length requirements, single_choice fields must have a selection
- **FR-007**: System MUST submit student responses to `submitResponse` endpoint with payload including: challenge_id, challenge_version, student_id (or empty if manual), student_display_name, student_source ('listed' or 'manual'), response_json, frontend_version, elapsed_seconds
- **FR-008**: System MUST display feedback to the student after successful submission, including answer status (correct/incorrect if applicable) and feedback messages
- **FR-009**: System MUST handle API errors gracefully: show error messages to user, log details for debugging, and keep form accessible for retry
- **FR-010**: System MUST HTML-escape all user-provided content (student names, responses, block content) to prevent XSS vulnerabilities
- **FR-011**: System MUST support configurable feature flags from backend config (allow_manual_name, challenge_selection_mode) and adapt UI behavior accordingly

### Key Entities *(include if feature involves data)*

- **Challenge**: Represents a coding or conceptual problem with title, topics, difficulty, intro/prompt blocks, response schema, and feedback. Uniquely identified by challenge_id and versioned.
- **Challenge Block**: Represents a content element (markdown text, code snippet, question, callout note, image) with type and content. Attributes vary by type (e.g., language for code, url/alt for image).
- **Response Field**: Represents an input control in the response form with id, type, label, and validation rules. Single_choice has options; open_text/code have placeholder and min_length; mixed response has array of fields.
- **Student**: Represents a learner with student_id, display_name, and optionally other profile data. Can be selected from backend list or entered manually.
- **Submission**: Represents a student's response to a challenge with student_id, student_display_name, student_source, challenge_id, response_json (flattened field values), elapsed_seconds, and feedback_json from backend.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Active challenge loads from backend within 2 seconds of page load; if slower, a loading indicator is shown
- **SC-002**: Student list fetches and provides autocomplete suggestions with less than 100ms delay per keystroke
- **SC-003**: All four challenge block types (markdown, code, question, callout, image) and three response field types (single_choice, open_text, code) render without errors using current and new fixtures
- **SC-004**: Submission to backend succeeds within 5 seconds under normal conditions; timeout is handled with user-friendly message
- **SC-005**: Challenge selector dropdown is completely removed; variant-4-selector app depends only on backend APIs, not hardcoded fixtures
- **SC-006**: All test-only code (hardcoded fixtures, test selector, mock data references) is removed from variant-4-selector
- **SC-007**: Feedback display shows correct/incorrect status and feedback messages accurately based on backend response
- **SC-008**: Student name autocomplete provides suggestions for partial matches from the backend student list with 95%+ accuracy
- **SC-009**: Manual name entry is allowed when configured and student can submit with manually-entered name

## Implementation Architecture

### API Integration Points

The application will integrate with these backend endpoints:

#### 1. `getConfig` (GET)
**Purpose**: Fetch application-level configuration  
**Request**: No body; action parameter in query string  
**Response Example**:
```json
{
  "course_name": "Programming Paradigms",
  "timezone": "America/Sao_Paulo",
  "allow_manual_name": true,
  "challenge_selection_mode": "date"
}
```
**Used for**: Personalizing UI, determining feature availability, setting timezone context  
**Error handling**: If fails, use hardcoded defaults; continue with app load  

#### 2. `getStudents` (GET)
**Purpose**: Fetch list of enrolled students for name autocomplete  
**Request**: No body; action parameter in query string  
**Response Example**:
```json
[
  { "student_id": "s001", "display_name": "Ana Silva" },
  { "student_id": "s002", "display_name": "Bruno Costa" }
]
```
**Used for**: Populating student suggestions, validating student selection, determining if name is from list  
**Error handling**: If fails, show error message; allow manual name entry if config permits  

#### 3. `getActiveChallenge` (GET)
**Purpose**: Fetch the challenge of the day (or current context-appropriate challenge)  
**Request**: No body; action parameter in query string  
**Response Example**:
```json
{
  "challenge": {
    "challenge_id": "java-oop-2026-001",
    "version": 1,
    "title": "Reference vs Object",
    "topics": ["Java", "OOP"],
    "difficulty": "introductory",
    "intro": [{ "type": "markdown", "content": "..." }],
    "prompt": [{ "type": "code", "language": "java", "content": "..." }],
    "response": {
      "type": "mixed",
      "fields": [...]
    },
    "feedback": { "messages": [...], "after_submission": [...] }
  }
}
```
**Used for**: Displaying the main challenge content to student  
**Error handling**: If fails, show error and prevent submission; offer retry  

#### 4. `submitResponse` (POST)
**Purpose**: Submit student's response and receive feedback  
**Request Body**:
```json
{
  "challenge_id": "java-oop-2026-001",
  "challenge_version": 1,
  "student_id": "s001",
  "student_display_name": "Ana Silva",
  "student_source": "listed",
  "response_json": {
    "choice": { "type": "single_choice", "value": "b" },
    "explanation": { "type": "open_text", "value": "..." }
  },
  "frontend_version": "1.0.0",
  "elapsed_seconds": 45
}
```
**Response Example**:
```json
{
  "success": true,
  "feedback_json": {
    "mode": "answer-key",
    "details": [...]
  }
}
```
**Used for**: Recording student submission and getting feedback  
**Error handling**: If fails, show error and offer retry; form remains populated  

### State Management Architecture

The application will maintain state for:
- **Config**: Application-level settings fetched once on load
- **Students**: List of available students fetched once on load
- **Current Challenge**: The active challenge loaded on app startup
- **Student Selection**: Which student is currently selected (from list or manual)
- **Form Values**: Current student response field values
- **Submission State**: Whether a submission is in progress; prevent double-submission
- **Feedback**: Rendered feedback after successful submission

### Error Handling Strategy

- **Network errors**: Show user-friendly message, log details, offer retry without clearing form
- **Validation errors**: Client-side validation prevents submission; error message indicates which field is invalid
- **Backend errors**: Display backend error message if available, suggest retry, optionally show support contact info
- **Timeouts**: If any endpoint takes >5 seconds, show timeout message and allow retry
- **Missing data**: If challenge has no response form, show "This challenge does not have a response form" message
- **HTML content**: All user-provided and backend-provided content must be HTML-escaped to prevent XSS

### Challenge Schema & Block Types

The system supports challenges with the following block types (supporting the schema of existing fixtures):

#### Block Types
- **markdown**: Rich text content; content is escaped and displayed as `<p>`
- **code**: Programming code with language syntax; language specified as attribute; content is escaped
- **question**: Labeled question within challenge context; displayed with "Your challenge" label
- **callout**: Highlighted note or tip; style attribute determines visual treatment (e.g., "reflection", "note")
- **image**: Visual content; url and alt attributes required; optional caption

#### Response Field Types
- **single_choice**: Multiple-choice with radio buttons; options array with id/label; can specify correct_option_id for answer key
- **open_text**: Free-form text response; textarea with optional min_length validation
- **code**: Code response; special textarea for programming input with optional language hint and min_length
- **mixed**: Multiple fields of different types in a single form

### Test Data as Schema Documentation

The existing fixture files (`challenge-fixtures.js` and `mock-data.js`) will be:
1. **Removed from variant-4-selector** as production dependency
2. **Preserved as example/documentation** to illustrate the challenge schema
3. **Converted to a separate examples directory** or documentation file for API contract reference

New fixtures can be added by following the existing structure; rendering engine should handle unknown types gracefully.

## Assumptions

- **Backend availability**: Backend endpoints are available and accessible from the browser (no CORS issues); if backend is unreachable, the application shows error but attempts graceful degradation
- **Challenge availability**: An active challenge is always available from getActiveChallenge endpoint; if not, the application shows appropriate message
- **Student list size**: The student list is reasonably sized (<1000 students) for browser memory and autocomplete performance
- **Data consistency**: Challenge data returned from backend matches the documented schema; rendering engine handles deviations gracefully
- **Timezone handling**: Backend provides timezone in config; frontend uses it for display but does not perform timezone conversions (backend handles time normalization)
- **Feature flag behavior**: allow_manual_name feature flag, if false, prevents form submission unless student is from the list
- **Response format**: Student responses are collected as JSON and flattened into field_id -> { type, value } format
- **Feedback structure**: Backend feedback follows the documented structure with mode ('static', 'answer-key', 'rule-based', or 'hybrid') and appropriate details
- **Version tracking**: challenge_version is required for all submissions to enable backend to handle schema evolution and A/B testing

## Decision Points for Planning Phase

1. **State Management Library**: Should we use vanilla JavaScript with simple state object, Svelte, or another reactive framework? (Current: simple state object)
2. **API Error Recovery**: Should failed API calls trigger automatic retries with exponential backoff, or require manual user action? (Current: manual retry suggested)
3. **Loading States**: Should skeleton loaders be shown for challenge content, or simple "Loading..." messages? (Current: simple message)
4. **Feedback Evaluation**: Should feedback be evaluated client-side (feedback in challenge object) or server-side (backend returns feedback)? (Current: both supported; server-side preferred for consistency)
5. **HTML Content**: Should we support rich HTML in markdown blocks, or strict text content? (Current: text only with HTML escaping)

