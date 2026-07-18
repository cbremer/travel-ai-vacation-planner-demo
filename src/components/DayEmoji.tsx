import { getDayGuideEntry } from '../lib/dayGuide'

interface DayEmojiProps {
  index: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function DayEmoji({ index, size = 'md' }: DayEmojiProps) {
  const entry = getDayGuideEntry(index)
  if (!entry) return null
  return (
    <span className={`day-emoji day-emoji--${size}`} aria-hidden>
      {entry.emoji}
    </span>
  )
}
