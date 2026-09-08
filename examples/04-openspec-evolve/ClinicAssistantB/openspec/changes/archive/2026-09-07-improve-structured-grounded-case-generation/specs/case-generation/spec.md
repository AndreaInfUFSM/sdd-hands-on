## Purpose

Build LLM requests from structured inputs and define a validated schema for generated clinical cases, ensuring cases are grounded in provided pedagogical and clinical context.

## ADDED Requirements

### Requirement: LLM request construction

The system SHALL construct LLM requests using the structured inputs (topic, learning objective, pedagogical rationale, source text) without requiring the LLM to interpret missing context.

#### Scenario: Request built from structured inputs

- **WHEN** the system receives validated structured inputs for case generation
- **THEN** the system constructs an LLM request containing the topic, learning objective, pedagogical rationale, and source text as explicit context

#### Scenario: Source text included in request

- **WHEN** the system constructs an LLM request for case generation
- **THEN** the trusted medical source text is included verbatim in the request context

### Requirement: Structured case schema

The system SHALL define and enforce a structured schema for generated clinical cases, ensuring output conforms to expected structure.

#### Scenario: Valid generated case

- **WHEN** the LLM returns a generated clinical case
- **THEN** the system validates the response against the structured case schema

#### Scenario: Invalid generated case

- **WHEN** the LLM returns a generated clinical case that does not conform to the structured schema
- **THEN** the system rejects the response and reports the validation failure

### Requirement: Schema defines case components

The structured case schema SHALL include sections for patient presentation, clinical history, examination findings, investigation results, differential diagnosis, and management plan.

#### Scenario: Complete case structure

- **WHEN** a clinical case is generated and validated
- **THEN** the case object contains all required sections as defined by the schema
