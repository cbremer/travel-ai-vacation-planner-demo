import { Link, useParams } from 'react-router-dom'
import type { CSSProperties } from 'react'
import { internalToUrlDay, parseUrlDayParam } from '../lib/dayIndex'
import { getTrip } from '../lib/tripData'
import { DayEmoji } from './DayEmoji'
import { getDayTheme } from './dayArt/themes'

export function DayPicker() {
  const { index } = useParams()
  const activeIndex = parseUrlDayParam(index)
  const trip = getTrip()

  return (
    <div className="day-strip" role="tablist" aria-label="Trip days">
      {trip.days.map((d) => {
        const theme = getDayTheme(d.index)
        const isActive = activeIndex !== null && d.index === activeIndex
        return (
          <Link
            key={d.index}
            to={`/day/${internalToUrlDay(d.index)}`}
            role="tab"
            aria-selected={isActive}
            className={`day-chip ${isActive ? 'day-chip--active' : ''}`}
            style={
              isActive
                ? ({ '--day-accent': theme.accent, '--day-soft': theme.soft } as CSSProperties)
                : undefined
            }
          >
            <DayEmoji index={d.index} size="sm" />
            <span className="day-chip-num">{d.label.replace('Jul ', '')}</span>
          </Link>
        )
      })}
    </div>
  )
}
