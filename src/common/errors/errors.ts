import { messages } from '../resources';
import { ERROR } from '../types';

export const USER_NOT_FOUND = {
  result: false,
  status: 404,
  errorCode: 4004,
  data: messages.USER_NOT_FOUND,
} as const;
export type USER_NOT_FOUND = ERROR & typeof USER_NOT_FOUND;

export type ALREADY_EXIST_EMAIL = ERROR & typeof ALREADY_EXIST_EMAIL;
export const ALREADY_EXIST_EMAIL = {
  result: false,
  status: 422,
  errorCode: 4005,
  data: messages.ALREADY_EXIST_EMAIL,
} as const;

export type UNAUTHORIZED_USER = ERROR & typeof UNAUTHORIZED_USER;
export const UNAUTHORIZED_USER = {
  result: false,
  status: 401,
  errorCode: 4006,
  data: messages.UNAUTHORIZED_USER,
} as const;
