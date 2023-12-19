import { ERROR } from '../types';

export * from './errors';

export const isErrorGuard = (obj: any): obj is ERROR => {
  if (obj.result === false) {
    return true;
  }
  return false;
};
