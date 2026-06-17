import { client } from "../shared.js";

export async function getActivitiesExample() {
  return client.getActivities();
}
