import { client, exampleGuildId } from "../shared.js";

export async function getVoiceSeriesExample() {
  return client.getVoiceSeries(exampleGuildId, {
    interval: "day",
    voice_states: ["normal", "afk"],
    by_state: true,
  });
}
