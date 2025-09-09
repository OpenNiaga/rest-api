import { greeting } from "../src/greeting";

describe("Test Suit 1", () => {
  test("Test Case 1", () => {
    expect(greeting("Rizal")).toMatch("Hello Rizal!");
  });
});
