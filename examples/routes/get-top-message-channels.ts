import { client, exampleGuildId } from "../shared.js";

export async function getTopMessageChannelsExample() {
  return client.getTopMessageChannels(exampleGuildId, {
    interval: "week",
    full: true,
    order: "desc",
    limit: 10,
  });
}
