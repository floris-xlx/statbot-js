# Routes And Examples

All captured Statbot routes currently require bearer authentication.

```ts
import { StatbotClient } from "statbot-js";

const client = new StatbotClient({
  token: process.env.STATBOT_TOKEN,
});
```

Reusable placeholders used below:

```ts
const guildId = "123456789012345678";
const channelId = "234567890123456789";
const inviteId = 456;
```

## Activities

### `GET /v1/activities`

SDK method: `client.getActivities()`

```ts
const activities = await client.getActivities();
```

### `GET /v1/guilds/{guild_id}/activities/series`

SDK method: `client.getActivitySeries(guildId, query)`

```ts
const activitySeries = await client.getActivitySeries(guildId, {
  interval: "day",
  start: 1735689600000,
  end: 1736294400000,
  whitelist_activities: [791, 792],
  by_activity: true,
});
```

### `GET /v1/guilds/{guild_id}/activities/tops/activities`

SDK method: `client.getTopActivities(guildId, query)`

```ts
const topActivities = await client.getTopActivities(guildId, {
  interval: "week",
  order: "desc",
  page_size: 10,
  page: 1,
});
```

## Messages

### `GET /v1/guilds/{guild_id}/messages/series`

SDK method: `client.getMessageSeries(guildId, query)`

```ts
const messageSeries = await client.getMessageSeries(guildId, {
  interval: "day",
  whitelist_members: ["111111111111111111"],
  whitelist_channels: ["222222222222222222"],
  by_member: true,
});
```

### `GET /v1/guilds/{guild_id}/messages/tops/members`

SDK method: `client.getTopMessageMembers(guildId, query)`

```ts
const topMessageMembers = await client.getTopMessageMembers(guildId, {
  interval: "month",
  full: true,
  page_size: 25,
  page: 1,
});
```

### `GET /v1/guilds/{guild_id}/messages/tops/channels`

SDK method: `client.getTopMessageChannels(guildId, query)`

```ts
const topMessageChannels = await client.getTopMessageChannels(guildId, {
  interval: "week",
  full: true,
  order: "desc",
  limit: 10,
});
```

### `GET /v1/guilds/{guild_id}/messages/sums`

SDK method: `client.getMessageCount(guildId, query)`

```ts
const totalMessages = await client.getMessageCount(guildId, {
  start: 1735689600000,
  end: 1736294400000,
  bot: false,
});
```

## Voice

### `GET /v1/guilds/{guild_id}/voice/series`

SDK method: `client.getVoiceSeries(guildId, query)`

```ts
const voiceSeries = await client.getVoiceSeries(guildId, {
  interval: "day",
  voice_states: ["normal", "afk"],
  by_state: true,
});
```

### `GET /v1/guilds/{guild_id}/voice/tops/members`

SDK method: `client.getTopVoiceMembers(guildId, query)`

```ts
const topVoiceMembers = await client.getTopVoiceMembers(guildId, {
  interval: "week",
  full: true,
  voice_states: ["normal"],
  limit: 20,
});
```

### `GET /v1/guilds/{guild_id}/voice/tops/channels`

SDK method: `client.getTopVoiceChannels(guildId, query)`

```ts
const topVoiceChannels = await client.getTopVoiceChannels(guildId, {
  interval: "week",
  full: true,
  voice_states: ["normal", "self_mute"],
  page_size: 10,
  page: 1,
});
```

### `GET /v1/guilds/{guild_id}/voice/sums`

SDK method: `client.getVoiceCount(guildId, query)`

```ts
const totalVoiceMinutes = await client.getVoiceCount(guildId, {
  interval: "month",
  voice_states: ["normal"],
});
```

## Guild Counts

### `GET /v1/guilds/{guild_id}/membercounts/series`

SDK method: `client.getMemberCountSeries(guildId, query)`

```ts
const memberCounts = await client.getMemberCountSeries(guildId, {
  interval: "day",
  limit: 30,
});
```

### `GET /v1/guilds/{guild_id}/statuses/series`

SDK method: `client.getStatusSeries(guildId, query)`

```ts
const statusSeries = await client.getStatusSeries(guildId, {
  interval: "hour",
  order: "asc",
  limit: 24,
});
```

### `GET /v1/guilds/{guild_id}/counts/members/series`

SDK method: `client.getUniqueMemberCountSeries(guildId, query)`

```ts
const uniqueMemberCounts = await client.getUniqueMemberCountSeries(guildId, {
  stats: ["text", "voice"],
  interval: "day",
  voice_states: ["normal"],
});
```

### `GET /v1/guilds/{guild_id}/counts/channels/series`

SDK method: `client.getUniqueChannelCountSeries(guildId, query)`

```ts
const uniqueChannelCounts = await client.getUniqueChannelCountSeries(guildId, {
  stats: ["text"],
  interval: "day",
  whitelist_channels: ["222222222222222222"],
});
```

### `GET /v1/guilds/{guild_id}/counts/members`

SDK method: `client.getMembersWithCounts(guildId, query)`

```ts
const membersWithCounts = await client.getMembersWithCounts(guildId, {
  interval: "week",
  whitelist_roles: ["333333333333333333"],
});
```

## Invites

### `GET /v1/guilds/{guild_id}/invites/series`

SDK method: `client.getInviteSeries(guildId, query)`

```ts
const inviteSeries = await client.getInviteSeries(guildId, {
  interval: "day",
  by_inviter: true,
  whitelist_invites: [456, 789],
});
```

### `GET /v1/guilds/{guild_id}/invites/tops/invites`

SDK method: `client.getTopInvites(guildId, query)`

```ts
const topInvites = await client.getTopInvites(guildId, {
  interval: "month",
  full: true,
  limit: 15,
});
```

### `GET /v1/guilds/{guild_id}/invites/tops/members`

SDK method: `client.getTopInviteMembers(guildId, query)`

```ts
const topInviteMembers = await client.getTopInviteMembers(guildId, {
  interval: "month",
  full: true,
  order: "desc",
  page_size: 20,
  page: 1,
});
```

### `GET /v1/guilds/{guild_id}/invites/{invite_id}`

SDK method: `client.getInvite(guildId, inviteId)`

```ts
const invite = await client.getInvite(guildId, inviteId);
```

### `GET /v1/guilds/{guild_id}/invites`

SDK method: `client.getInvites(guildId)`

```ts
const invites = await client.getInvites(guildId);
```

## Channels

### `GET /v1/guilds/{guild_id}/channels/{channel_id}`

SDK method: `client.getChannel(guildId, channelId)`

```ts
const channel = await client.getChannel(guildId, channelId);
```

### `GET /v1/guilds/{guild_id}/channels`

SDK method: `client.getChannels(guildId, query)`

```ts
const channels = await client.getChannels(guildId, {
  types: [0, 13, 999],
  ids: ["234567890123456789", "345678901234567890"],
});
```

## Complete Example Module

For a single typed file that exercises every SDK method, see [examples/all-routes.ts](/C:/Users/floris/Documents/GitHub/statbot-js/examples/all-routes.ts).
