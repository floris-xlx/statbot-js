# statbot-js

current version: `0.1.0`
Type-safe JavaScript SDK for the Statbot API, generated from the code-backed OpenAPI definitions in [openapi](openapi).

Developed by [XYLEX Group](https://xylex.group).

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

## Runtime Validation

The SDK now validates path params and query objects with Zod before sending requests.

- Discord snowflakes such as `guildId`, `channelId`, member IDs, role IDs, and query ID arrays must be numeric strings between 17 and 20 digits.
- Integer inputs such as `inviteId`, `limit`, `page`, and `page_size` must be positive integers.
- Timestamp and filter objects are validated for shape and constraints.
- Conflicting combinations such as `limit` with `page_size`/`page`, or whitelist and blacklist filters for the same field, fail early.

Invalid input throws `StatbotValidationError`:

```ts
import {
  StatbotClient,
  StatbotValidationError,
} from "statbot-js";

const client = new StatbotClient();

try {
  await client.getChannel("not-a-snowflake", "234567890123456789");
} catch (error) {
  if (error instanceof StatbotValidationError) {
    console.error(error.message);
  }
}
```

The Zod schemas are also exported directly if you want to validate or normalize inputs before calling the SDK:

```ts
import {
  MessageSeriesQuerySchema,
  SnowflakeSchema,
} from "statbot-js";

const guildId = SnowflakeSchema.parse("123456789012345678");
const query = MessageSeriesQuerySchema.parse({
  interval: "day",
  whitelist_members: ["111111111111111111"],
  by_member: true,
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

Full route-by-route examples live in [docs/routes-and-examples.md](docs/routes-and-examples.md) and as typed per-route files in [examples/routes/get-activities.ts](examples/routes/get-activities.ts).

For a combined module that re-exports every per-route example and can invoke them together, see [examples/all-routes.ts](examples/all-routes.ts).

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
- `npm run typecheck`: typecheck the SDK and the per-route example modules.
- `npm test`: run the SDK smoke tests.

## Publish flow

This repo is configured for `xbp` and npm publishing:

```bash
xbp init
xbp version patch
xbp publish
```

`statbot-js` was available on npm registry when this repo was prepared on June 17, 2026.
