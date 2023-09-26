// External Dependencies
import AsyncStorage from '@react-native-async-storage/async-storage'
import _ from 'lodash'

// Internal Dependencies
import { logEvent } from '../Logging/logging.functions'

const asyncStorage = {
  /**
  * Stores data to async-storage.
  * @param {string} key The key that is to be added to AsyncStorage
  * @param {string|object} value The value that is to be added to AsyncStorage
  */
  storeData: async (key: string, value: any, onSuccess?: () => void) => {
    if (_.isEmpty(key)) {
      logEvent('Error_Setting_Empty_Async_Storage_Key')
    } else {
      try {
        await AsyncStorage.setItem(key, JSON.stringify(value))
        onSuccess && onSuccess()
      } catch (error: any) {
        logEvent(`Error_Setting_Async_Storage_Value_${key}`)
      }
    }
  },

  /**
  * Retrieves data from async-storage.
  * @param {string} key The key that is to be searched for in AsyncStorage
  * @returns {string|object}
  */
  getData: async (key: string) => {
    try {
      const value = await AsyncStorage.getItem(key)
        .then((storageValue: any) => {
          return storageValue
        })
  
      let storageValue = null
  
      if (value !== null) {
        storageValue = JSON.parse(value)
      }
      
      return storageValue
    } catch (error: any) {
      logEvent(`Error_Getting_Async_Storage_Value_${key}`)
    }
  },

  /**
  * Removes data from async-storage.
  * @param {string} key The key that is to be searched for in AsyncStorage
  */
  deleteData: async (key: string) => {
    try {
      await AsyncStorage.removeItem(key)
    } catch (error: any) {
      logEvent(`Error_Deleting_Async_Storage_Value_${key}`)
    }
  }
}

export default asyncStorage
