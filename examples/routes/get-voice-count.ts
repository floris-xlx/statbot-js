import { client, exampleGuildId } from "../shared.js";

export async function getVoiceCountExample() {
  return client.getVoiceCount(exampleGuildId, {
    interval: "month",
    voice_states: ["normal"],
  });
}
