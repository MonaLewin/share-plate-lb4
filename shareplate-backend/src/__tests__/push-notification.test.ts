import {PushNotificationController} from "../controllers";
import {
    createRestAppClient,
    createStubInstance,
    sinon,
} from "@loopback/testlab";
import {before} from "mocha";
import {ShareplateBackendApplication} from "../application";
import {FoodOfferRepository, NotificationRequestRepository, UserRepository} from "../repositories";
import apn from "apn";
import {FoodOffer, NotificationRequest, User} from "../models";
import {HttpErrors} from "@loopback/rest";
import chaiAsPromised from "chai-as-promised";

const chai = require('chai');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect = chai.expect;

describe('PushNotificationController', () => {
    let app: ShareplateBackendApplication;
    let pushNotificationRepository: NotificationRequestRepository;
    let pushNotificationController: PushNotificationController;
    let userRepository: UserRepository;
    let foodOfferRepository: FoodOfferRepository;
    let apnProvider: apn.Provider;

    before(async () => {
        app = new ShareplateBackendApplication();
        await app.boot();
        await app.start();

        pushNotificationRepository = createStubInstance(NotificationRequestRepository);
        userRepository = createStubInstance(UserRepository);
        foodOfferRepository = createStubInstance(FoodOfferRepository);
        apnProvider = createStubInstance(apn.Provider);

        app.bind('repositories.NotificationRequestRepository').to(pushNotificationRepository);

        pushNotificationController = new PushNotificationController(
            pushNotificationRepository,
            userRepository,
            foodOfferRepository,
            apnProvider,
        );

        createRestAppClient(app);
    });

    after(async () => {
        await app.stop();
    });

    it('should create a new PushNotificationController instance', () => {
        expect(pushNotificationController).to.be.instanceOf(PushNotificationController);
    });

    describe('sendPushNotification()', () => {
        it('should throw food offer not found for id', async () => {
            const newFoodOffer: FoodOffer = new FoodOffer({
                id: 2,
                name: "Test Offer1",
                description: "test description",
                location: "Venlo",
                datetime: Date.now().toString(),
                reserved: false,
                pickedUp: false,
                createdBy: undefined,
            });
            (foodOfferRepository.findById as sinon.SinonStub).callsFake((id) =>{
                return newFoodOffer.id === id ? newFoodOffer : null})

            //Assert
            expect(pushNotificationController.sendPushNotification({
                notification: new NotificationRequest({
                    id: 9999,
                    body: "Test body",
                    title: "Test title",
                })
            })).be.rejectedWith(HttpErrors.NotFound);

        })

        it('should throw CreatedBy is null for the food offer', async () => {
            const newFoodOffer: FoodOffer = new FoodOffer({
                id: 2,
                name: "Test Offer2",
                description: "test description",
                location: "Venlo",
                datetime: Date.now().toString(),
                reserved: false,
                pickedUp: false,
                createdBy: undefined,
            });
            (foodOfferRepository.findById as sinon.SinonStub).reset();
            (foodOfferRepository.findById as sinon.SinonStub).callsFake((id) =>{
                return newFoodOffer.id === id ? newFoodOffer : null})

            //Assert
            expect(pushNotificationController.sendPushNotification({
                notification: new NotificationRequest({
                    id: 2,
                    body: "Test body",
                    title: "Test title",
                })
            })).be.rejectedWith(HttpErrors.NotFound);
        })

        it('should throw device token not found for user id', async () => {
            const newFoodOffer: FoodOffer = new FoodOffer({
                id: 2,
                name: "Test Offer3",
                description: "test description",
                location: "Venlo",
                datetime: Date.now().toString(),
                reserved: false,
                pickedUp: false,
                createdBy: 1,
            });

            (foodOfferRepository.findById as sinon.SinonStub).reset();
            (foodOfferRepository.findById as sinon.SinonStub).callsFake((id) =>{
                return newFoodOffer.id === id ? newFoodOffer : null})

            //Assert
            expect(pushNotificationController.sendPushNotification({
                notification: new NotificationRequest({
                    id: 2,
                    body: "Test body",
                    title: "Test title",
                })
            })).be.rejectedWith(HttpErrors.NotFound);
        })

    })
})