export function getColorForValue(value: string | null): string {
  // Handle null or undefined
  if (value === null || value === undefined) {
    return "bg-white text-foreground"
  }

  // Check if string starts with +
  if (value.startsWith('+')) {
    return "bg-green-100 text-green-900"
  }

  // Check if string starts with -
  if (value.startsWith('-')) {
    return "bg-red-100 text-red-900"
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