import { client, exampleGuildId, exampleInviteId } from "../shared.js";

export async function getInviteExample() {
  return client.getInvite(exampleGuildId, exampleInviteId);
}
