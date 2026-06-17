import { describe, expect, it, vi } from "vitest";
import { StatbotClient } from "../src/client.js";
import { StatbotValidationError } from "../src/errors.js";

describe("StatbotClient", () => {
  it("serializes array query parameters with bracket suffixes", async () => {
    const fetchMock = vi.fn(async (_input: RequestInfo | URL) =>
      new Response(JSON.stringify([{ unixTimestamp: 1, count: 2 }]), {
        status: 200,
        headers: {
          "content-type": "application/json",
        },
      }),
    );

    const client = new StatbotClient({
      fetch: fetchMock as typeof globalThis.fetch,
    });

    await client.getMessageSeries("123456789012345678", {
      whitelist_members: ["111111111111111111", "222222222222222222"],
      by_member: true,
    });

    const requestCall = fetchMock.mock.calls[0];
    expect(requestCall).toBeDefined();

    const request = requestCall![0] as unknown as Request;
    expect(request.url).toContain(
      "whitelist_members[]=111111111111111111&whitelist_members[]=222222222222222222",
    );
    expect(request.url).toContain("by_member=true");
  });

  it("adds bearer auth headers from a token provider", async () => {
    const fetchMock = vi.fn(async (input) => {
      const headers = input instanceof Request ? input.headers : new Headers();
      expect(headers.get("authorization")).toBe("Bearer test-token");

      return new Response(JSON.stringify([{ id: 791, name: "Spore", applicationId: null }]), {
        status: 200,
        headers: {
          "content-type": "application/json",
        },
      });
    });

    const client = new StatbotClient({
      token: () => "test-token",
      fetch: fetchMock as typeof globalThis.fetch,
    });

    await client.getActivities();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("rejects invalid snowflake ids before sending the request", async () => {
    const fetchMock = vi.fn();

    const client = new StatbotClient({
      fetch: fetchMock as typeof globalThis.fetch,
    });

    expect(() => client.getChannel("bad-id", "234567890123456789")).toThrow(
      StatbotValidationError,
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects conflicting top-query pagination options", async () => {
    const fetchMock = vi.fn();

    const client = new StatbotClient({
      fetch: fetchMock as typeof globalThis.fetch,
    });

    expect(() =>
      client.getTopMessageMembers("123456789012345678", {
        limit: 10,
        page_size: 25,
        page: 1,
      }),
    ).toThrow(StatbotValidationError);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
