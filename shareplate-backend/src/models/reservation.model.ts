import {Entity, model, property} from '@loopback/repository';

@model({
  datasource: 'db'
})
export class Reservation extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'date',
    required: true,
  })
  timestamp: string;

  @property({
    type: 'date',
  })
  timeOfPickup?: string;

  @property({
    type: 'boolean',
    required: true,
  })
  accepted: boolean;

  @property({
    type: 'number',
    required: true,
  })
  reservedBy: number;

  constructor(data?: Partial<Reservation>) {
    super(data);
  }
}

export interface ReservationRelations {
  // describe navigational properties here
}

export type ReservationWithRelations = Reservation & ReservationRelations;
