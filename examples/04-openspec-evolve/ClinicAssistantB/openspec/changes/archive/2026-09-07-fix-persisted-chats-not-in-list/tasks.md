## 1. Fix chat creation to include module and user_id

- [x] 1.1 In `src/app/(app)/chat/[id]/page.tsx`, add `module: 'chat'` and `user_id: user.id` to the `.insert()` call in `handleSend` (around line 144-151). Verify: open the file and confirm the insert object includes both fields.
- [x] 1.2 Manually test: create a new chat by sending a message, then navigate back to the chat list. Verify the new chat appears in the list without requiring a page refresh.

## 2. Backfill existing chats

- [x] 2.1 Create migration `supabase/migrations/0003_backfill_chat_module.sql` with `UPDATE public.chats SET module = 'chat' WHERE module IS NULL;`. Verify: file exists and SQL is syntactically correct.
- [x] 2.2 Apply the migration against the local Supabase instance (`supabase db reset` or `supabase migration up`). Verify: query `SELECT * FROM chats WHERE module IS NULL` returns zero rows.

## 3. Verification

- [x] 3.1 Run the application lint/typecheck if available. Verify: no errors introduced.
- [x] 3.2 End-to-end check: create a new chat, send a message, return to list — chat appears. Reload the page — chat persists. Verify all scenarios from the spec are satisfied.
