import { describe, expect, it } from "vitest";
import { suggestNearbyTimes } from "@/lib/conflict";

describe("conflict helpers", () => {
  it("suggests alternative time slots", () => {
    const output = suggestNearbyTimes("12:00-14:00");
    expect(output.length).toBeGreaterThan(0);
    expect(output).not.toContain("12:00-14:00");
  });
});
