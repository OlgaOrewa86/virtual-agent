# Virtual Agent — Frontend

This folder contains the React frontend for the Virtual Agent project. It provides a conversational chat interface for users to interact with the virtual agent for orders, FAQs, returns, and support.

## Quick Start

Requirements:

- Node.js 18+ (or compatible LTS)
- npm or yarn
- Backend running on `http://localhost:3000` (configurable in `apiClient.js`)

Install dependencies:

```bash
cd frontend
npm install
# or: yarn install
```

Start the development server:

```bash
cd frontend
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000) in your browser and reload on changes.

Run tests:

```bash
cd frontend
npm test
```

Build for production:

```bash
cd frontend
npm run build
```

## Project Structure

- `src/` — application source
  - `components/` — reusable React components (Message, Card, List, ProductCard, etc.)
  - `pages/` — page-level components (OrderTracking)
  - `apiClient.js` — HTTP client for backend communication
  - `App.js` — main application component
- `public/` — static assets
- `build/` — production build output (generated)

## Configuration

The frontend connects to the backend API via `apiClient.js`. Update the API endpoint if running on a different host/port:

```javascript
// apiClient.js
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:3000";
```

You can set `REACT_APP_API_URL` in a `.env` file or as an environment variable.

## Common Commands

- Start dev server: `npm start`
- Run tests: `npm test`
- Build: `npm run build`
- Eject (one-way): `npm run eject`

## Contributing

When contributing, run tests locally and ensure the app works with the backend. Use clear commit messages and open a PR for review.

## Troubleshooting

- **Backend not responding**: Ensure the backend is running on the configured API endpoint.
- **Port 3000 already in use**: Set `PORT` environment variable: `PORT=3001 npm start`
- **Build errors**: Clear `node_modules/` and reinstall: `rm -rf node_modules && npm install`

## Contacts

For questions about the frontend, see the maintainer listed in the repository or open an issue in the project tracker.

---

README last updated: 2026-07-13
