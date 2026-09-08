## Purpose

Retain provenance linking generated clinical cases to their learning objective, pedagogical rationale, and source material, enabling traceability and review.

## Requirements

### Requirement: Provenance metadata on generated cases

The system SHALL attach provenance metadata to each generated clinical case, linking it to the learning objective, pedagogical rationale, and trusted medical source text used in generation.

#### Scenario: Case includes provenance

- **WHEN** a clinical case is generated from structured inputs
- **THEN** the case object contains metadata identifying the learning objective, pedagogical rationale, and source text

#### Scenario: Provenance is immutable after generation

- **WHEN** a clinical case has been generated and validated
- **THEN** the provenance metadata cannot be modified without regenerating the case

### Requirement: Provenance visibility

The system SHALL make provenance metadata accessible to professors for review and validation.

#### Scenario: Professor views case provenance

- **WHEN** a professor opens a generated clinical case
- **THEN** the system displays the learning objective, pedagogical rationale, and source text associated with the case

#### Scenario: Professor traces case to source

- **WHEN** a professor requests the source material for a generated case
- **THEN** the system presents the trusted medical source text used in generation
