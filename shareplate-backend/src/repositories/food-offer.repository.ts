import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDatasource} from '../datasources';
import {FoodOffer, FoodOfferRelations} from '../models';

export class FoodOfferRepository extends DefaultCrudRepository<FoodOffer, typeof FoodOffer.prototype.id, FoodOfferRelations> {
  constructor(@inject('datasources.db') dataSource: DbDatasource) {
    super(FoodOffer, dataSource);
  }
}
