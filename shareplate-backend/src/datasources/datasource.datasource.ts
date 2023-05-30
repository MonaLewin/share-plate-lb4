import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'datasource',
  connector: 'postgresql',
  //External Database URL
  //url: 'postgres://user:password@host:port/database?ssl=true'
  url: 'postgres://shareplate_db_user:1SW5FZVJgdE7CbygkPlVBFZkrbhUTXRK@dpg-ch0oglrh4hsukp4i85m0-a.frankfurt-postgres.render.com:5432/shareplate_db?ssl=true'
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class DatasourceDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'datasource';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.datasource', {optional: true})
      dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
