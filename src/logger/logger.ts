import { createLogger, format, transports, Logger as WinstonLogger } from 'winston';
import assert from 'assert';
import chalk from 'chalk';

export class Logger {
	private readonly context: string;
	private readonly logger: WinstonLogger;

	constructor(context: string) {
		assert(context, 'Logger context (name) is required'); // Check if the context is provided

		this.context = context; // Set the context
		this.logger = createLogger({
			// Create a new logger
			level: 'info', // Set the log level
			format: format.combine(
				format((info) => {
					info.level = info.level.toUpperCase();
					return info;
				})(),
				format.colorize({ all: true }),
				format.timestamp({ format: 'DD/MM/YYYY HH:mm:ss' }),
				format.json(),
				format.errors({ stack: true }),
				format.printf(({ message, level, timestamp }) => {
					const levelColor =
						{
							info: chalk.blue(level),
							warn: chalk.yellow(level),
							error: chalk.red(level),
							debug: chalk.green(level),
						}[level] || level;

					const timestampColor = chalk.gray(`[${timestamp}]`);
					const contextColor = chalk.yellow(`[${this.context}]`);
					const messageColor = chalk.cyan(message);

					return `${timestampColor} ${levelColor} ${contextColor} ${messageColor}`;
				}),
				format.ms()
			),
			transports: [
				new transports.Console(), // Log to console
				new transports.File({
					filename: 'logs/combined.log',
					format: format.combine(format.uncolorize(), format.json()),
				}), // Log to file
				new transports.File({
					filename: 'logs/errors.log',
					level: 'errors',
					format: format.combine(format.uncolorize(), format.json()),
				}), // Log errors to file
			],
		});
	}

	log(message: string) {
		this.logger.info(message);
	}

	info(message: string) {
		this.logger.info(message);
	}

	error(message: string) {
		this.logger.error(message);
	}

	warn(message: string) {
		this.logger.warn(message);
	}

	debug(message: string) {
		this.logger.debug(message);
	}
}
