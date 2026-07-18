import type { Trip } from '../types/trip'

let _trip: Trip | null = null

export function setTrip(t: Trip): void {
  _trip = t
}

export function getTrip(): Trip {
  if (!_trip) throw new Error('Trip data not loaded yet')
  return _trip
}

export function getFeaturedTicketUrl(): string | undefined {
  return getTrip().jul2Arch.ticketUrl
}
