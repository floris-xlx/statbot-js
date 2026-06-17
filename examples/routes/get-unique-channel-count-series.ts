import { client, exampleGuildId, exampleTextChannelId } from "../shared.js";

export async function getUniqueChannelCountSeriesExample() {
  return client.getUniqueChannelCountSeries(exampleGuildId, {
    stats: ["text"],
    interval: "day",
    whitelist_channels: [exampleTextChannelId],
  });
}
