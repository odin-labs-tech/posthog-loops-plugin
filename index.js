import LoopsClient from 'loops';

/** Initialize our Loops client for passing events */
let loops;

// Plugin method that runs on plugin load
export async function setupPlugin({ config }) {
  // Configure loops client
  loops = new LoopsClient(config.apiKey);
}

// Plugin method that processes event
export async function onEvent(event) {
  // Store result from loops ({ success: true | false })
  let result = { success: false };

  // Handle identify event
  if (event.type === '$identify') {
    // Check if user already exists
    const users = await loops.findContact(event.distinct_id);

    // If user doesn't exist, create them in Loops
    if (!users.length) result = await loops.createContact(event.distinct_id, event.properties);
    // If user does exist, update them in Loops
    else result = await loops.updateContact(event.distinct_id, event.properties);
  }
  // Handle standard event
  else if (event.type === '$event') {
    // Send event to Loops
    result = await loops.createEvent(event.distinct_id, event.event, event.properties);
  }

  return result.success;
}
