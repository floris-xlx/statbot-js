function integerSchema(description, extra = {}) {
  return {
    type: "integer",
    description,
    ...extra,
  };
}

function arrayParameter(name, description, itemSchema, extra = {}) {
  return {
    name,
    in: "query",
    description,
    style: "form",
    explode: true,
    schema: {
      type: "array",
      items: itemSchema,
      ...extra,
    },
  };
}

function scalarParameter(name, description, schema) {
  return {
    name,
    in: "query",
    description,
    schema,
  };
}

export const enumValues = {
  interval: ["hour", "day", "week", "month"],
  order: ["asc", "desc"],
  voiceStates: [
    "normal",
    "afk",
    "self_mute",
    "self_deaf",
    "server_mute",
    "server_deaf",
  ],
  inviteFlagFilterType: ["any", "all"],
  activityTypes: [0, 1, 2],
  memberTypes: ["user", "bot"],
  autoMergeTypes: ["text", "voice"],
  channelFilterTypes: [0, 2, 4, 5, 13, 15, 999],
  uniqueCountStats: ["text", "voice"],
};

export function createComponents() {
  return {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "token",
        description: "Statbot API bearer token.",
      },
    },
    headers: {
      XRateLimitLimit: {
        description:
          "Maximum number of requests that can be made in the current time window.",
        schema: integerSchema("Maximum number of requests in the time window.", {
          example: 10,
        }),
      },
      XRateLimitRemaining: {
        description: "Number of requests remaining in the current time window.",
        schema: integerSchema("Remaining requests in the time window.", {
          example: 5,
        }),
      },
      XRateLimitReset: {
        description: "How many seconds until the rate limit resets.",
        schema: integerSchema("Seconds until the rate limit resets.", {
          example: 60,
        }),
      },
      RetryAfter: {
        description:
          "If max requests are reached, the time in seconds to wait before making a new request.",
        schema: integerSchema("Seconds to wait before retrying.", {
          example: 30,
        }),
      },
    },
    parameters: {
      GuildId: {
        name: "guild_id",
        in: "path",
        required: true,
        description: "Discord guild ID.",
        schema: {
          $ref: "#/components/schemas/Snowflake",
        },
      },
      ChannelId: {
        name: "channel_id",
        in: "path",
        required: true,
        description: "Discord channel ID.",
        schema: {
          $ref: "#/components/schemas/Snowflake",
        },
      },
      InviteId: {
        name: "invite_id",
        in: "path",
        required: true,
        description: "Statbot ID of the invite.",
        schema: {
          type: "integer",
          minimum: 1,
        },
      },
      Start: scalarParameter("start", "Minimum timestamp in milliseconds since epoch.", {
        type: "integer",
        minimum: 0,
      }),
      TimezoneOffset: scalarParameter(
        "timezone_offset",
        "Timezone offset in hours. For example, `-3` for UTC-3.",
        {
          type: "number",
          minimum: -12,
          maximum: 14,
        },
      ),
      Interval: scalarParameter("interval", "Time interval for the query. Defaults to `day`.", {
        $ref: "#/components/schemas/Interval",
      }),
      End: scalarParameter(
        "end",
        "Maximum timestamp in milliseconds since epoch. If not provided, the current time is used.",
        {
          type: "integer",
          minimum: 0,
        },
      ),
      Bot: scalarParameter(
        "bot",
        "If `true`, only include bot users. If `false`, only include non-bot users.",
        { type: "boolean" },
      ),
      WhitelistMembers: arrayParameter(
        "whitelist_members[]",
        "List of member Discord IDs to whitelist. Cannot be used with `blacklist_members[]`.",
        { $ref: "#/components/schemas/Snowflake" },
      ),
      BlacklistMembers: arrayParameter(
        "blacklist_members[]",
        "List of member Discord IDs to blacklist. Cannot be used with `whitelist_members[]`.",
        { $ref: "#/components/schemas/Snowflake" },
      ),
      WhitelistRoles: arrayParameter(
        "whitelist_roles[]",
        "List of role Discord IDs to whitelist.",
        { $ref: "#/components/schemas/Snowflake" },
      ),
      BlacklistRoles: arrayParameter(
        "blacklist_roles[]",
        "List of role Discord IDs to blacklist.",
        { $ref: "#/components/schemas/Snowflake" },
      ),
      WhitelistChannels: arrayParameter(
        "whitelist_channels[]",
        "List of channel Discord IDs to whitelist. Cannot be used with `blacklist_channels[]`.",
        { $ref: "#/components/schemas/Snowflake" },
      ),
      BlacklistChannels: arrayParameter(
        "blacklist_channels[]",
        "List of channel Discord IDs to blacklist. Cannot be used with `whitelist_channels[]`.",
        { $ref: "#/components/schemas/Snowflake" },
      ),
      WhitelistVoiceChannels: arrayParameter(
        "whitelist_voice_channels[]",
        "List of voice channel Discord IDs to whitelist. Cannot be used with `blacklist_voice_channels[]`.",
        { $ref: "#/components/schemas/Snowflake" },
      ),
      BlacklistVoiceChannels: arrayParameter(
        "blacklist_voice_channels[]",
        "List of voice channel Discord IDs to blacklist. Cannot be used with `whitelist_voice_channels[]`.",
        { $ref: "#/components/schemas/Snowflake" },
      ),
      VoiceStates: arrayParameter(
        "voice_states[]",
        "List of voice states to include in the results.",
        { $ref: "#/components/schemas/VoiceState" },
      ),
      Limit: scalarParameter(
        "limit",
        "Maximum number of results to return. Cannot be used with `page_size`, `page`, or `select[]`.",
        { type: "integer", minimum: 1 },
      ),
      Order: scalarParameter(
        "order",
        "Order of the results. Sorts by `timestamp` for series data and by `rank` for top data.",
        { $ref: "#/components/schemas/SortOrder" },
      ),
      PageSize: scalarParameter(
        "page_size",
        "Number of results per page. Requires `page` and cannot be used with `limit` or `select[]`.",
        { type: "integer", minimum: 1 },
      ),
      Page: scalarParameter(
        "page",
        "Page number for pagination. Requires `page_size` and cannot be used with `limit` or `select[]`.",
        { type: "integer", minimum: 1 },
      ),
      Select: arrayParameter(
        "select[]",
        "IDs to select in the top query. Cannot be used with `limit`, `page_size`, or `page`.",
        { $ref: "#/components/schemas/Snowflake" },
      ),
      Full: scalarParameter(
        "full",
        "If `true`, include the full optional fields in the response.",
        { type: "boolean" },
      ),
      ByChannel: scalarParameter(
        "by_channel",
        "If `true`, group counts by channel with the `channelId` field in the response.",
        { type: "boolean" },
      ),
      ByMember: scalarParameter(
        "by_member",
        "If `true`, group counts by member with the `memberId` field in the response.",
        { type: "boolean" },
      ),
      ByFlag: scalarParameter(
        "by_flag",
        "If `true`, group counts by flags with the `flags` field in the response.",
        { type: "boolean" },
      ),
      ByState: scalarParameter(
        "by_state",
        "If `true`, group voice activity by state with the `type` field in the response.",
        { type: "boolean" },
      ),
      ByActivity: scalarParameter(
        "by_activity",
        "If `true`, group activity counts by activity with the `activityId` field in the response.",
        { type: "boolean" },
      ),
      WhitelistActivities: arrayParameter(
        "whitelist_activities[]",
        "List of activity IDs to whitelist. Cannot be used with `blacklist_activities[]`.",
        {
          type: "integer",
          minimum: 1,
        },
      ),
      BlacklistActivities: arrayParameter(
        "blacklist_activities[]",
        "List of activity IDs to blacklist. Cannot be used with `whitelist_activities[]`.",
        {
          type: "integer",
          minimum: 1,
        },
      ),
      WhitelistInvites: arrayParameter(
        "whitelist_invites[]",
        "List of invite IDs to whitelist. Cannot be used with `blacklist_invites[]`.",
        {
          type: "integer",
          minimum: 1,
        },
      ),
      BlacklistInvites: arrayParameter(
        "blacklist_invites[]",
        "List of invite IDs to blacklist. Cannot be used with `whitelist_invites[]`.",
        {
          type: "integer",
          minimum: 1,
        },
      ),
      WhitelistInviteFlagsMask: scalarParameter(
        "whitelist_invite_flags_mask",
        "Bitwise OR of invite flags to whitelist. Requires `whitelist_invite_flags_type`.",
        { type: "integer" },
      ),
      WhitelistInviteFlagsType: scalarParameter(
        "whitelist_invite_flags_type",
        "Type of invite flag filtering to apply for the whitelist.",
        { $ref: "#/components/schemas/InviteFlagFilterType" },
      ),
      BlacklistInviteFlagsMask: scalarParameter(
        "blacklist_invite_flags_mask",
        "Bitwise OR of invite flags to blacklist. Requires `blacklist_invite_flags_type`.",
        { type: "integer" },
      ),
      BlacklistInviteFlagsType: scalarParameter(
        "blacklist_invite_flags_type",
        "Type of invite flag filtering to apply for the blacklist.",
        { $ref: "#/components/schemas/InviteFlagFilterType" },
      ),
      ByInvite: scalarParameter(
        "by_invite",
        "If `true`, group counts by invite with the `inviteId` field in the response.",
        { type: "boolean" },
      ),
      ByInviter: scalarParameter(
        "by_inviter",
        "If `true`, group counts by inviter with the `inviterId` field in the response.",
        { type: "boolean" },
      ),
      ByInvitee: scalarParameter(
        "by_invitee",
        "If `true`, group counts by invitee with the `inviteeId` field in the response.",
        { type: "boolean" },
      ),
      Stats: {
        ...arrayParameter(
          "stats[]",
          "Stat types to include in the results. Source docs describe this as required, but also state all stat types are used when omitted.",
          { $ref: "#/components/schemas/UniqueCountStat" },
        ),
        required: false,
      },
      Types: arrayParameter(
        "types[]",
        "Channel types to include in the response.",
        {
          type: "integer",
          enum: enumValues.channelFilterTypes,
        },
      ),
      Ids: arrayParameter(
        "ids[]",
        "Specific Discord channel IDs to include in the response.",
        { $ref: "#/components/schemas/Snowflake" },
      ),
    },
    responses: {
      Unauthorized: {
        description: "Unauthorized",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/UnauthorizedError",
            },
          },
        },
      },
    },
    schemas: {
      Snowflake: {
        type: "string",
        pattern: "^[0-9]+$",
        description: "Discord snowflake ID.",
        examples: ["123456789012345678"],
      },
      Interval: {
        type: "string",
        enum: enumValues.interval,
      },
      SortOrder: {
        type: "string",
        enum: enumValues.order,
      },
      VoiceState: {
        type: "string",
        enum: enumValues.voiceStates,
      },
      InviteFlagFilterType: {
        type: "string",
        enum: enumValues.inviteFlagFilterType,
      },
      UniqueCountStat: {
        type: "string",
        enum: enumValues.uniqueCountStats,
      },
      UnauthorizedError: {
        type: "object",
        required: ["message"],
        properties: {
          message: {
            type: "string",
            description: "Unauthorized response message.",
          },
        },
      },
      Activity: {
        type: "object",
        required: ["id", "name", "applicationId"],
        properties: {
          id: integerSchema("Statbot ID of the activity.", {
            example: 791,
          }),
          name: {
            type: "string",
            description: "Name of the activity.",
            example: "Spore",
          },
          applicationId: {
            oneOf: [{ $ref: "#/components/schemas/Snowflake" }, { type: "null" }],
            description: "Discord ID of the application associated with the activity.",
            examples: ["406645798680657920", null],
          },
        },
      },
      Channel: {
        type: "object",
        required: ["id", "name", "type", "parentId", "isActive"],
        properties: {
          id: { $ref: "#/components/schemas/Snowflake" },
          name: {
            type: "string",
            description: "Name of the channel.",
            example: "general",
          },
          type: integerSchema(
            "Discord channel type, or `999` for Statbot Aggregate Channels.",
          ),
          parentId: {
            oneOf: [{ $ref: "#/components/schemas/Snowflake" }, { type: "null" }],
            description: "Discord ID of the parent channel, if any.",
          },
          isActive: {
            type: "integer",
            enum: [0, 1],
            description: "Whether the channel still exists in Discord.",
          },
        },
      },
      AggregateChannel: {
        type: "object",
        required: [
          "id",
          "name",
          "type",
          "parentId",
          "aggregate",
          "autoMergeEnabled",
          "autoMergeChannelIds",
          "autoMergeTypes",
          "createdUnixTimestamp",
        ],
        properties: {
          id: { $ref: "#/components/schemas/Snowflake" },
          name: {
            type: "string",
            description: "Name of the channel.",
            example: "general",
          },
          type: integerSchema(
            "Discord channel type, or `999` for Statbot Aggregate Channels.",
          ),
          parentId: {
            oneOf: [{ $ref: "#/components/schemas/Snowflake" }, { type: "null" }],
            description: "Discord ID of the parent channel, if any.",
          },
          aggregate: {
            type: "boolean",
            description: "Whether the channel is an aggregate channel.",
          },
          autoMergeEnabled: {
            type: "boolean",
            description: "Whether auto-merge is enabled for this Aggregate Channel.",
          },
          autoMergeChannelIds: {
            type: "array",
            items: { $ref: "#/components/schemas/Snowflake" },
            description: "List of channel IDs that data is auto-merged from.",
          },
          autoMergeTypes: {
            type: "array",
            items: {
              type: "string",
              enum: enumValues.autoMergeTypes,
            },
            description: "Data types to auto-merge.",
          },
          createdUnixTimestamp: integerSchema(
            "Unix timestamp in milliseconds when the Aggregate Channel was created.",
          ),
        },
      },
      Invite: {
        type: "object",
        required: [
          "id",
          "memberId",
          "channelId",
          "code",
          "uses",
          "maxUses",
          "maxAge",
          "isTemporary",
          "isVanity",
          "isActive",
          "label",
        ],
        properties: {
          id: integerSchema("Statbot ID of the invite.", {
            minimum: 1,
            example: 456,
          }),
          memberId: {
            $ref: "#/components/schemas/Snowflake",
          },
          channelId: {
            $ref: "#/components/schemas/Snowflake",
          },
          code: {
            type: "string",
            description: "Discord invite code.",
            example: "abc123",
          },
          uses: integerSchema("Number of times the invite has been used."),
          maxUses: integerSchema("Maximum number of times the invite can be used."),
          maxAge: integerSchema("Maximum age of the invite in seconds."),
          isTemporary: {
            type: "integer",
            enum: [0, 1],
            description: "Whether the invite grants temporary membership (0 = false, 1 = true).",
          },
          isVanity: {
            type: "integer",
            enum: [0, 1],
            description: "Whether the invite is a vanity URL (0 = false, 1 = true).",
          },
          isActive: {
            type: "integer",
            enum: [0, 1],
            description: "Whether the invite is currently active (0 = false, 1 = true).",
          },
          label: {
            type: "string",
            description: "Custom label for the invite.",
            example: "My Invite",
          },
        },
      },
      MessageSeriesPoint: {
        type: "object",
        required: ["unixTimestamp", "count"],
        properties: {
          unixTimestamp: integerSchema("Timestamp of the event in ms.", {
            example: 1770359067560,
          }),
          count: integerSchema("Number of messages."),
          memberId: {
            $ref: "#/components/schemas/Snowflake",
          },
          channelId: {
            $ref: "#/components/schemas/Snowflake",
          },
          flags: integerSchema(
            "Bitwise flags of the messages in the data point. BOT=1, THREAD=2, VOICE=4.",
          ),
        },
      },
      VoiceSeriesPoint: {
        type: "object",
        required: ["unixTimestamp", "count"],
        properties: {
          unixTimestamp: integerSchema("Timestamp of the event in ms.", {
            example: 1770359067560,
          }),
          count: integerSchema("Number of minutes."),
          memberId: {
            $ref: "#/components/schemas/Snowflake",
          },
          channelId: {
            $ref: "#/components/schemas/Snowflake",
          },
          flags: integerSchema(
            "Bitwise flags of the voice activity in the data point. BOT=1, GUEST=2.",
          ),
          type: {
            type: "integer",
            enum: [1, 2, 3, 4, 5, 6],
            description:
              "Type of voice activity: normal=1, afk=2, self_mute=3, self_deaf=4, server_mute=5, server_deaf=6.",
          },
        },
      },
      ActivitySeriesPoint: {
        type: "object",
        required: ["unixTimestamp", "count"],
        properties: {
          unixTimestamp: integerSchema("Timestamp of the event in ms.", {
            example: 1770359067560,
          }),
          count: integerSchema("Number of minutes."),
          memberId: {
            $ref: "#/components/schemas/Snowflake",
          },
          activityId: integerSchema("Statbot ID of the activity.", {
            example: 789,
          }),
          activityType: {
            type: "integer",
            enum: enumValues.activityTypes,
            description: "Type of activity. playing=0, streaming=1, listening=2.",
          },
        },
      },
      MemberCountSeriesPoint: {
        type: "object",
        required: ["unixTimestamp", "count", "joins", "leaves"],
        properties: {
          unixTimestamp: integerSchema("Timestamp of the event in ms.", {
            example: 1770359067560,
          }),
          count: integerSchema("Number of members."),
          joins: integerSchema("Number of joins."),
          leaves: integerSchema("Number of leaves."),
        },
      },
      StatusSeriesPoint: {
        type: "object",
        required: ["unixTimestamp", "online", "dnd", "idle"],
        properties: {
          unixTimestamp: integerSchema("Timestamp of the event in ms.", {
            example: 1770359067560,
          }),
          online: integerSchema("Number of online members."),
          dnd: integerSchema("Number of members with Do Not Disturb status."),
          idle: integerSchema("Number of members with Idle status."),
        },
      },
      InviteSeriesPoint: {
        type: "object",
        required: ["unixTimestamp", "count"],
        properties: {
          unixTimestamp: integerSchema("Timestamp of the event in ms.", {
            example: 1770359067560,
          }),
          count: integerSchema("Number of members invited."),
          inviteId: integerSchema("Statbot ID of the invite."),
          inviterId: {
            $ref: "#/components/schemas/Snowflake",
          },
          inviteeId: {
            $ref: "#/components/schemas/Snowflake",
          },
          flags: integerSchema(
            "Bitwise flags for suspicious invite attribution. SELF=1, ALREADY_JOINED=2, NEW_ACCOUNT=4, NEW_MEMBER=8, NO_AVATAR=16, REQUIRE_ROLE=32, REQUIRE_ONBOARDING=64, REQUIRE_HOME_ACTIONS=128, PENDING=256, MEMBER_LEFT=512, BOT=1024, TEMPORARY=2048.",
          ),
        },
      },
      UniqueCountSeriesPoint: {
        type: "object",
        required: ["unixTimestamp", "count"],
        properties: {
          unixTimestamp: integerSchema("Timestamp of the event in ms.", {
            example: 1770359067560,
          }),
          count: integerSchema("Count value."),
        },
      },
      SumResponse: {
        type: "object",
        required: ["count"],
        properties: {
          count: integerSchema("Aggregate count value."),
        },
      },
      PartialTopMember: {
        type: "object",
        required: ["id", "rank", "count", "channelCount"],
        properties: {
          id: { $ref: "#/components/schemas/Snowflake" },
          rank: integerSchema("Rank in data set."),
          count: integerSchema("Count value for the top member entry."),
          channelCount: integerSchema("Number of channels the member participated in."),
        },
      },
      TopMember: {
        allOf: [
          { $ref: "#/components/schemas/PartialTopMember" },
          {
            type: "object",
            required: ["username", "type", "globalName", "nick", "avatar", "guildAvatar"],
            properties: {
              username: {
                type: "string",
                description: "Member username.",
                example: "statbot",
              },
              type: {
                type: "string",
                enum: enumValues.memberTypes,
                description: "Type of user.",
                example: "user",
              },
              globalName: {
                type: "string",
                description: "Member global name, or empty string when not available.",
                example: "Statbot",
              },
              nick: {
                type: "string",
                description: "Member guild nickname, or empty string when not available.",
                example: "Best Bot",
              },
              avatar: {
                type: "string",
                description: "Member avatar hash, or empty string when not available.",
                example: "abc123def456",
              },
              guildAvatar: {
                type: "string",
                description: "Member guild avatar hash, or empty string when not available.",
                example: "abc123def456",
              },
            },
          },
        ],
      },
      PartialTopChannel: {
        type: "object",
        required: ["rank", "count", "memberCount"],
        properties: {
          rank: integerSchema("Rank in data set."),
          count: integerSchema("Count value for the top channel entry."),
          memberCount: integerSchema("Number of members that participated in the channel."),
        },
      },
      TopChannel: {
        allOf: [
          { $ref: "#/components/schemas/PartialTopChannel" },
          { $ref: "#/components/schemas/Channel" },
        ],
      },
      TopAggregateChannel: {
        allOf: [
          { $ref: "#/components/schemas/PartialTopChannel" },
          { $ref: "#/components/schemas/AggregateChannel" },
        ],
      },
      TopActivity: {
        type: "object",
        required: ["applicationId", "count", "id", "name", "rank"],
        properties: {
          applicationId: {
            oneOf: [{ $ref: "#/components/schemas/Snowflake" }, { type: "null" }],
            description: "Discord ID of the application associated with the activity.",
          },
          count: integerSchema("Number of minutes."),
          id: integerSchema("Statbot ID of the activity.", {
            example: 791,
          }),
          name: {
            type: "string",
            description: "Name of the activity.",
            example: "Spore",
          },
          rank: integerSchema("Rank in data set."),
        },
      },
      PartialTopInvite: {
        type: "object",
        required: ["id", "rank", "count", "memberCount"],
        properties: {
          id: integerSchema("Statbot ID of the invite.", {
            minimum: 1,
          }),
          rank: integerSchema("Rank in data set."),
          count: integerSchema("Number of members invited."),
          memberCount: integerSchema("Number of unique members invited."),
        },
      },
      TopInvite: {
        allOf: [
          { $ref: "#/components/schemas/PartialTopInvite" },
          {
            type: "object",
            required: ["code", "label", "memberId"],
            properties: {
              code: {
                type: "string",
                description: "Discord invite code.",
                example: "abc123",
              },
              label: {
                type: "string",
                description: "Custom label for the invite.",
                example: "My Invite",
              },
              memberId: {
                $ref: "#/components/schemas/Snowflake",
              },
            },
          },
        ],
      },
      PartialTopInviteMember: {
        type: "object",
        required: ["id", "rank", "count"],
        properties: {
          id: { $ref: "#/components/schemas/Snowflake" },
          rank: integerSchema("Rank in data set."),
          count: integerSchema("Number of members invited."),
        },
      },
      TopInviteMember: {
        allOf: [
          { $ref: "#/components/schemas/PartialTopInviteMember" },
          {
            type: "object",
            required: ["username", "type", "globalName", "nick", "avatar", "guildAvatar"],
            properties: {
              username: {
                type: "string",
                description: "Member username.",
                example: "statbot",
              },
              type: {
                type: "string",
                enum: enumValues.memberTypes,
                description: "Type of user.",
                example: "user",
              },
              globalName: {
                type: "string",
                description: "Member global name, or empty string when not available.",
                example: "Statbot",
              },
              nick: {
                type: "string",
                description: "Member guild nickname, or empty string when not available.",
                example: "Best Bot",
              },
              avatar: {
                type: "string",
                description: "Member avatar hash, or empty string when not available.",
                example: "abc123def456",
              },
              guildAvatar: {
                type: "string",
                description: "Member guild avatar hash, or empty string when not available.",
                example: "abc123def456",
              },
            },
          },
        ],
      },
      MemberCountsEntry: {
        type: "object",
        required: [
          "id",
          "messageCount",
          "voiceCount",
          "messageChannelCount",
          "voiceChannelCount",
          "username",
          "type",
          "globalName",
          "nick",
          "avatar",
          "guildAvatar",
        ],
        properties: {
          id: { $ref: "#/components/schemas/Snowflake" },
          messageCount: integerSchema("Count of messages associated with the data point."),
          voiceCount: integerSchema("Count of voice activity associated with the data point."),
          messageChannelCount: integerSchema(
            "Number of message channels associated with the data point.",
          ),
          voiceChannelCount: integerSchema(
            "Number of voice channels associated with the data point.",
          ),
          username: {
            type: "string",
            description: "Member username.",
            example: "statbot",
          },
          type: {
            type: "string",
            enum: enumValues.memberTypes,
            description: "Type of user.",
            example: "user",
          },
          globalName: {
            type: "string",
            description: "Member global name, or empty string when not available.",
            example: "Statbot",
          },
          nick: {
            type: "string",
            description: "Member guild nickname, or empty string when not available.",
            example: "Best Bot",
          },
          avatar: {
            type: "string",
            description: "Member avatar hash, or empty string when not available.",
            example: "abc123def456",
          },
          guildAvatar: {
            type: "string",
            description: "Member guild avatar hash, or empty string when not available.",
            example: "abc123def456",
          },
        },
      },
      ChannelResult: {
        oneOf: [
          { $ref: "#/components/schemas/Channel" },
          { $ref: "#/components/schemas/AggregateChannel" },
        ],
      },
      TopChannelResult: {
        oneOf: [
          { $ref: "#/components/schemas/TopChannel" },
          { $ref: "#/components/schemas/TopAggregateChannel" },
        ],
      },
    },
  };
}
