import { StatbotClient } from "../src/index.js";

export const client = new StatbotClient({
  token: process.env.STATBOT_TOKEN ?? "statbot_example_token",
});

export const exampleGuildId = "123456789012345678";
export const exampleChannelId = "234567890123456789";
export const exampleInviteId = 456;
export const exampleMemberId = "111111111111111111";
export const exampleRoleId = "333333333333333333";
export const exampleTextChannelId = "444444444444444444";
export const exampleVoiceChannelId = "555555555555555555";
