import { Result } from "@src/domain/value-object/Result.js";

describe("Result class", () => {
  describe("success factory", () => {
    it("should create a successful result", () => {
      const data = { name: "test" };
      const result = Result.success(data);

      expect(result.isSuccess).toBe(true);
      expect(result.isFailure).toBe(false);
      expect(result.value).toEqual(data);
      expect(() => result.error).toThrow(
        "Cannot access error from a successful result.",
      );
    });
  });

  describe("failure factory", () => {
    it("should create a failed result", () => {
      const errorMsg = "Something went wrong";
      const result = Result.failure(errorMsg);

      expect(result.isSuccess).toBe(false);
      expect(result.isFailure).toBe(true);
      expect(result.error).toBe(errorMsg);
      expect(() => result.value).toThrow(
        "Cannot access value from a failed result.",
      );
    });
  });
});
