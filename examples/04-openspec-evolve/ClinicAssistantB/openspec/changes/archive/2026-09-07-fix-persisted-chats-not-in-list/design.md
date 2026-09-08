## Context

The chat detail page (`src/app/(app)/chat/[id]/page.tsx`) creates new chats by inserting into the `chats` table. The insert currently includes only `user_id` and `title`. The `module` column is left `NULL`. The chat list page (`src/app/(app)/chat/page.tsx`) queries `.eq('module', 'chat')`, which excludes `NULL` rows. The study module already handles this correctly — its list page and creation flow both use `module: 'study'`.

## Goals / Non-Goals

**Goals:**
- Ensure every newly created chat row includes `module: 'chat'` and `user_id` so it is visible in the list view.
- Backfill existing `NULL`-module chat rows so they appear in the list.

**Non-Goals:**
- Refactoring chat creation into a shared service (out of scope for a bug fix).
- Adding database constraints (e.g., `NOT NULL` on `module`) — that is a broader schema evolution.
- Changing the list view's UI or filtering logic beyond what is needed to surface persisted chats.

## Decisions

### 1. Fix the insert in the chat detail page

**Decision**: Add `module: 'chat'` and `user_id` to the `.insert()` call in `handleSend` at `src/app/(app)/chat/[id]/page.tsx:144-151`.

**Rationale**: This is the direct root cause. The study module's equivalent flow (`study/page.tsx:40-48`) already includes both fields, confirming the pattern. Adding `user_id` here as well makes the insert explicit and consistent with RLS expectations, even though Supabase RLS may infer it server-side.

**Alternative considered**: Filter the list query to also accept `module IS NULL` as a chat. Rejected because it treats the symptom rather than the data correctness issue, and would conflate future null-module rows (if any) with chats.

### 2. Backfill existing NULL-module rows

**Decision**: Create a Supabase SQL migration that sets `module = 'chat'` on all existing rows where `module IS NULL`.

**Rationale**: Existing chats created before this fix have `module = NULL` and are currently invisible. A one-time migration is the standard Supabase pattern for data corrections. The migration is idempotent — running it again on already-set rows is a no-op.

**Alternative considered**: Backfill via a client-side script on app load. Rejected because it couples data repair to application runtime and adds unnecessary complexity.

## Risks / Trade-offs

- **Risk**: If any `NULL`-module rows were intentionally not chats (e.g., orphaned test data), backfilling assigns them to the chat list. **Mitigation**: The current schema only has two module values (`'chat'`, `'study'`), and no code path creates rows without a module intentionally. The risk is negligible.
- **Risk**: The `module` column remains nullable after this fix, so the bug class could recur if future code forgets the field. **Mitigation**: Out of scope for this fix; a future change could add a `NOT NULL` constraint with a default.
