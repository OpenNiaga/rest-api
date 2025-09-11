export class Result<T, E> {
  private constructor(
    private readonly _success: boolean,
    private readonly _value?: T,
    private readonly _error?: E,
  ) {}

  // Status check
  get isSuccess(): boolean {
    return this._success;
  }

  get isFailure(): boolean {
    return !this._success;
  }

  // Accessors
  get value(): T {
    if (!this._success) {
      throw new Error("Cannot access value from a failed result.");
    }
    return this._value as T;
  }

  get error(): E {
    if (this._success) {
      throw new Error("Cannot access error from a successful result.");
    }
    return this._error as E;
  }

  // Factory method: success
  static success<T, E = never>(value: T): Result<T, E> {
    return new Result<T, E>(true, value);
  }

  // Factory method: failure
  static failure<T = never, E = unknown>(error: E): Result<T, E> {
    return new Result<T, E>(false, undefined, error);
  }
}
