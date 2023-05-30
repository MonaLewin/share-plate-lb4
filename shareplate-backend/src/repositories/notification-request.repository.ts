import {DefaultCrudRepository} from '@loopback/repository';
import {NotificationRequest, NotificationRequestRelations} from '../models';
import {inject} from '@loopback/core';
import {DbDatasource} from '../datasources';

export class NotificationRequestRepository extends DefaultCrudRepository<
  NotificationRequest,
  typeof NotificationRequest.prototype.id,
  NotificationRequestRelations
> {
  constructor(@inject('datasources.db') dataSource: DbDatasource) {
    super(NotificationRequest, dataSource);
  }
}
