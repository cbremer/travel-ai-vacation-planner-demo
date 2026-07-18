import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getTrip } from '../lib/tripData'
import { getDayGuide } from '../lib/dayGuide'
import {
  GROUP_LABELS,
  copyText,
  formatPhone,
  getBookingGroup,
  resolveBooking,
  type ReservationGroup,
} from '../lib/reservations'
import { ActionButton } from '../components/ActionButton'
import { BookingCard, Card, PlaceLink } from '../components/ui'
import type { Flight } from '../types/trip'

const GROUP_ORDER: ReservationGroup[] = ['stays', 'car', 'flights', 'activities']

const SECTION_EMOJI: Record<ReservationGroup, string> = {
  stays: '🏨',
  car: '🚙',
  flights: '✈️',
  activities: '🎟️',
}

const AIRPORT_NAMES: Record<string, string> = {
  AGS: 'Augusta Regional Airport',
  ATL: 'Hartsfield-Jackson Atlanta International Airport',
  MEM: 'Memphis International Airport',
  SMF: 'Sacramento International Airport',
  STL: 'St. Louis Lambert International Airport',
}

const AIRLINE_NAMES: Record<string, string> = {
  DL: 'Delta Air Lines',
  WN: 'Southwest Airlines',
}

function formatFlightDate(date: string) {
  const parsed = new Date(`${date}T12:00:00`)
  return parsed.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatAirport(code: string) {
  return AIRPORT_NAMES[code] ? `${code} (${AIRPORT_NAMES[code]})` : code
}

function formatAirline(flightNumber: string) {
  const airlineCode = flightNumber.trim().match(/^[A-Z]+/)?.[0] ?? flightNumber.trim()
  return AIRLINE_NAMES[airlineCode] ?? airlineCode
}

function formatFlightAirlines(flight: Flight) {
  const airlines = [...new Set(flight.legs.map((leg) => formatAirline(leg.flight)))]
  return airlines.length > 0 ? airlines.join(' / ') : 'TBD'
}

function formatFlightRoute(flight: Flight) {
  const firstLeg = flight.legs[0]
  const lastLeg = flight.legs.at(-1)
  if (!firstLeg || !lastLeg) return 'TBD'
  return `${formatAirport(firstLeg.from)} to ${formatAirport(lastLeg.to)}`
}

function formatFlightCheckInInfo(flight: Flight) {
  const lines = [
    `${flight.label}`,
    `Airline: ${formatFlightAirlines(flight)}`,
    `Date: ${formatFlightDate(flight.date)}`,
    `Passengers: ${flight.passengers}`,
    `Confirmation: ${flight.confirmation}`,
    `Cost: ${flight.costDisplay ?? 'TBD'}`,
    `Route: ${formatFlightRoute(flight)}`,
    flight.legs.length > 0 ? 'Segments:' : 'Segments: TBD',
    ...flight.legs.map(
      (leg) =>
        `- ${formatAirline(leg.flight)} ${leg.flight}: ${formatAirport(leg.from)} ${leg.departs} to ${formatAirport(leg.to)} ${leg.arrives}`,
    ),
  ]

  if (flight.notes) lines.push(`Notes: ${flight.notes}`)
  return lines.filter(Boolean).join('\n')
}

function formatAllFlightCheckInInfo(flights: Flight[]) {
  return flights.map(formatFlightCheckInInfo).join('\n\n---\n\n')
}

export function TripInfoPage() {
  const trip = getTrip()
  const guide = getDayGuide()
  const [query, setQuery] = useState('')
  const [searchParams] = useSearchParams()
  const highlightId = searchParams.get('id')
  const [copied, setCopied] = useState<string | null>(null)
  const featuredPlace = trip.places.find((p) => p.id === 'celebration')

  useEffect(() => {
    if (!highlightId) return
    const el = document.getElementById(`reservation-${highlightId}`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [highlightId])

  const grouped = useMemo(() => {
    const q = query.toLowerCase().trim()
    const filtered = q
      ? trip.bookings.filter(
          (b) =>
            b.item.toLowerCase().includes(q) ||
            b.confirmation?.toLowerCase().includes(q) ||
            b.address?.toLowerCase().includes(q) ||
            b.notes?.toLowerCase().includes(q),
        )
      : trip.bookings

    const map = new Map<ReservationGroup, typeof filtered>()
    for (const group of GROUP_ORDER) map.set(group, [])
    for (const booking of filtered) {
      map.get(getBookingGroup(booking.id))!.push(booking)
    }
    return map
  }, [query, trip.bookings])

  const filteredFlights = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return trip.flights
    return trip.flights.filter(
      (f) =>
        f.label.toLowerCase().includes(q) ||
        f.confirmation.toLowerCase().includes(q) ||
        f.passengers.toLowerCase().includes(q),
    )
  }, [query, trip.flights])

  const filteredPlaces = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return trip.places
    return trip.places.filter(
      (p) =>
        p.label.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.phone?.includes(q),
    )
  }, [query, trip.places])

  const filteredPeople = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return guide.people
    return guide.people.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.role?.toLowerCase().includes(q) ||
        p.phone?.includes(q) ||
        p.email?.toLowerCase().includes(q) ||
        p.address?.toLowerCase().includes(q),
    )
  }, [query, guide.people])

  const handleCopy = async (value: string, key: string) => {
    const ok = await copyText(value)
    if (ok) {
      setCopied(key)
      window.setTimeout(() => setCopied(null), 2000)
    }
  }

  return (
    <section className="page page--info">
      <header className="info-intro">
        <h1>Trip info</h1>
        <p className="info-sub">Confirmations, addresses, phone numbers. Searchable.</p>
        <input
          type="search"
          className="search-input"
          placeholder="Search hotels, flights, names, conf #…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search trip info"
        />
      </header>

      {featuredPlace && (
        <section className="info-section">
          <h2 className="info-section-title">
            <span className="info-section-emoji" aria-hidden>🎉</span>
            Featured event
          </h2>
          <Card className="wedding-detail-card">
            <div className="wedding-detail-eyebrow">Synthetic family celebration</div>
            <div className="wedding-detail-title">{featuredPlace.label}</div>
            <dl className="wedding-detail-list">
              <div>
                <dt>Starts</dt>
                <dd>Monday, July 5 in the late morning</dd>
              </div>
              <div>
                <dt>Address</dt>
                <dd>{featuredPlace.address}</dd>
              </div>
              <div>
                <dt>Note</dt>
                <dd>This venue and event record are fictional.</dd>
              </div>
            </dl>
            <div className="action-btn-list action-btn-list--inline">
              {featuredPlace.mapUrl && (
                <ActionButton
                  kind="map"
                  label="Open Cottleville map"
                  detail={featuredPlace.address}
                  href={featuredPlace.mapUrl}
                />
              )}
              {featuredPlace.url && (
                <ActionButton
                  kind="web"
                  label="Event website"
                  detail="Synthetic example"
                  href={featuredPlace.url}
                />
              )}
            </div>
            <button
              type="button"
              className="copy-btn place-copy-btn"
              onClick={() => handleCopy(featuredPlace.address, 'featured-address')}
            >
              {copied === 'featured-address' ? 'Copied address' : 'Copy address'}
            </button>
          </Card>
        </section>
      )}

      {GROUP_ORDER.map((group) => {
        const items = grouped.get(group) ?? []
        if (!items.length) return null
        return (
          <section key={group} className="info-section">
            <h2 className="info-section-title">
              <span className="info-section-emoji" aria-hidden>{SECTION_EMOJI[group]}</span>
              {GROUP_LABELS[group]}
            </h2>
            <div className="info-section-list">
              {items.map((b) => (
                <div
                  key={b.id}
                  id={`reservation-${b.id}`}
                  className={highlightId === b.id ? 'info-card-highlight' : undefined}
                >
                  <BookingCard {...resolveBooking(b.id)!} />
                </div>
              ))}
            </div>
          </section>
        )
      })}

      {filteredFlights.length > 0 && (
        <section className="info-section">
          <div className="info-section-title-row">
            <h2 className="info-section-title">
              <span className="info-section-emoji" aria-hidden>🛫</span>
              Flight details
            </h2>
            <button
              type="button"
              className="copy-btn"
              onClick={() => handleCopy(formatAllFlightCheckInInfo(trip.flights), 'all-flights')}
            >
              {copied === 'all-flights' ? 'Copied all' : 'Copy all flight info'}
            </button>
          </div>
          <p className="info-section-hint">Flight numbers and segment times.</p>
          {filteredFlights.map((f) => (
            <Card key={f.id} className="flight-card">
              <div className="flight-card-header">
                <div>
                  <strong>{f.label}</strong>
                  <div className="flight-date">{formatFlightDate(f.date)}</div>
                </div>
                <div className="flight-card-copy">
                  <code className="reservation-conf">{f.confirmation}</code>
                  <button
                    type="button"
                    className="copy-btn"
                    onClick={() => handleCopy(formatFlightCheckInInfo(f), `flight-${f.id}`)}
                  >
                    {copied === `flight-${f.id}` ? 'Copied' : 'Copy check-in info'}
                  </button>
                </div>
              </div>
              <div className="flight-summary-grid">
                <div>
                  <span>Airline</span>
                  <strong>{formatFlightAirlines(f)}</strong>
                </div>
                <div>
                  <span>Passengers</span>
                  <strong>{f.passengers}</strong>
                </div>
                <div>
                  <span>Confirmation</span>
                  <strong>{f.confirmation}</strong>
                </div>
                <div>
                  <span>Cost</span>
                  <strong>{f.costDisplay ?? 'TBD'}</strong>
                </div>
              </div>
              <div className="flight-segments">
                {f.legs.length > 0 ? (
                  f.legs.map((leg, i) => (
                    <div key={i} className="flight-segment">
                      <div className="flight-segment-title">
                        {formatAirline(leg.flight)} <code>{leg.flight}</code>
                      </div>
                      <div className="flight-segment-route">
                        <span>{formatAirport(leg.from)}</span>
                        <span aria-hidden>→</span>
                        <span>{formatAirport(leg.to)}</span>
                      </div>
                      <div className="flight-segment-times">
                        <span>Departs {leg.departs}</span>
                        <span>Arrives {leg.arrives}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flight-segment">Segment details TBD</div>
                )}
              </div>
              {f.notes && <p className="booking-notes">{f.notes}</p>}
              {f.links && (
                <div className="action-btn-list action-btn-list--inline">
                  {f.links.map((link, i) => (
                    <ActionButton
                      key={i}
                      kind="web"
                      label={link.label}
                      detail="Opens in browser"
                      href={link.url}
                    />
                  ))}
                </div>
              )}
            </Card>
          ))}
        </section>
      )}

      {filteredPlaces.length > 0 && (
        <section className="info-section">
          <h2 className="info-section-title">
            <span className="info-section-emoji" aria-hidden>📍</span>
            Key places
          </h2>
          <p className="info-section-hint">Addresses, maps, and venue links.</p>
          <div className="info-section-list">
            {filteredPlaces.map((p) => (
              <Card key={p.id} className="place-card">
                <PlaceLink {...p} />
                <button
                  type="button"
                  className="copy-btn place-copy-btn"
                  onClick={() => handleCopy(p.address, `place-${p.id}`)}
                >
                  {copied === `place-${p.id}` ? 'Copied address' : 'Copy address'}
                </button>
              </Card>
            ))}
          </div>
        </section>
      )}

      {filteredPeople.length > 0 && (
        <section className="info-section">
          <h2 className="info-section-title">
            <span className="info-section-emoji" aria-hidden>👋</span>
            People on the trip
          </h2>
          <p className="info-section-hint">
            Tap a phone number to call. Tap an email to message.
          </p>
          <Card className="people-card">
            <ul className="people-list">
              {filteredPeople.map((p) => (
                <li key={p.id} className="people-row">
                  <div className="people-info">
                    <strong>{p.name}</strong>
                    {p.role && <span className="people-role">{p.role}</span>}
                  </div>
                  <div className="people-contact">
                    {p.phone ? (
                      <a href={`tel:${p.phone}`} className="people-link">
                        {formatPhone(p.phone)}
                      </a>
                    ) : (
                      <button
                        type="button"
                        className="people-missing-btn"
                        onClick={() => handleCopy(p.name, `name-${p.id}`)}
                      >
                        {copied === `name-${p.id}` ? 'Copied name' : 'Add phone'}
                      </button>
                    )}
                    {p.email && (
                      <a href={`mailto:${p.email}`} className="people-link">
                        {p.email}
                      </a>
                    )}
                    {p.address && (
                      <div className="people-address-row">
                        <span className="people-address">{p.address}</span>
                        <button
                          type="button"
                          className="copy-btn"
                          onClick={() => handleCopy(p.address!, `addr-${p.id}`)}
                        >
                          {copied === `addr-${p.id}` ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      )}
    </section>
  )
}
