import { client, exampleGuildId, exampleRoleId } from "../shared.js";

export async function getMembersWithCountsExample() {
  return client.getMembersWithCounts(exampleGuildId, {
    interval: "week",
    whitelist_roles: [exampleRoleId],
  });
}
