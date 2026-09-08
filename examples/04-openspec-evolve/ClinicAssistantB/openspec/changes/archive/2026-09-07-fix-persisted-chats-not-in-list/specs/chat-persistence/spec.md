## Purpose

Ensures that every chat persisted to the database carries the metadata required for list views to retrieve and display it correctly.

## ADDED Requirements

### Requirement: Chat creation SHALL set the module field

When the application creates a new chat record, it SHALL include a `module` value that matches the list view's filter criteria. For the chat module this value is `'chat'`; for the study module it is `'study'`.

#### Scenario: New chat is created with correct module
- **WHEN** a user sends the first message in a new chat session
- **THEN** the system inserts a row into the `chats` table with `module` set to `'chat'`

#### Scenario: New study session is created with correct module
- **WHEN** a user creates a new study session
- **THEN** the system inserts a row into the `chats` table with `module` set to `'study'`

### Requirement: Chat creation SHALL set the user_id field

When the application creates a new chat record, it SHALL include the authenticated user's ID in the `user_id` column.

#### Scenario: New chat is created with user ownership
- **WHEN** a user sends the first message in a new chat session
- **THEN** the system inserts a row into the `chats` table with `user_id` set to the authenticated user's ID

### Requirement: Chat list SHALL reflect all persisted chats

The chat list view SHALL display every chat that has been persisted with the matching `module` value, including chats that existed before the current session.

#### Scenario: Previously persisted chats appear in the list
- **WHEN** a user navigates to the chat list view
- **THEN** all chats with `module = 'chat'` and `user_id` matching the authenticated user are displayed, ordered by `updated_at` descending

#### Scenario: Newly created chat appears without reload
- **WHEN** a user creates a new chat and returns to the chat list
- **THEN** the newly created chat appears in the list

### Requirement: Existing chats with NULL module SHALL be recoverable

Chats that were persisted without a `module` value SHALL be updated to have the correct module so they appear in the appropriate list view.

#### Scenario: Backfill existing chats
- **WHEN** the system encounters chat rows where `module IS NULL`
- **THEN** those rows are updated to `module = 'chat'`
