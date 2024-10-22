import type { PostgresUserRepository } from "@/server/entity/user/repository/PostgresUserRepository";
import type { RepositoryProvider } from "../Repository";

export class PostgresProvider implements RepositoryProvider {
	userRepository: PostgresUserRepository;

	constructor(userRepository: PostgresUserRepository) {
		this.userRepository = userRepository;
	}

	get UserRepository(): PostgresUserRepository {
		return this.userRepository;
	}
}
