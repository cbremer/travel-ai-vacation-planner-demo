import { Link } from 'react-router-dom'
import type { CSSProperties } from 'react'
import { internalToUrlDay } from '../lib/dayIndex'
import { getTrip } from '../lib/tripData'
import { getDayGuide, getDayGuideEntry } from '../lib/dayGuide'
import { getTripPhase } from '../lib/dates'
import { DayEmoji } from '../components/DayEmoji'
import { getDayTheme } from '../components/dayArt/themes'

export function HomePage() {
  const trip = getTrip()
  const guide = getDayGuide()
  const phase = getTripPhase()

  return (
    <section className="page home-page">
      <CountdownHero />

      <section className="home-section">
        <div className="home-section-head">
          <h2>Our {trip.days.length} days</h2>
          <span className="home-section-sub">Tap any day to see what we&apos;re up to</span>
        </div>
        <div className="day-cards">
          {trip.days.map((d) => {
            const g = getDayGuideEntry(d.index)!
            const theme = getDayTheme(d.index)
            const isToday = phase.phase === 'during' && phase.dayIndex === d.index
            return (
              <Link
                key={d.index}
                to={`/day/${internalToUrlDay(d.index)}`}
                className={`day-card ${isToday ? 'day-card--today' : ''}`}
                style={{ '--day-accent': theme.accent, '--day-soft': theme.soft } as CSSProperties}
              >
                <div className="day-card-emoji">
                  <DayEmoji index={d.index} size="lg" />
                </div>
                <div className="day-card-body">
                  <div className="day-card-meta">
                    <span className="day-card-num">Day {d.index + 1}</span>
                    <span className="day-card-date">{d.dow} {d.label}</span>
                    {isToday && <span className="today-pill">TODAY</span>}
                  </div>
                  <div className="day-card-title">{d.title}</div>
                  <div className="day-card-city">📍 {g.city}</div>
                </div>
                <span className="day-card-chev" aria-hidden>›</span>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="home-section home-quickstats">
        <div className="home-stat">
          <div className="home-stat-num">{guide.overview.cities.length}</div>
          <div className="home-stat-label">cities</div>
        </div>
        <div className="home-stat">
          <div className="home-stat-num">{trip.days.length}</div>
          <div className="home-stat-label">days</div>
        </div>
        <div className="home-stat">
          <div className="home-stat-num">AI</div>
          <div className="home-stat-label">assisted plan</div>
        </div>
      </section>

      <Link to="/info" className="home-info-cta">
        <span className="home-info-cta-emoji">📋</span>
        <div>
          <div className="home-info-cta-title">Trip info</div>
          <div className="home-info-cta-sub">Hotels, flights, places, and sample confirmations</div>
        </div>
        <span className="day-card-chev" aria-hidden>›</span>
      </Link>
    </section>
  )
}

function CountdownHero() {
  const phase = getTripPhase()
  const trip = getTrip()

  if (phase.phase === 'before') {
    return (
      <div className="countdown-hero countdown-hero--before">
        <div className="countdown-big">{phase.daysUntil}</div>
        <div className="countdown-label">sleeps until the demo trip ✈️</div>
        <div className="countdown-sub">Trip starts {trip.days[0].dow} {trip.days[0].label}</div>
      </div>
    )
  }

  if (phase.phase === 'today-eve') {
    return (
      <div className="countdown-hero countdown-hero--eve">
        <div className="countdown-big">🎒</div>
        <div className="countdown-label">Trip starts tomorrow!</div>
        <div className="countdown-sub">Pack everything tonight</div>
      </div>
    )
  }

  if (phase.phase === 'during') {
    const day = trip.days[phase.dayIndex]
    const guide = getDayGuideEntry(day.index)!
    return (
      <Link
        to={`/day/${internalToUrlDay(day.index)}`}
        className="countdown-hero countdown-hero--during"
      >
        <div className="countdown-during-emoji"><DayEmoji index={day.index} size="xl" /></div>
        <div className="countdown-during-body">
          <div className="countdown-during-pill">TODAY · Day {day.index + 1} of {trip.days.length}</div>
          <div className="countdown-during-title">{day.title}</div>
          <div className="countdown-during-sub">{guide.city}</div>
          <div className="countdown-during-cta">Open today&apos;s plan →</div>
        </div>
      </Link>
    )
  }

  return (
    <div className="countdown-hero countdown-hero--after">
      <div className="countdown-big">🎉</div>
      <div className="countdown-label">What a trip!</div>
      <div className="countdown-sub">Browse the memories below.</div>
    </div>
  )
}
