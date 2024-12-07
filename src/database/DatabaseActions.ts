export interface DatabaseActions {
	connect(): Promise<void>;
	disconnect(): Promise<void>;
	setup(): Promise<void>;
	query(query: string, values: unknown[]): Promise<unknown>;
}
