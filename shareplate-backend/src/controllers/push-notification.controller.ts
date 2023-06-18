import {HttpErrors, post, requestBody} from '@loopback/rest';
import {repository} from '@loopback/repository';
import {inject} from '@loopback/core';
import {
  FoodOfferRepository,
  NotificationRequestRepository,
  UserRepository,
} from '../repositories';
import apn from 'apn';
import {NotificationRequest} from '../models';
import {FoodOfferController} from "./food-offer.controller";

export class PushNotificationController {
  private foodOfferController: FoodOfferController;
  constructor(
    @repository(NotificationRequestRepository)
    public notificationRequestRepository: NotificationRequestRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(FoodOfferRepository)
    public foodOfferRepository: FoodOfferRepository,
    @inject('apn.provider') private apnProvider: apn.Provider,
  ) {
    //Create an instance of FoodOfferController to access its methods
    this.foodOfferController = new FoodOfferController(this.foodOfferRepository);
  }

  @post('/send-push-notification')
  async sendPushNotification(
      //Request body contains the payload of the push notification
      // And it should have a 'notification' property of type NotificationRequest
    @requestBody() requestData: {notification: NotificationRequest},
  ): Promise<void> {
    try {
      //Create a new APN notification with the provided title and body
      const notification = new apn.Notification({
        //Indicates from which application this notification is coming from
        topic: 'nl.fontys.prj423.group2',
        alert: {
          title: requestData.notification.title,
          body: requestData.notification.body,
        },
      });
      //Find the corresponding food offer based on the notification ID
      // The ID is the id of the user who should recieve the notifcation
      const foodOffer = await this.foodOfferController.findById(requestData.notification.id);
      if(foodOffer == null) {
        throw new HttpErrors.NotFound(`Food offer not found for ID: ${requestData.notification.id}`)
      }
      if(foodOffer.createdBy == null) {
        throw new HttpErrors.NotFound('CreatedBy is null for the food offer.')
      }
      //Retrieve device token of the user who should recieve the notification
      const deviceToken = await this.userRepository.findDeviceTokenById(foodOffer.createdBy)
      if (deviceToken == null) {
        throw new HttpErrors.NotFound(`Devie token not found for user ID: ${foodOffer.createdBy}`)
      }
      //Send the APN notification to the device token using the APN provider
      const result = await this.apnProvider.send(
        notification,
        deviceToken,
      );
      console.log('Push notification sent:', result, '\n', result.failed);
    } catch (error) {
      console.error('Failed to send push notification: ', error);
    }
  }
}
