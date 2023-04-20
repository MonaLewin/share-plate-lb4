import {inject} from "@loopback/core";
import {DefaultCrudRepository} from "@loopback/repository";
import  {DatasourceDataSource} from "../datasources";
import {DeviceToken, DeviceTokenRelations} from "../models";

export class DeviceTokenRepository extends DefaultCrudRepository<
    DeviceToken,
typeof DeviceToken.prototype.id,
DeviceTokenRelations
> {
    constructor(@inject('datasources.datasource') dataSource: DatasourceDataSource,
                ) {
        super(DeviceToken, dataSource);
    }
}