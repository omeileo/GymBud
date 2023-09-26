// External Dependencies
import { DateObjectUnits, DateTime, Duration, DurationLike, DurationLikeObject } from 'luxon'

// Internal Dependencies
import { dateFormatRegex } from '../../dictionaries/regex'
import { Date, DateDurationUnit } from './date.types'

export const dateTimeFormats = {
  date: {
    short: 'MMM d',
    medium: 'MMM d, yyyy',
    long: 'EEE, MMM d, yyyy',
    full: 'EEEE, MMM d, yyyy',
    extended: 'EEEE, MMMM d, yyyy',
    default: 'yyyy-MM-dd',
    transfer: 'dd-MMM-yyyy'
  },

  time: {
    short: 'h:mm a',
    long: 'HH:mm:ss.SSS'
  },

  currentDateTimeFormat: 'yyyy-MM-dd HH:mm:ss.SSS'
}

/**
* Function used to handle all date processing within the app.
* Use this function for ALL date-related activities so that everything can be consistent
* and if changes to the suppurting dependency need to be made in the future, it will be centralized.
* @param {DateTime|string|number} [dateTime] Date and time as a Luxon DateTime, a string, or a Unix timestamp.
* @param {string} [dateFormat] Format of the dateTime if it is a string.
*/
export default function date(dateTime?: DateTime | string | number, dateFormat?: string) {
  const currentDateTime = DateTime.local()
  const defaultDate: Date = getValidatedDateTime(dateTime, dateFormat)
  
  return {
    /**
    * The luxon DateTime of the value passed.
    */
    dateTime: defaultDate,

    /**
    * Get the current local date.
    */
    currentDate: currentDateTime,

    /**
    * Get the Unix timestamp in milliseconds of the date specified or the current date.
    */
    timestamp: defaultDate?.valueOf(),

    /**
    * Get the millisecond of the second (0-999).
    */
    millisecond: defaultDate?.millisecond,
    
    /**
    * Get the second of the minute (0-59).
    */
    second: defaultDate?.second,
    
    /**
    * Get the minute of the hour (0-59).
    */
    minute: defaultDate?.minute,
    
    /**
    * Get the hour of the day (0-23).
    */
    hour: defaultDate?.hour,

    /**
    * Get the day of the month (1-30ish).
    */
    day: defaultDate?.day,
    
    /**
    * Get the day of the week. 1 is Monday and 7 is Sunday.
    */
    weekday: defaultDate?.weekday,

    /**
    * Get the month (1-12).
    */
    month: defaultDate?.month,

    /**
    * Get the year.
    */
    year: defaultDate?.year,

    /**
    * Returns whether the DateTime is valid. Invalid DateTimes occur when:
    *   - The DateTime was created from invalid calendar information, such as the 13th month or February 30
    *   - The DateTime was created by an operation on another invalid date.
    */
    isValid: defaultDate?.isValid ?? false,

    // "Set" the values of specified units. Returns a newly-constructed DateTime.
    /**
    * "Set" the values of specified units. Returns a newly-constructed DateTime.
    * @param {object} [values] A mapping of units to numbers
    * @example date().set({ year: 2017 })
    * @example date().set({ hour: 8, minute: 30 })
    * @example date().set({ weekday: 5 })
    * @example date(currentDateTime).set({ seconds: 30 })
    */
    set: (values: DateObjectUnits) => {
      const sanitizedValues = getValidatedDateObjectUnits(values)
      const udpatedDate = defaultDate.set(sanitizedValues)
      
      return udpatedDate
    },

    /**
    * Modify a date using a specified format.
    * @param {string} dateFormat How the date should be formatted.
    * @example date().format('yyyy-MM-dd')
    * @example date(expiryDate).format('yyyy-MM-dd')
    * @example date(currentDateTime, 'yyyy-MM-dd HH:mm:ss.SSS').format('yyyy-MM-dd')
    * @example date(1516315636958).format(dateTimeFormats.date.default)
    * @example date(chatStartTime).format(dateTimeFormats.time.long)
    */
    format: (dateFormat: string) => {
      let formattedDate = null
      const isValid = isValidFormatToWhichToConvert(defaultDate, dateFormat)

      if (isValid) {
        formattedDate = defaultDate.toFormat(dateFormat)
      }

      return formattedDate
    },

    /**
    * Add a specific amount of time to a date.
    * @param {DurationLike} duration How much time to add.
    * @example date().add(123) // 123 milliseconds from the current date
    * @example date().add({ days: 1 }) // 1 day from the current date
    * @example date(expiryDate).add({ months: 2 }) // 2 months from a specified luxon DateTime date
    * @example date(currentDateTime, 'yyyy-MM-dd HH:mm:ss.SSS').add({ days: 3, hours: 4, minutes: 39 }) // 3 days, 4 hours, and 39 minutes from the specified date
    */
    add: (duration: DurationLike) => {
      return defaultDate.plus(duration)
    },

    /**
    * Subtract a specific amount of time from a date.
    * @param {DurationLike} duration How much time to subtract.
    * @example date().subtract(123) // 123 milliseconds before the current date
    * @example date().subtract({ days: 1 }) // 1 day before the current date
    * @example date(expiryDate).subtract({ months: 2 }) // 2 months before a specified luxon DateTime date
    * @example date(currentDateTime, 'yyyy-MM-dd HH:mm:ss.SSS').subtract({ days: 3, hours: 4, minutes: 39 }) // 3 days, 4 hours, and 39 minutes before the specified date
    */
    subtract: (duration: DurationLike) => {
      return defaultDate.minus(duration)
    },

    /**
    * Return the difference between two DateTimes; defaults to milliseconds but can be a DateDurationUnit.
    * @param {DateTime|string|number} dateTime Date and time as a Luxon DateTime, a string, or a Unix timestamp.
    * @param {string} [dateFormat] Format of the dateTime if it is a string.
    * @param {string} [duration] Duration in which to send back the difference; defaults to milliseconds.
    * @example date().difference(expiryDate)
    * @example date(currentDate).difference(expiryDate)
    * @example date(currentDate).difference(1516315636958)
    * @example date(startDate).difference(endDate, null, 'days')
    */
    difference: (dateTime: DateTime | string | number, dateFormat?: string, duration?: DateDurationUnit) => {
      const otherDate: DateTime = getValidatedDateTime(dateTime, dateFormat)
      const difference = defaultDate.diff(otherDate).as(duration ?? 'milliseconds')

      return difference
    },

    /**
    * Return an object representing a period of time, like "2 months" or "1 day, 1 hour"..
    * @param {DurationLikeObject} duration Object representing different units to add to the duration.
    * @example date().duration({ seconds: 100 })
    * @example date().duration({ days: 5, hours: 10, minutes: 3, seconds: 30 })
    */
    duration: (duration?: DurationLikeObject) => {
      const returnValue: DurationLikeObject = duration ?? { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }
      
      return Duration.fromObject(returnValue)
    },

    /**
    * Determines if the date passed to the date function is before the one passed to the isBefore function.
    * @param {DateTime|string|number} dateTime Date and time as a Luxon DateTime, a string, or a Unix timestamp.
    * @param {string} [dateFormat] Format of the dateTime if it is a string.
    * @example date(currentDateTime).isBefore(chatStartTime)
    * @example date(currentDateTime, defaultDateTimeFormat).isBefore(chatStartTime, defaultTimeFormat)
    * @example date().isBefore(1516315636958)
    */
    isBefore: (dateTime: DateTime | string | number, dateFormat?: string) => {
      const otherDate: DateTime = getValidatedDateTime(dateTime, dateFormat)
      const isBefore = defaultDate < otherDate

      return isBefore
    },

    /**
    * Determines if the date passed to the date function is before the one passed to the isSameOrBefore function.
    * @param {DateTime|string|number} dateTime Date and time as a Luxon DateTime, a string, or a Unix timestamp.
    * @param {string} [dateFormat] Format of the dateTime if it is a string.
    * @example date(currentDateTime).isSameOrBefore(chatStartTime)
    * @example date(currentDateTime, defaultDateTimeFormat).isSameOrBefore(chatStartTime, defaultTimeFormat)
    * @example date().isSameOrBefore(1516315636958)
    */
    isSameOrBefore: (dateTime: DateTime | string | number, dateFormat?: string) => {
      const otherDate: DateTime = getValidatedDateTime(dateTime, dateFormat)
      const isSameOrBefore = defaultDate <= otherDate

      return isSameOrBefore
    },

    /**
    * Determines if the date passed to the date function is after the one passed to the isAfter function.
    * @param {DateTime|string|number} dateTime Date and time as a Luxon DateTime, a string, or a Unix timestamp.
    * @param {string} [dateFormat] Format of the dateTime if it is a string.
    * @example date(currentDateTime).isAfter(chatEndTime)
    * @example date(currentDateTime, defaultDateTimeFormat).isAfter(chatEndTime, defaultTimeFormat)
    * @example date().isAfter(1516315636958)
    */
    isAfter: (dateTime: DateTime | string | number, dateFormat?: string) => {
      const otherDate: DateTime = getValidatedDateTime(dateTime, dateFormat)
      const isAfter = defaultDate > otherDate

      return isAfter
    },

    /**
    * Determines if the date passed to the date function is the same or after the one passed to the isSameOrAfter function.
    * @param {DateTime|string|number} dateTime Date and time as a Luxon DateTime, a string, or a Unix timestamp.
    * @param {string} [dateFormat] Format of the dateTime if it is a string.
    * @example date(currentDateTime).isSameOrAfter(chatEndTime)
    * @example date(currentDateTime, defaultDateTimeFormat).isSameOrAfter(chatEndTime, defaultTimeFormat)
    * @example date().isSameOrAfter(1516315636958)
    */
    isSameOrAfter: (dateTime: DateTime | string | number, dateFormat?: string) => {
      const otherDate: DateTime = getValidatedDateTime(dateTime, dateFormat)
      const isSameOrAfter = defaultDate >= otherDate

      return isSameOrAfter
    },

    isWeekend: () => {
      let isWeekend = false

      if (defaultDate.weekday === 6 || defaultDate.weekday === 7) {
        isWeekend = true
      }
      
      return isWeekend
    },

    /**
    * Returns a string representation of this time relative to now, such as "in two days". Rounds down by default.
    * @param {string} [roundDown] Whether or not to round the comparison down.
    * @example date().fromNow()
    * @example date(currentDateTime).fromNow()
    * @example date(currentDateTime).fromNow(false)
    */
    fromNow: (roundDown?: boolean) => {
      return defaultDate.toRelative({ round: roundDown ?? true })
    },

    /**
    * 
    * @param {DateDurationUnit} timeUnit Time unit by which the date object should be mutated to be the start of
    * @example date().startOf('day') // set the time portion of today's date to 12:00 a.m.
    * @example date().startOf('year') // set the date and time to be 12:00 a.m. of the current year
    */
    startOf: (timeUnit?: DateDurationUnit) => {
      let startOfTimeObject = { }

      switch (timeUnit) {
        case 'second':
          break

        case 'minute':
          break

        case 'hour':
          break

        case 'day':
          startOfTimeObject = { hour: 0, minute: 0, second: 0, millisecond: 0 }
          break

        case 'week':
          break

        case 'month':
          break

        case 'quarter':
          break

        case 'year':
          break
      }

      return defaultDate.set(startOfTimeObject)
    }
  }
}

const getValidatedDateTime = (dateTime: DateTime | string | number, dateFormat?: string) => {
  let defaultDate: DateTime = DateTime.fromObject(({ year: 0, month: 0, day: 0 }))
  const currentDateTime = DateTime.local()
  let isValid = false

  if (dateTime) {
    isValid = isValidFormatFromWhichConversionCanBeDone(dateTime, dateFormat)
    
    if (isValid) {
      if (dateTime instanceof DateTime) {
        defaultDate = dateTime
      } else if (typeof dateTime === 'string') {
        if (dateFormat === undefined) {
          const deducedDateFormat = determineDateFormat(dateTime)
          
          if (deducedDateFormat === 'ISO 8601') {
            defaultDate = DateTime.fromISO(dateTime)
          } else {
            defaultDate = DateTime.fromFormat(dateTime, deducedDateFormat)
          }
        } else {
          defaultDate = DateTime.fromFormat(dateTime, dateFormat)
        }
      } else if (typeof dateTime === 'number') {
        let timestampInMilliseconds = dateTime

        if (JSON.stringify(dateTime).length === 10) {
          timestampInMilliseconds = dateTime * 1000
        }

        defaultDate = DateTime.fromMillis(timestampInMilliseconds)
      }
    }
  } else {
    defaultDate = currentDateTime
  }

  return defaultDate
}

const isValidFormatToWhichToConvert = (dateTime: DateTime, dateFormat: string) => {
  let isValid = null

  try {
    isValid = dateTime.toFormat(dateFormat).length > 0
  } catch (error) {
    console.log(`ERROR: dateFormat specified (${dateFormat}) is not a valid format.`)
    isValid = false
  }

  return isValid
}

const isValidFormatFromWhichConversionCanBeDone = (dateTime: DateTime | string | number, dateFormat?: string) => {
  let isValid = null
  let convertedDateTime: DateTime

  if (dateTime instanceof DateTime) {
    isValid = true
  } else if (typeof dateTime === 'string') {
    if (!dateFormat) {
      const deducedDateFormat = determineDateFormat(dateTime)

      if (deducedDateFormat !== null) {
        isValid = true
      } else {
        isValid = false
        console.log(`ERROR: Could not dynamically deduce date format from the string provided. A valid dateFormat should be passed to format '${dateTime}'.`)
      }
    } else {
      convertedDateTime = DateTime.fromFormat(dateTime, dateFormat)
  
      if (convertedDateTime.isValid) {
        isValid = true
      } else {
        isValid = false
        console.log(`ERROR: dateFormat specified (${dateFormat}) is not a valid format for ${dateTime}.`)
      }
    }
  } else if (typeof dateTime === 'number') {
    convertedDateTime = DateTime.fromMillis(dateTime)

    if (convertedDateTime.isValid) {
      isValid = true
    } else {
      isValid = false
      console.log(`ERROR: dateTime specified (${dateTime}) is not a valid timestamp.`)
    }
  } else {
    isValid = false
    console.log(`ERROR: Invalid arguments: dateTime must be a DateTime object or a string with a dateFormat. ${dateTime} is a ${typeof dateTime}.`)
  }

  return isValid
}

const determineDateFormat = (dateTime: string) => {
  let dateFormat = null

  for (const pattern of dateFormatRegex) {
    if (pattern.regex.test(dateTime)) {
      dateFormat = pattern.dateFormat
      break
    }
  }

  return dateFormat
}

function getValidatedDateObjectUnits (units: DateObjectUnits) {
  const validProperties = [ 'year', 'month', 'day', 'ordinal', 'weekYear', 'weekNumber', 'weekday', 'hour', 'minute', 'second', 'millisecond' ]
  const filteredUnits: DateObjectUnits = {}

  for (const key in units) {
    if (validProperties.includes(key)) {
      filteredUnits[key] = units[key]
    } else {
      console.log(`ERROR: Invalid property: ${key} passed to date().set() function.`)
    }
  }

  return filteredUnits
}
