import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { TripDay } from '../types/trip'
import { copyText, formatPhone, getDayReservation } from '../lib/reservations'
import { ActionButton } from './ActionButton'
import { Card } from './ui'

interface ReservationCardProps {
  day: TripDay
  heading?: string
}

export function ReservationCard({ day, heading = "Tonight's stay" }: ReservationCardProps) {
  const [copied, setCopied] = useState<string | null>(null)
  const reservation = getDayReservation(day)

  if (day.lodging === '—') {
    return (
      <Card className="reservation-card reservation-card--empty">
        <div className="reservation-card-heading">{heading}</div>
        <p className="reservation-card-empty">Travel day — no overnight stay booked.</p>
      </Card>
    )
  }

  if (!reservation) {
    return (
      <Card className="reservation-card">
        <div className="reservation-card-heading">{heading}</div>
        <h2 className="reservation-card-title">{day.lodging}</h2>
        <p className="reservation-card-note">Staying with family — no hotel confirmation.</p>
      </Card>
    )
  }

  const { booking, place, address, title } = reservation
  const conf = booking?.confirmation

  const handleCopy = async (value: string, key: string) => {
    const ok = await copyText(value)
    if (ok) {
      setCopied(key)
      window.setTimeout(() => setCopied(null), 2000)
    }
  }

  return (
    <Card className="reservation-card">
      <div className="reservation-card-heading">{heading}</div>
      <h2 className="reservation-card-title">{title}</h2>

      {conf && (
        <div className="reservation-field">
          <div className="reservation-field-label">Confirmation #</div>
          <div className="reservation-field-row">
            <code className="reservation-conf">{conf}</code>
            <button
              type="button"
              className="copy-btn"
              onClick={() => handleCopy(conf, 'conf')}
            >
              {copied === 'conf' ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      )}

      {address && (
        <div className="reservation-field">
          <div className="reservation-field-label">Address</div>
          <div className="reservation-field-row">
            <p className="reservation-address">{address}</p>
            <button
              type="button"
              className="copy-btn"
              onClick={() => handleCopy(address, 'addr')}
            >
              {copied === 'addr' ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      )}

      {(booking?.costDisplay || booking?.notes) && (
        <p className="reservation-card-note reservation-card-note--inline">
          {booking?.costDisplay && <span>Paid {booking.costDisplay}</span>}
          {booking?.costDisplay && booking?.notes && <span aria-hidden> · </span>}
          {booking?.notes && <span>{booking.notes}</span>}
        </p>
      )}

      <div className="action-btn-list action-btn-list--inline reservation-card-actions">
        {(place?.phone || booking?.phone) && (
          <ActionButton
            kind="call"
            label={`Call ${title.split('—')[0].trim()}`}
            detail={formatPhone(place?.phone ?? booking!.phone!)}
            href={`tel:${place?.phone ?? booking!.phone}`}
          />
        )}
        {(place?.mapUrl || booking?.mapUrl) && (
          <ActionButton
            kind="map"
            label="Get directions"
            href={place?.mapUrl ?? booking!.mapUrl!}
          />
        )}
        {(booking?.url || place?.url) && (
          <ActionButton
            kind="web"
            label="View reservation online"
            detail="Opens booking website"
            href={booking?.url ?? place!.url!}
          />
        )}
      </div>

      {booking && (
        <Link to={`/info?id=${booking.id}`} className="reservation-more-link">
          All reservation details →
        </Link>
      )}
    </Card>
  )
}
