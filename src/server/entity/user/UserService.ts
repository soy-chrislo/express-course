import type { DatabaseModule } from "@/database/DatabaseModule";
import { UserRepository } from "./UserRepository";
import type { UserDomain, UserDto } from "./User";

export class UserService {
	private userRepository: UserRepository;

	constructor(databaseModule: DatabaseModule) {
		this.userRepository = new UserRepository(databaseModule);
	}

	async createUser(user: UserDto): Promise<UserDomain> {
		return await this.userRepository.create(user);
	}

	async updateUser(user: UserDto): Promise<UserDomain> {
		return await this.userRepository.update(user);
	}

	async getUser(user: UserDto): Promise<UserDomain | null> {
		return await this.userRepository.findOne(user);
	}

	async getAllUsers(dto?: UserDto): Promise<UserDomain[]> {
		if (!dto) return await this.userRepository.findAll();

		return await this.userRepository.find(dto);
	}
}
