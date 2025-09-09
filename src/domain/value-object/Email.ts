import { Result } from "@src/domain/value-object/Result.js";

export class Email {
  private readonly value: string;

  private constructor(email: string) {
    this.value = email;
  }

  static isValid(email: string): boolean {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return emailRegex.test(email);
  }

  static create(email: string): Result<Email, string> {
    if (!Email.isValid(email)) {
      return Result.failure("Invalid email format");
    }
    return Result.success(new Email(email));
  }

  toString(): string {
    return this.value;
  }
}
