import { comparisonType, rangeType } from '@/lib/utils'
import { DateEnvelope } from '@/types/types'
import moment from 'moment'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface FilterStore {
  // Date Filters for current envelope
  currentEnvelope: DateEnvelope
  selectedRangeType: rangeType
  setCurrentEnvelope: (envelope: DateEnvelope) => void
  setSelectedRangeType: (range: rangeType) => void

  // Date Filters for comparison envelope
  priorEnvelope: DateEnvelope
  comparisonType: comparisonType
  setPriorEnvelope: (envelope: DateEnvelope) => void
  setComparisonType: (type: comparisonType) => void
  clearComparison: () => void

  // Filter for locations and plan types
  locations: string[]
  setLocations: (locations: string[]) => void
  removeLocationFilter: (locationId: string) => void

  clearAllFilters: () => void
}

export const useFilterStore = create<FilterStore>()(devtools((set) => ({
  // Date Filters for current envelope
  selectedRangeType: 'last7days' as rangeType,
  currentEnvelope: { start: null, end: null },
  setCurrentEnvelope: (envelope) => set({ currentEnvelope: envelope }),
  setSelectedRangeType: (range) => set({ selectedRangeType: range }),

  // Date Filters for comparison envelope
  comparisonType: 'previous' as comparisonType,
  priorEnvelope: { start: moment().startOf('day').toISOString(), end: moment().endOf('day').toISOString() },
  setPriorEnvelope: (envelope) => set({ priorEnvelope: envelope }),
  setComparisonType: (type) => set({ comparisonType: type }),
  clearComparison: () => set({
    comparisonType: '' as comparisonType,
    priorEnvelope: { start: moment().startOf('day').toISOString(), end: moment().endOf('day').toISOString() },
  }),

  // Filter for locations and plan types
  locations: [],
  setLocations: (locations) => set({ locations }),

  removeLocationFilter: (locationId) => set((state) => ({
    locations: state.locations.filter(id => id !== locationId)
  })),

  clearAllFilters: () => set(() => {
    const today = moment.utc();
    const endOfDay = today.clone().subtract(1, 'day').endOf('day');
    const start = today.clone().subtract(7, 'days').startOf('day');
    const end = endOfDay;
    return {
      locations: [],
      selectedRangeType: 'last7days' as rangeType,
      comparisonType: 'previous' as comparisonType,
      currentEnvelope: {
        start: start.toISOString(),
        end: end.toISOString()
      },
      priorEnvelope: {
        start: start.clone().subtract(7, 'days').toISOString(),
        end: end.clone().subtract(7, 'days').toISOString()
      },
    };
  }),
}),
  {
    enabled: true,
    name: "filter-storage"
  }
))