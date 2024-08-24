export interface Repository<EntityDto, EntityDomain> {
	create(entity: EntityDto): Promise<EntityDomain>;
	update(entity: EntityDto): Promise<EntityDomain>;
	delete(id: string): Promise<void>;
	find(
		properties: Record<string, unknown>,
		relations?: string[],
	): Promise<EntityDomain[]>;
	findOne(
		properties: Record<string, unknown>,
		relations?: string[],
	): Promise<EntityDomain | null>;
	findAll(): Promise<EntityDomain[]>;
}