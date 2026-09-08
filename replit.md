# Running on Replit

This project uses Node.js 22 with npm.

- Install dependencies: `npm install`
- Start the development server: `npm run dev`
- Build for production: `npm run build`
- Check code quality: `npm run lint`

The Replit workflow runs `npm run dev` on port 5000. Vite is configured to bind to `0.0.0.0` and accept Replit's proxied preview hosts.

## Accounts and saved Kundlis

Clerk provides the branded login and signup screens at `/sign-in` and `/sign-up`.
Signed-in users can save, reopen, and delete birth profiles from the home page.
The current saved-profile store is browser-local and keyed by the Clerk user ID; a
database-backed sync is a recommended next step for cross-device persistence.