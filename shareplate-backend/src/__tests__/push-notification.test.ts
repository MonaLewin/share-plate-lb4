import {PushNotificationController} from "../controllers";
import {NotificationRequestRepository, UserRepository, FoodOfferRepository} from '../repositories';
import apn from 'apn';
import {FoodOffer, NotificationRequest} from '../models';
import {FoodOfferController} from "../controllers";
import {expect} from 'chai';
import sinon from 'sinon';

describe('PushNotificationController', () => {
    let pushNotificationController: PushNotificationController;
    let notificationRequestRepository: NotificationRequestRepository;
    let userRepository: UserRepository;
    let foodOfferRepository: FoodOfferRepository;
    let apnProvider: apn.Provider;
    let foodOfferController: FoodOfferController;

    beforeEach(() => {
        //Create stub instances for required dependencies
        notificationRequestRepository = sinon.createStubInstance(NotificationRequestRepository);
        userRepository = sinon.createStubInstance(UserRepository);
        foodOfferRepository = sinon.createStubInstance(FoodOfferRepository);
        apnProvider = sinon.createStubInstance(apn.Provider);
        foodOfferController = sinon.createStubInstance(FoodOfferController);

        //Create an instance of PushNotificationController with stub dependencies
        pushNotificationController = new PushNotificationController(
            notificationRequestRepository,
            userRepository,
            foodOfferRepository,
            apnProvider
        );
        //Assign stubbed FoodOfferController to the PushNotificationController
        pushNotificationController['foodOfferController'] = foodOfferController;
    });

    describe('sendPushNotification', () => {
        it('should send a push notification successfully', async () => {
            // Arrange
            const requestData: { notification: NotificationRequest } = {
                notification: new NotificationRequest({
                    title: 'Test Notification',
                    body: 'This is a test notification',
                }),
            };
            //Create FoodOffer instance
            const foodOffer = new FoodOffer();
            foodOffer.name = 'Food Offer Name';
            foodOffer.location = 'Food Offer Location';
            foodOffer.datetime = new Date().toString();
            foodOffer.reserved = false;
            foodOffer.pickedUp = false;
            foodOffer.createdBy = 1;
            //Test device token
            const deviceToken = 'deviceToken';
            //Create a stub for the apnProvider.send method
            const apnProviderSendStub = sinon.stub(apnProvider, 'send').resolves({sent: [], failed:[]});

            // Stub the necessary repository and controller methods
            const findByIdStub = sinon.stub(foodOfferController, 'findById').resolves(foodOffer);
            const findDeviceTokenByIdStub = sinon.stub(userRepository, 'findDeviceTokenById').resolves(deviceToken);

            // Act
            await pushNotificationController.sendPushNotification(requestData);

            // Verify that findById is called with the correct argument
            expect(findByIdStub.calledOnceWithExactly(requestData.notification.id));
            //Verify that findDeviceTokenById is called with the correct argument
            expect(findDeviceTokenByIdStub.calledOnceWithExactly(foodOffer.createdBy));
            //Verify that apnProvider.send is called once
            expect(apnProviderSendStub.calledOnce);
        });

        it('should handle errors during push notification sending', async () => {
            // Arrange
            const requestData: { notification: NotificationRequest } = {
                notification: new NotificationRequest({
                    title: 'Test Notification',
                    body: 'This is a test notification',
                }),
            };
            //Create an error object fo rtesting
            const error = new Error('Push notification sending failed');
            //Stub findById to throw the error
            const findByIdStub = sinon.stub(foodOfferController, 'findById').throws(error);
            //Stub console.error to prevent console output
            const consoleErrorStub = sinon.stub(console, 'error');

            // Act
            await pushNotificationController.sendPushNotification(requestData);

            //Verify findById is called with correct argument
            expect(findByIdStub.calledOnceWithExactly(requestData.notification.id));
            //Verify console.error is called with the error
            expect(consoleErrorStub.calledOnceWithExactly('Failed to send push notification: ', error));
        });
    });
});
