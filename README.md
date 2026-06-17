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
- `npm test`: run the SDK smoke tests.

## Publish flow

This repo is configured for `xbp` and npm publishing:

```bash
xbp init
xbp version patch
xbp publish
```

`statbot-js` was available on npm registry when this repo was prepared on June 17, 2026.
