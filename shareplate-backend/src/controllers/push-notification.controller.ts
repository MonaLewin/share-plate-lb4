import {post, requestBody} from '@loopback/rest';
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
    this.foodOfferController = new FoodOfferController(this.foodOfferRepository);
  }

  @post('/send-push-notification')
  async sendPushNotification(
    //notification: contains payload of the push notification
    //id: used to get device token from db
    @requestBody() requestData: {notification: NotificationRequest},
  ): Promise<void> {
    try {
      const notification = new apn.Notification({
        topic: 'nl.fontys.prj423.group2',
        alert: {
          title: requestData.notification.title,
          body: requestData.notification.body,
        },
      });

      const foodOffer = await this.foodOfferController.findById(requestData.notification.id);
      if(foodOffer.createdBy == null) return
      const deviceToken = await this.userRepository.findDeviceTokenById(foodOffer.createdBy)
      if (deviceToken == null) return
      await this.apnProvider.send(
        notification,
        deviceToken,
      );
    } catch (error) {
      console.error('Failed to send push notification: ', error);
    }
  }
}
