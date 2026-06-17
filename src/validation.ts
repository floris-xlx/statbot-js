import { z } from "zod";

const snowflakeMessage =
  "Discord snowflake IDs must be numeric strings between 17 and 20 digits.";
const positiveIntegerMessage = "Value must be a positive integer.";

function addMutuallyExclusiveIssues(
  value: Record<string, unknown>,
  ctx: z.RefinementCtx,
  pairs: Array<readonly [string, string]>,
) {
  for (const [left, right] of pairs) {
    if (value[left] !== undefined && value[right] !== undefined) {
      ctx.addIssue({
        code: "custom",
        path: [right],
        message: `\`${right}\` cannot be used together with \`${left}\`.`,
      });
    }
  }
}

function addStartEndIssue(
  value: {
    start?: number;
    end?: number;
  },
  ctx: z.RefinementCtx,
) {
  if (value.start !== undefined && value.end !== undefined && value.start > value.end) {
    ctx.addIssue({
      code: "custom",
      path: ["end"],
      message: "`end` must be greater than or equal to `start`.",
    });
  }
}

function addTopPaginationIssues(
  value: {
    limit?: number;
    page_size?: number;
    page?: number;
    select?: unknown[];
  },
  ctx: z.RefinementCtx,
) {
  if (
    value.limit !== undefined &&
    (value.page_size !== undefined || value.page !== undefined || value.select !== undefined)
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["limit"],
      message: "`limit` cannot be combined with `page_size`, `page`, or `select`.",
    });
  }

  if (
    value.select !== undefined &&
    (value.limit !== undefined || value.page_size !== undefined || value.page !== undefined)
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["select"],
      message: "`select` cannot be combined with `limit`, `page_size`, or `page`.",
    });
  }

  const hasPageSize = value.page_size !== undefined;
  const hasPage = value.page !== undefined;

  if (hasPageSize !== hasPage) {
    ctx.addIssue({
      code: "custom",
      path: [hasPageSize ? "page" : "page_size"],
      message: "`page_size` and `page` must be provided together.",
    });
  }
}

function addInviteFlagIssues(
  value: {
    whitelist_invite_flags_mask?: number;
    whitelist_invite_flags_type?: string;
    blacklist_invite_flags_mask?: number;
    blacklist_invite_flags_type?: string;
  },
  ctx: z.RefinementCtx,
) {
  const inviteFlagPairs = [
    ["whitelist_invite_flags_mask", "whitelist_invite_flags_type"],
    ["blacklist_invite_flags_mask", "blacklist_invite_flags_type"],
  ] as const;

  for (const [maskKey, typeKey] of inviteFlagPairs) {
    const hasMask = value[maskKey] !== undefined;
    const hasType = value[typeKey] !== undefined;

    if (hasMask !== hasType) {
      ctx.addIssue({
        code: "custom",
        path: [hasMask ? typeKey : maskKey],
        message: `\`${maskKey}\` and \`${typeKey}\` must be provided together.`,
      });
    }
  }
}

export const SnowflakeSchema = z
  .string()
  .trim()
  .min(17, { error: snowflakeMessage })
  .max(20, { error: snowflakeMessage })
  .regex(/^[0-9]+$/, { error: snowflakeMessage });

export const GuildIdSchema = SnowflakeSchema;
export const ChannelIdSchema = SnowflakeSchema;
export const MemberIdSchema = SnowflakeSchema;
export const RoleIdSchema = SnowflakeSchema;

export const IntervalSchema = z.enum(["hour", "day", "week", "month"]);
export const SortOrderSchema = z.enum(["asc", "desc"]);
export const VoiceStateSchema = z.enum([
  "normal",
  "afk",
  "self_mute",
  "self_deaf",
  "server_mute",
  "server_deaf",
]);
export const InviteFlagFilterTypeSchema = z.enum(["any", "all"]);
export const UniqueCountStatSchema = z.enum(["text", "voice"]);
export const ChannelFilterTypeSchema = z.union([
  z.literal(0),
  z.literal(2),
  z.literal(4),
  z.literal(5),
  z.literal(13),
  z.literal(15),
  z.literal(999),
]);

export const PositiveIntegerSchema = z
  .number()
  .int({ error: positiveIntegerMessage })
  .min(1, { error: positiveIntegerMessage });

export const InviteIdSchema = PositiveIntegerSchema;

export const UnixTimestampSchema = z
  .number()
  .int({ error: "Unix timestamps must be integers." })
  .min(0, { error: "Unix timestamps must be greater than or equal to 0." });

export const TimezoneOffsetSchema = z
  .number()
  .min(-12, { error: "Timezone offsets must be greater than or equal to -12." })
  .max(14, { error: "Timezone offsets must be less than or equal to 14." });

export const SnowflakeArraySchema = z
  .array(SnowflakeSchema)
  .min(1, { error: "Provide at least one Discord ID." });

export const PositiveIntegerArraySchema = z
  .array(PositiveIntegerSchema)
  .min(1, { error: "Provide at least one integer value." });

export const TimeRangeQuerySchema = z
  .strictObject({
    start: UnixTimestampSchema.optional(),
    timezone_offset: TimezoneOffsetSchema.optional(),
    interval: IntervalSchema.optional(),
    end: UnixTimestampSchema.optional(),
  })
  .superRefine(addStartEndIssue);

export const LimitOrderQuerySchema = z.strictObject({
  limit: PositiveIntegerSchema.optional(),
  order: SortOrderSchema.optional(),
});

export const TopPaginationQuerySchema = z
  .strictObject({
    limit: PositiveIntegerSchema.optional(),
    order: SortOrderSchema.optional(),
    page_size: PositiveIntegerSchema.optional(),
    page: PositiveIntegerSchema.optional(),
    select: SnowflakeArraySchema.optional(),
    full: z.boolean().optional(),
  })
  .superRefine(addTopPaginationIssues);

export const MemberRoleFiltersSchema = z
  .strictObject({
    bot: z.boolean().optional(),
    whitelist_members: SnowflakeArraySchema.optional(),
    blacklist_members: SnowflakeArraySchema.optional(),
    whitelist_roles: SnowflakeArraySchema.optional(),
    blacklist_roles: SnowflakeArraySchema.optional(),
  })
  .superRefine((value, ctx) => {
    addMutuallyExclusiveIssues(value, ctx, [
      ["whitelist_members", "blacklist_members"],
      ["whitelist_roles", "blacklist_roles"],
    ]);
  });

export const MemberRoleFiltersWithoutBotSchema = z
  .strictObject({
    whitelist_members: SnowflakeArraySchema.optional(),
    blacklist_members: SnowflakeArraySchema.optional(),
    whitelist_roles: SnowflakeArraySchema.optional(),
    blacklist_roles: SnowflakeArraySchema.optional(),
  })
  .superRefine((value, ctx) => {
    addMutuallyExclusiveIssues(value, ctx, [
      ["whitelist_members", "blacklist_members"],
      ["whitelist_roles", "blacklist_roles"],
    ]);
  });

export const ChannelFiltersSchema = z
  .strictObject({
    whitelist_channels: SnowflakeArraySchema.optional(),
    blacklist_channels: SnowflakeArraySchema.optional(),
    whitelist_voice_channels: SnowflakeArraySchema.optional(),
    blacklist_voice_channels: SnowflakeArraySchema.optional(),
  })
  .superRefine((value, ctx) => {
    addMutuallyExclusiveIssues(value, ctx, [
      ["whitelist_channels", "blacklist_channels"],
      ["whitelist_voice_channels", "blacklist_voice_channels"],
    ]);
  });

export const VoiceStateFiltersSchema = z.strictObject({
  voice_states: z
    .array(VoiceStateSchema)
    .min(1, { error: "Provide at least one voice state." })
    .optional(),
});

export const ActivityFiltersSchema = z
  .strictObject({
    whitelist_activities: PositiveIntegerArraySchema.optional(),
    blacklist_activities: PositiveIntegerArraySchema.optional(),
  })
  .superRefine((value, ctx) => {
    addMutuallyExclusiveIssues(value, ctx, [
      ["whitelist_activities", "blacklist_activities"],
    ]);
  });

export const InviteFiltersSchema = z
  .strictObject({
    whitelist_invites: PositiveIntegerArraySchema.optional(),
    blacklist_invites: PositiveIntegerArraySchema.optional(),
    whitelist_invite_flags_mask: z.number().int().nonnegative().optional(),
    whitelist_invite_flags_type: InviteFlagFilterTypeSchema.optional(),
    blacklist_invite_flags_mask: z.number().int().nonnegative().optional(),
    blacklist_invite_flags_type: InviteFlagFilterTypeSchema.optional(),
  })
  .superRefine((value, ctx) => {
    addMutuallyExclusiveIssues(value, ctx, [
      ["whitelist_invites", "blacklist_invites"],
    ]);
    addInviteFlagIssues(value, ctx);
  });

export const MessageSeriesQuerySchema = z
  .strictObject({
    ...TimeRangeQuerySchema.shape,
    ...LimitOrderQuerySchema.shape,
    ...MemberRoleFiltersSchema.shape,
    ...ChannelFiltersSchema.shape,
    by_channel: z.boolean().optional(),
    by_member: z.boolean().optional(),
    by_flag: z.boolean().optional(),
  })
  .superRefine((value, ctx) => {
    addStartEndIssue(value, ctx);
    addMutuallyExclusiveIssues(value, ctx, [
      ["whitelist_members", "blacklist_members"],
      ["whitelist_roles", "blacklist_roles"],
      ["whitelist_channels", "blacklist_channels"],
      ["whitelist_voice_channels", "blacklist_voice_channels"],
    ]);
  });

export const VoiceSeriesQuerySchema = z
  .strictObject({
    ...TimeRangeQuerySchema.shape,
    ...LimitOrderQuerySchema.shape,
    ...MemberRoleFiltersSchema.shape,
    ...ChannelFiltersSchema.shape,
    ...VoiceStateFiltersSchema.shape,
    by_channel: z.boolean().optional(),
    by_member: z.boolean().optional(),
    by_state: z.boolean().optional(),
    by_flag: z.boolean().optional(),
  })
  .superRefine((value, ctx) => {
    addStartEndIssue(value, ctx);
    addMutuallyExclusiveIssues(value, ctx, [
      ["whitelist_members", "blacklist_members"],
      ["whitelist_roles", "blacklist_roles"],
      ["whitelist_channels", "blacklist_channels"],
      ["whitelist_voice_channels", "blacklist_voice_channels"],
    ]);
  });

export const ActivitySeriesQuerySchema = z
  .strictObject({
    ...TimeRangeQuerySchema.shape,
    ...LimitOrderQuerySchema.shape,
    ...MemberRoleFiltersWithoutBotSchema.shape,
    ...ActivityFiltersSchema.shape,
    by_activity: z.boolean().optional(),
    by_member: z.boolean().optional(),
  })
  .superRefine((value, ctx) => {
    addStartEndIssue(value, ctx);
    addMutuallyExclusiveIssues(value, ctx, [
      ["whitelist_members", "blacklist_members"],
      ["whitelist_roles", "blacklist_roles"],
      ["whitelist_activities", "blacklist_activities"],
    ]);
  });

export const MemberCountSeriesQuerySchema = z
  .strictObject({
    ...TimeRangeQuerySchema.shape,
    ...LimitOrderQuerySchema.shape,
  })
  .superRefine(addStartEndIssue);

export const StatusSeriesQuerySchema = z
  .strictObject({
    ...TimeRangeQuerySchema.shape,
    ...LimitOrderQuerySchema.shape,
  })
  .superRefine(addStartEndIssue);

export const InviteSeriesQuerySchema = z
  .strictObject({
    ...TimeRangeQuerySchema.shape,
    ...LimitOrderQuerySchema.shape,
    ...MemberRoleFiltersSchema.shape,
    ...InviteFiltersSchema.shape,
    by_invite: z.boolean().optional(),
    by_inviter: z.boolean().optional(),
    by_invitee: z.boolean().optional(),
  })
  .superRefine((value, ctx) => {
    addStartEndIssue(value, ctx);
    addMutuallyExclusiveIssues(value, ctx, [
      ["whitelist_members", "blacklist_members"],
      ["whitelist_roles", "blacklist_roles"],
      ["whitelist_invites", "blacklist_invites"],
    ]);
    addInviteFlagIssues(value, ctx);
  });

export const UniqueMemberCountSeriesQuerySchema = z
  .strictObject({
    ...TimeRangeQuerySchema.shape,
    ...LimitOrderQuerySchema.shape,
    ...MemberRoleFiltersSchema.shape,
    ...ChannelFiltersSchema.shape,
    ...VoiceStateFiltersSchema.shape,
    stats: z
      .array(UniqueCountStatSchema)
      .min(1, { error: "Provide at least one stat type." })
      .optional(),
  })
  .superRefine((value, ctx) => {
    addStartEndIssue(value, ctx);
    addMutuallyExclusiveIssues(value, ctx, [
      ["whitelist_members", "blacklist_members"],
      ["whitelist_roles", "blacklist_roles"],
      ["whitelist_channels", "blacklist_channels"],
      ["whitelist_voice_channels", "blacklist_voice_channels"],
    ]);
  });

export const UniqueChannelCountSeriesQuerySchema = z
  .strictObject({
    ...TimeRangeQuerySchema.shape,
    ...LimitOrderQuerySchema.shape,
    ...MemberRoleFiltersSchema.shape,
    ...ChannelFiltersSchema.shape,
    ...VoiceStateFiltersSchema.shape,
    stats: z
      .array(UniqueCountStatSchema)
      .min(1, { error: "Provide at least one stat type." })
      .optional(),
  })
  .superRefine((value, ctx) => {
    addStartEndIssue(value, ctx);
    addMutuallyExclusiveIssues(value, ctx, [
      ["whitelist_members", "blacklist_members"],
      ["whitelist_roles", "blacklist_roles"],
      ["whitelist_channels", "blacklist_channels"],
      ["whitelist_voice_channels", "blacklist_voice_channels"],
    ]);
  });

export const TopActivitiesQuerySchema = z
  .strictObject({
    ...TimeRangeQuerySchema.shape,
    ...TopPaginationQuerySchema.shape,
    ...MemberRoleFiltersWithoutBotSchema.shape,
    ...ActivityFiltersSchema.shape,
  })
  .superRefine((value, ctx) => {
    addStartEndIssue(value, ctx);
    addTopPaginationIssues(value, ctx);
    addMutuallyExclusiveIssues(value, ctx, [
      ["whitelist_members", "blacklist_members"],
      ["whitelist_roles", "blacklist_roles"],
      ["whitelist_activities", "blacklist_activities"],
    ]);
  });

export const TopMessageMembersQuerySchema = z
  .strictObject({
    ...TimeRangeQuerySchema.shape,
    ...TopPaginationQuerySchema.shape,
    ...MemberRoleFiltersSchema.shape,
    ...ChannelFiltersSchema.shape,
  })
  .superRefine((value, ctx) => {
    addStartEndIssue(value, ctx);
    addTopPaginationIssues(value, ctx);
    addMutuallyExclusiveIssues(value, ctx, [
      ["whitelist_members", "blacklist_members"],
      ["whitelist_roles", "blacklist_roles"],
      ["whitelist_channels", "blacklist_channels"],
      ["whitelist_voice_channels", "blacklist_voice_channels"],
    ]);
  });

export const TopMessageChannelsQuerySchema = z
  .strictObject({
    ...TimeRangeQuerySchema.shape,
    ...TopPaginationQuerySchema.shape,
    ...MemberRoleFiltersSchema.shape,
    ...ChannelFiltersSchema.shape,
  })
  .superRefine((value, ctx) => {
    addStartEndIssue(value, ctx);
    addTopPaginationIssues(value, ctx);
    addMutuallyExclusiveIssues(value, ctx, [
      ["whitelist_members", "blacklist_members"],
      ["whitelist_roles", "blacklist_roles"],
      ["whitelist_channels", "blacklist_channels"],
      ["whitelist_voice_channels", "blacklist_voice_channels"],
    ]);
  });

export const TopVoiceMembersQuerySchema = z
  .strictObject({
    ...TimeRangeQuerySchema.shape,
    ...TopPaginationQuerySchema.shape,
    ...MemberRoleFiltersSchema.shape,
    ...ChannelFiltersSchema.shape,
    ...VoiceStateFiltersSchema.shape,
  })
  .superRefine((value, ctx) => {
    addStartEndIssue(value, ctx);
    addTopPaginationIssues(value, ctx);
    addMutuallyExclusiveIssues(value, ctx, [
      ["whitelist_members", "blacklist_members"],
      ["whitelist_roles", "blacklist_roles"],
      ["whitelist_channels", "blacklist_channels"],
      ["whitelist_voice_channels", "blacklist_voice_channels"],
    ]);
  });

export const TopVoiceChannelsQuerySchema = z
  .strictObject({
    ...TimeRangeQuerySchema.shape,
    ...TopPaginationQuerySchema.shape,
    ...MemberRoleFiltersSchema.shape,
    ...ChannelFiltersSchema.shape,
    ...VoiceStateFiltersSchema.shape,
  })
  .superRefine((value, ctx) => {
    addStartEndIssue(value, ctx);
    addTopPaginationIssues(value, ctx);
    addMutuallyExclusiveIssues(value, ctx, [
      ["whitelist_members", "blacklist_members"],
      ["whitelist_roles", "blacklist_roles"],
      ["whitelist_channels", "blacklist_channels"],
      ["whitelist_voice_channels", "blacklist_voice_channels"],
    ]);
  });

export const TopInvitesQuerySchema = z
  .strictObject({
    ...TimeRangeQuerySchema.shape,
    ...TopPaginationQuerySchema.shape,
    ...MemberRoleFiltersSchema.shape,
    ...InviteFiltersSchema.shape,
  })
  .superRefine((value, ctx) => {
    addStartEndIssue(value, ctx);
    addTopPaginationIssues(value, ctx);
    addMutuallyExclusiveIssues(value, ctx, [
      ["whitelist_members", "blacklist_members"],
      ["whitelist_roles", "blacklist_roles"],
      ["whitelist_invites", "blacklist_invites"],
    ]);
    addInviteFlagIssues(value, ctx);
  });

export const TopInviteMembersQuerySchema = z
  .strictObject({
    ...TimeRangeQuerySchema.shape,
    ...TopPaginationQuerySchema.shape,
    ...MemberRoleFiltersSchema.shape,
    ...InviteFiltersSchema.shape,
  })
  .superRefine((value, ctx) => {
    addStartEndIssue(value, ctx);
    addTopPaginationIssues(value, ctx);
    addMutuallyExclusiveIssues(value, ctx, [
      ["whitelist_members", "blacklist_members"],
      ["whitelist_roles", "blacklist_roles"],
      ["whitelist_invites", "blacklist_invites"],
    ]);
    addInviteFlagIssues(value, ctx);
  });

export const MessageCountQuerySchema = z
  .strictObject({
    ...TimeRangeQuerySchema.shape,
    ...MemberRoleFiltersSchema.shape,
    ...ChannelFiltersSchema.shape,
  })
  .superRefine((value, ctx) => {
    addStartEndIssue(value, ctx);
    addMutuallyExclusiveIssues(value, ctx, [
      ["whitelist_members", "blacklist_members"],
      ["whitelist_roles", "blacklist_roles"],
      ["whitelist_channels", "blacklist_channels"],
      ["whitelist_voice_channels", "blacklist_voice_channels"],
    ]);
  });

export const VoiceCountQuerySchema = z
  .strictObject({
    ...TimeRangeQuerySchema.shape,
    ...MemberRoleFiltersSchema.shape,
    ...ChannelFiltersSchema.shape,
    ...VoiceStateFiltersSchema.shape,
  })
  .superRefine((value, ctx) => {
    addStartEndIssue(value, ctx);
    addMutuallyExclusiveIssues(value, ctx, [
      ["whitelist_members", "blacklist_members"],
      ["whitelist_roles", "blacklist_roles"],
      ["whitelist_channels", "blacklist_channels"],
      ["whitelist_voice_channels", "blacklist_voice_channels"],
    ]);
  });

export const MembersWithCountsQuerySchema = z
  .strictObject({
    ...TimeRangeQuerySchema.shape,
    ...MemberRoleFiltersSchema.shape,
    ...ChannelFiltersSchema.shape,
    ...VoiceStateFiltersSchema.shape,
  })
  .superRefine((value, ctx) => {
    addStartEndIssue(value, ctx);
    addMutuallyExclusiveIssues(value, ctx, [
      ["whitelist_members", "blacklist_members"],
      ["whitelist_roles", "blacklist_roles"],
      ["whitelist_channels", "blacklist_channels"],
      ["whitelist_voice_channels", "blacklist_voice_channels"],
    ]);
  });

export const GetChannelsQuerySchema = z.strictObject({
  types: z
    .array(ChannelFilterTypeSchema)
    .min(1, { error: "Provide at least one channel type." })
    .optional(),
  ids: SnowflakeArraySchema.optional(),
});
