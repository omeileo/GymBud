import { RemoteMessage } from '@react-native-firebase/app'

export interface HandlePushNotificationReceivedFunction {
  (notificationData: FirebaseNotificationData): void
}

export type FirebaseNotification = RemoteMessage

export type FirebaseNotificationData = RemoteMessage.data
