// External Dependencies
import firebaseAnalytics from '@react-native-firebase/analytics'
import firebaseMessaging from '@react-native-firebase/messaging'

// Internal Dependencies
import { FirebaseNotification, HandlePushNotificationReceivedFunction } from './firebase.types'
import { getDataFromAsyncStorage, storeDataToAsyncStorage } from '../fileManipulation.functions'
import { generateGUID } from '../IDGenerator/id.functions'
import { router } from '../../../router/functions/navigation/navigation.functions'

/**
* Function used to handle all firebase activities within the app.
* Use this function for ALL firebase-related activities so that everything can be consistent
* and if changes to the suppurting dependency need to be made in the fut
*/
const firebase = {
  /**
  * Get the FCM token that was assigned to the device at the point of registration.
  */
  getDeviceToken: async () => {
    const token = await firebaseMessaging().getToken()
    
    return token
  },

  /**
  * Logs the current screen in Firebase.
  */
  logCurrentScreen: async () => {
    const previousScreen = router.getPreviousRoute()
    const currentScreen = router.getCurrentRoute()
  
    if (previousScreen !== currentScreen) {
      await firebaseAnalytics().logScreenView({
        screen_name: currentScreen,
        screen_class: currentScreen
      })
    }
  },

  /**
  * Logs events in Firebase
  */
  logEvent: async (eventName: string, params?: {[key: string]: any}) => {
    firebaseAnalytics().logEvent(eventName, params)
  },

  /**
  * Set the firebase user ID.
  * @param {string} [userID] Value to use as the unique user identification; defaults to a GUID.
  */
  setUserId: (userID?: string) => {
    const storageKey = 'deviceGUID'

    if (userID) {
      firebaseAnalytics().setUserId(userID)
    } else {
      getDataFromAsyncStorage(storageKey).then(guid => {
        if (guid) {
          firebaseAnalytics().setUserId(guid)
        } else {
          const guid = generateGUID()
        
          storeDataToAsyncStorage(
            storageKey,
            guid,
            () => {
              firebaseAnalytics().setUserId(guid)
            }
          )
        }
      })
        .catch(err => {
        // bugsnag.notify(err, report => {
        //   report.errorMessage = `Error while setting up GA default tracked User ID ${JSON.stringify(err)}`
        // })
        })
    }
  },

  notifications: {
    /**
    * Determine if the user has given permission to display remote notifications from FCM.
    * @returns {boolean} Returns true if the AuthorizationStatus is > 0
    */
    hasPermission: async () => {
      const authorizationStatus = await firebaseMessaging().hasPermission()
      let hasPermission = null
      
      switch (authorizationStatus) {
        case -1: // FirebaseMessagingTypes.AuthorizationStatus.NOT_DETERMINED
        case 0: // FirebaseMessagingTypes.AuthorizationStatus.DENIED
          hasPermission = false
          break

        case 1: // FirebaseMessagingTypes.AuthorizationStatus.AUTHORIZED
        case 2: // FirebaseMessagingTypes.AuthorizationStatus.PROVISIONAL
        case 3: // FirebaseMessagingTypes.AuthorizationStatus.EPHEMERAL:
          hasPermission = true
          break

      }
    
      return hasPermission
    },

    /**
    * Handle notifications received while the app is in the background state.
    * @param {HandlePushNotificationReceivedFunction} [handleNotification] Function that handles data received from the notification.
    * @returns {function} Returns a method that removes the background notification listener.
    */
    onNotificationOpenedWhileAppInBackground: (handleNotification: HandlePushNotificationReceivedFunction) => {
      return firebaseMessaging().onNotificationOpenedApp((notification: FirebaseNotification) => {
        handleNotification(notification.data)
      })
    },

    /**
    * Handle notifications received while the app is in the foreground state (app is opened).
    * @param {HandlePushNotificationReceivedFunction} [handleNotification] Function that handles formatting and displaying the notification in the app.
    * @returns {function} Returns a method that removes the foreground notification listener.
    */
    onNotificationReceivedWhileAppInForeground: (handleNotification: HandlePushNotificationReceivedFunction) => {
      const unsubscribe = firebaseMessaging().onMessage(async (notification: FirebaseNotification) => {
        handleNotification(notification.data)
      })
  
      return unsubscribe
    },

    /**
    * Handle notifications received while the app is in the closed state.
    * @param {HandlePushNotificationReceivedFunction} [handleNotification] Function that handles data received from the notification.
    */
    onNotificationOpenedWhileAppIsClosed: async (handleNotification: HandlePushNotificationReceivedFunction) => {
      firebaseMessaging().getInitialNotification()
        .then((notification: FirebaseNotification) => {
          if (notification) {
            handleNotification(notification.data)
          }
        })
    },

    /**
    * Request permission from user in order to display remote notifications from FCM.
    */
    requestPermission: async () => {
      await firebaseMessaging().requestPermission()
    },
  }
}

export default firebase
