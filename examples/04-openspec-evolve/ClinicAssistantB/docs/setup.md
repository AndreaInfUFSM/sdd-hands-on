# Setup

## Supabase

Create a dedicated Supabase project for this repository.

Apply:

`supabase/migrations/0001_initial_schema.sql`

In Supabase Authentication:

- enable Email/Password authentication;
- allow new user signups;
- for development, email confirmation may be disabled.

Copy `.env.example` to `.env.local` and fill in the project credentials.

## Environment

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
GEMINI_API_KEY=
```