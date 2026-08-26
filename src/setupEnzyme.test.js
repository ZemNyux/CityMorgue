import { describe, test, expect } from "vitest";

describe("Test environment setup", () => {
  test("vitest test runner is present", () => {
    expect(typeof test).toBe("function");
  });
});