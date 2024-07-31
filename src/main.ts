import { BrowserManager } from '@/utils';
import { CronJob } from 'cron';
import { productsUrls } from './data';
import { Logger } from './logger';
import { scrapProducts } from './use-cases';

const logger = new Logger('Main');

const main = async () => {
	const logger = new Logger('Main');
	logger.info('Starting the application');

	new CronJob(
		// run at 9:00 AM every day
		'0 9 * * *',
		async () => {
			logger.info('Beginning search at 9:00 AM');

			const browserManager = new BrowserManager();
			const browser = await browserManager.getBrowser();

			await scrapProducts(browser, productsUrls);

			logger.info('Finished handling products');

			logger.info('Closing browser instance');
			await browser.close();
		}, // onTick
		null, // onComplete
		true, // start
		'America/Los_Angeles' // timeZone
	);

	// new job to run at 9:00 PM every day
	new CronJob(
		'0 21 * * *',
		async () => {
			logger.info('Beginning search at 9:00 PM');

			const browserManager = new BrowserManager();
			const browser = await browserManager.getBrowser();

			await scrapProducts(browser, productsUrls);

			logger.info('Finished handling products');

			logger.info('Closing browser instance');
			await browser.close();
		},
		null,
		true,
		'America/Los_Angeles'
	);

	logger.info('Application started');
};

main().catch((error) => {
	logger.error(error.message);
	process.exit(1);
});
