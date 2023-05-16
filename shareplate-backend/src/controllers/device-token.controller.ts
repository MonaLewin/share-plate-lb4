import {getModelSchemaRef, post, requestBody, response} from '@loopback/rest';
import {DeviceToken} from '../models';
import {repository} from '@loopback/repository';
import {DeviceTokenRepository} from '../repositories';

export class DeviceTokenController {
  constructor(
    @repository(DeviceTokenRepository)
    public deviceTokenRepository: DeviceTokenRepository,
  ) {}

  @post('/device-token')
  @response(200, {
    description: 'DeviceToken model instance',
    content: {'application/json': {schema: getModelSchemaRef(DeviceToken)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DeviceToken, {
            title: 'NewDeviceToken',
            exclude: ['id'],
          }),
        },
      },
    })
    deviceToken: Omit<DeviceToken, 'id'>,
  ): Promise<DeviceToken> {
    //check if device token is already in database
    const existingToken = await this.deviceTokenRepository.findOne({
      where: {deviceToken: deviceToken.deviceToken},
    });
    return existingToken
      ? existingToken
      : this.deviceTokenRepository.create(deviceToken);
  }
}
