export type Snowflake = string;
export type Interval = "hour" | "day" | "week" | "month";
export type SortOrder = "asc" | "desc";
export type VoiceState =
  | "normal"
  | "afk"
  | "self_mute"
  | "self_deaf"
  | "server_mute"
  | "server_deaf";
export type InviteFlagFilterType = "any" | "all";
export type UniqueCountStat = "text" | "voice";
export type ChannelFilterType = 0 | 2 | 4 | 5 | 13 | 15 | 999;

export interface TimeRangeQuery {
  start?: number;
  timezone_offset?: number;
  interval?: Interval;
  end?: number;
}

export interface LimitOrderQuery {
  limit?: number;
  order?: SortOrder;
}

export interface TopPaginationQuery extends LimitOrderQuery {
  page_size?: number;
  page?: number;
  select?: Snowflake[];
  full?: boolean;
}

export interface MemberRoleFilters {
  bot?: boolean;
  whitelist_members?: Snowflake[];
  blacklist_members?: Snowflake[];
  whitelist_roles?: Snowflake[];
  blacklist_roles?: Snowflake[];
}

export interface ChannelFilters {
  whitelist_channels?: Snowflake[];
  blacklist_channels?: Snowflake[];
  whitelist_voice_channels?: Snowflake[];
  blacklist_voice_channels?: Snowflake[];
}

export interface VoiceStateFilters {
  voice_states?: VoiceState[];
}

export interface ActivityFilters {
  whitelist_activities?: number[];
  blacklist_activities?: number[];
}

export interface InviteFilters {
  whitelist_invites?: number[];
  blacklist_invites?: number[];
  whitelist_invite_flags_mask?: number;
  whitelist_invite_flags_type?: InviteFlagFilterType;
  blacklist_invite_flags_mask?: number;
  blacklist_invite_flags_type?: InviteFlagFilterType;
}

export interface MessageSeriesQuery
  extends TimeRangeQuery,
    LimitOrderQuery,
    MemberRoleFilters,
    ChannelFilters {
  by_channel?: boolean;
  by_member?: boolean;
  by_flag?: boolean;
}

export interface VoiceSeriesQuery
  extends TimeRangeQuery,
    LimitOrderQuery,
    MemberRoleFilters,
    ChannelFilters,
    VoiceStateFilters {
  by_channel?: boolean;
  by_member?: boolean;
  by_state?: boolean;
  by_flag?: boolean;
}

export interface ActivitySeriesQuery
  extends TimeRangeQuery,
    LimitOrderQuery,
    Omit<MemberRoleFilters, "bot">,
    ActivityFilters {
  by_activity?: boolean;
  by_member?: boolean;
}

export interface MemberCountSeriesQuery extends TimeRangeQuery, LimitOrderQuery {}

export interface StatusSeriesQuery extends TimeRangeQuery, LimitOrderQuery {}

export interface InviteSeriesQuery
  extends TimeRangeQuery,
    LimitOrderQuery,
    MemberRoleFilters,
    InviteFilters {
  by_invite?: boolean;
  by_inviter?: boolean;
  by_invitee?: boolean;
}

export interface UniqueMemberCountSeriesQuery
  extends TimeRangeQuery,
    LimitOrderQuery,
    MemberRoleFilters,
    ChannelFilters,
    VoiceStateFilters {
  stats?: UniqueCountStat[];
}

export interface UniqueChannelCountSeriesQuery
  extends TimeRangeQuery,
    LimitOrderQuery,
    MemberRoleFilters,
    ChannelFilters,
    VoiceStateFilters {
  stats?: UniqueCountStat[];
}

export interface TopActivitiesQuery
  extends TimeRangeQuery,
    TopPaginationQuery,
    Omit<MemberRoleFilters, "bot">,
    ActivityFilters {}

export interface TopMessageMembersQuery
  extends TimeRangeQuery,
    TopPaginationQuery,
    MemberRoleFilters,
    ChannelFilters {}

export interface TopMessageChannelsQuery
  extends TimeRangeQuery,
    TopPaginationQuery,
    MemberRoleFilters,
    ChannelFilters {}

export interface TopVoiceMembersQuery
  extends TimeRangeQuery,
    TopPaginationQuery,
    MemberRoleFilters,
    ChannelFilters,
    VoiceStateFilters {}

export interface TopVoiceChannelsQuery
  extends TimeRangeQuery,
    TopPaginationQuery,
    MemberRoleFilters,
    ChannelFilters,
    VoiceStateFilters {}

export interface TopInvitesQuery
  extends TimeRangeQuery,
    TopPaginationQuery,
    MemberRoleFilters,
    InviteFilters {}

export interface TopInviteMembersQuery
  extends TimeRangeQuery,
    TopPaginationQuery,
    MemberRoleFilters,
    InviteFilters {}

export interface MessageCountQuery
  extends TimeRangeQuery,
    MemberRoleFilters,
    ChannelFilters {}

export interface VoiceCountQuery
  extends TimeRangeQuery,
    MemberRoleFilters,
    ChannelFilters,
    VoiceStateFilters {}

export interface MembersWithCountsQuery
  extends TimeRangeQuery,
    MemberRoleFilters,
    ChannelFilters,
    VoiceStateFilters {}

export interface GetChannelsQuery {
  types?: ChannelFilterType[];
  ids?: Snowflake[];
}
