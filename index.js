// Plugin method used to configure the plugin on startup
function setupPlugin({ config, global }) {
  // Declare our default request headers
  global.defaultHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${config.apiKey}`,
  };

  // Convert the shouldTrackIdentify to a boolean
  global.shouldTrackIdentify = config.shouldTrackIdentify === 'yes';

  // Create a set to easily determine which events are tracked
  global.trackedEvents = new Set(
    config.trackedEvents ? config.trackedEvents.split(',').map((event) => event.trim()) : null
  );
}

// Plugin method that processes event
function composeWebhook(event, { global }) {
  /** Determine whether we should track this specific event */
  const shouldTrackEvent = global.trackedEvents ? global.trackedEvents.has(event.event) : true;

  // Don't send auto-capture events or any untracked events
  if (
    // Don't send autocapture events (numerous and not very useful)
    event.event === '$autocapture' ||
    // Don't send events not in our tracked list
    (event.event === '$identify' ? !global.shouldTrackIdentify : !shouldTrackEvent)
  )
    return null;

  return {
    url: 'https://app.loops.so/api/v1/events/send',
    body: JSON.stringify({
      // We can send either userId or email to identify a user (email is included in $set)
      // However, userId will be ignored until it's associated with an email in Loops
      userId: event.distinct_id,
      // We can only really pass the event name
      eventName: event.event,
      // We can also assign contact properties (but not event properties) during an identify
      ...(event.event === '$identify' && event.$set),
    }),
    headers: global.defaultHeaders,
    method: 'POST',
  };
}

// The plugin itself
module.exports = {
  setupPlugin,
  composeWebhook,
};
