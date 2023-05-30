import {Entity, hasMany, model, property} from '@loopback/repository';
import {FoodOffer} from './food-offer.model';
import {Reservation} from './reservation.model';

@model({
  settings: {
    hiddenProperties: ['password'],
  },
})
export class User extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
    updateOnly: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    index: {
      unique: true,
    },
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'string',
    required: true,
  })
  firstName: string;

  @property({
    type: 'string',
  })
  lastName?: string;

  @property({
    type: 'string',
  })
  address?: string;

  @hasMany(() => FoodOffer, {keyTo: 'createdBy'})
  foodOffers: FoodOffer[];

  @hasMany(() => Reservation, {keyTo: 'reservedBy'})
  reservations: Reservation[];

  @property({
    type: 'string',
  })
  deviceToken: string;

  constructor(data?: Partial<User>) {
    super(data);
    Object.assign(this, data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
