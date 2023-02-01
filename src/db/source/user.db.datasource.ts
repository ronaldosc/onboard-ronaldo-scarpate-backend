import { CreateUserInputModel } from '@domain/model';
import { User } from '@entities';
import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { Database } from '../dbconfig';

@Service()
export class UserDataSource {
  protected readonly userRepository: Repository<User> = Database.dataORM.getRepository(User);

  findOneByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  saveUser(user: CreateUserInputModel & { salt: string }) {
    return this.userRepository.save({ ...user });
  }
}
