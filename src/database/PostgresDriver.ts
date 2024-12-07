import pg from "pg";
import type { DatabaseActions } from "./DatabaseActions.ts";

const { Pool } = pg;

export class PostgresDriver implements DatabaseActions {
	private pool: pg.Pool;

	constructor() {
		this.pool = new Pool({
			user: "admin",
			host: "localhost",
			database: "app",
			password: "7Z7(9f<3ti?a>p>w(t078^NAVAW{,£N,fp%[u(V&0x7n^n",
			port: 5432,
		});
	}

	async connect(): Promise<void> {
		await this.pool.connect();
	}

	async disconnect(): Promise<void> {
		await this.pool.end();
	}

	async query(query: string, values: unknown[]): Promise<unknown> {
		return await this.pool.query(query, values);
	}

	async setup(): Promise<void> {
		const query = `
			CREATE TABLE IF NOT EXISTS users (
				id SERIAL PRIMARY KEY,
				name VARCHAR(255) NOT NULL,
				age INT NOT NULL
			)
		`;

		await this.query(query, []);
	}
}
