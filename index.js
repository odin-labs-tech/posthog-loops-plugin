const fetch = require('node-fetch');

// Plugin method that processes event
async function onEvent(event, { config }) {
  // Send event to Loops (identifies and events are handled the same way)
  const response = await fetch('https://app.loops.so/api/v1/events/send', {
    method: 'post',
    body: JSON.stringify({
      // We can send either userId or email to identify a user (email is included in $set)
      // However, userId will be ignored until it's associated with an email in Loops
      userId: event.distinct_id,
      // We can only really pass the event name
      eventName: event.event,
      // We can also assign contact properties (but not event properties) during an identify
      ...event.$set,
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
  });
  result = await response.json();

  // In the scenario where the user is not found, loops can't handle these events and we have to just drop the event
  if (result.message && result.message.includes('userId not found')) return true;

  // Return whether it was successful
  return result.success;
}

// The plugin itself
module.exports = {
  onEvent,
};
