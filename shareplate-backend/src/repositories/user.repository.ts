import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  repository,
  HasManyRepositoryFactory,
} from '@loopback/repository';
import {DbDatasource} from '../datasources';
import {User, UserRelations, FoodOffer, Reservation} from '../models';
import bcrypt from 'bcryptjs';
import {Credentials} from '@loopback/authentication-jwt';
import {securityId, UserProfile} from '@loopback/security';
import {FoodOfferRepository} from './food-offer.repository';
import {ReservationRepository} from './reservation.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {
  public readonly foodOffers: HasManyRepositoryFactory<
    FoodOffer,
    typeof User.prototype.id
  >;
  public readonly reservations: HasManyRepositoryFactory<
    Reservation,
    typeof User.prototype.id
  >;

  constructor(
    @inject('datasources.db') dataSource: DbDatasource,
    @repository.getter('FoodOfferRepository')
    protected foodOfferRepositoryGetter: Getter<FoodOfferRepository>,
    @repository.getter('ReservationRepository')
    protected reservationRepositoryGetter: Getter<ReservationRepository>,
  ) {
    super(User, dataSource);
    this.reservations = this.createHasManyRepositoryFactoryFor(
      'reservations',
      reservationRepositoryGetter,
    );
    this.registerInclusionResolver(
      'reservations',
      this.reservations.inclusionResolver,
    );
    this.foodOffers = this.createHasManyRepositoryFactoryFor(
      'foodOffers',
      foodOfferRepositoryGetter,
    );
    this.registerInclusionResolver(
      'foodOffers',
      this.foodOffers.inclusionResolver,
    );
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

  async findDeviceTokenById(userId: number): Promise<string | undefined> {
    const user = await this.findOne({where: {id: userId}});
    return user ? user.deviceToken : undefined
  }
}
