export enum IntervalEnum {
    HOUR = "hour",
    DAY = "day",
    WEEK = "week",
    MONTH = "month"
}

export type IntervalType = typeof IntervalEnum[keyof typeof IntervalEnum];
