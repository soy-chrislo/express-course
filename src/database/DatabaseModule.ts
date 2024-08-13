import type { DatabaseDriver } from "./Database";

export class DatabaseModule {
	private driver: DatabaseDriver;

	constructor(driver: DatabaseDriver) {
		this.driver = driver;
	}

	async connect(): Promise<void> {
		await this.driver.connect();
	}

	async disconnect(): Promise<void> {
		await this.driver.disconnect();
	}

	async query(query: string, values: unknown[]): Promise<unknown> {
		return await this.driver.query(query, values);
	}
}
