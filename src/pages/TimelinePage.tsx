import { getTrip } from '../lib/tripData'
import { TripGantt } from '../components/TripGantt'
import { Page } from '../components/ui'

export function TimelinePage() {
  const trip = getTrip()

  return (
    <Page
      title={trip.meta.title}
      subtitle={`${trip.meta.startDate} → ${trip.meta.endDate}`}
    >
      <TripGantt />
    </Page>
  )
}
