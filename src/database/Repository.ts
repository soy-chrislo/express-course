import type { UserDomain, UserDto } from "@/server/entity/user/User";

export interface Repository<EntityDto, EntityDomain> {
	create(entity: EntityDto): Promise<EntityDomain>;
	update(entity: EntityDto): Promise<EntityDomain>;
	delete(id: number): Promise<EntityDomain>;
	find(
		properties: Record<string, unknown>,
		relations?: string[],
	): Promise<EntityDomain[]>;
	findOne(
		properties: Record<string, unknown>,
		relations?: string[],
	): Promise<EntityDomain | null>;
	findAll(relations?: string[]): Promise<EntityDomain[]>;
}

export interface RepositoryProvider {
	userRepository: Repository<UserDto, UserDomain>;
}
