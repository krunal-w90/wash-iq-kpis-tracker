import { clsx, type ClassValue } from "clsx";
import moment from "moment";
import { twMerge } from "tailwind-merge"
import { IntervalEnum, IntervalType } from "./constansts";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getColorForValue(value: string | null): string {
  // Handle null or undefined
  if (value === null || value === undefined) {
    return "bg-white text-foreground"
  }

  // Check if string starts with +
  if (value.startsWith('+')) {
    return "!bg-green-100 text-green-500"
  }

  // Check if string starts with -
  if (value.startsWith('-')) {
    return "!bg-red-100 text-red-500"
  }

  return "bg-white text-foreground"
}

export function formatNumber(num: number = 0, digits = 2, type?: "currency" | "percentage" | "number"): string {
  if (num === 0) return '0';

  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';

  const units = [
    { value: 1e12, suffix: 'T' },
    { value: 1e9, suffix: 'B' },
    { value: 1e6, suffix: 'M' },
    { value: 1e3, suffix: 'K' },
    { value: 1, suffix: '' },
  ];

  const { value, suffix } = units?.find(unit => absNum >= unit.value) || { value: 1, suffix: '' };

  const formattedNumber = (absNum / value).toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0
  });

  return `${sign}${type === "currency" ? "$" : ""}${formattedNumber}${suffix}${type === "percentage" ? "%" : ""}`;
}

// Function to show toast
export const showToast = (type?: "success" | "error" | "warning" | "info", message?: string) => {
  switch (type) {
    case "success":
      toast.success(message);
      break;
    case "error":
      toast.error(message);
      break;
    case "warning":
      toast.warning(message);
      break;
    case "info":
      toast.info(message);
      break;
    default:
      toast(message);
      break;
  }
};

// Type for range
export type rangeType = "today" | "yesterday" | "last7days" | "thisWeek" | "lastWeek" | "thismonth" | "lastmonth" | "thisyear" | "lastyear" | "trailing12months" | "custom"

// Type for comparison
export type comparisonType = "previous" | "samePeriodLastYear" | "custom"

// Function to calculate date range
export const calculateDateRange = (rangeType: rangeType, customStart: string | null = null, customEnd: string | null = null) => {
  const today = moment(new Date());
  const startOfDay = today.clone().startOf('day');
  const endOfDay = today.clone().endOf('day');

  switch (rangeType) {
    case 'today':
      return { start: startOfDay, end: endOfDay };
    case 'yesterday':
      const yesterday = today.clone().subtract(1, 'day');
      return { start: yesterday.startOf('day'), end: yesterday.endOf('day') };
    case 'last7days':
      return {
        start: today.clone().subtract(7, 'days').startOf('day'),
        end: endOfDay.subtract(1, 'day').endOf('day')
      };
    case 'thisWeek':
      return {
        start: today.clone().startOf('week'),
        end: endOfDay
      };
    case 'lastWeek':
      const startOfLastWeek = today.clone().subtract(1, 'week').startOf('week');
      return {
        start: startOfLastWeek.clone().startOf('week'),
        end: startOfLastWeek.clone().endOf('week')
      };
    case 'thismonth':
      return {
        start: today.clone().startOf('month'),
        end: endOfDay
      };
    case 'lastmonth':
      const lastMonth = today.clone().subtract(1, 'month');
      return {
        start: lastMonth.clone().startOf('month'),
        end: lastMonth.clone().endOf('month')
      };
    case 'thisyear':
      return {
        start: today.clone().startOf('year'),
        end: endOfDay
      };
    case 'lastyear':
      const lastYear = today.clone().subtract(1, 'year');
      return {
        start: lastYear.clone().startOf('year'),
        end: lastYear.clone().endOf('year')
      };
    case 'trailing12months':
      return {
        start: today.clone().subtract(12, 'months').startOf('day'),
        end: today.clone().subtract(1, 'day').endOf('day')
      };
    case 'custom':
      return {
        start: moment(customStart).startOf('day'),
        end: moment(customEnd).endOf('day')
      };
    default:
      return { start: startOfDay, end: endOfDay };
  }
}

// Function to calculate previous period
export const calculatePreviousPeriod = (start: moment.Moment, end: moment.Moment, rangeType: rangeType) => {
  switch (rangeType) {
    case 'today':
      return {
        start: start.clone().subtract(1, 'week'),
        end: end.clone().subtract(1, 'week')
      };
    case 'yesterday':
      return {
        start: start.clone().subtract(1, 'week'),
        end: end.clone().subtract(1, 'week')
      };
    case 'last7days':
      return {
        start: start.clone().subtract(7, 'days'),
        end: end.clone().subtract(7, 'days')
      };
    case 'thisWeek':
      return {
        start: start.clone().subtract(1, 'week'),
        end: end.clone().subtract(1, 'week')
      };
    case 'lastWeek':
      return {
        start: start.clone().subtract(1, 'week'),
        end: end.clone().subtract(1, 'week')
      };
    case 'thismonth': {
      const monthDiff = end.diff(start, 'month') + 1;
      return {
        start: start.clone().subtract(monthDiff, 'month'),
        end: end.clone().subtract(monthDiff, 'month')
      };
    }
    case 'lastmonth': {
      return {
        start: start.clone().subtract(1, 'month').startOf("month"),
        end: end.clone().subtract(1, 'month').endOf("month")
      };
    }
    case 'thisyear': {
      const daysDiff = end.diff(start, 'days') + 1;
      return {
        start: start.clone().subtract(1, 'year'),
        end: start.clone().add(daysDiff - 1, 'days').subtract(1, 'year')
      };
    }
    case 'lastyear': {
      const lastYear = start.clone().subtract(1, 'year');
      return {
        start: lastYear.clone().startOf('year'),
        end: lastYear.clone().endOf('year')
      };
    }
    case 'trailing12months':
      const monthDiff = end.diff(start, 'month') + 1;
      return {
        start: start.clone().subtract(monthDiff, 'month'),
        end: end.clone().subtract(monthDiff, 'month')
      };
    case 'custom':
      const daysDiff = end.diff(start, 'days');
      return {
        start: start.clone().subtract(daysDiff + 1, 'days').startOf("day"),
        end: start.clone().subtract(1, 'day').endOf("day")
      };
    default:
      return { start, end };
  }
};

// Function to get interval from date range
export const getIntervalFromDateRange = (start: string | null, end: string | null): IntervalType => {
  if (!start || !end) return IntervalEnum.WEEK;

  const startDate = moment(start);
  const endDate = moment(end);
  const diffHours = Math.abs(startDate.diff(endDate, 'hours', true));
  const diffDays = Math.abs(startDate.diff(endDate, 'days'));
  const diffMonths = Math.abs(startDate.diff(endDate, 'months', true));

  if (diffHours <= 24) return IntervalEnum.HOUR;

  if (diffDays <= 31) return IntervalEnum.DAY

  if (diffMonths < 3) return IntervalEnum.WEEK

  return IntervalEnum.MONTH;
}

// Calculate Comparison Period
export const calculateComparisonPeriod = (
  primaryRangeType: rangeType,
  compType: comparisonType,
  customStart?: string | null,
  customEnd?: string | null,
  compStart?: string | null,
  compEnd?: string | null
) => {
  const primaryRange = calculateDateRange(primaryRangeType, customStart, customEnd)

  if (compType === "custom") {
    if (compStart && compEnd) {
      return {
        start: moment(compStart).startOf("day"),
        end: moment(compEnd).endOf("day")
      }
    }
    return null
  }

  if (compType === "previous") {

    const primaryRangeStart = moment(primaryRange?.start).startOf("day")
    const primaryRangeEnd = moment(primaryRange?.end).endOf("day")

    return calculatePreviousPeriod(primaryRangeStart, primaryRangeEnd, primaryRangeType)
  }

  if (compType === "samePeriodLastYear") {
    return {
      start: primaryRange?.start.clone().subtract(1, 'year').startOf("day"),
      end: primaryRange?.end.clone().subtract(1, 'year').endOf("day")
    }
  }

  return null
}