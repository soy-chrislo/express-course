export interface Repository<T> {
	create(data: T): Promise<T>;
	update(data: T): Promise<T>;
	delete(id: string): Promise<void>;
	find(id: string): Promise<T>;
	findAll(): Promise<T[]>;
}
