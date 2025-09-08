import { greeting } from "../src/greeting.js";

describe("Test Suit 1", () => {
  test("Test Case 1", () => {
    expect(greeting("Rizal")).toMatch("Hello Rizal!");
  });
});
