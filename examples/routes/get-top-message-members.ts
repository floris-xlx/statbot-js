import { client, exampleGuildId } from "../shared.js";

export async function getTopMessageMembersExample() {
  return client.getTopMessageMembers(exampleGuildId, {
    interval: "month",
    full: true,
    page_size: 25,
    page: 1,
  });
}
