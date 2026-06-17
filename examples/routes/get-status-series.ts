import { client, exampleGuildId } from "../shared.js";

export async function getStatusSeriesExample() {
  return client.getStatusSeries(exampleGuildId, {
    interval: "hour",
    order: "asc",
    limit: 24,
  });
}
