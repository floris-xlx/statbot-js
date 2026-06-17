import type { z } from "zod";
import {
  ActivitySeriesQuerySchema,
  ChannelFilterTypeSchema,
  GetChannelsQuerySchema,
  IntervalSchema,
  InviteFlagFilterTypeSchema,
  InviteSeriesQuerySchema,
  MemberCountSeriesQuerySchema,
  MembersWithCountsQuerySchema,
  MessageCountQuerySchema,
  MessageSeriesQuerySchema,
  SnowflakeSchema,
  SortOrderSchema,
  StatusSeriesQuerySchema,
  TimeRangeQuerySchema,
  TopActivitiesQuerySchema,
  TopInviteMembersQuerySchema,
  TopInvitesQuerySchema,
  TopMessageChannelsQuerySchema,
  TopMessageMembersQuerySchema,
  TopPaginationQuerySchema,
  TopVoiceChannelsQuerySchema,
  TopVoiceMembersQuerySchema,
  UniqueChannelCountSeriesQuerySchema,
  UniqueCountStatSchema,
  UniqueMemberCountSeriesQuerySchema,
  VoiceCountQuerySchema,
  VoiceSeriesQuerySchema,
  VoiceStateSchema,
} from "./validation.js";

export type Snowflake = z.infer<typeof SnowflakeSchema>;
export type Interval = z.infer<typeof IntervalSchema>;
export type SortOrder = z.infer<typeof SortOrderSchema>;
export type VoiceState = z.infer<typeof VoiceStateSchema>;
export type InviteFlagFilterType = z.infer<typeof InviteFlagFilterTypeSchema>;
export type UniqueCountStat = z.infer<typeof UniqueCountStatSchema>;
export type ChannelFilterType = z.infer<typeof ChannelFilterTypeSchema>;

export type TimeRangeQuery = z.infer<typeof TimeRangeQuerySchema>;
export type TopPaginationQuery = z.infer<typeof TopPaginationQuerySchema>;
export type ActivitySeriesQuery = z.infer<typeof ActivitySeriesQuerySchema>;
export type MemberCountSeriesQuery = z.infer<typeof MemberCountSeriesQuerySchema>;
export type StatusSeriesQuery = z.infer<typeof StatusSeriesQuerySchema>;
export type InviteSeriesQuery = z.infer<typeof InviteSeriesQuerySchema>;
export type MessageSeriesQuery = z.infer<typeof MessageSeriesQuerySchema>;
export type VoiceSeriesQuery = z.infer<typeof VoiceSeriesQuerySchema>;
export type UniqueMemberCountSeriesQuery = z.infer<
  typeof UniqueMemberCountSeriesQuerySchema
>;
export type UniqueChannelCountSeriesQuery = z.infer<
  typeof UniqueChannelCountSeriesQuerySchema
>;
export type TopActivitiesQuery = z.infer<typeof TopActivitiesQuerySchema>;
export type TopMessageMembersQuery = z.infer<typeof TopMessageMembersQuerySchema>;
export type TopMessageChannelsQuery = z.infer<typeof TopMessageChannelsQuerySchema>;
export type TopVoiceMembersQuery = z.infer<typeof TopVoiceMembersQuerySchema>;
export type TopVoiceChannelsQuery = z.infer<typeof TopVoiceChannelsQuerySchema>;
export type TopInvitesQuery = z.infer<typeof TopInvitesQuerySchema>;
export type TopInviteMembersQuery = z.infer<typeof TopInviteMembersQuerySchema>;
export type MessageCountQuery = z.infer<typeof MessageCountQuerySchema>;
export type VoiceCountQuery = z.infer<typeof VoiceCountQuerySchema>;
export type MembersWithCountsQuery = z.infer<typeof MembersWithCountsQuerySchema>;
export type GetChannelsQuery = z.infer<typeof GetChannelsQuerySchema>;
