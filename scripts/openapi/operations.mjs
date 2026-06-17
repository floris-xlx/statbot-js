const parameterGroups = {
  timeRange: ["Start", "TimezoneOffset", "Interval", "End"],
  memberFilters: [
    "Bot",
    "WhitelistMembers",
    "BlacklistMembers",
    "WhitelistRoles",
    "BlacklistRoles",
  ],
  channelFilters: [
    "WhitelistChannels",
    "BlacklistChannels",
    "WhitelistVoiceChannels",
    "BlacklistVoiceChannels",
  ],
  activityFilters: ["WhitelistActivities", "BlacklistActivities"],
  inviteFilters: [
    "WhitelistInvites",
    "BlacklistInvites",
    "WhitelistInviteFlagsMask",
    "WhitelistInviteFlagsType",
    "BlacklistInviteFlagsMask",
    "BlacklistInviteFlagsType",
  ],
  topPagination: ["Limit", "Order", "PageSize", "Page", "Select"],
  seriesPagination: ["Limit", "Order"],
};

function parameterRefs(names) {
  return names.map((name) => ({
    $ref: `#/components/parameters/${name}`,
  }));
}

function rateLimitHeaders() {
  return {
    "x-ratelimit-limit": {
      $ref: "#/components/headers/XRateLimitLimit",
    },
    "x-ratelimit-remaining": {
      $ref: "#/components/headers/XRateLimitRemaining",
    },
    "x-ratelimit-reset": {
      $ref: "#/components/headers/XRateLimitReset",
    },
    "retry-after": {
      $ref: "#/components/headers/RetryAfter",
    },
  };
}

function okResponse(description, schema) {
  return {
    description,
    headers: rateLimitHeaders(),
    content: {
      "application/json": {
        schema,
      },
    },
  };
}

function jsonArrayOf(schemaRef) {
  return {
    type: "array",
    items: {
      $ref: `#/components/schemas/${schemaRef}`,
    },
  };
}

function schemaRef(name) {
  return {
    $ref: `#/components/schemas/${name}`,
  };
}

function withCommonMetadata(page, operation) {
  return {
    summary: page.summary,
    description: page.description,
    security: [{ BearerAuth: [] }],
    "x-source-markdown": page.file,
    ...operation,
  };
}

export function createOperations(routePages) {
  const getPage = (path) => {
    const page = routePages.get(path);
    if (!page) {
      throw new Error(`Missing source page for path: ${path}`);
    }
    return page;
  };

  const operations = {};

  operations["/v1/activities"] = {
    get: withCommonMetadata(getPage("/v1/activities"), {
      operationId: "getActivities",
      tags: ["Activities"],
      responses: {
        200: okResponse("A list of activities.", jsonArrayOf("Activity")),
        401: {
          $ref: "#/components/responses/Unauthorized",
        },
      },
    }),
  };

  operations["/v1/guilds/{guild_id}/activities/series"] = {
    get: withCommonMetadata(getPage("/v1/guilds/{guild_id}/activities/series"), {
      operationId: "getActivitySeries",
      tags: ["Activities"],
      parameters: [
        ...parameterRefs(["GuildId"]),
        ...parameterRefs(parameterGroups.timeRange),
        ...parameterRefs([
          "WhitelistMembers",
          "BlacklistMembers",
          "WhitelistRoles",
          "BlacklistRoles",
          "WhitelistActivities",
          "BlacklistActivities",
        ]),
        ...parameterRefs(["Limit", "Order", "ByActivity", "ByMember"]),
      ],
      responses: {
        200: okResponse(
          "A timeseries of activity counts. Use the `by_*` query parameters to group data.",
          jsonArrayOf("ActivitySeriesPoint"),
        ),
        401: {
          $ref: "#/components/responses/Unauthorized",
        },
      },
    }),
  };

  operations["/v1/guilds/{guild_id}/activities/tops/activities"] = {
    get: withCommonMetadata(getPage("/v1/guilds/{guild_id}/activities/tops/activities"), {
      operationId: "getTopActivities",
      tags: ["Activities"],
      parameters: [
        ...parameterRefs(["GuildId"]),
        ...parameterRefs(parameterGroups.timeRange),
        ...parameterRefs([
          "WhitelistMembers",
          "BlacklistMembers",
          "WhitelistRoles",
          "BlacklistRoles",
          "WhitelistActivities",
          "BlacklistActivities",
        ]),
        ...parameterRefs(parameterGroups.topPagination),
      ],
      responses: {
        200: okResponse("A list of top activities for a guild.", jsonArrayOf("TopActivity")),
        401: {
          $ref: "#/components/responses/Unauthorized",
        },
      },
    }),
  };

  operations["/v1/guilds/{guild_id}/messages/series"] = {
    get: withCommonMetadata(getPage("/v1/guilds/{guild_id}/messages/series"), {
      operationId: "getMessageSeries",
      tags: ["Messages"],
      parameters: [
        ...parameterRefs(["GuildId"]),
        ...parameterRefs(parameterGroups.timeRange),
        ...parameterRefs([
          ...parameterGroups.memberFilters,
          ...parameterGroups.channelFilters,
          "Limit",
          "Order",
          "ByChannel",
          "ByMember",
          "ByFlag",
        ]),
      ],
      responses: {
        200: okResponse(
          "A timeseries of counts. Use the `by_*` query parameters to group data.",
          jsonArrayOf("MessageSeriesPoint"),
        ),
        401: {
          $ref: "#/components/responses/Unauthorized",
        },
      },
    }),
  };

  operations["/v1/guilds/{guild_id}/messages/tops/members"] = {
    get: withCommonMetadata(getPage("/v1/guilds/{guild_id}/messages/tops/members"), {
      operationId: "getTopMessageMembers",
      tags: ["Messages"],
      parameters: [
        ...parameterRefs(["GuildId"]),
        ...parameterRefs(parameterGroups.timeRange),
        ...parameterRefs([
          ...parameterGroups.memberFilters,
          ...parameterGroups.channelFilters,
          ...parameterGroups.topPagination,
          "Full",
        ]),
      ],
      responses: {
        200: okResponse("Top message members for a guild.", {
          oneOf: [jsonArrayOf("PartialTopMember"), jsonArrayOf("TopMember")],
        }),
        401: {
          $ref: "#/components/responses/Unauthorized",
        },
      },
    }),
  };

  operations["/v1/guilds/{guild_id}/messages/tops/channels"] = {
    get: withCommonMetadata(getPage("/v1/guilds/{guild_id}/messages/tops/channels"), {
      operationId: "getTopMessageChannels",
      tags: ["Messages"],
      parameters: [
        ...parameterRefs(["GuildId"]),
        ...parameterRefs(parameterGroups.timeRange),
        ...parameterRefs([
          ...parameterGroups.memberFilters,
          ...parameterGroups.channelFilters,
          ...parameterGroups.topPagination,
          "Full",
        ]),
      ],
      responses: {
        200: okResponse("Top message channels for a guild.", {
          oneOf: [jsonArrayOf("PartialTopChannel"), jsonArrayOf("TopChannelResult")],
        }),
        401: {
          $ref: "#/components/responses/Unauthorized",
        },
      },
    }),
  };

  operations["/v1/guilds/{guild_id}/messages/sums"] = {
    get: withCommonMetadata(getPage("/v1/guilds/{guild_id}/messages/sums"), {
      operationId: "getMessageCount",
      tags: ["Messages"],
      parameters: [
        ...parameterRefs(["GuildId"]),
        ...parameterRefs(parameterGroups.timeRange),
        ...parameterRefs([...parameterGroups.memberFilters, ...parameterGroups.channelFilters]),
      ],
      responses: {
        200: okResponse("Aggregated message count for the selected filters.", schemaRef("SumResponse")),
        401: {
          $ref: "#/components/responses/Unauthorized",
        },
      },
    }),
  };

  operations["/v1/guilds/{guild_id}/voice/series"] = {
    get: withCommonMetadata(getPage("/v1/guilds/{guild_id}/voice/series"), {
      operationId: "getVoiceSeries",
      tags: ["Voice"],
      parameters: [
        ...parameterRefs(["GuildId"]),
        ...parameterRefs(parameterGroups.timeRange),
        ...parameterRefs([
          ...parameterGroups.memberFilters,
          ...parameterGroups.channelFilters,
          "VoiceStates",
          "Limit",
          "Order",
          "ByChannel",
          "ByMember",
          "ByState",
          "ByFlag",
        ]),
      ],
      responses: {
        200: okResponse(
          "A timeseries of voice activity counts. Use the `by_*` query parameters to group data.",
          jsonArrayOf("VoiceSeriesPoint"),
        ),
        401: {
          $ref: "#/components/responses/Unauthorized",
        },
      },
    }),
  };

  operations["/v1/guilds/{guild_id}/voice/tops/members"] = {
    get: withCommonMetadata(getPage("/v1/guilds/{guild_id}/voice/tops/members"), {
      operationId: "getTopVoiceMembers",
      tags: ["Voice"],
      parameters: [
        ...parameterRefs(["GuildId"]),
        ...parameterRefs(parameterGroups.timeRange),
        ...parameterRefs([
          ...parameterGroups.memberFilters,
          ...parameterGroups.channelFilters,
          "VoiceStates",
          ...parameterGroups.topPagination,
          "Full",
        ]),
      ],
      responses: {
        200: okResponse("Top voice members for a guild.", {
          oneOf: [jsonArrayOf("PartialTopMember"), jsonArrayOf("TopMember")],
        }),
        401: {
          $ref: "#/components/responses/Unauthorized",
        },
      },
    }),
  };

  operations["/v1/guilds/{guild_id}/voice/tops/channels"] = {
    get: withCommonMetadata(getPage("/v1/guilds/{guild_id}/voice/tops/channels"), {
      operationId: "getTopVoiceChannels",
      tags: ["Voice"],
      parameters: [
        ...parameterRefs(["GuildId"]),
        ...parameterRefs(parameterGroups.timeRange),
        ...parameterRefs([
          ...parameterGroups.memberFilters,
          ...parameterGroups.channelFilters,
          "VoiceStates",
          ...parameterGroups.topPagination,
          "Full",
        ]),
      ],
      responses: {
        200: okResponse("Top voice channels for a guild.", {
          oneOf: [jsonArrayOf("PartialTopChannel"), jsonArrayOf("TopChannelResult")],
        }),
        401: {
          $ref: "#/components/responses/Unauthorized",
        },
      },
    }),
  };

  operations["/v1/guilds/{guild_id}/voice/sums"] = {
    get: withCommonMetadata(getPage("/v1/guilds/{guild_id}/voice/sums"), {
      operationId: "getVoiceCount",
      tags: ["Voice"],
      parameters: [
        ...parameterRefs(["GuildId"]),
        ...parameterRefs(parameterGroups.timeRange),
        ...parameterRefs([
          ...parameterGroups.memberFilters,
          ...parameterGroups.channelFilters,
          "VoiceStates",
        ]),
      ],
      responses: {
        200: okResponse("Aggregated voice minutes for the selected filters.", schemaRef("SumResponse")),
        401: {
          $ref: "#/components/responses/Unauthorized",
        },
      },
    }),
  };

  operations["/v1/guilds/{guild_id}/membercounts/series"] = {
    get: withCommonMetadata(getPage("/v1/guilds/{guild_id}/membercounts/series"), {
      operationId: "getMemberCountSeries",
      tags: ["Guild Counts"],
      parameters: [
        ...parameterRefs(["GuildId"]),
        ...parameterRefs([...parameterGroups.timeRange, "Limit", "Order"]),
      ],
      responses: {
        200: okResponse("Member count series for a guild.", jsonArrayOf("MemberCountSeriesPoint")),
        401: {
          $ref: "#/components/responses/Unauthorized",
        },
      },
    }),
  };

  operations["/v1/guilds/{guild_id}/statuses/series"] = {
    get: withCommonMetadata(getPage("/v1/guilds/{guild_id}/statuses/series"), {
      operationId: "getStatusSeries",
      tags: ["Guild Counts"],
      parameters: [
        ...parameterRefs(["GuildId"]),
        ...parameterRefs([...parameterGroups.timeRange, "Limit", "Order"]),
      ],
      responses: {
        200: okResponse("Status series for a guild.", jsonArrayOf("StatusSeriesPoint")),
        401: {
          $ref: "#/components/responses/Unauthorized",
        },
      },
    }),
  };

  operations["/v1/guilds/{guild_id}/counts/members"] = {
    get: withCommonMetadata(getPage("/v1/guilds/{guild_id}/counts/members"), {
      operationId: "getMembersWithCounts",
      tags: ["Guild Counts"],
      parameters: [
        ...parameterRefs(["GuildId"]),
        ...parameterRefs(parameterGroups.timeRange),
        ...parameterRefs([
          ...parameterGroups.memberFilters,
          ...parameterGroups.channelFilters,
          "VoiceStates",
        ]),
      ],
      responses: {
        200: okResponse("Members with aggregated message and voice counts.", jsonArrayOf("MemberCountsEntry")),
        401: {
          $ref: "#/components/responses/Unauthorized",
        },
      },
    }),
  };

  operations["/v1/guilds/{guild_id}/counts/members/series"] = {
    get: withCommonMetadata(getPage("/v1/guilds/{guild_id}/counts/members/series"), {
      operationId: "getUniqueMemberCountSeries",
      tags: ["Guild Counts"],
      parameters: [
        ...parameterRefs(["GuildId"]),
        ...parameterRefs([
          "Stats",
          ...parameterGroups.timeRange,
          ...parameterGroups.memberFilters,
          ...parameterGroups.channelFilters,
          "Limit",
          "Order",
          "VoiceStates",
        ]),
      ],
      responses: {
        200: okResponse(
          "A list of unique member counts (participants) for a guild.",
          jsonArrayOf("UniqueCountSeriesPoint"),
        ),
        401: {
          $ref: "#/components/responses/Unauthorized",
        },
      },
    }),
  };

  operations["/v1/guilds/{guild_id}/counts/channels/series"] = {
    get: withCommonMetadata(getPage("/v1/guilds/{guild_id}/counts/channels/series"), {
      operationId: "getUniqueChannelCountSeries",
      tags: ["Guild Counts"],
      parameters: [
        ...parameterRefs(["GuildId"]),
        ...parameterRefs([
          "Stats",
          ...parameterGroups.timeRange,
          ...parameterGroups.memberFilters,
          ...parameterGroups.channelFilters,
          "Limit",
          "Order",
          "VoiceStates",
        ]),
      ],
      responses: {
        200: okResponse(
          "A list of unique channel counts (participants) for a guild.",
          jsonArrayOf("UniqueCountSeriesPoint"),
        ),
        401: {
          $ref: "#/components/responses/Unauthorized",
        },
      },
    }),
  };

  operations["/v1/guilds/{guild_id}/invites/series"] = {
    get: withCommonMetadata(getPage("/v1/guilds/{guild_id}/invites/series"), {
      operationId: "getInviteSeries",
      tags: ["Invites"],
      parameters: [
        ...parameterRefs(["GuildId"]),
        ...parameterRefs(parameterGroups.timeRange),
        ...parameterRefs([
          ...parameterGroups.memberFilters,
          ...parameterGroups.inviteFilters,
          "Limit",
          "Order",
          "ByInvite",
          "ByInviter",
          "ByInvitee",
        ]),
      ],
      responses: {
        200: okResponse(
          "A timeseries of invite counts. Use the `by_*` query parameters to group data.",
          jsonArrayOf("InviteSeriesPoint"),
        ),
        401: {
          $ref: "#/components/responses/Unauthorized",
        },
      },
    }),
  };

  operations["/v1/guilds/{guild_id}/invites/tops/invites"] = {
    get: withCommonMetadata(getPage("/v1/guilds/{guild_id}/invites/tops/invites"), {
      operationId: "getTopInvites",
      tags: ["Invites"],
      parameters: [
        ...parameterRefs(["GuildId"]),
        ...parameterRefs(parameterGroups.timeRange),
        ...parameterRefs([
          ...parameterGroups.memberFilters,
          ...parameterGroups.inviteFilters,
          ...parameterGroups.topPagination,
          "Full",
        ]),
      ],
      responses: {
        200: okResponse("Top invites for a guild.", {
          oneOf: [jsonArrayOf("PartialTopInvite"), jsonArrayOf("TopInvite")],
        }),
        401: {
          $ref: "#/components/responses/Unauthorized",
        },
      },
    }),
  };

  operations["/v1/guilds/{guild_id}/invites/tops/members"] = {
    get: withCommonMetadata(getPage("/v1/guilds/{guild_id}/invites/tops/members"), {
      operationId: "getTopInviteMembers",
      tags: ["Invites"],
      parameters: [
        ...parameterRefs(["GuildId"]),
        ...parameterRefs(parameterGroups.timeRange),
        ...parameterRefs([
          ...parameterGroups.memberFilters,
          ...parameterGroups.inviteFilters,
          ...parameterGroups.topPagination,
          "Full",
        ]),
      ],
      responses: {
        200: okResponse("Top invite members for a guild.", {
          oneOf: [jsonArrayOf("PartialTopInviteMember"), jsonArrayOf("TopInviteMember")],
        }),
        401: {
          $ref: "#/components/responses/Unauthorized",
        },
      },
    }),
  };

  operations["/v1/guilds/{guild_id}/invites/{invite_id}"] = {
    get: withCommonMetadata(getPage("/v1/guilds/{guild_id}/invites/{invite_id}"), {
      operationId: "getInvite",
      tags: ["Invites"],
      parameters: [...parameterRefs(["GuildId", "InviteId"])],
      responses: {
        200: okResponse("A single invite.", schemaRef("Invite")),
        401: {
          $ref: "#/components/responses/Unauthorized",
        },
      },
    }),
  };

  operations["/v1/guilds/{guild_id}/invites"] = {
    get: withCommonMetadata(getPage("/v1/guilds/{guild_id}/invites"), {
      operationId: "getInvites",
      tags: ["Invites"],
      parameters: [...parameterRefs(["GuildId"])],
      responses: {
        200: okResponse("A list of invites.", jsonArrayOf("Invite")),
        401: {
          $ref: "#/components/responses/Unauthorized",
        },
      },
    }),
  };

  operations["/v1/guilds/{guild_id}/channels/{channel_id}"] = {
    get: withCommonMetadata(getPage("/v1/guilds/{guild_id}/channels/{channel_id}"), {
      operationId: "getChannel",
      tags: ["Channels"],
      parameters: [...parameterRefs(["GuildId", "ChannelId"])],
      responses: {
        200: okResponse("A single channel.", schemaRef("ChannelResult")),
        401: {
          $ref: "#/components/responses/Unauthorized",
        },
      },
    }),
  };

  operations["/v1/guilds/{guild_id}/channels"] = {
    get: withCommonMetadata(getPage("/v1/guilds/{guild_id}/channels"), {
      operationId: "getChannels",
      tags: ["Channels"],
      parameters: [...parameterRefs(["GuildId", "Types", "Ids"])],
      responses: {
        200: okResponse("A list of channels.", jsonArrayOf("ChannelResult")),
        401: {
          $ref: "#/components/responses/Unauthorized",
        },
      },
    }),
  };

  return operations;
}
