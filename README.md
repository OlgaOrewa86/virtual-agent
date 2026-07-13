# Virtual Agent

A full-stack conversational AI system that provides intelligent customer support through a React frontend and Node.js backend. The agent handles orders, FAQs, returns, escalations, and general support requests.

## Project Structure

```
virtual-agent/
├── backend/          — Node.js Express server with NLU, intent handling, and conversational flows
├── frontend/         — React chat interface
└── tests/            — Integration tests
```

## Quick Start

### Prerequisites

- Node.js 18+ (or compatible LTS)
- npm or yarn

### Setup & Run Both Services

1. **Install dependencies** (run from root):

   ```bash
   npm install -w backend -w frontend
   # or install individually:
   # cd backend && npm install
   # cd frontend && npm install
   ```

2. **Start the backend** (Terminal 1):

   ```bash
   cd backend
   npm run dev
   ```

   Backend will run on `http://localhost:3000` by default.

3. **Start the frontend** (Terminal 2):

   ```bash
   cd frontend
   npm start
   ```

   Frontend will open at `http://localhost:3000` (or another port if 3000 is in use).

4. **Open your browser** and interact with the virtual agent at `http://localhost:3000`.

## Project Overview

### Backend

The backend is a Node.js Express server that handles:

- **NLU (Natural Language Understanding)** — Intent classification and semantic similarity
- **Conversational Flows** — Order handling, FAQ lookup, escalations, product browsing, etc.
- **LLM Integration** — Fallback responses and context-aware answers
- **Webhooks & Events** — External system integration and event tracking
- **API Routes** — Agent interaction endpoints

**[See Backend README](backend/README.md) for detailed setup, configuration, and development info.**

### Frontend

The frontend is a React app that provides:

- **Chat Interface** — Real-time messaging with the virtual agent
- **Product Browsing** — Display and interact with products
- **Order Tracking** — View order status and details
- **Message History** — Conversation history with typing indicators
- **Error Handling** — User-friendly error boundaries and fallbacks

**[See Frontend README](frontend/README.md) for detailed setup, configuration, and development info.**

## Common Tasks

### Development

Start both services:

```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm start
```

### Testing

Run all tests:

```bash
# Backend unit tests
cd backend && npm run test:unit

# Backend integration tests
cd backend && npm run test:integration

# Frontend tests
cd frontend && npm test
```

### Linting & Formatting

```bash
# Backend
cd backend && npm run lint
cd backend && npm run format

# Frontend
cd frontend && npm run lint
cd frontend && npm run format
```

### Production Build

```bash
# Build frontend
cd frontend && npm run build

# Output will be in frontend/build/
```

## Configuration

### Backend

See [backend/src/config](backend/src/config) for environment configuration:

- `PORT` — Server port (default: 3000)
- `NODE_ENV` — Environment (development|test|production)
- API keys and secrets in `secrets.js` and `webhookSecrets.js`

### Frontend

Configure the backend API endpoint in [frontend/src/apiClient.js](frontend/src/apiClient.js) or via environment variable:

```bash
REACT_APP_API_URL=http://localhost:3000 npm start
```

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                     │
│  (Chat UI, Product Browsing, Order Tracking)           │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP/REST
                       ↓
┌─────────────────────────────────────────────────────────┐
│                 Backend (Node.js Express)              │
├─────────────────────────────────────────────────────────┤
│  Routes → Controllers → Flows → Services               │
│           ↓                                            │
│  NLU/Intents → Intent Classifier → Semantic Sim.      │
│           ↓                                            │
│  LLM Client → Prompts → Fallback/Context Responses    │
│           ↓                                            │
│  Event Store, Webhooks, External APIs                 │
└─────────────────────────────────────────────────────────┘
```

## Workflows

### User Interaction Flow

1. User sends a message via frontend chat
2. Frontend sends HTTP request to backend `/api/agent/chat`
3. Backend processes:
   - Sanitizes input
   - Extracts intent (NLU classifier)
   - Selects appropriate flow (FAQ, Order, Product, etc.)
   - Executes flow logic
   - Returns response
4. Frontend displays agent response with typing indicators
5. Repeat

### Intent Classification

1. Input text sanitized
2. Embedder converts text to vector
3. Intent classifier finds closest match in `intents.json`
4. Flow selected based on intent
5. If confidence low, escalation flow triggers

## Contributing

1. Run tests locally before committing
2. Follow linting rules (`npm run lint`)
3. Format code before submitting PR (`npm run format`)
4. Write clear commit messages
5. Open a PR for review

## Troubleshooting

### Backend not starting

- Ensure Node.js 18+ is installed: `node --version`
- Check port 3000 is not in use: `lsof -i :3000`
- Clear node_modules: `rm -rf node_modules && npm install`

### Frontend can't reach backend

- Ensure backend is running on the configured API URL
- Check browser console for network errors
- Verify `REACT_APP_API_URL` environment variable if set

### Port conflicts

- Frontend: `PORT=3001 npm start`
- Backend: `PORT=3001 npm run dev`

### Tests failing

- Clear cache: `npm run test -- --clearCache`
- Check environment variables: `src/config/env.js`
- Ensure dependencies are installed

## Contacts

For questions or issues:

- See the maintainer listed in the repository
- Open an issue in the project tracker

---

README last updated: 2026-07-13
