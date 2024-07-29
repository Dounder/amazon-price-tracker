import { Logger } from '@/logger';
import puppeteer, { Browser, Page, type PuppeteerLaunchOptions } from 'puppeteer';

const puppeteerOptions: PuppeteerLaunchOptions = { headless: false, slowMo: 50, args: ['--no-sandbox', '--disable-setuid-sandbox'] };

export class BrowserManager {
	private readonly logger = new Logger('BrowserManager');

	private browser: Browser | null = null;

	constructor() {}

	public async getBrowser(): Promise<Browser> {
		this.logger.info('Getting browser instance');

		if (!this.browser) this.browser = await puppeteer.launch(puppeteerOptions);

		return this.browser;
	}

	public async getPage(): Promise<Page> {
		this.logger.info('Getting page instance');

		const browser = await this.getBrowser();

		return await browser.newPage();
	}

	public async closePage(page: Page): Promise<void> {
		this.logger.info('Closing page instance');

		await page.close();
	}

	public async closeBrowser(): Promise<void> {
		this.logger.info('Closing browser instance');

		if (this.browser) {
			await this.browser.close();
			this.browser = null;
		}
	}
}
