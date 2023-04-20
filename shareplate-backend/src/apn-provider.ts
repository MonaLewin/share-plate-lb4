import {Provider} from "@loopback/core";
import apn from 'apn';

export class ApnProvider implements Provider<apn.Provider> {
    value(): Promise<apn.Provider> {
        return Promise.resolve(new apn.Provider({
            token: {
                key: './keys/AuthKey_R9L5726VKR.p8',
                keyId: 'R9L5726VKR',
                teamId: 'KH7BD93PMV',
            },
            production: false, //set true for production environment
        }));
    }
}