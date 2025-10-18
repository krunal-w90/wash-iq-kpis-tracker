export interface DataCell {
  value: string
  type?: "currency" | "percentage" | "number"
}

export interface MetricRow {
  name: string
  category: string
  isSubMetric?: boolean
  data: Record<string, DataCell> | null
}

export interface Site {
  name: string
  region: string
}

export interface TableData {
  sites: Site[]
  metrics: MetricRow[]
  regions: string[]
}

export interface ColorConfig {
  positive: string
  negative: string
  neutral: string
  text: string
}
