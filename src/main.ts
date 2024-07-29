import { BrowserManager } from '@/utils';
import { Logger } from './logger';
import { scrapProducts } from './use-cases';
import { productsUrls } from './data';

const logger = new Logger('Main');

const main = async () => {
	const logger = new Logger('Main');
	const browserManager = new BrowserManager();
	const browser = await browserManager.getBrowser();

	// const job = new CronJob(
	// 	// run at the 9 am every day
	// 	'0 9 * * *',
	// 	async () => {
	await scrapProducts(browser, productsUrls);

	logger.info('Finished handling products');

	logger.info('Closing browser instance');
	await browser.close();
	// 	}, // onTick
	// 	null, // onComplete
	// 	true, // start
	// 	'America/Los_Angeles' // timeZone
	// );
};

main().catch((error) => {
	logger.error(error.message);
	process.exit(1);
});
