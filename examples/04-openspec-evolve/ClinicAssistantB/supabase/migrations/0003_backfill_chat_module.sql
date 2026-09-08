-- Backfill chat rows that were created without a module value.
-- These rows belong to the chat module and must appear in the chat list,
-- which filters on module = 'chat'.
UPDATE public.chats SET module = 'chat' WHERE module IS NULL;
