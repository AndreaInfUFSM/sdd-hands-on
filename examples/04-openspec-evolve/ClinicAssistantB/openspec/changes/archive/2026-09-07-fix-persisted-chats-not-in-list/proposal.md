## Why

Newly created chats do not appear in the chat list after they are persisted. The chat detail page inserts new chats into the `chats` table without setting the `module` column, leaving it `NULL`. The chat list page filters by `.eq('module', 'chat')`, which excludes rows where `module` is `NULL`. This means every successfully persisted chat is invisible to the list view until the `module` field is populated.

## What Changes

- Add `module: 'chat'` to the chat insert in the chat detail page so newly created chats are correctly tagged and visible in the list.
- Add `user_id` to the chat insert in the chat detail page, matching the pattern used by the study module, to ensure RLS consistency and explicit ownership.
- Add a data-migration task to backfill `module = 'chat'` on existing chat rows where `module` is `NULL`, so previously created chats also appear in the list.

## Capabilities

### New Capabilities

- `chat-persistence`: Ensures chats are persisted with the correct metadata (`module`, `user_id`) so they are consistently retrievable by the list views.

### Modified Capabilities

_(none — no existing specs)_

## Impact

- **Code**: `src/app/(app)/chat/[id]/page.tsx` — the `handleSend` function's chat insert must include `module` and `user_id`.
- **Database**: Existing `chats` rows with `module IS NULL` need a one-time backfill to `module = 'chat'` to appear in the list.
- **No API changes, no new dependencies, no UI changes.**
