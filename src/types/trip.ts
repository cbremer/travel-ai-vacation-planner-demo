export type Tone = 'accent' | 'neutral' | 'muted'
export type TodoStatus = 'pending' | 'completed'
export type BookingStatus = 'booked' | 'estimated' | 'open'

export interface TripMeta {
  id: string
  title: string
  subtitle: string
  startDate: string
  endDate: string
  timezone: string
}

export interface GanttBar {
  start: number
  end: number
  label: string
  sub?: string
  tone: Tone
}

export interface GanttRow {
  category: string
  bars: GanttBar[]
}

export interface ChecklistItem {
  id: string
  content: string
  status: TodoStatus
}

export interface BudgetLine {
  label: string
  amount: number | null
  display: string
  tone?: 'success' | 'warning' | 'info'
}

export interface Budget {
  paid: BudgetLine[]
  estimated: BudgetLine[]
  totalPaid: number
  totalPaidDisplay: string
  notes: string[]
}

export interface Place {
  id: string
  label: string
  address: string
  mapUrl?: string
  phone?: string
  url?: string
}

export interface FlightLeg {
  flight: string
  from: string
  to: string
  departs: string
  arrives: string
}

export interface Flight {
  id: string
  label: string
  confirmation: string
  date: string
  passengers: string
  cost?: number
  costDisplay?: string
  legs: FlightLeg[]
  notes?: string
  links?: { label: string; url: string }[]
}

export type ReservationGroup = 'stays' | 'flights' | 'car' | 'activities'

export interface Booking {
  id: string
  item: string
  group?: ReservationGroup
  confirmation?: string
  cost?: number
  costDisplay?: string
  status: BookingStatus
  notes?: string
  phone?: string
  url?: string
  mapUrl?: string
  placeId?: string
  address?: string
}

export interface ArchSlot {
  time: string
  activity: string
}

export interface Jul2Arch {
  orderId: string
  cost: number
  costDisplay: string
  ticketUrl: string
  slots: ArchSlot[]
  logistics: string[]
  policies: string[]
}

export interface DayAction {
  kind?: 'call' | 'map' | 'web' | 'ticket'
  label: string
  detail?: string
  href?: string
  tel?: string
  note?: string
  copyValue?: string
  copyLabel?: string
}

export interface TripDay {
  index: number
  date: string
  isoDate: string
  label: string
  dow: string
  title: string
  lodging: string
  lodgingBookingId?: string
  lodgingPlaceId?: string
  summary: string
  items: string[]
  actions?: DayAction[]
}

export interface AirbnbCheckout {
  title: string
  items: string[]
}

export interface Trip {
  meta: TripMeta
  calendar: { days: string[]; dow: string[]; weekends: number[] }
  gantt: GanttRow[]
  checklist: ChecklistItem[]
  budget: Budget
  places: Place[]
  flights: Flight[]
  bookings: Booking[]
  days: TripDay[]
  jul2Arch: Jul2Arch
  airbnbCheckout: AirbnbCheckout
}
