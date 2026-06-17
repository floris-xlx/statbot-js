export function loadRouteMetadata() {
  return new Map([
    [
      "/v1/activities",
      {
        summary: "Get activities",
        description:
          "Get the list of activities that Statbot is currently tracking across all guilds.",
      },
    ],
    [
      "/v1/guilds/{guild_id}/activities/series",
      {
        summary: "Get activity series",
        description: "Get activity series data for a guild.",
      },
    ],
    [
      "/v1/guilds/{guild_id}/activities/tops/activities",
      {
        summary: "Get top activities",
        description: "Get top activities (e.g. playing, streaming, etc.) for a guild.",
      },
    ],
    [
      "/v1/guilds/{guild_id}/messages/series",
      {
        summary: "Get message series",
        description: "Get message series data for a guild.",
      },
    ],
    [
      "/v1/guilds/{guild_id}/messages/tops/members",
      {
        summary: "Get top message members",
        description: "Get top message members for a guild.",
      },
    ],
    [
      "/v1/guilds/{guild_id}/messages/tops/channels",
      {
        summary: "Get top message channels",
        description: "Get top message channels for a guild.",
      },
    ],
    [
      "/v1/guilds/{guild_id}/messages/sums",
      {
        summary: "Get count of messages",
        description: "Get the aggregate count of messages for a guild.",
      },
    ],
    [
      "/v1/guilds/{guild_id}/voice/series",
      {
        summary: "Get voice series",
        description: "Get voice activity series data for a guild.",
      },
    ],
    [
      "/v1/guilds/{guild_id}/voice/tops/members",
      {
        summary: "Get top voice members",
        description: "Get top voice members for a guild.",
      },
    ],
    [
      "/v1/guilds/{guild_id}/voice/tops/channels",
      {
        summary: "Get top voice channels",
        description: "Get top voice channels for a guild.",
      },
    ],
    [
      "/v1/guilds/{guild_id}/voice/sums",
      {
        summary: "Get count of voice activity",
        description: "Get the aggregate count of voice activity minutes for a guild.",
      },
    ],
    [
      "/v1/guilds/{guild_id}/membercounts/series",
      {
        summary: "Get member count series",
        description: "Get a series of guild member counts over time.",
      },
    ],
    [
      "/v1/guilds/{guild_id}/statuses/series",
      {
        summary: "Get status series",
        description: "Get a series of guild member presence counts over time.",
      },
    ],
    [
      "/v1/guilds/{guild_id}/counts/members",
      {
        summary: "Get members with counts",
        description: "Get guild members with aggregated message and voice counts.",
      },
    ],
    [
      "/v1/guilds/{guild_id}/counts/members/series",
      {
        summary: "Get unique member counts",
        description: "Get a series of counts of unique members for a guild.",
      },
    ],
    [
      "/v1/guilds/{guild_id}/counts/channels/series",
      {
        summary: "Get unique channel counts",
        description: "Get a series of counts of unique channels for a guild.",
      },
    ],
    [
      "/v1/guilds/{guild_id}/invites/series",
      {
        summary: "Get invite series",
        description: "Get invite series data for a guild.",
      },
    ],
    [
      "/v1/guilds/{guild_id}/invites/tops/invites",
      {
        summary: "Get top invites",
        description: "Get top invites for a guild.",
      },
    ],
    [
      "/v1/guilds/{guild_id}/invites/tops/members",
      {
        summary: "Get top invite members",
        description: "Get top invite members for a guild.",
      },
    ],
    [
      "/v1/guilds/{guild_id}/invites/{invite_id}",
      {
        summary: "Get invite",
        description: "Get invite for a guild.",
      },
    ],
    [
      "/v1/guilds/{guild_id}/invites",
      {
        summary: "Get invites",
        description: "Get invites for a guild.",
      },
    ],
    [
      "/v1/guilds/{guild_id}/channels/{channel_id}",
      {
        summary: "Get channel",
        description: "Get channel for a guild.",
      },
    ],
    [
      "/v1/guilds/{guild_id}/channels",
      {
        summary: "Get channels",
        description: "Get channels for a guild.",
      },
    ],
  ]);
}
