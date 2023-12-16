import { v4 as uuidv4 } from 'uuid';
import { ERROR, Try, TryCatch } from './types';

export const toSeconds = (input: string) => {
  const units = {
    s: 1, // seconds
    m: 60, // minutes
    h: 60 * 60, // hours
    d: 60 * 60 * 24, // days
    w: 60 * 60 * 24 * 7, // weeks
  };
  const match = input.match(/(\d+)([smhdw])/);

  if (!match) {
    throw new Error('Invalid input format');
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  return value * (units[unit] || 0);
};

export const removeUndefinedKeys = (
  obj: Record<string, any>,
): Record<string, any> => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === undefined) {
      delete obj[key];
    }
  });

  return obj;
};

export const getStartOfDay = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
};

export const getEndOfDay = (date: Date) => {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
  );
};

export const generateUUIDs = (keys) => {
  return keys.reduce((acc, key) => {
    acc[key] = uuidv4();
    return acc;
  }, {});
};

export const formattedString = (str: string) => JSON.stringify(str, null, 2);

export function tryCatch<T, E extends ERROR>(
  fn: () => T,
  someError = {
    result: false,
    status: 500,
    errorCode: 5000,
    data: 'Internal Server Error',
  } as E,
): TryCatch<T, E> {
  try {
    const data = fn();
    return { result: true, status: 200, errorCode: 1000, data: data } as Try<T>;
  } catch (error) {
    if (someError && error instanceof someError.constructor) {
      return someError;
    }
    // Check if the error is one of the custom errors and set the code accordingly
    // if (error instanceof NotFoundError || error instanceof ValidationError) {
    //   return { result: false, code: error.code, data: error.message };
    // }
    // Default error handling
    return {
      result: false,
      status: 500,
      errorCode: 5000,
      data: 'Internal Server Error',
    } as E;
  }
}
