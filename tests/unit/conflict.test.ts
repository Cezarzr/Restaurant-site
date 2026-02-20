import { describe, expect, it } from "vitest";
import { suggestNearbyTimes, timeFrameToRange } from "@/lib/conflict";

describe("conflict helpers", () => {
  it("suggests alternative time slots", () => {
    const output = suggestNearbyTimes("12:00-14:00");
    expect(output.length).toBeGreaterThan(0);
    expect(output).not.toContain("12:00-14:00");
  });

  it("converts timeframe to bounded dates", () => {
    const eventDate = new Date("2026-03-10T00:00:00.000Z");
    const { start, end } = timeFrameToRange(eventDate, "09:30-11:15");
    expect(start.getHours()).toBe(9);
    expect(start.getMinutes()).toBe(30);
    expect(end.getHours()).toBe(11);
    expect(end.getMinutes()).toBe(15);
  });
});
