// External Dependencies
import { DateTime, Duration, DurationLikeObject } from 'luxon'

export type Date = DateTime
export type DateDuration = Duration
export type DateDurationUnit = keyof DurationLikeObject