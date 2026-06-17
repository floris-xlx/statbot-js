import createClient, { type Middleware } from "openapi-fetch";
import { StatbotApiError } from "./errors.js";
import type {
  ActivitySeriesQuery,
  GetChannelsQuery,
  InviteSeriesQuery,
  MemberCountSeriesQuery,
  MembersWithCountsQuery,
  MessageCountQuery,
  MessageSeriesQuery,
  StatusSeriesQuery,
  TopActivitiesQuery,
  TopInviteMembersQuery,
  TopInvitesQuery,
  TopMessageChannelsQuery,
  TopMessageMembersQuery,
  TopVoiceChannelsQuery,
  TopVoiceMembersQuery,
  UniqueChannelCountSeriesQuery,
  UniqueMemberCountSeriesQuery,
  VoiceCountQuery,
  VoiceSeriesQuery,
} from "./query-types.js";
import type { StatbotPaths } from "./types.js";

const DEFAULT_BASE_URL = "https://api.statbot.net";

type PathKey = keyof StatbotPaths & string;

type GetOperation<P extends PathKey> = StatbotPaths[P] extends { get: infer TGet }
  ? TGet
  : never;

type PathParams<P extends PathKey> = GetOperation<P> extends {
  parameters: { path: infer TPath };
}
  ? TPath
  : never;

type RawQuery<P extends PathKey> = GetOperation<P> extends {
  parameters: { query?: infer TQuery };
}
  ? TQuery
  : never;

type JsonResponse<TResponse> = TResponse extends {
  content: { "application/json": infer TJson };
}
  ? TJson
  : never;

type SuccessResponse<P extends PathKey> = GetOperation<P> extends {
  responses: infer TResponses;
}
  ? TResponses extends { 200: infer TOk }
    ? JsonResponse<TOk>
    : never
  : never;

type FetchClient = ReturnType<typeof createClient<StatbotPaths>>;
type TokenProvider = string | (() => string | Promise<string> | undefined);

export interface StatbotClientOptions {
  baseUrl?: string;
  token?: TokenProvider;
  headers?: HeadersInit;
  fetch?: typeof globalThis.fetch;
}

interface GetRequestOptions<P extends PathKey> {
  path?: PathParams<P>;
  query?: RawQuery<P>;
}

const ARRAY_QUERY_KEYS = {
  messageSeries: [
    "whitelist_members",
    "blacklist_members",
    "whitelist_roles",
    "blacklist_roles",
    "whitelist_channels",
    "blacklist_channels",
    "whitelist_voice_channels",
    "blacklist_voice_channels",
  ],
  voiceSeries: [
    "whitelist_members",
    "blacklist_members",
    "whitelist_roles",
    "blacklist_roles",
    "whitelist_channels",
    "blacklist_channels",
    "whitelist_voice_channels",
    "blacklist_voice_channels",
    "voice_states",
  ],
  activitySeries: [
    "whitelist_members",
    "blacklist_members",
    "whitelist_roles",
    "blacklist_roles",
    "whitelist_activities",
    "blacklist_activities",
  ],
  uniqueCountSeries: [
    "stats",
    "whitelist_members",
    "blacklist_members",
    "whitelist_roles",
    "blacklist_roles",
    "whitelist_channels",
    "blacklist_channels",
    "whitelist_voice_channels",
    "blacklist_voice_channels",
    "voice_states",
  ],
  topActivities: [
    "whitelist_members",
    "blacklist_members",
    "whitelist_roles",
    "blacklist_roles",
    "whitelist_activities",
    "blacklist_activities",
    "select",
  ],
  topMessages: [
    "whitelist_members",
    "blacklist_members",
    "whitelist_roles",
    "blacklist_roles",
    "whitelist_channels",
    "blacklist_channels",
    "whitelist_voice_channels",
    "blacklist_voice_channels",
    "select",
  ],
  topVoice: [
    "whitelist_members",
    "blacklist_members",
    "whitelist_roles",
    "blacklist_roles",
    "whitelist_channels",
    "blacklist_channels",
    "whitelist_voice_channels",
    "blacklist_voice_channels",
    "voice_states",
    "select",
  ],
  topInvites: [
    "whitelist_members",
    "blacklist_members",
    "whitelist_roles",
    "blacklist_roles",
    "whitelist_invites",
    "blacklist_invites",
    "select",
  ],
  membersWithCounts: [
    "whitelist_members",
    "blacklist_members",
    "whitelist_roles",
    "blacklist_roles",
    "whitelist_channels",
    "blacklist_channels",
    "whitelist_voice_channels",
    "blacklist_voice_channels",
    "voice_states",
  ],
  getChannels: ["types", "ids"],
};

function toRawQuery<TRawQuery>(
  query: object | undefined,
  arrayKeys: readonly string[],
): TRawQuery | undefined {
  if (!query) {
    return undefined;
  }

  const arrayKeySet = new Set(arrayKeys);
  const rawEntries = Object.entries(query).flatMap(([key, value]) => {
    if (value === undefined) {
      return [];
    }

    const serializedKey = arrayKeySet.has(key) ? `${key}[]` : key;
    return [[serializedKey, value]];
  });

  if (rawEntries.length === 0) {
    return undefined;
  }

  return Object.fromEntries(rawEntries) as TRawQuery;
}

async function resolveToken(token: TokenProvider): Promise<string | undefined> {
  if (typeof token === "function") {
    return token();
  }

  return token;
}

function createAuthMiddleware(token: TokenProvider): Middleware {
  return {
    async onRequest({ request }) {
      const resolvedToken = await resolveToken(token);
      if (resolvedToken) {
        request.headers.set("Authorization", `Bearer ${resolvedToken}`);
      }
      return request;
    },
  };
}

export class StatbotClient {
  private readonly client: FetchClient;

  constructor(options: StatbotClientOptions = {}) {
    this.client = createClient<StatbotPaths>({
      baseUrl: options.baseUrl ?? DEFAULT_BASE_URL,
      headers: options.headers,
      fetch: options.fetch,
    });

    if (options.token) {
      this.client.use(createAuthMiddleware(options.token));
    }
  }

  get raw() {
    return this.client;
  }

  private async get<P extends PathKey>(
    path: P,
    options: GetRequestOptions<P> = {},
  ): Promise<SuccessResponse<P>> {
    const requestOptions: {
      params?: {
        path?: PathParams<P>;
        query?: RawQuery<P>;
      };
    } = {};

    if (options.path || options.query) {
      requestOptions.params = {};

      if (options.path) {
        requestOptions.params.path = options.path;
      }

      if (options.query) {
        requestOptions.params.query = options.query;
      }
    }

    const { data, error, response } = await this.client.GET(
      path,
      requestOptions as never,
    );

    if (error) {
      throw new StatbotApiError(response.status, error, response);
    }

    if (data === undefined) {
      throw new StatbotApiError(
        response.status,
        { message: "Statbot returned an empty response body." },
        response,
      );
    }

    return data as SuccessResponse<P>;
  }

  getActivities() {
    return this.get("/v1/activities");
  }

  getActivitySeries(guildId: string, query?: ActivitySeriesQuery) {
    return this.get("/v1/guilds/{guild_id}/activities/series", {
      path: { guild_id: guildId },
      query: toRawQuery<RawQuery<"/v1/guilds/{guild_id}/activities/series">>(
        query,
        ARRAY_QUERY_KEYS.activitySeries,
      ),
    });
  }

  getTopActivities(guildId: string, query?: TopActivitiesQuery) {
    return this.get("/v1/guilds/{guild_id}/activities/tops/activities", {
      path: { guild_id: guildId },
      query: toRawQuery<RawQuery<"/v1/guilds/{guild_id}/activities/tops/activities">>(
        query,
        ARRAY_QUERY_KEYS.topActivities,
      ),
    });
  }

  getMessageSeries(guildId: string, query?: MessageSeriesQuery) {
    return this.get("/v1/guilds/{guild_id}/messages/series", {
      path: { guild_id: guildId },
      query: toRawQuery<RawQuery<"/v1/guilds/{guild_id}/messages/series">>(
        query,
        ARRAY_QUERY_KEYS.messageSeries,
      ),
    });
  }

  getTopMessageMembers(guildId: string, query?: TopMessageMembersQuery) {
    return this.get("/v1/guilds/{guild_id}/messages/tops/members", {
      path: { guild_id: guildId },
      query: toRawQuery<RawQuery<"/v1/guilds/{guild_id}/messages/tops/members">>(
        query,
        ARRAY_QUERY_KEYS.topMessages,
      ),
    });
  }

  getTopMessageChannels(guildId: string, query?: TopMessageChannelsQuery) {
    return this.get("/v1/guilds/{guild_id}/messages/tops/channels", {
      path: { guild_id: guildId },
      query: toRawQuery<RawQuery<"/v1/guilds/{guild_id}/messages/tops/channels">>(
        query,
        ARRAY_QUERY_KEYS.topMessages,
      ),
    });
  }

  getMessageCount(guildId: string, query?: MessageCountQuery) {
    return this.get("/v1/guilds/{guild_id}/messages/sums", {
      path: { guild_id: guildId },
      query: toRawQuery<RawQuery<"/v1/guilds/{guild_id}/messages/sums">>(
        query,
        ARRAY_QUERY_KEYS.messageSeries,
      ),
    });
  }

  getVoiceSeries(guildId: string, query?: VoiceSeriesQuery) {
    return this.get("/v1/guilds/{guild_id}/voice/series", {
      path: { guild_id: guildId },
      query: toRawQuery<RawQuery<"/v1/guilds/{guild_id}/voice/series">>(
        query,
        ARRAY_QUERY_KEYS.voiceSeries,
      ),
    });
  }

  getTopVoiceMembers(guildId: string, query?: TopVoiceMembersQuery) {
    return this.get("/v1/guilds/{guild_id}/voice/tops/members", {
      path: { guild_id: guildId },
      query: toRawQuery<RawQuery<"/v1/guilds/{guild_id}/voice/tops/members">>(
        query,
        ARRAY_QUERY_KEYS.topVoice,
      ),
    });
  }

  getTopVoiceChannels(guildId: string, query?: TopVoiceChannelsQuery) {
    return this.get("/v1/guilds/{guild_id}/voice/tops/channels", {
      path: { guild_id: guildId },
      query: toRawQuery<RawQuery<"/v1/guilds/{guild_id}/voice/tops/channels">>(
        query,
        ARRAY_QUERY_KEYS.topVoice,
      ),
    });
  }

  getVoiceCount(guildId: string, query?: VoiceCountQuery) {
    return this.get("/v1/guilds/{guild_id}/voice/sums", {
      path: { guild_id: guildId },
      query: toRawQuery<RawQuery<"/v1/guilds/{guild_id}/voice/sums">>(
        query,
        ARRAY_QUERY_KEYS.voiceSeries,
      ),
    });
  }

  getMemberCountSeries(guildId: string, query?: MemberCountSeriesQuery) {
    return this.get("/v1/guilds/{guild_id}/membercounts/series", {
      path: { guild_id: guildId },
      query: toRawQuery<RawQuery<"/v1/guilds/{guild_id}/membercounts/series">>(query, []),
    });
  }

  getStatusSeries(guildId: string, query?: StatusSeriesQuery) {
    return this.get("/v1/guilds/{guild_id}/statuses/series", {
      path: { guild_id: guildId },
      query: toRawQuery<RawQuery<"/v1/guilds/{guild_id}/statuses/series">>(query, []),
    });
  }

  getUniqueMemberCountSeries(guildId: string, query?: UniqueMemberCountSeriesQuery) {
    return this.get("/v1/guilds/{guild_id}/counts/members/series", {
      path: { guild_id: guildId },
      query: toRawQuery<RawQuery<"/v1/guilds/{guild_id}/counts/members/series">>(
        query,
        ARRAY_QUERY_KEYS.uniqueCountSeries,
      ),
    });
  }

  getUniqueChannelCountSeries(
    guildId: string,
    query?: UniqueChannelCountSeriesQuery,
  ) {
    return this.get("/v1/guilds/{guild_id}/counts/channels/series", {
      path: { guild_id: guildId },
      query: toRawQuery<RawQuery<"/v1/guilds/{guild_id}/counts/channels/series">>(
        query,
        ARRAY_QUERY_KEYS.uniqueCountSeries,
      ),
    });
  }

  getMembersWithCounts(guildId: string, query?: MembersWithCountsQuery) {
    return this.get("/v1/guilds/{guild_id}/counts/members", {
      path: { guild_id: guildId },
      query: toRawQuery<RawQuery<"/v1/guilds/{guild_id}/counts/members">>(
        query,
        ARRAY_QUERY_KEYS.membersWithCounts,
      ),
    });
  }

  getInviteSeries(guildId: string, query?: InviteSeriesQuery) {
    return this.get("/v1/guilds/{guild_id}/invites/series", {
      path: { guild_id: guildId },
      query: toRawQuery<RawQuery<"/v1/guilds/{guild_id}/invites/series">>(
        query,
        ARRAY_QUERY_KEYS.topInvites,
      ),
    });
  }

  getTopInvites(guildId: string, query?: TopInvitesQuery) {
    return this.get("/v1/guilds/{guild_id}/invites/tops/invites", {
      path: { guild_id: guildId },
      query: toRawQuery<RawQuery<"/v1/guilds/{guild_id}/invites/tops/invites">>(
        query,
        ARRAY_QUERY_KEYS.topInvites,
      ),
    });
  }

  getTopInviteMembers(guildId: string, query?: TopInviteMembersQuery) {
    return this.get("/v1/guilds/{guild_id}/invites/tops/members", {
      path: { guild_id: guildId },
      query: toRawQuery<RawQuery<"/v1/guilds/{guild_id}/invites/tops/members">>(
        query,
        ARRAY_QUERY_KEYS.topInvites,
      ),
    });
  }

  getInvite(guildId: string, inviteId: number) {
    return this.get("/v1/guilds/{guild_id}/invites/{invite_id}", {
      path: { guild_id: guildId, invite_id: inviteId },
    });
  }

  getInvites(guildId: string) {
    return this.get("/v1/guilds/{guild_id}/invites", {
      path: { guild_id: guildId },
    });
  }

  getChannel(guildId: string, channelId: string) {
    return this.get("/v1/guilds/{guild_id}/channels/{channel_id}", {
      path: { guild_id: guildId, channel_id: channelId },
    });
  }

  getChannels(guildId: string, query?: GetChannelsQuery) {
    return this.get("/v1/guilds/{guild_id}/channels", {
      path: { guild_id: guildId },
      query: toRawQuery<RawQuery<"/v1/guilds/{guild_id}/channels">>(
        query,
        ARRAY_QUERY_KEYS.getChannels,
      ),
    });
  }
}
