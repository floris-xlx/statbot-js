import { client, exampleGuildId } from "../shared.js";

export async function getTopVoiceChannelsExample() {
  return client.getTopVoiceChannels(exampleGuildId, {
    interval: "week",
    full: true,
    voice_states: ["normal", "self_mute"],
    page_size: 10,
    page: 1,
  });
}
