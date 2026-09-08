## Purpose

Represent case progression and expected responses in structured data, using application-side conditional logic for deterministic progression instead of repeated LLM calls.

## Requirements

### Requirement: Structured case progression

The system SHALL represent case progression and expected student responses in structured data within the clinical case object.

#### Scenario: Case contains progression steps

- **WHEN** a clinical case is generated
- **THEN** the case object includes structured progression steps with expected responses

#### Scenario: Progression steps are ordered

- **WHEN** a clinical case contains multiple progression steps
- **THEN** the steps are ordered and each step indicates its dependencies or sequence position

### Requirement: Deterministic progression logic

The system SHALL use application-side conditional logic to determine case progression instead of making repeated LLM calls to reconstruct case state.

#### Scenario: Student advances to next step

- **WHEN** a student provides a response to a case progression step
- **THEN** the system evaluates the response using application-side logic and advances the case without an additional LLM call

#### Scenario: Student response triggers branch

- **WHEN** a student response matches a branching condition in the progression logic
- **THEN** the system follows the defined branch in the progression without an additional LLM call

### Requirement: Fallback for non-deterministic transitions

The system SHALL fall back to LLM-assisted progression only when the response does not match any deterministic rule in the progression logic.

#### Scenario: No deterministic rule matches

- **WHEN** a student response does not match any defined progression rule
- **THEN** the system invokes the LLM to determine the next progression step
