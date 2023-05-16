import {Entity, model, property} from '@loopback/repository';

//import {DeviceToken} from "./device-token.model";

@model({
  datasource: 'db'
})
export class NotificationRequest extends Entity {
  @property({
    type: 'number',
    id: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @property({
    type: 'string',
    required: true,
  })
  body: string;

  /*
  @property({
      type: 'DeviceToken',
      required: true,
  })
  deviceToken: DeviceToken
   */
  constructor(data?: Partial<NotificationRequest>) {
    super(data);
  }
}

export interface NotificationRequestRelations {
  //describe navigational properties here
}

export type NotificationRequestWithRelation = NotificationRequest &
  NotificationRequestRelations;
