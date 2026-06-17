import { client, exampleGuildId } from "../shared.js";

export async function getTopInvitesExample() {
  return client.getTopInvites(exampleGuildId, {
    interval: "month",
    full: true,
    limit: 15,
  });
}
