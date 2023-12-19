import { v4 as uuidv4 } from 'uuid';

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
