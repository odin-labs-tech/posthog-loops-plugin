// Plugin method that processes event
function composeWebhook(event, { config }) {
  /** Retrieve the config variable for the list of events that should be tracked */
  const trackedEvents = config?.trackedEvents?.split(',').map((event) => event.trim());

  // Don't send auto-capture events or any untracked events
  if (
    // Don't send autocapture events (numerous and not very useful)
    event.event == '$autocapture' ||
    !(
      // Don't send events not in our tracked list
      (
        trackedEvents?.includes(event.event) ||
        // Don't send identifies if we're not supposed to
        (config.shouldTrackIdentify && event.event === '$identify')
      )
    )
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
      ...event.$set_once,
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    method: 'POST',
  };
}

// The plugin itself
module.exports = {
  composeWebhook,
};
