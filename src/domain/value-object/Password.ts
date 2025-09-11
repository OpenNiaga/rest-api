import { compare, hash } from "bcrypt";
import { Result } from "./Result";

export class Password {
  private static readonly SALT_ROUNDS = 10;

  private constructor(private readonly hashedValue: string) {}

  static async create(plainPassword: string): Promise<Password> {
    const hashed = await hash(plainPassword, this.SALT_ROUNDS);
    return new Password(hashed);
  }

  static fromHashed(hash: string): Result<Password,string> {
    if (!this.isBcryptHash(hash)) {
			return Result.failure("Invalid hashed Password")
    }
    return Result.success(new Password(hash));
  }

  async compareWith(plain: string): Promise<boolean> {
    return await compare(plain, this.hashedValue);
  }

  toString(): string {
    return this.hashedValue;
  }

  private static isBcryptHash(hashedValue: string): boolean {
    const bcryptRegex = /^\$2[aby]?\$\d{2}\$[./A-Za-z0-9]{53}$/;
    return bcryptRegex.test(hashedValue);
  }
}
