import { getTrip } from '../lib/tripData'
import { isWeekend } from '../lib/dates'
import { Stat, StatGrid } from './ui'

const ROW_H = 50
const BAR_H = 34
const BAR_PAD = (ROW_H - BAR_H) / 2
const LABEL_W = 96
const DAY_COL_W = 56

function stripMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*/g, '')
    .replace(/`/g, '')
    .trim()
}

function formatBarRange(start: number, end: number, days: string[], dow: string[]): string {
  if (start === end) return `${dow[start]} ${days[start]}`
  return `${days[start]} – ${days[end]}`
}

function GanttList() {
  const trip = getTrip()
  const { days, dow } = trip.calendar

  return (
    <div className="timeline-list">
      {trip.gantt.map((row) => (
        <section key={row.category} className="timeline-list-group">
          <h3 className="timeline-list-category">{row.category}</h3>
          <ul className="timeline-list-items">
            {row.bars.map((bar, bi) => (
              <li
                key={bi}
                className={`timeline-list-item timeline-list-item--${bar.tone}`}
              >
                <div className="timeline-list-range">
                  {formatBarRange(bar.start, bar.end, days, dow)}
                </div>
                <div className="timeline-list-body">
                  <div className="timeline-list-label">{bar.label}</div>
                  {bar.sub && <div className="timeline-list-sub">{bar.sub}</div>}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

function GanttChart() {
  const trip = getTrip()
  const { days, dow } = trip.calendar
  const N = days.length

  return (
    <div className="timeline-scroll">
      <p className="timeline-scroll-hint">Swipe for full chart →</p>
      <div className="timeline" style={{ minWidth: Math.max(720, LABEL_W + N * DAY_COL_W) }}>
        <div className="timeline-header" style={{ gridTemplateColumns: `${LABEL_W}px repeat(${N}, 1fr)` }}>
          <div />
          {days.map((d, i) => (
            <div key={i} className={`timeline-day ${isWeekend(i) ? 'timeline-day--weekend' : ''}`}>
              <div className="timeline-dow">{dow[i]}</div>
              <div className="timeline-date">{d}</div>
            </div>
          ))}
        </div>

        {trip.gantt.map((row, ri) => (
          <div key={ri} className="timeline-row" style={{ gridTemplateColumns: `${LABEL_W}px repeat(${N}, 1fr)` }}>
            <div className="timeline-category">{row.category}</div>
            <div className="timeline-bars" style={{ gridColumn: `2 / ${N + 2}` }}>
              {Array.from({ length: N }, (_, i) => (
                <div
                  key={i}
                  className={`timeline-cell ${isWeekend(i) ? 'timeline-cell--weekend' : ''}`}
                  style={{ left: `${(i / N) * 100}%`, width: `${(1 / N) * 100}%` }}
                />
              ))}
              {row.bars.map((bar, bi) => {
                const left = (bar.start / N) * 100
                const width = ((bar.end - bar.start + 1) / N) * 100
                return (
                  <div
                    key={bi}
                    className={`timeline-bar timeline-bar--${bar.tone}`}
                    style={{
                      top: BAR_PAD,
                      left: `calc(${left}% + 2px)`,
                      width: `calc(${width}% - 4px)`,
                      height: BAR_H,
                    }}
                  >
                    <div className="timeline-bar-label">{bar.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function BudgetLegend() {
  return (
    <ul className="budget-legend" aria-label="Budget color key">
      <li className="budget-legend-item budget-legend-item--success">
        <span className="budget-legend-swatch" aria-hidden />
        Booked / paid
      </li>
      <li className="budget-legend-item budget-legend-item--warning">
        <span className="budget-legend-swatch" aria-hidden />
        Estimate or TBD
      </li>
      <li className="budget-legend-item budget-legend-item--info">
        <span className="budget-legend-swatch" aria-hidden />
        All-in total
      </li>
    </ul>
  )
}

export function TripGantt() {
  const trip = getTrip()
  const { budget, checklist } = trip
  const paidNote = budget.notes.slice(0, 2).filter(Boolean).join(' ')
  const estimatedNote = budget.notes[2] ?? budget.notes.slice(2).join(' ')

  return (
    <div className="trip-gantt">
      <GanttList />
      <details className="timeline-chart-toggle">
        <summary>Chart view</summary>
        <GanttChart />
      </details>

      <section className="trip-gantt-section">
        <h2 className="section-title">Budget (booked)</h2>
        <BudgetLegend />
        <StatGrid>
          {budget.paid.map((line) => (
            <Stat key={line.label} label={line.label} value={line.display} tone={line.tone ?? 'success'} />
          ))}
        </StatGrid>
        {paidNote && <p className="section-hint">{paidNote}</p>}
      </section>

      <section className="trip-gantt-section">
        <h2 className="section-title">Estimated (not booked)</h2>
        <StatGrid>
          {budget.estimated.map((line) => (
            <Stat key={line.label} label={line.label} value={line.display} tone={line.tone} />
          ))}
        </StatGrid>
        {estimatedNote && <p className="section-hint">{estimatedNote}</p>}
      </section>

      <section className="trip-gantt-section">
        <h2 className="section-title">Booking checklist</h2>
        <ul className="trip-checklist">
          {checklist.map((item) => (
            <li
              key={item.id}
              className={`trip-checklist-item trip-checklist-item--${item.status}`}
            >
              <span className="trip-checklist-mark" aria-hidden />
              <span>{stripMarkdown(item.content)}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
