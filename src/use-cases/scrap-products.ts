import { Database } from '@/db';
import type { Product } from '@/db/prices.interfaces';
import { Logger } from '@/logger';
import type { Browser, Page } from 'puppeteer';

const logger = new Logger('Navigate');

export const scrapProducts = async (browser: Browser, urls: string[]) => {
	const page = await browser.newPage();
	await page.setViewport({ width: 1080, height: 1024 });
	await setMiamiZipCode(page);

	const db = Database.getInstance();

	const products: Product[] = [];

	for (const url of urls) {
		const { productName, productPrice } = await handleProduct(page, url);

		products.push({ productName, price: productPrice, url });
	}

	logger.info('Saving products to the database');
	db.insertProducts(products);
};

const handleProduct = async (page: Page, url: string) => {
	logger.info(`Navigating to ${url}`);

	await page.goto(url);

	const productName = await getProductName(page);
	const productPrice = await getProductPrice(page);

	logger.info(`${productName} costs $${productPrice}`);

	return { productName, productPrice };
};

const getProductName = async (page: Page) => {
	logger.info('Getting the Product Name...');

	const textSelector = await page.locator('#productTitle').waitHandle();
	const productName: string = await textSelector?.evaluate((el) => el.textContent);

	return productName.trim();
};

const getProductPrice = async (page: Page) => {
	logger.info('Getting the Product Price...');

	const textSelector = await page
		.locator('#corePriceDisplay_desktop_feature_div > div.a-section.a-spacing-none.aok-align-center.aok-relative > span.aok-offscreen')
		.waitHandle();
	const productPrice: string = await textSelector?.evaluate((el) => el.textContent);

	return convertCurrencyStringToNumber(productPrice);
};

const convertCurrencyStringToNumber = (currencyString: string): number => {
	const currency = currencyString.replace('$', '').replace(',', '');
	return parseFloat(currency);
};

const setMiamiZipCode = async (page: Page) => {
	await page.goto('https://www.amazon.com/');

	logger.info('Setting the Miami zip code...');

	await page.waitForSelector('#nav-global-location-popover-link');

	await page.click('#nav-global-location-popover-link');

	logger.info('Typing the zip code 33101...');
	await page.locator('#GLUXZipUpdateInput').fill('33101');

	logger.info('Submitting the zip code...');
	await page.click('#GLUXZipUpdate > span > input');
};
