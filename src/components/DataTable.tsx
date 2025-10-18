"use client"

import { tableData } from "@/lib/data"
import { formatNumber, getColorForValue } from "@/lib/utils"
import { useMemo, useRef } from "react"

const DataTable: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Group sites by region
  const sitesByRegion = useMemo(() => {
    const grouped: Record<string, string[]> = {}
    tableData.sites.forEach((site) => {
      if (!grouped[site.region]) {
        grouped[site.region] = []
      }
      grouped[site.region].push(site.name)
    })
    return grouped
  }, [])

  // Calculate min/max for color normalization
  const valueRanges = useMemo(() => {
    const ranges: Record<string, { min: number; max: number }> = {}

    tableData.metrics.forEach((metric) => {
      const values = Object.values(metric.data || {})
        .map((cell) => (typeof cell.value === "number" ? cell.value : null))
        .filter((v) => v !== null) as number[]

      if (values.length > 0) {
        ranges[metric.name] = {
          min: Math.min(...values),
          max: Math.max(...values),
        }
      }
    })

    return ranges
  }, [])

  return (
    <div className="w-full flex flex-col h-screen overflow-hidden bg-background">
      <div ref={scrollContainerRef} className="flex-1 overflow-auto">
        <table className="w-full border-collapse">
          <thead>
            {/* Region Header Row */}
            <tr className="sticky top-0 z-40 bg-card border-b-2 border-border">
              <th className="sticky left-0 z-50 min-w-52 w-52 px-4 py-3 text-left font-bold text-sm bg-card border-r-2 border-border text-foreground">
                September 2025 <br /><span className="text-muted-foreground text-xs font-normal">Updated as of 10/06/2025</span>
              </th>
              {Object.entries(sitesByRegion).map(([region, sites]) => (
                <th
                  key={region}
                  colSpan={sites.length}
                  className="px-4 py-3 text-center font-bold text-sm bg-card border-r border-border text-foreground"
                >
                  {region}
                </th>
              ))}

              <th className="sticky right-0 z-50 px-4 py-3 text-center font-bold text-sm bg-card border-r border-border text-foreground">
                2024 AND OLDER COHORT
              </th>
            </tr>

            {/* Site Header Row */}
            <tr className="sticky top-14 z-40 bg-card border-b-2 border-border">
              <th className="sticky left-0 z-50 min-w-52 w-52 line-clamp-1 truncate px-4 py-3 text-left font-semibold text-sm bg-white border-r-2 border-border">Sites</th>
              {tableData.sites
                .map((site) => (
                  <th
                    key={site.name}
                    className="px-4 py-3 text-center font-semibold text-xs bg-card border-r border-border text-foreground min-w-24"
                  >
                    {site.name}
                  </th>
                ))}

              <th className="sticky right-0 z-50">
                <table>
                  <tr>
                    <th className="px-4 py-3 text-center font-semibold text-xs bg-card border-l-2 border-border text-foreground min-w-24">TOTAL</th>
                    <th className="px-4 py-3 text-center font-semibold text-xs bg-card border-l border-border text-foreground min-w-24">AVERAGE</th>
                  </tr>
                </table>
              </th>
            </tr>
          </thead>

          <tbody>
            {tableData.metrics.map((metric, metricIdx) => {
              const isCategory = !metric.isSubMetric

              return (
                <tr
                  key={`${metric.category}-${metricIdx}`}
                  className={`border-b border-border ${isCategory ? "bg-muted/50" : "bg-white"}`}
                >
                  <td
                    className={`sticky left-0 z-30 min-w-52 w-52 line-clamp-1 truncate px-4 py-3 font-medium text-sm border-r-2 border-border bg-white ${isCategory ? "font-bold" : "pl-8 text-muted-foreground"
                      }`}
                  >
                    {metric.name}
                  </td>

                  {/* Data cells */}
                  {tableData.sites
                    .map((site) => {
                      const cellData = metric.data?.[site.name]

                      if (!cellData) {
                        return (
                          <td
                            key={`${metric.name}-${site.name}`}
                            className="px-3 py-3 text-center border-r border-border bg-white min-w-24"
                          />
                        )
                      }

                      const colorClass = getColorForValue(cellData.value)


                      return (
                        <td
                          key={`${metric.name}-${site.name}`}
                          className={`px-3 py-3 text-center border-r border-border font-medium text-sm min-w-24 ${colorClass}`}
                        >
                          {formatNumber(Number(cellData?.value), 2, cellData.type)}
                        </td>
                      )
                    })}


                  <td className="sticky right-0 z-30">
                    <table>
                      <tr>
                        {/* Total column */}
                        <td className="px-3 py-3 text-center border-l-2 border-r border-border bg-muted font-semibold text-sm min-w-24">
                          {metric.data?.TOTAL
                            ? formatNumber(Number(metric.data.TOTAL.value), 2, metric.data.TOTAL.type)
                            : "-"}
                        </td>

                        {/* Average column */}
                        <td className="px-3 py-3 text-center border-r border-border bg-muted font-semibold text-sm min-w-24">
                          {metric.data?.AVERAGE
                            ? formatNumber(Number(metric.data.AVERAGE.value), 2, metric.data.AVERAGE.type)
                            : "-"}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DataTable
