const {
  createEvent,
  createIdentify,
  getMeta,
  resetMeta,
} = require('@posthog/plugin-scaffold/test/utils');
const { onEvent } = require('./index');
require('dotenv').config();

beforeEach(() => {
  // Making sure plugin meta has our custom test config
  resetMeta({
    config: {
      apiKey: process.env.LOOPS_API_KEY,
    },
  });
});

// We identify the user first to ensure the event is attached later
test('PostHog identify is sent to Loops', async () => {
  // Create a random event
  const event = createIdentify();

  const isSuccess = await onEvent(event, getMeta());
  expect(isSuccess).toBe(true);
});

// We send the event after identifying the user
test('PostHog event is sent to Loops', async () => {
  // Create a random event
  const event = createEvent({
    event: 'Test Completed',
    // Loops does not currently allow these properties to be sent
    properties: { amount: '20', currency: 'USD' },
  });

  const isSuccess = await onEvent(event, getMeta());
  expect(isSuccess).toBe(true);
});
