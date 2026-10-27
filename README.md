# Distraction Analytics

A privacy-first, local-only digital wellbeing app for observing short-form video sessions and their preceding apps.

## What is implemented

This project now includes:

- Expo + React Native + TypeScript app scaffold
- Dark mode UI shell with Overview, Analytics, Sessions, and Settings tabs
- Local SQLite database initialization and session seed data
- Dashboard summaries powered by local data
- Analytics card and daily bar summaries
- Session history screen using stored records
- Privacy-first settings with export and delete actions
- Markdown/JSON report generation and sharing flow

## Project structure

```text
.
├── App.tsx
├── app.config.ts
├── babel.config.js
├── package.json
├── README.md
├── tsconfig.json
├── src
│   ├── components
│   ├── database
│   ├── screens
│   ├── services
│   ├── theme
│   ├── types
│   └── utils
└── node_modules
```

## Architecture decisions

1. Local-first by default
   - All app data remains in a local SQLite database.
   - There is no required account or remote analytics service.

2. Observed behavior vs inferred relationships
   - `triggerApp` is recorded as the preceding app only.
   - The app labels it as context, not causation.

3. Native detection stays isolated
   - Android accessibility detection is intentionally separated from the UI code layer.
   - JavaScript imports only validated data after it has been recorded locally.

4. Data export is explicit and user controlled
   - JSON export and Markdown report generation are available from Settings.
   - Clear-all-data requires confirmation before deleting stored sessions.

## Commands

Use a supported Node version such as Node 22 before running the app.

```bash
cd distraction-analytics
npx --yes -p node@22 -p npm@10 npm install --no-fund --no-audit
npx --yes -p node@22 -p npm@10 npm run typecheck -- --pretty false
npx --yes -p node@22 -p npm@10 npm start
```

## Expected result

The app opens with a dark dashboard and a working privacy-first local data model. The Overview, Analytics, Sessions, and Settings screens render the generated session data and export actions without any required backend.

## Notes

This app is intentionally implemented as a local-first foundation for the Android accessibility integration described in the product specification. Native feed detection, accessibility service lifecycle, and physical Android verification remain the next stage if you want to continue into the native Android implementation.
