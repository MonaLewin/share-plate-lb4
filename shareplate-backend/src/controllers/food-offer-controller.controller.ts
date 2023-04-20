import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {FoodOffer} from '../models';
import {FoodOfferRepository} from '../repositories';

export class FoodOfferControllerController {
  constructor(
    @repository(FoodOfferRepository)
    public foodOfferRepository: FoodOfferRepository,
  ) {
  }

  @post('/food-offers')
  @response(200, {
    description: 'FoodOffer model instance',
    content: {'application/json': {schema: getModelSchemaRef(FoodOffer)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FoodOffer, {
            title: 'NewFoodOffer',
            exclude: ['id'],
          }),
        },
      },
    })
      foodOffer: Omit<FoodOffer, 'id'>,
  ): Promise<FoodOffer> {
    return this.foodOfferRepository.create(foodOffer);
  }

  @get('/food-offers/count')
  @response(200, {
    description: 'FoodOffer model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(FoodOffer) where?: Where<FoodOffer>,
  ): Promise<Count> {
    return this.foodOfferRepository.count(where);
  }

  @get('/food-offers')
  @response(200, {
    description: 'Array of FoodOffer model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(FoodOffer, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(FoodOffer) filter?: Filter<FoodOffer>,
  ): Promise<FoodOffer[]> {
    return this.foodOfferRepository.find(filter);
  }

  @patch('/food-offers')
  @response(200, {
    description: 'FoodOffer PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FoodOffer, {partial: true}),
        },
      },
    })
      foodOffer: FoodOffer,
    @param.where(FoodOffer) where?: Where<FoodOffer>,
  ): Promise<Count> {
    return this.foodOfferRepository.updateAll(foodOffer, where);
  }

  @get('/food-offers/{id}')
  @response(200, {
    description: 'FoodOffer model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(FoodOffer, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(FoodOffer, {exclude: 'where'}) filter?: FilterExcludingWhere<FoodOffer>,
  ): Promise<FoodOffer> {
    return this.foodOfferRepository.findById(id, filter);
  }

  @patch('/food-offers/{id}')
  @response(204, {
    description: 'FoodOffer PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FoodOffer, {partial: true}),
        },
      },
    })
      foodOffer: FoodOffer,
  ): Promise<void> {
    await this.foodOfferRepository.updateById(id, foodOffer);
  }

  @put('/food-offers/{id}')
  @response(204, {
    description: 'FoodOffer PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() foodOffer: FoodOffer,
  ): Promise<void> {
    await this.foodOfferRepository.replaceById(id, foodOffer);
  }

  @del('/food-offers/{id}')
  @response(204, {
    description: 'FoodOffer DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.foodOfferRepository.deleteById(id);
  }
}
