import { client, exampleGuildId } from "../shared.js";

export async function getTopVoiceMembersExample() {
  return client.getTopVoiceMembers(exampleGuildId, {
    interval: "week",
    full: true,
    voice_states: ["normal"],
    limit: 20,
  });
}
