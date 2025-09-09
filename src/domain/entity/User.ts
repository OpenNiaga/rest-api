import { Email } from "../value-object/Email";
import { Password } from "../value-object/Password";

export class User {
  private constructor(
    public readonly id: string | null,
    public readonly email: Email,
    public username: string,
    public password: Password,
    public readonly createdAt: Date,
    public readonly modifiedAt: Date,
  ) {}

  static create(email: Email, username: string, password: Password): User {
    const now = new Date();
    return new User(null, email, username, password, now, now);
  }

  static reconstruct(
    id: string,
    email: Email,
    username: string,
    password: Password,
    createdAt: Date,
    modifiedAt: Date,
  ): User {
    return new User(id, email, username, password, createdAt, modifiedAt);
  }
}
