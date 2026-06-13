# Deferred Work

Items surfaced during review of `spec-challenge-of-the-day-app.md` that are **not this story's problem** but should be revisited later.

## Deferred Items

1. **Parallel API calls** — Config, students, and challenge are fetched sequentially (waterfall). They're independent and could be parallelized to halve load time. Deferred as an optimization, not a defect.

2. **LockService for concurrent submissions** — Google Apps Script's `appendRow` could interleave under concurrent load. `LockService.getDocumentLock()` would serialize writes. Deferred because the class size is small (~40 students) and concurrent submissions are unlikely.

3. **Backend structural validation against challenge schema** — The backend validates field presence and types but does not validate submitted responses against the active challenge's field schema. Deferred because the spec defines basic validation as sufficient for v1 — schema-aware validation can be added later as a hardening step.

4. **HTTP status code signaling** — Google Apps Script `ContentService` always returns HTTP 200. The frontend now checks response body for `error` fields, making this transparent. Proper HTTP status codes from GAS require workarounds (e.g., `HtmlService`) and can be explored later.
