import { client, exampleGuildId } from "../shared.js";

export async function getActivitySeriesExample() {
  return client.getActivitySeries(exampleGuildId, {
    interval: "day",
    start: 1735689600000,
    end: 1736294400000,
    whitelist_activities: [791, 792],
    by_activity: true,
  });
}
