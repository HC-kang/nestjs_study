class ErrorCodeVo {
  constructor(
    public readonly code: string,
    public readonly message: string,
  ) {}
}

export type ErrorCode = ErrorCodeVo;

export const SOME_ERROR = new ErrorCodeVo('SOME_ERROR', 'Some error');
