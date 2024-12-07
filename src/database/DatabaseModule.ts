import type { DatabaseActions } from "./DatabaseActions.ts";

export class DatabaseModule {
	private driver: DatabaseActions;

	constructor(driver: DatabaseActions) {
		this.driver = driver;
	}

	async setup(): Promise<void> {
		await this.driver.setup();
	}

	async connect(): Promise<void> {
		await this.driver.connect();
	}

	async disconnect(): Promise<void> {
		await this.driver.disconnect();
	}

	async query(query: string, values: unknown[]): Promise<unknown> {
		try {
			return await this.driver.query(query, values);
		} catch (error) {
			console.error(
				`Missmatch query error with the database driver ${this.driver.constructor.name}`,
				error,
			);
			throw error;
		}
	}
}
