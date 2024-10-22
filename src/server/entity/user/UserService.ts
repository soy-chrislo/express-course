import type { Repository, RepositoryProvider } from "@/database/Repository";
import type { UserDomain, UserDto } from "./User";

export class UserService {
	private userRepository: Repository<UserDto, UserDomain>;

	constructor(repositoryProvider: RepositoryProvider) {
		this.userRepository = repositoryProvider.userRepository;
	}

	async deleteUser(user: UserDto): Promise<UserDomain> {
		const userId = user.id;
		if (userId === undefined) throw new Error("No id provided");
		return await this.userRepository.delete(userId);
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
