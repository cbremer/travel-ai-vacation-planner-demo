import type { DayGuide, DayGuideEntry, TripPerson } from '../types/dayGuide'
import type { TripDay } from '../types/trip'
import { getTrip } from './tripData'

let _guide: DayGuide | null = null

export function setGuide(g: DayGuide): void {
  _guide = g
}

export function getDayGuide(): DayGuide {
  if (!_guide) throw new Error('Day guide data not loaded yet')
  return _guide
}

export function getDayGuideEntry(index: number): DayGuideEntry | undefined {
  return getDayGuide().days.find((d) => d.index === index)
}

export function getPerson(id: string): TripPerson | undefined {
  return getDayGuide().people.find((p) => p.id === id)
}

export function getPeopleForDay(entry: DayGuideEntry): TripPerson[] {
  return entry.peopleIds.map((id) => getPerson(id)).filter(Boolean) as TripPerson[]
}

export function getEnrichedDay(
  index: number,
): { day: TripDay; guide: DayGuideEntry } | undefined {
  const day = getTrip().days.find((d) => d.index === index)
  const guideEntry = getDayGuideEntry(index)
  if (!day || !guideEntry) return undefined
  return { day, guide: guideEntry }
}
