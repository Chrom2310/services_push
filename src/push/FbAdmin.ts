import admin, { AppOptions } from 'firebase-admin';
import { MessagingOptions } from 'firebase-admin/lib/messaging/messaging-api';

export class FbAdmin {
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
    const currConfig = { ...config };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete currConfig.id;
    this.admin = admin.initializeApp({
      credential: admin.credential.cert(currConfig),
    });
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
  close = async (cbSuccess?: () => void, cbError?: (e: unknown) => void) => {
    try {
      await this.admin.delete();
      cbSuccess?.();
    } catch (e) {
      cbError?.(e);
    }
  };
}
