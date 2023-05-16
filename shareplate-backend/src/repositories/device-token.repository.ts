import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDatasource} from '../datasources';
import {DeviceToken, DeviceTokenRelations} from '../models';

export class DeviceTokenRepository extends DefaultCrudRepository<DeviceToken, typeof DeviceToken.prototype.id, DeviceTokenRelations> {
  constructor(@inject('datasources.db') dataSource: DbDatasource) {
    super(DeviceToken, dataSource);
  }
}