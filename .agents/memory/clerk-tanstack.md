---
name: Clerk auth in this TanStack Start app
description: Non-obvious auth routing behavior discovered while integrating Clerk.
---

Clerk's path-routed SignIn/SignUp components rendered blank in this TanStack Start preview, while hash routing rendered the branded auth card correctly. Keep this behavior in mind before revisiting OAuth callback routing.

**Why:** The app's TanStack file routes do not currently include Clerk's optional wildcard callback paths, so the simpler hash flow is the working local behavior.

**How to apply:** If switching back to path routing, add and verify wildcard callback routes for both sign-in and sign-up in the TanStack route tree before removing hash routing.