import { client, exampleGuildId } from "../shared.js";

export async function getUniqueMemberCountSeriesExample() {
  return client.getUniqueMemberCountSeries(exampleGuildId, {
    stats: ["text", "voice"],
    interval: "day",
    voice_states: ["normal"],
  });
}
