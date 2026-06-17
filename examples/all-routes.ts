import { getActivitiesExample } from "./routes/get-activities.js";
import { getActivitySeriesExample } from "./routes/get-activity-series.js";
import { getTopActivitiesExample } from "./routes/get-top-activities.js";
import { getMessageSeriesExample } from "./routes/get-message-series.js";
import { getTopMessageMembersExample } from "./routes/get-top-message-members.js";
import { getTopMessageChannelsExample } from "./routes/get-top-message-channels.js";
import { getMessageCountExample } from "./routes/get-message-count.js";
import { getVoiceSeriesExample } from "./routes/get-voice-series.js";
import { getTopVoiceMembersExample } from "./routes/get-top-voice-members.js";
import { getTopVoiceChannelsExample } from "./routes/get-top-voice-channels.js";
import { getVoiceCountExample } from "./routes/get-voice-count.js";
import { getMemberCountSeriesExample } from "./routes/get-member-count-series.js";
import { getStatusSeriesExample } from "./routes/get-status-series.js";
import { getUniqueMemberCountSeriesExample } from "./routes/get-unique-member-count-series.js";
import { getUniqueChannelCountSeriesExample } from "./routes/get-unique-channel-count-series.js";
import { getMembersWithCountsExample } from "./routes/get-members-with-counts.js";
import { getInviteSeriesExample } from "./routes/get-invite-series.js";
import { getTopInvitesExample } from "./routes/get-top-invites.js";
import { getTopInviteMembersExample } from "./routes/get-top-invite-members.js";
import { getInviteExample } from "./routes/get-invite.js";
import { getInvitesExample } from "./routes/get-invites.js";
import { getChannelExample } from "./routes/get-channel.js";
import { getChannelsExample } from "./routes/get-channels.js";

export {
  getActivitiesExample,
  getActivitySeriesExample,
  getTopActivitiesExample,
  getMessageSeriesExample,
  getTopMessageMembersExample,
  getTopMessageChannelsExample,
  getMessageCountExample,
  getVoiceSeriesExample,
  getTopVoiceMembersExample,
  getTopVoiceChannelsExample,
  getVoiceCountExample,
  getMemberCountSeriesExample,
  getStatusSeriesExample,
  getUniqueMemberCountSeriesExample,
  getUniqueChannelCountSeriesExample,
  getMembersWithCountsExample,
  getInviteSeriesExample,
  getTopInvitesExample,
  getTopInviteMembersExample,
  getInviteExample,
  getInvitesExample,
  getChannelExample,
  getChannelsExample,
};

export async function allRouteExamples() {
  return {
    getActivities: await getActivitiesExample(),
    getActivitySeries: await getActivitySeriesExample(),
    getTopActivities: await getTopActivitiesExample(),
    getMessageSeries: await getMessageSeriesExample(),
    getTopMessageMembers: await getTopMessageMembersExample(),
    getTopMessageChannels: await getTopMessageChannelsExample(),
    getMessageCount: await getMessageCountExample(),
    getVoiceSeries: await getVoiceSeriesExample(),
    getTopVoiceMembers: await getTopVoiceMembersExample(),
    getTopVoiceChannels: await getTopVoiceChannelsExample(),
    getVoiceCount: await getVoiceCountExample(),
    getMemberCountSeries: await getMemberCountSeriesExample(),
    getStatusSeries: await getStatusSeriesExample(),
    getUniqueMemberCountSeries: await getUniqueMemberCountSeriesExample(),
    getUniqueChannelCountSeries: await getUniqueChannelCountSeriesExample(),
    getMembersWithCounts: await getMembersWithCountsExample(),
    getInviteSeries: await getInviteSeriesExample(),
    getTopInvites: await getTopInvitesExample(),
    getTopInviteMembers: await getTopInviteMembersExample(),
    getInvite: await getInviteExample(),
    getInvites: await getInvitesExample(),
    getChannel: await getChannelExample(),
    getChannels: await getChannelsExample(),
  };
}
