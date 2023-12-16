/* eslint-disable @typescript-eslint/no-namespace */
export interface ResponseForm<T> {
  result: true;
  status: number;
  errorCode: 1000;
  data: T;
}

export type ERROR = {
  result: false;
  status: number;
  errorCode: number;
  data: string;
};

export type Try<T> = ResponseForm<T>;
export type TryCatch<T, E extends ERROR> = ResponseForm<T> | E;
