import { dataORM } from '@db/dbconfig';
import { CreateUserInputModel } from '@domain/model';
import { User } from '@entities/user';
import { Service } from 'typedi';
import { Repository } from 'typeorm';

@Service()
export class UserDataSource {
  private readonly userRepository: Repository<User> = dataORM.getRepository(User);

  findOneByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  saveUser(user: CreateUserInputModel) {
    return this.userRepository.save({ ...user });
  }
}
