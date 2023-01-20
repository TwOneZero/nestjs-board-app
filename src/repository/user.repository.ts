import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CustomRepository } from './typeorm-ex.decorator';

@CustomRepository(User)
export class UserRepository extends Repository<User> {}
