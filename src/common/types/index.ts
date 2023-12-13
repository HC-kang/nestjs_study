export class Ok<T> {
  constructor(public readonly value: T) {}

  isOk(): this is Ok<T> {
    return true;
  }

  isErr(): this is Err<any> {
    return false;
  }
}

export class Err<E> {
  constructor(public readonly error: E) {}

  isOk(): this is Ok<any> {
    return false;
  }

  isErr(): this is Err<E> {
    return true;
  }
}

export type Maybe<T> = T | null;

export type Result<T, E = Error> = Ok<T> | Err<E>;
