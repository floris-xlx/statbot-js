import { client, exampleGuildId } from "../shared.js";

export async function getMemberCountSeriesExample() {
  return client.getMemberCountSeries(exampleGuildId, {
    interval: "day",
    limit: 30,
  });
}
