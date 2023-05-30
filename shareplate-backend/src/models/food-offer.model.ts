import {Entity, model, property, hasOne} from '@loopback/repository';
import {Reservation} from './reservation.model';

@model()
export class FoodOffer extends Entity {
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
  name: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'any',
    required: true,
  })
  image: never;

  @property({
    type: 'string',
    required: true,
  })
  location: string;

  @property({
    type: 'date',
    required: true,
  })
  datetime: string;

  @property({
    type: 'boolean',
    required: true,
  })
  reserved: boolean;

  @property({
    type: 'boolean',
    required: true,
  })
  pickedUp: boolean;

  @property({
    type: 'number',
  })
  createdBy?: number;

  @hasOne(() => Reservation)
  reservation: Reservation;

  constructor(data?: Partial<FoodOffer>) {
    super(data);
  }
}

export interface FoodOfferRelations {
  // describe navigational properties here
}

export type FoodOfferWithRelations = FoodOffer & FoodOfferRelations;
