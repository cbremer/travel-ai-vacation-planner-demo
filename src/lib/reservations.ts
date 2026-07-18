import type { Booking, Place, TripDay } from '../types/trip'
import { getTrip } from './tripData'

export function formatPhone(digits: string): string {
  const d = digits.replace(/\D/g, '')
  if (d.length === 10) return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`
  if (d.length === 11 && d.startsWith('1')) {
    return `(${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7)}`
  }
  return digits
}

export function getPlace(id: string): Place | undefined {
  return getTrip().places.find((p) => p.id === id)
}

export function getBooking(id: string): Booking | undefined {
  return getTrip().bookings.find((b) => b.id === id)
}

export interface ResolvedReservation {
  booking?: Booking
  place?: Place
  address: string
  title: string
}

export function resolveBooking(id: string): ResolvedReservation | undefined {
  const booking = getBooking(id)
  if (!booking) return undefined

  const place = booking.placeId ? getPlace(booking.placeId) : undefined
  return {
    booking,
    place,
    address: booking.address ?? place?.address ?? '',
    title: place?.label ?? booking.item,
  }
}

export function getDayReservation(day: TripDay): ResolvedReservation | undefined {
  if (day.lodgingBookingId) {
    return resolveBooking(day.lodgingBookingId)
  }

  if (day.lodgingPlaceId) {
    const place = getPlace(day.lodgingPlaceId)
    if (!place) return undefined
    return {
      place,
      address: place.address,
      title: place.label,
    }
  }

  return undefined
}

export type ReservationGroup = 'stays' | 'flights' | 'car' | 'activities'

export function getBookingGroup(id: string): ReservationGroup {
  const booking = getBooking(id)
  if (booking?.group) return booking.group
  return 'activities'
}

export const GROUP_LABELS: Record<ReservationGroup, string> = {
  stays: 'Hotels & stays',
  flights: 'Flights',
  car: 'Rental car',
  activities: 'Tickets & activities',
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
