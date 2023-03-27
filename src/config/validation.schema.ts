import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.required().valid('development', 'stage', 'production', 'test'),

  // Database
  DATABASE_CONNECTION: Joi.string().required(),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().required(),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  // DATABASE_SYNCHRONIZE: Joi.boolean().required(),

  // Email
  EMAIL_SERVICE: Joi.string().required(),
  EMAIL_AUTH_USER: Joi.string().required(),
  EMAIL_AUTH_PASSWORD: Joi.string().required(),
  EMAIL_BASE_URL: Joi.string().required().uri(),

  // JWT
  JWT_SECRET: Joi.string().required(),

  // Admin
  ADMIN_USERNAME: Joi.string().required().min(5),
  ADMIN_PASSWORD: Joi.string().required().min(10),

  // Swagger
  SWAGGER_URL: Joi.string().required(),
});
