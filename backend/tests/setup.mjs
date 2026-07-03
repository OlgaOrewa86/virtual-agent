import { jest } from '@jest/globals';

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

await jest.unstable_mockModule('../src/llm/llmClient.js', () => ({
  callLLM: async () => 'mocked llm response'
}));

await jest.unstable_mockModule('../src/intents/embedder.js', () => ({
  embed: async () => []
}));
