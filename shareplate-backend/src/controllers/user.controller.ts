import {Filter, repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  post,
  requestBody,
  response,
  SchemaObject,
} from '@loopback/rest';
import {inject} from '@loopback/core';
import {
  Credentials,
  MyUserService,
  TokenServiceBindings,
  UserServiceBindings,
} from '@loopback/authentication-jwt';
import {authenticate, TokenService} from '@loopback/authentication';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {genSalt, hash} from 'bcryptjs';

import {FoodOffer, Reservation, User} from '../models';
import {UserRepository} from '../repositories';

const CredentialsSchema: SchemaObject = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 8,
    },
  },
};

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};

export class UserController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
    @inject(TokenServiceBindings.TOKEN_SERVICE) public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE) public userService: MyUserService,
    @inject(SecurityBindings.USER, {optional: true}) public user: UserProfile,
  ) {}

  /**
   * The login function takes in the user credentials (email + password) and
   * returns a JWT if the credentials match with the credentials of an existing user.
   */
  @post('/users/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{token: string}> {
    // ensure the user exists, and the password is correct
    const user = await this.userRepository.findCredentials(credentials);
    if (!user) {
      throw new HttpErrors.Unauthorized('Invalid email or password');
    }
    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile = this.userRepository.convertToUserProfile(user);

    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);
    return {token};
  }

  /**
   * Requires a valid JWT in the auth header and returns the id of the user,
   * if JWT is valid.
   */
  @authenticate('jwt')
  @get('/whoAmI', {
    responses: {
      '200': {
        description: 'Return current user',
        content: {
          'application/json': {
            schema: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  async whoAmI(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
  ): Promise<string> {
    return currentUserProfile[securityId];
  }

  //@authenticate('jwt')
  @get('/users/{id}', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User, {partial: true}),
          },
        },
      },
    },
  })
  async getUserById(@param.path.number('id') id: number): Promise<User> {
    return this.userRepository.findById(id);
  }

  /**
   * /signup is used to create new user accounts
   * @param newUserRequest the user object containing all necessary information
   * about the user
   * @param signUpResponse 201 if successful, 422 if email is already in use
   */
  @post('users/signup', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User, {partial: true}),
          },
        },
      },
      '422': {
        description: 'Unprocessable Entity',
      },
    },
  })
  async signUp(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
          }),
        },
      },
    })
    newUserRequest: User,
  ): Promise<User> {
    // check if email is already in use, and return 422 if it is.
    const existingUser = await this.userRepository.count({
      email: newUserRequest.email,
    });
    if (existingUser.count > 0) {
      throw new HttpErrors.UnprocessableEntity('Email is already in use');
    }

    // hash the password and create new user object
    const password = await hash(newUserRequest.password, await genSalt());
    const newUser = newUserRequest;
    newUser.password = password;
    return this.userRepository.create(newUser);
  }

  @authenticate('jwt')
  @get('/users/{id}', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User, {partial: true}),
          },
        },
      },
    },
  })
  async findUserById(@param.path.number('id') id: number): Promise<User> {
    return this.userRepository.findById(id);
  }

  @authenticate('jwt')
  @get('/users/{id}/food-offers', {
    responses: {
      '200': {
        description: 'Array of User has many FoodOffer',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(FoodOffer)},
          },
        },
      },
    },
  })
  async findFoodOffersById(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<FoodOffer>,
  ): Promise<FoodOffer[]> {
    return this.userRepository.foodOffers(id).find(filter);
  }

  @authenticate('jwt')
  @get('/users/{id}/reservations', {
    responses: {
      '200': {
        description: 'Array of User has many Reservation',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Reservation)},
          },
        },
      },
    },
  })
  async findReservationsById(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Reservation>,
  ): Promise<Reservation[]> {
    return this.userRepository.reservations(id).find(filter);
  }

  @get('/user-first-name/{id}')
  @response(200, {
    description: 'User first name',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            firstName: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  async findFirstNameById(
      @param.path.number('id') id: number,
  ): Promise<{firstName: string}> {
    const user = await this.userRepository.findById(id, {fields: {firstName: true}});
    return {firstName: user.firstName};
  }

  @post('/users/update-token/{userId')
  @response(200, {
    description: 'Update device token for user',
  })
  async updateToken(
      @param.path.number('userId') userId: number,
      @requestBody({
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                deviceToken: { type: 'string'},
              },
              required: ['deviceToken'],
            },
          },
        },
      })
      tokenData: {deviceToken: string },
  ): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if(!user) {
      throw new HttpErrors.NotFound("User not found");
    }
    user.deviceToken = tokenData.deviceToken;
    await  this.userRepository.update(user);
    return;
  }

}
