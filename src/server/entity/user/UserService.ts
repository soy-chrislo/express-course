import type { DatabaseModule } from "@/database/DatabaseModule";
import { UserRepository } from "./UserRepository";
import type { UserDto, UserEntity } from "./User";

export class UserService {
	private userRepository: UserRepository;

	constructor(private dbModule: DatabaseModule) {
		this.userRepository = new UserRepository(dbModule);
	}

	async createUser(user: UserDto): Promise<UserEntity> {
		return await this.userRepository.create(user);
	}
}
