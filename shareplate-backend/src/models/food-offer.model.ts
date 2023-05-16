import {Entity, model, property} from '@loopback/repository';

@model({
  /*
  settings: {
    foreignKeys: {
      fkUserUserid: {
        name: 'fkUserUserid',
        entity: 'User',
        entityKey: 'id',
        foreignKey: 'createdBy',
        onDelete: 'CASCADE',
        onUpdate: 'SET NULL'
      },
    },
  },
  */
  datasource: 'db'


})
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
  createdBy: number;


  constructor(data?: Partial<FoodOffer>) {
    super(data);
  }
}

export interface FoodOfferRelations {
  // describe navigational properties here
}

export type FoodOfferWithRelations = FoodOffer & FoodOfferRelations;
