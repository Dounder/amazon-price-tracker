import { Database as BunDatabase, Statement } from 'bun:sqlite';
import { envs } from '@/config';
import type { Product } from './prices.interfaces';

class Database {
	private static instance: Database | null;
	private db: BunDatabase;

	private constructor() {
		this.db = new BunDatabase(envs.dbFilename);
		this.initialize();
	}

	public static getInstance(): Database {
		if (!Database.instance) Database.instance = new Database();

		return Database.instance;
	}

	private initialize() {
		this.db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        url TEXT,
				product_name TEXT,
        price TEXT,
        last_checked DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
	}

	public async insertProduct(product: Product): Promise<void> {
		const { url, productName, price } = product;
		const stmt: Statement = this.db.prepare('INSERT INTO products (url, product_name, price) VALUES (?, ?, ?)');
		stmt.run(url, productName, price);
	}

	public async insertProducts(products: Product[]): Promise<void> {
		const stmt: Statement = this.db.prepare('INSERT INTO products (url, product_name, price) VALUES (?, ?, ?)');
		products.forEach((product) => {
			const { url, productName, price } = product;
			stmt.run(url, productName, price);
		});
	}

	public async getAllProducts(): Promise<any[]> {
		const stmt: Statement = this.db.prepare('SELECT * FROM products');
		return stmt.all();
	}

	public async close(): Promise<void> {
		this.db.close();
		Database.instance = null; // Allow re-initialization if needed
	}
}

export { Database };
