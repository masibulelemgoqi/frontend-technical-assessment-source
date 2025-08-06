import { inject, Injectable } from '@angular/core';
import { BrazePushNotification } from '@models/braze/braze-push-notification';
import { PushNotifications, PushNotificationSchema } from '@capacitor/push-notifications';
import { BrazeExtras } from '@models/braze/braze-content-card';
import { JSONParse } from '@utils/json-parse';
import { BrazePluginService } from './braze-plugin.service';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  private brazePluginService = inject(BrazePluginService);

  init() {
    PushNotifications.addListener('registration', (token) => {
      this.brazePluginService.initialize(token.value);
    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema | BrazePushNotification) => {
        if (this.isBrazePushNotification(notification)) {
          if (!notification.data?.extra) return;

          const extras = JSONParse<BrazeExtras>(notification.data.extra);
          if (extras && extras.type === 'inbox') {
            // Get from Cache or Server both functions are available in BrazePluginService
            this.brazePluginService.getContentCardsFromCache();
          }
        }
      }
    );

    this.registerPush();
  }

  private isBrazePushNotification(
    notification: PushNotificationSchema | BrazePushNotification
  ): notification is BrazePushNotification {
    return (notification as BrazePushNotification).data?.extra !== undefined;
  }

  async registerPush(): Promise<void> {
    let pushReq = await PushNotifications.checkPermissions();

    if (pushReq.receive === 'prompt') {
      pushReq = await PushNotifications.requestPermissions();
    }

    if (pushReq.receive) {
      // Ask iOS user for permission/auto grant android permission
      await PushNotifications.register();
    }
  }
}
