// External Dependencies
import { Apptentive } from 'apptentive-react-native'

// Internal Dependencies
import firebase from '../Firebase/firebase.functions'

import { ENVIRONMENT } from '../../../networkRequests/environmentVariables/env.json'
import { logEventNameVerificationRegex } from '../../dictionaries/regex'
import { Platform } from 'react-native'

/**
 * Logs an event in Firebase, Apptentive, and Instana.
 * @param {string} eventName Name of event to log | Max length = 40 characters,
 * @param {string} parameters Array of objects to log to Firebase | Max parameter value length = 100 characters
 * @example logEvent('Login_Button_Pressed')
 * @example logEvent('User_Created', {date: '12/12/2023'})
*/
export const logEvent = (eventName: LogEventName | string, parameters?: {[key: string]: any}) => {
  try {
    const sanitizedEventName = sanitizeEventName(eventName)
    
    firebase.logEvent(sanitizedEventName, parameters)

    if (eventName.substring(0, 2) !== 'R_') {
      Apptentive.engage(eventName)
    }
  } catch (error) {
    // bugsnag.notify(error, report => {
    //   report.errorClass = `Firebase LogEvent Error`
    //   report.errorMessage = `EventName: ${eventName}, Error: ${JSON.stringify(error)}`
    // })
  }
}

const sanitizeEventName = (eventName: LogEventName | string) => {
  let sanitizedEventName = eventName
  const invalidEventName = logEventNameVerificationRegex.regex.test(sanitizedEventName)

  if (invalidEventName) {
    sanitizedEventName = eventName.replace(logEventNameVerificationRegex.regex, '_')
  }

  if (sanitizedEventName.length > 35) {
    sanitizedEventName = sanitizedEventName.slice(0, 35)
  }

  const temporaryRNUpdateEventName = `${sanitizedEventName}_RN_${Platform.select({ android: 'A', ios: 'I' })}`

  return temporaryRNUpdateEventName
}
