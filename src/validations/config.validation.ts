import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'staging')
    .required(),
  PORT: Joi.number().default(3000),
  APP_NAME: Joi.string().lowercase().required(),
});
