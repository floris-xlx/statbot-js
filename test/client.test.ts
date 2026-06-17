import { describe, expect, it, vi } from "vitest";
import { StatbotClient } from "../src/client.js";

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
      whitelist_members: ["111", "222"],
      by_member: true,
    });

    const requestCall = fetchMock.mock.calls[0];
    expect(requestCall).toBeDefined();

    const request = requestCall![0] as unknown as Request;
    expect(request.url).toContain(
      "whitelist_members[]=111&whitelist_members[]=222",
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
});
