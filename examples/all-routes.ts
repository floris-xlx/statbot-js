import { StatbotClient } from "../src/index.js";

const client = new StatbotClient({
  token: process.env.STATBOT_TOKEN ?? "statbot_example_token",
});

const guildId = "123456789012345678";
const channelId = "234567890123456789";
const inviteId = 456;
const memberId = "111111111111111111";
const roleId = "333333333333333333";
const textChannelId = "444444444444444444";
const voiceChannelId = "555555555555555555";

export async function activityExamples() {
  const activities = await client.getActivities();

  const activitySeries = await client.getActivitySeries(guildId, {
    interval: "day",
    start: 1735689600000,
    end: 1736294400000,
    whitelist_activities: [791],
    by_activity: true,
  });

  const topActivities = await client.getTopActivities(guildId, {
    interval: "week",
    page_size: 10,
    page: 1,
    order: "desc",
  });

  return {
    activities,
    activitySeries,
    topActivities,
  };
}

export async function messageExamples() {
  const messageSeries = await client.getMessageSeries(guildId, {
    interval: "day",
    whitelist_members: [memberId],
    whitelist_channels: [textChannelId],
    by_member: true,
  });

  const topMessageMembers = await client.getTopMessageMembers(guildId, {
    interval: "month",
    full: true,
    limit: 10,
  });

  const topMessageChannels = await client.getTopMessageChannels(guildId, {
    interval: "week",
    full: true,
    page_size: 10,
    page: 1,
  });

  const messageCount = await client.getMessageCount(guildId, {
    start: 1735689600000,
    end: 1736294400000,
    bot: false,
  });

  return {
    messageSeries,
    topMessageMembers,
    topMessageChannels,
    messageCount,
  };
}

export async function voiceExamples() {
  const voiceSeries = await client.getVoiceSeries(guildId, {
    interval: "day",
    voice_states: ["normal", "afk"],
    by_state: true,
  });

  const topVoiceMembers = await client.getTopVoiceMembers(guildId, {
    interval: "week",
    full: true,
    voice_states: ["normal"],
    limit: 10,
  });

  const topVoiceChannels = await client.getTopVoiceChannels(guildId, {
    interval: "week",
    full: true,
    voice_states: ["normal", "self_mute"],
    page_size: 10,
    page: 1,
  });

  const voiceCount = await client.getVoiceCount(guildId, {
    interval: "month",
    voice_states: ["normal"],
  });

  return {
    voiceSeries,
    topVoiceMembers,
    topVoiceChannels,
    voiceCount,
  };
}

export async function guildCountExamples() {
  const memberCountSeries = await client.getMemberCountSeries(guildId, {
    interval: "day",
    limit: 30,
  });

  const statusSeries = await client.getStatusSeries(guildId, {
    interval: "hour",
    limit: 24,
    order: "asc",
  });

  const uniqueMemberCountSeries = await client.getUniqueMemberCountSeries(guildId, {
    stats: ["text", "voice"],
    interval: "day",
    whitelist_roles: [roleId],
    voice_states: ["normal"],
  });

  const uniqueChannelCountSeries = await client.getUniqueChannelCountSeries(guildId, {
    stats: ["text"],
    interval: "day",
    whitelist_channels: [textChannelId],
  });

  const membersWithCounts = await client.getMembersWithCounts(guildId, {
    interval: "week",
    whitelist_roles: [roleId],
    whitelist_voice_channels: [voiceChannelId],
  });

  return {
    memberCountSeries,
    statusSeries,
    uniqueMemberCountSeries,
    uniqueChannelCountSeries,
    membersWithCounts,
  };
}

export async function inviteExamples() {
  const inviteSeries = await client.getInviteSeries(guildId, {
    interval: "day",
    whitelist_invites: [inviteId],
    by_inviter: true,
  });

  const topInvites = await client.getTopInvites(guildId, {
    interval: "month",
    full: true,
    limit: 15,
  });

  const topInviteMembers = await client.getTopInviteMembers(guildId, {
    interval: "month",
    full: true,
    page_size: 20,
    page: 1,
  });

  const invite = await client.getInvite(guildId, inviteId);
  const invites = await client.getInvites(guildId);

  return {
    inviteSeries,
    topInvites,
    topInviteMembers,
    invite,
    invites,
  };
}

export async function channelExamples() {
  const channel = await client.getChannel(guildId, channelId);
  const channels = await client.getChannels(guildId, {
    types: [0, 13, 999],
    ids: [channelId, textChannelId],
  });

  return {
    channel,
    channels,
  };
}

export async function allRouteExamples() {
  const activities = await activityExamples();
  const messages = await messageExamples();
  const voice = await voiceExamples();
  const guildCounts = await guildCountExamples();
  const invites = await inviteExamples();
  const channels = await channelExamples();

  return {
    activities,
    messages,
    voice,
    guildCounts,
    invites,
    channels,
  };
}
