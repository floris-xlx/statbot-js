# statbot-js

Type-safe JavaScript SDK for the Statbot API, generated from the markdown route captures in [openapi](/C:/Users/floris/Documents/GitHub/statbot-js/openapi).

## What this repo contains

- `openapi/openapi.yaml` and `openapi/openapi.json`: generated OpenAPI 3.1 contract.
- `src/client.ts`: instance-based SDK built on `openapi-fetch`.
- `src/generated/openapi-types.ts`: generated TypeScript contract types.
- `.xbp/xbp.yaml`: `xbp` project config for versioning and npm publish flow.

## Install

```bash
npm install statbot-js
```

## Usage

```ts
import { StatbotClient } from "statbot-js";

const client = new StatbotClient({
  token: process.env.STATBOT_TOKEN,
});

const series = await client.getMessageSeries("123456789012345678", {
  interval: "day",
  whitelist_members: ["111111111111111111"],
  by_member: true,
});

const channels = await client.getChannels("123456789012345678", {
  types: [0, 999],
});
```

## Route Coverage

The SDK currently covers every distinct captured Statbot route:

- Activities: `getActivities`, `getActivitySeries`, `getTopActivities`
- Messages: `getMessageSeries`, `getTopMessageMembers`, `getTopMessageChannels`, `getMessageCount`
- Voice: `getVoiceSeries`, `getTopVoiceMembers`, `getTopVoiceChannels`, `getVoiceCount`
- Guild counts: `getMemberCountSeries`, `getStatusSeries`, `getUniqueMemberCountSeries`, `getUniqueChannelCountSeries`, `getMembersWithCounts`
- Invites: `getInviteSeries`, `getTopInvites`, `getTopInviteMembers`, `getInvite`, `getInvites`
- Channels: `getChannel`, `getChannels`

Full route-by-route examples live in [docs/routes-and-examples.md](/C:/Users/floris/Documents/GitHub/statbot-js/docs/routes-and-examples.md).

There is also a typed example module that touches every SDK method in [examples/all-routes.ts](/C:/Users/floris/Documents/GitHub/statbot-js/examples/all-routes.ts).

## Example Patterns

Top endpoints often return partial rows by default. Set `full: true` when you want the richer object shape:

```ts
const topVoiceMembers = await client.getTopVoiceMembers("123456789012345678", {
  interval: "week",
  full: true,
  page_size: 25,
  page: 1,
});
```

Series endpoints support grouping switches such as `by_member`, `by_channel`, `by_activity`, `by_state`, and `by_inviter`:

```ts
const inviteSeries = await client.getInviteSeries("123456789012345678", {
  interval: "day",
  by_inviter: true,
  whitelist_invites: [456],
});
```

Resource endpoints are the simplest entry points for direct lookups:

```ts
const invite = await client.getInvite("123456789012345678", 456);
const channel = await client.getChannel(
  "123456789012345678",
  "234567890123456789",
);
```

## Development

```bash
npm install
npm run build
npm test
```

Key scripts:

- `npm run openapi:generate`: regenerate `openapi/openapi.yaml` and `openapi/openapi.json`.
- `npm run sdk:generate`: regenerate `src/generated/openapi-types.ts`.
- `npm run build`: regenerate the contract, regenerate types, and build the published package.
- `npm run typecheck`: typecheck the SDK and the route example module.
- `npm test`: run the SDK smoke tests.

## Publish flow

This repo is configured for `xbp` and npm publishing:

```bash
xbp init
xbp version patch
xbp publish
```

`statbot-js` was available on npm registry when this repo was prepared on June 17, 2026.
