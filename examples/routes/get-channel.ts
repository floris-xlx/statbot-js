import { client, exampleChannelId, exampleGuildId } from "../shared.js";

export async function getChannelExample() {
  return client.getChannel(exampleGuildId, exampleChannelId);
}
