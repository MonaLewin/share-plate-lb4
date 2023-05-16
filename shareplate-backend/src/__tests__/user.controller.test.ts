import {UserController} from '../controllers';
import {UserRepository} from '../repositories';
import {
  MyUserService,
  TokenServiceBindings,
  UserServiceBindings,
} from '@loopback/authentication-jwt';
import {TokenService} from '@loopback/authentication';
import {
  createRestAppClient,
  createStubInstance,
  sinon,
} from '@loopback/testlab';
import {ShareplateBackendApplication} from '../application';
import {UserProfile} from '@loopback/security';
import {User} from '../models';
import {Response} from '@loopback/rest';
import {before} from 'mocha';

const chai = require('chai');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const expect = chai.expect;

describe('UserController', () => {
  let app: ShareplateBackendApplication;
  let userRepository: UserRepository;
  let tokenService: TokenService;
  let userService: MyUserService;
  let userController: UserController;
  let user: UserProfile;

  before(async () => {
    app = new ShareplateBackendApplication();
    await app.boot();
    await app.start();

    userRepository = createStubInstance(UserRepository);
    userService = createStubInstance(MyUserService);

    tokenService = await app.get(TokenServiceBindings.TOKEN_SERVICE);
    app.bind(UserServiceBindings.USER_SERVICE).to(userService);
    app.bind('repositories.UserRepository').to(userRepository);

    userController = new UserController(
      userRepository,
      tokenService,
      userService,
      user,
    );

    createRestAppClient(app);
  });

  after(async () => {
    await app.stop();
  });

  it('should create a new UserController instance', () => {
    expect(userController).to.be.instanceOf(UserController);
  });

  describe('signup()', () => {
    let mockResponse: Response;

    before(() => {
      mockResponse = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      } as unknown as Response<Response>;
    });

    it('should return 201 if signup was successful', async () => {
      // Arrange
      const newUser: User = new User({
        email: 'test@example.com',
        password: '123456',
        firstName: 'Test',
        lastName: 'User',
      });
      const countStub = userRepository.count as sinon.SinonStub;
      countStub.resolves(0);
      const createStub = userRepository.create as sinon.SinonStub;
      createStub.resolves(newUser);

      // Act
      await userController.signUp(newUser, mockResponse);

      // Assert
      expect(mockResponse.status).to.have.been.calledWith(201);
    });
  });
});
