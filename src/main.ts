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
		// run every 5 minutes
		'0 0 */3 * * *',
		async () => {
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

	logger.info('Application started');
};

main().catch((error) => {
	logger.error(error.message);
	process.exit(1);
});
