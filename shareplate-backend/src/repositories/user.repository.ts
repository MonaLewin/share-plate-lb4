import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDatasource} from '../datasources';
import {User, UserRelations} from '../models';
import bcrypt from 'bcryptjs';
import {Credentials} from '@loopback/authentication-jwt';
import {securityId, UserProfile} from '@loopback/security';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {
  constructor(@inject('datasources.db') dataSource: DbDatasource) {
    super(User, dataSource);
  }

  // Finds the user matching the email address, and compares the password.
  // If successful, returns user object
  async findCredentials(credentials: Credentials): Promise<User | undefined> {
    const {email, password} = credentials;
    const user = await this.findOne({where: {email}});
    if (!user) {
      return undefined;
    }
    const passwordMatched = await bcrypt.compare(password, user.password);
    if (!passwordMatched) {
      return undefined;
    }

    return user;
  }

  // Minimum set of attributes that uniquely identify a user.
  convertToUserProfile(user: User): UserProfile {
    return {
      [securityId]: user.id?.toString() ?? '',
      id: user.id,
      email: user.email,
    };
  }
}
