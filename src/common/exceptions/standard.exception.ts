import { HttpException } from '@nestjs/common';
import { ERROR } from '../types';

export class StandardException extends HttpException {
  constructor(public readonly err: ERROR) {
    super(err.data, err.status);
  }
}
