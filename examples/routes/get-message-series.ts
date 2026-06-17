import { client, exampleGuildId, exampleMemberId, exampleTextChannelId } from "../shared.js";

export async function getMessageSeriesExample() {
  return client.getMessageSeries(exampleGuildId, {
    interval: "day",
    whitelist_members: [exampleMemberId],
    whitelist_channels: [exampleTextChannelId],
    by_member: true,
  });
}
