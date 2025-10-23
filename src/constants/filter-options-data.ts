import { rangeType } from "@/lib/utils";

// Date Range Options
export const predefinedRanges: { value: rangeType; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "last7days", label: "Last 7 Days" },
  { value: "thisWeek", label: "This Week" },
  { value: "lastWeek", label: "Last Week" },
  { value: "thismonth", label: "This Month" },
  { value: "lastmonth", label: "Last Month" },
  { value: "thisyear", label: "This Year" },
  { value: "lastyear", label: "Last Year" },
  { value: "trailing12months", label: "Trailing 12 months" },
  { value: "custom", label: "Custom" },
]

// Comparison Options
export const comparisonOptions: { value: string; label: string }[] = [
  { value: "previous", label: "Previous Period" },
  { value: "samePeriodLastYear", label: "Same Period Last Year" },
  { value: "custom", label: "Custom Comparison Range" },
]