import { User } from "../../domain/entity/User";
import { Email } from "../../domain/value-object/Email";
import { UserRepository } from "../../domain/repositories/UserRepository";

export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];
  private idCounter = 1;

  async findById(id: string): Promise<User | null> {
    return this.users.find(user => user.id === id) || null;
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.users.find(user => user.username === username) || null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    return this.users.find(user => user.email.toString() === email.toString()) || null;
  }

  async save(user: User): Promise<User> {
    if (user.id === null) {
      // New user
      const id = `user_${this.idCounter++}`;
      const savedUser = User.reconstruct(
        id,
        user.email,
        user.username,
        user.password,
        user.createdAt,
        new Date()
      );
      this.users.push(savedUser);
      return savedUser;
    } else {
      // Update existing user
      const index = this.users.findIndex(u => u.id === user.id);
      if (index >= 0) {
        this.users[index] = user;
      }
      return user;
    }
  }
}
