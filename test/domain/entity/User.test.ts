import { beforeEach } from "node:test";
import { User } from "../../../src/domain/entity/User";
import { Email } from "../../../src/domain/value-object/Email";
import { Password } from "../../../src/domain/value-object/Password";

describe("User class", () => {
  const emailValue = "test@example.com";
  const username = "testuser";
  const plainPassword = "test123";

  let email: Email;
  let password: Password;

  beforeEach(async () => {
    const emailResult = Email.create(emailValue);
		email = emailResult.value
    password = await Password.create(plainPassword);
  });

  test("create() should instantiate User with null id and correct timestamps", () => {
    const user = User.create(email, username, password);

    expect(user.id).toBeNull();
    expect(user.email).toBe(email);
    expect(user.username).toBe(username);
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.modifiedAt).toBeInstanceOf(Date);

    const diff = user.modifiedAt.getTime() - user.createdAt.getTime();
    expect(diff).toBeGreaterThanOrEqual(0);
    expect(diff).toBeLessThanOrEqual(1000);
  });

  test("reconstruct() should instantiate User with given properties", () => {
    const id = "user-123";
    const createdAt = new Date("2024-01-01T00:00:00Z");
    const modifiedAt = new Date("2024-01-02T00:00:00Z");

    const user = User.reconstruct(id, email, username,password, createdAt, modifiedAt);

    expect(user.id).toBe(id);
    expect(user.email).toBe(email);
    expect(user.username).toBe(username);
    expect(user.createdAt).toEqual(createdAt);
    expect(user.modifiedAt).toEqual(modifiedAt);
  });

  test("username should be mutable", () => {
    const user = User.create(email, username, password);
    expect(user.username).toBe(username);

    const newUsername = "newusername";
    user.username = newUsername;
    expect(user.username).toBe(newUsername);
  });
});
