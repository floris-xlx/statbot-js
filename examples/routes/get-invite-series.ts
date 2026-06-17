import { client, exampleGuildId, exampleInviteId } from "../shared.js";

export async function getInviteSeriesExample() {
  return client.getInviteSeries(exampleGuildId, {
    interval: "day",
    by_inviter: true,
    whitelist_invites: [exampleInviteId, 789],
  });
}
