import { Email } from "@src/domain/value-object/Email.js";

describe("Email", () => {
  describe("isValid", () => {
    it("should validate correct email format", () => {
      expect(Email.isValid("user@example.com")).toBe(true);
      expect(Email.isValid("user.name-123@domain.co")).toBe(true);
    });

    it("should invalidate incorrect email format", () => {
      expect(Email.isValid("invalid-email")).toBe(false);
      expect(Email.isValid("user@.com")).toBe(false);
      expect(Email.isValid("user@domain")).toBe(false);
    });
  });

  describe("create", () => {
    it("should return success result with Email instance for valid email", () => {
      const emailStr = "test@example.com";
      const result = Email.create(emailStr);

      expect(result.isSuccess).toBe(true);
      expect(result.isFailure).toBe(false);
      expect(result.value.toString()).toBe(emailStr);
    });

    it("should return failure result with error message for invalid email", () => {
      const emailStr = "invalid-email";
      const result = Email.create(emailStr);

      expect(result.isFailure).toBe(true);
      expect(result.isSuccess).toBe(false);
      expect(result.error).toBe("Invalid email format");
    });
  });

  describe("toString", () => {
    it("should return the email string", () => {
      const emailStr = "user@example.com";
      const email = Email.create(emailStr).value;
      expect(email.toString()).toBe(emailStr);
    });
  });
});
