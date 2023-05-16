import {repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  HttpErrors,
  post,
  requestBody,
  Response,
  RestBindings,
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

import {User} from '../models';
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
   * Mainly just a test method. Requires a valid JWT in the auth header and
   * returns the id of the user, if JWT is valid.
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

  /**
   * /signup is used to create new user accounts
   * @param newUserRequest the user object containing all necessary information
   * about the user
   * @param response 201 if successful, 422 if email is already in use
   */
  @post('/signup', {
    responses: {
      '201': {
        description: 'User registration successful',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  description: 'Success message',
                },
              },
            },
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
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<void> {
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
    await this.userRepository.create(newUser);

    response.status(201).json({message: 'User registration successful'});
  }
}
