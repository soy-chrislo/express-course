import type { DatabaseActions } from "./DatabaseActions.ts";

export class DatabaseModule {
	private driver: DatabaseActions;

	constructor(driver: DatabaseActions) {
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
