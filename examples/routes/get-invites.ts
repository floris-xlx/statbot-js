import { client, exampleGuildId } from "../shared.js";

export async function getInvitesExample() {
  return client.getInvites(exampleGuildId);
}
