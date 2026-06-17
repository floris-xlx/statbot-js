import createClient, { type Middleware } from "openapi-fetch";
import { z } from "zod";
import { StatbotApiError, StatbotValidationError } from "./errors.js";
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
import {
  ActivitySeriesQuerySchema,
  ChannelIdSchema,
  GetChannelsQuerySchema,
  GuildIdSchema,
  InviteIdSchema,
  InviteSeriesQuerySchema,
  MemberCountSeriesQuerySchema,
  MembersWithCountsQuerySchema,
  MessageCountQuerySchema,
  MessageSeriesQuerySchema,
  StatusSeriesQuerySchema,
  TopActivitiesQuerySchema,
  TopInviteMembersQuerySchema,
  TopInvitesQuerySchema,
  TopMessageChannelsQuerySchema,
  TopMessageMembersQuerySchema,
  TopVoiceChannelsQuerySchema,
  TopVoiceMembersQuerySchema,
  UniqueChannelCountSeriesQuerySchema,
  UniqueMemberCountSeriesQuerySchema,
  VoiceCountQuerySchema,
  VoiceSeriesQuerySchema,
} from "./validation.js";

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
type AnyZodSchema = z.ZodType<unknown>;

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
  query: unknown,
  arrayKeys: readonly string[],
): TRawQuery | undefined {
  if (!query) {
    return undefined;
  }

  const arrayKeySet = new Set(arrayKeys);
  const rawEntries = Object.entries(query as Record<string, unknown>).flatMap(
    ([key, value]) => {
    if (value === undefined) {
      return [];
    }

    const serializedKey = arrayKeySet.has(key) ? `${key}[]` : key;
    return [[serializedKey, value]];
    },
  );

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

function validateWithSchema<TSchema extends AnyZodSchema>(
  schema: TSchema,
  input: unknown,
  context: string,
): z.infer<TSchema> {
  const result = schema.safeParse(input);

  if (!result.success) {
    throw new StatbotValidationError(context, result.error);
  }

  return result.data as z.infer<TSchema>;
}

function validateOptionalWithSchema<TSchema extends AnyZodSchema>(
  schema: TSchema,
  input: unknown,
  context: string,
): z.infer<TSchema> | undefined {
  if (input === undefined) {
    return undefined;
  }

  return validateWithSchema(schema, input, context);
}

function toValidatedRawQuery<TSchema extends AnyZodSchema, TRawQuery>(
  schema: TSchema,
  query: unknown,
  context: string,
  arrayKeys: readonly string[],
): TRawQuery | undefined {
  const validatedQuery = validateOptionalWithSchema(schema, query, context);
  return toRawQuery<TRawQuery>(validatedQuery, arrayKeys);
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
    const validatedGuildId = validateWithSchema(
      GuildIdSchema,
      guildId,
      "Invalid guildId for getActivitySeries().",
    );
    return this.get("/v1/guilds/{guild_id}/activities/series", {
      path: { guild_id: validatedGuildId },
      query: toRawQuery<RawQuery<"/v1/guilds/{guild_id}/activities/series">>(
        validateOptionalWithSchema(
          ActivitySeriesQuerySchema,
          query,
          "Invalid query for getActivitySeries().",
        ),
        ARRAY_QUERY_KEYS.activitySeries,
      ),
    });
  }

  getTopActivities(guildId: string, query?: TopActivitiesQuery) {
    const validatedGuildId = validateWithSchema(
      GuildIdSchema,
      guildId,
      "Invalid guildId for getTopActivities().",
    );
    return this.get("/v1/guilds/{guild_id}/activities/tops/activities", {
      path: { guild_id: validatedGuildId },
      query: toValidatedRawQuery<
        typeof TopActivitiesQuerySchema,
        RawQuery<"/v1/guilds/{guild_id}/activities/tops/activities">
      >(
        TopActivitiesQuerySchema,
        query,
        "Invalid query for getTopActivities().",
        ARRAY_QUERY_KEYS.topActivities,
      ),
    });
  }

  getMessageSeries(guildId: string, query?: MessageSeriesQuery) {
    const validatedGuildId = validateWithSchema(
      GuildIdSchema,
      guildId,
      "Invalid guildId for getMessageSeries().",
    );
    return this.get("/v1/guilds/{guild_id}/messages/series", {
      path: { guild_id: validatedGuildId },
      query: toValidatedRawQuery<
        typeof MessageSeriesQuerySchema,
        RawQuery<"/v1/guilds/{guild_id}/messages/series">
      >(
        MessageSeriesQuerySchema,
        query,
        "Invalid query for getMessageSeries().",
        ARRAY_QUERY_KEYS.messageSeries,
      ),
    });
  }

  getTopMessageMembers(guildId: string, query?: TopMessageMembersQuery) {
    const validatedGuildId = validateWithSchema(
      GuildIdSchema,
      guildId,
      "Invalid guildId for getTopMessageMembers().",
    );
    return this.get("/v1/guilds/{guild_id}/messages/tops/members", {
      path: { guild_id: validatedGuildId },
      query: toValidatedRawQuery<
        typeof TopMessageMembersQuerySchema,
        RawQuery<"/v1/guilds/{guild_id}/messages/tops/members">
      >(
        TopMessageMembersQuerySchema,
        query,
        "Invalid query for getTopMessageMembers().",
        ARRAY_QUERY_KEYS.topMessages,
      ),
    });
  }

  getTopMessageChannels(guildId: string, query?: TopMessageChannelsQuery) {
    const validatedGuildId = validateWithSchema(
      GuildIdSchema,
      guildId,
      "Invalid guildId for getTopMessageChannels().",
    );
    return this.get("/v1/guilds/{guild_id}/messages/tops/channels", {
      path: { guild_id: validatedGuildId },
      query: toValidatedRawQuery<
        typeof TopMessageChannelsQuerySchema,
        RawQuery<"/v1/guilds/{guild_id}/messages/tops/channels">
      >(
        TopMessageChannelsQuerySchema,
        query,
        "Invalid query for getTopMessageChannels().",
        ARRAY_QUERY_KEYS.topMessages,
      ),
    });
  }

  getMessageCount(guildId: string, query?: MessageCountQuery) {
    const validatedGuildId = validateWithSchema(
      GuildIdSchema,
      guildId,
      "Invalid guildId for getMessageCount().",
    );
    return this.get("/v1/guilds/{guild_id}/messages/sums", {
      path: { guild_id: validatedGuildId },
      query: toValidatedRawQuery<
        typeof MessageCountQuerySchema,
        RawQuery<"/v1/guilds/{guild_id}/messages/sums">
      >(
        MessageCountQuerySchema,
        query,
        "Invalid query for getMessageCount().",
        ARRAY_QUERY_KEYS.messageSeries,
      ),
    });
  }

  getVoiceSeries(guildId: string, query?: VoiceSeriesQuery) {
    const validatedGuildId = validateWithSchema(
      GuildIdSchema,
      guildId,
      "Invalid guildId for getVoiceSeries().",
    );
    return this.get("/v1/guilds/{guild_id}/voice/series", {
      path: { guild_id: validatedGuildId },
      query: toValidatedRawQuery<
        typeof VoiceSeriesQuerySchema,
        RawQuery<"/v1/guilds/{guild_id}/voice/series">
      >(
        VoiceSeriesQuerySchema,
        query,
        "Invalid query for getVoiceSeries().",
        ARRAY_QUERY_KEYS.voiceSeries,
      ),
    });
  }

  getTopVoiceMembers(guildId: string, query?: TopVoiceMembersQuery) {
    const validatedGuildId = validateWithSchema(
      GuildIdSchema,
      guildId,
      "Invalid guildId for getTopVoiceMembers().",
    );
    return this.get("/v1/guilds/{guild_id}/voice/tops/members", {
      path: { guild_id: validatedGuildId },
      query: toValidatedRawQuery<
        typeof TopVoiceMembersQuerySchema,
        RawQuery<"/v1/guilds/{guild_id}/voice/tops/members">
      >(
        TopVoiceMembersQuerySchema,
        query,
        "Invalid query for getTopVoiceMembers().",
        ARRAY_QUERY_KEYS.topVoice,
      ),
    });
  }

  getTopVoiceChannels(guildId: string, query?: TopVoiceChannelsQuery) {
    const validatedGuildId = validateWithSchema(
      GuildIdSchema,
      guildId,
      "Invalid guildId for getTopVoiceChannels().",
    );
    return this.get("/v1/guilds/{guild_id}/voice/tops/channels", {
      path: { guild_id: validatedGuildId },
      query: toValidatedRawQuery<
        typeof TopVoiceChannelsQuerySchema,
        RawQuery<"/v1/guilds/{guild_id}/voice/tops/channels">
      >(
        TopVoiceChannelsQuerySchema,
        query,
        "Invalid query for getTopVoiceChannels().",
        ARRAY_QUERY_KEYS.topVoice,
      ),
    });
  }

  getVoiceCount(guildId: string, query?: VoiceCountQuery) {
    const validatedGuildId = validateWithSchema(
      GuildIdSchema,
      guildId,
      "Invalid guildId for getVoiceCount().",
    );
    return this.get("/v1/guilds/{guild_id}/voice/sums", {
      path: { guild_id: validatedGuildId },
      query: toValidatedRawQuery<
        typeof VoiceCountQuerySchema,
        RawQuery<"/v1/guilds/{guild_id}/voice/sums">
      >(
        VoiceCountQuerySchema,
        query,
        "Invalid query for getVoiceCount().",
        ARRAY_QUERY_KEYS.voiceSeries,
      ),
    });
  }

  getMemberCountSeries(guildId: string, query?: MemberCountSeriesQuery) {
    const validatedGuildId = validateWithSchema(
      GuildIdSchema,
      guildId,
      "Invalid guildId for getMemberCountSeries().",
    );
    return this.get("/v1/guilds/{guild_id}/membercounts/series", {
      path: { guild_id: validatedGuildId },
      query: toValidatedRawQuery<
        typeof MemberCountSeriesQuerySchema,
        RawQuery<"/v1/guilds/{guild_id}/membercounts/series">
      >(
        MemberCountSeriesQuerySchema,
        query,
        "Invalid query for getMemberCountSeries().",
        [],
      ),
    });
  }

  getStatusSeries(guildId: string, query?: StatusSeriesQuery) {
    const validatedGuildId = validateWithSchema(
      GuildIdSchema,
      guildId,
      "Invalid guildId for getStatusSeries().",
    );
    return this.get("/v1/guilds/{guild_id}/statuses/series", {
      path: { guild_id: validatedGuildId },
      query: toValidatedRawQuery<
        typeof StatusSeriesQuerySchema,
        RawQuery<"/v1/guilds/{guild_id}/statuses/series">
      >(
        StatusSeriesQuerySchema,
        query,
        "Invalid query for getStatusSeries().",
        [],
      ),
    });
  }

  getUniqueMemberCountSeries(guildId: string, query?: UniqueMemberCountSeriesQuery) {
    const validatedGuildId = validateWithSchema(
      GuildIdSchema,
      guildId,
      "Invalid guildId for getUniqueMemberCountSeries().",
    );
    return this.get("/v1/guilds/{guild_id}/counts/members/series", {
      path: { guild_id: validatedGuildId },
      query: toValidatedRawQuery<
        typeof UniqueMemberCountSeriesQuerySchema,
        RawQuery<"/v1/guilds/{guild_id}/counts/members/series">
      >(
        UniqueMemberCountSeriesQuerySchema,
        query,
        "Invalid query for getUniqueMemberCountSeries().",
        ARRAY_QUERY_KEYS.uniqueCountSeries,
      ),
    });
  }

  getUniqueChannelCountSeries(
    guildId: string,
    query?: UniqueChannelCountSeriesQuery,
  ) {
    const validatedGuildId = validateWithSchema(
      GuildIdSchema,
      guildId,
      "Invalid guildId for getUniqueChannelCountSeries().",
    );
    return this.get("/v1/guilds/{guild_id}/counts/channels/series", {
      path: { guild_id: validatedGuildId },
      query: toValidatedRawQuery<
        typeof UniqueChannelCountSeriesQuerySchema,
        RawQuery<"/v1/guilds/{guild_id}/counts/channels/series">
      >(
        UniqueChannelCountSeriesQuerySchema,
        query,
        "Invalid query for getUniqueChannelCountSeries().",
        ARRAY_QUERY_KEYS.uniqueCountSeries,
      ),
    });
  }

  getMembersWithCounts(guildId: string, query?: MembersWithCountsQuery) {
    const validatedGuildId = validateWithSchema(
      GuildIdSchema,
      guildId,
      "Invalid guildId for getMembersWithCounts().",
    );
    return this.get("/v1/guilds/{guild_id}/counts/members", {
      path: { guild_id: validatedGuildId },
      query: toValidatedRawQuery<
        typeof MembersWithCountsQuerySchema,
        RawQuery<"/v1/guilds/{guild_id}/counts/members">
      >(
        MembersWithCountsQuerySchema,
        query,
        "Invalid query for getMembersWithCounts().",
        ARRAY_QUERY_KEYS.membersWithCounts,
      ),
    });
  }

  getInviteSeries(guildId: string, query?: InviteSeriesQuery) {
    const validatedGuildId = validateWithSchema(
      GuildIdSchema,
      guildId,
      "Invalid guildId for getInviteSeries().",
    );
    return this.get("/v1/guilds/{guild_id}/invites/series", {
      path: { guild_id: validatedGuildId },
      query: toValidatedRawQuery<
        typeof InviteSeriesQuerySchema,
        RawQuery<"/v1/guilds/{guild_id}/invites/series">
      >(
        InviteSeriesQuerySchema,
        query,
        "Invalid query for getInviteSeries().",
        ARRAY_QUERY_KEYS.topInvites,
      ),
    });
  }

  getTopInvites(guildId: string, query?: TopInvitesQuery) {
    const validatedGuildId = validateWithSchema(
      GuildIdSchema,
      guildId,
      "Invalid guildId for getTopInvites().",
    );
    return this.get("/v1/guilds/{guild_id}/invites/tops/invites", {
      path: { guild_id: validatedGuildId },
      query: toValidatedRawQuery<
        typeof TopInvitesQuerySchema,
        RawQuery<"/v1/guilds/{guild_id}/invites/tops/invites">
      >(
        TopInvitesQuerySchema,
        query,
        "Invalid query for getTopInvites().",
        ARRAY_QUERY_KEYS.topInvites,
      ),
    });
  }

  getTopInviteMembers(guildId: string, query?: TopInviteMembersQuery) {
    const validatedGuildId = validateWithSchema(
      GuildIdSchema,
      guildId,
      "Invalid guildId for getTopInviteMembers().",
    );
    return this.get("/v1/guilds/{guild_id}/invites/tops/members", {
      path: { guild_id: validatedGuildId },
      query: toValidatedRawQuery<
        typeof TopInviteMembersQuerySchema,
        RawQuery<"/v1/guilds/{guild_id}/invites/tops/members">
      >(
        TopInviteMembersQuerySchema,
        query,
        "Invalid query for getTopInviteMembers().",
        ARRAY_QUERY_KEYS.topInvites,
      ),
    });
  }

  getInvite(guildId: string, inviteId: number) {
    const validatedGuildId = validateWithSchema(
      GuildIdSchema,
      guildId,
      "Invalid guildId for getInvite().",
    );
    const validatedInviteId = validateWithSchema(
      InviteIdSchema,
      inviteId,
      "Invalid inviteId for getInvite().",
    );
    return this.get("/v1/guilds/{guild_id}/invites/{invite_id}", {
      path: { guild_id: validatedGuildId, invite_id: validatedInviteId },
    });
  }

  getInvites(guildId: string) {
    const validatedGuildId = validateWithSchema(
      GuildIdSchema,
      guildId,
      "Invalid guildId for getInvites().",
    );
    return this.get("/v1/guilds/{guild_id}/invites", {
      path: { guild_id: validatedGuildId },
    });
  }

  getChannel(guildId: string, channelId: string) {
    const validatedGuildId = validateWithSchema(
      GuildIdSchema,
      guildId,
      "Invalid guildId for getChannel().",
    );
    const validatedChannelId = validateWithSchema(
      ChannelIdSchema,
      channelId,
      "Invalid channelId for getChannel().",
    );
    return this.get("/v1/guilds/{guild_id}/channels/{channel_id}", {
      path: { guild_id: validatedGuildId, channel_id: validatedChannelId },
    });
  }

  getChannels(guildId: string, query?: GetChannelsQuery) {
    const validatedGuildId = validateWithSchema(
      GuildIdSchema,
      guildId,
      "Invalid guildId for getChannels().",
    );
    return this.get("/v1/guilds/{guild_id}/channels", {
      path: { guild_id: validatedGuildId },
      query: toValidatedRawQuery<
        typeof GetChannelsQuerySchema,
        RawQuery<"/v1/guilds/{guild_id}/channels">
      >(
        GetChannelsQuerySchema,
        query,
        "Invalid query for getChannels().",
        ARRAY_QUERY_KEYS.getChannels,
      ),
    });
  }
}
