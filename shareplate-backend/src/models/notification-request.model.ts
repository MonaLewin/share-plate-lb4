import {Entity, model, property} from '@loopback/repository';

//import {DeviceToken} from "./device-token.model";

@model()
export class NotificationRequest extends Entity {
  @property({
    type: 'number',
    id: true,
  })
  id: number;

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

  constructor(data?: Partial<NotificationRequest>) {
    super(data);
    Object.assign(this, data);
  }
}

export interface NotificationRequestRelations {
  //describe navigational properties here
}

export type NotificationRequestWithRelation = NotificationRequest &
  NotificationRequestRelations;
