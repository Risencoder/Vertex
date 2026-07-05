# RFC-001 Better Auth Integration

## Status

Draft

## Purpose

Design the Better Auth integration for Vertex before implementation.

This document is architecture-only. It does not install Better Auth, does not modify Prisma schema, does not create migrations, and does not implement API routes.

## Context

Vertex uses `User` as the core product identity. The domain model connects `User` to `Profile`, `UserSettings`, `LessonProgress`, `ProjectSubmission`, `Achievement`, and other product-owned entities.

ADR-001 recommends Better Auth because Vertex starts with email/password but should support Google and GitHub OAuth later without redesigning the user model.

Better Auth has its own authentication schema. According to Better Auth documentation, the core auth tables are `user`, `session`, `account`, and `verification`. Better Auth also supports Prisma through its Prisma adapter and can generate Prisma-compatible auth schema.

## 1. Which Prisma models are created by Better Auth?

Better Auth core schema maps to these auth-owned models:

- `User`
- `Session`
- `Account`
- `Verification`

Expected responsibilities:

- `User`: auth identity, email, email verification state, display name, image, timestamps.
- `Session`: active login session, token, expiry, device/request metadata.
- `Account`: provider-specific login account, such as credential, Google, or GitHub.
- `Verification`: short-lived verification records for flows like email verification and password reset.

Important:
Better Auth owns the shape and lifecycle of these auth models. Vertex should avoid manually reimplementing their behavior.

## 2. Which models belong to Vertex?

Vertex owns the product/domain models:

- `Profile`
- `UserSettings`
- `LearningPath`
- `LearningPathTechnology`
- `Technology`
- `Module`
- `Lesson`
- `LessonTask`
- `Resource`
- `LessonProgress`
- `Project`
- `ProjectSubmission`
- `ProjectReview`
- `Achievement`

These models represent learning, progress, projects, reviews, and product preferences. They should not contain provider-specific authentication logic.

## 3. Should User remain our domain entity?

Yes.

`User` should remain the stable identity that product models reference. However, after Better Auth is introduced, `User` should be treated as the shared boundary between auth and product domains:

- Better Auth manages login identity and auth lifecycle.
- Vertex product models reference `User.id`.
- Product-specific data stays in separate models like `Profile` and `UserSettings`.

This avoids duplicating an `AuthUser` and a `DomainUser` too early.

## 4. How should Better Auth connect to User?

Recommended direction:

- Use Better Auth's `User` model as the canonical persisted user row.
- Keep Vertex relations on the same `User` model.
- Remove custom auth-only fields from the current draft if Better Auth provides them.

Current draft issue:

- `User.passwordHash` exists in `schema.prisma`.
- Better Auth stores password data in `Account`, not directly on `User`.

Required future change:

- Remove `passwordHash` from `User`.
- Add Better Auth `Session`, `Account`, and `Verification` models.
- Align `User` fields with Better Auth requirements.
- Preserve Vertex relations from `User` to `Profile`, `UserSettings`, `LessonProgress`, `ProjectSubmission`, and `Achievement`.

## 5. Should Profile stay separated?

Yes.

`Profile` should remain a Vertex-owned product model.

Reasons:

- Better Auth `User` should stay focused on authentication identity.
- Profile can store learning goals, experience level, bio, portfolio details, and later public profile fields.
- OAuth provider profile data should not automatically become the full Vertex profile.

Recommended rule:
Better Auth may populate minimal identity fields such as name/image on `User`. Vertex-specific profile details should live in `Profile`.

## 6. Should UserSettings stay separated?

Yes.

`UserSettings` should remain separate from Better Auth.

Reasons:

- Settings are product preferences, not authentication data.
- Future settings may include theme, locale, notifications, privacy, and AI assistance preferences.
- Keeping settings separate prevents the auth user record from becoming a dumping ground.

## 7. How does Session work?

`Session` belongs to Better Auth.

Expected behavior:

- Created when a user signs in.
- Contains a session token and expiry.
- References `User`.
- May store metadata such as IP address and user agent.
- Used by backend and frontend to determine whether the request is authenticated.

Vertex should not model a custom session table unless Better Auth cannot support a required future workflow.

MVP:

- Use Better Auth session handling.
- Keep session concerns out of product models.

Future:

- Add session management UI.
- Support session revocation.
- Consider session freshness for sensitive actions.

## 8. How does Account work?

`Account` belongs to Better Auth.

Expected behavior:

- Represents a login method/provider for a user.
- Stores provider identifiers and provider-specific auth data.
- Stores email/password credential account data.
- Stores OAuth token metadata for Google/GitHub when enabled.
- Multiple accounts may belong to the same `User`.

Examples:

- Email/password account.
- Google OAuth account.
- GitHub OAuth account.

MVP:

- Email/password account only.

Future:

- Link Google and GitHub accounts to the same `User`.
- Decide how strict account linking should be for same-email OAuth sign-ins.

## 9. How will Google Login work later?

Google Login should be added as a Better Auth social provider.

Expected flow:

1. User chooses Google Login.
2. Better Auth redirects to Google.
3. Google returns provider identity.
4. Better Auth creates or links an `Account`.
5. Better Auth creates or reuses the canonical `User`.
6. Vertex product data continues to reference `User.id`.

Architecture decision:
Google-specific fields should stay in `Account`, not in `Profile`.

Optional mapping:
Provider name/image may populate basic `User` identity fields. Vertex profile fields should remain product-owned.

## 10. How will GitHub Login work later?

GitHub Login should follow the same architecture as Google Login.

Expected flow:

1. User chooses GitHub Login.
2. Better Auth redirects to GitHub.
3. GitHub returns provider identity.
4. Better Auth creates or links an `Account`.
5. Better Auth creates or reuses the canonical `User`.
6. Vertex product data remains connected through `User.id`.

Architecture decision:
GitHub provider metadata should stay in `Account`.

Future review point:
GitHub email behavior can differ depending on user privacy settings, so account linking rules should be reviewed before enabling GitHub Login.

## 11. How will Password Reset work?

Password reset should be handled by Better Auth.

Expected model usage:

- `Verification` stores short-lived reset tokens or verification values.
- `Account` stores credential/password data.
- `User` remains the stable identity.

MVP:

- Implement password reset only after email sending is configured.
- Do not create a custom password reset table unless Better Auth cannot support the required workflow.

Future:

- Add email templates.
- Add expiration policy.
- Add audit logging if needed.

## 12. How will Email Verification work?

Email verification should be handled by Better Auth.

Expected model usage:

- `Verification` stores short-lived verification values.
- `User.emailVerified` stores whether the user's email has been verified.

MVP:

- Decide whether email verification is required before accessing learning content.
- If email delivery is not ready, keep verification optional at first.

Future:

- Require email verification for sensitive actions.
- Use verified email as a safer basis for OAuth account linking.

## 13. Entity diagram

```text
Better Auth owned:

User
 |-- Session
 |-- Account
 `-- Verification records by identifier/email

Vertex owned:

User
 |-- Profile
 |-- UserSettings
 |-- LessonProgress ---------------- Lesson
 |-- ProjectSubmission ------------- Project
 |   `-- ProjectReview
 `-- Achievement

Learning model:

LearningPath
 |-- LearningPathTechnology -------- Technology
 |                                  |-- Module -- Lesson
 |                                  `-- Project
 `-- Project
```

Key boundary:

```text
Better Auth manages authentication lifecycle.
Vertex manages learning/product lifecycle.
Both meet at User.id.
```

## 14. Required schema.prisma changes

Future schema changes needed before implementation:

### Better Auth models

Add or align:

- `Session`
- `Account`
- `Verification`

### User model alignment

Update `User` to match Better Auth requirements:

- Add/confirm fields expected by Better Auth, such as name, email, email verification state, image, timestamps.
- Remove `passwordHash` from `User`.
- Keep product relations:
  - `profile`
  - `settings`
  - `lessonProgress`
  - `projectSubmissions`
  - `achievements`

### Profile model

Keep `Profile` separate.

Review whether `displayName` should duplicate Better Auth `User.name` or whether it should become a product-specific override.

### UserSettings model

Keep `UserSettings` separate.

No Better Auth dependency should be added here.

### Account model

Add Better Auth-compatible account fields for:

- provider id
- provider account id
- credential password data
- access token
- refresh token
- token expiry
- scopes

### Session model

Add Better Auth-compatible session fields for:

- token
- expiry
- user id
- IP address
- user agent
- timestamps

### Verification model

Add Better Auth-compatible verification fields for:

- identifier
- value
- expiry
- timestamps

## 15. MVP vs Future

### MVP

- Install Better Auth.
- Add Better Auth Prisma adapter.
- Align Prisma schema with Better Auth core models.
- Keep `User` as canonical identity.
- Remove `User.passwordHash`.
- Support email/password login.
- Support sessions.
- Keep `Profile` separate.
- Keep `UserSettings` separate.

### Future

- Google Login.
- GitHub Login.
- Email Verification requirement.
- Password Reset flow.
- Session management UI.
- MFA.
- Account linking settings.
- Audit logging for security-sensitive actions.

## References

- Better Auth Database documentation: https://better-auth.com/docs/concepts/database
- Better Auth Prisma adapter documentation: https://better-auth.com/docs/adapters/prisma
- Better Auth User & Accounts documentation: https://better-auth.com/docs/concepts/users-accounts
