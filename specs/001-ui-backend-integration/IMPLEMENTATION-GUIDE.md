# Feature Implementation Guide

This guide provides an overview of the UI Backend Integration feature specification and how to proceed with implementation.

## What This Specification Covers

The **UI Backend Integration** feature is focused on connecting the new variant-4-selector UI architecture to the backend APIs and removing test-only code.

### In Scope

✅ **Connecting variant-4-selector to backend APIs**
- Fetch app configuration from `getConfig`
- Fetch student list from `getStudents`
- Fetch active challenge from `getActiveChallenge`
- Submit responses to `submitResponse`

✅ **Removing test-only code**
- Remove hardcoded fixtures as production dependency
- Remove challenge selector dropdown
- Remove mock data imports from variant-4-selector

✅ **State management for backend data**
- Manage config, students, challenge, and submission state
- Handle loading states and error conditions
- Prevent duplicate submissions

✅ **API error handling**
- Graceful degradation when backend is unavailable
- User-friendly error messages
- Automatic form validation before submission

✅ **Challenge schema documentation**
- Document challenge structure (blocks, fields, feedback)
- Provide API examples
- Use existing fixtures as schema reference

### Out of Scope

❌ **Framework migration**: Stay with vanilla JavaScript or choose framework during planning phase
❌ **Mobile optimization**: Desktop-first UI assumed
❌ **Rich HTML support**: Plain text with HTML escaping
❌ **Advanced feedback modes**: Focus on documented modes (static, answer-key, rule-based, hybrid)
❌ **Automatic API retries**: Manual retry suggested in UI

## How to Use This Specification

### For Planning Phase

Run `/speckit.plan` to:
1. Review the specification and problem statement
2. Create an implementation plan with design decisions
3. Document architectural approaches (state management, error handling, etc.)
4. Identify dependencies and integration points

### For Task Generation

Run `/speckit.tasks` to:
1. Generate actionable, prioritized tasks from the specification
2. Create dependencies between tasks
3. Estimate effort and complexity
4. Establish testing criteria for each task

### For Implementation

Use the tasks from `/speckit.tasks` to:
1. Develop features in priority order
2. Test against acceptance scenarios
3. Verify success criteria are met
4. Track progress through task completion

## Key Files

### Primary Specification
- **`spec.md`** — Complete feature specification with user stories, requirements, success criteria, and decision points

### Supporting Documentation
- **`API-SCHEMA-REFERENCE.md`** — Detailed API contract, data schemas, and examples from existing fixtures
- **`checklists/requirements.md`** — Quality checklist validating specification completeness

### Current Codebase References
- **Variant-4-selector** (new UI):
  - Location: `frontend-playground/variant-4-selector/`
  - Key files: `app.js`, `index.html`, `style.css`
  - Shared resources: `frontend-playground/shared/challenge-fixtures.js`, `mock-data.js`

- **Original Frontend** (working APIs):
  - Location: `frontend/`
  - Key file: `app.js` (contains working API calls and submission logic)
  - Shows current API contract and submission format

- **Existing Fixtures** (to be preserved as documentation):
  - `frontend-playground/shared/challenge-fixtures.js` — Java OOP challenges (Portuguese)
  - `frontend-playground/shared/challenge-fixtures.en.js` — Same challenges (English)
  - `frontend-playground/shared/mock-data.js` — Paradigms challenge and student list

## Implementation Roadmap (Suggested)

### Phase 1: API Integration (P1 - Core)
1. Add BACKEND_BASE_URL configuration
2. Implement `fetchJson()` helper function
3. Fetch and store config on app load
4. Fetch and store students on app load
5. Fetch and display active challenge on app load
6. Remove challenge selector dropdown

### Phase 2: Response Submission (P1 - Core)
1. Adapt response collection to flatten field values
2. Implement submission validation
3. Send submission to backend
4. Display feedback from backend
5. Handle submission errors with retry

### Phase 3: Error Handling & Polish (P1 - Core)
1. Add loading states during API calls
2. Show error messages on API failures
3. Implement graceful degradation
4. HTML escape all content

### Phase 4: Code Cleanup (Follow-up)
1. Remove hardcoded fixture imports
2. Move mock-data.js to examples/documentation
3. Clean up unused test code
4. Update imports and dependencies

## Success Validation Checklist

Before marking the feature complete, verify:

- [ ] Challenge loads from `getActiveChallenge` on page load (not from selector)
- [ ] Student list loads from `getStudents` and provides autocomplete
- [ ] Config loads from `getConfig` and personalizes UI
- [ ] Response submission sends correct payload to `submitResponse`
- [ ] Feedback displays after successful submission
- [ ] Error messages show for API failures
- [ ] All required fields validate before submission
- [ ] Challenge selector dropdown is removed
- [ ] Hardcoded fixtures are no longer imported as production code
- [ ] All user scenarios pass acceptance tests
- [ ] All success criteria are measurable and verified

## Decision Points for Planning Phase

The specification identifies 5 key decision points for the planning phase:

1. **State Management**: Vanilla JS state object vs reactive framework (Svelte, Vue, React)
2. **API Error Recovery**: Automatic retries with backoff vs manual retry in UI
3. **Loading States**: Skeleton loaders vs simple "Loading..." messages
4. **Feedback Evaluation**: Client-side (from challenge) vs server-side (from backend)
5. **HTML Content**: Text-only with escaping vs rich HTML support

These decisions should be made during `/speckit.plan` and documented in the plan.md file.

## Getting Help

- **API Contract Questions**: See `API-SCHEMA-REFERENCE.md`
- **Acceptance Criteria**: See `spec.md` > User Scenarios & Testing
- **Current Implementation Examples**: See `frontend/app.js` for working backend calls
- **Data Examples**: See `frontend-playground/shared/challenge-fixtures.js` for challenge structure

