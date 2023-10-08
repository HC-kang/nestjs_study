import { ConfigService } from '@nestjs/config';

export const isDevelopment = () =>
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

const getValue = (key: string, config?: ConfigService): string => {
  if (config) return config.get<string>(key);
  else return process.env[key];
};

export const required = (
  key: string,
  config?: ConfigService,
  defaultValue?: unknown,
) => {
  const value = getValue(key, config) || defaultValue;
  if (value == null) {
    throw new Error(
      `Key ${key} is undefined in your .env.${process.env.NODE_ENV}`,
    );
  }
  return value;
};
