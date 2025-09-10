import { Password } from "../../../src/domain/value-object/Password";

describe("Password class", () => {
  const plainPassword = "MyS3cretPass!";

  let passwordInstance: Password;

  beforeAll(async () => {
    passwordInstance = await Password.create(plainPassword);
  });

  test("should create hashed password with correct format", () => {
    const hashedStr = passwordInstance.toString();
    expect(hashedStr).toMatch(/^\$2[aby]?\$\d{2}\$[./A-Za-z0-9]{53}$/);
  });

  test("should compare with correct password successfully", async () => {
    const isMatch = await passwordInstance.compareWith(plainPassword);
    expect(isMatch).toBe(true);
  });

  test("should fail compare with wrong password", async () => {
    const isMatch = await passwordInstance.compareWith("wrong-password");
    expect(isMatch).toBe(false);
  });

  test("fromHashed should create instance with valid bcrypt hash", () => {
    const hashStr = passwordInstance.toString();
    const fromHashedResult = Password.fromHashed(hashStr);
    const fromHashInstance = fromHashedResult.value;
    expect(fromHashInstance.toString()).toBe(hashStr);
  });

  test("fromHashed should throw error with invalid hash string", () => {
    const fromHashInstance = Password.fromHashed("not-a-valid-hash");
    expect(fromHashInstance.isSuccess).toBeFalsy();
  });

  test("compareWith from instance created by fromHashed works correctly", async () => {
    const hashStr = passwordInstance.toString();
    const fromHashedResult = Password.fromHashed(hashStr);
    const fromHashInstance = fromHashedResult.value;
    const isMatch = await fromHashInstance.compareWith(plainPassword);
    expect(isMatch).toBe(true);
  });
});
