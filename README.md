# PostHog Plugin for Loops

[![License: MIT](https://img.shields.io/badge/License-MIT-red.svg?style=flat-square)](https://opensource.org/licenses/MIT)

This is a PostHog plugin for passing events to the [Loops](https://loops.so) app.

## Functionality

This plugin handles two types of actions:

### 1. Event

When detect a normal event, we will simply send the event to Loops. All custom properties will be included in the event.

- [Documentation on Loop's send event endpoint](https://loops.so/docs/api-reference/send-event)

### 2. Identify

When we detect an identify, we will also send the event to Loops, but also include contact properties. If the user does not exist, it will be created, otherwise, it will be updated.

- [Documentation on Loops' event contact properties](https://loops.so/docs/api-reference/send-event#contact-properties)

## Testing

In order to test this plugin locally, do the following:

1. Install node modules with `yarn install`

2. Create a `.env` file with the following contents:

```sh
LOOPS_API_KEY=ENTER_API_KEY_HERE
```

_Make sure to include your Loops.so API key_

3. Run `yarn test`
