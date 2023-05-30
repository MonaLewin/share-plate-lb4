import {Entity, model, property} from '@loopback/repository';

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
  image: any;

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
  pickedUp: boolean;


  constructor(data?: Partial<FoodOffer>) {
    super(data);
  }
}

export interface FoodOfferRelations {
  // describe navigational properties here
}

export type FoodOfferWithRelations = FoodOffer & FoodOfferRelations;
