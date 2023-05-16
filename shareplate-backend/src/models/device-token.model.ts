import {Entity, model, property} from '@loopback/repository';

@model({
  datasource: 'db'
  })
export class DeviceToken extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  deviceToken: string;

  constructor(data?: Partial<DeviceToken>) {
    super(data);
  }
}

export interface DeviceTokenRelations {
  //describe navigational properties here
}

export type DeviceTokenWithRelations = DeviceToken & DeviceTokenRelations;
