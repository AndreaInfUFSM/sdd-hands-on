## Purpose

Make major generation failures explicit, distinguishing between connectivity/timeouts, service unavailability, rate limits, and invalid structured output to guide recovery and user feedback.

## ADDED Requirements

### Requirement: Explicit failure reporting

The system SHALL report generation failures explicitly to the user, distinguishing between major classes of failure.

#### Scenario: Connectivity or timeout failure

- **WHEN** the LLM request fails due to connectivity issues or timeout
- **THEN** the system reports a transient connectivity failure and suggests retrying

#### Scenario: Service unavailability

- **WHEN** the LLM request fails because the provider service is unavailable
- **THEN** the system reports a service unavailability failure and suggests checking service status or retrying later

#### Scenario: Rate limit or quota exceeded

- **WHEN** the LLM request fails due to rate limiting or quota exhaustion
- **THEN** the system reports a rate limit failure and suggests waiting before retrying

### Requirement: Invalid output handling

The system SHALL handle cases where the LLM returns output that does not conform to the structured case schema.

#### Scenario: Schema validation failure

- **WHEN** the LLM returns output that fails structured schema validation
- **THEN** the system reports the validation error and does not persist the invalid output

#### Scenario: Partial valid output

- **WHEN** the LLM returns output that partially conforms to the structured schema
- **THEN** the system reports which fields are invalid and does not persist the partial output

### Requirement: Failure recovery

The system SHALL provide recoverable failure states wherever reasonably possible.

#### Scenario: Retry after transient failure

- **WHEN** a transient connectivity or timeout failure occurs
- **THEN** the system allows the user to retry the generation without re-entering all inputs

#### Scenario: Input preservation on failure

- **WHEN** a generation request fails for any reason
- **THEN** the system preserves the user's structured inputs for retry
