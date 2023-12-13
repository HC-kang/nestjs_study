import { ErrorCode } from '.';

export class SomeException extends Error {
  constructor(
    public readonly errorCode: ErrorCode,
    public readonly message: string = errorCode.message,
  ) {
    super(message);
  }
}
