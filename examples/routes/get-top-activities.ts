import { client, exampleGuildId } from "../shared.js";

export async function getTopActivitiesExample() {
  return client.getTopActivities(exampleGuildId, {
    interval: "week",
    order: "desc",
    page_size: 10,
    page: 1,
  });
}
