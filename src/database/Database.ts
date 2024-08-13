export interface DatabaseDriver {
	connect(): Promise<void>;
	disconnect(): Promise<void>;
	query(query: string, values: unknown[]): Promise<unknown>;
}
