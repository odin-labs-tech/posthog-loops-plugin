const {
  createEvent,
  createIdentify,
  getMeta,
  resetMeta,
} = require('@posthog/plugin-scaffold/test/utils');
const { composeWebhook } = require('./index');
require('dotenv').config();

beforeEach(() => {
  // Making sure plugin meta has our custom test config
  resetMeta({
    config: {
      apiKey: process.env.LOOPS_API_KEY,
      shouldTrackIdentify: true,
      trackedEvents: 'Test Successful',
    },
  });
});

// We identify the user first to ensure the event is attached later
test('PostHog identify is sent to Loops', async () => {
  // Create a random event
  const event = createIdentify();

  const result = composeWebhook(event, getMeta());

  // Verify the event body includes the correct event name
  const body = JSON.parse(result.body);
  expect(body.eventName).toBe('$identify');
});

// We send the event after identifying the user
test('PostHog event is sent to Loops', async () => {
  // Create a random event
  const event = createEvent({
    event: 'Test Successful',
    // Loops does not currently allow these properties to be sent
    properties: { amount: '20', currency: 'USD' },
  });

  const result = composeWebhook(event, getMeta());

  // Verify the body includes the correct event name
  const body = JSON.parse(result.body);
  expect(body.eventName).toBe('Test Successful');
});

// We should not send an event that isn't in the trackedEvents configuration list
test('Untracked PostHog event is NOT sent to Loops', async () => {
  // Create a random event
  const event = createEvent({
    event: 'Test Unsuccessful',
  });

  const result = composeWebhook(event, getMeta());

  // Verify the result is null
  expect(result).toBe(null);
});

// We should not send autocapture events because they are numerous and not as useful
test('$autocapture PostHog event is NOT sent to Loops', async () => {
  // Create a random event
  const event = createEvent({
    event: '$autocapture',
  });

  const result = composeWebhook(event, getMeta());

  // Verify the result is null
  expect(result).toBe(null);
});
