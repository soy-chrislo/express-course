import type { Repository, RepositoryProvider } from "@/database/Repository";
import type { UserDomain, UserDto } from "../User";

export class UserRepository implements Repository<UserDto, UserDomain> {
	private userRepository: Repository<UserDto, UserDomain>;

	constructor(repositoryProvider: RepositoryProvider) {
		this.userRepository = repositoryProvider.userRepository;
	}

	async create(entity: Partial<UserDomain>): Promise<UserDomain> {
		return await this.userRepository.create(entity);
	}

	async update(entity: Partial<UserDomain>): Promise<UserDomain> {
		return await this.userRepository.update(entity);
	}

	async delete(id: number): Promise<UserDomain> {
		return await this.userRepository.delete(id);
	}

	async find(
		properties: Record<string, unknown>,
		relations?: string[],
	): Promise<UserDomain[]> {
		return await this.userRepository.find(properties, relations);
	}

	async findOne(
		properties: Record<string, unknown>,
		relations?: string[],
	): Promise<UserDomain | null> {
		return await this.userRepository.findOne(properties, relations);
	}

	async findAll(relations?: string[]): Promise<UserDomain[]> {
		return await this.userRepository.findAll(relations);
	}
}
