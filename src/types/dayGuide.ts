export interface Adventure {
  emoji?: string
  time?: string
  name: string
  note?: string
}

export interface DayTravel {
  label: string
  duration: string
  note?: string
}

export interface TripPerson {
  id: string
  name: string
  role?: string
  phone?: string | null
  email?: string | null
  address?: string | null
}

export interface DayGuideEntry {
  index: number
  city: string
  emoji: string
  mission: string
  funFact: string
  highlight: string
  adventures: Adventure[]
  headsUp: string[]
  peopleIds: string[]
  travel: DayTravel | null
}

export interface TripOverview {
  tagline: string
  subtitle?: string
  route: string
  cities: string[]
}

export interface DayGuide {
  overview: TripOverview
  people: TripPerson[]
  days: DayGuideEntry[]
}
