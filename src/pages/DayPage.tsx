import { useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import type { CSSProperties } from 'react'
import { getEnrichedDay, getPeopleForDay } from '../lib/dayGuide'
import { getFeaturedTicketUrl, getTrip } from '../lib/tripData'
import { copyText, formatPhone } from '../lib/reservations'
import { internalToUrlDay, parseUrlDayParam } from '../lib/dayIndex'
import { getDayTheme } from '../components/dayArt/themes'
import { DayEmoji } from '../components/DayEmoji'
import { DayHero } from '../components/DayHero'
import { DayPicker } from '../components/DayPicker'
import { ReservationCard } from '../components/ReservationCard'
import { ActionButton } from '../components/ActionButton'
import type { DayAction } from '../types/trip'
import type { TripPerson } from '../types/dayGuide'

export function DayPage() {
  const { index } = useParams()
  if (index === '0') {
    return <Navigate to="/day/1" replace />
  }
  const dayIndex = parseUrlDayParam(index)
  const enriched = dayIndex !== null ? getEnrichedDay(dayIndex) : undefined

  if (!enriched) {
    return (
      <section className="page">
        <h1>Day not found</h1>
        <Link to="/" className="link">← Home</Link>
      </section>
    )
  }

  const { day, guide } = enriched
  const theme = getDayTheme(day.index)
  const people = getPeopleForDay(guide)
  const featuredTicketUrl = getFeaturedTicketUrl()
  const isFeaturedDay = day.index === 1 && Boolean(featuredTicketUrl)

  return (
    <section
      className="page page--day"
      style={
        {
          '--day-accent': theme.accent,
          '--day-soft': theme.soft,
          '--day-ink': theme.ink,
        } as CSSProperties
      }
    >
      <DayPicker />
      <DayHero day={day} />

      <MissionCard mission={guide.mission} />

      <Adventures items={guide.adventures} />

      <FunFact text={guide.funFact} />

      <ReservationCard day={day} heading="Where you're sleeping" />

      {isFeaturedDay && (
        <section className="card day-tickets">
          <h2 className="section-title">Featured activity tickets</h2>
          <p className="section-hint">Synthetic demo link for the sample itinerary.</p>
          <ActionButton
            kind="ticket"
            label="Open sample tickets"
            detail="Example only"
            href={featuredTicketUrl!}
          />
        </section>
      )}

      {day.actions && day.actions.length > 0 && <DayActions actions={day.actions} />}

      {guide.travel && <TravelToday {...guide.travel} />}

      {guide.headsUp.length > 0 && <HeadsUp items={guide.headsUp} />}

      {people.length > 0 && <PeopleHere people={people} />}

      <DayNav dayIndex={day.index} />
    </section>
  )
}

function MissionCard({ mission }: { mission: string }) {
  if (!mission) return null
  return (
    <div className="mission-card">
      <div className="mission-badge">
        <span aria-hidden>🎯</span>
        <span>Today&apos;s mission</span>
      </div>
      <p className="mission-text">{mission}</p>
    </div>
  )
}

function Adventures({ items }: { items: { emoji?: string; time?: string; name: string; note?: string }[] }) {
  if (!items.length) return null
  return (
    <section>
      <h2 className="section-title">Today&apos;s adventures</h2>
      <ol className="adventures-list">
        {items.map((a, i) => (
          <li key={i} className="adventure-row">
            <span className="adventure-emoji" aria-hidden>{a.emoji ?? '✨'}</span>
            <div className="adventure-body">
              <div className="adventure-name">{a.name}</div>
              {(a.time || a.note) && (
                <div className="adventure-meta">
                  {a.time && <span className="adventure-time">{a.time}</span>}
                  {a.time && a.note && <span aria-hidden> · </span>}
                  {a.note && <span className="adventure-note">{a.note}</span>}
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

function FunFact({ text }: { text: string }) {
  if (!text) return null
  return (
    <div className="fun-fact">
      <div className="fun-fact-badge">
        <span aria-hidden>💡</span>
        <span>Did you know?</span>
      </div>
      <p className="fun-fact-text">{text}</p>
    </div>
  )
}

function TravelToday({ label, duration, note }: { label: string; duration: string; note?: string }) {
  return (
    <div className="travel-card">
      <div className="travel-card-emoji" aria-hidden>🚗</div>
      <div className="travel-card-body">
        <div className="travel-card-label">Driving today</div>
        <div className="travel-card-route">{label}</div>
        <div className="travel-card-meta">
          <span>{duration}</span>
          {note && <span> · {note}</span>}
        </div>
      </div>
    </div>
  )
}

function HeadsUp({ items }: { items: string[] }) {
  return (
    <section className="card heads-up">
      <h2 className="section-title">
        <span aria-hidden>📌</span> Heads up
      </h2>
      <ul className="heads-up-list">
        {items.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </section>
  )
}

function DayActions({ actions }: { actions: DayAction[] }) {
  const [copied, setCopied] = useState<string | null>(null)

  const handleCopy = async (value: string, key: string) => {
    const ok = await copyText(value)
    if (ok) {
      setCopied(key)
      window.setTimeout(() => setCopied(null), 2000)
    }
  }

  const visibleActions = actions.filter((action) => action.href || action.tel || action.copyValue)
  if (!visibleActions.length) return null

  return (
    <section className="card day-actions">
      <h2 className="section-title">Quick actions</h2>
      <div className="action-btn-list">
        {visibleActions.map((action, index) => {
          const kind = action.kind ?? (action.tel ? 'call' : 'web')
          const href = action.tel ? `tel:${action.tel}` : action.href
          const copyKey = `action-${index}`

          if (!href && action.copyValue) {
            return (
              <div key={`${action.label}-${index}`} className="day-action-row">
                <button
                  type="button"
                  className="copy-btn day-action-copy day-action-copy--full"
                  onClick={() => handleCopy(action.copyValue!, copyKey)}
                >
                  {copied === copyKey ? 'Copied' : action.copyLabel ?? action.label}
                </button>
              </div>
            )
          }

          return (
            <div key={`${action.label}-${index}`} className="day-action-row">
              <ActionButton
                kind={kind}
                label={action.label}
                detail={action.detail}
                href={href!}
              />
              {action.copyValue && (
                <button
                  type="button"
                  className="copy-btn day-action-copy"
                  onClick={() => handleCopy(action.copyValue!, copyKey)}
                >
                  {copied === copyKey ? 'Copied' : action.copyLabel ?? 'Copy'}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

function PeopleHere({ people }: { people: TripPerson[] }) {
  const [copied, setCopied] = useState<string | null>(null)

  const handleCopy = async (value: string, key: string) => {
    const ok = await copyText(value)
    if (ok) {
      setCopied(key)
      window.setTimeout(() => setCopied(null), 2000)
    }
  }

  return (
    <section className="card people-card">
      <h2 className="section-title">People to find</h2>
      <ul className="people-list">
        {people.map((p) => (
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
                <span className="people-missing">Add phone</span>
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
    </section>
  )
}

function DayNav({ dayIndex }: { dayIndex: number }) {
  const trip = getTrip()
  const dayNum = internalToUrlDay(dayIndex)
  const prev = dayNum > 1 ? dayNum - 1 : null
  const next = dayNum < trip.days.length ? dayNum + 1 : null
  return (
    <nav className="day-nav-row" aria-label="Day navigation">
      {prev !== null ? (
        <Link to={`/day/${prev}`} className="day-nav-btn">
          <span className="day-nav-arrow">←</span>
          <span className="day-nav-stack">
            <span className="day-nav-eyebrow">Previous</span>
            <span className="day-nav-day">
              <DayEmoji index={dayIndex - 1} size="sm" /> Day {prev}
            </span>
          </span>
        </Link>
      ) : (
        <span className="day-nav-btn day-nav-btn--ghost" aria-hidden></span>
      )}
      <Link to="/" className="day-nav-home" aria-label="Home">🏠</Link>
      {next !== null ? (
        <Link to={`/day/${next}`} className="day-nav-btn day-nav-btn--right">
          <span className="day-nav-stack">
            <span className="day-nav-eyebrow">Next</span>
            <span className="day-nav-day">
              Day {next} <DayEmoji index={dayIndex + 1} size="sm" />
            </span>
          </span>
          <span className="day-nav-arrow">→</span>
        </Link>
      ) : (
        <span className="day-nav-btn day-nav-btn--ghost" aria-hidden></span>
      )}
    </nav>
  )
}
