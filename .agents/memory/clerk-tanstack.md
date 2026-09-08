---
name: Clerk auth in this TanStack Start app
description: Non-obvious auth routing behavior discovered while integrating Clerk.
---

Clerk's path-routed SignIn/SignUp components need matching TanStack splat routes in this app. With those wildcard routes present, the branded auth card and callback URLs render correctly.

**Why:** Without wildcard callback routes, the sign-in page rendered blank or produced route collisions; the explicit splat routes remove that ambiguity.

**How to apply:** Keep `/sign-in/$` and `/sign-up/$` routes alongside the Clerk components, and verify both the base and `/sso-callback` paths after auth changes.