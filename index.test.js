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

test('PostHog event sends event to Loops', async () => {
  // Create a random event
  const event = createEvent({
    event: 'Test Completed',
    properties: { amount: '20', currency: 'USD' },
  });

  // Must clone the event since `processEvent` will mutate it
  const isSuccess = await onEvent(event, getMeta());
  expect(isSuccess).toBe(true);
});

test('PostHog identify creates user in Loops', async () => {
  // Create a random event
  const event = createIdentify();

  // Must clone the event since `processEvent` will mutate it
  const isSuccess = await onEvent(event, getMeta());
  expect(isSuccess).toBe(true);
});
