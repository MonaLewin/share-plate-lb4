import {DefaultCrudRepository} from "@loopback/repository";
import {inject} from "@loopback/core";
import {DatasourceDataSource} from "../datasources";
import {PushNotification, PushNotificationRelations} from "../models";

export class PushNotificationRepository extends DefaultCrudRepository<
    PushNotification,
typeof PushNotification.prototype.id,
PushNotificationRelations
> {
    constructor(@inject('datasources.datasource') dataSource: DatasourceDataSource,
                ) {
        super(PushNotification, dataSource);
    }
}