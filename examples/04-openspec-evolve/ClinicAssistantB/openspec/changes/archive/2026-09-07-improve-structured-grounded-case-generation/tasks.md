## 1. Case Schema Definition

- [x] 1.1 Define the JSON schema for clinical cases (patient presentation, clinical history, examination findings, investigation results, differential diagnosis, management plan, progression steps, provenance) and verify the schema validates a well-formed example case
- [x] 1.2 Add a `schemaVersion` field to the case schema and verify the schema includes it as a required property
- [x] 1.3 Write unit tests for schema validation that cover valid cases, missing required fields, and invalid field types, and verify all tests pass

## 2. Structured Input Handling

- [x] 2.1 Define a TypeScript type/interface for structured case generation inputs (topic, learning objective, pedagogical rationale, source text) and verify it compiles without errors
- [x] 2.2 Implement input validation logic that checks required fields are present, types are correct, and text fields respect length constraints, and verify validation rejects missing fields, wrong types, and oversized text
- [x] 2.3 Write unit tests for input validation covering the "all inputs provided", "missing field", "invalid type", and "exceeds length" scenarios, and verify all tests pass

## 3. LLM Request Construction

- [x] 3.1 Implement a prompt builder that takes structured inputs and produces an LLM request with topic, learning objective, rationale, and source text included verbatim, and verify the prompt contains all four inputs
- [x] 3.2 Implement structured output extraction that parses the LLM JSON response and validates it against the case schema, and verify a conforming response is returned as a validated case object
- [x] 3.3 Implement retry-once logic for schema validation failures: if the first LLM response fails validation, retry once with a correction prompt, and verify the retry is attempted and invalid output is not persisted

## 4. Error Handling at LLM Boundary

- [x] 4.1 Define application-level error categories (connectivity, service-unavailable, rate-limit, invalid-output) as a TypeScript enum or union type, and verify the type compiles
- [x] 4.2 Implement error translation at the LLM client boundary that maps provider-specific error codes to application-level categories, and verify each category is correctly mapped with unit tests
- [x] 4.3 Implement failure reporting that surfaces the error category and a user-facing message, and verify connectivity timeouts, service unavailability, and rate limits each produce distinct messages

## 5. Case Progression

- [x] 5.1 Define the progression step schema (ordered steps with match conditions and expected responses) and verify it integrates with the case schema
- [x] 5.2 Implement deterministic progression logic that evaluates a student response against progression rules and returns the next step without an LLM call when a rule matches, and verify with unit tests for match and branch scenarios
- [x] 5.3 Implement LLM fallback that invokes the LLM only when no deterministic rule matches a student response, and verify the fallback is triggered and the LLM is not called when a rule matches

## 6. Provenance Tracking

- [x] 6.1 Attach provenance metadata (learning objective, rationale, source text) to the case object at generation time and verify the metadata is present on a generated case
- [x] 6.2 Ensure provenance metadata is read-only after generation (no setter exposed on the case object) and verify attempts to modify provenance are rejected or have no effect
- [x] 6.3 Implement a professor-facing provenance display function or component that returns the learning objective, rationale, and source text for a given case, and verify it returns the correct values

## 7. Supabase Persistence

- [x] 7.1 Create a `clinical_cases` table migration with a JSONB `case_data` column, `schema_version` column, `created_at` timestamp, and foreign key to the user or session, and verify the migration applies cleanly
- [x] 7.2 Implement a persistence function that saves a validated case object to Supabase and retrieves it, and verify the saved data round-trips correctly through the JSONB column
- [x] 7.3 Implement a query to list cases for a professor and verify it returns only that professor's cases

## 8. Frontend: Structured Input Form

- [x] 8.1 Add structured input fields (topic, learning objective, pedagogical rationale, source text) to the existing case creation UI following current layout patterns, and verify the fields render within the existing design
- [x] 8.2 Wire the input form to the validation logic and show field-level error messages when validation fails, and verify submitting with missing or invalid fields displays the correct errors
- [x] 8.3 Preserve user inputs on generation failure and allow retry without re-entering data, and verify inputs remain populated after a failed generation attempt

## 9. Frontend: Case Display and Error Feedback

- [x] 9.1 Display the structured case sections (presentation, history, examination, investigation, differential, management) in the case view, and verify all sections render for a generated case
- [x] 9.2 Display provenance metadata (learning objective, rationale, source text) in the case view, and verify the provenance section appears with correct values
- [x] 9.3 Display distinct error messages for connectivity, service unavailability, rate limit, and invalid output failures, and verify each error class produces the expected user-facing message

## 10. Integration Verification

- [x] 10.1 Run the full case generation flow end-to-end (professor enters structured inputs → LLM generates case → case validates → case persists → case displays with provenance), and verify no errors and correct output at each step
- [x] 10.2 Run the deterministic progression flow end-to-end (student responds to a case step → system advances without LLM call), and verify no additional LLM call is made
- [x] 10.3 Run the LLM fallback flow end-to-end (student gives an unexpected response → system invokes LLM for next step), and verify the fallback triggers and the case advances
