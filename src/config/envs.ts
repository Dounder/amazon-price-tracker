import 'dotenv/config';
import joi from 'joi';

interface EnvVars {
	DB_FILENAME: string;
}

const envSchema = joi
	.object({
		DB_FILENAME: joi.string().required(),
	})
	.unknown(true);

const { error, value } = envSchema.validate(process.env);

if (error) throw new Error(`Config validation error: ${error.message}`);

const envVars: EnvVars = value;

export const envs = {
	dbFilename: envVars.DB_FILENAME,
};
