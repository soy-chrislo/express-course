import type { Repository } from "./Repository";

export interface DatabaseDriver {
	connect(): Promise<void>;
	disconnect(): Promise<void>;
	getRepository<T>(entity: new () => T): Repository<T>;
}
