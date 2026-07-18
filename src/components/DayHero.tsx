import type { CSSProperties } from 'react'
import type { TripDay } from '../types/trip'
import { getDayGuideEntry } from '../lib/dayGuide'
import { getDayTheme } from './dayArt/themes'
import { DayEmoji } from './DayEmoji'

interface DayHeroProps {
  day: TripDay
  eyebrow?: string
}

export function DayHero({ day, eyebrow }: DayHeroProps) {
  const theme = getDayTheme(day.index)
  const guide = getDayGuideEntry(day.index)
  const style = {
    '--day-accent': theme.accent,
    '--day-soft': theme.soft,
    '--day-ink': theme.ink,
  } as CSSProperties

  return (
    <div className="day-hero" style={style}>
      <div className="day-hero-art">
        <DayEmoji index={day.index} size="xl" />
      </div>
      <div className="day-hero-body">
        {eyebrow && <div className="day-hero-eyebrow">{eyebrow}</div>}
        <div className="day-hero-meta">
          Day {day.index + 1} of 12 · {day.dow} {day.label}
        </div>
        <h1 className="day-hero-title">{day.title}</h1>
        {guide && <div className="day-hero-city">📍 {guide.city}</div>}
      </div>
    </div>
  )
}
