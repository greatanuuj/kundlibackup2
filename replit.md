# Running on Replit

This project uses Node.js 22 with npm.

- Install dependencies: `npm install`
- Start the development server: `npm run dev`
- Build for production: `npm run build`
- Check code quality: `npm run lint`

The Replit workflow runs `npm run dev` on port 5000. Vite is configured to bind to `0.0.0.0` and accept Replit's proxied preview hosts.