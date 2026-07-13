# Virtual Agent — Backend

This folder contains the Node.js backend for the Virtual Agent project. It provides HTTP routes, intent handling, flows, and integration tests used by the system.

## Quick Start

Requirements:

- Node.js 18+ (or compatible LTS)
- npm or yarn

Install dependencies:

```bash
cd backend
npm install
# or: yarn install
```

Start the server in development:

```bash
cd backend
npm run dev
# or: NODE_ENV=development node src/server.js
```

Run tests:

```bash
cd backend
npm test
```

Run integration tests (CI style):

```bash
cd backend
npm run test:integration
```

Linting and formatting:

```bash
cd backend
npm run lint
npm run format
```

## Environment

Configuration is managed in `src/config`. Copy the example (if provided) or set environment variables used by the service. Key env vars:

- `PORT` — server port (default 3000)
- `NODE_ENV` — `development|test|production`
- Any secrets used by `src/config/secrets.js` and `src/config/webhookSecrets.js`.

## Project structure

- `src/` — application source
  - `api/` — external API wrappers
  - `controllers/` — route handlers
  - `flows/` — conversational flows
  - `intents/` — NLU and intent classification
  - `llm/` — prompts and LLM client
  - `middleware/` — express middleware
  - `routes/` — express routers
  - `services/` — domain services
  - `utils/` — helpers
  - `validation/` — JSON schemas
- `prompts/`, `knowledge/`, and `logs/` — runtime assets and data
- `tests/` — unit, integration and routing tests

## Common commands

- Start dev server: `npm run dev`
- Run unit tests: `npm run test:unit`
- Run all tests: `npm test`
- Lint: `npm run lint`
- Format: `npm run format`

## Contributing

When contributing, run the tests and linting locally. Describe changes in clear commit messages and open a PR for review.

## Troubleshooting

- If tests fail due to missing environment variables, check `src/config/env.js`.
- Check `logs/` for runtime logs when running the server locally.

## Contacts

For questions about the backend, see the maintainer listed in the repository or open an issue in the project tracker.

---

README last updated: 2026-07-13
