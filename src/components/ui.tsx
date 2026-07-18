import { useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import type { ResolvedReservation } from '../lib/reservations'
import { copyText, formatPhone } from '../lib/reservations'
import { ActionButton } from './ActionButton'

export function Page({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <section className="page">
      <header className="page-header">
        <h1>{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </header>
      {children}
    </section>
  )
}

export function Card({
  children,
  className = '',
  style,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <div className={`card ${className}`.trim()} style={style}>
      {children}
    </div>
  )
}

export function StatGrid({ children }: { children: ReactNode }) {
  return <div className="stat-grid">{children}</div>
}

export function Stat({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone?: 'success' | 'warning' | 'info'
}) {
  return (
    <div className={`stat ${tone ? `stat--${tone}` : ''}`.trim()}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  )
}

export function PlaceLink({
  label,
  address,
  mapUrl,
  phone,
  url,
}: {
  label: string
  address: string
  mapUrl?: string
  phone?: string
  url?: string
}) {
  return (
    <div className="place-link">
      <div className="place-link-label">{label}</div>
      <div className="place-link-address">{address}</div>
      <div className="action-btn-list action-btn-list--inline">
        {mapUrl && <ActionButton kind="map" label="Get directions" href={mapUrl} />}
        {phone && (
          <ActionButton
            kind="call"
            label={`Call ${label}`}
            detail={formatPhone(phone)}
            href={`tel:${phone}`}
          />
        )}
        {url && (
          <ActionButton kind="web" label="Open website" detail={label} href={url} />
        )}
      </div>
    </div>
  )
}

export function BookingCard({ booking, place, address, title }: ResolvedReservation) {
  const [copied, setCopied] = useState<string | null>(null)
  if (!booking) return null

  const phone = booking.phone ?? place?.phone
  const mapUrl = booking.mapUrl ?? place?.mapUrl
  const webUrl = booking.url ?? place?.url
  const isArchTickets = booking.id === 'arch' && Boolean(booking.url)
  const displayAddress = address || place?.address || ''

  const handleCopy = async (value: string, key: string) => {
    const ok = await copyText(value)
    if (ok) {
      setCopied(key)
      window.setTimeout(() => setCopied(null), 2000)
    }
  }

  return (
    <Card className={`booking-card booking-card--${booking.status}`}>
      <div className="booking-card-header">
        <strong>{title}</strong>
        {booking.costDisplay && <span className="booking-cost">{booking.costDisplay}</span>}
      </div>

      {booking.confirmation && (
        <div className="reservation-field reservation-field--compact">
          <div className="reservation-field-label">Confirmation #</div>
          <div className="reservation-field-row">
            <code className="reservation-conf">{booking.confirmation}</code>
            <button type="button" className="copy-btn" onClick={() => handleCopy(booking.confirmation!, 'conf')}>
              {copied === 'conf' ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      )}

      {displayAddress && (
        <div className="reservation-field reservation-field--compact">
          <div className="reservation-field-label">Address</div>
          <p className="reservation-address">{displayAddress}</p>
        </div>
      )}

      {booking.notes && <p className="booking-notes">{booking.notes}</p>}

      <div className="action-btn-list action-btn-list--inline">
        {phone && (
          <ActionButton
            kind="call"
            label="Call"
            detail={formatPhone(phone)}
            href={`tel:${phone}`}
          />
        )}
        {mapUrl && <ActionButton kind="map" label="Directions" href={mapUrl} />}
        {webUrl && (
          <ActionButton
            kind={isArchTickets ? 'ticket' : 'web'}
            label={isArchTickets ? 'Open Gateway Arch tickets' : 'View online'}
            detail={isArchTickets ? 'Mobile e-tickets' : 'Booking website'}
            href={webUrl}
          />
        )}
      </div>
    </Card>
  )
}

export function FlightLegTable({
  legs,
}: {
  legs: { flight: string; from: string; to: string; departs: string; arrives: string }[]
}) {
  return (
    <table className="flight-table">
      <thead>
        <tr>
          <th>Flight</th>
          <th>Route</th>
          <th>Departs</th>
          <th>Arrives</th>
        </tr>
      </thead>
      <tbody>
        {legs.map((leg, i) => (
          <tr key={i}>
            <td>{leg.flight}</td>
            <td>
              {leg.from} → {leg.to}
            </td>
            <td>{leg.departs}</td>
            <td>{leg.arrives}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
