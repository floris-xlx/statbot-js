import { client, exampleGuildId } from "../shared.js";

export async function getTopInviteMembersExample() {
  return client.getTopInviteMembers(exampleGuildId, {
    interval: "month",
    full: true,
    order: "desc",
    page_size: 20,
    page: 1,
  });
}
