import { client, exampleGuildId } from "../shared.js";

export async function getMessageCountExample() {
  return client.getMessageCount(exampleGuildId, {
    start: 1735689600000,
    end: 1736294400000,
    bot: false,
  });
}
