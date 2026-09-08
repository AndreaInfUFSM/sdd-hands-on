## Context

The existing prototype generates clinical cases through conversational LLM interaction, where the model interprets context and reconstructs case state on each turn. This creates fragility, redundant model calls, and implicit case logic. The stack is Next.js + Supabase + LLM API. See proposal.md for motivation.

The change introduces structured inputs, a validated case schema, deterministic progression logic, provenance tracking, and explicit error handling across the same stack.

## Goals / Non-Goals

**Goals:**

- Replace implicit LLM-interpreted case state with explicit structured case objects
- Ground generation in supplied pedagogical and clinical inputs rather than open-ended prompts
- Use application-side logic for deterministic case progression steps
- Attach provenance metadata linking cases to their learning objective, rationale, and source material
- Surface distinct failure classes (connectivity, service, rate-limit, invalid output) for actionable user feedback

**Non-Goals:**

- Multi-provider LLM switching or abstraction layer
- Vector-search RAG or automated retrieval pipelines
- Broad frontend redesign (incremental UI changes only)
- Local or edge LLM inference

## Decisions

### 1. Structured case schema as a JSON object persisted in Supabase

**Decision:** Define a single JSON schema for clinical cases and store generated cases as JSONB in a new `clinical_cases` table.

**Rationale:** A JSON schema provides validation at the application boundary without requiring rigid relational modeling during this incremental phase. JSONB in Supabase allows querying nested fields when needed and aligns with the existing persistence layer.

**Alternatives considered:**
- *Normalized relational tables for each case section*: Rejected for now — too many joins for a read-heavy educational use case at this scale. Could be extracted later if query patterns demand it.
- *Free-form text with metadata sidecar*: Rejected — defeats the purpose of structured representation.

### 2. Prompt engineering with structured output extraction

**Decision:** Construct LLM prompts that include all structured inputs verbatim (topic, learning objective, rationale, source text) and request JSON output conforming to the case schema. Use a schema-validated extraction step after the LLM response.

**Rationale:** Keeps the LLM as a content generator within explicit boundaries rather than an interpreter of implicit state. Schema validation after extraction catches non-conforming output early.

**Alternatives considered:**
- *Function-calling / tool-use API*: Viable if the provider supports it; could replace manual JSON extraction later. Not chosen as the initial approach to avoid provider coupling.
- *Two-pass generation (outline then fill)*: More complex, deferred to future iteration if single-pass quality is insufficient.

### 3. Deterministic progression with LLM fallback

**Decision:** Define progression rules as ordered steps with match conditions in the case object. Application logic evaluates student responses against these rules. Only when no rule matches does the system invoke the LLM.

**Rationale:** Most clinical case flows follow predictable paths (history → examination → investigation → diagnosis → management). Deterministic matching eliminates unnecessary LLM calls for these sequences. The LLM fallback handles genuinely open-ended responses.

**Alternatives considered:**
- *Purely LLM-driven progression*: Rejected — this is the current fragile approach the change aims to replace.
- *Finite state machine with no fallback*: Rejected — too rigid for educational dialogue where students may respond unexpectedly.

### 4. Provenance as immutable metadata on the case object

**Decision:** Attach provenance (learning objective, rationale, source text reference) as a read-only sub-object on the case, written once at generation time.

**Rationale:** Immutability ensures traceability — a professor reviewing a case always sees the exact context that produced it. Regeneration creates a new case rather than mutating provenance.

**Alternatives considered:**
- *Versioned provenance history*: Deferred — adds complexity without immediate need at prototype trial scale.
- *Separate provenance table*: Unnecessary — the metadata is small, case-specific, and read alongside the case.

### 5. Error classification at the application boundary

**Decision:** Translate provider-specific error codes into application-level categories (connectivity, service-unavailable, rate-limit, invalid-output) at the LLM client boundary. Never expose raw provider codes to the rest of the system.

**Rationale:** Insulates the application from provider API changes and makes error handling testable with mock categories rather than real API failures.

**Alternatives considered:**
- *Pass-through of raw errors*: Rejected — couples application logic to a specific provider's error taxonomy.

### 6. Incremental frontend changes within existing layout patterns

**Decision:** Add structured input fields and provenance display by extending existing UI components and following current design conventions (tailwind classes, component patterns).

**Rationale:** Preserves visual identity and reduces risk. New fields integrate into the existing case creation and viewing flows without layout reorganization.

## Risks / Trade-offs

- **LLM JSON output quality** → The LLM may return malformed JSON or fields that don't match the schema. *Mitigation*: Strict schema validation with retry-once logic; clear error reporting when validation fails.

- **Progression rule coverage** → Deterministic rules may not cover all student response patterns, increasing LLM fallback frequency. *Mitigation*: Design progression rules for the common path; monitor fallback rate during trials and expand rules iteratively.

- **Source text size in prompts** → Large source texts increase token cost and risk timeout. *Mitigation*: Input length validation at the structured-input boundary; consider chunking strategy if source texts routinely exceed context limits.

- **Schema evolution** → Changing the case schema after cases are persisted requires migration. *Mitigation*: Use JSONB with a schema version field; design for backward-compatible additions.

- **Single-provider dependency** → The LLM client boundary translates errors but doesn't switch providers. *Mitigation*: The boundary makes future provider switching feasible; multi-provider switching is explicitly deferred.
