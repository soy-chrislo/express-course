import type { UserDomain, UserDto } from "@/server/entity/user/User";
import type { Repository, RepositoryProvider } from "./Repository";

export class DatabaseProvider implements RepositoryProvider {
  userRepository: Repository<Partial<UserDto>, UserDomain>;

  constructor(userRepository: Repository<Partial<UserDto>, UserDomain>) {
    this.userRepository = userRepository;
  }

  get UserRepository(): Repository<Partial<UserDto>, UserDomain> {
    return this.userRepository;
  }
}