import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasOneRepositoryFactory} from '@loopback/repository';
import {DbDatasource} from '../datasources';
import {FoodOffer, FoodOfferRelations, Reservation} from '../models';
import {ReservationRepository} from './reservation.repository';

export class FoodOfferRepository extends DefaultCrudRepository<FoodOffer, typeof FoodOffer.prototype.id, FoodOfferRelations> {

  public readonly reservation: HasOneRepositoryFactory<Reservation, typeof FoodOffer.prototype.id>;

  constructor(@inject('datasources.db') dataSource: DbDatasource, @repository.getter('ReservationRepository') protected reservationRepositoryGetter: Getter<ReservationRepository>,) {
    super(FoodOffer, dataSource);
    this.reservation = this.createHasOneRepositoryFactoryFor('reservation', reservationRepositoryGetter);
    this.registerInclusionResolver('reservation', this.reservation.inclusionResolver);
  }
}
