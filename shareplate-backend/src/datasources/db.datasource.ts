import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'datasource',
  connector: 'postgresql',
  url: 'postgres://share_plate_db_user:U9KLlUMX8pFDmJkNevm67rTLh5zYNWB0@dpg-chqvout269vcgs04vjt0-a.frankfurt-postgres.render.com/share_plate_db',
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('db')
export class DbDatasource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'db';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.db', {optional: true})
      dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
