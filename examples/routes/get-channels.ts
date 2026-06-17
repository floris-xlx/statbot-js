import { client, exampleChannelId, exampleGuildId, exampleTextChannelId } from "../shared.js";

export async function getChannelsExample() {
  return client.getChannels(exampleGuildId, {
    types: [0, 13, 999],
    ids: [exampleChannelId, exampleTextChannelId],
  });
}
