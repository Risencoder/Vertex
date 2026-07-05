# ADR-001 Authentication Strategy

## Status

Proposed

## Context

Vertex is expected to support multiple authentication providers in the future.

The MVP starts with email/password authentication because it is the simplest path to a usable private learning platform. However, Google and GitHub OAuth should be easy to add later without redesigning the core `User` model.

Authentication should support the product domain, not dominate it. The `User` entity should remain the stable product identity for profiles, progress, submissions, reviews, achievements, and settings. Provider-specific authentication details should be handled by the authentication layer.

## Considered options

### 1. Custom JWT authentication

Pros:

- Full control over implementation.
- No dependency on an external auth framework.
- Easy to start with basic email/password.

Cons:

- More custom security code.
- Higher maintenance cost.
- OAuth, sessions, password reset, and email verification must be built manually.
- Easier to introduce subtle security mistakes.

### 2. Passport.js

Pros:

- Mature ecosystem.
- Many provider strategies.
- Familiar to many Node.js developers.

Cons:

- Less TypeScript-first.
- More manual wiring.
- Session and database integration decisions remain mostly on the application.
- Can become fragmented as requirements grow.

### 3. Auth.js

Pros:

- Strong OAuth support.
- Popular ecosystem.
- Good fit for many web applications.

Cons:

- Historically strongest in Next.js-oriented setups.
- Express integration can require more adaptation.
- May introduce framework assumptions that are not ideal for the current Express API.

### 4. Better Auth

Pros:

- TypeScript-first.
- Prisma support.
- Express support.
- OAuth ready.
- Email/password support.
- Active development.
- Good developer experience.
- Easy future scalability.

Cons:

- External dependency.
- Team needs to learn Better Auth concepts and configuration.
- Requires careful review before locking the first production auth schema.

## Decision

Use Better Auth for Vertex authentication.

Better Auth is the recommended option because it fits the current stack and future direction of Vertex:

- TypeScript-first API.
- Prisma support for database integration.
- Express support for the current backend.
- Built-in path for email/password authentication.
- OAuth-ready for Google and GitHub login later.
- Active development and good developer experience.
- Scales better than a custom JWT implementation as sessions, verification, password reset, and provider accounts are added.

This decision should allow the MVP to start with email/password while keeping the `User` model stable and ready for additional providers.

## Consequences

Positive:

- Less custom auth code.
- Easier maintenance.
- Easy OAuth expansion.
- Cleaner `User` model.

Negative:

- Adds an external dependency.
- Team needs to learn Better Auth.

## Future

Future authentication capabilities should include:

- Google Login
- GitHub Login
- Email Verification
- Password Reset
- Sessions
- MFA
