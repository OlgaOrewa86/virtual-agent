import { jest } from '@jest/globals';

// -------------------------------------------------------------
// 1. MOCK OPENAI (LLM)
// -------------------------------------------------------------
await jest.unstable_mockModule('openai', () => ({
  OpenAI: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: async () => ({
          choices: [{ message: { content: 'mocked response' } }]
        })
      }
    }
  }))
}));

// -------------------------------------------------------------
// 2. MOCK LLM CLIENT
// -------------------------------------------------------------
await jest.unstable_mockModule('../src/llm/llmClient.js', () => ({
  callLLM: async () => 'mocked llm response'
}));

// -------------------------------------------------------------
// 3. MOCK EMBEDDER (semantic unavailable)
// -------------------------------------------------------------
await jest.unstable_mockModule('../src/intents/embedder.js', () => ({
  embed: async () => []
}));

// -------------------------------------------------------------
// 4. MOCK PRODUCT SERVICE (avoid external network calls)
// -------------------------------------------------------------
await jest.unstable_mockModule('../src/services/productService.js', () => ({
  getAllProducts: async () => [
    { id: 1, title: 'Test Product 1' },
    { id: 2, title: 'Test Product 2' }
  ],
  getProductById: async (id) => ({ id: Number(id), title: `Test Product ${id}` })
}));

// -------------------------------------------------------------
// 4. CLEAR EVENT STORE BEFORE EACH TEST
// -------------------------------------------------------------
import { clearEvents } from '../src/store/eventStore.js';

beforeEach(() => {
  clearEvents();
});

// -------------------------------------------------------------
// 5. CLEAR TIMERS (DebugPanel uses setInterval)
// -------------------------------------------------------------
afterEach(() => {
  jest.useFakeTimers();
  jest.clearAllTimers();
});

// -------------------------------------------------------------
// 6. OPTIONAL: SILENCE WINSTON LOGGING DURING TESTS
// -------------------------------------------------------------
import logger from '../src/utils/logger.js';
logger.transports.forEach((t) => (t.silent = true));
