export interface Repository<T> {
	create(data: T): Promise<T>;
	update(data: T): Promise<T>;
	delete(id: string): Promise<void>;
	find(properties: Record<string, unknown>, relations?: string[]): Promise<T>;
	findAll(): Promise<T[]>;
}
