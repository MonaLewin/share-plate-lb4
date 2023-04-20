import {post, requestBody} from "@loopback/rest";
import {repository} from "@loopback/repository";
import {inject} from "@loopback/core";
import {DeviceTokenRepository, PushNotificationRepository} from "../repositories";
import apn from 'apn';

export class PushNotificationController {
    constructor(
        @repository(PushNotificationRepository)
        public pushNotificationRepository: PushNotificationRepository,
        @repository(DeviceTokenRepository)
        public deviceTokenRepository: DeviceTokenRepository,
        @inject('apn.provider') private apnProvider: apn.Provider
    ) {
    }

    @post('/send-push-notification')
    async sendPushNotification(
        //notification: contains payload of the push notification
        //id: used to get device token from db
        @requestBody() requestData: { id: number},
    ): Promise<void> {
        try {
            const notification = new apn.Notification({
                topic: 'nl.fontys.prj423.group2',
                alert: {
                    title: "Food offer",
                    body: "Someone reserved your food offer!"
                }
            })
            const deviceToken = await this.deviceTokenRepository.findById(requestData.id);
            const result = await this.apnProvider.send(notification, deviceToken.deviceToken);
            console.log('Push notification sent:', result, "\n", result.failed);
        } catch (error) {
            console.error('Failed to send push notification: ', error);
        }
    }
}