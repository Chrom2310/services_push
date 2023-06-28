import admin, { AppOptions } from 'firebase-admin';
import { MessagingOptions } from 'firebase-admin/lib/messaging/messaging-api';

export class fbAdmin {
  private admin;
  private readonly options: MessagingOptions = {
    direct_boot_ok: true,
    priority: 'high',
    contentAvailable: true,
    mutableContent: true,
    apns: {
      payload: {
        aps: {
          contentAvailable: true,
          mutableContent: true,
        },
      },
    },
  };
  constructor(config: AppOptions) {
    this.admin = admin.initializeApp(config);
  }

  sendTopic = (topic: string, body: any) => {
    const messaging = this.admin.messaging();
    try {
      return messaging.sendToTopic(
        topic,
        {
          data: body,
        },
        this.options,
      );
    } catch (error) {
      console.log('error', error);
    }
  };

  sendToken = (token: string, body: any) => {
    const messaging = this.admin.messaging();
    return messaging.sendToDevice(
      token,
      {
        data: body,
      },
      this.options,
    );
  };
}
