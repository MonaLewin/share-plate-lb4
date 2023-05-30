import {Entity, model, property} from "@loopback/repository";
import {DeviceToken} from "./device-token.model";

@model()
export class PushNotification extends Entity {
    @property({
        type: 'number',
        id: true,
        generated: true,
    })
    id?: number;

    @property({
        type: 'string',
        required: true,
    })
    content: string

    @property({
        type: 'DeviceToken',
        required: true,
    })
    deviceToken: DeviceToken

    constructor(data?: Partial<PushNotification>) {
        super(data);
    }
}

export interface PushNotificationRelations {
    //describe naviagtional properties here
}

export type PushNotificationWithRelations = PushNotification & PushNotificationRelations;